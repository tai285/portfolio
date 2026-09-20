# Dorothy's Portfolio

Personal portfolio site — hero, about, journey timeline, projects, an
album/gallery with a category-filterable carousel, a guestbook, and a
"Playground" section with three minigames (fun facts, trivia quiz, memory
match). Plus a hidden CTF-style easter egg chain (console hint → Konami
code / swipe pattern → terminal riddle → glitched secret page), a couple
of smaller standalone easter eggs, four pickable "fairy" themes with a
secret fifth, a year-round seasonal weather layer, and a pixie-dust cursor
trail (see below). Built with React, TypeScript, Vite, Tailwind CSS v4,
Framer Motion, and an optional Firebase backend for a no-code admin panel
and the guestbook.

## Themes

The 🧚/🌙/🌸/✨ button in the nav (next to the light/dark toggle) picks
between four color themes — Fairy Garden, Moonlit Grove, Cherry Blossom,
and Starlight Wish. Each one is a full palette (buttons, headings,
backgrounds), plus its own firefly color and garden flower/grass colors,
so it reads as a different flavor of the same magical-garden aesthetic
rather than a different site. Picking one plays a short synthesized chime
(no audio files — generated with the Web Audio API) if sound is turned on
via the toggle in the same menu; sound defaults to off. Both the theme and
the light/dark mode persist per-browser via `localStorage`.

There's also a secret fifth theme, **Wonderland** 🪄 (hot pink/gold/teal) —
typing the word "magic" anywhere on the page (desktop keyboard only)
triggers a sparkle-shower reveal, switches to it immediately, and adds it
to the picker for good from then on (`localStorage`-persisted, same
pattern as the Matrix secret page).

Add a new theme by adding an entry to `themeFlavors` in
[`src/data/themeFlavors.ts`](src/data/themeFlavors.ts) — light/dark
palette, firefly color, five garden colors, and a chime pitch/waveform.
Nothing else needs to change; every themed surface (Tailwind's
`primary`/`secondary`/`accent` utilities, `var(--bg)`/`var(--fg)`, the
firefly glow, and the Hero/Footer garden) reads from CSS custom properties
that `useThemeSettings` applies on `:root`, so a new theme is just new
data. Set `secret: true` to hide it from the picker until something
unlocks it (see `unlockWonderland` in `useThemeSettings.ts` for the
pattern).

## Seasons

Independent of the color theme, a small weather layer drifts over the
fireflies — petals in spring, rising light motes in summer, falling
leaves in autumn, snow in winter. It defaults to "Auto," which follows
the real calendar, and can be overridden from the same theme-picker menu
that has the color themes and sound toggle. Add a season in
[`src/data/seasons.ts`](src/data/seasons.ts).

## More easter eggs

Besides the Konami/swipe → terminal → Matrix page chain: typing "magic"
unlocks the Wonderland theme (above), and clicking the "Dorothy ✦" logo
7 times within 3 seconds shows a small "you found a hidden spark" toast.
There's also a permanent, always-on pixie-dust cursor trail on
fine-pointer devices (`src/components/decor/PixieDustTrail.tsx`) —
not hidden, just a bit of ambient magic.

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

## Content admin panel (CMS)

Once Firebase is connected (see below), open `/#/admin` on your deployed
site and sign in to edit **everything** — profile, journey timeline,
projects, album photos (including uploading new ones directly, no git
needed), fun facts, trivia, memory-match cards, and guestbook moderation.
Changes save to Firestore and appear live on the public site immediately,
in every open tab — no rebuild, no deploy, no waiting.

Until Firebase is connected, the site runs entirely on the static files in
`src/data/` (see below) and `/#/admin` shows a "not set up yet" message —
nothing is broken, it just isn't dynamic yet.

### One-time Firebase setup (~5 minutes, stays on the free Spark plan)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project** (any name, Google Analytics optional)
2. **Build → Firestore Database** → Create database → **production mode**
3. **Build → Authentication** → Get started → enable **Email/Password** → **Users** tab → **Add user** with your own email + a password (this is your `/#/admin` login — there's no public sign-up)
4. In **Firestore Database → Rules**, paste the contents of [`firestore.rules`](firestore.rules) and publish
5. **⚙️ Project settings** → scroll to "Your apps" → click **`</>`** → register a web app → copy the `firebaseConfig` values

No Cloud Storage needed — as of late 2024 Firebase requires the paid
Blaze plan for Storage, so uploaded photos are instead compressed in the
browser and stored directly as Firestore documents (see "Album photos"
below). Firestore + Auth alone stay on the free Spark plan.

Then wire those values in two places:

- **Local dev:** copy [`.env.local.example`](.env.local.example) to `.env.local` and fill it in (gitignored, never committed)
- **Deployed site:** add each value as a **repository secret** (Settings → Secrets and variables → Actions → New repository secret) with the exact names from `.env.local.example` (`VITE_FIREBASE_API_KEY`, etc.) — the deploy workflow already reads them

These config values are safe to be public (Firebase enforces access via
the security rules files, not by hiding this config) — but keeping them
out of git and in secrets/env files is still good practice.

### Migrating your existing content into Firestore

The admin panel starts each editor pre-filled from the current static data
in `src/data/`, so the very first time you open a tab and hit **Save
changes**, that content is copied into Firestore and the live site starts
reading from there instead. Do this once per tab (Profile, Journey,
Projects, Album photos, Fun facts, Trivia, Memory cards) whenever you're
ready to make that section dynamic — there's no need to do it all at once.

## Editing content directly (no Firebase needed)

This is what the site falls back to when Firebase isn't connected, and
it's also the *seed* content the admin panel starts from the first time
each editor is opened:

| File | What it controls |
|---|---|
| `src/data/profile.ts` | Name, tagline, bio, social links |
| `src/data/journey.ts` | Timeline entries on the "My Journey" section |
| `src/data/projects.ts` | Project cards |
| `src/data/trivia.ts` | Trivia quiz questions |
| `src/data/funFacts.ts` | Personal fun facts for the "Fun Facts" game (also shown on the secret Matrix page) |
| `src/data/memoryCards.ts` | The 8 pairs used in the memory-match game |
| `src/data/photos.ts` | Album photos: category, caption, and file path |

Editing these files requires a commit + a ~1-2 minute deploy to go live —
if Firebase is connected, editing the same content through `/#/admin`
instead goes live immediately with no deploy at all.

### Adding real photos to the Album

Photos live in one folder per category:

```
public/photos/prism-2026/
public/photos/uec-2026/
public/photos/fyp/
public/photos/behind-the-scenes/
```

Each entry in `src/data/photos.ts` points at a path like
`photos/prism-2026/prism-gold.jpg` (relative — **no leading `/`**, since an
absolute path would resolve against the domain root and break under the
GitHub Pages `/portfolio/` subpath). Until that file exists, the Album
shows a placeholder card naming the exact filename it's waiting for, so
you can see the full layout before uploading anything.

To add a real photo: drop the image into the matching category folder
under `public/photos/` with the matching filename (or edit the `src` path
in `photos.ts` to whatever you used) and it swaps in automatically — no
code changes needed. Add a new category by adding a folder + a new entry
in the `categories` array + photo entries referencing it.

Once Firebase is connected, the Album photo editor in `/#/admin` can
upload new images directly — no git needed for future photos. Each photo
is resized and JPEG-compressed in the browser (no Storage/billing
required) and saved straight to Firestore, one document per photo.

## Guestbook

A public "leave a message" form near the bottom of the site (needs
Firebase — see above). Every submission lands as **pending** and is
invisible to other visitors until approved in `/#/admin` → Guestbook,
so nothing offensive can appear on the page unreviewed. A hidden honeypot
field silently drops obvious bot submissions.

## Deployment

Deploys automatically to **GitHub Pages** on every push to `main` via
`.github/workflows/deploy.yml` (using `actions/deploy-pages`, no `gh-pages`
branch needed).

**One-time setup:** in the repo's Settings → Pages, set "Source" to
**GitHub Actions**. After that, every push to `main` deploys automatically.

Your site will be live at `https://<your-username>.github.io/portfolio/`.

### Adding a custom domain later

The build uses a relative base path (`base: './'` in `vite.config.ts`), so
the same build works unchanged whether it's served from a GitHub Pages
subpath or the root of a custom domain — **no rebuild/config change
needed**. Once you've bought a domain:

1. Add a `public/CNAME` file containing just your domain, e.g. `dorothytai.dev`
2. In the repo's Settings → Pages → Custom domain, enter the same domain
3. Point your domain's DNS at GitHub Pages ([GitHub's guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site))
