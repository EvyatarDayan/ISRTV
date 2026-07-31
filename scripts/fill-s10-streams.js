#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const SLUG = 'bou-leechol-iti';
const JSON_PATH = path.join(__dirname, `kanbox-${SLUG}.json`);
const CHANNELS = path.join(ROOT, 'js', 'channels.js');
const TITLE = 'בואו לאכול איתי';

function streamFromEntry(id) {
  return (
    'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/' +
    id +
    '/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4'
  );
}

function extractId(html, urls) {
  for (const u of urls) {
    const m = u.match(/\/vod\/([0-9a-z_]+)\//i);
    if (m) return m[1];
  }
  const m = (html || '').match(/\/vod\/([0-9a-z_]+)\/LIBCODER/i);
  return m ? m[1] : '';
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function merge(data) {
  const src = fs.readFileSync(CHANNELS, 'utf8');
  const poster = data.localPoster || `images/kanbox/${SLUG}/series.jpg`;
  const lines = [
    '    {',
    `        id: '${SLUG}',`,
    `        name: '${esc(TITLE)}',`,
    `        placeholder: '${esc(TITLE)}',`,
    `        imageURL: '${poster}',`,
    `        source: 'kan',`,
    '        episodes: ['
  ];
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
  lines.push('        ]', '    }');
  const re = new RegExp(`\\n    \\{\\n        id: '${SLUG}',[\\s\\S]*?\\n    \\}`, 'm');
  fs.writeFileSync(CHANNELS, src.replace(re, '\n' + lines.join('\n')));
}

(async () => {
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

  for (const ep of data.episodes.filter((e) => e.season === 10)) {
    const page = await context.newPage();
    const urls = [];
    page.on('request', (r) => urls.push(r.url()));
    await page.goto(ep.page, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(3000);
    try {
      await page.click('[class*="play"]', { timeout: 5000 });
    } catch (e) {}
    try {
      await page.click('button[aria-label="ניגון"]', { timeout: 3000, force: true });
    } catch (e) {}
    await page.waitForTimeout(10000);
    const id = extractId(await page.content(), urls);
    if (id) {
      ep.streamURL = streamFromEntry(id);
      ep.entryId = id;
      console.log('s10e' + ep.ep, id);
    } else {
      console.log('s10e' + ep.ep, 'FAIL');
    }
    await page.close();
  }

  // ensure localImage flags
  for (const ep of data.episodes) {
    const localRel = `images/kanbox/${SLUG}/s${ep.season}-ep${ep.ep}.jpg`;
    if (fs.existsSync(path.join(ROOT, localRel)) && fs.statSync(path.join(ROOT, localRel)).size > 1000) {
      ep.localImage = localRel;
    }
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
  merge(data);
  await browser.close();
  console.log(
    'done s10',
    data.episodes.filter((e) => e.season === 10 && e.streamURL).length,
    'total streams',
    data.episodes.filter((e) => e.streamURL).length
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
