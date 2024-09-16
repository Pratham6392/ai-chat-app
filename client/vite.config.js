import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
			"/auth": {
				target: "http://localhost:6000",
			},
			"/users": {
						target: "http://localhost:6000",
			},
			"/message": {
						target: "http://localhost:6000",
			},
		},
  }
})
