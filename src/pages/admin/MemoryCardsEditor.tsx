import { memoryCardDefs as staticCards } from "../../data/memoryCards";
import { useAdminContentDoc } from "../../hooks/useAdminContentDoc";
import type { MemoryCardDef, MemoryCardsContent } from "../../types/content";
import { Field, SaveBar, TextInput } from "./fields";
import { ListEditor } from "./ListEditor";

export function MemoryCardsEditor() {
  const { value, setValue, loading, saving, saved, error, save } =
    useAdminContentDoc<MemoryCardsContent>("memoryCards", { cards: staticCards });

  if (loading) return <p className="text-sm text-[var(--fg-muted)]">Loading…</p>;

  return (
    <div className="space-y-4 pb-24">
      <p className="text-sm text-[var(--fg-muted)]">
        These become pairs in the Memory Match game -- each card appears twice.
      </p>
      <ListEditor<MemoryCardDef>
        items={value.cards}
        onChange={(cards) => setValue({ cards })}
        addLabel="+ Add pair"
        itemLabel={(c, i) => c.label || `Pair ${i + 1}`}
        makeNew={() => ({ label: "", emoji: "✦" })}
        renderItem={(card, update) => (
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Field label="Label">
              <TextInput
                value={card.label}
                onChange={(e) => update({ label: e.target.value })}
              />
            </Field>
            <Field label="Emoji">
              <TextInput
                value={card.emoji}
                onChange={(e) => update({ emoji: e.target.value })}
                className="w-20 text-center text-lg"
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
