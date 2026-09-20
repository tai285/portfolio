import { useState, type FormEvent } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { firebaseEnabled } from "../lib/firebase";
import { Button, TextInput } from "./admin/fields";
import { FunFactsEditor } from "./admin/FunFactsEditor";
import { GuestbookModeration } from "./admin/GuestbookModeration";
import { JourneyEditor } from "./admin/JourneyEditor";
import { MemoryCardsEditor } from "./admin/MemoryCardsEditor";
import { PhotosEditor } from "./admin/PhotosEditor";
import { ProfileEditor } from "./admin/ProfileEditor";
import { ProjectsEditor } from "./admin/ProjectsEditor";
import { TriviaEditor } from "./admin/TriviaEditor";

const TABS = [
  { id: "profile", label: "Profile", Component: ProfileEditor },
  { id: "journey", label: "Journey", Component: JourneyEditor },
  { id: "projects", label: "Projects", Component: ProjectsEditor },
  { id: "photos", label: "Album photos", Component: PhotosEditor },
  { id: "funFacts", label: "Fun facts", Component: FunFactsEditor },
  { id: "trivia", label: "Trivia", Component: TriviaEditor },
  { id: "memoryCards", label: "Memory cards", Component: MemoryCardsEditor },
  { id: "guestbook", label: "Guestbook", Component: GuestbookModeration },
] as const;

function LoginForm() {
  const { error, signIn } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidationError(null);
    if (!email.trim() || !password.trim()) {
      setValidationError("Enter both your email and password.");
      return;
    }
    setSubmitting(true);
    await signIn(email, password);
    setSubmitting(false);
  }

  return (
    <div className="mx-auto mt-24 max-w-sm px-5">
      <h1 className="font-heading text-2xl text-[var(--fg)]">Admin login</h1>
      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <TextInput
          type="email"
          placeholder="Email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextInput
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {validationError && <p className="text-sm text-error">{validationError}</p>}
        {error && <p className="text-sm text-error">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}

export function Admin() {
  const { loading, user, signOutUser } = useAdminAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("profile");

  if (!firebaseEnabled) {
    return (
      <div className="mx-auto mt-24 max-w-md px-5 text-center">
        <h1 className="font-heading text-2xl text-[var(--fg)]">Admin not set up yet</h1>
        <p className="mt-3 text-sm text-[var(--fg-muted)]">
          This site isn't connected to Firebase, so there's nothing to log into.
          Add your Firebase config as environment variables to enable the CMS.
        </p>
      </div>
    );
  }

  if (loading) {
    return <p className="mt-24 text-center text-sm text-[var(--fg-muted)]">Loading…</p>;
  }

  if (!user) {
    return <LoginForm />;
  }

  const ActiveComponent = TABS.find((t) => t.id === tab)?.Component ?? ProfileEditor;

  return (
    <div className="min-h-dvh bg-[var(--bg)] px-5 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-2xl text-[var(--fg)]">Content admin</h1>
          <div className="flex items-center gap-3">
            <a href="#top" className="text-sm text-[var(--fg-muted)] hover:text-primary">
              ← Back to site
            </a>
            <Button variant="secondary" onClick={signOutUser}>
              Sign out
            </Button>
          </div>
        </div>

        <div
          role="tablist"
          className="mt-6 flex flex-wrap gap-2 border-b border-[var(--border)] pb-4"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`min-h-11 cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.id
                  ? "border-primary bg-primary text-white"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--fg-muted)] hover:border-primary-light"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
