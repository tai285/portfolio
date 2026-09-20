import { useEffect, useState } from "react";
import { defaultThemeFlavor, themeFlavors, type ThemeFlavor } from "../data/themeFlavors";

type Mode = "light" | "dark";

const MODE_KEY = "theme";
const FLAVOR_KEY = "theme-flavor";

function getSystemMode(): Mode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStored<T extends string>(key: string, valid: readonly T[], fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored && (valid as readonly string[]).includes(stored)) return stored as T;
  } catch {
    // localStorage unavailable -- fall through to fallback
  }
  return fallback;
}

function applyPalette(mode: Mode, flavor: ThemeFlavor) {
  const palette = mode === "dark" ? flavor.dark : flavor.light;
  const root = document.documentElement.style;
  root.setProperty("--color-primary", palette.primary);
  root.setProperty("--color-primary-light", palette.primaryLight);
  root.setProperty("--color-secondary", palette.secondary);
  root.setProperty("--color-accent", palette.accent);
  root.setProperty("--color-accent-2", palette.accent2);
  root.setProperty("--bg", palette.bg);
  root.setProperty("--bg-alt", palette.bgAlt);
  root.setProperty("--surface", palette.surface);
  root.setProperty("--fg", palette.fg);
  root.setProperty("--fg-muted", palette.fgMuted);
  root.setProperty("--border", palette.border);
  root.setProperty("--particle-rgb", flavor.particleRgb);
  root.setProperty("--garden-grass", flavor.grassColor);
  flavor.flowerColors.forEach((color, i) => {
    root.setProperty(`--garden-flower-${i + 1}`, color);
  });
}

/**
 * Owns both the light/dark mode and the pickable "theme flavor" (color
 * palette + particle color + garden colors + chime). Applies the
 * resolved palette as CSS custom properties directly on :root, which
 * every Tailwind color utility (bg-primary, text-primary, etc.) and
 * every var(--bg)/var(--fg) reference already reads from -- so this is
 * the single source of truth, no separate light/dark CSS blocks needed.
 */
export function useThemeSettings() {
  const [mode, setMode] = useState<Mode>(() => readStored(MODE_KEY, ["light", "dark"], getSystemMode()));
  const [flavorId, setFlavorId] = useState<string>(() =>
    readStored(
      FLAVOR_KEY,
      themeFlavors.map((f) => f.id),
      defaultThemeFlavor.id,
    ),
  );

  const activeFlavor = themeFlavors.find((f) => f.id === flavorId) ?? defaultThemeFlavor;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    applyPalette(mode, activeFlavor);
    try {
      localStorage.setItem(MODE_KEY, mode);
      localStorage.setItem(FLAVOR_KEY, activeFlavor.id);
    } catch {
      // ignore -- per-viewer convenience only
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, activeFlavor]);

  return {
    mode,
    toggleMode: () => setMode((m) => (m === "light" ? "dark" : "light")),
    flavorId: activeFlavor.id,
    setFlavorId,
    activeFlavor,
    flavors: themeFlavors,
  };
}
