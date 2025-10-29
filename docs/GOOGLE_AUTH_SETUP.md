# Google Authentication Setup Guide

This guide walks you through setting up Google Sign-In for your Pothole Map app.

## Prerequisites

- Firebase project already created (you have this!)
- Firebase Auth enabled in your project
- Expo development environment set up

## Step 1: Enable Google Sign-In in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **pothole-maped**
3. Click on **Authentication** in the left sidebar
4. Click on the **Sign-in method** tab
5. Find **Google** in the list of providers
6. Click on **Google** to expand it
7. Click the **Enable** toggle
8. Enter your **Project support email** (your Gmail address)
9. Click **Save**

## Step 2: Get OAuth Client IDs

### Web Client ID (Required)

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click on the **Web app** (or create one if it doesn't exist)
4. You'll see a **Web client ID** in the configuration
5. Copy this ID (looks like: `909707656879-xxxxxxxxxxxxx.apps.googleusercontent.com`)

### Android Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** > **Credentials**
4. Find the **Android client** (auto-created by Firebase)
5. Copy the **Client ID**

### iOS Client ID

1. In the same **Credentials** page in Google Cloud Console
2. Find the **iOS client** (auto-created by Firebase)
3. Copy the **Client ID**

## Step 3: Update Configuration Files

### Update `services/auth.service.ts`

Replace the placeholder IDs in `GOOGLE_CONFIG`:

```typescript
export const GOOGLE_CONFIG = {
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
};
```

### Update `app.json`

Add the following configuration to your `app.json`:

```json
{
  "expo": {
    "name": "pothole-map",
    "slug": "pothole-map",
    // ... other config ...
    "android": {
      "package": "com.yourcompany.potholemap",
      "googleServicesFile": "./google-services.json",
      "config": {
        "googleSignIn": {
          "apiKey": "YOUR_ANDROID_API_KEY",
          "certificateHash": "YOUR_SHA1_FINGERPRINT"
        }
      }
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.potholemap",
      "googleServicesFile": "./GoogleService-Info.plist",
      "config": {
        "googleSignIn": {
          "reservedClientId": "YOUR_IOS_CLIENT_ID"
        }
      }
    }
  }
}
```

## Step 4: Configure OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **OAuth consent screen**
4. Choose **External** user type (unless you have Google Workspace)
5. Fill in the required information:
   - **App name**: Pothole Map
   - **User support email**: Your email
   - **Developer contact information**: Your email
6. Add scopes (at minimum):
   - `openid`
   - `email`
   - `profile`
7. Add test users (your email addresses) for testing
8. Click **Save and Continue**

## Step 5: Test Authentication

1. Start your development server:
   ```bash
   npm start
   ```

2. Open the app in Expo Go or a simulator

3. You should see the login screen with a "Sign in with Google" button

4. Click the button and complete the Google Sign-In flow

5. After successful sign-in, you should see the home screen with your profile

## Troubleshooting

### "Developer Error" or "Sign-in Failed"

- Double-check that all Client IDs are correctly configured
- Verify that Google Sign-In is enabled in Firebase Console
- Make sure OAuth consent screen is properly configured
- Check that you're using the correct SHA-1 fingerprint for Android (if testing on device)

### "Access Denied" Error

- Make sure your email is added as a test user in OAuth consent screen
- Verify that the necessary scopes are enabled

### Authentication Not Working in Expo Go

For production builds or when Expo Go doesn't work:

1. Create a development build:
   ```bash
   npx expo prebuild
   npx expo run:android
   # or
   npx expo run:ios
   ```

2. This allows native modules like Google Sign-In to work properly

### Getting SHA-1 Fingerprint (Android)

For debug builds:
```bash
cd android
./gradlew signingReport
```

Look for the SHA-1 fingerprint under `Task :app:signingReport > Variant: debug`

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Expo Auth Session Documentation](https://docs.expo.dev/guides/authentication/)
- [Google Sign-In for Android](https://developers.google.com/identity/sign-in/android/start)
- [Google Sign-In for iOS](https://developers.google.com/identity/sign-in/ios/start)

## Security Notes

⚠️ **Important Security Reminders:**

1. **Never commit OAuth credentials** to version control
2. Use environment variables for sensitive configuration
3. Enable **Firebase App Check** for production to prevent unauthorized access
4. Review and update **Firebase Security Rules** before going to production
5. Set up proper **rate limiting** to prevent abuse

## Next Steps

After setting up authentication:

1. Test the sign-in flow thoroughly
2. Implement user profile management
3. Set up Firebase Security Rules to protect user data
4. Add sign-out functionality (already implemented)
5. Consider adding additional sign-in methods (Email/Password, Apple, etc.)
