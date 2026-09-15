import { useEffect, useMemo, useRef } from "react";
import { mulberry32 } from "../../utils/random";
import { FireflyDot, type FireflyHandle } from "./FireflyDot";

export function Fireflies() {
  const positions = useMemo(() => {
    const rand = mulberry32(101);
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      delay: rand() * 8,
    }));
  }, []);

  const handles = useRef<(FireflyHandle | null)[]>([]);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      for (const h of handles.current) h?.scatterFrom(e.clientX, e.clientY);
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
          for (const h of handles.current) h?.stir(dy);
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
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      {positions.map((p, i) => (
        <FireflyDot
          key={p.id}
          ref={(el) => {
            handles.current[i] = el;
          }}
          left={p.left}
          top={p.top}
          delay={p.delay}
        />
      ))}
    </div>
  );
}
