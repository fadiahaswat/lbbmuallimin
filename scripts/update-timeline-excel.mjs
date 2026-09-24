import ExcelJS from 'exceljs';

async function updateTimelinePanitia() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Timeline Panitia', {
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 }
  });

  // Set columns width
  ws.columns = [
    { key: 'no', width: 6 },
    { key: 'waktu', width: 22 },
    { key: 'kegiatan', width: 85 },
    { key: 'pic', width: 38 }
  ];

  const headerFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1F4E79' } // Dark Elegant Blue
  };

  const sectionFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD9E1F2' } // Soft Light Blue
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
  const headerRow = ws.addRow(['No.', 'Waktu / Periode', 'Kegiatan Utama & Rincian Tugas', 'Penanggung Jawab (PIC)']);
  headerRow.height = 26;
  headerRow.eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = borderAll;
  });

  function addSection(title) {
    const row = ws.addRow([title, '', '', '']);
    row.height = 24;
    const rowNum = row.number;
    ws.mergeCells(`A${rowNum}:D${rowNum}`);
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = sectionFill;
      cell.font = sectionFont;
      cell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
      cell.border = borderAll;
    });
  }

  function addDataRow(no, waktu, kegiatan, pic, customHeight) {
    const row = ws.addRow([no, waktu, kegiatan, pic]);
    if (customHeight) row.height = customHeight;
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    row.getCell(3).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    row.getCell(4).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

    row.eachCell((cell) => {
      cell.font = textFont;
      cell.border = borderAll;
    });
  }

  // --- I. PERENCANAAN ---
  addSection('A. Tahap Perencanaan & Persiapan Awal (September – Awal Oktober 2026)');
  addDataRow(
    '1.',
    '1 – 14 September 2026',
    'Pembentukan struktur panitia inti; Perumusan visi, misi, konsep acara, tema ("SEMANGAT SEBAGAI KSATRIA, BERJUANG DENGAN GEMBIRA!"), dan tagline; Penyusunan draf awal Juklak & Juknis Lomba mengacu Perpang TNI 57 & 58.',
    'Tim Formatur, Ketua Pelaksana, Divisi Acara'
  );
  addDataRow(
    '2.',
    '15 – 21 September 2026',
    'Penyusunan draf Proposal Kegiatan Lengkap & Rencana Anggaran Biaya (RAB target Rp 64.622.250); Pengadaan kertas HVS & ATK kesekretariatan untuk draf proposal.',
    'Ketua Pelaksana, Sekretaris, Bendahara'
  );
  addDataRow(
    '3.',
    '22 – 30 September 2026',
    'Pengajuan proposal dan audiensi kepada Pimpinan Madrasah Mu’allimin (pencairan subsidi madrasah Rp 15.000.000); Pengurusan izin pemakaian fasilitas Kampus Terpadu Sedayu; Pembuatan draf MoU sponsorship & tenant UMKM (target 20 tenant @Rp 300.000).',
    'Ketua Pelaksana, Sekretaris, Divisi Keamanan & Perizinan, Divisi Dana & Kemitraan'
  );
  addDataRow(
    '4.',
    '1 – 4 Oktober 2026',
    'Survei teknis 2 venue lomba (Arena 1: Lap. Basket untuk Kategori SD/MI & Arena 2: Pelataran Embung untuk Kategori SMP/MTs, Lap. Minisoccer, Perpus ASM, Ruang Kelas); Desain flyer publikasi, teaser, buku panduan pendaftaran, dan rilis publikasi awal (Save the Date).',
    'Divisi Teknis Lapangan, Divisi Acara, Divisi DDD, Divisi LO & Humas'
  );

  // --- II. PENDAFTARAN & TM JURI ---
  addSection('B. Tahap Pendaftaran Peserta, Kemitraan & TM Juri (Oktober – Awal November 2026)');
  addDataRow(
    '5.',
    '5 – 18 Oktober 2026',
    'Pendaftaran Gelombang Pertama (Gelombang 1) SD/MI & SMP/MTs; Verifikasi berkas masuk; Pengiriman proposal sponsor aktif tahap 1 ke lembaga/perusahaan mitra; Pembukaan pendaftaran tenant stan bazar UMKM.',
    'Divisi Acara (Pendaftaran), Divisi LO & Humas, Divisi Dana & Kemitraan'
  );
  addDataRow(
    '6.',
    '19 Oktober – 1 November 2026',
    'Pendaftaran Gelombang Kedua (Gelombang 2); Rekapitulasi kuota target 36 peleton (18 Peleton SD/MI & 18 Peleton SMP/MTs); Finalisasi pendaftaran 20 tenant UMKM; Pembentukan grup WhatsApp ofisial kontingen.',
    'Divisi Acara (Pendaftaran), Divisi LO & Humas, Divisi Dana & Kemitraan'
  );
  addDataRow(
    '7.',
    '2 – 6 November 2026',
    'Pengiriman surat tugas resmi & konfirmasi ketersediaan 6 Dewan Juri (3 Juri SD: TNI, POLRI, PPI dan 3 Juri SMP: TNI, POLRI, PPI); Penyiapan berkas Juknis, blangko rubrik penilaian, dan administrasi honor transport TM Juri.',
    'Sekretaris, Divisi Juri & Penilaian, Bendahara'
  );
  addDataRow(
    '8.',
    'Sabtu, 7 November 2026',
    'Technical Meeting Dewan Juri (TM Juri):\n• Penyelarasan persepsi & standarisasi materi penilaian PBB, Danton, dan Formasi-Variasi (mengacu Perpang TNI 57 & 58).\n• Pembagian tugas kamar juri: 3 Juri Tingkat SD (Lap. Basket) & 3 Juri Tingkat SMP (Pelataran Embung).\n• Penandatanganan Berita Acara TM Juri & distribusi transportasi TM (6 juri @Rp 50.000).',
    'Panitia Inti, Divisi Acara, Divisi Juri & Penilaian, Bendahara',
    50
  );

  // --- III. PENGADAAN & PRODUKSI ---
  addSection('C. Tahap Pengadaan Logistik, Produksi & Pemantapan Sistem (November – Desember 2026)');
  addDataRow(
    '9.',
    '10 – 30 November 2026',
    'Pemesanan seragam panitia (100 pcs Kaos @Rp 85k, 100 Lanyard, 100 Topi); Follow-up pencairan dana sponsor tahap 1 & 2; Evaluasi anggaran dan belanja termin pertama.',
    'Divisi DDD, Divisi Perlengkapan, Bendahara, Divisi Dana'
  );
  addDataRow(
    '10.',
    '1 – 20 Desember 2026',
    'Pemesanan piala bergilir (2 unit SD & SMP), piala tetap juara 1-3 & harapan 1-3 SD & SMP (12 unit), piala danton terbaik (2 unit); Pembuatan 18 papan simbolis juara; Pengajuan surat bantuan medis Dinkes Bantul & tenda pleton DENBEKANG.',
    'Divisi Penghargaan & Medis, Sekretaris, Divisi Perlengkapan'
  );
  addDataRow(
    '11.',
    '21 – 31 Desember 2026',
    'Pengembangan & simulasi sistem komputasi input nilai real-time (2 arena paralel); Finalisasi MoU vendor persewaan (70 unit HT, 3 tenda juri, 16 tenda tenant, paket sound system lapangan).',
    'Divisi Juri & Penilaian, Divisi Perlengkapan'
  );

  // --- IV. PRA-LOMBA ---
  addSection('D. Tahap Pra-Lomba, TM Peserta & Uji Coba Lapangan (Januari 2027)');
  addDataRow(
    '12.',
    '2 – 9 Januari 2027',
    'Cetak massal formulir penilaian juri (300 lembar), sertifikat juri/peserta, ID card panitia (100 pcs), ID card official (72 pcs); Penyiapan perangkat lotting nomor undian SD-01 s.d. SD-18 dan SMP-01 s.d. SMP-18; Penataan denah ruang kelas basecamp.',
    'Divisi DDD, Divisi Perlengkapan, Divisi Juri & Penilaian, Divisi Acara'
  );
  addDataRow(
    '13.',
    '10 Januari 2027',
    'Technical Meeting Peserta (TM Peserta):\n• Sosialisasi Juknis final, tata tertib basecamp, denah 2 arena, durasi waktu tampil, kriteria diskualifikasi.\n• Pengundian nomor urut tampil resmi bagi 18 Peleton SD/MI (SD-01 s.d SD-18) dan 18 Peleton SMP/MTs (SMP-01 s.d SMP-18).\n• Penjelasan jadwal slot waktu Uji Coba Lapangan.',
    'Panitia Inti, Divisi Acara, Divisi LO & Humas, Divisi Teknis Lapangan, Divisi Juri',
    50
  );
  addDataRow(
    '14.',
    '11 – 16 Januari 2027',
    'Briefing mendalam 36 LO kontingen (1 kontingen 1 LO); Finalisasi plotting petugas lapangan (timer, linesman, runner juri); Penggandaan jadwal detail dan materi pegangan LO; Pengecekan kesiapan arena uji coba.',
    'Koordinator Divisi LO & Humas, Divisi Teknis Lapangan, Divisi Acara'
  );
  addDataRow(
    '15.',
    '17 Januari 2027',
    'Uji Coba Lapangan (Familiarisasi Medan 36 Peleton):\n• Pelaksanaan familiarisasi arena secara bergiliran (slot waktu teratur @15 menit).\n• Arena 1 (Lap. Basket): Uji coba untuk 18 Peleton SD/MI.\n• Arena 2 (Pelataran Embung): Uji coba untuk 18 Peleton SMP/MTs.\n• Adaptasi danton terhadap gema vokal arena, evaluasi sudut langkah, & simulasi alur keluar-masuk lapangan.',
    'Divisi Teknis Lapangan, Divisi Acara, Divisi LO & Humas, Divisi Keamanan',
    55
  );
  addDataRow(
    '16.',
    '18 – 22 Januari 2027',
    'Evaluasi pasca-uji coba lapangan; Pengambilan alat sewaan (70 HT, sound system, tenda); Distribusi seragam dan perlengkapan panitia; Belanja obat-obatan P3K medis & persiapan konsumsi hari-H.',
    'Divisi Perlengkapan, Divisi Penghargaan & Medis, Divisi Konsumsi'
  );
  addDataRow(
    '17.',
    'Jumat, 23 Januari 2027',
    'Gladi Bersih & Persiapan Venue Final (H-1):\n• Pagi – Siang: Loading perlengkapan, pembuatan garis batas arena/pos, pemasangan tenda juri & tenant, dekorasi panggung, setting sound system & HT.\n• Sore: Gladi kotor & simulasi alur perpindahan kontingen (Basecamp -> DP 1 -> DP 2 -> Arena -> DP 3 -> Basecamp).\n• Malam: Gladi bersih upacara pembukaan/penutupan, briefing akbar 100 personil panitia, simulasi rekap nilai, dan penguncian piala/hadiah di ruang steril.',
    'Seluruh Panitia Pelaksana, Divisi Teknis Lapangan, Divisi Perlengkapan, Divisi Acara, Divisi DDD',
    60
  );

  // --- V. HARI-H ---
  addSection('E. Tahap Pelaksanaan Lomba (Hari-H: Sabtu, 24 Januari 2027)');
  addDataRow(
    '18.',
    '06.00 – 07.00 WIB',
    'Registrasi ulang 36 kontingen (18 SD & 18 SMP), pembagian ID card/snack peserta & karcis parkir, pengarahan langsung ke ruang kelas basecamp oleh LO pendamping.',
    'Divisi Acara (Registrasi), Divisi LO & Humas, Divisi Keamanan'
  );
  addDataRow(
    '19.',
    '07.00 – 07.30 WIB',
    'Pengkondisian seluruh kontingen di Lapangan Minisoccer; Penyambutan & sarapan pagi 6 Dewan Juri (3 Juri SD + 3 Juri SMP) di Ruang Transit VIP.',
    'Divisi Acara, Divisi LO & Humas, Divisi Juri & Penilaian, Divisi Konsumsi'
  );
  addDataRow(
    '20.',
    '07.30 – 08.15 WIB',
    'Upacara Pembukaan LBB Mu\'allimin Tahun 2027 secara resmi oleh Pimpinan Madrasah di Lapangan Minisoccer.',
    'Divisi Acara, Protokoler'
  );
  addDataRow(
    '21.',
    '08.15 – 08.30 WIB',
    'Mobilisasi serentak menuju arena lomba:\n• 18 Peleton SD/MI & 3 Dewan Juri SD bergerak ke Arena 1 (Lap. Basket).\n• 18 Peleton SMP/MTs & 3 Dewan Juri SMP bergerak ke Arena 2 (Pelataran Embung).\n• Distribusi air mineral gelas peserta (36 dus).',
    'Divisi Acara, Divisi Teknis Lapangan, Divisi LO, Divisi Konsumsi'
  );
  addDataRow(
    '22.',
    '08.30 – 11.30 WIB',
    'Pelaksanaan Perlombaan Sesi I (2 Arena Paralel):\n• Arena 1 (Lap. Basket): Tampil nomor undian SD-01 s.d. SD-12 (dinilai 3 Juri SD: TNI, Polri, PPI).\n• Arena 2 (Pelataran Embung): Tampil nomor undian SMP-01 s.d. SMP-12 (dinilai 3 Juri SMP: TNI, Polri, PPI).\n• Pemantauan medis siaga, pengamanan ring arena, dokumentasi, dan input nilai real-time.',
    'Divisi Acara, Teknis Lapangan, Divisi Juri, LO & Humas, Keamanan, Medis, DDD',
    55
  );
  addDataRow(
    '23.',
    '11.30 – 12.30 WIB',
    'Ishoma: Sholat Dhuhur berjamaah di Masjid Hajah Yuliana; Distribusi makan siang untuk 6 juri (kotak VIP), 100 panitia, dan tamu undangan; Pengisian air galon panitia.',
    'Divisi Konsumsi, Seluruh Panitia'
  );
  addDataRow(
    '24.',
    '12.30 – 14.00 WIB',
    'Pelaksanaan Perlombaan Sesi II (2 Arena Paralel):\n• Arena 1 (Lap. Basket): Tampil nomor undian SD-13 s.d. SD-18 (6 peleton terakhir SD).\n• Arena 2 (Pelataran Embung): Tampil nomor undian SMP-13 s.d. SMP-18 (6 peleton terakhir SMP).\n• Input nilai real-time & verifikasi skor akhir.',
    'Divisi Acara, Teknis Lapangan, Divisi Juri, LO & Humas, Keamanan, Medis, DDD',
    50
  );
  addDataRow(
    '25.',
    '14.00 – 15.00 WIB',
    'Sidang Pleno Dewan Juri & Rekapitulasi Nilai Akhir di Ruang Steril Gedung Perpustakaan ASM (penentuan Juara 1, 2, 3, Harapan 1, 2, 3, dan Danton Terbaik SD & SMP); Pembagian snack sore panitia & tamu.',
    'Divisi Juri & Penilaian, Divisi Acara, Divisi Konsumsi'
  );
  addDataRow(
    '26.',
    '15.00 – 15.30 WIB',
    'Upacara Penutupan LBB Mu\'allimin Tahun 2027 di Lapangan Minisoccer; Pengkondisian seluruh kontingen.',
    'Divisi Acara, Protokoler, Divisi Keamanan'
  );
  addDataRow(
    '27.',
    '15.30 – 16.15 WIB',
    'Pengumuman Pemenang dan Prosesi Penganugerahan Hadiah (Trofi Bergilir, Trofi Tetap, Piagam, dan Uang Pembinaan total Rp 9.600.000); Penyerahan cinderamata & honorarium 6 dewan juri.',
    'Divisi Acara, Divisi Penghargaan & Medis, Bendahara'
  );
  addDataRow(
    '28.',
    '16.15 – selesai',
    'Pembubaran kepulangan kontingen secara tertib; Operasi semut kebersihan seluruh area kampus; Inventarisasi & pengembalian logistik.',
    'Seluruh Panitia, Divisi Perlengkapan, Divisi Keamanan, Divisi Konsumsi'
  );

  // --- VI. PASCA-LOMBA ---
  addSection('F. Tahap Pasca-Pelaksanaan (Januari – Februari 2027)');
  addDataRow(
    '29.',
    '25 – 31 Januari 2027',
    'Pengembalian seluruh barang sewa/pinjaman (HT, tenda, sound system); Rapat Evaluasi Akbar Panitia Pelaksana; Produksi dan publikasi video After Movie LBB Mu\'allimin 2027.',
    'Ketua Pelaksana, Panitia Inti, Divisi Perlengkapan, Divisi DDD'
  );
  addDataRow(
    '30.',
    '1 – 20 Februari 2027',
    'Penyusunan dokumen Laporan Pertanggungjawaban (LPJ) Keuangan & Kegiatan (audit realisasi sponsorship, pendaftaran 36 peleton, 20 tenant, dan penggunaan biaya tak terduga).',
    'Sekretaris, Bendahara, Divisi Dana & Kemitraan, Ketua Pelaksana'
  );
  addDataRow(
    '31.',
    '22 – 28 Februari 2027',
    'Penyerahan dokumen LPJ Final (cetak 5 bundel resmi) kepada Pihak Madrasah Mu\'allimin Yogyakarta; Pembubaran resmi kepanitiaan.',
    'Ketua Pelaksana, Sekretaris, Bendahara'
  );

  await wb.xlsx.writeFile('TIMELINE PANITIA LBB.xlsx');
  console.log('Successfully updated TIMELINE PANITIA LBB.xlsx');
}

async function updateJadwalLBB() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Jadwal_LBB_Muallimin_2027', {
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 }
  });

  ws.columns = [
    { key: 'no', width: 6 },
    { key: 'waktu', width: 28 },
    { key: 'tahap', width: 16 },
    { key: 'kegiatan', width: 85 },
    { key: 'luaran', width: 32 },
    { key: 'pic', width: 30 }
  ];

  const headerFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1F4E79' }
  };

  const headerFont = {
    name: 'Segoe UI',
    size: 11,
    bold: true,
    color: { argb: 'FFFFFFFF' }
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

  const headerRow = ws.addRow(['No', 'Waktu / Periode', 'Tahap', 'Kegiatan Utama & Rincian Tugas', 'Target Luaran (Deliverable)', 'Penanggung Jawab (PIC)']);
  headerRow.height = 26;
  headerRow.eachCell(cell => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = borderAll;
  });

  const rowsData = [
    [1, '1 - 7 September 2026', 'Perencanaan', 'Pembentukan struktur inti panitia & penentuan tema "Semangat Sebagai Ksatria, Berjuang Dengan Gembira!"', 'SK Panitia & Draf Konsep Acara', 'Tim Formatur & Ketua Pelaksana'],
    [2, '8 - 14 September 2026', 'Perencanaan', 'Perumusan materi lomba (Juklak/Juknis awal) mengacu Perpang TNI 57 & 58', 'Draf Juklak & Juknis PBB', 'Divisi Acara & Divisi Juri'],
    [3, '15 - 21 September 2026', 'Perencanaan', 'Penyusunan draf proposal & RAB terpadu (target Rp 64.622.250)', 'Draf Proposal & Master RAB', 'Sekretaris & Bendahara'],
    [4, '22 - 30 September 2026', 'Perencanaan', 'Audiensi Pimpinan Madrasah (dana subsidi Rp 15 jt) & izin fasilitas Kampus Terpadu Sedayu', 'Surat Izin & SK Subsidi', 'Ketua Pelaksana & Sekretaris'],
    [5, '1 - 4 Oktober 2026', 'Perencanaan', 'Survei teknis 2 venue (Basket: SD, Embung: SMP) & penyusunan desain materi publikasi', 'Denah 2 Venue & E-Flyer', 'Divisi Lapangan & Divisi DDD'],
    [6, '5 - 18 Oktober 2026', 'Pendaftaran', 'Pendaftaran Gelombang 1 (SD/MI & SMP/MTs) & pembagian proposal sponsor tahap 1', 'Formulir Masuk & Draf Sponsor', 'Divisi Acara, LO & Divisi Dana'],
    [7, '19 Okt - 1 Nov 2026', 'Pendaftaran', 'Pendaftaran Gelombang 2 rekap kuota 36 peleton (18 SD & 18 SMP) + 20 tenant UMKM', 'Database 36 Peleton & 20 Tenant', 'Divisi Acara, LO & Divisi Dana'],
    [8, '2 - 6 November 2026', 'Persiapan Teknis', 'Konfirmasi ketersediaan 6 Dewan Juri (3 Juri SD & 3 Juri SMP: TNI, POLRI, PPI) & lembar nilai', 'Surat Tugas & Draf Blangko Nilai', 'Divisi Juri & Sekretaris'],
    [9, 'Sabtu, 7 November 2026', 'Milestone (TM Juri)', 'Technical Meeting & Penyelarasan Persepsi 6 Dewan Juri (TM Juri): standardisasi Perpang TNI & pembagian kamar', 'Berita Acara TM Juri & Rubrik Nilai', 'Panitia Inti, Divisi Acara & Juri'],
    [10, '10 - 30 November 2026', 'Persiapan Teknis', 'Pencairan dana sponsor tahap awal & pemesanan seragam panitia (100 kaos, lanyard, topi)', 'Kuitansi Sponsor & PO Vendor', 'Divisi Dana, Bendahara & DDD'],
    [11, '1 - 20 Desember 2026', 'Persiapan Teknis', 'Pemesanan trofi bergilir/tetap SD & SMP (14 unit), 18 papan juara, & surat tim medis Dinkes/DENBEKANG', 'Invoice Trofi & Surat Balasan Medis', 'Divisi Hadiah, Medis & Sekretaris'],
    [12, '21 - 31 Desember 2026', 'Persiapan Teknis', 'Simulasi sistem software komputasi input nilai real-time 2 arena & finalisasi sewa alat (HT, tenda, sound)', 'Software Rekap Nilai & MoU Vendor', 'Divisi Juri & Divisi Perlengkapan'],
    [13, '2 - 9 Januari 2027', 'Pra-Acara', 'Pencetakan blangko juri, ID card panitia/official, penyiapan undian 1-18 SD & SMP, denah basecamp', 'Paket Cetakan & Peta Basecamp', 'Divisi DDD, Perlengkapan & Acara'],
    [14, '10 Januari 2027', 'Milestone (TM Peserta)', 'Technical Meeting Peserta (TM Peserta): Pengundian nomor urut (18 SD & 18 SMP) & sosialisasi tatib', 'Nomor Undian & Berita Acara TM', 'Divisi Acara, LO & Tim Lapangan'],
    [15, '11 - 16 Januari 2027', 'Pra-Acara', 'Briefing mendalam 36 LO kontingen & penjadwalan slot waktu familiarisasi arena', 'Jadwal Slot Uji Coba & Lembar LO', 'Koordinator LO & Divisi Lapangan'],
    [16, '17 Januari 2027', 'Milestone (Uji Coba)', 'Uji Coba Lapangan 36 Peleton: Lap. Basket (18 Peleton SD) & Pelataran Embung (18 Peleton SMP)', 'Evaluasi Akustik & Catatan Arena', 'Divisi Lapangan, Acara & LO'],
    [17, '18 - 22 Januari 2027', 'Pra-Acara', 'Pengambilan alat sewaan (70 HT, 3 tenda juri, sound system), belanja P3K & distribusi seragam panitia', 'Inventaris Logistik Siap Pakai', 'Divisi Perlengkapan, Medis, Konsumsi'],
    [18, 'Jumat, 23 Januari 2027', 'Milestone (Gladi H-1)', 'H-1: Loading barang, pasang tenda/garis lapangan 2 arena, gladi kotor alur kontingen & gladi bersih upacara', 'Kesiapan Venue 100%', 'Seluruh Panitia Pelaksana'],
    [19, '24 Jan 2027 (06.00 - 07.00)', 'Hari-H', 'Daftar ulang 36 kontingen, pembagian ID card/snack peserta & pengarahan ke basecamp ruang kelas', '36 Peleton Hadir Terdata', 'Divisi Acara Registrasi & LO'],
    [20, '24 Jan 2027 (07.00 - 07.30)', 'Hari-H', 'Pengkondisian peserta ke Lap. Minisoccer & sarapan pagi 6 dewan juri di ruang transit VIP', 'Peserta Berbaris Rapi', 'Divisi Lapangan & Divisi Konsumsi'],
    [21, '24 Jan 2027 (07.30 - 08.15)', 'Hari-H', 'Upacara Pembukaan LBB Mu\'allimin 2027 oleh Pimpinan Madrasah di Lap. Minisoccer', 'Acara Resmi Dibuka', 'Divisi Acara & Protokoler'],
    [22, '24 Jan 2027 (08.15 - 08.30)', 'Hari-H', 'Mobilisasi kontingen & juri ke 2 arena (Lap. Basket: 18 SD; Pelataran Embung: 18 SMP)', '2 Arena Siap Mulai', 'Divisi Keamanan, Lapangan & LO'],
    [23, '24 Jan 2027 (08.30 - 11.30)', 'Hari-H', 'Pelaksanaan Lomba Sesi I di 2 arena paralel (SD-01 s.d. SD-12 di Basket & SMP-01 s.d. SMP-12 di Embung)', 'Nilai Sesi I Terinput Real-time', 'Divisi Acara, Lapangan & Juri'],
    [24, '24 Jan 2027 (11.30 - 12.30)', 'Hari-H', 'Ishoma (Sholat Dhuhur di Masjid Hajah Yuliana & distribusi makan siang 6 juri, 100 panitia, tamu)', 'Kondusif & Tepat Waktu', 'Divisi Konsumsi & Seluruh Panitia'],
    [25, '24 Jan 2027 (12.30 - 14.00)', 'Hari-H', 'Pelaksanaan Lomba Sesi II di 2 arena paralel (SD-13 s.d. SD-18 di Basket & SMP-13 s.d. SMP-18 di Embung)', 'Seluruh 36 Peleton Selesai Tampil', 'Divisi Acara, Lapangan & Juri'],
    [26, '24 Jan 2027 (14.00 - 15.00)', 'Hari-H', 'Sidang pleno 6 dewan juri penentuan juara SD & SMP di Perpus ASM & penyiapan piala/hadiah', 'SK Penetapan Juara Sah', 'Divisi Juri & Penghargaan'],
    [27, '24 Jan 2027 (15.00 - 15.30)', 'Hari-H', 'Upacara Penutupan LBB Mu\'allimin 2027 di Lapangan Minisoccer', 'Acara Resmi Ditutup', 'Divisi Acara & Protokoler'],
    [28, '24 Jan 2027 (15.30 - 16.15)', 'Hari-H', 'Pengumuman pemenang, penyerahan piala dan uang pembinaan total Rp 9.600.000, serta honor 6 juri', 'Trofi & Hadiah Terdistribusi', 'Divisi Acara, Penghargaan & Bendahara'],
    [29, '24 Jan 2027 (16.15 - selesai)', 'Hari-H', 'Pemulangan peserta secara tertib, penarikan HT/alat sewa, operasi semut kebersihan kampus', 'Venue Bersih Kembali', 'Divisi Perlengkapan & Keamanan'],
    [30, '25 - 31 Januari 2027', 'Pasca-Acara', 'Pengembalian alat sewa/pinjaman, rapat evaluasi akbar panitia & rilis after-movie', 'BA Serah Terima & Video Rilis', 'Divisi Perlengkapan & Divisi DDD'],
    [31, '1 - 20 Februari 2027', 'Pasca-Acara', 'Penyusunan draf Laporan Pertanggungjawaban (LPJ) administrasi keuangan & kegiatan', 'Draf LPJ Lengkap Terverifikasi', 'Sekretaris & Bendahara'],
    [32, '22 - 28 Februari 2027', 'Pasca-Acara', 'Penyerahan resmi LPJ cetak (5 bundel) ke Direksi Madrasah Mu\'allimin & pembubaran panitia', 'LPJ Disetujui & Selesai', 'Ketua Pelaksana & Sekretaris']
  ];

  rowsData.forEach(rowArr => {
    const row = ws.addRow(rowArr);
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(4).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    row.getCell(5).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    row.getCell(6).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

    row.eachCell(cell => {
      cell.font = textFont;
      cell.border = borderAll;
    });
  });

  await wb.xlsx.writeFile('Jadwal_LBB_Muallimin_2027.xlsx');
  console.log('Successfully updated Jadwal_LBB_Muallimin_2027.xlsx');
}

async function run() {
  await updateTimelinePanitia();
  await updateJadwalLBB();
}

run().catch(console.error);
