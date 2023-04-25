import { defineConfig, loadEnv, UserConfigExport } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const isProd = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default ({ mode }: any): UserConfigExport => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    base: isProd ? '/' : '/',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      port: 8000
    }
  })
}
