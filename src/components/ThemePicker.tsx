import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ThemeFlavor } from "../data/themeFlavors";
import type { Season, SeasonId } from "../data/seasons";
import { useThemeSound } from "../hooks/useThemeSound";

interface ThemePickerProps {
  flavorId: string;
  setFlavorId: (id: string) => void;
  activeFlavor: ThemeFlavor;
  flavors: ThemeFlavor[];
  seasonChoice: SeasonId | "auto";
  setSeasonChoice: (choice: SeasonId | "auto") => void;
  activeSeason: Season;
  seasons: Season[];
}

export function ThemePicker({
  flavorId,
  setFlavorId,
  activeFlavor,
  flavors,
  seasonChoice,
  setSeasonChoice,
  activeSeason,
  seasons,
}: ThemePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { enabled: soundOn, toggleEnabled: toggleSound, playChime } = useThemeSound();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function pick(flavor: ThemeFlavor) {
    setFlavorId(flavor.id);
    playChime(flavor.chime);
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Choose a theme"
        aria-expanded={open}
        className="cursor-pointer inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-lg transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        <span aria-hidden="true">{activeFlavor.emoji}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-60 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-lg"
          >
            <p className="mb-2 px-1 text-xs font-semibold text-[var(--fg-muted)]">Pick a theme</p>
            <ul className="space-y-1">
              {flavors.map((flavor) => {
                const active = flavor.id === flavorId;
                return (
                  <li key={flavor.id}>
                    <button
                      type="button"
                      onClick={() => pick(flavor)}
                      className={`flex w-full cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-left text-sm transition-colors ${
                        active
                          ? "bg-[var(--bg-alt)] font-semibold text-primary"
                          : "text-[var(--fg)] hover:bg-[var(--bg-alt)]"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border border-[var(--border)]"
                        style={{ background: flavor.swatch }}
                      />
                      <span aria-hidden="true">{flavor.emoji}</span>
                      {flavor.name}
                      {active && <span className="ml-auto text-xs">✓</span>}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-2 border-t border-[var(--border)] pt-2">
              <p className="mb-1.5 px-1 text-xs font-semibold text-[var(--fg-muted)]">Season</p>
              <div className="flex flex-wrap gap-1.5 px-1">
                <button
                  type="button"
                  onClick={() => setSeasonChoice("auto")}
                  aria-pressed={seasonChoice === "auto"}
                  title="Follow the current season automatically"
                  className={`cursor-pointer rounded-full border px-2.5 py-1 text-xs transition-colors ${
                    seasonChoice === "auto"
                      ? "border-primary bg-[var(--bg-alt)] font-semibold text-primary"
                      : "border-[var(--border)] text-[var(--fg)] hover:bg-[var(--bg-alt)]"
                  }`}
                >
                  🔄 Auto
                </button>
                {seasons.map((season) => (
                  <button
                    key={season.id}
                    type="button"
                    onClick={() => setSeasonChoice(season.id)}
                    aria-pressed={seasonChoice === season.id}
                    title={season.name}
                    className={`cursor-pointer rounded-full border px-2.5 py-1 text-xs transition-colors ${
                      seasonChoice === season.id
                        ? "border-primary bg-[var(--bg-alt)] font-semibold text-primary"
                        : "border-[var(--border)] text-[var(--fg)] hover:bg-[var(--bg-alt)]"
                    }`}
                  >
                    <span aria-hidden="true">{season.emoji}</span>
                  </button>
                ))}
              </div>
              {seasonChoice === "auto" && (
                <p className="mt-1 px-1 text-[11px] text-[var(--fg-muted)]">
                  Currently {activeSeason.name.toLowerCase()} 🔄
                </p>
              )}
            </div>

            <div className="mt-2 border-t border-[var(--border)] pt-2">
              <button
                type="button"
                onClick={toggleSound}
                aria-pressed={soundOn}
                className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-[var(--fg)] hover:bg-[var(--bg-alt)]"
              >
                <span aria-hidden="true">{soundOn ? "🔊" : "🔇"}</span>
                {soundOn ? "Chime sounds on" : "Chime sounds off"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
