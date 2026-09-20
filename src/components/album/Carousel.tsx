import { motion, type PanInfo } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "../../data/photos";
import { CarouselSparkles } from "./CarouselSparkles";
import { PhotoFrame } from "./PhotoFrame";

interface CarouselProps {
  photos: Photo[];
  onOpenLightbox: (index: number) => void;
}

const AUTOPLAY_MS = 4000;
const SWIPE_CONFIRM_PX = 70;
const MAX_VISIBLE_DELTA = 2;
const SPRING = { type: "spring", stiffness: 260, damping: 30 } as const;

// Shortest signed distance from `current` to `i` around a circle of
// size `total` -- e.g. with 10 photos, index 9 is delta -1 from index 0.
function shortestDelta(total: number, current: number, i: number) {
  let d = i - current;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
}

export function Carousel({ photos, onOpenLightbox }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(130);

  useEffect(() => {
    function measure() {
      const w = stageRef.current?.offsetWidth ?? 0;
      setStep(Math.min(Math.max(w * 0.27, 60), 210));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (paused || photos.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const t = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, photos.length]);

  function go(delta: number) {
    setIndex((i) => (i + delta + photos.length) % photos.length);
  }

  function goTo(i: number) {
    setIndex(i);
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_CONFIRM_PX) go(1);
    else if (info.offset.x > SWIPE_CONFIRM_PX) go(-1);
  }

  if (photos.length === 0) return null;

  const centerPhoto = photos[index];

  return (
    <div
      className="relative mx-auto w-full max-w-2xl overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <CarouselSparkles />

      <div
        ref={stageRef}
        className="relative aspect-[4/3] overflow-hidden sm:aspect-video"
        style={{ perspective: "1400px" }}
      >
        {photos.map((photo, i) => {
          const rawDelta = shortestDelta(photos.length, index, i);
          const absDelta = Math.abs(rawDelta);
          const dir = Math.sign(rawDelta);
          const clamped = Math.min(absDelta, MAX_VISIBLE_DELTA + 1);
          const isCenter = absDelta === 0;
          const isVisible = absDelta <= MAX_VISIBLE_DELTA;

          const x = dir * clamped * step;
          const scale = 1 - clamped * 0.16;
          const rotateY = -dir * Math.min(clamped, 2) * 16;
          const opacity = isCenter ? 1 : absDelta === 1 ? 0.72 : absDelta === 2 ? 0.4 : 0;
          const zIndex = 50 - clamped * 10;

          return (
            <motion.div
              key={photo.id}
              animate={{ x, scale, rotateY, opacity, zIndex }}
              transition={SPRING}
              style={{ transformStyle: "preserve-3d" }}
              className="absolute inset-0 m-auto h-full w-[74%] rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-lg sm:w-[80%]"
            >
              {isCenter ? (
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={onDragEnd}
                  onTouchStart={() => setPaused(true)}
                  onTap={() => onOpenLightbox(i)}
                  className="relative h-full w-full cursor-grab overflow-hidden rounded-3xl active:cursor-grabbing"
                >
                  <PhotoFrame
                    src={photo.src}
                    alt={photo.alt}
                    className="h-full w-full"
                    imgClassName="h-full w-full object-cover"
                  />
                  {photo.caption && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-4 text-left">
                      <p className="text-sm font-medium text-white">{photo.caption}</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${photo.alt}`}
                  tabIndex={-1}
                  className="h-full w-full cursor-pointer overflow-hidden rounded-3xl"
                  style={{ pointerEvents: isVisible ? "auto" : "none" }}
                >
                  <PhotoFrame
                    src={photo.src}
                    alt={photo.alt}
                    className="h-full w-full"
                    imgClassName="h-full w-full object-cover"
                  />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 z-[60] flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-lg text-[var(--fg)] shadow-sm backdrop-blur transition-transform hover:scale-105 dark:bg-black/50"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 z-[60] flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-lg text-[var(--fg)] shadow-sm backdrop-blur transition-transform hover:scale-105 dark:bg-black/50"
          >
            ›
          </button>

          <div className="relative z-[60] mt-4 flex justify-center gap-2">
            {photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === index}
                className="flex h-11 w-6 cursor-pointer items-center justify-center"
              >
                <span
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-primary" : "w-2 bg-[var(--border)]"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}

      <p className="sr-only" aria-live="polite">
        Showing {centerPhoto.alt}
      </p>
    </div>
  );
}
