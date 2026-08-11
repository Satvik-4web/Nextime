const fs = require('fs');

const content = fs.readFileSync('stushark_Biun2LVg.js', 'utf8');

// Find where batch.json is referenced and print 200 chars around it
const index = content.indexOf('batch.json');
if (index !== -1) {
  const start = Math.max(0, index - 200);
  const end = Math.min(content.length, index + 200);
  console.log("Around batch.json:");
  console.log(content.substring(start, end));
}

// Find any string that looks like a timetable endpoint (e.g., includes 'timetable', 'schedule', 'data')
const matches = content.match(/["'][^"']*\/(?:data|timetable|schedule|api)[^"']*["']/g) || [];
console.log("\nPotential endpoints:");
console.log([...new Set(matches)]);
