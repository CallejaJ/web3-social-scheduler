const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

async function testConnection() {
  console.log('Testing Twitter API connection...');
  
  if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET || 
      !process.env.TWITTER_ACCESS_TOKEN || !process.env.TWITTER_ACCESS_SECRET) {
      console.error('Missing one or more Twitter API environment variables.');
      return;
  }

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

  const rwClient = client.readWrite;

  try {
    const user = await rwClient.v2.me();
    console.log(`✓ Connected as: @${user.data.username} (${user.data.name})`);
    console.log('API Credenitals are VALID.');
  } catch (error) {
    console.error('✗ Twitter API connection error:', error.message);
    if (error.data) {
        console.error('Error details:', JSON.stringify(error.data, null, 2));
    }
  }
}

testConnection();
