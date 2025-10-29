/**
 * Authentication Hook
 * Manages user authentication state and provides auth methods
 */

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
    GOOGLE_CONFIG,
    onAuthChange,
    signInWithGoogleCredential,
    signOut,
    UserProfile,
    userToProfile,
} from '../services/auth.service';

// Complete the auth session (required for Expo)
WebBrowser.maybeCompleteAuthSession();

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Google Auth Request
  // For Expo Go, we only need the webClientId
  // iOS and Android IDs are optional and only needed for standalone builds
  const [, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_CONFIG.webClientId,
    iosClientId: GOOGLE_CONFIG.iosClientId || GOOGLE_CONFIG.webClientId,
    androidClientId: GOOGLE_CONFIG.androidClientId || GOOGLE_CONFIG.webClientId,
  });

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((user: User | null) => {
      setAuthState({
        user: user ? userToProfile(user) : null,
        loading: false,
        error: null,
      });
    });

    return () => unsubscribe();
  }, []);

  // Handle Google Sign-In response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token, access_token } = response.params;
      
      signInWithGoogleCredential(id_token, access_token)
        .then((userProfile) => {
          setAuthState({
            user: userProfile,
            loading: false,
            error: null,
          });
        })
        .catch((error) => {
          console.error('Google sign-in error:', error);
          setAuthState({
            user: null,
            loading: false,
            error: error.message || 'Failed to sign in with Google',
          });
        });
    } else if (response?.type === 'error') {
      setAuthState({
        user: null,
        loading: false,
        error: 'Google sign-in was cancelled or failed',
      });
    }
  }, [response]);

  const signInWithGoogle = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await promptAsync();
    } catch (error) {
      console.error('Error initiating Google sign-in:', error);
      setAuthState({
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to start Google sign-in',
      });
    }
  };

  const handleSignOut = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await signOut();
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to sign out',
      }));
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signInWithGoogle,
    signOut: handleSignOut,
    isAuthenticated: !!authState.user,
  };
}
