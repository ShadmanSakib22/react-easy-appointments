import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_URL ?? '/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      // Point CSS import to source so no rebuild is needed during dev
      {
        find: 'react-easy-appointments/styles',
        replacement: path.resolve(__dirname, '../../packages/react-easy-appointments/src/styles/base.css'),
      },
      // Point JS import to source for instant hot-reload of package changes
      {
        find: 'react-easy-appointments',
        replacement: path.resolve(__dirname, '../../packages/react-easy-appointments/src/index.ts'),
      },
    ],
  },
})
