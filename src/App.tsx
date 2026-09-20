import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { About } from "./components/About";
import { Album } from "./components/album/Album";
import { Fireflies } from "./components/decor/Fireflies";
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
import { useHash } from "./hooks/useHash";
import { useSecretSequence } from "./hooks/useSecretSequence";
import { printConsoleEasterEgg } from "./utils/consoleEasterEgg";
import { isMatrixUnlocked, setMatrixUnlocked } from "./utils/secretStorage";

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

  useEffect(() => {
    printConsoleEasterEgg();
  }, []);

  const openTerminal = useCallback(() => {
    if (unlocked) return;
    setTerminalOpen(true);
  }, [unlocked]);

  useSecretSequence(openTerminal);

  const inMatrix = hash === MATRIX_HASH;
  const showAccessDenied = inMatrix && !unlocked;

  function handleSolved() {
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
      <Fireflies />
      <Nav unlocked={unlocked} />
      <main>
        <Hero />
        <About />
        <Journey />
        <Projects />
        <Album />
        <Playground />
        <Guestbook />
      </main>
      <Footer />

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
    </div>
  );
}

export default App;
