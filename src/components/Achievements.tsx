import { motion } from "framer-motion";
import { hiddenAchievements, milestoneAchievements } from "../data/achievements";
import { useAchievements } from "../hooks/useAchievements";
import { SectionHeading } from "./SectionHeading";

export function Achievements() {
  const unlocked = useAchievements();
  const foundCount = hiddenAchievements.filter((a) => unlocked.has(a.id)).length;

  return (
    <section id="milestones" className="px-5 py-20">
      <SectionHeading eyebrow="Trophy case" title="Milestones" />

      <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
        {milestoneAchievements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex items-start gap-3 rounded-2xl border border-primary-light/40 bg-gradient-to-br from-primary-light/10 to-secondary/10 p-4"
          >
            <span className="text-2xl" aria-hidden="true">
              {a.icon}
            </span>
            <div>
              <p className="font-semibold text-[var(--fg)]">{a.title}</p>
              <p className="mt-0.5 text-sm text-[var(--fg-muted)]">{a.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-4xl text-center">
        <p className="text-sm font-semibold tracking-wide text-primary">Secrets of the site</p>
        <h3 className="mt-1 text-2xl">
          {foundCount} / {hiddenAchievements.length} found
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--fg-muted)]">
          This site has hidden corners. Every one you find unlocks a badge here —
          no hints beyond what you've already stumbled on.
        </p>
      </div>

      <div className="mx-auto mt-6 grid max-w-4xl gap-3 sm:grid-cols-3">
        {hiddenAchievements.map((a, i) => {
          const found = unlocked.has(a.id);
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className={`rounded-2xl border p-4 text-center transition-colors ${
                found
                  ? "border-primary bg-[var(--bg-alt)]"
                  : "border-dashed border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              <span className="text-xl" aria-hidden="true">
                {found ? a.icon : "🔒"}
              </span>
              <p className={`mt-1.5 text-sm font-semibold ${found ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"}`}>
                {found ? a.title : "???"}
              </p>
              <p className="mt-0.5 text-xs text-[var(--fg-muted)]">
                {found ? a.description : "Still hidden."}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
