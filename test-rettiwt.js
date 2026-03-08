require('dotenv').config();
const { RettwitwClient } = require('./rettiwt-client');

async function testRettiwt() {
  console.log('Testing Rettiwt API...\n');
  
  const client = new RettwitwClient();
  
  // Test connection
  console.log('1. Testing connection...');
  const connected = await client.connect();
  
  if (!connected) {
    console.error('✗ Connection failed!');
    console.error('\nPossible solutions:');
    console.error('1. Your RETTIWT_API_KEY may have expired');
    console.error('2. Generate a new API key from: https://github.com/Rishikant181/Rettiwt-API');
    console.error('3. Update it in your .env file');
    return;
  }
  
  // Test tweet posting with simple text (no emojis to avoid validation issues)
  console.log('\n2. Attempting to post a simple test tweet...');
  const testText = `Test tweet from bot - System working correctly at ${new Date().toLocaleString()}`;
  
  try {
    const result = await client.postTweet(testText);
    console.log('✓ Tweet posted successfully!');
    console.log('Tweet response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('✗ Failed to post tweet:', error.message);
    if (error.details) {
      console.error('Validation error details:', error.details);
    }
  }
}

testRettiwt();
