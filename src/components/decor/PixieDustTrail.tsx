import { useEffect, useRef } from "react";

const MAX_DOTS = 26;
const MIN_SPACING = 26; // px moved before spawning the next trail dot
const LIFETIME_MS = 700;
const TAP_BURST_COUNT = 5;

/**
 * A faint sparkle trail that follows the pointer -- the classic
 * Disney/Tinker-Bell "pixie dust" touch. Dots are plain DOM nodes
 * appended/removed imperatively rather than React state, since
 * spawning on every pointermove would otherwise mean a re-render per
 * pixel of cursor movement. Skipped entirely for prefers-reduced-motion.
 *
 * Fine-pointer devices get a continuous trail; touch gets a small
 * sparkle burst on tap instead of a continuous one, since a trail that
 * followed every touchmove would just follow scroll gestures and get
 * in the way.
 */
export function PixieDustTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const liveCount = useRef(0);
  const lastSpawn = useRef({ x: -999, y: -999 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = window.matchMedia("(pointer: fine)").matches;

    function spawnDot(x: number, y: number, size: number) {
      if (liveCount.current >= MAX_DOTS) return;
      const dot = document.createElement("span");
      dot.className = "pixie-dust";
      dot.style.left = `${x - size / 2}px`;
      dot.style.top = `${y - size / 2}px`;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;

      containerRef.current?.appendChild(dot);
      liveCount.current += 1;
      setTimeout(() => {
        dot.remove();
        liveCount.current -= 1;
      }, LIFETIME_MS);
    }

    function onPointerMove(e: PointerEvent) {
      if (!fine || e.pointerType !== "mouse") return;
      const dx = e.clientX - lastSpawn.current.x;
      const dy = e.clientY - lastSpawn.current.y;
      if (dx * dx + dy * dy < MIN_SPACING * MIN_SPACING) return;
      lastSpawn.current = { x: e.clientX, y: e.clientY };
      spawnDot(e.clientX, e.clientY, 4 + Math.random() * 5);
    }

    function onPointerDown(e: PointerEvent) {
      if (e.pointerType !== "touch") return;
      for (let i = 0; i < TAP_BURST_COUNT; i++) {
        const angle = (i / TAP_BURST_COUNT) * Math.PI * 2;
        const dist = 10 + Math.random() * 14;
        spawnDot(
          e.clientX + Math.cos(angle) * dist,
          e.clientY + Math.sin(angle) * dist,
          5 + Math.random() * 4,
        );
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return <div ref={containerRef} aria-hidden="true" />;
}
