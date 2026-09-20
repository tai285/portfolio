export type SeasonId = "spring" | "summer" | "autumn" | "winter";

export type SeasonEffect = "petals" | "sun-glaze" | "leaves" | "dusty-snow";

export interface Season {
  id: SeasonId;
  name: string;
  emoji: string;
  effect: SeasonEffect;
}

export const seasons: Season[] = [
  { id: "spring", name: "Spring", emoji: "🌸", effect: "petals" },
  { id: "summer", name: "Summer", emoji: "☀️", effect: "sun-glaze" },
  { id: "autumn", name: "Autumn", emoji: "🍂", effect: "leaves" },
  { id: "winter", name: "Winter", emoji: "❄️", effect: "dusty-snow" },
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
