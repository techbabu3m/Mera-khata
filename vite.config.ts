import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

let geminiKey = process.env.GEMINI_API_KEY || '';
if (!geminiKey) {
  try {
    if (fs.existsSync('/app/.dev.env.json')) {
      const devEnv = JSON.parse(fs.readFileSync('/app/.dev.env.json', 'utf8'));
      geminiKey = devEnv.GEMINI_API_KEY || '';
    }
  } catch (e) {
    // ignore
  }
}
if (!geminiKey) {
  try {
    if (fs.existsSync('.env')) {
      const envContent = fs.readFileSync('.env', 'utf8');
      const match = envContent.match(/GEMINI_API_KEY=(.*)/);
      if (match) geminiKey = match[1].trim();
    }
  } catch (e) {
    // ignore
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.GEMINI_API_KEY': JSON.stringify(geminiKey),
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  }
});

