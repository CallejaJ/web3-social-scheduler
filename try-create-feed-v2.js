const axios = require('axios');
require('dotenv').config();

const URL = 'https://api.lens.xyz/graphql';

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

const CREATE_FEED_MUTATION = `
  mutation CreateFeed {
    createFeed(request: {}) {
      ... on CreateFeedResponse {
        hash
      }
      ... on TransactionWillFail {
        reason
      }
    }
  }
`;

// Helper to query with headers
async function query(q, v = {}, token) {
    const response = await axios.post(
      URL,
      { query: q, variables: v },
      {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'MementoBot/1.0',
            'x-access-token': token
        }
      }
    );
    
    if (response.data.errors) {
        throw new Error(JSON.stringify(response.data.errors));
    }
    return response.data.data;
}

async function main() {
  console.log('Attempting to CREATE FEED (Owned by User)...');
  
  let accessToken = process.env.LENS_ACCESS_TOKEN;
  
  // 1. Refresh Token First to guarantee freshness
  if (process.env.LENS_REFRESH_TOKEN) {
      console.log('Refreshing token to ensure auth...');
      try {
          const res = await query(REFRESH_MUTATION, { request: { refreshToken: process.env.LENS_REFRESH_TOKEN } }, accessToken);
          if (res.refresh && res.refresh.accessToken) {
              console.log('✓ Token refreshed.');
              accessToken = res.refresh.accessToken;
          }
      } catch (e) {
          console.warn('⚠ Refresh failed, trying with existing token:', e.message);
      }
  }

  // 2. Try Create Feed
  try {
    console.log('Sending createFeed mutation...');
    const createRes = await query(CREATE_FEED_MUTATION, {}, accessToken);
    
    console.log('✓ Make Feed Result:', JSON.stringify(createRes, null, 2));
    
    if (createRes.createFeed && createRes.createFeed.hash) {
        console.log("SUCCESS! Feed creation transaction sent.");
        console.log("Wait a few seconds and then run check-feed-owner.js to see if a managed feed appears.");
    }

  } catch (error) {
    console.error('✗ Error creating feed:', error.message);
    if (error.response) console.log(JSON.stringify(error.response.data, null, 2));
  }
}

main();
