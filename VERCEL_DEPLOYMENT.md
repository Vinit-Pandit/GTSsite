# Vercel Deployment Guide

## How It Works

The code automatically detects the environment:
- **Local**: Uses the JSON file (in `.gitignore`, not committed)
- **Vercel**: Uses environment variables (set in Vercel dashboard)

## Step 1: Prepare Your Code

✅ The JSON file is in `.gitignore` and won't be committed
✅ The code detects `VERCEL=1` and uses environment variables automatically

## Step 2: Set Up Environment Variables in Vercel

### For the Vercel Production Environment:

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add these three variables:

```
FIREBASE_PROJECT_ID = gtsdatabase-49060

FIREBASE_CLIENT_EMAIL = firebase-adminsdk-fbsvc@gtsdatabase-49060.iam.gserviceaccount.com

FIREBASE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCjwZdEFpHwhVzC\naNifG1bs7Z8skUsGVUJW88Jz8edDnfny6AtYqm/3p/8VMoMKvw4i7Wt1169nJi5c\n... (full key with \n) ...\n-----END PRIVATE KEY-----\n
```

### How to Get the Private Key in the Correct Format:

**Method 1: From the JSON file**
1. Open `src/lib/firebaseAdmin/gtsdatabase-49060-firebase-adminsdk-fbsvc-1af5aea24b.json`
2. Copy the entire value from the `"private_key"` field (it already has `\n` in it)
3. Paste it directly into Vercel's `FIREBASE_PRIVATE_KEY` field

Example:
```
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSi...\n-----END PRIVATE KEY-----\n"
```

Just copy from `-----BEGIN` to `-----END PRIVATE KEY-----\n` (including the `\n` sequences)

## Step 3: Set Environment Scope

When adding each environment variable, set the scope to:
- ✅ **Production** (required)
- Optionally Preview and Development if needed

## Step 4: Deploy

```bash
# Push to your GitHub repo
git add .
git commit -m "Ready for Vercel deployment"
git push origin master
```

Vercel will automatically detect the push and start a new deployment.

## Step 5: Verify

After deployment completes:
1. Check the deployment logs at Vercel dashboard
2. Look for: `✓ Firebase Admin SDK using environment variables (Vercel)`
3. If you see that message, Firebase is initialized correctly!

## Local Development

For local development:
- ✅ No environment variables needed
- ✅ Uses the JSON file automatically
- ✅ Should see: `✓ Firebase Admin SDK using local JSON file`

```bash
npm run dev
```

## Troubleshooting

### Firebase fails on Vercel
- ✅ Check all 3 env vars are set in Vercel dashboard
- ✅ Verify they're set to "Production" environment
- ✅ Check that `FIREBASE_PRIVATE_KEY` includes full key from `-----BEGIN` to `-----END PRIVATE KEY-----\n`
- ✅ Look at Vercel deployment logs for detailed error

### JSON file issues locally
- ✅ Make sure file exists: `src/lib/firebaseAdmin/gtsdatabase-49060-firebase-adminsdk-fbsvc-1af5aea24b.json`
- ✅ Check it's NOT in git: `git status` should not show it

### Private key format issues
- ✅ Don't manually add `\n` - copy the value as-is from the JSON file
- ✅ The `\n` sequences should already be in the file
- ✅ Make sure no extra spaces or characters outside the key content

## Security Checklist

✅ JSON file is in `.gitignore`
✅ Private key is stored securely in Vercel (encrypted)
✅ Never commit credentials to git
✅ Environment variables are only visible in Vercel dashboard
✅ Vercel automatically injects them at build/runtime
