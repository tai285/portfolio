import type { ReactNode } from "react";
import { Button, Card } from "./fields";

interface ListEditorProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  makeNew: () => T;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  itemLabel: (item: T, index: number) => string;
  addLabel: string;
}

export function ListEditor<T>({
  items,
  onChange,
  makeNew,
  renderItem,
  itemLabel,
  addLabel,
}: ListEditorProps<T>) {
  function update(i: number, patch: Partial<T>) {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <Card key={i}>
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
              {itemLabel(item, i)}
            </span>
            <div className="flex gap-1.5">
              <Button variant="secondary" onClick={() => move(i, -1)} disabled={i === 0}>
                ↑
              </Button>
              <Button
                variant="secondary"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
              >
                ↓
              </Button>
              <Button variant="danger" onClick={() => remove(i)}>
                Remove
              </Button>
            </div>
          </div>
          {renderItem(item, (patch) => update(i, patch), i)}
        </Card>
      ))}

      <Button onClick={() => onChange([...items, makeNew()])}>{addLabel}</Button>
    </div>
  );
}
