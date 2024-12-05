import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: "es",
    locales: ["es", {codes: ["en", "en_US", "en_UK"], path: "english"}],
  },
  experimental: {
    contentLayer: true,
  },
  integrations: [tailwind()]
});