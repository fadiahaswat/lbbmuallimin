import ExcelJS from 'exceljs';
import {
  MATERIALS,
  DANTON_CRITERIA,
  RUBRIC_SCALE_TEMPLATES,
  getScaleTemplateForMaterial,
  TIMELINE,
  VENUE
} from '../src/config.js';

async function generateEvaluationWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Panitia LBB Mu'allimin 2027";
  wb.lastModifiedBy = "Dewan Juri LBB Mu'allimin";
  wb.created = new Date();
  wb.modified = new Date();

  // Helper untuk styling sheet
  function setupSheetHeader(ws, title, jenjangText, specLabel, maxPasukanRows) {
    ws.views = [{ showGridLines: true }];

    // KOP & Judul
    ws.mergeCells('A1:L1');
    ws.getCell('A1').value = "FORMULIR PENILAIAN DEWAN JURI";
    ws.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FF991B1B' } };
    ws.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

    ws.mergeCells('A2:L2');
    ws.getCell('A2').value = "LOMBA BARIS - BERBARIS MU'ALLIMIN 2027";
    ws.getCell('A2').font = { bold: true, size: 16, color: { argb: 'FF1E293B' } };
    ws.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };

    ws.mergeCells('A3:L3');
    ws.getCell('A3').value = `${title} (${specLabel})`;
    ws.getCell('A3').font = { bold: true, size: 11, color: { argb: 'FF475569' } };
    ws.getCell('A3').alignment = { horizontal: 'center', vertical: 'middle' };

    ws.getRow(1).height = 24;
    ws.getRow(2).height = 24;
    ws.getRow(3).height = 20;

    // Metadata Juri & Peleton
    ws.getCell('A5').value = "NAMA JURI:";
    ws.getCell('A5').font = { bold: true, size: 10 };
    ws.mergeCells('B5:D5');
    ws.getCell('B5').value = ".......................................................";

    ws.getCell('F5').value = "NO. UNDI / TAMPIL:";
    ws.getCell('F5').font = { bold: true, size: 10 };
    ws.mergeCells('G5:H5');
    ws.getCell('G5').value = "[    ]";
    ws.getCell('G5').alignment = { horizontal: 'center' };

    ws.getCell('J5').value = "NAMA SEKOLAH:";
    ws.getCell('J5').font = { bold: true, size: 10 };
    ws.mergeCells('K5:L5');
    ws.getCell('K5').value = ".......................................................";

    ws.getRow(5).height = 22;

    // Header Tabel Penilaian
    const headerRow = ws.getRow(7);
    headerRow.height = 28;

    ws.getCell('A7').value = "NO";
    ws.getCell('B7').value = "MATERI GERAKAN LOMBA";
    ws.mergeCells('C7:I7');
    ws.getCell('C7').value = "PREDIKAT & PILIHAN NILAI (K - C - B - BS)";
    ws.getCell('J7').value = "NILAI JURI";
    ws.getCell('K7').value = "NILAI MAX";
    ws.getCell('L7').value = "KATEGORI BOBOT";

    ['A7', 'B7', 'C7', 'J7', 'K7', 'L7'].forEach(cellKey => {
      const c = ws.getCell(cellKey);
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
      c.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
      c.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Sub-header Predikat K, C, B, BS di Row 8
    const subHeader = ws.getRow(8);
    subHeader.height = 20;

    ws.getCell('A8').value = "";
    ws.getCell('B8').value = "";
    ws.mergeCells('C8:D8');
    ws.getCell('C8').value = "K (Kurang)";
    ws.mergeCells('E8:F8');
    ws.getCell('E8').value = "C (Cukup)";
    ws.mergeCells('G8:H8');
    ws.getCell('G8').value = "B (Baik)";
    ws.getCell('I8').value = "BS";
    ws.getCell('J8').value = "(Diisi Juri)";
    ws.getCell('K8').value = "";
    ws.getCell('L8').value = "";

    // Fill warna subheader predikat
    ws.getCell('C8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDE68A' } };
    ws.getCell('E8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBFDBFE' } };
    ws.getCell('G8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFA7F3D0' } };
    ws.getCell('I8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDD6FE' } };
    ['C8', 'E8', 'G8', 'I8'].forEach(ck => {
      ws.getCell(ck).font = { bold: true, size: 9 };
      ws.getCell(ck).alignment = { horizontal: 'center', vertical: 'middle' };
    });

    ws.getCell('J8').font = { italic: true, size: 9, color: { argb: 'FF64748B' } };
    ws.getCell('J8').alignment = { horizontal: 'center', vertical: 'middle' };
  }

  // Populate data sheet
  function populateSheet(ws, materials, title, jenjangText, specLabel) {
    setupSheetHeader(ws, title, jenjangText, specLabel, materials.length);

    let currentRow = 9;

    // SECTION 1: MATERI PASUKAN
    materials.forEach((materi, idx) => {
      const templateKey = getScaleTemplateForMaterial(materi);
      const template = RUBRIC_SCALE_TEMPLATES[templateKey] || RUBRIC_SCALE_TEMPLATES.DITEMPAT;

      const r = ws.getRow(currentRow);
      r.height = 20;

      r.getCell(1).value = idx + 1;
      r.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

      r.getCell(2).value = materi;
      r.getCell(2).alignment = { vertical: 'middle' };

      // 7 Nilai Opsi (Col C s.d. I)
      template.forEach((opt, oIdx) => {
        const c = r.getCell(3 + oIdx);
        c.value = opt.val;
        c.alignment = { horizontal: 'center', vertical: 'middle' };
        c.font = { name: 'Arial', size: 9, color: { argb: 'FF334155' } };
      });

      // Default Col J (Nilai Juri): default ke Baik pertama (Col G)
      r.getCell(10).value = template[4]?.val || template[Math.floor(template.length / 2)].val;
      r.getCell(10).font = { bold: true, size: 10, color: { argb: 'FF1D4ED8' } };
      r.getCell(10).alignment = { horizontal: 'center', vertical: 'middle' };
      r.getCell(10).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } };

      // Nilai Max (Col K)
      const maxVal = Math.max(...template.map(t => t.val));
      r.getCell(11).value = maxVal;
      r.getCell(11).alignment = { horizontal: 'center', vertical: 'middle' };
      r.getCell(11).font = { bold: true, size: 9, color: { argb: 'FF64748B' } };

      // Kategori (Col L)
      r.getCell(12).value = templateKey.replace('_', ' ');
      r.getCell(12).alignment = { vertical: 'middle' };
      r.getCell(12).font = { size: 8, color: { argb: 'FF64748B' } };

      for (let c = 1; c <= 12; c++) {
        r.getCell(c).border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        };
      }

      currentRow++;
    });

    const pasukanEndRow = currentRow - 1;

    // SUBTOTAL PASUKAN
    const subtotalPasukanRow = ws.getRow(currentRow);
    subtotalPasukanRow.height = 24;
    ws.mergeCells(`A${currentRow}:I${currentRow}`);
    ws.getCell(`A${currentRow}`).value = "SUBTOTAL NILAI MATERI PASUKAN (A - D)";
    ws.getCell(`A${currentRow}`).font = { bold: true, size: 10, color: { argb: 'FF1E293B' } };
    ws.getCell(`A${currentRow}`).alignment = { horizontal: 'right', vertical: 'middle' };

    subtotalPasukanRow.getCell(10).value = { formula: `SUM(J9:J${pasukanEndRow})` };
    subtotalPasukanRow.getCell(10).font = { bold: true, size: 11, color: { argb: 'FF1D4ED8' } };
    subtotalPasukanRow.getCell(10).alignment = { horizontal: 'center', vertical: 'middle' };
    subtotalPasukanRow.getCell(10).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDBEAFE' } };

    subtotalPasukanRow.getCell(11).value = { formula: `SUM(K9:K${pasukanEndRow})` };
    subtotalPasukanRow.getCell(11).font = { bold: true, size: 10, color: { argb: 'FF475569' } };
    subtotalPasukanRow.getCell(11).alignment = { horizontal: 'center', vertical: 'middle' };

    currentRow += 2;

    // SECTION 2: KOMANDAN PASUKAN (DANTON)
    const dantonHeaderRow = ws.getRow(currentRow);
    dantonHeaderRow.height = 24;
    ws.mergeCells(`A${currentRow}:L${currentRow}`);
    ws.getCell(`A${currentRow}`).value = "E. PENILAIAN KOMANDAN PASUKAN (DANTON)";
    ws.getCell(`A${currentRow}`).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
    ws.getCell(`A${currentRow}`).alignment = { vertical: 'middle' };
    ws.getCell(`A${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF991B1B' } };

    currentRow++;
    const dantonStartRow = currentRow;

    DANTON_CRITERIA.forEach((crit, dIdx) => {
      const template = RUBRIC_SCALE_TEMPLATES[crit.template] || RUBRIC_SCALE_TEMPLATES.DANTON_UMUM;
      const r = ws.getRow(currentRow);
      r.height = 20;

      r.getCell(1).value = dIdx + 1;
      r.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

      r.getCell(2).value = crit.name;
      r.getCell(2).font = { bold: true, size: 9 };
      r.getCell(2).alignment = { vertical: 'middle' };

      template.forEach((opt, oIdx) => {
        const c = r.getCell(3 + oIdx);
        c.value = opt.val;
        c.alignment = { horizontal: 'center', vertical: 'middle' };
        c.font = { name: 'Arial', size: 9, color: { argb: 'FF334155' } };
      });

      // Default Col J (Nilai Juri Danton)
      r.getCell(10).value = crit.defaultScore;
      r.getCell(10).font = { bold: true, size: 10, color: { argb: 'FFB91C1C' } };
      r.getCell(10).alignment = { horizontal: 'center', vertical: 'middle' };
      r.getCell(10).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };

      const maxVal = Math.max(...template.map(t => t.val));
      r.getCell(11).value = maxVal;
      r.getCell(11).alignment = { horizontal: 'center', vertical: 'middle' };
      r.getCell(11).font = { bold: true, size: 9, color: { argb: 'FF64748B' } };

      r.getCell(12).value = crit.template === 'DANTON_IKIT' ? 'Vokal & Irama (Bobot Tinggi)' : 'Standar Danton';
      r.getCell(12).font = { size: 8, color: { argb: 'FF64748B' } };
      r.getCell(12).alignment = { vertical: 'middle' };

      for (let c = 1; c <= 12; c++) {
        r.getCell(c).border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        };
      }

      currentRow++;
    });

    const dantonEndRow = currentRow - 1;

    // SUBTOTAL DANTON
    const subtotalDantonRow = ws.getRow(currentRow);
    subtotalDantonRow.height = 24;
    ws.mergeCells(`A${currentRow}:I${currentRow}`);
    ws.getCell(`A${currentRow}`).value = "SUBTOTAL NILAI KOMANDAN PASUKAN (E)";
    ws.getCell(`A${currentRow}`).font = { bold: true, size: 10, color: { argb: 'FF1E293B' } };
    ws.getCell(`A${currentRow}`).alignment = { horizontal: 'right', vertical: 'middle' };

    subtotalDantonRow.getCell(10).value = { formula: `SUM(J${dantonStartRow}:J${dantonEndRow})` };
    subtotalDantonRow.getCell(10).font = { bold: true, size: 11, color: { argb: 'FFB91C1C' } };
    subtotalDantonRow.getCell(10).alignment = { horizontal: 'center', vertical: 'middle' };
    subtotalDantonRow.getCell(10).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFECACA' } };

    subtotalDantonRow.getCell(11).value = { formula: `SUM(K${dantonStartRow}:K${dantonEndRow})` };
    subtotalDantonRow.getCell(11).font = { bold: true, size: 10, color: { argb: 'FF475569' } };
    subtotalDantonRow.getCell(11).alignment = { horizontal: 'center', vertical: 'middle' };

    currentRow += 2;

    // GRAND TOTAL
    const grandTotalRow = ws.getRow(currentRow);
    grandTotalRow.height = 28;
    ws.mergeCells(`A${currentRow}:I${currentRow}`);
    ws.getCell(`A${currentRow}`).value = "TOTAL NILAI AKUMULASI (PASUKAN + DANTON)";
    ws.getCell(`A${currentRow}`).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
    ws.getCell(`A${currentRow}`).alignment = { horizontal: 'right', vertical: 'middle' };
    ws.getCell(`A${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF047857' } };

    grandTotalRow.getCell(10).value = { formula: `J${pasukanEndRow + 1}+J${dantonEndRow + 1}` };
    grandTotalRow.getCell(10).font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
    grandTotalRow.getCell(10).alignment = { horizontal: 'center', vertical: 'middle' };
    grandTotalRow.getCell(10).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF059669' } };

    grandTotalRow.getCell(11).value = { formula: `K${pasukanEndRow + 1}+K${dantonEndRow + 1}` };
    grandTotalRow.getCell(11).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
    grandTotalRow.getCell(11).alignment = { horizontal: 'center', vertical: 'middle' };
    grandTotalRow.getCell(11).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF047857' } };

    ws.getColumn(1).width = 6;
    ws.getColumn(2).width = 44;
    ws.getColumn(3).width = 5.5;
    ws.getColumn(4).width = 5.5;
    ws.getColumn(5).width = 5.5;
    ws.getColumn(6).width = 5.5;
    ws.getColumn(7).width = 5.5;
    ws.getColumn(8).width = 5.5;
    ws.getColumn(9).width = 5.5;
    ws.getColumn(10).width = 14;
    ws.getColumn(11).width = 12;
    ws.getColumn(12).width = 24;
  }

  // 1. Sheet SD
  const wsSD = wb.addWorksheet('Penilaian SD-MI');
  populateSheet(wsSD, MATERIALS.SD, "FORMULIR PENILAIAN TINGKAT SD / MI SEDERAJAT", "SD", "Arena 25m x 14m - Waktu 10 Menit");

  // 2. Sheet SMP
  const wsSMP = wb.addWorksheet('Penilaian SMP-MTs');
  populateSheet(wsSMP, MATERIALS.SMP, "FORMULIR PENILAIAN TINGKAT SMP / MTs SEDERAJAT", "SMP", "Arena 26m x 15m - Waktu 13 Menit");

  // 3. Sheet Rekapitulasi
  const wsRekap = wb.addWorksheet('Rekapitulasi Juara');
  wsRekap.views = [{ showGridLines: true }];

  wsRekap.mergeCells('A1:I1');
  wsRekap.getCell('A1').value = "REKAPITULASI HASIL PENILAIAN DEWAN JURI & KLASEMEN RESMI";
  wsRekap.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FF1E293B' } };
  wsRekap.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

  wsRekap.mergeCells('A2:I2');
  wsRekap.getCell('A2').value = `LBB MU'ALLIMIN 2027 • ${TIMELINE.COMPETITION_DATE} • ${VENUE.NAME}`;
  wsRekap.getCell('A2').font = { bold: true, size: 10, color: { argb: 'FF64748B' } };
  wsRekap.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };

  const rekapHeaders = ['PERINGKAT', 'NO. UNDI', 'NAMA SEKOLAH / PELETON', 'JENJANG', 'SKOR PASUKAN', 'SKOR DANTON', 'PENALTI (-)', 'SKOR AKHIR', 'STATUS JUARA'];
  const rH = wsRekap.getRow(4);
  rH.height = 26;
  rekapHeaders.forEach((h, idx) => {
    const c = rH.getCell(idx + 1);
    c.value = h;
    c.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 9 };
    c.alignment = { horizontal: 'center', vertical: 'middle' };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
  });

  for (let i = 1; i <= 10; i++) {
    const r = wsRekap.getRow(4 + i);
    r.height = 20;
    r.getCell(1).value = i;
    r.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    r.getCell(2).value = String(i).padStart(2, '0');
    r.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
    r.getCell(3).value = `Contoh Peleton Sekolah ${i}`;
    r.getCell(3).alignment = { vertical: 'middle' };
    r.getCell(4).value = i % 2 === 0 ? 'SD' : 'SMP';
    r.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
    r.getCell(5).value = 350 + i * 5;
    r.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };
    r.getCell(6).value = 80 + i;
    r.getCell(6).alignment = { horizontal: 'center', vertical: 'middle' };
    r.getCell(7).value = 0;
    r.getCell(7).alignment = { horizontal: 'center', vertical: 'middle' };
    r.getCell(8).value = { formula: `E${4 + i}+F${4 + i}-G${4 + i}` };
    r.getCell(8).font = { bold: true };
    r.getCell(8).alignment = { horizontal: 'center', vertical: 'middle' };
    r.getCell(9).value = i === 1 ? 'Juara 1 Umum' : (i === 2 ? 'Juara 2' : (i === 3 ? 'Juara 3' : '-'));
    r.getCell(9).alignment = { horizontal: 'center', vertical: 'middle' };

    for (let c = 1; c <= 9; c++) {
      r.getCell(c).border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
    }
  }

  wsRekap.getColumn(1).width = 12;
  wsRekap.getColumn(2).width = 12;
  wsRekap.getColumn(3).width = 34;
  wsRekap.getColumn(4).width = 12;
  wsRekap.getColumn(5).width = 16;
  wsRekap.getColumn(6).width = 16;
  wsRekap.getColumn(7).width = 14;
  wsRekap.getColumn(8).width = 16;
  wsRekap.getColumn(9).width = 18;

  const outputPath = 'd:/lbbmuallimin/FORMULIR_PENILAIAN_LBB_MUALLIMIN_2027.xlsx';
  await wb.xlsx.writeFile(outputPath);
  console.log(`[SUCCESS] Excel workbook successfully created at: ${outputPath}`);

  const publicPath = 'd:/lbbmuallimin/public/FORMULIR_PENILAIAN_LBB_MUALLIMIN_2027.xlsx';
  await wb.xlsx.writeFile(publicPath);
  console.log(`[SUCCESS] Copy also placed in public folder: ${publicPath}`);
}

generateEvaluationWorkbook().catch(err => {
  console.error('[ERROR] Failed to generate excel:', err);
  process.exit(1);
});
