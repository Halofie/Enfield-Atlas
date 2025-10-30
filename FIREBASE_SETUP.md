# Firebase Setup for Journey Feed 🔥

## Current Status
✅ Firebase project configured: `pothole-maped`
✅ Firestore initialized in your code
⚠️ **Need to configure Firestore database rules**

## Required Firebase Console Setup

### 1. Enable Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **pothole-maped**
3. In the left sidebar, click **"Firestore Database"**
4. If not already enabled, click **"Create database"**
5. Choose:
   - **Start mode**: Production mode (we'll add rules next)
   - **Location**: Choose closest to your users (e.g., asia-south1 for India)
6. Click **"Enable"**

### 2. Configure Firestore Security Rules

#### For Development (Testing) - RECOMMENDED TO START
Go to **Firestore Database > Rules** tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Journey Posts Collection
    match /journeyPosts/{postId} {
      // Anyone can read posts
      allow read: if true;
      
      // Anyone can create posts (temporary - until auth is re-enabled)
      allow create: if true;
      
      // Anyone can update posts (for likes/comments)
      allow update: if true;
      
      // Only allow deletion (can restrict later)
      allow delete: if true;
    }
  }
}
```

**⚠️ WARNING**: These rules allow anyone to read/write. This is fine for development but NOT for production!

Click **"Publish"** to save the rules.

#### For Production (When Auth is Re-enabled)
When you re-enable Firebase Authentication, update rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Journey Posts Collection
    match /journeyPosts/{postId} {
      // Anyone can read posts
      allow read: if true;
      
      // Only authenticated users can create posts
      allow create: if request.auth != null;
      
      // Only post owner can update/delete their posts
      // Or anyone can update likes/comments count
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.userId ||
        request.resource.data.diff(resource.data).affectedKeys()
          .hasOnly(['likes', 'comments'])
      );
      
      // Only post owner can delete
      allow delete: if request.auth != null && 
                      request.auth.uid == resource.data.userId;
    }
  }
}
```

### 3. Create Firestore Indexes (Optional - for better performance)

If you get errors about missing indexes when querying, go to:
**Firestore Database > Indexes** tab

You may need to create a composite index for:
- Collection: `journeyPosts`
- Fields: `timestamp` (Descending)

Firebase will usually show you a link in the console error if an index is needed.

---

## Quick Start Commands

### Test Firebase Connection
Add this temporarily to your `app/(tabs)/index.tsx` to verify Firebase works:

```typescript
// Inside useEffect
useEffect(() => {
  console.log('Firebase DB initialized:', db ? 'SUCCESS' : 'FAILED');
  loadPosts();
}, []);
```

### Monitor Firestore in Real-time
1. Go to Firebase Console
2. Click **Firestore Database**
3. Click **Data** tab
4. Watch as posts appear in the `journeyPosts` collection when you create them!

---

## What Happens When You Create a Post

1. User taps "+" button and fills form
2. `createJourneyPost()` is called in `services/journey.service.ts`
3. Data is saved to Firestore collection: `journeyPosts`
4. Document structure:
```
journeyPosts/
  └── {auto-generated-id}/
      ├── userId: "demo-user"
      ├── userName: "Demo User"
      ├── routeName: "Morning Commute"
      ├── startLocation: "Home"
      ├── endLocation: "Office"
      ├── rating: 4
      ├── review: "Great route!"
      ├── distance: "15 km"
      ├── duration: "30 min"
      ├── tags: []
      ├── timestamp: Timestamp
      ├── likes: 0
      └── comments: 0
```

---

## Troubleshooting

### Error: "Missing or insufficient permissions"
**Solution**: Update Firestore security rules (see step 2 above)

### Error: "The query requires an index"
**Solution**: Firebase Console will show a link to create the index automatically. Click it!

### Posts not showing up
1. Check Firebase Console > Firestore Database > Data tab
2. Look for `journeyPosts` collection
3. Verify documents exist
4. Check browser console for errors

### App crashes when creating post
1. Verify Firestore is enabled in Firebase Console
2. Check security rules allow writes
3. Look at terminal/console for error messages

---

## Cost Considerations (Free Tier Limits)

Firebase Spark Plan (Free) includes:
- ✅ **Stored data**: 1 GB
- ✅ **Document reads**: 50,000/day
- ✅ **Document writes**: 20,000/day
- ✅ **Document deletes**: 20,000/day

Your journey feed should stay well within these limits for development and even moderate production use!

---

## Summary

**You DON'T need to edit any code** - your Firebase config is already set up! ✅

**You DO need to**:
1. ✅ Enable Firestore in Firebase Console (if not already)
2. ✅ Set up security rules (copy/paste the rules above)
3. ✅ Test by creating a post in your app
4. ✅ Watch posts appear in Firebase Console

That's it! Your journey feed will work after these 3 steps in the Firebase Console.

---

**Next Steps After Setup**:
1. Create a test post from your app
2. Verify it appears in Firebase Console
3. Test liking and commenting
4. Consider re-enabling authentication for user-specific posts
