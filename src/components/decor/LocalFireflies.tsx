import { useMemo } from "react";
import { mulberry32 } from "../../utils/random";
import { FireflyDot } from "./FireflyDot";

interface LocalFirefliesProps {
  count?: number;
  seed?: number;
  className?: string;
}

// Ambient-only fireflies scoped to a single section, positioned behind
// whatever foreground "surface" the caller stacks above them (see
// usage: parent gets position:relative, the surface gets relative z-10,
// this sits at z-0 in between -- so a few fireflies genuinely peek out
// from behind the card instead of floating in front of everything.
export function LocalFireflies({ count = 3, seed = 9, className }: LocalFirefliesProps) {
  const fireflies = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      delay: rand() * 6,
      size: 1.5 + rand() * 2,
    }));
  }, [count, seed]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-0 overflow-hidden ${className ?? "inset-0"}`}
    >
      {fireflies.map((f) => (
        <FireflyDot
          key={f.id}
          left={f.left}
          top={f.top}
          delay={f.delay}
          size={f.size}
          layer="back"
        />
      ))}
    </div>
  );
}
