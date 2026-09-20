import { useState } from "react";
import { isSoundEnabled, playChime, setSoundEnabled } from "../utils/chime";

/** Thin React wrapper around utils/chime.ts for the on/off toggle UI. */
export function useThemeSound() {
  const [enabled, setEnabledState] = useState(isSoundEnabled);

  function toggleEnabled() {
    setEnabledState((e) => {
      const next = !e;
      setSoundEnabled(next);
      return next;
    });
  }

  return { enabled, toggleEnabled, playChime };
}
