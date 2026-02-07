const { TwitterApi } = require("twitter-api-v2");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

async function sendTestTweet() {
  console.log("Preparing to send test tweet...");

  if (
    !process.env.TWITTER_API_KEY ||
    !process.env.TWITTER_API_SECRET ||
    !process.env.TWITTER_ACCESS_TOKEN ||
    !process.env.TWITTER_ACCESS_SECRET
  ) {
    console.error("Missing Twitter API credentials in .env");
    return;
  }

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

  const rwClient = client.readWrite;

  // Tweet details from scheduled-tweets.json (index 14)
  const text =
    "¿Blockchain te parece complicado? Lo hacemos simple. Empieza tu viaje Web3 hoy, completamente gratis. https://memento-academy.com/es/learn/web3-basics #Web3 (Prueba Manual)";
  const imageRequest = "web3-basics-es.png";

  // Construct path - same logic as index.js
  const generatedPath = path.join(
    __dirname,
    "images",
    "generated",
    imageRequest,
  );

  console.log(`Looking for image at: ${generatedPath}`);

  if (!fs.existsSync(generatedPath)) {
    console.error("ERROR: Image file not found locally!");
    return;
  }

  try {
    console.log("Uploading media...");
    const mediaId = await rwClient.v1.uploadMedia(generatedPath);
    console.log(`Media uploaded with ID: ${mediaId}`);

    console.log("Sending tweet...");
    const tweet = await rwClient.v2.tweet({
      text: text,
      media: { media_ids: [mediaId] },
    });

    console.log("✓ Tweet sent successfully!");
    console.log(`Tweet ID: ${tweet.data.id}`);
    console.log(`Text: ${tweet.data.text}`);
  } catch (error) {
    console.error("✗ Error sending tweet:", error);
    if (error.data) {
      console.error("Details:", JSON.stringify(error.data, null, 2));
    }
  }
}

sendTestTweet();
