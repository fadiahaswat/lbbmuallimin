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
      def: 'definisi istilah clear area dp 1 dp 2 holding area kotak danton 1.5 bendera hakim garis gerakan penyesuaian dimensi basket embung 25x14 26x15 official pendukung'.includes(query),
      tm: 'technical meeting tm peserta aula wirobrajan 10 januari 2027 berkas fisik surat tugas kepala sekolah pakta integritas undian lotting sd 01 smp 01'.includes(query),
      trial: 'uji coba lapangan familiarisasi medan sedayu 16 januari 2027 15 menit 10 menit efektif 5 menit transisi akustik vokal danton tekstur cengkeraman sepatu'.includes(query),
      reg: 'hari perlombaan daftar ulang check in 06.00 09.00 ktp jaminan nomor dada s2b1 kantong sampah terpilah sterilisasi upacara pembukaan nomor 1 5 15 anggota'.includes(query),
      arena: 'alur tampil arena posisi center juri laporan pembuka penghormatan peluit 1 kali panjang 2 menit habis bendera hakim garis atribut terjatuh pergantian pemain cadangan'.includes(query),
      score: 'sistem penilaian dewan juri tni polri ppi rasio 1 1 kebenaran gerak kekompakan 50 90 genap danton materi 35 suara 25 sikap 20 lapangan 20 juara umum poin 6 sanggah 60 menit'.includes(query),
      penalty: 'sanksi pengurangan nilai penalti upacara 150 50 keterlambatan dp 1 100 diskualifikasi personel 75 waktu 50 garis bendera 50 penyesuaian 25 atribut 0 kotor 50'.includes(query),
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
                        <strong className="text-slate-900">Clear Area:</strong> Area steril di sekeliling arena perlombaan yang hanya dapat dimasuki oleh peleton yang sedang berkompetisi (termasuk Cadangan), maksimal 1 (satu) orang Official resmi (Pelatih/Pembina), 2 (dua) orang Pendukung (Medis/Dokumentasi) yang mengenakan ID Card resmi, serta panitia pelaksana dan Dewan Juri yang bertugas.
                      </li>
                      <li>
                        <strong className="text-slate-900">Daerah Persiapan (DP):</strong> Area transisi berjenjang sebelum peleton memasuki arena perlombaan, terdiri dari Daerah Persiapan 1 (DP 1) sebagai Pos Pengecekan Personel dan Verifikasi Fisik, serta Daerah Persiapan 2 (DP 2) yang difungsikan murni sebagai Ruang Tunggu Siap Tampil (Holding Area). Peleton dilarang keras memasuki DP 1 sebelum dipanggil resmi oleh panitia melalui pengeras suara (mic).
                      </li>
                      <li>
                        <strong className="text-slate-900">Ketentuan Kotak Danton dan Pergerakan Komandan Peleton:</strong> Kotak Danton berukuran 1,5 x 1,5 meter terletak di batas depan arena dan menghadap langsung ke arah meja Dewan Juri. Komandan Peleton mengawali penampilan dari posisi tengah arena untuk melaksanakan penghormatan dan pelaporan awal kepada juri, kemudian berpindah memasuki Kotak Danton untuk memimpin jalannya materi perlombaan. Selama memimpin di dalam kotak, Komandan Peleton wajib berada di posisi menghadap pasukan (posisi komando), dilarang keras membelakangi meja Dewan Juri, serta tidak diperbolehkan menginjak maupun melangkah keluar dari garis batas kotak, kecuali pada instruksi materi yang secara teknis mengharuskannya keluar kotak seperti bubar peleton, berhimpun, atau perhatian/istirahat di tempat.
                      </li>
                      <li>
                        <strong className="text-slate-900">Sinyal dan Alat Komunikasi Petugas Lapangan:</strong> Untuk menjamin keteraturan dan kepastian teknis di lapangan, panitia menetapkan penggunaan sinyal resmi: peluit digunakan khusus sebagai penanda perhitungan waktu lomba oleh Timekeeper, sedangkan bendera digunakan khusus oleh Hakim Garis untuk menandai terjadinya pelanggaran garis batas arena dan batas Kotak Danton.
                      </li>
                      <li>
                        <strong className="text-slate-900">Prinsip Garis Batas dan Penilaian Pelanggaran:</strong> Seluruh garis batas arena perlombaan maupun batas Kotak Danton menganut asas <span className="font-bold text-red-700 bg-red-50 px-1 rounded">"Garis sebagai Garis"</span> (pelanggaran dihitung berdasarkan kontak fisik/pijakan, bukan dinding imajiner di udara). Pelanggaran dinyatakan sah terjadi apabila terdapat alas kaki atau bagian tubuh peserta maupun Komandan Peleton yang secara nyata menyentuh/menginjak garis atau menapak di luar area batas yang telah ditentukan. Setiap bentuk pelanggaran akan ditandai secara langsung melalui kibasan bendera oleh Hakim Garis dan dikenakan sanksi pemotongan nilai pada rekapitulasi penilaian.
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
                        <strong className="text-slate-900">Ketentuan Pendamping dan Dokumentasi Peleton:</strong> Setiap peleton didampingi oleh maksimal 1 (satu) orang Official (Pelatih/Pembina), 2 (dua) orang Pendukung (Medis/Dokumentasi/dll.), serta seluruh anggota cadangan resmi. Petugas dokumentasi dari pihak kontingen hanya diizinkan mengambil dokumentasi dari batas area yang telah ditentukan oleh panitia, dilarang keras berada di posisi yang sejajar dengan meja Dewan Juri, serta tidak diperkenankan menghalangi pandangan maupun mengganggu jalannya perlombaan dan proses penilaian.
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
                      <li><strong className="text-slate-900">Waktu dan Tempat:</strong> Dilaksanakan pada hari Sabtu, 10 Januari 2027 pukul 13.00 – 16.30 WIB bertempat di Aula Kampus Induk Madrasah Mu'allimin Muhammadiyah Yogyakarta (Jl. Letjen S. Parman No. 68, Patangpuluhan, Wirobrajan, Kota Yogyakarta).</li>
                      <li><strong className="text-slate-900">Ketentuan Kehadiran Delegasi:</strong> Setiap kontingen wajib mendelegasikan maksimal 2 (dua) orang perwakilan resmi (Official/Pelatih/Pembina atau Komandan Peleton). Seluruh perwakilan wajib mengenakan pakaian rapi, sopan, dan bersepatu.</li>
                      <li><strong className="text-slate-900">Registrasi dan Verifikasi Berkas Fisik Asli (12.30 – 13.00 WIB):</strong> Sebelum memasuki ruang pleno, perwakilan kontingen melakukan presensi dan menyerahkan berkas fisik asli di meja registrasi TM: (a) Surat Tugas / Rekomendasi Resmi Kepala Sekolah asli berstempel basah (1 Danton, 21 Inti, 3 Cadangan, 1 Official, 2 Pendukung); (b) Pakta Integritas bermaterai Rp 10.000 yang ditandatangani Official resmi sekolah.</li>
                      <li><strong className="text-slate-900">Pemaparan Materi Teknis & Juknis Lomba (13.00 – 14.30 WIB):</strong> Divisi Acara dan Dewan Juri memaparkan penyamaan persepsi materi gerakan PBB (Perpang TNI No. 58 & 57 Th 2018 serta No. 45 Th 2014 untuk Hormat Kanan/Kiri), standar aba-aba, tempo langkah, posisi center juri, rasio penilaian 1:1, demonstrasi gerakan penyesuaian, prinsip batas "Garis sebagai Garis", bendera hakim garis, kotak danton 1,5x1,5m, stopwatch, serta sosialisasi live score website lbb.tontimuallimin.com menggunakan akun Gmail masing-masing peleton.</li>
                      <li><strong className="text-slate-900">Sesi Tanya Jawab Teknis dan Klarifikasi Multitafsir (14.30 – 15.15 WIB):</strong> Ruang diskusi langsung bersama Dewan Juri dan Panitia. Setiap keputusan dan kesepakatan akhir dicatat ke dalam Notulensi Resmi TM sebagai rujukan sah perlombaan.</li>
                      <li><strong className="text-slate-900">Pengundian Resmi (Lotting) Nomor Urut Tampil (15.15 – 16.00 WIB):</strong> Undian terbuka nomor urut SD (SD-01 s.d. SD-18) dan SMP (SMP-01 s.d. SMP-18). Penukaran nomor urut tampil hanya diperkenankan dilakukan di hadapan panitia dan disaksikan oleh peserta lain selama forum TM masih berlangsung.</li>
                      <li><strong className="text-slate-900">Konfirmasi Uji Coba Lapangan & Penutupan (16.00 – 16.30 WIB):</strong> Official kontingen diarahkan untuk mengisi survei kesediaan uji coba lapangan secara mandiri melalui web-app lbb.tontimuallimin.com. Panitia selanjutnya menyusun dan merilis jadwal resmi pembagian slot waktu uji coba lapangan berdasarkan data survei tersebut.</li>
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
                      <li><strong className="text-slate-900">Waktu dan Tempat Pelaksanaan:</strong> Dilaksanakan pada hari Sabtu, 16 Januari 2027 pukul 07.00 WIB – SELESAI bertempat di Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta (Sedayu, Bantul).</li>
                      <li><strong className="text-slate-900">Sistem Pelaksanaan Paralel di Dua Arena:</strong> (a) Arena 1 (Lapangan Basket Kampus Terpadu Sedayu): Khusus untuk 18 Peleton Tingkat SD/MI (ukuran 25 m x 14 m); (b) Arena 2 (Pelataran Embung Kampus Terpadu Sedayu): Khusus untuk 18 Peleton Tingkat SMP/MTs (ukuran 26 m x 15 m).</li>
                      <li><strong className="text-slate-900">Alokasi Waktu Resmi per Kontingen:</strong> Setiap peleton memperoleh alokasi waktu tepat 15 (lima belas) menit, dengan rincian operasional: (a) Waktu Efektif Uji Coba Arena: 10 menit untuk SD/MI dan 13 menit untuk SMP/MTs digunakan untuk orientasi medan, adaptasi, dan pergerakan formasi peleton; (b) 5 menit waktu transisi keluar-masuk peleton antar kontingen. Manajemen waktu dikendalikan ketat oleh Timekeeper didampingi LO.</li>
                      <li><strong className="text-slate-900">Ketentuan Perlengkapan Uji Coba:</strong> Peserta diperbolehkan mengenakan seragam olahraga atau latihan sekolah yang seragam, rapi, dan bersepatu (<span className="text-red-600 font-bold">DILARANG KERAS menggunakan sol sepatu berpines/paku</span>). Uji coba murni kegiatan orientasi medan dan TIDAK ADA penilaian juri.</li>
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
                      <li><strong className="text-slate-900">Kedatangan dan Check-In Kontingen (06.00 – 09.00 WIB):</strong> Prosedur kedatangan dan daftar ulang kontingen di Meja Registrasi Resmi Kampus Terpadu Sedayu:
                        <ul className="list-[lower-alpha] pl-5 mt-1.5 space-y-1">
                          <li>Official menyerahkan 1 (satu) kartu identitas asli (KTP/SIM perwakilan kontingen) sebagai jaminan ketertiban serta kebersihan ruang basecamp.</li>
                          <li>Official menerima fasilitas resmi kontingen: (1) Nomor Dada Peleton resmi; (2) Tanda Pengenal ID Card Resmi (1 Official & 2 Pendukung); (3) 1 (satu) dus Air Minum Kemasan (botol) per peleton; serta (4) 2 (dua) kantong sampah terpilah (Organik & Anorganik).</li>
                          <li>Nomor dada peleton wajib disematkan pada dada sebelah kiri personel Penjuru Depan Tengah / Saf 2 Banjar 1 (S2B1).</li>
                          <li>Peleton diarahkan dan dikawal oleh LO pendamping menuju ruang kelas basecamp resmi yang telah ditentukan panitia.</li>
                          <li>Registrasi ditutup tepat pukul 09.00 WIB. Peleton yang tidak melakukan daftar ulang tidak diperkenankan mengikuti perlombaan.</li>
                          <li>Regulasi Parkir Kendaraan Kontingen: (1) Bus / Kendaraan Besar Kontingen: Dilarang parkir di dalam area Kampus Terpadu Mu'allimin; bus hanya diperkenankan masuk untuk proses drop-off peserta serta perlengkapan di Drop Zone resmi, kemudian wajib segera menuju dan parkir di kantong parkir Lapangan Hibrida Argomulyo; (2) Kendaraan Roda 4 (Mobil) dan Roda 2 (Motor): Diparkirkan di kantong parkir internal Kampus Terpadu Sedayu sesuai arahan petugas, dan apabila kapasitas parkir internal telah penuh, arus kendaraan dialihkan menuju kantong parkir Lapangan Hibrida Argomulyo.</li>
                        </ul>
                      </li>
                      <li><strong className="text-slate-900">Sterilisasi Arena Perlombaan (06.45 WIB):</strong> Mulai pukul 06.45 WIB, seluruh arena perlombaan (Arena 1 & Arena 2 serta Lapangan Mini Soccer) ditutup dan disterilkan dari aktivitas umum, dan seluruh peserta upacara wajib telah berada di lokasi barisan upacara. Upacara pembukaan dimulai tepat pukul 07.00 WIB.</li>
                      <li><strong className="text-slate-900">Pelaksanaan Upacara Pembukaan Resmi (07.00 – 07.45 WIB):</strong> Peleton dengan nomor urut tampil 1 sampai dengan 5 (SD-01 s.d. SD-05 dan SMP-01 s.d. SMP-05) WAJIB mengikuti upacara pembukaan dengan komposisi 1 Komandan Peleton dan 15 Anggota (5 trio lengkap) mengenakan seragam tonti resmi lengkap. Pengecekan kehadiran dilakukan panitia 15 menit sebelum upacara. Peleton tidak hadir penalti -150 poin; terlambat penalti -50 poin per kelipatan 5 menit.</li>
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
                      <li><strong className="text-slate-900">Tahap Kesiapan & Pengecekan di DP 1:</strong> Peleton bersiap di basecamp 15 menit sebelumnya. Peleton HANYA boleh masuk ke DP 1 setelah dipanggil resmi oleh panitia melalui pengeras suara (mic); <span className="text-red-600 font-bold">DILARANG KERAS masuk sebelum dipanggil</span>. Petugas DP 1 memeriksa kelengkapan personel (1 Danton, 21 Inti, cadangan, 1 Official, 2 Pendukung), posisi nomor dada di dada kiri personel S2B1, dan pemeriksaan fisik sol sepatu (<span className="text-red-600 font-bold">DILARANG KERAS menggunakan pines, paku payung, spikes, pul logam</span>). Pergantian cadangan terencana dilaporkan kepada petugas DP 1.</li>
                      <li><strong className="text-slate-900">Tahap Ruang Tunggu di DP 2:</strong> Setelah lolos verifikasi DP 1, peleton bergerak ke DP 2 yang difungsikan murni sebagai Holding Area (Ruang Tunggu Siap Tampil). Peleton menjaga ketenangan dan fokus mental, berbaris rapi menunggu aba-aba masuk arena dari pengatur lapangan.</li>
                      <li><strong className="text-slate-900">Memasuki Arena dan Posisi Center Juri:</strong> Komandan Peleton memimpin pasukan memasuki arena menuju tengah arena sehingga posisi peleton berada tepat di tengah (centre) menghadap meja Dewan Juri. Komandan mengondisikan pasukannya terlebih dahulu (diberi aba-aba siap atau diluruskan).</li>
                      <li><strong className="text-slate-900">Penghormatan Awal & Stopwatch Dimulai:</strong> Komandan Peleton mengambil posisi di samping kanan barisan menghadap meja Dewan Juri, memberikan aba-aba: <em>"Kepada Dewan Juri, Hormat = GERAK"</em>. Stopwatch waktu resmi lomba <span className="font-bold text-emerald-700">DIMULAI tepat saat aba-aba pelaksanaan penghormatan pembuka ini dihentakkan</span>.</li>
                      <li><strong className="text-slate-900">Laporan Pembuka & Berpindah ke Kotak Danton:</strong> Setelah aba-aba <em>"Tegak = GERAK"</em>, Komandan Peleton berpindah ke depan peleton menghadap Dewan Juri, menyampaikan laporan: <em>"Lapor, peleton dengan nomor dada (sebutkan nomor urut dalam ejaan kata, contoh: nol nol tujuh) siap melaksanakan materi gerakan lomba."</em> Setelah melapor, danton melangkah menuju Kotak Danton (1,5 x 1,5 meter) menghadap peleton (posisi komando), dilarang keras membelakangi meja juri, dan memimpin gerakan materi secara berurutan.</li>
                      <li><strong className="text-slate-900">Durasi Waktu dan Sinyal Peluit Timekeeper:</strong> Durasi maksimal tampil resmi 10 menit (SD/MI) dan 13 menit (SMP/MTs). Sinyal Peluit 1 Kali Panjang: peringatan waktu sisa 2 menit (menit ke-8 SD, menit ke-11 SMP). Sinyal Peluit 2 Kali Panjang: penanda waktu tampil habis (menit ke-10 SD, menit ke-13 SMP), peleton wajib segera menyelesaikan materi dan meninggalkan arena.</li>
                      <li><strong className="text-slate-900">Sinyal Pelanggaran Garis:</strong> Hakim Garis menggunakan bendera untuk menandai terjadinya pelanggaran garis batas arena oleh pasukan atau keluarnya komandan dari Kotak Danton saat memimpin materi berdasarkan asas "Garis sebagai Garis".</li>
                      <li><strong className="text-slate-900">Ketentuan Atribut Terjatuh:</strong> Apabila atribut peserta (topi/peci, dasi, pin/lencana, sabuk, sarung tangan, dll.) terlepas atau terjatuh di arena, <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">TIDAK DIKENAKAN PENALTI PENGURANGAN NILAI (0 POIN)</span>. Pasukan dilarang memungut atribut hingga peleton keluar arena.</li>
                      <li><strong className="text-slate-900">Pergantian Pemain di Arena:</strong> Dilakukan di antara Materi No. 20 dan 21 (SD/MI) atau di antara Materi No. 17 dan 18 (SMP/MTs). Waktu stopwatch tetap berjalan normal. Pergantian danton darurat hanya boleh bila sakit parah/pingsan diganti personel di dalam arena, hak kategori Danton Terbaik otomatis gugur.</li>
                      <li><strong className="text-slate-900">Laporan Penutup, Penghormatan Penutup & Penghentian Stopwatch:</strong> Danton melapor di depan peleton hadap meja juri: <em>"Lapor, peleton dengan nomor dada (ejaan kata) telah melaksanakan materi lomba, laporan selesai."</em> Berpindah ke samping kanan barisan hadap juri: <em>"Kepada Dewan Juri, Hormat = GERAK"</em>, diakhiri <em>"Tegak = GERAK"</em> (stopwatch waktu resmi lomba <span className="font-bold text-red-700">BERHENTI tepat saat aba-aba pelaksanaan ini dihentakkan</span>). Selanjutnya peleton dipimpin keluar arena, dan official menyerahkan nomor dada kepada petugas pos.</li>
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
                    <span className="font-bold text-base md:text-lg text-slate-900">F. Tahap IV: Pasca-Lomba – Sistem Penilaian, Live Score, Sanggah & Penentuan Juara</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('score') ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen('score') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <ol className="list-decimal pl-5 space-y-2.5">
                      <li><strong className="text-slate-900">Dewan Juri Independen:</strong> Penilaian dilakukan oleh 6 Dewan Juri (unsur TNI, POLRI, dan PPI: 3 Juri Arena 1 SD & 3 Juri Arena 2 SMP). Keputusan Dewan Juri mengenai mutu gerak bersifat mutlak dan tidak dapat diganggu gugat.</li>
                      <li><strong className="text-slate-900">Kriteria Penentuan Juara Peleton (Rasio 1:1):</strong> Perbandingan penilaian peleton adalah 1:1, yaitu Kebenaran Teknik (1) dan Kekompakan (1) dengan rentang nilai 50 s.d. 90 poin. Tie-breaker peleton seri: (1) nilai tertinggi Kebenaran Teknik Gerakan PBB; (2) nilai tertinggi Kekompakan; (3) akumulasi poin penalti paling sedikit; (4) musyawarah Sidang Pleno Juri.</li>
                      <li><strong className="text-slate-900">Kriteria Penentuan Juara Komandan Peleton (Total Bobot 100%):</strong> Penguasaan Materi (35%), Kualitas Suara/Vokal (25%), Sikap & Pelaporan (20%), dan Penguasaan Lapangan (20%). Tie-breaker: (1) Penguasaan Materi; (2) Kualitas Suara/Vokal; (3) Sikap & Pelaporan; (4) Sidang Pleno Juri.</li>
                      <li><strong className="text-slate-900">Sistem Perolehan Poin Juara Umum (SD dan SMP berdiri sendiri):</strong>
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
                        <p className="text-[11px] text-slate-500 mt-1">
                          Tie-breaker Juara Umum: (1) mendahulukan peraih peringkat Juara Peleton tertinggi; (2) total nilai murni Peleton terbaik; (3) nilai murni Kebenaran Teknik PBB; (4) Sidang Pleno Juri.
                        </p>
                      </li>
                      <li><strong className="text-slate-900">Transparansi Nilai (Akses e-Rekapitulasi Berbasis Akun Gmail Peleton):</strong> Rincian perolehan nilai peleton dirilis di website lbb.tontimuallimin.com setelah upacara penutupan dan pengumuman selesai. Official dapat login melihat rekap nilai lengkap secara mandiri menggunakan akun Gmail yang didaftarkan.</li>
                      <li><strong className="text-slate-900">Mekanisme Pengajuan Sanggah (Protes Resmi 60 Menit):</strong> Protes HANYA diterima untuk dugaan kekeliruan administratif non-penilaian (kesalahan penjumlahan skor, keliru input sistem, atau ketidaksesuaian catatan penalti). Batas waktu masa sanggah resmi selama 60 (enam puluh) menit sejak pengumuman kejuaraan di acara penutupan dibacakan. Diajukan secara TERTULIS menggunakan Formulir Sanggahan Resmi oleh 1 Official di Meja Informasi Panitia melampirkan bukti valid. Panitia TIDAK melayani protes secara lisan.</li>
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
                                {idx === 4 && 'Melebihi durasi resmi (SD > 10 menit, SMP > 13 menit) per rentang 1-30 detik.'}
                                {idx === 5 && 'Alas kaki/anggota tubuh menginjak garis arena atau keluar Kotak Danton 1,5x1,5m.'}
                                {idx === 6 && 'Gerakan penyesuaian (hadap/balik/langkah terbatas) melebihi kuota 3x.'}
                                {idx === 7 && 'Gerakan terlewat namun dilakukan kemudian = Nilai Minimal; tidak dilakukan = Nilai 0.'}
                                {idx === 8 && 'Danton salah aba-aba tetapi pasukan bergerak hafalan = Nilai 0 & potong nilai danton.'}
                                {idx === 9 && 'Rangkaian bertanda (-) yang diselingi jeda/gerakan tambahan diberi Nilai Minimal.'}
                                {idx === 10 && 'Topi/peci, pin, lencana, sarung tangan terlepas TIDAK dipotong nilai (0 poin).'}
                                {idx === 11 && 'Ruang basecamp ditinggalkan kotor / berantakan saat checkout.'}
                                {idx === 12 && 'Kerusakan/kehilangan sarpras kelas: KTP ditahan, ganti rugi fisik + denda Rp 500.000.'}
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
