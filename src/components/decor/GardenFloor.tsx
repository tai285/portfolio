import { useMemo, type CSSProperties } from "react";
import { mulberry32 } from "../../utils/random";

interface GrassRowProps {
  className?: string;
  color?: string;
  seed?: number;
}

export function GrassRow({ className, color = "#7fb88a", seed = 55 }: GrassRowProps) {
  const blades = useMemo(() => {
    const rand = mulberry32(seed);
    const arr: { x: number; h: number; lean: number; w: number }[] = [];
    let x = -10;
    while (x < 1210) {
      const h = 22 + rand() * 26;
      const lean = (rand() - 0.5) * 16;
      const w = 2 + rand() * 1.6;
      arr.push({ x, h, lean, w });
      x += 10 + rand() * 12;
    }
    return arr;
  }, [seed]);

  return (
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      {blades.map((b, i) => (
        <path
          key={i}
          d={`M ${b.x} 60 Q ${b.x + b.lean} ${60 - b.h * 0.6} ${b.x + b.lean * 1.6} ${60 - b.h}`}
          stroke={color}
          strokeWidth={b.w}
          strokeLinecap="round"
          fill="none"
          opacity={0.7}
        />
      ))}
    </svg>
  );
}

interface FlowerProps {
  size?: number;
  petalColor?: string;
  centerColor?: string;
  className?: string;
  style?: CSSProperties;
}

export function Flower({
  size = 20,
  petalColor = "#e8a6c8",
  centerColor = "#f2c869",
  className,
  style,
}: FlowerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <line x1="12" y1="14" x2="12" y2="24" stroke="#7fb88a" strokeWidth="1.6" />
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="12"
          cy="7.5"
          rx="3.1"
          ry="5"
          fill={petalColor}
          opacity="0.92"
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="2.8" fill={centerColor} />
    </svg>
  );
}
