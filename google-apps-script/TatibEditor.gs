/**
 * ============================================================================
 * GOOGLE APPS SCRIPT WEBHOOK: EDIT TATA TERTIB (TATIB) LBB MU'ALLIMIN 2027
 * ============================================================================
 * Dokumen: TATA TERTIB PESERTA LBB MU'ALLIMIN 2027
 * URL: https://docs.google.com/document/d/1rkVVB0XgycFRQgx8N4Zs7K6LB6T2J0cjYTtmALxpDzM/edit
 *
 * Cara Memasang:
 * 1. Buka Google Docs Tatib:
 *    https://docs.google.com/document/d/1rkVVB0XgycFRQgx8N4Zs7K6LB6T2J0cjYTtmALxpDzM/edit
 * 2. Menu: Extensions (Ekstensi) -> Apps Script
 * 3. Hapus kode bawaan, tempel seluruh kode ini
 * 4. Klik Deploy -> New Deployment -> Pilih Jenis 'Web app'
 *    - Execute as: Me (email Anda)
 *    - Who has access: Anyone
 * 5. Klik Deploy, Authorize access, dan salin URL Webhook
 * ============================================================================
 */

var SECRET_TOKEN = "LBB_TATIB_ADMIN_2027"; // Token pengaman untuk webhook Tatib

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
        message: "Google Apps Script Tatib Webhook Aktif & Siap Menerima Perintah!",
        documentTitle: doc.getName(),
        totalCharacters: body.getText().length
      });
    }

    // 2. ACTION: READ
    if (action === 'read') {
      return responseJSON({
        success: true,
        documentTitle: doc.getName(),
        content: body.getText()
      });
    }

    // 3. ACTION: REPLACE TEXT
    if (action === 'replaceText') {
      var findText = params.find;
      var replaceText = params.replace;

      if (!findText) {
        return responseJSON({ success: false, error: "Parameter 'find' wajib diisi." });
      }

      body.replaceText(findText, replaceText || "");
      doc.saveAndClose();

      return responseJSON({
        success: true,
        message: "Berhasil mengganti teks: '" + findText + "' menjadi '" + replaceText + "'."
      });
    }

    // 4. ACTION: BATCH REPLACE
    if (action === 'batchReplace') {
      var replacements = params.replacements;
      if (!Array.isArray(replacements)) {
        return responseJSON({ success: false, error: "Parameter 'replacements' harus berupa Array." });
      }

      var count = 0;
      for (var i = 0; i < replacements.length; i++) {
        var item = replacements[i];
        if (item.find) {
          body.replaceText(item.find, item.replace || "");
          count++;
        }
      }

      doc.saveAndClose();

      return responseJSON({
        success: true,
        message: "Berhasil mengganti " + count + " item teks di dalam Dokumen Tata Tertib."
      });
    }

    // 5. ACTION: APPEND PARAGRAPH
    if (action === 'appendParagraph') {
      var text = params.text;
      if (!text) {
        return responseJSON({ success: false, error: "Parameter 'text' wajib diisi." });
      }

      var p = body.appendParagraph(text);
      if (params.bold) p.setBold(true);
      if (params.fontSize) p.setFontSize(params.fontSize);

      doc.saveAndClose();

      return responseJSON({
        success: true,
        message: "Paragraf baru berhasil ditambahkan di akhir dokumen."
      });
    }

    // 6. ACTION: REPLACE ALL TEXT
    if (action === 'replaceAllText') {
      var newFullText = params.text;
      if (!newFullText) {
        return responseJSON({ success: false, error: "Parameter 'text' wajib diisi." });
      }

      body.setText(newFullText);
      doc.saveAndClose();

      return responseJSON({
        success: true,
        message: "Seluruh isi dokumen Tata Tertib berhasil diganti dengan teks baru."
      });
    }

    return responseJSON({
      success: false,
      error: "Aksi tidak dikenali: " + action
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
