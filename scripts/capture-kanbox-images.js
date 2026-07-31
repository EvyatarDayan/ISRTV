#!/usr/bin/env node
/**
 * Download Kan series/episode images by capturing browser network responses
 * (Cloudflare blocks direct HTTP fetches).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

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

const SERIES = [
  { slug: 'malach-mashchit', url: 'https://www.kan.org.il/content/kan/kan-11/p-11247/', id: '11247', seasons: [1] },
  { slug: 'east-side', url: 'https://www.kan.org.il/content/kan/kan-11/p-11332/', id: '11332', seasons: [1] },
  { slug: 'aviram-katz', url: 'https://www.kan.org.il/content/kan/kan-11/p-11568/', id: '11568', seasons: [1] },
  { slug: 'shaat-efes', url: 'https://www.kan.org.il/content/kan/kan-11/p-12657/', id: '12657', seasons: [1] },
  { slug: 'pamta', url: 'https://www.kan.org.il/content/kan/kan-11/p-13038/', id: '13038', seasons: [1, 2] },
  { slug: 'matir-agunot', url: 'https://www.kan.org.il/content/kan/kan-11/p-13688/', id: '13688', seasons: [1] },
  { slug: 'tik-needar', url: 'https://www.kan.org.il/content/kan/kan-11/p-13815/', id: '13815', seasons: [1] },
  { slug: 'hed-kolech', url: 'https://www.kan.org.il/content/kan/kan-11/p-12967/', id: '12967', seasons: [1] },
  { slug: 'hadavar-hagadol', url: 'https://www.kan.org.il/content/kan/kan-11/p-13684/', id: '13684', seasons: [1] },
  { slug: 'mona', url: 'https://www.kan.org.il/content/kan/kan-11/p-13827/', id: '13827', seasons: [1] },
  { slug: 'echad-al-echad', url: 'https://www.kan.org.il/content/kan/kan-11/p-13237/', id: '13237', seasons: [1] },
  { slug: 'haish-shemenaa', url: 'https://www.kan.org.il/content/kan/kan-11/p-13879/', id: '13879', seasons: [1] },
  { slug: 'halayla-haaroch', url: 'https://www.kan.org.il/content/kan/kan-11/p-13157/', id: '13157', seasons: [1] },
  { slug: 'hatasritai', url: 'https://www.kan.org.il/content/kan/kan-11/p-13835/', id: '13835', seasons: [1] },
  { slug: 'alumim', url: 'https://www.kan.org.il/content/kan/kan-11/p-12845/', id: '12845', seasons: [1] },
  { slug: 'tapuchim-midbar', url: 'https://www.kan.org.il/content/kan/kan-11/p-13875/', id: '13875', seasons: [1] }
];

function normalizeUrl(u) {
  try {
    const p = new URL(u);
    p.hash = '';
    return p.toString();
  } catch (e) {
    return u;
  }
}

async function clickShowMore(page) {
  for (let i = 0; i < 15; i++) {
    const more = await page.$(
      '#vod-page-items-show-more button, button:has-text("טען עוד"), button:has-text("עוד")'
    );
    if (!more) break;
    try {
      await more.click({ timeout: 1500 });
      await page.waitForTimeout(700);
    } catch (e) {
      break;
    }
  }
}

async function main() {
  const playwright = require('playwright');
  const filter = process.argv.slice(2);
  const list = filter.length ? SERIES.filter((s) => filter.includes(s.slug)) : SERIES;

  const browser = await playwright.chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    locale: 'he-IL',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1400, height: 900 }
  });

  for (const series of list) {
    const jsonPath = path.join(__dirname, `kanbox-${series.slug}.json`);
    if (!fs.existsSync(jsonPath)) {
      console.log('skip missing json', series.slug);
      continue;
    }
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    data.title = TITLE_MAP[series.slug] || data.title;
    data.slug = series.slug;

    const dir = path.join(ROOT, 'images', 'kanbox', series.slug);
    fs.mkdirSync(dir, { recursive: true });

    console.log(`\n=== ${series.slug} ===`);
    const page = await context.newPage();
    const captured = new Map();

    page.on('response', async (res) => {
      try {
        const u = res.url();
        const ct = res.headers()['content-type'] || '';
        if (!/image\/(jpeg|jpg|png|webp)/i.test(ct)) return;
        if (!/kan\.org\.il\/media\//i.test(u)) return;
        if (res.status() !== 200) return;
        const buf = await res.body();
        if (buf.length > 4000) captured.set(normalizeUrl(u), buf);
      } catch (e) {}
    });

    await page.goto(series.url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(2500);

    const cards = [];
    for (const season of series.seasons) {
      await page.evaluate((season) => {
        const els = Array.from(document.querySelectorAll('button, a, [role="tab"], li, span, div'));
        for (const el of els) {
          const t = (el.textContent || '').trim();
          if (t === `עונה ${season}`) {
            el.click();
            return;
          }
        }
      }, season);
      await page.waitForTimeout(1200);
      await clickShowMore(page);
      await page.evaluate(async () => {
        for (let i = 0; i < 10; i++) {
          window.scrollBy(0, 700);
          await new Promise((r) => setTimeout(r, 350));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1500);

      const seasonCards = await page.evaluate(
        ({ id, season }) => {
          return Array.from(document.querySelectorAll(`a[href*="/p-${id}/"]`))
            .map((a) => {
              const decoded = decodeURIComponent(a.href);
              const m =
                decoded.match(new RegExp(`/p-${id}/s${season}/(\\d+)/`)) ||
                decoded.match(new RegExp(`/p-${id}/עונה-${season}/(\\d+)/`));
              if (!m) return null;
              const img = a.querySelector('img.img-full, .card-img img, img');
              const title = (a.querySelector('.card-title') || {}).textContent || a.textContent || '';
              const em = title.match(/פרק\s*(\d+)/);
              let ep = em ? Number(em[1]) : null;
              if (!ep) {
                // order fallback later via page id mapping
                return null;
              }
              if (/טריילר|ריקאפ|קדימון|אחרי המזח|הרב מתגרש|עקרות/.test(title)) return null;
              return {
                season,
                ep,
                src: img ? img.currentSrc || img.src || '' : ''
              };
            })
            .filter(Boolean);
        },
        { id: series.id, season }
      );
      cards.push(...seasonCards);
    }

    // Also build map by page href for episodes without "פרק N" in card title
    const cardsByHref = await page.evaluate((id) => {
      const map = {};
      Array.from(document.querySelectorAll(`a[href*="/p-${id}/"]`)).forEach((a) => {
        const decoded = decodeURIComponent(a.href.split('?')[0]);
        const m =
          decoded.match(new RegExp(`/p-${id}/s(\\d+)/(\\d+)/?`)) ||
          decoded.match(new RegExp(`/p-${id}/עונה-(\\d+)/(\\d+)/?`));
        if (!m) return;
        const img = a.querySelector('img.img-full, .card-img img, img');
        map[decoded] = img ? img.currentSrc || img.src || '' : '';
        map[a.href.split('?')[0]] = map[decoded];
      });
      return map;
    }, series.id);

    // Wait a bit more for late responses
    await page.waitForTimeout(2000);
    console.log(`  cards=${cards.length} captured=${captured.size}`);

    // Series poster: largest image mentioning series or first hero-ish
    let posterBuf = null;
    let posterUrl = '';
    for (const [u, buf] of captured) {
      if (/1920|1200|share-image|no-logo/i.test(u) && buf.length > (posterBuf ? posterBuf.length : 0)) {
        posterBuf = buf;
        posterUrl = u;
      }
    }
    if (!posterBuf) {
      // pick largest
      for (const [u, buf] of captured) {
        if (buf.length > (posterBuf ? posterBuf.length : 0) && !/taboola/i.test(u)) {
          posterBuf = buf;
          posterUrl = u;
        }
      }
    }
    if (posterBuf) {
      fs.writeFileSync(path.join(dir, 'series.jpg'), posterBuf);
      data.localPoster = `images/kanbox/${series.slug}/series.jpg`;
      data.poster = posterUrl;
      console.log('  series poster OK', posterBuf.length);
    }

    const multi = series.seasons.length > 1 || new Set(data.episodes.map((e) => e.season || 1)).size > 1;
    const byKey = new Map();
    cards.forEach((c) => {
      const key = `${c.season}-${c.ep}`;
      if (!byKey.has(key)) byKey.set(key, c);
    });

    for (const ep of data.episodes) {
      const season = ep.season || 1;
      const key = `${season}-${ep.ep}`;
      const card = byKey.get(key);
      const fname = multi ? `s${season}-ep${ep.ep}.jpg` : `ep${ep.ep}.jpg`;
      const dest = path.join(dir, fname);

      let buf = null;
      let src = '';
      if (card && card.src) {
        src = normalizeUrl(card.src);
        buf = captured.get(src);
        if (!buf) {
          for (const [u, b] of captured) {
            if (u.split('?')[0] === src.split('?')[0]) {
              buf = b;
              src = u;
              break;
            }
          }
        }
      }
      if (!buf && ep.page) {
        const pageKey = decodeURIComponent(ep.page.split('?')[0]);
        const hrefSrc = cardsByHref[pageKey] || cardsByHref[ep.page.split('?')[0]] || '';
        if (hrefSrc) {
          src = normalizeUrl(hrefSrc);
          buf = captured.get(src);
          if (!buf) {
            for (const [u, b] of captured) {
              if (u.split('?')[0] === src.split('?')[0]) {
                buf = b;
                src = u;
                break;
              }
            }
          }
        }
      }

      if (buf) {
        fs.writeFileSync(dest, buf);
        ep.imageURL = src;
        ep.localImage = `images/kanbox/${series.slug}/${fname}`;
        console.log(`  s${season} ep${ep.ep} OK`);
      } else {
        console.log(`  s${season} ep${ep.ep} MISS`);
      }
    }

    if (!data.localPoster) {
      const first = data.episodes.find((e) => e.localImage);
      if (first) {
        fs.copyFileSync(path.join(ROOT, first.localImage), path.join(dir, 'series.jpg'));
        data.localPoster = `images/kanbox/${series.slug}/series.jpg`;
      }
    }

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    await page.close();
  }

  await browser.close();
  console.log('\nDone images');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
