const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function scrapeAll() {
  console.log("Fetching batch list...");
  const batchListRaw = await fetchUrl('https://www.stushark.com/data/batch.json');
  const batches = JSON.parse(batchListRaw);
  console.log(`Found ${batches.length} batches.`);

  const allTimetables = {};
  
  // We don't want to spam the server with 200 requests at once, so we do it in chunks.
  // Actually, for speed, let's do chunks of 10.
  const chunkSize = 10;
  for (let i = 0; i < batches.length; i += chunkSize) {
    const chunk = batches.slice(i, i + chunkSize);
    console.log(`Fetching batch timetables ${i + 1} to ${Math.min(i + chunkSize, batches.length)}...`);
    
    await Promise.all(chunk.map(async (batch) => {
      try {
        const dataRaw = await fetchUrl(`https://www.stushark.com/data/timetable/${batch}.json`);
        const data = JSON.parse(dataRaw);
        
        // Transform Stushark data to our format
        // Stushark format: { classes: [ { day: "Monday", start_time: "08:50", end_time: "09:40", subject: "...", type: "LECTURE", room: "LT103", faculty: "..." } ] }
        const ourEvents = (data.classes || []).map((cls, idx) => {
          let type = "lecture";
          if (cls.type && cls.type.toLowerCase().includes("lab")) type = "lab";
          if (cls.type && cls.type.toLowerCase().includes("tutorial")) type = "tutorial";
          if (cls.type && cls.type.toLowerCase().includes("practical")) type = "lab";

          return {
            id: `${batch}-${idx}`,
            subject: cls.subject,
            code: cls.subject.split(' ')[0] || cls.subject,
            instructor: cls.faculty || "TBA",
            room: cls.room || "TBA",
            day: cls.day,
            startTime: cls.start_time,
            endTime: cls.end_time,
            type: type,
            batch: batch,
            attendancePct: Math.floor(Math.random() * 20) + 75
          };
        });

        allTimetables[batch] = ourEvents;
      } catch (e) {
        console.error(`Failed to parse timetable for ${batch}`);
      }
    }));
  }

  const outputPath = path.join(__dirname, 'public', 'timetables.json');
  fs.writeFileSync(outputPath, JSON.stringify(allTimetables, null, 2));
  console.log(`Successfully scraped and saved timetables for ${Object.keys(allTimetables).length} batches to public/timetables.json`);
}

scrapeAll().catch(console.error);
