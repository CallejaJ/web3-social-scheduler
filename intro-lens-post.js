const axios = require('axios');
require('dotenv').config();

const URL = 'https://api.lens.xyz/graphql';

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

// Minimal valid-ish request
// We need a dummy contentURI and feed address
const ADDRESS = process.env.LENS_ACCESS_TOKEN ? JSON.parse(Buffer.from(process.env.LENS_ACCESS_TOKEN.split('.')[1], 'base64').toString()).act.sub : "0x0000";

const VARIABLES = {
  request: {
    feed: ADDRESS, 
    contentUri: "ipfs://QmDummyHash"
  }
};

async function testPost() {
  console.log('Testing Post Mutation Auth on', URL, '...\n');
  console.log('Address from Token:', ADDRESS);

  try {
    const response = await axios.post(
        URL,
        { query: POST_MUTATION, variables: VARIABLES },
        { 
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'MementoBot/1.0',
                'Origin': 'https://hey.xyz',
                'Referer': 'https://hey.xyz/',
                'Authorization': `Bearer ${process.env.LENS_ACCESS_TOKEN}`
            }
        }
    );

    if (response.data.errors) {
        console.log('✗ Error:', JSON.stringify(response.data.errors));
    } else {
        console.log('✓ Success/Response:', JSON.stringify(response.data.data));
    }

  } catch (e) {
    console.log('✗ Exception:', e.message);
    if (e.response) {
         console.log('Body:', e.response.data);
    }
  }
}

testPost();
