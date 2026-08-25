/// <reference types="vite/client" />
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';

const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoPlaceholderKey123456789',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'agrodirect-prod.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'agrodirect-prod',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'agrodirect-prod.appspot.com',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef123456',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export async function signInWithGoogleOAuth(): Promise<{
  idToken: string;
  email: string | null;
  uid: string;
  displayName: string | null;
  photoURL: string | null;
}> {
  try {
    const result: UserCredential = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const idToken = await user.getIdToken();

    return {
      idToken,
      email: user.email,
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Google Sign-In was cancelled.');
    }
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Pop-up was blocked by browser. Please allow popups for AgroDirect.');
    }
    throw error;
  }
}
