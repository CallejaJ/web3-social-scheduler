require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

async function debugTweets() {
  try {
    const me = await client.v2.me();
    console.log(`Debuging account: @${me.data.username} (${me.data.id})`);

    // Fetch all types of tweets
    const tweets = await client.v2.userTimeline(me.data.id, {
      max_results: 20,
      'tweet.fields': ['created_at', 'public_metrics', 'possibly_sensitive', 'conversation_id'],
      expansions: ['referenced_tweets.id']
    });

    console.log('\n=== LATEST TWEETS FROM API ===');
    
    if (!tweets.data.data || tweets.data.data.length === 0) {
        console.log("No tweets found via API.");
        return;
    }

    for (const tweet of tweets) {
      const isReply = tweet.referenced_tweets?.some(t => t.type === 'replied_to');
      const isRetweet = tweet.referenced_tweets?.some(t => t.type === 'retweeted');
      
      let type = "Original";
      if (isReply) type = "Reply";
      if (isRetweet) type = "Retweet";
      if (tweet.text.startsWith('@')) type += " (Mention Start)";

      console.log(`\n[${tweet.created_at}] ID: ${tweet.id}`);
      console.log(`Type: ${type}`);
      console.log(`Sensitive: ${tweet.possibly_sensitive}`);
      console.log(`Text: "${tweet.text.replace(/\n/g, ' ')}"`);
      console.log('---------------------------------------------------');
    }
    
    console.log(`\nTotal fetched: ${tweets.data.data.length}`);

  } catch (e) {
    console.error("Error fetching tweets:", e);
    if (e.data) console.error(JSON.stringify(e.data, null, 2));
  }
}

debugTweets();
