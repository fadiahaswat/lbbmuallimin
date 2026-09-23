import ExcelJS from 'exceljs';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzlwGHrEBvCbWvey0hfeBFZjdcE52Hs17R2jrFxoK15bd1mdet6mgk8bBCWB8CKubQ/exec';
const SECRET_TOKEN = 'LBB_TIMELINE_ADMIN_2027';

async function syncLocalToGoogleSheet() {
  console.log('Reading local TIMELINE PANITIA LBB.xlsx...');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('TIMELINE PANITIA LBB.xlsx');
  const ws = wb.worksheets[0];

  const allRows = [];
  for (let r = 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const rowValues = [];
    for (let c = 1; c <= 4; c++) {
      let val = row.getCell(c).value;
      if (val === null || val === undefined) {
        val = '';
      } else if (typeof val === 'object' && val.richText) {
        val = val.richText.map(t => t.text).join('');
      } else if (typeof val === 'object' && val.text) {
        val = val.text;
      }
      rowValues.push(String(val));
    }
    allRows.push(rowValues);
  }

  console.log(`Sending ${allRows.length} rows to Google Sheet via Web App...`);

  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'replaceAll',
      token: SECRET_TOKEN,
      allRows: allRows
    }),
    redirect: 'follow'
  });

  const resText = await response.text();
  console.log('Server response:', resText);
}

syncLocalToGoogleSheet().catch(console.error);
