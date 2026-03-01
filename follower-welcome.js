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

// File to track followers
const FOLLOWERS_FILE = path.join(__dirname, 'followers-data.json');

// Welcome messages (bilingual)
const WELCOME_MESSAGES = {
  en: [
    "Welcome to Memento Academy! We're excited to have you here. Start your Web3 journey with our free courses: https://memento-academy.com/en/courses",
    "Thanks for following! New to Web3? No problem. We break down complex topics into simple lessons. Check out our free courses: https://memento-academy.com/en/courses",
    "Hey there! Welcome to the Memento Academy community. Explore our free Web3 courses and join 50K+ learners: https://memento-academy.com/en/courses"
  ],
  es: [
    "¡Bienvenido a Memento Academy! Nos emociona tenerte aquí. Comienza tu viaje Web3 con nuestros cursos gratuitos: https://memento-academy.com/es/courses",
    "¡Gracias por seguirnos! ¿Nuevo en Web3? No hay problema. Desglosamos temas complejos en lecciones simples. Mira nuestros cursos gratuitos: https://memento-academy.com/es/courses",
    "¡Hola! Bienvenido a la comunidad de Memento Academy. Explora nuestros cursos gratuitos de Web3 y únete a más de 50K estudiantes: https://memento-academy.com/es/courses"
  ]
};

// Load followers data
function loadFollowersData() {
  try {
    if (fs.existsSync(FOLLOWERS_FILE)) {
      const data = fs.readFileSync(FOLLOWERS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading followers data:', error.message);
  }
  return { followers: [], lastCheck: null, welcomedUsers: [] };
}

// Save followers data
function saveFollowersData(data) {
  try {
    fs.writeFileSync(FOLLOWERS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving followers data:', error.message);
  }
}

// Get random welcome message
function getRandomWelcomeMessage(language = 'en') {
  const messages = WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en;
  return messages[Math.floor(Math.random() * messages.length)];
}

// Detect user language from profile
function detectLanguage(user) {
  // Check user's language setting or description
  if (user.lang && user.lang.startsWith('es')) {
    return 'es';
  }
  // You can add more sophisticated language detection here
  return 'en';
}

// Send welcome DM to new follower
async function sendWelcomeDM(userId, username) {
  try {
    // Detect language (you can enhance this logic)
    const language = Math.random() > 0.5 ? 'en' : 'es'; // For now, random selection
    const message = getRandomWelcomeMessage(language);

    // Note: Sending DMs requires specific permissions and the user must follow you
    // For now, we'll just log it. To actually send DMs, you need elevated API access
    console.log(`Would send DM to @${username}: ${message}`);

    // If you have DM permissions, uncomment this:
    // await rwClient.v2.sendDmToParticipant(userId, { text: message });

    return true;
  } catch (error) {
    console.error(`Error sending welcome DM to @${username}:`, error.message);
    return false;
  }
}

// Send welcome tweet (alternative to DM)
async function sendWelcomeTweet(username) {
  try {
    const language = Math.random() > 0.5 ? 'en' : 'es';
    let welcomeText;

    if (language === 'es') {
      welcomeText = `¡Bienvenido a la comunidad @${username}! Explora nuestros cursos gratuitos de Web3: https://memento-academy.com/es/courses #Web3 #Bienvenida`;
    } else {
      welcomeText = `Welcome to the community @${username}! Explore our free Web3 courses: https://memento-academy.com/en/courses #Web3 #Welcome`;
    }

    await rwClient.v2.tweet(welcomeText);
    console.log(`[Welcome tweet sent] to @${username}`);
    return true;
  } catch (error) {
    console.error(`[Error sending welcome tweet] to @${username}:`, error.message);
    return false;
  }
}

// Check for new followers
async function checkNewFollowers() {
  try {
    console.log('\n[Follower Check] Checking for new followers...');

    // Get current user ID
    const me = await rwClient.v2.me();
    const myUserId = me.data.id;

    // Get current followers
    const followers = await rwClient.v2.followers(myUserId, {
      max_results: 100,
      'user.fields': ['username', 'created_at', 'lang']
    });

    // Load previous followers data
    const data = loadFollowersData();
    const previousFollowers = new Set(data.followers);
    const currentFollowers = [];
    const newFollowers = [];

    // Check for new followers
    for await (const follower of followers) {
      currentFollowers.push(follower.id);

      if (!previousFollowers.has(follower.id) && !data.welcomedUsers.includes(follower.id)) {
        newFollowers.push(follower);
      }
    }

    console.log(`Current followers: ${currentFollowers.length}`);
    console.log(`New followers found: ${newFollowers.length}`);

    // Welcome new followers
    if (newFollowers.length > 0) {
      for (const follower of newFollowers) {
        console.log(`\nNew follower: @${follower.username}`);

        // Send welcome tweet (publicly)
        await sendWelcomeTweet(follower.username);

        // Or send DM (requires permissions)
        // await sendWelcomeDM(follower.id, follower.username);

        // Mark as welcomed
        data.welcomedUsers.push(follower.id);

        // Wait a bit between welcomes to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    // Update followers data
    data.followers = currentFollowers;
    data.lastCheck = new Date().toISOString();
    saveFollowersData(data);

    console.log('[Follower check completed]\n');
  } catch (error) {
    console.error('[Error checking followers]:', error.message);
    if (error.data) {
      console.error('  Details:', JSON.stringify(error.data, null, 2));
    }
  }
}

module.exports = {
  checkNewFollowers,
  sendWelcomeTweet,
  sendWelcomeDM
};

// Run if called directly
if (require.main === module) {
  console.log('=== Follower Welcome System ===\n');
  checkNewFollowers().then(() => {
    console.log('Done. Run this script periodically to check for new followers.');
  });
}
