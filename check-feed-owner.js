const axios = require('axios');
require('dotenv').config();

const URL = 'https://api.lens.xyz/graphql';
const QUERY_FEED_INFO = `
  query Feeds($request: FeedsRequest!) {
    feeds(request: $request) {
      items {
        address
        owner
        metadata {
            name
        }
      }
    }
  }
`;

const FEED_ID = process.env.LENS_FEED_ID;

async function main() {
  console.log(`Checking info for Feed ID: ${FEED_ID}...`);
  
  try {
     // Try to filter by the specific feed address if the API allows, 
     // otherwise we might have to just list feeds. 
     // Based on previous introspection, filter has 'managedBy', 'searchQuery'.
     // Let's try listing recent feeds and see if we can find it, or use a "search" if possible?
     // Actually, let's just use the known 'feeds' query structure that worked before but trying to filter/find.
     // Since we can't filter by ID easily, let's verify if the user OWNS any feeds first.
     
    const variables = {
        request: {
            // searching for feeds managed by the user to see if they own ANY
            filter: {
                 managedBy: {
                     address: "0x14d2bfE32Ee15F1734F2d5fbC5C923E99c4557F1", 
                     includeOwners: true
                 }
            },
            orderBy: "LATEST_FIRST",
            pageSize: "TEN"
        }
    };
    
    console.log("Querying feeds managed by user...");
    const res = await query(QUERY_FEED_INFO, variables);
    
    if (res.feeds && res.feeds.items) {
        console.log(`Found ${res.feeds.items.length} feeds owned/managed by user.`);
        
        // Log details of ALL found feeds
        res.feeds.items.forEach((feed, index) => {
             console.log(`[${index}] Address: ${feed.address} | Owner: ${feed.owner}`);
        });

        const match = res.feeds.items.find(f => f.address.toLowerCase() === FEED_ID.toLowerCase());
        if (match) {
            console.log("✅ The configured LENS_FEED_ID IS owned by the user.");
        } else {
             // If we found OTHER feeds, suggest switching!
             if (res.feeds.items.length > 0) {
                 const newFeed = res.feeds.items[0].address;
                 console.log(`💡 FOUND A NEW FEED: ${newFeed}`);
                 console.log(`   You should update LENS_FEED_ID in .env to this address!`);
             } else {
                 console.log("⚠️ Still no feeds found for this user.");
             }
        }
    }

  } catch (error) {
    console.error('✗ Error:', error.message);
    if (error.response) console.log(JSON.stringify(error.response.data, null, 2));
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
