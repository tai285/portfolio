export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

/** Dorothy's own real-life milestones -- always shown as earned, not
 * something a visitor unlocks. Pulled from the same accomplishments in
 * journey.ts, just recast as a little trophy case. */
export const milestoneAchievements: Achievement[] = [
  {
    id: "gold-award",
    title: "PRISM 2026 — Gold Award",
    description: "Top honour for the AI-driven IoT inventory system.",
    icon: "🥇",
  },
  {
    id: "consolation-prize",
    title: "PRISM 2026 — Consolation Prize",
    description: "A second recognition for the same project.",
    icon: "✦",
  },
  {
    id: "youth-researcher",
    title: "UEC 2026 — Youth Researcher Award",
    description: "Presented AI + LLM research at the 8th ASEAN UEC Workshop.",
    icon: "✿",
  },
  {
    id: "fyp-shipped",
    title: "Shipped a Final Year Project",
    description: "RFID + ESP32 inventory system, built end to end.",
    icon: "🔧",
  },
  {
    id: "ai-extension",
    title: "Extended into AI + LLM research",
    description: "Turned a working system into an intelligent assistant.",
    icon: "🤖",
  },
];

/** Secret badges for finding this site's hidden corners -- hidden
 * (shown as "???") until unlocked, tracked in localStorage via
 * utils/achievements.ts. This is the payoff for the CTF-style easter
 * eggs, which otherwise had no visible trophy case. */
export const hiddenAchievements: Achievement[] = [
  {
    id: "cracked-the-code",
    title: "Cracked the Code",
    description: "Found the Konami code (or its swipe equivalent).",
    icon: "🐇",
  },
  {
    id: "down-the-rabbit-hole",
    title: "Down the Rabbit Hole",
    description: "Solved the terminal riddle and entered the Matrix page.",
    icon: "💊",
  },
  {
    id: "whisper-of-magic",
    title: "Whisper of Magic",
    description: "Said the word of power and unlocked Wonderland.",
    icon: "🪄",
  },
  {
    id: "hidden-spark",
    title: "Hidden Spark",
    description: "Clicked the logo just a few too many times.",
    icon: "✨",
  },
  {
    id: "left-your-mark",
    title: "Left Your Mark",
    description: "Signed the guestbook.",
    icon: "💌",
  },
  {
    id: "theme-explorer",
    title: "Theme Explorer",
    description: "Tried all four color themes.",
    icon: "🎨",
  },
  {
    id: "four-seasons",
    title: "Four Seasons",
    description: "Cycled through every seasonal effect.",
    icon: "🍂",
  },
  {
    id: "quiz-whiz",
    title: "Quiz Whiz",
    description: "Got a perfect score on the trivia game.",
    icon: "🧠",
  },
  {
    id: "matchmaker",
    title: "Matchmaker",
    description: "Won the memory match game.",
    icon: "🃏",
  },
];

export const allAchievements: Achievement[] = [...milestoneAchievements, ...hiddenAchievements];
