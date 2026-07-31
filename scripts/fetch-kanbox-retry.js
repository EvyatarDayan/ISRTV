#!/usr/bin/env node
/**
 * Retry scrape for series that use /עונה-N/ paths or failed previously.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

const RETRY = [
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-11332/', slug: 'east-side', title: 'איסט סייד' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-13688/', slug: 'matir-agunot', title: 'מתיר עגונות' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-13827/', slug: 'mona', title: 'מונא' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-13237/', slug: 'echad-al-echad', title: 'אחד על אחד' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-13879/', slug: 'haish-shemenaa', title: 'האיש שניסה למנוע מלחמה' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-13157/', slug: 'halayla-haaroch', title: 'הלילה הארוך ביותר' },
  { url: 'https://www.kan.org.il/content/kan/kan-11/p-13038/', slug: 'pamta', title: 'פמת"א', forceSeasons: [1, 2] }
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

function normalizeHls(url) {
  if (!url) return '';
  let u = url.split('#')[0];
  if (u.includes('Manifest.ism') && !u.includes('playlist.m3u8')) {
    u = u.replace('/dash/', '/hls/').replace(/\?.*$/, '') + '/playlist.m3u8?fmp4';
  }
  if (u.includes('playlist.m3u8') && !u.includes('fmp4')) u = u.split('?')[0] + '?fmp4';
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
  for (let i = 0; i < 15; i++) {
    const more = await page.$('#vod-page-items-show-more button, button:has-text("טען עוד"), button:has-text("עוד")');
    if (!more) break;
    try {
      await more.click({ timeout: 1500 });
      await page.waitForTimeout(700);
    } catch (e) {
      break;
    }
  }
}

async function scrapeEpisodes(page, seriesUrl) {
  const seriesId = (seriesUrl.match(/p-(\d+)/) || [])[1];
  await page.goto(seriesUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(3500);
  await clickShowMore(page);

  // Click all season tabs
  for (let round = 0; round < 8; round++) {
    const clicked = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('button, a, [role="tab"], li, span, div'));
      for (const el of els) {
        const t = (el.textContent || '').trim();
        if (/^עונה\s*\d+$/.test(t) && !el.dataset._scraped) {
          el.dataset._scraped = '1';
          el.click();
          return t;
        }
      }
      return '';
    });
    if (!clicked) break;
    await page.waitForTimeout(1200);
    await clickShowMore(page);
  }

  return page.evaluate((seriesId) => {
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
      const season = Number(mPath[1]);
      const pageId = mPath[2];
      const titleNode = a.querySelector('.card-title, .title, [class*="title"]');
      let text = (a.textContent || (titleNode && titleNode.textContent) || '').replace(/\s+/g, ' ').trim();
      text = text.replace(/^\d{1,2}:\d{2}(?::\d{2})?\s+/, '');
      if (/טריילר|ריקאפ|קדימון|הרב מתגרש|עקרות הלכתית|הצצות/.test(text)) return;

      let ep = 0;
      const m =
        text.match(/פרק\s*(\d+)/) ||
        text.match(/\|\s*פרק\s*(\d+)/) ||
        text.match(/[-–]\s*פרק\s*(\d+)/);
      if (m) ep = Number(m[1]);
      if (/פרק\s*אחרון/.test(text) && !ep) ep = 999;

      const img = a.querySelector('img');
      out.push({
        season,
        ep,
        page: href,
        pageId,
        imageURL: img ? img.src || '' : '',
        text
      });
    });

    const byPage = new Map();
    out.forEach((e) => {
      if (!byPage.has(e.page)) byPage.set(e.page, e);
    });
    const list = Array.from(byPage.values());
    const bySeason = {};
    list.forEach((e) => {
      if (!bySeason[e.season]) bySeason[e.season] = [];
      bySeason[e.season].push(e);
    });
    const final = [];
    Object.keys(bySeason)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((season) => {
        const items = bySeason[season];
        const numbered = items.filter((e) => e.ep > 0 && e.ep !== 999).sort((a, b) => a.ep - b.ep);
        const zeros = items.filter((e) => e.ep === 0);
        const lasts = items.filter((e) => e.ep === 999);
        const used = new Set(numbered.map((x) => x.ep));
        zeros.forEach((e) => {
          let n = 1;
          while (used.has(n)) n++;
          e.ep = n;
          used.add(n);
          numbered.push(e);
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
    return final.map((e) => ({
      season: e.season,
      ep: e.ep,
      name: `עונה ${e.season} פרק ${e.ep}`,
      page: e.page,
      imageURL: e.imageURL
    }));
  }, seriesId);
}

async function fetchStream(context, episode) {
  const page = await context.newPage();
  const candidates = [];
  const consider = (url) => {
    if (!isStreamCandidate(url)) return;
    candidates.push(normalizeHls(url));
  };
  page.on('request', (req) => consider(req.url()));
  page.on('response', (res) => consider(res.url()));
  try {
    console.log(`  [s${episode.season} ep${episode.ep}] ${episode.page}`);
    await page.goto(episode.page, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(2000);
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
    while (Date.now() - started < 18000) {
      if (candidates.some((u) => scoreStreamUrl(u) >= 100)) break;
      await page.waitForTimeout(400);
    }
  } catch (err) {
    console.warn('  err', err.message);
  } finally {
    await page.close();
  }
  candidates.sort((a, b) => scoreStreamUrl(b) - scoreStreamUrl(a));
  return normalizeHls(candidates[0] || '');
}

async function scrapeSingleFilm(page, seriesUrl) {
  // For single-episode pages like "האיש שניסה למנוע מלחמה"
  await page.goto(seriesUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(2000);
  const hasPlayer = await page.$('video, button[aria-label*="ניגון"], .rgpl-btn-undefined');
  if (!hasPlayer) return [];
  return [
    {
      season: 1,
      ep: 1,
      name: 'עונה 1 פרק 1',
      page: seriesUrl,
      imageURL: ''
    }
  ];
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

  for (const item of RETRY) {
    console.log(`\n========== ${item.slug} ==========`);
    await new Promise((r) => setTimeout(r, 2000));
    const page = await context.newPage();
    let episodes = [];
    try {
      episodes = await scrapeEpisodes(page, item.url);
      if (!episodes.length && item.slug === 'haish-shemenaa') {
        episodes = await scrapeSingleFilm(page, item.url);
      }
    } catch (e) {
      console.error('scrape fail', e.message);
    }
    await page.close();
    console.log(`Found ${episodes.length} episodes`);
    if (!episodes.length) {
      console.log('SKIP');
      continue;
    }

    for (const ep of episodes) {
      ep.streamURL = await fetchStream(context, ep);
      console.log(`  → ${ep.streamURL || 'NOT FOUND'}`);
    }

    const payload = {
      seriesId: (item.url.match(/p-(\d+)/) || [])[1],
      slug: item.slug,
      title: item.title,
      poster: '',
      seriesUrl: item.url,
      episodes
    };
    const out = path.join(__dirname, `kanbox-${item.slug}.json`);
    fs.writeFileSync(out, JSON.stringify(payload, null, 2));
    console.log('Wrote', out);
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
