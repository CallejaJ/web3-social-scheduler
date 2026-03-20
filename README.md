# Web3 Social Scheduler

<div align="left">
    <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/GitHub_Actions-Scheduler-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions" />
    <img src="https://img.shields.io/badge/Platforms-Twitter%20|%20Bluesky-7B3FF2?style=for-the-badge" alt="Multi-Platform" />
    <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
</div>

<br />

Multi-platform social media scheduler for **[Memento Academy](https://memento-academy.com)** — a Web3 education platform. Posts to **Twitter** and **Bluesky** automatically. **100% free to run.**

---

## Architecture

| Platform | How it runs | Why |
|----------|-------------|-----|
| **Twitter** | GitHub Actions + Playwright | Twitter blocks write API calls from datacenter IPs |
| **Bluesky** | Koyeb (Node.js server) | No IP restrictions, standard API |

```
GitHub Actions (cron every hour)         Koyeb (24/7 server)
        │                                        │
  tweet-poster.js                          index.js
  Playwright browser                       node-cron
  (real browser, bypasses IP block)        (Bluesky only)
        │                                        │
        ▼                                        ▼
    Twitter/X                              Bluesky
```

**Content rotation:** 15 time slots × 4 tweet variants = 60 unique posts cycling weekly by ISO week number.

---

## Quick Start

### Prerequisites

- Node.js 20+
- Twitter account — cookies extracted from browser (`auth_token`, `ct0`, `twid`)
- Bluesky account
- GitHub repository (for Actions)
- Koyeb account (for Bluesky 24/7)

### Installation

```bash
git clone https://github.com/CallejaJ/web3-social-scheduler.git
cd web3-social-scheduler
npm install
npx playwright install chromium
```

### Environment Variables

```env
# Twitter — extract from browser DevTools > Application > Cookies > twitter.com
RETTIWT_API_KEY=auth_token=XXX;ct0=YYY;twid=u%3DZZZ;

# Bluesky
BLUESKY_IDENTIFIER=your.bsky.social
BLUESKY_PASSWORD=your_app_password
```

### Getting Twitter Cookies

1. Open Twitter in your browser → F12 → **Application** → **Cookies** → `twitter.com`
2. Copy `auth_token`, `ct0`, and `twid` values
3. Format: `auth_token=VALUE;ct0=VALUE;twid=u%3DVALUE;`

> Cookies expire when you log out. Refresh them if the bot stops posting.

---

## Deployment

### Twitter → GitHub Actions

1. Add `RETTIWT_API_KEY` as a **repository secret** (Settings → Secrets → Actions)
2. The workflow at `.github/workflows/tweet-scheduler.yml` runs every hour
3. `tweet-poster.js` checks Madrid time, posts the matching tweet variant

**Manual test:** Actions → Tweet Scheduler → Run workflow

### Bluesky → Koyeb

1. Push code to GitHub
2. Create a new service on [Koyeb](https://koyeb.com) connected to the repo
3. Add environment variables: `RETTIWT_API_KEY`, `BLUESKY_IDENTIFIER`, `BLUESKY_PASSWORD`
4. Koyeb auto-deploys and runs 24/7

**Health check:** `https://your-app.koyeb.app/status`

**Manual test:** `https://your-app.koyeb.app/test-now`

---

## Weekly Schedule

**15 posts/week** across both platforms (Madrid timezone):

| Day | Time | Content Type | Language |
|-----|------|-------------|----------|
| **Monday** | 10:00 | Motivation | EN |
| | 19:00 | Web3 Security Education | ES |
| **Tuesday** | 10:00 | Crypto 101 Course Promo | ES |
| | 19:00 | Bitcoin/Crypto Curiosity | EN |
| **Wednesday** | 10:00 | User Engagement Question | ES |
| | 19:00 | Course Promo (CBDC/DeFi/NFT) | EN |
| **Thursday** | 10:00 | Quiz Promo | EN |
| | 19:00 | Telegram Community | ES |
| **Friday** | 10:00 | Web3 History Curiosity | ES |
| | 16:00 | Web3 History Curiosity | ES |
| | 19:00 | Engagement Question | ES |
| **Saturday** | 10:00 | Weekend Learning | EN |
| | 16:00 | Video Promo | ES |
| **Sunday** | 10:00 | Week Prep | ES |
| | 16:00 | Quiz Opportunity | ES |

Each slot has **4 rotating variants** — different content each week, cycling every 4 weeks.

---

## Content Structure

`scheduled-tweets.json` uses a `slots` array. Each slot has 4 tweet variants:

```json
{
  "slots": [
    {
      "schedule": "0 10 * * 1",
      "language": "en",
      "type": "motivation",
      "media": "image.png",
      "platforms": ["twitter", "bluesky"],
      "tweets": [
        "Tweet text for week 1",
        "Tweet text for week 2",
        "Tweet text for week 3",
        "Tweet text for week 4"
      ]
    }
  ]
}
```

The active variant is selected by `ISO_week_number % 4`.

---

## Project Structure

```
web3-social-scheduler/
├── .github/
│   └── workflows/
│       └── tweet-scheduler.yml   # GitHub Actions — posts to Twitter
├── index.js                      # Koyeb server — posts to Bluesky
├── tweet-poster.js               # GitHub Actions script — Playwright Twitter poster
├── rettiwt-client.js             # Rettiwt wrapper (used for auth cookie parsing)
├── bluesky-client.js             # Bluesky API client
├── scheduled-tweets.json         # 15 slots × 4 variants = 60 posts
├── .env                          # Credentials (DO NOT COMMIT)
└── .env.example                  # Credential template
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Twitter: "empty response" | Datacenter IP blocked by Twitter | Use GitHub Actions (already configured) |
| Twitter: "Invalid authentication data" | Missing `twid` cookie | Add `twid=u%3DXXX` to `RETTIWT_API_KEY` |
| Twitter stops posting | Cookies expired | Re-extract cookies from browser, update GitHub secret |
| Bluesky not posting | Wrong credentials | Check `BLUESKY_IDENTIFIER` and `BLUESKY_PASSWORD` |
| GitHub Actions: "No tweet scheduled" | Wrong time/timezone | Script uses Madrid time automatically |

---

## Security

- **Never** commit `.env` to git
- Twitter cookies grant full account access — treat like a password
- Rotate cookies if accidentally exposed (log out and log back in)

---

## License

MIT License — Free for personal and commercial use

---

<div align="center">
  <strong>Built for the Web3 community</strong>
  <br />
  <sub>Last updated: March 2026 | Twitter via GitHub Actions + Playwright | Bluesky via Koyeb</sub>
</div>
