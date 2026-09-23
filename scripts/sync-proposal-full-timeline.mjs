const DOCS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwjDp9XoMd6ZtvcD3gCgqGqIHuvTgsljGq9qee8caUoHLfY-RCHKBsR6c_MesPHqWECiQ/exec';
const SECRET_TOKEN = 'LBB_DOCS_ADMIN_2027';

async function syncAllTimelineHeadings() {
  console.log('Menyelaraskan seluruh judul bab dan tanggal di Proposal Google Docs...');

  const replacements = [
    // 1. Bab 7 Waktu dan Tempat Pelaksanaan
    {
      find: 'Hari, Tanggal : Ahad, 24 Agustus 2027',
      replace: 'Hari, Tanggal : Sabtu, 24 Januari 2027'
    },
    {
      find: '24 Agustus 2027',
      replace: '24 Januari 2027'
    },
    {
      find: 'Pemilihan hari Ahad juga bertujuan',
      replace: 'Pemilihan hari Sabtu juga bertujuan'
    },

    // 2. Judul Tahapan di Lampiran I
    {
      find: 'Tahap Perencanaan & Persiapan Awal \\(Mei – Juni 2027\\)',
      replace: 'Tahap Perencanaan, Legalitas & Persiapan Awal (September – Awal Oktober 2026)'
    },
    {
      find: 'Tahap Pendaftaran & Persiapan Lanjutan \\(Juli – Agustus 2027\\)',
      replace: 'Tahap Pendaftaran Peserta & Kemitraan (5 Oktober – 1 November 2026)'
    },

    // 3. Periode Bulan di Tahap 1
    {
      find: 'Mei 2027\n\\(Minggu ke-1 – ke-2\\)',
      replace: '1 – 14 September 2026'
    },
    {
      find: 'Mei 2027\n\\(Minggu ke-3 – ke-4\\)',
      replace: '15 – 21 September 2026'
    },
    {
      find: 'Juni 2027\n\\(Minggu ke-1\\)',
      replace: '22 – 30 September 2026'
    },
    {
      find: 'Juni 2027\n\\(Minggu ke-1 – ke-2\\)',
      replace: '1 – 4 Oktober 2026'
    },
    {
      find: 'Juni 2027\n\\(Minggu ke-1 – ke-4\\)',
      replace: 'September – Oktober 2026'
    },
    {
      find: 'Juni 2027\n\\(Minggu ke-2 – ke-3\\)',
      replace: '22 – 30 September 2026'
    },
    {
      find: 'Juni 2027\n\\(Minggu ke-2 – ke-4\\)',
      replace: '1 – 4 Oktober 2026'
    },
    {
      find: 'Juni 2027\n\\(Minggu ke-3 – ke-4\\)',
      replace: 'Oktober 2026'
    },

    // 4. Periode Bulan di Tahap 2 (Pendaftaran)
    {
      find: 'Juli 2027 \\(Minggu ke-1\\) – Agustus 2027 \\(Minggu ke-1\\)',
      replace: '5 – 18 Oktober 2026 (Gelombang 1) & 19 Okt – 1 Nov 2026 (Gelombang 2)'
    },
    {
      find: 'Juli 2027 – Agustus 2027 \\(Berkala\\)',
      replace: 'Oktober – November 2026 (Berkala)'
    },
    {
      find: 'Juli 2027\n\\(Minggu ke-1 – ke-2\\)',
      replace: 'Oktober 2026 (Minggu ke-3 – ke-4)'
    },
    {
      find: 'Juli 2027\n\\(Minggu ke-3 – ke-4\\)',
      replace: 'November – Desember 2026'
    },
    {
      find: 'Agustus 2027\n\\(Minggu ke-1\\)',
      replace: '1 – 6 November 2026'
    },
    {
      find: 'Agustus 2027\n\\(Minggu ke-1 – ke-2\\)',
      replace: 'November 2026'
    },
    {
      find: 'Agustus 2027\n\\(Minggu ke-2 – ke-3\\)',
      replace: 'Desember 2026'
    },
    {
      find: 'Agustus 2027\n\\(Minggu ke-3\\)',
      replace: '2 – 8 Januari 2027'
    },
    {
      find: 'Akhir Agustus – 23 Januari 2027',
      replace: '18 – 22 Januari 2027'
    }
  ];

  console.log(`Mengirim ${replacements.length} penyesuaian jadwal ke Google Docs...`);

  const response = await fetch(DOCS_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'batchReplace',
      token: SECRET_TOKEN,
      replacements: replacements
    }),
    redirect: 'follow'
  });

  const resText = await response.text();
  console.log('Respon:', resText);
}

syncAllTimelineHeadings().catch(console.error);
