#!/usr/bin/env node
/**
 * Re-scrape missing seasons for multi-season Kan series.
 * Clicks each season tab, expands "טען עוד", collects episode links, fetches streams.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const TARGETS = [
  {
    slug: 'motek-bol',
    url: 'https://www.kan.org.il/content/kan/kan-11/p-13077/',
    seriesId: '13077',
    seasons: [1, 2]
  },
  {
    slug: 'hamifkadet',
    url: 'https://www.kan.org.il/content/kan/kan-11/p-11766/',
    seriesId: '11766',
    seasons: [1, 2, 3]
  },
  {
    slug: 'menayek',
    url: 'https://www.kan.org.il/content/kan/kan-11/p-12394/',
    seriesId: '12394',
    seasons: [1, 2, 3]
  }
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
  if (u.includes('playlist.m3u8') && !u.includes('fmp4')) {
    u = u.split('?')[0] + '?fmp4';
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

async function collectSeasonEpisodes(page, seriesId, season) {
  return page.evaluate(
    ({ seriesId, season }) => {
      const anchors = Array.from(document.querySelectorAll(`a[href*="/p-${seriesId}/s${season}/"]`));
      const out = [];
      anchors.forEach((a) => {
        const href = a.href.split('?')[0];
        const m = href.match(new RegExp(`/p-${seriesId}/s${season}/(\\d+)/?`));
        if (!m) return;
        let text = (a.textContent || '').replace(/\s+/g, ' ').trim();
        text = text.replace(/^\d{1,2}:\d{2}(?::\d{2})?\s+/, '');
        if (/טריילר|ריקאפ|ריכולים|קדימון|צריכים תזכורת/.test(text)) return;

        let epNum = null;
        const mDash = text.match(/פרק\s*(\d+)/);
        const mSuffix = text.match(/[-–]\s*פרק\s*(\d+)/);
        if (mDash) epNum = Number(mDash[1]);
        else if (mSuffix) epNum = Number(mSuffix[1]);
        else return;

        const img = a.querySelector('img');
        out.push({
          season,
          ep: epNum,
          page: href,
          imageURL: img ? img.src || img.getAttribute('data-src') || '' : '',
          text
        });
      });
      const map = new Map();
      out.forEach((e) => {
        if (!map.has(e.ep)) map.set(e.ep, e);
      });
      return Array.from(map.values()).sort((a, b) => a.ep - b.ep);
    },
    { seriesId, season }
  );
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

  for (const target of TARGETS) {
    console.log(`\n========== ${target.slug} ==========`);
    const jsonPath = path.join(__dirname, `kanbox-${target.slug}.json`);
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const existing = new Set(data.episodes.map((e) => `${e.season}-${e.ep}`));

    const page = await context.newPage();
    await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(3000);

    const allNew = [];
    for (const season of target.seasons) {
      console.log(`-- Season ${season}`);
      // Click season tab
      const clicked = await page.evaluate((season) => {
        const els = Array.from(document.querySelectorAll('button, a, [role="tab"], li, span, div'));
        for (const el of els) {
          const t = (el.textContent || '').trim();
          if (t === `עונה ${season}` || t === `Season ${season}`) {
            el.click();
            return true;
          }
        }
        return false;
      }, season);
      console.log(`  tab click: ${clicked}`);
      await page.waitForTimeout(1500);
      await clickShowMore(page);
      const eps = await collectSeasonEpisodes(page, target.seriesId, season);
      console.log(`  found ${eps.length} episodes`);
      for (const e of eps) {
        const key = `${e.season}-${e.ep}`;
        if (existing.has(key)) continue;
        allNew.push(e);
      }
    }
    await page.close();

    console.log(`Need streams for ${allNew.length} missing episodes`);
    for (const episode of allNew) {
      const streamURL = await fetchStream(context, episode);
      console.log(`  → ${streamURL || 'NOT FOUND'}`);
      data.episodes.push({
        season: episode.season,
        ep: episode.ep,
        name: `עונה ${episode.season} פרק ${episode.ep}`,
        page: episode.page,
        imageURL: episode.imageURL || '',
        streamURL: streamURL || ''
      });
      existing.add(`${episode.season}-${episode.ep}`);
    }

    data.episodes.sort((a, b) => a.season - b.season || a.ep - b.ep);
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    console.log(`Wrote ${jsonPath} (${data.episodes.length} total)`);
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
