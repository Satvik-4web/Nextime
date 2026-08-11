const fs = require('fs');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function findData() {
  const jsFiles = [
    'bRkADz5Y.js',
    'e2ZopTkG.js',
    'Dpw7HO-c.js',
    'CDklO29P.js',
    'CgJxKYK6.js',
    'D6agKI03.js',
    'D8ErrQ7w.js',
    'jIsZjZww.js'
  ];

  for (const file of jsFiles) {
    const jsContent = await fetchUrl(`https://www.stushark.com/_nuxt/${file}`);
    const matches = jsContent.match(/H\([^)]+\)/g) || [];
    const unique = [...new Set(matches)];
    if (unique.length > 0) {
      console.log(`Found H(...) calls in ${file}:`, unique);
    }
    const fetchMatches = jsContent.match(/fetch\([^)]+\)/g) || [];
    const fUnique = [...new Set(fetchMatches)];
    if (fUnique.length > 0) {
      console.log(`Found fetch(...) calls in ${file}:`, fUnique);
    }
  }
}

findData().catch(console.error);
