import { useMemo, type CSSProperties } from "react";
import { mulberry32 } from "../../utils/random";

export function Fireflies() {
  const fireflies = useMemo(() => {
    const rand = mulberry32(101);
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      delay: rand() * 8,
      duration: 9 + rand() * 8,
      dx: (rand() - 0.5) * 140,
      dy: (rand() - 0.5) * 110,
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
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
