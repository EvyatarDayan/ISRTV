#!/usr/bin/env node
/**
 * Check Kan.org for new episodes of ONE existing series and update js/channels.js.
 *
 * Usage:
 *   node scripts/update-kan-series.js "בואו לאכול איתי"
 *   node scripts/update-kan-series.js bou-leechol-iti
 *   node scripts/update-kan-series.js "היהודים באים" --headed
 *   node scripts/update-kan-series.js --list
 *   node scripts/update-kan-series.js bou-leechol-iti --url https://www.kan.org.il/content/kan/kan-11/p-11843/
 *   node scripts/update-kan-series.js "בואו לאכול איתי" --dry-run
 *
 * Only scrapes the named series (not the whole catalog).
 * Existing episodes are kept; only missing season/ep entries are fetched and appended.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFileSync } = require('child_process');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const CHANNELS_FILE = path.join(ROOT, 'js', 'channels.js');

function parseArgs(argv) {
  const args = {
    query: '',
    headed: false,
    dryRun: false,
    list: false,
    url: '',
    fillMissingStreams: false,
    syncPaths: false
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--headed') args.headed = true;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--list') args.list = true;
    else if (a === '--sync-paths') args.syncPaths = true;
    else if (a === '--fill-missing-streams') args.fillMissingStreams = true;
    else if (a === '--url' && argv[i + 1]) args.url = argv[++i];
    else if (!a.startsWith('-') && !args.query) args.query = a;
  }
  return args;
}

function loadChannels() {
  global.window = global.window || {};
  // eslint-disable-next-line no-eval
  eval(fs.readFileSync(CHANNELS_FILE, 'utf8'));
  return window.ISRTV_KANBOX || [];
}

function normalizeHeb(s) {
  return String(s || '')
    .replace(/[\u0591-\u05C7]/g, '')
    .replace(/[״"']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function findSeries(list, query) {
  const q = String(query || '').trim();
  if (!q) return null;
  const byId = list.find((s) => s.id === q);
  if (byId) return byId;

  const nq = normalizeHeb(q);
  const exact = list.find((s) => normalizeHeb(s.name) === nq || normalizeHeb(s.placeholder) === nq);
  if (exact) return exact;

  const partial = list.filter(
    (s) =>
      normalizeHeb(s.name).includes(nq) ||
      nq.includes(normalizeHeb(s.name)) ||
      (s.id && s.id.includes(q))
  );
  if (partial.length === 1) return partial[0];
  if (partial.length > 1) {
    const err = new Error(
      'Multiple matches:\n' + partial.map((s) => `  - ${s.id}: ${s.name}`).join('\n')
    );
    err.code = 'AMBIGUOUS';
    err.matches = partial;
    throw err;
  }
  return null;
}

function loadSeriesUrlMap() {
  const map = {};
  const dir = path.join(ROOT, 'scripts');
  fs.readdirSync(dir)
    .filter((f) => /^kanbox-.+\.json$/.test(f))
    .forEach((f) => {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
        if (data.slug && data.seriesUrl) map[data.slug] = data.seriesUrl;
        if (data.seriesId && data.seriesUrl) {
          map['p-' + data.seriesId] = data.seriesUrl;
        }
      } catch (e) {}
    });
  return map;
}

function resolveSeriesUrl(series, overrideUrl) {
  if (overrideUrl) return overrideUrl;
  const map = loadSeriesUrlMap();
  if (map[series.id]) return map[series.id];

  const jsonPath = path.join(ROOT, 'scripts', `kanbox-${series.id}.json`);
  if (fs.existsSync(jsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      if (data.seriesUrl) return data.seriesUrl;
    } catch (e) {}
  }

  // Infer Kan id from existing local image paths or known patterns — last resort
  return '';
}

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

async function waitForKanContent(page, opts) {
  const needCards = !!(opts && opts.cards);
  const timeout = (opts && opts.timeout) || 10000;
  const started = Date.now();
  while (Date.now() - started < timeout) {
    const ok = await page
      .evaluate((wantCards) => {
        const text = document.body ? document.body.innerText || '' : '';
        const challenge =
          document.title === 'רק רגע...' ||
          /ביצוע אימות אבטחה|Just a moment/i.test(text);
        if (challenge) return false;
        const h1 = ((document.querySelector('h1') || {}).textContent || '')
          .replace(/\s+/g, ' ')
          .trim();
        if (!h1 || h1 === 'www.kan.org.il') return false;
        if (wantCards) return document.querySelectorAll('a.card-link, a.card').length > 0;
        return true;
      }, needCards)
      .catch(() => false);
    if (ok) return true;
    await page.waitForTimeout(400);
  }
  return false;
}

async function clickLoadMore(page) {
  let prev = -1;
  for (let i = 0; i < 15; i++) {
    const count = await page.evaluate(() => document.querySelectorAll('a.card-link').length).catch(() => 0);
    const btn = await page.$(
      '#vod-program-show-more, #vod-page-items-show-more button, button:has-text("טען עוד")'
    );
    if (!btn) break;
    if (count === prev) break;
    prev = count;
    try {
      await btn.click({ timeout: 2000 });
      await page.waitForTimeout(700);
    } catch (e) {
      break;
    }
  }
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

async function discoverSeasonTargets(page, seriesId, seriesUrl) {
  // Dropdown labels (UI season) often point at a different /sN/ path (e.g. עונה 10 → /s12/)
  const fromDropdown = await page.evaluate((sid) => {
    const out = [];
    const seen = new Set();
    Array.from(document.querySelectorAll('a.dropdown-item, a[href*="/s"]'))
      .forEach((a) => {
        const href = (a.href || '').split('?')[0].split('#')[0];
        const label = (a.textContent || '').replace(/\s+/g, ' ').trim();
        const m = href.match(new RegExp(`/p-${sid}/s(\\d+)/?$`));
        if (!m) return;
        const pathSeason = Number(m[1]);
        const labelSeason = (label.match(/^עונה\s*(\d+)$/) || [])[1];
        const key = href;
        if (seen.has(key)) return;
        seen.add(key);
        out.push({
          href: href.endsWith('/') ? href : href + '/',
          pathSeason,
          labelSeason: labelSeason ? Number(labelSeason) : null,
          label
        });
      });
    return out;
  }, seriesId);

  // Also collect every /sN/ mentioned in episode/season links
  const pathNums = await page.evaluate((sid) => {
    const nums = new Set();
    Array.from(document.querySelectorAll(`a[href*="/p-${sid}/s"]`)).forEach((a) => {
      const m = a.href.match(new RegExp(`/p-${sid}/s(\\d+)/`));
      if (m) nums.add(Number(m[1]));
    });
    return Array.from(nums).sort((a, b) => a - b);
  }, seriesId);

  const byPath = new Map();
  fromDropdown.forEach((t) => byPath.set(t.pathSeason, t));
  pathNums.forEach((n) => {
    if (!byPath.has(n)) {
      byPath.set(n, {
        href: seriesUrl.replace(/\/?$/, '/') + `s${n}/`,
        pathSeason: n,
        labelSeason: null,
        label: ''
      });
    }
  });

  return Array.from(byPath.values()).sort((a, b) => a.pathSeason - b.pathSeason);
}

function collectEpisodesEval() {
  return ({ seriesId, pathSeason }) => {
    const out = [];
    Array.from(document.querySelectorAll(`a[href*="/p-${seriesId}/"]`)).forEach((a) => {
      if (!/card/.test(a.className || '')) return;
      const href = a.href.split('?')[0].split('#')[0];
      const decoded = decodeURIComponent(href);
      const mSeason =
        decoded.match(new RegExp(`/p-${seriesId}/s(\\d+)/(\\d+)/?$`)) ||
        decoded.match(new RegExp(`/p-${seriesId}/עונה-(\\d+)/(\\d+)/?$`));
      const mFlat = decoded.match(new RegExp(`/p-${seriesId}/(\\d+)/?$`));

      let pagePathSeason = null;
      let pageId = null;
      if (mSeason) {
        pagePathSeason = Number(mSeason[1]);
        pageId = mSeason[2];
      } else if (mFlat) {
        pagePathSeason = pathSeason;
        pageId = mFlat[1];
      } else {
        return;
      }

      if (pathSeason && pagePathSeason !== pathSeason) return;

      const titleNode = a.querySelector('.card-title, .title, [class*="title"]');
      const img = a.querySelector('img');
      let text = (a.textContent || a.getAttribute('title') || (titleNode && titleNode.textContent) || '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^\d{1,2}:\d{2}(?::\d{2})?\s+/, '');

      if (/לצפייה בפרק|טריילר|ריקאפ|ריכולים|צריכים תזכורת|קדימון/.test(text)) return;

      let epNum = null;
      const mEp = text.match(/פרק\s*(\d+)/);
      const mPart = text.match(/חלק\s*([א-ת])'/); // פסח-style
      if (mEp) epNum = Number(mEp[1]);
      else if (/פרק\s*אחרון/.test(text)) epNum = 999;
      else if (mPart) {
        const heb = 'אבגדהוזחטיכלמנסעפצקרשת';
        const idx = heb.indexOf(mPart[1]);
        epNum = idx >= 0 ? idx + 1 : 0;
      } else epNum = 0;

      out.push({
        pathSeason: pagePathSeason,
        ep: epNum,
        page: href,
        pageId,
        imageURL: img ? img.src || img.getAttribute('data-src') || '' : '',
        text
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
    const s = e.season;
    if (!seasons[s]) seasons[s] = [];
    seasons[s].push(e);
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

async function scrapeSeriesCatalog(page, seriesUrl) {
  await page.goto(seriesUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await waitForKanContent(page, { cards: false });
  await page.waitForTimeout(500);

  const seriesMatch = seriesUrl.match(/p-(\d+)/);
  const seriesId = seriesMatch ? seriesMatch[1] : '';
  if (!seriesId) throw new Error('Could not parse series id from URL: ' + seriesUrl);

  const targets = await discoverSeasonTargets(page, seriesId, seriesUrl);
  if (!targets.length) {
    const snap = await page.evaluate(() => ({
      title: document.title.slice(0, 60),
      h1: ((document.querySelector('h1') || {}).textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40)
    }));
    console.log('  No season links.', JSON.stringify(snap));
  }
  console.log(
    '  Season targets:',
    targets
      .map((t) =>
        t.labelSeason && t.labelSeason !== t.pathSeason
          ? `UI${t.labelSeason}→/s${t.pathSeason}/`
          : `/s${t.pathSeason}/`
      )
      .join(', ')
  );

  const browser = page.context().browser();
  const batches = [];
  for (const target of targets) {
    let meta = { h1: '', og: '' };
    let eps = [];
    for (let attempt = 0; attempt < 2 && eps.length === 0; attempt++) {
      const seasonContext = await browser.newContext({
        locale: 'he-IL',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        viewport: { width: 1400, height: 900 }
      });
      try {
        const seasonPage = await seasonContext.newPage();
        await seasonPage.goto(target.href, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await waitForKanContent(seasonPage, { cards: true, timeout: 8000 });
        await clickLoadMore(seasonPage);
        meta = await seasonPage.evaluate(() => {
          const h1 = document.querySelector('h1');
          const og = document.querySelector('meta[property="og:title"]');
          return {
            h1: ((h1 && h1.textContent) || '').replace(/\s+/g, ' ').trim(),
            og: ((og && og.getAttribute('content')) || '').split('|')[0].trim()
          };
        });
        eps = await seasonPage.evaluate(collectEpisodesEval(), {
          seriesId,
          pathSeason: target.pathSeason
        });
      } finally {
        await seasonContext.close();
      }
    }

    // Prefer dropdown "עונה N" / page title "עונה N" over raw /sN/ path.
    // Paths like /s10/ "ספיישל פסח" must NOT steal the UI season number.
    let displaySeason = null;
    let seasonSource = 'path';
    if (target.labelSeason) {
      displaySeason = target.labelSeason;
      seasonSource = 'label';
    }
    const titleSeason = ((meta.h1 || meta.og || '').match(/עונה\s*(\d+)/) || [])[1];
    if (titleSeason) {
      displaySeason = Number(titleSeason);
      seasonSource = 'title';
    }
    if (!displaySeason) {
      displaySeason = target.pathSeason;
      seasonSource = 'path';
    }

    batches.push({ target, displaySeason, seasonSource, meta, eps });
  }

  // If a path-only batch (specials) uses the same number as a real "עונה N",
  // move the special to 800+path (e.g. פסח /s10/ → season 810).
  const claimed = new Map();
  batches.forEach((b) => {
    if (b.seasonSource === 'title' || b.seasonSource === 'label') {
      claimed.set(b.displaySeason, b.target.pathSeason);
    }
  });
  batches.forEach((b) => {
    if (
      b.seasonSource === 'path' &&
      claimed.has(b.displaySeason) &&
      claimed.get(b.displaySeason) !== b.target.pathSeason
    ) {
      const prev = b.displaySeason;
      b.displaySeason = 800 + b.target.pathSeason;
      console.log(
        `  /s${b.target.pathSeason}/ special was S${prev}, remapped → S${b.displaySeason}`
      );
    }
  });

  let all = [];
  batches.forEach((b) => {
    console.log(
      `  /s${b.target.pathSeason}/ → season ${b.displaySeason}` +
        (b.meta.h1 ? ` (${b.meta.h1.slice(0, 40)})` : '') +
        `: ${b.eps.length} cards`
    );
    b.eps.forEach((e) => {
      e.season = b.displaySeason;
      e.pathSeason = b.target.pathSeason;
      e.pageTitle = b.meta.h1 || b.meta.og || '';
    });
    all = all.concat(b.eps);
  });

  const byPage = new Map();
  all.forEach((e) => {
    if (!byPage.has(e.page)) byPage.set(e.page, e);
  });
  return normalizeEpisodeNumbers(Array.from(byPage.values()));
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
    await page.goto(episode.page, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await waitForKanContent(page, { timeout: 12000 });
    const meta = await page.evaluate(() => {
      const ogTitle = (document.querySelector('meta[property="og:title"]') || {}).content || '';
      const ogDesc =
        (document.querySelector('meta[property="og:description"]') || {}).content || '';
      const h1 = (document.querySelector('h1') || {}).textContent || '';
      const infoDesc = (document.querySelector('.info-description') || {}).textContent || '';
      return {
        ogTitle,
        h1: String(h1).replace(/\s+/g, ' ').trim(),
        desc: String(infoDesc || ogDesc)
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 280)
      };
    });
    const h1 = meta.h1 || '';
    let scrapedName = '';
    if (h1.includes('|')) {
      const right = h1.split('|').pop().trim();
      if (/פרק/.test(right)) scrapedName = right;
    }
    if (!scrapedName) {
      const m = h1.match(/פרק\s*\d+\s*[-–—:]\s*.+/);
      if (m) scrapedName = m[0].trim();
    }
    if (!scrapedName && /פרק\s*\d+/.test(h1)) scrapedName = h1;
    if (scrapedName) episode.scrapedName = scrapedName;
    if (meta.desc) episode.scrapedSubtitle = meta.desc;
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
    if (!candidates.some((u) => scoreStreamUrl(u) >= 100)) {
      const html = await page.content();
      const fromHtml = html.match(
        /https:\/\/r\.il\.cdn-redge\.media\/webcache\/gorigin\/hls\/oil\/kancdn\/vod\/[^"'\\\s]+playlist\.m3u8\?fmp4/g
      );
      (fromHtml || []).forEach((u) => consider(u));
      const vodIds = [...html.matchAll(/kancdn\/vod\/(\d+|1_[a-z0-9]+)/gi)].map((m) => m[1]);
      vodIds.forEach((id) => {
        consider(
          `https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/${id}/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4`
        );
      });
    }
  } catch (err) {
    console.warn(`  stream error s${episode.season} ep${episode.ep}:`, err.message);
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

function isValidImageBuf(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 2000) return false;
  if (buf[0] === 0xff && buf[1] === 0xd8) return true;
  if (buf[0] === 0x89 && buf[1] === 0x50) return true;
  if (buf.slice(0, 4).toString() === 'RIFF') return true;
  return false;
}

function writeImageAsJpeg(buf, dest) {
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    fs.writeFileSync(dest, buf);
    return true;
  }
  const tmp = dest + '.src';
  fs.writeFileSync(tmp, buf);
  try {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-q:v', '3', dest], {
      stdio: 'ignore'
    });
    return fs.existsSync(dest) && fs.statSync(dest).size > 2000;
  } catch (_) {
    return false;
  } finally {
    try {
      fs.unlinkSync(tmp);
    } catch (_) {}
  }
}

/** Kan images are Cloudflare-gated; use Playwright page navigation.
 *  Keep only the document body of the image URL. Other JPEGs on the page
 *  (the series poster) used to overwrite the real still. */
async function downloadImageViaBrowser(context, imageURL, episodePage, dest) {
  const page = await context.newPage();
  async function grab(url) {
    if (!url) return null;
    const r = await page.goto(url, { waitUntil: 'load', timeout: 45000 }).catch(() => null);
    if (!r) return null;
    const b = await r.body().catch(() => null);
    return isValidImageBuf(b) ? b : null;
  }
  try {
    let buf = await grab(imageURL);
    if (!buf && imageURL) buf = await grab(imageURL);
    if (!buf && episodePage) {
      await page.goto(episodePage, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => null);
      await page.waitForTimeout(800);
      const cardSrc = await page.evaluate(() => {
        const img = document.querySelector(
          '.info-image img, .player-image img, img.card-img, .episode-image img, meta[property="og:image"]'
        );
        if (!img) return '';
        return img.src || img.content || img.getAttribute('content') || '';
      });
      if (cardSrc && cardSrc !== imageURL) buf = await grab(cardSrc);
    }
    if (!isValidImageBuf(buf)) return false;
    return writeImageAsJpeg(buf, dest);
  } catch (_) {
    return false;
  } finally {
    await page.close();
  }
}

function epKey(season, ep) {
  return season + ':' + ep;
}

function existingKeySet(series) {
  const set = new Set();
  (series.episodes || []).forEach((e) => set.add(epKey(e.season || 1, e.ep || 0)));
  return set;
}

function makeEpisodeId(series, season, ep) {
  const seasons = new Set((series.episodes || []).map((e) => e.season || 1));
  seasons.add(season);
  const multi = seasons.size > 1;
  return multi ? `${series.id}-s${season}-ep${ep}` : `${series.id}-ep${ep}`;
}

function escapeStr(s) {
  return String(s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function serializeSeries(series) {
  const lines = [];
  lines.push('    {');
  lines.push(`        id: '${series.id}',`);
  lines.push(`        name: '${escapeStr(series.name)}',`);
  lines.push(`        placeholder: '${escapeStr(series.placeholder || series.name)}',`);
  lines.push(`        imageURL: '${series.imageURL || ''}',`);
  if (series.source) {
    lines.push(`        source: '${series.source}',`);
  }
  if (series.seasonTitles && typeof series.seasonTitles === 'object') {
    const keys = Object.keys(series.seasonTitles).sort((a, b) => Number(a) - Number(b));
    if (keys.length) {
      lines.push('        seasonTitles: {');
      keys.forEach((k, i) => {
        lines.push(
          `            ${k}: '${escapeStr(series.seasonTitles[k])}'` + (i < keys.length - 1 ? ',' : '')
        );
      });
      lines.push('        },');
    }
  }
  lines.push('        episodes: [');
  const eps = series.episodes || [];
  eps.forEach((ep, i) => {
    lines.push('            {');
    lines.push(`                id: '${ep.id}',`);
    lines.push(`                season: ${ep.season || 1},`);
    lines.push(`                ep: ${ep.ep},`);
    lines.push(`                name: '${escapeStr(ep.name || `עונה ${ep.season || 1} פרק ${ep.ep}`)}',`);
    if (ep.subtitle) {
      lines.push(`                subtitle: '${escapeStr(ep.subtitle)}',`);
    }
    lines.push(`                streamURL: '${ep.streamURL || ''}',`);
    if (ep.pathSeason != null && ep.pathSeason !== '') {
      lines.push(`                pathSeason: ${Number(ep.pathSeason)},`);
    }
    if (ep.assetId) {
      lines.push(`                assetId: '${ep.assetId}',`);
    }
    if (ep.streamResolve) {
      lines.push(`                streamResolve: '${ep.streamResolve}',`);
    }
    lines.push(`                imageURL: '${ep.imageURL || ''}',`);
    lines.push(`                placeholder: '${ep.placeholder || ep.ep}'`);
    lines.push(i < eps.length - 1 ? '            },' : '            }');
  });
  lines.push('        ]');
  lines.push('    }');
  return lines.join('\n');
}

function replaceSeriesInChannelsFile(series) {
  const text = fs.readFileSync(CHANNELS_FILE, 'utf8');
  const idToken = `id: '${series.id}'`;
  const idIdx = text.indexOf(idToken);
  if (idIdx < 0) throw new Error('Series id not found in channels.js: ' + series.id);

  // Find opening `{` of this series object
  let start = idIdx;
  while (start > 0 && text[start] !== '{') start--;
  // Prefer the object that starts at indent of 4 spaces before {
  const lineStart = text.lastIndexOf('\n', start);
  const openIdx = text.indexOf('{', lineStart);
  start = openIdx;

  let depth = 0;
  let end = -1;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end < 0) throw new Error('Could not find end of series object');

  const replacement = serializeSeries(series);
  const newText = text.slice(0, start) + replacement + text.slice(end);
  fs.writeFileSync(CHANNELS_FILE, newText);
  // syntax check
  // eslint-disable-next-line no-new-func
  new Function(newText);
}

function loadSeriesJson(seriesId) {
  const jsonPath = path.join(ROOT, 'scripts', `kanbox-${seriesId}.json`);
  if (!fs.existsSync(jsonPath)) return { path: jsonPath, data: null };
  try {
    return { path: jsonPath, data: JSON.parse(fs.readFileSync(jsonPath, 'utf8')) };
  } catch (_) {
    return { path: jsonPath, data: null };
  }
}

/**
 * Kan often labels seasons differently from URL /sN/ paths
 * (e.g. UI "עונה 10" → /s12/, while /s10/ is a Pesach special).
 * Remumber local episodes whose stored season conflicts with remote display seasons.
 */
function remumberConflictingLocalSeasons(series, remoteEps, prevData) {
  // Prefer UI≠path mappings (e.g. season 10 → /s12/) over path==season (specials).
  const displayToPath = new Map();
  remoteEps.forEach((e) => {
    if (e.pathSeason == null) return;
    if (e.pathSeason !== e.season) {
      displayToPath.set(e.season, e.pathSeason);
    } else if (!displayToPath.has(e.season)) {
      displayToPath.set(e.season, e.pathSeason);
    }
  });

  // Also: if remote moved a page to season 810+, match local by page URL.
  const remoteSeasonByPage = new Map();
  remoteEps.forEach((e) => {
    if (e.page) remoteSeasonByPage.set(e.page, e.season);
  });

  const pageByLocalKey = new Map();
  ((prevData && prevData.episodes) || []).forEach((e) => {
    if (e.page) pageByLocalKey.set(epKey(e.season, e.ep), e.page);
  });

  let moved = 0;
  (series.episodes || []).forEach((ep) => {
    const page = pageByLocalKey.get(epKey(ep.season || 1, ep.ep));
    if (!page) return;
    const m = page.match(/\/s(\d+)\//i);
    if (!m) return;
    const pathS = Number(m[1]);

    let dest = null;
    const remoteSeason = remoteSeasonByPage.get(page);
    if (remoteSeason != null && remoteSeason !== (ep.season || 1)) {
      dest = remoteSeason;
    } else {
      const claimedPath = displayToPath.get(ep.season || 1);
      // Local is under display season S, but its page is /sP/, while Kan maps
      // display S → a different path (e.g. UI עונה 10 → /s12/).
      if (claimedPath != null && claimedPath !== pathS) {
        dest = pathS;
        if (displayToPath.has(dest) && displayToPath.get(dest) !== pathS) {
          dest = 800 + pathS;
        }
        // Prefer remote's special season if present for this path
        const special = [...remoteSeasonByPage.entries()].find(
          ([p, s]) => p.includes(`/s${pathS}/`) && s >= 800
        );
        if (special) dest = special[1];
      }
    }
    if (dest == null || dest === (ep.season || 1)) return;

    const oldS = ep.season;
    ep.season = dest;
    ep.pathSeason = pathS;
    ep.id = `${series.id}-s${dest}-ep${ep.ep}`;
    if (dest >= 800) {
      const tip = ((prevData && prevData.episodes) || []).find((x) => x.page === page);
      const label = (tip && (tip.text || tip.pageTitle)) || '';
      const remoteTip = remoteEps.find((x) => x.page === page);
      const title = (remoteTip && remoteTip.pageTitle) || '';
      ep.name = title
        ? `${title} — פרק ${ep.ep}`
        : label
          ? `ספיישל — ${label.slice(0, 40)}`
          : `ספיישל (נתיב ${pathS}) פרק ${ep.ep}`;
    } else {
      ep.name = `עונה ${dest} פרק ${ep.ep}`;
    }
    moved += 1;
    console.log(`  Remumbered local s${oldS} ep${ep.ep} → s${dest} (page ${page})`);
  });
  return moved;
}

function knownPageSet(prevData) {
  const pages = new Set();
  ((prevData && prevData.episodes) || []).forEach((e) => {
    if (e.page) pages.add(e.page);
  });
  return pages;
}

function updateJsonCache(series, seriesUrl, remoteEps, prevData) {
  const jsonPath = path.join(ROOT, 'scripts', `kanbox-${series.id}.json`);
  let data = {
    seriesId: (seriesUrl.match(/p-(\d+)/) || [])[1] || '',
    slug: series.id,
    title: series.name,
    poster: '',
    seriesUrl,
    episodes: []
  };
  if (prevData) data = Object.assign(data, prevData);
  data.seriesUrl = seriesUrl;
  data.title = series.name;
  data.slug = series.id;

  // Prefer page URL as stable key (season numbers shift when UI ≠ /sN/)
  const byPage = new Map();
  const byKey = new Map();
  (data.episodes || []).forEach((e) => {
    if (e.page) byPage.set(e.page, e);
    byKey.set(epKey(e.season, e.ep), e);
  });
  remoteEps.forEach((e) => {
    const prev = (e.page && byPage.get(e.page)) || byKey.get(epKey(e.season, e.ep)) || {};
    const merged = Object.assign({}, prev, e);
    if (e.page) byPage.set(e.page, merged);
    byKey.set(epKey(e.season, e.ep), merged);
  });
  (series.episodes || []).forEach((e) => {
    const k = epKey(e.season || 1, e.ep);
    const prev = byKey.get(k) || { season: e.season || 1, ep: e.ep };
    const merged = Object.assign({}, prev, {
      season: e.season || 1,
      ep: e.ep,
      name: e.name,
      streamURL: e.streamURL || prev.streamURL || '',
      localImage: e.imageURL || prev.localImage || '',
      imageURL: prev.imageURL || ''
    });
    byKey.set(k, merged);
    if (merged.page) byPage.set(merged.page, merged);
  });

  const seen = new Set();
  const episodes = [];
  byPage.forEach((e) => {
    if (seen.has(e.page)) return;
    seen.add(e.page);
    episodes.push(e);
  });
  byKey.forEach((e) => {
    if (e.page && seen.has(e.page)) return;
    if (!e.page) episodes.push(e);
  });

  data.episodes = episodes.sort((a, b) => {
    if (a.season !== b.season) return a.season - b.season;
    return a.ep - b.ep;
  });
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  return jsonPath;
}

function syncPathSeasonsFromJson(series, prevData) {
  const byKey = new Map();
  ((prevData && prevData.episodes) || []).forEach((e) => {
    if (e.pathSeason != null) byKey.set(epKey(e.season, e.ep), Number(e.pathSeason));
  });
  let n = 0;
  (series.episodes || []).forEach((ep) => {
    const s = ep.season || 1;
    let p = byKey.get(epKey(s, ep.ep));
    if (p == null && s >= 800) p = s - 800;
    if (p == null) return;
    if (ep.pathSeason !== p) {
      ep.pathSeason = p;
      n += 1;
    }
  });
  return n;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const list = loadChannels();

  if (args.list) {
    const kan = list.filter((s) => !s.source || s.source === 'kan');
    console.log(`Kan series in catalog (${kan.length}):`);
    kan
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, 'he'))
      .forEach((s) => {
        const seasons = [...new Set((s.episodes || []).map((e) => e.season || 1))].sort((a, b) => a - b);
        console.log(`  ${s.id.padEnd(28)} ${s.name}  (${(s.episodes || []).length} eps, S${seasons.join(',')})`);
      });
    return;
  }

  if (args.syncPaths) {
    const query = args.query || 'bou-leechol-iti';
    let series;
    try {
      series = findSeries(list, query);
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
    if (!series) {
      console.error('Series not found');
      process.exit(1);
    }
    const { data: prevJson } = loadSeriesJson(series.id);
    const n = syncPathSeasonsFromJson(series, prevJson);
    // Default: regular seasons without JSON path use their season number
    (series.episodes || []).forEach((ep) => {
      if (ep.pathSeason != null) return;
      const s = ep.season || 1;
      ep.pathSeason = s >= 800 ? s - 800 : s;
    });
    replaceSeriesInChannelsFile(series);
    const ranks = [...new Set((series.episodes || []).map((e) => e.season || 1))].sort((a, b) => {
      const pathOf = (s) => {
        const ep = series.episodes.find((e) => (e.season || 1) === s);
        return ep && ep.pathSeason != null ? ep.pathSeason : s >= 800 ? s - 800 : s;
      };
      const pa = pathOf(a);
      const pb = pathOf(b);
      if (pa !== pb) return pb - pa;
      const sa = a >= 800 ? 1 : 0;
      const sb = b >= 800 ? 1 : 0;
      if (sa !== sb) return sa - sb;
      return b - a;
    });
    console.log(`Synced pathSeason on ${series.name} (${n} from JSON). Display order:`);
    ranks.forEach((s) => {
      const ep = series.episodes.find((e) => (e.season || 1) === s);
      console.log(`  ${s >= 800 ? ep.name.split('—')[0].trim() : 'עונה ' + s} (S${s}, path ${ep.pathSeason})`);
    });
    return;
  }

  if (!args.query) {
    console.error('Usage: node scripts/update-kan-series.js "<series name or id>" [--headed] [--dry-run]');
    console.error('       node scripts/update-kan-series.js --list');
    process.exit(1);
  }

  let series;
  try {
    series = findSeries(list, args.query);
  } catch (e) {
    if (e.code === 'AMBIGUOUS') {
      console.error(e.message);
      process.exit(1);
    }
    throw e;
  }
  if (!series) {
    console.error(`No series matched "${args.query}". Try --list`);
    process.exit(1);
  }
  if (series.source && series.source !== 'kan') {
    console.error(`Series "${series.name}" is source=${series.source}. This updater is for Kan only.`);
    process.exit(1);
  }

  const seriesUrl = resolveSeriesUrl(series, args.url);
  if (!seriesUrl) {
    console.error(
      `No Kan series URL known for "${series.name}" (${series.id}).\n` +
        `Pass --url https://www.kan.org.il/content/kan/kan-11/p-XXXXX/`
    );
    process.exit(1);
  }

  console.log(`Series: ${series.name} (${series.id})`);
  console.log(`URL:    ${seriesUrl}`);
  console.log(`Local:  ${(series.episodes || []).length} episodes`);

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

  const page = await context.newPage();
  let remoteEps;
  try {
    remoteEps = await scrapeSeriesCatalog(page, seriesUrl);
  } finally {
    await page.close();
  }

  console.log(`Remote: ${remoteEps.length} episodes`);

  const { data: prevJson } = loadSeriesJson(series.id);
  const remumbered = remumberConflictingLocalSeasons(series, remoteEps, prevJson);
  if (remumbered) console.log(`Remumbered ${remumbered} local episodes (UI season ≠ /sN/ path)`);

  const knownPages = knownPageSet(prevJson);
  // After remumber, also treat season+ep keys as known for eps without pages
  const have = existingKeySet(series);
  const missing = remoteEps.filter((e) => {
    if (e.page && knownPages.has(e.page)) return false;
    // If we remumbered away from this season, season+ep match alone is wrong —
    // prefer page when available.
    if (e.page) return true;
    return !have.has(epKey(e.season, e.ep));
  });
  console.log(`New:    ${missing.length} episodes`);
  if (missing.length) {
    const byS = new Map();
    missing.forEach((e) => byS.set(e.season, (byS.get(e.season) || 0) + 1));
    console.log(
      '  By season:',
      [...byS.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([s, n]) => `S${s}:${n}`)
        .join(', ')
    );
  }

  if (!missing.length) {
    console.log('Already up to date.');
    if (remumbered && !args.dryRun) {
      replaceSeriesInChannelsFile(series);
      updateJsonCache(series, seriesUrl, remoteEps, prevJson);
      console.log('Wrote remumber-only update to channels.js');
    }
    if (args.fillMissingStreams) {
      const needStream = (series.episodes || []).filter((e) => !e.streamURL);
      console.log(`Fill missing streams: ${needStream.length}`);
    } else {
      await browser.close();
      return;
    }
  }

  if (args.dryRun) {
    missing
      .slice()
      .sort((a, b) => (a.season !== b.season ? a.season - b.season : a.ep - b.ep))
      .forEach((e) =>
        console.log(
          `  + עונה ${e.season} פרק ${e.ep}` +
            (e.pathSeason && e.pathSeason !== e.season ? ` [/s${e.pathSeason}/]` : '') +
            `  ${e.page}`
        )
      );
    await browser.close();
    return;
  }

  const imgDir = path.join(ROOT, 'images', 'kanbox', series.id);
  fs.mkdirSync(imgDir, { recursive: true });
  const posterFallback = series.imageURL || '';

  const added = [];
  for (const ep of missing) {
    console.log(`  Fetching s${ep.season} ep${ep.ep} …`);
    const streamURL = await fetchStreamForEpisode(context, ep);
    let localImage = '';
    if (ep.imageURL || ep.page) {
      const fname = `s${ep.season}-ep${ep.ep}.jpg`;
      const dest = path.join(imgDir, fname);
      let ok = await downloadImageViaBrowser(context, ep.imageURL, ep.page, dest);
      if (!ok) ok = await downloadFile(ep.imageURL, dest);
      if (ok) localImage = `images/kanbox/${series.id}/${fname}`;
    }
    if (!localImage) localImage = posterFallback;

    const entry = {
      id: makeEpisodeId(series, ep.season, ep.ep),
      season: ep.season,
      ep: ep.ep,
      name: `עונה ${ep.season} פרק ${ep.ep}`,
      streamURL: streamURL || '',
      pathSeason: ep.pathSeason != null ? ep.pathSeason : undefined,
      imageURL: localImage,
      placeholder: String(ep.ep)
    };
    series.episodes.push(entry);
    added.push(entry);
    console.log(`  → ${streamURL || 'NOT FOUND'}`);
  }

  // Keep episodes sorted
  series.episodes.sort((a, b) => {
    const sa = a.season || 1;
    const sb = b.season || 1;
    if (sa !== sb) return sa - sb;
    return (a.ep || 0) - (b.ep || 0);
  });

  // Ensure multi-season ids if we now have multiple seasons
  const seasonsNow = new Set(series.episodes.map((e) => e.season || 1));
  if (seasonsNow.size > 1) {
    series.episodes.forEach((e) => {
      const want = `${series.id}-s${e.season || 1}-ep${e.ep}`;
      if (e.id !== want && /^(.+)-ep\d+$/.test(e.id) && !/-s\d+-ep/.test(e.id)) {
        e.id = want;
      }
    });
  }

  replaceSeriesInChannelsFile(series);
  const jsonPath = updateJsonCache(series, seriesUrl, remoteEps, prevJson);

  await browser.close();

  console.log(`\nUpdated ${series.name}: +${added.length} episodes (now ${series.episodes.length})`);
  console.log(`Wrote ${CHANNELS_FILE}`);
  console.log(`Wrote ${jsonPath}`);
  if (added.some((e) => !e.streamURL)) {
    console.log('Warning: some new episodes have empty streamURL — re-run with --headed or retry those pages.');
  }
}

module.exports = {
  fetchStreamForEpisode,
  downloadImageViaBrowser,
  replaceSeriesInChannelsFile,
  serializeSeries,
  escapeStr
};

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
