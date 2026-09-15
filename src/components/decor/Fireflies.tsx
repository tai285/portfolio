import { useEffect, useMemo, useRef, type RefObject } from "react";
import { mulberry32 } from "../../utils/random";
import { FireflyDot, type FireflyHandle } from "./FireflyDot";

interface FireflySpec {
  id: number;
  left: number;
  top: number;
  delay: number;
  size: number;
  layer: "back" | "front";
}

function useFireflyField(count: number, seed: number, layer: "back" | "front") {
  return useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      delay: rand() * 8,
      size: layer === "front" ? 6 + rand() * 8 : 3 + rand() * 4,
      layer,
    }));
  }, [count, seed, layer]);
}

function FireflyField({
  fireflies,
  className,
  handles,
}: {
  fireflies: FireflySpec[];
  className: string;
  handles: RefObject<(FireflyHandle | null)[]>;
}) {
  return (
    <div aria-hidden="true" className={className}>
      {fireflies.map((f, i) => (
        <FireflyDot
          key={f.id}
          ref={(el) => {
            handles.current[i] = el;
          }}
          left={f.left}
          top={f.top}
          delay={f.delay}
          size={f.size}
          layer={f.layer}
        />
      ))}
    </div>
  );
}

export function Fireflies() {
  // "Back" ones are smaller, hazier and slower -- read as farther away.
  // "Front" ones are bigger, brighter and a touch more energetic.
  const back = useFireflyField(6, 202, "back");
  const front = useFireflyField(9, 101, "front");

  const backHandles = useRef<(FireflyHandle | null)[]>([]);
  const frontHandles = useRef<(FireflyHandle | null)[]>([]);

  useEffect(() => {
    const allHandles = () => [...backHandles.current, ...frontHandles.current];

    function onPointerDown(e: PointerEvent) {
      for (const h of allHandles()) h?.scatterFrom(e.clientX, e.clientY);
    }

    let lastY = window.scrollY;
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const delta = window.scrollY - lastY;
        lastY = window.scrollY;
        if (Math.abs(delta) > 3) {
          const dy = Math.max(-26, Math.min(26, -delta * 0.5));
          for (const h of allHandles()) h?.stir(dy);
        }
        ticking = false;
      });
    }

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <FireflyField
        fireflies={back}
        handles={backHandles}
        className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      />
      <FireflyField
        fireflies={front}
        handles={frontHandles}
        className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      />
    </>
  );
}
