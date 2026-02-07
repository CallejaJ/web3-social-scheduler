require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
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

// File to track replied mentions
const MENTIONS_FILE = path.join(__dirname, 'mentions-data.json');

// FAQ Database - Common questions and auto-replies
const FAQ_DATABASE = {
  // Course-related questions
  courses: {
    keywords: ['course', 'courses', 'learn', 'tutorial', 'class', 'lesson', 'programa', 'curso', 'cursos', 'aprender'],
    replies: {
      en: "We offer 4 free courses: Web3 Basics, Crypto 101, Understanding CBDCs, and Security Guide. Explore them all here: https://memento-academy.com/en/courses",
      es: "Ofrecemos 4 cursos gratuitos: Web3 Básico, Crypto 101, CBDCs y Guía de Seguridad. Explóralos aquí: https://memento-academy.com/es/courses"
    }
  },

  // Free/pricing questions
  free: {
    keywords: ['free', 'price', 'cost', 'pay', 'subscription', 'gratis', 'precio', 'costo', 'pagar'],
    replies: {
      en: "All our courses are 100% FREE. No credit card, no subscription, no tricks. Just quality Web3 education for everyone.",
      es: "Todos nuestros cursos son 100% GRATUITOS. Sin tarjeta de crédito, sin suscripción, sin trucos. Solo educación Web3 de calidad para todos."
    }
  },

  // Getting started questions
  start: {
    keywords: ['start', 'begin', 'beginner', 'new', 'newbie', 'empezar', 'comenzar', 'principiante', 'nuevo'],
    replies: {
      en: "Perfect for beginners! Start with our Web3 Basics course (45 min): https://memento-academy.com/en/learn/web3-basics - No prior knowledge needed.",
      es: "¡Perfecto para principiantes! Comienza con nuestro curso de Web3 Básico (45 min): https://memento-academy.com/es/learn/web3-basics - No se requiere conocimiento previo."
    }
  },

  // CBDC questions
  cbdc: {
    keywords: ['cbdc', 'central bank', 'digital currency', 'government money', 'banco central', 'moneda digital'],
    replies: {
      en: "Learn about Central Bank Digital Currencies (CBDCs) and how they'll impact your money. Free 40-min course: https://memento-academy.com/en/learn/cbdc",
      es: "Aprende sobre las Monedas Digitales de Bancos Centrales (CBDC) y cómo afectarán tu dinero. Curso gratuito de 40 min: https://memento-academy.com/es/learn/cbdc"
    }
  },

  // Security questions
  security: {
    keywords: ['safe', 'security', 'scam', 'hack', 'protect', 'wallet', 'seguro', 'seguridad', 'estafa', 'proteger', 'billetera'],
    replies: {
      en: "Protect yourself from crypto scams! Our Security Guide covers best practices, common scams, and how to stay safe: https://memento-academy.com/en/learn/safety",
      es: "¡Protégete de estafas crypto! Nuestra Guía de Seguridad cubre mejores prácticas, estafas comunes y cómo mantenerte seguro: https://memento-academy.com/es/learn/safety"
    }
  },

  // Community questions
  community: {
    keywords: ['github', 'discord', 'community', 'help', 'support', 'question', 'comunidad', 'ayuda', 'soporte', 'pregunta'],
    replies: {
      en: "Join our GitHub community! Ask questions, propose ideas, and learn together: https://github.com/orgs/Memento-Academy/discussions",
      es: "¡Únete a nuestra comunidad en GitHub! Haz preguntas, propón ideas y aprende en comunidad: https://github.com/orgs/Memento-Academy/discussions"
    }
  },

  // Crypto basics questions
  crypto: {
    keywords: ['bitcoin', 'ethereum', 'crypto', 'cryptocurrency', 'blockchain', 'criptomoneda'],
    replies: {
      en: "New to crypto? Our Crypto 101 course covers Bitcoin, Ethereum, altcoins, and everything you need to know. Free 60-min course: https://memento-academy.com/en/learn/crypto-101",
      es: "¿Nuevo en crypto? Nuestro curso Crypto 101 cubre Bitcoin, Ethereum, altcoins y todo lo que necesitas saber. Curso gratuito de 60 min: https://memento-academy.com/es/learn/crypto-101"
    }
  },

  // General greetings/thanks
  greeting: {
    keywords: ['hello', 'hi', 'hey', 'thanks', 'thank you', 'hola', 'gracias'],
    replies: {
      en: "Hello! Thanks for reaching out. Check out our free Web3 courses or join our GitHub community. How can we help you today?",
      es: "¡Hola! Gracias por contactarnos. Mira nuestros cursos gratuitos de Web3 o únete a nuestra comunidad en GitHub. ¿Cómo podemos ayudarte hoy?"
    }
  }
};

// Generic fallback reply
const FALLBACK_REPLY = {
  en: "Thanks for your message! For specific questions, join our GitHub: https://github.com/orgs/Memento-Academy/discussions or explore our free courses: https://memento-academy.com/en/courses",
  es: "¡Gracias por tu mensaje! Para preguntas específicas, únete a nuestro GitHub: https://github.com/orgs/Memento-Academy/discussions o explora nuestros cursos gratuitos: https://memento-academy.com/es/courses"
};

// Spam detection keywords and patterns
const SPAM_INDICATORS = {
  // Pump & dump / scam keywords
  scamKeywords: [
    'pump', 'dump', 'moon', 'lambo', '🚀', '🔥', '💎',
    'claim', 'airdrop', 'free tokens', 'free coins', 'tokens',
    'reward', 'rewards', 'giveaway', 'win',
    'pool', 'staking pool', 'liquidity pool',
    'presale', 'ico', 'ido',
    '100x', '1000x', 'guaranteed',
    'click here', 'link in bio', 'dm me',
    'urgent', 'limited time', 'act now',
    'wallet', 'connect wallet', 'verify wallet'
  ],

  // Suspicious token/coin mentions with $ prefix
  tokenPattern: /\$[A-Z]{2,10}\b/g, // Matches $BTC, $ETH, $USDT, etc.

  // Multiple URLs (spam often has many links)
  urlPattern: /https?:\/\/[^\s]+/gi,

  // Excessive emojis (more than 3 in a short tweet)
  emojiPattern: /[\u{1F300}-\u{1F9FF}]/gu
};

// Check if a tweet is spam
function isSpam(text) {
  const textLower = text.toLowerCase();

  // 1. Check for spam keywords
  const spamKeywordCount = SPAM_INDICATORS.scamKeywords.filter(keyword =>
    textLower.includes(keyword.toLowerCase())
  ).length;

  if (spamKeywordCount >= 2) {
    console.log(`  🚫 SPAM: Contains ${spamKeywordCount} spam keywords`);
    return true;
  }

  // 2. Check for multiple token mentions (e.g., $ENA, $USDT)
  const tokenMatches = text.match(SPAM_INDICATORS.tokenPattern);
  if (tokenMatches && tokenMatches.length >= 2) {
    console.log(`  🚫 SPAM: Contains ${tokenMatches.length} token symbols`);
    return true;
  }

  // 2b. Single token + spam keyword = spam (e.g., "claim $TOKEN")
  if (tokenMatches && tokenMatches.length >= 1 && spamKeywordCount >= 1) {
    console.log(`  🚫 SPAM: Token symbol + spam keyword`);
    return true;
  }

  // 3. Check for multiple URLs (spam tweets often have many links)
  const urlMatches = text.match(SPAM_INDICATORS.urlPattern);
  if (urlMatches && urlMatches.length >= 2) {
    console.log(`  🚫 SPAM: Contains ${urlMatches.length} URLs`);
    return true;
  }

  // 4. Check for excessive emojis (more than 5)
  const emojiMatches = text.match(SPAM_INDICATORS.emojiPattern);
  if (emojiMatches && emojiMatches.length >= 5) {
    console.log(`  🚫 SPAM: Contains ${emojiMatches.length} emojis`);
    return true;
  }

  // 5. Check if tweet is very short and contains URL (likely automated)
  if (text.length < 50 && urlMatches && urlMatches.length >= 1) {
    const textWithoutUrls = text.replace(SPAM_INDICATORS.urlPattern, '').trim();
    if (textWithoutUrls.length < 20) {
      console.log(`  🚫 SPAM: Too short with URL (${textWithoutUrls.length} chars)`);
      return true;
    }
  }

  return false;
}

// Load mentions data
function loadMentionsData() {
  try {
    if (fs.existsSync(MENTIONS_FILE)) {
      const data = fs.readFileSync(MENTIONS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading mentions data:', error.message);
  }
  return { repliedTweets: [], lastCheckId: null };
}

// Save mentions data
function saveMentionsData(data) {
  try {
    fs.writeFileSync(MENTIONS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving mentions data:', error.message);
  }
}

// Detect language from tweet text
function detectLanguage(text) {
  const spanishIndicators = ['qué', 'cómo', 'cuál', 'dónde', 'cuándo', 'por qué', 'gracias', 'hola', 'curso', 'gratis'];
  const textLower = text.toLowerCase();

  for (const indicator of spanishIndicators) {
    if (textLower.includes(indicator)) {
      return 'es';
    }
  }

  return 'en';
}

// Find matching FAQ based on keywords
function findMatchingFAQ(text) {
  const textLower = text.toLowerCase();

  for (const [category, faq] of Object.entries(FAQ_DATABASE)) {
    for (const keyword of faq.keywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        return faq;
      }
    }
  }

  return null;
}

// Upload media to Twitter
async function uploadMedia(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`! Media file not found: ${filePath}`);
      return null;
    }
    const mediaId = await client.v1.uploadMedia(filePath);
    console.log(`✓ Media uploaded: ${mediaId}`);
    return mediaId;
  } catch (error) {
    console.error('✗ Error uploading media:', error.message);
    return null;
  }
}

// Reply to a mention
async function replyToMention(mention, replyText, mediaPath = null) {
  try {
    let params = { text: replyText, reply: { in_reply_to_tweet_id: mention.id } };

    // Attach media if provided
    if (mediaPath) {
      const mediaId = await uploadMedia(mediaPath);
      if (mediaId) {
        params.media = { media_ids: [mediaId] };
      }
    }

    await rwClient.v2.reply(params.text, mention.id, { media: params.media });
    console.log(`✓ Replied to @${mention.author_id}: "${replyText.substring(0, 60)}..." (Media: ${!!params.media})`);
    return true;
  } catch (error) {
    console.error(`✗ Error replying to mention ${mention.id}:`, error.message);
    return false;
  }
}

// Check and respond to mentions
async function checkMentions() {
  try {
    console.log('\n[Mention Check] Checking for new mentions...');

    // Get current user ID
    const me = await rwClient.v2.me();
    const myUserId = me.data.id;

    // Load previous mentions data
    const data = loadMentionsData();

    // Get recent mentions
    const mentions = await rwClient.v2.userMentionTimeline(myUserId, {
      max_results: 10,
      'tweet.fields': ['created_at', 'conversation_id'],
      since_id: data.lastCheckId || undefined
    });

    let newMentionsCount = 0;
    let repliedCount = 0;
    let spamCount = 0;

    for await (const mention of mentions) {
      newMentionsCount++;

      // Skip if already replied
      if (data.repliedTweets.includes(mention.id)) {
        continue;
      }

      console.log(`\nNew mention from @${mention.author_id}: "${mention.text.substring(0, 80)}..."`);

      // Check for spam - block and skip if detected
      if (isSpam(mention.text)) {
        console.log(`  🚫 SPAM detected from @${mention.author_id}. Blocking user...`);
        try {
            await rwClient.v2.block(myUserId, mention.author_id);
            console.log(`  ✓ Blocked @${mention.author_id}`);
        } catch (blockError) {
            console.error(`  ✗ Failed to block @${mention.author_id}:`, blockError.message);
        }

        data.repliedTweets.push(mention.id); // Mark as processed to avoid checking again
        spamCount++;
        continue;
      }

      // Detect language
      const language = detectLanguage(mention.text);
      console.log(`Detected language: ${language}`);

      // Find matching FAQ
      const matchedFAQ = findMatchingFAQ(mention.text);

      let replyText;
      if (matchedFAQ) {
        replyText = matchedFAQ.replies[language];
        console.log(`Matched FAQ category`);
      } else {
        replyText = FALLBACK_REPLY[language];
        console.log(`Using fallback reply`);
      }

      // Image path (default to generic card)
      const imagePath = path.join(__dirname, 'images', 'reply-card.png');

      // Send reply
      const replied = await replyToMention(mention, replyText, imagePath);

      if (replied) {
        data.repliedTweets.push(mention.id);
        repliedCount++;

        // Wait a bit between replies to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    console.log(`\nMention check summary:`);
    console.log(`  New mentions found: ${newMentionsCount}`);
    console.log(`  Spam filtered: ${spamCount}`);
    console.log(`  Replied to: ${repliedCount}`);

    // Update last check ID if we found any mentions
    if (mentions.data && mentions.data.data && mentions.data.data.length > 0) {
      data.lastCheckId = mentions.data.data[0].id;
    }

    // Save updated data
    saveMentionsData(data);

    console.log('✓ Mention check completed\n');
  } catch (error) {
    console.error('✗ Error checking mentions:', error.message);
    if (error.data) {
      console.error('  Details:', JSON.stringify(error.data, null, 2));
    }
  }
}

module.exports = {
  checkMentions,
  FAQ_DATABASE,
  isSpam
};

// Run if called directly
if (require.main === module) {
  console.log('=== Mention Reply System ===\n');
  checkMentions().then(() => {
    console.log('Done. Run this periodically to check for new mentions.');
  });
}
