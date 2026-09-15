import type { ReactNode } from "react";

const SPARKS = [
  { left: "0%", top: "-14px", size: 12, color: "#e0ab2e", duration: "2.4s", delay: "0s" },
  { left: "26%", bottom: "-12px", size: 8, color: "#d9639b", duration: "3s", delay: "0.6s" },
  { left: "52%", top: "-11px", size: 10, color: "#3fb8c9", duration: "2.7s", delay: "1.1s" },
  { right: "6%", bottom: "-13px", size: 9, color: "#4fae6f", duration: "3.3s", delay: "1.6s" },
  { right: "22%", top: "-9px", size: 7, color: "#e0ab2e", duration: "2.9s", delay: "2s" },
];

interface AwardSparkleProps {
  badge: ReactNode;
  /** Gold medal gets its own warm glow + a light sweep across the icon. */
  gold?: boolean;
  children: ReactNode;
}

export function AwardSparkle({ badge, gold = false, children }: AwardSparkleProps) {
  return (
    <span className="relative inline-block">
      <span
        className={
          gold
            ? "gold-glow gold-shine relative inline-block rounded-full align-middle"
            : "align-middle"
        }
      >
        <span aria-hidden="true">{badge}</span>
      </span>{" "}
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
