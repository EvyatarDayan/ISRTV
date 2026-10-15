/**
 * Shared helpers for ISRTV catalog packages (watchlist + package build).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CHANNELS_FILE = path.join(ROOT, 'js', 'channels.js');
const CATALOG = path.join(ROOT, 'scripts', 'catalog');
const WATCHLIST = path.join(CATALOG, 'watchlist.json');
const PACKAGES = path.join(CATALOG, 'packages');
const MEDIA = path.join(CATALOG, 'media');

function loadKanbox() {
  const vm = require('vm');
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(CHANNELS_FILE, 'utf8'), ctx);
  return ctx.window.ISRTV_KANBOX || [];
}

function sourceOf(series) {
  const src = (series && series.source) || 'kan';
  if (src === 'n12') return 'mako';
  if (src === 'r13') return 'reshet';
  if (src === 'tv4') return 'sweden';
  return src;
}

function loadUrlMaps() {
  const kanUrl = Object.create(null);
  const makoMeta = Object.create(null);
  for (const f of fs.readdirSync(path.join(ROOT, 'scripts'))) {
    const full = path.join(ROOT, 'scripts', f);
    if (/^kanbox-.+\.json$/.test(f)) {
      try {
        const d = JSON.parse(fs.readFileSync(full, 'utf8'));
        if (d.slug && d.seriesUrl) kanUrl[d.slug] = d.seriesUrl;
      } catch (_) {}
    }
    if (/^mako-.+\.json$/.test(f)) {
      try {
        const d = JSON.parse(fs.readFileSync(full, 'utf8'));
        const slug = d.slug || f.replace(/^mako-/, '').replace(/\.json$/, '');
        if (slug) makoMeta[slug] = d;
      } catch (_) {}
    }
  }
  return { kanUrl, makoMeta };
}

function familyFromPageURL(pageURL, slug) {
  if (!pageURL) return String(slug || '').replace(/-/g, '_');
  const m = String(pageURL).match(/mako-vod-keshet\/([A-Za-z0-9_-]+)/);
  if (!m) return String(slug || '').replace(/-/g, '_');
  return m[1].replace(/-s-?\d+$/i, '');
}

function buildWatchlist() {
  const list = loadKanbox();
  const { kanUrl, makoMeta } = loadUrlMaps();
  const series = [];
  for (const s of list) {
    const source = sourceOf(s);
    if (source !== 'kan' && source !== 'mako') continue;
    const item = {
      slug: s.id,
      title: s.name || s.id,
      source
    };
    if (source === 'kan') {
      const url = kanUrl[s.id];
      if (!url) continue;
      item.pageURL = url;
    } else {
      const meta = makoMeta[s.id] || {};
      const pageURL = meta.pageURL || meta.pageUrl || meta.url;
      if (!pageURL) continue;
      item.pageURL = pageURL;
      item.family = meta.family || familyFromPageURL(pageURL, s.id);
    }
    series.push(item);
  }
  series.sort((a, b) => {
    if (a.source !== b.source) return a.source < b.source ? -1 : 1;
    return a.slug < b.slug ? -1 : 1;
  });
  fs.mkdirSync(CATALOG, { recursive: true });
  const watch = {
    updatedAt: new Date().toISOString(),
    series
  };
  fs.writeFileSync(WATCHLIST, JSON.stringify(watch, null, 2) + '\n', 'utf8');
  return watch;
}

function copyIfExists(srcRel, destAbs) {
  if (!srcRel) return false;
  const srcAbs = path.isAbsolute(srcRel) ? srcRel : path.join(ROOT, srcRel);
  if (!fs.existsSync(srcAbs)) return false;
  fs.mkdirSync(path.dirname(destAbs), { recursive: true });
  fs.copyFileSync(srcAbs, destAbs);
  return true;
}

function versionForEpisodes(episodes) {
  const src = JSON.stringify(
    (episodes || []).map((e) => [e.season || 1, e.ep || 0, e.streamURL || ''])
  );
  return crypto.createHash('sha1').update(src).digest('hex').slice(0, 12);
}

function readJsonIfExists(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (_) {
    return null;
  }
}

function mergeEpisodeLists() {
  const byKey = Object.create(null);
  for (let i = 0; i < arguments.length; i++) {
    const list = arguments[i] || [];
    for (let j = 0; j < list.length; j++) {
      const ep = list[j];
      if (!ep) continue;
      const season = ep.season || 1;
      const num = ep.ep || ep.episode || 0;
      if (!num) continue;
      const key = season + ':' + num;
      const prev = byKey[key] || {};
      byKey[key] = {
        ep: num,
        season,
        name: ep.name || prev.name || '',
        subtitle: ep.subtitle || prev.subtitle || '',
        pageURL: ep.pageURL || ep.page || prev.pageURL || '',
        streamURL: ep.streamURL || prev.streamURL || '',
        localImage: ep.localImage || ep.imageURL || prev.localImage || '',
        catalogImage: ep.catalogImage || prev.catalogImage || ''
      };
    }
  }
  return Object.keys(byKey)
    .map((k) => byKey[k])
    .sort((a, b) => a.season - b.season || a.ep - b.ep);
}

function packageFromLocal(item) {
  const list = loadKanbox();
  const series = list.find((s) => s.id === item.slug);
  if (!series) {
    throw new Error('series not in channels.js: ' + item.slug);
  }
  const source = item.source || sourceOf(series);
  const mediaDir = path.join(MEDIA, item.slug);
  fs.mkdirSync(mediaDir, { recursive: true });

  const makoJson = readJsonIfExists(
    path.join(ROOT, 'scripts', 'mako-' + item.slug + '.json')
  );
  const kanJson = readJsonIfExists(
    path.join(ROOT, 'scripts', 'kanbox-' + item.slug + '.json')
  );
  const existingPkg = readJsonIfExists(path.join(PACKAGES, item.slug + '.json'));

  const catalogPoster = path.join(mediaDir, 'series.jpg');
  const localPoster =
    (makoJson && makoJson.localPoster) ||
    series.imageURL ||
    `images/kanbox/${item.slug}/series.jpg`;
  copyIfExists(localPoster, catalogPoster);

  const merged = mergeEpisodeLists(
    series.episodes,
    makoJson && makoJson.episodes,
    kanJson && kanJson.episodes,
    existingPkg && existingPkg.episodes
  );

  const episodes = merged.map((ep) => {
    const season = ep.season || 1;
    const num = ep.ep || 0;
    const localImage =
      ep.localImage ||
      ep.imageURL ||
      `images/kanbox/${item.slug}/s${season}-ep${num}.jpg`;
    const catalogImage = path.join(mediaDir, `s${season}-ep${num}.jpg`);
    copyIfExists(localImage, catalogImage);
    return {
      ep: num,
      season,
      name: ep.name || `עונה ${season} פרק ${num}`,
      subtitle: ep.subtitle || '',
      pageURL: ep.pageURL || '',
      streamURL: ep.streamURL || '',
      localImage,
      catalogImage: fs.existsSync(catalogImage)
        ? path.relative(ROOT, catalogImage).replace(/\\/g, '/')
        : ''
    };
  });

  const pkg = {
    slug: item.slug,
    title: item.title || (makoJson && makoJson.title) || series.name || item.slug,
    source,
    pageURL: item.pageURL || (makoJson && makoJson.pageURL) || (kanJson && kanJson.seriesUrl) || '',
    version: versionForEpisodes(episodes),
    updatedAt: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    episodeCount: episodes.length,
    localPoster,
    catalogPoster: fs.existsSync(catalogPoster)
      ? path.relative(ROOT, catalogPoster).replace(/\\/g, '/')
      : '',
    episodes
  };

  fs.mkdirSync(PACKAGES, { recursive: true });
  fs.writeFileSync(
    path.join(PACKAGES, item.slug + '.json'),
    JSON.stringify(pkg, null, 2) + '\n',
    'utf8'
  );
  return pkg;
}

function writeManifest(packages) {
  const manifest = {
    updatedAt: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    series: packages
      .slice()
      .sort((a, b) => (a.slug < b.slug ? -1 : 1))
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        source: p.source,
        version: p.version,
        episodeCount: p.episodeCount,
        updatedAt: p.updatedAt
      }))
  };
  fs.mkdirSync(CATALOG, { recursive: true });
  fs.writeFileSync(
    path.join(CATALOG, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
    'utf8'
  );
  return manifest;
}

function loadExistingPackages() {
  const out = Object.create(null);
  if (!fs.existsSync(PACKAGES)) return out;
  for (const f of fs.readdirSync(PACKAGES)) {
    if (!f.endsWith('.json')) continue;
    try {
      out[f.replace(/\.json$/, '')] = JSON.parse(
        fs.readFileSync(path.join(PACKAGES, f), 'utf8')
      );
    } catch (_) {}
  }
  return out;
}

function runNode(args, opts) {
  const r = spawnSync(process.execPath, args, {
    cwd: ROOT,
    stdio: 'inherit',
    ...opts
  });
  return r.status === 0;
}

function runPython(args, opts) {
  const r = spawnSync('python3', args, {
    cwd: ROOT,
    stdio: 'inherit',
    ...opts
  });
  return r.status === 0;
}

module.exports = {
  ROOT,
  CATALOG,
  WATCHLIST,
  PACKAGES,
  MEDIA,
  loadKanbox,
  sourceOf,
  buildWatchlist,
  packageFromLocal,
  writeManifest,
  loadExistingPackages,
  runNode,
  runPython
};
