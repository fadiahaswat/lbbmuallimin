const RAB_URL = 'https://script.google.com/macros/s/AKfycbwlyHj_BhABFsxE2iIWqDYrQm0us_zL9GpAHJKOa5C3G2qHrLcfo8T2gS1oYgUI0UuhFw/exec';
const SECRET_TOKEN = 'LBB_RAB_ADMIN_2027';

async function updateRabSpreadsheet() {
  console.log('Menyelaraskan data Spreadsheet RAB dengan kesepakatan terbaru...');

  // Data baris demi baris yang sudah terhitung presisi & sinkron 100%
  const updatedRows = [
    // Bagian A. PEMASUKAN
    ["A. PEMASUKAN", "", "", "", "", ""],
    ["No.", "Sumber Pemasukan", "Volume (Jml)", "Satuan", "Harga Satuan", "Jumlah"],
    ["1", "Dana Subsidi Madrasah Mu'allimin Muhammadiyah Yogyakarta", "1", "Paket", 15000000, 15000000],
    ["2", "Sponsorship Pihak Eksternal (Target Kemitraan)", "1", "Paket", 25211450, 25211450],
    ["3", "Pendaftaran Peserta (36 Peleton: 18 SD/MI & 18 SMP/MTs)", "", "", "", ""],
    ["3.1", "Pendaftaran Gelombang 1 (50% Kuota = 18 Peleton @ Rp 350.000)", "18", "Peleton", 350000, 6300000],
    ["3.2", "Pendaftaran Gelombang 2 (50% Kuota = 18 Peleton @ Rp 400.000)", "18", "Peleton", 400000, 7200000],
    ["4", "Dana Usaha Panitia (Sewa 20 Stand Bazar Tenant UMKM @ Rp 500.000)", "20", "Tenant", 500000, 10000000],
    ["", "JUMLAH ESTIMASI PEMASUKAN", "", "", "", 63711450],
    ["", "", "", "", "", ""],

    // Bagian B. PENGELUARAN
    ["B. PENGELUARAN", "", "", "", "", ""],
    ["No.", "Keterangan", "Volume (Jml)", "Satuan", "Harga Satuan", "Jumlah"],
    
    // 1. Kesekretariatan
    ["1", "Kesekretariatan (Sekretaris & Bendahara)", "", "", "", ""],
    ["1.1", "Pembuatan & Penggandaan Proposal Kegiatan", "15", "Bundel", 20000, 300000],
    ["1.2", "Kertas HVS F4/A4", "10", "Rim", 45000, 450000],
    ["1.3", "Amplop Surat Resmi", "5", "Pak", 37500, 187500],
    ["1.4", "ATK Panitia (Pulpen, Map, Notes, dll.)", "1", "Paket", 250000, 250000],
    ["1.5", "Biaya Cetak Laporan Pertanggungjawaban (LPJ Final 5 Bundel)", "5", "Bundel", 10000, 50000],
    ["", "SUBTOTAL KESEKRETARIATAN", "", "", "", 1237500],

    // 2. Divisi Acara
    ["2", "Divisi Acara", "", "", "", ""],
    ["2.1", "Fotokopi Rundown Acara (Hari-H, TM Juri, TM Peserta)", "2000", "Lembar", 300, 600000],
    ["2.2", "Perlengkapan Administrasi Pendaftaran & TM (Lotting, Map)", "1", "Paket", 500000, 500000],
    ["2.3", "Perlengkapan Tambahan Acara", "1", "Paket", 300000, 300000],
    ["", "SUBTOTAL DIVISI ACARA", "", "", "", 1400000],

    // 3. Divisi Juri & Penilaian (6 Dewan Juri: 3 SD + 3 SMP)
    ["3", "Divisi Juri & Penilaian (6 Dewan Juri: 3 SD & 3 SMP)", "", "", "", ""],
    ["3.1", "Honorarium Dewan Juri (6 Orang: TNI, Polri, PPI)", "6", "Orang", 350000, 2100000],
    ["3.2", "Transportasi Dewan Juri (TM Juri Sabtu, 7 Nov 2026)", "6", "Orang", 50000, 300000],
    ["3.3", "Transportasi Dewan Juri (Hari-H Sabtu, 24 Jan 2027)", "6", "Orang", 50000, 300000],
    ["3.4", "Cetak Formulir Penilaian Juri Resmi", "300", "Lembar", 300, 90000],
    ["3.5", "Cetak Sertifikat/Piagam Dewan Juri", "6", "Lembar", 5000, 30000],
    ["3.6", "Perlengkapan Juri (Papan Dada, ATK, Stopwatch, dll.)", "1", "Paket", 200000, 200000],
    ["", "SUBTOTAL DIVISI JURI & PENILAIAN", "", "", "", 3020000],

    // 4. Divisi Teknis Lapangan
    ["4", "Divisi Teknis Lapangan (2 Arena Paralel: Basket & Embung)", "", "", "", ""],
    ["4.1", "Penyiapan 2 Arena Lomba (Marking Cat Garis, Tali Rafia, Patok)", "1", "Paket", 1500000, 1500000],
    ["4.2", "Sewa/Pembuatan Properti Pos Lomba & Meja Juri", "3", "Unit", 500000, 1500000],
    ["4.3", "Kebutuhan Teknis Lapangan Lainnya", "1", "Paket", 1000000, 1000000],
    ["", "SUBTOTAL DIVISI TEKNIS LAPANGAN", "", "", "", 4000000],

    // 5. Divisi Penghargaan & Medis
    ["5", "Divisi Penghargaan & Medis", "", "", "", ""],
    ["", "Penghargaan:", "", "", "", ""],
    ["5.1", "Piala Bergilir Juara Umum (SD/MI & SMP/MTs)", "2", "Buah", 500000, 1000000],
    ["5.2", "Piala Tetap Juara 1, 2, 3 Peleton (SD/MI & SMP/MTs)", "6", "Set", 280000, 1680000],
    ["5.3", "Piala Tetap Juara Harapan 1, 2, 3 Peleton (SD/MI & SMP/MTs)", "6", "Set", 280000, 1680000],
    ["5.4", "Piala Tetap Komandan Terbaik (Danton) SD & SMP", "6", "Buah", 280000, 1680000],
    ["5.5", "Uang Pembinaan Pemenang (Total 18 Juara SD & SMP)", "1", "Paket", 9600000, 9600000],
    ["5.6", "Cetak Papan Simbolis Juara (Ukuran 40x60 cm)", "18", "Lembar", 10000, 180000],
    ["", "Medis:", "", "", "", ""],
    ["5.7", "Obat-obatan & Perlengkapan P3K Lapangan", "1", "Paket", 50000, 50000],
    ["5.8", "Honor/Transportasi Tim Medis Eksternal & Ambulans Siaga", "3", "Orang/Paket", 200000, 600000],
    ["", "SUBTOTAL DIVISI PENGHARGAAN & MEDIS", "", "", "", 16470000],

    // 6. Divisi Perlengkapan
    ["6", "Divisi Perlengkapan", "", "", "", ""],
    ["6.1", "Sewa HT (Handy Talkie) Saluran Jernih", "70", "Unit", 15000, 1050000],
    ["6.2", "Sewa Tenda Juri (4m x 5m)", "3", "Unit", 750000, 2250000],
    ["6.3", "Sewa Tenda Lipat Stand Tenant (3m x 3m)", "16", "Unit", 100000, 1600000],
    ["6.4", "Sewa Sound System (Arena 1, Arena 2, Upacara Minisoccer)", "1", "Paket", 1500000, 1500000],
    ["6.5", "Selotip Police Line", "1", "Rol", 60000, 60000],
    ["6.6", "Police Line Pembatas", "3", "Rol", 100000, 300000],
    ["6.7", "Tali Rafia Lapangan", "3", "Rol", 25000, 75000],
    ["6.8", "Trash Bag (Kantong Sampah Pilah Besar)", "5", "Pak", 50000, 250000],
    ["6.9", "Lakban, Tali, Paku, & Kebutuhan Logistik Kecil", "1", "Paket", 150000, 150000],
    ["6.10", "Perlengkapan Backdrop Panggung", "1", "Paket", 350000, 350000],
    ["", "SUBTOTAL DIVISI PERLENGKAPAN", "", "", "", 7585000],

    // 7. Divisi Keamanan & Perizinan
    ["7", "Divisi Keamanan & Perizinan", "", "", "", ""],
    ["7.1", "Perlengkapan Keamanan & Traffic Cone", "1", "Paket", 200000, 200000],
    ["7.2", "Karcis Parkir Resmi & Kartu Identitas Kendaraan", "10", "Bendel", 25000, 250000],
    ["7.3", "Paket Staples, Lakban, dan Isi", "5", "Buah", 20000, 100000],
    ["", "SUBTOTAL DIVISI KEAMANAN & PERIZINAN", "", "", "", 550000],

    // 8. Divisi Konsumsi (Juri 6 orang, Kontingen 36 Peleton)
    ["8", "Divisi Konsumsi", "", "", "", ""],
    ["8.1", "Air Mineral Gelas Peserta (1 Dus / Peleton)", "36", "Dus", 30000, 1080000],
    ["8.2", "Air Mineral Galon Panitia & Transit", "10", "Galon", 10000, 100000],
    ["8.3", "Snack Coffee Break TM Juri (6 Dewan Juri)", "6", "Box", 8000, 48000],
    ["8.4", "Snack TM Peserta (36 Kontingen @ 2 Perwakilan)", "72", "Box", 8000, 576000],
    ["8.5", "Sarapan Pagi Dewan Juri Hari-H (VIP)", "6", "Kotak", 30000, 180000],
    ["8.6", "Makan Siang Dewan Juri Hari-H (VIP)", "6", "Kotak", 25000, 150000],
    ["8.7", "Makan Siang Panitia Pelaksana", "100", "Kotak", 25000, 2500000],
    ["8.8", "Makan Siang Tamu Undangan VIP", "15", "Kotak", 25000, 375000],
    ["8.9", "Snack Sore Dewan Juri Hari-H (VIP)", "6", "Box", 8000, 48000],
    ["8.10", "Snack Sore Panitia Pelaksana", "100", "Box", 8000, 800000],
    ["8.11", "Snack Sore Tamu Undangan VIP", "15", "Box", 8000, 120000],
    ["8.12", "Konsumsi Ekstra Petugas Lapangan (Keamanan, Medis)", "20", "Dus", 10000, 200000],
    ["", "SUBTOTAL DIVISI KONSUMSI", "", "", "", 6177000],

    // 9. Divisi DDD
    ["9", "Divisi Desain, Dekorasi, & Dokumentasi (DDD)", "", "", "", ""],
    ["9.1", "Cetak Banner, Backdrop Utama, Spanduk, Poster", "1", "Paket", 1500000, 1500000],
    ["9.2", "Bahan & Perlengkapan Dekorasi Venue", "1", "Paket", 300000, 300000],
    ["9.3", "Produksi Kaos Panitia Resmi (100 Personil)", "100", "Pcs", 85000, 8500000],
    ["9.4", "Produksi ID Card Panitia Lengkap", "100", "Pcs", 5000, 500000],
    ["9.5", "Produksi ID Card Official Peserta (36 Peleton @ 2 Official)", "72", "Pcs", 5000, 360000],
    ["9.6", "Lanyard Resmi Panitia dan Juri", "100", "Pcs", 15000, 1500000],
    ["9.7", "Topi Lapangan Panitia", "100", "Pcs", 35000, 3500000],
    ["", "SUBTOTAL DIVISI DDD", "", "", "", 16160000],

    // 10. Divisi Dana & Kemitraan
    ["10", "Divisi Dana & Kemitraan (Operasional)", "", "", "", ""],
    ["10.1", "Cetak & Penggandaan Proposal Sponsorship (20 Bundel)", "20", "Bundel", 20000, 400000],
    ["10.2", "Transportasi & Operasional Pencarian Sponsor/Tenant", "1", "Paket", 500000, 500000],
    ["", "SUBTOTAL DIVISI DANA & KEMITRAAN", "", "", "", 900000],

    // 11. Divisi LO & Humas
    ["11", "Divisi LO & Humas (Operasional)", "", "", "", ""],
    ["11.1", "Amplop Permohonan Trofi (Wali Kota & Gubernur)", "2", "Paket", 25000, 50000],
    ["11.2", "Amplop Undangan Peserta", "1", "Box", 20000, 20000],
    ["11.3", "Map Folio (Merk Biola) Administrasi", "2", "Pack", 35000, 70000],
    ["11.4", "Cetak & Distribusi Surat Undangan Peserta", "50", "Paket", 5000, 250000],
    ["11.5", "Fotokopi Denah Basecamp & Materi untuk 36 LO", "100", "Lembar", 300, 30000],
    ["", "SUBTOTAL DIVISI LO & HUMAS", "", "", "", 420000],

    // 12. Biaya Tak Terduga (10%)
    ["12", "Biaya Tak Terduga (10% dari Total Pengeluaran Divisi 1–11)", "1", "Paket", 5791950, 5791950],
    ["", "SUBTOTAL BIAYA TAK TERDUGA", "", "", "", 5791950],
    ["", "JUMLAH ESTIMASI PENGELUARAN (1 s/d 12)", "", "", "", 63711450],
    ["", "", "", "", "", ""],

    // Bagian C. REKAPITULASI ANGGARAN
    ["C. REKAPITULASI ANGGARAN", "", "", "", "", ""],
    ["No.", "Uraian", "", "", "", "Jumlah (Rp)"],
    ["1", "Total Estimasi Pemasukan", "", "", "", 63711450],
    ["2", "Total Estimasi Pengeluaran", "", "", "", 63711450],
    ["", "SALDO / KEKURANGAN DANA", "", "", "", "Rp 0 (BALANCE)"]
  ];

  console.log(`Mengirim ${updatedRows.length} baris data anggaran terupdate ke Google Spreadsheet...`);

  const response = await fetch(RAB_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'replaceAll',
      token: SECRET_TOKEN,
      allRows: updatedRows
    }),
    redirect: 'follow'
  });

  const resText = await response.text();
  console.log('Respon Server Spreadsheet RAB:', resText);
}

updateRabSpreadsheet().catch(console.error);
