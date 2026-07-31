#!/usr/bin/env node
/**
 * Re-download broken קופה ראשית episode images (HTML/WebP placeholders → real JPEG).
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const SLUG = 'kupa-rashit';
const JSON_PATH = path.join(__dirname, `kanbox-${SLUG}.json`);
const IMG_DIR = path.join(ROOT, 'images', 'kanbox', SLUG);

function isValidJpeg(buf) {
  return Buffer.isBuffer(buf) && buf.length > 2000 && buf[0] === 0xff && buf[1] === 0xd8;
}

function fileNeedsFix(dest) {
  if (!fs.existsSync(dest)) return true;
  const buf = fs.readFileSync(dest);
  return !isValidJpeg(buf);
}

async function main() {
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  fs.mkdirSync(IMG_DIR, { recursive: true });

  const need = data.episodes.filter((ep) => {
    const dest = path.join(IMG_DIR, `s${ep.season}-ep${ep.ep}.jpg`);
    return fileNeedsFix(dest);
  });
  console.log(`Need images: ${need.length}/${data.episodes.length}`);

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

  // Warm up Cloudflare on kan.org.il once
  {
    const warm = await context.newPage();
    await warm.goto('https://www.kan.org.il/content/kan/kan-11/p-12832/', {
      waitUntil: 'domcontentloaded',
      timeout: 120000
    });
    await warm.waitForTimeout(4000);
    await warm.close();
  }

  let ok = 0;
  let fail = 0;

  for (const ep of need) {
    const dest = path.join(IMG_DIR, `s${ep.season}-ep${ep.ep}.jpg`);
    const page = await context.newPage();
    let buf = null;

    page.on('response', async (res) => {
      try {
        const ct = (res.headers()['content-type'] || '').toLowerCase();
        if (!ct.includes('image')) return;
        const body = await res.body();
        if (!body || body.length < 2000) return;
        // Prefer JPEG; accept WebP only if we have nothing yet
        if (body[0] === 0xff && body[1] === 0xd8) {
          buf = body;
        } else if (!buf && body.slice(0, 4).toString() === 'RIFF') {
          buf = body;
        }
      } catch (e) {}
    });

    try {
      // 1) Try direct image URL
      if (ep.imageURL) {
        const r = await page.goto(ep.imageURL, { waitUntil: 'load', timeout: 45000 }).catch(() => null);
        if (r) {
          try {
            const b = await r.body();
            if (isValidJpeg(b)) buf = b;
          } catch (e) {}
        }
        await page.waitForTimeout(400);
      }

      // 2) Episode page → og:image
      if (!isValidJpeg(buf)) {
        await page.goto(ep.page, { waitUntil: 'domcontentloaded', timeout: 90000 });
        await page.waitForTimeout(1800);
        const og = await page.evaluate(
          () => (document.querySelector('meta[property="og:image"]') || {}).content || ''
        );
        if (og) {
          ep.imageURL = og;
          const r = await page.goto(og, { waitUntil: 'load', timeout: 45000 }).catch(() => null);
          if (r) {
            try {
              const b = await r.body();
              if (isValidJpeg(b) || (b && b.length > 5000)) buf = b;
            } catch (e) {}
          }
        }
      }

      if (isValidJpeg(buf)) {
        fs.writeFileSync(dest, buf);
        ep.localImage = `images/kanbox/${SLUG}/s${ep.season}-ep${ep.ep}.jpg`;
        ok++;
        console.log(`OK  s${ep.season}e${ep.ep} ${buf.length}`);
      } else if (buf && buf.slice(0, 4).toString() === 'RIFF' && buf.length > 5000) {
        // Last resort: keep WebP but convert via browser canvas → JPEG
        const dataUrl = await page.evaluate(async (bytes) => {
          const u8 = new Uint8Array(bytes);
          const blob = new Blob([u8], { type: 'image/webp' });
          const url = URL.createObjectURL(blob);
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
          });
          const c = document.createElement('canvas');
          c.width = img.naturalWidth;
          c.height = img.naturalHeight;
          c.getContext('2d').drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          return c.toDataURL('image/jpeg', 0.92);
        }, [...buf]);
        const m = /^data:image\/jpeg;base64,(.+)$/.exec(dataUrl || '');
        if (m) {
          const jpeg = Buffer.from(m[1], 'base64');
          if (isValidJpeg(jpeg)) {
            fs.writeFileSync(dest, jpeg);
            ep.localImage = `images/kanbox/${SLUG}/s${ep.season}-ep${ep.ep}.jpg`;
            ok++;
            console.log(`OK  s${ep.season}e${ep.ep} webp→jpeg ${jpeg.length}`);
          } else {
            fail++;
            console.log(`FAIL s${ep.season}e${ep.ep} convert`);
          }
        } else {
          fail++;
          console.log(`FAIL s${ep.season}e${ep.ep} webp`);
        }
      } else {
        fail++;
        console.log(`FAIL s${ep.season}e${ep.ep}`);
      }
    } catch (err) {
      fail++;
      console.warn(`ERR  s${ep.season}e${ep.ep}`, err.message);
    } finally {
      await page.close();
    }

    if ((ok + fail) % 10 === 0) {
      fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
    }
  }

  // Convert existing WebP files that weren't in the "need" loop if any remain
  for (const ep of data.episodes) {
    const dest = path.join(IMG_DIR, `s${ep.season}-ep${ep.ep}.jpg`);
    if (!fileNeedsFix(dest)) {
      ep.localImage = `images/kanbox/${SLUG}/s${ep.season}-ep${ep.ep}.jpg`;
    }
  }

  // Fix series poster if not JPEG
  const seriesDest = path.join(IMG_DIR, 'series.jpg');
  if (fileNeedsFix(seriesDest) || (fs.existsSync(seriesDest) && !isValidJpeg(fs.readFileSync(seriesDest)))) {
    const page = await context.newPage();
    try {
      await page.goto('https://www.kan.org.il/content/kan/kan-11/p-12832/', {
        waitUntil: 'domcontentloaded',
        timeout: 90000
      });
      await page.waitForTimeout(2000);
      const og = await page.evaluate(
        () => (document.querySelector('meta[property="og:image"]') || {}).content || ''
      );
      if (og) {
        const r = await page.goto(og, { waitUntil: 'load', timeout: 45000 }).catch(() => null);
        if (r) {
          let b = await r.body().catch(() => null);
          if (b && b.slice(0, 4).toString() === 'RIFF') {
            const dataUrl = await page.evaluate(async (bytes) => {
              const u8 = new Uint8Array(bytes);
              const blob = new Blob([u8], { type: 'image/webp' });
              const url = URL.createObjectURL(blob);
              const img = new Image();
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = url;
              });
              const c = document.createElement('canvas');
              c.width = img.naturalWidth;
              c.height = img.naturalHeight;
              c.getContext('2d').drawImage(img, 0, 0);
              URL.revokeObjectURL(url);
              return c.toDataURL('image/jpeg', 0.92);
            }, [...b]);
            const m = /^data:image\/jpeg;base64,(.+)$/.exec(dataUrl || '');
            if (m) b = Buffer.from(m[1], 'base64');
          }
          if (isValidJpeg(b)) {
            fs.writeFileSync(seriesDest, b);
            data.localPoster = `images/kanbox/${SLUG}/series.jpg`;
            console.log('OK  series.jpg', b.length);
          }
        }
      }
    } catch (e) {
      console.warn('series poster', e.message);
    }
    await page.close();
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
  await browser.close();

  let jpeg = 0;
  let other = 0;
  for (const ep of data.episodes) {
    const dest = path.join(IMG_DIR, `s${ep.season}-ep${ep.ep}.jpg`);
    if (fs.existsSync(dest) && isValidJpeg(fs.readFileSync(dest))) jpeg++;
    else other++;
  }
  console.log(`\nDone. fetched ok=${ok} fail=${fail}`);
  console.log(`Valid JPEGs: ${jpeg}/${data.episodes.length} (bad remaining: ${other})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
