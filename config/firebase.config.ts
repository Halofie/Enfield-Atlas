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

// Auth is temporarily disabled due to React Native persistence issues
// We'll add it back with proper configuration
export const auth = null as any;

export default app;
