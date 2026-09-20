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
  glyph?: string;
  sway: number;
}

const PETAL_GLYPHS = ["🌸", "🌷"];
const LEAF_GLYPHS = ["🍂", "🍁"];

function useSeasonParticles(season: Season): Particle[] {
  return useMemo(() => {
    if (season.effect === "sun-glaze") return [];
    const rand = mulberry32(season.id.length * 7919 + season.effect.length);
    const isDust = season.effect === "dusty-snow";
    const glyphs = season.effect === "petals" ? PETAL_GLYPHS : season.effect === "leaves" ? LEAF_GLYPHS : undefined;
    const count = isDust ? 16 : 8;

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      delay: rand() * (isDust ? 20 : 14),
      duration: isDust ? 20 + rand() * 16 : 12 + rand() * 8,
      size: isDust ? 2 + rand() * 3 : 12 + rand() * 8,
      glyph: glyphs ? glyphs[Math.floor(rand() * glyphs.length)] : undefined,
      sway: isDust ? 10 + rand() * 18 : 20 + rand() * 30,
    }));
  }, [season.id, season.effect]);
}

/**
 * Each season gets exactly one distinct ambient effect (not a uniform
 * particle field reskinned four ways) so the site doesn't stack up too
 * many simultaneous animated layers: gentle falling petals in spring, a
 * warm non-particle sun glaze in summer, falling leaves in autumn, and
 * fine, sparse "dusty" snow plus a frosted-corners vignette in winter.
 */
export function SeasonWeather({ season }: SeasonWeatherProps) {
  const particles = useSeasonParticles(season);

  if (season.effect === "sun-glaze") {
    return (
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        <span className="sun-glaze" />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {season.effect === "dusty-snow" && <span className="frost-vignette" />}
      {particles.map((p) => (
        <span
          key={p.id}
          className={p.glyph ? "season-fall" : "dust-fall"}
          style={
            {
              position: "absolute",
              left: `${p.left}%`,
              top: "-8%",
              fontSize: p.glyph ? p.size : undefined,
              width: p.glyph ? undefined : p.size,
              height: p.glyph ? undefined : p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--season-sway": `${p.sway}px`,
            } as CSSProperties
          }
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
}
