/**
 * src/data/juknisDocsData.js
 * Dokumen Resmi Terpisah: 
 * 1. PETUNJUK TEKNIS PENILAIAN & KEJUARAAN (Bab A s.d. D Verbatim)
 * 2. PETUNJUK TEKNIS PENDAFTARAN (Bab A s.d. B Verbatim)
 * Single Source of Truth untuk modul tampilan Juknis & Regulasi
 */

export const JUKNIS_PENILAIAN_CHAPTERS = [
  {
    id: 'bab-a',
    letter: 'A',
    title: 'SISTEM PENILAIAN, SANGGAH, DAN PENENTUAN JUARA',
    points: [
      {
        number: 1,
        title: 'Mekanisme dan Aspek Penilaian Dewan Juri',
        content: `Penilaian dilakukan secara objektif oleh Dewan Juri yang berjumlah 6 orang (unsur TNI, POLRI, dan PPI: 3 Juri bertugas di Arena 1 SD/MI dan 3 Juri bertugas di Arena 2 SMP/MTs). Keputusan Dewan Juri mengenai mutu gerak bersifat mutlak dan tidak dapat diganggu gugat.`
      },
      {
        number: 2,
        title: 'Kriteria Penilaian Peleton dan Komandan',
        content: `Rincian formula dan skala penilaian Dewan Juri:`,
        subItems: [
          `Penilaian Peleton: Perbandingan penilaian peleton adalah 1:1, yaitu Kebenaran Teknik (1) dan Kekompakan (1). Masing-masing aspek memiliki rentang nilai 50 s.d. 90 poin.`,
          `Nilai Murni Peleton: Total Nilai Kebenaran Teknik + Total Nilai Kekompakan.`,
          `Nilai Akhir Peleton: (Nilai Murni Peleton) – (Total Akumulasi Poin Penalti Peleton).`,
          `Nilai Murni Komandan: (Penguasaan Materi × 35%) + (Kualitas Suara/Vokal × 25%) + (Sikap dan Pelaporan × 20%) + (Penguasaan Lapangan × 20%).`,
          `Nilai Akhir Komandan: (Nilai Murni Komandan) – (Total Akumulasi Poin Penalti Komandan).`
        ]
      },
      {
        number: 3,
        title: 'Kriteria Penentuan Juara Peleton',
        content: `Penentuan Juara Peleton didasarkan pada Nilai Akhir Peleton dengan perolehan skor tertinggi. Apabila terdapat kesamaan Nilai Akhir Peleton, penentuan peringkat kejuaraan dilakukan berdasarkan urutan prioritas sebagai berikut:`,
        subItems: [
          `(a) Nilai tertinggi pada aspek Kebenaran Teknik;`,
          `(b) Nilai tertinggi pada aspek Kekompakan;`,
          `(c) Akumulasi poin penalti paling sedikit; dan`,
          `(d) Hasil musyawarah serta pertimbangan Dewan Juri dalam Sidang Pleno Juri yang keputusannya bersifat final dan mengikat.`
        ]
      },
      {
        number: 4,
        title: 'Kriteria Penentuan Juara Komandan Peleton',
        content: `Penentuan Juara Komandan Peleton didasarkan pada Nilai Akhir Komandan dengan perolehan skor tertinggi dari seluruh aspek penilaian. Apabila terdapat kesamaan Nilai Akhir Komandan, penentuan peringkat kejuaraan dilakukan berdasarkan urutan prioritas sebagai berikut:`,
        subItems: [
          `(a) Nilai tertinggi pada aspek Penguasaan Materi Lomba;`,
          `(b) Nilai tertinggi pada aspek Kualitas Suara/Vokal;`,
          `(c) Nilai tertinggi pada aspek Sikap & Pelaporan; dan`,
          `(d) Hasil musyawarah dan pertimbangan Dewan Juri dalam Sidang Pleno Juri yang keputusannya bersifat final serta mengikat.`
        ]
      },
      {
        number: 5,
        title: 'Sistem Perolehan Poin Juara Umum',
        content: `Juara Umum ditetapkan secara terpisah untuk masing-masing tingkatan, yaitu SD/MI dan SMP/MTs. Penetapan Juara Umum didasarkan pada akumulasi prestasi seluruh perwakilan yang berasal dari sekolah yang sama, meliputi capaian Juara Peleton dan Juara Komandan. Poin kejuaraan diberikan dengan ketentuan:`,
        pointCards: [
          { label: 'Juara 1 Peleton', score: '6 Poin', type: 'peleton' },
          { label: 'Juara 2 Peleton', score: '5 Poin', type: 'peleton' },
          { label: 'Juara 3 Peleton', score: '4 Poin', type: 'peleton' },
          { label: 'Juara Harapan 1', score: '3 Poin', type: 'peleton' },
          { label: 'Juara Harapan 2', score: '2 Poin', type: 'peleton' },
          { label: 'Juara Harapan 3', score: '1 Poin', type: 'peleton' },
          { label: 'Juara 1 Komandan Terbaik', score: '3 Poin', type: 'danton' },
          { label: 'Juara 2 Komandan Terbaik', score: '2 Poin', type: 'danton' },
          { label: 'Juara 3 Komandan Terbaik', score: '1 Poin', type: 'danton' },
        ],
        extraText: `Seluruh poin yang diperoleh oleh peleton dan komandan dari sekolah yang sama dijumlahkan sebagai akumulasi poin sekolah. Sekolah dengan total poin tertinggi ditetapkan sebagai Juara Umum pada tingkatannya.`
      },
      {
        number: 6,
        title: 'Definisi Nilai Murni Peleton / Komandan',
        content: `Nilai yang diperoleh Peleton/Komandan berdasarkan hasil penilaian Dewan Juri sebelum dikurangi seluruh penalti atau pengurangan nilai yang dikenakan berdasarkan ketentuan Juknis.`
      },
      {
        number: 7,
        title: 'Kriteria Penyelesaian Kesamaan Poin Juara Umum (Tie-Breaker)',
        content: `Apabila terdapat dua atau lebih sekolah yang memperoleh total poin Juara Umum yang sama, penentuan peringkat dilakukan berdasarkan urutan prioritas sebagai berikut:`,
        subItems: [
          `a. Peringkat Tertinggi Peleton: Dibandingkan berdasarkan peringkat tertinggi yang berhasil diraih oleh peleton masing-masing sekolah. Peringkat yang lebih tinggi memiliki prioritas lebih besar (contoh: sekolah dengan capaian Juara 1 Peleton lebih diprioritaskan dibandingkan sekolah dengan capaian Juara 2 Peleton).`,
          `b. Nilai Murni Peleton: Apabila peringkat tertinggi Peleton yang diraih oleh sekolah-sekolah tersebut masih sama, penentuan dilanjutkan berdasarkan nilai murni tertinggi dari peleton yang memiliki peringkat tertinggi tersebut.`,
          `c. Nilai Kebenaran Teknik Gerakan PBB: Apabila nilai murni Peleton masih sama, penentuan dilanjutkan berdasarkan nilai murni tertinggi pada aspek Kebenaran Teknik Gerakan PBB dari peleton yang dibandingkan.`,
          `d. Capaian Peleton Berikutnya: Apabila seluruh kriteria pada peleton dengan peringkat tertinggi masih menghasilkan nilai yang sama, perbandingan dilanjutkan pada capaian peleton berikutnya secara berurutan berdasarkan peringkat yang diraih.`,
          `e. Capaian Komandan Terbaik: Apabila seluruh capaian Peleton masih menghasilkan nilai yang sama, penentuan dilanjutkan berdasarkan peringkat Komandan Terbaik yang diraih oleh masing-masing sekolah.`,
          `f. Sidang Pleno Juri: Apabila seluruh kriteria tersebut di atas masih menghasilkan kedudukan yang sama, penentuan akhir dilakukan melalui musyawarah Dewan Juri dalam Sidang Pleno Juri.`,
          `g. Keputusan Akhir: Keputusan Dewan Juri dalam Sidang Pleno Juri bersifat mutlak dan tidak dapat diganggu gugat.`
        ]
      },
      {
        number: 8,
        title: 'Transparansi Nilai (Akses e-Rekapitulasi Berbasis Akun Gmail Peleton)',
        content: `Sebagai wujud integritas dan transparansi modern, publikasi rekapitulasi nilai peleton menerapkan sistem rilis bertahap (rolling release) tanpa harus menunggu seluruh peserta selesai tampil. Rincian perolehan nilai masing-masing peleton akan dirilis dan dapat diakses pada portal resmi https://lbb.tontimuallimin.com dengan estimasi waktu ±1 (satu) jam setelah peleton yang bersangkutan menyelesaikan penampilan di arena perlombaan. Official peleton dapat melihat lembar rekapitulasi nilai lengkap secara privat dan mandiri dengan login menggunakan akun Gmail masing-masing yang telah didaftarkan saat registrasi.`
      },
      {
        number: 9,
        title: 'Mekanisme Pengajuan Sanggah (Protes Resmi)',
        content: `Ketentuan dan prosedur resmi pengajuan sanggahan:`,
        subItems: [
          `a. Batasan Sanggah: Pengajuan sanggah hanya dapat dilakukan terhadap dugaan kesalahan administratif atau teknis sistem penghitungan nilai (seperti kesalahan penjumlahan nilai, ketidaksesuaian input nilai dari lembar penilaian juri ke dalam sistem, atau kekeliruan pencatatan penalti). Hasil penilaian juri mengenai mutu gerak bersifat mutlak dan tidak dapat diganggu gugat.`,
          `b. Batas Waktu Pengajuan: Pengajuan sanggah dapat dilakukan sejak nilai peleton dirilis di portal resmi, dan seluruh masa sanggah resmi ditutup secara serentak pada pukul 15.00 WIB pada hari pelaksanaan perlombaan. Pengajuan sanggah yang melewati batas waktu tersebut tidak akan diterima atau diproses oleh Panitia.`,
          `c. Prosedur Sanggah: Sanggahan diajukan secara tertulis menggunakan Formulir Sanggahan Resmi oleh 1 (satu) orang Official resmi yang terdaftar, bertempat di Ruang Informasi Resmi Panitia (Ruang Registrasi Gedung Madrasah Lantai 1). Formulir sanggahan wajib memuat alasan yang jelas dan dapat disertai bukti pendukung (seperti rekaman video, foto, atau catatan resmi). Panitia tidak melayani pengajuan sanggah secara lisan atau di luar prosedur yang telah ditentukan.`,
          `d. Keputusan Sanggah: Apabila sanggahan dinyatakan diterima dan terbukti terdapat kekeliruan administratif, Panitia akan menerbitkan Pemberitahuan Koreksi Hasil Resmi yang ditandatangani oleh Ketua Pelaksana dan Dewan Juri. Keputusan Panitia dan Dewan Juri atas sanggahan bersifat final dan mengikat.`
        ]
      },
      {
        number: 10,
        title: 'Ketentuan Pasca-Lomba dan Prosedur Checkout Basecamp',
        content: `Ketentuan dan alur pengosongan ruang basecamp:`,
        subItems: [
          `a. Batas Waktu Maksimal Pengosongan: Seluruh peleton wajib menyelesaikan proses checkout dan mengosongkan ruang kelas basecamp selambat-lambatnya pukul 15.00 WIB (1 jam sebelum Upacara Penutupan dimulai).`,
          `b. Alur 4 Langkah Checkout Resmi: (1) Merapikan kembali susunan meja-kursi dan memastikan tidak ada barang peleton tertinggal; (2) Membawa dan menyerahkan 2 (dua) kantong sampah terpilah (Organik & Non-Organik) ke Pos/Area Checkout Panitia; (3) Pemeriksaan langsung kebersihan dan keutuhan fasilitas ruangan kelas oleh LO/Panitia Kebersihan guna memperoleh Tanda Bukti Lolos Verifikasi Checkout; (4) Pengambilan kembali kartu identitas jaminan (KTP/SIM) di Ruang Informasi Panitia dengan menunjukkan Tanda Bukti Lolos Verifikasi.`,
          `c. Ketentuan Sanksi & Denda: Peleton yang meninggalkan basecamp dalam keadaan kotor/berantakan dikenai sanksi penalti -50 poin pada rekapitulasi nilai akhir. Apabila terjadi kerusakan fisik atau kehilangan fasilitas kelas, kartu jaminan KTP/SIM ditahan serta dikenakan sanksi ganti rugi penuh dan denda administratif Rp 500.000 sesuai Pasal 14 Tata Tertib Peserta.`
        ]
      }
    ]
  },
  {
    id: 'bab-b',
    letter: 'B',
    title: 'GANGGUAN SISTEM DIGITAL DAN PROSEDUR BACKUP',
    points: [
      {
        number: 1,
        title: 'Gangguan Sistem',
        content: `Apabila terjadi gangguan pada website, jaringan internet, akun, upload dokumen, penyimpanan nilai, atau sistem digital lainnya, Panitia dapat menerapkan prosedur manual sementara.`
      },
      {
        number: 2,
        title: 'Backup Manual',
        content: `Panitia wajib menyediakan formulir atau dokumen manual untuk pencatatan data peserta, administrasi, hasil penilaian, dan data penting lainnya sebagai cadangan.`
      },
      {
        number: 3,
        title: 'Gangguan Login dan Upload',
        content: `Apabila peserta mengalami kendala login atau gagal mengunggah dokumen karena gangguan sistem, Panitia memberikan alternatif verifikasi atau pengumpulan dokumen secara manual.`
      },
      {
        number: 4,
        title: 'Gangguan Penyimpanan Nilai',
        content: `Apabila nilai tidak tersimpan atau sistem penilaian mengalami gangguan, nilai dicatat secara manual oleh Juri atau Asisten Juri dan dikonfirmasi setelah sistem kembali normal.`
      },
      {
        number: 5,
        title: 'Pemulihan Data',
        content: `Setelah sistem kembali normal, data manual diverifikasi dan dimasukkan kembali ke sistem berdasarkan catatan resmi Panitia dan Juri.`
      },
      {
        number: 6,
        title: 'Keputusan Panitia',
        content: `Gangguan teknis sistem tidak dapat dijadikan dasar untuk menghilangkan atau mengubah nilai peserta. Setiap keputusan terkait penggunaan data backup ditetapkan oleh Panitia berdasarkan catatan resmi yang tersedia.`
      }
    ]
  },
  {
    id: 'bab-c',
    letter: 'C',
    title: 'KETENTUAN SANKSI DAN PENALTI PENGURANGAN NILAI',
    tableNote: `Pelanggaran terhadap regulasi teknis lapangan dikenakan sanksi pemotongan nilai secara kumulatif pada lembar rekapitulasi nilai akhir:`,
    closingNote: `Pencatatan Penalti: Seluruh sanksi pengurangan nilai dicatat secara langsung dan transparan oleh Hakim Garis, Timekeeper, dan Koordinator Lapangan ke dalam Berita Acara Pelanggaran Resmi serta disahkan oleh Perwakilan Dewan Juri.`
  },
  {
    id: 'bab-d',
    letter: 'D',
    title: 'PENUTUP',
    content: `Petunjuk Teknis Penilaian dan Kejuaraan ini menjadi acuan baku dan mengikat dalam proses evaluasi hasil, penetapan peringkat, dan penegakan keadilan kompetisi LBB Mu'allimin Tahun 2027. Seluruh ketentuan yang telah ditetapkan berlaku mutlak bagi seluruh kontingen peserta dan perangkat perlombaan.`
  }
];

export const JUKNIS_PENDAFTARAN_CHAPTERS = [
  {
    id: 'reg-a',
    letter: 'A',
    title: 'KETENTUAN UMUM DAN ALUR TEKNIS PENDAFTARAN',
    items: [
      {
        number: 1,
        title: 'Sistem dan Mekanisme Pendaftaran',
        sub: [
          `Pendaftaran administratif awal LBB Mu’allimin 2027 dilaksanakan secara daring melalui Portal Resmi Sistem Informasi LBB Mu’allimin pada laman https://lbb.tontimuallimin.com/ , dengan verifikasi dokumen fisik yang dilaksanakan pada saat Technical Meeting (TM).`,
          `Panitia tidak melayani pendaftaran manual secara luring/offline di tempat maupun pendaftaran susulan setelah kuota resmi terpenuhi.`,
          `Sistem pendaftaran menerapkan prinsip first-come, first-served, di mana tim yang menyelesaikan pengisian formulir, melengkapi berkas unggahan, dan memverifikasi setoran pembayaran terlebih dahulu yang berhak mengamankan slot kuota resmi.`
        ]
      },
      {
        number: 2,
        title: 'Alokasi Kuota Peserta',
        sub: [
          `Tingkat SD/MI Sederajat: Kuota maksimal 18 (delapan belas) peleton se-DIY.`,
          `Tingkat SMP/MTs Sederajat: Kuota maksimal 18 (delapan belas) peleton se-DIY.`,
          `Total Kuota Keseluruhan: Tepat 36 (tiga puluh enam) peleton.`,
          `Batasan Delegasi Sekolah: Setiap pangkalan sekolah diperkenankan mendaftarkan maksimal 2 (dua) peleton (Peleton A dan Peleton B).`
        ]
      },
      {
        number: 3,
        title: 'Linimasa (Timeline) Periode Pendaftaran',
        sub: [
          `Gelombang I (Early Bird): Dibuka pada hari Senin, 19 Oktober 2026 pukul 08.00 WIB dan ditutup pada hari Ahad, 8 November 2026 pukul 23.59 WIB.`,
          `Gelombang II (Reguler): Dibuka pada hari Senin, 9 November 2026 pukul 00.00 WIB dan ditutup pada hari Ahad, 29 November 2026 pukul 23.59 WIB, ATAU ditutup sewaktu-waktu secara otomatis oleh sistem apabila alokasi total 36 kuota peleton telah terpenuhi secara penuh.`
        ]
      },
      {
        number: 4,
        title: 'Biaya Pendaftaran dan Rekening Resmi',
        sub: [
          `Gelombang I: Rp350.108,- per peleton (biaya pokok pendaftaran Rp350.000,- ditambah kode unik sistem 108).`,
          `Gelombang II: Rp400.108,- per peleton (biaya pokok pendaftaran Rp400.000,- ditambah kode unik sistem 108).`,
          `Rekening Resmi Pembayaran: Bank Syariah Indonesia (BSI) | Nomor Rekening: 2600051817 | Atas Nama: Kepala Urusan Admisi, Humas, dan Kerja Sama.`,
          `Format Berita Transfer (Catatan Transaksi): NAMA SEKOLAH_JUMLAH PELETON (Contoh: SDN PERCOBAAN 2_1 PELETON atau SMPN 1 BANTUL_2 PELETON).`,
          `Uang pendaftaran yang telah disetorkan tidak dapat ditarik kembali (non-refundable) dengan alasan apa pun, kecuali pembatalan kegiatan secara sepihak oleh panitia.`
        ]
      },
      {
        number: 5,
        title: 'Tahapan dan Alur Pendaftaran Daring (Online)',
        sub: [
          `Langkah 1 (Pembuatan Akun): Kontingen mengakses laman https://lbb.tontimuallimin.com/ , membuat akun resmi perwakilan sekolah menggunakan alamat email aktif (disarankan akun Google/Gmail), serta melakukan konfirmasi aktivasi akun.`,
          `Langkah 2 (Pengisian Formulir Identitas): Mengisi form data pangkalan sekolah, identitas penanggung jawab/Official, data Komandan Peleton, serta jumlah kontingen yang didaftarkan.`,
          `Langkah 3 (Pembayaran dan Verifikasi Transaksi): Mentransfer biaya pendaftaran ke rekening resmi BSI sesuai nominal gelombang bersangkutan (wajib menyertakan kode unik 108), mengunggah bukti transfer sah (format JPG/PNG/PDF maks. 2 MB), lalu menunggu validasi bendahara maksimal 1 x 24 jam.`,
          `Langkah 4 (Pengisian Data Personel & Dokumen): Menginput nama lengkap 25 personel peleton (1 Danton, 21 Inti, 3 Cadangan) serta mengunggah pasfoto resmi masing-masing berlatar belakang merah (SD/MI) atau biru (SMP/MTs). Mengunggah pindaian (scan) Surat Tugas/Rekomendasi Kepala Sekolah berstempel basah.`,
          `Langkah 5 (Penerbitan Bukti Registrasi): Mengunduh Bukti Pendaftaran Resmi (dilengkapi QR Code Verifikasi) dan Surat Pakta Integritas baku dari sistem sebagai dokumen resmi kontingen.`
        ]
      },
      {
        number: 6,
        title: 'Persyaratan Dokumen Administrasi Digital (Unggahan Web)',
        sub: [
          `Scan Surat Rekomendasi/Tugas Resmi dari Kepala Sekolah yang mencantumkan daftar nama lengkap personel peleton (format PDF maks. 5 MB).`,
          `Pasfoto resmi berwarna terbaru ukuran 3x4 (pose tegap, seragam sekolah/tonti rapi, tanpa kacamata hitam, background merah untuk SD/MI dan biru untuk SMP/MTs, format JPG/PNG maks. 1 MB per foto) untuk seluruh personel peleton.`,
          `Bukti transfer asli biaya pendaftaran yang memuat tanggal, jam, nominal dengan kode unik, dan keterangan transaksi yang jelas (format JPG/PNG/PDF maks. 2 MB).`
        ]
      },
      {
        number: 7,
        title: 'Komposisi Personel dan Pendamping Peleton',
        sub: [
          `Komposisi Personel Peleton (Maksimal 25 Orang): 1 (satu) orang Komandan Peleton (Danton); 21 (dua puluh satu) orang Pasukan Inti (formasi 3 saf x 7 banjar); 3 (tiga) orang Anggota Cadangan Resmi.`,
          `Komposisi Pendamping Resmi (Maksimal 3 Orang): 1 (satu) orang Official Resmi (Pelatih/Pembina Pendamping); 2 (dua) orang Pendukung Resmi (masing-masing dapat difungsikan sebagai tim Medis dan tim Dokumentasi).`,
          `Total Maksimal Rombongan Resmi: 28 (dua puluh delapan) orang per peleton. Seluruh personel dan pendamping resmi wajib terdaftar dalam Surat Rekomendasi Kepala Sekolah.`
        ]
      },
      {
        number: 8,
        title: 'Ketentuan Penyerahan Berkas Fisik Asli pada Saat Technical Meeting (TM)',
        sub: [
          `Seluruh berkas fisik asli wajib diserahkan di Meja Registrasi TM pada hari Sabtu, 9 Januari 2027 pukul 12.30 – 13.00 WIB di Aula Kampus Induk Madrasah Mu’allimin (Jl. Letjen S. Parman No. 68, Wirobrajan, Yogyakarta).`,
          `Berkas Fisik yang Wajib Diserahkan: (1) 1 (satu) lembar Surat Tugas/Rekomendasi Asli bertandatangan Kepala Sekolah dan berstempel basah; (2) 1 (satu) lembar Surat Pakta Integritas bermaterai Rp10.000,- bertandatangan basah Official; (3) 1 (satu) lembar cetak Bukti Registrasi Daring ber-QR Code dari sistem.`,
          `Ketentuan Map Berkas: Seluruh berkas dimasukkan rapi dalam stopmap folio kertas: Warna MERAH untuk Tingkat SD/MI; Warna BIRU untuk Tingkat SMP/MTs; Bagian depan map ditulis identitas: NAMA SEKOLAH - JENJANG - PELETON (A/B) - NAMA OFFICIAL - NO. WHATSAPP.`
        ]
      },
      {
        number: 9,
        title: 'Sanksi Administratif dan Pembatalan Pendaftaran',
        sub: [
          `Tim yang terbukti memalsukan identitas siswa (misal: siswa bukan berasal dari sekolah bersangkutan atau bukan jenjang yang sesuai) didiskualifikasi secara permanen dari perlombaan.`,
          `Peleton yang tidak menyerahkan berkas fisik asli berstempel basah dan pakta integritas bermaterai hingga berakhirnya forum TM tidak berhak mengikuti pengundian nomor urut tampil (lotting) dan slotnya dapat dialihkan ke daftar tunggu (waiting list).`
        ]
      },
      {
        number: 10,
        title: 'Pusat Informasi dan Narahubung Pendaftaran',
        sub: [
          `Portal Layanan Terpadu: https://lbb.tontimuallimin.com/`,
          `WhatsApp Helpdesk Registrasi: 0819-4749-1505 (Admin Tonti Mu'allimin)`,
          `Surel (Email) Sekretariat: lbb@tontimuallimin.com`,
          `Instagram Resmi: @lbbmuin | @mualliminjogja | TikTok: @tontimuallimin`
        ]
      }
    ]
  },
  {
    id: 'reg-b',
    letter: 'B',
    title: 'PENUTUP',
    content: `Petunjuk Teknis Pendaftaran ini disusun sebagai pedoman baku dan mengikat dalam rangka menjamin tertib administrasi, kepastian hukum, transparansi, serta kelancaran operasional pendaftaran Lomba Baris-Berbaris Mu’allimin Tahun 2027.`
  }
];
