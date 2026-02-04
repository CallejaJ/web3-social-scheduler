const axios = require('axios');
require('dotenv').config();

const URL = 'https://api.lens.xyz/graphql';
const QUERY_FEEDS = `
  query Feeds($request: FeedsRequest!) {
    feeds(request: $request) {
      items {
        address
        metadata {
            name
            description
        }
      }
    }
  }
`;

// The ID we are using
const TARGET_ADDRESS = '0x99fEDc46582B71cb496F4C4AFf59826c87783342';

async function main() {
  console.log(`Searching for details of Feed Address: ${TARGET_ADDRESS}...`);
  
  // Try to list many feeds to find it
  try {
    const variables = {
        request: {
            orderBy: "LATEST_FIRST", // Known valid enum
            pageSize: "FIFTY"
        }
    };
    
    const res = await query(QUERY_FEEDS, variables);
    
    if (res.feeds && res.feeds.items) {
        // Try to filter client-side since we just fetched a batch
        const feed = res.feeds.items.find(f => f.address.toLowerCase() === TARGET_ADDRESS.toLowerCase());
        
        if (feed) {
            console.log("\n✅ FOUND IT!");
            console.log("Name:", feed.metadata.name);
            console.log("Description:", feed.metadata.description);
            console.log("Address:", feed.address);
        } else {
            console.log(`\n❌ Not found in the top 50 LATEST feeds.`);
            console.log("This specific feed might be older. Since we can't search by ID easily without 'Feed' query working...");
            console.log("But based on the address, it is likely the 'Hey' or 'Lens' official feed.");
            console.log("\nDumping first 3 found just to prove connectivity:");
            res.feeds.items.slice(0, 3).forEach(f => console.log(`- ${f.metadata.name} (${f.address})`));
        }
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function query(q, v = {}) {
    const response = await axios.post(
      URL,
      { query: q, variables: v },
      { headers: { 'Content-Type': 'application/json', 'User-Agent': 'MementoBot/1.0' } }
    );
    if (response.data.errors) throw new Error(JSON.stringify(response.data.errors));
    return response.data.data;
}

main();
