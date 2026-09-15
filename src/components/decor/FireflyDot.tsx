import { motion, useAnimationControls } from "framer-motion";
import { forwardRef, useEffect, useImperativeHandle, useRef, type CSSProperties } from "react";

export interface FireflyHandle {
  scatterFrom: (clientX: number, clientY: number) => void;
  stir: (dy: number) => void;
}

interface FireflyDotProps {
  left: number;
  top: number;
  delay: number;
  size: number;
  layer: "back" | "front";
}

const SCATTER_RADIUS = 170;
const REST_MS = 900;

function clamp(v: number, max: number) {
  return Math.max(-max, Math.min(max, v));
}

export const FireflyDot = forwardRef<FireflyHandle, FireflyDotProps>(
  function FireflyDot({ left, top, delay, size, layer }, ref) {
    const controls = useAnimationControls();
    const elRef = useRef<HTMLSpanElement>(null);
    const restUntil = useRef(0);
    // Current accumulated offset from spawn point -- the walk drifts
    // from HERE each step, not back to a fixed small box, so it reads
    // as actually roaming rather than jittering in place.
    const pos = useRef({ x: 0, y: 0 });
    // Bigger ones read as "closer" -- they roam a bit further and
    // faster than the small, hazier "back" ones.
    const maxRange = layer === "front" ? 240 : 150;
    const stepSize = layer === "front" ? 90 : 60;
    const speed = layer === "front" ? 0.85 : 1.2;

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
          pos.current = {
            x: clamp(pos.current.x + (Math.random() - 0.5) * stepSize, maxRange),
            y: clamp(pos.current.y + (Math.random() - 0.5) * stepSize * 0.75, maxRange * 0.7),
          };
          const opacity =
            layer === "front"
              ? 0.45 + Math.random() * 0.5
              : 0.2 + Math.random() * 0.35;
          await controls.start({
            x: pos.current.x,
            y: pos.current.y,
            opacity,
            transition: {
              duration: (3 + Math.random() * 2.5) * speed,
              ease: "easeInOut",
            },
          });
        }
      }

      wander();
      return () => {
        cancelled = true;
      };
    }, [controls, delay, maxRange, stepSize, speed, layer]);

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
        const nx = clamp(pos.current.x + (dx / dist) * 70 * power, maxRange);
        const ny = clamp(pos.current.y + (dy / dist) * 70 * power, maxRange);
        pos.current = { x: nx, y: ny };
        restUntil.current = Date.now() + REST_MS;
        controls.start({
          x: nx,
          y: ny,
          opacity: 1,
          transition: { type: "spring", stiffness: 260, damping: 16 },
        });
      },
      stir(dy) {
        const ny = clamp(pos.current.y + dy, maxRange);
        pos.current.y = ny;
        restUntil.current = Date.now() + 350;
        controls.start({
          y: ny,
          transition: { type: "spring", stiffness: 130, damping: 11 },
        });
      },
    }));

    return (
      <motion.span
        ref={elRef}
        animate={controls}
        initial={{ x: 0, y: 0, opacity: 0.4 }}
        className="firefly-glow firefly-breathe"
        style={
          {
            left: `${left}%`,
            top: `${top}%`,
            width: size,
            height: size,
            "--fg-size": `${size}px`,
            filter: layer === "back" ? `blur(${size * 0.18}px)` : undefined,
            animationDelay: `${delay % 3}s`,
            animationDuration: `${2.2 + (delay % 5) * 0.3}s`,
          } as CSSProperties
        }
      />
    );
  },
);
