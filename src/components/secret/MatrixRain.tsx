import { useEffect, useRef } from "react";

const CHARS =
  "アイウエオカキクケコサシスセソタチツテト0123456789ABCDEFｸﾞﾘｯﾁ".split("");

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const fontSize = 16;
    let columns = 0;
    let drops: number[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      columns = Math.floor(canvas!.width / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.random() * -50);
    }

    resize();
    window.addEventListener("resize", resize);

    function drawFrame(fade: number) {
      ctx!.fillStyle = `rgba(4, 8, 6, ${fade})`;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx!.font = `${fontSize}px monospace`;

      for (let i = 0; i < columns; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx!.fillStyle = Math.random() > 0.97 ? "#d6fff0" : "#3fe07a";
        ctx!.fillText(char, x, y);

        if (y > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    if (reduceMotion) {
      ctx.fillStyle = "#04080a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawFrame(1);
      return () => window.removeEventListener("resize", resize);
    }

    let raf = 0;
    let running = true;

    function loop() {
      if (!running) return;
      drawFrame(0.08);
      raf = requestAnimationFrame(loop);
    }

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        loop();
      }
    }

    loop();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
