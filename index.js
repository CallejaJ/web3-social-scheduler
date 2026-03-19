require('dotenv').config();
const { RettwitwClient } = require('./rettiwt-client');
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

// Initialize Twitter Client (Rettiwt - Scraper Mode)
const twitterClient = new RettwitwClient();

// Real-time Test API
app.get('/test-now', async (req, res) => {
    console.log('\n=== REAL-TIME TEST TRIGGERED VIA URL ===');
    const timestamp = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
    const testMessage = `Prueba de funcionamiento en tiempo real (${timestamp}). El bot está de vuelta. #Web3 #Testing`;
    const results = { twitter: null, bluesky: null };

    // 1. Twitter
    try {
        await twitterClient.postTweet(testMessage);
        results.twitter = 'Success';
    } catch (err) {
        results.twitter = `Error: ${err.message}`;
    }

    // 2. Bluesky
    try {
        await postToBluesky(testMessage);
        results.bluesky = 'Success';
    } catch (err) {
        results.bluesky = `Error: ${err.message}`;
    }

    res.json({
        message: 'Test completed',
        timestamp,
        results
    });
});

app.listen(port, () => console.log(`Monitor del bot activo en puerto ${port}`));

// Initialize Lens Client
const lensClient = new LensClient();

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
    const tweet = await twitterClient.postTweet(text, mediaPath);
    console.log(`[✓ Twitter] Tweet posted successfully!`);
    return tweet;
  } catch (error) {
    console.error('[✗ Twitter] Error posting tweet:', error.message);
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
      console.warn(`[Warning] Tweet #${index + 1} missing schedule or text, skipping...`);
      return;
    }

    // Validate cron format
    if (!cron.validate(item.schedule)) {
      console.error(`[Invalid schedule] for tweet #${index + 1}: "${item.schedule}"`);
      return;
    }

    // Schedule the tweet
    cron.schedule(item.schedule, async () => {
      console.log(`\n[${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}] Executing scheduled tweet #${index + 1}`);
      try {
        // Determine media path - check generated, content, and quizz folders
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
             console.warn(`Warning: Media ${item.media} not found in any folder`);
           }
        }

        // Prepare text for Twitter
        let twitterText = item.text;
        if (item.hashtags_category) {
            const addedTags = getRandomHashtags(item.hashtags_category, item.language || 'en');
            twitterText += ` ${addedTags}`;
        }

        // Prepare text for Bluesky
        let blueskyText = item.bluesky_text || item.text;
        if (item.hashtags_category) {
            const addedTags = getRandomHashtags(item.hashtags_category, item.language || 'en');
            blueskyText += ` ${addedTags}`;
        }
        
        // Prepare text for Hey/Lens
        let heyText = item.hey_text || blueskyText;

        // Determine platforms to post to
        const platforms = item.platforms || ['twitter', 'bluesky', 'hey'];

        // Post to Twitter
        if (platforms.includes('twitter')) {
          try {
             await postTweet(twitterText, mediaPath);
          } catch (tError) {
             console.error('Failed to post to Twitter:', tError.message);
          }
        }

        // Post to Bluesky
        if (platforms.includes('bluesky')) {
          try {
             console.log(`\n  [Bluesky] Posting: "${blueskyText.substring(0, 40)}..."`);
             await postToBluesky(blueskyText, mediaPath);
          } catch (bError) {
             console.error('Failed to post to Bluesky:', bError.message);
          }
        }

        // Post to Hey / Lens
        if (platforms.includes('hey') || platforms.includes('lens')) {
          try {
             console.log(`\n  [Hey/Lens] Posting: "${heyText.substring(0, 40)}..."`);
             await lensClient.post(heyText, mediaPath);
          } catch (lError) {
             console.error('Failed to post to Lens:', lError.message);
          }
        }

      } catch (error) {
        console.error(`Error in scheduled tweet #${index + 1}: ${error.message}`);
      }
    }, {
      timezone: "Europe/Madrid"
    });

    console.log(`[Tweet scheduled] #${index + 1}: ${item.schedule}`);
    console.log(`  Content: "${item.text.substring(0, 60)}..."`);
  });

  console.log('\n=== Bot running... Press Ctrl+C to stop ===\n');
}

// Test Twitter connection
async function testConnection() {
  try {
    console.log('Testing Rettiwt connection...');
    const connected = await twitterClient.connect();
    return connected;
  } catch (error) {
    console.error('[✗ Rettiwt connection error]:', error.message);
    return false;
  }
}

// Test Bluesky connection
async function testBlueskyConnection() {
  console.log('Testing Bluesky connection...');
  const success = await loginToBluesky();
  if (success) {
    console.log('[Connected to Bluesky]');
  } 
  console.log('');
  return success;
}

// Start the bot
async function startBot() {
  const twitterConnected = await testConnection();
  const blueskyConnected = await testBlueskyConnection();

  if (!twitterConnected && !blueskyConnected) {
    console.error('\nCould not connect to ANY platform. Check your configuration.');
    process.exit(1);
  }
  
  if (!twitterConnected) console.warn('[Warning] Twitter (Rettiwt) connection failed.');
  if (!blueskyConnected) console.warn('[Warning] Bluesky connection failed.');

  scheduleTwitterBot();

  console.log('[Warning] Follower welcome system disabled (requires paid API tier)');
  console.log('[Warning] Auto-reply system DISABLED (requires Basic Tier to avoid Rate Limits)');
  console.log('');
}

// Run the bot
startBot();
