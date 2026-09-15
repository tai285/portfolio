import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface TerminalProps {
  onClose: () => void;
  onSolved: () => void;
}

interface Line {
  id: number;
  text: string;
  tone?: "input" | "error" | "success" | "system";
}

const ANSWER = "extend";

const HELP_TEXT = [
  "Available commands: help, ls, cat clue.txt, clear",
  "...or just type your answer directly once you've read the clue.",
];

let lineId = 0;
function makeLine(text: string, tone?: Line["tone"]): Line {
  lineId += 1;
  return { id: lineId, text, tone };
}

export function Terminal({ onClose, onSolved }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>([
    makeLine("SYSTEM BREACH DETECTED...", "system"),
    makeLine("Unknown session established. Type `help` to begin.", "system"),
  ]);
  const [input, setInput] = useState("");
  const [solved, setSolved] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function push(text: string, tone?: Line["tone"]) {
    setLines((prev) => [...prev, makeLine(text, tone)]);
  }

  function runCommand(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    push(`> ${cmd}`, "input");

    const normalized = cmd.toLowerCase();

    if (normalized === ANSWER) {
      push(
        "ACCESS GRANTED — the system recognizes you. Welcome, Dorothy's visitor.",
        "success",
      );
      setSolved(true);
      onSolved();
      return;
    }

    switch (normalized) {
      case "help":
        HELP_TEXT.forEach((t) => push(t, "system"));
        break;
      case "ls":
        push("clue.txt", "system");
        break;
      case "cat clue.txt":
        push(
          '"Build something → understand it → ______ it → make it smarter."',
          "system",
        );
        push("Fill in the blank. One word, lowercase.", "system");
        break;
      case "clear":
        setLines([]);
        break;
      default:
        push(`command not found: ${cmd}`, "error");
        setShake(true);
        setTimeout(() => setShake(false), 300);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Secret terminal"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          x: shake ? [0, -6, 6, -4, 4, 0] : 0,
        }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="flex h-[75vh] w-full max-w-xl flex-col rounded-2xl border border-[#2fbf6e]/40 bg-black font-mono text-sm text-[#3fe07a] shadow-[0_0_40px_rgba(63,224,122,0.25)] sm:h-[70vh]"
      >
        <div className="flex items-center justify-between rounded-t-2xl border-b border-[#2fbf6e]/30 px-3 py-1.5 sm:px-4 sm:py-2.5">
          <span className="text-xs tracking-wide text-[#3fe07a]/70">
            secret-terminal — bash
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close terminal"
            className="flex h-11 min-w-11 cursor-pointer items-center justify-center rounded px-2 text-xs text-[#3fe07a]/70 hover:text-[#3fe07a]"
          >
            ✕ close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {lines.map((line) => (
            <p
              key={line.id}
              className={
                line.tone === "error"
                  ? "text-[#ff6b6b]"
                  : line.tone === "success"
                    ? "text-[#a6f7c9] font-semibold"
                    : line.tone === "input"
                      ? "text-white"
                      : "text-[#3fe07a]/90"
              }
            >
              {line.text}
            </p>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-[#2fbf6e]/30 px-4 py-3">
          {solved ? (
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 w-full cursor-pointer rounded-lg border border-[#3fe07a]/50 bg-[#3fe07a]/10 py-3 text-center font-semibold text-[#a6f7c9] transition-colors hover:bg-[#3fe07a]/20"
            >
              Enter the Matrix →
            </button>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runCommand(input);
                setInput("");
              }}
              className="flex min-h-11 items-center gap-2"
            >
              <span aria-hidden="true">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                aria-label="Terminal command input"
                className="min-h-11 flex-1 bg-transparent text-base text-[#3fe07a] outline-none placeholder:text-[#3fe07a]/40 sm:text-sm"
                placeholder="type a command..."
              />
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
