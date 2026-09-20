import { useState } from "react";
import { categories as staticCategories, photos as staticPhotos } from "../../data/photos";
import { useAdminContentDoc } from "../../hooks/useAdminContentDoc";
import { getFirebase } from "../../lib/firebase";
import type { Photo, PhotosContent } from "../../types/content";
import { PhotoFrame } from "../../components/album/PhotoFrame";
import { Card, Field, SaveBar, TextInput } from "./fields";
import { ListEditor } from "./ListEditor";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "photo";
}

export function PhotosEditor() {
  const { value, setValue, loading, saving, saved, error, save } =
    useAdminContentDoc<PhotosContent>("photos", {
      categories: [...staticCategories],
      entries: staticPhotos,
    });
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (loading) return <p className="text-sm text-[var(--fg-muted)]">Loading…</p>;

  async function handleUpload(index: number, file: File, category: string) {
    setUploadingIndex(index);
    setUploadError(null);
    try {
      const fb = await getFirebase();
      if (!fb) throw new Error("Firebase not configured");
      const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
      const path = `photos/${slugify(category)}/${Date.now()}-${slugify(file.name)}`;
      const storageRef = ref(fb.storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const entries = [...value.entries];
      entries[index] = { ...entries[index], src: url };
      setValue({ ...value, entries });
    } catch {
      setUploadError("Upload failed -- check your connection and try again.");
    } finally {
      setUploadingIndex(null);
    }
  }

  return (
    <div className="space-y-4 pb-24">
      <Card>
        <Field label="Categories (comma-separated -- these become the filter pills)">
          <TextInput
            value={value.categories.join(", ")}
            onChange={(e) =>
              setValue({
                ...value,
                categories: e.target.value
                  .split(",")
                  .map((c) => c.trim())
                  .filter(Boolean),
              })
            }
          />
        </Field>
      </Card>

      <ListEditor<Photo>
        items={value.entries}
        onChange={(entries) => setValue({ ...value, entries })}
        addLabel="+ Add photo"
        itemLabel={(p, i) => p.caption || p.alt || `Photo ${i + 1}`}
        makeNew={() => ({
          id: `photo-${Date.now()}`,
          src: "",
          alt: "",
          category: value.categories[0] ?? "",
          caption: "",
        })}
        renderItem={(photo, update, i) => (
          <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
            <div>
              <PhotoFrame
                src={photo.src}
                alt={photo.alt}
                className="aspect-square w-full rounded-xl"
                imgClassName="aspect-square w-full rounded-xl object-cover"
              />
              <label className="mt-2 block">
                <span className="sr-only">Upload photo</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingIndex === i}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(i, file, photo.category);
                  }}
                  className="block w-full text-xs"
                />
              </label>
              {uploadingIndex === i && (
                <p className="mt-1 text-xs text-[var(--fg-muted)]">Uploading…</p>
              )}
            </div>
            <div className="space-y-3">
              <Field label="Category">
                <select
                  value={photo.category}
                  onChange={(e) => update({ category: e.target.value })}
                  className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)]"
                >
                  {value.categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Caption">
                <TextInput
                  value={photo.caption ?? ""}
                  onChange={(e) => update({ caption: e.target.value })}
                />
              </Field>
              <Field label="Alt text (for screen readers)">
                <TextInput
                  value={photo.alt}
                  onChange={(e) => update({ alt: e.target.value })}
                />
              </Field>
            </div>
          </div>
        )}
      />

      {uploadError && <p className="text-sm text-error">{uploadError}</p>}
      {error && <p className="text-sm text-error">{error}</p>}
      <SaveBar onSave={save} saving={saving} saved={saved} />
    </div>
  );
}
