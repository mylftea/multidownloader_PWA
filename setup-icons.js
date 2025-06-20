const fs = require('fs');

// HTML <head> tags for favicons and manifest
const faviconLinks = `
  <!-- Favicon and PWA Meta -->
  <link rel="icon" type="image/png" sizes="32x32" href="./static/assets/32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="./static/assets/16x16.png">
  <link rel="apple-touch-icon" sizes="192x192" href="./static/assets/192x192.png">
  <link rel="manifest" href="manifest.json">
`;

// Update index.html
let htmlPath = 'index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

if (!html.includes('rel="manifest"')) {
    html = html.replace('<head>', `<head>\n${faviconLinks.trim()}`);
    fs.writeFileSync(htmlPath, html);
    console.log('✅ Updated index.html with favicon and manifest links.');
} else {
    console.log('ℹ️ index.html already contains favicon links.');
}

// Update manifest.json
let manifestPath = 'manifest.json';
let manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.icons = [
    {
        src: "./static/assets/192x192.png",
        sizes: "192x192",
        type: "image/png"
    },
    {
        src: "./static/assets/512x512.png",
        sizes: "512x512",
        type: "image/png"
    }
];
manifest.display = "standalone";
manifest.scope = ".";
manifest.start_url = ".";

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✅ Updated manifest.json with PWA icons and settings.');
