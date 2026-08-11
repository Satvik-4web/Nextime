const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function scrapeData() {
  console.log("Fetching /data/batch.json...");
  const batchData = await fetchUrl('https://www.stushark.com/data/batch.json');
  fs.writeFileSync('stushark_batch.json', batchData);
  console.log("Saved stushark_batch.json");
  
  // Print first 500 chars to see structure
  console.log("Structure:", batchData.substring(0, 500));
}

scrapeData().catch(console.error);
