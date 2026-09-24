import ExcelJS from 'exceljs';

async function updateDetailTimelinePanitiaSOP() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Timeline Panitia LBB 2027', {
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 }
  });

  // Lebar kolom dioptimalkan untuk keterbacaan panduan operasional SOP
  ws.columns = [
    { key: 'no', width: 6 },
    { key: 'waktu', width: 28 },
    { key: 'kegiatan', width: 105 },
    { key: 'pic', width: 38 }
  ];

  const headerFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1F4E79' } // Navy Blue Elegant
  };

  const sectionFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD9E1F2' } // Soft Ice Blue
  };

  const milestoneFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFF2CC' } // Soft Yellow Highlight untuk Hari-H Agenda Kunci
  };

  const headerFont = {
    name: 'Segoe UI',
    size: 11,
    bold: true,
    color: { argb: 'FFFFFFFF' }
  };

  const sectionFont = {
    name: 'Segoe UI',
    size: 11,
    bold: true,
    color: { argb: 'FF1F4E79' }
  };

  const milestoneFont = {
    name: 'Segoe UI',
    size: 10,
    bold: true,
    color: { argb: 'FF7F6000' }
  };

  const textFont = {
    name: 'Segoe UI',
    size: 10,
    color: { argb: 'FF000000' }
  };

  const borderAll = {
    top: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    left: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    bottom: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    right: { style: 'thin', color: { argb: 'FFB0C4DE' } }
  };

  // Header row
  const headerRow = ws.addRow(['No.', 'Waktu / Periode', 'Kegiatan Utama, Detail SOP & Panduan Operasional', 'Penanggung Jawab (PIC)']);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = borderAll;
  });

  function addSection(title) {
    const row = ws.addRow([title, '', '', '']);
    row.height = 25;
    const rowNum = row.number;
    ws.mergeCells(`A${rowNum}:D${rowNum}`);
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = sectionFill;
      cell.font = sectionFont;
      cell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
      cell.border = borderAll;
    });
  }

  function addDataRow(no, waktu, kegiatan, pic, isMilestone = false, customHeight = null) {
    const row = ws.addRow([no, waktu, kegiatan, pic]);
    if (customHeight) row.height = customHeight;
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    row.getCell(3).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    row.getCell(4).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

    row.eachCell((cell) => {
      cell.font = isMilestone ? milestoneFont : textFont;
      if (isMilestone) {
        cell.fill = milestoneFill;
      }
      cell.border = borderAll;
    });
  }

  // ==========================================
  // I. TAHAP PERENCANAAN
  // ==========================================
  addSection('A. Tahap Perencanaan, Legalitas & Persiapan Awal (September – Awal Oktober 2026)');
  addDataRow(
    '1.',
    '1 – 14 September 2026',
    'PEMBENTUKAN PANITIA & PERUMUSAN KONSEP DASAR (PANDUAN PERDANA):\n• Pembentukan panitia lengkap (Ketua, Sekretaris, Bendahara, Acara, Lapangan, Juri, Perlengkapan, DDD, LO, Konsumsi, Medis, Keamanan).\n• Penetapan tema: "SEMANGAT SEBAGAI KSATRIA, BERJUANG DENGAN GEMBIRA!" & tagline lomba.\n• Pembuatan draf awal Juklak/Juknis PBB mengacu Perpang TNI No. 57 & 58 Tahun 2018 (materi baku PBB dasar, gerakan berjalan, dan variasi-formasi).\n• Pembagian master folder Google Drive panitia untuk koordinasi terpadu seluruh divisi.',
    'Tim Formatur, Ketua Pelaksana, Divisi Acara, Sekretaris',
    false,
    70
  );
  addDataRow(
    '2.',
    '15 – 21 September 2026',
    'PENYUSUNAN PROPOSAL & MASTER ANGGARAN (RAB):\n• Penyusunan draf proposal kegiatan resmi (latar belakang, maksud & tujuan, susunan panitia, estimasi peserta).\n• Perumusan Rencana Anggaran Biaya (RAB) realistis dengan target pemasukan dari: Subsidi Madrasah (Rp 15.000.000), Pendaftaran Peserta 36 Peleton @Rp 350.000/400.000, Biaya Sewa 20 Tenant @Rp 500.000 (Rp 10.000.000), dan Sponsorship Kemitraan.\n• Pengadaan perlengkapan administrasi kantor (kertas HVS A4/F4 10 rim, tinta printer, map folio, cap panitia).',
    'Ketua Pelaksana, Sekretaris, Bendahara, Divisi Dana & Kemitraan',
    false,
    75
  );
  addDataRow(
    '3.',
    '22 – 30 September 2026',
    'LEGALITAS & PERIZINAN KAMPUS TERPADU SEDAYU & KAMPUS INDUK WIROBRAJAN:\n• Audiensi kepada Direktur/Pimpinan Madrasah Mu’allimin Yogyakarta guna memperoleh persetujuan resmi dan pencairan dana subsidi.\n• Pengajuan izin resmi pemakaian Aula Kampus Induk Mu’allimin (Jl. Letjen S. Parman No. 68, Wirobrajan) untuk Technical Meeting Peserta.\n• Pengajuan izin pemakaian fasilitas Kampus Terpadu Sedayu (Lapangan Basket, Pelataran Embung, Lapangan Minisoccer, Perpustakaan ASM, Ruang Kelas Basecamp, dan Halaman Parkir untuk Bazar Tenant).\n• Pembuatan formulir pendaftaran 20 stand bazar tenant (@Rp 500.000 per stand).',
    'Ketua Pelaksana, Sekretaris, Divisi Keamanan & Perizinan, Divisi Dana',
    false,
    80
  );
  addDataRow(
    '4.',
    '1 – 4 Oktober 2026',
    'SURVEI VENUE, MAPPING 2 ARENA & MATERI PROMOSI:\n• Survei lapangan detail: Dimensi Arena 1 (Lap. Basket untuk SD/MI: 25x14 meter, durasi 10 menit) dan Arena 2 (Pelataran Embung untuk SMP/MTs: 26x15 meter, durasi 13 menit).\n• Pemetaan alur jalan: Pos Parkir, Pos Registrasi Ulang, Holding Area, Daerah Persiapan (DP 1, DP 2, DP 3), Ruang Medis, dan Toilet.\n• Desain materi publikasi visual (Flyer Pendaftaran Peserta & Tenant, Twibbon, Buku Petunjuk Singkat, serta rilis teaser publikasi perdana).',
    'Divisi Teknis Lapangan, Divisi Acara, Divisi DDD, Divisi LO & Humas',
    false,
    70
  );

  // ==========================================
  // II. PENDAFTARAN PESERTA & TENANT
  // ==========================================
  addSection('B. Tahap Pendaftaran Peserta & Penjualan Stand Tenant (5 Oktober – 1 November 2026)');
  addDataRow(
    '5.',
    '5 – 18 Oktober 2026',
    'PENDAFTARAN GELOMBANG PERTAMA (GELOMBANG 1):\n• Pembukaan pendaftaran online via website resmi untuk SD/MI & SMP/MTs dengan biaya pendaftaran Rp 350.000 per peleton.\n• Verifikasi berkas masuk kontingen (surat tugas kepala sekolah, NISN siswa, pas foto resmi, surat pernyataan sehat).\n• Penjualan stand bazar UMKM / tenant kuliner & merchandise Gelombang 1 (biaya sewa Rp 500.000 per tenant - fasilitas tenda 2x2m, 1 meja, 2 kursi, titik listrik).\n• Distribusi proposal sponsor ke instansi perbankan, BUMN/BUMD, dan mitra usaha.',
    'Divisi Acara (Pendaftaran), Divisi LO & Humas, Divisi Dana & Kemitraan',
    false,
    75
  );
  addDataRow(
    '6.',
    '19 Oktober – 1 November 2026',
    'PENDAFTARAN GELOMBANG KEDUA (GELOMBANG 2) & FINALISASI KUOTA:\n• Pembukaan pendaftaran gelombang kedua dengan biaya pendaftaran Rp 400.000 per peleton hingga kuota pasti terpenuhi: 36 Peleton (18 SD/MI dan 18 SMP/MTs).\n• Pelunasan biaya sewa 20 tenant UMKM (@Rp 500.000 = total Rp 10.000.000) dan penandatanganan tata tertib tenant.\n• Penutupan pendaftaran, verifikasi berkas administrasi peleton, dan pembentukan Grup WhatsApp Resmi Ofisial Peserta dipandu LO.',
    'Divisi Acara (Pendaftaran), Divisi LO & Humas, Divisi Dana & Kemitraan, Bendahara',
    false,
    70
  );

  // ==========================================
  // III. AGENDA DETAIL: TM JURI (SABTU, 7 NOV 2026 JAM 13.00)
  // ==========================================
  addSection('C. Rangkaian Agenda Technical Meeting Dewan Juri / TM Juri (November 2026)');
  addDataRow(
    '7.',
    '2 – 5 November 2026',
    'PERSIAPAN ADMINISTRASI & LOGISTIK TM JURI:\n• Penerbitan dan pengiriman surat resmi permohonan Dewan Juri ke KODIM/Koramil (unsur TNI), Polresta/Polsek (unsur POLRI), dan Pengurus PPI Kota Yogyakarta (masing-masing instansi mengutus 2 personil: 1 untuk Kategori SD & 1 untuk Kategori SMP, total 6 Dewan Juri).\n• Konfirmasi tertulis kesediaan hadir 6 orang juri pada jadwal Sabtu, 7 November 2026 pukul 13.00 WIB.\n• Penggandaan berkas kerja juri (cetak 10 bundel): Draf Juklak/Juknis PBB, rubrik blangko penilaian PBB peleton, danton, dan variasi-formasi, serta tabel kriteria penalti/diskualifikasi.\n• Penyiapan amplop tanda terima uang kehormatan/transportasi TM untuk 6 Dewan Juri (@Rp 50.000).',
    'Sekretaris, Divisi Juri & Penilaian, Bendahara',
    false,
    75
  );
  addDataRow(
    '8.',
    'Jumat, 6 November 2026',
    'SETTING RUANG & BRIEFING INTERNAL PANITIA PRA-TM JURI:\n• Penataan ruang transit rapat ber-AC di Ruang Rapat Gedung Perpustakaan ASM Kampus Terpadu Sedayu (meja U-shape, LCD proyektor & pointer presentasi).\n• Rapat internal Divisi Juri, Divisi Acara, dan Panitia Inti: Membedah butir-butir krusial yang harus disepakati juri (durasi SD 10 menit, durasi SMP 13 menit, toleransi langkah, peluit waktu, batas arena, dan kriteria vokal danton).\n• Pemesanan konsumsi: Snack box coffee break siang dan makan siang/sore untuk 6 dewan juri dan panitia pendamping.',
    'Divisi Juri & Penilaian, Divisi Acara, Divisi Perlengkapan, Divisi Konsumsi',
    false,
    70
  );
  addDataRow(
    '9.',
    'Sabtu, 7 November 2026\n(Pukul 13.00 – 16.00 WIB)',
    'PELAKSANAAN TECHNICAL MEETING DEWAN JURI (TM JURI):\n• 12.30 – 13.00: Penyambutan 6 Dewan Juri di Ruang VIP Perpustakaan ASM, registrasi kehadiran, dan coffee break siang.\n• 13.00 – 13.30: Pembukaan oleh Ketua Pelaksana, pemaparan profil LBB Mu\'allimin 2027, dan tinjauan umum denah 2 arena lomba.\n• 13.30 – 15.15: SIDANG PLENO PENYELARASAN PERSEPSI DEWAN JURI:\n  - Standarisasi acuan materi teknis (Perpang TNI No. 57 & 58 Tahun 2018).\n  - Pembagian resmi tugas penilai: 3 Juri SD menilai 18 Peleton SD di Arena 1 (Lap. Basket) & 3 Juri SMP menilai 18 Peleton SMP di Arena 2 (Pelataran Embung).\n  - Penentuan batas durasi waktu tampil resmi:\n    * Kategori SD/MI: Maksimal 10 menit bersih (menit 8: peluit kuning, menit 10: peluit merah).\n    * Kategori SMP/MTs: Maksimal 13 menit bersih (menit 11: peluit kuning, menit 13: peluit merah).\n    * Kelebihan waktu dikenakan sanksi penalti per 30 detik (-50 Poin).\n  - Penyepakatan rubrik nilai: Peleton (70% PBB Murni, 30% Variasi-Formasi) & Danton (Penguasaan materi, vokal, dan penguasaan arena).\n• 15.15 – 15.45: Peninjauan fisik langsung ke Lapangan Basket dan Pelataran Embung bersama juri.\n• 15.45 – 16.00: Penandatanganan Berita Acara Kesepakatan Dewan Juri, penyerahan uang transport TM Juri, foto bersama, dan ramah tamah.',
    'Panitia Inti, Divisi Acara, Divisi Juri & Penilaian, Bendahara, Divisi DDD',
    true,
    120
  );
  addDataRow(
    '10.',
    '8 – 14 November 2026',
    'PASCA-TM JURI (DOKUMENTASI & SISTEMISASI HASIL):\n• Perumusan Berita Acara TM Juri ke dalam Buku Juknis Final (sudah memiliki legitimasi hukum dewan juri).\n• Pembuatan master template blangko penilaian cetak (warna berbeda untuk SD dan SMP guna mencegah tertukar).\n• Perancangan formula spreadsheet komputasi rekapitulasi nilai real-time dengan proteksi rumus ganda.',
    'Divisi Juri & Penilaian, Sekretaris, Divisi Acara'
  );

  // ==========================================
  // IV. PENGADAAN & LOGISTIK
  // ==========================================
  addSection('D. Tahap Pengadaan Logistik, Produksi & Pemantapan Sistem (Nov – Des 2026)');
  addDataRow(
    '11.',
    '15 – 30 November 2026',
    'PRODUKSI SERAGAM & FOLLOW-UP SPONSOR:\n• Pendataan ukuran baju panitia dan pemesanan seragam resmi: 100 pcs Kaos Panitia (@Rp 85.000), 100 pcs Lanyard (@Rp 15.000), dan 100 pcs Topi Lapangan (@Rp 35.000).\n• Rekapitulasi uang muka (DP) dari 20 tenant UMKM (@Rp 500.000) dan pencairan termin 1 dana sponsor.\n• Pembuatan buku petunjuk teknis saku (Juklak/Juknis) untuk persiapan TM Peserta.',
    'Divisi DDD, Divisi Perlengkapan, Bendahara, Divisi Dana & Kemitraan',
    false,
    65
  );
  addDataRow(
    '12.',
    '1 – 20 Desember 2026',
    'PENGADAAN TROFI JUARA, DANA PEMBINAAN & DUKUNGAN MEDIS:\n• Pemesanan paket piala/trofi bergengsi:\n  - 2 Paket Piala Bergilir (SD & SMP)\n  - 12 Paket Piala Juara Tetap 1, 2, 3 dan Harapan 1, 2, 3 (SD & SMP)\n  - 2 Paket Piala Danton Terbaik (SD & SMP)\n• Pembuatan 18 papan simbolis juara ukuran 40x60 cm & alokasi uang pembinaan tunai total Rp 9.600.000.\n• Pengiriman surat permohonan tim medis resmi & ambulans siaga ke Dinas Kesehatan Bantul / PMI, serta surat permohonan tenda pleton ke DENBEKANG.',
    'Divisi Penghargaan & Medis, Divisi Perlengkapan, Sekretaris, Bendahara',
    false,
    75
  );
  addDataRow(
    '13.',
    '21 – 31 Desember 2026',
    'FINALISASI VENDOR SEWA & SIMULASI SOFTWARE PENILAIAN:\n• Penandatanganan kontrak vendor sewa: 70 unit Handy Talky (HT) frekuensi jernih, 3 tenda juri, 16 tenda tenant, kabel roll, dan 3 set sound system panggung & arena.\n• Simulasi komputasi penilaian real-time: Uji coba input ganda nilai 3 Juri SD dan 3 Juri SMP di komputer rekap untuk memastikan tidak ada formula error atau nilai yang tertukar.',
    'Divisi Perlengkapan, Divisi Juri & Penilaian, Divisi Teknis Lapangan',
    false,
    65
  );

  // ==========================================
  // V. AGENDA DETAIL: TM PESERTA (SABTU, 10 JAN 2027 JAM 13.00)
  // LOKASI: KAMPUS INDUK MU'ALLIMIN (WIROBRAJAN)
  // ==========================================
  addSection('E. Rangkaian Agenda Technical Meeting Peserta / TM Peserta (Januari 2027)');
  addDataRow(
    '14.',
    '2 – 8 Januari 2027',
    'PERSIAPAN ADMINISTRASI & MATERI TM PESERTA:\n• Pencetakan Buku Panduan Juknis Final hasil kesepakatan juri (cetak 50 eksemplar).\n• Pembuatan perangkat lotting pengundian nomor urut tampil:\n  - Tabung Undian & Gulungan Nomor SD: SD-01 s.d. SD-18\n  - Tabung Undian & Gulungan Nomor SMP: SMP-01 s.d. SMP-18\n• Penyiapan lembar presensi, formulir biodata peleton final, dan draft Berita Acara TM Peserta.\n• Pembuatan slide presentasi visual (animasi alur arena di Sedayu, denah basecamp kelas, titik parkir, dan aturan seragam/make up peleton).\n• Pemesanan snack box coffee break siang untuk 80 orang (perwakilan kontingen & panitia pelaksana).',
    'Divisi Acara, Divisi LO & Humas, Divisi Perlengkapan, Divisi Konsumsi',
    false,
    75
  );
  addDataRow(
    '15.',
    'Jumat, 9 Januari 2027',
    'SETTING AULA KAMPUS INDUK WIROBRAJAN & GLADI RUANG TM PESERTA:\n• Penataan kursi peserta di Aula Kampus Induk Madrasah Mu\'allimin Muhammadiyah Yogyakarta (Jl. Letjen S. Parman No. 68, Wirobrajan, Kota Yogyakarta).\n• Uji coba audio/mic, LCD proyektor besar, dan display digital visual pengundian nomor peleton.\n• Briefing 36 orang Liaison Officer (LO) pendamping: Memahami tugas mendampingi masing-masing kontingen sejak TM hingga selesai hari-H.',
    'Divisi Acara, Divisi Perlengkapan, Divisi LO & Humas',
    false,
    65
  );
  addDataRow(
    '16.',
    'Sabtu, 10 Januari 2027\n(Pukul 13.00 – 16.30 WIB)',
    'PELAKSANAAN TECHNICAL MEETING PESERTA (TM PESERTA):\n• Lokasi: Aula Kampus Induk Madrasah Mu\'allimin (Jl. Letjen S. Parman No. 68, Wirobrajan, Kota Yogyakarta).\n• 12.30 – 13.00: Registrasi ulang kehadiran perwakilan 36 kontingen (Pembina/Pelatih/Danton), penyerahan berkas fisik asli, dan pembagian snack siang.\n• 13.00 – 13.20: Pembukaan oleh MC, menyanyikan lagu Indonesia Raya & Mars Mu\'allimin, serta sambutan Ketua Panitia Pelaksana.\n• 13.20 – 14.30: PEMAPARAN TEKNIS LOMBA SECARA MENDALAM OLEH DIVISI ACARA & JURI:\n  - Sosialisasi Juknis resmi berdasar Perpang TNI 57 & 58.\n  - Dimensi arena perlombaan di Kampus Terpadu Sedayu: Arena 1 (Lap. Basket 25x14m, Durasi 10 Menit) untuk 18 SD dan Arena 2 (Pelataran Embung 26x15m, Durasi 13 Menit) untuk 18 SMP.\n  - Sistem pemanggilan di Daerah Persiapan (DP 1, DP 2, DP 3).\n  - Tata tertib suporter, basecamp ruang kelas, larangan membawa senjata tajam/rokok, dan mekanisme parkir kontingen.\n• 14.30 – 15.15: SESI TANYA JAWAB TEKNIS (Penyelesaian keraguan peserta terhadap aturan gerak & aba-aba).\n• 15.15 – 16.00: PROSESI PENGUNDIAN NOMOR URUT TAMPIL (LOTTING UNDIAN RESMI):\n  - Pengundian Nomor Tingkat SD (SD-01 s.d. SD-18)\n  - Pengundian Nomor Tingkat SMP (SMP-01 s.d. SMP-18)\n• 16.00 – 16.30: Pembagian lembar jadwal slot waktu Uji Coba Lapangan (Minggu, 17 Januari 2027 pukul 08.00 WIB di Sedayu), penandatanganan Berita Acara TM Peserta oleh perwakilan kontingen, dan perkenalan LO resmi masing-masing peleton.',
    'Panitia Inti, Divisi Acara, Divisi LO & Humas, Divisi Teknis Lapangan, Divisi Juri',
    true,
    130
  );
  addDataRow(
    '17.',
    '11 – 12 Januari 2027',
    'PASCA-TM PESERTA (DISTRIBUSI DATA RESMI):\n• Rilis matriks resmi nomor undian, urutan tampil, dan pembagian ruang basecamp kelas ke Grup WhatsApp Peserta.\n• Penempelan nomor peleton resmi pada seluruh database kepanitiaan dan label map form juri.',
    'Divisi LO & Humas, Divisi Acara, Sekretaris'
  );

  // ==========================================
  // VI. AGENDA DETAIL: UJI COBA LAPANGAN (MINGGU, 17 JAN 2027 JAM 08.00)
  // ==========================================
  addSection('F. Rangkaian Agenda Uji Coba Lapangan / Familiarisasi Medan (Januari 2027)');
  addDataRow(
    '18.',
    '13 – 15 Januari 2027',
    'PERSIAPAN TEKNIS ARENA & SCHEDULING UJI COBA:\n• Pembersihan total permukaan Lapangan Basket dan Pelataran Embung dari debu, pasir, dan batu kerikil guna mencegah peserta terpeleset.\n• Pengecatan/penandaan garis batas arena sementara (temporary line marking) berukuran 15x25 meter.\n• Penyusunan rundown blok waktu uji coba (masing-masing kontingen dijatah 15 menit: 10 menit coba lapangan, 5 menit transisi peleton):\n  - Arena 1 (Lap. Basket): Pukul 08.00 – 13.00 WIB untuk 18 Peleton SD (bergiliran SD-01 s.d. SD-18).\n  - Arena 2 (Pelataran Embung): Pukul 08.00 – 13.00 WIB untuk 18 Peleton SMP (bergiliran SMP-01 s.d. SMP-18).\n• Distribusi jadwal waktu kedatangan kepada sekolah melalui LO masing-masing kontingen agar tidak terjadi penumpukan.',
    'Divisi Teknis Lapangan, Divisi Acara, Divisi LO & Humas',
    false,
    80
  );
  addDataRow(
    '19.',
    'Sabtu, 16 Januari 2027',
    'SETTING POS TRANSIT & STERILISASI JALUR UJI COBA:\n• Pemasangan tenda transit holding peserta sebelum giliran uji coba.\n• Penyiapan Posko Medis P3K lapangan lengkap dengan tandu dan tabung oksigen portabel.\n• Pengadaan galon air minum isi ulang di pinggir arena untuk kontingen yang melakukan uji coba.\n• Briefing keamanan arus lalu lintas bus/kendaraan kontingen di area parkir Kampus Sedayu.',
    'Divisi Teknis Lapangan, Divisi Keamanan, Divisi Medis, Divisi Perlengkapan',
    false,
    65
  );
  addDataRow(
    '20.',
    'Minggu, 17 Januari 2027\n(Pukul 08.00 – 13.30 WIB)',
    'PELAKSANAAN UJI COBA LAPANGAN (FAMILIARISASI MEDAN 36 PELETON):\n• 07.30 – 08.00: Standby seluruh personil lapangan, posko medis, dan LO di gerbang masuk.\n• 08.00 TEPAT: Pembukaan sesi uji coba arena secara paralel:\n  - Arena 1 (Lap. Basket): Uji coba berurutan peleton SD-01 s.d. SD-18 didampingi petugas timekeeper.\n  - Arena 2 (Pelataran Embung): Uji coba berurutan peleton SMP-01 s.d. SMP-18 didampingi petugas timekeeper.\n• TUJUAN KHUSUS UJI COBA:\n  - Memberi kesempatan danton menguji daya pantul gema vokal aba-aba di area terbuka embung dan lapangan basket.\n  - Peleton merasakan tekstur lantai lapangan untuk menyesuaikan sepatu dan hentakan langkah PBB.\n  - Uji akurasi penempatan posisi start, manuver formasi, dan titik keluar arena lomba.\n• 13.00 – 13.30: Penutupan sesi uji coba dan pembersihan kembali arena oleh panitia.',
    'Divisi Teknis Lapangan, Divisi Acara, Divisi LO & Humas, Divisi Medis, Divisi Keamanan',
    true,
    115
  );
  addDataRow(
    '21.',
    '18 – 19 Januari 2027',
    'EVALUASI PASCA-UJI COBA & PERBAIKAN ARENA:\n• Rapat evaluasi teknis Divisi Lapangan dan Acara mengidentifikasi kendala aktual: Menandai titik licin/berbahaya, perbaikan posisi meja juri agar tidak silau matahari, dan penyesuaian jarak batas penonton agar suara juri dan danton tidak terganggu suporter.',
    'Divisi Teknis Lapangan, Divisi Acara, Divisi Perlengkapan'
  );

  // ==========================================
  // VII. LOGISTIK & GLADI BERSIH H-1
  // ==========================================
  addSection('G. Tahap Pemantapan Logistik, Gladi & H-1 (20 – 23 Januari 2027)');
  addDataRow(
    '22.',
    '20 – 22 Januari 2027',
    'PENGAMBILAN LOGISTIK & DISTRIBUSI SERAGAM PANITIA:\n• Pengambilan seluruh alat sewa: 70 unit HT, 3 tenda juri, 16 tenda tenant UMKM, tali pembatas/police line, traffic cone, dan paket sound system lapangan.\n• Pencetakan massal berkas hari-H: Formulir penilaian juri (300 lembar berhologram/stempel), kartu kendali waktu, ID Card Panitia (100 pcs), ID Card Official (72 pcs), dan ID Card Peserta.\n• Distribusi seragam resmi (Kaos, Topi, Lanyard, ID Card) kepada 100 personil panitia pelaksana.\n• Koordinasi final katering konsumsi: Sarapan juri (6 kotak VIP), makan siang juri, makan siang 100 panitia, serta snack sore.',
    'Divisi Perlengkapan, Divisi DDD, Divisi Konsumsi, Divisi Juri & Penilaian',
    false,
    75
  );
  addDataRow(
    '23.',
    'Jumat, 23 Januari 2027\n(Pukul 08.00 – 21.00 WIB)',
    'GLADI KOTOR, GLADI BERSIH & PERSIAPAN VENUE FINAL (H-1):\n• 08.00 – 14.00 (Loading & Setup Lapangan):\n  - Pembuatan garis marking paten cat lapangan (putih/kuning) pada Arena 1 (Basket) & Arena 2 (Embung).\n  - Pemasangan tenda juri, tenda medis, panggung upacara di Minisoccer, dan penataan 20 stand bazar tenant di area parkir.\n  - Instalasi kelistrikan genset, setting sound system 3 titik, dan pengecekan sinyal radio 70 HT antar divisi.\n• 14.00 – 16.30 (Gladi Kotor & Simulasi Alur Peleton):\n  - Simulasi alur pergerakan: Basecamp Kelas -> Pos DP 1 (Pemeriksaan Administrasi) -> Pos DP 2 (Holding Siap Tampil) -> Arena Lomba (12 menit) -> Pos DP 3 (Foto Kontingen & Istirahat) -> Kembali ke Basecamp.\n  - Uji coba petugas runner pembawa form nilai dari meja juri ke Tim Rekapitulasi di Gedung Perpustakaan ASM.\n• 16.30 – 17.30 (Gladi Bersih Protokoler):\n  - Gladi bersih upacara pembukaan & penutupan bersama MC, pembawa acara, dan komandan upacara.\n• 19.30 – 21.00 (Briefing Akbar H-1 Seluruh Panitia):\n  - Pengarahan langsung oleh Ketua Pelaksana kepada seluruh 100 personil panitia.\n  - Penyimpanan piala, piagam, dan uang pembinaan tunai (Rp 9.600.000) di brankas/ruang steril terkunci.',
    'Seluruh Panitia Pelaksana, Divisi Teknis Lapangan, Divisi Perlengkapan, Divisi Acara, Divisi DDD',
    true,
    130
  );

  // ==========================================
  // VIII. HARI-H LOMBA (SABTU, 24 JANUARI 2027)
  // ==========================================
  addSection('H. Tahap Pelaksanaan Perlombaan (Hari-H: Sabtu, 24 Januari 2027)');
  addDataRow(
    '24.',
    '06.00 – 07.00 WIB',
    'REGISTRASI ULANG 36 KONTINGEN & PENEMPATAN BASECAMP:\n• Verifikasi kehadiran peleton di Gerbang Registrasi, pembagian ID card peserta/official, karcis parkir resmi, dan snack roti pagi peserta.\n• Pengawalan langsung masing-masing kontingen oleh LO pendamping menuju ruang kelas basecamp yang telah ditentukan.',
    'Divisi Acara (Registrasi), Divisi LO & Humas, Divisi Keamanan'
  );
  addDataRow(
    '25.',
    '07.00 – 07.30 WIB',
    'PENGKONDISIAN UPACARA & PENYAMBUTAN DEWAN JURI:\n• Mobilisasi seluruh kontingen berbaris rapi di Lapangan Minisoccer.\n• Penyambutan 6 Dewan Juri (3 Juri SD + 3 Juri SMP) di Ruang Transit VIP Perpustakaan ASM & distribusi sarapan pagi VIP.',
    'Divisi Acara, Divisi LO & Humas, Divisi Juri & Penilaian, Divisi Konsumsi'
  );
  addDataRow(
    '26.',
    '07.30 – 08.15 WIB',
    'UPACARA PEMBUKAAN LBB MU\'ALLIMIN 2027:\n• Pembukaan resmi oleh Direktur/Pimpinan Madrasah Mu\'allimin Yogyakarta di Lapangan Minisoccer.\n• Prosesi simbolis pembukaan lomba dan doa bersama.',
    'Divisi Acara, Protokoler'
  );
  addDataRow(
    '27.',
    '08.15 – 08.30 WIB',
    'MOBILISASI SERENTAK MENUJU 2 ARENA LOMBA:\n• 18 Peleton SD/MI & 3 Juri SD bergerak menuju Arena 1 (Lap. Basket).\n• 18 Peleton SMP/MTs & 3 Juri SMP bergerak menuju Arena 2 (Pelataran Embung).\n• Distribusi air mineral gelas peserta (36 dus ke basecamp).',
    'Divisi Acara, Divisi Teknis Lapangan, Divisi LO & Humas, Divisi Konsumsi'
  );
  addDataRow(
    '28.',
    '08.30 – 11.30 WIB',
    'PELAKSANAAN LOMBA SESI I (2 ARENA PARALEL):\n• Arena 1 (Lap. Basket): Penampilan nomor undian SD-01 s.d. SD-12 (dinilai 3 Juri SD: TNI, Polri, PPI).\n• Arena 2 (Pelataran Embung): Penampilan nomor undian SMP-01 s.d. SMP-12 (dinilai 3 Juri SMP: TNI, Polri, PPI).\n• Setiap peleton tampil maksimal 12 menit bersih.\n• Petugas runner mengambil blangko juri per peleton untuk langsung diinput ke sistem software rekapitulasi nilai real-time di Ruang Perpustakaan ASM.\n• Tim Medis siaga di posko mengantisipasi peserta dehidrasi/kelelahan.',
    'Divisi Acara, Teknis Lapangan, Divisi Juri, LO & Humas, Keamanan, Medis, DDD',
    false,
    75
  );
  addDataRow(
    '29.',
    '11.30 – 12.30 WIB',
    'ISHOMA (ISTIRAHAT, SHOLAT DHUHUR & MAKAN SIANG):\n• Pelaksanaan Sholat Dhuhur berjamaah di Masjid Hajah Yuliana Kampus Terpadu Sedayu.\n• Distribusi makan siang kotak VIP untuk 6 Dewan Juri, 100 panitia pelaksana, dan tamu undangan.\n• Pengisian ulang air galon di area basecamp peleton.',
    'Divisi Konsumsi, Seluruh Panitia'
  );
  addDataRow(
    '30.',
    '12.30 – 14.00 WIB',
    'PELAKSANAAN LOMBA SESI II (2 ARENA PARALEL):\n• Arena 1 (Lap. Basket): Penampilan nomor undian SD-13 s.d. SD-18 (6 peleton terakhir SD).\n• Arena 2 (Pelataran Embung): Penampilan nomor undian SMP-13 s.d. SMP-18 (6 peleton terakhir SMP).\n• Input nilai real-time sesi II dan rekapitulasi data pengurangan poin/penalti oleh panitera.',
    'Divisi Acara, Teknis Lapangan, Divisi Juri, LO & Humas, Keamanan, Medis, DDD',
    false,
    65
  );
  addDataRow(
    '31.',
    '14.00 – 15.00 WIB',
    'SIDANG PLENO DEWAN JURI & REKAPITULASI NILAI AKHIR:\n• Rekapitulasi final nilai 3 Juri SD dan 3 Juri SMP di Ruang Steril Perpustakaan ASM.\n• Sidang pleno tertutup dewan juri menetapkan Juara 1, 2, 3, Harapan 1, 2, 3, dan Danton Terbaik Kategori SD & SMP.\n• Penandatanganan Surat Keputusan (SK) Dewan Juri berkekuatan mutlak.\n• Pembagian snack sore panitia dan peserta di area bazar tenant.',
    'Divisi Juri & Penilaian, Divisi Acara, Divisi Konsumsi',
    false,
    65
  );
  addDataRow(
    '32.',
    '15.00 – 15.30 WIB',
    'UPACARA PENUTUPAN LBB MU\'ALLIMIN 2027:\n• Pengkondisian seluruh 36 kontingen kembali ke Lapangan Minisoccer.\n• Upacara penutupan resmi oleh panitia & perwakilan madrasah.',
    'Divisi Acara, Protokoler, Divisi Keamanan'
  );
  addDataRow(
    '33.',
    '15.30 – 16.15 WIB',
    'PENGUMUMAN JUARA & PENGANUGERAHAN HADIAH:\n• Pembacaan SK Dewan Juri oleh Koordinator Juri.\n• Penyerahan Piala Bergilir, Piala Tetap Juara 1-3 & Harapan 1-3, Piala Danton Terbaik, dan Piagam.\n• Penyerahan simbolis uang pembinaan tunai total Rp 9.600.000.\n• Penyerahan piagam penghargaan & amplop honorarium transportasi kepada 6 Dewan Juri.',
    'Divisi Acara, Divisi Penghargaan & Medis, Bendahara',
    false,
    65
  );
  addDataRow(
    '34.',
    '16.15 – selesai',
    'PEMBUBARAN KONTINGEN, OPERASI KEBERSIHAN & BONGKAR VENUE:\n• Pemulangan seluruh kontingen secara tertib diatur Divisi Keamanan.\n• Operasi semut kebersihan lapangan dan ruang kelas basecamp bersama tim kebersihan.\n• Penarikan dan inventarisasi 70 unit HT serta logistik sewa.',
    'Seluruh Panitia Pelaksana, Divisi Perlengkapan, Divisi Keamanan, Divisi Konsumsi'
  );

  // ==========================================
  // IX. PASCA-LOMBA & LPJ
  // ==========================================
  addSection('I. Tahap Pasca-Pelaksanaan & Pelaporan / LPJ (Januari – Februari 2027)');
  addDataRow(
    '35.',
    '25 – 31 Januari 2027',
    'PENGEMBALIAN ALAT SEWA, EVALUASI AKBAR & AFTER MOVIE:\n• Pengembalian seluruh peralatan sewa (HT, tenda, sound system) kepada vendor mitra.\n• Rapat Evaluasi Akbar seluruh panitia pelaksana: Membahas catatan kinerja tiap divisi sebagai database pembelajaran event perdana.\n• Rilis resmi video After Movie dan dokumentasi foto LBB Mu\'allimin 2027 di media sosial resmi.',
    'Ketua Pelaksana, Panitia Inti, Divisi Perlengkapan, Divisi DDD'
  );
  addDataRow(
    '36.',
    '1 – 20 Februari 2027',
    'PENYUSUNAN LAPORAN PERTANGGUNGJAWABAN (LPJ):\n• Penyusunan draf buku LPJ Kegiatan dan LPJ Keuangan lengkap dengan bukti kuitansi pengeluaran, realisasi pendaftaran 36 peleton, pemasukan 20 tenant @Rp 500.000 (Rp 10.000.000), dana sponsor, dan biaya operasional.',
    'Sekretaris, Bendahara, Divisi Dana & Kemitraan, Ketua Pelaksana'
  );
  addDataRow(
    '37.',
    '22 – 28 Februari 2027',
    'PENYERAHAN LPJ FINAL KE MADRASAH & PEMBUBARAN PANITIA:\n• Penyerahan resmi dokumen LPJ Final (cetak 5 bundel hardcover) kepada Direksi Madrasah Mu\'allimin Yogyakarta.\n• Syukuran dan pembubaran panitia pelaksana secara resmi.',
    'Ketua Pelaksana, Sekretaris, Bendahara'
  );

  await wb.xlsx.writeFile('TIMELINE PANITIA LBB.xlsx');
  console.log('Successfully written highly detailed SOP TIMELINE PANITIA LBB.xlsx!');
}

updateDetailTimelinePanitiaSOP().catch(console.error);
