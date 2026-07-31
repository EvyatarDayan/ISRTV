#!/usr/bin/env node
/**
 * Fill streams for bou-leechol-iti by extracting Kaltura/redge entry ids from episode HTML.
 * Also rescrape missing seasons 7 & 10.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const SLUG = 'bou-leechol-iti';
const SERIES_ID = '11843';
const SERIES_URL = 'https://www.kan.org.il/content/kan/kan-11/p-11843/';
const TITLE = 'בואו לאכול איתי';
const JSON_PATH = path.join(__dirname, `kanbox-${SLUG}.json`);
const CHANNELS = path.join(ROOT, 'js', 'channels.js');
const IMG_DIR = path.join(ROOT, 'images', 'kanbox', SLUG);
const CONCURRENCY = 4;

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
  const ids = [...html.matchAll(/\b(1_[a-z0-9]{8})\b/gi)].map((m) => m[1]);
  // Prefer ids that appear near player/vod context
  for (const id of ids) {
    if (html.includes('/vod/' + id) || html.includes(id + '/LIBCODER')) return id;
  }
  return ids[0] || '';
}

async function clickShowMore(page) {
  for (let i = 0; i < 25; i++) {
    const more = await page.$(
      '#vod-page-items-show-more button, button:has-text("טען עוד"), button:has-text("עוד"), a:has-text("הצג עוד")'
    );
    if (!more) break;
    try {
      await more.click({ timeout: 1500 });
      await page.waitForTimeout(700);
    } catch (e) {
      break;
    }
  }
}

async function clickSeason(page, season) {
  // Try multiple strategies — season pills can be nested text
  const clicked = await page.evaluate((season) => {
    const want = [`עונה ${season}`, `Season ${season}`, String(season)];
    const els = Array.from(document.querySelectorAll('button, a, [role="tab"], li, label, span'));
    for (const el of els) {
      const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!want.includes(t)) continue;
      // Prefer clickable small tabs
      if (t.length > 20) continue;
      try {
        el.click();
        return t;
      } catch (e) {}
    }
    // Partial match: "עונה 7 (" etc
    for (const el of els) {
      const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (new RegExp('^עונה\\s*' + season + '\\b').test(t) && t.length < 30) {
        try {
          el.click();
          return t;
        } catch (e) {}
      }
    }
    return '';
  }, season);
  await page.waitForTimeout(1800);
  return clicked;
}

async function collectSeasonEpisodes(page, season) {
  return page.evaluate(
    ({ seriesId, season }) => {
      const anchors = Array.from(document.querySelectorAll(`a[href*="/p-${seriesId}/"]`));
      const out = [];
      anchors.forEach((a) => {
        const href = a.href.split('?')[0];
        const decoded = decodeURIComponent(href);
        const m =
          decoded.match(new RegExp(`/p-${seriesId}/s${season}/(\\d+)/?`)) ||
          decoded.match(new RegExp(`/p-${seriesId}/עונה-${season}/(\\d+)/?`));
        if (!m) return;
        let text = (a.textContent || a.getAttribute('title') || '').replace(/\s+/g, ' ').trim();
        text = text.replace(/^\d{1,2}:\d{2}(?::\d{2})?\s+/, '');
        if (/טריילר|ריקאפ|ריכולים|קדימון|צריכים תזכורת|הצצות/.test(text)) return;
        const mDash = text.match(/פרק\s*(\d+)/);
        if (!mDash) return;
        const epNum = Number(mDash[1]);
        const img = a.querySelector('img');
        out.push({
          season,
          ep: epNum,
          page: href,
          imageURL: img ? img.currentSrc || img.src || img.getAttribute('data-src') || '' : '',
          text
        });
      });
      const map = new Map();
      out.forEach((e) => {
        if (!map.has(e.ep)) map.set(e.ep, e);
      });
      return Array.from(map.values()).sort((a, b) => a.ep - b.ep);
    },
    { seriesId: SERIES_ID, season }
  );
}

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    const req = proto.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
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
    );
    req.on('error', () => {
      try {
        file.close();
        fs.unlink(dest, () => {});
      } catch (e) {}
      resolve(false);
    });
  });
}

async function rescueSeasons(context, data, seasons) {
  const page = await context.newPage();
  await page.goto(SERIES_URL, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(3500);

  // Dump available season labels for debug
  const labels = await page.evaluate(() =>
    Array.from(document.querySelectorAll('button, a, [role="tab"], li, span'))
      .map((el) => (el.textContent || '').replace(/\s+/g, ' ').trim())
      .filter((t) => /^עונה\s*\d+/.test(t) && t.length < 40)
  );
  console.log('Season labels seen:', [...new Set(labels)].join(' | '));

  const existing = new Set(data.episodes.map((e) => `${e.season}-${e.ep}`));
  for (const season of seasons) {
    console.log(`Rescue season ${season}`);
    const clicked = await clickSeason(page, season);
    console.log('  clicked:', clicked || 'NONE');
    await clickShowMore(page);
    // Also try URL hash / direct season path
    if (!clicked) {
      try {
        await page.goto(SERIES_URL + `?season=${season}`, {
          waitUntil: 'domcontentloaded',
          timeout: 60000
        });
        await page.waitForTimeout(2000);
        await clickSeason(page, season);
        await clickShowMore(page);
      } catch (e) {}
    }
    const eps = await collectSeasonEpisodes(page, season);
    console.log(`  found ${eps.length}`);
    for (const e of eps) {
      const key = `${e.season}-${e.ep}`;
      if (existing.has(key)) continue;
      existing.add(key);
      data.episodes.push({
        season: e.season,
        ep: e.ep,
        name: `עונה ${e.season} פרק ${e.ep}`,
        page: e.page,
        imageURL: e.imageURL || '',
        streamURL: ''
      });
    }
  }
  await page.close();
  data.episodes.sort((a, b) => a.season - b.season || a.ep - b.ep);
}

async function fillStreams(context, data) {
  const need = data.episodes.filter((e) => !e.streamURL);
  console.log(`Filling streams: ${need.length}`);
  let done = 0;
  let i = 0;

  async function worker() {
    while (i < need.length) {
      const idx = i++;
      const ep = need[idx];
      const page = await context.newPage();
      try {
        await page.goto(ep.page, { waitUntil: 'domcontentloaded', timeout: 90000 });
        await page.waitForTimeout(1200);
        const html = await page.content();
        let entry = extractEntryId(html);
        if (!entry) {
          // click play once as fallback
          for (const sel of ['button[aria-label="ניגון"]', 'button[aria-label*="Play"]', 'video']) {
            const el = await page.$(sel);
            if (!el) continue;
            try {
              await el.click({ timeout: 1500 });
              break;
            } catch (e) {}
          }
          await page.waitForTimeout(5000);
          entry = extractEntryId(await page.content());
          // also scan requests via evaluate performance? skip
        }
        if (entry) {
          ep.streamURL = streamFromEntry(entry);
          ep.entryId = entry;
        }
      } catch (err) {
        console.warn(`  err s${ep.season}e${ep.ep}`, err.message);
      } finally {
        await page.close();
      }
      done++;
      if (done % 10 === 0 || !ep.streamURL) {
        console.log(
          `[${done}/${need.length}] s${ep.season}e${ep.ep} ${ep.streamURL ? 'OK ' + ep.entryId : 'FAIL'}`
        );
      }
      if (done % 20 === 0) fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
    }
  }

  const workers = [];
  for (let w = 0; w < CONCURRENCY; w++) workers.push(worker());
  await Promise.all(workers);
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
}

async function fillMissingImages(data) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  let n = 0;
  for (const ep of data.episodes) {
    const localRel = `images/kanbox/${SLUG}/s${ep.season}-ep${ep.ep}.jpg`;
    const dest = path.join(ROOT, localRel);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      ep.localImage = localRel;
      continue;
    }
    if (ep.imageURL && (await downloadFile(ep.imageURL, dest))) {
      ep.localImage = localRel;
      n++;
    }
  }
  console.log(`Downloaded ${n} missing images`);
  if (!data.localPoster) {
    const hub = path.join(ROOT, 'images', 'vod', 'hub.jpg');
    const seriesJpg = path.join(IMG_DIR, 'series.jpg');
    if (fs.existsSync(hub)) {
      fs.copyFileSync(hub, seriesJpg);
      data.localPoster = `images/kanbox/${SLUG}/series.jpg`;
    }
  }
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
  let next;
  if (re.test(src)) {
    next = src.replace(re, '\n' + block);
  } else {
    const marker = '\n];\n';
    const idx = src.lastIndexOf(marker);
    const before = src.slice(0, idx);
    const insertAt = before.lastIndexOf('\n    }');
    next = before.slice(0, insertAt + 6) + ',\n' + block + before.slice(insertAt + 6) + src.slice(idx);
  }
  fs.writeFileSync(CHANNELS, next);
  console.log(`Merged ${eps.length} episodes into channels.js`);
}

async function main() {
  const playwright = require('playwright');
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

  const browser = await playwright.chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    locale: 'he-IL',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1400, height: 900 }
  });

  const have = new Set(data.episodes.map((e) => e.season));
  const missingSeasons = [7, 10].filter((s) => !have.has(s));
  if (missingSeasons.length) {
    await rescueSeasons(context, data, missingSeasons);
    fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
  }

  await fillStreams(context, data);
  await browser.close();

  await fillMissingImages(data);
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
  mergeIntoChannels(data);

  const by = {};
  data.episodes.forEach((e) => {
    by[e.season] = (by[e.season] || 0) + 1;
  });
  const withStream = data.episodes.filter((e) => e.streamURL).length;
  const withImg = data.episodes.filter((e) => e.localImage).length;
  console.log('\nDone');
  console.log('  seasons', by);
  console.log(`  episodes ${data.episodes.length}`);
  console.log(`  streams ${withStream}/${data.episodes.length}`);
  console.log(`  images ${withImg}/${data.episodes.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
