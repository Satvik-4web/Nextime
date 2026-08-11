const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const apiCalls = [];
  
  page.on('response', async (response) => {
    const url = response.url();
    // We are interested in XHR/Fetch responses
    if (response.request().resourceType() === 'fetch' || response.request().resourceType() === 'xhr') {
      console.log('Intercepted:', url);
      try {
        if (url.includes('.json') || url.includes('api')) {
          const data = await response.json();
          console.log(`Data from ${url}:`, JSON.stringify(data).substring(0, 200));
        }
      } catch (e) {
        console.log(`Could not parse JSON from ${url}`);
      }
    }
  });

  await page.goto('https://www.stushark.com/', { waitUntil: 'networkidle0' });
  
  console.log("Page loaded. Checking localStorage for any cached timetable data...");
  const localStorageData = await page.evaluate(() => {
    return Object.assign({}, window.localStorage);
  });
  console.log("Local Storage Keys:", Object.keys(localStorageData));
  
  await browser.close();
})();
