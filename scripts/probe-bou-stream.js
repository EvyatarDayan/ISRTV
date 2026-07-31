#!/usr/bin/env node
const { chromium } = require('playwright');
const data = require('./kanbox-bou-leechol-iti.json');

(async () => {
  const ep = data.episodes[0];
  const b = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const c = await b.newContext({
    locale: 'he-IL',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });
  const p = await c.newPage();
  const urls = [];
  p.on('request', (r) => {
    const u = r.url();
    if (/m3u8|manifest|kaltura|entryId|redge|playManifest/i.test(u)) urls.push(u);
  });
  console.log('goto', ep.page);
  await p.goto(ep.page, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(3500);
  const html = await p.content();
  const entryIds = [...html.matchAll(/1_[a-z0-9]{8}/gi)].map((m) => m[0]);
  const entryIds2 = [...html.matchAll(/entry[_-]?id["'=:\\\s]+([0-9]_[a-z0-9]+)/gi)].map((m) => m[1]);
  console.log('entry-like', [...new Set(entryIds)].slice(0, 15));
  console.log('entryIds2', [...new Set(entryIds2)].slice(0, 15));

  // Look for JSON blobs
  const jsonish = [...html.matchAll(/"EntryId"\s*:\s*"([^"]+)"/gi)].map((m) => m[1]);
  const jsonish2 = [...html.matchAll(/"entryId"\s*:\s*"([^"]+)"/gi)].map((m) => m[1]);
  console.log('EntryId', jsonish.slice(0, 10));
  console.log('entryId', jsonish2.slice(0, 10));

  for (const sel of [
    'button[aria-label="ניגון"]',
    'button[aria-label*="Play"]',
    'video',
    '.rgpl-btn-undefined'
  ]) {
    const el = await p.$(sel);
    if (!el) continue;
    try {
      await el.click({ timeout: 2000 });
      console.log('clicked', sel);
      break;
    } catch (e) {}
  }
  await p.waitForTimeout(10000);
  console.log('network', [...new Set(urls)].slice(0, 30));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
