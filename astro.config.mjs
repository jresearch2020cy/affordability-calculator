import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://affordabilitycalculator.co.uk',
  output: 'hybrid',
  adapter: cloudflare()
});
