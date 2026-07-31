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

  await p.goto('https://www.kan.org.il/content/kan/kan-11/p-11843/s7/439453/', {
    waitUntil: 'domcontentloaded',
    timeout: 90000
  });
  await p.waitForTimeout(3000);
  console.log('s7 ep title', await p.title());

  const related = await p.evaluate(() =>
    Array.from(document.querySelectorAll('a[href*="p-11843"]'))
      .map((a) => a.href)
      .filter((h) => /\/s(7|10)\//.test(h))
  );
  console.log('related from ep page', [...new Set(related)].slice(0, 40));

  await p.goto('https://www.kan.org.il/content/kan/kan-11/p-11843/', {
    waitUntil: 'domcontentloaded',
    timeout: 120000
  });
  await p.waitForTimeout(5000);
  const html = await p.content();
  console.log('series page len', html.length, 'blocked', /been blocked/i.test(html));

  // Click through every element that looks like a season control
  const seasonsFound = await p.evaluate(async () => {
    const results = {};
    const candidates = Array.from(document.querySelectorAll('button, a, [role="tab"], li, div, span'));
    for (let season = 1; season <= 12; season++) {
      const re = new RegExp('^עונה\\s*' + season + '$');
      for (const el of candidates) {
        const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (!re.test(t)) continue;
        el.click();
        await new Promise((r) => setTimeout(r, 800));
        const hrefs = Array.from(document.querySelectorAll('a[href*="p-11843/s"]')).map((a) => a.href);
        const count = hrefs.filter((h) => h.includes('/s' + season + '/')).length;
        results[season] = { text: t, count };
        break;
      }
    }
    return results;
  });
  console.log('per-season after click', seasonsFound);

  // Select dropdown?
  const selects = await p.evaluate(() =>
    Array.from(document.querySelectorAll('select')).map((s) => ({
      name: s.name,
      options: Array.from(s.options).map((o) => o.textContent.trim()).slice(0, 20)
    }))
  );
  console.log('selects', JSON.stringify(selects, null, 2));

  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
