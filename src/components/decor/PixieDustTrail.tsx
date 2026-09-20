import { useEffect, useRef } from "react";

const MAX_DOTS = 40;
const MIN_SPACING = 18; // px moved before spawning the next dot
const LIFETIME_MS = 750;

/**
 * A faint sparkle trail that follows the pointer -- the classic
 * Disney/Tinker-Bell "pixie dust" touch. Fine-pointer devices only (a
 * touch trail would just follow scroll gestures and get in the way on
 * mobile), and skipped entirely for prefers-reduced-motion. Dots are
 * plain DOM nodes appended/removed imperatively rather than React
 * state, since spawning on every pointermove would otherwise mean a
 * re-render per pixel of cursor movement.
 */
export function PixieDustTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const liveCount = useRef(0);
  const lastSpawn = useRef({ x: -999, y: -999 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    function onPointerMove(e: PointerEvent) {
      const dx = e.clientX - lastSpawn.current.x;
      const dy = e.clientY - lastSpawn.current.y;
      if (dx * dx + dy * dy < MIN_SPACING * MIN_SPACING) return;
      if (liveCount.current >= MAX_DOTS) return;
      lastSpawn.current = { x: e.clientX, y: e.clientY };

      const size = 4 + Math.random() * 5;
      const dot = document.createElement("span");
      dot.className = "pixie-dust";
      dot.style.left = `${e.clientX - size / 2}px`;
      dot.style.top = `${e.clientY - size / 2}px`;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;

      containerRef.current?.appendChild(dot);
      liveCount.current += 1;
      setTimeout(() => {
        dot.remove();
        liveCount.current -= 1;
      }, LIFETIME_MS);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return <div ref={containerRef} aria-hidden="true" />;
}
