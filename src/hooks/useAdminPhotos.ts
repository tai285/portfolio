import { useEffect, useState } from "react";
import { getFirebase } from "../lib/firebase";
import type { Photo } from "../types/content";

interface UseAdminPhotos {
  entries: Photo[];
  setEntries: (entries: Photo[]) => void;
  loading: boolean;
  saving: boolean;
  saved: boolean;
  error: string | null;
  save: () => Promise<void>;
}

/**
 * Loads content/photos/items once, then diffs local edits against the
 * original set on save: updates changed/existing docs, creates new
 * ones (temp client-side ids), deletes removed ones, and writes each
 * entry's `order` from its current array position -- all in one
 * Firestore batch.
 */
export function useAdminPhotos(fallback: Photo[]): UseAdminPhotos {
  const [entries, setEntries] = useState<Photo[]>(fallback);
  const [originalIds, setOriginalIds] = useState<Set<string>>(new Set());
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
      const { collection, getDocs, orderBy, query } = await import("firebase/firestore");
      const snap = await getDocs(
        query(collection(fb.db, "content", "photos", "items"), orderBy("order")),
      );
      if (cancelled) return;
      if (!snap.empty) {
        const loaded = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Photo, "id">) }));
        setEntries(loaded);
        setOriginalIds(new Set(loaded.map((p) => p.id)));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const fb = await getFirebase();
      if (!fb) throw new Error("Firebase isn't configured.");
      const { collection, doc, writeBatch } = await import("firebase/firestore");
      const itemsRef = collection(fb.db, "content", "photos", "items");
      const batch = writeBatch(fb.db);

      const currentIds = new Set<string>();
      const savedEntries: Photo[] = entries.map((photo, order) => {
        const isTemp = photo.id.startsWith("new-");
        const ref = isTemp ? doc(itemsRef) : doc(itemsRef, photo.id);
        currentIds.add(ref.id);
        const { id: _id, ...data } = photo;
        batch.set(ref, { ...data, order });
        return { ...photo, id: ref.id };
      });

      for (const id of originalIds) {
        if (!currentIds.has(id)) batch.delete(doc(itemsRef, id));
      }

      await batch.commit();
      setSaved(true);
      setEntries(savedEntries);
      setOriginalIds(currentIds);
    } catch {
      setError("Couldn't save -- check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return { entries, setEntries, loading, saving, saved, error, save };
}
