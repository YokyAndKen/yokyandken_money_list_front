import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  base: './',
  server: {
    host: '0.0.0.0',
    https: false,
    open: false,
    port: 8080,
    proxy: {
        '/wx': {
            target: 'http://172.34.120.88:27896',
            changeOrigin: true,
            secure: false, // 如果是https接口，须配置；了；。；。；
        },
        '/api': {
          target: 'http://172.34.120.87:30100',
          changeOrigin: true,
          secure: false, // 如果是https接口，须配置；了；。；。；
      }
    }
},
})
