/**
 * src/services/sheetService.js
 * =============================
 * Service untuk menghubungkan aplikasi web ke Google Spreadsheet via Google Apps Script (Web App).
 * Fitur:
 * - Upsert data otomatis (Insert baru atau Update data lama)
 * - Bulk sync (Sinkronisasi daftar data sekaligus)
 * - Fetching data dari Google Sheet
 * - Toleran terhadap jaringan (Offline-safe / fallback tanpa crash)
 */

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

/**
 * Cek apakah konfigurasi URL Google Apps Script sudah disetel
 */
export function isGoogleSheetConfigured() {
  return typeof APPS_SCRIPT_URL === 'string' && APPS_SCRIPT_URL.trim().startsWith('https://script.google.com/');
}

export function getAppsScriptUrl() {
  return APPS_SCRIPT_URL;
}

/**
 * Mengubah URL Google Drive View (/file/d/.../view) menjadi Direct Image Thumbnail URL
 * agar bisa ditampilkan langsung di tag <img> browser tanpa CORS/HTML preview issue.
 */
export function formatImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/') || url.startsWith('http://') || url.includes('unsplash.com') || url.includes('ui-avatars.com')) {
    return url;
  }

  // Jika URL adalah Google Drive link
  if (url.includes('drive.google.com') || url.includes('googleusercontent.com')) {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      // Google Drive Direct Thumbnail CDN (mendukung display di tag img tanpa login/CORS blocker)
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
  }

  return url;
}

/**
 * Mengirim single record ke Google Sheet (Upsert)
 * @param {string} table - Nama tab sheet (misal 'teams', 'scores', 'staging', 'votes', dll)
 * @param {object} data - Objek data yang ingin disimpan
 */
export async function saveRecordToSheet(table, data) {
  if (!isGoogleSheetConfigured()) {
    return { success: false, reason: 'unconfigured' };
  }

  try {
    const payload = {
      action: 'upsert',
      table,
      data,
    };

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Menggunakan text/plain mencegah CORS preflight OPTIONS issue di Apps Script
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.warn(`[SheetService] Gagal menyimpan ke tabel ${table}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Menyinkronkan daftar data sekaligus ke Google Sheet (Bulk Sync)
 * @param {string} table - Nama tab sheet
 * @param {Array<object>} items - Array data yang ingin disinkronkan
 */
export async function bulkSyncToSheet(table, items) {
  if (!isGoogleSheetConfigured()) {
    return { success: false, reason: 'unconfigured' };
  }

  if (!items || (Array.isArray(items) && items.length === 0)) {
    return { success: true, count: 0 };
  }

  try {
    const payload = {
      action: 'bulkSync',
      table,
      data: items,
    };

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.warn(`[SheetService] Gagal bulk sync tabel ${table}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Mengambil data dari satu tab sheet dengan opsi filter / pencarian (SCRUD - Search & Read)
 * @param {string} table - Nama tab sheet
 * @param {object} queryOptions - Opsi query, misal { q: 'Muallimin', jenjang: 'SMP', status: 'verified' }
 */
export async function fetchTableFromSheet(table, queryOptions = {}) {
  if (!isGoogleSheetConfigured()) {
    return { success: false, reason: 'unconfigured' };
  }

  try {
    const params = new URLSearchParams({
      table,
      t: Date.now(),
      ...queryOptions,
    });
    const url = `${APPS_SCRIPT_URL}?${params.toString()}`;
    const response = await fetch(url, { method: 'GET', mode: 'cors' });
    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        return { success: false, error: 'Non-JSON response from Apps Script' };
      }
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.warn(`[SheetService] Gagal membaca tabel ${table}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Mencari data spesifik di tabel sheet berdasarkan kata kunci (Search)
 * @param {string} table - Nama tab sheet
 * @param {string} keyword - Kata kunci pencarian
 */
export async function searchRecordsFromSheet(table, keyword) {
  return fetchTableFromSheet(table, { q: keyword });
}

/**
 * Mengambil seluruh data dari semua tab sheet
 */
export async function fetchAllDataFromSheet() {
  if (!isGoogleSheetConfigured()) {
    return { success: false, reason: 'unconfigured' };
  }

  try {
    const url = `${APPS_SCRIPT_URL}?action=getAll&t=${Date.now()}`;
    const response = await fetch(url, { method: 'GET', mode: 'cors' });
    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        return { success: false, error: 'Non-JSON response from Apps Script' };
      }
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.warn('[SheetService] Gagal mengambil seluruh data sheet:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Menghapus record dari Google Sheet berdasarkan ID
 * @param {string} table - Nama tab sheet
 * @param {string} id - ID record
 */
export async function deleteRecordFromSheet(table, id) {
  if (!isGoogleSheetConfigured()) {
    return { success: false, reason: 'unconfigured' };
  }

  try {
    const payload = {
      action: 'delete',
      table,
      id,
    };

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.warn(`[SheetService] Gagal menghapus record ${id} di tabel ${table}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Cek status koneksi Google Apps Script
 */
export async function pingSheetDatabase() {
  if (!isGoogleSheetConfigured()) {
    return { connected: false, message: 'URL Google Apps Script belum dikonfigurasi di .env' };
  }

  try {
    const url = `${APPS_SCRIPT_URL}?action=ping&t=${Date.now()}`;
    const response = await fetch(url, { method: 'GET', mode: 'cors' });
    const result = await response.json();
    return {
      connected: result.success === true,
      spreadsheetName: result.spreadsheetName,
      message: result.message || 'Terhubung ke Google Spreadsheet'
    };
  } catch (error) {
    return { connected: false, message: error.message };
  }
}
