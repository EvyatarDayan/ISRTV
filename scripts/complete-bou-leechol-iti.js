#!/usr/bin/env node
/** Retry missing s1 streams + discover s7/s10 via Google/Bing-less crawl from known seeds */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const SLUG = 'bou-leechol-iti';
const JSON_PATH = path.join(__dirname, `kanbox-${SLUG}.json`);
const CHANNELS = path.join(ROOT, 'js', 'channels.js');
const IMG_DIR = path.join(ROOT, 'images', 'kanbox', SLUG);
const TITLE = 'בואו לאכול איתי';

function streamFromEntry(entryId) {
  return (
    'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/' +
    entryId +
    '/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4'
  );
}

function extractEntryId(html) {
  if (!html) return '';
  const fromPath = html.match(/\/vod\/(1_[a-z0-9]+)\//i);
  if (fromPath) return fromPath[1];
  const fromLib = html.match(/(1_[a-z0-9]+)\/LIBCODER_SMOOTH/i);
  if (fromLib) return fromLib[1];
  return '';
}

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    const file = fs.createWriteStream(dest);
    https
      .get(
        url,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0',
            Referer: 'https://www.kan.org.il/'
          }
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            file.close();
            fs.unlink(dest, () => {});
            return downloadFile(res.headers.location, dest).then(resolve);
          }
          if (res.statusCode !== 200) {
            file.close();
            fs.unlink(dest, () => {});
            return resolve(false);
          }
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(true);
          });
        }
      )
      .on('error', () => {
        try {
          file.close();
          fs.unlink(dest, () => {});
        } catch (e) {}
        resolve(false);
      });
  });
}

async function fetchStream(context, ep) {
  const page = await context.newPage();
  const net = [];
  page.on('request', (r) => {
    const u = r.url();
    if (/\/vod\/1_[a-z0-9]+\//i.test(u) || /Manifest\.ism/i.test(u)) net.push(u);
  });
  try {
    await page.goto(ep.page, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(2000);
    let html = await page.content();
    if (/been blocked/i.test(html)) {
      console.log('  blocked', ep.page);
      await page.waitForTimeout(5000);
      html = await page.content();
    }
    let entry = extractEntryId(html);
    if (!entry) {
      for (const sel of ['button[aria-label="ניגון"]', 'button[aria-label*="Play"]', 'video']) {
        const el = await page.$(sel);
        if (!el) continue;
        try {
          await el.click({ timeout: 2000 });
          break;
        } catch (e) {}
      }
      await page.waitForTimeout(6000);
      html = await page.content();
      entry = extractEntryId(html);
      for (const u of net) {
        const m = u.match(/\/vod\/(1_[a-z0-9]+)\//i);
        if (m) {
          entry = m[1];
          break;
        }
      }
    }
    if (entry) {
      ep.streamURL = streamFromEntry(entry);
      ep.entryId = entry;
      return true;
    }
    // rights expired?
    if (/כבר לא זמין|לא זמין לצפייה/i.test(html)) {
      ep.unavailable = true;
      console.log('  unavailable', 's' + ep.season + 'e' + ep.ep);
    }
    return false;
  } finally {
    await page.close();
  }
}

async function discoverSeasonFromSeeds(context, season, seedUrls) {
  const found = new Map();
  const queue = seedUrls.slice();
  const visited = new Set();

  while (queue.length) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForTimeout(2000);
      const html = await page.content();
      if (/been blocked/i.test(html)) {
        console.log('blocked on', url);
        await page.close();
        continue;
      }
      const info = await page.evaluate((season) => {
        const title = document.title || '';
        const h1 = (document.querySelector('h1') || {}).textContent || '';
        const og =
          (document.querySelector('meta[property="og:image"]') || {}).content || '';
        let ep = null;
        const m = (title + ' ' + h1).match(/פרק\s*(\d+)/);
        if (m) ep = Number(m[1]);
        const links = Array.from(document.querySelectorAll('a[href*="p-11843"]'))
          .map((a) => a.href.split('?')[0])
          .filter((h) => h.includes('/s' + season + '/'));
        const imgs = Array.from(document.querySelectorAll('img'))
          .map((i) => i.currentSrc || i.src)
          .filter(Boolean);
        return { ep, og, links, title, unavailable: /כבר לא זמין|לא זמין לצפייה/.test(document.body.innerText) };
      }, season);

      if (info.ep) {
        found.set(info.ep, {
          season,
          ep: info.ep,
          page: url,
          imageURL: info.og || '',
          name: `עונה ${season} פרק ${info.ep}`,
          streamURL: '',
          unavailable: info.unavailable
        });
        console.log(`  s${season}e${info.ep} ${info.unavailable ? '(unavailable)' : ''}`);
      }
      for (const l of info.links) {
        if (!visited.has(l) && /\/s\d+\/\d+\/?$/.test(l)) queue.push(l);
      }
    } catch (e) {
      console.warn(e.message);
    } finally {
      await page.close();
    }
    if (found.size >= 40) break;
  }
  return Array.from(found.values()).sort((a, b) => a.ep - b.ep);
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function mergeIntoChannels(data) {
  const src = fs.readFileSync(CHANNELS, 'utf8');
  const poster = data.localPoster || `images/kanbox/${SLUG}/series.jpg`;
  const lines = [];
  lines.push('    {');
  lines.push(`        id: '${SLUG}',`);
  lines.push(`        name: '${esc(TITLE)}',`);
  lines.push(`        placeholder: '${esc(TITLE)}',`);
  lines.push(`        imageURL: '${poster}',`);
  lines.push(`        source: 'kan',`);
  lines.push('        episodes: [');
  const eps = data.episodes.slice().sort((a, b) => a.season - b.season || a.ep - b.ep);
  eps.forEach((ep, i) => {
    const id = `${SLUG}-s${ep.season}-ep${ep.ep}`;
    const img = ep.localImage || `images/kanbox/${SLUG}/s${ep.season}-ep${ep.ep}.jpg`;
    lines.push('            {');
    lines.push(`                id: '${id}',`);
    lines.push(`                season: ${ep.season},`);
    lines.push(`                ep: ${ep.ep},`);
    lines.push(`                name: 'עונה ${ep.season} פרק ${ep.ep}',`);
    lines.push(`                streamURL: '${ep.streamURL || ''}',`);
    lines.push(`                imageURL: '${img}',`);
    lines.push(`                placeholder: '${ep.ep}'`);
    lines.push(i < eps.length - 1 ? '            },' : '            }');
  });
  lines.push('        ]');
  lines.push('    }');
  const block = lines.join('\n');
  const re = new RegExp(`\\n    \\{\\n        id: '${SLUG}',[\\s\\S]*?\\n    \\}`, 'm');
  const next = re.test(src)
    ? src.replace(re, '\n' + block)
    : (() => {
        throw new Error('series block missing');
      })();
  fs.writeFileSync(CHANNELS, next);
  console.log('Merged', eps.length);
}

async function main() {
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    locale: 'he-IL',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });

  // Retry missing streams
  const missing = data.episodes.filter((e) => !e.streamURL);
  console.log('Retry streams', missing.length);
  for (const ep of missing) {
    const ok = await fetchStream(context, ep);
    console.log(`  s${ep.season}e${ep.ep}`, ok ? ep.entryId : 'FAIL');
    await new Promise((r) => setTimeout(r, 800));
  }

  // Season 7 seeds from search results
  const s7seeds = [
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s7/439453/',
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s7/475677/',
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s7/469803/',
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s7/475809/',
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s7/482175/'
  ];
  console.log('Discovering season 7…');
  const s7 = await discoverSeasonFromSeeds(context, 7, s7seeds);
  console.log('S7 found', s7.length);

  // Season 10 — Passover special (5 parts). Known IDs + discover.
  const s10seeds = [
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s10/1020198/',
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s10/1021488/',
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s10/1021533/',
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s10/'
  ];

  // Probe nearby IDs for חלק ג/ה
  for (let id = 1021489; id <= 1021560; id++) {
    s10seeds.push(`https://www.kan.org.il/content/kan/kan-11/p-11843/s10/${id}/`);
  }

  console.log('Discovering season 10…');
  // First open season index and collect cards
  {
    const page = await context.newPage();
    try {
      await page.goto('https://www.kan.org.il/content/kan/kan-11/p-11843/s10/', {
        waitUntil: 'domcontentloaded',
        timeout: 90000
      });
      await page.waitForTimeout(3000);
      const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a[href*="/p-11843/s10/"]'))
          .map((a) => a.href.split('?')[0])
          .filter((h) => /\/s10\/\d+\//.test(h))
      );
      console.log('s10 index links', [...new Set(links)]);
      links.forEach((l) => s10seeds.push(l));
    } catch (e) {
      console.warn(e.message);
    } finally {
      await page.close();
    }
  }

  // Patch discover to accept חלק labels as episode numbers
  async function discoverSeason10(context, seeds) {
    const found = new Map();
    const queue = [...new Set(seeds)].filter((u) => /\/s10\/\d+/.test(u));
    const visited = new Set();
    while (queue.length) {
      const url = queue.shift();
      if (visited.has(url)) continue;
      visited.add(url);
      const page = await context.newPage();
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
        await page.waitForTimeout(2000);
        const info = await page.evaluate(() => {
          const title = document.title || '';
          const h1 = (document.querySelector('h1') || {}).textContent || '';
          const text = title + ' ' + h1;
          let ep = null;
          const mEp = text.match(/פרק\s*(\d+)/);
          const mPart = text.match(/חלק\s*([אבגדהוזחטי]|[1-5])/);
          const heb = { א: 1, ב: 2, ג: 3, ד: 4, ה: 5, ו: 6 };
          if (mEp) ep = Number(mEp[1]);
          else if (mPart) ep = heb[mPart[1]] || Number(mPart[1]) || null;
          const og =
            (document.querySelector('meta[property="og:image"]') || {}).content || '';
          const links = Array.from(document.querySelectorAll('a[href*="p-11843/s10/"]'))
            .map((a) => a.href.split('?')[0])
            .filter((h) => /\/s10\/\d+\//.test(h));
          return {
            ep,
            og,
            links,
            unavailable: /כבר לא זמין|לא זמין לצפייה/.test(document.body.innerText || '')
          };
        });
        if (info.ep) {
          found.set(info.ep, {
            season: 10,
            ep: info.ep,
            page: url,
            imageURL: info.og || '',
            name: `עונה 10 פרק ${info.ep}`,
            streamURL: '',
            unavailable: info.unavailable
          });
          console.log(`  s10e${info.ep}`);
        }
        info.links.forEach((l) => {
          if (!visited.has(l)) queue.push(l);
        });
      } catch (e) {
        console.warn(e.message);
      } finally {
        await page.close();
      }
    }
    return Array.from(found.values()).sort((a, b) => a.ep - b.ep);
  }

  const s10 = await discoverSeason10(context, s10seeds);
  console.log('S10 found', s10.length);

  const existing = new Set(data.episodes.map((e) => `${e.season}-${e.ep}`));
  for (const ep of [...s7, ...s10]) {
    const key = `${ep.season}-${ep.ep}`;
    if (existing.has(key)) continue;
    existing.add(key);
    data.episodes.push(ep);
  }

  // Streams + images for new eps
  for (const ep of data.episodes) {
    if (ep.streamURL || ep.unavailable) continue;
    if (ep.season !== 7 && ep.season !== 10 && ep.streamURL) continue;
    if (![7, 10].includes(ep.season) && ep.streamURL) continue;
  }
  for (const ep of data.episodes.filter((e) => [7, 10].includes(e.season) && !e.streamURL && !e.unavailable)) {
    await fetchStream(context, ep);
    console.log(`stream s${ep.season}e${ep.ep}`, ep.streamURL ? 'OK' : 'FAIL', ep.unavailable ? 'unavail' : '');
    await new Promise((r) => setTimeout(r, 600));
  }

  fs.mkdirSync(IMG_DIR, { recursive: true });
  for (const ep of data.episodes) {
    const localRel = `images/kanbox/${SLUG}/s${ep.season}-ep${ep.ep}.jpg`;
    const dest = path.join(ROOT, localRel);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      ep.localImage = localRel;
      continue;
    }
    if (ep.imageURL && (await downloadFile(ep.imageURL, dest))) ep.localImage = localRel;
  }
  if (!data.localPoster) {
    const hub = path.join(ROOT, 'images', 'vod', 'hub.jpg');
    const seriesJpg = path.join(IMG_DIR, 'series.jpg');
    if (fs.existsSync(hub)) {
      fs.copyFileSync(hub, seriesJpg);
      data.localPoster = `images/kanbox/${SLUG}/series.jpg`;
    }
  }

  // Keep unavailable episodes that have no stream? Prefer drop fully unavailable with no stream
  // User asked for all seasons — keep entries even if stream empty so UI shows them
  data.episodes.sort((a, b) => a.season - b.season || a.ep - b.ep);
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
  mergeIntoChannels(data);

  await browser.close();

  const by = {};
  data.episodes.forEach((e) => {
    by[e.season] = by[e.season] || { n: 0, ok: 0 };
    by[e.season].n++;
    if (e.streamURL) by[e.season].ok++;
  });
  console.log(by);
  console.log(
    'total',
    data.episodes.length,
    'streams',
    data.episodes.filter((e) => e.streamURL).length
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
