require('dotenv').config();
const { BskyAgent } = require('@atproto/api');
const fs = require('fs');
const path = require('path');

// Initialize Bluesky Agent
const agent = new BskyAgent({
  service: 'https://bsky.social'
});

async function loginToBluesky() {
  try {
    if (!process.env.BLUESKY_IDENTIFIER || !process.env.BLUESKY_PASSWORD) {
      throw new Error('Missing BLUESKY_IDENTIFIER or BLUESKY_PASSWORD in .env');
    }

    await agent.login({
      identifier: process.env.BLUESKY_IDENTIFIER,
      password: process.env.BLUESKY_PASSWORD
    });
    
    return true;
  } catch (error) {
    console.error('✗ Bluesky Login Failed:', error.message);
    return false;
  }
}

async function postToBluesky(text, mediaPath = null) {
  try {
    // Ensure we are logged in (or re-login if needed - simplistic check)
    if (!agent.session) {
      const loggedIn = await loginToBluesky();
      if (!loggedIn) throw new Error('Could not log in to Bluesky');
    }

    let postRecord = {
      text: text,
      createdAt: new Date().toISOString()
    };

    // Handle Media
    if (mediaPath) {
      console.log(`  [Bluesky] Uploading media: ${mediaPath}`);
      
      if (!fs.existsSync(mediaPath)) {
        throw new Error(`Media file not found: ${mediaPath}`);
      }

      const fileData = fs.readFileSync(mediaPath);
      
      // Basic mime type detection based on extension
      const ext = path.extname(mediaPath).toLowerCase();
      let mimeType = 'image/jpeg';
      if (ext === '.png') mimeType = 'image/png';
      if (ext === '.webp') mimeType = 'image/webp';

      // 1. Upload the image blob
      const { data } = await agent.uploadBlob(fileData, { encoding: mimeType });
      
      // 2. Attach blob to the post record
      postRecord.embed = {
        $type: 'app.bsky.embed.images',
        images: [
          {
            alt: text.substring(0, 300), // Alt text is required, using tweet text truncated
            image: data.blob
          }
        ]
      };
      
      console.log('  [Bluesky] ✓ Media uploaded');
    }

    // Attempt to create rich text facets (links, mentions)
    // For now, we'll keep it simple and just post the text. 
    // The BskyAgent might handle some of this or we can add the RichText helper later if needed for proper link highlighting.
    // NOTE: URLs in text usually need facets to be clickable in some clients, but basic text is a good start.

    const response = await agent.post(postRecord);
    
    console.log(`✓ Bluesky post successful! CID: ${response.cid}`);
    return response;
  } catch (error) {
    console.error('✗ Error posting to Bluesky:', error.message);
    throw error;
  }
}

module.exports = {
  loginToBluesky,
  postToBluesky,
  agent
};
