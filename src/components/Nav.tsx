import { useEffect, useState } from "react";
import { useThemeSettings } from "../hooks/useThemeSettings";
import { ThemePicker } from "./ThemePicker";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#journey", label: "Journey" },
  { href: "#projects", label: "Projects" },
  { href: "#album", label: "Album" },
  { href: "#playground", label: "Playground" },
  { href: "#guestbook", label: "Guestbook" },
];

interface NavProps {
  unlocked?: boolean;
}

export function Nav({ unlocked }: NavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { mode, toggleMode, flavorId, setFlavorId, activeFlavor, flavors } = useThemeSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-[var(--surface)]/90 backdrop-blur border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2">
          <a
            href="#top"
            className="font-heading text-lg font-semibold text-primary cursor-pointer"
          >
            Dorothy ✦
          </a>
          {unlocked && (
            <a
              href="#/the-matrix"
              title="You unlocked the secret page — revisit it anytime"
              aria-label="Revisit the secret Matrix page"
              className="cursor-pointer rounded-full border border-[var(--border)] px-2 py-0.5 text-xs transition-colors hover:border-primary-light"
            >
              🐇
            </a>
          )}
        </div>

        <ul className="hidden gap-6 sm:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="cursor-pointer text-sm font-medium text-[var(--fg-muted)] transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemePicker
            flavorId={flavorId}
            setFlavorId={setFlavorId}
            activeFlavor={activeFlavor}
            flavors={flavors}
          />
          <ThemeToggle mode={mode} toggleMode={toggleMode} />
          <button
            type="button"
            className="cursor-pointer inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-lg sm:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden="true">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-[var(--border)] bg-[var(--surface)] px-5 py-3 sm:hidden">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block cursor-pointer rounded-lg px-3 py-3 text-sm font-medium text-[var(--fg-muted)] hover:bg-[var(--bg-alt)] hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
