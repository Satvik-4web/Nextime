const xlsx = require('xlsx');
const fs = require('fs');

try {
  const workbook = xlsx.readFile('C:\\Users\\satvi\\Downloads\\TIME TABLE JULYTODEC2026.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
  const batchesData = {};
  
  // 1. Identify batches from Row 4 (index 4)
  const row4 = data[4] || [];
  const batches = [];
  for (let c = 0; c < row4.length; c++) {
    const cell = row4[c];
    if (typeof cell === 'string' && cell.trim().length > 0 && cell.trim().length <= 5 && /^[0-9A-Z]+$/.test(cell.trim())) {
      const batchName = cell.trim();
      batches.push({ name: batchName, colIndex: c });
      batchesData[batchName] = [];
    }
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let currentDayIndex = -1;

  // Helper to convert fractional time
  function excelTimeToHHMM(fraction) {
    if (typeof fraction !== 'number') return null;
    const totalMinutes = Math.round(fraction * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  // 2. Scan through rows and map events to each batch column
  for (let r = 0; r < data.length; r++) {
    const row = data[r];
    if (!row) continue;

    // Detect day changes
    const dayStr = row.find(cell => typeof cell === 'string' && ['M', 'T', 'W', 'Th', 'F'].includes(cell.trim()));
    if (dayStr === 'M') currentDayIndex = 0;
    if (dayStr === 'T' && currentDayIndex === 0) currentDayIndex = 1;
    if (dayStr === 'W') currentDayIndex = 2;
    if (dayStr === 'T' && currentDayIndex === 2) currentDayIndex = 3;
    if (dayStr === 'F') currentDayIndex = 4;

    // Detect time rows
    const timeFraction = row.find(cell => typeof cell === 'number' && cell > 0.3 && cell < 0.8);
    if (timeFraction && currentDayIndex !== -1) {
      const startTime = excelTimeToHHMM(timeFraction);
      const startMins = Math.round(timeFraction * 24 * 60);
      const endHours = Math.floor((startMins + 50) / 60);
      const endMins = (startMins + 50) % 60;
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

      // Check each batch's column
      for (const batch of batches) {
        // Classes can sometimes be a bit wider (merged cells), so let's check colIndex to colIndex + 15
        for (let c = batch.colIndex; c < batch.colIndex + 16; c++) {
          const cell = row[c];
          if (typeof cell === 'string' && /^[A-Z]{3,4}[0-9]{3}[A-Z]?$/.test(cell.trim())) {
            let room = "TBA";
            if (data[r+1] && data[r+1][c] && typeof data[r+1][c] === 'string') {
               room = data[r+1][c].trim().substring(0, 10);
            }

            const type = cell.endsWith('P') ? 'lab' : cell.endsWith('T') ? 'tutorial' : 'lecture';

            // Avoid adding same exact class twice for same batch
            const exists = batchesData[batch.name].find(e => e.day === days[currentDayIndex] && e.startTime === startTime);
            if (!exists) {
              batchesData[batch.name].push({
                id: `${batch.name}-${r}-${c}`,
                subject: cell.trim(),
                code: cell.trim(),
                instructor: "TBA",
                room: room || "TBA",
                day: days[currentDayIndex],
                startTime,
                endTime,
                type,
                batch: batch.name,
                attendancePct: Math.floor(Math.random() * 20) + 75
              });
            }
            break; // Found class for this batch in this timeslot
          }
        }
      }
    }
  }

  // Ensure public dir exists
  if (!fs.existsSync('public')) fs.mkdirSync('public');
  
  fs.writeFileSync('public/timetables.json', JSON.stringify(batchesData, null, 2));
  console.log(`Successfully extracted ${Object.keys(batchesData).length} batches to public/timetables.json`);
} catch (error) {
  console.error("Error reading file:", error.message);
}
