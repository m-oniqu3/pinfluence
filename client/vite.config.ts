import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig((env) => {
  // load env vars from .env files
  // filter the vars
  const envs = loadEnv(env.mode, './', ['SERVER_', 'CLIENT_'])

  // get url and api path from env vars
  const serverURL = new URL(envs.SERVER_URL ?? 'http://localhost:3001')
  const serverAPIPath = envs.SERVER_API_PATH ?? '/api'

  const clientURL = new URL(envs.CLIENT_URL ?? 'http://localhost:3000')
  return {
    envDir: '../',
    envPrefix: ['CLIENT_'],

    // make the API path globally available in the client
    define: {
      __API_PATH__: JSON.stringify(serverAPIPath)
    },

    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },

    // when the client requests a path that starts with the API path, proxy the request to the server

    server: {
      port: parseInt(clientURL.port),

      proxy: {
        // the origin (protocol, hostname, and port) of your backend server
        // e.g. /api -> http://localhost:3001
        [serverAPIPath]: serverURL.origin
      }
    },
    build: {
      outDir: '../dist/client',
      emptyOutDir: true
    }
  }
})
