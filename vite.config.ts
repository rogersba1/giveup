import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: true, // This will use Vite's built-in HTTPS with auto-generated certificates
    port: 5000,
    host: 'localhost',
  },
})
