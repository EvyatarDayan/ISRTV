#!/usr/bin/env node
/**
 * Regression: returning from episodes must keep VOD tab + focused series.
 * Usage: node test-vod-restore.mjs
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      if (urlPath === '/') urlPath = '/index.html';
      const filePath = path.join(ROOT, urlPath.replace(/^\//, ''));
      if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404);
        res.end('not found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

async function main() {
  const { server, port } = await startServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  let failed = null;

  try {
    await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-action="vod"]');

    // Home → VOD
    await page.click('[data-action="vod"]');
    await page.waitForSelector('#view-vod:not([hidden])');
    await page.waitForSelector('#series-list .vod-card');

    // Switch to N12 (not the default kan tab)
    await page.click('#vod-tab-n12');
    await page.waitForFunction(() => {
      const tab = document.querySelector('#vod-tab-n12');
      return tab && tab.classList.contains('is-active');
    });
    await page.waitForSelector('#series-list .vod-card[data-series]');

    const before = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#series-list .vod-card[data-series]'));
      if (cards.length < 2) {
        throw new Error('Need at least 2 N12 series cards to test restore');
      }
      const card = cards[Math.min(3, cards.length - 1)];
      card.focus();
      card.classList.add('is-focused');
      return {
        tab: document.querySelector('.vod-tab.is-active')?.getAttribute('data-vod-tab'),
        seriesId: card.getAttribute('data-series'),
        cardCount: cards.length
      };
    });

    if (before.tab !== 'n12') {
      throw new Error(`Expected active tab n12 before open, got ${before.tab}`);
    }

    // Open series (click avoids OK long-press path)
    await page.click(`#series-list .vod-card[data-series="${before.seriesId}"]`);
    await page.waitForSelector('#view-series:not([hidden])');
    await page.waitForFunction(() => {
      return document.getElementById('view-vod')?.classList.contains('is-under-series');
    });

    // Confirm VOD underlay kept the N12 grid while episodes are open
    const whileOpen = await page.evaluate((seriesId) => ({
      tab: document.querySelector('#vod-tabs .vod-tab.is-active')?.getAttribute('data-vod-tab'),
      under: document.getElementById('view-vod')?.classList.contains('is-under-series'),
      hasSeries: !!document.querySelector('#series-list .vod-card[data-series="' + seriesId + '"]')
    }), before.seriesId);
    if (whileOpen.tab !== 'n12' || !whileOpen.under || !whileOpen.hasSeries) {
      throw new Error(
        'While episodes open, VOD underlay lost state: ' + JSON.stringify(whileOpen)
      );
    }

    // Back (Escape / Tizen Back)
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => {
      const series = document.getElementById('view-series');
      const vod = document.getElementById('view-vod');
      return series?.hidden && vod && !vod.hidden && !vod.classList.contains('is-under-series');
    });

    const after = await page.evaluate(() => {
      const activeTab = document.querySelector('#vod-tabs .vod-tab.is-active');
      const focused = document.querySelector('#series-list .vod-card.is-focused');
      return {
        tab: activeTab?.getAttribute('data-vod-tab') || null,
        seriesId: focused?.getAttribute('data-series') || null,
        underSeries: document.getElementById('view-vod')?.classList.contains('is-under-series') || false,
        seriesHidden: !!document.getElementById('view-series')?.hidden
      };
    });

    if (after.tab !== 'n12') {
      throw new Error(`Active tab after back: expected n12, got ${after.tab}`);
    }
    if (after.seriesId !== before.seriesId) {
      throw new Error(
        `Focused series after back: expected ${before.seriesId}, got ${after.seriesId}`
      );
    }
    if (after.underSeries || !after.seriesHidden) {
      throw new Error('Series overlay did not fully close');
    }

    console.log('PASS: VOD restore kept tab=n12 and series=' + before.seriesId);
  } catch (err) {
    failed = err;
    console.error('FAIL:', err && err.message ? err.message : err);
  } finally {
    await browser.close();
    server.close();
  }

  if (failed) process.exit(1);
}

main();
