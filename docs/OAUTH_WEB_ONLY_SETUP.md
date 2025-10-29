# Quick Start: Google Sign-In with Just OAuth 2.0 Web Client ID

## ✅ Good News!

You **only need the OAuth 2.0 Web Client ID** to get started with Google Sign-In in Expo Go. The iOS and Android client IDs are only required when you build standalone apps.

## 🎯 What You Already Have

Looking at your `services/auth.service.ts`, you already have:
```
webClientId: '909707656879-h4o9gvfkacsdsclp41s1dkhd6m2ql5lt.apps.googleusercontent.com'
```

✅ **This is all you need for testing in Expo Go!**

## 🚀 Quick Setup (3 Steps)

### Step 1: Enable Google Sign-In in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **pothole-maped**
3. Click **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Toggle **Enable**
6. Enter your support email
7. Click **Save**

### Step 2: Configure OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Choose **External** user type
5. Fill in:
   - **App name**: Pothole Map
   - **User support email**: Your email
   - **Developer contact**: Your email
6. Click **Save and Continue**
7. **Add test users**: Add your Gmail address(es) that you'll use for testing
8. Click **Save and Continue**

### Step 3: Test It!

```bash
npm start
```

Then:
1. Open the app in Expo Go
2. You should see the login screen
3. Click "Sign in with Google"
4. Sign in with a Google account (must be added as test user)
5. You should see the home screen! 🎉

## 📱 Platform Support

### ✅ Works Right Now (with just Web Client ID):
- **Expo Go** (iOS and Android)
- **Web browser**
- **Development builds**

### 🔧 Need Extra Setup Later (for production):
- **Standalone iOS app** - Need iOS Client ID
- **Standalone Android app** - Need Android Client ID

## 🐛 Common Issues & Solutions

### Issue: "Sign-in failed" or "Invalid client"

**Solution:**
1. Make sure Google Sign-In is **enabled** in Firebase Console
2. Verify your Web Client ID is correct (no extra `.apps.googleusercontent.com` at the end)
3. Check that OAuth consent screen is configured

### Issue: "Access denied" or "403 error"

**Solution:**
1. Go to Google Cloud Console → OAuth consent screen
2. Add your email as a **test user**
3. Try signing in again

### Issue: Redirect not working

**Solution:**
Make sure you're using the **Web Client ID** from Firebase, not the Android/iOS one.

## 🎓 Understanding the Client IDs

### Web Client ID (OAuth 2.0)
- This is what you have: `909707656879-h4o9gvfkacsdsclp41s1dkhd6m2ql5lt.apps.googleusercontent.com`
- Used for: Web apps, Expo Go, development builds
- **Perfect for testing!**

### Android Client ID
- Only needed for: Production Android APK/AAB
- Auto-created when you add Android app in Firebase
- Not needed for Expo Go

### iOS Client ID  
- Only needed for: Production iOS IPA
- Auto-created when you add iOS app in Firebase
- Not needed for Expo Go

## 📝 Current Configuration

Your `auth.service.ts` is now configured like this:

```typescript
export const GOOGLE_CONFIG = {
  webClientId: '909707656879-h4o9gvfkacsdsclp41s1dkhd6m2ql5lt.apps.googleusercontent.com',
  iosClientId: undefined,      // Not needed for Expo Go
  androidClientId: undefined,  // Not needed for Expo Go
};
```

The hook automatically falls back to using `webClientId` for all platforms, so everything will work in Expo Go!

## ✨ Summary

**You're all set!** Just:
1. ✅ Enable Google Sign-In in Firebase Console
2. ✅ Configure OAuth consent screen with test users
3. ✅ Run `npm start` and test in Expo Go

Your Web Client ID is already configured, so Google Sign-In should work immediately after enabling it in Firebase! 🚀

## 🔮 Future: When You Need iOS/Android IDs

When you're ready to build standalone apps:

1. **For Android:**
   - Get SHA-1 fingerprint: `./gradlew signingReport`
   - Add to Firebase project settings
   - Copy Android Client ID from Google Cloud Console

2. **For iOS:**
   - Add iOS app in Firebase Console
   - Download GoogleService-Info.plist
   - Copy iOS Client ID from Google Cloud Console

But for now, **just use the Web Client ID** and you're good to go! 🎉
