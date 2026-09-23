/**
 * ============================================================================
 * GOOGLE APPS SCRIPT WEBHOOK: EDIT SPREADSHEET TIMELINE LBB MU'ALLIMIN 2027
 * ============================================================================
 * Pasang script ini di Google Spreadsheet Anda:
 * Menu: Extensions (Ekstensi) -> Apps Script
 *
 * FITUR:
 * 1. Ping / Test Koneksi
 * 2. Baca Data Sheet (read)
 * 3. Tulis / Update Sel (updateCell)
 * 4. Tambah Baris Baru (appendRow)
 * 5. Update Rentang Baris (updateRow)
 * 6. Replace Seluruh Isi Sheet (replaceAllRows)
 * ============================================================================
 */

var SECRET_TOKEN = "LBB_TIMELINE_ADMIN_2027"; // Token pengaman

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
        message: "Google Apps Script Timeline Webhook Aktif & Siap Menerima Perintah!",
        spreadsheetTitle: ss.getName(),
        activeSheet: sheet.getName(),
        totalRows: sheet.getLastRow(),
        totalCols: sheet.getLastColumn()
      });
    }

    // 2. ACTION: READ DATA
    if (action === 'read') {
      var data = sheet.getDataRange().getValues();
      return responseJSON({
        success: true,
        sheetName: sheetName,
        rowCount: data.length,
        data: data
      });
    }

    // 3. ACTION: UPDATE SINGLE CELL
    if (action === 'updateCell') {
      var row = parseInt(params.row, 10);
      var col = parseInt(params.col, 10);
      var value = params.value;

      if (!row || !col) {
        throw new Error("Parameter 'row' dan 'col' (1-indexed) wajib diisi.");
      }

      sheet.getRange(row, col).setValue(value);
      return responseJSON({
        success: true,
        message: "Berhasil mengupdate sel (" + row + ", " + col + ")",
        newValue: value
      });
    }

    // 4. ACTION: APPEND ROW
    if (action === 'appendRow') {
      var rowData = params.rowData; // Array of values: ["1.", "Waktu", "Kegiatan", "PIC"]
      if (!Array.isArray(rowData)) {
        throw new Error("Parameter 'rowData' harus berupa array data baris.");
      }

      sheet.appendRow(rowData);
      var newRowNum = sheet.getLastRow();
      return responseJSON({
        success: true,
        message: "Berhasil menambahkan baris baru pada baris ke-" + newRowNum,
        rowNumber: newRowNum,
        rowData: rowData
      });
    }

    // 5. ACTION: UPDATE SPECIFIC ROW
    if (action === 'updateRow') {
      var targetRow = parseInt(params.row, 10);
      var rowData = params.rowData;
      if (!targetRow || !Array.isArray(rowData)) {
        throw new Error("Parameter 'row' dan 'rowData' (array) wajib diisi.");
      }

      sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);
      return responseJSON({
        success: true,
        message: "Berhasil mengupdate baris ke-" + targetRow,
        rowNumber: targetRow,
        updatedData: rowData
      });
    }

    // 6. ACTION: REPLACE ALL DATA
    if (action === 'replaceAll') {
      var allRows = params.allRows; // Array of Array: [ [...], [...] ]
      if (!Array.isArray(allRows) || allRows.length === 0) {
        throw new Error("Parameter 'allRows' harus berupa 2D Array data non-kosong.");
      }

      sheet.clearContents();
      sheet.getRange(1, 1, allRows.length, allRows[0].length).setValues(allRows);
      return responseJSON({
        success: true,
        message: "Berhasil mengganti seluruh isi sheet dengan " + allRows.length + " baris data baru.",
        totalRowsWritten: allRows.length
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
