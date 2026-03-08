require('dotenv').config();
const { RettwitwClient } = require('./rettiwt-client');

async function testTweetNow() {
  console.log('Testing Twitter posting with reconnection...\n');
  
  const client = new RettwitwClient();
  
  // Connect
  console.log('1. Connecting to Twitter...');
  const connected = await client.connect();
  
  if (!connected) {
    console.error('Failed to connect');
    process.exit(1);
  }
  
  // Post test tweet
  console.log('\n2. Posting test tweet...');
  const testText = `Bot reconnection test - ${new Date().toLocaleString('es-ES')} #TestBot`;
  
  try {
    const result = await client.postTweet(testText);
    console.log('\n✓ SUCCESS! Tweet posted to Twitter');
    console.log('Tweet was published at:', new Date().toLocaleString('es-ES'));
  } catch (error) {
    console.error('\n✗ FAILED:', error.message);
    process.exit(1);
  }
}

testTweetNow().then(() => {
  console.log('\nTest complete. Exiting...');
  process.exit(0);
});
