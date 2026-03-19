require('dotenv').config();
const { RettwitwClient } = require('./rettiwt-client');
const { loginToBluesky, postToBluesky } = require('./bluesky-client');

async function testNow() {
  console.log('=== REAL-TIME TEST START ===');
  const timestamp = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
  const testMessage = `Prueba de funcionamiento en tiempo real (${timestamp}). El bot está de vuelta. #Web3 #Testing`;

  // 1. Twitter Test
  console.log('\n--- Twitter Test ---');
  const twitterClient = new RettwitwClient();
  const twitterConnected = await twitterClient.connect();
  if (twitterConnected) {
    try {
      await twitterClient.postTweet(testMessage);
      console.log('[✓ Twitter Post Success]');
    } catch (err) {
      console.error('[✗ Twitter Post Failed]:', err.message);
    }
  } else {
    console.error('[✗ Twitter Connection Failed]');
  }

  // 2. Bluesky Test
  console.log('\n--- Bluesky Test ---');
  try {
    const blueskyLoggedIn = await loginToBluesky();
    if (blueskyLoggedIn) {
      await postToBluesky(testMessage);
      console.log('[✓ Bluesky Post Success]');
    } else {
      console.error('[✗ Bluesky Login Failed]');
    }
  } catch (err) {
    console.error('[✗ Bluesky Post Failed]:', err.message);
  }

  console.log('\n=== TEST COMPLETE ===');
}

testNow();
