import { profile as staticProfile } from "../../data/profile";
import { useAdminContentDoc } from "../../hooks/useAdminContentDoc";
import type { Profile } from "../../types/content";
import { Card, Field, SaveBar, TextArea, TextInput } from "./fields";

export function ProfileEditor() {
  const { value, setValue, loading, saving, saved, error, save } =
    useAdminContentDoc<Profile>("profile", staticProfile);

  if (loading) return <p className="text-sm text-[var(--fg-muted)]">Loading…</p>;

  return (
    <div className="space-y-4 pb-24">
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <TextInput
              value={value.name}
              onChange={(e) => setValue({ ...value, name: e.target.value })}
            />
          </Field>
          <Field label="Short name (used in nav/footer)">
            <TextInput
              value={value.shortName}
              onChange={(e) => setValue({ ...value, shortName: e.target.value })}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Tagline">
            <TextInput
              value={value.tagline}
              onChange={(e) => setValue({ ...value, tagline: e.target.value })}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Subtagline">
            <TextInput
              value={value.subtagline}
              onChange={(e) => setValue({ ...value, subtagline: e.target.value })}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Bio (one paragraph per line)">
            <TextArea
              rows={5}
              value={value.bio.join("\n")}
              onChange={(e) =>
                setValue({ ...value, bio: e.target.value.split("\n").filter(Boolean) })
              }
            />
          </Field>
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-semibold text-[var(--fg)]">Social links</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="GitHub URL">
            <TextInput
              value={value.socials.github}
              onChange={(e) =>
                setValue({ ...value, socials: { ...value.socials, github: e.target.value } })
              }
            />
          </Field>
          <Field label="Email (mailto:...)">
            <TextInput
              value={value.socials.email}
              onChange={(e) =>
                setValue({ ...value, socials: { ...value.socials, email: e.target.value } })
              }
            />
          </Field>
          <Field label="LinkedIn URL (optional)">
            <TextInput
              value={value.socials.linkedin}
              onChange={(e) =>
                setValue({ ...value, socials: { ...value.socials, linkedin: e.target.value } })
              }
            />
          </Field>
        </div>
      </Card>

      {error && <p className="text-sm text-error">{error}</p>}
      <SaveBar onSave={save} saving={saving} saved={saved} />
    </div>
  );
}
