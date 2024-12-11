import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
//import mdx from "@astrojs/mdx";
//import { remarkPlugin, rehypePlugin } from './src/lib/infographyRemarkPlugins';

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: "es",
    locales: ["es", {codes: ["en", "en_US", "en_UK"], path: "english"}],
  },
  experimental: {
    contentLayer: true,
  },
  integrations: [
    tailwind(),
    //mdx()
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    //remarkPlugins: [[ remarkPlugin, { option1: "contents" } ]],
    //rehypePlugins: [[ rehypePlugin, { option1: "contents" } ]]
  }
});
