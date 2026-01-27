require('dotenv').config();
const { ethers } = require('ethers');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Lens API Endpoint (Hey.xyz Custom API)
const LENS_API_URL = 'https://api.lens.xyz/graphql';

// Queries are minimal since we rely on Access Token and custom Post mutation
const CHALLENGE_QUERY = `
  query Challenge($address: EvmAddress!) {
    challenge(request: { address: $address }) {
      text
    }
  }
`;

const AUTHENTICATE_MUTATION = `
  mutation Authenticate($address: EvmAddress!, $signature: Signature!) {
    authenticate(request: { address: $address, signature: $signature }) {
      accessToken
      refreshToken
    }
  }
`;

// Hey.xyz Custom Mutation
const POST_MUTATION = `
  mutation Post($request: CreatePostRequest!) {
    post(request: $request) {
      ... on PostResponse {
        hash
      }
      ... on PostOperationValidationFailed {
        reason
      }
    }
  }
`;

const REFRESH_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      ... on AuthenticationTokens {
        accessToken
        refreshToken
      }
      ... on ForbiddenError {
        reason
      }
    }
  }
`;

class LensClient {
  constructor() {
    this.token = null;
    this.wallet = null;
    
    // Check credentials
    if (process.env.LENS_PRIVATE_KEY) {
      let key = process.env.LENS_PRIVATE_KEY;
      if (!key.startsWith('0x')) key = '0x' + key;
      try {
        this.wallet = new ethers.Wallet(key);
      } catch (e) {
        console.error('✗ Invalid Private Key format');
      }
    }
    
    // Direct Access Token
    if (process.env.LENS_ACCESS_TOKEN) {
        this.token = process.env.LENS_ACCESS_TOKEN;
    }
  }

  async login() {
    // 1. Try Refresh Token first (Best practice for long running bots)
    if (process.env.LENS_REFRESH_TOKEN) {
        console.log('  [Lens] Attempting to refresh token...');
        const refreshed = await this.refreshToken();
        if (refreshed) {
            console.log('  [Lens] Token refreshed successfully');
            return true;
        }
        console.log('  [Lens] Refresh failed, falling back to Access Token/Private Key');
    }

    // 2. Check for Access Token
    if (process.env.LENS_ACCESS_TOKEN) {
        console.log('  [Lens] Using provided Access Token');
        this.token = process.env.LENS_ACCESS_TOKEN;
        return true;
    }

    if (!this.wallet) {
      console.error('✗ No valid LENS_PRIVATE_KEY found');
      return false;
    }
    
    // 3. Fallback to Private Key login (if API allowed it, which it doesn't currently, but kept for legacy)
    try {
      console.log(`  [Lens] Authenticating address: ${this.wallet.address}`);
      
      const challengeResponse = await this.query(CHALLENGE_QUERY, {
        address: this.wallet.address
      });
      
      if (!challengeResponse || !challengeResponse.challenge) {
         console.error('  [Lens] Challenge failed');
         return false;
      }
      
      const text = challengeResponse.challenge.text;
      const signature = await this.wallet.signMessage(text);
      
      const authResponse = await this.query(AUTHENTICATE_MUTATION, {
        address: this.wallet.address,
        signature
      });
      
      this.token = authResponse.authenticate.accessToken;
      return true;
    } catch (error) {
      console.error('✗ Lens Login Error:', error.message);
      return false;
    }
  }

  async refreshToken() {
    try {
        const refreshToken = process.env.LENS_REFRESH_TOKEN;
        if (!refreshToken) return false;

        const response = await axios.post(
            LENS_API_URL,
            { 
              query: REFRESH_MUTATION, 
              variables: { request: { refreshToken } } 
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'MementoBot/1.0',
                'x-access-token': this.token || process.env.LENS_ACCESS_TOKEN // Use existing if available
              }
            }
        );

        if (response.data.errors) {
            console.error('Refresh Errors:', JSON.stringify(response.data.errors));
            return false;
        }

        const data = response.data.data;
        if (data.refresh && data.refresh.accessToken) {
            this.token = data.refresh.accessToken;
            // Optionally update process.env for this session
            process.env.LENS_ACCESS_TOKEN = this.token;
            if (data.refresh.refreshToken) {
                process.env.LENS_REFRESH_TOKEN = data.refresh.refreshToken;
            }
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error refreshing token:', error.message);
        return false;
    }
  }

  async query(query, variables = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'MementoBot/1.0',
      'Origin': 'https://hey.xyz',
      'Referer': 'https://hey.xyz/',
      'x-access-token': this.token || process.env.LENS_ACCESS_TOKEN
    };

    const response = await axios.post(
      LENS_API_URL,
      { query, variables },
      { headers }
    );

    if (response.data.errors) {
      console.error('  [Lens] GraphQL Error:', JSON.stringify(response.data.errors));
      throw new Error(response.data.errors[0].message);
    }

    if (!response.data.data) {
       console.error('  [Lens] Unexpected API Response:', JSON.stringify(response.data, null, 2));
       throw new Error("Empty data response");
    }

    return response.data.data;
  }

  async uploadToPinata(filePath) {
    try {
      if (!process.env.PINATA_JWT && (!process.env.PINATA_API_KEY || !process.env.PINATA_API_SECRET)) {
         throw new Error('Missing Pinata credentials');
      }

      const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
      let data = new FormData();
      data.append('file', fs.createReadStream(filePath));
      data.append('pinataMetadata', JSON.stringify({
        name: path.basename(filePath)
      }));
      data.append('pinataOptions', JSON.stringify({
        cidVersion: 1
      }));

      const headers = { ...data.getHeaders() };
      if (process.env.PINATA_JWT) {
        headers['Authorization'] = `Bearer ${process.env.PINATA_JWT}`;
      } else {
        headers['pinata_api_key'] = process.env.PINATA_API_KEY;
        headers['pinata_secret_api_key'] = process.env.PINATA_API_SECRET;
      }

      const res = await axios.post(url, data, {
        maxBodyLength: 'Infinity',
        headers: headers
      });

      console.log(`  [Pinata] ✓ File pinned: ${res.data.IpfsHash}`);
      return `ipfs://${res.data.IpfsHash}`;

    } catch (error) {
      console.error('✗ Pinata Upload Error:', error.message);
      throw error;
    }
  }

  async uploadMetadata(metadata) {
    try {
      const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
      const headers = { 'Content-Type': 'application/json' };
      if (process.env.PINATA_JWT) headers['Authorization'] = `Bearer ${process.env.PINATA_JWT}`;
      else {
        headers['pinata_api_key'] = process.env.PINATA_API_KEY;
        headers['pinata_secret_api_key'] = process.env.PINATA_API_SECRET;
      }

      const res = await axios.post(url, metadata, { headers });
      console.log(`  [Pinata] ✓ Metadata pinned: ${res.data.IpfsHash}`);
      return `ipfs://${res.data.IpfsHash}`;

    } catch (error) {
       throw error;
    }
  }

  async getProfileAddress() {
    if (process.env.LENS_PROFILE_ID) {
        console.log('  [Lens] Using LENS_PROFILE_ID from env:', process.env.LENS_PROFILE_ID);
        return process.env.LENS_PROFILE_ID;
    }
    
    console.log('  [Lens] Fetching Profile Address from API...');
    const ME_QUERY = `
      query CurrentProfile {
        me {
          loggedInAs {
            ... on AccountOwned {
              account { address }
            }
            ... on AccountManaged {
              account { address }
            }
          }
        }
      }
    `;
    const data = await this.query(ME_QUERY);
    if (data.me && data.me.loggedInAs && data.me.loggedInAs.account) {
        return data.me.loggedInAs.account.address;
    }
    return this.wallet ? this.wallet.address : null;
  }

  async post(content, mediaPath = null) {
      console.log('  [Debug] post() called');
      // Metadata construction follows...

      let imageURI = null;
      let mediaArray = [];
      if (mediaPath) {
          imageURI = await this.uploadToPinata(mediaPath);
          mediaArray = [{ item: imageURI, type: 'image/png' }];
      }

      // Metadata - Hey API likely expects specific format, but Standard Lens Metadata is safe bet
      const metadata = {
        version: "2.0.0",
        metadata_id: Math.random().toString(36).substring(7),
        description: content,
        content: content,
        external_url: "https://memento-academy.com",
        image: imageURI,
        imageMimeType: imageURI ? "image/png" : null,
        name: "Memento Post",
        attributes: [],
        media: mediaArray,
        appId: "memento-bot",
        locale: "en-US",
        mainContentFocus: imageURI ? "IMAGE" : "TEXT_ONLY",
        id: Math.random().toString(36).substring(7)
      };

    try {
      if (!this.token) {
          console.log('  [Debug] No token, logging in...');
          await this.login();
      }

      const metadataURI = await this.uploadMetadata(metadata);

      // Priority: 1. ENV, 2. Dynamic Profile/Account Address
      let feedAddress = process.env.LENS_FEED_ID;
      if (!feedAddress) {
          console.log('  [Lens] LENS_FEED_ID not set, attempting to resolve Profile Address...');
          feedAddress = await this.getProfileAddress();
      }
      
      if (!feedAddress) throw new Error("Could not determine 'feed' address (Profile Address)");
      console.log(`  [Hey] Targeting Feed: ${feedAddress}`);

      const variable = {
        request: {
          feed: feedAddress,
          contentUri: metadataURI
        }
      };

      console.log(`  [Hey] Sending Post to feed: ${feedAddress}...`);
      const result = await this.query(POST_MUTATION, variable);
      
      if (result.post && result.post.hash) {
          console.log(`  [Hey] ✓ Post submitted! Hash: ${result.post.hash}`);
          return result.post;
      } else if (result.post && result.post.reason) {
          throw new Error(`Post validation failed: ${result.post.reason}`);
      } else {
           throw new Error(`Post failed: ${JSON.stringify(result)}`);
      }

    } catch (error) {
      console.error('✗ Posting failed:', error.message);
      if (error.response) {
          console.error('  Response data:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }
}

module.exports = { LensClient };
