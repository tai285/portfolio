import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { categories as staticCategories, photos as staticPhotos } from "../../data/photos";
import { usePhotosContent } from "../../hooks/usePhotosContent";
import { SectionHeading } from "../SectionHeading";
import { Carousel } from "./Carousel";
import { Lightbox } from "./Lightbox";
import { PhotoFrame } from "./PhotoFrame";

const ALL = "All";

const staticPhotosWithOrder = staticPhotos.map((p, order) => ({ ...p, order }));

export function Album() {
  const { categories, entries: photos } = usePhotosContent(
    [...staticCategories],
    staticPhotosWithOrder,
  );
  const [category, setCategory] = useState<string>(ALL);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (category === ALL ? photos : photos.filter((p) => p.category === category)),
    [category, photos],
  );

  return (
    <section id="album" className="px-5 py-20">
      <SectionHeading
        eyebrow="Moments, not just milestones"
        title="Album"
        subtitle="Awards, demos, and the occasional 3am debugging session."
      />

      <div className="mt-10">
        <Carousel key={category} photos={filtered} onOpenLightbox={setLightboxIndex} />
      </div>

      <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
        {[ALL, ...categories].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
              category === cat
                ? "border-primary bg-primary text-white"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--fg-muted)] hover:border-primary-light"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((photo, i) => (
            <motion.button
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-[var(--border)]"
            >
              <PhotoFrame
                src={photo.src}
                alt={photo.alt}
                className="aspect-square w-full"
                imgClassName="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={filtered}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
