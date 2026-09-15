const KEY = "portfolio:matrix-unlocked";

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
