import { motion } from "framer-motion";
import { profile as staticProfile } from "../data/profile";
import { useContent } from "../hooks/useContent";
import type { Profile } from "../types/content";
import { LocalFireflies } from "./decor/LocalFireflies";
import { SectionHeading } from "./SectionHeading";

export function About() {
  const profile = useContent<Profile>("profile", staticProfile);

  return (
    <section id="about" className="px-5 py-20">
      <SectionHeading eyebrow="Get to know me" title="About" />

      <div className="relative mx-auto mt-10 max-w-2xl overflow-hidden">
        <LocalFireflies count={3} seed={11} className="-inset-x-8 -inset-y-8" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-left shadow-sm"
        >
          {profile.bio.map((paragraph, i) => (
            <p key={i} className="text-[var(--fg-muted)] leading-relaxed">
              {paragraph}
            </p>
          ))}
          <p className="pt-2 font-heading text-lg text-primary">
            build something → understand it → extend it → make it smarter
          </p>
        </motion.div>
      </div>
    </section>
  );
}
