import { useEffect, useRef } from "react";

const HOLD_MS = 1400;
const MOVE_CANCEL_PX = 12;

function isInteractive(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  return !!el?.closest("button, a, input, textarea, select, [role='button'], [contenteditable='true']");
}

/**
 * Touch equivalent of the "type magic" easter egg -- typing has no
 * natural mobile analogue, so holding a finger still on an empty spot
 * for a bit (like making a wish) triggers the same unlock. Cancels if
 * the touch moves too far (so it doesn't fire during a scroll) or
 * starts on an interactive element (so it doesn't fight normal taps).
 */
export function useMagicPressEgg(onUnlock: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function cancel() {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      start.current = null;
    }

    function onTouchStart(e: TouchEvent) {
      if (isInteractive(e.target)) return;
      const t = e.touches[0];
      if (!t) return;
      start.current = { x: t.clientX, y: t.clientY };
      timer.current = setTimeout(() => {
        timer.current = null;
        start.current = null;
        onUnlock();
      }, HOLD_MS);
    }

    function onTouchMove(e: TouchEvent) {
      if (!start.current) return;
      const t = e.touches[0];
      if (!t) return;
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;
      if (Math.hypot(dx, dy) > MOVE_CANCEL_PX) cancel();
    }

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", cancel, { passive: true });
    window.addEventListener("touchcancel", cancel, { passive: true });
    return () => {
      cancel();
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", cancel);
      window.removeEventListener("touchcancel", cancel);
    };
  }, [onUnlock]);
}
