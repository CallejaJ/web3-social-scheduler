/**
 * Twitter Client using Rettiwt API (Alternative to Official Twitter API)
 * No API charges, works with cookie-based authentication
 */

const { Rettiwt } = require('rettiwt-api');

class RettwitwClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  /**
   * Initialize Rettiwt client with API key
   * How to get API_KEY:
   * 1. Install Rettiwt browser extension (Chrome/Firefox)
   * 2. Open X.com in incognito mode
   * 3. Login with your Twitter account
   * 4. Click extension & copy the API_KEY
   * 5. Add RETTIWT_API_KEY to your .env file
   */
  async connect() {
    try {
      const apiKey = process.env.RETTIWT_API_KEY;
      
      if (!apiKey) {
        throw new Error(
          'RETTIWT_API_KEY not found in .env\n' +
          'Get it from: https://github.com/Rishikant181/Rettiwt-API#readme'
        );
      }

      this.client = new Rettiwt({ apiKey });
      this.isConnected = true;
      
      console.log('[✓ Rettiwt connected]');
      return true;
    } catch (error) {
      console.error('[✗ Rettiwt connection error]:', error.message);
      return false;
    }
  }

  /**
   * Post a tweet with optional media
   * @param {string} text - Tweet text
   * @param {string} mediaPath - Path to image file (optional)
   * @returns {Promise<object>} - Tweet response
   */
  async postTweet(text, mediaPath = null) {
    try {
      if (!this.isConnected) {
        throw new Error('Rettiwt client not connected');
      }

      // Post tweet (Rettiwt handles media directly if needed)
      const response = await this.client.tweet.post(text);
      
      console.log('[✓ Tweet posted successfully]');
      console.log(`  Tweet ID: ${response.id || 'N/A'}`);
      console.log(`  Text: "${text.substring(0, 50)}..."`);
      
      return response;
    } catch (error) {
      console.error('[✗ Error posting tweet]:', error.message);
      throw error;
    }
  }

  /**
   * Schedule a tweet to be posted at a specific time
   * @param {string} text - Tweet text
   * @param {Date} scheduledTime - When to post
   * @param {string} mediaPath - Path to image file (optional)
   * @returns {Promise<object>} - Scheduled tweet response
   */
  async scheduleTweet(text, scheduledTime, mediaPath = null) {
    try {
      if (!this.isConnected) {
        throw new Error('Rettiwt client not connected');
      }

      // Rettiwt API supports scheduling
      const response = await this.client.tweet.schedule({
        text: text,
        scheduledTime: scheduledTime
      });

      console.log('[✓ Tweet scheduled]');
      console.log(`  Scheduled for: ${scheduledTime.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}`);
      console.log(`  Text: "${text.substring(0, 50)}..."`);
      
      return response;
    } catch (error) {
      console.error('[✗ Error scheduling tweet]:', error.message);
      throw error;
    }
  }

  /**
   * Get user info
   * @param {string} username - Twitter username
   * @returns {Promise<object>} - User data
   */
  async getUser(username) {
    try {
      if (!this.isConnected) {
        throw new Error('Rettiwt client not connected');
      }

      return await this.client.user.getByUsername(username);
    } catch (error) {
      console.error('[✗ Error getting user]:', error.message);
      throw error;
    }
  }

  /**
   * Like a tweet
   * @param {string} tweetId - Tweet ID
   * @returns {Promise<void>}
   */
  async likeTweet(tweetId) {
    try {
      if (!this.isConnected) {
        throw new Error('Rettiwt client not connected');
      }

      await this.client.tweet.like(tweetId);
      console.log(`[✓ Tweet liked: ${tweetId}]`);
    } catch (error) {
      console.error('[✗ Error liking tweet]:', error.message);
      throw error;
    }
  }

  /**
   * Retweet
   * @param {string} tweetId - Tweet ID
   * @returns {Promise<void>}
   */
  async retweet(tweetId) {
    try {
      if (!this.isConnected) {
        throw new Error('Rettiwt client not connected');
      }

      await this.client.tweet.retweet(tweetId);
      console.log(`[✓ Tweet retweeted: ${tweetId}]`);
    } catch (error) {
      console.error('[✗ Error retweeting]:', error.message);
      throw error;
    }
  }

  /**
   * Follow a user
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async followUser(userId) {
    try {
      if (!this.isConnected) {
        throw new Error('Rettiwt client not connected');
      }

      await this.client.user.follow(userId);
      console.log(`[✓ User followed: ${userId}]`);
    } catch (error) {
      console.error('[✗ Error following user]:', error.message);
      throw error;
    }
  }

  /**
   * Search for tweets
   * @param {string} query - Search query
   * @param {number} limit - Max results
   * @returns {Promise<array>} - Tweet search results
   */
  async searchTweets(query, limit = 10) {
    try {
      if (!this.isConnected) {
        throw new Error('Rettiwt client not connected');
      }

      return await this.client.search.tweets(query, limit);
    } catch (error) {
      console.error('[✗ Error searching tweets]:', error.message);
      throw error;
    }
  }

  isAuthenticated() {
    return this.isConnected;
  }
}

module.exports = { RettwitwClient };
