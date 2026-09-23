const DOCS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwjDp9XoMd6ZtvcD3gCgqGqIHuvTgsljGq9qee8caUoHLfY-RCHKBsR6c_MesPHqWECiQ/exec';
const SECRET_TOKEN = 'LBB_DOCS_ADMIN_2027';

async function updateProposalDocs() {
  console.log('Menyiapkan daftar pembaruan untuk Google Docs Proposal...');

  // Daftar penggantian teks spesifik di Google Docs
  const replacements = [
    // 1. Hari-H Pelaksanaan
    { find: 'Sabtu, 6 September 2027', replace: 'Sabtu, 24 Januari 2027' },
    { find: '6 September 2027', replace: '24 Januari 2027' },
    { find: '5 September 2027', replace: '23 Januari 2027' },
    { find: 'Jumat, 5 September 2027 - H-1', replace: 'Jumat, 23 Januari 2027 - H-1' },

    // 2. TM Juri
    { find: 'Sabtu, 9 Agustus 2027', replace: 'Sabtu, 7 November 2026 (Pukul 13.00 WIB)' },
    { find: '8 orang dewan juri', replace: '6 orang dewan juri (3 Juri SD & 3 Juri SMP)' },
    { find: 'target 8 orang: TNI, POLRI, PPI', replace: 'target 6 orang: TNI, POLRI, PPI Kota Yogyakarta (3 SD & 3 SMP)' },
    { find: 'Transportasi TM Juri 8 orang', replace: 'Transportasi TM Juri 6 orang' },
    { find: 'Transportasi Juri Hari-H \\(8 orang', replace: 'Transportasi Juri Hari-H (6 orang' },
    { find: 'Sarapan Pagi Juri \\(8 Kotak\\)', replace: 'Sarapan Pagi Juri (6 Kotak VIP)' },
    { find: 'Makan Siang Juri \\(8 Kotak\\)', replace: 'Makan Siang Juri (6 Kotak VIP)' },
    { find: 'Snack Juri \\(8 Box\\)', replace: 'Snack Juri (6 Box)' },

    // 3. TM Peserta & Uji Coba
    { 
      find: 'Sabtu, 23 Agustus 2027', 
      replace: 'Sabtu, 10 Januari 2027 (Pukul 13.00 WIB di Kampus Induk Wirobrajan)' 
    },
    {
      find: 'TM Peserta\\) \\(Distribusi Juklak/Juknis Final, Tatib, Pembahasan Teknis, Fotokopi Rundown TM Peserta\\)\\.',
      replace: 'TM Peserta) di Aula Kampus Induk Wirobrajan (Distribusi Juklak/Juknis Final, Pengundian Nomor Tampil 1-18 SD & SMP, dan Pembagian Jadwal Uji Coba Lapangan Minggu, 17 Januari 2027).'
    },

    // 4. Jumlah Peleton & Kategori
    { find: 'target 32 peleton', replace: 'target 36 peleton (18 SD/MI & 18 SMP/MTs)' },
    { find: 'kuota target 32 peleton', replace: 'kuota target 36 peleton' },
    { find: 'Sesi I \\(24 peleton\\)', replace: 'Sesi I (24 peleton: 12 SD di Lap. Basket & 12 SMP di Pelataran Embung)' },
    { find: 'Sesi II \\(8 peleton\\)', replace: 'Sesi II (12 peleton: 6 peleton terakhir SD & 6 peleton terakhir SMP)' },
    { find: 'target 32 Dus', replace: 'target 36 Dus' },

    // 5. Pendaftaran & Biaya
    { find: '32 peleton @Rp 325\\.000', replace: '36 peleton (Gel. 1: Rp 350.000 & Gel. 2: Rp 400.000)' },
    { find: 'target 20 tenant @Rp 300\\.000 = Rp 6\\.000\\.000', replace: 'target 20 tenant @Rp 500.000 = Rp 10.000.000' },
    { find: 'target 20 tenant @Rp 300\\.000', replace: 'target 20 tenant @Rp 500.000' },
  ];

  console.log(`Mengirim ${replacements.length} perintah pembaruan ke Google Docs Webhook...`);

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
  console.log('Respon Server Google Docs:', resText);
}

updateProposalDocs().catch(console.error);
