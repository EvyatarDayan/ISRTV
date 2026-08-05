#!/usr/bin/env node
/**
 * Align "בואו לאכול איתי" with the Kan.org season dropdown + episode cards.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const updater = require('./update-kan-series.js');

const ROOT = path.resolve(__dirname, '..');
const CHANNELS_FILE = path.join(ROOT, 'js', 'channels.js');
const SERIES_ID = 'bou-leechol-iti';
const IMG_DIR = path.join(ROOT, 'images', 'kanbox', SERIES_ID);

const S10_NAMES = {
  1: "פרק 1 - שבוע ירושלים, יום א'",
  2: "פרק 2 - שבוע ירושלים, יום ב'",
  3: "פרק 3 - שבוע ירושלים, יום ג'",
  4: "פרק 4 - שבוע ירושלים, יום ד'",
  5: "פרק 5 - שבוע ירושלים, יום ה'",
  6: "פרק 6 - שבוע שפלה, יום א'",
  7: "פרק 7 - שבוע שפלה, יום ב'",
  8: "פרק 8 - שבוע שפלה, יום ג'",
  9: "פרק 9 - שבוע שפלה, יום ד'",
  10: "פרק 10 - שבוע שפלה, יום ה'",
  11: "פרק 11 - שבוע צפון, יום א'",
  12: "פרק 12 - שבוע צפון, יום ב'",
  13: "פרק 13 - שבוע צפון, יום ג'"
};

const S11_NAMES = {
  1: 'שבוע ירושלים - רועי',
  2: 'שבוע ירושלים - אדם',
  3: 'שבוע ירושלים - יגאל',
  4: 'שבוע ירושלים - חיה',
  5: 'שבוע ירושלים - ניקול',
  6: 'שבוע השפלה - איריס',
  7: 'שבוע השפלה - יריב',
  8: 'שבוע השפלה - ליהי',
  9: 'שבוע השפלה - זוהר',
  10: 'שבוע השפלה - דניאל',
  11: 'שבוע צפון - עליזה',
  12: 'שבוע הצפון - מירן',
  13: 'שבוע צפון - רוני',
  14: 'שבוע צפון - אבינעם',
  15: 'שבוע צפון - אלירן'
};

const S810_NAMES = {
  1: "חלק א' - טל רשבסקי",
  2: "חלק ב' - לילי בן שלום",
  3: "חלק ג' - בנצי ארבל",
  4: "חלק ד' - יוסי שטרית",
  5: "חלק ה' - חן קורן"
};

const NEW_EPS = [
  { season: 10, ep: 11, pathSeason: 12, pageId: '1077371', name: S10_NAMES[11] },
  { season: 10, ep: 12, pathSeason: 12, pageId: '1077372', name: S10_NAMES[12] },
  { season: 10, ep: 13, pathSeason: 12, pageId: '1077373', name: S10_NAMES[13] },
  { season: 11, ep: 11, pathSeason: 11, pageId: '1079182', name: S11_NAMES[11] },
  { season: 11, ep: 12, pathSeason: 11, pageId: '1079183', name: S11_NAMES[12] },
  { season: 11, ep: 13, pathSeason: 11, pageId: '1079185', name: S11_NAMES[13] },
  { season: 11, ep: 14, pathSeason: 11, pageId: '1079186', name: S11_NAMES[14] },
  { season: 11, ep: 15, pathSeason: 11, pageId: '1079188', name: S11_NAMES[15] }
];

function loadChannels() {
  global.window = global.window || {};
  // eslint-disable-next-line no-eval
  eval(fs.readFileSync(CHANNELS_FILE, 'utf8'));
  return window.ISRTV_KANBOX || [];
}

function pageUrl(pathSeason, pageId) {
  return `https://www.kan.org.il/content/kan/kan-11/p-11843/s${pathSeason}/${pageId}/`;
}

async function main() {
  const list = loadChannels();
  const series = list.find((s) => s.id === SERIES_ID);
  if (!series) throw new Error('series not found');

  series.seasonTitles = {
    11: 'הכירו את משתתפי עונת העשור',
    810: 'ספיישל פסח'
  };

  const before = series.episodes.length;
  series.episodes = series.episodes.filter((e) => (e.season || 1) !== 7);
  console.log(`Removed season 7: ${before} → ${series.episodes.length}`);

  series.episodes.forEach((ep) => {
    if (ep.season === 10 && S10_NAMES[ep.ep]) ep.name = S10_NAMES[ep.ep];
    if (ep.season === 11 && S11_NAMES[ep.ep]) ep.name = S11_NAMES[ep.ep];
    if (ep.season === 810 && S810_NAMES[ep.ep]) ep.name = S810_NAMES[ep.ep];
  });

  const have = new Set(series.episodes.map((e) => `${e.season}-${e.ep}`));
  const toAdd = NEW_EPS.filter((e) => !have.has(`${e.season}-${e.ep}`));
  console.log('New episodes to fetch:', toAdd.length);

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    locale: 'he-IL',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1400, height: 900 }
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const warm = await context.newPage();
  await warm.goto('https://www.kan.org.il/content/kan/kan-11/p-11843/', {
    waitUntil: 'domcontentloaded',
    timeout: 120000
  });
  await warm.waitForTimeout(4000);
  console.log('warmup title', await warm.title());
  await warm.close();

  fs.mkdirSync(IMG_DIR, { recursive: true });

  for (const spec of toAdd) {
    const page = pageUrl(spec.pathSeason, spec.pageId);
    console.log(`Fetching s${spec.season} ep${spec.ep} ${page}`);
    const streamURL = await updater.fetchStreamForEpisode(context, {
      season: spec.season,
      ep: spec.ep,
      page
    });
    const fname = `s${spec.season}-ep${spec.ep}.jpg`;
    const dest = path.join(IMG_DIR, fname);
    let ok = await updater.downloadImageViaBrowser(context, '', page, dest);
    const imageURL = ok
      ? `images/kanbox/${SERIES_ID}/${fname}`
      : series.imageURL || '';
    series.episodes.push({
      id: `${SERIES_ID}-s${spec.season}-ep${spec.ep}`,
      season: spec.season,
      ep: spec.ep,
      name: spec.name,
      streamURL: streamURL || '',
      pathSeason: spec.pathSeason,
      imageURL,
      placeholder: String(spec.ep)
    });
    console.log(`  stream=${streamURL ? 'ok' : 'MISSING'} image=${ok ? 'ok' : 'fallback'}`);
    await new Promise((r) => setTimeout(r, 1200));
  }

  await browser.close();

  series.episodes.sort((a, b) => {
    const sa = a.season || 1;
    const sb = b.season || 1;
    if (sa !== sb) return sa - sb;
    return (a.ep || 0) - (b.ep || 0);
  });

  updater.replaceSeriesInChannelsFile(series);

  const jsonPath = path.join(ROOT, 'scripts', `kanbox-${SERIES_ID}.json`);
  let prev = {};
  try {
    prev = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (_) {}
  const merged = series.episodes.map((ep) => {
    const existing = (prev.episodes || []).find(
      (e) => e.season === ep.season && e.ep === ep.ep
    );
    const spec = NEW_EPS.find((e) => e.season === ep.season && e.ep === ep.ep);
    const pageTitle =
      ep.season === 11
        ? 'הכירו את משתתפי עונת העשור'
        : ep.season === 810
          ? 'ספיישל פסח'
          : ep.season === 10
            ? 'עונה 10'
            : existing && existing.pageTitle;
    return {
      ...(existing || {}),
      season: ep.season,
      ep: ep.ep,
      name: ep.name,
      page: spec ? pageUrl(spec.pathSeason, spec.pageId) : existing && existing.page,
      streamURL: ep.streamURL,
      localImage: ep.imageURL,
      pathSeason: ep.pathSeason,
      pageTitle
    };
  });
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        ...prev,
        seriesId: '11843',
        slug: SERIES_ID,
        title: 'בואו לאכול איתי',
        seriesUrl: 'https://www.kan.org.il/content/kan/kan-11/p-11843/',
        episodes: merged
      },
      null,
      2
    )
  );

  const bySeason = {};
  series.episodes.forEach((e) => {
    const s = e.season || 1;
    bySeason[s] = (bySeason[s] || 0) + 1;
  });
  console.log('Final seasons:', bySeason);
  console.log('Total episodes:', series.episodes.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
