import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Achievements } from "./components/Achievements";
import { AchievementToastHost } from "./components/AchievementToastHost";
import { About } from "./components/About";
import { Album } from "./components/album/Album";
import { PixieDustTrail } from "./components/decor/PixieDustTrail";
import { SeasonWeather } from "./components/decor/SeasonWeather";
import { Footer } from "./components/Footer";
import { Guestbook } from "./components/Guestbook";
import { Hero } from "./components/Hero";
import { Journey } from "./components/Journey";
import { Nav } from "./components/Nav";
import { Playground } from "./components/Playground";
import { Projects } from "./components/Projects";
import { AccessDenied } from "./components/secret/AccessDenied";
import { MatrixPage } from "./components/secret/MatrixPage";
import { Terminal } from "./components/secret/Terminal";
import { WonderlandReveal } from "./components/secret/WonderlandReveal";
import { themeFlavors } from "./data/themeFlavors";
import { useHash } from "./hooks/useHash";
import { useMagicPressEgg } from "./hooks/useMagicPressEgg";
import { useMagicWordEgg } from "./hooks/useMagicWordEgg";
import { useSeasonSettings } from "./hooks/useSeasonSettings";
import { useSecretSequence } from "./hooks/useSecretSequence";
import { useThemeSettings } from "./hooks/useThemeSettings";
import { unlockAchievement } from "./utils/achievements";
import { playChime } from "./utils/chime";
import { printConsoleEasterEgg } from "./utils/consoleEasterEgg";
import { isMatrixUnlocked, setMatrixUnlocked } from "./utils/secretStorage";

const wonderlandFlavor = themeFlavors.find((f) => f.id === "wonderland")!;

// Lazy: the whole CMS (7 editors + guestbook moderation + Firebase
// auth) only needs to be downloaded by someone who actually opens
// #/admin, not by every visitor to the public site.
const Admin = lazy(() => import("./pages/Admin").then((m) => ({ default: m.Admin })));

const MATRIX_HASH = "#/the-matrix";
const ADMIN_HASH = "#/admin";

function App() {
  const [hash, setHash] = useHash();
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(() => isMatrixUnlocked());
  const [wonderlandReveal, setWonderlandReveal] = useState(false);
  const themeSettings = useThemeSettings();
  const seasonSettings = useSeasonSettings();

  useEffect(() => {
    printConsoleEasterEgg();
  }, []);

  const openTerminal = useCallback(() => {
    unlockAchievement("cracked-the-code");
    if (unlocked) return;
    setTerminalOpen(true);
  }, [unlocked]);

  useSecretSequence(openTerminal);

  const handleMagicWord = useCallback(() => {
    unlockAchievement("whisper-of-magic");
    themeSettings.unlockWonderland();
    playChime(wonderlandFlavor.chime);
    setWonderlandReveal(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMagicWordEgg(handleMagicWord);
  useMagicPressEgg(handleMagicWord);

  const inMatrix = hash === MATRIX_HASH;
  const showAccessDenied = inMatrix && !unlocked;

  function handleSolved() {
    unlockAchievement("down-the-rabbit-hole");
    setMatrixUnlocked();
    setUnlocked(true);
  }

  function handleEnterMatrix() {
    setTerminalOpen(false);
    setHash(MATRIX_HASH);
  }

  function handleExitMatrix() {
    setHash("#");
  }

  if (inMatrix && unlocked) {
    return <MatrixPage onExit={handleExitMatrix} />;
  }

  if (hash === ADMIN_HASH) {
    return (
      <Suspense
        fallback={<p className="mt-24 text-center text-sm text-[var(--fg-muted)]">Loading…</p>}
      >
        <Admin />
      </Suspense>
    );
  }

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--fg)]">
      <SeasonWeather season={seasonSettings.activeSeason} />
      <PixieDustTrail />
      <Nav unlocked={unlocked} themeSettings={themeSettings} seasonSettings={seasonSettings} />
      <main>
        <Hero />
        <About />
        <Journey />
        <Projects />
        <Album />
        <Playground />
        <Achievements />
        <Guestbook />
      </main>
      <Footer />
      <AchievementToastHost />

      <AnimatePresence>
        {terminalOpen && (
          <Terminal
            onClose={() => {
              if (unlocked) {
                handleEnterMatrix();
              } else {
                setTerminalOpen(false);
              }
            }}
            onSolved={handleSolved}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAccessDenied && <AccessDenied onDismiss={() => setHash("#")} />}
      </AnimatePresence>

      <AnimatePresence>
        {wonderlandReveal && (
          <WonderlandReveal onDismiss={() => setWonderlandReveal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
