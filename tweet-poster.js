#!/usr/bin/env node
// Called by GitHub Actions to post the scheduled tweet for the current Madrid time

const { RettwitwClient } = require('./rettiwt-client');
const fs = require('fs');
const path = require('path');

async function main() {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'scheduled-tweets.json'), 'utf8'));
  const tweets = data.tweets;

  // Current time in Madrid timezone
  const now = new Date();
  const madrid = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
  const hour = madrid.getHours();
  const day = madrid.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  console.log(`Current Madrid time: day=${day} hour=${hour}:${madrid.getMinutes()}`);

  // Match tweet by cron schedule (format: "0 HOUR * * DAY")
  const match = tweets.find(t => {
    if (!t.platforms || !t.platforms.includes('twitter')) return false;
    const parts = t.schedule.split(' ');
    return parseInt(parts[1]) === hour && parseInt(parts[4]) === day;
  });

  if (!match) {
    console.log('No tweet scheduled for this time. Exiting.');
    return;
  }

  console.log(`Posting tweet: "${match.text.substring(0, 60)}..."`);

  const client = new RettwitwClient();
  const connected = await client.connect();
  if (!connected) throw new Error('Could not connect to Twitter');

  await client.postTweet(match.text);
  console.log('Tweet posted successfully!');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
