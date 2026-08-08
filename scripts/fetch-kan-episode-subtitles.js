#!/usr/bin/env node
/**
 * Scrape Kan episode titles + descriptions into name/subtitle fields.
 *
 * Usage:
 *   NODE_PATH=/tmp/savta-dl/node_modules node scripts/fetch-kan-episode-subtitles.js
 *   NODE_PATH=... node scripts/fetch-kan-episode-subtitles.js slicha-al-hasheela shabas
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const CHANNELS = path.join(ROOT, 'js', 'channels.js');
const GENERIC_NAME = /^עונה\s+\d+\s+פרק\s+\d+$/;
const CONCURRENCY = 3;

function escapeStr(s) {
  return String(s || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

function loadChannelsSeries() {
  const vm = require('vm');
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(CHANNELS, 'utf8'), ctx);
  return ctx.window.ISRTV_KANBOX || [];
}

function findJsonForSeries(series) {
  const exact = path.join(__dirname, `kanbox-${series.id}.json`);
  if (fs.existsSync(exact)) {
    try {
      const d = JSON.parse(fs.readFileSync(exact, 'utf8'));
      if ((d.episodes || []).some((e) => e.page)) return exact;
    } catch (e) {}
  }
  const files = fs
    .readdirSync(__dirname)
    .filter((f) => f.startsWith('kanbox-') && f.endsWith('.json'));
  let fallback = null;
  for (const f of files) {
    const full = path.join(__dirname, f);
    try {
      const d = JSON.parse(fs.readFileSync(full, 'utf8'));
      if (!(d.episodes || []).some((e) => e.page)) continue;
      if (d.slug === series.id || d.title === series.name) return full;
      if (
        !fallback &&
        (d.episodes || []).length === (series.episodes || []).length &&
        (d.seriesUrl || '').includes('kan.org.il')
      ) {
        fallback = full;
      }
    } catch (e) {}
  }
  return fallback;
}

function parseEpisodeTitle(h1, ogTitle, epNum) {
  const raw = String(h1 || '').replace(/\s+/g, ' ').trim();
  if (raw.includes('|')) {
    const right = raw.split('|').pop().trim();
    if (/פרק/.test(right)) return right;
  }
  const m = raw.match(/פרק\s*\d+\s*[-–—:]\s*.+/);
  if (m) return m[0].trim();

  const topic = String(ogTitle || '')
    .split('|')
    .pop()
    .trim();
  if (topic && topic.length > 1 && !/^סליחה|^כאן|^עונה/.test(topic)) {
    return `פרק ${epNum} - ${topic}`;
  }
  if (/פרק\s*\d+/.test(raw)) return raw;
  return '';
}

function cleanDesc(s) {
  return String(s || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 280);
}

async function scrapeEpisodePage(context, ep) {
  const page = await context.newPage();
  try {
    await page.goto(ep.page, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(900);
    const meta = await page.evaluate(() => {
      const ogTitle = (document.querySelector('meta[property="og:title"]') || {}).content || '';
      const ogDesc =
        (document.querySelector('meta[property="og:description"]') || {}).content || '';
      const h1 = (document.querySelector('h1') || {}).textContent || '';
      const infoDesc =
        (document.querySelector('.info-description') || {}).textContent || '';
      const infoTitle =
        (document.querySelector('.info-title, .info-title h1') || {}).textContent || '';
      return { ogTitle, ogDesc, h1: h1 || infoTitle, infoDesc };
    });
    const name = parseEpisodeTitle(meta.h1, meta.ogTitle, ep.ep);
    const subtitle = cleanDesc(meta.infoDesc || meta.ogDesc);
    return { name, subtitle, ogTitle: meta.ogTitle };
  } catch (e) {
    return { name: '', subtitle: '', error: e.message };
  } finally {
    await page.close();
  }
}

async function mapPool(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  const workers = [];
  for (let w = 0; w < Math.min(limit, items.length); w++) workers.push(worker());
  await Promise.all(workers);
  return out;
}

function needsUpdate(ep) {
  const name = String(ep.name || '').trim();
  const generic = !name || GENERIC_NAME.test(name) || /^עונה\s+\d+\s+פרק\s+\d+/.test(name);
  const noSub = !ep.subtitle;
  return generic || noSub;
}

async function processSeries(context, series, jsonPath) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  data.slug = series.id;
  const multi = new Set((data.episodes || []).map((e) => e.season || 1)).size > 1;

  console.log(`\n=== ${series.id} (${data.episodes.length} eps) ===`);

  const todo = data.episodes.filter((e) => e.page && needsUpdate(e));
  console.log(`  scraping ${todo.length}`);

  let ok = 0;
  let fail = 0;

  await mapPool(todo, CONCURRENCY, async (ep) => {
    const scraped = await scrapeEpisodePage(context, ep);
    if (scraped.name) {
      ep.name = scraped.name;
      ok++;
    } else {
      fail++;
      console.warn(`  FAIL title s${ep.season}e${ep.ep}`, scraped.error || '');
    }
    if (scraped.subtitle) {
      ep.subtitle = scraped.subtitle;
    }
    if (ok % 10 === 0 && scraped.name) {
      process.stdout.write(`  …${ok}/${todo.length}\r`);
    }
  });

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  const slugJson = path.join(__dirname, `kanbox-${series.id}.json`);
  if (slugJson !== jsonPath) {
    fs.writeFileSync(slugJson, JSON.stringify(data, null, 2));
  }

  console.log(`  done titles=${ok} fail=${fail}`);
  return { id: series.id, multi, data, ok, fail };
}

function updateChannels(results) {
  let text = fs.readFileSync(CHANNELS, 'utf8');

  for (const r of results) {
    const { id, multi, data } = r;
    const idToken = `id: '${id}'`;
    const idIdx = text.indexOf(idToken);
    if (idIdx < 0) {
      console.warn('channels missing', id);
      continue;
    }
    let brace = idIdx;
    while (brace > 0 && text[brace] !== '{') brace--;
    let depth = 0;
    let end = -1;
    for (let i = brace; i < text.length; i++) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}') {
        depth--;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    if (end < 0) continue;
    let block = text.slice(brace, end);
    let updated = 0;

    for (const ep of data.episodes) {
      if (!ep.name && !ep.subtitle) continue;
      const epId = multi ? `${id}-s${ep.season}-ep${ep.ep}` : `${id}-ep${ep.ep}`;
      const altId = `${id}-s${ep.season}-ep${ep.ep}`;
      const ids = [epId, altId].filter((v, i, a) => a.indexOf(v) === i);

      for (const eid of ids) {
        const re = new RegExp(
          `(id:\\s*'${eid}'[\\s\\S]*?)(name:\\s*')([^']*)(')([\\s\\S]*?)(?=\\n\\s*(?:streamURL|imageURL|subtitle|placeholder|assetId|pathSeason|seasonTitle))`
        );
        const m = block.match(re);
        if (!m) continue;

        let chunk = m[0];
        if (ep.name) {
          chunk = chunk.replace(/(name:\s*')([^']*)(')/, `$1${escapeStr(ep.name)}$3`);
        }
        if (ep.subtitle) {
          if (/subtitle:\s*'/.test(chunk)) {
            chunk = chunk.replace(
              /(subtitle:\s*')([^']*)(')/,
              `$1${escapeStr(ep.subtitle)}$3`
            );
          } else {
            chunk = chunk.replace(
              /(name:\s*'[^']*',)/,
              `$1\n                subtitle: '${escapeStr(ep.subtitle)}',`
            );
          }
        }
        block = block.replace(m[0], chunk);
        updated++;
        break;
      }
    }

    text = text.slice(0, brace) + block + text.slice(end);
    console.log('channels', id, 'eps touched', updated);
  }

  fs.writeFileSync(CHANNELS, text);
  // eslint-disable-next-line no-new-func
  new Function(text);
}

async function main() {
  const filter = process.argv.slice(2);
  const all = loadChannelsSeries().filter((s) => !s.source || s.source === 'kan');
  const targets = [];

  for (const s of all) {
    if (filter.length && !filter.includes(s.id)) continue;
    const genericCount = (s.episodes || []).filter((e) => needsUpdate(e)).length;
    if (!genericCount) continue;
    const json = findJsonForSeries(s);
    if (!json) continue;
    targets.push({ series: s, json });
  }

  console.log('series to scrape:', targets.length);

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    locale: 'he-IL',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });

  const warm = await context.newPage();
  await warm.goto('https://www.kan.org.il/content/kan/kan-11/p-12781/', {
    waitUntil: 'domcontentloaded',
    timeout: 120000
  });
  await warm.waitForTimeout(2500);
  await warm.close();

  const results = [];
  for (const t of targets) {
    try {
      results.push(await processSeries(context, t.series, t.json));
    } catch (e) {
      console.error('SERIES FAIL', t.series.id, e.message);
    }
  }

  updateChannels(results);
  await browser.close();

  const ok = results.reduce((a, r) => a + r.ok, 0);
  const fail = results.reduce((a, r) => a + r.fail, 0);
  console.log(`\nALL DONE titles=${ok} fail=${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
