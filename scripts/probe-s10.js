#!/usr/bin/env node
const { chromium } = require('playwright');
(async () => {
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
  p.on('request', (r) => urls.push(r.url()));
  const pageUrl = 'https://www.kan.org.il/content/kan/kan-11/p-11843/s10/1020198/';
  await p.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(4000);
  const bodyText = await p.evaluate(() => document.body.innerText.slice(0, 500));
  console.log('body snippet:\n', bodyText);
  console.log('title', await p.title());
  const html = await p.content();
  console.log('has entry', /1_[a-z0-9]{8}/.test(html), (html.match(/1_[a-z0-9]{8}/g) || []).slice(0, 5));
  console.log('unavailable', /לא זמין/.test(html));
  // list buttons
  const buttons = await p.evaluate(() =>
    Array.from(document.querySelectorAll('button, [role="button"], a.play'))
      .map((el) => ({
        tag: el.tagName,
        aria: el.getAttribute('aria-label'),
        text: (el.textContent || '').trim().slice(0, 40),
        cls: String(el.className).slice(0, 60)
      }))
      .filter((b) => /נגן|ניגון|play|צפ/i.test(JSON.stringify(b)))
      .slice(0, 20)
  );
  console.log('play-ish', buttons);
  await p.mouse.click(700, 400);
  await p.waitForTimeout(3000);
  for (const sel of ['button[aria-label="ניגון"]', 'video', '.rgpl-btn-undefined', '[class*="play"]']) {
    const els = await p.$$(sel);
    console.log(sel, els.length);
    if (els[0]) {
      try {
        await els[0].click({ timeout: 2000 });
        console.log('clicked', sel);
      } catch (e) {
        console.log('click fail', e.message);
      }
    }
  }
  await p.waitForTimeout(10000);
  const interesting = urls.filter((u) => /m3u8|manifest|vod\/1_|kaltura|playManifest/i.test(u));
  console.log('interesting', [...new Set(interesting)].slice(0, 20));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
