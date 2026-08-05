#!/usr/bin/env node
/**
 * Scrape Kan series that use flat episode URLs: /p-{id}/{episodeId}/
 * (no /s1/ season segment)
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');

const SERIES = [
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-12487/', slug: 'hidat-meshulam' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-13205/', slug: 'hapartisan-haachron' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-12527/', slug: 'dor-echad-vachetsi' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-12274/', slug: 'tik-512' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-13015/', slug: 'peduyim' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-12798/', slug: 'pollard' }
];

function isStreamCandidate(url) {
  if (!url) return false;
  const u = url.toLowerCase();
  if (u.includes('bitrate=') && u.includes('&bitrate=') && u.includes('id=')) return false;
  return (
    (u.includes('manifest.ism') && u.includes('playlist.m3u8')) ||
    u.includes('playlist.m3u8?fmp4') ||
    (u.includes('cdn-redge') && u.includes('/vod/') && (u.includes('manifest.ism') || u.includes('.m3u8')))
  );
}

function cleanStreamUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.pathname.toLowerCase().endsWith('playlist.m3u8')) {
      return parsed.origin + parsed.pathname + '?fmp4';
    }
    return url.split('#')[0];
  } catch (e) {
    return url;
  }
}

function normalizeHls(url) {
  if (!url) return '';
  let u = url.split('#')[0];
  if (u.includes('Manifest.ism') && !u.includes('playlist.m3u8')) {
    u = u.replace('/dash/', '/hls/').replace(/\?.*$/, '') + '/playlist.m3u8?fmp4';
  }
  return u;
}

function scoreStreamUrl(url) {
  const u = url.toLowerCase();
  let score = 0;
  if (u.includes('playlist.m3u8') && u.includes('fmp4')) score += 100;
  if (u.includes('/hls/')) score += 50;
  if (u.includes('playlist.m3u8')) score += 30;
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

async function scrapeFlatSeries(page, seriesUrl, slugHint) {
  await page.goto(seriesUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(3500);
  await clickShowMore(page);

  return page.evaluate(
    ({ seriesUrlEval, slugHintEval }) => {
      const seriesMatch = seriesUrlEval.match(/p-(\d+)/);
      const seriesId = seriesMatch ? seriesMatch[1] : '';
      const ogTitle = document.querySelector('meta[property="og:title"]');
      let title = (ogTitle && ogTitle.getAttribute('content')) || '';
      title = title.split('|')[0].trim();
      title = title.replace(/\s*-\s*פרקים.*$/i, '').trim();
      title = title.replace(/\s*–\s*פרקים.*$/i, '').trim();
      title = title.replace(/\.?\s*כאן.*$/i, '').trim();
      title = title.replace(/\s*לצפייה ישירה.*$/i, '').trim();
      title = title.replace(/\s*-\s*הסרט המלא.*$/i, '').trim();

      const poster =
        (document.querySelector('meta[property="og:image"]') &&
          document.querySelector('meta[property="og:image"]').getAttribute('content')) ||
        '';

      const anchors = Array.from(document.querySelectorAll(`a[href*="/p-${seriesId}/"]`));
      const out = [];
      anchors.forEach((a) => {
        const href = a.href.split('?')[0].split('#')[0];
        const m = href.match(new RegExp(`/p-${seriesId}/(\\d+)/?$`));
        if (!m) return;
        const pageId = m[1];
        const titleNode = a.querySelector('.card-title, .title, [class*="title"]');
        const img = a.querySelector('img');
        let text = (a.textContent || a.getAttribute('title') || (titleNode && titleNode.textContent) || '')
          .replace(/\s+/g, ' ')
          .trim();
        text = text.replace(/^\d{1,2}:\d{2}(?::\d{2})?\s+/, '');
        if (/טריילר|ריקאפ|קדימון|צריכים תזכורת/.test(text)) return;

        let epNum = null;
        const mEp = text.match(/פרק\s*(\d+)/);
        if (mEp) epNum = Number(mEp[1]);

        out.push({
          pageId,
          page: href,
          text,
          ep: epNum,
          imageURL: img ? img.src || img.getAttribute('data-src') || '' : ''
        });
      });

      const byPage = new Map();
      out.forEach((e) => {
        if (!byPage.has(e.page)) byPage.set(e.page, e);
      });
      let list = Array.from(byPage.values());
      // Sort by episode number when present, else by pageId
      list.sort((a, b) => {
        if (a.ep && b.ep) return a.ep - b.ep;
        if (a.ep) return -1;
        if (b.ep) return 1;
        return Number(a.pageId) - Number(b.pageId);
      });
      // Assign sequential ep numbers where missing
      const used = new Set(list.filter((e) => e.ep > 0).map((e) => e.ep));
      list.forEach((e) => {
        if (e.ep > 0) return;
        let n = 1;
        while (used.has(n)) n++;
        e.ep = n;
        used.add(n);
      });
      list.sort((a, b) => a.ep - b.ep);

      return {
        seriesId,
        title: title || `Series ${seriesId}`,
        poster,
        slug: slugHintEval || `kan-${seriesId}`,
        episodes: list.map((e) => ({
          season: 1,
          ep: e.ep,
          name: `עונה 1 פרק ${e.ep}`,
          page: e.page,
          imageURL: e.imageURL
        }))
      };
    },
    { seriesUrlEval: seriesUrl, slugHintEval: slugHint }
  );
}

async function fetchStreamForEpisode(context, episode) {
  const page = await context.newPage();
  const candidates = [];
  const consider = (url) => {
    if (!isStreamCandidate(url)) return;
    candidates.push(normalizeHls(cleanStreamUrl(url)));
  };
  page.on('request', (req) => consider(req.url()));
  page.on('response', (res) => consider(res.url()));

  try {
    console.log(`  [ep${episode.ep}] ${episode.page}`);
    await page.goto(episode.page, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(2000);
    const playSelectors = [
      'button[aria-label="ניגון"]',
      'button[aria-label*="ניגון"]',
      'button[aria-label*="Play"]',
      'button[aria-label*="נגן"]',
      'button[aria-label*="צפייה"]',
      '.rgpl-btn-undefined',
      '.play-button',
      'button.play',
      'video'
    ];
    for (const sel of playSelectors) {
      const el = await page.$(sel);
      if (!el) continue;
      try {
        await el.click({ timeout: 2000 });
        break;
      } catch (e) {}
    }
    const started = Date.now();
    while (Date.now() - started < 18000) {
      if (candidates.some((u) => scoreStreamUrl(u) >= 100)) break;
      await page.waitForTimeout(400);
    }
  } catch (err) {
    console.warn('  Error:', err.message);
  } finally {
    await page.close();
  }
  candidates.sort((a, b) => scoreStreamUrl(b) - scoreStreamUrl(a));
  return normalizeHls(candidates[0] || '');
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

function extFromUrl(url) {
  const m = String(url).match(/\.(jpe?g|png|webp)/i);
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
}

async function downloadImages(payload) {
  const dir = path.join(ROOT, 'images', 'kanbox', payload.slug);
  fs.mkdirSync(dir, { recursive: true });
  const seriesPath = path.join(dir, 'series.jpg');
  if (payload.poster) {
    await downloadFile(payload.poster, seriesPath);
  }
  for (const ep of payload.episodes) {
    const fname = `ep${ep.ep}.${extFromUrl(ep.imageURL)}`;
    const dest = path.join(dir, fname);
    const ok = await downloadFile(ep.imageURL, dest);
    ep.localImage = ok ? `images/kanbox/${payload.slug}/${fname}` : '';
  }
  if ((!fs.existsSync(seriesPath) || fs.statSync(seriesPath).size < 1000) &&
      payload.episodes[0] && payload.episodes[0].localImage) {
    fs.copyFileSync(path.join(ROOT, payload.episodes[0].localImage), seriesPath);
  }
  payload.localPoster = `images/kanbox/${payload.slug}/series.jpg`;
}

function toChannelsEntry(payload) {
  const lines = [];
  lines.push('    {');
  lines.push(`        id: '${payload.slug}',`);
  lines.push(`        name: '${payload.title.replace(/'/g, "\\'")}',`);
  lines.push(`        placeholder: '${payload.title.replace(/'/g, "\\'")}',`);
  lines.push(`        imageURL: '${payload.localPoster}',`);
  lines.push(`        source: 'kan',`);
  lines.push('        episodes: [');
  payload.episodes.forEach((ep, i) => {
    const id = `${payload.slug}-ep${ep.ep}`;
    const img = ep.localImage || '';
    lines.push('            {');
    lines.push(`                id: '${id}',`);
    lines.push(`                season: ${ep.season},`);
    lines.push(`                ep: ${ep.ep},`);
    lines.push(`                name: 'עונה ${ep.season} פרק ${ep.ep}',`);
    lines.push(`                streamURL: '${ep.streamURL || ''}',`);
    lines.push(`                imageURL: '${img}',`);
    lines.push(`                placeholder: '${ep.ep}'`);
    lines.push(i < payload.episodes.length - 1 ? '            },' : '            }');
  });
  lines.push('        ]');
  lines.push('    }');
  return lines.join('\n');
}

async function main() {
  const playwright = require('playwright');
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

  const fragmentParts = [];
  for (const item of SERIES) {
    console.log(`\n========== ${item.url} ==========`);
    const seriesPage = await context.newPage();
    let scraped;
    try {
      scraped = await scrapeFlatSeries(seriesPage, item.url, item.slug);
    } catch (err) {
      console.error('Scrape failed:', err.message);
      await seriesPage.close();
      continue;
    }
    await seriesPage.close();

    console.log(`Title: ${scraped.title}`);
    console.log(`Episodes: ${scraped.episodes.length}`);
    if (!scraped.episodes.length) {
      console.error('No episodes — skipping');
      continue;
    }

    for (const episode of scraped.episodes) {
      episode.streamURL = await fetchStreamForEpisode(context, episode);
      console.log(`  → ${episode.streamURL || 'NOT FOUND'}`);
    }

    const payload = {
      seriesId: scraped.seriesId,
      slug: scraped.slug,
      title: scraped.title,
      poster: scraped.poster,
      seriesUrl: item.url,
      episodes: scraped.episodes
    };
    await downloadImages(payload);
    const outJson = path.join(ROOT, 'scripts', `kanbox-${payload.slug}.json`);
    fs.writeFileSync(outJson, JSON.stringify(payload, null, 2));
    console.log(`Wrote ${outJson}`);
    fragmentParts.push(toChannelsEntry(payload));
  }

  const fragmentPath = path.join(ROOT, 'scripts', 'kanbox-flat-series-fragment.js');
  fs.writeFileSync(fragmentPath, fragmentParts.join(',\n') + '\n');
  console.log(`\nWrote fragment: ${fragmentPath}`);
  console.log(`Done: ${fragmentParts.length} series`);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
