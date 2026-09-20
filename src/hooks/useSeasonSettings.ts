import { useState } from "react";
import { currentSeasonId, seasons, type SeasonId } from "../data/seasons";

const SEASON_KEY = "theme-season";
type StoredSeason = SeasonId | "auto";

function readStored(): StoredSeason {
  try {
    const stored = localStorage.getItem(SEASON_KEY);
    if (stored === "auto" || seasons.some((s) => s.id === stored)) {
      return stored as StoredSeason;
    }
  } catch {
    // localStorage unavailable -- fall through
  }
  return "auto";
}

/**
 * Independent of the color theme -- picks which falling-weather effect
 * plays over the fireflies. "auto" (the default) follows the real
 * calendar so the site quietly changes with the seasons; picking one
 * explicitly overrides that.
 */
export function useSeasonSettings() {
  const [seasonChoice, setSeasonChoiceState] = useState<StoredSeason>(readStored);

  const resolvedId: SeasonId = seasonChoice === "auto" ? currentSeasonId() : seasonChoice;
  const activeSeason = seasons.find((s) => s.id === resolvedId) ?? seasons[0];

  function setSeasonChoice(choice: StoredSeason) {
    setSeasonChoiceState(choice);
    try {
      localStorage.setItem(SEASON_KEY, choice);
    } catch {
      // ignore -- per-viewer convenience only
    }
  }

  return { seasonChoice, setSeasonChoice, activeSeason, seasons };
}
