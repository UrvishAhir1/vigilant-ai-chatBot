import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig(({ command, mode, ssrBuild }) => {
  const isServer = ssrBuild === true

  return {
    plugins: [react()],
    build: {
      ssr: isServer,
      outDir: isServer ? 'dist/server' : 'dist/client',
      rollupOptions: {
        input: isServer ? './src/entry-server.jsx' : './index.html',
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // ✅ Add this block to fix the Azure error
    server: {
      allowedHosts: ['vigilant-ai-chatbot.azurewebsites.net']
      // or use allowedHosts: 'all' for quick testing
    },
  }
})
