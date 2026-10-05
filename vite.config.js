import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  // Relative base so built asset URLs work regardless of the repo name
  // or subpath GitHub Pages serves the site from.
  base: './',
  build: {
    rollupOptions: {
      // vite build only bundles index.html by default — every other page
      // needs to be listed here explicitly or it's silently left out of dist/.
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        statistics: resolve(import.meta.dirname, 'statistics.html'),
        chapters: resolve(import.meta.dirname, 'chapters.html'),
        chapter: resolve(import.meta.dirname, 'chapter.html'),
      },
    },
  },
})
