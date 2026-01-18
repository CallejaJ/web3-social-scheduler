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
    console.log(`Account: ${me.data.username}`);

    const tweets = await client.v2.userTimeline(me.data.id, {
      max_results: 10,
      'tweet.fields': ['created_at', 'text', 'referenced_tweets'] 
    });

    if (!tweets.data.data) {
        console.log("No tweets found.");
        return;
    }

    tweets.data.data.forEach(t => {
      let type = "Original";
      if (t.referenced_tweets) {
          type = t.referenced_tweets.map(r => r.type).join(', ');
      }
      console.log(`[${t.created_at}] [${type}] ${t.text.replace(/\n/g, ' ').substring(0, 50)}...`);
    });

  } catch (e) {
    console.log("Error:", e.message);
  }
}

debugTweets();
