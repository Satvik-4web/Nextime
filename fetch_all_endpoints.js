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
    'Biun2LVg.js',
    'CDklO29P.js',
    'CgJxKYK6.js',
    'D6agKI03.js',
    'D8ErrQ7w.js',
    'jIsZjZww.js'
  ];

  for (const file of jsFiles) {
    const jsContent = await fetchUrl(`https://www.stushark.com/_nuxt/${file}`);
    const matches = jsContent.match(/["']([a-zA-Z0-9_\-\.\/]+\.json)["']/g) || [];
    const unique = [...new Set(matches)];
    if (unique.length > 0) {
      console.log(`Found in ${file}:`, unique);
    }
  }
}

findData().catch(console.error);
