import { motion } from "framer-motion";
import { useEffect } from "react";

interface AccessDeniedProps {
  onDismiss: () => void;
}

export function AccessDenied({ onDismiss }: AccessDeniedProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 1800);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-3 bg-black font-mono text-[#ff5f7e]"
    >
      <p
        data-text="ACCESS DENIED"
        className="glitch-text text-3xl font-bold sm:text-5xl"
      >
        ACCESS DENIED
      </p>
      <p className="text-sm text-[#ff5f7e]/70">
        You'll need to find the code first...
      </p>
    </motion.div>
  );
}
