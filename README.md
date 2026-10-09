# IPR 2025 website

Website for the MCMC Industry Performance Report 2025. It's a static,
multi-page site built with [Vite](https://vite.dev) and plain JavaScript (no
framework). Charts use [Chart.js](https://www.chartjs.org).

## Running it locally

You need **Node.js 20.19+ or 22.12+** (the minimum for Vite 8).

```sh
npm install      # first time only
npm run dev      # dev server with hot reload, at http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server. Edits reload in the browser. |
| `npm run build` | Builds the production site into `dist/`. |
| `npm run preview` | Serves `dist/` locally so you can check a build before deploying. |

## Pages

| Page | Script | Notes |
| --- | --- | --- |
| `index.html` | `src/main.js` | Home page |
| `chapters.html` | `src/main.js` | Grid of the 8 chapters |
| `chapter.html` | `src/chapter.js` | One template for every chapter, picked by the URL hash (`chapter.html#chapter-3`) and filled from `src/data/chapters.js` |

Every page loads `src/main.js`, which brings in `src/style.css` and runs the
shared behaviour: the looping background video, the nav and phone menu, and
the scroll reveal and line-draw animations.

**Adding a page:** create the HTML file at the root *and* add it to
`build.rollupOptions.input` in `vite.config.js`. Otherwise `npm run build`
silently leaves it out.

## Project layout

```
index.html, chapters.html, chapter.html   pages
src/
  main.js          shared behaviour (imported by every page)
  chapter.js       chapter page
  style.css        all site styles
  data/chapters.js chapter names, intro text and images
  fonts/           self-hosted Figtree
images/            photos, chapter covers and backgrounds, background video
public/            copied to the site as-is (favicon, report PDF)
archive/statistics/  retired Statistics page, kept for reuse (see below)
```

## This branch: `ipr-anim`

This branch is for developing chart animations in the chapter page's **Key
Highlights 2025** section (`#chapter-highlights` in `chapter.html`).

The old Statistics page, its charts and the report's figure data have moved
to `archive/statistics/`. It's no longer linked or built, but it still runs:
with `npm run dev` going, open
http://localhost:5173/archive/statistics/statistics.html. See
[archive/statistics/README.md](archive/statistics/README.md) for which chart
code to bring back into `src/` and how to rebuild the figure data (Python
with `openpyxl`).

## Deploying

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the site
and publishes `dist/` to GitHub Pages. Other branches, this one included,
don't deploy. Asset URLs are relative (`base: './'` in `vite.config.js`), so
the build works from any subpath.
