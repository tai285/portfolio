import { motion } from "framer-motion";
import { journey } from "../data/journey";
import { SectionHeading } from "./SectionHeading";

export function Journey() {
  return (
    <section id="journey" className="bg-[var(--bg-alt)] px-5 py-20">
      <SectionHeading
        eyebrow="From FYP to research"
        title="My Journey"
        subtitle="Build it. Understand it. Extend it."
      />

      <ol className="relative mx-auto mt-12 max-w-2xl border-s-2 border-[var(--border)] ps-6 sm:ps-8">
        {journey.map((entry, i) => (
          <motion.li
            key={entry.title}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="mb-10 last:mb-0"
          >
            <span
              aria-hidden="true"
              className="absolute -start-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-[var(--bg-alt)] bg-primary"
            />
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              {entry.year}
            </p>
            <h3 className="mt-1 text-xl">
              {entry.badge && <span aria-hidden="true">{entry.badge} </span>}
              {entry.title}
            </h3>
            <p className="mt-2 text-[var(--fg-muted)] leading-relaxed">
              {entry.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--fg-muted)] border border-[var(--border)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
