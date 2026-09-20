import { useEffect, useState } from "react";
import { getFirebase } from "../lib/firebase";

interface UseAdminContentDoc<T> {
  value: T;
  setValue: (v: T) => void;
  loading: boolean;
  saving: boolean;
  saved: boolean;
  error: string | null;
  save: () => Promise<void>;
}

/**
 * Loads a content/{key} doc once (not live -- the admin is the only
 * writer, and a live listener would fight with in-progress form edits)
 * and provides an explicit save() that overwrites the whole doc.
 */
export function useAdminContentDoc<T>(key: string, fallback: T): UseAdminContentDoc<T> {
  const [value, setValue] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const fb = await getFirebase();
      if (!fb || cancelled) {
        setLoading(false);
        return;
      }
      const { doc, getDoc } = await import("firebase/firestore");
      const snap = await getDoc(doc(fb.db, "content", key));
      if (cancelled) return;
      if (snap.exists()) setValue(snap.data() as T);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  async function save() {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const fb = await getFirebase();
      if (!fb) throw new Error("Firebase isn't configured.");
      const { doc, setDoc } = await import("firebase/firestore");
      await setDoc(doc(fb.db, "content", key), value as object);
      setSaved(true);
    } catch {
      setError("Couldn't save -- check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return { value, setValue, loading, saving, saved, error, save };
}
