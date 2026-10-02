import fs from 'fs';
import employmentData from './src/data/employment.json' assert { type: 'json' };
import propertyData from './src/data/property.json' assert { type: 'json' };

const BASE_URL = 'https://affordabilitycalculator.co.uk';

// Get unique slugs
const getSlug = (str) => String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
const uniqueProfessions = [...new Set(employmentData.map(j => getSlug(j.Spine_Point_or_Role)))];
const uniqueLocations = [...new Set(propertyData.map(l => getSlug(l.Region_Name)))];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// 1. Add static pages
xml += `  <url><loc>${BASE_URL}/</loc></url>\n`;

// 2. Add hub pages
uniqueProfessions.forEach(prof => {
  xml += `  <url><loc>${BASE_URL}/professions/${prof}</loc></url>\n`;
});
uniqueLocations.forEach(loc => {
  xml += `  <url><loc>${BASE_URL}/locations/${loc}</loc></url>\n`;
});

// 3. Add the massive matrix combinations
uniqueProfessions.forEach(prof => {
  uniqueLocations.forEach(loc => {
    xml += `  <url><loc>${BASE_URL}/affordability/${prof}/in/${loc}</loc></url>\n`;
  });
});

xml += `</urlset>`;

// Write directly to the public folder
fs.writeFileSync('./public/sitemap.xml', xml);
console.log(`Successfully generated sitemap with ${uniqueProfessions.length * uniqueLocations.length + uniqueProfessions.length + uniqueLocations.length + 1} URLs.`);
