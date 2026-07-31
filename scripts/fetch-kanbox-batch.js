#!/usr/bin/env node
/**
 * Batch-scrape Kan series (all seasons), download images, emit channels.js fragment.
 *
 * Usage:
 *   cd scripts
 *   node fetch-kanbox-batch.js [--headed]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');

const SERIES = [
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-12169/', slug: 'series-12169' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-12487/', slug: 'series-12487' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-12582/', slug: 'series-12582' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-12614/', slug: 'series-12614' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-13283/', slug: 'series-13283' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-13205/', slug: 'series-13205' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-12210/', slug: 'series-12210' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-12781/', slug: 'series-12781' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-12527/', slug: 'series-12527' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-12274/', slug: 'series-12274' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-13015/', slug: 'series-13015' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-12798/', slug: 'series-12798' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-12154/', slug: 'series-12154' }
];

function parseArgs(argv) {
  return { headed: argv.includes('--headed') };
}

function isStreamCandidate(url) {
  if (!url) return false;
  const u = url.toLowerCase();
  if (u.includes('bitrate=') && !u.includes('playlist.m3u8?fmp4') && u.includes('&bitrate=')) {
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
      return parsed.origin + parsed.pathname + '?fmp4';
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
  if (u.includes('manifest.ism') && !u.includes('m3u8')) score += 10;
  if (u.includes('bitrate=') && u.includes('id=')) score -= 80;
  return score;
}

function slugifyTitle(title) {
  const map = {
    'מלאך משחית': 'malach-mashchit',
    'איסט סייד': 'east-side',
    'אבירם כץ': 'aviram-katz',
    'שעת אפס': 'shaat-efes',
    'מתיר עגונות': 'matir-agunot',
    'תיק נעדר': 'tik-needar',
    'הד קולך': 'hed-kolech',
    'הדבר הגדול המיוחד': 'hadavar-hagadol',
    'אחד על אחד': 'echad-al-echad',
    'האיש שניסה למנוע מלחמה': 'haish-shemenaa',
    התסריטאי: 'hatasritai',
    'תפוחים מן המדבר': 'tapuchim-midbar'
  };
  for (const [he, en] of Object.entries(map)) {
    if (title.includes(he)) return en;
  }
  return null;
}

async function clickShowMore(page) {
  for (let i = 0; i < 15; i++) {
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

async function listSeasonNumbers(page, seriesId) {
  const fromDom = await page.evaluate(() => {
    const nums = new Set();
    const labels = Array.from(
      document.querySelectorAll('button, a, [role="tab"], .season-tab, [class*="season"]')
    );
    labels.forEach((el) => {
      const t = (el.textContent || '').trim();
      const m = t.match(/^עונה\s*(\d+)$/) || t.match(/^Season\s*(\d+)$/i);
      if (m) nums.add(Number(m[1]));
    });
    return Array.from(nums).sort((a, b) => a - b);
  });
  if (fromDom.length) return fromDom;

  // Fallback: infer from any episode links already in the page
  const fromLinks = await page.evaluate((sid) => {
    const nums = new Set();
    Array.from(document.querySelectorAll(`a[href*="/p-${sid}/"]`)).forEach((a) => {
      const decoded = decodeURIComponent(a.href);
      const m = decoded.match(new RegExp(`/p-${sid}/s(\\d+)/`)) ||
        decoded.match(new RegExp(`/p-${sid}/עונה-(\\d+)/`));
      if (m) nums.add(Number(m[1]));
    });
    return Array.from(nums).sort((a, b) => a - b);
  }, seriesId);
  return fromLinks.length ? fromLinks : [1];
}

async function clickSeasonTab(page, season) {
  const clicked = await page.evaluate((seasonNum) => {
    const labels = Array.from(
      document.querySelectorAll('button, a, [role="tab"], .season-tab, [class*="season"]')
    );
    for (const el of labels) {
      const t = (el.textContent || '').trim();
      if (t === `עונה ${seasonNum}` || t === `עונה${seasonNum}` || new RegExp(`^Season\\s*${seasonNum}$`, 'i').test(t)) {
        try {
          el.click();
          return true;
        } catch (e) {
          return false;
        }
      }
    }
    return false;
  }, season);
  if (clicked) await page.waitForTimeout(1400);
  return clicked;
}

function collectEpisodesFromDom(seriesId, season) {
  return ({ seriesId, season }) => {
    const anchors = Array.from(
      document.querySelectorAll(`a.card-link[href*="/p-${seriesId}/"], a[href*="/p-${seriesId}/"]`)
    );
    const out = [];
    anchors.forEach((a) => {
      const href = a.href.split('?')[0];
      const decoded = decodeURIComponent(href);
      const mPath =
        decoded.match(new RegExp(`/p-${seriesId}/s(\\d+)/(\\d+)/?`)) ||
        decoded.match(new RegExp(`/p-${seriesId}/עונה-(\\d+)/(\\d+)/?`));
      if (!mPath) return;
      const seasonNum = Number(mPath[1]);
      if (season && seasonNum !== season) return;
      const pageId = mPath[2];

      const titleNode = a.querySelector('.card-title, .title, [class*="title"]');
      const img = a.querySelector('img');
      let text = (a.textContent || a.getAttribute('title') || (titleNode && titleNode.textContent) || '')
        .replace(/\s+/g, ' ')
        .trim();
      text = text.replace(/^\d{1,2}:\d{2}(?::\d{2})?\s+/, '');

      if (
        /טריילר|ריקאפ|ריכולים|צריכים תזכורת|קדימון|אחרי המזח|על אהבה|ברוכים הבאים לירושלים של|איזה באד|הצצות|הרב מתגרש|עקרות הלכתית/.test(
          text
        )
      ) {
        return;
      }

      let epNum = null;
      const mDash =
        text.match(/פרק\s*(\d+)\s*(?:\([^)]*\))?\s*[-–]\s*(.+?)(?:\s{2,}|$)/) ||
        text.match(/פרק\s*(\d+)\s*(?:\([^)]*\))?\s*[-–]\s*(.+)/);
      const mSuffix = text.match(/(.+?)\s*[|｜]\s*פרק\s*(\d+)/) || text.match(/(.+?)\s*[-–]\s*פרק\s*(\d+)/);
      const mPlain = text.match(/פרק\s*(\d+)\s+(.+)/);
      const mOnly = text.match(/פרק\s*(\d+)(?:\s*\([^)]*\))?/);
      const mLast = text.match(/פרק\s*אחרון(?:\s+לעונה)?\s*(.*)/);

      if (mDash) epNum = Number(mDash[1]);
      else if (mSuffix) epNum = Number(mSuffix[2]);
      else if (mPlain) epNum = Number(mPlain[1]);
      else if (mOnly) epNum = Number(mOnly[1]);
      else if (mLast) epNum = 999;
      else epNum = 0;

      out.push({
        season: seasonNum,
        ep: epNum,
        page: href,
        pageId,
        imageURL: img ? img.src || img.getAttribute('data-src') || '' : ''
      });
    });

    const byPage = new Map();
    out.forEach((e) => {
      if (!byPage.has(e.page)) byPage.set(e.page, e);
    });
    return Array.from(byPage.values());
  };
}

function normalizeEpisodeNumbers(list) {
  const seasons = {};
  list.forEach((e) => {
    if (!seasons[e.season]) seasons[e.season] = [];
    seasons[e.season].push(e);
  });
  const final = [];
  Object.keys(seasons)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((season) => {
      const items = seasons[season];
      const numbered = items.filter((e) => e.ep > 0 && e.ep !== 999).sort((a, b) => a.ep - b.ep);
      const zeros = items.filter((e) => e.ep === 0);
      const lasts = items.filter((e) => e.ep === 999);
      const used = new Set(numbered.map((x) => x.ep));
      zeros.forEach((e) => {
        let n = 1;
        while (used.has(n)) n++;
        e.ep = n;
        numbered.push(e);
        used.add(n);
      });
      numbered.sort((a, b) => a.ep - b.ep);
      if (lasts.length) {
        const next = numbered.length ? numbered[numbered.length - 1].ep + 1 : 1;
        lasts.forEach((e, i) => {
          e.ep = next + i;
          numbered.push(e);
        });
      }
      numbered.forEach((e) => final.push(e));
    });
  return final;
}

async function scrapeSeries(page, seriesUrl, slugHint) {
  await page.goto(seriesUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(3500);
  await clickShowMore(page);

  const seriesMatch = seriesUrl.match(/p-(\d+)/);
  const seriesId = seriesMatch ? seriesMatch[1] : '';

  const meta = await page.evaluate(() => {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const titleEl =
      document.querySelector('h1.page-title, h1.series-title, .series-header h1, .vod-header h1') ||
      document.querySelector('h1');
    let title = '';
    if (ogTitle && ogTitle.getAttribute('content')) {
      title = ogTitle.getAttribute('content');
    } else if (titleEl) {
      title = titleEl.textContent || '';
    }
    title = title.split('|')[0].trim();
    title = title.replace(/\s*-\s*עונה\s*\d+\s*$/i, '').trim();
    title = title.replace(/\s*-\s*פרקים.*$/i, '').trim();
    title = title.replace(/\.?\s*כאן.*$/i, '').trim();
    if (/^עונה\s*\d+$/i.test(title) && ogTitle) {
      title = (ogTitle.getAttribute('content') || title).split('|')[0].trim();
    }
    const poster =
      (document.querySelector('meta[property="og:image"]') &&
        document.querySelector('meta[property="og:image"]').getAttribute('content')) ||
      '';
    return { title, poster };
  });

  const seasons = await listSeasonNumbers(page, seriesId);
  console.log(`  Detected seasons: ${seasons.join(', ') || '1'}`);

  let allEps = [];
  for (const season of seasons) {
    await clickSeasonTab(page, season);
    await clickShowMore(page);
    const eps = await page.evaluate(collectEpisodesFromDom(seriesId, season), {
      seriesId,
      season
    });
    console.log(`  Season ${season}: ${eps.length} episode cards`);
    allEps = allEps.concat(eps);
  }

  // Dedupe by page and normalize numbers
  const byPage = new Map();
  allEps.forEach((e) => {
    if (!byPage.has(e.page)) byPage.set(e.page, e);
  });
  const final = normalizeEpisodeNumbers(Array.from(byPage.values()));

  return {
    seriesId,
    title: meta.title || `Series ${seriesId}`,
    poster: meta.poster,
    slug: slugHint || `kan-${seriesId}`,
    episodes: final.map((e) => ({
      season: e.season,
      ep: e.ep,
      name: `עונה ${e.season} פרק ${e.ep}`,
      page: e.page,
      imageURL: e.imageURL
    }))
  };
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
    console.log(`  [s${episode.season} ep${episode.ep}] ${episode.page}`);
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
    console.warn(`  Error:`, err.message);
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
    const ok = await downloadFile(payload.poster, seriesPath);
    console.log(`  series poster: ${ok ? 'OK' : 'FAIL'}`);
  }

  for (const ep of payload.episodes) {
    const multi = payload.episodes.some((e) => e.season !== payload.episodes[0].season);
    const fname = multi ? `s${ep.season}-ep${ep.ep}.${extFromUrl(ep.imageURL)}` : `ep${ep.ep}.${extFromUrl(ep.imageURL)}`;
    const dest = path.join(dir, fname);
    const ok = await downloadFile(ep.imageURL, dest);
    ep.localImage = ok ? `images/kanbox/${payload.slug}/${fname}` : '';
    if (!ok) console.log(`  image fail s${ep.season} ep${ep.ep}`);
  }

  // If series poster failed, copy first episode image
  if ((!payload.poster || !fs.existsSync(seriesPath) || fs.statSync(seriesPath).size < 1000) &&
      payload.episodes[0] && payload.episodes[0].localImage) {
    fs.copyFileSync(path.join(ROOT, payload.episodes[0].localImage), seriesPath);
  }
  payload.localPoster = `images/kanbox/${payload.slug}/series.jpg`;
}

function toChannelsEntry(payload) {
  const multi = new Set(payload.episodes.map((e) => e.season)).size > 1;
  const lines = [];
  lines.push('    {');
  lines.push(`        id: '${payload.slug}',`);
  lines.push(`        name: '${payload.title.replace(/'/g, "\\'")}',`);
  lines.push(`        placeholder: '${payload.title.replace(/'/g, "\\'")}',`);
  lines.push(`        imageURL: '${payload.localPoster}',`);
  lines.push(`        source: 'kan',`);
  lines.push('        episodes: [');
  payload.episodes.forEach((ep, i) => {
    const id = multi
      ? `${payload.slug}-s${ep.season}-ep${ep.ep}`
      : `${payload.slug}-ep${ep.ep}`;
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
  const args = parseArgs(process.argv.slice(2));
  let playwright;
  try {
    playwright = require('playwright');
  } catch (e) {
    console.error('Playwright required. cd scripts && npm install && npx playwright install chromium');
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

  const allPayloads = [];
  const fragmentParts = [];

  for (const item of SERIES) {
    console.log(`\n========== ${item.url} ==========`);
    const seriesPage = await context.newPage();
    let scraped;
    try {
      scraped = await scrapeSeries(seriesPage, item.url, item.slug);
    } catch (err) {
      console.error('Scrape failed:', err.message);
      await seriesPage.close();
      continue;
    }
    await seriesPage.close();

    const betterSlug = slugifyTitle(scraped.title);
    if (betterSlug) scraped.slug = betterSlug;
    else if (item.slug.startsWith('series-')) {
      // keep placeholder; refine later from title
      scraped.slug = item.slug;
    } else {
      scraped.slug = item.slug;
    }

    console.log(`Title: ${scraped.title}`);
    console.log(`Slug: ${scraped.slug}`);
    console.log(`Episodes: ${scraped.episodes.length}`);
    const seasons = [...new Set(scraped.episodes.map((e) => e.season))].sort((a, b) => a - b);
    console.log(`Seasons: ${seasons.join(', ')}`);

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

    allPayloads.push(payload);
    fragmentParts.push(toChannelsEntry(payload));
  }

  const fragmentPath = path.join(ROOT, 'scripts', 'kanbox-new-series-fragment.js');
  fs.writeFileSync(fragmentPath, fragmentParts.join(',\n') + '\n');
  console.log(`\nWrote fragment: ${fragmentPath}`);
  console.log(`Done: ${allPayloads.length} series`);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
