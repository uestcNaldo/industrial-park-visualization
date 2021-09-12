import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0'
  },
  plugins: [vue()],
  resolve: {
    alias: {
      css: path.resolve(__dirname, 'src/assets/css'),
      image: path.resolve(__dirname, 'src/assets/image'),
      components: path.resolve(__dirname, 'src/components'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "css/variables.scss";@import "css/mixins.scss";'
      }
    }
  }
})
