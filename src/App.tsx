import { About } from "./components/About";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Journey } from "./components/Journey";
import { Nav } from "./components/Nav";
import { Playground } from "./components/Playground";
import { Projects } from "./components/Projects";

function App() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--fg)]">
      <Nav />
      <main>
        <Hero />
        <About />
        <Journey />
        <Projects />
        <Playground />
      </main>
      <Footer />
    </div>
  );
}

export default App;
