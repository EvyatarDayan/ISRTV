#!/usr/bin/env node
/**
 * Merge scraped kanbox-*.json into js/channels.js ISRTV_KANBOX array.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHANNELS = path.join(ROOT, 'js', 'channels.js');

const SLUGS = [
  'malach-mashchit',
  'east-side',
  'aviram-katz',
  'shaat-efes',
  'pamta',
  'matir-agunot',
  'tik-needar',
  'hed-kolech',
  'hadavar-hagadol',
  'mona',
  'echad-al-echad',
  'haish-shemenaa',
  'halayla-haaroch',
  'hatasritai',
  'alumim',
  'tapuchim-midbar'
];

const TITLE_MAP = {
  'malach-mashchit': 'מלאך משחית',
  'east-side': 'איסט סייד',
  'aviram-katz': 'אבירם כץ',
  'shaat-efes': 'שעת אפס',
  pamta: 'פמת"א',
  'matir-agunot': 'מתיר עגונות',
  'tik-needar': 'תיק נעדר',
  'hed-kolech': 'הד קולך',
  'hadavar-hagadol': 'הדבר הגדול המיוחד',
  mona: 'מונא',
  'echad-al-echad': 'אחד על אחד',
  'haish-shemenaa': 'האיש שניסה למנוע מלחמה',
  'halayla-haaroch': 'הלילה הארוך ביותר',
  hatasritai: 'התסריטאי',
  alumim: 'עלומים',
  'tapuchim-midbar': 'תפוחים מן המדבר'
};

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function toEntry(data) {
  const slug = data.slug;
  const title = TITLE_MAP[slug] || data.title;
  const multi = new Set(data.episodes.map((e) => e.season || 1)).size > 1;
  const poster = data.localPoster || `images/kanbox/${slug}/series.jpg`;
  const lines = [];
  lines.push('    {');
  lines.push(`        id: '${slug}',`);
  lines.push(`        name: '${esc(title)}',`);
  lines.push(`        placeholder: '${esc(title)}',`);
  lines.push(`        imageURL: '${poster}',`);
  lines.push('        episodes: [');
  data.episodes
    .slice()
    .sort((a, b) => (a.season || 1) - (b.season || 1) || a.ep - b.ep)
    .forEach((ep, i, arr) => {
      const season = ep.season || 1;
      const id = multi ? `${slug}-s${season}-ep${ep.ep}` : `${slug}-ep${ep.ep}`;
      const img =
        ep.localImage ||
        (multi
          ? `images/kanbox/${slug}/s${season}-ep${ep.ep}.jpg`
          : `images/kanbox/${slug}/ep${ep.ep}.jpg`);
      lines.push('            {');
      lines.push(`                id: '${id}',`);
      lines.push(`                season: ${season},`);
      lines.push(`                ep: ${ep.ep},`);
      lines.push(`                name: 'עונה ${season} פרק ${ep.ep}',`);
      lines.push(`                streamURL: '${ep.streamURL || ''}',`);
      lines.push(`                imageURL: '${img}',`);
      lines.push(`                placeholder: '${ep.ep}'`);
      lines.push(i < arr.length - 1 ? '            },' : '            }');
    });
  lines.push('        ]');
  lines.push('    }');
  return lines.join('\n');
}

function main() {
  const entries = [];
  const present = [];
  for (const slug of SLUGS) {
    const p = path.join(__dirname, `kanbox-${slug}.json`);
    if (!fs.existsSync(p)) {
      console.warn('Missing (skip)', p);
      continue;
    }
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    data.slug = slug;
    if (!data.episodes || !data.episodes.length) {
      console.warn('Empty episodes (skip)', slug);
      continue;
    }
    const missing = data.episodes.filter((e) => !e.streamURL).length;
    console.log(
      `${slug}: ${data.episodes.length} eps, missing streams=${missing}, images=${data.episodes.filter((e) => e.localImage).length}`
    );
    entries.push(toEntry(data));
    present.push(slug);
  }
  if (!entries.length) {
    console.error('Nothing to merge');
    process.exit(1);
  }

  let src = fs.readFileSync(CHANNELS, 'utf8');
  const marker = 'window.ISRTV_KANBOX = [';
  const start = src.indexOf(marker);
  if (start < 0) throw new Error('KANBOX not found');
  const arrayStart = start + marker.length;
  // Find matching closing ]; for the array — last ]; before end of file in practice
  // Safer: find end of existing array by brace matching from arrayStart
  let i = arrayStart;
  let depth = 1;
  let inStr = false;
  let strCh = '';
  let escape = false;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (escape) escape = false;
      else if (c === '\\') escape = true;
      else if (c === strCh) inStr = false;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      inStr = true;
      strCh = c;
      continue;
    }
    if (c === '[') depth++;
    if (c === ']') {
      depth--;
      if (depth === 0) break;
    }
  }
  if (depth !== 0) throw new Error('Could not find end of KANBOX array');

  const before = src.slice(0, arrayStart);
  const after = src.slice(i); // starts with ]
  // Keep existing series, append new ones
  const existing = src.slice(arrayStart, i).trim();
  let merged;
  if (!existing) {
    merged = '\n' + entries.join(',\n') + '\n';
  } else {
    // Remove trailing comma if any
    const cleaned = existing.replace(/,\s*$/, '');
    merged = '\n' + cleaned + ',\n' + entries.join(',\n') + '\n';
  }

  // Avoid duplicates if re-run
  for (const slug of present) {
    if (new RegExp(`id:\\s*'${slug}'`).test(existing)) {
      console.error(`Series ${slug} already in channels.js — aborting to avoid duplicates`);
      process.exit(1);
    }
  }

  fs.writeFileSync(CHANNELS, before + merged + after);
  console.log('Updated', CHANNELS);
}

main();
