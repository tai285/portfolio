import { useEffect, useState } from "react";
import { firebaseEnabled, getFirebase } from "../lib/firebase";
import type { Photo } from "../types/content";

interface PhotosContentResult {
  categories: string[];
  entries: Photo[];
}

/**
 * Live-syncs categories (content/photos doc) and photo entries
 * (content/photos/items subcollection, ordered by `order`) separately.
 * Photos get their own subcollection -- not one shared array field --
 * specifically so a base64-embedded photo only has to fit under its
 * own document's 1MiB Firestore cap, not share that budget with every
 * other photo in the album.
 */
export function usePhotosContent(
  fallbackCategories: string[],
  fallbackEntries: Photo[],
): PhotosContentResult {
  const [categories, setCategories] = useState(fallbackCategories);
  const [entries, setEntries] = useState(fallbackEntries);

  useEffect(() => {
    if (!firebaseEnabled) return;
    let cancelled = false;
    let unsubCategories: (() => void) | undefined;
    let unsubEntries: (() => void) | undefined;

    getFirebase().then(async (fb) => {
      if (!fb || cancelled) return;
      const { doc, onSnapshot, collection, query, orderBy } = await import(
        "firebase/firestore"
      );
      if (cancelled) return;

      unsubCategories = onSnapshot(
        doc(fb.db, "content", "photos"),
        (snap) => {
          setCategories(snap.exists() ? snap.data().categories : fallbackCategories);
        },
        () => setCategories(fallbackCategories),
      );

      unsubEntries = onSnapshot(
        query(collection(fb.db, "content", "photos", "items"), orderBy("order")),
        (snap) => {
          if (snap.empty) {
            setEntries(fallbackEntries);
            return;
          }
          setEntries(
            snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Photo, "id">) })),
          );
        },
        () => setEntries(fallbackEntries),
      );
    });

    return () => {
      cancelled = true;
      unsubCategories?.();
      unsubEntries?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { categories, entries };
}
