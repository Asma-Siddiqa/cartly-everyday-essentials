import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cartly is a single-page React app. On hosts that do not support SPA rewrites,
// see README.md → Deployment for the rewrite configuration.
export default defineConfig({
  plugins: [react()],
})
