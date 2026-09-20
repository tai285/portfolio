import { useMemo, type CSSProperties } from "react";
import type { Season } from "../../data/seasons";
import { mulberry32 } from "../../utils/random";

interface SeasonWeatherProps {
  season: Season;
}

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  glyph: string;
  sway: number;
}

const COUNT = 14;

function useParticles(season: Season): Particle[] {
  return useMemo(() => {
    const rand = mulberry32(season.id.length * 7919 + season.glyphs.length);
    return Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      left: rand() * 100,
      delay: rand() * 12,
      duration: 10 + rand() * 8,
      size: 12 + rand() * 10,
      glyph: season.glyphs[Math.floor(rand() * season.glyphs.length)],
      sway: 20 + rand() * 40,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season.id]);
}

/**
 * A gentle year-round weather layer, independent of the fireflies and
 * color theme -- petals/leaves/snow fall (summer's motes drift up
 * instead) using plain CSS keyframes since the motion is a simple
 * one-directional loop, not the fireflies' organic wander.
 */
export function SeasonWeather({ season }: SeasonWeatherProps) {
  const particles = useParticles(season);
  const direction = season.drift === "up" ? "season-rise" : "season-fall";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className={direction}
          style={
            {
              position: "absolute",
              left: `${p.left}%`,
              top: season.drift === "up" ? "auto" : "-8%",
              bottom: season.drift === "up" ? "-8%" : "auto",
              fontSize: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--season-sway": `${p.sway}px`,
              opacity: 0.75,
            } as CSSProperties
          }
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
}
