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
    await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);

    // Check if redirected to login
    if (page.url().includes('/login') || page.url().includes('/i/flow')) {
      throw new Error('Redirected to login — cookies may have expired. Update RETTIWT_API_KEY secret.');
    }

    console.log('Looking for tweet compose box...');
    const tweetBox = page.locator('[data-testid="tweetTextarea_0"]').first();
    await tweetBox.waitFor({ timeout: 30000 });
    await tweetBox.click();
    await page.waitForTimeout(500);

    console.log('Typing tweet...');
    await tweetBox.fill(text);
    await page.waitForTimeout(1000);

    console.log('Submitting tweet...');
    // Use keyboard shortcut to bypass overlay intercepting clicks
    await tweetBox.press('Control+Enter');
    await page.waitForTimeout(3000);

    console.log('[✓] Tweet posted successfully!');
  } catch (err) {
    console.error(`[✗] Error during tweet process: ${err.message}`);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
    console.log('Error screenshot saved to error-screenshot.png');
    throw err;
  } finally {
    await browser.close();
  }
}

function getISOWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

async function main() {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'scheduled-tweets.json'), 'utf8'));
  const slots = data.slots;

  const now = new Date();
  const madrid = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
  const hour = madrid.getHours();
  const day = madrid.getDay();

  console.log(`Current Madrid time: day=${day} hour=${hour}:${String(madrid.getMinutes()).padStart(2,'0')}`);

  const slot = slots.find(s => {
    if (!s.platforms || !s.platforms.includes('twitter')) return false;
    const parts = s.schedule.split(' ');
    return parseInt(parts[1]) === hour && parseInt(parts[4]) === day;
  });

  if (!slot) {
    console.log('No tweet scheduled for this time. Exiting.');
    return;
  }

  const weekNum = getISOWeekNumber(madrid);
  const tweetIndex = weekNum % slot.tweets.length;
  const text = slot.tweets[tweetIndex];

  console.log(`Week ${weekNum} → tweet variant ${tweetIndex + 1}/${slot.tweets.length}`);
  console.log(`Posting: "${text.substring(0, 60)}..."`);
  await postTweet(text);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
