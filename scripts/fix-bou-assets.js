#!/usr/bin/env node
/** Download missing images + capture S10 streams via headed browser */
const fs = require('fs');
const path = require('path');
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
  const fromPath = (html || '').match(/\/vod\/(1_[a-z0-9]+)\//i);
  return fromPath ? fromPath[1] : '';
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function merge(data) {
  const src = fs.readFileSync(CHANNELS, 'utf8');
  const poster = data.localPoster || `images/kanbox/${SLUG}/series.jpg`;
  const lines = ['    {', `        id: '${SLUG}',`, `        name: '${esc(TITLE)}',`, `        placeholder: '${esc(TITLE)}',`, `        imageURL: '${poster}',`, `        source: 'kan',`, '        episodes: ['];
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
  const block = lines.join('\n');
  const re = new RegExp(`\\n    \\{\\n        id: '${SLUG}',[\\s\\S]*?\\n    \\}`, 'm');
  fs.writeFileSync(CHANNELS, src.replace(re, '\n' + block));
}

async function main() {
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  fs.mkdirSync(IMG_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    locale: 'he-IL',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });

  const needImg = data.episodes.filter((e) => {
    const dest = path.join(IMG_DIR, `s${e.season}-ep${e.ep}.jpg`);
    return !(fs.existsSync(dest) && fs.statSync(dest).size > 1000);
  });
  console.log('Need images', needImg.length);

  for (const ep of needImg) {
    const dest = path.join(IMG_DIR, `s${ep.season}-ep${ep.ep}.jpg`);
    const page = await context.newPage();
    let buf = null;
    page.on('response', async (res) => {
      try {
        const ct = (res.headers()['content-type'] || '').toLowerCase();
        if (!ct.includes('image')) return;
        const u = res.url();
        if (ep.imageURL && u.split('?')[0] === ep.imageURL.split('?')[0]) {
          buf = await res.body();
        } else if (/kan\.org\.il\/media|og:image|width=1200/i.test(u) && !buf) {
          const b = await res.body();
          if (b && b.length > 5000) buf = b;
        }
      } catch (e) {}
    });
    try {
      if (ep.imageURL) {
        await page.goto(ep.imageURL, { waitUntil: 'load', timeout: 60000 }).catch(() => {});
        await page.waitForTimeout(500);
      }
      if (!buf || buf.length < 2000) {
        await page.goto(ep.page, { waitUntil: 'domcontentloaded', timeout: 90000 });
        await page.waitForTimeout(2000);
        // try screenshot of og image element
        const og = await page.evaluate(
          () => (document.querySelector('meta[property="og:image"]') || {}).content || ''
        );
        if (og) {
          const r = await page.goto(og, { waitUntil: 'load', timeout: 60000 }).catch(() => null);
          if (r) {
            try {
              buf = await r.body();
            } catch (e) {}
          }
        }
      }
      if (buf && buf.length > 2000) {
        fs.writeFileSync(dest, buf);
        ep.localImage = `images/kanbox/${SLUG}/s${ep.season}-ep${ep.ep}.jpg`;
        console.log('img', `s${ep.season}e${ep.ep}`, buf.length);
      } else {
        console.log('img FAIL', `s${ep.season}e${ep.ep}`);
      }
    } catch (e) {
      console.warn(e.message);
    } finally {
      await page.close();
    }
  }

  // S10 streams
  for (const ep of data.episodes.filter((e) => e.season === 10 && !e.streamURL)) {
    const page = await context.newPage();
    const net = [];
    page.on('request', (r) => {
      if (/\/vod\/1_[a-z0-9]+\//i.test(r.url())) net.push(r.url());
    });
    try {
      await page.goto(ep.page, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForTimeout(2500);
      for (const sel of ['button[aria-label="ניגון"]', 'button[aria-label*="Play"]', 'video']) {
        const el = await page.$(sel);
        if (!el) continue;
        try {
          await el.click({ timeout: 2000 });
          break;
        } catch (e) {}
      }
      await page.waitForTimeout(8000);
      let entry = extractEntryId(await page.content());
      if (!entry) {
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
        console.log('s10e' + ep.ep, entry);
      } else {
        console.log('s10e' + ep.ep, 'FAIL', 'net', net.slice(0, 3));
      }
    } finally {
      await page.close();
    }
  }

  // mark local images that exist
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
    'streams',
    data.episodes.filter((e) => e.streamURL).length,
    'images',
    data.episodes.filter((e) => e.localImage).length,
    '/',
    data.episodes.length
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
