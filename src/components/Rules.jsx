import React, { useState, useMemo } from 'react';
import {
  AlertOctagon,
  ChevronDown,
  Search,
  X,
  Shield,
  Clock,
  Award,
  FileText,
  CheckCircle2,
  MapPin,
  Calendar,
  AlertTriangle,
  Flame,
  Radio,
  BookOpen,
  HelpCircle,
  Phone,
  Globe,
  Mail,
  Sliders,
  Scale
} from 'lucide-react';
import { COMPETITION, EVENT, VENUE, VENUE_INDUK, PENALTIES } from '../config.js';

export default function Rules({ embedded = false }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openAccordions, setOpenAccordions] = useState({
    intro: false,
    def: false,
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
    <section id="rules" className={`${embedded ? 'py-4' : 'py-24 lg:py-32'} bg-white relative overflow-hidden font-sans`}>
      {!embedded && (
        <>
          <div className="hidden sm:block absolute top-0 right-0 w-[500px] h-[500px] bg-slate-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none transform-gpu"></div>
          <div className="hidden sm:block absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60 pointer-events-none transform-gpu"></div>
        </>
      )}

      <div className={embedded ? 'w-full relative z-10' : 'container mx-auto px-6 relative z-10'}>
        {!embedded && (
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
        )}

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


          {/* Quick Toggle Accordion Controls */}
          <div className="flex items-center justify-between gap-3 text-xs px-1">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              10 Bab Regulasi & Ketentuan Lapangan
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const allOpen = Object.keys(openAccordions).reduce((acc, k) => ({ ...acc, [k]: true }), {});
                  setOpenAccordions(allOpen);
                }}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold transition-all shadow-xs cursor-pointer text-xs"
              >
                Buka Semua
              </button>
              <button
                type="button"
                onClick={() => {
                  const allClosed = Object.keys(openAccordions).reduce((acc, k) => ({ ...acc, [k]: false }), {});
                  setOpenAccordions(allClosed);
                }}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold transition-all shadow-xs cursor-pointer text-xs"
              >
                Tutup Semua
              </button>
            </div>
          </div>

          <div className="space-y-4" id="rules-accordion">
            {/* PENDAHULUAN */}
            {shouldShow('intro') && (
              <div className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-red-500/40 hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('intro')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-red-100 text-red-700 font-black flex items-center justify-center text-xs shadow-xs">
                      INFO
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">Pendahuluan Petunjuk Teknis Lapangan</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('intro') ? 'rotate-180 text-red-600' : ''}`} />
                </button>
                {isAccordionOpen('intro') && (
                  <div className="bg-white border-t border-slate-100 p-6 sm:p-7 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                      <div className="w-2.5 h-8 bg-red-600 rounded-full shrink-0"></div>
                      <div className="font-black text-slate-900 text-base uppercase tracking-tight">
                        LOMBA BARIS – BERBARIS MU'ALLIMIN TAHUN 2027
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs text-slate-700 leading-relaxed text-sm">
                      <p>
                        Petunjuk Teknis (Juknis) Lapangan ini merupakan regulasi teknis resmi yang khusus mengatur seluruh mekanisme operasional dan teknis perlombaan, disajikan secara runtut dan sistematis sesuai alur kronologis <em>(chronological order)</em> dari tahapan pra-lomba hingga pasca-lomba. Juknis ini memuat ketentuan materi gerakan PBB (berpedoman pada Peraturan Panglima TNI Nomor 58 Tahun 2018 tentang PBB TNI, Nomor 57 Tahun 2018 tentang PPM TNI, serta khusus gerakan Hormat Kanan/Kiri mengacu pada Peraturan Panglima TNI Nomor 45 Tahun 2014), spesifikasi dimensi arena perlombaan, alur transisi peleton di lapangan, sistem penjurian dan penalti, hingga mekanisme sanggah resmi.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* A. DEFINISI ISTILAH DAN KETENTUAN DASAR LAPANGAN */}
            {shouldShow('def') && (
              <div className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-red-500/40 hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('def')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 font-black flex items-center justify-center text-sm shadow-xs">
                      A
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">A. Definisi Istilah dan Ketentuan Dasar Lapangan</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('def') ? 'rotate-180 text-red-600' : ''}`} />
                </button>
                {isAccordionOpen('def') && (
                  <div className="bg-white border-t border-slate-100 p-6 sm:p-7 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <div className="grid grid-cols-1 gap-3.5">
                      {/* Poin 1 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          1
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Clear Area:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Area steril di sekeliling arena perlombaan yang hanya dapat dimasuki oleh peleton yang sedang berkompetisi (termasuk Cadangan), maksimal 1 (satu) orang Official resmi (Pelatih/Pembina), 2 (dua) orang Pendukung Resmi (Medis/Dokumentasi) yang mengenakan ID Card resmi, serta panitia pelaksana dan Dewan Juri yang bertugas.
                          </p>
                        </div>
                      </div>

                      {/* Poin 2 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          2
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Daerah Persiapan (DP):</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Area transisi berjenjang sebelum peleton memasuki arena perlombaan, terdiri dari Daerah Persiapan 1 (DP 1) sebagai Pos Pengecekan Personel dan Verifikasi Fisik, serta Daerah Persiapan 2 (DP 2) yang difungsikan murni sebagai Ruang Tunggu Siap Tampil (Holding Area). Peleton dilarang keras memasuki DP 1 sebelum dipanggil resmi oleh panitia melalui pengeras suara (mic).
                          </p>
                        </div>
                      </div>

                      {/* Poin 3 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          3
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Ketentuan Kotak Danton dan Pergerakan Komandan Peleton:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Kotak Danton berukuran 1,5 x 1,5 meter terletak di batas depan arena dan menghadap langsung ke arah Peleton yang bersangkutan. Komandan Peleton mengawali penampilan dari posisi tengah arena untuk melaksanakan penghormatan dan pelaporan awal kepada juri, kemudian berpindah memasuki Kotak Danton untuk memimpin jalannya materi perlombaan. Selama memimpin di dalam kotak, Komandan Peleton wajib berada di posisi menghadap peleton (posisi komando), dilarang keras membelakangi meja Dewan Juri, serta tidak diperbolehkan menginjak maupun melangkah keluar dari garis batas kotak, kecuali pada instruksi materi yang secara teknis mengharuskannya keluar kotak seperti bubar peleton, berhimpun, atau perhatian/istirahat di tempat.
                          </p>
                        </div>
                      </div>

                      {/* Poin 4 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          4
                        </span>
                        <div className="space-y-3 flex-1">
                          <div>
                            <strong className="text-slate-900 text-sm block">Prinsip Garis Batas dan Penilaian Pelanggaran:</strong>
                            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mt-1">
                              Seluruh garis batas arena perlombaan maupun batas Kotak Danton menganut asas <span className="font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">"Garis sebagai Garis"</span> (pelanggaran dihitung berdasarkan kontak fisik/pijakan, bukan dinding imajiner di udara). Pelanggaran dinyatakan sah terjadi apabila terdapat alas kaki atau bagian tubuh peserta maupun Komandan Peleton yang secara nyata menyentuh/menginjak garis atau menapak di luar area batas yang telah ditentukan. Setiap bentuk pelanggaran akan ditandai secara langsung melalui kibasan bendera oleh Hakim Garis dan dikenakan sanksi pemotongan nilai pada rekapitulasi penilaian.
                            </p>
                          </div>
                          
                          {/* Infografis Garis Sebagai Garis */}
                          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4 shadow-xs">
                            <img
                              src="/garis-sebagai-garis.png"
                              alt="Infografis Garis Sebagai Garis"
                              className="max-h-24 w-auto object-contain rounded-lg drop-shadow-xs shrink-0"
                              loading="lazy"
                            />
                            <div className="text-xs text-slate-700 leading-relaxed space-y-1.5">
                              <strong className="text-slate-900 block font-black text-xs uppercase tracking-wider">Aturan Pijakan Kaki:</strong>
                              <p>
                                Menginjak / keluar garis = <span className="text-red-700 font-bold bg-red-100 px-1.5 py-0.5 rounded">Pelanggaran (Silang Merah)</span>.
                              </p>
                              <p>
                                Ayunan tangan / badan melayang di atas garis tanpa menyentuh tanah = <span className="text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">Sah / Bebas Penalti (Centang Hijau)</span>.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Poin 5 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          5
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Sinyal dan Alat Komunikasi Petugas Lapangan:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Untuk menjamin keteraturan dan kepastian teknis di lapangan, panitia menetapkan penggunaan sinyal resmi: peluit digunakan khusus sebagai penanda perhitungan waktu lomba oleh Timekeeper, sedangkan bendera digunakan khusus oleh Hakim Garis untuk menandai terjadinya pelanggaran garis batas arena dan batas Kotak Danton.
                          </p>
                        </div>
                      </div>

                      {/* Poin 6 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          6
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Gerakan Penyesuaian:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Gerakan tambahan di tempat yang bertujuan untuk memperbaiki posisi atau formasi peleton di dalam arena lomba. Gerakan penyesuaian HANYA meliputi: Hadap (Kanan/Kiri/Serong), Balik (Kanan), dan Langkah Terbatas (langkah ke Kiri/Kanan/Depan/Belakang). Penggunaan Gerakan Penyesuaian TIDAK DIBATASI jumlahnya (tidak dikenakan penalti potongan angka kuota), namun frekuensi dan efektivitas penggunaannya berpengaruh langsung terhadap penilaian aspek Penguasaan Lapangan Komandan Peleton. Ditegaskan bahwa dilarang keras menggunakan gerakan tambahan yang menyerupai materi sebelum dan sesudah gerakan tambahan tersebut dilakukan.
                          </p>
                        </div>
                      </div>

                      {/* Poin 7 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          7
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Spesifikasi Dimensi Arena Perlombaan:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Perlombaan dilaksanakan secara terpisah dan simultan di Kampus Terpadu Sedayu pada dua arena resmi:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">Huruf a</span>
                              <strong className="text-slate-900 text-xs block">Tingkat SD/MI:</strong>
                              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                                Arena 1 bertempat di Lapangan Basket dengan ukuran 25 meter x 14 meter. Durasi tampil maksimal 8 menit.
                              </p>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Huruf b</span>
                              <strong className="text-slate-900 text-xs block">Tingkat SMP/MTs:</strong>
                              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                                Arena 2 bertempat di Pelataran Embung dengan ukuran 26 meter x 15 meter. Durasi tampil maksimal 12 menit.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Poin 8 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          8
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Ketentuan Pendamping dan Dokumentasi Peleton:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Setiap peleton didampingi oleh maksimal 1 (satu) orang Official (Pelatih/Pembina), 2 (dua) orang Pendukung Resmi (masing-masing dapat berfungsi sebagai Medis dan Dokumentasi), serta seluruh anggota cadangan resmi. Petugas dokumentasi dari pihak peleton hanya diizinkan mengambil dokumentasi dari batas area yang telah ditentukan oleh panitia, dilarang keras berada di posisi yang sejajar dengan meja Dewan Juri, serta tidak diperkenankan menghalangi pandangan maupun mengganggu jalannya perlombaan dan proses penilaian.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* B. PRA-LOMBA - TEKNIS TECHNICAL MEETING */}
            {shouldShow('tm') && (
              <div className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-red-500/40 hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('tm')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 font-black flex items-center justify-center text-sm shadow-xs">
                      B
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">B. Tahap I: Pra-Lomba – Teknis Technical Meeting (TM) Peserta</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('tm') ? 'rotate-180 text-red-600' : ''}`} />
                </button>
                {isAccordionOpen('tm') && (
                  <div className="bg-white border-t border-slate-100 p-6 sm:p-7 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <div className="grid grid-cols-1 gap-3.5">
                      {/* Poin 1 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          1
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Waktu dan Tempat Pelaksanaan:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Dilaksanakan pada hari Sabtu, 9 Januari 2027 pukul 13.00 - 16.30 WIB bertempat di Aula Kampus Induk Madrasah Mu'allimin Muhammadiyah Yogyakarta (Jl. Letjen S. Parman No. 68, Patangpuluhan, Wirobrajan, Kota Yogyakarta).
                          </p>
                        </div>
                      </div>

                      {/* Poin 2 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          2
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Ketentuan Kehadiran Delegasi:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Setiap peleton wajib mendelegasikan maksimal 2 (dua) orang perwakilan resmi (Official/Pelatih/Pembina atau Komandan Peleton). Seluruh perwakilan wajib mengenakan pakaian rapi, sopan, dan bersepatu. Perwakilan putri wajib mengenakan pakaian berlengan panjang.
                          </p>
                        </div>
                      </div>

                      {/* Poin 3 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          3
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Agenda Registrasi dan Verifikasi Berkas Fisik Asli (12.30 - 13.00 WIB):</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Sebelum memasuki ruang rapat pleno, perwakilan peleton melakukan presensi dan menyerahkan berkas fisik asli di meja registrasi TM, meliputi: (a) Surat Tugas / Rekomendasi Resmi Kepala Sekolah asli berstempel basah yang memuat daftar nama lengkap peleton (1 Danton, 21 Anggota Inti, 3 Cadangan, 1 Official, dan 2 Pendukung Resmi); (b) Pakta Integritas bermaterai Rp 10.000 yang telah ditandatangani oleh Official resmi sekolah.
                          </p>
                        </div>
                      </div>

                      {/* Poin 4 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          4
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Pemaparan Materi Teknis & Juknis Lomba (13.00 - 14.30 WIB):</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Divisi Acara dan Perwakilan Dewan Juri memaparkan secara mendalam:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 shadow-xs">
                              <span className="text-[10px] font-bold text-red-600 uppercase block mb-0.5">Materi (a)</span>
                              Penyamaan persepsi teknik materi gerakan PBB berdasar Perpang TNI No. 58 & 57 Tahun 2018 (serta Perpang TNI No. 45 Tahun 2014 untuk Hormat Kanan/Kiri).
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 shadow-xs">
                              <span className="text-[10px] font-bold text-blue-600 uppercase block mb-0.5">Materi (b)</span>
                              Standar pengucapan aba-aba, tempo gerakan, tata cara komandan memposisikan peleton, dan perbandingan penilaian peleton (Kebenaran Gerak dan Kekompakan 1:1, serta 4 aspek komandan peleton).
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 shadow-xs">
                              <span className="text-[10px] font-bold text-amber-600 uppercase block mb-0.5">Materi (c)</span>
                              Penjelasan ketentuan gerakan penyesuaian (tanpa batas kuota namun mempengaruhi penilaian Penguasaan Lapangan Komandan), prinsip garis batas arena, bendera hakim garis, dan ketentuan Kotak Danton.
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 shadow-xs">
                              <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-0.5">Materi (d)</span>
                              Mekanisme perhitungan waktu resmi menggunakan stopwatch serta publikasi hasil penilaian melalui portal peserta di website lbb.tontimuallimin.com menggunakan akun Gmail masing-masing peleton. Seluruh nilai peserta akan ditampilkan secara langsung pada akun masing-masing peleton setelah pelaksanaan upacara dan pengumuman kejuaraan.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Poin 5 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          5
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Sesi Tanya Jawab Teknis (14.30 - 15.15 WIB):</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Peserta diberikan ruang diskusi langsung bersama Dewan Juri ataupun Panitia guna menyamakan persepsi serta mengklarifikasi hal-hal teknis yang belum jelas. Setiap keputusan dan kesepakatan akhir akan dicatat ke dalam Notulensi Resmi TM sebagai rujukan sah perlombaan.
                          </p>
                        </div>
                      </div>

                      {/* Poin 6 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          6
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Pengundian Resmi (Lotting) Nomor Urut Tampil (15.15 - 16.00 WIB):</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Panitia memimpin undian terbuka nomor urut tampil resmi: Tingkat SD/MI: Nomor undian SD-111 sampai dengan SD-175; Tingkat SMP/MTs: Nomor undian SMP-222 sampai dengan SMP-286. Penukaran nomor urut tampil hanya diperkenankan dilakukan di hadapan panitia dan disaksikan oleh peserta lain selama forum TM masih berlangsung.
                          </p>
                        </div>
                      </div>

                      {/* Poin 7 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          7
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Konfirmasi Uji Coba Lapangan & Penutupan (16.00 – 16.30 WIB):</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Official peleton diarahkan untuk mengisi survei kesediaan uji coba lapangan secara mandiri melalui web-app lbb.tontimuallimin.com. Panitia selanjutnya akan menyusun dan merilis jadwal resmi pembagian slot waktu uji coba lapangan berdasarkan data survei tersebut.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* C. PRA-LOMBA - TEKNIS UJI COBA LAPANGAN */}
            {shouldShow('trial') && (
              <div className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-red-500/40 hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('trial')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 font-black flex items-center justify-center text-sm shadow-xs">
                      C
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">C. Tahap I: Pra-Lomba – Teknis Uji Coba Lapangan (Familiarisasi Medan)</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('trial') ? 'rotate-180 text-red-600' : ''}`} />
                </button>
                {isAccordionOpen('trial') && (
                  <div className="bg-white border-t border-slate-100 p-6 sm:p-7 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <div className="grid grid-cols-1 gap-3.5">
                      {/* Poin 1 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          1
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Waktu dan Tempat Pelaksanaan:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Dilaksanakan pada hari Sabtu, 16 Januari 2027 pukul 07.00 – 13.00 WIB bertempat di Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta (Sedayu, Bantul).
                          </p>
                        </div>
                      </div>

                      {/* Poin 2 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          2
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Sistem Pelaksanaan Paralel di Dua Arena:</strong>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 shadow-xs">
                              <strong className="text-slate-800 block mb-0.5">Arena 1 (Lapangan Basket Kampus Terpadu Sedayu):</strong>
                              Khusus untuk 18 Peleton Tingkat SD/MI (ukuran 25 meter x 14 meter).
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 shadow-xs">
                              <strong className="text-slate-800 block mb-0.5">Arena 2 (Pelataran Embung Kampus Terpadu Sedayu):</strong>
                              Khusus untuk 18 Peleton Tingkat SMP/MTs (ukuran 26 meter x 15 meter).
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Poin 3 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          3
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Alokasi Waktu Resmi per Peleton:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Setiap peleton memperoleh alokasi waktu tepat 15 – 18 menit, dengan rincian operasional:
                          </p>
                          <ul className="list-[lower-alpha] pl-5 space-y-1 text-xs text-slate-700">
                            <li>Waktu Efektif Uji Coba Arena (8 menit untuk SD/MI dan 12 menit untuk SMP/MTs): Digunakan sepenuhnya untuk orientasi medan, adaptasi, serta latihan pergerakan peleton di dalam arena perlombaan.</li>
                            <li>5 (lima) menit: Waktu transisi keluar-masuk peleton antar peleton.</li>
                            <li>Manajemen waktu dikendalikan secara ketat oleh Petugas Timekeeper Panitia didampingi LO masing-masing peleton.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Poin 4 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          4
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Ketentuan Pakaian dan Perlengkapan Uji Coba:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Peserta diperbolehkan mengenakan seragam olahraga sekolah atau seragam latihan masing-masing yang rapi, sopan, dan bersepatu. Ditegaskan bahwa <span className="text-red-600 font-bold bg-red-50 px-1 rounded border border-red-200">DILARANG KERAS menggunakan sol sepatu berpines/paku atau modifikasi logam tajam</span> yang berpotensi merusak permukaan arena.
                          </p>
                        </div>
                      </div>

                      {/* Poin 5 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          5
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Fokus Orientasi Medan:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Uji coba lapangan dimanfaatkan untuk:
                          </p>
                          <ul className="list-[lower-alpha] pl-5 space-y-1 text-xs text-slate-700">
                            <li>Adaptasi tekstur dan tingkat cengkeraman permukaan paving/lantai arena terhadap alas kaki peleton.</li>
                            <li>Orientasi batas-batas garis arena dan tata letak meja Dewan Juri.</li>
                            <li>Penyesuaian artikulasi, volume, dan gema vokal Komandan Peleton di ruang terbuka.</li>
                            <li>Simulasi alur pergerakan masuk dan keluar arena lomba bersama Liaison Officer (LO). Uji coba ini murni merupakan kegiatan familiarisasi medan dan <span className="font-semibold text-slate-800 bg-slate-100 px-1 rounded">TIDAK ADA penilaian dari Dewan Juri</span>.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* D. HARI PERLOMBAAN - REGISTRASI & UPACARA PEMBUKAAN */}
            {shouldShow('reg') && (
              <div className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-red-500/40 hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('reg')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 font-black flex items-center justify-center text-sm shadow-xs">
                      D
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">D. Tahap II: Hari Perlombaan – Registrasi Ulang s.d. Upacara Pembukaan</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('reg') ? 'rotate-180 text-red-600' : ''}`} />
                </button>
                {isAccordionOpen('reg') && (
                  <div className="bg-white border-t border-slate-100 p-6 sm:p-7 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <div className="grid grid-cols-1 gap-3.5">
                      {/* Poin 1 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          1
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Kedatangan dan Registrasi Ulang Kontingen (06.00 – 09.00 WIB):</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Prosedur kedatangan dan daftar ulang kontingen di Meja Registrasi Resmi (Ruang Registrasi Gedung Madrasah Lantai 1):
                          </p>
                          <ul className="list-[lower-alpha] pl-5 space-y-1.5 text-xs text-slate-700">
                            <li>Official menyerahkan 1 (satu) kartu identitas asli (KTP/SIM perwakilan kontingen) kepada panitia sebagai jaminan ketertiban, kebersihan, dan keutuhan fasilitas ruang basecamp.</li>
                            <li>Official menerima kit fasilitas kontingen: (1) Nomor Dada Peleton resmi; (2) ID Card Resmi (1 Official & 2 Pendukung Resmi); (3) 1 (satu) dus Air Minum Kemasan (botol) per peleton; serta (4) 2 (dua) kantong sampah terpilah (Organik dan Anorganik).</li>
                            <li>Nomor dada peleton wajib disematkan pada dada personel banjar paling kanan saf kedua (Saf 2 Banjar 1 / S2B1).</li>
                            <li>Peleton diarahkan dan dikawal oleh LO pendamping menuju ruang kelas basecamp resmi yang telah ditentukan panitia.</li>
                            <li>Meja registrasi ulang ditutup tepat pukul 09.00 WIB. Peleton yang tidak melakukan daftar ulang hingga batas waktu tersebut dinyatakan mengundurkan diri dan tidak diperkenankan tampil.</li>
                            <li>Regulasi Parkir Kendaraan Kontingen:
                              <ul className="list-[circle] pl-5 mt-1 space-y-1">
                                <li><strong className="text-slate-800">Bus / Kendaraan Besar Kontingen:</strong> Dilarang parkir di dalam area Kampus Terpadu Mu'allimin; bus hanya diperkenankan masuk untuk proses drop-off peserta serta perlengkapan di Drop Zone resmi, kemudian wajib segera menuju dan parkir di kantong parkir Lapangan Hibrida Argomulyo.</li>
                                <li><strong className="text-slate-800">Kendaraan Roda 4 (Mobil) dan Roda 2 (Motor):</strong> Diparkirkan di kantong parkir internal Kampus Terpadu Sedayu sesuai arahan petugas, dan apabila kapasitas parkir internal telah penuh, arus kendaraan dialihkan menuju kantong parkir Lapangan Hibrida Argomulyo.</li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Poin 2 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          2
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Sterilisasi Arena Perlombaan (06.45 WIB):</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Tepat pukul 06.45 WIB, seluruh arena perlombaan (Arena 1 & Arena 2 serta Lapangan Mini Soccer) dinyatakan steril dari segala aktivitas umum. Seluruh peserta upacara pembukaan wajib telah siap berbaris tertib di Lapangan Upacara.
                          </p>
                        </div>
                      </div>

                      {/* Poin 3 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          3
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Pelaksanaan Upacara Pembukaan Resmi (Pukul 07.00 - 07.45 WIB):</strong>
                          <ul className="list-[lower-alpha] pl-5 space-y-1.5 text-xs text-slate-700">
                            <li>Peleton dengan 5 (lima) peleton urutan tampil 6 sampai dengan 10 pada masing-masing tingkatan WAJIB mengikuti Upacara Pembukaan resmi. Yakni:
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-1.5">
                                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-[11px]">
                                  <strong className="text-red-700 block font-sans font-bold mb-0.5">Tingkat SD/MI:</strong>
                                  Nomor urut SD-131, SD-133, SD-135, SD-137, dan SD-139
                                </div>
                                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-[11px]">
                                  <strong className="text-blue-700 block font-sans font-bold mb-0.5">Tingkat SMP/MTs:</strong>
                                  Nomor urut SMP-242, SMP-244, SMP-246, SMP-248, dan SMP-260
                                </div>
                              </div>
                            </li>
                            <li>Komposisi barisan upacara pembukaan terdiri dari 1 Komandan Peleton dan 15 Anggota (5 trio lengkap) mengenakan seragam perlombaan.</li>
                            <li>Pengecekan kehadiran barisan upacara dilakukan oleh panitia 15 menit sebelum upacara dimulai.</li>
                            <li>Peleton yang tidak hadir atau terlambat dikenakan sanksi penalti pengurangan nilai sesuai ketentuan Bab H.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* E. ALUR PERSIAPAN & PELAKSANAAN TAMPIL DI ARENA */}
            {shouldShow('arena') && (
              <div className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-red-500/40 hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('arena')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 font-black flex items-center justify-center text-sm shadow-xs">
                      E
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">E. Tahap III: Hari Perlombaan – Alur Persiapan & Pelaksanaan Tampil di Arena</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('arena') ? 'rotate-180 text-red-600' : ''}`} />
                </button>
                {isAccordionOpen('arena') && (
                  <div className="bg-white border-t border-slate-100 p-6 sm:p-7 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <div className="grid grid-cols-1 gap-3.5">
                      {/* Poin 1 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          1
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Pemberitahuan Kesiapan Peleton di Basecamp:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            LO mendatangi basecamp 15 menit sebelum jadwal pemanggilan resmi ke DP 1 guna memastikan kesiapan pasukan, kelengkapan atribut seragam tonti, serta keutuhan personel.
                          </p>
                        </div>
                      </div>

                      {/* Poin 2 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          2
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Pemanggilan Resmi & Tahap Kesiapan di DP 1 (Pos Pengecekan & Verifikasi):</strong>
                          <ul className="list-[lower-alpha] pl-5 space-y-1 text-xs text-slate-700">
                            <li>Peleton <span className="text-red-600 font-bold bg-red-50 px-1 rounded border border-red-200">HANYA DIPERBOLEHKAN menuju dan memasuki area DP 1 setelah dipanggil resmi oleh panitia</span> melalui pengeras suara (mic). Peleton dilarang keras memasuki area DP 1 sebelum dipanggil resmi.</li>
                            <li>Peleton yang tidak hadir di DP 1 setelah dilakukan 3 (tiga) kali pemanggilan resmi dengan interval masing-masing 2 (dua) menit dikenakan <span className="text-red-700 font-bold bg-red-50 px-1 rounded border border-red-200">sanksi pemotongan nilai sebesar -100 poin</span>. Apabila setelah sanksi tersebut diberikan peleton tetap tidak hadir saat peleton urutan berikutnya telah menyelesaikan penampilannya di arena, maka peleton tersebut <span className="text-red-700 font-bold bg-red-50 px-1 rounded border border-red-200">dinyatakan DISKUALIFIKASI</span>.</li>
                            <li>Di DP 1, petugas panitia melakukan:
                              <ul className="list-[circle] pl-5 mt-1 space-y-1">
                                <li>Pemeriksaan komposisi personel: tepat 22 orang masuk arena (1 Komandan Peleton dan 21 Pasukan Inti). Pelanggaran atas kekurangan personel dikenakan sanksi pemotongan nilai -75 poin per personel yang kurang.</li>
                                <li>Pemeriksaan pemasangan nomor dada peleton di dada kiri personel S2B1.</li>
                                <li>Pemeriksaan fisik sol sepatu seluruh personel. Ditegaskan bahwa <span className="text-red-600 font-bold">DILARANG KERAS menggunakan pines, paku payung, spikes, logam tajam, atau pul sepatu bola/futsal bergerigi tajam</span>. Penggunaan modifikasi terlarang tersebut berakibat personel yang bersangkutan dilarang tampil.</li>
                                <li>Pelaporan pergantian cadangan terencana kepada petugas panitia di DP 1.</li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Poin 3 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          3
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Tahap Ruang Tunggu di DP 2 (Holding Area Siap Tampil):</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Setelah dinyatakan lolos verifikasi dari DP 1, peleton diarahkan bergeser menuju DP 2 yang difungsikan murni sebagai Ruang Tunggu Siap Tampil. Peleton menjaga ketenangan, fokus mental, dan berbaris rapi menunggu aba-aba dari pengatur lapangan untuk memasuki arena lomba.
                          </p>
                        </div>
                      </div>

                      {/* Poin 4 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          4
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Memasuki Arena dan Penentuan Posisi Center Juri:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Komandan Peleton memimpin pasukannya memasuki arena menuju titik tengah arena sehingga posisi peleton berada tepat di tengah (center) menghadap langsung ke arah meja Dewan Juri. Sebelum melapor, danton mengondisikan pasukannya terlebih dahulu (diberi aba-aba siap atau diluruskan).
                          </p>
                        </div>
                      </div>

                      {/* Poin 5 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          5
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Penghormatan Awal kepada Dewan Juri:</strong>
                          <ul className="list-[lower-alpha] pl-5 space-y-1 text-xs text-slate-700">
                            <li>Komandan Peleton mengambil posisi di samping kanan barisan pasukannya menghadap ke arah meja Dewan Juri, lalu memimpin penghormatan dengan lantang: <em>"Kepada Dewan Juri, Hormat = GERAK"</em>.</li>
                            <li><span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">WAKTU TAMPIL RESMI (STOPWATCH) DIMULAI</span> tepat saat aba-aba pelaksanaan penghormatan pembuka (kata <em>"GERAK"</em>) dihentakkan oleh Komandan Peleton.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Poin 6 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          6
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Laporan Pembuka dan Transisi ke Kotak Danton:</strong>
                          <ul className="list-[lower-alpha] pl-5 space-y-1 text-xs text-slate-700">
                            <li>Setelah aba-aba <em>"Tegak = GERAK"</em>, Komandan Peleton melangkah mengambil posisi di depan tengah peleton menghadap meja Dewan Juri untuk menyampaikan laporan resmi: <em>"Lapor, peleton dengan nomor dada (sebutkan nomor urut dalam ejaan kata, contoh: satu satu satu) siap melaksanakan materi gerakan lomba."</em></li>
                            <li>Setelah melapor, Komandan Peleton melangkah memasuki Kotak Danton (1,5 x 1,5 meter) dengan posisi menghadap peleton (posisi komando), dilarang keras membelakangi meja juri, dan memimpin penampilan seluruh materi gerakan secara urut dan tuntas.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Poin 7 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          7
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Durasi Waktu dan Sinyal Peluit Timekeeper:</strong>
                          <ul className="list-[lower-alpha] pl-5 space-y-1 text-xs text-slate-700">
                            <li>Durasi maksimal tampil resmi: <strong className="text-slate-900">8 menit untuk tingkat SD/MI</strong> dan <strong className="text-slate-900">12 menit untuk tingkat SMP/MTs</strong>.</li>
                            <li><strong className="text-slate-800">Sinyal Peluit 1 Kali Panjang:</strong> Peringatan bahwa waktu tampil tersisa 1 menit (menit ke-7 untuk SD/MI dan menit ke-11 untuk SMP/MTs).</li>
                            <li><strong className="text-slate-800">Sinyal Peluit 2 Kali Panjang:</strong> Penanda resmi bahwa durasi waktu tampil telah habis (menit ke-8 untuk SD/MI dan menit ke-12 untuk SMP/MTs). Peleton wajib segera menyelesaikan materi dan meninggalkan arena.</li>
                            <li>Waktu stopwatch resmi berakhir tepat saat Komandan Peleton menghentakkan aba-aba pelaksanaan 'GERAK' pada penghormatan penutup ('Tegak = GERAK').</li>
                          </ul>
                        </div>
                      </div>

                      {/* Poin 8 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          8
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Sinyal Pelanggaran Garis:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Hakim Garis mengibaskan bendera khusus sebagai penanda resmi setiap kali terjadi pelanggaran garis batas arena oleh anggota pasukan maupun batas Kotak Danton oleh Komandan Peleton berdasarkan asas "Garis sebagai Garis".
                          </p>
                        </div>
                      </div>

                      {/* Poin 9 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          9
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Ketentuan Khusus Atribut Terjatuh di Arena:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Apabila terdapat atribut pakaian atau seragam peserta (seperti topi/peci, dasi, pin, lencana, tanda pangkat, sabuk, selempang, sarung tangan, atau tali sepatu) yang terlepas atau terjatuh di dalam arena lomba, <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">TIDAK DIKENAKAN SANKSI PENALTI PENGURANGAN NILAI (0 POIN)</span>. Personel peleton dilarang memungut atribut yang terjatuh sampai seluruh rangkaian penampilan selesai dan peleton telah keluar dari arena lomba.
                          </p>
                        </div>
                      </div>

                      {/* Poin 10 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          10
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Ketentuan Khusus Pergantian Pemain dan Penanganan Insiden di Lapangan:</strong>
                          <ul className="list-[lower-alpha] pl-5 space-y-1 text-xs text-slate-700">
                            <li>Pemain inti hanya dapat digantikan oleh pemain cadangan resmi yang terdaftar pada peleton bersangkutan.</li>
                            <li><strong className="text-slate-800">Jeda Pergantian Resmi di Arena:</strong> Pergantian pemain dilaksanakan pada saat materi “Bubar”, yaitu: (1) Tingkat SD/MI dilakukan di antara Materi No. 16 dan 17; (2) Tingkat SMP/MTs dilakukan di antara Materi No. 22 dan 23.</li>
                            <li><strong className="text-slate-800">Tata Cara Pergantian:</strong> Setelah Komandan Peleton memberikan aba-aba “Bubar”, anggota yang akan digantikan diperbolehkan meninggalkan arena dan anggota pengganti diperbolehkan memasuki arena untuk menempati posisi yang telah ditentukan. Pergerakan anggota yang digantikan dan anggota pengganti pada saat proses pergantian tersebut tidak dianggap sebagai pelanggaran garis dan tidak dikenai penalti. Setelah pergantian selesai, seluruh anggota wajib berada pada posisi yang ditentukan sebelum materi berikutnya dimulai.</li>
                            <li><strong className="text-slate-800">Waktu Pergantian:</strong> Waktu stopwatch tetap berjalan selama proses pergantian pemain. Tidak terdapat penghentian atau penambahan waktu khusus untuk proses pergantian.</li>
                            <li><strong className="text-slate-800">Pergantian Tidak Terencana (Darurat):</strong> Apabila terjadi cedera atau kondisi lain yang menyebabkan seorang anggota tidak dapat melanjutkan perlombaan, Official dapat memberikan isyarat kepada Panitia Lapangan untuk meminta izin pergantian pemain. Pergantian darurat dilakukan dengan menggunakan pemain cadangan resmi dan mengikuti arahan Panitia Lapangan. (1) Apabila cedera/kondisi tidak membahayakan keselamatan atau jiwa peserta, waktu perlombaan tetap berjalan dan penampilan dilanjutkan setelah pergantian selesai; (2) Apabila cedera/kondisi membahayakan keselamatan atau jiwa peserta, Panitia Lapangan berwenang menghentikan sementara penampilan. Setelah kondisi aman, penampilan dapat diulang dari awal berdasarkan keputusan Panitia Lapangan dan Dewan Juri.</li>
                            <li><strong className="text-slate-800">Pergantian Komandan Peleton:</strong> Komandan Peleton hanya dapat digantikan apabila mengalami kondisi darurat, seperti sakit berat, pingsan, atau kondisi lain yang menyebabkan tidak dapat melanjutkan perlombaan. Apabila kondisi tersebut terjadi di dalam arena, Komandan Peleton dapat digantikan oleh personel yang berada di dalam arena sesuai arahan Panitia Lapangan. Komandan pengganti tidak berhak mengikuti penilaian atau perebutan kategori Juara Komandan Peleton.</li>
                            <li><strong className="text-slate-800">Penanganan Insiden Fisik:</strong> Personel yang mengalami cedera, pingsan, atau insiden fisik lainnya dapat ditangani oleh Official, pemain cadangan, atau tim medis tanpa menghentikan waktu perlombaan. Apabila insiden dinilai membahayakan keselamatan atau jiwa peserta, Panitia Lapangan berwenang menghentikan sementara penampilan untuk penanganan keadaan darurat.</li>
                            <li><strong className="text-slate-800">Ketentuan Garis Selama Pergantian:</strong> Pergerakan pemain yang digantikan untuk keluar dari arena dan pemain pengganti untuk memasuki arena hanya dibebaskan dari ketentuan pelanggaran garis selama proses pergantian resmi sebagaimana dimaksud pada huruf b dan c. Di luar proses pergantian resmi tersebut, setiap anggota tetap wajib mematuhi ketentuan garis arena dan dapat dikenai penalti sesuai ketentuan yang berlaku.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Poin 11 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          11
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Laporan Penutup, Penghormatan Penutup, dan Penghentian Waktu:</strong>
                          <ul className="list-[lower-alpha] pl-5 space-y-1 text-xs text-slate-700">
                            <li>Setelah seluruh materi gerakan selesai dilaksanakan, Komandan Peleton melangkah keluar dari Kotak Danton menuju posisi di depan peleton menghadap meja Dewan Juri untuk menyampaikan laporan penutup: <em>"Lapor, peleton dengan nomor dada (sebutkan nomor urut dalam ejaan kata) telah melaksanakan materi lomba, laporan selesai."</em></li>
                            <li>Komandan Peleton kemudian melangkah mengambil posisi di samping kanan barisan pasukannya menghadap ke arah meja Dewan Juri, lalu memimpin penghormatan penutup: <em>"Kepada Dewan Juri, Hormat = GERAK"</em>, dan diakhiri dengan aba-aba: <em>"Tegak = GERAK"</em>.</li>
                            <li><span className="font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">WAKTU TAMPIL RESMI (STOPWATCH) BERHENTI</span> tepat saat aba-aba pelaksanaan tegak penutup (kata <em>"GERAK"</em>) dihentakkan oleh Komandan Peleton.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Poin 12 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          12
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Alur Keluar Arena dan Pengembalian Nomor Dada:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Komandan Peleton memimpin pasukannya melangkah keluar arena perlombaan secara tertib menuju titik keluar. Di pos keluar arena, Official peleton wajib mengembalikan nomor dada peleton kepada petugas panitia, selanjutnya peleton dipandu oleh LO kembali menuju ruang basecamp kontingen.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* F. PASCA-LOMBA - PENILAIAN, LIVE SCORE & SANGGAH */}
            {shouldShow('score') && (
              <div className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-red-500/40 hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('score')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 font-black flex items-center justify-center text-sm shadow-xs">
                      F
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">F. Tahap IV: Pasca-Lomba – Sistem Penilaian, Rolling Release, Sanggah & Penentuan Juara</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('score') ? 'rotate-180 text-red-600' : ''}`} />
                </button>
                {isAccordionOpen('score') && (
                  <div className="bg-white border-t border-slate-100 p-6 sm:p-7 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <div className="grid grid-cols-1 gap-3.5">
                      {/* Poin 1 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          1
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Mekanisme dan Aspek Penilaian Dewan Juri:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Penilaian dilakukan secara objektif oleh 6 Dewan Juri (unsur TNI, POLRI, dan PPI: 3 Juri Arena 1 SD & 3 Juri Arena 2 SMP). Keputusan Dewan Juri mengenai mutu gerak bersifat mutlak dan tidak dapat diganggu gugat.
                          </p>
                        </div>
                      </div>

                      {/* Poin 2 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          2
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Kriteria Penilaian:</strong>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 shadow-xs">
                              <strong className="text-slate-900 block mb-0.5">Penilaian Peleton:</strong>
                              Perbandingan penilaian peleton adalah 1:1, yaitu Kebenaran Teknik (1) dan Kekompakan (1). Masing-masing aspek memiliki rentang nilai 50 s.d. 90 poin.
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 shadow-xs">
                              <strong className="text-slate-900 block mb-0.5">Nilai Murni Peleton:</strong>
                              Total Nilai Kebenaran Teknik + Total Nilai Kekompakan.
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 shadow-xs">
                              <strong className="text-slate-900 block mb-0.5">Nilai Akhir Peleton:</strong>
                              (Nilai Murni Peleton) – (Total Akumulasi Poin Penalti Peleton).
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 shadow-xs">
                              <strong className="text-slate-900 block mb-0.5">Nilai Murni Komandan:</strong>
                              (Penguasaan Materi × 35%) + (Kualitas Suara/Vokal × 25%) + (Sikap dan Pelaporan × 20%) + (Penguasaan Lapangan × 20%).
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 shadow-xs sm:col-span-2">
                              <strong className="text-slate-900 block mb-0.5">Nilai Akhir Komandan:</strong>
                              (Nilai Murni Komandan) – (Total Akumulasi Poin Penalti Komandan).
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Poin 3 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          3
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Kriteria Penentuan Juara Peleton:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Penentuan Juara Peleton didasarkan pada Nilai Akhir Peleton dengan perolehan skor tertinggi. Apabila terdapat kesamaan Nilai Akhir Peleton, penentuan peringkat kejuaraan dilakukan berdasarkan urutan prioritas sebagai berikut:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                            <span className="p-2.5 bg-white rounded-xl border border-slate-200">(a) Nilai tertinggi pada aspek Kebenaran Teknik;</span>
                            <span className="p-2.5 bg-white rounded-xl border border-slate-200">(b) Nilai tertinggi pada aspek Kekompakan;</span>
                            <span className="p-2.5 bg-white rounded-xl border border-slate-200">(c) Akumulasi poin penalti paling sedikit; dan</span>
                            <span className="p-2.5 bg-white rounded-xl border border-slate-200">(d) Hasil musyawarah serta pertimbangan Dewan Juri dalam Sidang Pleno Juri yang keputusannya bersifat final dan mengikat.</span>
                          </div>
                        </div>
                      </div>

                      {/* Poin 4 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          4
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Kriteria Penentuan Juara Komandan:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Penentuan Juara Komandan Peleton didasarkan pada Nilai Akhir Komandan dengan perolehan skor tertinggi dari seluruh aspek penilaian. Apabila terdapat kesamaan Nilai Akhir Komandan, penentuan peringkat kejuaraan dilakukan berdasarkan urutan prioritas sebagai berikut:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                            <span className="p-2.5 bg-white rounded-xl border border-slate-200">(a) Nilai tertinggi pada aspek Penguasaan Materi Lomba;</span>
                            <span className="p-2.5 bg-white rounded-xl border border-slate-200">(b) Nilai tertinggi pada aspek Kualitas Suara/Vokal;</span>
                            <span className="p-2.5 bg-white rounded-xl border border-slate-200">(c) Nilai tertinggi pada aspek Sikap & Pelaporan; dan</span>
                            <span className="p-2.5 bg-white rounded-xl border border-slate-200">(d) Hasil musyawarah dan pertimbangan Dewan Juri dalam Sidang Pleno Juri yang keputusannya bersifat final serta mengikat.</span>
                          </div>
                        </div>
                      </div>

                      {/* Poin 5 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          5
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Sistem Perolehan Poin Juara Umum:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Juara Umum ditetapkan secara terpisah untuk masing-masing tingkatan, yaitu SD/MI dan SMP/MTs. Penetapan Juara Umum didasarkan pada akumulasi prestasi seluruh perwakilan yang berasal dari sekolah yang sama, meliputi capaian Juara Peleton dan Juara Komandan. Poin kejuaraan diberikan dengan ketentuan:
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-2 text-xs font-mono">
                            <span className="bg-white p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900">Juara 1 Peleton: 6 Poin</span>
                            <span className="bg-white p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900">Juara 2 Peleton: 5 Poin</span>
                            <span className="bg-white p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900">Juara 3 Peleton: 4 Poin</span>
                            <span className="bg-white p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900">Juara Harapan 1: 3 Poin</span>
                            <span className="bg-white p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900">Juara Harapan 2: 2 Poin</span>
                            <span className="bg-white p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900">Juara Harapan 3: 1 Poin</span>
                            <span className="bg-amber-50 text-amber-900 p-2.5 rounded-xl border border-amber-300 font-bold">Juara 1 Komandan Terbaik: 3 Poin</span>
                            <span className="bg-amber-50 text-amber-900 p-2.5 rounded-xl border border-amber-300 font-bold">Juara 2 Komandan Terbaik: 2 Poin</span>
                            <span className="bg-amber-50 text-amber-900 p-2.5 rounded-xl border border-amber-300 font-bold">Juara 3 Komandan Terbaik: 1 Poin</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Seluruh poin yang diperoleh oleh peleton dan komandan dari sekolah yang sama dijumlahkan sebagai akumulasi poin sekolah. Sekolah dengan total poin tertinggi ditetapkan sebagai Juara Umum pada tingkatannya.
                          </p>
                        </div>
                      </div>

                      {/* Poin 6 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          6
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Definisi Nilai Murni Peleton/Komandan:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Nilai yang diperoleh Peleton/Komandan berdasarkan hasil penilaian Dewan Juri sebelum dikurangi seluruh penalti atau pengurangan nilai yang dikenakan berdasarkan ketentuan Juknis Lapangan.
                          </p>
                        </div>
                      </div>

                      {/* Poin 7 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          7
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Tie-Breaker Juara Umum:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Apabila terdapat dua atau lebih sekolah yang memperoleh total poin Juara Umum yang sama, penentuan peringkat dilakukan berdasarkan urutan prioritas sebagai berikut:
                          </p>
                          <ul className="list-[lower-alpha] pl-5 space-y-1 text-xs text-slate-700">
                            <li><strong>Peringkat Tertinggi Peleton:</strong> Dibandingkan berdasarkan peringkat tertinggi yang berhasil diraih oleh peleton masing-masing sekolah. Peringkat yang lebih tinggi memiliki prioritas lebih besar (Juara 1 Peleton lebih diprioritaskan daripada Juara 2 Peleton).</li>
                            <li><strong>Nilai Murni Peleton:</strong> Apabila peringkat tertinggi Peleton yang diraih masih sama, penentuan dilanjutkan berdasarkan nilai murni tertinggi dari peleton yang memiliki peringkat tertinggi tersebut.</li>
                            <li><strong>Nilai Kebenaran Teknik Gerakan PBB:</strong> Apabila nilai murni Peleton masih sama, penentuan dilanjutkan berdasarkan nilai murni tertinggi pada aspek Kebenaran Teknik Gerakan PBB dari peleton yang dibandingkan.</li>
                            <li><strong>Capaian Peleton Berikutnya:</strong> Apabila seluruh kriteria pada peleton dengan peringkat tertinggi masih sama, perbandingan dilanjutkan pada capaian peleton berikutnya secara berurutan berdasarkan peringkat yang diraih.</li>
                            <li><strong>Capaian Komandan Terbaik:</strong> Apabila seluruh capaian Peleton masih menghasilkan nilai yang sama, penentuan dilanjutkan berdasarkan peringkat Komandan Terbaik yang diraih oleh masing-masing sekolah.</li>
                            <li><strong>Sidang Pleno Juri:</strong> Apabila seluruh kriteria tersebut masih menghasilkan kedudukan yang sama, penentuan akhir dilakukan melalui musyawarah Dewan Juri dalam Sidang Pleno Juri.</li>
                            <li><strong>Keputusan Akhir:</strong> Keputusan Dewan Juri dalam Sidang Pleno Juri bersifat mutlak dan tidak dapat diganggu gugat.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Poin 8 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          8
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Transparansi Nilai (Akses e-Rekapitulasi Berbasis Akun Gmail Peleton):</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Sebagai wujud integritas dan transparansi modern, publikasi rekapitulasi nilai peleton menerapkan sistem rilis bertahap (rolling release) tanpa harus menunggu seluruh peserta selesai tampil. Rincian perolehan nilai masing-masing peleton akan dirilis dan dapat diakses pada portal resmi https://lbb.tontimuallimin.com dengan estimasi waktu ±1 (satu) jam setelah peleton yang bersangkutan menyelesaikan penampilan di arena perlombaan. Official peleton dapat melihat lembar rekapitulasi nilai lengkap secara privat dan mandiri dengan login menggunakan akun Gmail masing-masing yang telah didaftarkan saat registrasi.
                          </p>
                        </div>
                      </div>

                      {/* Poin 9 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          9
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Mekanisme Pengajuan Sanggah (Protes Resmi):</strong>
                          <ul className="list-[lower-alpha] pl-5 space-y-1 text-xs text-slate-700">
                            <li><strong className="text-slate-800">Batasan Sanggah:</strong> Protes HANYA diterima untuk dugaan kekeliruan administratif non-penilaian (kesalahan penjumlahan skor, keliru input sistem dari lembar juri, atau ketidaksesuaian catatan penalti). Penilaian kualitatif juri mengenai mutu gerakan tidak dapat disanggah.</li>
                            <li><strong className="text-slate-800">Batas Waktu Pengajuan:</strong> Pengajuan sanggah dapat dilakukan sejak nilai peleton dirilis di portal, dan seluruh masa sanggah resmi DITUTUP SERENTAK pukul 15.00 WIB. Penetapan hasil pasca-sanggah bersifat final dan mengikat sebelum Upacara Penutupan pukul 16.00 WIB.</li>
                            <li><strong className="text-slate-800">Prosedur Sanggah:</strong> Diajukan secara TERTULIS menggunakan Formulir Sanggahan Resmi oleh 1 (satu) orang Official resmi terdaftar di Ruang Informasi Resmi Panitia (Ruang Registrasi Gedung Madrasah Lantai 1) dengan melampirkan bukti valid (video/foto/catatan). Panitia TIDAK melayani protes secara lisan.</li>
                            <li><strong className="text-slate-800">Keputusan Sanggah:</strong> Jika protes diterima dan sah, Panitia menerbitkan 'Pemberitahuan Koreksi Hasil Resmi' yang menjadi dasar ketetapan kejuaraan.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Poin 10 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          10
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Ketentuan Pasca-Lomba dan Prosedur Checkout Basecamp:</strong>
                          <ul className="list-[lower-alpha] pl-5 space-y-1 text-xs text-slate-700">
                            <li><strong className="text-slate-800">Batas Waktu Maksimal Pengosongan:</strong> Seluruh peleton wajib menyelesaikan proses checkout dan mengosongkan ruang kelas basecamp selambat-lambatnya pukul 15.00 WIB (1 jam sebelum Upacara Penutupan dimulai).</li>
                            <li><strong className="text-slate-800">Alur 4 Langkah Checkout Resmi:</strong> (1) Merapikan kembali susunan meja-kursi dan memastikan tidak ada barang peleton tertinggal; (2) Membawa dan menyerahkan 2 (dua) kantong sampah terpilah (Organik & Non-Organik) ke Pos/Area Checkout Panitia; (3) Pemeriksaan langsung kebersihan dan keutuhan fasilitas ruangan kelas oleh LO/Panitia Kebersihan guna memperoleh Tanda Bukti Lolos Verifikasi Checkout; (4) Pengambilan kembali kartu identitas jaminan (KTP/SIM) di Ruang Informasi Panitia dengan menunjukkan Tanda Bukti Lolos Verifikasi.</li>
                            <li><strong className="text-slate-800">Ketentuan Sanksi & Denda:</strong> Peleton yang meninggalkan basecamp dalam keadaan kotor/berantakan dikenai sanksi penalti -50 poin pada rekapitulasi nilai akhir. Apabila terjadi kerusakan fisik atau kehilangan fasilitas kelas, kartu jaminan KTP/SIM ditahan serta dikenakan sanksi ganti rugi penuh dan denda administratif Rp 500.000 sesuai Pasal 14 Tata Tertib Peserta.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* G. GANGGUAN SISTEM DIGITAL DAN PROSEDUR BACKUP */}
            {shouldShow('digital') && (
              <div className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-red-500/40 hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('digital')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 font-black flex items-center justify-center text-sm shadow-xs">
                      G
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">G. Gangguan Sistem Digital dan Prosedur Backup</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('digital') ? 'rotate-180 text-red-600' : ''}`} />
                </button>
                {isAccordionOpen('digital') && (
                  <div className="bg-white border-t border-slate-100 p-6 sm:p-7 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <div className="grid grid-cols-1 gap-3.5">
                      {/* Poin 1 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          1
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Gangguan Sistem:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Apabila terjadi gangguan pada website, jaringan internet, akun, upload dokumen, penyimpanan nilai, atau sistem digital lainnya, Panitia dapat menerapkan prosedur manual sementara.
                          </p>
                        </div>
                      </div>

                      {/* Poin 2 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          2
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Backup Manual:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Panitia wajib menyediakan formulir atau dokumen manual untuk pencatatan data peserta, administrasi, hasil penilaian, dan data penting lainnya sebagai cadangan.
                          </p>
                        </div>
                      </div>

                      {/* Poin 3 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          3
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Gangguan Login dan Upload:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Apabila peserta mengalami kendala login atau gagal mengunggah dokumen karena gangguan sistem, Panitia memberikan alternatif verifikasi atau pengumpulan dokumen secara manual.
                          </p>
                        </div>
                      </div>

                      {/* Poin 4 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          4
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Gangguan Penyimpanan Nilai:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Apabila nilai tidak tersimpan atau sistem penilaian mengalami gangguan, nilai dicatat secara manual oleh Juri atau Asisten Juri dan dikonfirmasi setelah sistem kembali normal.
                          </p>
                        </div>
                      </div>

                      {/* Poin 5 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          5
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Pemulihan Data:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Setelah sistem kembali normal, data manual diverifikasi dan dimasukkan kembali ke sistem berdasarkan catatan resmi Panitia dan Juri.
                          </p>
                        </div>
                      </div>

                      {/* Poin 6 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          6
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Keputusan Panitia:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Gangguan teknis sistem tidak dapat dijadikan dasar untuk menghilangkan atau mengubah nilai peserta. Setiap keputusan terkait penggunaan data backup ditetapkan oleh Panitia berdasarkan catatan resmi yang tersedia.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* H. SANKSI DAN PENALTI PENGURANGAN NILAI */}
            {shouldShow('penalty') && (
              <div className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-red-500/40 hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('penalty')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-red-100 text-red-700 font-black flex items-center justify-center text-sm shadow-xs">
                      H
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">H. Ketentuan Sanksi dan Penalti Pengurangan Nilai</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('penalty') ? 'rotate-180 text-red-600' : ''}`} />
                </button>
                {isAccordionOpen('penalty') && (
                  <div className="bg-white border-t border-slate-100 p-6 sm:p-7 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">
                      Pelanggaran terhadap regulasi teknis lapangan dikenakan sanksi pemotongan nilai secara kumulatif pada lembar rekapitulasi nilai akhir:
                    </p>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 text-slate-800 uppercase font-black tracking-wider text-[11px]">
                          <tr>
                            <th className="py-3 px-4">Jenis Pelanggaran</th>
                            <th className="py-3 px-4 text-center">Besaran Penalti</th>
                            <th className="py-3 px-4">Keterangan / Regulasi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {PENALTIES.map((p, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-4 font-bold text-slate-900 text-xs sm:text-sm">{p.label}</td>
                              <td className="py-3 px-4 text-center">
                                <span className={`font-mono font-black px-2.5 py-1 rounded-lg text-xs inline-block shadow-xs ${
                                  p.value.includes('0 Poin') ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'
                                }`}>
                                  {p.value}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-600 text-xs leading-relaxed">
                                {idx === 0 && 'Urutan tampil 6 s.d. 10 (SD-131, 133, 135, 137, 139 & SMP-242, 244, 246, 248, 260) wajib hadir 1 danton + 15 anggota (5 trio).'}
                                {idx === 1 && 'Dikenakan per kelipatan 5 menit keterlambatan memasuki barisan upacara.'}
                                {idx === 2 && 'Setelah 3x panggilan interval 2 menit; jika tetap absen: Diskualifikasi.'}
                                {idx === 3 && 'Personel masuk arena kurang dari 22 orang (1 Danton + 21 Pasukan).'}
                                {idx === 4 && 'Melebihi durasi resmi (SD > 8 menit, SMP > 12 menit) per rentang 1-30 detik.'}
                                {idx === 5 && 'Alas kaki/anggota tubuh menginjak garis arena atau keluar Kotak Danton 1,5x1,5m.'}
                                {idx === 6 && 'Gerakan penyesuaian tidak dibatasi kuota (0 poin penalti), diperhitungkan dalam aspek Penguasaan Lapangan Danton.'}
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
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        <strong className="text-slate-900 font-bold">Pencatatan Penalti:</strong> Seluruh sanksi pengurangan nilai dicatat secara langsung dan transparan oleh Hakim Garis, Timekeeper, dan Koordinator Lapangan ke dalam Berita Acara Pelanggaran Resmi serta disahkan oleh Perwakilan Dewan Juri.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* I. KEADAAN KAHAR (FORCE MAJEURE) */}
            {shouldShow('force') && (
              <div className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-red-500/40 hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('force')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 font-black flex items-center justify-center text-sm shadow-xs">
                      I
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">I. Keadaan Kahar (Force Majeure)</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('force') ? 'rotate-180 text-red-600' : ''}`} />
                </button>
                {isAccordionOpen('force') && (
                  <div className="bg-white border-t border-slate-100 p-6 sm:p-7 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <div className="grid grid-cols-1 gap-3.5">
                      {/* Poin 1 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          1
                        </span>
                        <div className="space-y-1">
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Keadaan kahar adalah peristiwa darurat di luar kemampuan manusia dan kendali teknis Panitia maupun Peserta, meliputi: bencana alam, gempa bumi, angin puting beliung, hujan badai ekstrem yang membahayakan keselamatan fisik peserta, huru-hara, atau gangguan massal tak terduga.
                          </p>
                        </div>
                      </div>

                      {/* Poin 2 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          2
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Kondisi Hujan Ringan (Gerimis):</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Perlombaan tetap dilanjutkan secara normal.
                          </p>
                        </div>
                      </div>

                      {/* Poin 3 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          3
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Kondisi Hujan Deras / Badai Ekstrem:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Panitia Pelaksana bersama Dewan Juri berhak menghentikan perlombaan untuk sementara waktu demi keselamatan peserta.
                          </p>
                        </div>
                      </div>

                      {/* Poin 4 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          4
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Prosedur Pengulangan Tampil:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Apabila perlombaan dihentikan saat suatu peleton sedang tampil akibat keadaan kahar, maka setelah kondisi dinyatakan aman dan kondusif kembali, peleton yang bersangkutan diberikan hak untuk mengulang penampilannya dari awal masuk arena, dengan perhitungan waktu (stopwatch) di-reset kembali ke 00:00. Nilai yang diakui secara sah adalah nilai dari penampilan ulangan tersebut.
                          </p>
                        </div>
                      </div>

                      {/* Poin 5 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          5
                        </span>
                        <div className="space-y-1">
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Keputusan terkait status keadaan kahar, penundaan, penghentian, maupun penjadwalan ulang merupakan kewenangan mutlak Panitia Pelaksana setelah berkonsultasi dengan Dewan Juri.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* J. PENUTUP */}
            {shouldShow('closing') && (
              <div className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-red-500/40 hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('closing')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 font-black flex items-center justify-center text-sm shadow-xs">
                      J
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">J. Penutup</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('closing') ? 'rotate-180 text-red-600' : ''}`} />
                </button>
                {isAccordionOpen('closing') && (
                  <div className="bg-white border-t border-slate-100 p-6 sm:p-7 text-slate-700 text-sm leading-relaxed space-y-5 animate-fade">
                    <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 leading-relaxed text-xs sm:text-sm text-slate-700">
                      <p>
                        Petunjuk Teknis Lapangan ini menjadi pedoman operasional resmi bagi seluruh panitia, dewan juri, dan peserta LBB Mu'allimin Tahun 2027. Seluruh hal teknis tambahan yang disepakati bersama dalam forum Technical Meeting mengikat secara sah dan menjadi bagian tak terpisahkan dari juknis ini.
                      </p>
                    </div>

                    <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 rounded-2xl shadow-sm space-y-4">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                        <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-bold text-white text-xs uppercase tracking-wider">
                          Pusat Layanan dan Narahubung Resmi:
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-1 flex items-center gap-1.5">
                            <Radio className="w-3 h-3 text-emerald-400" /> WhatsApp Helpdesk
                          </span>
                          <strong className="text-white text-xs block font-mono">0819-4749-1505</strong>
                          <span className="text-[11px] text-slate-400 block mt-0.5">(Admin Tonti Mu'allimin)</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-1 flex items-center gap-1.5">
                            <Globe className="w-3 h-3 text-blue-400" /> Website Portal
                          </span>
                          <strong className="text-white text-xs block font-mono truncate">https://lbb.tontimuallimin.com</strong>
                          <span className="text-[11px] text-slate-400 block mt-0.5">Portal Resmi Lomba</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-1 flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-red-400" /> Email Resmi
                          </span>
                          <strong className="text-white text-xs block font-mono">lbb@tontimuallimin.com</strong>
                          <span className="text-[11px] text-slate-400 block mt-0.5">Sekretariat Panitia</span>
                        </div>
                      </div>
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
