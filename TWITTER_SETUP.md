# Twitter App Setup Guide

## Error: 403 Forbidden - OAuth1 Permissions

This error means your Twitter app doesn't have write permissions.

## Fix Steps

### 1. Go to Twitter Developer Portal
Visit: https://developer.twitter.com/en/portal/dashboard

### 2. Select Your App
- Find your app: `2007791234203463681memento_aca`
- Click on it

### 3. Configure User Authentication Settings

#### Navigate to Settings
- Click on **"Settings"** tab
- Scroll to **"User authentication settings"**
- Click **"Set up"** (or **"Edit"** if already configured)

#### Set Permissions
- **App permissions**: Select **"Read and Write"**
  - ❌ NOT "Read only"
  - ✅ "Read and Write" (required for posting tweets)
  - You can also select "Read and Write and Direct Messages" if you want DM capabilities

#### Type of App
- Select: **"Web App, Automated App or Bot"**

#### Callback URI / Redirect URL
- You can leave this blank or use: `http://localhost:3000`

#### Website URL
- Enter your academy website or use: `https://github.com/yourusername/twitter-bot`

### 4. Save Changes
- Click **"Save"**

### 5. Regenerate Tokens

⚠️ **IMPORTANT**: After changing permissions, you MUST regenerate your tokens.

#### Go to "Keys and tokens" tab

1. **API Key and Secret**:
   - Click **"Regenerate"**
   - Copy both values immediately

2. **Access Token and Secret**:
   - Click **"Regenerate"**
   - Copy both values immediately

### 6. Update .env File

Replace the values in your `.env` file:

```env
TWITTER_API_KEY=your_new_api_key
TWITTER_API_SECRET=your_new_api_secret
TWITTER_ACCESS_TOKEN=your_new_access_token
TWITTER_ACCESS_SECRET=your_new_access_secret
```

### 7. Test Again

```bash
node index.js
```

You should see:
```
✓ Connected as: @memento_academy
✓ Tweet #1 scheduled: 0 9 * * *
...
```

## Common Issues

### Still Getting 403?
- Make sure you regenerated the tokens AFTER changing permissions
- Old tokens don't inherit new permissions
- Wait 1-2 minutes after regenerating tokens

### Can't Find "User authentication settings"?
- You might be on the wrong page
- Make sure you're in your APP settings, not PROJECT settings

### Error 401 Instead?
- Your credentials are wrong
- Double-check you copied the full token values
- Make sure there are no extra spaces in .env file

## Security Reminders

- ❌ NEVER commit .env file to git
- ❌ NEVER share your tokens publicly
- ✅ Keep .env in .gitignore
- ✅ Regenerate tokens if accidentally exposed
