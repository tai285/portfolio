export function CameraIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.19a1.5 1.5 0 0 0 1.28-.72l.66-1.08A1.5 1.5 0 0 1 10.91 4.5h2.18a1.5 1.5 0 0 1 1.28.72l.66 1.08A1.5 1.5 0 0 0 16.31 7H18.5A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z" />
      <circle cx="12" cy="13" r="3.4" />
    </svg>
  );
}
