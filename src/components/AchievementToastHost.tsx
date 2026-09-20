import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { allAchievements, type Achievement } from "../data/achievements";
import { subscribeAchievements } from "../utils/achievements";

/** Mounted once near the root. Listens for unlockAchievement() calls
 * from anywhere in the app and shows a brief toast, so finding a
 * hidden corner of the site has an immediate payoff, not just a
 * silent entry in the Milestones section. */
export function AchievementToastHost() {
  const [toast, setToast] = useState<Achievement | null>(null);

  useEffect(
    () =>
      subscribeAchievements((id) => {
        const achievement = allAchievements.find((a) => a.id === id);
        if (achievement) setToast(achievement);
      }),
    [],
  );

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3400);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[150] flex justify-center px-4 sm:bottom-6 sm:justify-end sm:pr-6"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex items-center gap-3 rounded-2xl border border-primary-light/50 bg-[var(--surface)] px-4 py-3 shadow-xl"
          >
            <span className="text-xl" aria-hidden="true">
              {toast.icon}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Achievement unlocked
              </p>
              <p className="text-sm font-medium text-[var(--fg)]">{toast.title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
