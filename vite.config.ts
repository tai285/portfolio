import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base so the build works unchanged whether it's served from
// https://tai285.github.io/portfolio/ (GitHub Pages project site) or
// from the root of a future custom domain.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
