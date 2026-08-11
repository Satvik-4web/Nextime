const xlsx = require('xlsx');

try {
  const workbook = xlsx.readFile('C:\\Users\\satvi\\Downloads\\TIME TABLE JULYTODEC2026.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
  // Find the row with batch names. It's likely row 2 or 3 (index 1 or 2).
  // Let's print rows 0 to 5 to see where the batch names are.
  for (let i = 0; i < 5; i++) {
    const row = data[i] || [];
    const nonNullCells = row.map((cell, idx) => cell ? `Col ${idx}: ${cell}` : null).filter(Boolean);
    console.log(`\nRow ${i} non-null cells:`);
    console.log(nonNullCells.slice(0, 20).join(', '));
  }
} catch (error) {
  console.error("Error reading file:", error.message);
}
