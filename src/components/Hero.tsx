import { motion } from "framer-motion";
import { profile } from "../data/profile";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pb-20 pt-16 text-center sm:pt-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary-light/25 via-secondary/15 to-accent/25"
      />

      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 text-sm font-semibold tracking-[0.2em] text-primary"
      >
        HELLO, I'M
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mx-auto max-w-3xl text-4xl leading-tight sm:text-6xl"
      >
        {profile.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto mt-5 max-w-xl text-lg text-[var(--fg-muted)]"
      >
        {profile.tagline}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mx-auto mt-2 max-w-xl text-sm text-[var(--fg-muted)]"
      >
        {profile.subtagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <a
          href="#playground"
          className="cursor-pointer rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          Play a minigame 🎮
        </a>
        <a
          href="#journey"
          className="cursor-pointer rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--fg)] transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          See my journey
        </a>
      </motion.div>
    </section>
  );
}
