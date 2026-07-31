#!/usr/bin/env node
/**
 * Fix titles + download episode/series images for scraped kanbox JSON files.
 * Uses Playwright so Cloudflare doesn't block.
 *
 * Usage: node fix-kanbox-images.js [slug...]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const TITLE_MAP = {
  huliganim: 'חוליגנים',
  bahastora: 'בהסתורה',
  yafa: 'יאפא',
  hahamam: 'החמאם',
  'motek-bol': 'מותק בול באמצע',
  hamazah: 'המזח',
  'migras-harusim': 'מגרש הרוסים',
  hamifkadet: 'המפקדת',
  haemet: 'האמת',
  'haish-sheratza': 'האיש שרצה לדעת הכול',
  hazvi: 'הצבי',
  menayek: 'מנאייכ'
};

function extFromUrl(url) {
  const m = String(url).match(/\.(jpe?g|png|webp)/i);
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
}

async function main() {
  const playwright = require('playwright');
  const filter = process.argv.slice(2);

  const files = fs
    .readdirSync(__dirname)
    .filter((f) => f.startsWith('kanbox-') && f.endsWith('.json'))
    .filter((f) => {
      const slug = f.replace(/^kanbox-/, '').replace(/\.json$/, '');
      if (!TITLE_MAP[slug] && !filter.length) return false;
      if (filter.length) return filter.includes(slug);
      return true;
    });

  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: 'he-IL',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });

  for (const file of files) {
    const slug = file.replace(/^kanbox-/, '').replace(/\.json$/, '');
    if (!TITLE_MAP[slug]) continue;
    const full = path.join(__dirname, file);
    const data = JSON.parse(fs.readFileSync(full, 'utf8'));
    data.title = TITLE_MAP[slug];
    data.slug = slug;

    const dir = path.join(ROOT, 'images', 'kanbox', slug);
    fs.mkdirSync(dir, { recursive: true });

    console.log(`\n=== ${slug} / ${data.title} (${data.episodes.length} eps) ===`);

    // Prefer series og:image from seriesUrl
    if (data.seriesUrl) {
      const page = await context.newPage();
      try {
        await page.goto(data.seriesUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(2000);
        const poster = await page.evaluate(() => {
          const og = document.querySelector('meta[property="og:image"]');
          return (og && og.getAttribute('content')) || '';
        });
        if (poster) {
          data.poster = poster;
          const dest = path.join(dir, 'series.jpg');
          const res = await context.request.get(poster, {
            headers: { Referer: 'https://www.kan.org.il/' }
          });
          if (res.ok()) {
            fs.writeFileSync(dest, await res.body());
            data.localPoster = `images/kanbox/${slug}/series.jpg`;
            console.log('  series poster OK');
          }
        }
      } catch (e) {
        console.warn('  series poster fail', e.message);
      } finally {
        await page.close();
      }
    }

    const multi = new Set(data.episodes.map((e) => e.season || 1)).size > 1;

    for (const ep of data.episodes) {
      const season = ep.season || 1;
      const fname = multi ? `s${season}-ep${ep.ep}.jpg` : `ep${ep.ep}.jpg`;
      const dest = path.join(dir, fname);
      let imgUrl = ep.imageURL || '';

      if (!imgUrl && ep.page) {
        const page = await context.newPage();
        try {
          await page.goto(ep.page, { waitUntil: 'domcontentloaded', timeout: 60000 });
          await page.waitForTimeout(1500);
          imgUrl = await page.evaluate(() => {
            const og = document.querySelector('meta[property="og:image"]');
            if (og) return og.getAttribute('content') || '';
            const img = document.querySelector('.player img, .vod-player img, picture img, img');
            return img ? img.src || '' : '';
          });
          ep.imageURL = imgUrl;
        } catch (e) {
          console.warn(`  s${season} ep${ep.ep} og fail`, e.message);
        } finally {
          await page.close();
        }
      }

      if (!imgUrl) {
        console.log(`  s${season} ep${ep.ep} NO IMAGE`);
        continue;
      }

      try {
        const res = await context.request.get(imgUrl, {
          headers: { Referer: 'https://www.kan.org.il/' }
        });
        if (res.ok()) {
          fs.writeFileSync(dest, await res.body());
          ep.localImage = `images/kanbox/${slug}/${fname}`;
          console.log(`  s${season} ep${ep.ep} OK`);
        } else {
          console.log(`  s${season} ep${ep.ep} HTTP ${res.status()}`);
        }
      } catch (e) {
        console.log(`  s${season} ep${ep.ep} fail`, e.message);
      }
    }

    if (!data.localPoster && data.episodes[0] && data.episodes[0].localImage) {
      fs.copyFileSync(path.join(ROOT, data.episodes[0].localImage), path.join(dir, 'series.jpg'));
      data.localPoster = `images/kanbox/${slug}/series.jpg`;
    }

    fs.writeFileSync(full, JSON.stringify(data, null, 2));
    console.log(`  wrote ${file}`);
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
