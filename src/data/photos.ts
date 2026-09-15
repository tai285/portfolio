export interface Photo {
  id: string;
  // Relative path (no leading "/") -- resolves correctly whether the
  // site is served from the domain root or a GitHub Pages subpath like
  // /portfolio/. Drop your real image at the matching path under
  // public/photos/<category-folder>/ and it replaces the placeholder
  // automatically, no code changes needed.
  src: string;
  alt: string;
  category: string;
  caption?: string;
}

// Edit this list freely — add/remove/rename categories as you like.
// Each category has its own folder under public/photos/ (see below).
export const categories = [
  "PRISM 2026",
  "UEC 2026",
  "FYP",
  "Behind the Scenes",
] as const;

// Where to put your photo files, one folder per category:
//   public/photos/prism-2026/
//   public/photos/uec-2026/
//   public/photos/fyp/
//   public/photos/behind-the-scenes/
// Then add (or edit) an entry below pointing at the filename you used.
//
// Order matters: this is also the order shown in the "All" carousel/grid,
// so real photos are listed before any category that's still placeholders.
export const photos: Photo[] = [
  {
    id: "uec-award-presentation",
    src: "photos/uec-2026/uec-award-presentation.jpg",
    alt: "Dorothy receiving the Youth Researcher Encouragement Award at the 8th ASEAN UEC Workshop 2026",
    category: "UEC 2026",
    caption: "Youth Researcher Encouragement Award",
  },
  {
    id: "uec-group-photo",
    src: "photos/uec-2026/uec-group-photo.jpg",
    alt: "Group photo of all award recipients at the 8th ASEAN UEC Workshop on Informatics and Engineering 2026",
    category: "UEC 2026",
    caption: "All award recipients — 8th ASEAN UEC Workshop 2026",
  },
  {
    id: "uec-with-committee",
    src: "photos/uec-2026/uec-with-committee.jpg",
    alt: "Dorothy with the organizing committee, holding the award certificate",
    category: "UEC 2026",
    caption: "With the organizing committee",
  },
  {
    id: "uec-young-researchers-selfie",
    src: "photos/uec-2026/uec-young-researchers-selfie.jpg",
    alt: "Group selfie with fellow young researchers and their certificates",
    category: "UEC 2026",
    caption: "With fellow young researchers",
  },
  {
    id: "uec-celebration",
    src: "photos/uec-2026/uec-celebration.jpg",
    alt: "Dorothy celebrating with a fellow presenter, both giving a thumbs up",
    category: "UEC 2026",
    caption: "Celebrating after the presentation",
  },
  {
    id: "prism-gold",
    src: "photos/prism-2026/prism-gold.jpg",
    alt: "Dorothy receiving the PRISM 2026 Gold Award",
    category: "PRISM 2026",
    caption: "Gold Award — PRISM 2026",
  },
  {
    id: "prism-consolation",
    src: "photos/prism-2026/prism-consolation.jpg",
    alt: "Dorothy receiving the PRISM 2026 Consolation Prize",
    category: "PRISM 2026",
    caption: "Consolation Prize — PRISM 2026",
  },
  {
    id: "prism-team",
    src: "photos/prism-2026/prism-team.jpg",
    alt: "Project team at PRISM 2026",
    category: "PRISM 2026",
    caption: "With the project team",
  },
  {
    id: "fyp-hardware",
    src: "photos/fyp/fyp-hardware.jpg",
    alt: "RFID and ESP32 hardware setup for the FYP",
    category: "FYP",
    caption: "RFID + ESP32 hardware setup",
  },
  {
    id: "fyp-demo",
    src: "photos/fyp/fyp-demo.jpg",
    alt: "Demoing the inventory system",
    category: "FYP",
    caption: "Demo day",
  },
  {
    id: "behind-the-scenes-1",
    src: "photos/behind-the-scenes/behind-the-scenes-1.jpg",
    alt: "Late night coding session",
    category: "Behind the Scenes",
    caption: "3am debugging, as one does",
  },
];
