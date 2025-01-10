import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: 'es',
    locales: ['es', { codes: ['en', 'en_US', 'en_UK'], path: 'english' }],
  },
  redirects: {
    '/blog/posts': '/blog/posts/0',
    '/blog/links': '/blog/links/0',
  },
  integrations: [tailwind()],
});
