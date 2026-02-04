require('dotenv').config();
const { BskyAgent, RichText } = require('@atproto/api');

async function testRichText() {
    const agent = new BskyAgent({ service: 'https://bsky.social' });
    
    await agent.login({
        identifier: process.env.BLUESKY_IDENTIFIER,
        password: process.env.BLUESKY_PASSWORD
    });
    
    const text = "Testing hashtags detection #Web3 #Crypto #Testing";
    console.log("Original Text:", text);
    
    const rt = new RichText({ text });
    await rt.detectFacets(agent);
    
    console.log("Detected Facets:", JSON.stringify(rt.facets, null, 2));
    
    if (rt.facets && rt.facets.length > 0) {
        console.log("✅ Facets detected successfully.");
    } else {
        console.log("✗ No facets detected. RichText detection failed.");
    }
}

testRichText().catch(console.error);
