import vue from '@vitejs/plugin-vue'

export default {
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src/'
    }
  }
}
