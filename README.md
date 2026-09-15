# Dorothy's Portfolio

Personal portfolio site — hero, about, journey timeline, projects, and a
"Playground" section with three minigames (fun facts, trivia quiz, memory
match). Built with React, TypeScript, Vite, Tailwind CSS v4, and Framer
Motion.

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
| `src/data/funFacts.ts` | **Fill these in!** Placeholder personal fun facts for the "Fun Facts" game |
| `src/data/memoryCards.ts` | The 8 pairs used in the memory-match game |

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
