import AsyncStorage from '@react-native-async-storage/async-storage';
// NOTE: `firebase/auth`'s own package.json export map has no "react-native"
// condition, so it always resolves to the browser build (missing
// getReactNativePersistence) even on native. `@firebase/auth` — the
// underlying package `firebase` wraps — does declare that condition, so we
// import from it directly here. This file is native-only (see
// firebase.web.ts), so there's no cross-platform ambiguity in doing that.
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from '@firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/**
 * True once `.env` has real project values (see .env.example). Without this
 * guard, initializeAuth/getAuth throw synchronously on an empty apiKey,
 * which crashes this module's evaluation — and with it every screen that
 * imports it — at app startup, not just at sign-in time.
 */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  try {
    auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch {
    // initializeAuth throws "auth/already-initialized" if this module is re-evaluated
    // for an app instance that already has an Auth instance (e.g. Fast Refresh) — reuse it.
    auth = getAuth(app);
  }
  db = getFirestore(app);
}

export { auth, db };
