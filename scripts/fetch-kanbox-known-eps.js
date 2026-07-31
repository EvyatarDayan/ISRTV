#!/usr/bin/env node
/** Scrape streams for known episode page URLs (from archive / prior discovery). */
const fs = require('fs');
const path = require('path');

const JOBS = [
  {
    slug: 'mona',
    title: 'מונא',
    seriesId: '13827',
    seriesUrl: 'https://www.kan.org.il/content/kan/kan-11/p-13827/',
    episodes: [98663, 98666, 98669, 98672, 98675, 98678, 98681, 98684].map((id, i) => ({
      season: 1,
      ep: i + 1,
      page: `https://www.kan.org.il/content/kan/kan-11/p-13827/${id}/`
    }))
  },
  {
    slug: 'echad-al-echad',
    title: 'אחד על אחד',
    seriesId: '13237',
    seriesUrl: 'https://www.kan.org.il/content/kan/kan-11/p-13237/',
    episodes: [119335, 119338, 119341, 119344, 119346, 119349, 119352, 119354, 119357, 119360].map(
      (id, i) => ({
        season: 1,
        ep: i + 1,
        page: `https://www.kan.org.il/content/kan/kan-11/p-13237/${id}/`
      })
    )
  },
  {
    slug: 'haish-shemenaa',
    title: 'האיש שניסה למנוע מלחמה',
    seriesId: '13879',
    seriesUrl: 'https://www.kan.org.il/content/kan/kan-11/p-13879/',
    episodes: [
      {
        season: 1,
        ep: 1,
        page: 'https://www.kan.org.il/content/kan/kan-11/p-13879/78078/'
      }
    ]
  },
  {
    slug: 'halayla-haaroch',
    title: 'הלילה הארוך ביותר',
    seriesId: '13157',
    seriesUrl: 'https://www.kan.org.il/content/kan/kan-11/p-13157/',
    episodes: [129541, 129544].map((id, i) => ({
      season: 1,
      ep: i + 1,
      page: `https://www.kan.org.il/content/kan/kan-11/p-13157/${id}/`
    }))
  },
  {
    slug: 'pamta-s1',
    title: 'פמת"א',
    seriesId: '13038',
    seriesUrl: 'https://www.kan.org.il/content/kan/kan-11/p-13038/',
    mergeInto: 'pamta',
    episodes: [
      98217, 98220, 98223, 98234, 98237, 98244, 98247, 98250, 98255, 98258, 98261, 98264, 98267
    ].map((id, i) => ({
      season: 1,
      ep: i + 1,
      page: `https://www.kan.org.il/content/kan/kan-11/p-13038/s1/${id}/`
    }))
  }
];

function isStreamCandidate(url) {
  if (!url) return false;
  const u = url.toLowerCase();
  if (u.includes('bitrate=') && u.includes('&bitrate=') && u.includes('id=')) return false;
  return (
    (u.includes('manifest.ism') && u.includes('playlist.m3u8')) ||
    u.includes('playlist.m3u8?fmp4') ||
    (u.includes('cdn-redge') && u.includes('/vod/'))
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

function score(url) {
  const u = url.toLowerCase();
  let s = 0;
  if (u.includes('playlist.m3u8') && u.includes('fmp4')) s += 100;
  if (u.includes('/hls/')) s += 50;
  if (u.includes('bitrate=') && u.includes('id=')) s -= 80;
  return s;
}

async function fetchStream(context, episode) {
  const page = await context.newPage();
  const candidates = [];
  const consider = (url) => {
    if (isStreamCandidate(url)) candidates.push(normalizeHls(url));
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
      if (candidates.some((u) => score(u) >= 100)) break;
      await page.waitForTimeout(400);
    }
  } catch (err) {
    console.warn('  err', err.message);
  } finally {
    await page.close();
  }
  candidates.sort((a, b) => score(b) - score(a));
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
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });

  for (const job of JOBS) {
    console.log(`\n========== ${job.slug} ==========`);
    const results = [];
    for (const ep of job.episodes) {
      const streamURL = await fetchStream(context, ep);
      console.log(`  → ${streamURL || 'NOT FOUND'}`);
      results.push({
        season: ep.season,
        ep: ep.ep,
        name: `עונה ${ep.season} פרק ${ep.ep}`,
        page: ep.page,
        imageURL: '',
        streamURL
      });
    }

    if (job.mergeInto) {
      const target = path.join(__dirname, `kanbox-${job.mergeInto}.json`);
      const data = JSON.parse(fs.readFileSync(target, 'utf8'));
      const existing = new Set(data.episodes.map((e) => `${e.season}-${e.ep}`));
      results.forEach((e) => {
        if (!existing.has(`${e.season}-${e.ep}`)) data.episodes.push(e);
      });
      data.episodes.sort((a, b) => a.season - b.season || a.ep - b.ep);
      data.title = job.title;
      data.slug = job.mergeInto;
      fs.writeFileSync(target, JSON.stringify(data, null, 2));
      console.log(`Merged into ${target} (${data.episodes.length} total)`);
    } else {
      const out = path.join(__dirname, `kanbox-${job.slug}.json`);
      fs.writeFileSync(
        out,
        JSON.stringify(
          {
            seriesId: job.seriesId,
            slug: job.slug,
            title: job.title,
            seriesUrl: job.seriesUrl,
            episodes: results
          },
          null,
          2
        )
      );
      console.log('Wrote', out);
    }
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
