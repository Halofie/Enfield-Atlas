/**
 * Firebase Configuration
 * 
 * IMPORTANT: This file contains placeholder values.
 * You need to:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (or use existing)
 * 3. Add a web app to your project
 * 4. Copy the firebaseConfig object from Firebase Console
 * 5. Replace the values below with your actual config
 * 
 * For production, use environment variables instead of hardcoding:
 * - Create a .env file (add it to .gitignore!)
 * - Use expo-constants to access env variables
 */

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'; // Uncomment when you need authentication

// TODO: Replace with your Firebase project configuration
// Get this from: Firebase Console > Project Settings > Your apps > Web app
const firebaseConfig = {
  apiKey: "AIzaSyDNBvt7rHAvoQWDQLEGuULVsRqIVqlp45Y",
  authDomain: "pothole-maped.firebaseapp.com",
  projectId: "pothole-maped",
  storageBucket: "pothole-maped.firebasestorage.app",
  messagingSenderId: "909707656879",
  appId: "1:909707656879:web:17972c2ca86b1a3f911e5a",
  measurementId: "G-3NVK5496J2"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
export const db = getFirestore(app);
// export const auth = getAuth(app); // Uncomment when you enable Authentication in Firebase Console

export default app;
