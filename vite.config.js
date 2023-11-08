/* eslint-disable no-undef */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
      plugins: [react(),],
      /*server: {
        proxy: {
          '/VITE_NEURAL_SEEK_QUESTIONS_URL': {
            target: process.env.VITE_NEURAL_SEEK_QUESTIONS_URL,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/VITE_NEURAL_SEEK_QUESTIONS_URL/, ''),
          },
        }
      }*/
  });
}