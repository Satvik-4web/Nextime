const xlsx = require('xlsx');

try {
  const workbook = xlsx.readFile('C:\\Users\\satvi\\Downloads\\TIME TABLE JULYTODEC2026.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
  const row4 = data[3] || [];
  const batches = [];
  
  for (let c = 0; c < row4.length; c++) {
    const cell = row4[c];
    if (typeof cell === 'string' && /^[0-9A-Z]+$/.test(cell.trim()) && cell.trim().length < 6) {
      batches.push({ name: cell.trim(), colIndex: c });
    }
  }
  
  console.log("Found Batches:", batches);
} catch (error) {
  console.error("Error reading file:", error.message);
}
