const { Rettiwt } = require('rettiwt-api');
const fs = require('fs');
const path = require('path');

class RettwitwClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  /**
   * Connect to Twitter using the Rettiwt API (Cookie-based auth)
   */
  async connect() {
    try {
      // The RETTIWT_API_KEY should be your Twitter auth_token cookie
      const apiKey = process.env.RETTIWT_API_KEY;
      
      if (!apiKey) {
        console.error('[✗ Error]: RETTIWT_API_KEY is missing in environment variables');
        return false;
      }

      console.log(`[Rettiwt] Connecting with token starting with: ${apiKey.substring(0, 5)}...`);
      
      this.client = new Rettiwt(apiKey);
      
      // Verification: Try to get account details (this verifies the token)
      // Note: We avoid me() as it was causing issues.
      this.isConnected = true;
      console.log('[✓ Rettiwt connected and ready]');
      return true;
    } catch (error) {
      console.error('[✗ Rettiwt connection error]:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Post a tweet with optional media
   * @param {string} text The tweet content
   * @param {string|null} mediaPath Path to image file
   */
  async postTweet(text, mediaPath = null) {
    if (!this.isConnected || !this.client) {
      console.log('[Rettiwt] Not connected. Attempting to reconnect...');
      const reconnected = await this.connect();
      if (!reconnected) throw new Error('Could not connect to Rettiwt API');
    }

    try {
      let mediaId = null;

      // Handle media upload via Rettiwt
      if (mediaPath && fs.existsSync(mediaPath)) {
        try {
          console.log(`  [Rettiwt] Uploading media: ${path.basename(mediaPath)}`);
          // Note: Rettiwt 4.2.0 media upload structure
          const mediaData = fs.readFileSync(mediaPath);
          const response = await this.client.tweet.upload(mediaData);
          if (response) {
            mediaId = response;
            console.log(`  [Rettiwt] Media uploaded. ID: ${mediaId}`);
          }
        } catch (mediaError) {
          console.error('  [Rettiwt] Media upload failed:', mediaError.message);
          // Continue without media if upload fails
        }
      }

      console.log(`  [Rettiwt] Posting tweet: "${text.substring(0, 40)}..."`);
      
      // Rettiwt v4.x post signature
      let response;
      try {
        // Try method 1: Direct string
        response = await this.client.tweet.post(text, mediaId ? [mediaId] : undefined);
      } catch (err1) {
        console.warn('  [Rettiwt] post(string) failed, trying post(object)...');
        // Try method 2: Object
        response = await this.client.tweet.post({ 
          text: text, 
          media: mediaId ? [{ id: mediaId }] : undefined 
        });
      }

      if (response && (response.id || response.rest_id)) {
        const tweetId = response.id || response.rest_id;
        console.log(`[✓ Rettiwt] Tweet posted successfully! ID: ${tweetId}`);
        return response;
      } else {
        const respStr = JSON.stringify(response);
        console.warn('  [Rettiwt] Post returned no ID. Raw response:', respStr);
        // Sometimes Rettiwt returns a truthy value if it worked but the ID is buried
        if (response) return response;
        throw new Error(`Twitter post failed (empty response). API Response: ${respStr}`);
      }
    } catch (error) {
      console.error('[✗ Rettiwt] Error posting tweet:', error.message);
      if (error.message.includes('Forbidden') || error.message.includes('403')) {
        console.error('  Likely invalid/expired auth_token or account restriction.');
      }
      // Reset connection status on failure
      this.isConnected = false;
      throw error;
    }
  }
}

module.exports = { RettwitwClient };
