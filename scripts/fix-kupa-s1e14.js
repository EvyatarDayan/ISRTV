#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const SLUG = 'kupa-rashit';
const TITLE = 'קופה ראשית';
const JSON_PATH = path.join(__dirname, 'kanbox-kupa-rashit.json');
const CHANNELS = path.join(ROOT, 'js', 'channels.js');

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
  const ep = data.episodes.find((e) => e.season === 1 && e.ep === 14);
  const b = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const c = await b.newContext({
    locale: 'he-IL',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });
  const p = await c.newPage();
  const urls = [];
  p.on('request', (r) => {
    if (/\/vod\//i.test(r.url())) urls.push(r.url());
  });
  await p.goto(ep.page, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2000);
  try {
    await p.click('[class*="play"]', { timeout: 4000 });
  } catch (e) {}
  try {
    await p.click('button[aria-label="ניגון"]', { timeout: 2000, force: true });
  } catch (e) {}
  await p.waitForTimeout(10000);
  let id = '';
  for (const u of urls) {
    const m = u.match(/\/vod\/([0-9a-z_]+)\//i);
    if (m) {
      id = m[1];
      break;
    }
  }
  if (!id) {
    const m = (await p.content()).match(/\/vod\/([0-9a-z_]+)\//i);
    if (m) id = m[1];
  }
  console.log('s1e14', id || 'FAIL');
  if (id) {
    ep.streamURL =
      'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/' +
      id +
      '/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4';
    ep.entryId = id;
  }
  await b.close();
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
  merge(data);
  console.log(
    'streams',
    data.episodes.filter((e) => e.streamURL).length,
    '/',
    data.episodes.length
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
