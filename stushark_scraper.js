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

async function scrape() {
  const html = await fetchUrl('https://www.stushark.com/');
  
  // Extract all JS links
  const regex = /href="(\/_nuxt\/.*?\.js)"/g;
  let match;
  const jsFiles = [];
  while ((match = regex.exec(html)) !== null) {
    jsFiles.push(match[1]);
  }
  
  console.log("Found JS files:", jsFiles);
  
  for (const file of jsFiles) {
    const jsUrl = `https://www.stushark.com${file}`;
    console.log(`\nFetching ${jsUrl}...`);
    const jsContent = await fetchUrl(jsUrl);
    
    // Look for API endpoints or json files
    const apiRegex = /(https?:\/\/[^\s"'`]+api[^\s"'`]*|\/[a-zA-Z0-9_\-\/]+\.json)/g;
    const matches = jsContent.match(apiRegex) || [];
    if (matches.length > 0) {
      console.log(`Found endpoints in ${file}:`, [...new Set(matches)]);
    }
  }
}

scrape().catch(console.error);
