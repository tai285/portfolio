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
    }

    function onTouchEnd(e: TouchEvent) {
      const start = touchStart.current;
      touchStart.current = null;
      if (!start) return;

      const t = e.changedTouches?.[0];
      if (!t) return;
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
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
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onUnlock]);
}
