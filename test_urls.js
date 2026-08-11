const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        // If it starts with <!, it's HTML (404 for Stushark SPA)
        if (!data.trim().startsWith('<!')) {
          console.log(`\nSUCCESS: ${url}`);
          console.log(data.substring(0, 150));
          resolve(true);
        } else {
          resolve(false);
        }
      });
    }).on('error', () => resolve(false));
  });
}

async function testUrls() {
  const batch = "1A11";
  const urls = [
    `https://www.stushark.com/data/${batch}.json`,
    `https://www.stushark.com/data/timetable/${batch}.json`,
    `https://www.stushark.com/data/timetables/${batch}.json`,
    `https://www.stushark.com/data/batches/${batch}.json`,
    `https://www.stushark.com/data/schedule/${batch}.json`,
    `https://www.stushark.com/api/timetable/${batch}`,
    `https://www.stushark.com/api/batch/${batch}`,
    `https://www.stushark.com/timetables/${batch}.json`,
    `https://www.stushark.com/batches/${batch}.json`,
    `https://www.stushark.com/data/timetable.json`,
    `https://www.stushark.com/data/all.json`
  ];

  for (const url of urls) {
    const success = await checkUrl(url);
    if (success) return;
  }
  console.log("No common URLs worked.");
}

testUrls();
