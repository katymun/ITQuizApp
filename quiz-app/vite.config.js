import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/ITQuizApp/",
  plugins: [react()],
  erver: {
    host: 'localhost',
    port: 5173,          // or whatever port you like
    strictPort: true     // if you want Vite to fail instead of picking a new port
  }
})
