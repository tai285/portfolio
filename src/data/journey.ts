export interface JourneyEntry {
  year: string;
  title: string;
  description: string;
  tags: string[];
  badge?: string;
}

export const journey: JourneyEntry[] = [
  {
    year: "Build",
    title: "IoT Foundation",
    description:
      "Designed and built an IoT-based inventory system combining RFID, ESP32, embedded hardware, and software as a Final Year Project.",
    tags: ["RFID", "ESP32", "IoT", "Embedded Systems"],
  },
  {
    year: "Recognition",
    title: "PRISM 2026 — Gold Award",
    description:
      "The Final Year Project received a Gold Award at PRISM 2026, recognising the IoT-based inventory system.",
    tags: ["Gold Award", "FYP"],
    badge: "🥇",
  },
  {
    year: "Recognition",
    title: "PRISM 2026 — Consolation Prize",
    description:
      "The same project also received a Consolation Prize at PRISM 2026, providing a foundation to extend beyond the original IoT implementation.",
    tags: ["Consolation Prize", "FYP"],
    badge: "✦",
  },
  {
    year: "Extension",
    title: "AI + LLM Research",
    description:
      "Extended the project beyond IoT by introducing AI, LLM implementation, and AI tool calling — turning a working system into an intelligent assistant.",
    tags: ["AI", "LLM", "Tool Calling"],
  },
  {
    year: "Research",
    title: "UEC 2026 — Youth Researcher Encouragement Award",
    description:
      "Presented \"AI-driven and LLM-based Assistant Smart Inventory Management System with RFID and IoT\" at the 8th UEC ASEAN Seminar & Workshop 2026.",
    tags: ["UEC 2026", "Research"],
    badge: "✿",
  },
];
