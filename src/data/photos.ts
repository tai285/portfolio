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

// Order matters: this is also the order shown in the "All" carousel/grid,
// so real photos are listed before any category that's still placeholders.
export const photos: Photo[] = [
  {
    id: "uec-award-presentation",
    src: "/photos/uec-award-presentation.jpg",
    alt: "Dorothy receiving the Youth Researcher Encouragement Award at the 8th ASEAN UEC Workshop 2026",
    category: "UEC 2026",
    caption: "Youth Researcher Encouragement Award",
  },
  {
    id: "uec-group-photo",
    src: "/photos/uec-group-photo.jpg",
    alt: "Group photo of all award recipients at the 8th ASEAN UEC Workshop on Informatics and Engineering 2026",
    category: "UEC 2026",
    caption: "All award recipients — 8th ASEAN UEC Workshop 2026",
  },
  {
    id: "uec-with-committee",
    src: "/photos/uec-with-committee.jpg",
    alt: "Dorothy with the organizing committee, holding the award certificate",
    category: "UEC 2026",
    caption: "With the organizing committee",
  },
  {
    id: "uec-young-researchers-selfie",
    src: "/photos/uec-young-researchers-selfie.jpg",
    alt: "Group selfie with fellow young researchers and their certificates",
    category: "UEC 2026",
    caption: "With fellow young researchers",
  },
  {
    id: "uec-celebration",
    src: "/photos/uec-celebration.jpg",
    alt: "Dorothy celebrating with a fellow presenter, both giving a thumbs up",
    category: "UEC 2026",
    caption: "Celebrating after the presentation",
  },
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
