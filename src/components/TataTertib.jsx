import React from 'react';
import { Scale, ShieldCheck, Clock, MapPin, AlertTriangle, Trophy } from 'lucide-react';
import { EVENT, VENUE, VENUE_INDUK } from '../config.js';

export default function TataTertib() {
  const articles = [
    {
      pasal: 1,
      phase: 'Ketentuan Umum',
      title: 'Ketentuan Umum dan Asas Pelaksanaan',
      points: [
        "Lomba Baris - Berbaris Mu'allimin Tahun 2027 (selanjutnya disingkat LBB MU'ALLIMIN 2027) merupakan lomba baris-berbaris tingkat Daerah Istimewa Yogyakarta yang diselenggarakan oleh Madrasah Mu'allimin Muhammadiyah Yogyakarta.",
        `LBB MU'ALLIMIN 2027 dilaksanakan pada hari ${EVENT.COMPETITION_DATE} di Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta (Sedayu, Bantul).`,
        "Peserta LBB MU'ALLIMIN 2027 merupakan siswa SD/MI sederajat dan SMP/MTs sederajat dalam lingkup Daerah Istimewa Yogyakarta, sesuai yang tertera pada formulir pendaftaran.",
        "Tata Tertib ini merupakan pedoman resmi yang mengatur seluruh ketentuan non-lomba, etika lingkungan madrasah/pesantren, pemanfaatan basecamp, prosedur Check-In & Checkout, kebersihan, suporter, serta penegakan sportivitas dan integritas. Adapun petunjuk teknis gerakan PBB (berpedoman pada Peraturan Panglima TNI Nomor 58 dan 57 Tahun 2018, serta khusus pelaksanaan Hormat Kanan/Kiri berpedoman pada Peraturan Panglima TNI Nomor 45 Tahun 2014), arena lomba, dan sistem penjurian diatur secara tersendiri dalam Petunjuk Teknis (Juknis) Lapangan.",
        "Ketentuan seragam resmi peserta lomba:\n• SD/MI: Menggunakan seragam tonti sekolah atau seragam nasional merah putih lengkap beserta seluruh atributnya.\n• SMP/MTs: Menggunakan seragam tonti sekolah atau seragam OSIS lengkap beserta seluruh atributnya.",
        "Setiap peleton didampingi oleh maksimal 1 (satu) orang Official (Pelatih/Pembina) dan 2 (dua) orang Pendukung (Medis/Dokumentasi/dll.), serta seluruh anggota cadangan resmi yang telah terdaftar."
      ]
    },
    {
      pasal: 2,
      phase: 'Tahap I: Pra-Lomba',
      title: 'Pendaftaran Resmi dan Registrasi Administrasi',
      points: [
        "Pendaftaran resmi dilakukan secara online melalui website resmi: lbb.tontimuallimin.com sesuai dengan batas periode waktu yang telah ditentukan oleh panitia.",
        "Seluruh proses pendaftaran bersifat paperless (unggah digital), kecuali berkas fisik asli yang wajib dibawa dan diserahkan langsung saat forum Technical Meeting (TM) Peserta.",
        "Berkas fisik asli yang wajib diserahkan dan diverifikasi saat TM Peserta mencakup:\na. Surat Tugas / Rekomendasi Resmi Kepala Sekolah asli berstempel basah yang memuat daftar nama lengkap seluruh personel kontingen: 1 Komandan Peleton (Danton), 21 Anggota Inti, 3 Anggota Cadangan, 1 Official (Pelatih/Pembina), dan 2 Pendukung (Medis/Dokumentasi/dll.).\nb. Pakta Integritas yang telah ditandatangani bermaterai Rp 10.000 oleh Official resmi sekolah.\nc. Dokumen keabsahan data peserta (Buku Rapor / NISN / Akta Kelahiran) guna verifikasi siswa aktif bersangkutan."
      ]
    },
    {
      pasal: 3,
      phase: 'Tahap I: Pra-Lomba',
      title: 'Teknis Technical Meeting (TM) Peserta',
      points: [
        `Waktu dan Tempat: Technical Meeting (TM) Peserta dilaksanakan pada hari ${EVENT.TECHNICAL_MEETING_FULL_DATE} pukul ${EVENT.TECHNICAL_MEETING_TIME} bertempat di Kampus Induk Madrasah Mu'allimin Muhammadiyah Yogyakarta (${VENUE_INDUK.ADDRESS}).`,
        "Kehadiran Delegasi: Setiap kontingen wajib diwakili oleh maksimal 2 (dua) orang perwakilan resmi (Official/Pembina atau Komandan Peleton). Perwakilan wajib mengenakan pakaian rapi, sopan, dan bersepatu.",
        "Verifikasi Berkas Fisik Asli (12.30 - 13.00 WIB): Sebelum forum dimulai, perwakilan kontingen melakukan presensi kehadiran dan menyerahkan berkas fisik asli di meja registrasi TM panitia.",
        "Agenda Technical Meeting: Agenda TM meliputi pemaparan regulasi teknis oleh Panitia dan Dewan Juri, sesi tanya jawab/klarifikasi keraguan gerakan, pengundian resmi terbuka (lotting) nomor urut tampil peleton (SD-01 s.d. SD-18 dan SMP-01 s.d. SMP-18), penandatanganan Berita Acara TM, serta pembagian jadwal resmi slot uji coba lapangan.",
        "Kekuatan Hasil TM: Hasil technical meeting wajib dipatuhi dan dilaksanakan selama perlombaan berlangsung. Pada hari pelaksanaan perlombaan, panitia tidak menerima protes tentang ketentuan-ketentuan yang sudah disepakati pada saat technical meeting, baik yang berupa ketentuan tertulis maupun yang tidak tertulis."
      ]
    },
    {
      pasal: 4,
      phase: 'Tahap I: Pra-Lomba',
      title: 'Teknis Uji Coba Lapangan (Familiarisasi Medan)',
      points: [
        `Waktu dan Tempat: Uji Coba Lapangan (Familiarisasi Medan Perlombaan) dilaksanakan pada hari ${EVENT.FIELD_TRIAL_FULL_DATE} pukul ${EVENT.FIELD_TRIAL_TIME} di Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta (Sedayu, Bantul).`,
        "Pelaksanaan Paralel di Dua Arena:\na. Arena 1 (Lapangan Basket Kampus Terpadu Sedayu): Khusus untuk 18 Peleton Tingkat SD/MI (ukuran 25 m x 14 m).\nb. Arena 2 (Pelataran Embung Kampus Terpadu Sedayu): Khusus untuk 18 Peleton Tingkat SMP/MTs (ukuran 26 m x 15 m).",
        "Alokasi Waktu Resmi Kontingen: Setiap kontingen memperoleh alokasi waktu 15 (lima belas) menit, dengan pembagian: 10 menit waktu efektif uji coba lapangan dan 5 menit waktu transisi peleton, dipandu petugas timekeeper dan LO pendamping.",
        "Fokus dan Sasaran Uji Coba: Uji coba lapangan difokuskan murni untuk familiarisasi medan perlombaan bagi peserta (penyesuaian hentakan langkah terhadap tekstur lantai arena serta simulasi alur masuk/keluar arena). Uji coba dilaksanakan tanpa ada penilaian dewan juri.",
        "Ketentuan Perlengkapan Uji Coba: Peserta diperbolehkan mengenakan seragam olahraga/latihan sekolah yang seragam, rapi, dan bersepatu (DILARANG KERAS menggunakan sepatu berpines/paku)."
      ]
    },
    {
      pasal: 5,
      phase: 'Tahap II: Hari Perlombaan',
      title: 'Daftar Ulang, Check-In, dan Jaminan Identitas',
      points: [
        "Daftar ulang peserta pada hari-H perlombaan dilayani pukul 06.00 - 09.00 WIB di Meja Registrasi Resmi Kampus Terpadu Sedayu.",
        "Daftar ulang lebih dari pukul 09.00 WIB tidak akan dilayani. Bagi peleton yang tidak melakukan daftar ulang dikenakan sanksi tidak dapat mengikuti perlombaan.",
        "Prosedur Check-In Kontingen:\na. Official menyerahkan 1 (satu) kartu identitas resmi (KTP/SIM perwakilan sekolah) sebagai jaminan ketertiban serta kebersihan basecamp.\nb. Official menerima Nomor Dada Peleton resmi (wajib disematkan pada dada sebelah kiri personel penjuru depan tengah atau S2B1 [Saf 2 Banjar 1]).\nc. Official menerima tanda pengenal resmi (ID Card 1 Official & 2 Pendukung) serta 2 (dua) kantong sampah terpilah (Organik & Anorganik).\nd. Peleton diarahkan dan dikawal oleh LO pendamping menuju ruang kelas basecamp resmi yang telah ditentukan.",
        "Pengembalian nomor dada dilakukan di pos/arena terakhir kepada petugas pos setelah peleton menyelesaikan seluruh rangkaian materi lomba."
      ]
    },
    {
      pasal: 6,
      phase: 'Tahap II: Hari Perlombaan',
      title: 'Upacara Pembukaan dan Sterilisasi Arena',
      points: [
        "Seluruh area perlombaan ditutup dan disterilkan dari aktivitas umum pada pukul 07.30 WIB. Peserta diperbolehkan masuk kembali setelah upacara pembukaan selesai.",
        "Upacara pembukaan resmi wajib diikuti oleh peserta dengan nomor urut lomba 1 sampai dengan 5 (SD-01 s.d. SD-05 dan SMP-01 s.d. SMP-05) dengan formasi 1 komandan dan 15 anggota (5 trio lengkap) mengenakan seragam tonti resmi lengkap.",
        "Pengecekan barisan upacara dilakukan oleh panitia 15 menit sebelum upacara dimulai. Peleton yang tidak hadir atau terlambat dikenakan sanksi penalti pengurangan nilai sebesar 150 poin (-150 poin) sesuai ketentuan Juknis Lapangan."
      ]
    },
    {
      pasal: 7,
      phase: 'Tahap III: Hari Perlombaan',
      title: 'Prosedur Daerah Persiapan (DP 1 & DP 2)',
      points: [
        "Kesiapan di Basecamp: Peleton bersama official sebaiknya sudah bersiap-siap di ruang basecamp sekurang-kurangnya 15 (lima belas) menit sebelum estimasi waktu nomor urutnya akan dipanggil oleh LO pendamping.",
        "Prosedur Pemanggilan Masuk DP 1: Peleton HANYA diperkenankan masuk ke Daerah Persiapan 1 (DP 1) setelah dipanggil secara resmi oleh panitia melalui pengeras suara (mic). Peleton DILARANG KERAS masuk ke DP 1 sebelum dipanggil.",
        "Sanksi Keterlambatan Hadir di DP 1: Peleton yang tidak hadir di DP 1 setelah 3 (tiga) kali pemanggilan resmi melalui pengeras suara (dengan jeda waktu antar panggilan selama 2 menit) dikenakan sanksi penalti pengurangan nilai sebesar 100 poin (-100 poin) dan urutan tampilnya digeser ke urutan tampil paling akhir. Apabila peleton tetap tidak hadir tanpa konfirmasi resmi, maka dikenakan sanksi DISKUALIFIKASI.",
        "Pemeriksaan di DP 1: Di DP 1 dilakukan verifikasi jumlah personel (1 Danton, 21 Inti, cadangan, 1 Official, 2 Pendukung), kartu ID card, nomor dada S2B1, dan pemeriksaan fisik sol sepatu (DILARANG KERAS sol berpines, paku payung, spikes, atau pul logam).",
        "Ruang Tunggu DP 2: Setelah lolos DP 1, peleton memasuki DP 2 yang difungsikan murni sebagai Holding Area yang tenang sebelum dipersilakan masuk ke arena perlombaan."
      ]
    },
    {
      pasal: 8,
      phase: 'Tahap III: Hari Perlombaan',
      title: 'Area Lomba, Penggunaan Basecamp, dan Zonasi Pesantren',
      points: [
        "Lokasi kegiatan dibagi menjadi beberapa area: Area Lomba (Arena 1 & 2), Area Basecamp (ruang kelas transit peleton), Daerah Persiapan (DP 1 & DP 2), Area Penonton/Suporter, dan Area Steril/Privat Pesantren.",
        "Setiap peleton mendapatkan 1 (satu) ruang kelas basecamp resmi yang telah ditentukan oleh panitia. Basecamp HANYA boleh dimasuki oleh anggota peleton berseragam, 1 Official, dan 2 Pendukung ber-ID Card resmi.",
        "Wali murid, penonton, pendukung, maupun penggembira DILARANG KERAS memasuki area basecamp / ruang kelas peserta demi menjaga ketertiban, keamanan barang bawaan, dan kenyamanan istirahat siswa.",
        "Peserta dan pendamping DILARANG menggunakan aset/fasilitas ruang kelas (seperti LCD proyektor, papan tulis, perangkat guru, sound kelas) dan DILARANG memindahkan meja maupun kursi keluar dari dalam ruang kelas.",
        "Seluruh unsur kontingen DILARANG KERAS memasuki area privat Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta, khususnya kawasan ASRAMA SANTRI. Pelanggaran terhadap batas privasi ini akan dikenakan sanksi tegas oleh Panitia dan Keamanan.",
        "Area Lomba bersifat steril (Clear Area) dan hanya dapat diakses oleh peleton yang sedang tampil didampingi 1 Official dan 2 Pendukung ber-ID Card di pinggir arena. Penonton dan suporter diwajibkan berada di Area Penonton yang telah disediakan."
      ]
    },
    {
      pasal: 9,
      phase: 'Tahap III: Hari Perlombaan',
      title: 'Etika Suporter, Ketertiban Ibadah, dan Integritas',
      points: [
        "Prinsip Sportivitas: Seluruh peserta, official, pendukung, dan keluarga besar kontingen wajib menjunjung tinggi nilai-nilai sportivitas, kejujuran, saling menghormati, dan kebersamaan pelajar berkarakter.",
        "Ketertiban Suporter saat Tampil: Penonton dan suporter DILARANG membunyikan instrumen musik/alat tabuh, terompet, peluit, megafon/toa, maupun meneriakkan yel-yel saat ada peleton yang sedang tampil di arena perlombaan agar tidak mengganggu konsentrasi komandan, pasukan, dan dewan juri.",
        "Larangan Tepukan dan Sorakan Sinis: Tepukan tangan dan yel-yel suporter hanya diizinkan saat jeda pergantian peleton atau sebelum/setelah peleton tampil di arena lomba. DILARANG KERAS melakukan tepukan, teriakan, atau sorakan sinis (mencemooh, mengejek, atau menertawakan) saat melihat peleton lain melakukan kesalahan aba-aba atau gerakan di arena lomba.",
        "Ketertiban Ibadah Salat: Mengingat Kampus Terpadu Madrasah Mu'allimin merupakan lingkungan Pondok Pesantren, seluruh peserta, official, pendukung, dan penonton diwajibkan menjaga ketenangan, menghentikan aktivitas kegaduhan/yel-yel saat adzan berkumandang dan masuk waktu salat, serta bagi yang beragama Islam dipersilakan menunaikan salat berjamaah di Masjid Kampus Terpadu.",
        "Larangan Ujaran Kebencian, Hoaks, dan Fitnah: Peserta, official, maupun suporter DILARANG KERAS menyebarkan berita bohong (hoaks), fitnah, ujaran kebencian (hate speech), kata-kata kotor/saru, penghinaan bernuansa SARA, baik secara lisan di lokasi lomba maupun melalui media sosial. Pelanggaran berat dikenakan sanksi DISKUALIFIKASI.",
        "Larangan Modifikasi Sol Sepatu: DILARANG KERAS menempelkan atau memasang pines, paku payung, paku besi, spikes, pul logam, atau benda tajam/keras lainnya pada alas kaki/sol sepatu yang berpotensi merusak permukaan lantai arena dan membahayakan peserta.",
        "Larangan Senjata & Tindakan Kekerasan: Peserta dan seluruh unsur pendukungnya DILARANG membawa senjata tajam, senjata api, bahan peledak, rokok, miras, maupun obat-obatan terlarang, serta DILARANG terlibat dalam segala bentuk kekerasan fisik atau perkelahian (Sanksi DISKUALIFIKASI dan diserahkan kepada pihak berwajib)."
      ]
    },
    {
      pasal: 10,
      phase: 'Kesehatan & Keamanan',
      title: 'Kesehatan dan Penanganan Medis Lapangan',
      points: [
        "Seluruh peserta yang mengikuti lomba diasumsikan berada dalam kondisi sehat jasmani dan rohani.",
        "Panitia menyediakan pos pertolongan pertama pada kecelakaan (P3K) atau tim medis untuk penanganan insiden darurat di lokasi lomba.",
        "Panitia hanya memberikan pertolongan pertama dasar. Penanganan lebih lanjut yang memerlukan rujukan ke fasilitas kesehatan menjadi tanggung jawab sekolah atau official masing-masing.",
        "Panitia tidak bertanggung jawab atas kondisi kesehatan peserta yang disebabkan oleh penyakit bawaan atau riwayat medis sebelumnya.",
        "Setiap insiden keamanan atau hal-hal yang mencurigakan harap segera dilaporkan kepada panitia terdekat."
      ]
    },
    {
      pasal: 11,
      phase: 'Penghargaan',
      title: 'Kategori dan Penghargaan Juara',
      points: [
        "Sebagai bentuk apresiasi dan motivasi bagi peserta, panitia LBB Mu'allimin Tahun 2027 menyediakan hadiah dan penghargaan berikut:\na. Piala Bergilir Juara Umum:\n  • Piala Bergilir Juara Umum Tingkat SD/MI Sederajat\n  • Piala Bergilir Juara Umum Tingkat SMP/MTs Sederajat\nb. Kategori Peleton Tingkat SD/MI Sederajat: Juara I, II, III (Piala Tetap + Uang Pembinaan) dan Juara Harapan I, II, III (Piala Tetap).\nc. Kategori Peleton Tingkat SMP/MTs Sederajat: Juara I, II, III (Piala Tetap + Uang Pembinaan) dan Juara Harapan I, II, III (Piala Tetap).\nd. Kategori Komandan Peleton Terbaik Tingkat SD/MI: Juara I (Piala Tetap + Uang Pembinaan) serta Juara II dan III (Piala Tetap).\ne. Kategori Komandan Peleton Terbaik Tingkat SMP/MTs: Juara I (Piala Tetap + Uang Pembinaan) serta Juara II dan III (Piala Tetap).",
        "Seluruh Pemenang (Juara I-III Peleton, Harapan I-III Peleton, dan Juara I-III Danton) akan mendapatkan E-Sertifikat Piagam Penghargaan sesuai prestasi yang diraih."
      ]
    },
    {
      pasal: 12,
      phase: 'Penilaian',
      title: 'Penentuan Juara dan Sistem Perolehan Poin',
      points: [
        "Asas Penentuan Kejuaraan: Penentuan Juara Peleton, Juara Harapan, dan Komandan Peleton Terbaik (tingkat SD/MI maupun SMP/MTs) ditetapkan secara sah berdasarkan hasil rekapitulasi nilai Dewan Juri independen dari unsur TNI, POLRI, dan PPI.",
        "Regulasi Teknis Penjurian & Poin Juara Umum: Rincian formula bobot penilaian (Kebenaran Gerak dan Kekompakan 1:1 [50% : 50%], rentang 50-90 bilangan genap, serta 4 aspek penilaian Komandan Peleton), tabel perolehan poin Juara Umum (skala 6 s.d. 1 poin), kriteria pemecah seri (tie-breaker), serta matriks penalti pengurangan nilai teknis diatur secara lengkap dan mengikat dalam dokumen Petunjuk Teknis (Juknis) Lapangan Bab F dan Bab G.",
        "Keputusan Dewan Juri: Keputusan Dewan Juri mengenai aspek kualitatif penilaian mutu gerakan bersifat mutlak dan tidak dapat diganggu gugat. Segala bentuk sanggahan hanya dilayani untuk kekeliruan administratif sesuai prosedur pada Pasal 13 Tata Tertib ini dan Juknis Lapangan."
      ]
    },
    {
      pasal: 13,
      phase: 'Tahap IV: Pasca-Lomba',
      title: 'Apel Penutupan, Pengumuman Juara, dan Mekanisme Sanggah',
      points: [
        "Apel Penutupan: Apel Penutupan wajib diikuti oleh seluruh peserta dengan ketentuan 1 komandan dan 4 anggota peleton. Peserta Apel Penutupan berpakaian rapi, sopan, dan bersepatu.",
        "Pengumuman Kejuaraan: Pengumuman lomba dilaksanakan setelah Apel Penutupan selesai dengan ketentuan, yang diperbolehkan masuk ke area pengumuman (lapangan mini soccer) yakni peserta apel penutupan.",
        "Mekanisme Transparansi Nilai (Live Score Quick Count): Skor penampilan setiap peleton akan langsung ditayangkan secara transparan pada aplikasi quick count resmi melalui situs web lbb.tontimuallimin.com setelah diverifikasi oleh tim rekapitulasi nilai dan dewan juri. Official/perwakilan peleton dapat login mengakses rekap nilai rinci menggunakan akun Gmail masing-masing kontingen/peleton yang telah didaftarkan.",
        "Mekanisme Pengajuan Protes Resmi (Sanggah): Keputusan Dewan Juri mengenai penilaian yang bersifat kualitatif bersifat mutlak dan tidak dapat diganggu gugat. Protes hanya diterima untuk dugaan kesalahan administratif non-penilaian (kesalahan penjumlahan skor, kesalahan input data, atau kesalahan penerapan poin penalti).",
        "Prosedur dan Batas Waktu Sanggah: Protes hanya sah jika diajukan secara TERTULIS menggunakan Formulir Sanggahan Resmi oleh 1 (satu) orang Official resmi terdaftar dengan menyertakan bukti valid di Meja Informasi Panitia dalam periode waktu 60 (enam puluh) menit sejak pengumuman kejuaraan pada acara penutupan secara resmi dibacakan."
      ]
    },
    {
      pasal: 14,
      phase: 'Tahap IV: Pasca-Lomba',
      title: 'Kebersihan Basecamp, Checkout, dan Pemulangan',
      points: [
        "Seluruh partisipan DIWAJIBKAN menjaga kebersihan dan kerapian lingkungan di area Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta (Sedayu, Bantul).",
        "Sebelum meninggalkan basecamp, peserta diwajibkan membersihkan ruangan serta merapikan kembali susunan meja dan kursi seperti kondisi semula. Sampah wajib dipilah menjadi dua kategori menggunakan kantong yang telah disediakan: Sampah Plastik / Anorganik dan Sampah Non-Plastik / Organik.",
        "Pengembalian kartu identitas (KTP/SIM) dilayani di Meja Announcer/Informasi setelah panitia melakukan verifikasi kebersihan dan kerapian ruang basecamp serta memastikan sampah terpilah telah diserahkan langsung ke Area Checkout.",
        "Sanksi Kebersihan dan Fasilitas Basecamp: Apabila ruangan basecamp ditinggalkan dalam keadaan kotor atau berantakan, peleton dikenai sanksi pengurangan nilai sebesar 50 poin (-50 poin) pada rekapitulasi nilai akhir. Apabila terbukti terjadi kerusakan fisik atau kehilangan aset sarana-prasarana ruang kelas (meja, kursi, kaca jendela, stopkontak, LCD/proyektor, dll.), kartu identitas jaminan (KTP/SIM) DITAHAN panitia dan pihak sekolah yang bersangkutan dikenakan sanksi ganti rugi finansial penuh serta denda administratif perbaikan aset sebesar Rp 500.000 (lima ratus ribu rupiah).",
        "Batas Waktu Maksimal Pengosongan Basecamp: Seluruh kontingen diwajibkan telah menyelesaikan proses checkout, membersihkan ruangan, membuang sampah ke Area Checkout, dan mengosongkan ruang kelas basecamp selambat-lambatnya pukul 18.00 WIB (atau maksimal 60 menit setelah upacara penutupan dan pengumuman kejuaraan selesai)."
      ]
    },
    {
      pasal: 15,
      phase: 'Ketentuan Penutup',
      title: 'Penutup',
      points: [
        "Demikian Tata Tertib ini dibuat untuk menjadi pedoman resmi bagi seluruh pihak yang terlibat dalam Lomba Baris-Berbaris Mu'allimin Tahun 2027.",
        "Hal-hal yang belum tercantum dalam dokumen ini akan diatur kemudian oleh panitia dan akan disampaikan pada saat Rapat Teknis (Technical Meeting).",
        "Dengan keikutsertaannya, seluruh peserta dianggap telah memahami dan bersedia mematuhi seluruh isi Tata Tertib ini tanpa terkecuali."
      ]
    }
  ];

  return (
    <section id="tata-tertib" className="py-24 lg:py-32 bg-slate-100 relative overflow-hidden font-sans border-t border-slate-200">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
        <span className="text-[20vw] font-black text-slate-900 -rotate-12 whitespace-nowrap select-none">
          TATA TERTIB
        </span>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest mb-6 rounded-sm shadow-xl">
            <Scale className="w-4 h-4" /> Dokumen Resmi Non-Teknis & Etika
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4 leading-tight">
            Tata Tertib <span className="text-red-700 decoration-4 decoration-slate-900 underline-offset-4">Peserta</span>
          </h2>
          <p className="text-slate-600 font-mono text-xs sm:text-sm uppercase tracking-wide">
            15 PASAL RESMI LOMBA BARIS – BERBARIS MU'ALLIMIN TAHUN 2027
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Pedoman kedisiplinan, zonasi pesantren, pemanfaatan basecamp, check-in KTP, larangan modifikasi sol sepatu, dan sanksi penalti resmi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {articles.map((item) => (
            <div
              key={item.pasal}
              className={`p-6 sm:p-8 rounded-2xl shadow-sm border transition-shadow ${
                item.pasal === 14
                  ? 'bg-amber-50/60 border-amber-300 md:col-span-2'
                  : item.pasal === 11 || item.pasal === 12
                  ? 'bg-slate-900 text-slate-200 border-slate-800'
                  : 'bg-white border-slate-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase ${
                    item.pasal === 11 || item.pasal === 12
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-900 text-white'
                  }`}>
                    PASAL {item.pasal}
                  </span>
                  <h3 className={`font-black text-sm sm:text-base ${
                    item.pasal === 11 || item.pasal === 12 ? 'text-white' : 'text-slate-900'
                  }`}>
                    {item.title}
                  </h3>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:inline ${
                  item.pasal === 11 || item.pasal === 12 ? 'text-slate-400' : 'text-slate-400'
                }`}>
                  {item.phase}
                </span>
              </div>

              <ol className="list-decimal list-outside pl-5 space-y-2.5 text-xs sm:text-sm leading-relaxed marker:font-bold">
                {item.points.map((pt, idx) => (
                  <li key={idx} className={item.pasal === 11 || item.pasal === 12 ? 'text-slate-300' : 'text-slate-700'}>
                    {pt.split('\n').map((line, lIdx) => (
                      <span key={lIdx} className="block">{line}</span>
                    ))}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
