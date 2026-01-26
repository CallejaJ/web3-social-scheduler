require('dotenv').config();
const { loginToBluesky, postToBluesky } = require('./bluesky-client');
const path = require('path');

async function testBluesky() {
  console.log('=== Bluesky Debug Tool ===');
  console.log('1. Testing Authentication...');
  
  const success = await loginToBluesky();
  if (!success) {
    console.error('✗ Authentication failed. Check your .env file.');
    return;
  }
  console.log('✓ Authentication successful!\n');

  console.log('2. Testing Text Post...');
  try {
    await postToBluesky('Hello Bluesky! This is a test from my automated bot. 🤖 #Web3 #BotTest');
    console.log('✓ Text post successful!\n');
  } catch (e) {
    console.error('✗ Text post failed:', e.message);
  }

  /*
  console.log('3. Testing Image Post...');
  try {
    // Replace with a valid image path from your images folder
    const imagePath = path.join(__dirname, 'images', 'web3-basics-en.png'); 
    await postToBluesky('Testing image upload! 📸', imagePath);
    console.log('✓ Image post successful!\n');
  } catch (e) {
    console.error('✗ Image post failed:', e.message);
  }
  */

  console.log('To test posting, open this file and uncomment the posting sections.');
}

testBluesky();
