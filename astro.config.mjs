import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // YOU MUST ADD YOUR DOMAIN HERE FOR SITEMAP TO WORK
  site: 'https://www.youraffordabilitydomain.co.uk', 
  
  output: 'hybrid',
  adapter: cloudflare(),
  
  integrations: [
    sitemap({
      // This tells the sitemap to ignore the infinite dynamic routes
      // Google will still find them naturally by crawling the links on your site
      filter: (page) => !page.includes('/affordability/')
    })
  ]
});
