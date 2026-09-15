import { useMemo } from "react";
import { mulberry32 } from "../../utils/random";

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
    </div>
  );
}
