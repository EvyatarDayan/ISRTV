#!/usr/bin/env node
/**
 * Scrape a NEW Kan series and append it to js/channels.js (ISRTV_KANBOX).
 *
 * Usage:
 *   node scripts/add-kan-series.js --url https://www.kan.org.il/content/kan/kan-11/p-XXXXX/ \
 *     --id bou-leechol-iti-aravit --name "בואו לאכול איתי - ערבית" --headed
 *   node scripts/add-kan-series.js --url ... --id slug --name "Title" --after bou-leechol-iti --headed
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHANNELS_FILE = path.join(ROOT, 'js', 'channels.js');

function parseArgs(argv) {
  const args = {
    url: '',
    id: '',
    name: '',
    after: '',
    headed: false,
    dryRun: false
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--headed') args.headed = true;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--url') args.url = argv[++i] || '';
    else if (a === '--id') args.id = argv[++i] || '';
    else if (a === '--name') args.name = argv[++i] || '';
    else if (a === '--after') args.after = argv[++i] || '';
  }
  return args;
}

function loadUks() {
  const src = fs
    .readFileSync(path.join(__dirname, 'update-kan-series.js'), 'utf8')
    .replace(/\nmain\(\)\.catch[\s\S]*$/, '\n');
  const helperPath = path.join(__dirname, '_tmp_add_kan_helpers.js');
  fs.writeFileSync(
    helperPath,
    src +
      '\nmodule.exports = {\n' +
      '  scrapeSeriesCatalog,\n' +
      '  fetchStreamForEpisode,\n' +
      '  downloadImageViaBrowser,\n' +
      '  serializeSeries,\n' +
      '  updateJsonCache,\n' +
      '  escapeStr\n' +
      '};\n'
  );
  try {
    return require(helperPath);
  } finally {
    try {
      fs.unlinkSync(helperPath);
    } catch (_) {}
  }
}

function insertSeriesInChannelsFile(series, afterId) {
  const text = fs.readFileSync(CHANNELS_FILE, 'utf8');
  if (text.includes(`id: '${series.id}'`)) {
    throw new Error(`Series id already exists in channels.js: ${series.id}`);
  }
  const block = serializeFromLocal(series);
  let insertAt = -1;
  if (afterId) {
    const idToken = `id: '${afterId}'`;
    const idIdx = text.indexOf(idToken);
    if (idIdx < 0) throw new Error('after id not found: ' + afterId);
    let start = idIdx;
    while (start > 0 && text[start] !== '{') start--;
    let depth = 0;
    for (let i = start; i < text.length; i++) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}') {
        depth--;
        if (depth === 0) {
          insertAt = i + 1;
          break;
        }
      }
    }
  } else {
    const arr = text.indexOf('window.ISRTV_KANBOX = [');
    if (arr < 0) throw new Error('ISRTV_KANBOX not found');
    insertAt = text.indexOf('[', arr) + 1;
    const newText = text.slice(0, insertAt) + '\n' + block + ',' + text.slice(insertAt);
    fs.writeFileSync(CHANNELS_FILE, newText);
    new Function(newText);
    return;
  }

  // after a series object: insert ",\n" + block + "," so both neighbors stay valid
  if (text[insertAt] === ',') insertAt += 1;
  const newText =
    text.slice(0, insertAt) + '\n' + block + ',' + text.slice(insertAt);
  fs.writeFileSync(CHANNELS_FILE, newText);
  new Function(newText);
}

function serializeFromLocal(series) {
  // Prefer uks.serializeSeries if available via global set in main
  if (global.__uksSerialize) return global.__uksSerialize(series);
  const lines = [];
  lines.push('    {');
  lines.push(`        id: '${series.id}',`);
  lines.push(`        name: '${String(series.name).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}',`);
  lines.push(
    `        placeholder: '${String(series.placeholder || series.name).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}',`
  );
  lines.push(`        imageURL: '${series.imageURL || ''}',`);
  lines.push(`        source: 'kan',`);
  lines.push('        episodes: [');
  (series.episodes || []).forEach((ep, i) => {
    lines.push('            {');
    lines.push(`                id: '${ep.id}',`);
    lines.push(`                season: ${ep.season || 1},`);
    lines.push(`                ep: ${ep.ep},`);
    lines.push(
      `                name: '${String(ep.name || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'")}',`
    );
    lines.push(`                streamURL: '${ep.streamURL || ''}',`);
    if (ep.pathSeason != null) lines.push(`                pathSeason: ${Number(ep.pathSeason)},`);
    lines.push(`                imageURL: '${ep.imageURL || ''}',`);
    lines.push(`                placeholder: '${ep.placeholder || ep.ep}'`);
    lines.push(i < series.episodes.length - 1 ? '            },' : '            }');
  });
  lines.push('        ]');
  lines.push('    }');
  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.url || !args.id || !args.name) {
    console.error(
      'Usage: node scripts/add-kan-series.js --url <kan-series-url> --id <slug> --name "<title>" [--after <id>] [--headed]'
    );
    process.exit(1);
  }

  const seriesUrl = args.url.replace(/\/s\d+\/.*$/, '/').replace(/\/?$/, '/');
  console.log(`Adding: ${args.name} (${args.id})`);
  console.log(`URL:    ${seriesUrl}`);

  const uks = loadUks();
  global.__uksSerialize = uks.serializeSeries;

  const playwright = require('playwright');
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
    remoteEps = await uks.scrapeSeriesCatalog(page, seriesUrl);
  } finally {
    await page.close();
  }

  console.log(`Remote: ${remoteEps.length} episodes`);
  const byS = new Map();
  remoteEps.forEach((e) => byS.set(e.season, (byS.get(e.season) || 0) + 1));
  console.log(
    '  By season:',
    [...byS.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([s, n]) => `S${s}:${n}`)
      .join(', ')
  );

  if (args.dryRun) {
    remoteEps
      .slice()
      .sort((a, b) => (a.season !== b.season ? a.season - b.season : a.ep - b.ep))
      .forEach((e) => console.log(`  S${e.season}E${e.ep} ${e.text || ''} ${e.page}`));
    await browser.close();
    return;
  }

  await context.close();

  const imgDir = path.join(ROOT, 'images', 'kanbox', args.id);
  fs.mkdirSync(imgDir, { recursive: true });
  const partialPath = path.join(__dirname, `.partial-${args.id}.json`);
  let partial = [];
  if (fs.existsSync(partialPath)) {
    try {
      partial = JSON.parse(fs.readFileSync(partialPath, 'utf8'));
    } catch (_) {}
  }
  const partialByKey = new Map(partial.map((e) => [`${e.season}:${e.ep}`, e]));
  let saveChain = Promise.resolve();

  function kanContext() {
    return browser.newContext({
      locale: 'he-IL',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      viewport: { width: 1400, height: 900 }
    });
  }

  const episodes = new Array(remoteEps.length);
  let cursor = 0;
  const concurrency = 2;
  async function worker() {
    while (cursor < remoteEps.length) {
      const i = cursor++;
      const ep = remoteEps[i];
      const key = `${ep.season}:${ep.ep}`;
      const cached = partialByKey.get(key);
      if (
        cached &&
        cached.streamURL &&
        cached.imageURL &&
        fs.existsSync(path.join(ROOT, cached.imageURL))
      ) {
        episodes[i] = cached;
        console.log(`  s${ep.season}e${ep.ep} cached`);
        continue;
      }
      console.log(`  Fetching s${ep.season} ep${ep.ep} (${i + 1}/${remoteEps.length}) …`);
      const epContext = await kanContext();
      let streamURL = '';
      let localImage = '';
      try {
        for (let attempt = 0; attempt < 2 && !streamURL; attempt++) {
          streamURL = await uks.fetchStreamForEpisode(epContext, ep);
        }
        const fname = `s${ep.season}-ep${ep.ep}.jpg`;
        const dest = path.join(imgDir, fname);
        let ok = await uks.downloadImageViaBrowser(epContext, ep.imageURL, ep.page, dest);
        if (!ok) ok = await uks.downloadImageViaBrowser(epContext, ep.imageURL, ep.page, dest);
        if (ok) localImage = `images/kanbox/${args.id}/${fname}`;
      } finally {
        await epContext.close();
      }

      const cardName = String(ep.text || '')
        .replace(/\s+/g, ' ')
        .trim();
      const name = ep.scrapedName || cardName || `עונה ${ep.season} פרק ${ep.ep}`;
      const row = {
        id: `${args.id}-s${ep.season}-ep${ep.ep}`,
        season: ep.season,
        ep: ep.ep,
        name,
        streamURL: streamURL || '',
        pathSeason: ep.pathSeason != null ? ep.pathSeason : ep.season,
        imageURL: localImage,
        placeholder: String(ep.ep)
      };
      if (ep.scrapedSubtitle) row.subtitle = ep.scrapedSubtitle;
      episodes[i] = row;
      saveChain = saveChain.then(() => {
        partialByKey.set(key, row);
        fs.writeFileSync(partialPath, JSON.stringify([...partialByKey.values()]));
      });
      console.log(
        `  s${ep.season}e${ep.ep} ${streamURL ? 'stream OK' : 'NO STREAM'} | ${localImage ? 'img OK' : 'NO IMG'} | ${name}`
      );
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, remoteEps.length) }, () => worker()));
  await saveChain;

  episodes.sort((a, b) => (a.season !== b.season ? a.season - b.season : a.ep - b.ep));

  const seriesJpg = path.join(imgDir, 'series.jpg');
  const posterContext = await kanContext();
  const posterPage = await posterContext.newPage();
  try {
    await posterPage.goto(seriesUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
    const og = await posterPage.evaluate(
      () => (document.querySelector('meta[property="og:image"]') || {}).content || ''
    );
    if (og) await uks.downloadImageViaBrowser(posterContext, og, seriesUrl, seriesJpg);
  } catch (_) {}
  await posterContext.close();
  if (!fs.existsSync(seriesJpg) && episodes[0] && episodes[0].imageURL) {
    fs.copyFileSync(path.join(ROOT, episodes[0].imageURL), seriesJpg);
  }

  const series = {
    id: args.id,
    name: args.name,
    placeholder: args.name,
    imageURL: `images/kanbox/${args.id}/series.jpg`,
    source: 'kan',
    episodes
  };

  insertSeriesInChannelsFile(series, args.after || '');

  const jsonPath = path.join(__dirname, `kanbox-${args.id}.json`);
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        scrapedAt: new Date().toISOString(),
        seriesId: (seriesUrl.match(/p-(\d+)/) || [])[1] || '',
        slug: args.id,
        title: args.name,
        seriesUrl,
        episodeCount: episodes.length,
        episodes: remoteEps
          .map((e) => {
            const saved = episodes.find((x) => x.season === e.season && x.ep === e.ep);
            return Object.assign({}, e, {
              name: (saved && saved.name) || e.text || '',
              subtitle: (saved && saved.subtitle) || e.scrapedSubtitle || '',
              streamURL: (saved && saved.streamURL) || '',
              localImage: (saved && saved.imageURL) || ''
            });
          })
          .sort((a, b) => (a.season !== b.season ? a.season - b.season : a.ep - b.ep))
      },
      null,
      2
    )
  );

  await browser.close();
  console.log(`\nAdded ${args.name}: ${episodes.length} episodes`);
  console.log(`Wrote ${CHANNELS_FILE}`);
  console.log(`Wrote ${jsonPath}`);
  const missingStreams = episodes.filter((e) => !e.streamURL).length;
  const missingImgs = episodes.filter((e) => !e.imageURL).length;
  if (missingStreams) console.log(`Warning: ${missingStreams} without stream`);
  if (missingImgs) console.log(`Warning: ${missingImgs} without image`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
