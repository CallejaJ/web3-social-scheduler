# Web3 Social Scheduler

<div align="center">
    <img src="https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Rettiwt_API-Free-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Rettiwt API" />
    <img src="https://img.shields.io/badge/Multi%E2%80%90Platform-Twitter%20|%20Bluesky%20|%20Lens-7B3FF2?style=for-the-badge" alt="Multi-Platform" />
    <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
</div>

<br />

Multi-platform social media scheduler for **[Memento Academy](https://memento-academy.com)** - A Web3 education platform with 50K+ students.

This bot handles **scheduled posts** across Twitter, Bluesky, and Lens Protocol, featuring **course promotions**, **community engagement**, and **automatic follower welcomes** in both English and Spanish. **100% free to run** - no API charges.

---

## Features

- Multi-Platform Posting - Publishes simultaneously to Twitter, Bluesky, and Lens Protocol
- Free Forever - Uses Rettiwt API (100% free, no monthly charges)
- Automated Tweet Scheduling - 14 posts per week on a strategic schedule
- Bilingual Content - English & Spanish posts targeting global crypto community
- Course Promotion - Automated marketing for 4 free Web3 courses
- Follower Welcome System - Auto-greet new followers with personalized messages
- Auto-Reply to Mentions - Smart FAQ system responds to common questions automatically
- Community Building - GitHub and newsletter promotion
- 24/7 Deployment - Runs on Koyeb, Render, or any Node.js hosting

---

## Architecture Overview

```
┌──────────────────────┐
│   Rettiwt API        │  (Free, no API charges)
│   Twitter Client     │
└──────────┬───────────┘
           │
     ┌─────▼──────────────────────────┐
     │  Multi-Platform Bot (Node.js)  │
     │                                 │
     │  ┌──────────────────────────┐  │
     │  │  Tweet Scheduler         │  │
     │  │  (node-cron)             │  │
     │  │  14 posts/week           │  │
     │  └────────┬─────────────────┘  │
     │           │                     │
     │  ┌────────▼──────────────────┐ │
     │  │  Multi-Platform Router    │ │
     │  │  Twitter → Bluesky → Lens │ │
     │  └────────┬──────────────────┘ │
     │           │                     │
     └───────────┼─────────────────────┘
                 │
        ┌────────┴────────────┬──────────────┐
        │                     │              │
    ┌───▼────┐          ┌────▼────┐    ┌───▼────┐
    │ Twitter │          │ Bluesky │    │ Lens   │
    │(Rettiwt)│          │ Protocol│    │Protocol│
    └────▼────┘          └────▼────┘    └───▼────┘
        │                     │              │
        └─────────────────────┴──────────────┘
             (50K+ followers across platforms)
```

---

## Quick Start

### Prerequisites

- Node.js 20+ installed
- Rettiwt API key (free, get instructions below)
- Bluesky account (optional, for Bluesky posting)
- Lens Protocol access (optional, for Lens posting)
- Koyeb or Render account (for 24/7 hosting)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/CallejaJ/web3-social-scheduler.git
cd web3-social-scheduler
```

2. **Install dependencies**

```bash
npm install
```

3. **Get your Rettiwt API Key**

Follow the full guide in [RETTIWT_SETUP.md](RETTIWT_SETUP.md):

- Install Rettiwt browser extension
- Open X.com in incognito mode
- Click the extension to extract your API key

4. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Rettiwt API (FREE - no charges!)
RETTIWT_API_KEY=your_api_key_here

# Bluesky (optional)
BLUESKY_IDENTIFIER=your.bsky.social
BLUESKY_PASSWORD=your_password

# Lens Protocol (optional)
LENS_PRIVATE_KEY=your_key_here
LENS_ACCESS_TOKEN=your_token_here
```

5. **Run the bot**

```bash
npm start
```

Expected output:

```
[✓ Rettiwt connected]
[Connected to Bluesky]
=== Bot running... Press Ctrl+C to stop ===
```

4. **Run the bot**

```bash
node index.js
```

---

## Rettiwt API Setup

### Why Rettiwt Instead of Official Twitter API?

In March 2026, Twitter deprecated its free API tier. All posting now requires a paid **Pro** plan ($200/month or higher).

**We migrated to Rettiwt API because:**

- 100% FREE - No monthly charges
- No API limits - Post unlimited tweets
- Multi-platform - Works with Bluesky and Lens
- Easy setup - Browser extension to extract credentials
- Reliable - Actively maintained open-source project

### Getting Your Rettiwt API Key

**Full guide available in [RETTIWT_SETUP.md](RETTIWT_SETUP.md)**

Quick setup (5 minutes):

1. Go to: https://github.com/Rishikant181/Rettiwt-API#readme
2. Install the Rettiwt browser extension
3. Open X.com in **incognito mode**
4. Login with your Twitter account
5. Click the extension → Copy the API key
6. Paste it in your `.env` file as `RETTIWT_API_KEY`

**Why incognito?**

- Creates a fresh session
- Generates an API key valid for 5 years
- Avoids cookie conflicts

### API Key Validity

- **Duration:** 5 years (if extracted in incognito mode)
- **Refresh:** Repeat steps 2-5 if needed
- **Security:** Keep it private - anyone with it can post tweets on your behalf

---

## Marketing Strategy

### Weekly Posting Schedule

**14 tweets per week** distributed across 7 days across all platforms:

| Day           | Time (Madrid) | Content Type        | Language |
| ------------- | ------------- | ------------------- | -------- |
| **Monday**    | 10:00         | Motivation          | EN       |
|               | 19:00         | Web3 Education      | ES       |
| **Tuesday**   | 10:00         | Crypto 101 Course   | ES       |
|               | 19:00         | Bitcoin History     | EN       |
| **Wednesday** | 10:00         | User Engagement     | ES       |
|               | 19:00         | CBDC Education      | EN       |
| **Thursday**  | 10:00         | Quiz Promo          | EN       |
|               | 19:00         | Telegram Community  | ES       |
| **Friday**    | 10:00         | Ethereum History    | ES       |
|               | 19:00         | Engagement Question | EN       |
| **Saturday**  | 10:00         | Weekend Learning    | EN       |
|               | 16:00         | Video Promo         | ES       |
| **Sunday**    | 10:00         | Week Prep           | ES       |
|               | 16:00         | Quiz Opportunity    | ES       |

### Publishing Across Platforms

Each scheduled tweet is automatically published to:

- Twitter (via Rettiwt API)
- Bluesky (via Bluesky API)
- Lens Protocol (via Lens SDK)

### Promoted Courses

1. **Web3 Basics** (45 min) - [EN](https://memento-academy.com/en/learn/web3-basics) | [ES](https://memento-academy.com/es/learn/web3-basics)
2. **Crypto 101** (60 min) - [EN](https://memento-academy.com/en/learn/crypto-101) | [ES](https://memento-academy.com/es/learn/crypto-101)
3. **Understanding CBDCs** (40 min) - [EN](https://memento-academy.com/en/learn/cbdc) | [ES](https://memento-academy.com/es/learn/cbdc)
4. **Security Guide** (50 min) - [EN](https://memento-academy.com/en/learn/safety) | [ES](https://memento-academy.com/es/learn/safety)

---

## New Follower Welcome System

### How It Works

The bot automatically welcomes new followers every 2 hours:

1. **Detects** new followers by comparing with previous check
2. **Sends** a public welcome tweet mentioning the user
3. **Tracks** welcomed users to avoid duplicates
4. **Randomizes** language (EN/ES) and message variation

### Welcome Messages

**English (3 variations)**:

- "Welcome to Memento Academy! We're excited to have you here. Start your Web3 journey with our free courses"
- "Thanks for following! New to Web3? No problem. We break down complex topics into simple lessons"
- "Hey there! Welcome to the Memento Academy community. Explore our free Web3 courses and join 50K+ learners"

**Spanish (3 variations)**:

- "¡Bienvenido a Memento Academy! Nos emociona tenerte aquí. Comienza tu viaje Web3 con nuestros cursos gratuitos"
- "¡Gracias por seguirnos! ¿Nuevo en Web3? No hay problema. Desglosamos temas complejos en lecciones simples"
- "¡Hola! Bienvenido a la comunidad de Memento Academy. Explora nuestros cursos gratuitos de Web3"

---

## Auto-Reply to Mentions

### How It Works

> **Note**: This feature requires **Twitter API Basic Tier** ($100/mo) or higher. It is disabled by default on Free Tier to avoid Rate Limit errors.

The bot monitors mentions every 30 minutes and automatically replies with relevant information:

1. **Monitors** mentions using Twitter API v2
2. **Filters spam** - Automatically detects and ignores scam/spam mentions
3. **Detects** language (EN/ES) from tweet text
4. **Matches** keywords to FAQ database
5. **Replies** with contextual answer in user's language
6. **Tracks** replied tweets to avoid duplicates

### FAQ Categories

| Category            | Keywords                  | Response                           |
| ------------------- | ------------------------- | ---------------------------------- |
| **Courses**         | course, learn, tutorial   | Links to free courses catalog      |
| **Pricing**         | free, price, cost         | Confirms 100% free, no hidden fees |
| **Getting Started** | start, beginner, new      | Recommends Web3 Basics course      |
| **CBDC**            | cbdc, central bank        | Links to CBDC course               |
| **Security**        | safe, scam, protect       | Links to Security Guide            |
| **Community**       | github, help, support     | GitHub invitation                  |
| **Crypto Basics**   | bitcoin, ethereum, crypto | Links to Crypto 101 course         |

### Example Interactions

**User**: "@memento_academy How do I start learning about Web3?"
**Bot**: "Perfect for beginners! Start with our Web3 Basics course (45 min): https://memento-academy.com/en/learn/web3-basics - No prior knowledge needed."

**User**: "@memento_academy ¿Los cursos son gratis?"
**Bot**: "Todos nuestros cursos son 100% GRATUITOS. Sin tarjeta de crédito, sin suscripción, sin trucos. Solo educación Web3 de calidad para todos."

### Spam Protection

The bot includes intelligent spam filtering to avoid responding to scam/spam mentions:

**Detected as spam**:

- Multiple spam keywords (pump, dump, claim, airdrop, rewards, giveaway)
- Token symbols combined with spam keywords (e.g., "$TOKEN claim now")
- Multiple URLs in one tweet
- Excessive emojis (5+)
- Very short tweets with URLs

**Spam examples** (bot will ignore):

- "🔥 BIGGEST Crypto PUMP! Join now! 🚀"
- "$TOKEN airdrop LIVE! Claim rewards: link"
- "Free tokens! Click here! Limited time!"

This protects your account from engaging with scammers and maintains professional reputation.

---

## Project Structure

```
web3-social-scheduler/
├── index.js                          # Main bot entry point
├── rettiwt-client.js                 # Rettiwt API wrapper (NEW)
├── bluesky-client.js                 # Bluesky API client
├── lens-client.js                    # Lens Protocol client
├── follower-welcome.js               # Follower detection & welcome logic
├── mention-replies.js                # Auto-reply to mentions
├── scheduled-tweets.json             # Active marketing tweet schedule
├── marketing-tweets-bilingual.json   # Full tweet library (reference)
├── followers-data.json               # Tracked followers (auto-generated)
├── mentions-data.json                # Tracked mentions (auto-generated)
├── .env                              # API credentials (DO NOT COMMIT)
├── .env.example                      # Template for credentials
├── RETTIWT_SETUP.md                  # Rettiwt API setup guide (NEW)
├── package.json                      # Dependencies
└── README.md                         # This file
```

---

## Deployment on Koyeb or Render

### One-Click Deploy to Koyeb

1. Push your code to GitHub
2. Go to [Koyeb.com](https://www.koyeb.com) and login with GitHub
3. Click "Create Service" → Select **GitHub**
4. Select `web3-social-scheduler` repository
5. Add environment variables in Koyeb dashboard:
   - `RETTIWT_API_KEY` (required)
   - `BLUESKY_IDENTIFIER` (optional)
   - `BLUESKY_PASSWORD` (optional)
   - `LENS_*` variables (optional)
6. Koyeb auto-deploys and runs the bot 24/7

### One-Click Deploy to Render

1. Go to [Render.com](https://render.com)
2. Click "New +" → Choose "Web Service"
3. Connect your GitHub repository
4. Set environment variables
5. Deploy - bot runs continuously

### Update Deployment

```bash
# Make changes to tweets or code
git add .
git commit -m "Update: new tweet schedule"
git push

# Koyeb/Render automatically redeploy!
```

### Verify Bot is Running

Check the bot status at:

```
https://your-bot-url.com/status
```

Returns:

```json
{
  "status": "online",
  "uptime": 12345678,
  "timestamp": 1704067200000
}
```

---

## Customization

### Add New Tweets

Edit `scheduled-tweets.json`:

```json
{
  "tweets": [
    {
      "schedule": "0 9 * * 1",
      "text": "Your tweet content here",
      "language": "en",
      "type": "course_promo"
    }
  ]
}
```

### Cron Schedule Format

```
┌─────────── minute (0 - 59)
│ ┌───────── hour (0 - 23)
│ │ ┌─────── day of month (1 - 31)
│ │ │ ┌───── month (1 - 12)
│ │ │ │ ┌─── day of week (0 - 7, Sunday = 0 or 7)
│ │ │ │ │
* * * * *
```

**Examples**:

- `0 9 * * *` - Every day at 9:00 AM
- `0 9 * * 1-5` - Monday to Friday at 9:00 AM
- `*/30 * * * *` - Every 30 minutes
- `0 */2 * * *` - Every 2 hours

---

## Automated Scheduling with Cron

This bot uses **[node-cron](https://www.npmjs.com/package/node-cron)** to handle all time-based tasks. Cron allows us to schedule scripts to fun at specific intervals or times.

### Where is it used?

The scheduling logic is centralized in `index.js`. It orchestrates:

1.  **Marketing Tweets**: Reads `scheduled-tweets.json` and creates a cron job for each entry.
2.  **Mentions Check**: Runs every 30 minutes (`*/30 * * * *`) to reply to users globally.
3.  **Bot Keep-Alive**: The process stays active indefinitely to respect these schedules.

### Cron Sytax Reference

The schedule format consists of 5 fields:

```
┌─────────── minute (0 - 59)
│ ┌───────── hour (0 - 23)
│ │ ┌─────── day of month (1 - 31)
│ │ │ ┌───── month (1 - 12)
│ │ │ │ ┌─── day of week (0 - 7, Sunday = 0 or 7)
│ │ │ │ │
* * * * *
```

**Common Examples in this project**:

- `0 9 * * 1`: Runs at 09:00 AM every Monday.
- `*/30 * * * *`: Runs every 30 minutes.
- `0 */2 * * *`: Runs every 2 hours (on the hour).

> **Note**: Times are based on the server's timezone (usually UTC on cloud platforms like Koyeb).

---

## Monitoring & Analytics

### Key Metrics to Track

1. **Engagement Rate**
   - Likes, retweets, replies per tweet
   - Best performing content types
   - Optimal posting times

2. **Course Click-Through Rate**
   - URL clicks to course pages
   - EN vs ES performance

3. **Engagement Rate**
   - Likes, retweets, replies per tweet
   - Best performing content types
   - Optimal posting times

4. **Course Click-Through Rate**
   - URL clicks to course pages
   - EN vs ES performance
   - Most popular courses

5. **Community Growth**
   - New followers per week
   - GitHub joins from Twitter
   - Newsletter signups

6. **Content Performance**
   - Questions vs statements engagement
   - Course promos vs educational content
   - Language preference (EN vs ES)

### View Logs

**Railway Dashboard**:

- Navigate to your project → Deployments → View Logs
- Monitor tweet posting and follower checks in real-time

**Local**:

```bash
node index.js
# Logs appear in console
```

---

## Optimization Tips

### Increase Engagement

- Add more question tweets to drive replies
- Include visual content (images/videos)
- Adjust posting times for target timezone
- Test different CTAs (Call-to-Actions)

### Improve Click-Through Rate

- Shorten tweet text, emphasize value
- Test different course descriptions
- Highlight "FREE" prominently
- Add social proof (number of students)

### Boost Follower Growth

- Engage with Web3/crypto influencers
- Reply to relevant industry conversations
- Use trending hashtags strategically
- Run Twitter polls on hot topics

---

## Troubleshooting

### Error 401 (Unauthorized)

- Invalid credentials
- Check your `.env` file values
- Regenerate tokens in Twitter Developer Portal

### Error 403 (Forbidden)

- App doesn't have write permissions
- Set app permissions to "Read and Write"
- Regenerate Access Token after changing permissions

### Error 429 (Rate Limit)

- Too many requests
- Wait before retrying
- Reduce tweet frequency

### Bot Not Posting

- Check Railway logs for errors
- Verify environment variables are set correctly
- Confirm `scheduled-tweets.json` has valid cron schedules

---

## Security Best Practices

- **NEVER** commit `.env` to git
- Keep `.env` in `.gitignore`
- Regenerate tokens if accidentally exposed
- Use Railway environment variables for production
- Review Twitter API usage regularly

---

## API Rate Limits

With **Rettiwt API**, you get:

| Feature           | Limit         |
| ----------------- | ------------- |
| Monthly Posts     | Unlimited     |
| Daily Posts       | Unlimited     |
| API Cost          | FREE          |
| Rate Limiting     | Per-platform  |

**Current bot usage:** ~600 posts/month (1 main Twitter account + Bluesky + Lens)

**Note:** Although posts are unlimited with Rettiwt, each platform (Twitter, Bluesky, Lens) has its own rate limits. This bot respects those limits automatically.

---

## Future Enhancements

### Planned Features

- [ ] Thread posting for educational content
- [x] Media attachments (images/GIFs)
- [ ] A/B testing for tweet variations
- [ ] Analytics dashboard
- [ ] Sentiment analysis
- [ ] Trending topics integration

### Premium Features

- [ ] Twitter Ads integration
- [ ] Influencer outreach automation
- [ ] NFT giveaways for course completion
- [ ] Live AMA scheduling

---

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - Free for personal and commercial use

---

## Resources

- **Memento Academy**: [https://memento-academy.com](https://memento-academy.com)
- **GitHub Community**: [https://github.com/orgs/Memento-Academy/discussions](https://github.com/orgs/Memento-Academy/discussions)
- **Twitter**: [@memento_academy](https://twitter.com/memento_academy)
- **Twitter API Docs**: [https://developer.twitter.com/en/docs/twitter-api](https://developer.twitter.com/en/docs/twitter-api)
- **Railway Docs**: [https://docs.railway.app](https://docs.railway.app)

---

## Support

Need help? Reach out:

- Open an [Issue](https://github.com/CallejaJ/twitter-bot/issues)
- Join our [GitHub](https://github.com/orgs/Memento-Academy/discussions)
- DM [@memento_academy](https://twitter.com/memento_academy)

---

<div align="center">
  <strong>Multi-platform scheduler built for the Web3 community</strong>
  <br />
  <sub>Last updated: March 2026 | Version: 3.0 (Rettiwt Edition)</sub>
  <br />
  <sub>Migrated from Twitter API v2 (paid) to Rettiwt API (free)</sub>
</div>
