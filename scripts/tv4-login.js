#!/usr/bin/env node
/**
 * One-shot TV4 Play login via real Chromium (bypasses WAF).
 * Saves scripts/.tv4-session.json for vod-cors-proxy /tv4/play.
 *
 * Usage: node scripts/tv4-login.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SESSION = path.join(__dirname, '.tv4-session.json');
const MAIN = path.join(ROOT, 'js', 'main.js');

function reveal(blob) {
  const raw = Buffer.from(String(blob || ''), 'base64');
  let out = '';
  const k = 0x5a;
  for (let i = 0; i < raw.length; i++) {
    out += String.fromCharCode(raw[i] ^ k ^ (i % 7));
  }
  return out;
}

function hide(text) {
  const s = String(text || '');
  const out = Buffer.alloc(s.length);
  const k = 0x5a;
  for (let i = 0; i < s.length; i++) {
    out[i] = s.charCodeAt(i) ^ k ^ (i % 7);
  }
  return out.toString('base64');
}

function seedFromMain() {
  const src = fs.readFileSync(MAIN, 'utf8');
  const m = src.match(/var TV4_SEED = \{[\s\S]*?u: '([^']+)',[\s\S]*?p: '([^']+)',/);
  if (!m) throw new Error('TV4_SEED not found in js/main.js');
  return { email: reveal(m[1]), password: reveal(m[2]) };
}

async function main() {
  let playwright;
  try {
    playwright = require('./node_modules/playwright');
  } catch (_) {
    playwright = require('playwright');
  }
  const { email, password } = seedFromMain();
  const browser = await playwright.chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    locale: 'sv-SE',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 }
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  const page = await context.newPage();
  let captured = null;
  page.on('response', async (res) => {
    try {
      if (!/auth\.tv4\.a2d\.tv\/v2\/auth\/login/.test(res.url())) return;
      const data = await res.json().catch(() => null);
      if (data && data.access_token) {
        captured = data;
      }
    } catch (_) {}
  });

  await page.goto('https://auth.a2d.tv/tv4/login', {
    waitUntil: 'domcontentloaded',
    timeout: 90000
  });
  await page.waitForSelector('input[type="password"]', { timeout: 20000 });
  await page.fill('input[type="email"], input[name="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  for (let i = 0; i < 40 && !captured; i++) {
    await page.waitForTimeout(250);
  }
  await browser.close();

  if (!captured || !captured.access_token) {
    throw new Error('TV4 login failed (no access_token)');
  }

  const now = Math.floor(Date.now() / 1000);
  const session = {
    updatedAt: new Date().toISOString(),
    refresh_token: captured.refresh_token || '',
    access_token: captured.access_token,
    expires_in: captured.expires_in || 3600,
    accessExpiry: now + (parseInt(captured.expires_in, 10) || 3600)
  };
  fs.writeFileSync(SESSION, JSON.stringify(session, null, 2) + '\n');
  console.log('Wrote', SESSION);

  if (session.refresh_token) {
    const src = fs.readFileSync(MAIN, 'utf8');
    const next = src.replace(
      /(var TV4_SEED = \{[\s\S]*?r: ')([^']+)(')/,
      '$1' + hide(session.refresh_token) + '$3'
    );
    if (next !== src) {
      fs.writeFileSync(MAIN, next);
      console.log('Updated TV4_SEED.r in js/main.js');
    }
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
