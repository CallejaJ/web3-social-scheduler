const axios = require('axios');

const ENDPOINTS = [
  'https://api-v2.lens.dev',
  'https://api-v2.lens.dev/graphql',
  'https://api.lens.dev',
  'https://api.lens.dev/graphql',
  'https://api.lens.xyz/graphql'
];

const HEALTH_QUERY = `
  query Health {
    ping
  }
`;

const CHALLENGE_V1 = `
  query Challenge($address: EthereumAddress!) {
    challenge(address: $address) {
      text
    }
  }
`;

async function probe() {
  console.log('=== Probing Lens Endpoints (Round 2) ===\n');

  for (const url of ENDPOINTS) {
    if (!url.includes('lens.dev')) continue; // Focus on official dev for now

    process.stdout.write(`Testing ${url} (Non-Browser UA) ... `);
    try {
      const response = await axios.post(
        url,
        { query: HEALTH_QUERY },
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'MementoBot/1.0' // Explicitly non-browser
          },
          timeout: 5000
        }
      );

      if (response.headers['content-type'].includes('application/json')) {
        console.log('✓ JSON Response!');
        return;
      } else {
        console.log(`✗ Received ${response.headers['content-type']} (Status: ${response.status})`);
      }
    } catch (error) {
       console.log('✗ Error: ' + error.message);
    }
  }
}

probe();
