/**
 * Authentication Service
 * Handles user authentication with Firebase Auth
 * Supports Google Sign-In via expo-auth-session
 */

import * as WebBrowser from 'expo-web-browser';
import {
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    User
} from 'firebase/auth';
import { auth } from '../config/firebase.config';

// Complete the auth session (required for Expo)
WebBrowser.maybeCompleteAuthSession();

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

/**
 * Configuration for Google Sign-In
 * 
 * IMPORTANT: For Expo Go and web-based testing, you only need the Web Client ID!
 * 
 * How to get your Web Client ID:
 * 1. Go to Firebase Console > Project Settings > General
 * 2. Scroll down to "Your apps" section
 * 3. Click on the Web app (or create one if it doesn't exist)
 * 4. Copy the "Web Client ID" from the Firebase SDK snippet
 * 
 * Note: iOS and Android Client IDs are only needed for standalone builds.
 * For now, just use the Web Client ID for all platforms (it will work in Expo Go).
 */
export const GOOGLE_CONFIG = {
  // Your Web Client ID from Firebase Console
  webClientId: '909707656879-h4o9gvfkacsdsclp41s1dkhd6m2ql5lt.apps.googleusercontent.com',
  
  // Optional: Only needed for standalone iOS/Android builds
  // For Expo Go testing, these can be undefined or same as webClientId
  iosClientId: undefined,
  androidClientId: undefined,
};

/**
 * Sign in with Google
 * This function should be called from a React component that uses useAuthRequest hook
 * Returns the ID token that can be used to authenticate with Firebase
 */
export async function signInWithGoogleCredential(idToken: string, accessToken?: string): Promise<UserProfile> {
  try {
    const credential = GoogleAuthProvider.credential(idToken, accessToken);
    const userCredential = await signInWithCredential(auth, credential);
    
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
    };
  } catch (error) {
    console.error('Error signing in with Google credential:', error);
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * Convert Firebase User to UserProfile
 */
export function userToProfile(user: User): UserProfile {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}
