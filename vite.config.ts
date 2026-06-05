import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base = subpad waarop de app op GitHub Pages draait: https://<gebruiker>.github.io/wk2026/
// build.outDir = 'docs' zodat GitHub Pages direct vanuit de main-branch /docs kan serveren.
export default defineConfig({
  base: '/wk2026/',
  plugins: [react()],
  build: {
    outDir: 'docs',
  },
})
