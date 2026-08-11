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
  const jsContent = await fetchUrl('https://www.stushark.com/_nuxt/Biun2LVg.js');
  
  const matches = jsContent.match(/["'](\/[a-zA-Z0-9_\-\/]+\.json)["']/g);
  console.log("JSON endpoints in Biun2LVg.js:");
  console.log([...new Set(matches)]);
}

findData().catch(console.error);
