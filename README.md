# Dorothy's Portfolio

Personal portfolio site — hero, about, journey timeline, projects, an
album/gallery with a category-filterable carousel, and a "Playground"
section with three minigames (fun facts, trivia quiz, memory match). Plus a
hidden CTF-style easter egg (console hint → Konami code / swipe pattern →
terminal riddle → glitched secret page). Built with React, TypeScript, Vite,
Tailwind CSS v4, and Framer Motion.

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

## Editing content

Everything content-related lives in `src/data/`, so you shouldn't need to
touch component code to update text:

| File | What it controls |
|---|---|
| `src/data/profile.ts` | Name, tagline, bio, social links |
| `src/data/journey.ts` | Timeline entries on the "My Journey" section |
| `src/data/projects.ts` | Project cards |
| `src/data/trivia.ts` | Trivia quiz questions |
| `src/data/funFacts.ts` | **Fill these in!** Placeholder personal fun facts for the "Fun Facts" game (also shown on the secret Matrix page) |
| `src/data/memoryCards.ts` | The 8 pairs used in the memory-match game |
| `src/data/photos.ts` | Album photos: category, caption, and file path |

### Adding real photos to the Album

Each entry in `src/data/photos.ts` points at a path like
`/photos/prism-gold.jpg`. Until that file exists, the Album shows a cute
placeholder card naming the exact filename it's waiting for — so you can
see the full layout before uploading anything. To add a real photo: drop
the image into `public/photos/` with the matching filename (or edit the
`src` path to whatever you used) and it swaps in automatically, no code
changes needed. Add/rename/remove entries and categories in that same file.

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
