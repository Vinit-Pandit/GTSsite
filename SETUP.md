# Setup Guide for GTS Next Project

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Firebase Configuration

### Step 1: Get Firebase Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (gtsdatabase-49060)
3. Click **Project Settings** ⚙️ (top right)
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. A JSON file will be downloaded

### Step 2: Create .env.local File

In the project root directory, create a `.env.local` file with your Firebase credentials:

```
FIREBASE_PROJECT_ID=gtsdatabase-49060
FIREBASE_CLIENT_EMAIL=your_service_account_email@gtsdatabase-49060.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_private_key_content_here\n-----END PRIVATE KEY-----\n"
```

**Important**: 
- Copy the values from your downloaded service account JSON file
- The `private_key` field must have escaped newlines (`\n` instead of actual line breaks)
- Keep this file secret and never commit it to version control

### Step 3: Extract Private Key Correctly

If your service account JSON has:
```json
{
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBA...\n-----END PRIVATE KEY-----\n"
}
```

Use it as-is in `.env.local`:
```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBA...\n-----END PRIVATE KEY-----\n"
```

## Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# The app will be available at http://localhost:3000
```

## Troubleshooting

### Error: "Failed to parse private key: Error: Too few bytes to read ASN.1 value"

This means the private key is not properly formatted. Check:
1. The private key value in `.env.local` is wrapped in quotes
2. Newlines are escaped as `\n` (not actual line breaks)
3. The private key starts with `-----BEGIN PRIVATE KEY-----`
4. No extra spaces or characters outside the key

### Error: "Missing Firebase Admin environment variables"

Make sure all three environment variables are set in `.env.local`:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

## Files Modified

- `src/middleware.ts` - Improved Firebase Admin initialization with better error handling
- `src/lib/firebaseAdmin.ts` - Added private key validation and better error messages
- `.env.local.example` - Created as reference for environment variable setup
