require('dotenv').config();
const { LensClient } = require('./lens-client');
const path = require('path');

async function debugLens() {
  console.log('=== Lens Protocol / Hey.xyz Debug ===\n');

  // 1. Check Env Vars
  console.log('1. Checking Configuration...');
  const missing = [];
  const REQUIRED_ENV = [
    'LENS_ACCESS_TOKEN',
    'PINATA_API_KEY',
    'PINATA_API_SECRET'
  ];

  for (const envVar of REQUIRED_ENV) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  
  if (missing.length > 0) {
    console.error('✗ Missing configuration:', missing.join(', '));
    console.log('\nPlease add these to your .env file.');
    return;
  }
  console.log('✓ Configuration header found\n');

  const client = new LensClient();

  // 2. Test Login
  console.log('2. Testing Authentication...');
  const loggedIn = await client.login();
  if (!loggedIn) {
     console.error('✗ Login failed. Check LENS_PRIVATE_KEY.');
     return;
  }
  console.log('✓ Authentication successful!\n');

  // 3. Test IPFS Upload (using a sample file or text only)
  console.log('3. Testing Post Preparation (IPFS)...');
  try {
     const testImage = path.join(__dirname, 'images', 'logo.png'); // Assuming logo exists
     // Or just text
     const uniqueTag = `MementoBotTest_${Math.floor(Math.random() * 10000)}`;
     const result = await client.post(`Testing Feed Visibility! 🧪\n\nChecking if custom hashtags create visibility.\nUnique Tag: #${uniqueTag} #Web3`, testImage);
     console.log(`\n🔎 SEARCH FOR THIS TAG ON HEY.XYZ: #${uniqueTag}\n`);
     console.log('✓ Post prepared/sent!');
     console.log('  Metadata URI:', result.metadataURI);
     console.log('\nCheck your Profile (or Dispatcher logs) to see if it appeared.');
  } catch (err) {
     console.error('✗ Posting failed:', err.message);
  }
}

debugLens();
