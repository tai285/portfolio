import { profile } from "../data/profile";

export function Footer() {
  return (
    <footer className="px-5 py-14 text-center">
      <p aria-hidden="true" className="text-secondary tracking-[0.3em]">
        ✦ ✧ ✿ ❀
      </p>
      <p className="mt-4 font-heading text-lg text-[var(--fg)]">
        {profile.shortName}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-[var(--fg-muted)]">
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noreferrer"
          className="cursor-pointer hover:text-primary"
        >
          GitHub
        </a>
        <a href={profile.socials.email} className="cursor-pointer hover:text-primary">
          Email
        </a>
        {profile.socials.linkedin && (
          <a
            href={profile.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer hover:text-primary"
          >
            LinkedIn
          </a>
        )}
      </div>
      <p className="mt-6 text-xs text-[var(--fg-muted)]">
        Built with React, TypeScript &amp; a little too much Framer Motion.
      </p>
    </footer>
  );
}
