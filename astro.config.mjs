import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pinkflow.ai',
  integrations: [tailwind({ applyBaseStyles: false }), sitemap()],
});
