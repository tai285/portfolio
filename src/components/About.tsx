import { motion } from "framer-motion";
import { profile } from "../data/profile";
import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <section id="about" className="px-5 py-20">
      <SectionHeading eyebrow="Get to know me" title="About" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto mt-10 max-w-2xl space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-left shadow-sm"
      >
        {profile.bio.map((paragraph) => (
          <p key={paragraph} className="text-[var(--fg-muted)] leading-relaxed">
            {paragraph}
          </p>
        ))}
        <p className="pt-2 font-heading text-lg text-primary">
          build something → understand it → extend it → make it smarter
        </p>
      </motion.div>
    </section>
  );
}
