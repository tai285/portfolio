export interface ThemePalette {
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  accent2: string;
  bg: string;
  bgAlt: string;
  surface: string;
  fg: string;
  fgMuted: string;
  border: string;
}

export interface ThemeChime {
  /** Base note in Hz -- each flavor gets its own pitch/character. */
  baseFreq: number;
  waveform: OscillatorType;
  /** "single" = one soft bell. "twinkle" = two quick ascending notes. */
  style: "single" | "twinkle";
}

export interface ThemeFlavor {
  id: string;
  name: string;
  emoji: string;
  /** Swatch shown in the theme picker (a representative accent color). */
  swatch: string;
  light: ThemePalette;
  dark: ThemePalette;
  /** "r, g, b" -- used as rgba(var(--particle-rgb), alpha) for fireflies. */
  particleRgb: string;
  grassColor: string;
  flowerColors: string[];
  chime: ThemeChime;
  /** Hidden from the picker until its easter egg is found. */
  secret?: boolean;
}

export const themeFlavors: ThemeFlavor[] = [
  {
    id: "fairy-garden",
    name: "Fairy Garden",
    emoji: "🧚",
    swatch: "#b98dd4",
    light: {
      primary: "#8f6ba8",
      primaryLight: "#b98dd4",
      secondary: "#e5a6c8",
      accent: "#9edde3",
      accent2: "#8aa7e8",
      bg: "#fdf9ff",
      bgAlt: "#f6ecfb",
      surface: "#ffffff",
      fg: "#3d2e4a",
      fgMuted: "#7a6a8a",
      border: "#e8d9f5",
    },
    dark: {
      primary: "#8f6ba8",
      primaryLight: "#b98dd4",
      secondary: "#e5a6c8",
      accent: "#9edde3",
      accent2: "#8aa7e8",
      bg: "#16121f",
      bgAlt: "#1e1830",
      surface: "#221b32",
      fg: "#f3eaf8",
      fgMuted: "#c3b3d6",
      border: "#3a2e4d",
    },
    particleRgb: "255, 216, 115",
    grassColor: "#7fb88a",
    flowerColors: ["#d9639b", "#b98dd4", "#9edde3", "#f2c869", "#e8a6c8"],
    chime: { baseFreq: 660, waveform: "sine", style: "single" },
  },
  {
    id: "moonlit-grove",
    name: "Moonlit Grove",
    emoji: "🌙",
    swatch: "#8b9ef0",
    light: {
      primary: "#5b6fd6",
      primaryLight: "#8b9ef0",
      secondary: "#9d8fe0",
      accent: "#6fd1e8",
      accent2: "#b7a4f0",
      bg: "#f3f5ff",
      bgAlt: "#e9ecfb",
      surface: "#ffffff",
      fg: "#2b2d52",
      fgMuted: "#6a6e9a",
      border: "#dadef7",
    },
    dark: {
      primary: "#5b6fd6",
      primaryLight: "#8b9ef0",
      secondary: "#9d8fe0",
      accent: "#6fd1e8",
      accent2: "#b7a4f0",
      bg: "#0e0f24",
      bgAlt: "#171933",
      surface: "#1c1e3d",
      fg: "#eceaff",
      fgMuted: "#b3aee0",
      border: "#2c2f57",
    },
    particleRgb: "165, 200, 255",
    grassColor: "#5f7fae",
    flowerColors: ["#8b9ef0", "#b7a4f0", "#6fd1e8", "#c9c2f5", "#5b6fd6"],
    chime: { baseFreq: 523, waveform: "triangle", style: "single" },
  },
  {
    id: "cherry-blossom",
    name: "Cherry Blossom",
    emoji: "🌸",
    swatch: "#f2a6c2",
    light: {
      primary: "#d9678f",
      primaryLight: "#f2a6c2",
      secondary: "#f6c9dc",
      accent: "#ffd9b3",
      accent2: "#ffb6c9",
      bg: "#fff6f8",
      bgAlt: "#ffeaf0",
      surface: "#ffffff",
      fg: "#4a2c37",
      fgMuted: "#8a6470",
      border: "#ffdce8",
    },
    dark: {
      primary: "#d9678f",
      primaryLight: "#f2a6c2",
      secondary: "#f6c9dc",
      accent: "#ffd9b3",
      accent2: "#ffb6c9",
      bg: "#201017",
      bgAlt: "#2b1620",
      surface: "#331b27",
      fg: "#ffeef3",
      fgMuted: "#d8a9b6",
      border: "#4a2733",
    },
    particleRgb: "255, 195, 210",
    grassColor: "#a8c98a",
    flowerColors: ["#f2a6c2", "#ffd9b3", "#f6c9dc", "#e88fb0", "#ffb6c9"],
    chime: { baseFreq: 784, waveform: "sine", style: "twinkle" },
  },
  {
    id: "starlight-wish",
    name: "Starlight Wish",
    emoji: "✨",
    swatch: "#f2d98b",
    light: {
      primary: "#7a5fd1",
      primaryLight: "#a78bfa",
      secondary: "#f2d98b",
      accent: "#8fe3d0",
      accent2: "#c9a6f5",
      bg: "#f8f5ff",
      bgAlt: "#efe7fc",
      surface: "#ffffff",
      fg: "#362a52",
      fgMuted: "#786a9a",
      border: "#e3d6fa",
    },
    dark: {
      primary: "#7a5fd1",
      primaryLight: "#a78bfa",
      secondary: "#f2d98b",
      accent: "#8fe3d0",
      accent2: "#c9a6f5",
      bg: "#120c24",
      bgAlt: "#1c1338",
      surface: "#241a44",
      fg: "#f2ecff",
      fgMuted: "#bba9dd",
      border: "#362a5c",
    },
    particleRgb: "245, 220, 140",
    grassColor: "#6fae9e",
    flowerColors: ["#a78bfa", "#f2d98b", "#c9a6f5", "#8fe3d0", "#7a5fd1"],
    chime: { baseFreq: 880, waveform: "sine", style: "twinkle" },
  },
  {
    id: "wonderland",
    name: "Wonderland",
    emoji: "🪄",
    swatch: "#ff5fa2",
    secret: true,
    light: {
      primary: "#ff5fa2",
      primaryLight: "#ff8fc2",
      secondary: "#ffd166",
      accent: "#3ddad7",
      accent2: "#8f6ba8",
      bg: "#fff9f0",
      bgAlt: "#ffeedc",
      surface: "#ffffff",
      fg: "#3a1f3d",
      fgMuted: "#8a6a8f",
      border: "#ffd9ec",
    },
    dark: {
      primary: "#ff5fa2",
      primaryLight: "#ff8fc2",
      secondary: "#ffd166",
      accent: "#3ddad7",
      accent2: "#8f6ba8",
      bg: "#1a0f1f",
      bgAlt: "#241628",
      surface: "#2c1a30",
      fg: "#ffeaf6",
      fgMuted: "#d6a9c8",
      border: "#4a2a4d",
    },
    particleRgb: "255, 209, 102",
    grassColor: "#3ddad7",
    flowerColors: ["#ff5fa2", "#ffd166", "#3ddad7", "#8f6ba8", "#ff8fc2"],
    chime: { baseFreq: 988, waveform: "sine", style: "twinkle" },
  },
];

export const defaultThemeFlavor = themeFlavors[0];
