# Memento Academy Twitter Bot

<div align="center">
    <img src="https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Twitter_API-v2-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter API" />
    <img src="https://img.shields.io/badge/Railway-Deployed-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" alt="Railway" />
    <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
</div>

<br />

Automated Twitter marketing bot for **[Memento Academy](https://memento-academy.com)** - A Web3 education platform with 50K+ students.

This bot handles **scheduled tweets**, **course promotions**, **community engagement**, and **automatic follower welcomes** in both English and Spanish.

---

## Features

- **Automated Tweet Scheduling** - 19 tweets per week on a strategic schedule
- **Bilingual Content** - English & Spanish tweets targeting global crypto community
- **Course Promotion** - Automated marketing for 4 free Web3 courses
- **Follower Welcome System** - Auto-greet new followers with personalized messages
- **Auto-Reply to Mentions** - Smart FAQ system responds to common questions automatically
- **Community Building** - Discord and newsletter promotion
- **Railway Deployment** - Runs 24/7 in the cloud

---

## Architecture Overview

```
┌─────────────────┐
│   Twitter API   │
│      (v2)       │
└────────┬────────┘
         │
    ┌────▼────────────────────────┐
    │   Twitter Bot (Node.js)     │
    │                             │
    │  ┌─────────────────────┐   │
    │  │  Tweet Scheduler    │   │
    │  │  (node-cron)        │   │
    │  └──────────┬──────────┘   │
    │             │               │
    │  ┌──────────▼──────────┐   │
    │  │  Follower Monitor   │   │
    │  │  (Every 2 hours)    │   │
    │  └─────────────────────┘   │
    └─────────────────────────────┘
             │
    ┌────────▼────────┐
    │  Railway Cloud  │
    │  (24/7 Hosting) │
    └─────────────────┘
```

---

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Twitter Developer Account with API access
- Railway account (for deployment)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/CallejaJ/twitter-bot.git
cd twitter-bot
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your Twitter API credentials:

```env
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret
```

4. **Run the bot**

```bash
node index.js
```

---

## Twitter API Setup

### 1. Create Twitter Developer App

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new Project and App
3. Navigate to "Settings" → "User authentication settings"
4. Set **App permissions** to: **Read and Write**
5. Select **App type**: **Web App, Automated App or Bot**
6. Fill required URLs (use `http://localhost:3000` for callback if needed)

### 2. Generate Tokens

1. Go to "Keys and tokens" tab
2. Click **"Regenerate"** on API Key and Secret
3. Click **"Generate"** on Access Token and Secret
4. Copy all 4 credentials to your `.env` file

⚠️ **Important**: You MUST regenerate tokens AFTER changing permissions to "Read and Write"

---

## Marketing Strategy

### Weekly Posting Schedule

**19 tweets per week** distributed across 7 days:

| Day | Time (UTC) | Type | Language |
|-----|------------|------|----------|
| **Monday** | 09:00 | Motivation | EN |
|  | 14:00 | Web3 Basics Course | EN |
|  | 20:00 | Industry Insight | ES |
| **Tuesday** | 09:00 | Crypto 101 Course | ES |
|  | 14:00 | Community | EN |
|  | 20:00 | Educational Value | EN |
| **Wednesday** | 09:00 | Question | ES |
|  | 14:00 | CBDC Course | EN |
|  | 20:00 | Community | ES |
| **Thursday** | 09:00 | Educational Value | EN |
|  | 14:00 | Security Course | ES |
|  | 20:00 | Educational Value | EN |
| **Friday** | 09:00 | Call-to-Action | ES |
|  | 14:00 | Question | EN |
|  | 20:00 | Web3 Basics Course | ES |
| **Saturday** | 10:00 | Weekend Learning | EN |
|  | 16:00 | Educational Value | ES |
| **Sunday** | 10:00 | Week Prep | ES |
|  | 18:00 | Call-to-Action | EN |

### Content Distribution

- **40%** - Course Promotions
- **25%** - Educational Value (tips, insights)
- **20%** - Community Building
- **10%** - Engagement Questions
- **5%** - Calls-to-Action

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

The bot monitors mentions every 30 minutes and automatically replies with relevant information:

1. **Monitors** mentions using Twitter API v2
2. **Filters spam** - Automatically detects and ignores scam/spam mentions
3. **Detects** language (EN/ES) from tweet text
4. **Matches** keywords to FAQ database
5. **Replies** with contextual answer in user's language
6. **Tracks** replied tweets to avoid duplicates

### FAQ Categories

| Category | Keywords | Response |
|----------|----------|----------|
| **Courses** | course, learn, tutorial | Links to free courses catalog |
| **Pricing** | free, price, cost | Confirms 100% free, no hidden fees |
| **Getting Started** | start, beginner, new | Recommends Web3 Basics course |
| **CBDC** | cbdc, central bank | Links to CBDC course |
| **Security** | safe, scam, protect | Links to Security Guide |
| **Community** | discord, help, support | Discord invitation |
| **Crypto Basics** | bitcoin, ethereum, crypto | Links to Crypto 101 course |

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
twitter-bot/
├── index.js                          # Main bot entry point
├── follower-welcome.js               # Follower detection & welcome logic
├── mention-replies.js                # Auto-reply to mentions (NEW)
├── scheduled-tweets.json             # Active marketing tweet schedule
├── scheduled-tweets-basic.json.backup # Original basic tweets
├── marketing-tweets-bilingual.json   # Full tweet library (reference)
├── followers-data.json               # Tracked followers (auto-generated)
├── mentions-data.json                # Tracked mentions (auto-generated)
├── .env                              # API credentials (DO NOT COMMIT)
├── .env.example                      # Template for credentials
├── package.json                      # Dependencies
├── railway.json                      # Railway deployment config
└── README.md                         # This file
```

---

## Deployment on Railway

### One-Click Deploy

1. Push your code to GitHub
2. Go to [Railway.app](https://railway.app) and login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `twitter-bot` repository
5. Add environment variables in Railway dashboard:
   - `TWITTER_API_KEY`
   - `TWITTER_API_SECRET`
   - `TWITTER_ACCESS_TOKEN`
   - `TWITTER_ACCESS_SECRET`
6. Railway auto-deploys and runs the bot 24/7

### Update Deployment

```bash
# Make changes to tweets or code
git add .
git commit -m "Update: new tweet schedule"
git push

# Railway automatically redeploys!
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

## Monitoring & Analytics

### Key Metrics to Track

1. **Engagement Rate**
   - Likes, retweets, replies per tweet
   - Best performing content types
   - Optimal posting times

2. **Course Click-Through Rate**
   - URL clicks to course pages
   - EN vs ES performance
   - Most popular courses

3. **Community Growth**
   - New followers per week
   - Discord joins from Twitter
   - Newsletter signups

4. **Content Performance**
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
- ❌ Invalid credentials
- ✅ Check your `.env` file values
- ✅ Regenerate tokens in Twitter Developer Portal

### Error 403 (Forbidden)
- ❌ App doesn't have write permissions
- ✅ Set app permissions to "Read and Write"
- ✅ Regenerate Access Token after changing permissions

### Error 429 (Rate Limit)
- ❌ Too many requests
- ✅ Wait before retrying
- ✅ Reduce tweet frequency

### Bot Not Posting
- ✅ Check Railway logs for errors
- ✅ Verify environment variables are set correctly
- ✅ Confirm `scheduled-tweets.json` has valid cron schedules

---

## Security Best Practices

- ✅ **NEVER** commit `.env` to git
- ✅ Keep `.env` in `.gitignore`
- ✅ Regenerate tokens if accidentally exposed
- ✅ Use Railway environment variables for production
- ✅ Review Twitter API usage regularly

---

## API Rate Limits

| Tier | Monthly Tweets | Rate Limit |
|------|----------------|------------|
| **Free** | 1,500 | 50 tweets/15 min |
| **Basic** | 3,000 | 100 tweets/15 min |
| **Pro** | 10,000 | 300 tweets/15 min |

Current bot usage: **~570 tweets/month** (well within Free tier)

---

## Future Enhancements

### Planned Features
- [ ] Thread posting for educational content
- [ ] Media attachments (images/GIFs)
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
- **Discord Community**: [https://discord.gg/MWfHKfjYS7](https://discord.gg/MWfHKfjYS7)
- **Twitter**: [@memento_academy](https://twitter.com/memento_academy)
- **Twitter API Docs**: [https://developer.twitter.com/en/docs/twitter-api](https://developer.twitter.com/en/docs/twitter-api)
- **Railway Docs**: [https://docs.railway.app](https://docs.railway.app)

---

## Support

Need help? Reach out:
- Open an [Issue](https://github.com/CallejaJ/twitter-bot/issues)
- Join our [Discord](https://discord.gg/MWfHKfjYS7)
- DM [@memento_academy](https://twitter.com/memento_academy)

---

<div align="center">
  <strong>Built with ❤️ for the Web3 community</strong>
  <br />
  <sub>Last updated: January 2026 | Bot Version: 2.0 (Marketing Edition)</sub>
</div>
