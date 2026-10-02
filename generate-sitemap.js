import fs from 'fs';

// 1. Read JSON data
const employmentData = JSON.parse(fs.readFileSync('./src/data/employment.json', 'utf-8'));
const propertyData = JSON.parse(fs.readFileSync('./src/data/property.json', 'utf-8'));

// CHANGE THIS TO YOUR ACTUAL DOMAIN
const BASE_URL = 'https://www.youraffordabilitydomain.co.uk';

const getSlug = (str) => String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const uniqueProfessions = [...new Set(employmentData.map(j => getSlug(j.Spine_Point_or_Role)))];
const uniqueLocations = [...new Set(propertyData.map(l => getSlug(l.Region_Name)))];

const allUrls = [];

// 2. Build complete list of URLs
allUrls.push(`${BASE_URL}/`);

uniqueProfessions.forEach(prof => allUrls.push(`${BASE_URL}/professions/${prof}`));
uniqueLocations.forEach(loc => allUrls.push(`${BASE_URL}/locations/${loc}`));

uniqueProfessions.forEach(prof => {
  uniqueLocations.forEach(loc => {
    allUrls.push(`${BASE_URL}/affordability/${prof}/in/${loc}`);
  });
});

console.log(`Total URLs compiled: ${allUrls.length}`);

// 3. Chunk into files of 40,000 URLs (under Cloudflare 25MB & Google 50k limits)
const CHUNK_SIZE = 40000;
const sitemapFiles = [];

for (let i = 0; i < allUrls.length; i += CHUNK_SIZE) {
  const chunk = allUrls.slice(i, i + CHUNK_SIZE);
  const fileIndex = Math.floor(i / CHUNK_SIZE) + 1;
  const fileName = `sitemap-${fileIndex}.xml`;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  chunk.forEach(url => {
    xml += `  <url><loc>${url}</loc></url>\n`;
  });
  xml += `</urlset>`;

  fs.writeFileSync(`./public/${fileName}`, xml);
  sitemapFiles.push(fileName);
  console.log(`Generated ./public/${fileName} (${chunk.length} URLs)`);
}

// 4. Generate the master sitemap index file (sitemap.xml)
let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
sitemapFiles.forEach(file => {
  indexXml += `  <sitemap><loc>${BASE_URL}/${file}</loc></sitemap>\n`;
});
indexXml += `</sitemapindex>`;

fs.writeFileSync('./public/sitemap.xml', indexXml);
console.log(`Master sitemap.xml index created pointing to ${sitemapFiles.length} files.`);
