#!/usr/bin/env node
// Called by GitHub Actions to post the scheduled tweet for the current Madrid time
// Uses Playwright (real browser) to bypass Twitter's IP blocking of datacenter IPs

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

function parseCookies(apiKey) {
  const cookies = {};
  apiKey.split(';').forEach(part => {
    const trimmed = part.trim();
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex > 0) {
      const name = trimmed.substring(0, eqIndex).trim();
      const value = trimmed.substring(eqIndex + 1).trim();
      if (name) cookies[name] = value;
    }
  });
  return cookies;
}

async function postTweet(text) {
  const apiKey = process.env.RETTIWT_API_KEY;
  if (!apiKey) throw new Error('RETTIWT_API_KEY not set');

  const cookies = parseCookies(apiKey);
  if (!cookies.auth_token) throw new Error('auth_token not found in RETTIWT_API_KEY');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    locale: 'es-ES'
  });

  const cookieList = [
    { name: 'auth_token', value: cookies.auth_token, domain: '.twitter.com', path: '/' },
    { name: 'auth_token', value: cookies.auth_token, domain: '.x.com', path: '/' },
  ];
  if (cookies.ct0) {
    cookieList.push({ name: 'ct0', value: cookies.ct0, domain: '.twitter.com', path: '/' });
    cookieList.push({ name: 'ct0', value: cookies.ct0, domain: '.x.com', path: '/' });
  }
  if (cookies.twid) {
    cookieList.push({ name: 'twid', value: cookies.twid, domain: '.twitter.com', path: '/' });
    cookieList.push({ name: 'twid', value: cookies.twid, domain: '.x.com', path: '/' });
  }

  await context.addCookies(cookieList);

  const page = await context.newPage();

  try {
    console.log('Opening Twitter...');
    await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    console.log('Looking for tweet compose box...');
    const tweetBox = page.locator('[data-testid="tweetTextarea_0"]').first();
    await tweetBox.waitFor({ timeout: 15000 });
    await tweetBox.click();
    await page.waitForTimeout(500);

    console.log('Typing tweet...');
    await tweetBox.fill(text);
    await page.waitForTimeout(1000);

    console.log('Submitting tweet...');
    const submitBtn = page.locator('[data-testid="tweetButtonInline"]').first();
    await submitBtn.click();
    await page.waitForTimeout(3000);

    console.log('[✓] Tweet posted successfully!');
  } finally {
    await browser.close();
  }
}

async function main() {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'scheduled-tweets.json'), 'utf8'));
  const tweets = data.tweets;

  const now = new Date();
  const madrid = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
  const hour = madrid.getHours();
  const day = madrid.getDay();

  console.log(`Current Madrid time: day=${day} hour=${hour}:${String(madrid.getMinutes()).padStart(2,'0')}`);

  const match = tweets.find(t => {
    if (!t.platforms || !t.platforms.includes('twitter')) return false;
    const parts = t.schedule.split(' ');
    return parseInt(parts[1]) === hour && parseInt(parts[4]) === day;
  });

  if (!match) {
    console.log('No tweet scheduled for this time. Exiting.');
    return;
  }

  console.log(`Posting: "${match.text.substring(0, 60)}..."`);
  await postTweet(match.text);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
