import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { profile as staticProfile } from "../data/profile";
import { useContent } from "../hooks/useContent";
import type { Profile } from "../types/content";
import { Flower, GrassRow } from "./decor/GardenFloor";

const LONG_PRESS_MS = 1000;

export function Footer() {
  const profile = useContent<Profile>("profile", staticProfile);
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

      <div className="relative mt-10 h-16 overflow-hidden" aria-hidden="true">
        <Flower
          petalColor="#d9639b"
          size={22}
          className="absolute bottom-3 left-[8%]"
        />
        <Flower
          petalColor="#b98dd4"
          size={18}
          className="absolute bottom-4 left-[22%]"
        />
        <Flower
          petalColor="#9edde3"
          size={24}
          className="absolute bottom-2 left-[46%]"
        />
        <Flower
          petalColor="#f2c869"
          centerColor="#d9639b"
          size={19}
          className="absolute bottom-4 left-[68%]"
        />
        <Flower
          petalColor="#e8a6c8"
          size={21}
          className="absolute bottom-3 left-[86%]"
        />
        <GrassRow className="absolute inset-x-0 bottom-0 h-16 w-full" />
      </div>
    </footer>
  );
}
