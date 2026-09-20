export interface Profile {
  name: string;
  shortName: string;
  tagline: string;
  subtagline: string;
  socials: {
    github: string;
    email: string;
    linkedin: string;
  };
  bio: string[];
}

export interface JourneyEntry {
  year: string;
  title: string;
  description: string;
  tags: string[];
  badge?: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  featured?: boolean;
}

export interface Photo {
  id: string;
  // A public/photos/... path (existing static photos) or a base64
  // data: URI (photos uploaded via the CMS -- see PhotosEditor). Each
  // photo lives in its own Firestore document specifically so a data
  // URI's size only has to fit under ONE document's 1MiB cap, not
  // share that budget with every other photo.
  src: string;
  alt: string;
  category: string;
  caption?: string;
  order: number;
}

export interface PhotosCategories {
  categories: string[];
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MemoryCardDef {
  label: string;
  emoji: string;
}

// Firestore docs must be objects, not bare arrays, so each list-shaped
// content type is wrapped in a single field.
export interface JourneyContent {
  entries: JourneyEntry[];
}

export interface ProjectsContent {
  entries: Project[];
}

export interface TriviaContent {
  questions: TriviaQuestion[];
}

export interface MemoryCardsContent {
  cards: MemoryCardDef[];
}

export interface FunFactsContent {
  facts: string[];
}

export interface GuestbookMessage {
  id: string;
  name: string;
  message: string;
  createdAt: number | null;
  approved: boolean;
}
