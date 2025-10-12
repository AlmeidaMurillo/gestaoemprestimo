import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração para corrigir erro de build com jspdf
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['jspdf', 'jspdf-autotable'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // ✅ permite ESM + CommonJS misturados
      include: [/jspdf/, /jspdf-autotable/, /node_modules/],
    },
  },
})
