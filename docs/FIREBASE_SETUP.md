# Firebase Setup Guide

This guide will help you set up Firebase for the Pothole Map application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter a project name (e.g., "pothole-map")
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

## Step 2: Register Your App

1. In your Firebase project, click the **Web** icon (`</>`) to add a web app
2. Enter an app nickname (e.g., "Pothole Map Web")
3. (Optional) Set up Firebase Hosting - you can skip this for now
4. Click **"Register app"**

## Step 3: Get Your Firebase Configuration

You'll see a `firebaseConfig` object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123",
  measurementId: "G-ABC123" // Optional
};
```

## Step 4: Add Configuration to Your App

### Option A: Direct Configuration (Quick Start)

Open `config/firebase.config.ts` and replace the placeholder values with your actual config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
  // ... etc
};
```

⚠️ **Warning**: This method is fine for development but NOT recommended for production.

### Option B: Environment Variables (Recommended)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase credentials in `.env`

3. Install expo-constants (if not already installed):
   ```bash
   npx expo install expo-constants
   ```

4. Update `config/firebase.config.ts` to use environment variables

5. Add `.env` to your `.gitignore` file

## Step 5: Set Up Firestore Database

1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
   - Test mode allows read/write access for 30 days
   - You'll need to update security rules for production
4. Select a Cloud Firestore location (choose closest to your users)
5. Click **"Enable"**

## Step 6: Configure Firestore Security Rules

For development, you can use test mode rules. For production, update your rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Potholes collection
    match /potholes/{potholeId} {
      // Allow read access to all
      allow read: if true;
      
      // Allow write only to authenticated users (if using auth)
      allow create, update: if request.auth != null;
      
      // Allow delete only to admin users
      allow delete: if request.auth != null 
        && request.auth.token.admin == true;
    }
  }
}
```

## Step 7: (Optional) Set Up Firebase Authentication

If you want users to log in:

1. Go to **"Authentication"** in Firebase Console
2. Click **"Get started"**
3. Enable sign-in methods you want to use:
   - Email/Password
   - Google
   - Anonymous
   - etc.

## Step 8: Add Sample Pothole Data

You can add test data through the Firebase Console:

1. Go to **Firestore Database**
2. Click **"Start collection"**
3. Collection ID: `potholes`
4. Add a document with these fields:
   ```
   latitude: 37.7749 (number)
   longitude: -122.4194 (number)
   severity: "high" (string)
   status: "verified" (string)
   detectedAt: (timestamp - click "Add field" > type: timestamp)
   verified: true (boolean)
   aiConfidence: 0.92 (number)
   description: "Large pothole on main street" (string)
   ```

## Step 9: Test Your Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the app:
   ```bash
   npx expo start
   ```

3. Open the Map tab - you should see your test pothole marker!

## Firestore Data Structure

### Potholes Collection (`potholes`)

Each document represents a pothole with these fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `latitude` | number | Yes | Latitude coordinate |
| `longitude` | number | Yes | Longitude coordinate |
| `severity` | string | Yes | One of: low, medium, high, critical |
| `status` | string | Yes | One of: pending, verified, fixed, false_positive |
| `detectedAt` | timestamp | Yes | When the pothole was detected |
| `verified` | boolean | No | Whether it's been verified by a human |
| `aiConfidence` | number | No | AI detection confidence (0-1) |
| `reportedBy` | string | No | User ID who reported it |
| `imageUrl` | string | No | URL to pothole image |
| `description` | string | No | Additional details |

## Troubleshooting

### "Firebase not initialized" error
- Make sure you've replaced the placeholder values in `firebase.config.ts`
- Ensure Firebase is installed: `npm install firebase`

### "Permission denied" error
- Check your Firestore security rules
- Make sure test mode is enabled (for development)
- Verify you're reading from the correct collection name

### Can't see pothole markers on map
- Check browser/device console for errors
- Verify you have data in the `potholes` collection
- Make sure latitude/longitude values are valid numbers

## Next Steps

- Set up proper security rules for production
- Implement authentication for user-reported potholes
- Set up Firebase Storage for pothole images
- Configure Cloud Functions for AI processing
- Set up Firebase Analytics to track app usage

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Security Rules Guide](https://firebase.google.com/docs/rules)
- [React Native Firebase](https://rnfirebase.io/) (alternative to web SDK)
