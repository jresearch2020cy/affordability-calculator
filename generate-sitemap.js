import fs from 'fs';

// Read JSON files directly using the file system to avoid Node version quirks
const employmentData = JSON.parse(fs.readFileSync('./src/data/employment.json', 'utf-8'));
const propertyData = JSON.parse(fs.readFileSync('./src/data/property.json', 'utf-8'));

// CHANGE THIS TO YOUR ACTUAL DOMAIN
const BASE_URL = 'https://www.youraffordabilitydomain.co.uk';

// Clean slugs to match your URLs
const getSlug = (str) => String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const uniqueProfessions = [...new Set(employmentData.map(j => getSlug(j.Spine_Point_or_Role)))];
const uniqueLocations = [...new Set(propertyData.map(l => getSlug(l.Region_Name)))];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// 1. Add static base pages
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

// Write the file to your public folder so Cloudflare just serves it as static text
fs.writeFileSync('./public/sitemap.xml', xml);
console.log(`Successfully generated sitemap.xml with ${1 + uniqueProfessions.length + uniqueLocations.length + (uniqueProfessions.length * uniqueLocations.length)} URLs!`);
