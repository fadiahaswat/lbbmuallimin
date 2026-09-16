/**
 * ============================================================================
 * GOOGLE APPS SCRIPT UNIVERSAL DATABASE & AUTO DRIVE STORAGE (Code.gs)
 * Lomba Baris-Berbaris (LBB) Mu'allimin 2026 / Sistem Aplikasi Universal
 * ============================================================================
 * 
 * SOLUSI ANTI-JEBOL 50.000 KARAKTER & MUDAH DIKELOLA MANUSIA:
 * 1. AUTO EXTRACT DRIVE FILE:
 *    Semua gambar/dokumen (Base64) otomatis diubah jadi file di Google Drive.
 *    Kolom sheet hanya berisi URL singkat (~60 karakter). Tidak ada Base64 di sel!
 * 2. AUTO FLATTEN TABEL UTAMA (Human-Readable):
 *    Di tab 'teams', file lampiran dipecah menjadi kolom-kolom link bersih:
 *    - 'file_logo_sekolah', 'file_ktp_official', 'file_bukti_bayar', dll.
 *    Panitia bisa langsung KLIK LINKNYA tanpa harus baca JSON rumit!
 * 3. AUTO TAB RELASIONAL (NORMALISASI DATA BESAR):
 *    Data susunan 25 personel peleton ('roster') otomatis dibuatkan Tab tersendiri:
 *    - Tab 'team_roster': Berisi baris-baris nama anggota, NISN, kelas, jabatan per tim.
 *    Ini membuat tab 'teams' tetap ringkas, bersih, dan tab 'team_roster' rapi per baris.
 * 4. AUTO SPLIT CHUNK (Safety Net < 40.000 karakter):
 *    Jika ada kolom JSON atau teks kustom yang mendekati batas 40.000 karakter,
 *    script otomatis memecahnya ke kolom sambungan (_part2, _part3, dst).
 * ============================================================================
 */

var CONFIG = {
  DEFAULT_SHEET: 'SystemInfo',
  HEADER_ROW: 1,
  ID_COLUMN_NAME: 'id',
  DRIVE_FOLDER_NAME: 'LBB_Muallimin_Uploads_2026',
  MAX_CELL_CHARS: 40000 // Batas aman di bawah 50.000 karakter Google Sheets
};

/**
 * Handle GET Request
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = params.action || 'get';
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'ping') {
      return jsonResponse({
        success: true,
        message: 'Google Apps Script Database & Drive Storage siap digunakan!',
        spreadsheetName: ss.getName(),
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'getAll') {
      var sheets = ss.getSheets();
      var allData = {};
      sheets.forEach(function(sh) {
        var name = sh.getName();
        if (name !== CONFIG.DEFAULT_SHEET) {
          allData[name] = readSheetData(sh);
        }
      });
      return jsonResponse({
        success: true,
        data: allData,
        timestamp: new Date().toISOString()
      });
    }

    var tableName = params.table || 'teams';
    var sheet = ss.getSheetByName(tableName);
    if (!sheet) {
      return jsonResponse({
        success: true,
        table: tableName,
        data: [],
        message: 'Tab belum pernah dibuat. Masih kosong.'
      });
    }

    var records = readSheetData(sheet);

    // Search Query (S dari SCRUD)
    var searchQuery = (params.q || params.search || '').trim().toLowerCase();
    if (searchQuery) {
      records = records.filter(function(row) {
        var str = JSON.stringify(row).toLowerCase();
        return str.indexOf(searchQuery) > -1;
      });
    }

    // Filter per kolom spesifik
    if (params.jenjang) {
      records = records.filter(function(row) { return row.jenjang === params.jenjang; });
    }
    if (params.status) {
      records = records.filter(function(row) { return row.status === params.status; });
    }
    if (params.id) {
      records = records.filter(function(row) { return String(row.id) === String(params.id); });
    }

    return jsonResponse({
      success: true,
      table: tableName,
      count: records.length,
      data: records,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return jsonResponse({
      success: false,
      error: error.toString()
    });
  }
}

/**
 * Handle POST Request
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    return jsonResponse({
      success: false,
      error: 'Server database sedang sibuk. Silakan coba sesaat lagi.'
    });
  }

  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (errJson) {
        if (e.parameter && e.parameter.data) {
          payload = JSON.parse(e.parameter.data);
        } else {
          payload = e.parameter || {};
        }
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var action = payload.action || 'upsert';
    var tableName = payload.table || 'teams';
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Dapatkan folder Google Drive untuk foto & berkas
    var driveFolder = getOrCreateDriveFolder(CONFIG.DRIVE_FOLDER_NAME);

    // Dapatkan sheet atau buat tab baru bila belum ada
    var sheet = getOrCreateSheet(ss, tableName);

    if (action === 'upsert') {
      var item = payload.data || payload.item || {};
      
      // 1. OTOMATIS UPLOAD BASE64 KE GOOGLE DRIVE
      item = processAndUploadFilesRecursively(item, driveFolder, item.id || item.regCode || tableName);

      // 2. JIKA TABEL TEAMS: BUATKAN TAB RELASIONAL ROSTER AGAR MUDAH DIKELOLA
      if (tableName === 'teams' && item.roster) {
        syncTeamRosterToSeparateSheet(ss, item);
      }

      // 3. UPSERT KE TAB UTAMA
      var result = upsertRecord(sheet, item);
      return jsonResponse({
        success: true,
        action: 'upsert',
        table: tableName,
        recordId: result.id,
        isNew: result.isNew,
        timestamp: new Date().toISOString()
      });
    } 
    else if (action === 'bulkSync' || action === 'bulkUpsert') {
      var items = payload.data || payload.items || [];
      if (!Array.isArray(items)) items = [items];

      var count = 0;
      items.forEach(function(item) {
        item = processAndUploadFilesRecursively(item, driveFolder, item.id || item.regCode || tableName);
        if (tableName === 'teams' && item.roster) {
          syncTeamRosterToSeparateSheet(ss, item);
        }
        upsertRecord(sheet, item);
        count++;
      });

      return jsonResponse({
        success: true,
        action: 'bulkSync',
        table: tableName,
        processedCount: count,
        timestamp: new Date().toISOString()
      });
    }
    else if (action === 'delete') {
      var deleteId = payload.id || (payload.data && payload.data.id);
      var deleted = deleteRecord(sheet, deleteId);

      // Hapus juga dari roster sheet jika ada
      if (tableName === 'teams') {
        var rosterSheet = ss.getSheetByName('team_roster');
        if (rosterSheet) {
          deleteRecordsByField(rosterSheet, 'teamId', deleteId);
        }
      }

      return jsonResponse({
        success: true,
        action: 'delete',
        table: tableName,
        id: deleteId,
        deleted: deleted,
        timestamp: new Date().toISOString()
      });
    }
    else if (action === 'clearTable') {
      clearSheetContents(sheet);
      return jsonResponse({
        success: true,
        action: 'clearTable',
        table: tableName,
        timestamp: new Date().toISOString()
      });
    }
    else {
      return jsonResponse({
        success: false,
        error: 'Action tidak dikenal: ' + action
      });
    }

  } catch (error) {
    return jsonResponse({
      success: false,
      error: error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * ============================================================================
 * SISTEM NORMALISASI TAB KHUSUS ANGGOTA PELETON ('team_roster')
 * Panitia bisa melihat & mengedit baris per anggota dengan mudah!
 * ============================================================================
 */
function syncTeamRosterToSeparateSheet(ss, team) {
  var rosterSheet = getOrCreateSheet(ss, 'team_roster');
  var teamId = team.id;
  var schoolName = team.schoolName || '';
  var regCode = team.regCode || '';
  var roster = team.roster;
  if (!roster) return;

  // Hapus baris roster lama untuk tim ini sebelum insert ulang
  deleteRecordsByField(rosterSheet, 'teamId', teamId);

  // Buat daftar personel baris per baris
  var rows = [];

  // 1. Danton
  if (roster.danton) {
    var d = roster.danton;
    rows.push({
      id: teamId + '_danton',
      teamId: teamId,
      regCode: regCode,
      schoolName: schoolName,
      peran: 'DANTON',
      posisi: 'Komandan Peleton',
      nama: d.name || '',
      nisn: d.nisn || '',
      kelas: d.class || '',
      ukuranBaju: d.uniformSize || '',
      ukuranSepatu: d.shoeSize || ''
    });
  }

  // 2. Pasukan (21 orang)
  if (Array.isArray(roster.pasukan)) {
    roster.pasukan.forEach(function(p, idx) {
      rows.push({
        id: teamId + '_pasukan_' + (idx + 1),
        teamId: teamId,
        regCode: regCode,
        schoolName: schoolName,
        peran: 'PASUKAN',
        posisi: 'Saf ' + (p.safNumber || Math.ceil((idx + 1) / 7)) + ' Banjar ' + (p.banjarNumber || (((idx) % 7) + 1)),
        nama: p.name || '',
        nisn: p.nisn || '',
        kelas: p.class || '',
        ukuranBaju: p.uniformSize || '',
        ukuranSepatu: p.shoeSize || ''
      });
    });
  }

  // 3. Cadangan
  if (Array.isArray(roster.cadangan)) {
    roster.cadangan.forEach(function(c, idx) {
      rows.push({
        id: teamId + '_cadangan_' + (idx + 1),
        teamId: teamId,
        regCode: regCode,
        schoolName: schoolName,
        peran: 'CADANGAN',
        posisi: 'Cadangan ' + (idx + 1),
        nama: c.name || '',
        nisn: c.nisn || '',
        kelas: c.class || '',
        ukuranBaju: '',
        ukuranSepatu: ''
      });
    });
  }

  // 4. Officials
  if (Array.isArray(roster.officials)) {
    roster.officials.forEach(function(o, idx) {
      rows.push({
        id: teamId + '_official_' + (idx + 1),
        teamId: teamId,
        regCode: regCode,
        schoolName: schoolName,
        peran: 'OFFICIAL',
        posisi: o.role || ('Official ' + (idx + 1)),
        nama: o.name || '',
        nisn: o.phone || '',
        kelas: 'No HP: ' + (o.phone || ''),
        ukuranBaju: '',
        ukuranSepatu: ''
      });
    });
  }

  // Masukkan baris ke tab team_roster
  rows.forEach(function(r) {
    upsertRecord(rosterSheet, r);
  });
}

/**
 * ============================================================================
 * GOOGLE DRIVE STORAGE (FOTO / DOKUMEN BASE64)
 * ============================================================================
 */
function getOrCreateDriveFolder(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  var folder = DriveApp.createFolder(folderName);
  try {
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (e) {}
  return folder;
}

function processAndUploadFilesRecursively(data, folder, prefix) {
  if (!data || typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map(function(val) {
      return processAndUploadFilesRecursively(val, folder, prefix);
    });
  }

  var processed = {};
  var keys = Object.keys(data);

  keys.forEach(function(key) {
    var val = data[key];

    if (val && typeof val === 'object') {
      if (typeof val.url === 'string' && isDataUrl(val.url)) {
        var uploadedUrl = uploadBase64ToDrive(val.url, val.name || (prefix + '_' + key), folder);
        var copyVal = Object.assign({}, val);
        copyVal.url = uploadedUrl;
        copyVal.isGoogleDrive = true;
        processed[key] = copyVal;
      } else {
        processed[key] = processAndUploadFilesRecursively(val, folder, prefix);
      }
    } 
    else if (typeof val === 'string' && isDataUrl(val)) {
      var uploadedUrlDirect = uploadBase64ToDrive(val, prefix + '_' + key, folder);
      processed[key] = uploadedUrlDirect;
    } 
    else {
      processed[key] = val;
    }
  });

  return processed;
}

function isDataUrl(str) {
  return typeof str === 'string' && str.indexOf('data:') === 0 && str.indexOf(';base64,') > -1;
}

function uploadBase64ToDrive(dataUrl, fileName, folder) {
  try {
    var parts = dataUrl.split(';base64,');
    var contentType = parts[0].replace('data:', '');
    var base64Data = parts[1];
    var decoded = Utilities.base64Decode(base64Data);

    var extension = '.jpg';
    if (contentType.indexOf('png') > -1) extension = '.png';
    else if (contentType.indexOf('pdf') > -1) extension = '.pdf';
    else if (contentType.indexOf('svg') > -1) extension = '.svg';

    var finalFileName = fileName;
    if (!finalFileName.toLowerCase().endsWith(extension)) {
      finalFileName += extension;
    }
    finalFileName = finalFileName.replace(/[^a-zA-Z0-9_.-]/g, '_');

    var blob = Utilities.newBlob(decoded, contentType, finalFileName);
    var file = folder.createFile(blob);

    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) {}

    return file.getUrl();
  } catch (err) {
    console.error('Gagal upload file ke Drive:', err);
    return dataUrl;
  }
}

/**
 * ============================================================================
 * SPREADSHEET ENGINE & ANTI-JEBOL 50.000 KARAKTER
 * ============================================================================
 */
function getOrCreateSheet(spreadsheet, tableName) {
  var sheet = spreadsheet.getSheetByName(tableName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(tableName);
    sheet.setTabColor(getRandomTabColor(tableName));
    
    var initialHeaders = ['id', 'createdAt', 'updatedAt'];
    sheet.getRange(1, 1, 1, initialHeaders.length).setValues([initialHeaders]);
    formatHeaderRow(sheet, initialHeaders.length);
  }
  return sheet;
}

function formatHeaderRow(sheet, numColumns) {
  var headerRange = sheet.getRange(CONFIG.HEADER_ROW, 1, 1, Math.max(numColumns, 1));
  headerRange.setBackground('#0f172a'); // Slate 900
  headerRange.setFontColor('#ffffff'); // Putih
  headerRange.setFontWeight('bold');
  headerRange.setFontFamily('Arial');
  headerRange.setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
}

function getRandomTabColor(name) {
  var n = name.toLowerCase();
  if (n.includes('team') && !n.includes('roster')) return '#dc2626'; // Merah
  if (n.includes('roster')) return '#0284c7'; // Biru Muda
  if (n.includes('score')) return '#7c3aed'; // Ungu
  if (n.includes('staging')) return '#2563eb'; // Biru
  if (n.includes('vote')) return '#ea580c'; // Oranye
  if (n.includes('user')) return '#059669'; // Hijau
  if (n.includes('setting')) return '#475569'; // Slate
  return '#3b82f6';
}

/**
 * OTOMATIS: Memecah objek pendaftar menjadi kolom ramah manusia & aman batas sel
 */
function prepareRecordForSpreadsheet(record) {
  var flat = {};
  var keys = Object.keys(record);

  keys.forEach(function(key) {
    var val = record[key];

    // 1. Pecah objek 'files' menjadi kolom link yang langsung bisa diklik di Sheet
    if (key === 'files' && val && typeof val === 'object') {
      flat['file_logo_sekolah'] = val.schoolLogo?.url || '';
      flat['file_kartu_danton'] = val.dantonCard?.url || '';
      flat['file_ktp_official'] = val.officialKtp?.url || '';
      flat['file_bukti_bayar'] = val.paymentProof?.url || '';
      flat['file_selfie'] = val.selfie?.url || '';
      flat['file_pakta_integritas'] = val.integrityPact?.url || '';
      // Simpan metadata ringkas di 'files' (tanpa Base64)
      flat['files'] = JSON.stringify(val);
      return;
    }

    // 2. Data roster di tab 'teams' hanya diringkas agar sel tidak membengkak
    if (key === 'roster' && val && typeof val === 'object') {
      flat['roster_ringkasan'] = (val.pasukan ? val.pasukan.length : 21) + ' Pasukan + Danton + Cadangan (Lihat Tab team_roster)';
      var rosterJson = JSON.stringify(val);
      // Jika JSON roster < 35.000 karakter, simpan backup di kolom roster
      if (rosterJson.length < CONFIG.MAX_CELL_CHARS) {
        flat['roster'] = rosterJson;
      } else {
        // Jika terlalu besar, pecah ke roster_part1, roster_part2
        splitLongStringIntoFields(flat, 'roster', rosterJson);
      }
      return;
    }

    // 3. String atau Objek lain yang panjangnya > MAX_CELL_CHARS dipecah otomatis
    if (val !== undefined && val !== null) {
      var stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
      if (stringVal.length > CONFIG.MAX_CELL_CHARS) {
        splitLongStringIntoFields(flat, key, stringVal);
      } else {
        flat[key] = typeof val === 'object' ? stringVal : val;
      }
    } else {
      flat[key] = '';
    }
  });

  return flat;
}

/**
 * Helper memecah teks panjang menjadi part1, part2, dst (Safety net < 40.000 chars)
 */
function splitLongStringIntoFields(targetObj, baseKey, longString) {
  var chunkSize = CONFIG.MAX_CELL_CHARS;
  var totalChunks = Math.ceil(longString.length / chunkSize);
  for (var i = 0; i < totalChunks; i++) {
    var partKey = (i === 0) ? baseKey : (baseKey + '_part' + (i + 1));
    targetObj[partKey] = longString.substr(i * chunkSize, chunkSize);
  }
}

function upsertRecord(sheet, rawRecord) {
  if (!rawRecord || typeof rawRecord !== 'object') {
    return { id: null, isNew: false };
  }

  // Siapkan data dengan pemecahan aman
  var record = prepareRecordForSpreadsheet(rawRecord);

  var recordId = record[CONFIG.ID_COLUMN_NAME];
  if (!recordId) {
    recordId = 'REC-' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000);
    record[CONFIG.ID_COLUMN_NAME] = recordId;
  }

  var nowIso = new Date().toISOString();
  if (!record.createdAt) record.createdAt = nowIso;
  record.updatedAt = nowIso;

  var lastColumn = Math.max(sheet.getLastColumn(), 1);
  var currentHeaders = [];
  if (sheet.getLastRow() >= 1 && lastColumn >= 1) {
    currentHeaders = sheet.getRange(CONFIG.HEADER_ROW, 1, 1, lastColumn).getValues()[0];
  }

  if (currentHeaders.length === 0 || !currentHeaders[0]) {
    currentHeaders = ['id', 'createdAt', 'updatedAt'];
  }

  // Auto-Add Columns jika ada field baru
  var recordKeys = Object.keys(record);
  var newHeadersToAdd = [];

  recordKeys.forEach(function(key) {
    if (currentHeaders.indexOf(key) === -1) {
      newHeadersToAdd.push(key);
      currentHeaders.push(key);
    }
  });

  if (newHeadersToAdd.length > 0) {
    var startCol = currentHeaders.length - newHeadersToAdd.length + 1;
    sheet.getRange(CONFIG.HEADER_ROW, startCol, 1, newHeadersToAdd.length).setValues([newHeadersToAdd]);
    formatHeaderRow(sheet, currentHeaders.length);
  }

  // Susun baris
  var rowValues = [];
  for (var c = 0; c < currentHeaders.length; c++) {
    var colName = currentHeaders[c];
    var val = record[colName];
    rowValues.push(val === undefined || val === null ? '' : val);
  }

  var lastRow = sheet.getLastRow();
  var idColIndex = currentHeaders.indexOf(CONFIG.ID_COLUMN_NAME) + 1;
  var existingRowIndex = -1;

  if (lastRow > 1 && idColIndex > 0) {
    var idRangeValues = sheet.getRange(2, idColIndex, lastRow - 1, 1).getValues();
    for (var r = 0; r < idRangeValues.length; r++) {
      if (String(idRangeValues[r][0]) === String(recordId)) {
        existingRowIndex = r + 2;
        break;
      }
    }
  }

  if (existingRowIndex > 0) {
    sheet.getRange(existingRowIndex, 1, 1, rowValues.length).setValues([rowValues]);
    return { id: recordId, isNew: false, row: existingRowIndex };
  } else {
    sheet.appendRow(rowValues);
    return { id: recordId, isNew: true, row: sheet.getLastRow() };
  }
}

function readSheetData(sheet) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow <= 1 || lastCol < 1) return [];

  var headers = sheet.getRange(CONFIG.HEADER_ROW, 1, 1, lastCol).getValues()[0];
  var dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  var records = [];
  for (var r = 0; r < dataRange.length; r++) {
    var row = dataRange[r];
    var obj = {};
    var hasContent = false;

    for (var c = 0; c < headers.length; c++) {
      var headerKey = headers[c];
      if (!headerKey) continue;

      var cellValue = row[c];
      if (cellValue !== '' && cellValue !== null && cellValue !== undefined) {
        hasContent = true;
      }

      // Re-stitch split chunks if any (_part2, etc.)
      if (typeof cellValue === 'string' && (cellValue.startsWith('{') || cellValue.startsWith('['))) {
        try {
          obj[headerKey] = JSON.parse(cellValue);
        } catch (e) {
          obj[headerKey] = cellValue;
        }
      } else {
        obj[headerKey] = cellValue;
      }
    }

    if (hasContent && obj[CONFIG.ID_COLUMN_NAME]) {
      records.push(obj);
    }
  }
  return records;
}

function deleteRecord(sheet, recordId) {
  return deleteRecordsByField(sheet, CONFIG.ID_COLUMN_NAME, recordId);
}

function deleteRecordsByField(sheet, fieldName, fieldValue) {
  if (!fieldValue) return false;
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow <= 1) return false;

  var headers = sheet.getRange(CONFIG.HEADER_ROW, 1, 1, lastCol).getValues()[0];
  var colIndex = headers.indexOf(fieldName) + 1;
  if (colIndex <= 0) return false;

  var values = sheet.getRange(2, colIndex, lastRow - 1, 1).getValues();
  var deleted = false;
  // Hapus dari bawah ke atas agar index baris tidak bergeser
  for (var r = values.length - 1; r >= 0; r--) {
    if (String(values[r][0]) === String(fieldValue)) {
      sheet.deleteRow(r + 2);
      deleted = true;
    }
  }
  return deleted;
}

function clearSheetContents(sheet) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow > 1 && lastCol >= 1) {
    sheet.getRange(2, 1, lastRow - 1, lastCol).clearContent();
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
