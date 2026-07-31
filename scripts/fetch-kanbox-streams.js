#!/usr/bin/env node
/**
 * Fetch KanBox episode stream URLs for a Kan series page.
 *
 * Usage:
 *   cd scripts
 *   node fetch-kanbox-streams.js --headed --series https://www.kan.org.il/content/kan/kan-11/p-984859/
 *   node fetch-kanbox-streams.js --headed --series URL --out mothers.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = {
    headed: false,
    series: 'https://www.kan.org.il/content/kan/kan-11/p-1033206/',
    out: path.join(ROOT, 'scripts', 'kanbox-streams.json'),
    slug: ''
  };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--headed') args.headed = true;
    if (argv[i] === '--series' && argv[i + 1]) args.series = argv[++i];
    if (argv[i] === '--out' && argv[i + 1]) args.out = path.resolve(argv[++i]);
    if (argv[i] === '--slug' && argv[i + 1]) args.slug = argv[++i];
  }
  return args;
}

function seriesKeyFromUrl(seriesUrl) {
  const m = String(seriesUrl).match(/p-(\d+)/);
  return m ? m[1] : 'series';
}

function isStreamCandidate(url) {
  if (!url) return false;
  const u = url.toLowerCase();
  if (u.includes('bitrate=') && !u.includes('playlist.m3u8?fmp4') && u.includes('&bitrate=')) {
    // skip quality variants, keep master playlist.m3u8?fmp4
    if (/bitrate=\d+/.test(u) && u.includes('id=')) return false;
  }
  return (
    (u.includes('manifest.ism') && u.includes('playlist.m3u8')) ||
    u.includes('playlist.m3u8?fmp4') ||
    (u.includes('cdn-redge') && u.includes('/vod/') && u.includes('manifest.ism')) ||
    (u.includes('cdn-redge') && u.includes('/vod/') && u.includes('.m3u8')) ||
    (u.includes('kaltura.com') && (u.includes('playmanifest') || u.includes('.m3u8')))
  );
}

function cleanStreamUrl(url) {
  try {
    const parsed = new URL(url);
    const pathLower = parsed.pathname.toLowerCase();
    if (pathLower.endsWith('playlist.m3u8')) {
      // keep ?fmp4 only
      if (parsed.searchParams.has('fmp4') || parsed.search === '?fmp4') {
        return parsed.origin + parsed.pathname + '?fmp4';
      }
      return parsed.origin + parsed.pathname + (parsed.search || '');
    }
    if (pathLower.endsWith('manifest.ism')) {
      parsed.search = '';
      parsed.hash = '';
      return parsed.toString();
    }
    return url.split('#')[0];
  } catch (e) {
    return url;
  }
}

function scoreStreamUrl(url) {
  const u = url.toLowerCase();
  let score = 0;
  if (u.includes('playlist.m3u8') && u.includes('fmp4')) score += 100;
  if (u.includes('/hls/')) score += 50;
  if (u.includes('playlist.m3u8')) score += 30;
  if (u.includes('manifest.ism') && !u.includes('m3u8')) score += 10;
  if (u.includes('bitrate=') && u.includes('id=')) score -= 80;
  return score;
}

async function scrapeSeries(page, seriesUrl) {
  await page.goto(seriesUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(3000);

  // Click "show more" if present
  for (let i = 0; i < 8; i++) {
    const more = await page.$('#vod-page-items-show-more button, .show-more, button:has-text("עוד"), a:has-text("הצג עוד")');
    if (!more) break;
    try {
      await more.click({ timeout: 1500 });
      await page.waitForTimeout(800);
    } catch (e) {
      break;
    }
  }

  return page.evaluate((seriesUrlEval) => {
    const seriesMatch = seriesUrlEval.match(/p-(\d+)/);
    const seriesId = seriesMatch ? seriesMatch[1] : '';
    const titleEl =
      document.querySelector('h1') ||
      document.querySelector('.title-main') ||
      document.querySelector('meta[property="og:title"]');
    let title = '';
    if (titleEl) {
      title = titleEl.getAttribute('content') || titleEl.textContent || '';
      title = title.split('|')[0].trim();
    }

    const poster =
      (document.querySelector('meta[property="og:image"]') &&
        document.querySelector('meta[property="og:image"]').getAttribute('content')) ||
      '';

    const out = [];
    const anchors = Array.from(
      document.querySelectorAll(`a[href*="/p-${seriesId}/s"], a.card-link[href*="/p-${seriesId}/"]`)
    );

    anchors.forEach((a) => {
      const href = a.href;
      if (!/\/s\d+\/\d+\/?$/.test(href.replace(/\/$/, '') + '/'.replace(/\/\/$/, '/'))) {
        // require episode id path .../s1/12345/
        if (!new RegExp(`/p-${seriesId}/s\\d+/\\d+`).test(href)) return;
      }
      if (!new RegExp(`/p-${seriesId}/s\\d+/\\d+`).test(href)) return;

      const titleNode = a.querySelector('.card-title, .title, [class*="title"]');
      const img = a.querySelector('img');
      // Prefer full anchor text — card-title alone often lacks "פרק N - title"
      let text = (a.textContent || a.getAttribute('title') || (titleNode && titleNode.textContent) || '')
        .replace(/\s+/g, ' ')
        .trim();
      // Drop leading duration like "00:33:10 "
      text = text.replace(/^\d{1,2}:\d{2}(?::\d{2})?\s+/, '');

      let epNum = null;
      let namePart = '';
      const mDash = text.match(/פרק\s*(\d+)\s*[-–]\s*(.+?)(?:\s{2,}|$)/) || text.match(/פרק\s*(\d+)\s*[-–]\s*(.+)/);
      const mPlain = text.match(/פרק\s*(\d+)\s+(.+)/);
      const mLast = text.match(/פרק\s*אחרון(?:\s+לעונה)?\s*(.*)/);

      if (mDash) {
        epNum = Number(mDash[1]);
        namePart = mDash[2];
      } else if (mPlain) {
        epNum = Number(mPlain[1]);
        namePart = mPlain[2];
      } else if (mLast) {
        epNum = 999; // resolve after collecting numbered eps
        namePart = (mLast[1] || 'פרק אחרון').trim() || 'פרק אחרון';
      } else {
        return;
      }

      // If namePart is huge (synopsis), keep a short version
      namePart = namePart.replace(/\.\s*כאן.*$/i, '').trim();
      if (namePart.length > 60) {
        namePart = namePart.slice(0, 57).replace(/\s+\S*$/, '') + '…';
      }
      out.push({
        ep: epNum,
        namePart,
        page: href.split('?')[0],
        imageURL: img ? img.src || img.getAttribute('data-src') || '' : ''
      });
    });

    const map = new Map();
    out.forEach((e) => {
      if (!map.has(e.ep)) map.set(e.ep, e);
    });

    const numbered = Array.from(map.values())
      .filter((e) => e.ep !== 999)
      .sort((a, b) => a.ep - b.ep);
    const lastEps = Array.from(map.values()).filter((e) => e.ep === 999);
    if (lastEps.length) {
      const nextEp = numbered.length ? numbered[numbered.length - 1].ep + 1 : 1;
      lastEps.forEach((e, i) => {
        numbered.push({ ...e, ep: nextEp + i });
      });
    }

    const episodes = numbered.map((e) => ({
      ep: e.ep,
      name: `פרק ${e.ep} - ${e.namePart}`,
      page: e.page,
      imageURL: e.imageURL
    }));

    return {
      seriesId,
      title: (title || `Series ${seriesId}`).replace(/\.?\s*כאן.*$/i, '').trim(),
      poster,
      episodes
    };
  }, seriesUrl);
}

async function fetchStreamForEpisode(context, episode) {
  const page = await context.newPage();
  const candidates = [];

  const consider = (url) => {
    if (!isStreamCandidate(url)) return;
    candidates.push(cleanStreamUrl(url));
  };

  page.on('request', (req) => consider(req.url()));
  page.on('response', (res) => consider(res.url()));

  try {
    console.log(`\n[${episode.ep}] Opening ${episode.page}`);
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
      '[class*="Play"]',
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
    console.warn(`[${episode.ep}] Error:`, err.message);
  } finally {
    await page.close();
  }

  candidates.sort((a, b) => scoreStreamUrl(b) - scoreStreamUrl(a));
  return candidates[0] || '';
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let playwright;
  try {
    playwright = require('playwright');
  } catch (e) {
    console.error('Playwright is required. Run: cd scripts && npm install && npx playwright install chromium');
    process.exit(1);
  }

  const browser = await playwright.chromium.launch({
    headless: !args.headed,
    args: ['--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    locale: 'he-IL',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1400, height: 900 }
  });

  const seriesPage = await context.newPage();
  console.log('Loading series:', args.series);
  const scraped = await scrapeSeries(seriesPage, args.series);
  await seriesPage.close();

  const slug = args.slug || `kan-${scraped.seriesId}`;
  const episodes = (scraped.episodes || []).map((e) => ({
    id: `${slug}-ep${e.ep}`,
    ep: e.ep,
    name: e.name,
    page: e.page,
    imageURL: e.imageURL || ''
  }));

  console.log(`Series: ${scraped.title}`);
  console.log(`Found ${episodes.length} episodes`);

  if (!episodes.length) {
    console.error('No episodes found.');
    await browser.close();
    process.exit(1);
  }

  const results = [];
  for (const episode of episodes) {
    const streamURL = await fetchStreamForEpisode(context, episode);
    console.log(`[${episode.ep}] ${streamURL || 'NOT FOUND'}`);
    results.push({
      id: episode.id,
      ep: episode.ep,
      name: episode.name,
      page: episode.page,
      imageURL: episode.imageURL,
      streamURL: streamURL || ''
    });
  }

  const payload = {
    seriesId: scraped.seriesId,
    slug,
    title: scraped.title,
    poster: scraped.poster,
    seriesUrl: args.series,
    episodes: results
  };

  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, JSON.stringify(payload, null, 2));
  console.log(`\nWrote ${args.out}`);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
