# Deployment Checklist

## Before You Deploy

### 1. Fix Twitter App Permissions ⚠️ REQUIRED
- [ ] Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
- [ ] Edit app settings → Set permissions to **"Read and Write"**
- [ ] **Regenerate** Access Token and Secret (old tokens won't work!)
- [ ] Update `.env` file with new credentials
- [ ] Test locally: `node index.js` (should connect without errors)

📄 **Detailed guide**: [TWITTER_SETUP.md](TWITTER_SETUP.md)

### 2. Create GitHub Repository
- [ ] Create new private repository on GitHub
- [ ] Don't initialize with README (we have files already)
- [ ] Copy the repository URL

### 3. Push Code to GitHub
```bash
git add .
git commit -m "Initial commit: Twitter bot for Railway"
git remote add origin https://github.com/YOUR_USERNAME/twitter-bot.git
git branch -M main
git push -u origin main
```

### 4. Deploy to Railway
- [ ] Sign up at [railway.app](https://railway.app) with GitHub
- [ ] Create new project → Deploy from GitHub repo
- [ ] Select your `twitter-bot` repository
- [ ] Add environment variables (all 4 Twitter credentials)
- [ ] Wait for deployment to complete
- [ ] Check logs to verify bot is running

📄 **Detailed guide**: [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)

## Verification

After deployment, check:
- [ ] Railway logs show "✓ Connected as: @memento_academy"
- [ ] All 5 tweets are scheduled
- [ ] No error messages in logs
- [ ] Service status is green/active

## Files Created for Deployment

- ✅ [railway.json](railway.json) - Railway configuration
- ✅ [.gitignore](.gitignore) - Updated with Railway entries
- ✅ [TWITTER_SETUP.md](TWITTER_SETUP.md) - Twitter permissions guide
- ✅ [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) - Full deployment guide

## Common Issues

### 403 Error when posting tweet
**Problem**: Twitter app doesn't have write permissions
**Solution**: See [TWITTER_SETUP.md](TWITTER_SETUP.md) - You MUST regenerate tokens after changing permissions

### Bot crashes on Railway
**Problem**: Missing environment variables
**Solution**: Add all 4 Twitter credentials in Railway dashboard → Variables

### Tweets not posting at scheduled time
**Problem**: Bot might have crashed or timezone mismatch
**Solution**: Check Railway logs for errors. Cron times are in UTC by default.

## Quick Commands

```bash
# Test locally
node index.js

# Check if .env has all variables
node -e "require('dotenv').config(); console.log(process.env.TWITTER_API_KEY ? 'OK' : 'MISSING')"

# Commit and push updates
git add .
git commit -m "Update tweets"
git push  # Railway auto-deploys!
```

## Timeline

1. **Fix Twitter permissions**: 5 minutes
2. **Create GitHub repo**: 2 minutes
3. **Push to GitHub**: 1 minute
4. **Deploy to Railway**: 5 minutes
5. **Configure & verify**: 3 minutes

**Total**: ~15 minutes to full deployment

## After Deployment

- Monitor logs for 24 hours
- Verify first scheduled tweet posts correctly
- Update [scheduled-tweets.json](scheduled-tweets.json) as needed (push to GitHub to update)
- Set up notifications for deployment failures (Railway can email you)

---

**Need help?** Check the detailed guides or Railway's documentation.
