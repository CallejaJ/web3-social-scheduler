const axios = require('axios');
require('dotenv').config();

const URL = 'https://api.lens.xyz/graphql';
const QUERY_FEED_POSTS = `
  query FeedPosts($request: FeedPostsRequest!) {
    feedPosts(request: $request) {
      items {
        id
        by {
            id
            handle {
                fullHandle
            }
        }
        metadata {
            ... on TextOnlyMetadataV3 {
                content
            }
        }
        createdAt
      }
    }
  }
`;

const TARGET_ADDRESS = '0x99fEDc46582B71cb496F4C4AFf59826c87783342';

async function main() {
  console.log(`Checking recent posts in Feed: ${TARGET_ADDRESS}...`);
  
  try {
    const variables = {
        request: {
            feedId: TARGET_ADDRESS, // Assuming access via ID/Address
            // Or maybe it's just 'where' in V2/V3? 
            // V2 uses 'publications' query usually. 
            // This 'feedPosts' might be specific to the Hey API or V3?
            // Let's try to just list publications from the API we are using.
            // If this fails, we'll try a generic publications query.
        }
    };
    
    const PROFILE_STATS_QUERY = `
      query Profile($request: ProfileRequest!) {
        profile(request: $request) {
          id
          stats {
            postsTotal
            commentsTotal
            mirrorsTotal
          }
        }
      }
    `;
    
    const MY_PROFILE_ID = "0x01c1ae";
    
    console.log(`Checking stats for Profile ID: ${MY_PROFILE_ID}...`);
    
    // The request format for 'profile' usually takes 'profileId' directly?
    // Let's rely on introspection from earlier: 'ProfileRequest' has 'profileId'.
    const profileVars = {
        request: {
            profileId: MY_PROFILE_ID
        }
    };

    const res = await query(PROFILE_STATS_QUERY, profileVars);
    
    if (res.profile) {
        console.log("✅ Profile Found!");
        console.log("Stats:", JSON.stringify(res.profile.stats, null, 2));
        console.log("If 'postsTotal' is > 0, then your posts exist on-chain.");
        console.log("If Hey.xyz search is empty, it is likely an Indexing lag or UI filtering.");
    } else {
        console.log("❌ Profile not found.");
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) console.log(JSON.stringify(error.response.data));
  }
}

async function query(q, v = {}) {
    const response = await axios.post(
      URL,
      { query: q, variables: v },
      { headers: { 'Content-Type': 'application/json', 'User-Agent': 'MementoBot/1.0', 'x-access-token': process.env.LENS_ACCESS_TOKEN } }
    );
    if (response.data.errors) throw new Error(JSON.stringify(response.data.errors));
    return response.data.data;
}

main();
