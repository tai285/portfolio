import { motion } from "framer-motion";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export function SectionHeading({ eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto max-w-2xl text-center"
    >
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold tracking-wide text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-base text-[var(--fg-muted)]">{subtitle}</p>
      )}
      <div aria-hidden="true" className="mt-4 text-secondary text-sm tracking-[0.3em]">
        ✦ ✧ ✿
      </div>
    </motion.div>
  );
}
