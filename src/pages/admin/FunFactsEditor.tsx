import { funFacts as staticFunFacts } from "../../data/funFacts";
import { useAdminContentDoc } from "../../hooks/useAdminContentDoc";
import type { FunFactsContent } from "../../types/content";
import { Card, Field, SaveBar, TextArea } from "./fields";

export function FunFactsEditor() {
  const { value, setValue, loading, saving, saved, error, save } =
    useAdminContentDoc<FunFactsContent>("funFacts", { facts: staticFunFacts });

  if (loading) return <p className="text-sm text-[var(--fg-muted)]">Loading…</p>;

  return (
    <div className="space-y-4 pb-24">
      <Card>
        <Field label="One fact per line -- each becomes a card in the Fun Facts game">
          <TextArea
            rows={10}
            value={value.facts.join("\n")}
            onChange={(e) =>
              setValue({ facts: e.target.value.split("\n").filter(Boolean) })
            }
          />
        </Field>
      </Card>

      {error && <p className="text-sm text-error">{error}</p>}
      <SaveBar onSave={save} saving={saving} saved={saved} />
    </div>
  );
}
