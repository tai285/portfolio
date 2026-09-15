import { useMemo, type CSSProperties } from "react";

// Deterministic PRNG so the sparkle layout is stable across re-renders
// (no reshuffling every time React re-renders the carousel).
function mulberry32(seed: number) {
  let s = seed;
  return function random() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SPARKLE_COLORS = ["#e0ab2e", "#4fae6f", "#d9639b", "#3fb8c9"];

export function CarouselSparkles() {
  const sparkles = useMemo(() => {
    const rand = mulberry32(42);
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: 14 + rand() * 14,
      delay: rand() * 4,
      duration: 2.2 + rand() * 2.2,
      color: SPARKLE_COLORS[Math.floor(rand() * SPARKLE_COLORS.length)],
    }));
  }, []);

  const fireflies = useMemo(() => {
    const rand = mulberry32(7);
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      delay: rand() * 5,
      duration: 6 + rand() * 4,
      dx: (rand() - 0.5) * 70,
      dy: (rand() - 0.5) * 60,
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-3 -inset-y-6 -z-10 overflow-visible sm:-inset-x-16 sm:-inset-y-14"
    >
      <div
        className="glow-blob h-52 w-52 bg-[#7fd89a] blur-3xl"
        style={{ left: "4%", top: "4%" }}
      />
      <div
        className="glow-blob h-60 w-60 bg-[#ffd873] blur-3xl"
        style={{ right: "0%", top: "34%", animationDelay: "1.2s" }}
      />
      <div
        className="glow-blob h-44 w-44 bg-[#9be8ae] blur-3xl"
        style={{ left: "34%", bottom: "-4%", animationDelay: "2.1s" }}
      />

      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle-dot"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            fontSize: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            color: s.color,
          }}
        >
          ✦
        </span>
      ))}

      {fireflies.map((f) => (
        <span
          key={f.id}
          className="firefly-dot"
          style={
            {
              left: `${f.left}%`,
              top: `${f.top}%`,
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.duration}s`,
              "--fx": `${f.dx}px`,
              "--fy": `${f.dy}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
