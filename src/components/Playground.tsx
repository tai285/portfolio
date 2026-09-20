import { useState } from "react";
import { LocalFireflies } from "./decor/LocalFireflies";
import { SectionHeading } from "./SectionHeading";
import { TriviaGame } from "./games/TriviaGame";
import { MemoryMatchGame } from "./games/MemoryMatchGame";
import { FunFactCard } from "./games/FunFactCard";

type Tab = "facts" | "trivia" | "memory";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "facts", label: "Fun Facts", emoji: "🎴" },
  { id: "trivia", label: "Trivia Quiz", emoji: "❓" },
  { id: "memory", label: "Memory Match", emoji: "🧩" },
];

export function Playground() {
  const [tab, setTab] = useState<Tab>("facts");

  return (
    <section id="playground" className="bg-[var(--bg-alt)] px-5 py-20">
      <SectionHeading
        eyebrow="Take a break"
        title="Playground"
        subtitle="A few tiny games instead of a wall of text."
      />

      <div
        role="tablist"
        aria-label="Playground games"
        className="mx-auto mt-10 flex max-w-md flex-wrap justify-center gap-2"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`cursor-pointer rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-200 ${
              tab === t.id
                ? "border-primary bg-primary text-white"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--fg-muted)] hover:border-primary-light"
            }`}
          >
            <span aria-hidden="true">{t.emoji}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="relative mx-auto mt-8 max-w-2xl overflow-hidden">
        <LocalFireflies count={3} seed={17} className="-inset-x-8 -inset-y-8" />
        <div className="relative z-10">
          {tab === "facts" && <FunFactCard />}
          {tab === "trivia" && <TriviaGame />}
          {tab === "memory" && <MemoryMatchGame />}
        </div>
      </div>
    </section>
  );
}
