require('dotenv').config();
const { RettwitwClient } = require('./rettiwt-client');
const { loginToBluesky, agent } = require('./bluesky-client');

async function debug() {
  console.log('=== Twitter Diagnostic ===');
  const twitter = new RettwitwClient();
  const connected = await twitter.connect();
  if (connected) {
    try {
      // Get the authenticated user's details
      // Rettiwt-API usually allows getting the current user if authenticated
      const me = await twitter.client.user.me();
      console.log('Twitter Authenticated as:', me.userName, `(ID: ${me.id})`);
      
      console.log('Attempting a REAL test tweet...');
      const testText = 'Diagnostic Test ' + new Date().toISOString();
      const response = await twitter.client.tweet.post({ text: testText });
      console.log('Twitter Response:', JSON.stringify(response, null, 2));
    } catch (err) {
      console.error('Twitter Diagnostic Error:', err.message);
      if (err.data) console.error('Details:', JSON.stringify(err.data, null, 2));
    }
  } else {
    console.error('Twitter could not connect.');
  }

  console.log('\n=== Bluesky Diagnostic ===');
  try {
    console.log('Attempting Bluesky login...');
    console.log('Identifier:', process.env.BLUESKY_IDENTIFIER);
    const loggedIn = await loginToBluesky();
    if (loggedIn) {
      console.log('Bluesky Authenticated as:', agent.session.handle);
      console.log('Attempting a REAL test post...');
      const testText = 'Diagnostic Test ' + new Date().toISOString();
      const response = await agent.post({
        text: testText,
        createdAt: new Date().toISOString()
      });
      console.log('Bluesky Response:', JSON.stringify(response, null, 2));
    } else {
      console.error('Bluesky login failed.');
    }
  } catch (err) {
    console.error('Bluesky Diagnostic Error:', err.message);
  }
}

debug();
