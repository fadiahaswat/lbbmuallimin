/**
 * ============================================================================
 * GOOGLE APPS SCRIPT WEBHOOK: EDIT SPREADSHEET RAB / ANGGARAN LBB MU'ALLIMIN 2027
 * ============================================================================
 * Pasang script ini di Google Spreadsheet RAB Anda:
 * File: https://docs.google.com/spreadsheets/d/1OFhZ6PU8A48VnIsYEeMhlieehk1NYyolLV-P86IbxWY/edit
 * Menu: Extensions (Ekstensi) -> Apps Script
 *
 * FITUR LENGKAP:
 * 1. Ping / Test Koneksi
 * 2. Baca Seluruh Data Sheet (read)
 * 3. Update Sel Spesifik (updateCell) - misal perbarui nominal/kuota/volume
 * 4. Tambah Baris Baru (appendRow)
 * 5. Update Baris Tertentu (updateRow)
 * 6. Replace Seluruh Isi Sheet (replaceAll)
 * 7. Batch Replace Teks / Angka (batchReplace)
 * ============================================================================
 */

var SECRET_TOKEN = "LBB_RAB_ADMIN_2027"; // Token pengaman untuk webhook RAB

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    var params = {};
    if (e && e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents);
      } catch (err) {
        params = e.parameter || {};
      }
    } else if (e && e.parameter) {
      params = e.parameter;
    }

    var action = params.action || 'ping';
    var token = params.token || '';

    // Cek Keamanan Token (Kecuali Ping)
    if (action !== 'ping' && token !== SECRET_TOKEN) {
      return responseJSON({
        success: false,
        error: "Unauthorized: Token rahasia salah atau tidak disertakan."
      });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = params.sheetName || ss.getSheets()[0].getName();
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      return responseJSON({
        success: false,
        error: "Sheet dengan nama '" + sheetName + "' tidak ditemukan."
      });
    }

    // 1. ACTION: PING
    if (action === 'ping') {
      return responseJSON({
        success: true,
        message: "Google Apps Script RAB Webhook Aktif & Siap Menerima Perintah!",
        spreadsheetTitle: ss.getName(),
        activeSheet: sheet.getName(),
        totalRows: sheet.getLastRow(),
        totalColumns: sheet.getLastColumn()
      });
    }

    // 2. ACTION: READ DATA
    if (action === 'read') {
      var lastRow = sheet.getLastRow();
      var lastCol = sheet.getLastColumn();
      if (lastRow === 0 || lastCol === 0) {
        return responseJSON({ success: true, data: [] });
      }
      var values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
      return responseJSON({
        success: true,
        sheetName: sheet.getName(),
        totalRows: lastRow,
        data: values
      });
    }

    // 3. ACTION: UPDATE CELL (Berdasarkan A1 notation, contoh: 'E6', 'F8')
    if (action === 'updateCell') {
      var cellRef = params.cell; // misal "E6"
      var cellValue = params.value;

      if (!cellRef) {
        throw new Error("Parameter 'cell' (misal: 'E6') wajib diisi.");
      }

      sheet.getRange(cellRef).setValue(cellValue);
      SpreadsheetApp.flush();

      return responseJSON({
        success: true,
        message: "Berhasil mengupdate sel " + cellRef,
        cell: cellRef,
        value: cellValue
      });
    }

    // 4. ACTION: APPEND ROW
    if (action === 'appendRow') {
      var rowData = params.row;
      if (!Array.isArray(rowData)) {
        throw new Error("Parameter 'row' harus berupa array data kolom.");
      }

      sheet.appendRow(rowData);
      SpreadsheetApp.flush();

      return responseJSON({
        success: true,
        message: "Berhasil menambahkan baris baru pada baris " + sheet.getLastRow(),
        newRowNumber: sheet.getLastRow()
      });
    }

    // 5. ACTION: UPDATE ROW
    if (action === 'updateRow') {
      var rowNumber = parseInt(params.rowNumber);
      var values = params.values;

      if (!rowNumber || !Array.isArray(values)) {
        throw new Error("Parameter 'rowNumber' (angka) dan 'values' (array) wajib diisi.");
      }

      var range = sheet.getRange(rowNumber, 1, 1, values.length);
      range.setValues([values]);
      SpreadsheetApp.flush();

      return responseJSON({
        success: true,
        message: "Berhasil memperbarui baris ke-" + rowNumber
      });
    }

    // 6. ACTION: REPLACE ALL
    if (action === 'replaceAll') {
      var allRows = params.allRows;
      if (!Array.isArray(allRows) || allRows.length === 0) {
        throw new Error("Parameter 'allRows' harus berupa array dari baris-baris data.");
      }

      sheet.clearContents();
      var numRows = allRows.length;
      var numCols = allRows[0].length;

      sheet.getRange(1, 1, numRows, numCols).setValues(allRows);
      SpreadsheetApp.flush();

      return responseJSON({
        success: true,
        message: "Berhasil mengganti seluruh isi sheet.",
        totalRowsWritten: numRows
      });
    }

    // 7. ACTION: BATCH REPLACE (Ganti teks atau angka yang cocok di seluruh sheet)
    if (action === 'batchReplace') {
      var replacements = params.replacements; // [{ find: "Rp325.000", replace: "Rp350.000" }]
      if (!Array.isArray(replacements)) {
        throw new Error("Parameter 'replacements' harus berupa array objek { find, replace }.");
      }

      for (var i = 0; i < replacements.length; i++) {
        var item = replacements[i];
        if (item.find !== undefined) {
          sheet.createTextFinder(String(item.find)).replaceAllWith(String(item.replace || ''));
        }
      }
      SpreadsheetApp.flush();

      return responseJSON({
        success: true,
        message: "Berhasil melakukan batch replace " + replacements.length + " item di sheet."
      });
    }

    // 8. ACTION: FORMAT PROFESSIONAL RAB (Tata Ulang Total Format, Border, Rumus, & Desain Monokrom Elegan)
    if (action === 'formatProfessionalRAB') {
      sheet.clear(); // Bersihkan seluruh isi dan format lama yang berantakan

      // Lebar kolom standar RAB profesional
      sheet.setColumnWidth(1, 60);  // No.
      sheet.setColumnWidth(2, 420); // Keterangan / Uraian Pos
      sheet.setColumnWidth(3, 110); // Volume
      sheet.setColumnWidth(4, 110); // Satuan
      sheet.setColumnWidth(5, 140); // Harga Satuan (Rp)
      sheet.setColumnWidth(6, 160); // Jumlah (Rp)

      var rows = [
        ["RENCANA ANGGARAN BIAYA (RAB)", "", "", "", "", ""],
        ["LOMBA BARIS BERBARIS (LBB) MU'ALLIMIN TAHUN 2027", "", "", "", "", ""],
        ["TEMA: \"JIWA KSATRIA, DERAP GEMILANG\"", "", "", "", "", ""],
        ["", "", "", "", "", ""],
        ["A. ESTIMASI PEMASUKAN", "", "", "", "", ""],
        ["No.", "Sumber Pemasukan", "Volume", "Satuan", "Harga Satuan (Rp)", "Jumlah (Rp)"],
        ["1", "Dana Subsidi Madrasah Mu'allimin Muhammadiyah Yogyakarta", 1, "Paket", 15000000, "=C7*E7"],
        ["2", "Target Sponsorship Kemitraan Eksternal", 1, "Paket", 25211450, "=C8*E8"],
        ["3", "Pendaftaran Peserta (36 Peleton: 18 SD/MI & 18 SMP/MTs)", "", "", "", ""],
        ["3.1", "  • Pendaftaran Gelombang 1 (50% Kuota = 18 Peleton)", 18, "Peleton", 350000, "=C10*E10"],
        ["3.2", "  • Pendaftaran Gelombang 2 (50% Kuota = 18 Peleton)", 18, "Peleton", 400000, "=C11*E11"],
        ["4", "Dana Usaha Panitia (Sewa Stand Bazar 20 Tenant UMKM)", 20, "Stand", 500000, "=C12*E12"],
        ["", "TOTAL ESTIMASI PEMASUKAN (A)", "", "", "", "=F7+F8+F10+F11+F12"],
        ["", "", "", "", "", ""],
        ["B. ESTIMASI PENGELUARAN", "", "", "", "", ""],
        ["No.", "Keterangan Kebutuhan Operasional Divisi", "Volume", "Satuan", "Harga Satuan (Rp)", "Jumlah (Rp)"],
        
        // 1. Kesekretariatan
        ["1", "Kesekretariatan (Sekretaris & Bendahara)", "", "", "", ""],
        ["1.1", "  • Cetak & Penggandaan Proposal Kegiatan Resmi", 15, "Bundel", 20000, "=C18*E18"],
        ["1.2", "  • Kertas HVS F4 & A4 (Administrasi & Penilaian)", 10, "Rim", 45000, "=C19*E19"],
        ["1.3", "  • Amplop Surat Resmi Berstempel", 5, "Pak", 37500, "=C20*E20"],
        ["1.4", "  • ATK Panitia (Pulpen, Map Folio, Stapler, Notes)", 1, "Paket", 250000, "=C21*E21"],
        ["1.5", "  • Biaya Cetak Laporan Pertanggungjawaban (LPJ Final Hardcover)", 5, "Bundel", 10000, "=C22*E22"],
        ["", "SUBTOTAL KESEKRETARIATAN", "", "", "", "=SUM(F18:F22)"],
        
        // 2. Acara
        ["2", "Divisi Acara", "", "", "", ""],
        ["2.1", "  • Fotokopi Rundown Acara (Hari-H, TM Juri, TM Peserta)", 2000, "Lembar", 300, "=C25*E25"],
        ["2.2", "  • Perlengkapan Administrasi Pendaftaran & Undian Lotting Peleton", 1, "Paket", 500000, "=C26*E26"],
        ["2.3", "  • Perlengkapan Tambahan Operasional Acara & Cue Card MC", 1, "Paket", 300000, "=C27*E27"],
        ["", "SUBTOTAL DIVISI ACARA", "", "", "", "=SUM(F25:F27)"],

        // 3. Juri (6 Dewan Juri: 3 SD + 3 SMP)
        ["3", "Divisi Juri & Penilaian (6 Dewan Juri: TNI, Polri, PPI)", "", "", "", ""],
        ["3.1", "  • Honorarium 6 Dewan Juri (3 SD & 3 SMP)", 6, "Orang", 350000, "=C30*E30"],
        ["3.2", "  • Uang Transportasi TM Juri (Sabtu, 7 November 2026)", 6, "Orang", 50000, "=C31*E31"],
        ["3.3", "  • Uang Transportasi Hari-H (Sabtu, 24 Januari 2027)", 6, "Orang", 50000, "=C32*E32"],
        ["3.4", "  • Cetak Formulir Rubrik Penilaian Resmi Juri (300 Lembar)", 300, "Lembar", 300, "=C33*E33"],
        ["3.5", "  • Cetak Piagam Penghargaan Dewan Juri", 6, "Lembar", 5000, "=C34*E34"],
        ["3.6", "  • Perlengkapan Juri (Papan Dada, Stopwatch, Peluit, ATK)", 1, "Paket", 200000, "=C35*E35"],
        ["", "SUBTOTAL DIVISI JURI & PENILAIAN", "", "", "", "=SUM(F30:F35)"],

        // 4. Teknis Lapangan
        ["4", "Divisi Teknis Lapangan (2 Arena Paralel: Basket & Embung)", "", "", "", ""],
        ["4.1", "  • Penyiapan Arena Lomba (Marking Cat Lapangan, Tali, Patok)", 1, "Paket", 1500000, "=C38*E38"],
        ["4.2", "  • Sewa / Pembuatan Meja Juri & Pos Perlombaan", 3, "Unit", 500000, "=C39*E39"],
        ["4.3", "  • Kebutuhan Teknis Pembersihan & Penataan Area Lapangan", 1, "Paket", 1000000, "=C40*E40"],
        ["", "SUBTOTAL DIVISI TEKNIS LAPANGAN", "", "", "", "=SUM(F38:F40)"],

        // 5. Penghargaan & Medis
        ["5", "Divisi Penghargaan & Medis", "", "", "", ""],
        ["5.1", "  • Piala Bergilir Juara Umum (SD/MI & SMP/MTs)", 2, "Buah", 500000, "=C43*E43"],
        ["5.2", "  • Piala Tetap Juara 1, 2, 3 Utama (SD & SMP)", 6, "Set", 280000, "=C44*E44"],
        ["5.3", "  • Piala Tetap Juara Harapan 1, 2, 3 (SD & SMP)", 6, "Set", 280000, "=C45*E45"],
        ["5.4", "  • Piala Danton Terbaik (SD & SMP)", 6, "Buah", 280000, "=C46*E46"],
        ["5.5", "  • Uang Pembinaan Pemenang Tunai (18 Juara SD & SMP)", 1, "Paket", 9600000, "=C47*E47"],
        ["5.6", "  • Cetak Papan Simbolis Juara (Ukuran 40 x 60 cm)", 18, "Lembar", 10000, "=C48*E48"],
        ["5.7", "  • Obat-obatan Lapangan & Perlengkapan P3K Lengkap", 1, "Paket", 50000, "=C49*E49"],
        ["5.8", "  • Honor / Transportasi Tim Medis Eksternal & Ambulans Siaga", 3, "Orang", 200000, "=C50*E50"],
        ["", "SUBTOTAL DIVISI PENGHARGAAN & MEDIS", "", "", "", "=SUM(F43:F50)"],

        // 6. Perlengkapan
        ["6", "Divisi Perlengkapan", "", "", "", ""],
        ["6.1", "  • Sewa Handy Talkie (HT) Frekuensi Jernih", 70, "Unit", 15000, "=C53*E53"],
        ["6.2", "  • Sewa Tenda Utama Dewan Juri (4m x 5m)", 3, "Unit", 750000, "=C54*E54"],
        ["6.3", "  • Sewa Tenda Lipat Stand Tenant UMKM (3m x 3m)", 16, "Unit", 100000, "=C55*E55"],
        ["6.4", "  • Sewa Paket Sound System (Arena 1, Arena 2, Upacara)", 1, "Paket", 1500000, "=C56*E56"],
        ["6.5", "  • Selotip Police Line Pembatas Jalur", 1, "Rol", 60000, "=C57*E57"],
        ["6.6", "  • Police Line Pembatas Steril", 3, "Rol", 100000, "=C58*E58"],
        ["6.7", "  • Tali Rafia Lapangan", 3, "Rol", 25000, "=C59*E59"],
        ["6.8", "  • Kantong Sampah Besar (Trash Bag Pemilahan Sampah)", 5, "Pak", 50000, "=C60*E60"],
        ["6.9", "  • Lakban, Tali Pengikat, Paku, & Logistik Pendukung", 1, "Paket", 150000, "=C61*E61"],
        ["6.10", " • Perlengkapan Konstruksi Backdrop & Panggung", 1, "Paket", 350000, "=C62*E62"],
        ["", "SUBTOTAL DIVISI PERLENGKAPAN", "", "", "", "=SUM(F53:F62)"],

        // 7. Keamanan
        ["7", "Divisi Keamanan & Perizinan", "", "", "", ""],
        ["7.1", "  • Perlengkapan Keamanan, Traffic Cone, & Rompi", 1, "Paket", 200000, "=C65*E65"],
        ["7.2", "  • Cetak Karcis Parkir Resmi & Tanda Masuk Bus Kontingen", 10, "Bendel", 25000, "=C66*E66"],
        ["7.3", "  • Staples Tembak, Lakban, dan Isi", 5, "Buah", 20000, "=C67*E67"],
        ["", "SUBTOTAL DIVISI KEAMANAN & PERIZINAN", "", "", "", "=SUM(F65:F67)"],

        // 8. Konsumsi
        ["8", "Divisi Konsumsi", "", "", "", ""],
        ["8.1", "  • Air Mineral Gelas Peserta (1 Dus per Peleton x 36)", 36, "Dus", 30000, "=C70*E70"],
        ["8.2", "  • Air Mineral Galon Isi Ulang Panitia & Transit", 10, "Galon", 10000, "=C71*E71"],
        ["8.3", "  • Snack Box Coffee Break TM Juri (6 Dewan Juri)", 6, "Box", 8000, "=C72*E72"],
        ["8.4", "  • Snack Box TM Peserta (36 Kontingen @ 2 Perwakilan)", 72, "Box", 8000, "=C73*E73"],
        ["8.5", "  • Sarapan Pagi Dewan Juri Hari-H (VIP)", 6, "Kotak", 30000, "=C74*E74"],
        ["8.6", "  • Makan Siang Dewan Juri Hari-H (VIP)", 6, "Kotak", 25000, "=C75*E75"],
        ["8.7", "  • Makan Siang 100 Panitia Pelaksana", 100, "Kotak", 25000, "=C76*E76"],
        ["8.8", "  • Makan Siang Tamu Undangan VIP", 15, "Kotak", 25000, "=C77*E77"],
        ["8.9", "  • Snack Sore Dewan Juri Hari-H (VIP)", 6, "Box", 8000, "=C78*E78"],
        ["8.10", " • Snack Sore 100 Panitia Pelaksana", 100, "Box", 8000, "=C79*E79"],
        ["8.11", " • Snack Sore Tamu Undangan VIP", 15, "Box", 8000, "=C80*E80"],
        ["8.12", " • Konsumsi Ekstra Petugas Lapangan (Keamanan, Medis, dll.)", 20, "Dus", 10000, "=C81*E81"],
        ["", "SUBTOTAL DIVISI KONSUMSI", "", "", "", "=SUM(F70:F81)"],

        // 9. DDD
        ["9", "Divisi Desain, Dekorasi, & Dokumentasi (DDD)", "", "", "", ""],
        ["9.1", "  • Cetak Banner Utama, Backdrop Panggung, Spanduk", 1, "Paket", 1500000, "=C84*E84"],
        ["9.2", "  • Bahan & Ornamen Dekorasi Venue Minisoccer & Arena", 1, "Paket", 300000, "=C85*E85"],
        ["9.3", "  • Produksi Kaos Panitia Resmi (100 Personil)", 100, "Pcs", 85000, "=C86*E86"],
        ["9.4", "  • ID Card Panitia Lengkap + Tali Lanyard", 100, "Pcs", 5000, "=C87*E87"],
        ["9.5", "  • ID Card Official Kontingen (36 Peleton @ 2 Official)", 72, "Pcs", 5000, "=C88*E88"],
        ["9.6", "  • Lanyard Cetak Resmi Panitia & Juri", 100, "Pcs", 15000, "=C89*E89"],
        ["9.7", "  • Topi Lapangan Panitia", 100, "Pcs", 35000, "=C90*E90"],
        ["", "SUBTOTAL DIVISI DDD", "", "", "", "=SUM(F84:F90)"],

        // 10. Dana & Kemitraan
        ["10", "Divisi Dana & Kemitraan (Operasional)", "", "", "", ""],
        ["10.1", " • Cetak & Jilid Proposal Sponsorship Resmi (20 Bundel)", 20, "Bundel", 20000, "=C93*E93"],
        ["10.2", " • Transportasi & Operasional Pencarian Sponsor/Tenant", 1, "Paket", 500000, "=C94*E94"],
        ["", "SUBTOTAL DIVISI DANA & KEMITRAAN", "", "", "", "=SUM(F93:F94)"],

        // 11. LO & Humas
        ["11", "Divisi LO & Humas (Operasional)", "", "", "", ""],
        ["11.1", " • Amplop Permohonan Trofi (Wali Kota & Gubernur)", 2, "Paket", 25000, "=C97*E97"],
        ["11.2", " • Amplop Undangan Sekolah Peserta", 1, "Box", 20000, "=C98*E98"],
        ["11.3", " • Map Folio (Merk Biola) Berkas Peserta", 2, "Pack", 35000, "=C99*E99"],
        ["11.4", " • Cetak & Distribusi Surat Undangan Peserta Resmi", 50, "Paket", 5000, "=C100*E100"],
        ["11.5", " • Fotokopi Denah Basecamp & Materi untuk 36 LO", 100, "Lembar", 300, "=C101*E101"],
        ["", "SUBTOTAL DIVISI LO & HUMAS", "", "", "", "=SUM(F97:F101)"],

        // 12. Biaya Tak Terduga
        ["12", "Biaya Tak Terduga (10% dari Total Pengeluaran Divisi 1–11)", 1, "Paket", 5791950, "=0.1*(F23+F28+F36+F41+F51+F63+F68+F82+F91+F95+F102)"],
        ["", "SUBTOTAL BIAYA TAK TERDUGA", "", "", "", "=F103"],
        ["", "TOTAL ESTIMASI PENGELUARAN (B)", "", "", "", "=F23+F28+F36+F41+F51+F63+F68+F82+F91+F95+F102+F104"],
        ["", "", "", "", "", ""],

        // C. Rekapitulasi
        ["C. REKAPITULASI AKHIR ANGGARAN", "", "", "", "", ""],
        ["No.", "Uraian Anggaran", "", "", "", "Jumlah (Rp)"],
        ["1", "Total Estimasi Pemasukan (A)", "", "", "", "=F13"],
        ["2", "Total Estimasi Pengeluaran (B)", "", "", "", "=F105"],
        ["", "SALDO AKHIR DANA (PEMASUKAN - PENGELUARAN)", "", "", "", "=F109-F110"]
      ];

      var totalRows = rows.length;
      var totalCols = 6;
      var range = sheet.getRange(1, 1, totalRows, totalCols);
      range.setValues(rows);

      // --- FORMATTING & STYLING MONOKROM PROFESIONAL ---
      var fullSheet = sheet.getRange(1, 1, totalRows, totalCols);
      fullSheet.setFontFamily("Segoe UI");
      fullSheet.setFontSize(10);
      fullSheet.setVerticalAlignment("middle");

      // Format Angka Rupiah untuk Kolom E & F
      sheet.getRange(7, 5, totalRows - 6, 2).setNumberFormat("\"Rp\"#,##0");

      // Judul Utama Dokumen
      sheet.getRange("A1:F3").setFontWeight("bold");
      sheet.getRange("A1:F1").setFontSize(14).setHorizontalAlignment("center");
      sheet.getRange("A2:F2").setFontSize(11).setHorizontalAlignment("center");
      sheet.getRange("A3:F3").setFontSize(10).setFontColor("#555555").setHorizontalAlignment("center");
      sheet.getRange("A1:F1").merge();
      sheet.getRange("A2:F2").merge();
      sheet.getRange("A3:F3").merge();

      // Heading Section A, B, C (Hitam Pekat `#212121`, Teks Putih)
      var headings = ["A5:F5", "A15:F15", "A107:F107"];
      headings.forEach(function(h) {
        var r = sheet.getRange(h);
        r.merge().setBackground("#212121").setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(11);
      });

      // Header Kolom Tabel (Abu-abu Gelap `#374151`, Teks Putih)
      var headers = ["A6:F6", "A16:F16", "A108:F108"];
      headers.forEach(function(h) {
        var r = sheet.getRange(h);
        r.setBackground("#374151").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
      });

      // Sub-heading Divisi (Abu-abu Lembut `#F3F4F6`, Teks Hitam Tebal)
      var divRows = [9, 17, 24, 29, 37, 42, 52, 64, 69, 83, 92, 96, 104];
      divRows.forEach(function(rowNum) {
        var r = sheet.getRange(rowNum, 1, 1, 6);
        r.setBackground("#F3F4F6").setFontWeight("bold").setFontColor("#111827");
      });

      // Baris Data Rekapitulasi (Putih Bersih, Teks Hitam)
      sheet.getRange("A109:F110").setBackground("#FFFFFF").setFontColor("#000000").setFontWeight("normal");

      // Subtotal Baris (Garis atas-bawah, Semi Bold, Abu Muda `#F9FAFB`)
      var subtotalRows = [13, 23, 28, 36, 41, 51, 63, 68, 82, 91, 95, 102, 105, 111];
      subtotalRows.forEach(function(rowNum) {
        var r = sheet.getRange(rowNum, 1, 1, 6);
        r.setFontWeight("bold");
        if (rowNum === 13 || rowNum === 105) {
          r.setBackground("#E5E7EB").setFontSize(10.5); // Total A & Total B
        } else if (rowNum === 111) {
          r.setBackground("#D1D5DB").setFontSize(11);   // Saldo Akhir (Highlight Abu-abu)
        }
      });

      // Center alignment untuk kolom No, Vol, Satuan
      sheet.getRange(7, 1, totalRows - 6, 1).setHorizontalAlignment("center");
      sheet.getRange(7, 3, totalRows - 6, 2).setHorizontalAlignment("center");

      // Berikan Border Halus Abu-abu
      sheet.getRange("A6:F13").setBorder(true, true, true, true, true, true, "#D1D5DB", SpreadsheetApp.BorderStyle.SOLID);
      sheet.getRange("A16:F105").setBorder(true, true, true, true, true, true, "#D1D5DB", SpreadsheetApp.BorderStyle.SOLID);
      sheet.getRange("A108:F111").setBorder(true, true, true, true, true, true, "#D1D5DB", SpreadsheetApp.BorderStyle.SOLID);

      SpreadsheetApp.flush();

      return responseJSON({
        success: true,
        message: "Sukses merombak total format RAB menjadi format standar akuntansi monokrom dengan formula otomatis!"
      });
    }

    return responseJSON({
      success: false,
      error: "Action '" + action + "' tidak dikenali."
    });

  } catch (error) {
    return responseJSON({
      success: false,
      error: error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
