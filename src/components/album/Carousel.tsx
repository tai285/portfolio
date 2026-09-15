import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useEffect, useState } from "react";
import type { Photo } from "../../data/photos";
import { PhotoFrame } from "./PhotoFrame";

interface CarouselProps {
  photos: Photo[];
  onOpenLightbox: (index: number) => void;
}

const AUTOPLAY_MS = 4500;
const SWIPE_CONFIRM_PX = 80;

export function Carousel({ photos, onOpenLightbox }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || photos.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const t = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % photos.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, photos.length]);

  function go(delta: number) {
    setDirection(delta);
    setIndex((i) => (i + delta + photos.length) % photos.length);
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_CONFIRM_PX) go(1);
    else if (info.offset.x > SWIPE_CONFIRM_PX) go(-1);
  }

  if (photos.length === 0) return null;

  const photo = photos[index];

  return (
    <div
      className="relative mx-auto w-full max-w-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm sm:aspect-video">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={photo.id}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={onDragEnd}
            onTouchStart={() => setPaused(true)}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            onTap={() => onOpenLightbox(index)}
          >
            <PhotoFrame
              src={photo.src}
              alt={photo.alt}
              className="h-full w-full"
              imgClassName="h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {photo.caption && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-4 text-left">
            <p className="text-sm font-medium text-white">{photo.caption}</p>
          </div>
        )}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/80 text-lg text-[var(--fg)] shadow-sm backdrop-blur transition-transform hover:scale-105 dark:bg-black/50"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/80 text-lg text-[var(--fg)] shadow-sm backdrop-blur transition-transform hover:scale-105 dark:bg-black/50"
          >
            ›
          </button>

          <div className="mt-4 flex justify-center gap-2">
            {photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
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
    </div>
  );
}
