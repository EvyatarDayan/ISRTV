#!/usr/bin/env node
/** Resume missing streams for קופה ראשית */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const SLUG = 'kupa-rashit';
const TITLE = 'קופה ראשית';
const JSON_PATH = path.join(__dirname, `kanbox-${SLUG}.json`);
const CHANNELS = path.join(ROOT, 'js', 'channels.js');

function streamFromEntry(id) {
  return (
    'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/' +
    id +
    '/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4'
  );
}

function extractEntryId(html, urls) {
  for (const u of urls || []) {
    const m = u.match(/\/vod\/([0-9a-z_]+)\//i);
    if (m) return m[1];
  }
  const h = html || '';
  const m = h.match(/\/vod\/([0-9a-z_]+)\/LIBCODER/i) || h.match(/\/vod\/([0-9a-z_]+)\//i);
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

async function main() {
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  const need = data.episodes.filter((e) => !e.streamURL);
  console.log('Need streams', need.length);

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    locale: 'he-IL',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });

  // sequential to avoid crashes
  for (let n = 0; n < need.length; n++) {
    const ep = need[n];
    const page = await context.newPage();
    const urls = [];
    page.on('request', (r) => {
      if (/\/vod\/[0-9a-z_]+\//i.test(r.url())) urls.push(r.url());
    });
    try {
      await page.goto(ep.page, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForTimeout(2000);
      let html = await page.content();
      if (/כבר לא זמין|לא זמין לצפייה/i.test(html)) {
        ep.unavailable = true;
        console.log(`[${n + 1}/${need.length}] s${ep.season}e${ep.ep} UNAVAIL`);
        await page.close();
        continue;
      }
      let entry = extractEntryId(html, urls);
      if (!entry) {
        try {
          await page.click('[class*="play"]', { timeout: 4000 });
        } catch (e) {}
        try {
          await page.click('button[aria-label="ניגון"]', { timeout: 2000, force: true });
        } catch (e) {}
        await page.waitForTimeout(8000);
        html = await page.content();
        entry = extractEntryId(html, urls);
      }
      if (entry) {
        ep.streamURL = streamFromEntry(entry);
        ep.entryId = entry;
        console.log(`[${n + 1}/${need.length}] s${ep.season}e${ep.ep} OK ${entry}`);
      } else {
        console.log(`[${n + 1}/${need.length}] s${ep.season}e${ep.ep} FAIL`);
      }
    } catch (e) {
      console.warn(`[${n + 1}/${need.length}] s${ep.season}e${ep.ep}`, e.message);
    } finally {
      await page.close();
    }
    if ((n + 1) % 10 === 0) fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
  }

  await browser.close();
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
  merge(data);

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
