require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { checkNewFollowers } = require('./follower-welcome');
const { checkMentions } = require('./mention-replies');
const { loginToBluesky, postToBluesky } = require('./bluesky-client');
const { LensClient } = require('./lens-client');
const express = require('express');

// Keep-alive server for Koyeb/Render
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Status API
app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        uptime: process.uptime(),
        timestamp: Date.now()
    });
});

app.listen(port, () => console.log(`Monitor del bot activo en puerto ${port}`));

// Initialize Lens Client
const lensClient = new LensClient();

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

// Hashtag categories for variety
const HASHTAGS_POOL = {
  general: {
    en: ['#Web3', '#Blockchain', '#LearnCrypto', '#FutureOfFinance', '#Decentralization', '#TechEducation'],
    es: ['#Web3', '#Blockchain', '#CriptoEducación', '#FuturoFinanciero', '#Descentralización', '#AprendeCripto']
  },
  defi: {
    en: ['#DeFi', '#Finance', '#PassiveIncome', '#YieldFarming', '#SmartMoney', '#FinancialFreedom'],
    es: ['#DeFi', '#Finanzas', '#IngresosPasivos', '#YieldFarming', '#DineroInteligente', '#LibertadFinanciera']
  },
  security: {
    en: ['#CyberSecurity', '#SafetyFirst', '#CryptoTips', '#StaySafe', '#SelfCustody', '#WalletSecurity'],
    es: ['#Ciberseguridad', '#SeguridadCripto', '#TipsCripto', '#MantenteSeguro', '#Autocustodia', '#CriptoSeguridad']
  },
  dev: {
    en: ['#SmartContracts', '#Solidity', '#DevLife', '#Coding', '#Web3Dev', '#Builder'],
    es: ['#SmartContracts', '#Solidity', '#VidaDev', '#Programación', '#DesarrolloWeb3', '#Builder']
  },
  nft: {
    en: ['#NFTs', '#DigitalArt', '#Collectibles', '#Web3Community', '#CreatorEconomy'],
    es: ['#NFTs', '#ArteDigital', '#Coleccionables', '#ComunidadWeb3', '#EconomíaCreador']
  }
};

function getRandomHashtags(category = 'general', language = 'en', count = 2) {
  const pool = (HASHTAGS_POOL[category] || HASHTAGS_POOL['general'])[language];
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(' ');
}

// Post a tweet with optional media attachment
async function postTweet(text, mediaPath = null) {
  try {
    let tweetData = { text };

    // Upload media if provided
    if (mediaPath) {
      console.log(`  Uploading media: ${mediaPath}`);
      // Check if file exists in either location
      if (!fs.existsSync(mediaPath)) {
         throw new Error(`Media file not found: ${mediaPath}`);
      }
      
      const mediaId = await rwClient.v1.uploadMedia(mediaPath);
      tweetData.media = { media_ids: [mediaId] };
      console.log(`  ✓ Media uploaded: ${mediaId}`);
    }

    const tweet = await rwClient.v2.tweet(tweetData);
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
        // Determine media path - check both generated and content folders
        let mediaPath = null;
        if (item.media) {
           const generatedPath = path.join(__dirname, 'images', 'generated', item.media);
           const contentPath = path.join(__dirname, 'images', 'content', item.media);
           const quizzPath = path.join(__dirname, 'images', 'quizz', item.media);
           
           if (fs.existsSync(generatedPath)) {
             mediaPath = generatedPath;
           } else if (fs.existsSync(contentPath)) {
             mediaPath = contentPath;
           } else if (fs.existsSync(quizzPath)) {
             mediaPath = quizzPath;
           } else {
             console.warn(`Warning: Media ${item.media} not found in generated, content, or quizz folders`);
           }
        }

        // Add dynamic hashtags if requested in item config
        let finalText = item.text;
        if (item.hashtags_category) {
            const addedTags = getRandomHashtags(item.hashtags_category, item.language || 'en');
            finalText += ` ${addedTags}`;
        }

        // Determine platforms to post to
        // Determine platforms to post to
        const platforms = item.platforms || ['twitter', 'bluesky', 'hey']; // Default to ALL platforms if not specified

        // Post to Twitter
        if (platforms.includes('twitter')) {
          try {
             await postTweet(finalText, mediaPath);
          } catch (tError) {
             console.error('Failed to post to Twitter:', tError.message);
          }
        }

        // Post to Bluesky
        if (platforms.includes('bluesky')) {
          try {
             console.log(`\n  [Bluesky] Posting: "${finalText.substring(0, 40)}..."`);
             await postToBluesky(finalText, mediaPath);
          } catch (bError) {
             console.error('Failed to post to Bluesky:', bError.message);
          }
        }

        // Post to Hey / Lens
        if (platforms.includes('hey') || platforms.includes('lens')) {
          try {
             console.log(`\n  [Hey/Lens] Posting: "${finalText.substring(0, 40)}..."`);
             await lensClient.post(finalText, mediaPath);
             console.log('  [Hey/Lens] ✓ Post initiated');
          } catch (lError) {
             console.error('Failed to post to Lens:', lError.message);
          }
        }

      } catch (error) {
        console.error(`Error in scheduled tweet #${index + 1}: ${error.message}`);
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

// Test Bluesky connection
async function testBlueskyConnection() {
  console.log('Testing Bluesky connection...');
  const success = await loginToBluesky();
  if (success) {
    console.log('✓ Connected to Bluesky');
  } 
  console.log('');
  return success;
}

// Start the bot
async function startBot() {
  const connected = await testConnection();
  const blueskyConnected = await testBlueskyConnection();

  if (!connected && !blueskyConnected) {
    console.error('\nCould not connect to ANY platform. Check your configuration.');
    process.exit(1);
  }
  
  if (!connected) console.warn('⚠ Twitter connection failed. Bot will only run for Bluesky (if configured).');
  if (!blueskyConnected) console.warn('⚠ Bluesky connection failed. Bot will only run for Twitter.');

  scheduleTwitterBot();

  // Follower welcome disabled - requires Twitter API Basic tier ($100/month)
  // cron.schedule('0 */2 * * *', async () => {
  //   console.log(`\n[${new Date().toLocaleString()}] Checking for new followers...`);
  //   await checkNewFollowers();
  // });

  console.log('⚠ Follower welcome system disabled (requires paid API tier)');

  // Schedule mention check every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log(`\n[${new Date().toLocaleString()}] Checking for new mentions...`);
    await checkMentions();
  });

  console.log('✓ Auto-reply system enabled (checks every 30 minutes)');
  console.log('');
}

// Run the bot
startBot();
