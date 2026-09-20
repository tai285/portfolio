import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

// These values come from your Firebase project's web app config and
// are safe to be public -- Firebase enforces access via the Firestore
// security rules, not by hiding this object. Set them in .env.local
// for local dev (gitignored) and as repository secrets for the deploy
// workflow (see .github/workflows/deploy.yml).
//
// No Cloud Storage here on purpose: as of late 2024, Firebase requires
// the paid Blaze plan to use Storage. Uploaded photos are instead
// compressed client-side and stored directly as Firestore documents
// (see utils/compressImage.ts + hooks/useAdminPhotos.ts) -- works
// entirely on the free Spark plan.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

interface FirebaseServices {
  auth: Auth;
  db: Firestore;
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
      const [{ initializeApp }, { getAuth }, { getFirestore }] = await Promise.all([
        import("firebase/app"),
        import("firebase/auth"),
        import("firebase/firestore"),
      ]);
      const app = initializeApp(firebaseConfig);
      return {
        auth: getAuth(app),
        db: getFirestore(app),
      };
    })();
  }
  return servicesPromise;
}
