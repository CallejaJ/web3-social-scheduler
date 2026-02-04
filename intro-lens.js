const axios = require('axios');
require('dotenv').config();

const URL = 'https://api.lens.xyz/graphql';

const QUERY = `
  query Introspection {
    __type(name: "Feed") {
      name
      kind
      fields {
        name
        type {
           name
           kind
        }
      }
    }
  }
`;

async function testAuth() {
  console.log('Testing Authentication on', URL, '...\n');
  
  try {
    const response = await axios.post(
      URL,
      { query: QUERY },
      {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'MementoBot/1.0',
            'x-access-token': process.env.LENS_ACCESS_TOKEN
        }
      }
    );
    
    if (response.data.errors) {
        console.error('Errors:', JSON.stringify(response.data.errors));
    } else {
        const typeInfo = response.data.data.__type;
        console.log('Feed Type:', JSON.stringify(typeInfo, null, 2));
    }

  } catch (error) {
    console.error('Error:', error.message);
    if(error.response) {
       console.log('Body:', JSON.stringify(error.response.data));
    }
  }
}

testAuth();
