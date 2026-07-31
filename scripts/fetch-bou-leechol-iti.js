#!/usr/bin/env node
/**
 * Scrape בואו לאכול איתי (p-11843) — all 10 seasons, streams, images → merge into channels.js
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const https = require('https');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const SERIES_URL = 'https://www.kan.org.il/content/kan/kan-11/p-11843/';
const SERIES_ID = '11843';
const SLUG = 'bou-leechol-iti';
const TITLE = 'בואו לאכול איתי';
const SEASONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const JSON_PATH = path.join(__dirname, `kanbox-${SLUG}.json`);
const IMG_DIR = path.join(ROOT, 'images', 'kanbox', SLUG);
const CHANNELS = path.join(ROOT, 'js', 'channels.js');

function isStreamCandidate(url) {
  if (!url) return false;
  const u = url.toLowerCase();
  if (u.includes('bitrate=') && u.includes('&bitrate=') && u.includes('id=') && !u.includes('fmp4')) {
    return false;
  }
  return (
    (u.includes('manifest.ism') && u.includes('playlist.m3u8')) ||
    u.includes('playlist.m3u8?fmp4') ||
    (u.includes('cdn-redge') && u.includes('/vod/') && (u.includes('manifest.ism') || u.includes('.m3u8'))) ||
    (u.includes('kaltura.com') && (u.includes('playmanifest') || u.includes('.m3u8') || u.includes('applehttp')))
  );
}

function normalizeHls(url) {
  if (!url) return '';
  let u = url.split('#')[0];
  if (u.includes('Manifest.ism') && !u.includes('playlist.m3u8')) {
    u = u.replace('/dash/', '/hls/').replace(/\?.*$/, '') + '/playlist.m3u8?fmp4';
  }
  if (u.includes('playlist.m3u8') && u.includes('cdn-redge') && !u.includes('fmp4')) {
    u = u.split('?')[0] + '?fmp4';
  }
  return u;
}

function scoreStreamUrl(url) {
  const u = (url || '').toLowerCase();
  let score = 0;
  if (u.includes('playlist.m3u8') && u.includes('fmp4')) score += 100;
  if (u.includes('/hls/')) score += 50;
  if (u.includes('playlist.m3u8')) score += 40;
  if (u.includes('kaltura') && u.includes('applehttp')) score += 35;
  if (u.includes('manifest.ism') && !u.includes('m3u8')) score += 10;
  if (u.includes('bitrate=') && u.includes('id=')) score -= 80;
  return score;
}

async function clickShowMore(page) {
  for (let i = 0; i < 20; i++) {
    const more = await page.$(
      '#vod-page-items-show-more button, button:has-text("טען עוד"), button:has-text("עוד"), a:has-text("הצג עוד")'
    );
    if (!more) break;
    try {
      await more.click({ timeout: 1500 });
      await page.waitForTimeout(800);
    } catch (e) {
      break;
    }
  }
}

async function clickSeason(page, season) {
  const clicked = await page.evaluate((season) => {
    const els = Array.from(document.querySelectorAll('button, a, [role="tab"], li, span, div'));
    for (const el of els) {
      const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (t === `עונה ${season}` || t === `Season ${season}` || t === String(season)) {
        try {
          el.click();
          return t;
        } catch (e) {}
      }
    }
    return '';
  }, season);
  await page.waitForTimeout(1500);
  return !!clicked;
}

async function collectSeasonEpisodes(page, season) {
  return page.evaluate(
    ({ seriesId, season }) => {
      const anchors = Array.from(
        document.querySelectorAll(`a[href*="/p-${seriesId}/s${season}/"], a[href*="/p-${seriesId}/"]`)
      );
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

        let epNum = null;
        const mDash = text.match(/פרק\s*(\d+)/);
        if (mDash) epNum = Number(mDash[1]);
        else return;

        const img = a.querySelector('img');
        let imageURL = '';
        if (img) {
          imageURL = img.currentSrc || img.src || img.getAttribute('data-src') || '';
        }

        out.push({
          season,
          ep: epNum,
          page: href,
          imageURL,
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

async function scrapeAllEpisodes(context) {
  const page = await context.newPage();
  console.log('Opening series page…');
  await page.goto(SERIES_URL, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(4000);

  const poster =
    (await page.evaluate(() => {
      const og = document.querySelector('meta[property="og:image"]');
      return og ? og.getAttribute('content') || '' : '';
    })) || '';

  const all = [];
  const seen = new Set();

  for (const season of SEASONS) {
    console.log(`-- Season ${season}`);
    const ok = await clickSeason(page, season);
    console.log(`   tab: ${ok ? 'ok' : 'miss'}`);
    await clickShowMore(page);
    const eps = await collectSeasonEpisodes(page, season);
    console.log(`   found ${eps.length} episodes`);
    for (const e of eps) {
      const key = `${e.season}-${e.ep}`;
      if (seen.has(key)) continue;
      seen.add(key);
      all.push(e);
    }
  }

  await page.close();
  all.sort((a, b) => a.season - b.season || a.ep - b.ep);
  return { poster, episodes: all };
}

function ytDlpStream(pageUrl) {
  const r = spawnSync(
    'yt-dlp',
    [
      '--dump-json',
      '--no-download',
      '--no-warnings',
      '--extractor-args',
      'generic:impersonate',
      pageUrl
    ],
    { encoding: 'utf8', timeout: 90000, maxBuffer: 20 * 1024 * 1024 }
  );
  if (r.status !== 0 || !r.stdout) {
    return '';
  }
  try {
    const info = JSON.parse(r.stdout);
    const urls = [];
    if (info.url) urls.push(info.url);
    if (Array.isArray(info.formats)) {
      info.formats.forEach((f) => {
        if (f.url) urls.push(f.url);
        if (f.manifest_url) urls.push(f.manifest_url);
      });
    }
    if (info.manifest_url) urls.push(info.manifest_url);
    const candidates = urls.filter(isStreamCandidate).map((u) => normalizeHls(u));
    candidates.sort((a, b) => scoreStreamUrl(b) - scoreStreamUrl(a));
    return candidates[0] || '';
  } catch (e) {
    return '';
  }
}

async function fetchStreamPlaywright(context, episode) {
  const page = await context.newPage();
  const candidates = [];
  const consider = (url) => {
    if (!isStreamCandidate(url)) return;
    candidates.push(normalizeHls(url));
  };
  page.on('request', (req) => consider(req.url()));
  page.on('response', (res) => consider(res.url()));
  try {
    await page.goto(episode.page, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(1500);
    for (const sel of [
      'button[aria-label="ניגון"]',
      'button[aria-label*="ניגון"]',
      'button[aria-label*="Play"]',
      '.rgpl-btn-undefined',
      'button.play',
      'video'
    ]) {
      const el = await page.$(sel);
      if (!el) continue;
      try {
        await el.click({ timeout: 2000 });
        break;
      } catch (e) {}
    }
    const started = Date.now();
    while (Date.now() - started < 16000) {
      if (candidates.some((u) => scoreStreamUrl(u) >= 35)) break;
      await page.waitForTimeout(400);
    }
  } catch (err) {
    console.warn('  pw err', err.message);
  } finally {
    await page.close();
  }
  candidates.sort((a, b) => scoreStreamUrl(b) - scoreStreamUrl(a));
  return candidates[0] || '';
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
          Referer: 'https://www.kan.org.il/',
          Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
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

async function captureImagesViaBrowser(context, data) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  const hub = path.join(ROOT, 'images', 'vod', 'hub.jpg');
  const seriesJpg = path.join(IMG_DIR, 'series.jpg');
  if (fs.existsSync(hub)) {
    fs.copyFileSync(hub, seriesJpg);
    data.localPoster = `images/kanbox/${SLUG}/series.jpg`;
    console.log('Copied hub poster → series.jpg');
  } else if (data.poster) {
    const ok = await downloadFile(data.poster, seriesJpg);
    if (ok) data.localPoster = `images/kanbox/${SLUG}/series.jpg`;
  }

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
      saved.set(url.split('?')[0], buf);
      // also key by full url
      saved.set(url, buf);
    } catch (e) {}
  });

  await page.goto(SERIES_URL, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(2500);

  for (const season of SEASONS) {
    await clickSeason(page, season);
    await clickShowMore(page);
    await page.waitForTimeout(800);
  }
  await page.close();

  let okCount = 0;
  for (const ep of data.episodes) {
    const localRel = `images/kanbox/${SLUG}/s${ep.season}-ep${ep.ep}.jpg`;
    const dest = path.join(ROOT, localRel);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      ep.localImage = localRel;
      okCount++;
      continue;
    }
    let wrote = false;
    if (ep.imageURL) {
      const keys = [ep.imageURL, ep.imageURL.split('?')[0]];
      for (const k of keys) {
        if (saved.has(k)) {
          fs.writeFileSync(dest, saved.get(k));
          wrote = true;
          break;
        }
      }
      if (!wrote) {
        wrote = await downloadFile(ep.imageURL, dest);
      }
    }
    if (wrote) {
      ep.localImage = localRel;
      okCount++;
    }
  }
  console.log(`Images saved: ${okCount}/${data.episodes.length}`);
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function mergeIntoChannels(data) {
  const src = fs.readFileSync(CHANNELS, 'utf8');
  if (src.includes(`id: '${SLUG}'`)) {
    console.log('Series already in channels.js — replacing block');
  }

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
    const img =
      ep.localImage || `images/kanbox/${SLUG}/s${ep.season}-ep${ep.ep}.jpg`;
    const name = `עונה ${ep.season} פרק ${ep.ep}`;
    lines.push('            {');
    lines.push(`                id: '${id}',`);
    lines.push(`                season: ${ep.season},`);
    lines.push(`                ep: ${ep.ep},`);
    lines.push(`                name: '${esc(name)}',`);
    lines.push(`                streamURL: '${ep.streamURL || ''}',`);
    lines.push(`                imageURL: '${img}',`);
    lines.push(`                placeholder: '${ep.ep}'`);
    lines.push(i < eps.length - 1 ? '            },' : '            }');
  });
  lines.push('        ]');
  lines.push('    }');
  const block = lines.join('\n');

  let next;
  const re = new RegExp(`\\n    \\{\\n        id: '${SLUG}',[\\s\\S]*?\\n    \\}`, 'm');
  if (re.test(src)) {
    next = src.replace(re, '\n' + block);
  } else {
    // Insert before closing of ISRTV_KANBOX: last `];` after kanbox
    const marker = '\n];\n';
    const idx = src.lastIndexOf(marker);
    if (idx < 0) throw new Error('Could not find end of channels.js array');
    // find last series closing before ];
    const before = src.slice(0, idx);
    const insertAt = before.lastIndexOf('\n    }');
    if (insertAt < 0) throw new Error('Could not find last series');
    next = before.slice(0, insertAt + 6) + ',\n' + block + before.slice(insertAt + 6) + src.slice(idx);
  }

  fs.writeFileSync(CHANNELS, next);
  console.log(`Merged ${eps.length} episodes into channels.js`);
}

async function main() {
  const playwright = require('playwright');
  fs.mkdirSync(IMG_DIR, { recursive: true });

  let data;
  if (fs.existsSync(JSON_PATH) && process.argv.includes('--resume')) {
    data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
    console.log(`Resume from ${JSON_PATH} (${data.episodes.length} eps)`);
  } else {
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

    const scraped = await scrapeAllEpisodes(context);
    data = {
      seriesId: SERIES_ID,
      slug: SLUG,
      title: TITLE,
      poster: scraped.poster,
      seriesUrl: SERIES_URL,
      episodes: scraped.episodes.map((e) => ({
        season: e.season,
        ep: e.ep,
        name: `עונה ${e.season} פרק ${e.ep}`,
        page: e.page,
        imageURL: e.imageURL || '',
        streamURL: ''
      }))
    };
    fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
    console.log(`Wrote episode list: ${data.episodes.length}`);

    console.log('Capturing images…');
    await captureImagesViaBrowser(context, data);
    fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));

    await browser.close();
  }

  // Streams via yt-dlp (fast), playwright fallback for misses
  const need = data.episodes.filter((e) => !e.streamURL);
  console.log(`Fetching streams for ${need.length} episodes…`);
  let n = 0;
  for (const ep of data.episodes) {
    if (ep.streamURL) continue;
    n++;
    process.stdout.write(`[${n}/${need.length}] s${ep.season}e${ep.ep} `);
    let url = ytDlpStream(ep.page);
    if (!url) {
      process.stdout.write('(yt-dlp miss) ');
    }
    ep.streamURL = url || '';
    console.log(url ? url.slice(0, 80) + '…' : 'FAIL');
    if (n % 10 === 0) fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
  }
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));

  const missing = data.episodes.filter((e) => !e.streamURL);
  if (missing.length) {
    console.log(`Playwright fallback for ${missing.length}…`);
    const browser = await playwright.chromium.launch({
      headless: false,
      args: ['--disable-blink-features=AutomationControlled']
    });
    const context = await browser.newContext({
      locale: 'he-IL',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    });
    for (const ep of missing) {
      const url = await fetchStreamPlaywright(context, ep);
      ep.streamURL = url || '';
      console.log(`  s${ep.season}e${ep.ep} → ${url ? 'ok' : 'FAIL'}`);
      fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
    }
    await browser.close();
  }

  // Ensure images for any still missing via direct download
  for (const ep of data.episodes) {
    if (ep.localImage) continue;
    const localRel = `images/kanbox/${SLUG}/s${ep.season}-ep${ep.ep}.jpg`;
    const dest = path.join(ROOT, localRel);
    if (ep.imageURL && (await downloadFile(ep.imageURL, dest))) {
      ep.localImage = localRel;
    }
  }
  if (!data.localPoster) {
    const hub = path.join(ROOT, 'images', 'vod', 'hub.jpg');
    const seriesJpg = path.join(IMG_DIR, 'series.jpg');
    if (fs.existsSync(hub)) {
      fs.copyFileSync(hub, seriesJpg);
      data.localPoster = `images/kanbox/${SLUG}/series.jpg`;
    }
  }
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));

  mergeIntoChannels(data);

  const withStream = data.episodes.filter((e) => e.streamURL).length;
  const withImg = data.episodes.filter((e) => e.localImage).length;
  const seasons = [...new Set(data.episodes.map((e) => e.season))].sort((a, b) => a - b);
  console.log('\nDone.');
  console.log(`  seasons: ${seasons.join(',')}`);
  console.log(`  episodes: ${data.episodes.length}`);
  console.log(`  streams: ${withStream}/${data.episodes.length}`);
  console.log(`  images: ${withImg}/${data.episodes.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
