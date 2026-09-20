const UNLOCKED_KEY = "portfolio:achievements-unlocked";

type Listener = (id: string) => void;
let listeners: Listener[] = [];

function readUnlocked(): Set<string> {
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

let unlockedCache = readUnlocked();

export function getUnlockedAchievements(): Set<string> {
  return unlockedCache;
}

/** Idempotent -- unlocking an already-unlocked id is a no-op, so every
 * call site can call this unconditionally on the triggering event. */
export function unlockAchievement(id: string) {
  if (unlockedCache.has(id)) return;
  unlockedCache = new Set(unlockedCache).add(id);
  try {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify([...unlockedCache]));
  } catch {
    // ignore -- per-viewer convenience only
  }
  for (const l of listeners) l(id);
}

/** Returns an unsubscribe function. Used by the Achievements section
 * (to re-render live) and the toast host (to announce new unlocks) --
 * neither needs to be the one calling unlockAchievement, so nothing
 * needs to be prop-drilled to the many components that do. */
export function subscribeAchievements(listener: Listener): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function trackCollection(storageKey: string, achievementId: string, itemId: string, total: number) {
  let set: Set<string>;
  try {
    const raw = localStorage.getItem(storageKey);
    set = new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    set = new Set();
  }
  if (set.has(itemId)) return;
  set.add(itemId);
  try {
    localStorage.setItem(storageKey, JSON.stringify([...set]));
  } catch {
    // ignore -- per-viewer convenience only
  }
  if (set.size >= total) unlockAchievement(achievementId);
}

/** "Tried all 4 base color themes" -- counts distinct ids seen, so it
 * still fires correctly even if Wonderland gets picked in between. */
export function trackThemeTried(flavorId: string) {
  trackCollection("portfolio:themes-tried", "theme-explorer", flavorId, 4);
}

export function trackSeasonTried(seasonId: string) {
  trackCollection("portfolio:seasons-tried", "four-seasons", seasonId, 4);
}
