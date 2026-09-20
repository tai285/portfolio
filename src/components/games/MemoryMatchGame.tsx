import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { memoryCardDefs as staticMemoryCardDefs } from "../../data/memoryCards";
import { useContent } from "../../hooks/useContent";
import type { MemoryCardDef, MemoryCardsContent } from "../../types/content";

interface Card {
  id: number;
  pairId: number;
  label: string;
  emoji: string;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck(defs: MemoryCardDef[]): Card[] {
  const doubled = defs.flatMap((def, pairId) => [
    { id: pairId * 2, pairId, label: def.label, emoji: def.emoji },
    { id: pairId * 2 + 1, pairId, label: def.label, emoji: def.emoji },
  ]);
  return shuffle(doubled);
}

export function MemoryMatchGame() {
  const { cards: memoryCardDefs } = useContent<MemoryCardsContent>("memoryCards", {
    cards: staticMemoryCardDefs,
  });
  const [deck, setDeck] = useState<Card[]>(() => buildDeck(memoryCardDefs));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);

  // A CMS edit landing live mid-game would otherwise leave `deck` out
  // of sync with a differently-sized card set -- reset for a clean deck.
  useEffect(() => {
    setDeck(buildDeck(memoryCardDefs));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setBusy(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoryCardDefs]);

  const won = matched.size === deck.length;
  const pairsFound = matched.size / 2;

  const cardsById = useMemo(() => new Map(deck.map((c) => [c.id, c])), [deck]);

  function reset() {
    setDeck(buildDeck(memoryCardDefs));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setBusy(false);
  }

  function flip(id: number) {
    if (busy || flipped.includes(id) || matched.has(id)) return;
    const next = [...flipped, id];
    setFlipped(next);

    if (next.length === 2) {
      setBusy(true);
      setMoves((m) => m + 1);
      const [a, b] = next;
      const cardA = cardsById.get(a)!;
      const cardB = cardsById.get(b)!;

      if (cardA.pairId === cardB.pairId) {
        setTimeout(() => {
          setMatched((prev) => new Set(prev).add(a).add(b));
          setFlipped([]);
          setBusy(false);
        }, 400);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setBusy(false);
        }, 800);
      }
    }
  }

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between text-xs font-semibold text-[var(--fg-muted)]">
        <span>
          Pairs found: {pairsFound} / {memoryCardDefs.length}
        </span>
        <span>Moves: {moves}</span>
      </div>

      {won ? (
        <div className="py-8 text-center">
          <p className="text-4xl" aria-hidden="true">
            🏆
          </p>
          <h3 className="mt-3 text-2xl">Matched everything in {moves} moves!</h3>
          <button
            type="button"
            onClick={reset}
            className="mt-6 cursor-pointer rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
          >
            Play again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
          {deck.map((card) => {
            const isFlipped = flipped.includes(card.id) || matched.has(card.id);
            const isMatched = matched.has(card.id);
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => flip(card.id)}
                disabled={isFlipped}
                aria-label={isFlipped ? card.label : "Hidden card"}
                className="aspect-square cursor-pointer [perspective:600px] disabled:cursor-default"
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative h-full w-full [transform-style:preserve-3d]"
                >
                  <div
                    className="absolute inset-0 flex items-center justify-center rounded-xl border border-[var(--border)] bg-gradient-to-br from-primary-light/40 to-accent/40 text-xl [backface-visibility:hidden]"
                    aria-hidden="true"
                  >
                    ✦
                  </div>
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center gap-0.5 rounded-xl border text-center [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                      isMatched
                        ? "border-success bg-success/15"
                        : "border-[var(--border)] bg-[var(--bg-alt)]"
                    }`}
                  >
                    <span className="text-lg leading-none" aria-hidden="true">
                      {card.emoji}
                    </span>
                    <span className="px-1 text-[10px] font-semibold leading-tight text-[var(--fg)] sm:text-xs">
                      {card.label}
                    </span>
                  </div>
                </motion.div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
