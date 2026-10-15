#!/usr/bin/env node
/**
 * Refresh ISRTV catalog for ALL watched Kan + Mako series.
 *
 * Usage:
 *   node scripts/catalog-updater.js
 *   node scripts/catalog-updater.js --seed-only
 *   node scripts/catalog-updater.js --slug kupa-rashit
 *   node scripts/catalog-updater.js --source kan
 *   node scripts/catalog-updater.js --source mako
 *   node scripts/catalog-updater.js --headed          (Kan browser visible; default on)
 *   node scripts/catalog-updater.js --headless
 *
 * Flow:
 *   1) Rebuild watchlist from channels.js (Kan + Mako with known URLs)
 *   2) Optionally scrape remotes for NEW episodes only
 *   3) Rebuild catalog packages from local channels + write manifest
 *
 * TV pulls /catalog/check when you open a VOD tab.
 */
'use strict';

const path = require('path');
const {
  WATCHLIST,
  buildWatchlist,
  packageFromLocal,
  writeManifest,
  loadExistingPackages,
  runNode,
  runPython
} = require('./catalog-lib');

function parseArgs(argv) {
  const args = {
    seedOnly: false,
    slug: '',
    source: '', // kan | mako | ''
    headed: true
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--seed-only') args.seedOnly = true;
    else if (a === '--headed') args.headed = true;
    else if (a === '--headless') args.headed = false;
    else if (a === '--slug' && argv[i + 1]) args.slug = argv[++i];
    else if (a === '--source' && argv[i + 1]) args.source = argv[++i];
  }
  return args;
}

function filterItems(watch, args) {
  let items = watch.series || [];
  if (args.slug) {
    items = items.filter((x) => x.slug === args.slug);
    if (!items.length) {
      throw new Error('slug not in watchlist: ' + args.slug);
    }
  }
  if (args.source) {
    items = items.filter((x) => x.source === args.source);
  }
  return items;
}

function scrapeMako(item) {
  console.log(`\n==== scrape mako ${item.slug}`);
  return runPython([
    path.join('scripts', 'catalog-updater.py'),
    '--slug',
    item.slug,
    '--mako-only'
  ]);
}

function scrapeKan(item, headed) {
  console.log(`\n==== scrape kan ${item.slug}`);
  const args = [path.join('scripts', 'update-kan-series.js'), item.slug];
  if (headed) args.push('--headed');
  if (item.pageURL) {
    args.push('--url', item.pageURL);
  }
  return runNode(args);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  console.log('Building watchlist from channels.js …');
  const watch = buildWatchlist();
  const all = watch.series || [];
  const kanN = all.filter((x) => x.source === 'kan').length;
  const makoN = all.filter((x) => x.source === 'mako').length;
  console.log(`Watchlist: ${all.length} series (kan=${kanN}, mako=${makoN})`);
  console.log(`Wrote ${WATCHLIST}`);

  const items = filterItems(watch, args);
  console.log(`Selected: ${items.length} series to process`);

  if (!args.seedOnly) {
    let ok = 0;
    let fail = 0;
    for (const item of items) {
      let success = false;
      try {
        if (item.source === 'mako') success = scrapeMako(item);
        else if (item.source === 'kan') success = scrapeKan(item, args.headed);
        else {
          console.log(`skip unsupported source ${item.source} for ${item.slug}`);
          continue;
        }
      } catch (e) {
        console.error(`  scrape error ${item.slug}:`, e.message || e);
        success = false;
      }
      if (success) ok += 1;
      else {
        fail += 1;
        console.error(`  FAILED scrape ${item.slug}`);
      }
    }
    console.log(`\nScrape done: ok=${ok} fail=${fail}`);
  } else {
    console.log('Seed-only: skipping remote scrape');
  }

  console.log('\nRebuilding catalog packages from local channels …');
  const existing = loadExistingPackages();
  // Keep packages for series not in this run (e.g. --slug)
  const packagesBySlug = Object.assign(Object.create(null), existing);

  // Always refresh packages for the full watchlist so manifest matches TV tabs
  for (const item of all) {
    try {
      const pkg = packageFromLocal(item);
      packagesBySlug[pkg.slug] = pkg;
      console.log(`  package ${pkg.slug}: ${pkg.episodeCount} eps v=${pkg.version}`);
    } catch (e) {
      console.error(`  package fail ${item.slug}:`, e.message || e);
    }
  }

  const packages = Object.keys(packagesBySlug)
    .sort()
    .map((k) => packagesBySlug[k]);
  const manifest = writeManifest(packages);
  console.log(
    `\nWrote manifest: ${packages.length} series (updatedAt=${manifest.updatedAt})`
  );
  console.log('Done. Keep proxy running; open a VOD tab on the TV to pull updates.');
}

main();
