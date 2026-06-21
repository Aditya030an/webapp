import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Some libraries (e.g. @react-pdf/renderer) reference Node's `global`.
  define: {
    global: 'globalThis',
  },
})
