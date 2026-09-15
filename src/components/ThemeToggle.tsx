import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="cursor-pointer inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-lg transition-transform duration-200 hover:scale-105 active:scale-95"
    >
      <span aria-hidden="true">{isDark ? "🌙" : "☀️"}</span>
    </button>
  );
}
