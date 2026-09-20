import type { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebaseEnabled, getFirebase } from "../lib/firebase";

interface AdminAuthState {
  loading: boolean;
  user: User | null;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

export function useAdminAuth(): AdminAuthState {
  // Only actually "loading" if there's an async auth check to wait
  // for -- when Firebase isn't configured there's nothing to resolve.
  const [loading, setLoading] = useState(firebaseEnabled);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseEnabled) return;
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    getFirebase().then(async (fb) => {
      if (!fb || cancelled) return;
      const { onAuthStateChanged } = await import("firebase/auth");
      if (cancelled) return;
      unsubscribe = onAuthStateChanged(fb.auth, (u) => {
        setUser(u);
        setLoading(false);
      });
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  async function signIn(email: string, password: string) {
    setError(null);
    const fb = await getFirebase();
    if (!fb) {
      setError("This site isn't connected to Firebase yet.");
      return;
    }
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    try {
      await signInWithEmailAndPassword(fb.auth, email, password);
    } catch {
      setError("Wrong email or password.");
    }
  }

  async function signOutUser() {
    const fb = await getFirebase();
    if (!fb) return;
    const { signOut } = await import("firebase/auth");
    await signOut(fb.auth);
  }

  return { loading, user, error, signIn, signOutUser };
}
