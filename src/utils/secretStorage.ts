const KEY = "portfolio:matrix-unlocked";
const WONDERLAND_KEY = "portfolio:wonderland-unlocked";

export function isMatrixUnlocked(): boolean {
  try {
    return localStorage.getItem(KEY) === "true";
  } catch {
    return false;
  }
}

export function setMatrixUnlocked() {
  try {
    localStorage.setItem(KEY, "true");
  } catch {
    // localStorage unavailable — unlock just won't persist across visits
  }
}

export function isWonderlandUnlocked(): boolean {
  try {
    return localStorage.getItem(WONDERLAND_KEY) === "true";
  } catch {
    return false;
  }
}

export function setWonderlandUnlocked() {
  try {
    localStorage.setItem(WONDERLAND_KEY, "true");
  } catch {
    // localStorage unavailable — unlock just won't persist across visits
  }
}
