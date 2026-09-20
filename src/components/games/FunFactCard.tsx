import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { funFacts as staticFunFacts } from "../../data/funFacts";
import { useContent } from "../../hooks/useContent";
import type { FunFactsContent } from "../../types/content";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function FunFactCard() {
  const { facts: funFacts } = useContent<FunFactsContent>("funFacts", {
    facts: staticFunFacts,
  });
  const [order, setOrder] = useState<number[]>(() =>
    shuffle(funFacts.map((_, i) => i)),
  );
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);

  // Re-shuffle whenever the underlying facts actually change (a CMS
  // edit landing live), not just on mount -- keeps `order`'s indices
  // valid for the current facts array.
  useEffect(() => {
    setOrder(shuffle(funFacts.map((_, i) => i)));
    setPos(0);
    setRevealed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funFacts]);

  const seenCount = revealed ? pos + 1 : pos;

  function reveal() {
    if (!revealed) {
      setRevealed(true);
      return;
    }
    const nextPos = pos + 1;
    if (nextPos >= order.length) {
      setOrder(shuffle(funFacts.map((_, i) => i)));
      setPos(0);
    } else {
      setPos(nextPos);
    }
  }

  const fact = funFacts[order[pos]];

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center sm:p-8">
      <p className="text-xs font-semibold text-[var(--fg-muted)]">
        Fact {Math.min(seenCount, funFacts.length)} / {funFacts.length}
      </p>

      <button
        type="button"
        onClick={reveal}
        aria-label={revealed ? "Show another fun fact" : "Reveal a fun fact"}
        className="group relative mx-auto mt-5 flex h-40 w-full max-w-sm cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-primary-light bg-gradient-to-br from-secondary/15 to-accent/15 px-6 text-center transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        <AnimatePresence mode="wait">
          {revealed ? (
            <motion.p
              key={order[pos]}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="text-base font-medium text-[var(--fg)]"
            >
              {fact}
            </motion.p>
          ) : (
            <motion.p
              key="cta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-heading text-primary"
            >
              Tap to reveal ✦
            </motion.p>
          )}
        </AnimatePresence>
      </button>

      {revealed && (
        <button
          type="button"
          onClick={reveal}
          className="mt-5 cursor-pointer rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
        >
          Another one →
        </button>
      )}
    </div>
  );
}
