/**
 * ============================================================================
 * GOOGLE APPS SCRIPT WEBHOOK: EDIT JUKNIS LAPANGAN LBB MU'ALLIMIN 2027
 * ============================================================================
 * Dokumen: PETUNJUK TEKNIS LAPANGAN LBB MU'ALLIMIN
 * URL: https://docs.google.com/document/d/1rkVVB0XgycFRQgx8N4Zs7K6LB6T2J0cjYTtmALxpDzM/edit
 * Pasang script ini di Google Docs Anda:
 * Menu: Extensions (Ekstensi) -> Apps Script
 *
 * FITUR LENGKAP:
 * 1. Ping / Test Koneksi
 * 2. Baca Seluruh Isi Dokumen (read)
 * 3. Ganti Teks Spesifik (replaceText)
 * 4. Ganti Banyak Teks Sekaligus (batchReplace)
 * 5. Tambah Paragraf di Akhir (appendParagraph)
 * 6. Replace Seluruh Isi Dokumen (replaceAllText)
 * ============================================================================
 */

var SECRET_TOKEN = "LBB_JUKNIS_ADMIN_2027"; // Token pengaman untuk webhook Juknis

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
        message: "Google Apps Script Juknis Webhook Aktif & Siap Menerima Perintah!",
        documentTitle: doc.getName(),
        totalCharacters: body.getText().length
      });
    }

    // 2. ACTION: READ
    if (action === 'read') {
      return responseJSON({
        success: true,
        documentTitle: doc.getName(),
        totalCharacters: body.getText().length,
        text: body.getText()
      });
    }

    // 3. ACTION: REPLACE TEXT
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

    // 4. ACTION: BATCH REPLACE
    if (action === 'batchReplace') {
      var replacements = params.replacements; // [{ find: "...", replace: "..." }]
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
        message: "Berhasil mengganti " + replacements.length + " item teks di dalam Juknis."
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
        message: "Berhasil menulis ulang seluruh isi dokumen Juknis.",
        totalCharacters: fullText.length
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
