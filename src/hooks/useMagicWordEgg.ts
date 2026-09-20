import { useEffect, useRef } from "react";

const WORD = "magic";

/**
 * Type "magic" anywhere on the page (keyboard-only -- see
 * useMagicPressEgg for the touch equivalent, a long press). Ignores
 * typing while an input, textarea, or contentEditable element is
 * focused, so it doesn't fire while someone's filling out the
 * guestbook.
 */
export function useMagicWordEgg(onUnlock: () => void) {
  const buffer = useRef("");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;

      buffer.current = (buffer.current + e.key.toLowerCase()).slice(-WORD.length);
      if (buffer.current === WORD) {
        buffer.current = "";
        onUnlock();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onUnlock]);
}
