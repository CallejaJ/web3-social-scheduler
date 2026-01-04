require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// Configure Twitter client
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const rwClient = client.readWrite;

// Load scheduled tweets from JSON file
function loadScheduledTweets() {
  try {
    const filePath = path.join(__dirname, 'scheduled-tweets.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading scheduled tweets:', error.message);
    return { tweets: [] };
  }
}

// Post a tweet
async function postTweet(text) {
  try {
    const tweet = await rwClient.v2.tweet(text);
    console.log(`✓ Tweet posted successfully: "${text.substring(0, 50)}..."`);
    console.log(`  Tweet ID: ${tweet.data.id}`);
    return tweet;
  } catch (error) {
    console.error('✗ Error posting tweet:', error.message);
    if (error.data) {
      console.error('  Details:', JSON.stringify(error.data, null, 2));
    }
    throw error;
  }
}

// Schedule tweets based on configuration file
function scheduleTwitterBot() {
  const config = loadScheduledTweets();

  console.log('=== Twitter Bot Started ===');
  console.log(`Scheduled tweets loaded: ${config.tweets.length}`);
  console.log('');

  // Create scheduled jobs for each tweet
  config.tweets.forEach((item, index) => {
    if (!item.schedule || !item.text) {
      console.warn(`⚠ Tweet #${index + 1} missing schedule or text, skipping...`);
      return;
    }

    // Validate cron format
    if (!cron.validate(item.schedule)) {
      console.error(`✗ Invalid schedule for tweet #${index + 1}: "${item.schedule}"`);
      return;
    }

    // Schedule the tweet
    cron.schedule(item.schedule, async () => {
      console.log(`\n[${new Date().toLocaleString()}] Executing scheduled tweet #${index + 1}`);
      try {
        await postTweet(item.text);
      } catch (error) {
        console.error(`Error in scheduled tweet #${index + 1}`);
      }
    });

    console.log(`✓ Tweet #${index + 1} scheduled: ${item.schedule}`);
    console.log(`  Content: "${item.text.substring(0, 60)}..."`);
  });

  console.log('\n=== Bot running... Press Ctrl+C to stop ===\n');
}

// Test API connection
async function testConnection() {
  try {
    console.log('Testing Twitter API connection...');
    const user = await rwClient.v2.me();
    console.log(`✓ Connected as: @${user.data.username} (${user.data.name})`);
    console.log('');
    return true;
  } catch (error) {
    console.error('✗ Twitter API connection error:', error.message);
    if (error.code === 401) {
      console.error('  Credentials are invalid. Check your .env file');
    }
    return false;
  }
}

// Start the bot
async function startBot() {
  const connected = await testConnection();

  if (!connected) {
    console.error('\nCould not connect to Twitter. Check your configuration.');
    process.exit(1);
  }

  scheduleTwitterBot();
}

// Run the bot
startBot();
