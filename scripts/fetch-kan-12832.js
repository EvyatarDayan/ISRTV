#!/usr/bin/env node
/**
 * Scrape Kan series p-12832 (5 seasons) → images + streams → channels.js
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const SERIES_URL = 'https://www.kan.org.il/content/kan/kan-11/p-12832/';
const SERIES_ID = '12832';
const SEASONS = [1, 2, 3, 4, 5];
const CHANNELS = path.join(ROOT, 'js', 'channels.js');
const CONCURRENCY = 3;

let SLUG = 'kupa-rashit';
let TITLE = 'קופה ראשית';
let JSON_PATH = path.join(__dirname, 'kanbox-kupa-rashit.json');
let IMG_DIR = path.join(ROOT, 'images', 'kanbox', 'kupa-rashit');

function slugify(title) {
  const map = {
    'קופה ראשית': 'kupa-rashit',
    'זהו זה': 'zehu-ze',
    'שעת נעילה': 'shaat-neila',
    'טהרן': 'tehran',
    'סטוקהולם': 'shtokholm',
    'בואו לאכול איתי': 'bou-leechol-iti'
  };
  for (const [he, en] of Object.entries(map)) {
    if (title.includes(he)) return en;
  }
  const he = {
    א: 'a', ב: 'b', ג: 'g', ד: 'd', ה: 'h', ו: 'v', ז: 'z', ח: 'ch', ט: 't',
    י: 'y', כ: 'k', ך: 'k', ל: 'l', מ: 'm', ם: 'm', נ: 'n', ן: 'n', ס: 's',
    ע: 'a', פ: 'p', ף: 'p', צ: 'tz', ץ: 'tz', ק: 'k', ר: 'r', ש: 'sh', ת: 't',
    ' ': '-', '"': '', "'": '', '״': '', '׳': ''
  };
  return title
    .split('')
    .map((c) => (he[c] !== undefined ? he[c] : /[a-z0-9-]/i.test(c) ? c.toLowerCase() : ''))
    .join('')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || `kan-${SERIES_ID}`;
}

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
  const fromPath = h.match(/\/vod\/([0-9a-z_]+)\/LIBCODER/i) || h.match(/\/vod\/([0-9a-z_]+)\//i);
  if (fromPath) return fromPath[1];
  const kaltura = h.match(/\b(1_[a-z0-9]{8})\b/i);
  return kaltura ? kaltura[1] : '';
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
  const clicked = await page.evaluate((season) => {
    const want = [`עונה ${season}`, `Season ${season}`];
    const els = Array.from(document.querySelectorAll('button, a, [role="tab"], li, span, div'));
    for (const el of els) {
      const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (want.includes(t) || (new RegExp('^עונה\\s*' + season + '\\b').test(t) && t.length < 30)) {
        try {
          el.click();
          return t;
        } catch (e) {}
      }
    }
    return '';
  }, season);
  await page.waitForTimeout(1500);
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
        const img = a.querySelector('img');
        out.push({
          season,
          ep: Number(mDash[1]),
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

async function scrapeList(context) {
  // Warm up cookies on kan homepage first
  const warm = await context.newPage();
  try {
    await warm.goto('https://www.kan.org.il/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await warm.waitForTimeout(3000);
  } catch (e) {}
  await warm.close();

  const page = await context.newPage();
  let lastErr = null;
  for (let attempt = 1; attempt <= 4; attempt++) {
    console.log('Opening', SERIES_URL, 'attempt', attempt);
    try {
      await page.goto(SERIES_URL, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await page.waitForTimeout(4000 + attempt * 1500);
      const blocked = await page.evaluate(() =>
        /been blocked|Attention Required/i.test(document.title || '')
      );
      if (!blocked) break;
      lastErr = new Error('Cloudflare blocked');
      console.log('CF block, waiting…');
      await page.waitForTimeout(8000 * attempt);
    } catch (e) {
      lastErr = e;
      await page.waitForTimeout(5000 * attempt);
    }
  }

  const meta = await page.evaluate(() => {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const h1 = document.querySelector('h1');
    const blocked = /been blocked|Attention Required/i.test(document.title || '');
    let title = (h1 && h1.textContent) || (ogTitle && ogTitle.getAttribute('content')) || '';
    title = title.split('|')[0].trim();
    title = title.replace(/\s*-\s*פרקים.*$/i, '').trim();
    title = title.replace(/\s*-\s*עונה\s*\d+\s*$/i, '').trim();
    title = title.replace(/\s*פרקים מלאים.*$/i, '').trim();
    title = title.replace(/\s*לצפייה ישירה.*$/i, '').trim();
    title = title.replace(/\.?\s*כאן.*$/i, '').trim();
    return {
      blocked,
      title,
      poster: (ogImage && ogImage.getAttribute('content')) || ''
    };
  });
  if (meta.blocked) {
    await page.close();
    throw lastErr || new Error('Cloudflare blocked series page — retry later');
  }
  SLUG = 'kupa-rashit';
  TITLE = 'קופה ראשית';
  JSON_PATH = path.join(__dirname, `kanbox-${SLUG}.json`);
  IMG_DIR = path.join(ROOT, 'images', 'kanbox', SLUG);
  fs.mkdirSync(IMG_DIR, { recursive: true });
  console.log('Title:', TITLE, 'slug:', SLUG);

  const all = [];
  const seen = new Set();
  for (const season of SEASONS) {
    const seasonUrl = `https://www.kan.org.il/content/kan/kan-11/p-12832/s${season}/`;
    console.log('-- Season', season, seasonUrl);
    try {
      await page.goto(seasonUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForTimeout(2500);
      const blocked = await page.evaluate(() =>
        /been blocked|Attention Required/i.test(document.title || '')
      );
      if (blocked) {
        console.log('   CF blocked season page');
        continue;
      }
      await clickShowMore(page);
      const eps = await collectSeasonEpisodes(page, season);
      console.log('   found', eps.length);
      for (const e of eps) {
        const key = `${e.season}-${e.ep}`;
        if (seen.has(key)) continue;
        seen.add(key);
        all.push(e);
      }
    } catch (e) {
      console.warn('   season err', e.message);
    }
  }
  await page.close();
  all.sort((a, b) => a.season - b.season || a.ep - b.ep);
  return {
    seriesId: SERIES_ID,
    slug: SLUG,
    title: TITLE,
    poster: meta.poster,
    seriesUrl: SERIES_URL,
    episodes: all.map((e) => ({
      season: e.season,
      ep: e.ep,
      name: `עונה ${e.season} פרק ${e.ep}`,
      page: e.page,
      imageURL: e.imageURL || '',
      streamURL: ''
    }))
  };
}

async function captureImages(context, data) {
  const page = await context.newPage();
  const saved = new Map();
  page.on('response', async (res) => {
    try {
      const ct = (res.headers()['content-type'] || '').toLowerCase();
      if (!ct.includes('image')) return;
      const url = res.url();
      if (!/kan\.org\.il\/media|kanstatic|imgid/i.test(url)) return;
      const buf = await res.body();
      if (!buf || buf.length < 2000) return;
      saved.set(url, buf);
      saved.set(url.split('?')[0], buf);
    } catch (e) {}
  });

  await page.goto(SERIES_URL, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(2500);

  // series poster
  const seriesJpg = path.join(IMG_DIR, 'series.jpg');
  if (data.poster) {
    try {
      const r = await page.goto(data.poster, { waitUntil: 'load', timeout: 60000 });
      if (r) {
        const buf = await r.body();
        if (buf && buf.length > 2000) {
          fs.writeFileSync(seriesJpg, buf);
          data.localPoster = `images/kanbox/${SLUG}/series.jpg`;
        }
      }
    } catch (e) {}
    await page.goto(SERIES_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(1500);
  }

  for (const season of SEASONS) {
    await clickSeason(page, season);
    await clickShowMore(page);
    await page.waitForTimeout(800);
  }
  await page.close();

  let ok = 0;
  for (const ep of data.episodes) {
    const localRel = `images/kanbox/${SLUG}/s${ep.season}-ep${ep.ep}.jpg`;
    const dest = path.join(ROOT, localRel);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      ep.localImage = localRel;
      ok++;
      continue;
    }
    let wrote = false;
    if (ep.imageURL) {
      for (const k of [ep.imageURL, ep.imageURL.split('?')[0]]) {
        if (saved.has(k)) {
          fs.writeFileSync(dest, saved.get(k));
          wrote = true;
          break;
        }
      }
    }
    if (!wrote && ep.imageURL) {
      const p = await context.newPage();
      try {
        const r = await p.goto(ep.imageURL, { waitUntil: 'load', timeout: 45000 });
        if (r) {
          const buf = await r.body();
          if (buf && buf.length > 2000) {
            fs.writeFileSync(dest, buf);
            wrote = true;
          }
        }
      } catch (e) {}
      await p.close();
    }
    if (wrote) {
      ep.localImage = localRel;
      ok++;
    }
  }
  console.log(`Images ${ok}/${data.episodes.length}`);
}

async function fillStreams(context, data) {
  const need = data.episodes.filter((e) => !e.streamURL);
  console.log('Filling streams', need.length);
  let i = 0;
  let done = 0;

  async function worker() {
    while (i < need.length) {
      const idx = i++;
      const ep = need[idx];
      const page = await context.newPage();
      const urls = [];
      page.on('request', (r) => {
        if (/\/vod\/[0-9a-z_]+\//i.test(r.url())) urls.push(r.url());
      });
      try {
        await page.goto(ep.page, { waitUntil: 'domcontentloaded', timeout: 90000 });
        await page.waitForTimeout(1500);
        let html = await page.content();
        if (/been blocked/i.test(html)) {
          console.log(`[${done + 1}] blocked s${ep.season}e${ep.ep}`);
          await page.close();
          done++;
          continue;
        }
        if (/כבר לא זמין|לא זמין לצפייה/i.test(html)) {
          ep.unavailable = true;
          console.log(`[${++done}/${need.length}] s${ep.season}e${ep.ep} UNAVAIL`);
          await page.close();
          continue;
        }
        let entry = extractEntryId(html, urls);
        if (!entry) {
          try {
            await page.click('[class*="play"]', { timeout: 3000 });
          } catch (e) {}
          try {
            await page.click('button[aria-label="ניגון"]', { timeout: 2000, force: true });
          } catch (e) {}
          await page.waitForTimeout(7000);
          html = await page.content();
          entry = extractEntryId(html, urls);
        }
        if (entry) {
          ep.streamURL = streamFromEntry(entry);
          ep.entryId = entry;
        }
        done++;
        if (done % 5 === 0 || !ep.streamURL) {
          console.log(
            `[${done}/${need.length}] s${ep.season}e${ep.ep} ${ep.streamURL ? 'OK ' + entry : 'FAIL'}`
          );
        }
      } catch (err) {
        done++;
        console.warn(`err s${ep.season}e${ep.ep}`, err.message);
      } finally {
        await page.close();
      }
      if (done % 15 === 0) fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
    }
  }

  const workers = [];
  for (let w = 0; w < CONCURRENCY; w++) workers.push(worker());
  await Promise.all(workers);
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function mergeIntoChannels(data) {
  const src = fs.readFileSync(CHANNELS, 'utf8');
  const poster = data.localPoster || `images/kanbox/${SLUG}/series.jpg`;
  const lines = [
    '    {',
    `        id: '${SLUG}',`,
    `        name: '${esc(data.title)}',`,
    `        placeholder: '${esc(data.title)}',`,
    `        imageURL: '${poster}',`,
    `        source: 'kan',`,
    '        episodes: ['
  ];
  const eps = data.episodes.slice().sort((a, b) => a.season - b.season || a.ep - b.ep);
  const multi = new Set(eps.map((e) => e.season)).size > 1;
  eps.forEach((ep, i) => {
    const id = multi ? `${SLUG}-s${ep.season}-ep${ep.ep}` : `${SLUG}-ep${ep.ep}`;
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
  console.log('Merged', eps.length, 'into channels.js as', SLUG);
}

async function main() {
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

  const data = await scrapeList(context);
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
  console.log('Episode list', data.episodes.length);

  console.log('Capturing images…');
  await captureImages(context, data);
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));

  await fillStreams(context, data);
  await browser.close();

  // fill any remaining images from episode pages
  const browser2 = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context2 = await browser2.newContext({
    locale: 'he-IL',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });
  for (const ep of data.episodes.filter((e) => !e.localImage)) {
    const dest = path.join(IMG_DIR, `s${ep.season}-ep${ep.ep}.jpg`);
    const page = await context2.newPage();
    try {
      await page.goto(ep.page, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(1500);
      const og = await page.evaluate(
        () => (document.querySelector('meta[property="og:image"]') || {}).content || ''
      );
      if (og) {
        ep.imageURL = og;
        const r = await page.goto(og, { waitUntil: 'load', timeout: 45000 }).catch(() => null);
        if (r) {
          const buf = await r.body();
          if (buf && buf.length > 2000) {
            fs.writeFileSync(dest, buf);
            ep.localImage = `images/kanbox/${SLUG}/s${ep.season}-ep${ep.ep}.jpg`;
          }
        }
      }
    } catch (e) {}
    await page.close();
  }
  await browser2.close();

  if (!data.localPoster && fs.existsSync(path.join(IMG_DIR, 'series.jpg'))) {
    data.localPoster = `images/kanbox/${SLUG}/series.jpg`;
  } else if (!data.localPoster) {
    const first = data.episodes.find((e) => e.localImage);
    if (first) {
      fs.copyFileSync(path.join(ROOT, first.localImage), path.join(IMG_DIR, 'series.jpg'));
      data.localPoster = `images/kanbox/${SLUG}/series.jpg`;
    }
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
  mergeIntoChannels(data);

  const by = {};
  data.episodes.forEach((e) => {
    by[e.season] = by[e.season] || { n: 0, ok: 0, img: 0 };
    by[e.season].n++;
    if (e.streamURL) by[e.season].ok++;
    if (e.localImage) by[e.season].img++;
  });
  console.log('\nDone', TITLE);
  console.log(by);
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
