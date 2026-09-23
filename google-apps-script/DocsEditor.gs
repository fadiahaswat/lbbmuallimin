/**
 * ============================================================================
 * GOOGLE APPS SCRIPT WEBHOOK: EDIT GOOGLE DOCS PROPOSAL LBB MU'ALLIMIN 2027
 * ============================================================================
 * Pasang script ini di Google Docs Anda:
 * Menu: Extensions (Ekstensi) -> Apps Script
 *
 * FITUR:
 * 1. Ping / Test Koneksi
 * 2. Baca Seluruh Isi Dokumen (read)
 * 3. Ganti Teks / Replace Teks Tertentu (replaceText)
 * 4. Tambah Paragraf di Akhir (appendParagraph)
 * 5. Replace Seluruh Isi Dokumen (replaceAllText)
 * ============================================================================
 */

var SECRET_TOKEN = "LBB_DOCS_ADMIN_2027"; // Token pengaman

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

    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();

    // 1. ACTION: PING
    if (action === 'ping') {
      return responseJSON({
        success: true,
        message: "Google Apps Script Docs Webhook Aktif & Siap Menerima Perintah!",
        documentTitle: doc.getName(),
        totalCharacters: body.getText().length
      });
    }

    // 2. ACTION: READ
    if (action === 'read') {
      return responseJSON({
        success: true,
        documentTitle: doc.getName(),
        text: body.getText()
      });
    }

    // 3. ACTION: REPLACE TEXT (Sangat berguna untuk edit tanggal, angka, atau bab tertentu)
    if (action === 'replaceText') {
      var findText = params.find;
      var replaceWith = params.replace;

      if (!findText) {
        throw new Error("Parameter 'find' (teks yang dicari) wajib diisi.");
      }

      body.replaceText(findText, replaceWith || "");
      doc.saveAndClose();

      return responseJSON({
        success: true,
        message: "Berhasil mengganti teks '" + findText + "' dengan '" + replaceWith + "'",
        find: findText,
        replace: replaceWith
      });
    }

    // 4. ACTION: BATCH REPLACE (Ganti banyak teks sekaligus)
    if (action === 'batchReplace') {
      var replacements = params.replacements; // Array of { find: "...", replace: "..." }
      if (!Array.isArray(replacements)) {
        throw new Error("Parameter 'replacements' harus berupa array objek { find, replace }.");
      }

      for (var i = 0; i < replacements.length; i++) {
        var item = replacements[i];
        if (item.find) {
          body.replaceText(item.find, item.replace || "");
        }
      }
      doc.saveAndClose();

      return responseJSON({
        success: true,
        message: "Berhasil mengganti " + replacements.length + " item teks di dalam dokumen."
      });
    }

    // 5. ACTION: APPEND PARAGRAPH
    if (action === 'appendParagraph') {
      var text = params.text;
      if (!text) {
        throw new Error("Parameter 'text' wajib diisi.");
      }

      body.appendParagraph(text);
      doc.saveAndClose();

      return responseJSON({
        success: true,
        message: "Berhasil menambahkan paragraf baru di akhir dokumen."
      });
    }

    // 6. ACTION: REPLACE ALL TEXT
    if (action === 'replaceAllText') {
      var fullText = params.text;
      if (typeof fullText !== 'string') {
        throw new Error("Parameter 'text' harus berupa string.");
      }

      body.setText(fullText);
      doc.saveAndClose();

      return responseJSON({
        success: true,
        message: "Berhasil menulis ulang seluruh isi dokumen.",
        totalCharacters: fullText.length
      });
    }

    // 7. ACTION: AUTO FIT TIMELINE TABLE (Otomatis atur lebar kolom & align top)
    if (action === 'autoFitTable') {
      var tables = body.getTables();
      if (tables.length === 0) {
        return responseJSON({ success: false, error: "Tidak ada tabel yang ditemukan di dalam dokumen." });
      }

      // Ambil tabel terakhir (Tabel Lampiran I Jadwal Kegiatan)
      var table = tables[tables.length - 1];
      
      // Lebar kolom landscape (total ~675 pt pas di dalam margin dokumen landscape):
      // Col 0 (No) = 35 pt
      // Col 1 (Waktu/Periode) = 135 pt (cukup lebar, tanggal tidak bertumpuk)
      // Col 2 (Kegiatan & SOP) = 365 pt (lebar utama untuk panduan detail)
      // Col 3 (PIC) = 140 pt (nama divisi muat rapi)
      var colWidths = [35, 135, 365, 140];

      for (var r = 0; r < table.getNumRows(); r++) {
        var row = table.getRow(r);
        for (var c = 0; c < row.getNumCells(); c++) {
          var cell = row.getCell(c);
          if (c < colWidths.length) {
            cell.setWidth(colWidths[c]);
          }
          cell.setVerticalAlignment(DocumentApp.VerticalAlignment.TOP);
        }
      }

      doc.saveAndClose();

      return responseJSON({
        success: true,
        message: "Berhasil mengatur Auto-Width dan Vertical Alignment TOP untuk tabel Lampiran I."
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
