# Railway Deployment Guide

## Prerequisites

Before deploying, make sure you:
1. ✅ Fixed Twitter app permissions (Read and Write)
2. ✅ Regenerated Access Token and Secret with new permissions
3. ✅ Tested bot locally with `node index.js`

## Step 1: Create GitHub Repository

### 1.1 Create repository on GitHub
1. Go to https://github.com/new
2. Repository name: `twitter-bot` (or any name you prefer)
3. Make it **Private** (recommended for bots with credentials)
4. **DO NOT** initialize with README (we already have files)
5. Click **"Create repository"**

### 1.2 Push your code to GitHub

```bash
# Add all files (git is already initialized)
git add .

# Create first commit
git commit -m "Initial commit: Twitter bot with Railway config"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/twitter-bot.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Railway

### 2.1 Create Railway Account
1. Go to https://railway.app
2. Click **"Login"**
3. Sign up with GitHub (recommended)
4. Authorize Railway to access your repositories

### 2.2 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `twitter-bot` repository
4. Railway will automatically detect it's a Node.js project

### 2.3 Configure Environment Variables

⚠️ **CRITICAL**: You must add your Twitter credentials

1. Click on your deployed service
2. Go to **"Variables"** tab
3. Click **"New Variable"** for each:

```
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_SECRET=your_access_secret_here
```

4. Click **"Deploy"** after adding all variables

### 2.4 Verify Deployment

1. Go to **"Deployments"** tab
2. Wait for deployment to finish (green checkmark)
3. Click on the latest deployment
4. Check **"View Logs"**

You should see:
```
Testing Twitter API connection...
✓ Connected as: @memento_academy
=== Twitter Bot Started ===
Scheduled tweets loaded: 5
✓ Tweet #1 scheduled: 0 9 * * *
...
```

## Step 3: Monitor Your Bot

### View Logs
- Railway Dashboard → Your Project → View Logs
- Real-time logs show when tweets are posted

### Check Bot Status
- **Active**: Green dot next to service name
- **Crashed**: Red dot (check logs for errors)

### Restart Bot
If needed:
1. Go to service settings
2. Click **"Restart"**

## Railway Free Tier Limits

- **$5 free credits per month**
- Your bot uses minimal resources (~1-5 cents/day)
- Should run 24/7 within free tier

## Troubleshooting

### Bot keeps crashing
1. Check logs for errors
2. Verify environment variables are set correctly
3. Make sure Twitter permissions are "Read and Write"

### Tweets not posting
1. Check Railway logs for 403 errors
2. Regenerate Twitter tokens with correct permissions
3. Update environment variables in Railway

### Can't connect repository
1. Make sure repository is pushed to GitHub
2. Check Railway has access to your GitHub account
3. Try refreshing the repository list

## Update Bot (Push Changes)

When you want to update tweets or code:

```bash
# Make your changes (edit scheduled-tweets.json, etc.)
git add .
git commit -m "Update: describe your changes"
git push

# Railway automatically redeploys on push!
```

## Stop the Bot

If you need to stop it:
1. Railway Dashboard → Your Project
2. Click **"Settings"**
3. Scroll down
4. Click **"Delete Service"** (or just pause the deployment)

## Costs

- **Free tier**: $5/month credit (enough for this bot)
- If you exceed: ~$0.03/day = ~$0.90/month
- You'll get email notifications before charges

## Security Checklist

- ✅ .env is in .gitignore
- ✅ Repository is private
- ✅ Environment variables set in Railway (not in code)
- ✅ Never committed credentials to git

## Next Steps

After deployment:
1. Monitor logs for first 24 hours
2. Verify tweets post at scheduled times
3. Adjust [scheduled-tweets.json](scheduled-tweets.json) as needed
4. Consider setting up monitoring/alerts

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- This bot's issues: Create issues in your GitHub repo
