import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { profile } from "../data/profile";

const LONG_PRESS_MS = 1000;

export function Footer() {
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function startPress() {
    timerRef.current = setTimeout(() => setShowHint(true), LONG_PRESS_MS);
  }

  function cancelPress() {
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  return (
    <footer className="px-5 py-14 text-center">
      <p
        aria-hidden="true"
        onTouchStart={startPress}
        onTouchEnd={cancelPress}
        onTouchCancel={cancelPress}
        className="cursor-default select-none text-secondary tracking-[0.3em]"
      >
        ✦ ✧ ✿ ❀
      </p>

      <AnimatePresence>
        {showHint && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => {
              setTimeout(() => setShowHint(false), 3200);
            }}
            className="mx-auto mt-2 max-w-xs font-mono text-xs text-[var(--fg-muted)]"
          >
            swipe: ↑ ↑ ↓ ↓ ← → ← → then tap left, tap right ✦
          </motion.p>
        )}
      </AnimatePresence>

      <p className="mt-4 font-heading text-lg text-[var(--fg)]">
        {profile.shortName}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-[var(--fg-muted)]">
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noreferrer"
          className="cursor-pointer hover:text-primary"
        >
          GitHub
        </a>
        <a href={profile.socials.email} className="cursor-pointer hover:text-primary">
          Email
        </a>
        {profile.socials.linkedin && (
          <a
            href={profile.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer hover:text-primary"
          >
            LinkedIn
          </a>
        )}
      </div>
      <p className="mt-6 text-xs text-[var(--fg-muted)]">
        Built with React, TypeScript &amp; a little too much Framer Motion.
      </p>
    </footer>
  );
}
