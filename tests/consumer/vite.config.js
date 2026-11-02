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
  },
});
