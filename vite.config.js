import { defineConfig } from 'vite'

export default defineConfig({
  // Relative base so built asset URLs work regardless of the repo name
  // or subpath GitHub Pages serves the site from.
  base: './',
})
