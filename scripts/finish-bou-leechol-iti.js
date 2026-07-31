#!/usr/bin/env node
/** Finish בואו לאכול איתי: retry missing streams, add S7+S10 */
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
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.kan.org.il/' } }, (res) => {
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
      })
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
    if (/\/vod\/1_[a-z0-9]+\//i.test(u)) net.push(u);
  });
  try {
    await page.goto(ep.page, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(2000);
    let html = await page.content();
    if (/been blocked/i.test(html)) return false;
    if (/כבר לא זמין|לא זמין לצפייה/i.test(html)) {
      ep.unavailable = true;
      const og = await page.evaluate(
        () => (document.querySelector('meta[property="og:image"]') || {}).content || ''
      );
      if (og) ep.imageURL = og;
      return false;
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
      await page.waitForTimeout(5000);
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
    const og = await page.evaluate(
      () => (document.querySelector('meta[property="og:image"]') || {}).content || ''
    );
    if (og && !ep.imageURL) ep.imageURL = og;
    if (entry) {
      ep.streamURL = streamFromEntry(entry);
      ep.entryId = entry;
      return true;
    }
    return false;
  } finally {
    await page.close();
  }
}

async function scrapeEpisodeList(context, season, startUrls) {
  const found = new Map();
  const queue = startUrls.slice();
  const visited = new Set();

  while (queue.length) {
    const url = queue.shift();
    const clean = url.split('?')[0];
    if (visited.has(clean)) continue;
    visited.add(clean);

    // season index page
    if (/\/s\d+\/?$/.test(clean)) {
      const page = await context.newPage();
      try {
        await page.goto(clean, { waitUntil: 'domcontentloaded', timeout: 90000 });
        await page.waitForTimeout(2500);
        const links = await page.evaluate((season) =>
          Array.from(document.querySelectorAll('a[href*="p-11843"]'))
            .map((a) => a.href.split('?')[0])
            .filter((h) => h.includes('/s' + season + '/') && /\/\d+\/?$/.test(h))
        , season);
        console.log(`  index s${season} links`, links.length);
        links.forEach((l) => queue.push(l));
      } catch (e) {
        console.warn(e.message);
      } finally {
        await page.close();
      }
      continue;
    }

    const page = await context.newPage();
    try {
      await page.goto(clean, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForTimeout(1800);
      const html = await page.content();
      if (/been blocked/i.test(html)) {
        console.log('  blocked', clean);
        continue;
      }
      const info = await page.evaluate((season) => {
        const title = document.title || '';
        const h1 = (document.querySelector('h1') || {}).textContent || '';
        const text = (title + ' ' + h1).replace(/\s+/g, ' ');
        let ep = null;
        const mEp = text.match(/פרק\s*(\d+)/);
        const mPart = text.match(/חלק\s*([אבגדה]|[1-5])/);
        const heb = { א: 1, ב: 2, ג: 3, ד: 4, ה: 5 };
        if (mEp) ep = Number(mEp[1]);
        else if (mPart) ep = heb[mPart[1]] || Number(mPart[1]) || null;
        const og =
          (document.querySelector('meta[property="og:image"]') || {}).content || '';
        const links = Array.from(document.querySelectorAll('a[href*="p-11843"]'))
          .map((a) => a.href.split('?')[0])
          .filter((h) => h.includes('/s' + season + '/') && /\/s\d+\/\d+/.test(h));
        const unavailable = /כבר לא זמין|לא זמין לצפייה/.test(document.body.innerText || '');
        return { ep, og, links, unavailable, text: text.slice(0, 80) };
      }, season);

      if (info.ep) {
        found.set(info.ep, {
          season,
          ep: info.ep,
          page: clean,
          imageURL: info.og || '',
          name: `עונה ${season} פרק ${info.ep}`,
          streamURL: '',
          unavailable: info.unavailable
        });
        console.log(`  s${season}e${info.ep} ${info.unavailable ? 'UNAVAIL' : ''}`);
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
  if (!re.test(src)) throw new Error('series block missing');
  fs.writeFileSync(CHANNELS, src.replace(re, '\n' + block));
  console.log('Merged', eps.length);
}

async function main() {
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  data.localPoster = data.localPoster || `images/kanbox/${SLUG}/series.jpg`;

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    locale: 'he-IL',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });

  const missing = data.episodes.filter((e) => !e.streamURL);
  console.log('Retry missing streams', missing.length);
  for (const ep of missing) {
    const ok = await fetchStream(context, ep);
    console.log(`  s${ep.season}e${ep.ep}`, ok ? ep.entryId : ep.unavailable ? 'unavail' : 'FAIL');
    await new Promise((r) => setTimeout(r, 700));
  }

  console.log('Season 7…');
  const s7 = await scrapeEpisodeList(context, 7, [
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s7/',
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s7/439453/',
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s7/475677/',
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s7/469803/',
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s7/475809/',
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s7/482175/'
  ]);

  console.log('Season 10…');
  const s10 = await scrapeEpisodeList(context, 10, [
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s10/',
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s10/1020198/',
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s10/1021488/',
    'https://www.kan.org.il/content/kan/kan-11/p-11843/s10/1021533/'
  ]);

  const existing = new Set(data.episodes.map((e) => `${e.season}-${e.ep}`));
  for (const ep of [...s7, ...s10]) {
    const key = `${ep.season}-${ep.ep}`;
    if (existing.has(key)) continue;
    existing.add(key);
    data.episodes.push(ep);
  }

  for (const ep of data.episodes.filter((e) => [7, 10].includes(e.season) && !e.streamURL && !e.unavailable)) {
    await fetchStream(context, ep);
    console.log(`  stream s${ep.season}e${ep.ep}`, ep.streamURL ? 'OK' : ep.unavailable ? 'unavail' : 'FAIL');
    await new Promise((r) => setTimeout(r, 700));
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

  // Drop fully unavailable S7 eps with no image and no stream to avoid empty shells
  // Keep ones with images even if no stream so season shows in UI
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
  console.log('\nFinal', by);
  console.log(
    'total',
    data.episodes.length,
    'streams',
    data.episodes.filter((e) => e.streamURL).length,
    'images',
    data.episodes.filter((e) => e.localImage).length
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
