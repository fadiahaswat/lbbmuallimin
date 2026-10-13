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
    title: 'SISTEM PENILAIAN, SANGGAH & PENENTUAN JUARA',
    points: [
      {
        number: 1,
        title: 'Mekanisme dan Aspek Penilaian Dewan Juri',
        content: `Penilaian dilakukan secara objektif oleh 6 Dewan Juri (unsur TNI, POLRI, dan PPI: 3 Juri Arena 1 SD & 3 Juri Arena 2 SMP). Keputusan Dewan Juri mengenai mutu gerak bersifat mutlak dan tidak dapat diganggu gugat.`
      },
      {
        number: 2,
        title: 'Kriteria Penilaian',
        content: `Kriteria penilaian meliputi:`,
        subItems: [
          `Penilaian Peleton: Perbandingan penilaian peleton adalah 1:1, yaitu Kebenaran Teknik (1) dan Kekompakan (1). Masing-masing aspek memiliki rentang nilai 50 s.d. 90 poin.`,
          `Nilai Murni Peleton = Total Nilai Kebenaran Teknik + Total Nilai Kekompakan.`,
          `Nilai Akhir Peleton = (Nilai Murni Peleton) – (Total Akumulasi Poin Penalti Peleton).`,
          `Nilai Murni Komandan = (Penguasaan Materi × 35%) + (Kualitas Suara/Vokal × 25%) + (Sikap dan Pelaporan × 20%) + (Penguasaan Lapangan × 20%).`,
          `Nilai Akhir Komandan = (Nilai Murni Komandan) – (Total Akumulasi Poin Penalti Komandan).`
        ]
      },
      {
        number: 3,
        title: 'Kriteria Penentuan Juara Peleton',
        content: `Penentuan Juara Peleton didasarkan pada Nilai Akhir Peleton dengan perolehan skor tertinggi. Apabila terdapat kesamaan Nilai Akhir Peleton, penentuan peringkat kejuaraan dilakukan berdasarkan urutan prioritas sebagai berikut:`,
        subItems: [
          `a. Nilai tertinggi pada aspek Kebenaran Teknik;`,
          `b. Nilai tertinggi pada aspek Kekompakan;`,
          `c. Akumulasi poin penalti paling sedikit; dan`,
          `d. Hasil musyawarah serta pertimbangan Dewan Juri dalam Sidang Pleno Juri yang keputusannya bersifat final dan mengikat.`
        ]
      },
      {
        number: 4,
        title: 'Kriteria Penentuan Juara Komandan',
        content: `Penentuan Juara Komandan Peleton didasarkan pada Nilai Akhir Komandan dengan perolehan skor tertinggi dari seluruh aspek penilaian. Apabila terdapat kesamaan Nilai Akhir Komandan, penentuan peringkat kejuaraan dilakukan berdasarkan urutan prioritas sebagai berikut:`,
        subItems: [
          `a. Nilai tertinggi pada aspek Penguasaan Materi Lomba;`,
          `b. Nilai tertinggi pada aspek Kualitas Suara/Vokal;`,
          `c. Nilai tertinggi pada aspek Sikap & Pelaporan; dan`,
          `d. Hasil musyawarah dan pertimbangan Dewan Juri dalam Sidang Pleno Juri yang keputusannya bersifat final serta mengikat.`
        ]
      },
      {
        number: 5,
        title: 'Sistem Perolehan Poin Juara Umum',
        content: `Juara Umum ditetapkan secara terpisah untuk masing-masing tingkatan, yaitu SD/MI dan SMP/MTs. Penetapan Juara Umum didasarkan pada akumulasi prestasi seluruh perwakilan yang berasal dari sekolah yang sama, meliputi capaian Juara Peleton dan Juara Komandan. Poin kejuaraan diberikan dengan ketentuan sebagai berikut:`,
        pointCards: [
          { label: 'Juara 1 Peleton', score: '6 Poin', type: 'peleton' },
          { label: 'Juara 2 Peleton', score: '5 Poin', type: 'peleton' },
          { label: 'Juara 3 Peleton', score: '4 Poin', type: 'peleton' },
          { label: 'Juara Harapan 1 Peleton', score: '3 Poin', type: 'peleton' },
          { label: 'Juara Harapan 2 Peleton', score: '2 Poin', type: 'peleton' },
          { label: 'Juara Harapan 3 Peleton', score: '1 Poin', type: 'peleton' },
          { label: 'Juara 1 Komandan Terbaik', score: '3 Poin', type: 'danton' },
          { label: 'Juara 2 Komandan Terbaik', score: '2 Poin', type: 'danton' },
          { label: 'Juara 3 Komandan Terbaik', score: '1 Poin', type: 'danton' },
        ],
        extraText: `Seluruh poin yang diperoleh oleh peleton dan komandan dari sekolah yang sama dijumlahkan sebagai akumulasi poin sekolah. Sekolah dengan total poin tertinggi ditetapkan sebagai Juara Umum pada tingkatannya.`
      },
      {
        number: 6,
        title: 'Definisi Nilai Murni Peleton/Komandan',
        content: `Nilai Murni Peleton/Komandan adalah nilai yang diperoleh Peleton/Komandan berdasarkan hasil penilaian Dewan Juri sebelum dikurangi seluruh penalti atau pengurangan nilai yang dikenakan berdasarkan ketentuan Juknis Lapangan.`
      },
      {
        number: 7,
        title: 'Tie-Breaker Juara Umum',
        content: `Apabila terdapat dua atau lebih sekolah yang memperoleh total poin Juara Umum yang sama, penentuan peringkat dilakukan berdasarkan urutan prioritas sebagai berikut:`,
        subItems: [
          `a. Peringkat Tertinggi Peleton: Dibandingkan berdasarkan peringkat tertinggi yang berhasil diraih oleh peleton masing-masing sekolah. Peringkat yang lebih tinggi memiliki prioritas lebih besar. Contoh, Juara 1 Peleton lebih diprioritaskan daripada Juara 2 Peleton.`,
          `b. Nilai Murni Peleton: Apabila peringkat tertinggi Peleton yang diraih masih sama, penentuan dilanjutkan berdasarkan nilai murni tertinggi dari peleton yang memiliki peringkat tertinggi tersebut.`,
          `c. Nilai Kebenaran Teknik Gerakan PBB: Apabila nilai murni Peleton masih sama, penentuan dilanjutkan berdasarkan nilai murni tertinggi pada aspek Kebenaran Teknik Gerakan PBB dari peleton yang dibandingkan.`,
          `d. Capaian Peleton Berikutnya: Apabila seluruh kriteria pada peleton dengan peringkat tertinggi masih sama, perbandingan dilanjutkan pada capaian peleton berikutnya secara berurutan berdasarkan peringkat yang diraih.`,
          `e. Capaian Komandan Terbaik: Apabila seluruh capaian Peleton masih menghasilkan nilai yang sama, penentuan dilanjutkan berdasarkan peringkat Komandan Terbaik yang diraih oleh masing-masing sekolah.`,
          `f. Sidang Pleno Juri: Apabila seluruh kriteria tersebut masih menghasilkan kedudukan yang sama, penentuan akhir dilakukan melalui musyawarah Dewan Juri dalam Sidang Pleno Juri.`,
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
        content: `Ketentuan resmi pengajuan sanggahan:`,
        subItems: [
          `a. Batasan Sanggah: Protes HANYA diterima untuk dugaan kekeliruan administratif non-penilaian (kesalahan penjumlahan skor, keliru input sistem dari lembar juri, atau ketidaksesuaian catatan penalti). Penilaian kualitatif juri mengenai mutu gerakan tidak dapat disanggah.`,
          `b. Batas Waktu Pengajuan: Pengajuan sanggah dapat dilakukan sejak nilai peleton dirilis di portal, dan seluruh masa sanggah resmi DITUTUP SERENTAK pukul 15.00 WIB. Penetapan hasil pasca-sanggah bersifat final dan mengikat sebelum Upacara Penutupan pukul 16.00 WIB.`,
          `c. Prosedur Sanggah: Diajukan secara TERTULIS menggunakan Formulir Sanggahan Resmi oleh 1 (satu) orang Official resmi terdaftar di Ruang Informasi Resmi Panitia (Ruang Registrasi Gedung Madrasah Lantai 1) dengan melampirkan bukti valid (video/foto/catatan). Panitia TIDAK melayani protes secara lisan.`,
          `d. Keputusan Sanggah: Jika protes diterima dan sah, Panitia menerbitkan 'Pemberitahuan Koreksi Hasil Resmi' yang menjadi dasar ketetapan kejuaraan.`
        ]
      }
    ]
  },
  {
    id: 'bab-b',
    letter: 'B',
    title: 'PROSEDUR BACKUP DAN MITIGASI GANGGUAN SISTEM E-PENILAIAN',
    points: [
      {
        number: 1,
        title: 'Penerapan Prosedur Backup Manual',
        content: `Apabila terjadi gangguan pada sistem digital e-penilaian yang digunakan dalam LBB Mu’allimin 2027 (sistem input nilai juri, kalkulasi skor, portal rilis nilai, dan penyimpanan database), panitia menerapkan prosedur backup manual untuk menjamin kelancaran penilaian.`
      },
      {
        number: 2,
        title: 'Kesiapan Media Backup Manual',
        content: `Panitia menyiapkan prosedur dan media backup manual sebagai alternatif apabila sistem digital mengalami gangguan. Backup dapat mencakup data identitas peserta, rekapitulasi peserta, lembar penilaian, hasil perolehan nilai, serta data penting lainnya yang diperlukan dalam penyelenggaraan LBB Mu’allimin 2027.`
      },
      {
        number: 3,
        title: 'Pencatatan Manual Saat Gangguan',
        content: `Apabila terjadi gangguan pada sistem penilaian yang mengakibatkan nilai tidak tersimpan, tidak dapat diakses, atau berpotensi hilang, juri dan/atau asisten juri wajib melakukan pencatatan nilai secara manual menggunakan formulir atau media pencatatan yang telah disiapkan panitia. Hasil pencatatan tersebut menjadi dasar verifikasi dan pemulihan data setelah sistem kembali berfungsi normal.`
      },
      {
        number: 4,
        title: 'Verifikasi dan Pemulihan Data',
        content: `Setelah sistem digital kembali berfungsi normal, panitia melakukan verifikasi dan pemulihan data berdasarkan catatan manual, dokumen resmi, serta bukti pendukung yang dapat dipertanggungjawabkan. Data yang telah diverifikasi dimasukkan kembali ke dalam sistem oleh petugas yang berwenang. Apabila ditemukan perbedaan data, penyelesaiannya dilakukan berdasarkan dokumen dan catatan resmi yang menjadi bukti.`
      },
      {
        number: 5,
        title: 'Kewenangan Panitia dan Dasar Pemulihan',
        content: `Dalam hal terjadi gangguan sistem digital, panitia berwenang menetapkan langkah penanganan dan penggunaan prosedur backup berdasarkan kondisi yang terjadi serta bukti dan catatan resmi yang tersedia. Gangguan sistem digital tidak dapat dijadikan alasan untuk menghapus, mengubah, atau menetapkan data secara sepihak tanpa dasar yang dapat dipertanggungjawabkan. Setiap koreksi atau pemulihan data wajib melalui proses verifikasi oleh pihak yang berwenang.`
      }
    ]
  },
  {
    id: 'bab-c',
    letter: 'C',
    title: 'KETENTUAN SANKSI DAN PENALTI PENGURANGAN NILAI',
    tableNote: `Pelanggaran teknis dan ketentuan lapangan dikenai sanksi berupa pengurangan nilai secara kumulatif pada rekapitulasi nilai akhir. Pengurangan nilai diberlakukan sesuai dengan pihak yang melakukan pelanggaran, yaitu Peleton, Komandan Peleton, atau keduanya.`,
    closingNote: `Setiap penalti dicatat oleh Asisten Juri pada lembar penilaian sesuai dengan kategori pelanggaran dan pihak yang dikenai penalti.`
  },
  {
    id: 'bab-d',
    letter: 'D',
    title: 'PENUTUP',
    content: `Petunjuk Teknis Penilaian dan Kejuaraan ini menjadi pedoman operasional resmi bagi seluruh panitia, dewan juri, dan peserta LBB Mu'allimin Tahun 2027. Seluruh hal teknis tambahan yang disepakati bersama dalam forum Technical Meeting mengikat secara sah dan menjadi bagian tak terpisahkan dari juknis ini.`
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
          `Batas total kuota peserta adalah 36 Peleton se-Daerah Istimewa Yogyakarta, dengan alokasi berimbang: (1) Tingkat SD/MI Sederajat: Kuota 18 Peleton (Arena 1 - Lapangan Basket); (2) Tingkat SMP/MTs Sederajat: Kuota 18 Peleton (Arena 2 - Pelataran Embung).`,
          `Setiap sekolah/madrasah diperkenankan mengirimkan maksimal 2 (dua) peleton (dapat berupa peleton putra, peleton putri, maupun peleton campuran).`
        ]
      },
      {
        number: 3,
        title: 'Jadwal dan Lini Masa Pendaftaran',
        sub: [
          `Periode Pendaftaran Daring: Dibuka mulai 19 Oktober 2026 pukul 00.00 WIB s.d. 29 November 2026 pukul 23.59 WIB (pendaftaran otomatis ditutup lebih awal apabila kuota 36 peleton telah terpenuhi).`,
          `Technical Meeting & Verifikasi Dokumen Fisik: Sabtu, 9 Januari 2027 pukul 13.00 - 16.30 WIB di Aula Kampus Induk Madrasah Mu’allimin Wirobrajan.`,
          `Uji Coba Lapangan: Sabtu, 16 Januari 2027 pukul 07.00 – 13.00 WIB di Kampus Terpadu Sedayu.`,
          `Hari Pelaksanaan Lomba & Daftar Ulang: Ahad, 24 Januari 2027 mulai pukul 06.00 WIB di Kampus Terpadu Sedayu.`
        ]
      },
      {
        number: 4,
        title: 'Biaya Pendaftaran dan Tata Cara Pembayaran',
        sub: [
          `Biaya pendaftaran per peleton terbagi ke dalam 2 (dua) gelombang berjenjang (bersifat Non-Refundable / tidak dapat ditarik kembali apabila peleton mengundurkan diri): Gelombang 1 (19 Oktober – 8 November 2026): Rp 350.000,- / peleton; Gelombang 2 (9 November – 29 November 2026/Kuota Penuh): Rp 400.000,- / peleton; Gelombang 2 hanya dibuka jika sisa kuota masih ada. Keterangan: Setiap pembayaran wajib menggunakan kode unik 108 pada nominal transfer.`,
          `Pembayaran disetorkan via transfer perbankan ke rekening resmi panitia: Bank Tujuan: BSI (Bank Syariah Indonesia) | Nomor Rekening: 2600051817 | Atas Nama: Kepala Urusan Admisi, Humas, dan Kerja Sama | Format Berita Transfer Wajib: NAMA SEKOLAH_JUMLAH PELETON (Contoh: MTS MU’ALLIMIN YK_1).`,
          `Ketentuan Nominal Pembayaran: 1 (satu) peleton Gelombang 1: Rp350.108,-; 2 (dua) peleton Gelombang 1: Rp700.108,-; 1 (satu) peleton Gelombang 2: Rp400.108,-; 2 (dua) peleton Gelombang 2: Rp800.108,-.`,
          `Bukti transfer asli (struk ATM/teller atau tangkapan layar m-banking yang jelas) wajib diunggah pada formulir digital pendaftaran.`,
          `Setiap peleton terdaftar berhak mendapatkan fasilitas: ruang kelas basecamp, 1 (satu) dus Air Minum Kemasan (botol) per peleton saat registrasi ulang, 3 buah ID Card resmi (1 Official & 2 Pendukung Resmi), Nomor Dada Peleton, 2 kantong sampah terpilah, akses kantong parkir, dan E-Sertifikat resmi.`
        ]
      },
      {
        number: 5,
        title: 'Alur Prosedur Pendaftaran Digital (5 Langkah)',
        sub: [
          `Langkah 1 (Akses Formulir): Perwakilan sekolah/peleton membuka portal resmi https://lbb.tontimuallimin.com/ lalu meng-klik tombol "Daftar Peleton" untuk masuk ke formulir pendaftaran.`,
          `Langkah 2 (Data Sekolah & Akun Tim): Memilih jenjang perlombaan (SD/MI atau SMP/MTs), mendaftarkan email Google aktif (digunakan untuk login Dashboard Tim), mengisi biodata sekolah, mengunggah logo sekolah, dan memilih kategori peleton (Putra/Putri/Campuran).`,
          `Langkah 3 (Data Danton & Official): Meng-input identitas lengkap Komandan Peleton beserta unggahan scan Kartu Pelajar sah, serta mengisi identitas Official/Pelatih pendamping lengkap dengan nomor WhatsApp aktif dan unggahan scan KTP asli.`,
          `Langkah 4 (Pembayaran & Pakta Integritas): Mengunggah bukti transfer biaya pendaftaran yang valid dan membubuhkan tanda tangan digital pada kanvas Pakta Integritas Online.`,
          `Langkah 5 (Konfirmasi & Aktivasi Dashboard Tim): Tim menerima Kode Registrasi unik resmi. Panitia melakukan verifikasi dalam 1x24 jam. Setelah diverifikasi, tim dapat login ke Dashboard Peserta untuk melengkapi susunan identitas peleton.`
        ]
      },
      {
        number: 6,
        title: 'Dokumen Persyaratan yang Wajib Diunggah (Digital)',
        sub: [
          `Surat Tugas / Rekomendasi Resmi dari Kepala Sekolah/Madrasah asli bertanda tangan dan berstempel basah (format PDF/JPG, maks. 2 MB).`,
          `Bukti transfer biaya pendaftaran sesuai biaya pendaftaran gelombang berjalan (format JPG/PNG, maks. 2 MB).`,
          `Scan/Foto Kartu Pelajar sah Komandan Peleton (Danton) pangkalan bersangkutan (format Foto/PDF, maks. 3 MB).`,
          `Scan/Foto KTP asli Official atau Pelatih pendamping resmi peleton sekolah (format Foto/PDF, maks. 3 MB).`,
          `Logo peleton atau sekolah/madrasah beresolusi tinggi format PNG transparan.`,
          `Pasfoto resmi seluruh personel peleton ukuran 3x4 (latar belakang Merah untuk jenjang SD/MI dan latar belakang Biru untuk jenjang SMP/MTs) diunggah melalui menu Identitas Personel di portal peserta.`,
          `Data identitas seluruh personel peleton berupa Nama Lengkap sesuai ijazah terakhir atau dokumen resmi (digunakan untuk penerbitan sertifikat), NISN, Tempat dan Tanggal Lahir, serta Kelas. Data diisi melalui portal peserta sesuai format yang telah disediakan.`
        ]
      },
      {
        number: 7,
        title: 'Regulasi Komposisi Personel Peleton',
        sub: [
          `Komposisi resmi peleton berjumlah maksimal 25 personel, terdiri atas: 1 Komandan Peleton (Danton), 21 Anggota Inti (3 saf x 7 banjar), dan 3 Orang Cadangan.`,
          `Didampingi maksimal 3 orang pendamping peleton: 1 Official (Pelatih/Pembina) dan 2 Pendukung Resmi (Medis/Dokumentasi) yang akan mengenakan ID Card resmi panitia.`,
          `Batas minimal personel tampil di arena adalah 22 orang (1 Danton + 21 Anggota Inti). Penggantian pemain inti dengan cadangan hanya diperkenankan saat transisi resmi yang diatur dalam materi juknis.`
        ]
      },
      {
        number: 8,
        title: 'Kewajiban Penyerahan Berkas Fisik Asli saat Technical Meeting',
        sub: [
          `Meskipun proses pendaftaran awal diselenggarakan secara digital, delegasi resmi sekolah/madrasah (maksimal 2 orang perwakilan per SEKOLAH/MADRASAH, baik yang mengirimkan 1 maupun 2 peleton) WAJIB membawa dan menyerahkan berkas fisik asli pada saat registrasi Technical Meeting (Sabtu, 9 Januari 2027 pukul 12.30 - 13.00 WIB di Aula Kampus Induk Mu’allimin Wirobrajan). Bagi sekolah yang mengirimkan 2 (dua) peleton, delegasi yang hadir berhak mewakili proses verifikasi kedua peleton tersebut sekaligus.`,
          `Berkas fisik asli yang diserahkan meliputi: (1) Surat Tugas / Rekomendasi Kepala Sekolah asli berstempel basah yang memuat daftar nama lengkap seluruh peleton (1 Danton, 21 Inti, 3 Cadangan, 1 Official, 2 Pendukung Resmi); (2) Pakta Integritas fisik bermaterai Rp 10.000 yang telah ditandatangani basah oleh Official bersangkutan.`
        ]
      },
      {
        number: 9,
        title: 'Ketentuan Diskualifikasi & Sanksi Administrasi',
        sub: [
          `Diskualifikasi Mutlak: Diberikan kepada peleton yang memanipulasi data identitas siswa, memalsukan stempel/tanda tangan surat rekomendasi kepala sekolah, atau menyertakan siswa dari luar pangkalan sekolah yang bersangkutan.`,
          `Ketentuan Pembatalan (Non-Refundable): Uang pendaftaran yang telah dibayarkan tidak dapat ditarik kembali apabila peleton membatalkan keikutsertaan secara sepihak.`,
          `Pergantian Personel: Perubahan data personel, termasuk nama, susunan, posisi, foto, maupun pergantian individu, diperbolehkan sampai dengan sebelum pelaksanaan Technical Meeting (TM). Setiap perubahan wajib dilaporkan dan disesuaikan dengan Surat Tugas/Rekomendasi resmi dari Kepala Sekolah/Madrasah. Perubahan yang tidak tercantum atau tidak sesuai dengan Surat Tugas/Rekomendasi resmi dinyatakan tidak sah.`
        ]
      },
      {
        number: 10,
        title: 'Pusat Layanan dan Narahubung Resmi',
        sub: [
          `Website Portal Pendaftaran: https://lbb.tontimuallimin.com/`,
          `WhatsApp Helpdesk Resmi: https://wa.me/6281947491505 (Admin: 0819-4749-1505)`,
          `Email Resmi: lbb@tontimuallimin.com`,
          `Instagram Resmi: @lbbmuin | @mualliminjogja | TikTok: @tontimuallimin`
        ]
      },
      {
        number: 11,
        title: 'Mitigasi Gangguan Sistem Digital Pendaftaran',
        sub: [
          `Apabila peserta mengalami kendala teknis login atau gagal unggah dokumen akibat gangguan server/portal resmi, panitia menyediakan mekanisme verifikasi dan pengumpulan dokumen secara manual/darurat melalui koordinasi Helpdesk Resmi WhatsApp. Kendala akibat kelalaian peserta melewati batas waktu tidak termasuk dalam ketentuan ini.`
        ]
      }
    ]
  },
  {
    id: 'reg-b',
    letter: 'B',
    title: 'PENUTUP',
    content: `Petunjuk Teknis Pendaftaran ini menjadi pedoman operasional resmi bagi seluruh panitia, dewan juri, dan peserta LBB Mu'allimin Tahun 2027. Seluruh hal teknis tambahan yang disepakati bersama dalam forum Technical Meeting mengikat secara sah dan menjadi bagian tak terpisahkan dari juknis ini.`
  }
];
