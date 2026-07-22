// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

const site = 'https://exif.utilitas.app';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  integrations: [vue()],
  vite: {
    build: { sourcemap: false },
    worker: { format: 'es' },
  },
});
