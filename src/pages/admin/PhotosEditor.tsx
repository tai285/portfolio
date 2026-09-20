import { useState } from "react";
import { PhotoFrame } from "../../components/album/PhotoFrame";
import { categories as staticCategories } from "../../data/photos";
import { useAdminContentDoc } from "../../hooks/useAdminContentDoc";
import { useAdminPhotos } from "../../hooks/useAdminPhotos";
import type { Photo, PhotosCategories } from "../../types/content";
import { compressImageToDataUrl } from "../../utils/compressImage";
import { Card, Field, SaveBar, TextInput } from "./fields";
import { ListEditor } from "./ListEditor";

export function PhotosEditor() {
  const categoriesDoc = useAdminContentDoc<PhotosCategories>("photos", {
    categories: [...staticCategories],
  });
  const photosDoc = useAdminPhotos([]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (categoriesDoc.loading || photosDoc.loading) {
    return <p className="text-sm text-[var(--fg-muted)]">Loading…</p>;
  }

  async function handleUpload(index: number, file: File) {
    setUploadingIndex(index);
    setUploadError(null);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      const entries = [...photosDoc.entries];
      entries[index] = { ...entries[index], src: dataUrl };
      photosDoc.setEntries(entries);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingIndex(null);
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <Card>
        <Field label="Categories (comma-separated -- these become the filter pills)">
          <TextInput
            value={categoriesDoc.value.categories.join(", ")}
            onChange={(e) =>
              categoriesDoc.setValue({
                categories: e.target.value
                  .split(",")
                  .map((c) => c.trim())
                  .filter(Boolean),
              })
            }
          />
        </Field>
        <div className="mt-3">
          <button
            type="button"
            onClick={categoriesDoc.save}
            disabled={categoriesDoc.saving}
            className="min-h-11 cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {categoriesDoc.saving ? "Saving…" : "Save categories"}
          </button>
          {categoriesDoc.saved && !categoriesDoc.saving && (
            <span className="ml-3 text-sm font-medium text-success">Saved ✓</span>
          )}
        </div>
      </Card>

      <ListEditor<Photo>
        items={photosDoc.entries}
        onChange={photosDoc.setEntries}
        addLabel="+ Add photo"
        itemLabel={(p, i) => p.caption || p.alt || `Photo ${i + 1}`}
        makeNew={() => ({
          id: `new-${crypto.randomUUID()}`,
          src: "",
          alt: "",
          category: categoriesDoc.value.categories[0] ?? "",
          caption: "",
          order: photosDoc.entries.length,
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
                    if (file) handleUpload(i, file);
                  }}
                  className="block w-full text-xs"
                />
              </label>
              {uploadingIndex === i && (
                <p className="mt-1 text-xs text-[var(--fg-muted)]">Compressing…</p>
              )}
            </div>
            <div className="space-y-3">
              <Field label="Category">
                <select
                  value={photo.category}
                  onChange={(e) => update({ category: e.target.value })}
                  className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)]"
                >
                  {categoriesDoc.value.categories.map((c) => (
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
      {categoriesDoc.error && <p className="text-sm text-error">{categoriesDoc.error}</p>}
      {photosDoc.error && <p className="text-sm text-error">{photosDoc.error}</p>}
      <SaveBar onSave={photosDoc.save} saving={photosDoc.saving} saved={photosDoc.saved} />
    </div>
  );
}
