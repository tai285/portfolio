import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CloudRevealProps {
  children: ReactNode;
  /** Tailwind text-[...] class (puffs use bg-current) so the clouds
   * match the section's own background instead of flashing a foreign
   * color across it. */
  cloudColor?: string;
}

function CloudPuffs() {
  return (
    <div className="absolute inset-0">
      <span className="absolute inset-0 rounded-[40%] bg-current" />
      <span className="absolute -left-[8%] top-[15%] h-[75%] w-[55%] rounded-full bg-current" />
      <span className="absolute -right-[10%] top-[5%] h-[85%] w-[62%] rounded-full bg-current" />
      <span className="absolute left-[18%] -top-[25%] h-[75%] w-[58%] rounded-full bg-current" />
      <span className="absolute left-[10%] bottom-[-20%] h-[65%] w-[50%] rounded-full bg-current" />
    </div>
  );
}

export function CloudReveal({ children, cloudColor = "text-[var(--bg-alt)]" }: CloudRevealProps) {
  return (
    <div className="relative overflow-hidden">
      {children}

      <motion.div
        aria-hidden="true"
        initial={{ x: "0%" }}
        whileInView={{ x: "-100%" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.15, ease: [0.65, 0, 0.35, 1] }}
        className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 ${cloudColor}`}
      >
        <CloudPuffs />
      </motion.div>
      <motion.div
        aria-hidden="true"
        initial={{ x: "0%" }}
        whileInView={{ x: "100%" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.15, ease: [0.65, 0, 0.35, 1] }}
        className={`pointer-events-none absolute inset-y-0 right-0 w-1/2 ${cloudColor}`}
      >
        <CloudPuffs />
      </motion.div>
    </div>
  );
}
