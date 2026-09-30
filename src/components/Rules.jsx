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
      def: 'definisi istilah clear area dp 1 dp 2 holding area kotak danton 1.5 semaphore hakim garis gerakan penyesuaian dimensi basket embung 25x14 26x15 official pendukung'.includes(query),
      tm: 'technical meeting tm peserta aula wirobrajan 10 januari 2027 berkas fisik surat tugas kepala sekolah pakta integritas undian lotting sd 01 smp 01'.includes(query),
      trial: 'uji coba lapangan familiarisasi medan sedayu 17 januari 2027 15 menit 10 menit efektif 5 menit transisi akustik vokal danton tekstur cengkeraman sepatu'.includes(query),
      reg: 'hari perlombaan daftar ulang check in 06.00 09.00 ktp jaminan nomor dada s2b1 kantong sampah terpilah sterilisasi upacara pembukaan nomor 1 5 15 anggota'.includes(query),
      arena: 'alur tampil arena posisi center juri laporan pembuka penghormatan peluit 1 kali panjang 2 menit habis semaphore merah atribut terjatuh pergantian pemain cadangan'.includes(query),
      score: 'sistem penilaian dewan juri tni polri ppi rasio 1 1 kebenaran gerak kekompakan 50 90 genap danton materi 35 suara 25 sikap 20 lapangan 20 juara umum poin 6 sanggah 60 menit'.includes(query),
      penalty: 'sanksi pengurangan nilai penalti upacara 150 50 keterlambatan dp 1 100 diskualifikasi personel 75 waktu 50 garis semaphore 50 penyesuaian 25 atribut 0 kotor 50'.includes(query),
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
                placeholder="Cari kata kunci juknis (contoh: penalti, kotak danton, semaphore, peluit, juri, sanggah)..."
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
                        <strong className="text-slate-900">Clear Area:</strong> Area steril di sekeliling arena perlombaan yang hanya dapat dimasuki oleh peleton yang sedang berkompetisi, maksimal 1 (satu) orang Official resmi (Pelatih/Pembina), 2 (dua) orang Pendukung (Medis/Dokumentasi) yang mengenakan ID Card resmi, serta panitia pelaksana dan Dewan Juri yang bertugas.
                      </li>
                      <li>
                        <strong className="text-slate-900">Daerah Persiapan (DP):</strong> Area transisi berjenjang sebelum peleton memasuki arena perlombaan, terdiri dari Daerah Persiapan 1 (DP 1) sebagai Pos Pengecekan Personel dan Verifikasi Fisik, serta Daerah Persiapan 2 (DP 2) yang difungsikan murni sebagai Ruang Tunggu Siap Tampil (Holding Area). Peleton dilarang keras memasuki DP 1 sebelum dipanggil resmi oleh panitia melalui pengeras suara (mic).
                      </li>
                      <li>
                        <strong className="text-slate-900">Prinsip Garis Batas dan Kotak Danton (1,5 x 1,5 meter):</strong> Garis batas arena perlombaan maupun garis Kotak Danton diperlakukan sebagai batas mutlak (dinding imajiner). Kotak Danton berukuran 1,5 x 1,5 meter terletak di batas depan arena menghadap langsung meja Dewan Juri. Komandan peleton memimpin peleton dari posisi tengah arena (menghadap dewan juri untuk penghormatan dan pelaporan awal), kemudian berpindah memasuki Kotak Danton untuk memimpin materi lomba. Selama memimpin materi perlombaan di Kotak Danton, Komandan Peleton wajib berada di dalam kotak dan dilarang menginjak maupun melangkah keluar dari garis batas kotak, kecuali pada materi yang mengharuskan keluar kotak seperti bubar peleton, berhimpun, atau untuk perhatian istirahat di tempat. Posisi komandan di dalam kotak menghadap pasukan (posisi komando) dan DILARANG KERAS membelakangi tepat di depan meja Dewan Juri. Pelanggaran dinyatakan sah terjadi apabila bagian tubuh atau alas kaki menginjak garis atau menapak di luar garis batas (ditandai dengan kibasan bendera semaphore merah oleh Hakim Garis).
                      </li>
                      <li>
                        <strong className="text-slate-900">Sinyal Petugas Lapangan:</strong> Peluit digunakan khusus sebagai penanda perhitungan waktu lomba oleh Timekeeper, sedangkan bendera semaphore merah digunakan khusus oleh Hakim Garis untuk menandai terjadinya pelanggaran garis batas arena dan batas Kotak Danton.
                      </li>
                      <li>
                        <strong className="text-slate-900">Gerakan Penyesuaian:</strong> Gerakan tambahan di tempat yang bertujuan untuk memperbaiki posisi atau formasi peleton di dalam arena lomba. Gerakan penyesuaian HANYA meliputi: Hadap (Kanan/Kiri/Serong), Balik (Kanan), dan Langkah Terbatas (langkah ke Kiri/Kanan/Depan/Belakang). Dibatasi maksimal 3 (tiga) kali selama peleton tampil di arena. Dilarang keras menggunakan gerakan tambahan yang menyerupai materi sebelum dan sesudah gerakan tersebut dilakukan.
                      </li>
                      <li>
                        <strong className="text-slate-900">Spesifikasi Dimensi 2 Arena Resmi:</strong>
                        <ul className="list-[lower-alpha] pl-5 mt-1.5 space-y-1">
                          <li><strong className="text-slate-800">Tingkat SD/MI:</strong> Arena 1 di Lapangan Basket Kampus Terpadu Sedayu, ukuran 25 meter x 14 meter. Durasi tampil maksimal 10 menit.</li>
                          <li><strong className="text-slate-800">Tingkat SMP/MTs:</strong> Arena 2 di Pelataran Embung Kampus Terpadu Sedayu, ukuran 26 meter x 15 meter. Durasi tampil maksimal 13 menit.</li>
                        </ul>
                      </li>
                      <li>
                        <strong className="text-slate-900">Ketentuan Pendamping:</strong> Setiap peleton didampingi maksimal 1 orang Official, 2 orang Pendukung (Medis/Dokumentasi), dan seluruh anggota cadangan resmi. Petugas dokumentasi hanya mengambil dokumentasi dari batas area yang ditentukan panitia tanpa mengganggu jalannya perlombaan dan penilaian juri.
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
                      <li><strong className="text-slate-900">Waktu & Tempat:</strong> Hari Sabtu, 10 Januari 2027 pukul 13.00 – 16.30 WIB bertempat di Aula Kampus Induk Madrasah Mu'allimin Muhammadiyah Yogyakarta (Jl. Letjen S. Parman No. 68, Wirobrajan, Kota Yogyakarta).</li>
                      <li><strong className="text-slate-900">Kehadiran Delegasi:</strong> Maksimal 2 orang perwakilan resmi per kontingen (Official/Pelatih/Pembina atau Danton) berpakaian rapi, sopan, dan bersepatu.</li>
                      <li><strong className="text-slate-900">Verifikasi Berkas Fisik Asli (12.30 – 13.00 WIB):</strong> Menyerahkan Surat Tugas Kepala Sekolah asli stempel basah (1 Danton, 21 Inti, 3 Cadangan, 1 Official, 2 Pendukung), Pakta Integritas bermaterai Rp 10.000, serta bukti NISN / Rapor / Akta Kelahiran asli/legalisir.</li>
                      <li><strong className="text-slate-900">Pemaparan Juknis & Tanya Jawab (13.00 – 15.15 WIB):</strong> Bedah teknis materi PBB bersama 6 Dewan Juri (TNI, POLRI, PPI), standar aba-aba, tempo langkah, demonstrasi batasan penyesuaian, kotak danton 1,5x1,5m, serta simulasi live score quick count website lbb.tontimuallimin.com.</li>
                      <li><strong className="text-slate-900">Pengundian Nomor Urut Tampil (15.15 – 16.00 WIB):</strong> Lotting terbuka nomor tampil SD (SD-01 s.d. SD-18) dan SMP (SMP-01 s.d. SMP-18). Penukaran nomor hanya sah di forum TM dan disaksikan peserta lain.</li>
                      <li><strong className="text-slate-900">Berita Acara TM & Jadwal Uji Coba (16.00 – 16.30 WIB):</strong> Penandatanganan Berita Acara TM dan pembagian slot waktu uji coba lapangan.</li>
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
                      <li><strong className="text-slate-900">Waktu & Tempat:</strong> Hari Minggu, 17 Januari 2027 pukul 08.00 – 13.30 WIB di Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta (Sedayu, Bantul).</li>
                      <li><strong className="text-slate-900">Dua Arena Simultan:</strong> Arena 1 (Lap. Basket 25x14m untuk 18 SD) dan Arena 2 (Pelataran Embung 26x15m untuk 18 SMP).</li>
                      <li><strong className="text-slate-900">Alokasi Waktu Resmi 15 Menit:</strong> 10 menit waktu efektif orientasi pergerakan arena dan 5 menit waktu transisi keluar-masuk peleton, dipandu Timekeeper dan LO.</li>
                      <li><strong className="text-slate-900">Fokus Teknis:</strong> Adaptasi akustik vokal aba-aba danton dari dalam Kotak Danton (1,5 x 1,5m), orientasi tekstur lantai dan cengkeraman sepatu, kalibrasi formasi agar tidak melanggar batas arena, serta simulasi alur masuk, center juri, dan evakuasi keluar arena.</li>
                      <li><strong className="text-slate-900">Ketentuan Sepatu:</strong> Memakai seragam olahraga/latihan rapi dan bersepatu. DILARANG KERAS menggunakan sol sepatu berpines/paku payung. Uji coba murni adaptasi dan TIDAK ADA penilaian juri.</li>
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
                    <span className="font-bold text-base md:text-lg text-slate-900">D. Tahap II: Hari Perlombaan – Registrasi s.d. Upacara Pembukaan</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('reg') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('reg') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <ol className="list-decimal pl-5 space-y-2.5">
                      <li><strong className="text-slate-900">Kedatangan & Check-In (06.00 – 09.00 WIB):</strong> Official menyerahkan 1 KTP/SIM asli sebagai jaminan kebersihan basecamp, menerima nomor dada peleton (disematkan di dada sebelah kiri personel S2B1 / Saf 2 Banjar 1), ID Card resmi (1 Official & 2 Pendukung), serta 2 kantong sampah terpilah (Organik & Anorganik). Registrasi ditutup pukul 09.00 WIB tepat.</li>
                      <li><strong className="text-slate-900">Sterilisasi Arena Perlombaan:</strong> Tepat pukul 07.30 WIB kedua arena ditutup dan disterilkan dari aktivitas umum untuk persiapan upacara pembukaan.</li>
                      <li><strong className="text-slate-900">Upacara Pembukaan Resmi (07.45 – 08.15 WIB):</strong> WAJIB diikuti oleh peleton bernomor undian 1 sampai dengan 5 (SD-01 s.d. SD-05 dan SMP-01 s.d. SMP-05) dengan susunan 1 Komandan + 15 Anggota (5 trio lengkap) mengenakan seragam tonti resmi lengkap. Pengecekan barisan dilakukan 15 menit sebelum upacara. Peleton yang terlambat atau tidak hadir dikenakan penalti.</li>
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
                    <span className="font-bold text-base md:text-lg text-slate-900">E. Tahap III: Alur Persiapan & Pelaksanaan Tampil di Arena</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('arena') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('arena') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <ol className="list-decimal pl-5 space-y-2.5">
                      <li><strong className="text-slate-900">Daerah Persiapan 1 (DP 1):</strong> Peleton bersiap di basecamp 15 menit sebelumnya. DILARANG KERAS masuk DP 1 sebelum dipanggil resmi via pengeras suara. Di DP 1 dilakukan verifikasi personel (1 Danton, 21 Inti, cadangan, 1 Official, 2 Pendukung), posisi nomor dada S2B1, dan pemeriksaan sol sepatu (DILARANG pines, paku payung, spikes, pul logam).</li>
                      <li><strong className="text-slate-900">Daerah Persiapan 2 (DP 2):</strong> Berfungsi murni sebagai Holding Area yang tenang sebelum peleton dipersilakan masuk arena oleh pengatur lapangan.</li>
                      <li><strong className="text-slate-900">Masuk Arena & Posisi Center Juri:</strong> Danton memimpin pasukan masuk ke posisi tengah arena tepat di depan meja Dewan Juri, mengondisikan pasukan, lalu memberikan aba-aba penghormatan: <em>"Kepada dewan juri, Hormat = GERAK"</em>. Stopwatch waktu resmi lomba DIMULAI tepat saat aba-aba pelaksanaan penghormatan ini dihentakkan.</li>
                      <li><strong className="text-slate-900">Laporan Pembuka & Masuk Kotak Danton:</strong> Danton melapor: <em>"Lapor, peleton dengan nomor dada (sebutkan ejaan kata, misal: nol nol tujuh) siap melaksanakan materi gerakan lomba."</em> Setelah itu danton melangkah masuk Kotak Danton (1,5 x 1,5m) menghadap pasukan dan memimpin materi lomba secara berurutan.</li>
                      <li><strong className="text-slate-900">Sinyal Peluit Timekeeper:</strong> Peluit 1 Kali Panjang menandakan sisa waktu 2 menit (menit ke-8 SD, menit ke-11 SMP). Peluit 2 Kali Panjang menandakan durasi waktu tampil telah habis (menit ke-10 SD, menit ke-13 SMP). Waktu stopwatch resmi berakhir saat danton menghentakkan aba-aba pelaksanaan penghormatan penutup.</li>
                      <li><strong className="text-slate-900">Ketentuan Atribut Terjatuh:</strong> Apabila atribut peserta (topi/peci, dasi, pin/lencana, sabuk, sarung tangan, dll.) terlepas atau terjatuh di arena, <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">TIDAK DIKENAKAN PENALTI PENGURANGAN NILAI</span>. Pasukan dilarang memungut hingga peleton keluar arena.</li>
                      <li><strong className="text-slate-900">Pergantian Pemain di Arena:</strong> Dilakukan di antara Materi No. 20 & 21 untuk SD/MI, serta di antara Materi No. 17 & 18 untuk SMP/MTs. Stopwatch tetap berjalan normal.</li>
                      <li><strong className="text-slate-900">Laporan Penutup & Keluar Arena:</strong> Danton melapor: <em>"Peleton dengan nomor dada (sebutkan nomor urut) telah melaksanakan materi gerakan lomba, laporan selesai."</em> Penghormatan penutup, keluar melalui jalur evakuasi, dan menyerahkan nomor dada kepada petugas pos arena terakhir.</li>
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
                    <span className="font-bold text-base md:text-lg text-slate-900">F. Tahap IV: Pasca-Lomba – Sistem Penilaian, Live Score, Sanggah & Juara</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('score') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('score') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <ol className="list-decimal pl-5 space-y-2.5">
                      <li><strong className="text-slate-900">Dewan Juri Independen:</strong> Penilaian dilakukan oleh 6 Dewan Juri (unsur TNI, POLRI, dan PPI: 3 Juri Arena 1 SD & 3 Juri Arena 2 SMP). Keputusan Dewan Juri mengenai mutu gerak bersifat mutlak dan tidak dapat diganggu gugat.</li>
                      <li><strong className="text-slate-900">Proporsi Penilaian Peleton (Rasio 1:1):</strong> Kebenaran Gerak (1) dan Kekompakan (1) dengan rentang nilai 50 s.d. 90 poin (bilangan genap). Tie-breaker: (1) Kebenaran Teknik PBB tertinggi; (2) Kekompakan tertinggi; (3) Penalti paling sedikit.</li>
                      <li><strong className="text-slate-900">Penilaian Komandan Peleton (Total 100%):</strong> Penguasaan Materi (35%), Kualitas Suara/Vokal IKIT (25%), Sikap dan Pelaporan (20%), Penguasaan Lapangan (20%). Tie-breaker: (1) Penguasaan materi; (2) Kualitas suara.</li>
                      <li><strong className="text-slate-900">Poin Juara Umum (SD dan SMP berdiri sendiri):</strong>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-2 text-xs font-mono">
                          <span className="bg-slate-100 p-2 rounded">Juara 1 Peleton: 6 Poin</span>
                          <span className="bg-slate-100 p-2 rounded">Juara 2 Peleton: 5 Poin</span>
                          <span className="bg-slate-100 p-2 rounded">Juara 3 Peleton: 4 Poin</span>
                          <span className="bg-slate-100 p-2 rounded">Harapan 1: 3 Poin</span>
                          <span className="bg-slate-100 p-2 rounded">Harapan 2: 2 Poin</span>
                          <span className="bg-slate-100 p-2 rounded">Harapan 3: 1 Poin</span>
                          <span className="bg-yellow-50 text-yellow-900 p-2 rounded border border-yellow-200">Danton 1: 3 Poin</span>
                          <span className="bg-yellow-50 text-yellow-900 p-2 rounded border border-yellow-200">Danton 2: 2 Poin</span>
                          <span className="bg-yellow-50 text-yellow-900 p-2 rounded border border-yellow-200">Danton 3: 1 Poin</span>
                        </div>
                      </li>
                      <li><strong className="text-slate-900">Live Score Quick Count Berbasis Akun Gmail Peleton:</strong> Nilai penampilan ditayangkan terbuka melalui aplikasi quick count di lbb.tontimuallimin.com setelah berkas disahkan juri dan rekapitulasi. Official login menggunakan Gmail terdaftar masing-masing.</li>
                      <li><strong className="text-slate-900">Mekanisme Sanggah Resmi (Masa Sanggah 60 Menit):</strong> Protes HANYA diterima untuk dugaan kekeliruan administratif non-penilaian (salah jumlah skor, salah input sistem, salah catatan penalti). Diajukan TERTULIS dengan Formulir Sanggahan Resmi oleh 1 Official di Meja Informasi Panitia dalam tempo 60 menit sejak pengumuman di acara penutupan dibacakan. Panitia TIDAK melayani protes secara lisan.</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* G. SANKSI DAN PENALTI PENGURANGAN NILAI */}
            {shouldShow('penalty') && (
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('penalty')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-red-100 text-red-700 font-black flex items-center justify-center text-sm">
                      G
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">G. Ketentuan Sanksi dan Penalti Pengurangan Nilai</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('penalty') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('penalty') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <p className="text-xs text-slate-500 italic">
                      Pelanggaran teknis lapangan dikenai sanksi penalti pengurangan nilai secara kumulatif pada rekapitulasi nilai akhir:
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
                                {idx === 0 && 'Nomor tampil SD/SMP 1 s.d. 5 wajib hadir 1 danton + 15 anggota.'}
                                {idx === 1 && 'Dikenakan per kelipatan 5 menit keterlambatan saat upacara.'}
                                {idx === 2 && 'Setelah 3x panggilan interval 2 menit; jika tetap absen: Diskualifikasi.'}
                                {idx === 3 && 'Personel masuk arena kurang dari 22 orang (1 Danton + 21 Pasukan).'}
                                {idx === 4 && 'Melebihi durasi resmi (SD > 10 menit, SMP > 13 menit) per rentang 30 detik.'}
                                {idx === 5 && 'Anggota injak garis arena, atau danton injak/keluar Kotak Danton 1,5x1,5m.'}
                                {idx === 6 && 'Gerakan penyesuaian (hadap/balik/langkah terbatas) melebihi kuota 3x.'}
                                {idx === 7 && 'Topi/peci, pin, lencana, sarung tangan terlepas TIDAK dipotong nilai.'}
                                {idx === 8 && 'Ruang basecamp ditinggalkan kotor / berantakan saat checkout.'}
                                {idx === 9 && 'Kerusakan/kehilangan sarpras kelas: ganti rugi + denda administratif.'}
                                {idx === 10 && 'Gerakan terlewat namun dilakukan kemudian = Nilai Minimal; tidak dilakukan = Nilai 0.'}
                                {idx === 11 && 'Danton salah aba-aba tetapi pasukan bergerak hafalan = Nilai 0 & potong nilai danton.'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* H. KEADAAN KAHAR (FORCE MAJEURE) */}
            {shouldShow('force') && (
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('force')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                      H
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">H. Keadaan Kahar (Force Majeure)</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('force') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('force') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-3 animate-fade">
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Keadaan kahar mencakup kejadian darurat di luar kendali panitia maupun peserta (contoh: hujan deras ekstrem, badai angin kencang, bencana alam, gangguan keamanan, pemadaman listrik total).</li>
                      <li>Kondisi Hujan Ringan (Gerimis): Perlombaan tetap berlangsung secara normal.</li>
                      <li>Kondisi Hujan Deras / Badai Ekstrem: Panitia bersama Dewan Juri berhak menghentikan perlombaan sementara demi keselamatan peserta. Setelah cuaca kondusif kembali, penampilan peleton yang terhenti akan diulang dari awal masuk arena (stopwatch di-reset ke 00:00).</li>
                      <li>Keputusan penghentian dan kelanjutan perlombaan merupakan wewenang mutlak Panitia Pelaksana dan Dewan Juri.</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* I. PENUTUP */}
            {shouldShow('closing') && (
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('closing')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                      I
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">I. Penutup</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('closing') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('closing') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-3 animate-fade">
                    <p>
                      Petunjuk Teknis Lapangan ini menjadi pedoman operasional resmi bagi seluruh panitia, dewan juri, dan peserta LBB Mu'allimin Tahun 2027. Seluruh hal teknis tambahan yang disepakati bersama dalam forum Technical Meeting mengikat secara sah dan menjadi bagian tak terpisahkan dari juknis ini.
                    </p>
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
