# Instagram Graph API Setup Guide

## 🎯 Overview

This guide will help you set up **FREE** Instagram posting using the Instagram Graph API. No third-party costs!

---

## 📋 Prerequisites

1. **Facebook Account** (personal account)
2. **Instagram Business Account** (not personal)
   - If you have a personal Instagram, you can convert it to Business
3. **Facebook Page** connected to your Instagram Business account

---

## ⏱️ Setup Time: ~15 minutes

---

## 🚀 Step-by-Step Setup

### Step 1: Convert Instagram to Business Account

1. Open Instagram mobile app
2. Go to **Profile → Settings → Account**
3. Tap **Switch to Professional Account**
4. Choose **Business**
5. Follow the prompts to complete setup

### Step 2: Create a Facebook Page

1. Go to https://www.facebook.com/pages/create
2. Click **Create New Page**
3. Enter:
   - Page name (can match your Instagram business name)
   - Category (e.g., "Business & Economy")
4. Click **Create Page**

### Step 3: Connect Instagram to Facebook Page

1. On your Facebook Page, go to **Settings**
2. Click **Instagram** in the left sidebar
3. Click **Connect Account**
4. Login with your Instagram Business credentials
5. Authorize the connection

### Step 4: Create a Facebook App

1. Go to https://developers.facebook.com/
2. Click **My Apps** → **Create App**
3. Choose **Use case**: Select **Other**
4. Choose **App Type**: Select **Business**
5. Fill in:
   - App Name: "AI Content Platform" (or your choice)
   - App Contact Email: your email
6. Click **Create App**

### Step 5: Add Instagram Graph API

1. In your app dashboard, find **Add Products**
2. Click **Set Up** on **Instagram Graph API**
3. This will add Instagram API permissions to your app

### Step 6: Get Your Access Token

#### 6a. Add Test User (Optional for Testing)

1. Go to **Roles** → **Test Users**
2. Add yourself as a test user

#### 6b. Generate Access Token

1. Go to **Tools** → **Graph API Explorer**
2. Select your app from dropdown
3. Click **Generate Access Token**
4. Select permissions:
   - ✅ `instagram_basic`
   - ✅ `instagram_content_publish`
   - ✅ `pages_read_engagement`
   - ✅ `pages_show_list`
5. Click **Generate Token**
6. **COPY THIS TOKEN** - This is your short-lived token

### Step 7: Exchange for Long-Lived Token

Short-lived tokens expire in 1 hour. Get a long-lived one (60 days):

```bash
# Replace with your values:
# - YOUR_APP_ID: From app dashboard
# - YOUR_APP_SECRET: From Settings → Basic → App Secret
# - SHORT_LIVED_TOKEN: Token from step 6

https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN
```

Visit this URL in your browser and copy the `access_token` from the response.

### Step 8: Get Your Instagram Account ID

```bash
# Replace YOUR_LONG_LIVED_TOKEN with token from step 7

https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_LONG_LIVED_TOKEN
```

This returns your Facebook Pages. Find your page and note the `id`.

Then get Instagram Business Account ID:

```bash
# Replace YOUR_PAGE_ID and YOUR_LONG_LIVED_TOKEN

https://graph.facebook.com/v18.0/YOUR_PAGE_ID?fields=instagram_business_account&access_token=YOUR_LONG_LIVED_TOKEN
```

Copy the `instagram_business_account.id` - this is your **INSTAGRAM_ACCOUNT_ID**.

### Step 9: Add to Your .env File

Update your `backend/.env`:

```env
INSTAGRAM_ACCESS_TOKEN=your-long-lived-token-here
INSTAGRAM_ACCOUNT_ID=your-instagram-account-id-here
```

### Step 10: Restart Your Server

```bash
# In backend directory
npm run dev
```

---

## ✅ Verify Setup

Test your configuration:

```bash
curl "https://graph.facebook.com/v18.0/YOUR_INSTAGRAM_ACCOUNT_ID?fields=id,username,name&access_token=YOUR_ACCESS_TOKEN"
```

You should see your Instagram account details!

---

## 🔄 Token Refresh (Every 60 Days)

Long-lived tokens expire after 60 days. Set a reminder to refresh:

**Option 1: Manual Refresh**

- Repeat Step 7 every 60 days

**Option 2: Never-Expiring Token** (Recommended for Production)

1. Apply for **Instagram Graph API** advanced access
2. Go to app settings → **Advanced** → API Business Access
3. After approval, exchange for never-expiring page access token

---

## 🚨 Troubleshooting

### Error: "Invalid OAuth access token"

- Token expired → Generate new long-lived token (Step 7)
- Wrong token → Double-check you copied correctly

### Error: "Instagram account not found"

- Wrong Account ID → Verify with Step 8
- Account not Business → Convert to Business (Step 1)
- Not connected to Page → Connect in Step 3

### Error: "Permissions error"

- Missing permissions → Re-generate token with all permissions (Step 6)
- App not approved → For testing, no approval needed. For production, submit for review

### Error: "Cannot access image URL"

- Image not publicly accessible → Ensure `PUBLIC_URL` is correct
- Local development → Use ngrok or similar to expose localhost

---

## 💡 Local Development Tips

Instagram API needs to access your images. For local development:

**Option 1: Use ngrok (Easiest)**

```bash
# Install ngrok
npm install -g ngrok

# Expose your backend
ngrok http 5000

# Copy the https URL (e.g., https://abc123.ngrok.io)
# Update .env:
PUBLIC_URL=https://abc123.ngrok.io
```

**Option 2: Deploy backend to free hosting**

- Heroku free tier
- Render.com free tier
- Railway.app free tier

---

## 📊 API Limits (Free Tier)

- ✅ **Unlimited posts**
- ✅ **No monthly costs**
- ✅ **200 API calls/hour** (plenty for this app)
- ✅ **No credit card required**

---

## 🎯 What This Gives You

✅ Direct Instagram posting (no middleman)  
✅ Completely FREE forever  
✅ Full control over your data  
✅ No third-party dependencies  
✅ Better reliability  
✅ Access to Instagram analytics

---

## 📚 Official Documentation

- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api/)
- [Content Publishing](https://developers.facebook.com/docs/instagram-api/guides/content-publishing)
- [Access Tokens](https://developers.facebook.com/docs/facebook-login/guides/access-tokens)

---

## 🎉 You're Done!

Your platform can now post to Instagram for FREE! 🚀

Test it by:

1. Generating content in the app
2. Clicking "Publish Now"
3. Check your Instagram account!

---

**Questions? Issues?** Check the troubleshooting section above or refer to the official Instagram Graph API documentation.
