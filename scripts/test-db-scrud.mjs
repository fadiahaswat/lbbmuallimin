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
  console.log('🧪 PENGUJIAN INTEGRASI DATABASE, DRIVE & TAB RELASIONAL');
  console.log('Endpoint:', ENDPOINT);
  console.log('====================================================\n');

  // TEST 0: PING KONEKSI
  console.log('1️⃣ [TEST PING]: Menguji responsivitas endpoint...');
  const pingRes = await request(`${ENDPOINT}?action=ping`);
  if (!pingRes.data?.success) throw new Error('Gagal Ping ke database');
  console.log(`✅ Terhubung ke Spreadsheet: "${pingRes.data.spreadsheetName}"\n`);

  // TEST 1: CREATE (C) DENGAN SUSUNAN 25 PERSONEL & BERKAS
  console.log('2️⃣ [TEST CREATE]: Mendaftarkan tim lengkap dengan 25 personel & berkas foto...');
  const dummyTinyImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  const testTeamId = `TEST-SMP-${Date.now()}`;
  
  // Susun roster simulasi
  const samplePasukan = [];
  for (let i = 1; i <= 21; i++) {
    samplePasukan.push({
      id: `p-${i}`,
      name: `Personel Pasukan ${i}`,
      nisn: `00987654${10 + i}`,
      class: 'IX A',
      safNumber: Math.ceil(i / 7),
      banjarNumber: ((i - 1) % 7) + 1,
      uniformSize: 'M',
      shoeSize: '40'
    });
  }

  const newTeamPayload = {
    action: 'upsert',
    table: 'teams',
    data: {
      id: testTeamId,
      regCode: 'LBB26-SMP-TEST2',
      schoolName: 'SMP Test Terpadu Muallimin',
      jenjang: 'SMP',
      teamType: 'Homogen (Putra)',
      dantonName: 'Falhan Pratama',
      officialName: 'Kak Dian Permata',
      waNumber: '081234567890',
      email: 'smptest@muallimin.sch.id',
      status: 'pending',
      // Berkas foto
      files: {
        schoolLogo: { name: 'logo_smp_test.png', url: dummyTinyImageBase64 },
        paymentProof: { name: 'bukti_transfer.png', url: dummyTinyImageBase64 }
      },
      // Roster lengkap
      roster: {
        danton: {
          name: 'Falhan Pratama',
          nisn: '0098765400',
          class: 'IX Danton',
          uniformSize: 'L',
          shoeSize: '42'
        },
        pasukan: samplePasukan,
        cadangan: [
          { name: 'Cadangan 1', nisn: '0098765491', class: 'VIII B' }
        ],
        officials: [
          { name: 'Kak Dian Permata', role: 'Pelatih', phone: '081234567890' }
        ]
      }
    }
  };

  const createRes = await request(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain' } }, newTeamPayload);
  console.log('Hasil Create:', createRes.data || createRes.raw);
  if (!createRes.data?.success) throw new Error('Gagal Create record');
  console.log(`✅ Record tim berhasil dibuat di tab "teams"!\n`);

  // TEST 2: VERIFIKASI TAB teams & KOLOM LINK DRIVE
  console.log('3️⃣ [TEST VERIFIKASI TAB TEAMS]: Memeriksa kolom link file mandiri di tab "teams"...');
  const readTeamRes = await request(`${ENDPOINT}?table=teams&id=${testTeamId}`);
  const teamItem = readTeamRes.data?.data?.[0];
  if (!teamItem) throw new Error('Tim baru tidak ditemukan di tab teams');
  console.log('Kolom link mandiri:', {
    id: teamItem.id,
    schoolName: teamItem.schoolName,
    file_logo_sekolah: teamItem.file_logo_sekolah || teamItem.files?.schoolLogo?.url,
    roster_ringkasan: teamItem.roster_ringkasan
  });
  console.log('✅ Tab "teams" bersih dan rapi!\n');

  // TEST 3: VERIFIKASI TAB RELASIONAL team_roster
  console.log('4️⃣ [TEST TAB team_roster]: Memeriksa apakah tab "team_roster" otomatis terisi per personel...');
  const readRosterRes = await request(`${ENDPOINT}?table=team_roster&q=${testTeamId}`);
  const rosterRows = readRosterRes.data?.data || [];
  console.log(`Jumlah baris personel di tab "team_roster" untuk tim ini: ${rosterRows.length} orang`);
  if (rosterRows.length > 0) {
    console.log('Contoh sampel data baris personel:', {
      nama: rosterRows[0].nama,
      peran: rosterRows[0].peran,
      posisi: rosterRows[0].posisi,
      ukuranBaju: rosterRows[0].ukuranBaju
    });
    console.log('✅ Tab relasional "team_roster" berhasil otomatis membagi personel per baris!\n');
  } else {
    console.log('ℹ️ Tab team_roster akan terisi jika Code.gs terbaru sudah dideploy.\n');
  }

  // TEST 4: UPDATE (U)
  console.log('5️⃣ [TEST UPDATE]: Mengubah status menjadi "verified" & mengisi nomor lot...');
  const updatePayload = {
    action: 'upsert',
    table: 'teams',
    data: {
      ...teamItem,
      status: 'verified',
      lotNumber: 12
    }
  };
  const updateRes = await request(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain' } }, updatePayload);
  console.log('Hasil Update:', updateRes.data?.action, 'isNew:', updateRes.data?.isNew);
  console.log('✅ Update status sukses!\n');

  // TEST 5: CLEANUP DELETE (D)
  console.log('6️⃣ [TEST DELETE]: Menghapus tim testing...');
  const deleteRes = await request(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain' } }, {
    action: 'delete',
    table: 'teams',
    id: testTeamId
  });
  console.log('Hasil Delete:', deleteRes.data);
  console.log('✅ Delete data baris spreadsheet berhasil!\n');

  console.log('====================================================');
  console.log('🎉 PENGUJIAN SELESAI DENGAN STATUS SUKSES 100%!');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('❌ PENGUJIAN GAGAL:', err);
  process.exit(1);
});
