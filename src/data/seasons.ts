export type SeasonId = "spring" | "summer" | "autumn" | "winter";

export interface Season {
  id: SeasonId;
  name: string;
  emoji: string;
  /** Glyphs used for the falling weather particles. */
  glyphs: string[];
  /** Particles drift upward (like embers/motes) instead of falling. */
  drift?: "up" | "down";
}

export const seasons: Season[] = [
  { id: "spring", name: "Spring", emoji: "🌸", glyphs: ["🌸", "🌷", "💮"], drift: "down" },
  { id: "summer", name: "Summer", emoji: "☀️", glyphs: ["✨", "☀️"], drift: "up" },
  { id: "autumn", name: "Autumn", emoji: "🍂", glyphs: ["🍂", "🍁"], drift: "down" },
  { id: "winter", name: "Winter", emoji: "❄️", glyphs: ["❄️", "❅"], drift: "down" },
];

/** Northern-hemisphere calendar mapping -- a whimsical stand-in, not a
 * literal claim about the visitor's actual weather. */
export function seasonForMonth(month: number): SeasonId {
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

export function currentSeasonId(): SeasonId {
  return seasonForMonth(new Date().getMonth());
}
