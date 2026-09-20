import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";

// These values come from your Firebase project's web app config and
// are safe to be public -- Firebase enforces access via Firestore/
// Storage security rules, not by hiding this object. Set them in
// .env.local for local dev (gitignored) and as repository secrets for
// the deploy workflow (see .github/workflows/deploy.yml).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

interface FirebaseServices {
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
}

let servicesPromise: Promise<FirebaseServices | null> | null = null;

/**
 * Lazily loads and initializes the Firebase SDK on first use, code-split
 * into its own chunk (see the dynamic imports) so a visitor who never
 * touches the CMS or guestbook never downloads it -- the main site
 * renders instantly from static fallback data regardless, and upgrades
 * to live content once this resolves in the background.
 */
export function getFirebase(): Promise<FirebaseServices | null> {
  if (!firebaseEnabled) return Promise.resolve(null);
  if (!servicesPromise) {
    servicesPromise = (async () => {
      const [{ initializeApp }, { getAuth }, { getFirestore }, { getStorage }] =
        await Promise.all([
          import("firebase/app"),
          import("firebase/auth"),
          import("firebase/firestore"),
          import("firebase/storage"),
        ]);
      const app = initializeApp(firebaseConfig);
      return {
        auth: getAuth(app),
        db: getFirestore(app),
        storage: getStorage(app),
      };
    })();
  }
  return servicesPromise;
}
