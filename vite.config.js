import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env vars from .env file
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: 'src',
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
    define: {
      // Inject env vars into the app at build time (safe — no server-side exposure)
      __BOT_TOKEN__: JSON.stringify(env.VITE_BOT_TOKEN || ''),
      __CHAT_ID__:   JSON.stringify(env.VITE_CHAT_ID   || ''),
    },
  };
});
