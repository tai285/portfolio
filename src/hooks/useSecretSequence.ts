import { useEffect, useRef } from "react";

type Token = "up" | "down" | "left" | "right" | "primary" | "secondary";

// Desktop: the classic Konami code (arrows + B, A).
// Mobile: swipe the same up/up/down/down/left/right/left/right pattern,
// then tap the left half of the screen, then the right half (mirrors two
// distinct buttons). Both feed the same progress counter.
const SEQUENCE: Token[] = [
  "up",
  "up",
  "down",
  "down",
  "left",
  "right",
  "left",
  "right",
  "primary",
  "secondary",
];

const SWIPE_THRESHOLD = 60;
const TAP_THRESHOLD = 12;
const MAX_GESTURE_MS = 800;

const KEY_TOKEN: Record<string, Token> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

export function useSecretSequence(onUnlock: () => void) {
  const progress = useRef(0);
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);
  // iOS Safari frequently fires touchcancel instead of touchend the
  // moment it hands a vertical/horizontal drag off to native scrolling
  // (Android tends to still fire touchend in the same situation). Track
  // the latest point via touchmove so the gesture can be resolved
  // either way, instead of only trusting touchend's own coordinates.
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    function feed(token: Token) {
      const expected = SEQUENCE[progress.current];
      if (token === expected) {
        progress.current += 1;
        if (progress.current === SEQUENCE.length) {
          progress.current = 0;
          onUnlock();
        }
      } else {
        progress.current = token === SEQUENCE[0] ? 1 : 0;
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const token =
        KEY_TOKEN[e.key] ??
        (key === "b" ? "primary" : key === "a" ? "secondary" : undefined);
      if (token) feed(token);
    }

    function onTouchStart(e: TouchEvent) {
      const t = e.changedTouches?.[0];
      if (!t) return;
      touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
      lastPoint.current = { x: t.clientX, y: t.clientY };
    }

    function onTouchMove(e: TouchEvent) {
      const t = e.changedTouches?.[0];
      if (!t) return;
      lastPoint.current = { x: t.clientX, y: t.clientY };
    }

    function resolveGesture(e: TouchEvent) {
      const start = touchStart.current;
      touchStart.current = null;
      if (!start) return;

      // Prefer the event's own end point; fall back to the last point
      // seen via touchmove, since a cancelled gesture's changedTouches
      // can be stale or missing on iOS.
      const end = e.changedTouches?.[0]
        ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
        : lastPoint.current;
      lastPoint.current = null;
      if (!end) return;

      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dt = Date.now() - start.t;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (dt > MAX_GESTURE_MS) return;

      if (absX < TAP_THRESHOLD && absY < TAP_THRESHOLD) {
        const half = window.innerWidth / 2;
        feed(start.x < half ? "primary" : "secondary");
        return;
      }

      if (Math.max(absX, absY) < SWIPE_THRESHOLD) return;

      if (absX > absY) {
        feed(dx > 0 ? "right" : "left");
      } else {
        feed(dy > 0 ? "down" : "up");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", resolveGesture, { passive: true });
    window.addEventListener("touchcancel", resolveGesture, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", resolveGesture);
      window.removeEventListener("touchcancel", resolveGesture);
    };
  }, [onUnlock]);
}
