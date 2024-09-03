import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import listDirectory from 'astro-list-directory-integration';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), listDirectory()]
});