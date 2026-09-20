import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { mulberry32 } from "../../utils/random";

interface WonderlandRevealProps {
  onDismiss: () => void;
}

const SPARKLE_GLYPHS = ["✦", "✧", "✨", "⭐"];

function useShowerSparkles() {
  return useMemo(() => {
    const rand = mulberry32(4242);
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: 10 + rand() * 18,
      delay: rand() * 1.2,
      duration: 1.6 + rand() * 1.4,
      glyph: SPARKLE_GLYPHS[Math.floor(rand() * SPARKLE_GLYPHS.length)],
      hue: Math.floor(rand() * 4),
    }));
  }, []);
}

const HUE_COLORS = ["#ff5fa2", "#ffd166", "#3ddad7", "#8f6ba8"];

export function WonderlandReveal({ onDismiss }: WonderlandRevealProps) {
  const sparkles = useShowerSparkles();

  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="sparkle-dot absolute"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              fontSize: s.size,
              color: HUE_COLORS[s.hue],
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          >
            {s.glyph}
          </span>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.85, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="relative mx-4 rounded-3xl border border-white/20 bg-white/10 px-8 py-6 text-center text-white shadow-2xl"
      >
        <p className="text-3xl">🪄✨</p>
        <p className="mt-2 font-heading text-xl font-semibold">You found a hidden spark of magic!</p>
        <p className="mt-1 text-sm text-white/80">
          The Wonderland theme just appeared in the theme picker.
        </p>
      </motion.div>
    </motion.div>
  );
}
