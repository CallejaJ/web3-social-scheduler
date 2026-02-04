const axios = require('axios');
require('dotenv').config();

const URL = 'https://api.lens.xyz/graphql';
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

async function main() {
  console.log('Creating new feed...');
  
  try {
    const createRes = await query(CREATE_FEED_MUTATION);
    console.log('✓ Created Feed Result:', JSON.stringify(createRes, null, 2));

  } catch (error) {
    console.error('✗ Error:', error.message);
    if (error.response) console.log(error.response.data);
  }
}

async function query(q, v = {}) {
    const response = await axios.post(
      URL,
      { query: q, variables: v },
      {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'MementoBot/1.0',
            'x-access-token': process.env.LENS_ACCESS_TOKEN
        }
      }
    );
    
    if (response.data.errors) {
        throw new Error(JSON.stringify(response.data.errors));
    }
    
    return response.data.data;
}

main();
