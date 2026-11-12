import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // 相對路徑：build 出來的 dist/ 放到任何子目錄都能跑（方便打包上傳）
  base: './',
  plugins: [react()],
  // three.js 本身就約 700 kB，提高警告門檻
  build: { chunkSizeWarningLimit: 1000 },
})
