/**
 * Script untuk sinkronisasi dokumen TATA TERTIB PESERTA LBB MU'ALLIMIN 2027
 * URL Dokumen: https://docs.google.com/document/d/1rkVVB0XgycFRQgx8N4Zs7K6LB6T2J0cjYTtmALxpDzM/edit
 */

const TATIB_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxzjPGirXitAH1yGP--Ougxid7vcSDaDdyDiuDSAe4O04eBeOKymG69UNQRCK7ksnI/exec';
const SECRET_TOKEN = 'LBB_TATIB_ADMIN_2027';

async function syncTatibDoc() {
  console.log('Menyiapkan daftar pembaruan untuk Dokumen TATA TERTIB PESERTA LBB 2027...');

  const replacements = [
    // 1. Tahun & Nama Kegiatan
    { find: "LOMBA BARIS – BERBARIS MUALLIMIN TAHUN 2025", replace: "LOMBA BARIS – BERBARIS MU'ALLIMIN TAHUN 2027" },
    { find: "LBB MU’ALLIMIN 2025", replace: "LBB MU’ALLIMIN 2027" },
    { find: "LBB MUALLIMIN 2025", replace: "LBB MU'ALLIMIN 2027" },
    { find: "Mu'allimin Tahun 2025", replace: "Mu'allimin Tahun 2027" },
    { find: "Muallimin Tahun 2025", replace: "Mu'allimin Tahun 2027" },
    { find: "Tahun 2025", replace: "Tahun 2027" },

    // 2. Tanggal Pelaksanaan Hari-H (Sabtu, 24 Januari 2027)
    { 
      find: "dilaksanakan pada tanggal 7 September di Kampus Terpadu", 
      replace: "dilaksanakan pada hari Sabtu, 24 Januari 2027 di Kampus Terpadu" 
    },
    { 
      find: "tanggal 7 September", 
      replace: "hari Sabtu, 24 Januari 2027" 
    },

    // 3. Technical Meeting Peserta (Sabtu, 10 Januari 2027 di Kampus Induk Wirobrajan)
    { 
      find: "Technical Meeting Peserta pada tanggal 24 Agustus 2025 pukul 13.00 WIB - selesai", 
      replace: "Technical Meeting Peserta pada hari Sabtu, 10 Januari 2027 pukul 13.00 WIB - selesai bertempat di Kampus Induk Madrasah Mu'allimin Muhammadiyah Yogyakarta (Wirobrajan)" 
    },
    { 
      find: "tanggal 24 Agustus 2025", 
      replace: "Sabtu, 10 Januari 2027" 
    },

    // 4. Durasi & Arena Lomba
    {
      find: "Kampus Terpadu Madrasah Muallimin Muhammadiyah Yogyakarta",
      replace: "Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta (Sedayu, Bantul)"
    }
  ];

  console.log(`Mengirim ${replacements.length} penyesuaian teks ke Webhook Tata Tertib...`);

  const res = await fetch(TATIB_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'batchReplace',
      token: SECRET_TOKEN,
      replacements: replacements
    }),
    redirect: 'follow'
  });

  const data = await res.text();
  console.log('Hasil Sinkronisasi Tatib:', data);
}

syncTatibDoc().catch(console.error);
