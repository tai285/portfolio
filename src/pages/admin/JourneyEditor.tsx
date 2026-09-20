import { journey as staticJourney } from "../../data/journey";
import { useAdminContentDoc } from "../../hooks/useAdminContentDoc";
import type { JourneyContent, JourneyEntry } from "../../types/content";
import { Field, SaveBar, TextArea, TextInput } from "./fields";
import { ListEditor } from "./ListEditor";

export function JourneyEditor() {
  const { value, setValue, loading, saving, saved, error, save } =
    useAdminContentDoc<JourneyContent>("journey", { entries: staticJourney });

  if (loading) return <p className="text-sm text-[var(--fg-muted)]">Loading…</p>;

  return (
    <div className="space-y-4 pb-24">
      <ListEditor<JourneyEntry>
        items={value.entries}
        onChange={(entries) => setValue({ entries })}
        addLabel="+ Add timeline entry"
        itemLabel={(e, i) => e.title || `Entry ${i + 1}`}
        makeNew={() => ({ year: "", title: "", description: "", tags: [] })}
        renderItem={(entry, update) => (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Year / stage label (e.g. Build, Recognition)">
                <TextInput
                  value={entry.year}
                  onChange={(e) => update({ year: e.target.value })}
                />
              </Field>
              <Field label="Badge emoji (optional, e.g. 🥇)">
                <TextInput
                  value={entry.badge ?? ""}
                  onChange={(e) => update({ badge: e.target.value || undefined })}
                />
              </Field>
            </div>
            <Field label="Title">
              <TextInput
                value={entry.title}
                onChange={(e) => update({ title: e.target.value })}
              />
            </Field>
            <Field label="Description">
              <TextArea
                rows={3}
                value={entry.description}
                onChange={(e) => update({ description: e.target.value })}
              />
            </Field>
            <Field label="Tags (comma-separated)">
              <TextInput
                value={entry.tags.join(", ")}
                onChange={(e) =>
                  update({
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>
          </div>
        )}
      />

      {error && <p className="text-sm text-error">{error}</p>}
      <SaveBar onSave={save} saving={saving} saved={saved} />
    </div>
  );
}
