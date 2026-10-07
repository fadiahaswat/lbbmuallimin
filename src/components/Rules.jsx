import React, { useState, useMemo } from 'react';
import { AlertOctagon, ChevronDown, Search, X, Shield, Clock, Award, FileText, CheckCircle2 } from 'lucide-react';
import { COMPETITION, EVENT, VENUE, VENUE_INDUK, PENALTIES } from '../config.js';

export default function Rules() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openAccordions, setOpenAccordions] = useState({
    intro: false,
    def: true,
    tm: false,
    trial: false,
    reg: false,
    arena: false,
    score: false,
    digital: false,
    penalty: false,
    force: false,
    closing: false,
  });

  function toggleAccordion(key) {
    setOpenAccordions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  // Smart Search Matching Logic
  const query = searchQuery.trim().toLowerCase();

  const sectionMatches = useMemo(() => {
    if (!query) {
      return {
        intro: true,
        def: true,
        tm: true,
        trial: true,
        reg: true,
        arena: true,
        score: true,
        penalty: true,
        force: true,
        closing: true,
      };
    }

    return {
      intro: 'pendahuluan petunjuk teknis resmi lbb muallimin perpang tni 58 57 45 hormat kanan pbb ppm alur kronologis'.includes(query),
      def: 'definisi istilah clear area dp 1 dp 2 holding area kotak danton 1.5 bendera hakim garis gerakan penyesuaian dimensi basket embung 25x14 26x15 official pendukung'.includes(query),
      tm: 'technical meeting tm peserta aula wirobrajan 9 januari 2027 berkas fisik surat tugas kepala sekolah pakta integritas undian lotting sd-111 smp-222'.includes(query),
      trial: 'uji coba lapangan familiarisasi medan sedayu 16 januari 2027 15 menit 10 menit efektif 5 menit transisi akustik vokal danton tekstur cengkeraman sepatu'.includes(query),
      reg: 'hari perlombaan daftar ulang check in 06.00 09.00 ktp jaminan nomor dada s2b1 kantong sampah terpilah sterilisasi upacara pembukaan sd-111 sd-113 sd-115 sd-117 sd-119 smp-222 smp-224 smp-226 smp-228 smp-240 15 anggota'.includes(query),
      arena: 'alur tampil arena posisi center juri laporan pembuka penghormatan peluit 1 kali panjang 1 menit habis menit 9 10 12 13 bendera hakim garis atribut terjatuh bubar pergantian pemain cadangan'.includes(query),
      score: 'sistem penilaian dewan juri tni polri ppi rasio 1 1 kebenaran gerak kekompakan 50 90 danton materi 35 suara 25 sikap 20 lapangan 20 juara umum poin 6 rolling release sanggah 15.00 checkout'.includes(query),
      digital: 'gangguan sistem digital prosedur backup server pemadaman listrik e-scoring lembar manual offline audit trail'.includes(query),
      penalty: 'sanksi pengurangan nilai penalti upacara 150 50 keterlambatan dp 1 100 diskualifikasi personel 75 waktu 50 garis bendera 50 penyesuaian 25 atribut 0 kotor 50 yel-yel'.includes(query),
      force: 'keadaan kahar force majeure darurat bencana alam hujan lebat badai petir henti reset stopwatch'.includes(query),
      closing: 'penutup juknis kesepakatan mengikat sah panitia dewan juri'.includes(query),
    };
  }, [query]);

  const isSearching = Boolean(query);
  const totalMatches = Object.values(sectionMatches).filter(Boolean).length;

  function shouldShow(key) {
    return !isSearching || sectionMatches[key];
  }

  function isAccordionOpen(key) {
    return isSearching ? sectionMatches[key] : openAccordions[key];
  }

  return (
    <section id="rules" className="py-24 lg:py-32 bg-white relative overflow-hidden font-sans">
      <div className="hidden sm:block absolute top-0 right-0 w-[500px] h-[500px] bg-slate-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none transform-gpu"></div>
      <div className="hidden sm:block absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60 pointer-events-none transform-gpu"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            Official Technical Guide 2027
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 leading-tight py-1">
            Petunjuk Teknis{' '}
            <span className="inline-block pr-3 sm:pr-4 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Lapangan
            </span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-3xl mx-auto text-lg font-medium">
            Pedoman teknis resmi alur kronologis, spesifikasi arena, penjurian, penalti, dan mekanisme sanggah LBB Mu'allimin 2027.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* Smart Search Bar */}
          <div className="relative group">
            <div className="relative flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-red-600 focus-within:bg-white focus-within:shadow-xl rounded-2xl transition-all duration-300">
              <div className="pl-4 pr-2 text-slate-400 group-focus-within:text-red-600 transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kata kunci juknis (contoh: penalti, kotak danton, bendera, peluit, juri, sanggah)..."
                className="w-full py-4 pr-12 text-slate-800 placeholder-slate-400 font-medium text-sm sm:text-base bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {isSearching && (
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                <span>
                  Menampilkan hasil untuk: <strong className="text-red-700 font-bold">"{searchQuery}"</strong>
                </span>
                <span className="bg-red-100/80 text-red-800 px-2.5 py-0.5 rounded-full font-bold">
                  {totalMatches} Bagian Ditemukan
                </span>
              </div>
            )}
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl shadow-sm">
            <h3 className="font-black text-red-900 uppercase mb-2 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-600" /> Regulasi Resmi Mengikat
            </h3>
            <p className="text-sm text-red-800/80 leading-relaxed">
              Petunjuk Teknis (Juknis) Lapangan ini berpedoman pada Peraturan Panglima TNI No. 58 Tahun 2018 (PBB), No. 57 Tahun 2018 (PPM), serta No. 45 Tahun 2014 (Hormat Kanan/Kiri). Seluruh ketentuan non-lomba, etika pesantren, dan basecamp diatur terpisah dalam dokumen Tata Tertib Peserta.
            </p>
          </div>

          <div className="space-y-4" id="rules-accordion">
            {/* PENDAHULUAN */}
            {shouldShow('intro') && (
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('intro')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-red-100 text-red-700 font-black flex items-center justify-center text-xs">
                      INFO
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">Pendahuluan Petunjuk Teknis Lapangan</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('intro') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('intro') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-3 animate-fade">
                    <div className="font-bold text-slate-900 text-base border-b pb-2 mb-3">
                      LOMBA BARIS – BERBARIS MU'ALLIMIN TAHUN 2027
                    </div>
                    <p>
                      Petunjuk Teknis (Juknis) Lapangan ini merupakan regulasi teknis resmi yang khusus mengatur seluruh mekanisme operasional dan teknis perlombaan, disajikan secara runtut dan sistematis sesuai alur kronologis <em>(chronological order)</em> dari tahapan pra-lomba hingga pasca-lomba. Juknis ini memuat ketentuan materi gerakan PBB (berpedoman pada Peraturan Panglima TNI Nomor 58 Tahun 2018 tentang PBB TNI, Nomor 57 Tahun 2018 tentang PPM TNI, serta khusus gerakan Hormat Kanan/Kiri mengacu pada Peraturan Panglima TNI Nomor 45 Tahun 2014), spesifikasi dimensi arena perlombaan, alur transisi peleton di lapangan, sistem penjurian dan penalti, hingga mekanisme sanggah resmi.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* A. DEFINISI ISTILAH DAN KETENTUAN DASAR LAPANGAN */}
            {shouldShow('def') && (
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('def')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                      A
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">A. Definisi Istilah dan Ketentuan Dasar Lapangan</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('def') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('def') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <ol className="list-decimal pl-5 space-y-3">
                      <li>
                        <strong className="text-slate-900">Clear Area:</strong> Area steril di sekeliling arena perlombaan yang hanya dapat dimasuki oleh peleton yang sedang berkompetisi (termasuk Cadangan), maksimal 1 (satu) orang Official resmi (Pelatih/Pembina), 2 (dua) orang Pendukung Resmi (Medis/Dokumentasi) yang mengenakan ID Card resmi, serta panitia pelaksana dan Dewan Juri yang bertugas.
                      </li>
                      <li>
                        <strong className="text-slate-900">Daerah Persiapan (DP):</strong> Area transisi berjenjang sebelum peleton memasuki arena perlombaan, terdiri dari Daerah Persiapan 1 (DP 1) sebagai Pos Pengecekan Personel dan Verifikasi Fisik, serta Daerah Persiapan 2 (DP 2) yang difungsikan murni sebagai Ruang Tunggu Siap Tampil (Holding Area). Peleton dilarang keras memasuki DP 1 sebelum dipanggil resmi oleh panitia melalui pengeras suara (mic).
                      </li>
                      <li>
                        <strong className="text-slate-900">Ketentuan Kotak Danton dan Pergerakan Komandan Peleton:</strong> Kotak Danton berukuran 1,5 x 1,5 meter terletak di batas depan arena dan menghadap langsung ke arah Peleton yang bersangkutan. Komandan Peleton mengawali penampilan dari posisi tengah arena untuk melaksanakan penghormatan dan pelaporan awal kepada juri, kemudian berpindah memasuki Kotak Danton untuk memimpin jalannya materi perlombaan. Selama memimpin di dalam kotak, Komandan Peleton wajib berada di posisi menghadap peleton (posisi komando), dilarang keras membelakangi meja Dewan Juri, serta tidak diperbolehkan menginjak maupun melangkah keluar dari garis batas kotak, kecuali pada instruksi materi yang secara teknis mengharuskannya keluar kotak seperti bubar peleton, berhimpun, atau perhatian/istirahat di tempat.
                      </li>
                      <li>
                        <strong className="text-slate-900">Prinsip Garis Batas dan Penilaian Pelanggaran:</strong> Seluruh garis batas arena perlombaan maupun batas Kotak Danton menganut asas <span className="font-bold text-red-700 bg-red-50 px-1 rounded">"Garis sebagai Garis"</span> (pelanggaran dihitung berdasarkan kontak fisik/pijakan, bukan dinding imajiner di udara). Pelanggaran dinyatakan sah terjadi apabila terdapat alas kaki atau bagian tubuh peserta maupun Komandan Peleton yang secara nyata menyentuh/menginjak garis atau menapak di luar area batas yang telah ditentukan. Setiap bentuk pelanggaran akan ditandai secara langsung melalui kibasan bendera oleh Hakim Garis dan dikenakan sanksi pemotongan nilai pada rekapitulasi penilaian.
                      </li>
                      <li>
                        <strong className="text-slate-900">Sinyal dan Alat Komunikasi Petugas Lapangan:</strong> Untuk menjamin keteraturan dan kepastian teknis di lapangan, panitia menetapkan penggunaan sinyal resmi: peluit digunakan khusus sebagai penanda perhitungan waktu lomba oleh Timekeeper, sedangkan bendera digunakan khusus oleh Hakim Garis untuk menandai terjadinya pelanggaran garis batas arena dan batas Kotak Danton.
                      </li>
                      <li>
                        <strong className="text-slate-900">Gerakan Penyesuaian:</strong> Gerakan tambahan di tempat yang bertujuan untuk memperbaiki posisi atau formasi peleton di dalam arena lomba. Gerakan penyesuaian HANYA meliputi: Hadap (Kanan/Kiri/Serong), Balik (Kanan), dan Langkah Terbatas (langkah ke Kiri/Kanan/Depan/Belakang). Gerakan penyesuaian dibatasi maksimal 3 (tiga) kali selama peleton tampil di arena. Ditegaskan bahwa dilarang keras menggunakan gerakan tambahan yang menyerupai materi sebelum dan sesudah gerakan tambahan tersebut dilakukan.
                      </li>
                      <li>
                        <strong className="text-slate-900">Spesifikasi Dimensi Arena Perlombaan:</strong> Perlombaan dilaksanakan secara terpisah dan simultan di Kampus Terpadu Sedayu pada dua arena resmi:
                        <ul className="list-[lower-alpha] pl-5 mt-1.5 space-y-1">
                          <li><strong className="text-slate-800">Tingkat SD/MI:</strong> Arena 1 bertempat di Lapangan Basket dengan ukuran 25 meter x 14 meter. Durasi tampil maksimal 10 menit.</li>
                          <li><strong className="text-slate-800">Tingkat SMP/MTs:</strong> Arena 2 bertempat di Pelataran Embung dengan ukuran 26 meter x 15 meter. Durasi tampil maksimal 13 menit.</li>
                        </ul>
                      </li>
                      <li>
                        <strong className="text-slate-900">Ketentuan Pendamping dan Dokumentasi Peleton:</strong> Setiap peleton didampingi oleh maksimal 1 (satu) orang Official (Pelatih/Pembina), 2 (dua) orang Pendukung Resmi (masing-masing dapat berfungsi sebagai Medis dan Dokumentasi), serta seluruh anggota cadangan resmi. Petugas dokumentasi dari pihak peleton hanya diizinkan mengambil dokumentasi dari batas area yang telah ditentukan oleh panitia, dilarang keras berada di posisi yang sejajar dengan meja Dewan Juri, serta tidak diperkenankan menghalangi pandangan maupun mengganggu jalannya perlombaan dan proses penilaian.
                      </li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* B. PRA-LOMBA - TEKNIS TECHNICAL MEETING */}
            {shouldShow('tm') && (
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('tm')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                      B
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">B. Tahap I: Pra-Lomba – Teknis Technical Meeting (TM) Peserta</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('tm') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('tm') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <ol className="list-decimal pl-5 space-y-2.5">
                      <li><strong className="text-slate-900">Waktu dan Tempat Pelaksanaan:</strong> Dilaksanakan pada hari Sabtu, 9 Januari 2027 pukul 13.00 - 16.30 WIB bertempat di Aula Kampus Induk Madrasah Mu'allimin Muhammadiyah Yogyakarta (Jl. Letjen S. Parman No. 68, Patangpuluhan, Wirobrajan, Kota Yogyakarta).</li>
                      <li><strong className="text-slate-900">Ketentuan Kehadiran Delegasi:</strong> Setiap peleton wajib mendelegasikan maksimal 2 (dua) orang perwakilan resmi (Official/Pelatih/Pembina atau Komandan Peleton). Seluruh perwakilan wajib mengenakan pakaian rapi, sopan, dan bersepatu. Perwakilan putri wajib mengenakan pakaian berlengan panjang.</li>
                      <li><strong className="text-slate-900">Agenda Registrasi dan Verifikasi Berkas Fisik Asli (12.30 - 13.00 WIB):</strong> Sebelum memasuki ruang rapat pleno, perwakilan peleton melakukan presensi dan menyerahkan berkas fisik asli di meja registrasi TM, meliputi: (a) Surat Tugas / Rekomendasi Resmi Kepala Sekolah asli berstempel basah yang memuat daftar nama lengkap peleton (1 Danton, 21 Anggota Inti, 3 Cadangan, 1 Official, dan 2 Pendukung Resmi); (b) Pakta Integritas bermaterai Rp 10.000 yang telah ditandatangani oleh Official resmi sekolah.</li>
                      <li><strong className="text-slate-900">Pemaparan Materi Teknis & Juknis Lomba (13.00 - 14.30 WIB):</strong> Divisi Acara dan Perwakilan Dewan Juri memaparkan secara mendalam: penyamaan persepsi teknik materi gerakan PBB berdasar Perpang TNI No. 58 & 57 Tahun 2018 (serta Perpang TNI No. 45 Tahun 2014 untuk Hormat Kanan/Kiri); standar pengucapan aba-aba, tempo gerakan, tata cara komandan memposisikan peleton, dan perbandingan penilaian peleton (Kebenaran Gerak dan Kekompakan 1:1, serta 4 aspek komandan peleton); penjelasan batasan gerakan penyesuaian, prinsip garis, bendera hakim garis, dan kotak danton; serta mekanisme perhitungan waktu resmi menggunakan stopwatch serta publikasi hasil penilaian melalui portal peserta di website lbb.tontimuallimin.com menggunakan akun Gmail masing-masing peleton. Seluruh nilai peserta akan ditampilkan secara langsung pada akun masing-masing peleton setelah pelaksanaan upacara dan pengumuman kejuaraan.</li>
                      <li><strong className="text-slate-900">Sesi Tanya Jawab Teknis (14.30 - 15.15 WIB):</strong> Peserta diberikan ruang diskusi langsung bersama Dewan Juri ataupun Panitia guna menyamakan persepsi serta mengklarifikasi hal-hal teknis yang belum jelas. Setiap keputusan dan kesepakatan akhir akan dicatat ke dalam Notulensi Resmi TM sebagai rujukan sah perlombaan.</li>
                      <li><strong className="text-slate-900">Pengundian Resmi (Lotting) Nomor Urut Tampil (15.15 - 16.00 WIB):</strong> Panitia memimpin undian terbuka nomor urut tampil resmi: Tingkat SD/MI: Nomor undian SD-111 sampai dengan SD-175; Tingkat SMP/MTs: Nomor undian SMP-222 sampai dengan SMP-286. Penukaran nomor urut tampil hanya diperkenankan dilakukan di hadapan panitia dan disaksikan oleh peserta lain selama forum TM masih berlangsung.</li>
                      <li><strong className="text-slate-900">Konfirmasi Uji Coba Lapangan & Penutupan (16.00 – 16.30 WIB):</strong> Official peleton diarahkan untuk mengisi survei kesediaan uji coba lapangan secara mandiri melalui web-app lbb.tontimuallimin.com. Panitia selanjutnya akan menyusun dan merilis jadwal resmi pembagian slot waktu uji coba lapangan berdasarkan data survei tersebut.</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* C. PRA-LOMBA - TEKNIS UJI COBA LAPANGAN */}
            {shouldShow('trial') && (
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('trial')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                      C
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">C. Tahap I: Pra-Lomba – Teknis Uji Coba Lapangan (Familiarisasi Medan)</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('trial') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('trial') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <ol className="list-decimal pl-5 space-y-2.5">
                      <li><strong className="text-slate-900">Waktu dan Tempat Pelaksanaan:</strong> Dilaksanakan pada hari Sabtu, 16 Januari 2027 pukul 07.00 – 13.00 WIB bertempat di Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta (Sedayu, Bantul).</li>
                      <li><strong className="text-slate-900">Sistem Pelaksanaan Paralel di Dua Arena:</strong>
                        <ul className="list-[lower-alpha] pl-5 mt-1 space-y-1">
                          <li><strong className="text-slate-800">Arena 1 (Lapangan Basket Kampus Terpadu Sedayu):</strong> Khusus untuk 18 Peleton Tingkat SD/MI (ukuran 25 meter x 14 meter).</li>
                          <li><strong className="text-slate-800">Arena 2 (Pelataran Embung Kampus Terpadu Sedayu):</strong> Khusus untuk 18 Peleton Tingkat SMP/MTs (ukuran 26 meter x 15 meter).</li>
                        </ul>
                      </li>
                      <li><strong className="text-slate-900">Alokasi Waktu Resmi per Kontingen:</strong> Setiap peleton memperoleh alokasi waktu tepat 15 (lima belas) menit, dengan rincian operasional:
                        <ul className="list-[lower-alpha] pl-5 mt-1 space-y-1">
                          <li>10 (sepuluh) menit waktu efektif uji coba arena untuk tingkat SD/MI dan 13 (tiga belas) menit untuk tingkat SMP/MTs difungsikan untuk adaptasi lapangan, penyesuaian langkah, orientasi batas arena, serta pengujian akustik vokal danton.</li>
                          <li>Sisa durasi waktu dialokasikan untuk proses transisi keluar-masuk peleton antar kontingen.</li>
                          <li>Manajemen waktu dikendalikan secara ketat oleh Timekeeper panitia didampingi oleh Liaison Officer (LO) masing-masing peleton.</li>
                        </ul>
                      </li>
                      <li><strong className="text-slate-900">Ketentuan Pakaian dan Perlengkapan Uji Coba:</strong> Peserta diperbolehkan mengenakan seragam olahraga sekolah atau seragam latihan masing-masing yang rapi, sopan, dan bersepatu. Ditegaskan bahwa <span className="text-red-600 font-bold">DILARANG KERAS menggunakan sol sepatu berpines/paku atau modifikasi logam tajam</span> yang berpotensi merusak permukaan arena.</li>
                      <li><strong className="text-slate-900">Fokus Orientasi Medan:</strong> Uji coba lapangan dimanfaatkan untuk:
                        <ul className="list-[lower-alpha] pl-5 mt-1 space-y-1">
                          <li>Adaptasi tekstur dan tingkat cengkeraman permukaan paving/lantai arena terhadap alas kaki peleton.</li>
                          <li>Orientasi batas-batas garis arena dan tata letak meja Dewan Juri.</li>
                          <li>Penyesuaian artikulasi, volume, dan gema vokal Komandan Peleton di ruang terbuka.</li>
                          <li>Simulasi alur pergerakan masuk dan keluar arena lomba bersama Liaison Officer (LO). Uji coba ini murni merupakan kegiatan familiarisasi medan dan <span className="font-semibold text-slate-800">TIDAK ADA penilaian dari Dewan Juri</span>.</li>
                        </ul>
                      </li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* D. HARI PERLOMBAAN - REGISTRASI & UPACARA PEMBUKAAN */}
            {shouldShow('reg') && (
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('reg')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                      D
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">D. Tahap II: Hari Perlombaan – Registrasi Ulang s.d. Upacara Pembukaan</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('reg') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('reg') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <ol className="list-decimal pl-5 space-y-2.5">
                      <li><strong className="text-slate-900">Kedatangan dan Registrasi Ulang Kontingen (06.00 – 09.00 WIB):</strong> Prosedur kedatangan dan daftar ulang kontingen di Meja Registrasi Resmi (Ruang Registrasi Gedung Madrasah Lantai 1):
                        <ul className="list-[lower-alpha] pl-5 mt-1.5 space-y-1">
                          <li>Official menyerahkan 1 (satu) kartu identitas asli (KTP/SIM perwakilan kontingen) kepada panitia sebagai jaminan ketertiban, kebersihan, dan keutuhan fasilitas ruang basecamp.</li>
                          <li>Official menerima kit fasilitas kontingen: (1) Nomor Dada Peleton resmi; (2) ID Card Resmi (1 Official & 2 Pendukung Resmi); (3) 1 (satu) dus Air Minum Kemasan (botol) per peleton; serta (4) 2 (dua) kantong sampah terpilah (Organik dan Anorganik).</li>
                          <li>Nomor dada peleton wajib disematkan pada dada sebelah kiri personel Penjuru Depan Tengah / Saf 2 Banjar 1 (S2B1).</li>
                          <li>Peleton diarahkan dan dikawal oleh LO pendamping menuju ruang kelas basecamp resmi yang telah ditentukan panitia.</li>
                          <li>Meja registrasi ulang ditutup tepat pukul 09.00 WIB. Peleton yang tidak melakukan daftar ulang hingga batas waktu tersebut dinyatakan mengundurkan diri dan tidak diperkenankan tampil.</li>
                          <li>Regulasi Parkir Kendaraan Kontingen:
                            <ul className="list-[circle] pl-5 mt-1 space-y-1">
                              <li><strong className="text-slate-800">Bus / Kendaraan Besar Kontingen:</strong> Dilarang parkir di dalam area Kampus Terpadu Mu'allimin; bus hanya diperkenankan masuk untuk proses drop-off peserta serta perlengkapan di Drop Zone resmi, kemudian wajib segera menuju dan parkir di kantong parkir Lapangan Hibrida Argomulyo.</li>
                              <li><strong className="text-slate-800">Kendaraan Roda 4 (Mobil) dan Roda 2 (Motor):</strong> Diparkirkan di kantong parkir internal Kampus Terpadu Sedayu sesuai arahan petugas, dan apabila kapasitas parkir internal telah penuh, arus kendaraan dialihkan menuju kantong parkir Lapangan Hibrida Argomulyo.</li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                      <li><strong className="text-slate-900">Sterilisasi Arena Perlombaan (06.45 WIB):</strong> Tepat pukul 06.45 WIB, seluruh arena perlombaan (Arena 1 & Arena 2 serta Lapangan Mini Soccer) dinyatakan steril dari segala aktivitas umum. Seluruh peserta upacara pembukaan wajib telah siap berbaris tertib di Lapangan Upacara.</li>
                      <li><strong className="text-slate-900">Pelaksanaan Upacara Pembukaan Resmi (07.00 – 07.45 WIB):</strong>
                        <ul className="list-[lower-alpha] pl-5 mt-1.5 space-y-1">
                          <li>Peleton dengan nomor urut undian tampil: SD-111, SD-113, SD-115, SD-117, SD-119 (Tingkat SD/MI) serta SMP-222, SMP-224, SMP-226, SMP-228, SMP-240 (Tingkat SMP/MTs) <span className="font-bold text-red-700">WAJIB MENGIKUTI UPACARA PEMBUKAAN</span> dengan formasi lengkap: 1 Komandan Peleton dan 15 Anggota Peleton (5 trio lengkap) mengenakan seragam tonti resmi lengkap.</li>
                          <li>Pemeriksaan kehadiran barisan upacara dilaksanakan oleh panitia 15 menit sebelum upacara dimulai (pukul 06.45 WIB).</li>
                          <li>Peleton yang diwajibkan hadir namun tidak mengikuti upacara pembukaan dikenakan <span className="font-bold text-red-700">sanksi pemotongan nilai sebesar -150 poin</span>.</li>
                          <li>Peleton yang terlambat memasuki barisan upacara dikenakan <span className="font-bold text-red-700">sanksi pemotongan nilai sebesar -50 poin per kelipatan 5 (lima) menit keterlambatan</span>.</li>
                          <li>Peleton dengan nomor urut tampil lainnya dipersilakan mengkondisikan diri secara tertib di ruang basecamp masing-masing sembari menunggu jadwal pemanggilan tampil.</li>
                        </ul>
                      </li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* E. ALUR PERSIAPAN & PELAKSANAAN TAMPIL DI ARENA */}
            {shouldShow('arena') && (
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('arena')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                      E
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">E. Tahap III: Hari Perlombaan – Alur Persiapan & Pelaksanaan Tampil di Arena</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('arena') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('arena') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <ol className="list-decimal pl-5 space-y-2.5">
                      <li><strong className="text-slate-900">Pemberitahuan Kesiapan Peleton di Basecamp:</strong> LO mendatangi basecamp 15 menit sebelum jadwal pemanggilan resmi ke DP 1 guna memastikan kesiapan pasukan, kelengkapan atribut seragam tonti, serta keutuhan personel.</li>
                      <li><strong className="text-slate-900">Pemanggilan Resmi & Tahap Kesiapan di DP 1 (Pos Pengecekan & Verifikasi):</strong>
                        <ul className="list-[lower-alpha] pl-5 mt-1 space-y-1">
                          <li>Peleton <span className="text-red-600 font-bold">HANYA DIPERBOLEHKAN menuju dan memasuki area DP 1 setelah dipanggil resmi oleh panitia</span> melalui pengeras suara (mic). Peleton dilarang keras memasuki area DP 1 sebelum dipanggil resmi.</li>
                          <li>Peleton yang tidak hadir di DP 1 setelah dilakukan 3 (tiga) kali pemanggilan resmi dengan interval masing-masing 2 (dua) menit dikenakan <span className="text-red-700 font-bold">sanksi pemotongan nilai sebesar -100 poin</span>. Apabila setelah sanksi tersebut diberikan peleton tetap tidak hadir saat peleton urutan berikutnya telah menyelesaikan penampilannya di arena, maka peleton tersebut <span className="text-red-700 font-bold">dinyatakan DISKUALIFIKASI</span>.</li>
                          <li>Di DP 1, petugas panitia melakukan:
                            <ul className="list-[circle] pl-5 mt-1 space-y-1">
                              <li>Pemeriksaan komposisi personel: tepat 22 orang masuk arena (1 Komandan Peleton dan 21 Pasukan Inti). Pelanggaran atas kekurangan personel dikenakan sanksi pemotongan nilai -75 poin per personel yang kurang.</li>
                              <li>Pemeriksaan pemasangan nomor dada peleton di dada kiri personel S2B1.</li>
                              <li>Pemeriksaan fisik sol sepatu seluruh personel. Ditegaskan bahwa <span className="text-red-600 font-bold">DILARANG KERAS menggunakan pines, paku payung, spikes, logam tajam, atau pul sepatu bola/futsal bergerigi tajam</span>. Penggunaan modifikasi terlarang tersebut berakibat personel yang bersangkutan dilarang tampil.</li>
                              <li>Pelaporan pergantian cadangan terencana kepada petugas panitia di DP 1.</li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                      <li><strong className="text-slate-900">Tahap Ruang Tunggu di DP 2 (Holding Area Siap Tampil):</strong> Setelah dinyatakan lolos verifikasi dari DP 1, peleton diarahkan bergeser menuju DP 2 yang difungsikan murni sebagai Ruang Tunggu Siap Tampil. Peleton menjaga ketenangan, fokus mental, dan berbaris rapi menunggu aba-aba dari pengatur lapangan untuk memasuki arena lomba.</li>
                      <li><strong className="text-slate-900">Memasuki Arena dan Penentuan Posisi Center Juri:</strong> Komandan Peleton memimpin pasukannya memasuki arena menuju titik tengah arena sehingga posisi peleton berada tepat di tengah (center) menghadap langsung ke arah meja Dewan Juri. Sebelum melapor, danton mengondisikan pasukannya terlebih dahulu (diberi aba-aba siap atau diluruskan).</li>
                      <li><strong className="text-slate-900">Penghormatan Awal kepada Dewan Juri:</strong>
                        <ul className="list-[lower-alpha] pl-5 mt-1 space-y-1">
                          <li>Komandan Peleton mengambil posisi di samping kanan barisan pasukannya menghadap ke arah meja Dewan Juri, lalu memimpin penghormatan dengan lantang: <em>"Kepada Dewan Juri, Hormat = GERAK"</em>.</li>
                          <li><span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">WAKTU TAMPIL RESMI (STOPWATCH) DIMULAI</span> tepat saat aba-aba pelaksanaan penghormatan pembuka (kata <em>"GERAK"</em>) dihentakkan oleh Komandan Peleton.</li>
                        </ul>
                      </li>
                      <li><strong className="text-slate-900">Laporan Pembuka dan Transisi ke Kotak Danton:</strong>
                        <ul className="list-[lower-alpha] pl-5 mt-1 space-y-1">
                          <li>Setelah aba-aba <em>"Tegak = GERAK"</em>, Komandan Peleton melangkah mengambil posisi di depan tengah peleton menghadap meja Dewan Juri untuk menyampaikan laporan resmi: <em>"Lapor, peleton dengan nomor dada (sebutkan nomor urut dalam ejaan kata, contoh: satu satu satu) siap melaksanakan materi gerakan lomba."</em></li>
                          <li>Setelah melapor, Komandan Peleton melangkah memasuki Kotak Danton (1,5 x 1,5 meter) dengan posisi menghadap peleton (posisi komando), dilarang keras membelakangi meja juri, dan memimpin penampilan seluruh materi gerakan secara urut dan tuntas.</li>
                        </ul>
                      </li>
                      <li><strong className="text-slate-900">Durasi Waktu dan Sinyal Peluit Timekeeper:</strong>
                        <ul className="list-[lower-alpha] pl-5 mt-1 space-y-1">
                          <li>Durasi waktu tampil maksimal adalah <strong className="text-slate-900">10 (sepuluh) menit untuk Tingkat SD/MI</strong> dan <strong className="text-slate-900">13 (tiga belas) menit untuk Tingkat SMP/MTs</strong>.</li>
                          <li><strong className="text-slate-800">Sinyal Peluit 1 Kali Panjang:</strong> Ditiupkan sebagai peringatan resmi bahwa waktu tampil tersisa 1 (satu) menit (pada menit ke-9 untuk SD/MI dan menit ke-12 untuk SMP/MTs).</li>
                          <li><strong className="text-slate-800">Sinyal Peluit 2 Kali Panjang:</strong> Ditiupkan sebagai penanda resmi bahwa batas waktu tampil telah habis tepat pada menit ke-10 untuk SD/MI dan menit ke-13 untuk SMP/MTs. Peleton wajib segera menyelesaikan materi dan meninggalkan arena perlombaan.</li>
                        </ul>
                      </li>
                      <li><strong className="text-slate-900">Sinyal Pelanggaran Garis:</strong> Hakim Garis mengibaskan bendera khusus sebagai penanda resmi setiap kali terjadi pelanggaran garis batas arena oleh anggota pasukan maupun batas Kotak Danton oleh Komandan Peleton berdasarkan asas "Garis sebagai Garis".</li>
                      <li><strong className="text-slate-900">Ketentuan Khusus Atribut Terjatuh di Arena:</strong> Apabila terdapat atribut pakaian atau seragam peserta (seperti topi/peci, dasi, pin, lencana, tanda pangkat, sabuk, selempang, sarung tangan, atau tali sepatu) yang terlepas atau terjatuh di dalam arena lomba, <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">TIDAK DIKENAKAN SANKSI PENALTI PENGURANGAN NILAI (0 POIN)</span>. Personel peleton dilarang memungut atribut yang terjatuh sampai seluruh rangkaian penampilan selesai dan peleton telah keluar dari arena lomba.</li>
                      <li><strong className="text-slate-900">Titik Pergantian Pemain di Arena (Materi Bubar):</strong>
                        <ul className="list-[lower-alpha] pl-5 mt-1 space-y-1">
                          <li>Pergantian pemain cadangan di dalam arena hanya diperbolehkan pada titik pergantian resmi, yaitu saat materi <strong className="text-slate-900">Bubar Peleton</strong> (di antara Materi Gerakan Nomor 16 dan 17 untuk Tingkat SD/MI; serta di antara Materi Gerakan Nomor 22 dan 23 untuk Tingkat SMP/MTs).</li>
                          <li>Proses pergantian pemain tidak menghentikan perhitungan waktu (stopwatch tetap berjalan normal).</li>
                          <li>Pergantian Komandan Peleton di dalam arena hanya diperkenankan dalam keadaan darurat medis (sakit parah/pingsan) dan digantikan oleh salah satu personel pasukan yang berada di arena, dengan konsekuensi hak peleton untuk memperebutkan kategori Komandan Peleton Terbaik dinyatakan gugur.</li>
                        </ul>
                      </li>
                      <li><strong className="text-slate-900">Laporan Penutup, Penghormatan Penutup, dan Penghentian Waktu:</strong>
                        <ul className="list-[lower-alpha] pl-5 mt-1 space-y-1">
                          <li>Setelah seluruh materi gerakan selesai dilaksanakan, Komandan Peleton melangkah keluar dari Kotak Danton menuju posisi di depan peleton menghadap meja Dewan Juri untuk menyampaikan laporan penutup: <em>"Lapor, peleton dengan nomor dada (sebutkan nomor urut dalam ejaan kata) telah melaksanakan materi lomba, laporan selesai."</em></li>
                          <li>Komandan Peleton kemudian melangkah mengambil posisi di samping kanan barisan pasukannya menghadap ke arah meja Dewan Juri, lalu memimpin penghormatan penutup: <em>"Kepada Dewan Juri, Hormat = GERAK"</em>, dan diakhiri dengan aba-aba: <em>"Tegak = GERAK"</em>.</li>
                          <li><span className="font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">WAKTU TAMPIL RESMI (STOPWATCH) BERHENTI</span> tepat saat aba-aba pelaksanaan tegak penutup (kata <em>"GERAK"</em>) dihentakkan oleh Komandan Peleton.</li>
                        </ul>
                      </li>
                      <li><strong className="text-slate-900">Alur Keluar Arena dan Pengembalian Nomor Dada:</strong> Komandan Peleton memimpin pasukannya melangkah keluar arena perlombaan secara tertib menuju titik keluar. Di pos keluar arena, Official peleton wajib mengembalikan nomor dada peleton kepada petugas panitia, selanjutnya peleton dipandu oleh LO kembali menuju ruang basecamp kontingen.</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* F. PASCA-LOMBA - PENILAIAN, LIVE SCORE & SANGGAH */}
            {shouldShow('score') && (
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('score')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                      F
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">F. Tahap IV: Pasca-Lomba – Sistem Penilaian, Rolling Release, Sanggah & Penentuan Juara</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('score') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('score') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <ol className="list-decimal pl-5 space-y-2.5">
                      <li><strong className="text-slate-900">Dewan Juri Independen:</strong> Penilaian dilakukan oleh 6 (enam) orang Dewan Juri independen dan profesional dari unsur TNI, POLRI, dan Purna Paskibraka Indonesia (PPI) DIY (3 Juri bertugas di Arena 1 SD/MI dan 3 Juri bertugas di Arena 2 SMP/MTs). Keputusan Dewan Juri mengenai mutu dan kebenaran teknis gerakan bersifat mutlak dan tidak dapat diganggu gugat.</li>
                      <li><strong className="text-slate-900">Kriteria Penentuan Juara Peleton (Rasio 1:1):</strong> Penilaian peleton menggunakan rasio perbandingan 1:1, yaitu Kebenaran Teknik Gerakan PBB (1) dan Kekompakan Peleton (1) dengan rentang nilai masing-masing 50 sampai dengan 90 poin. Rumus nilai akhir peleton:
                        <div className="p-3 my-1.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800">
                          Nilai Akhir Peleton = (Rata-rata Nilai Kebenaran Gerak 3 Juri + Rata-rata Nilai Kekompakan 3 Juri) – Akumulasi Sanksi Penalti
                        </div>
                        <p className="text-xs text-slate-600">
                          Apabila terjadi nilai akhir yang sama (seri/draw) antar peleton, penentuan peringkat kejuaraan dilakukan berdasarkan indikator prioritas (tie-breaker): (1) Nilai murni tertinggi pada aspek Kebenaran Teknik Gerakan PBB; (2) Nilai murni tertinggi pada aspek Kekompakan Peleton; (3) Akumulasi poin penalti pengurangan nilai yang paling sedikit; (4) Keputusan musyawarah Sidang Pleno Dewan Juri.
                        </p>
                      </li>
                      <li><strong className="text-slate-900">Kriteria Penentuan Komandan Peleton Terbaik (Total Bobot 100%):</strong>
                        <ul className="list-[lower-alpha] pl-5 mt-1 space-y-1">
                          <li>Penguasaan Materi Gerakan & Urutan Aba-Aba (Bobot 35%).</li>
                          <li>Kualitas Suara, Artikulasi, Frekuensi, dan Volume Vokal (Bobot 25%).</li>
                          <li>Sikap Tampang, Ketegasan, dan Kerapian Pelaporan (Bobot 20%).</li>
                          <li>Penguasaan Arena dan Penempatan Posisi Pasukan (Bobot 20%).</li>
                          <li>Kriteria tie-breaker untuk nilai Komandan Peleton yang sama: (1) Nilai tertinggi Penguasaan Materi; (2) Nilai tertinggi Kualitas Suara; (3) Nilai tertinggi Sikap Tampang; (4) Keputusan Sidang Pleno Dewan Juri.</li>
                        </ul>
                      </li>
                      <li><strong className="text-slate-900">Sistem Perolehan Poin Juara Umum (Tingkat SD/MI dan SMP/MTs berdiri sendiri):</strong>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-2 text-xs font-mono">
                          <span className="bg-slate-100 p-2 rounded">Juara 1 Peleton: 6 Poin</span>
                          <span className="bg-slate-100 p-2 rounded">Juara 2 Peleton: 5 Poin</span>
                          <span className="bg-slate-100 p-2 rounded">Juara 3 Peleton: 4 Poin</span>
                          <span className="bg-slate-100 p-2 rounded">Juara Harapan 1: 3 Poin</span>
                          <span className="bg-slate-100 p-2 rounded">Juara Harapan 2: 2 Poin</span>
                          <span className="bg-slate-100 p-2 rounded">Juara Harapan 3: 1 Poin</span>
                          <span className="bg-yellow-50 text-yellow-900 p-2 rounded border border-yellow-200">Danton Terbaik 1: 3 Poin</span>
                          <span className="bg-yellow-50 text-yellow-900 p-2 rounded border border-yellow-200">Danton Terbaik 2: 2 Poin</span>
                          <span className="bg-yellow-50 text-yellow-900 p-2 rounded border border-yellow-200">Danton Terbaik 3: 1 Poin</span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Piala Bergilir Juara Umum dianugerahkan kepada pangkalan sekolah yang mengumpulkan akumulasi poin kejuaraan terbanyak. Kriteria tie-breaker Juara Umum: (1) Pangkalan sekolah yang meraih predikat Juara Peleton tertinggi; (2) Akumulasi total nilai murni Peleton terbaik; (3) Nilai murni Kebenaran Teknik PBB; (4) Keputusan musyawarah Sidang Pleno Dewan Juri.
                        </p>
                      </li>
                      <li><strong className="text-slate-900">Transparansi Penilaian (Rolling Release Berbasis Akun Gmail Peleton):</strong>
                        <ul className="list-[lower-alpha] pl-5 mt-1 space-y-1">
                          <li>Sistem penilaian menerapkan transparansi penuh dengan mekanisme rolling release berkala.</li>
                          <li>Rekapitulasi lembar penilaian Dewan Juri yang telah divalidasi oleh panitia input data akan dirilis secara bertahap pada portal website lbb.tontimuallimin.com, dengan estimasi waktu publikasi kurang lebih 1 (satu) jam setelah peleton yang bersangkutan selesai tampil di arena.</li>
                          <li>Official peleton dapat mengakses dan memantau rincian lembar penilaian tersebut secara mandiri dengan melakukan login menggunakan akun Gmail masing-masing yang telah terdaftar resmi saat proses registrasi awal.</li>
                        </ul>
                      </li>
                      <li><strong className="text-slate-900">Mekanisme Pengajuan Sanggah Resmi:</strong>
                        <ul className="list-[lower-alpha] pl-5 mt-1 space-y-1">
                          <li>Sanggahan atau protes resmi HANYA DITERIMA terhadap dugaan kekeliruan administratif non-penilaian, seperti: kesalahan penjumlahan skor (tabulasi), kekeliruan input sistem digital, atau ketidaksesuaian catatan sanksi penalti lapangan. Materi kualitas gerak dan mutu penilaian Dewan Juri mutlak tidak dapat disanggah.</li>
                          <li>Masa pengajuan sanggahan resmi dibuka secara bergulir sejak rekapitulasi nilai peleton dirilis pada portal dan <span className="font-bold text-red-700">DITUTUP SECARA SERENTAK TEPAT PUKUL 15.00 WIB</span> pada hari perlombaan.</li>
                          <li>Sanggahan wajib diajukan secara TERTULIS menggunakan Formulir Sanggahan Resmi oleh 1 (satu) orang Official resmi peleton di Ruang Informasi Panitia, dengan melampirkan bukti-bukti faktual yang sah serta membayar biaya deposit sanggah sesuai ketentuan. Panitia TIDAK MELAYANI sanggahan lisan.</li>
                          <li>Sidang sanggah dipimpin langsung oleh Ketua Panitia Pelaksana bersama Koordinator Dewan Juri. Putusan sidang sanggah bersifat final, mengikat, dan berkekuatan hukum tetap.</li>
                        </ul>
                      </li>
                      <li><strong className="text-slate-900">Ketentuan Checkout Basecamp & Apel Penutupan:</strong>
                        <ul className="list-[lower-alpha] pl-5 mt-1 space-y-1">
                          <li>Seluruh kontingen diwajibkan menyelesaikan proses pemeriksaan kebersihan ruang kelas dan checkout basecamp secara tuntas paling lambat pukul 15.00 WIB.</li>
                          <li>Setelah proses checkout tuntas, seluruh kontingen diarahkan mengikuti Upacara/Apel Penutupan Resmi dan Pengumuman Kejuaraan yang dimulai tepat pukul 15.30 WIB di Lapangan Upacara Utama.</li>
                        </ul>
                      </li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* G. GANGGUAN SISTEM DIGITAL DAN PROSEDUR BACKUP */}
            {shouldShow('digital') && (
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('digital')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-black flex items-center justify-center text-sm">
                      G
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">G. Gangguan Sistem Digital dan Prosedur Backup (Contingency Plan)</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('digital') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('digital') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-3 animate-fade">
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Sistem e-scoring digital didukung infrastruktur server lokal mandiri <em>(Local Area Network / offline server backup)</em> untuk mengantisipasi gangguan jaringan internet.</li>
                      <li>Apabila terjadi gangguan perangkat elektronik atau sistem penilaian digital, penilaian seketika dialihkan menggunakan Lembar Penilaian Manual Fisik (kertas) yang telah distempel resmi oleh Panitia. Nilai manual memiliki kekuatan hukum yang setara dengan input digital.</li>
                      <li>Jika terjadi pemadaman listrik total, panitia pelaksana menyiagakan genset cadangan darurat dengan waktu jeda aktivasi maksimal 5 menit. Penampilan peleton yang terhenti akibat pemadaman listrik diatur sesuai ketentuan Keadaan Kahar.</li>
                      <li>Seluruh riwayat input data penilaian <em>(audit trail)</em> tersimpan otomatis dan diawasi oleh tim IT independen untuk menjamin integritas dan transparansi angka penilaian.</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* H. SANKSI DAN PENALTI PENGURANGAN NILAI */}
            {shouldShow('penalty') && (
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('penalty')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-red-100 text-red-700 font-black flex items-center justify-center text-sm">
                      H
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">H. Ketentuan Sanksi dan Penalti Pengurangan Nilai</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('penalty') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('penalty') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <p className="text-xs text-slate-500 italic">
                      Pelanggaran terhadap regulasi teknis lapangan dikenakan sanksi pemotongan nilai secara kumulatif pada lembar rekapitulasi nilai akhir:
                    </p>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 text-slate-800 uppercase font-black">
                          <tr>
                            <th className="py-2.5 px-3">Jenis Pelanggaran</th>
                            <th className="py-2.5 px-3 text-center">Besaran Penalti</th>
                            <th className="py-2.5 px-3">Keterangan / Regulasi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {PENALTIES.map((p, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-bold text-slate-900">{p.label}</td>
                              <td className="py-2 px-3 text-center">
                                <span className={`font-mono font-black px-2 py-0.5 rounded text-xs ${
                                  p.value.includes('0 Poin') ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                                }`}>
                                  {p.value}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-slate-600 text-[11px]">
                                {idx === 0 && 'Nomor undian SD-111, 113, 115, 117, 119 & SMP-222, 224, 226, 228, 240 wajib hadir 1 danton + 15 anggota.'}
                                {idx === 1 && 'Dikenakan per kelipatan 5 menit keterlambatan memasuki barisan upacara.'}
                                {idx === 2 && 'Setelah 3x panggilan interval 2 menit; jika tetap absen: Diskualifikasi.'}
                                {idx === 3 && 'Personel masuk arena kurang dari 22 orang (1 Danton + 21 Pasukan).'}
                                {idx === 4 && 'Melebihi durasi resmi (SD > 10 menit, SMP > 13 menit) per rentang 1-30 detik.'}
                                {idx === 5 && 'Alas kaki/anggota tubuh menginjak garis arena atau keluar Kotak Danton 1,5x1,5m.'}
                                {idx === 6 && 'Gerakan penyesuaian (hadap/balik/langkah terbatas) melebihi batas 3 kali.'}
                                {idx === 7 && 'Gerakan terlewat namun dilakukan kemudian = Nilai Minimal; tidak dilakukan = Nilai 0.'}
                                {idx === 8 && 'Danton salah aba-aba tetapi pasukan bergerak hafalan = Nilai 0 & potong nilai danton.'}
                                {idx === 9 && 'Rangkaian bertanda (-) yang diselingi jeda/gerakan tambahan diberi Nilai Minimal.'}
                                {idx === 10 && 'Menyanyikan yel-yel, tepukan berirama, nyanyian selama penampilan resmi: Peringatan 1, 2, lalu penalti.'}
                                {idx === 11 && 'Topi/peci, dasi, pin, sarung tangan terlepas TIDAK dipotong nilai (0 poin).'}
                                {idx === 12 && 'Ruang basecamp ditinggalkan kotor / berantakan saat checkout.'}
                                {idx === 13 && 'Kerusakan/kehilangan sarpras kelas: KTP ditahan, ganti rugi fisik + denda Rp 500.000.'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <strong>Pencatatan Penalti:</strong> Seluruh sanksi pengurangan nilai dicatat secara langsung dan transparan oleh Hakim Garis, Timekeeper, dan Koordinator Lapangan ke dalam Berita Acara Pelanggaran Resmi serta disahkan oleh Perwakilan Dewan Juri.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* I. KEADAAN KAHAR (FORCE MAJEURE) */}
            {shouldShow('force') && (
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('force')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                      I
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">I. Keadaan Kahar (Force Majeure)</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('force') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('force') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-3 animate-fade">
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Keadaan kahar adalah peristiwa darurat di luar kemampuan manusia dan kendali teknis Panitia maupun Peserta, meliputi: bencana alam, gempa bumi, angin puting beliung, hujan badai ekstrem yang membahayakan keselamatan fisik peserta, huru-hara, atau gangguan massal tak terduga.</li>
                      <li>Kondisi Hujan Ringan (Gerimis): Perlombaan tetap dilanjutkan secara normal.</li>
                      <li>Kondisi Hujan Deras / Badai Ekstrem: Panitia Pelaksana bersama Dewan Juri berhak menghentikan perlombaan untuk sementara waktu demi keselamatan peserta.</li>
                      <li>Prosedur Pengulangan Tampil: Apabila perlombaan dihentikan saat suatu peleton sedang tampil akibat keadaan kahar, maka setelah kondisi dinyatakan aman dan kondusif kembali, peleton yang bersangkutan diberikan hak untuk mengulang penampilannya dari awal masuk arena, dengan perhitungan waktu (stopwatch) di-reset kembali ke 00:00. Nilai yang diakui secara sah adalah nilai dari penampilan ulangan tersebut.</li>
                      <li>Keputusan terkait status keadaan kahar, penundaan, penghentian, maupun penjadwalan ulang merupakan kewenangan mutlak Panitia Pelaksana setelah berkonsultasi dengan Dewan Juri.</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* J. PENUTUP */}
            {shouldShow('closing') && (
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('closing')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                      J
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">J. Penutup</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('closing') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('closing') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <p>
                      Petunjuk Teknis Lapangan ini menjadi pedoman operasional resmi bagi seluruh panitia, dewan juri, dan peserta LBB Mu'allimin Tahun 2027. Seluruh hal teknis tambahan yang disepakati bersama dalam forum Technical Meeting mengikat secara sah dan menjadi bagian tak terpisahkan dari juknis ini.
                    </p>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                        Pusat Layanan dan Narahubung Resmi:
                      </span>
                      <ul className="text-xs space-y-1 text-slate-600">
                        <li>• <strong className="text-slate-800">WhatsApp Helpdesk Resmi:</strong> 0819-4749-1505 (Admin Tonti Mu'allimin)</li>
                        <li>• <strong className="text-slate-800">Website Portal:</strong> https://lbb.tontimuallimin.com</li>
                        <li>• <strong className="text-slate-800">Email Resmi:</strong> lbb@tontimuallimin.com</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
