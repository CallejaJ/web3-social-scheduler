const axios = require('axios');

const URL = 'https://api-v2.lens.dev';

const QUERY = `
  query Health {
    ping
  }
`;

const CONFIGS = [
  {
    name: "Minimal Headers + x-access-token",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'MementoBot/1.0',
      'x-access-token': process.env.LENS_ACCESS_TOKEN
    }
  },
  {
    name: "Minimal Headers + Authorization Bearer",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'MementoBot/1.0',
      'Authorization': `Bearer ${process.env.LENS_ACCESS_TOKEN}`
    }
  },
  {
    name: "Browser Headers + x-access-token",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0',
      'x-access-token': process.env.LENS_ACCESS_TOKEN
    }
  },
  {
    name: "No User-Agent + x-access-token",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-access-token': process.env.LENS_ACCESS_TOKEN
    }
  }
];

async function test() {
  console.log('=== Probing Lens V2 ( https://api-v2.lens.dev ) ===\n');

  for (const config of CONFIGS) {
    console.log(`Testing: ${config.name}`);
    try {
      const response = await axios.post(
        URL,
        { query: QUERY },
        { headers: config.headers, timeout: 5000 }
      );

      if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
        console.log('  ✗ HTML Response');
      } else {
        console.log('  ✓ JSON Response!');
        console.log('  Data:', JSON.stringify(response.data));
      }
    } catch (error) {
       console.log('  ✗ Error:', error.message);
       if(error.response) {
           console.log('    Status:', error.response.status);
           if(typeof error.response.data === 'string' && error.response.data.trim().startsWith('<')) {
               console.log('    Body is HTML');
           } else {
               console.log('    Body:', JSON.stringify(error.response.data));
           }
       }
    }
    console.log('---');
  }
}

require('dotenv').config();
test();
