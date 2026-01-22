import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Fixed: Explicitly import process from node:process to resolve typing error where 'cwd' is missing on global process type.
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: '/',
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1600,
    },
    define: {
      'process.env': {
        // Fixed: Added :any type to reduce accumulator to allow dynamic indexing.
        ...Object.keys(env).reduce((acc: any, key) => {
          acc[key] = env[key];
          return acc;
        }, {}),
        API_KEY: env.API_KEY || "",
        FIREBASE_API_KEY: env.FIREBASE_API_KEY || "",
        FIREBASE_AUTH_DOMAIN: env.FIREBASE_AUTH_DOMAIN || "",
        FIREBASE_DATABASE_URL: env.FIREBASE_DATABASE_URL || "",
        FIREBASE_PROJECT_ID: env.FIREBASE_PROJECT_ID || "",
        FIREBASE_STORAGE_BUCKET: env.FIREBASE_STORAGE_BUCKET || "",
        FIREBASE_MESSAGING_SENDER_ID: env.FIREBASE_MESSAGING_SENDER_ID || "",
        FIREBASE_APP_ID: env.FIREBASE_APP_ID || "",
        FIREBASE_MEASUREMENT_ID: env.FIREBASE_MEASUREMENT_ID || "",
      }
    },
  };
});
