import tailwindcss from '@tailwindcss/vite';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    svelte({
      preprocess: vitePreprocess({
        script: true,
      }),
    }),
  ],
  build: {
    target: 'es2022',
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress Rollup warnings about uninterpretable pure annotations from node_modules
        if (
          warning.code === 'INVALID_ANNOTATION' ||
          warning.message.includes('@__PURE__') ||
          warning.id?.includes('svelte-sonner')
        ) {
          return;
        }

        warn(warning);
      },
    },
  },
});
