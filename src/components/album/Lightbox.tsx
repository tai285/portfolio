import { motion, type PanInfo } from "framer-motion";
import { useEffect } from "react";
import type { Photo } from "../../data/photos";
import { PhotoFrame } from "./PhotoFrame";

interface LightboxProps {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const photo = photos[index];

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % photos.length);
      if (e.key === "ArrowLeft")
        onNavigate((index - 1 + photos.length) % photos.length);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, onClose, onNavigate, photos.length]);

  if (!photo) return null;

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) onNavigate((index + 1) % photos.length);
    else if (info.offset.x > 60)
      onNavigate((index - 1 + photos.length) % photos.length);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 px-4 py-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photo viewer"
        className="absolute right-3 top-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-lg text-white hover:bg-white/20"
      >
        ✕
      </button>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={onDragEnd}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[75vh] w-full max-w-3xl cursor-grab active:cursor-grabbing"
      >
        <PhotoFrame
          src={photo.src}
          alt={photo.alt}
          className="max-h-[75vh] w-full rounded-2xl"
          imgClassName="max-h-[75vh] w-full rounded-2xl object-contain"
        />
      </motion.div>

      {photo.caption && (
        <p className="mt-4 max-w-md text-center text-sm text-white/80">
          {photo.caption}
        </p>
      )}

      {photos.length > 1 && (
        <div className="mt-5 flex items-center gap-6">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index - 1 + photos.length) % photos.length);
            }}
            aria-label="Previous photo"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-lg text-white hover:bg-white/20"
          >
            ‹
          </button>
          <span className="text-xs text-white/60">
            {index + 1} / {photos.length}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index + 1) % photos.length);
            }}
            aria-label="Next photo"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-lg text-white hover:bg-white/20"
          >
            ›
          </button>
        </div>
      )}
    </motion.div>
  );
}
