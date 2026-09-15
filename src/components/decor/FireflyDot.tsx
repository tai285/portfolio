import { motion, useAnimationControls } from "framer-motion";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export interface FireflyHandle {
  scatterFrom: (clientX: number, clientY: number) => void;
  stir: (dy: number) => void;
}

interface FireflyDotProps {
  left: number;
  top: number;
  delay: number;
}

const SCATTER_RADIUS = 170;
const REST_MS = 900;

export const FireflyDot = forwardRef<FireflyHandle, FireflyDotProps>(
  function FireflyDot({ left, top, delay }, ref) {
    const controls = useAnimationControls();
    const elRef = useRef<HTMLSpanElement>(null);
    const restUntil = useRef(0);

    useEffect(() => {
      let cancelled = false;

      async function wander() {
        await new Promise((r) => setTimeout(r, delay * 1000));
        while (!cancelled) {
          const now = Date.now();
          if (now < restUntil.current) {
            await new Promise((r) => setTimeout(r, restUntil.current - now));
            continue;
          }
          const dx = (Math.random() - 0.5) * 60;
          const dy = (Math.random() - 0.5) * 46;
          const opacity = 0.35 + Math.random() * 0.55;
          await controls.start({
            x: dx,
            y: dy,
            opacity,
            transition: { duration: 3.5 + Math.random() * 3, ease: "easeInOut" },
          });
        }
      }

      wander();
      return () => {
        cancelled = true;
      };
    }, [controls, delay]);

    useImperativeHandle(ref, () => ({
      scatterFrom(clientX, clientY) {
        const rect = elRef.current?.getBoundingClientRect();
        if (!rect) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - clientX;
        const dy = cy - clientY;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist > SCATTER_RADIUS) return;

        const power = 1 - dist / SCATTER_RADIUS;
        const nx = (dx / dist) * 70 * power;
        const ny = (dy / dist) * 70 * power;
        restUntil.current = Date.now() + REST_MS;
        controls.start({
          x: nx,
          y: ny,
          opacity: 1,
          transition: { type: "spring", stiffness: 260, damping: 16 },
        });
      },
      stir(dy) {
        restUntil.current = Date.now() + 350;
        controls.start({
          y: dy,
          transition: { type: "spring", stiffness: 130, damping: 11 },
        });
      },
    }));

    return (
      <motion.span
        ref={elRef}
        animate={controls}
        initial={{ x: 0, y: 0, opacity: 0.55 }}
        className="firefly-glow"
        style={{ left: `${left}%`, top: `${top}%` }}
      />
    );
  },
);
