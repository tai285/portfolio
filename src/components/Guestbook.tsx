import { motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import { firebaseEnabled, getFirebase } from "../lib/firebase";
import type { GuestbookMessage } from "../types/content";
import { unlockAchievement } from "../utils/achievements";
import { SectionHeading } from "./SectionHeading";

const NAME_LIMIT = 40;
const MESSAGE_LIMIT = 300;

export function Guestbook() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  // Honeypot -- invisible to real visitors, bots that auto-fill every
  // field will trip it. Any non-empty value here silently drops the
  // submission without telling the bot why.
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseEnabled) return;
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    getFirebase().then(async (fb) => {
      if (!fb || cancelled) return;
      const { collection, onSnapshot, orderBy, query, where } = await import(
        "firebase/firestore"
      );
      if (cancelled) return;
      unsubscribe = onSnapshot(
        query(
          collection(fb.db, "guestbook"),
          where("approved", "==", true),
          orderBy("createdAt", "desc"),
        ),
        (snap) => {
          setMessages(
            snap.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                name: data.name,
                message: data.message,
                approved: true,
                createdAt: data.createdAt?.toMillis?.() ?? null,
              };
            }),
          );
        },
        () => setMessages([]),
      );
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidationError(null);
    if (website.trim()) return; // honeypot tripped
    if (!name.trim() || !message.trim()) {
      setValidationError("Please fill in both your name and a message.");
      return;
    }

    setStatus("sending");
    try {
      const fb = await getFirebase();
      if (!fb) throw new Error("not configured");
      const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
      await addDoc(collection(fb.db, "guestbook"), {
        name: name.trim().slice(0, NAME_LIMIT),
        message: message.trim().slice(0, MESSAGE_LIMIT),
        approved: false,
        createdAt: serverTimestamp(),
      });
      setStatus("sent");
      setName("");
      setMessage("");
      unlockAchievement("left-your-mark");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="guestbook" className="bg-[var(--bg-alt)] px-5 py-20">
      <SectionHeading
        eyebrow="Say hi"
        title="Guestbook"
        subtitle="Leave a note -- it'll show up here once approved."
      />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto mt-10 max-w-lg space-y-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-left shadow-sm"
      >
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-[var(--fg-muted)]">
            Your name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={NAME_LIMIT}
            required
            className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] outline-none focus:border-primary-light"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-[var(--fg-muted)]">
            Message
          </span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={MESSAGE_LIMIT}
            rows={3}
            required
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] outline-none focus:border-primary-light"
          />
        </label>
        <button
          type="submit"
          disabled={status === "sending"}
          className="min-h-11 w-full cursor-pointer rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Leave a message"}
        </button>
        {validationError && (
          <p className="text-center text-sm text-error">{validationError}</p>
        )}
        {status === "sent" && (
          <p className="text-center text-sm text-success">
            Thanks! It'll appear once approved. ✦
          </p>
        )}
        {status === "error" && (
          <p className="text-center text-sm text-error">
            Couldn't send that -- try again in a moment.
          </p>
        )}
      </form>

      {messages.length > 0 && (
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          {messages.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left"
            >
              <p className="text-sm text-[var(--fg)]">{m.message}</p>
              <p className="mt-2 text-xs font-semibold text-primary">— {m.name}</p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
