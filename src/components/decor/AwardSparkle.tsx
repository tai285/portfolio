import type { ReactNode } from "react";

const SPARKS = [
  { left: "-12px", top: "-10px", size: 11, color: "#e0ab2e", duration: "2.4s", delay: "0s" },
  { right: "-11px", top: "-4px", size: 8, color: "#d9639b", duration: "3s", delay: "0.6s" },
  { left: "-6px", bottom: "-10px", size: 9, color: "#3fb8c9", duration: "2.7s", delay: "1.1s" },
];

interface AwardSparkleProps {
  children: ReactNode;
}

export function AwardSparkle({ children }: AwardSparkleProps) {
  return (
    <span className="relative inline-block">
      {children}
      {SPARKS.map((s, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="sparkle-dot"
          style={{
            left: s.left,
            right: s.right,
            top: s.top,
            bottom: s.bottom,
            fontSize: s.size,
            color: s.color,
            animationDuration: s.duration,
            animationDelay: s.delay,
          }}
        >
          ✦
        </span>
      ))}
    </span>
  );
}
