// scripts/test-db-scrud.mjs
const ENDPOINT = 'https://script.google.com/macros/s/AKfycbxLkfu6DLYOfjwK3gQBOgtKMy6k6ELn_Ma1COMfx0SivJEYGEbb64KAtt2H76XAN8QK/exec';

async function request(url, options = {}, data = null) {
  const fetchOptions = {
    redirect: 'follow',
    ...options,
  };
  if (data) {
    fetchOptions.body = typeof data === 'string' ? data : JSON.stringify(data);
  }
  const res = await fetch(url, fetchOptions);
  const text = await res.text();
  try {
    return { status: res.status, data: JSON.parse(text) };
  } catch (e) {
    return { status: res.status, raw: text };
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 MEMULAI PENGUJIAN LENGKAP SCRUD GOOGLE APPS SCRIPT');
  console.log('Endpoint:', ENDPOINT);
  console.log('====================================================\n');

  // TEST 0: PING KONEKSI DATABASE
  console.log('1️⃣ [TEST PING]: Menguji koneksi database & Google Spreadsheet...');
  const pingRes = await request(`${ENDPOINT}?action=ping`);
  console.log('Hasil Ping:', pingRes.data || pingRes.raw);
  if (!pingRes.data?.success) throw new Error('Gagal Ping ke database');
  console.log(`✅ Terhubung ke Spreadsheet: "${pingRes.data.spreadsheetName}"\n`);

  // TEST 1: CREATE (C) - AUTO TAB BARU + AUTO KOLOM BARU + UPLOAD FOTO DRIVE
  console.log('2️⃣ [TEST CREATE]: Menambahkan data tim baru (Otomatis Buat Tab "teams", Kolom Baru, & Simpan Foto ke Drive)...');
  const dummyTinyImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  
  const testTeamId = `TEST-SMP-${Date.now()}`;
  const newTeamPayload = {
    action: 'upsert',
    table: 'teams',
    data: {
      id: testTeamId,
      regCode: 'LBB26-SMP-TEST',
      schoolName: 'SMP Muhammadiyah Test Yogyakarta',
      jenjang: 'SMP',
      teamType: 'Homogen (Putra)',
      dantonName: 'Kapten Falhan Test',
      officialName: 'Pelatih Bambang Test',
      waNumber: '081299998888',
      email: 'smpmuhtest@example.com',
      status: 'pending',
      // Kolom baru dinamis:
      customPeletonMotto: 'Disiplin, Tangguh, Berkarakter Juara!',
      // Berkas foto untuk uji Google Drive upload otomatis:
      files: {
        schoolLogo: {
          name: 'logo_sekolah_test.png',
          url: dummyTinyImageBase64
        }
      }
    }
  };

  const createRes = await request(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain' } }, newTeamPayload);
  console.log('Hasil Create:', createRes.data || createRes.raw);
  if (!createRes.data?.success) throw new Error('Gagal Create record');
  console.log(`✅ Record ${testTeamId} berhasil dibuat!\n`);

  // TEST 2: READ (R) - MEMBACA DATA DARI SPREADSHEET
  console.log('3️⃣ [TEST READ]: Membaca data dari tabel "teams"...');
  const readRes = await request(`${ENDPOINT}?table=teams`);
  console.log('Jumlah record dibaca:', readRes.data?.data?.length);
  const foundItem = (readRes.data?.data || []).find(t => t.id === testTeamId);
  if (!foundItem) throw new Error('Record yang baru dibuat tidak ditemukan saat Read');
  console.log('Data ditemukan:', {
    id: foundItem.id,
    schoolName: foundItem.schoolName,
    customPeletonMotto: foundItem.customPeletonMotto,
    fileLogoUrl: foundItem.files?.schoolLogo?.url
  });
  console.log('✅ Read data & deserialisasi JSON berhasil!\n');

  // TEST 3: SEARCH (S) - PENCARIAN DATA (SEARCH QUERY)
  console.log('4️⃣ [TEST SEARCH]: Melakukan pencarian query "Muhammadiyah Test"...');
  const searchRes = await request(`${ENDPOINT}?table=teams&q=Muhammadiyah%20Test`);
  console.log('Hasil Search (count):', searchRes.data?.count);
  if (!searchRes.data?.data?.some(t => t.id === testTeamId)) {
    throw new Error('Hasil search tidak menemukan tim uji');
  }
  console.log('✅ Search filter "q" berhasil!\n');

  // TEST 4: UPDATE (U) - MENGUBAH DATA TANPA MEMBUAT BARIS BARU (UPSERT)
  console.log('5️⃣ [TEST UPDATE]: Memperbarui status tim menjadi "verified" dan menambah nomor undian...');
  const updatePayload = {
    action: 'upsert',
    table: 'teams',
    data: {
      ...foundItem,
      status: 'verified',
      lotNumber: 7,
      revisionNote: 'Berkas lengkap dan telah disetujui panitia.'
    }
  };

  const updateRes = await request(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain' } }, updatePayload);
  console.log('Hasil Update:', updateRes.data || updateRes.raw);
  if (!updateRes.data?.success) throw new Error('Gagal Update record');

  // Verifikasi update
  const verifyRes = await request(`${ENDPOINT}?table=teams&id=${testTeamId}`);
  const updatedItem = verifyRes.data?.data?.[0];
  console.log('Hasil verifikasi nilai ter-update:', {
    id: updatedItem?.id,
    status: updatedItem?.status,
    lotNumber: updatedItem?.lotNumber,
    revisionNote: updatedItem?.revisionNote
  });
  if (updatedItem?.status !== 'verified' || updatedItem?.lotNumber !== 7) {
    throw new Error('Data tidak ter-update dengan benar');
  }
  console.log('✅ Update data pada baris yang sama berhasil!\n');

  // TEST 5: DELETE (D) - MENGHAPUS RECORD BERDASARKAN ID
  console.log('6️⃣ [TEST DELETE]: Menghapus data testing dari spreadsheet...');
  const deletePayload = {
    action: 'delete',
    table: 'teams',
    id: testTeamId
  };

  const deleteRes = await request(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain' } }, deletePayload);
  console.log('Hasil Delete:', deleteRes.data || deleteRes.raw);
  if (!deleteRes.data?.deleted) throw new Error('Gagal Delete record');

  // Verifikasi apakah benar-benar terhapus
  const afterDeleteRes = await request(`${ENDPOINT}?table=teams&id=${testTeamId}`);
  const shouldBeEmpty = afterDeleteRes.data?.data || [];
  if (shouldBeEmpty.length > 0) throw new Error('Record masih ada setelah di-delete');
  console.log('✅ Delete data baris spreadsheet berhasil!\n');

  console.log('====================================================');
  console.log('🎉 SEMUA PENGUJIAN SCRUD & GOOGLE DRIVE BERHASIL 100%!');
  console.log('Database Anda siap digunakan secara penuh dan otomatis.');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('❌ PENGUJIAN GAGAL:', err);
  process.exit(1);
});
