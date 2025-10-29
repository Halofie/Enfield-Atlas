# 🚀 Quick Start Guide

Get your Pothole Map app running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd pothole-map
npm install
```

## Step 2: Configure Firebase

### Option A: Quick Test (Skip Firebase for now)

The app will work without Firebase, but pothole markers won't show. You can still test routing!

### Option B: Set up Firebase (Recommended)

1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable **Firestore Database** (start in test mode)
4. Get your web app config
5. Open `config/firebase.config.ts`
6. Replace the placeholder values:

```typescript
const firebaseConfig = {
  apiKey: "AIza...",                    // Your actual values
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123"
};
```

7. Add test pothole data in Firestore:
   - Collection: `potholes`
   - Add document with fields:
     ```
     latitude: 37.7749 (number)
     longitude: -122.4194 (number)
     severity: "high" (string)
     status: "verified" (string)
     detectedAt: [current timestamp]
     verified: true (boolean)
     ```

## Step 3: Run the App

```bash
npx expo start
```

Then choose:
- Press **`a`** for Android emulator
- Press **`i`** for iOS simulator  
- Scan QR code with Expo Go app on your phone

## Step 4: Test Features

1. **Open Map Tab** - See the interactive map
2. **Enter Addresses** - Try "New York City" → "Brooklyn"
3. **Tap Route** - See the blue route line
4. **View Potholes** - If Firebase is set up, see pothole markers

## 🎉 You're Done!

### Next Steps

- Read [`docs/FIREBASE_SETUP.md`](docs/FIREBASE_SETUP.md) for detailed Firebase setup
- Check [`ARCHITECTURE.md`](ARCHITECTURE.md) to understand code structure
- Review [`README.md`](README.md) for full documentation

### Troubleshooting

**Map not showing?**
- Check your internet connection
- Wait a few seconds for tiles to load

**Routing not working?**
- Make sure you entered valid addresses
- Try "San Francisco" → "Los Angeles"

**No pothole markers?**
- Firebase isn't configured yet (that's okay!)
- Follow Step 2 Option B above

**TypeScript errors?**
- Run `npm install` again
- Restart the Expo dev server

## 🆘 Need Help?

Check the full README.md or create an issue on GitHub!
