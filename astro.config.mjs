import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://affordabilitycalculator.co.uk',
  output: 'hybrid',
  adapter: cloudflare(),
  integrations: [sitemap()]
});
