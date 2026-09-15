export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: "AI-Driven Smart Inventory Management System",
    description:
      "RFID + ESP32 based inventory system extended with LLM implementation and AI tool calling. Gold Award at PRISM 2026; presented as research at UEC 2026.",
    tags: ["RFID", "ESP32", "Python", "Flask", "LLM", "Tool Calling"],
    // TODO: link to the project repo or demo once it's public
    link: "",
    featured: true,
  },
  // TODO: add more projects here as you build them
  {
    title: "Your Next Project",
    description: "A short description of what it does and why you built it.",
    tags: ["Tag 1", "Tag 2"],
    link: "",
  },
];
