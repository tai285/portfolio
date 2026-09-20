import { useEffect, useState } from "react";
import { firebaseEnabled, getFirebase } from "../lib/firebase";

/**
 * Live-syncs a single Firestore doc under content/{key}, falling back to
 * `fallback` (the existing static data) when Firebase isn't configured,
 * the doc doesn't exist yet, or a real-time update hasn't arrived yet.
 *
 * The first render always uses `fallback` -- Firebase loads lazily in
 * the background (see lib/firebase.ts) and this then upgrades to live
 * data once that resolves, so a visitor's first paint never waits on
 * the Firebase SDK.
 */
export function useContent<T>(key: string, fallback: T): T {
  const [data, setData] = useState<T>(fallback);

  useEffect(() => {
    if (!firebaseEnabled) return;
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    getFirebase().then(async (fb) => {
      if (!fb || cancelled) return;
      const { doc, onSnapshot } = await import("firebase/firestore");
      if (cancelled) return;
      unsubscribe = onSnapshot(
        doc(fb.db, "content", key),
        (snap) => {
          setData(snap.exists() ? (snap.data() as T) : fallback);
        },
        () => {
          // Permission error, offline, etc. -- keep showing the
          // fallback rather than an empty/broken section.
          setData(fallback);
        },
      );
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
    // fallback is a stable module-level import at every call site, and
    // re-subscribing on every render would be wasteful.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return data;
}
