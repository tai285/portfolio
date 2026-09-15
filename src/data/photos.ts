export interface Photo {
  id: string;
  // Drop your real image at this path (public/photos/...) and it'll
  // replace the placeholder automatically — no code changes needed.
  src: string;
  alt: string;
  category: string;
  caption?: string;
}

// Edit this list freely — add/remove/rename categories as you like.
export const categories = [
  "PRISM 2026",
  "UEC 2026",
  "FYP",
  "Behind the Scenes",
] as const;

export const photos: Photo[] = [
  {
    id: "prism-gold",
    src: "/photos/prism-gold.jpg",
    alt: "Dorothy receiving the PRISM 2026 Gold Award",
    category: "PRISM 2026",
    caption: "Gold Award — PRISM 2026",
  },
  {
    id: "prism-consolation",
    src: "/photos/prism-consolation.jpg",
    alt: "Dorothy receiving the PRISM 2026 Consolation Prize",
    category: "PRISM 2026",
    caption: "Consolation Prize — PRISM 2026",
  },
  {
    id: "prism-team",
    src: "/photos/prism-team.jpg",
    alt: "Project team at PRISM 2026",
    category: "PRISM 2026",
    caption: "With the project team",
  },
  {
    id: "uec-presentation",
    src: "/photos/uec-presentation.jpg",
    alt: "Presenting research at the 8th UEC ASEAN Seminar & Workshop 2026",
    category: "UEC 2026",
    caption: "Presenting at the 8th UEC ASEAN Seminar & Workshop",
  },
  {
    id: "uec-award",
    src: "/photos/uec-award.jpg",
    alt: "Youth Researcher Encouragement Award at UEC 2026",
    category: "UEC 2026",
    caption: "Youth Researcher Encouragement Award",
  },
  {
    id: "fyp-hardware",
    src: "/photos/fyp-hardware.jpg",
    alt: "RFID and ESP32 hardware setup for the FYP",
    category: "FYP",
    caption: "RFID + ESP32 hardware setup",
  },
  {
    id: "fyp-demo",
    src: "/photos/fyp-demo.jpg",
    alt: "Demoing the inventory system",
    category: "FYP",
    caption: "Demo day",
  },
  {
    id: "behind-the-scenes-1",
    src: "/photos/behind-the-scenes-1.jpg",
    alt: "Late night coding session",
    category: "Behind the Scenes",
    caption: "3am debugging, as one does",
  },
];
