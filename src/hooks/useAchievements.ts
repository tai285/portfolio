import { useEffect, useState } from "react";
import { getUnlockedAchievements, subscribeAchievements } from "../utils/achievements";

/** Re-renders whenever anything, anywhere, calls unlockAchievement. */
export function useAchievements(): Set<string> {
  const [unlocked, setUnlocked] = useState(getUnlockedAchievements);

  useEffect(() => subscribeAchievements(() => setUnlocked(getUnlockedAchievements())), []);

  return unlocked;
}
