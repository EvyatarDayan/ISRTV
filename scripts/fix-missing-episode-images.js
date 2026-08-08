#!/usr/bin/env node
/**
 * Download real Kan episode thumbnails for series that currently reuse series.jpg.
 * Captures /media/ images from the series listing (Cloudflare-safe), falls back to
 * episode og:image, writes JPEG under images/kanbox/<slug>/, updates channels.js.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const CHANNELS = path.join(ROOT, 'js', 'channels.js');

const SERIES = [
  {
    slug: 'hayehudim-baim',
    json: 'kanbox-series-12614.json',
    url: 'https://www.kan.org.il/content/kan/kan-11/p-12614/',
    id: '12614'
  },
  {
    slug: 'slicha-al-hasheela',
    json: 'kanbox-series-12781.json',
    url: 'https://www.kan.org.il/content/kan/kan-11/p-12781/',
    id: '12781'
  },
  {
    slug: 'oyvim',
    json: 'kanbox-series-12210.json',
    url: 'https://www.kan.org.il/content/kan/kan-11/p-12210/',
    id: '12210'
  },
  {
    slug: 'od-nipagesh',
    json: 'kanbox-series-12582.json',
    url: 'https://www.kan.org.il/content/kan/kan-11/p-12582/',
    id: '12582'
  },
  {
    slug: 'shabas',
    json: 'kanbox-series-13283.json',
    url: 'https://www.kan.org.il/content/kan/kan-11/p-13283/',
    id: '13283'
  },
  {
    slug: 'taboo-daum',
    json: 'kanbox-series-12154.json',
    url: 'https://www.kan.org.il/content/kan/kan-11/p-12154/',
    id: '12154'
  },
  {
    slug: 'pollard',
    json: 'kanbox-pollard.json',
    url: 'https://www.kan.org.il/content/kan/kan-11/p-12798/',
    id: '12798'
  },
  {
    slug: 'hidat-meshulam',
    json: 'kanbox-hidat-meshulam.json',
    url: 'https://www.kan.org.il/content/kan/kan-11/p-12487/',
    id: '12487'
  },
  {
    slug: 'dor-echad-vachetsi',
    json: 'kanbox-dor-echad-vachetsi.json',
    url: 'https://www.kan.org.il/content/kan/kan-11/p-12527/',
    id: '12527'
  },
  {
    slug: 'tik-512',
    json: 'kanbox-tik-512.json',
    url: 'https://www.kan.org.il/content/kan/kan-11/p-12274/',
    id: '12274'
  },
  {
    slug: 'peduyim',
    json: 'kanbox-peduyim.json',
    url: 'https://www.kan.org.il/content/kan/kan-11/p-13015/',
    id: '13015'
  }
];

function normalizeUrl(u) {
  try {
    const p = new URL(u);
    p.hash = '';
    return p.toString();
  } catch (e) {
    return u;
  }
}

function isValidImageBuf(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 2000) return false;
  if (buf[0] === 0xff && buf[1] === 0xd8) return true;
  if (buf[0] === 0x89 && buf[1] === 0x50) return true;
  if (buf.slice(0, 4).toString() === 'RIFF') return true;
  return false;
}

function isJpeg(buf) {
  return Buffer.isBuffer(buf) && buf[0] === 0xff && buf[1] === 0xd8;
}

async function clickShowMore(page) {
  for (let i = 0; i < 25; i++) {
    const more = await page.$(
      '#vod-page-items-show-more button, button:has-text("טען עוד"), button:has-text("עוד")'
    );
    if (!more) break;
    try {
      await more.click({ timeout: 1500 });
      await page.waitForTimeout(650);
    } catch (e) {
      break;
    }
  }
}

async function toJpeg(page, buf) {
  if (isJpeg(buf)) return buf;
  const dataUrl = await page.evaluate(async (bytes) => {
    const u8 = new Uint8Array(bytes);
    const type = u8[0] === 0x89 ? 'image/png' : 'image/webp';
    const blob = new Blob([u8], { type });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = url;
    });
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    c.getContext('2d').drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    return c.toDataURL('image/jpeg', 0.88);
  }, [...buf]);
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

function pageIdFromUrl(u) {
  const m = String(u || '').match(/\/(\d+)\/?$/);
  return m ? m[1] : '';
}

function epFileName(ep, multi) {
  return multi ? `s${ep.season}-ep${ep.ep}.jpg` : `ep${ep.ep}.jpg`;
}

async function processSeries(context, series) {
  const jsonPath = path.join(__dirname, series.json);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  data.slug = series.slug;
  const imgDir = path.join(ROOT, 'images', 'kanbox', series.slug);
  fs.mkdirSync(imgDir, { recursive: true });

  const multi = new Set((data.episodes || []).map((e) => e.season || 1)).size > 1;
  const seasons = [...new Set((data.episodes || []).map((e) => e.season || 1))].sort(
    (a, b) => a - b
  );

  const page = await context.newPage();
  const captured = new Map();

  page.on('response', async (res) => {
    try {
      const u = res.url();
      const ct = res.headers()['content-type'] || '';
      if (!/image\/(jpeg|jpg|png|webp)/i.test(ct)) return;
      if (!/kan\.org\.il\/media\//i.test(u)) return;
      if (res.status() !== 200) return;
      const buf = await res.body();
      if (buf.length > 3500 && isValidImageBuf(buf)) captured.set(normalizeUrl(u), buf);
    } catch (e) {}
  });

  console.log(`\n=== ${series.slug} (${data.episodes.length} eps) ===`);
  await page.goto(series.url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(2500);

  const cardsByPageId = {};

  for (const season of seasons) {
    await page.evaluate((season) => {
      const els = Array.from(
        document.querySelectorAll('button, a, [role="tab"], li, span, div')
      );
      for (const el of els) {
        if ((el.textContent || '').trim() === `עונה ${season}`) {
          el.click();
          return;
        }
      }
    }, season);
    await page.waitForTimeout(1100);
    await clickShowMore(page);
    await page.evaluate(async () => {
      for (let i = 0; i < 14; i++) {
        window.scrollBy(0, 700);
        await new Promise((r) => setTimeout(r, 280));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);

    const seasonMap = await page.evaluate((id) => {
      const map = {};
      Array.from(document.querySelectorAll(`a[href*="/p-${id}/"]`)).forEach((a) => {
        const decoded = decodeURIComponent(a.href.split('?')[0]);
        const m =
          decoded.match(new RegExp(`/p-${id}/s(\\d+)/(\\d+)/?`)) ||
          decoded.match(new RegExp(`/p-${id}/עונה-(\\d+)/(\\d+)/?`));
        if (!m) return;
        const img = a.querySelector('img.img-full, .card-img img, img');
        map[m[2]] = {
          season: Number(m[1]),
          src: img ? img.currentSrc || img.src || '' : '',
          href: decoded
        };
      });
      return map;
    }, series.id);
    Object.assign(cardsByPageId, seasonMap);
  }

  await page.waitForTimeout(1500);
  console.log(`  cards=${Object.keys(cardsByPageId).length} captured=${captured.size}`);

  function bufForUrl(url) {
    if (!url) return null;
    const n = normalizeUrl(url);
    if (captured.has(n)) return captured.get(n);
    const base = n.split('?')[0];
    for (const [u, buf] of captured) {
      if (u.split('?')[0] === base) return buf;
    }
    return null;
  }

  async function ensureBuf(url) {
    let buf = bufForUrl(url);
    if (isValidImageBuf(buf)) return buf;
    if (!url) return null;
    try {
      const res = await context.request.get(url, {
        headers: { Referer: series.url },
        timeout: 45000
      });
      if (res.ok()) {
        buf = await res.body();
        if (isValidImageBuf(buf)) return buf;
      }
    } catch (e) {}
    try {
      const r = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
      if (r) {
        buf = await r.body();
        if (isValidImageBuf(buf)) return buf;
      }
      await page.waitForTimeout(250);
      buf = bufForUrl(url);
      if (isValidImageBuf(buf)) return buf;
    } catch (e) {}
    return null;
  }

  let ok = 0;
  let fail = 0;

  for (const ep of data.episodes) {
    const pid = pageIdFromUrl(ep.page);
    const card = pid && cardsByPageId[pid];
    let url = (card && card.src) || ep.imageURL || '';
    const fname = epFileName(ep, multi);
    const dest = path.join(imgDir, fname);

    // Skip if we already have a unique valid jpeg that isn't series.jpg
    if (fs.existsSync(dest)) {
      const existing = fs.readFileSync(dest);
      if (isJpeg(existing) && existing.length > 4000) {
        const seriesPath = path.join(imgDir, 'series.jpg');
        let sameAsSeries = false;
        if (fs.existsSync(seriesPath)) {
          const sbuf = fs.readFileSync(seriesPath);
          sameAsSeries = sbuf.equals(existing);
        }
        if (!sameAsSeries) {
          ep.localImage = `images/kanbox/${series.slug}/${fname}`;
          ok++;
          continue;
        }
      }
    }

    let buf = await ensureBuf(url);
    if (!isValidImageBuf(buf) && ep.page) {
      try {
        await page.goto(ep.page, { waitUntil: 'domcontentloaded', timeout: 90000 });
        await page.waitForTimeout(1100);
        const og = await page.evaluate(
          () => (document.querySelector('meta[property="og:image"]') || {}).content || ''
        );
        if (og) {
          url = og;
          ep.imageURL = og;
          buf = await ensureBuf(og);
        }
      } catch (e) {}
    }

    if (isValidImageBuf(buf)) {
      buf = await toJpeg(page, buf);
      fs.writeFileSync(dest, buf);
      ep.localImage = `images/kanbox/${series.slug}/${fname}`;
      if (url) ep.imageURL = url;
      ok++;
      console.log(`  OK ${fname} ${buf.length}`);
    } else {
      fail++;
      console.warn(`  FAIL ${fname}`);
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  // Also write slug-named cache
  fs.writeFileSync(
    path.join(__dirname, `kanbox-${series.slug}.json`),
    JSON.stringify(data, null, 2)
  );

  await page.close();
  console.log(`  done ok=${ok} fail=${fail}`);
  return { slug: series.slug, ok, fail, multi, data };
}

function updateChannels(results) {
  let text = fs.readFileSync(CHANNELS, 'utf8');

  for (const r of results) {
    const { slug, multi, data } = r;
    const idToken = `id: '${slug}'`;
    const idIdx = text.indexOf(idToken);
    if (idIdx < 0) {
      console.warn('channels: missing series', slug);
      continue;
    }
    let brace = idIdx;
    while (brace > 0 && text[brace] !== '{') brace--;
    let depth = 0;
    let end = -1;
    for (let i = brace; i < text.length; i++) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}') {
        depth--;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    if (end < 0) continue;
    let block = text.slice(brace, end);

    for (const ep of data.episodes) {
      if (!ep.localImage) continue;
      const epId = multi
        ? `${slug}-s${ep.season}-ep${ep.ep}`
        : `${slug}-ep${ep.ep}`;
      const re = new RegExp(
        `(id:\\s*'${epId}'[\\s\\S]*?imageURL:\\s*')([^']+)(')`
      );
      if (!re.test(block)) {
        // try alternate id forms
        const re2 = new RegExp(
          `(id:\\s*'${slug}-s${ep.season}-ep${ep.ep}'[\\s\\S]*?imageURL:\\s*')([^']+)(')`
        );
        if (re2.test(block)) {
          block = block.replace(re2, `$1${ep.localImage}$3`);
        } else {
          console.warn('  no channels ep match', epId);
        }
        continue;
      }
      block = block.replace(re, `$1${ep.localImage}$3`);
    }

    text = text.slice(0, brace) + block + text.slice(end);
    console.log('channels updated', slug);
  }

  fs.writeFileSync(CHANNELS, text);
  // syntax check
  // eslint-disable-next-line no-new-func
  new Function(text);
}

async function main() {
  const filter = process.argv.slice(2);
  const list = filter.length
    ? SERIES.filter((s) => filter.includes(s.slug))
    : SERIES;

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    locale: 'he-IL',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1400, height: 900 }
  });

  // Warm Cloudflare once
  const warm = await context.newPage();
  await warm.goto('https://www.kan.org.il/content/kan/kan-11/p-12614/', {
    waitUntil: 'domcontentloaded',
    timeout: 120000
  });
  await warm.waitForTimeout(3000);
  await warm.close();

  const results = [];
  for (const series of list) {
    try {
      results.push(await processSeries(context, series));
    } catch (e) {
      console.error('SERIES FAIL', series.slug, e.message);
    }
  }

  updateChannels(results);
  await browser.close();

  const totalOk = results.reduce((a, r) => a + r.ok, 0);
  const totalFail = results.reduce((a, r) => a + r.fail, 0);
  console.log(`\nALL DONE ok=${totalOk} fail=${totalFail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
