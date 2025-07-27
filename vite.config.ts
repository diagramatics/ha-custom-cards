import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

const CORS_DEFAULT =
  /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const CORS_ORIGIN = env.CORS_ORIGIN?.split(',') || [];

  return {
    plugins: [
      react({
        // plugins: [['@preact-signals/safe-react/swc', {}]]
      }),
      tailwindcss(),
    ],
    server: {
      cors: {
        origin: [...CORS_ORIGIN, CORS_DEFAULT],
      },
    },
    preview: {
      port: 5173,
      strictPort: true,
      cors: {
        origin: [...CORS_ORIGIN, CORS_DEFAULT],
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        input: {
          build: 'src/build.ts',
          dev: 'src/ha-dev.ts',
        },
        output: {
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === 'dev') {
              return 'ha-dev.js';
            }
            return 'ha-custom-cards.js';
          },
          chunkFileNames: `[name].js`,
          assetFileNames: `[hash].[ext]`,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
