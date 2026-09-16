/**
 * ============================================================================
 * GOOGLE APPS SCRIPT UNIVERSAL DATABASE & DRIVE STORAGE (Code.gs)
 * Lomba Baris-Berbaris (LBB) Mu'allimin 2026 / Sistem Aplikasi Universal
 * ============================================================================
 * 
 * FITUR TERLENGKAP:
 * 1. Self-Adaptive: Otomatis buat Tab (Sheet) baru jika belum ada.
 * 2. Auto-Add Columns: Otomatis tambah kolom baru di kanan jika data punya properti baru.
 * 3. OTOMATIS UPLOAD FOTO & DOKUMEN KE GOOGLE DRIVE:
 *    - Mendeteksi gambar/dokumen base64 (data:image/..., data:application/pdf,...).
 *    - Otomatis membuat folder di Google Drive (Folder: "LBB_Muallimin_Uploads").
 *    - Otomatis mengonversi base64 menjadi file nyata di Google Drive.
 *    - File diset publik ("Anyone with the link can view").
 *    - Kolom spreadsheet TIDAK AKAN JEBOL oleh karakter panjang base64, melainkan
 *      tersimpan sebagai URL Google Drive yang bisa langsung diklik & dilihat panitia!
 * 4. Upsert Cerdas: Otomatis perbarui baris jika ID ada, atau buat baris baru.
 * ============================================================================
 */

var CONFIG = {
  DEFAULT_SHEET: 'SystemInfo',
  HEADER_ROW: 1,
  ID_COLUMN_NAME: 'id',
  DRIVE_FOLDER_NAME: 'LBB_Muallimin_Uploads_2026'
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

    // Fitur Search (S) dari SCRUD: Filter data jika ada parameter query `q` atau filter kolom spesifik
    var searchQuery = (params.q || params.search || '').trim().toLowerCase();
    if (searchQuery) {
      records = records.filter(function(row) {
        var str = JSON.stringify(row).toLowerCase();
        return str.indexOf(searchQuery) > -1;
      });
    }

    // Filter per kolom spesifik (misal ?field=status&value=verified atau ?jenjang=SMP)
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

    // 1. Dapatkan folder Google Drive untuk foto & berkas
    var driveFolder = getOrCreateDriveFolder(CONFIG.DRIVE_FOLDER_NAME);

    // 2. OTOMATIS: Dapatkan sheet atau buat tab baru bila belum ada
    var sheet = getOrCreateSheet(ss, tableName);

    if (action === 'upsert') {
      var item = payload.data || payload.item || {};
      
      // OTOMATIS EKSTRAK FOTO & SIMPAN KE GOOGLE DRIVE
      item = processAndUploadFilesRecursively(item, driveFolder, item.id || item.regCode || tableName);

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
      if (!Array.isArray(items)) {
        items = [items];
      }
      var count = 0;
      items.forEach(function(item) {
        item = processAndUploadFilesRecursively(item, driveFolder, item.id || item.regCode || tableName);
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
 * SISTEM PENYIMPANAN FOTO & DOKUMEN KE GOOGLE DRIVE
 * ============================================================================
 */

/**
 * Dapatkan atau buat folder di Google Drive
 */
function getOrCreateDriveFolder(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  var folder = DriveApp.createFolder(folderName);
  // Set izin folder agar file di dalamnya bisa dibuka/dilihat publik
  try {
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (e) {
    // Abaikan jika akun workspace memiliki kebijakan khusus
  }
  return folder;
}

/**
 * Rekursif memindai objek: jika ada URL base64 gambar/dokumen,
 * upload ke Google Drive lalu ganti URL-nya menjadi Link Google Drive
 */
function processAndUploadFilesRecursively(data, folder, prefix) {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(function(val) {
      return processAndUploadFilesRecursively(val, folder, prefix);
    });
  }

  var processed = {};
  var keys = Object.keys(data);

  keys.forEach(function(key) {
    var val = data[key];

    // Cek jika nilainya adalah objek berkas (seperti { name, url: "data:image/..." })
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
    // Cek jika nilainya langsung string base64
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

/**
 * Cek apakah string merupakan Data URL Base64
 */
function isDataUrl(str) {
  return typeof str === 'string' && str.indexOf('data:') === 0 && str.indexOf(';base64,') > -1;
}

/**
 * Upload Base64 Data URL ke Google Drive dan kembalikan URL Google Drive Publik
 */
function uploadBase64ToDrive(dataUrl, fileName, folder) {
  try {
    var parts = dataUrl.split(';base64,');
    var contentType = parts[0].replace('data:', '');
    var base64Data = parts[1];
    var decoded = Utilities.base64Decode(base64Data);

    // Tentukan ekstensi file
    var extension = '.jpg';
    if (contentType.indexOf('png') > -1) extension = '.png';
    else if (contentType.indexOf('pdf') > -1) extension = '.pdf';
    else if (contentType.indexOf('svg') > -1) extension = '.svg';

    var finalFileName = fileName;
    if (!finalFileName.toLowerCase().endsWith(extension)) {
      finalFileName += extension;
    }

    // Bersihkan karakter aneh pada nama file
    finalFileName = finalFileName.replace(/[^a-zA-Z0-9_.-]/g, '_');

    var blob = Utilities.newBlob(decoded, contentType, finalFileName);
    var file = folder.createFile(blob);

    // Set file agar bisa dilihat siapa saja yang punya tautan
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) {
      // safe ignore
    }

    // Kembalikan URL Google Drive (bisa dibuka langsung di browser)
    return file.getUrl();
  } catch (err) {
    console.error('Gagal upload file ke Drive:', err);
    return dataUrl; // Fallback jika gagal
  }
}

/**
 * ============================================================================
 * SISTEM DATABASE SPREADSHEET (TAB & KOLOM DINAMIS)
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
  headerRange.setFontColor('#ffffff'); // Teks Putih
  headerRange.setFontWeight('bold');
  headerRange.setFontFamily('Arial');
  headerRange.setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
}

function getRandomTabColor(name) {
  var n = name.toLowerCase();
  if (n.includes('team')) return '#dc2626'; // Merah
  if (n.includes('score')) return '#7c3aed'; // Ungu
  if (n.includes('staging')) return '#2563eb'; // Biru
  if (n.includes('vote')) return '#ea580c'; // Oranye
  if (n.includes('user')) return '#059669'; // Hijau
  if (n.includes('setting')) return '#475569'; // Slate
  return '#3b82f6';
}

function upsertRecord(sheet, record) {
  if (!record || typeof record !== 'object') {
    return { id: null, isNew: false };
  }

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

    if (val === undefined || val === null) {
      rowValues.push('');
    } else if (typeof val === 'object') {
      rowValues.push(JSON.stringify(val));
    } else {
      rowValues.push(val);
    }
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
  if (!recordId) return false;
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow <= 1) return false;

  var headers = sheet.getRange(CONFIG.HEADER_ROW, 1, 1, lastCol).getValues()[0];
  var idColIndex = headers.indexOf(CONFIG.ID_COLUMN_NAME) + 1;
  if (idColIndex <= 0) return false;

  var idValues = sheet.getRange(2, idColIndex, lastRow - 1, 1).getValues();
  for (var r = 0; r < idValues.length; r++) {
    if (String(idValues[r][0]) === String(recordId)) {
      sheet.deleteRow(r + 2);
      return true;
    }
  }
  return false;
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
