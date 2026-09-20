import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[var(--fg-muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full min-h-11 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] outline-none focus:border-primary-light";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-[var(--fg)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4"
      />
      {label}
    </label>
  );
}

export function Button({
  children,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  const styles =
    variant === "primary"
      ? "bg-primary text-white hover:scale-105"
      : variant === "danger"
        ? "border border-error text-error hover:bg-error/10"
        : "border border-[var(--border)] text-[var(--fg)] hover:border-primary-light";
  return (
    <button
      type="button"
      {...props}
      className={`min-h-11 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-transform duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
      {children}
    </div>
  );
}

export function SaveBar({
  onSave,
  saving,
  saved,
}: {
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <div className="sticky bottom-4 z-10 flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 shadow-lg">
      <Button onClick={onSave} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
      {saved && !saving && (
        <span className="text-sm font-medium text-success">Saved ✓</span>
      )}
    </div>
  );
}
