import { useEffect, useState } from "react";
import { getFirebase } from "../../lib/firebase";
import type { GuestbookMessage } from "../../types/content";
import { Button, Card } from "./fields";

export function GuestbookModeration() {
  const [messages, setMessages] = useState<GuestbookMessage[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    getFirebase().then(async (fb) => {
      if (!fb || cancelled) return;
      const { collection, onSnapshot, orderBy, query } = await import("firebase/firestore");
      if (cancelled) return;
      unsubscribe = onSnapshot(
        query(collection(fb.db, "guestbook"), orderBy("createdAt", "desc")),
        (snap) => {
          setMessages(
            snap.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                name: data.name,
                message: data.message,
                approved: Boolean(data.approved),
                createdAt: data.createdAt?.toMillis?.() ?? null,
              };
            }),
          );
        },
      );
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  async function setApproved(id: string, approved: boolean) {
    setBusyId(id);
    const fb = await getFirebase();
    if (fb) {
      const { doc, updateDoc } = await import("firebase/firestore");
      await updateDoc(doc(fb.db, "guestbook", id), { approved });
    }
    setBusyId(null);
  }

  async function remove(id: string) {
    setBusyId(id);
    const fb = await getFirebase();
    if (fb) {
      const { doc, deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(fb.db, "guestbook", id));
    }
    setBusyId(null);
  }

  if (messages === null) {
    return <p className="text-sm text-[var(--fg-muted)]">Loading…</p>;
  }

  if (messages.length === 0) {
    return <p className="text-sm text-[var(--fg-muted)]">No messages yet.</p>;
  }

  const pending = messages.filter((m) => !m.approved);
  const approved = messages.filter((m) => m.approved);

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 text-sm font-semibold text-[var(--fg)]">
          Pending ({pending.length})
        </h3>
        <div className="space-y-3">
          {pending.length === 0 && (
            <p className="text-sm text-[var(--fg-muted)]">Nothing waiting for review.</p>
          )}
          {pending.map((m) => (
            <Card key={m.id}>
              <p className="text-sm font-semibold text-[var(--fg)]">{m.name}</p>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">{m.message}</p>
              <div className="mt-3 flex gap-2">
                <Button onClick={() => setApproved(m.id, true)} disabled={busyId === m.id}>
                  Approve
                </Button>
                <Button
                  variant="danger"
                  onClick={() => remove(m.id)}
                  disabled={busyId === m.id}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-[var(--fg)]">
          Approved & visible ({approved.length})
        </h3>
        <div className="space-y-3">
          {approved.map((m) => (
            <Card key={m.id}>
              <p className="text-sm font-semibold text-[var(--fg)]">{m.name}</p>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">{m.message}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setApproved(m.id, false)}
                  disabled={busyId === m.id}
                >
                  Unapprove
                </Button>
                <Button
                  variant="danger"
                  onClick={() => remove(m.id)}
                  disabled={busyId === m.id}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
