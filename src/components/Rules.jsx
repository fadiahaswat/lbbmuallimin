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
  Scale,
  ClipboardList
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
    checkout: false,
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
        checkout: true,
        force: true,
        closing: true,
      };
    }

    return {
      intro: 'pendahuluan petunjuk teknis resmi lbb muallimin perpang tni 58 57 45 hormat kanan pbb ppm alur kronologis'.includes(query),
      def: 'definisi istilah clear area dp 1 dp 2 holding area kotak danton 1.5 bendera hakim garis gerakan penyesuaian dimensi basket embung 25x14 26x15 official pendukung'.includes(query),
      tm: 'technical meeting tm peserta aula wirobrajan 9 januari 2027 berkas fisik surat tugas kepala sekolah pakta integritas undian lotting sd-111 smp-222'.includes(query),
      trial: 'uji coba lapangan familiarisasi medan sedayu 16 januari 2027 15 menit 8 menit 12 menit 5 menit transisi'.includes(query),
      reg: 'registrasi s.d. upacara pembukaan kedatangan check-in 06.00 09.00 ktp jaminan nomor dada s2b1 kantong sampah terpilah sterilisasi upacara pembukaan sd-131 smp-242 15 anggota'.includes(query),
      arena: 'alur persiapan pelaksanaan tampil arena posisi center juri laporan pembuka penghormatan peluit 1 kali panjang 1 menit habis menit 8 12 bendera hakim garis atribut terjatuh bubar pergantian pemain cadangan cenderamata souvenir nomor dada'.includes(query),
      checkout: 'pasca lomba checkout basecamp 15.00 wib 4 langkah meja kursi kantong sampah terpilah verifikasi lo ktp jaminan denda 500.000'.includes(query),
      force: 'keadaan kahar force majeure darurat bencana alam hujan lebat badai petir henti reset stopwatch wewenang'.includes(query),
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
      <div className={embedded ? 'w-full relative z-10' : 'container mx-auto px-6 relative z-10'}>
        {!embedded && (
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              Juknis Lapangan Resmi
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4 leading-tight">
              Petunjuk Teknis{' '}
              <span className="text-red-700">
                Lapangan
              </span>
            </h2>
            <div className="w-16 h-1 bg-red-700 mx-auto rounded-full mb-4"></div>
            <p className="text-slate-600 max-w-3xl mx-auto text-base sm:text-lg font-normal leading-relaxed">
              Pedoman teknis alur kronologis kegiatan, dimensi arena lomba, tata tertib tampil peleton, prosedur checkout basecamp, dan protokol keadaan darurat.
            </p>
          </div>
        )}

        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <div className="space-y-6">
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
                    placeholder="Cari kata kunci juknis lapangan (contoh: kotak danton, bendera, peluit, checkout basecamp, kahar)..."
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs px-1">
                <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>8 Bab Regulasi & Ketentuan Lapangan</span>
                </span>
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const allOpen = Object.keys(openAccordions).reduce((acc, k) => ({ ...acc, [k]: true }), {});
                      setOpenAccordions(allOpen);
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold transition-all shadow-xs cursor-pointer text-xs text-center justify-center"
                  >
                    Buka Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const allClosed = Object.keys(openAccordions).reduce((acc, k) => ({ ...acc, [k]: false }), {});
                      setOpenAccordions(allClosed);
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold transition-all shadow-xs cursor-pointer text-xs text-center justify-center"
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

            {/* B. TECHNICAL MEETING (TM) PESERTA */}
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
                    <span className="font-bold text-base md:text-lg text-slate-900">B. Technical Meeting (TM) Peserta</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('tm') ? 'rotate-180 text-red-600' : ''}`} />
                </button>
                {isAccordionOpen('tm') && (
                  <div className="bg-white border-t border-slate-100 p-6 sm:p-7 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Technical Meeting (TM) Peserta merupakan forum resmi penyamaan persepsi teknis dan materi perlombaan, tata tertib peserta, serta penentuan nomor urut tampil lomba yang diselenggarakan dengan rincian teknis operasional sebagai berikut:
                    </p>
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
                            Setiap sekolah/madrasah wajib mendelegasikan maksimal 2 (dua) orang perwakilan resmi per SEKOLAH (terdiri atas Official/Pelatih/Pembina dan/atau Komandan Peleton), tanpa memandang jumlah peleton yang didaftarkan (1 atau 2 peleton). Seluruh perwakilan wajib mengenakan pakaian rapi, sopan, dan bersepatu. Perwakilan putri wajib mengenakan pakaian berlengan panjang.
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
                              Penjelasan regulasi arena, batas garis, ketentuan Kotak Danton, serta teknis pelaksanaan gerakan di lapangan.
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 shadow-xs">
                              <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-0.5">Materi (d)</span>
                              Mekanisme perhitungan waktu resmi menggunakan stopwatch serta publikasi hasil penilaian melalui portal peserta di website lbb.tontimuallimin.com menggunakan akun Gmail masing-masing peleton.
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
                            Peserta diberikan ruang diskusi langsung bersama Dewan Juri ataupun Panitia guna menyamakan persepsi serta mengklarifikasi hal-hal teknis yang belum jelas. Setiap keputusan dan kesepakatan akhir akan dicatat ke dalam Notulen Resmi TM sebagai rujukan sah perlombaan.
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
                            Panitia memimpin undian terbuka nomor urut tampil resmi: Tingkat SD/MI: Nomor undian SD-111 sampai dengan SD-175; Tingkat SMP/MTs: Nomor undian SMP-222 sampai dengan SMP-286. Penukaran nomor urut tampil hanya diperkenankan dilakukan di hadapan panitia dan disaksikan oleh peserta lain selama forum TM masih berlangsung. Bagi sekolah/madrasah yang mengirimkan 2 (dua) peleton, perwakilan sekolah yang hadir berhak dan sah mengambil 2 (dua) nomor undian lotting sekaligus untuk masing-masing peletonnya.
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

            {/* C. UJI COBA LAPANGAN */}
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
                    <span className="font-bold text-base md:text-lg text-slate-900">C. Uji Coba Lapangan</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('trial') ? 'rotate-180 text-red-600' : ''}`} />
                </button>
                {isAccordionOpen('trial') && (
                  <div className="bg-white border-t border-slate-100 p-6 sm:p-7 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Uji Coba Lapangan diselenggarakan untuk memberikan kesempatan adaptasi langsung bagi peleton terhadap arena sebelum hari pelaksanaan lomba, dengan rincian teknis sebagai berikut:
                    </p>
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
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Uji coba dilaksanakan secara simultan dan terpisah:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 shadow-xs">
                              <strong className="text-slate-800 block mb-0.5">Arena 1 (Lapangan Basket Kampus Terpadu Sedayu):</strong>
                              Khusus untuk 18 Peleton Tingkat SD/MI (ukuran 25 m x 14 m).
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 shadow-xs">
                              <strong className="text-slate-800 block mb-0.5">Arena 2 (Pelataran Embung Kampus Terpadu Sedayu):</strong>
                              Khusus untuk 18 Peleton Tingkat SMP/MTs (ukuran 26 m x 15 m).
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
                          <strong className="text-slate-900 text-sm block">Ketentuan Perlengkapan Uji Coba:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Peserta wajib mengenakan seragam olahraga atau seragam latihan sekolah yang seragam (sama) dan rapi. Seluruh peserta wajib mengenakan celana panjang dan sepatu. Peserta putri wajib mengenakan pakaian berlengan panjang. Peserta disarankan mengenakan topi. <span className="text-red-600 font-bold bg-red-50 px-1 rounded border border-red-200">DILARANG KERAS menggunakan sepatu dengan sol berpaku atau ber-pines pada saat uji coba</span>.
                          </p>
                        </div>
                      </div>

                      {/* Poin 5 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          5
                        </span>
                        <div className="space-y-1">
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-semibold">
                            Uji coba ini murni merupakan kegiatan orientasi medan dan <span className="text-red-700 font-bold">TIDAK ADA penilaian dari juri</span>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* D. REGISTRASI S.D. UPACARA PEMBUKAAN */}
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
                    <span className="font-bold text-base md:text-lg text-slate-900">D. Registrasi s.d. Upacara Pembukaan</span>
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
                          <strong className="text-slate-900 text-sm block">Kedatangan dan Check-In Peleton (Pukul 06.00–09.00 WIB)</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Prosedur kedatangan dan daftar ulang peleton dilaksanakan di Ruang Registrasi Resmi yang berlokasi di Gedung Madrasah Lantai 1, Kampus Terpadu Mu’allimin Sedayu, dengan urutan sebagai berikut:
                          </p>
                          <ul className="list-[lower-alpha] pl-5 space-y-1.5 text-xs text-slate-700">
                            <li><strong className="text-slate-800">Regulasi Parkir Kendaraan Peleton:</strong>
                              <ul className="list-[circle] pl-5 mt-1 space-y-1">
                                <li>Bus atau kendaraan besar peleton dilarang parkir di dalam area Kampus Terpadu Mu’allimin. Bus hanya diperkenankan masuk untuk proses drop-off peserta dan perlengkapan di Drop Zone resmi, kemudian wajib segera menuju kantong parkir Lapangan Hibrida Argomulyo.</li>
                                <li>Kendaraan roda 4 dan roda 2 diparkir di area parkir internal Kampus Terpadu Sedayu sesuai arahan petugas. Apabila kapasitas parkir internal telah penuh, kendaraan diarahkan menuju kantong parkir Lapangan Hibrida Argomulyo.</li>
                              </ul>
                            </li>
                            <li><strong className="text-slate-800">Proses Registrasi:</strong> Official melakukan daftar ulang di Ruang Registrasi Resmi Gedung Madrasah Lantai 1 dengan menyerahkan 1 (satu) kartu identitas asli berupa KTP/SIM sebagai jaminan ketertiban dan kebersihan ruang basecamp.</li>
                            <li><strong className="text-slate-800">Penerimaan Perlengkapan Peleton:</strong> Setelah proses registrasi, Official menerima fasilitas resmi Peleton berupa:
                              <ol className="list-decimal pl-5 mt-1 space-y-0.5">
                                <li>Nomor Dada Peleton resmi.</li>
                                <li>Tanda Pengenal ID Card resmi untuk 1 (satu) Official dan 2 (dua) Pendukung Resmi.</li>
                                <li>1 (satu) dus air minum kemasan botol untuk setiap peleton.</li>
                                <li>2 (dua) kantong sampah terpilah, yaitu Organik dan Anorganik.</li>
                              </ol>
                            </li>
                            <li><strong className="text-slate-800">Pemasangan Nomor Dada:</strong> Nomor Dada Peleton wajib disematkan pada dada personel banjar paling kanan saf kedua (Saf 2 Banjar 1 / S2B1).</li>
                            <li><strong className="text-slate-800">Pengarahan Menuju Basecamp:</strong> Setelah menerima perlengkapan, peleton diarahkan dan dikawal oleh LO pendamping menuju ruang kelas basecamp resmi yang telah ditentukan oleh panitia.</li>
                            <li><strong className="text-slate-800">Batas Waktu Registrasi:</strong> Registrasi ditutup tepat pukul 09.00 WIB. Peleton yang tidak melakukan daftar ulang sampai batas waktu tersebut tidak diperkenankan mengikuti perlombaan.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Poin 2 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          2
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Sterilisasi Arena Perlombaan (Pukul 06.45 WIB)</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Mulai pukul 06.45 WIB, seluruh arena perlombaan (Arena 1 & Arena 2 serta Lapangan Mini Soccer) ditutup dan disterilkan dari aktivitas umum, serta seluruh peserta upacara pembukaan wajib telah berada di lokasi barisan upacara. Upacara pembukaan dimulai tepat pukul 07.00 WIB. Perlombaan sesi pertama dimulai tepat pukul 08.00 WIB (jeda 15 menit setelah Upacara Pembukaan selesai pukul 07.45 WIB).
                          </p>
                        </div>
                      </div>

                      {/* Poin 3 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          3
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Pelaksanaan Upacara Pembukaan Resmi (Pukul 07.00 - 07.45 WIB)</strong>
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
                            <li>Peleton yang tidak hadir atau terlambat dikenakan sanksi penalti pengurangan nilai sesuai ketentuan Petunjuk Teknis Penilaian & Kejuaraan.</li>
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
                    <span className="font-bold text-base md:text-lg text-slate-900">E. Alur Persiapan & Pelaksanaan Tampil di Arena</span>
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
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Tahap Kesiapan dan Pengecekan di Daerah Persiapan 1 (DP 1):</strong>
                          <ul className="list-[lower-alpha] pl-5 space-y-1.5 text-xs text-slate-700">
                            <li><strong className="text-slate-800">Kesiapan di Basecamp:</strong> Peleton bersama official sebaiknya sudah bersiap-siap di ruang basecamp sekurang-kurangnya 15 (lima belas) menit sebelum estimasi waktu nomor urutnya akan dipanggil oleh LO pendamping.</li>
                            <li><strong className="text-slate-800">Prosedur Masuk DP 1:</strong> Peleton HANYA diperkenankan masuk ke Daerah Persiapan 1 (DP 1) setelah dipanggil secara resmi oleh panitia melalui pengeras suara (mic). Ditegaskan bahwa peleton DILARANG KERAS masuk ke DP 1 sebelum dipanggil.</li>
                            <li><strong className="text-slate-800">Pemeriksaan di DP 1:</strong> Petugas DP 1 melakukan verifikasi fisik dan administrasi menyeluruh meliputi:
                              <ol className="list-decimal pl-5 mt-1 space-y-0.5">
                                <li>Pemeriksaan kelengkapan jumlah personel: 1 Danton, 21 Anggota Inti, anggota cadangan, 1 Official, dan 2 Pendukung Resmi ber-ID Card.</li>
                                <li>Pemeriksaan pemasangan nomor dada peleton di personel banjar paling kanan saf kedua (Saf 2 Banjar 1 / S2B1).</li>
                                <li>Pemeriksaan fisik sol sepatu: DILARANG KERAS menggunakan pines, paku payung, spikes, pul logam, atau material sejenis yang dapat merusak permukaan lapangan/lantai.</li>
                                <li>Ketentuan Sanksi/Penalti: Setiap bentuk ketidaksesuaian administrasi, ketidaklengkapan personel, maupun pelanggaran terhadap aturan sol sepatu akan dikenakan sanksi penalti pada rekapitulasi penilaian akhir, serta personel yang melanggar aturan sol sepatu dilarang memasuki arena lomba sebelum alas kakinya disesuaikan.</li>
                              </ol>
                            </li>
                            <li><strong className="text-slate-800">Pergantian Terencana:</strong> Apabila terdapat pergantian pemain cadangan yang telah direncanakan, Official wajib melaporkannya kepada Petugas DP 1.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Poin 2 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          2
                        </span>
                        <div className="space-y-1.5 flex-1">
                          <strong className="text-slate-900 text-sm block">Tahap Ruang Tunggu di Daerah Persiapan 2 (DP 2):</strong>
                          <ul className="list-[lower-alpha] pl-5 space-y-1 text-xs text-slate-700">
                            <li>Setelah dinyatakan lengkap dan lolos verifikasi di DP 1, peleton bergerak menuju DP 2.</li>
                            <li>DP 2 difungsikan murni sebagai Holding Area (Ruang Tunggu Siap Tampil). Di area ini peleton menjaga fokus mental dan ketenangan, serta dilarang membuat kegaduhan.</li>
                            <li>Peleton berbaris rapi secara terpimpin atau bubar di alur masuk arena lomba menunggu aba-aba dari panitia pengatur lapangan.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Poin 3 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          3
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Tahap Pelaksanaan Tampil di Arena Perlombaan:</strong>
                          <ul className="list-[lower-alpha] pl-5 space-y-1.5 text-xs text-slate-700">
                            <li><strong className="text-slate-800">Memasuki Arena dan Posisi Peleton:</strong> Komandan Peleton memimpin peleton memasuki arena perlombaan menuju posisi tengah arena sehingga posisi peleton berada tepat di tengah menghadap meja Dewan Juri.</li>
                            <li><strong className="text-slate-800">Pengondisian Peleton:</strong> Sebelum melapor, Komandan Peleton mengondisikan peletonnya terlebih dahulu di posisi tengah tersebut (diberi aba-aba siap atau diluruskan).</li>
                            <li><strong className="text-slate-800">Penghormatan Awal:</strong> Setelah peleton terkondisi rapi dan siap sempurna, Komandan Peleton mengambil posisi di samping kanan barisan menghadap ke arah meja Dewan Juri, kemudian memberikan aba-aba penghormatan: <em>"Kepada Dewan Juri, Hormat = GERAK"</em>. Stopwatch waktu resmi lomba DIMULAI tepat saat aba-aba pelaksanaan penghormatan pembuka ini dihentakkan.</li>
                            <li><strong className="text-slate-800">Laporan Pembuka:</strong> Setelah aba-aba tegak (Tegak = GERAK), Komandan Peleton berpindah mengambil posisi di depan peleton menghadap Dewan Juri, lalu menyampaikan laporan: <em>"Lapor, peleton dengan nomor dada (sebutkan nomor urut dalam ejaan kata per digit, contoh tingkat SD: satu satu satu / tingkat SMP: dua dua dua) siap melaksanakan materi gerakan lomba."</em></li>
                            <li><strong className="text-slate-800">Berpindah ke Kotak Danton:</strong> Setelah selesai melapor, Komandan Peleton melangkah menuju Kotak Danton (1,5 x 1,5 meter) yang terletak di batas depan arena menghadap peleton. Danton wajib berada di dalam kotak selama memimpin gerakan lomba (kecuali pada materi tertentu yang mengharuskan komandan berada di luar kotak seperti materi bubar peleton, berhimpun, atau untuk perhatian istirahat di tempat). Komandan Peleton kemudian memulai materi selanjutnya.</li>
                            <li><strong className="text-slate-800">Durasi Waktu dan Sinyal Peluit Timekeeper:</strong>
                              <ol className="list-decimal pl-5 mt-1 space-y-0.5">
                                <li>Durasi maksimal tampil resmi: 8 menit untuk tingkat SD/MI dan 12 menit untuk tingkat SMP/MTs.</li>
                                <li>Sinyal Peluit 1 Kali Panjang: Peringatan bahwa waktu tampil tersisa 1 menit (menit ke-7 untuk SD/MI dan menit ke-11 untuk SMP/MTs).</li>
                                <li>Sinyal Peluit 2 Kali Panjang: Penanda resmi bahwa durasi waktu tampil telah habis (menit ke-8 untuk SD/MI dan menit ke-12 untuk SMP/MTs). Peleton wajib segera menyelesaikan materi dan meninggalkan arena.</li>
                                <li>Waktu stopwatch resmi berakhir tepat saat Komandan Peleton menghentakkan aba-aba pelaksanaan 'GERAK' pada penghormatan penutup ('Hormat = GERAK').</li>
                              </ol>
                            </li>
                            <li><strong className="text-slate-800">Sinyal Pelanggaran Garis (Bendera):</strong> Hakim Garis menggunakan bendera untuk menandai terjadinya pelanggaran garis batas arena oleh peleton atau keluarnya komandan dari Kotak Danton saat memimpin materi.</li>
                            <li><strong className="text-slate-800">Pelaksanaan Materi Gerakan:</strong> Dilaksanakan secara berurutan sesuai lembar materi PBB resmi tanpa jeda atau pengulangan di luar ketentuan.</li>
                            <li><strong className="text-slate-800">Ketentuan Atribut Terjatuh:</strong> Apabila atribut peserta (topi/peci, dasi, pin/lencana, sabuk, sarung tangan, dll.) terlepas atau terjatuh di arena, TIDAK DIKENAKAN PENALTI PENGURANGAN NILAI. Peleton dilarang memungut atribut tersebut hingga peleton keluar arena.</li>
                            <li><strong className="text-slate-800">Laporan Penutup:</strong> Komandan Peleton mengambil posisi di depan peleton menghadap meja Dewan Juri, lalu menyampaikan laporan: <em>"Lapor, peleton dengan nomor dada (sebutkan nomor urut dalam ejaan kata, contoh: satu satu satu) telah melaksanakan materi lomba, laporan selesai."</em></li>
                            <li><strong className="text-slate-800">Penghormatan Penutup:</strong> Setelah melapor, Komandan Peleton berpindah mengambil posisi di samping kanan barisan menghadap Dewan Juri, kemudian memimpin penghormatan: <em>"Kepada Dewan Juri, Hormat = GERAK"</em>.</li>
                            <li><strong className="text-slate-800">Penghentian Waktu & Keluar Arena:</strong> Penghormatan diakhiri dengan aba-aba "Hormat = GERAK" (stopwatch waktu resmi lomba BERHENTI tepat saat aba-aba pelaksanaan "GERAK" ini dihentakkan), selanjutnya Komandan Peleton memimpin peletonnya meninggalkan arena lomba.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Poin 4 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          4
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Ketentuan Khusus Pergantian Pemain dan Penanganan Insiden di Lapangan:</strong>
                          <ul className="list-[lower-alpha] pl-5 space-y-1.5 text-xs text-slate-700">
                            <li>Pemain inti hanya dapat digantikan oleh pemain cadangan resmi yang terdaftar pada peleton bersangkutan.</li>
                            <li><strong className="text-slate-800">Jeda Pergantian Resmi di Arena:</strong> Pergantian pemain dilaksanakan pada saat materi “Bubar”, yaitu: 1) Tingkat SD/MI dilakukan di antara Materi No. 16 dan 17; 2) Tingkat SMP/MTs dilakukan di antara Materi No. 19 dan 20.</li>
                            <li><strong className="text-slate-800">Tata Cara Pergantian:</strong> Setelah Komandan Peleton memberikan aba-aba “Bubar”, anggota yang akan digantikan diperbolehkan meninggalkan arena dan anggota pengganti diperbolehkan memasuki arena untuk menempati posisi yang telah ditentukan. Pergerakan anggota yang digantikan dan anggota pengganti pada saat proses pergantian tersebut tidak dianggap sebagai pelanggaran garis dan tidak dikenai penalti. Setelah pergantian selesai, seluruh anggota wajib berada pada posisi yang ditentukan sebelum materi berikutnya dimulai.</li>
                            <li><strong className="text-slate-800">Waktu Pergantian:</strong> Waktu stopwatch tetap berjalan selama proses pergantian pemain. Tidak terdapat penghentian atau penambahan waktu khusus untuk proses pergantian.</li>
                            <li><strong className="text-slate-800">Pergantian Tidak Terencana (Darurat):</strong> Apabila terjadi cedera atau kondisi lain yang menyebabkan seorang anggota tidak dapat melanjutkan perlombaan, Official dapat memberikan isyarat kepada Panitia Lapangan untuk meminta izin pergantian pemain. Pergantian darurat dilakukan dengan menggunakan pemain cadangan resmi dan mengikuti arahan Panitia Lapangan:
                              <ol className="list-decimal pl-5 mt-1 space-y-0.5">
                                <li>Apabila cedera atau kondisi tersebut tidak membahayakan keselamatan atau jiwa peserta, waktu perlombaan tetap berjalan dan penampilan dilanjutkan setelah pergantian selesai.</li>
                                <li>Apabila terjadi cedera atau kondisi yang membahayakan keselamatan atau jiwa peserta, Panitia Lapangan berwenang menghentikan sementara penampilan. Setelah kondisi dinyatakan aman, penampilan dapat diulang dari awal berdasarkan keputusan Panitia Lapangan dan Dewan Juri.</li>
                              </ol>
                            </li>
                            <li><strong className="text-slate-800">Pergantian Komandan Peleton:</strong> Komandan Peleton hanya dapat digantikan apabila mengalami kondisi darurat, seperti sakit berat, pingsan, atau kondisi lain yang menyebabkan tidak dapat melanjutkan perlombaan. Apabila kondisi tersebut terjadi di dalam arena, Komandan Peleton dapat digantikan oleh personel yang berada di dalam arena sesuai arahan Panitia Lapangan. Komandan pengganti tidak berhak mengikuti penilaian atau perebutan kategori Juara Komandan Peleton.</li>
                            <li><strong className="text-slate-800">Penanganan Insiden Fisik:</strong> Personel yang mengalami cedera, pingsan, atau insiden fisik lainnya dapat ditangani oleh Official, pemain cadangan, atau tim medis tanpa menghentikan waktu perlombaan. Apabila insiden dinilai membahayakan keselamatan atau jiwa peserta, Panitia Lapangan berwenang menghentikan sementara penampilan untuk penanganan keadaan darurat.</li>
                            <li><strong className="text-slate-800">Ketentuan Garis Selama Pergantian:</strong> Pergerakan pemain yang digantikan untuk keluar dari arena dan pemain pengganti untuk memasuki arena hanya dibebaskan dari ketentuan pelanggaran garis selama proses pergantian resmi sebagaimana dimaksud pada huruf b dan c. Di luar proses pergantian resmi tersebut, setiap anggota tetap wajib mematuhi ketentuan garis arena dan dapat dikenai penalti sesuai ketentuan yang berlaku.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Poin 5 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          5
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Alur Keluar Arena dan Kepemilikan Nomor Dada:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Setelah peleton menyelesaikan seluruh rangkaian materi perlombaan dan penghormatan penutup, Komandan Peleton memimpin peleton melangkah keluar arena melalui jalur evakuasi/steril resmi yang telah ditentukan panitia menuju basecamp. <strong className="text-slate-900 font-bold">Nomor Dada Peleton resmi TIDAK PERLU dikembalikan kepada panitia</strong> dan sepenuhnya menjadi hak milik serta cenderamata resmi (souvenir) bagi masing-masing peleton/sekolah bersangkutan.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* F. KETENTUAN PASCA-LOMBA DAN PROSEDUR CHECKOUT BASECAMP */}
            {shouldShow('checkout') && (
              <div className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-red-500/40 hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('checkout')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 font-black flex items-center justify-center text-sm shadow-xs">
                      F
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">F. Ketentuan Pasca-Lomba dan Prosedur Checkout Basecamp</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${isAccordionOpen('checkout') ? 'rotate-180 text-red-600' : ''}`} />
                </button>
                {isAccordionOpen('checkout') && (
                  <div className="bg-white border-t border-slate-100 p-6 sm:p-7 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                    <div className="grid grid-cols-1 gap-3.5">
                      {/* Poin 1 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          1
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Batas Waktu Maksimal Pengosongan:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Seluruh peleton wajib menyelesaikan proses checkout dan mengosongkan ruang kelas basecamp selambat-lambatnya pukul 15.00 WIB (1 jam sebelum Upacara Penutupan dimulai).
                          </p>
                        </div>
                      </div>

                      {/* Poin 2 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          2
                        </span>
                        <div className="space-y-2 flex-1">
                          <strong className="text-slate-900 text-sm block">Alur 4 Langkah Checkout Resmi:</strong>
                          <ul className="list-[lower-alpha] pl-5 space-y-1.5 text-xs text-slate-700">
                            <li><strong>(1) Merapikan kembali susunan meja-kursi</strong> dan memastikan tidak ada barang peleton tertinggal di dalam ruang kelas basecamp;</li>
                            <li><strong>(2) Membawa dan menyerahkan 2 (dua) kantong sampah terpilah</strong> (Organik & Non-Organik) ke Pos/Area Checkout Panitia;</li>
                            <li><strong>(3) Pemeriksaan langsung kebersihan dan keutuhan fasilitas ruangan kelas</strong> oleh LO/Panitia Kebersihan guna memperoleh Tanda Bukti Lolos Verifikasi Checkout;</li>
                            <li><strong>(4) Pengambilan kembali kartu identitas jaminan (KTP/SIM)</strong> di Ruang Informasi Panitia dengan menunjukkan Tanda Bukti Lolos Verifikasi Checkout.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Poin 3 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          3
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Ketentuan Sanksi & Denda:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Peleton yang meninggalkan basecamp dalam keadaan kotor/berantakan dikenai sanksi penalti -50 poin pada rekapitulasi nilai akhir. Apabila terjadi kerusakan fisik atau kehilangan fasilitas kelas, kartu jaminan KTP/SIM ditahan serta dikenakan sanksi ganti rugi penuh dan denda administratif Rp 500.000 sesuai Pasal 14 Tata Tertib Peserta.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}




            {/* G. KEADAAN KAHAR (FORCE MAJEURE) */}
            {shouldShow('force') && (
              <div className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-red-500/40 hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('force')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 font-black flex items-center justify-center text-sm shadow-xs">
                      G
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">G. Keadaan Kahar (Force Majeure)</span>
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
                          <strong className="text-slate-900 text-sm block">Ruang Lingkup Kahar:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Keadaan kahar mencakup kondisi atau kejadian di luar kendali Panitia Pelaksana maupun peserta yang dapat mengganggu atau membahayakan pelaksanaan perlombaan, antara lain hujan deras ekstrem, badai atau angin kencang, bencana alam, gangguan keamanan, pemadaman listrik total, atau kondisi lain yang dinilai membahayakan keselamatan.
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
                            Perlombaan tetap dilaksanakan sesuai jadwal. Peserta tetap mengikuti perlombaan dengan memperhatikan arahan Panitia dan Dewan Juri.
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
                            Apabila kondisi cuaca dinilai membahayakan keselamatan peserta, Panitia Pelaksana bersama Dewan Juri berwenang menghentikan perlombaan sementara. Apabila perlombaan dihentikan saat peleton sedang melaksanakan penampilan, penampilan peleton tersebut dinyatakan dihentikan dan akan diulang setelah kondisi dinyatakan aman dan kondusif. Penampilan ulang dimulai dari awal masuk arena, dengan waktu penampilan dihitung kembali dari 00:00.
                          </p>
                        </div>
                      </div>

                      {/* Poin 4 */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          4
                        </span>
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block">Wewenang Keputusan:</strong>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            Keputusan penghentian dan kelanjutan perlombaan merupakan wewenang mutlak Panitia Pelaksana dan Dewan Juri.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* H. PENUTUP */}
            {shouldShow('closing') && (
              <div className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-red-500/40 hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('closing')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 font-black flex items-center justify-center text-sm shadow-xs">
                      H
                    </span>
                    <span className="font-bold text-base md:text-lg text-slate-900">H. Penutup</span>
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
    </div>
  </section>
);
}
