import { motion } from "framer-motion";
import { useState } from "react";
import { funFacts } from "../../data/funFacts";
import { MatrixRain } from "./MatrixRain";

interface MatrixPageProps {
  onExit: () => void;
}

export function MatrixPage({ onExit }: MatrixPageProps) {
  const [declassifiedFact] = useState(
    () => funFacts[Math.floor(Math.random() * funFacts.length)],
  );

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-[#04080a] text-[#3fe07a]">
      <MatrixRain />

      <div className="relative mx-auto flex min-h-full max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-[#3fe07a]/70">
          RABBIT HOLE // LAYER 2
        </p>

        <h1
          data-text="ACCESS GRANTED"
          className="glitch-text mt-4 font-mono text-4xl font-bold text-[#a6f7c9] sm:text-6xl"
        >
          ACCESS GRANTED
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 w-full rounded-xl border border-[#3fe07a]/30 bg-black/60 p-6 text-left font-mono text-sm"
        >
          <p className="text-[#3fe07a]/60">// declassified_file.txt</p>
          <p className="mt-3 text-[#d6fff0]">{declassifiedFact}</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 max-w-md font-mono text-sm text-[#3fe07a]/80"
        >
          You made it through the rabbit hole. 🐇 Not many people find the
          console hint, land the Konami code, <em>and</em> solve the riddle.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#3fe07a]/40 px-4 py-2 font-mono text-xs text-[#a6f7c9]"
        >
          🏆 Achievement unlocked: Rabbit Hole Explorer
        </motion.div>

        <button
          type="button"
          onClick={onExit}
          className="mt-10 cursor-pointer rounded-full border border-[#3fe07a]/50 bg-[#3fe07a]/10 px-6 py-3 font-mono text-sm font-semibold text-[#a6f7c9] transition-colors hover:bg-[#3fe07a]/20"
        >
          ← Return to reality
        </button>
      </div>
    </div>
  );
}
