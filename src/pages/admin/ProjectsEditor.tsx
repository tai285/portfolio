import { projects as staticProjects } from "../../data/projects";
import { useAdminContentDoc } from "../../hooks/useAdminContentDoc";
import type { Project, ProjectsContent } from "../../types/content";
import { Checkbox, Field, SaveBar, TextArea, TextInput } from "./fields";
import { ListEditor } from "./ListEditor";

export function ProjectsEditor() {
  const { value, setValue, loading, saving, saved, error, save } =
    useAdminContentDoc<ProjectsContent>("projects", { entries: staticProjects });

  if (loading) return <p className="text-sm text-[var(--fg-muted)]">Loading…</p>;

  return (
    <div className="space-y-4 pb-24">
      <ListEditor<Project>
        items={value.entries}
        onChange={(entries) => setValue({ entries })}
        addLabel="+ Add project"
        itemLabel={(p, i) => p.title || `Project ${i + 1}`}
        makeNew={() => ({ title: "", description: "", tags: [] })}
        renderItem={(project, update) => (
          <div className="space-y-3">
            <Field label="Title">
              <TextInput
                value={project.title}
                onChange={(e) => update({ title: e.target.value })}
              />
            </Field>
            <Field label="Description">
              <TextArea
                rows={3}
                value={project.description}
                onChange={(e) => update({ description: e.target.value })}
              />
            </Field>
            <Field label="Tags (comma-separated)">
              <TextInput
                value={project.tags.join(", ")}
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
            <Field label="Link (optional)">
              <TextInput
                value={project.link ?? ""}
                onChange={(e) => update({ link: e.target.value || undefined })}
              />
            </Field>
            <Checkbox
              label="Featured (highlighted card)"
              checked={Boolean(project.featured)}
              onChange={(v) => update({ featured: v })}
            />
          </div>
        )}
      />

      {error && <p className="text-sm text-error">{error}</p>}
      <SaveBar onSave={save} saving={saving} saved={saved} />
    </div>
  );
}
