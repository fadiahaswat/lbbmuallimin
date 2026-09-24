import React, { useState, useMemo } from 'react';
import { AlertOctagon, ChevronDown, Search, X } from 'lucide-react';

export default function Rules() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openAccordions, setOpenAccordions] = useState({
    intro: false,
    def: true,
    general: false,
    proc: false,
    sub: false,
    score: false,
    penalty: false,
    protest: false,
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
        general: true,
        proc: true,
        sub: true,
        score: true,
        penalty: true,
        protest: true,
        force: true,
        closing: true,
      };
    }

    return {
      intro: 'pendahuluan petunjuk teknis resmi lbb muallimin panduan ketentuan patuhi'.includes(query),
      def: 'definisi istilah clear area dp daerah persiapan dp 1 dp 2 gerakan penyesuaian prinsip garis batas dinding vertikal imajiner pelanggaran'.includes(query),
      general: 'ketentuan umum perlombaan pendamping official dokumentasi cadangan ketertiban etika sportivitas juri kegaduhan'.includes(query),
      proc: 'prosedur pelaksanaan lapangan kedatangan verifikasi personel ukuran lapangan pos penanganan insiden pingsan sakit medis keluar'.includes(query),
      sub: 'pergantian pemain inti cadangan jeda pos sd 20 21 smp 17 18 terencana insidental darurat danton komandan peleton gugur'.includes(query),
      score: 'mekanisme sistem penilaian perpang tni 57 58 poin genap berurutan minimal nol 0 rangkaian bobot kekompakan teknik pbb penguasaan materi kualitas suara sikap laporan waktu hormat 13 menit'.includes(query),
      penalty: 'sanksi pengurangan nilai penalti upacara pembukaan 150 poin keterlambatan dp 1 100 diskualifikasi personel 75 kelebihan waktu 50 detik garis 50 penyesuaian 25 dewan juri'.includes(query),
      protest: 'mekanisme pengajuan protes sanggah kesalahan teknis hitung skor input data 60 menit rekapitulasi nilai lisan meja informasi video foto dewan juri koreksi hasil resmi'.includes(query),
      force: 'keadaan kahar force majeure bencana alam hujan deras badai gangguan keamanan listrik tunda hentikan'.includes(query),
      closing: 'penutup technical meeting rapat teknis pendaftaran setujui ketentuan'.includes(query),
    };
  }, [query]);

  // When searching, auto-expand matching accordions
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">
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
            Pedoman resmi pelaksanaan, penilaian, dan regulasi sanksi LBB Mu'allimin 2027.
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
                placeholder="Cari kata kunci juknis (contoh: penalti, danton, garis, pergantian, protes)..."
                className="w-full py-4 pr-12 text-slate-800 placeholder-slate-400 font-medium text-sm sm:text-base bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Result Status */}
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
              <AlertOctagon className="w-5 h-5" /> Wajib Dipatuhi
            </h3>
            <p className="text-sm text-red-800/80 leading-relaxed">
              Dokumen ini mengatur seluruh pelaksanaan lapangan. Seluruh peserta, official, dan pihak terkait diwajibkan memahami setiap ketentuan demi kelancaran dan sportivitas.
            </p>
          </div>

          {/* No results fallback */}
          {isSearching && totalMatches === 0 && (
            <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">Tidak ada bagian yang cocok</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Coba gunakan kata kunci lain seperti <em>penalti</em>, <em>danton</em>, <em>garis</em>, <em>waktu</em>, atau klik tombol filter di atas.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('Semua');
                }}
                className="mt-4 px-4 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors"
              >
                Reset Pencarian
              </button>
            </div>
          )}

          <div className="space-y-4" id="rules-accordion">
              {/* PENDAHULUAN */}
              {shouldShow('intro') && (
                <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                  <button
                    onClick={() => toggleAccordion('intro')}
                    className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-lg bg-red-100 text-red-700 font-black flex items-center justify-center text-xs">
                        INFO
                      </span>
                      <span className="font-bold text-base md:text-lg text-slate-900">Pendahuluan Petunjuk Teknis Lapangan</span>
                    </div>
                    <ChevronDown
                      className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${
                        isAccordionOpen('intro') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isAccordionOpen('intro') && (
                    <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-3 animate-fade">
                      <div className="font-bold text-slate-900 text-base border-b pb-2 mb-3">
                        LOMBA BARIS – BERBARIS MU'ALLIMIN TAHUN 2025/2027
                      </div>
                      <p>
                        Dokumen ini disusun sebagai panduan teknis resmi yang mengatur seluruh pelaksanaan Lomba Baris-Berbaris (LBB) Mu'allimin di lapangan. Seluruh peserta, official, dan pihak terkait diwajibkan untuk memahami dan mematuhi setiap ketentuan yang tercantum di dalamnya demi kelancaran, ketertiban, dan sportivitas acara.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Item A: DEFINISI ISTILAH */}
              {shouldShow('def') && (
                <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                  <button
                    onClick={() => toggleAccordion('def')}
                    className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                        A
                      </span>
                      <span className="font-bold text-base md:text-lg text-slate-900">A. Definisi Istilah</span>
                    </div>
                    <ChevronDown
                      className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${
                        isAccordionOpen('def') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isAccordionOpen('def') && (
                    <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                      <ol className="list-decimal pl-5 space-y-3">
                        <li>
                          <strong className="text-slate-900">Clear Area:</strong> Area steril yang hanya dapat dimasuki oleh peleton yang sedang berkompetisi, maksimal 2 (dua) orang official, dan 1 (satu) orang perwakilan dokumentasi peleton terkait yang mengenakan tanda pengenal resmi, serta panitia yang bertugas.
                        </li>
                        <li>
                          <strong className="text-slate-900">Daerah Persiapan (DP):</strong> Area transisi sebelum memasuki pos perlombaan, terdiri dari Daerah Persiapan 1 (DP 1) sebagai area tunggu dan verifikasi personel, serta Daerah Persiapan 2 (DP 2) sebagai area persiapan akhir.
                        </li>
                        <li>
                          <strong className="text-slate-900">Gerakan Penyesuaian:</strong> Setiap gerakan tambahan di tempat yang tidak termasuk dalam daftar materi lomba, yang bertujuan untuk memperbaiki posisi atau formasi peleton (contoh: Hadap Kanan/Kiri, Balik Kanan, atau 1 Langkah ke Samping/Depan/Belakang).
                        </li>
                        <li>
                          <strong className="text-slate-900">Prinsip Garis sebagai Garis:</strong> Garis batas lapangan/pos diperlakukan sebagai dinding vertikal imajiner. Pelanggaran terjadi jika ada bagian tubuh atau atribut peserta, terutama alas kaki, yang menyentuh, menginjak, atau melintasi garis tersebut.
                        </li>
                      </ol>
                    </div>
                  )}
                </div>
              )}

              {/* Item B: KETENTUAN UMUM PERLOMBAAN */}
              {shouldShow('general') && (
                <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                  <button
                    onClick={() => toggleAccordion('general')}
                    className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                        B
                      </span>
                      <span className="font-bold text-base md:text-lg text-slate-900">B. Ketentuan Umum Perlombaan</span>
                    </div>
                    <ChevronDown
                      className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${
                        isAccordionOpen('general') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isAccordionOpen('general') && (
                    <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                      <ol className="list-decimal pl-5 space-y-3">
                        <li>
                          <strong className="text-slate-900">Pendamping Peleton:</strong> Setiap peleton didampingi oleh maksimal 2 (dua) orang official, 1 (satu) orang pihak dokumentasi, dan seluruh anggota cadangan. Tidak diperkenankan adanya pergantian official, pihak dokumentasi maupun cadangan setelah peleton memasuki Clear Area.
                        </li>
                        <li>
                          <strong className="text-slate-900">Dokumentasi:</strong> Pihak dokumentasi dari peleton hanya diizinkan mengambil gambar/video di dalam area yang telah ditentukan oleh panitia di sekitar pos dan dilarang mengganggu jalannya perlombaan.
                        </li>
                        <li>
                          <strong className="text-slate-900">Ketertiban dan Etika:</strong> Seluruh peserta, official, dan pendukung wajib menjaga ketertiban, menjunjung tinggi sportivitas, dan menghormati keputusan dewan juri. Panitia berhak mengambil tindakan tegas, termasuk mengeluarkan pihak yang menyebabkan kegaduhan dari area perlombaan.
                        </li>
                      </ol>
                    </div>
                  )}
                </div>
              )}

              {/* Item C: PROSEDUR PELAKSANAAN DI LAPANGAN */}
              {shouldShow('proc') && (
                <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                  <button
                    onClick={() => toggleAccordion('proc')}
                    className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                        C
                      </span>
                      <span className="font-bold text-base md:text-lg text-slate-900">C. Prosedur Pelaksanaan di Lapangan</span>
                    </div>
                    <ChevronDown
                      className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${
                        isAccordionOpen('proc') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isAccordionOpen('proc') && (
                    <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                      <ol className="list-decimal pl-5 space-y-3">
                        <li>
                          <strong className="text-slate-900">Kedatangan dan Daerah Persiapan 1 (DP 1):</strong>
                          <ul className="list-[lower-alpha] pl-5 mt-1.5 space-y-1">
                            <li>Peserta wajib berada di DP 1 selambat-lambatnya 15 menit sebelum nomor urutnya dipanggil. Jadwal pemanggilan bersifat estimasi.</li>
                            <li>Di DP 1, panitia akan melakukan verifikasi kesesuaian dan jumlah personel berdasarkan data pendaftaran resmi.</li>
                          </ul>
                        </li>
                        <li>
                          <strong className="text-slate-900">Daerah Persiapan 2 (DP 2):</strong> Setelah lolos verifikasi di DP 1 dan dipanggil oleh panitia, peleton akan diarahkan menuju DP 2 untuk melakukan persiapan akhir sebelum memasuki pos perlombaan.
                        </li>
                        <li>
                          <strong className="text-slate-900">Pelaksanaan di Dalam Pos:</strong> Peleton melaksanakan seluruh materi lomba di dalam pos sesuai urutan, dipimpin oleh Komandan Peleton. Ukuran lapangan perlombaan adalah:
                          <ul className="list-[lower-alpha] pl-5 mt-1.5 space-y-1">
                            <li><strong className="text-slate-800">Tingkat SD/MI:</strong> 25m x 14m</li>
                            <li><strong className="text-slate-800">Tingkat SMP/MTs:</strong> 26m x 15m</li>
                          </ul>
                        </li>
                        <li>
                          <strong className="text-slate-900">Penanganan Insiden:</strong> Apabila terjadi kendala fisik (pingsan, sakit, atau jatuh) pada personel di dalam pos, waktu perlombaan tidak dihentikan. Penanganan hanya boleh dilakukan oleh official, anggota cadangan peleton terkait, atau panitia medis yang bertugas.
                        </li>
                        <li>
                          Dalam kasus insiden berat yang dinilai mengancam keselamatan jiwa atau memerlukan evakuasi medis darurat, Panitia berhak menghentikan sementara penampilan peleton tersebut. Keputusan lebih lanjut mengenai status penampilan peleton akan ditentukan kemudian melalui musyawarah antara Dewan Juri dan Panitia.
                        </li>
                        <li>
                          <strong className="text-slate-900">Prosedur Setelah Selesai:</strong> Setelah menyelesaikan seluruh materi dan laporan penutup, peleton meninggalkan pos melalui jalur keluar yang telah ditentukan.
                        </li>
                      </ol>
                    </div>
                  )}
                </div>
              )}

              {/* Item D: KETENTUAN PERGANTIAN PEMAIN */}
              {shouldShow('sub') && (
                <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                  <button
                    onClick={() => toggleAccordion('sub')}
                    className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                        D
                      </span>
                      <span className="font-bold text-base md:text-lg text-slate-900">D. Ketentuan Pergantian Pemain</span>
                    </div>
                    <ChevronDown
                      className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${
                        isAccordionOpen('sub') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isAccordionOpen('sub') && (
                    <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                      <ol className="list-decimal pl-5 space-y-3">
                        <li>
                          Pemain inti hanya dapat digantikan oleh pemain cadangan yang telah terdaftar secara resmi pada peleton yang sama.
                        </li>
                        <li>
                          Proses pergantian pemain dapat dilakukan pada dua kesempatan:
                          <ul className="list-[lower-alpha] pl-5 mt-1.5 space-y-1">
                            <li>Di Daerah Persiapan (DP).</li>
                            <li>
                              Di dalam pos, pada jeda waktu yang telah ditentukan, yaitu:
                              <ul className="list-[lower-roman] pl-5 mt-1 space-y-1">
                                <li><strong className="text-slate-800">Tingkat SD/MI:</strong> Di antara Materi No. 20 dan 21.</li>
                                <li><strong className="text-slate-800">Tingkat SMP/MTs:</strong> Di antara Materi No. 17 dan 18.</li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                        <li>
                          Selama proses pergantian pemain, waktu perlombaan tetap berjalan normal.
                        </li>
                        <li>
                          <strong className="text-slate-900">Pergantian Terencana:</strong> Untuk pergantian yang telah direncanakan, official wajib memberitahukan kepada Petugas DP 2 sebelum peleton memasuki pos.
                        </li>
                        <li>
                          <strong className="text-slate-900">Pergantian Tidak Terencana (Insidental):</strong> Untuk pergantian yang bersifat darurat di dalam pos (misal: anggota cedera ringan), official peleton wajib memberikan isyarat (mengangkat tangan) kepada Panitia Lapangan terdekat untuk meminta izin melakukan pergantian.
                        </li>
                        <li>
                          <strong className="text-slate-900">Pergantian Komandan Peleton (Danton):</strong>
                          <ul className="list-[lower-alpha] pl-5 mt-1.5 space-y-1">
                            <li>Danton tidak dapat digantikan, kecuali dalam kondisi darurat (sakit parah atau pingsan).</li>
                            <li>Jika kondisi darurat terjadi di luar pos, Danton dapat digantikan oleh personel lain yang terdaftar.</li>
                            <li>Jika kondisi darurat terjadi di dalam pos, Danton hanya dapat digantikan oleh personel yang saat itu juga berada di dalam pos.</li>
                            <li>Apabila terjadi pergantian Danton, haknya untuk memperebutkan kategori kejuaraan komandan peleton secara otomatis gugur.</li>
                          </ul>
                        </li>
                      </ol>
                    </div>
                  )}
                </div>
              )}

              {/* Item E: MEKANISME PENILAIAN */}
              {shouldShow('score') && (
                <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                  <button
                    onClick={() => toggleAccordion('score')}
                    className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                        E
                      </span>
                      <span className="font-bold text-base md:text-lg text-slate-900">E. Mekanisme Penilaian</span>
                    </div>
                    <ChevronDown
                      className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${
                        isAccordionOpen('score') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isAccordionOpen('score') && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-5 animate-fade">
                    {/* 1. Prinsip Penilaian Umum */}
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">
                        1. Prinsip Penilaian Umum
                      </h4>
                      <ul className="list-[lower-alpha] pl-5 space-y-1.5">
                        <li>Dasar kebenaran teknik gerakan mengacu pada Peraturan Panglima TNI Nomor 57 dan 58 Tahun 2018.</li>
                        <li>Jangkauan nilai untuk peleton dan komandan adalah 50-90 poin, dengan interval 2 poin (bilangan genap).</li>
                        <li>Total nilai akhir akan dihitung hingga 2 (dua) angka di belakang koma.</li>
                      </ul>
                    </div>

                    {/* 2. Pelaksanaan Gerakan */}
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">
                        2. Pelaksanaan Gerakan
                      </h4>
                      <ul className="list-[lower-alpha] pl-5 space-y-1.5">
                        <li>Peserta wajib melaksanakan seluruh materi gerakan secara BERURUTAN sesuai daftar yang diberikan.</li>
                        <li>Gerakan yang terlewat namun tetap dilaksanakan tidak pada urutannya akan mendapatkan NILAI MINIMAL.</li>
                        <li>Gerakan yang terlewat dan tidak dilaksanakan sama sekali akan mendapatkan NILAI NOL (0).</li>
                        <li>Gerakan berangkai (bertanda " - ") wajib dilaksanakan dalam satu rangkaian tanpa jeda atau gerakan tambahan. Pelanggaran akan dikenai NILAI MINIMAL pada rangkaian gerakan tersebut.</li>
                        <li>Gerakan penyesuaian dibatasi maksimal 3 (tiga) kali pada setiap pos.</li>
                        <li>Setiap materi gerakan hanya dilaksanakan 1 (satu) kali. Apabila terjadi pengulangan, maka yang dinilai adalah gerakan yang pertama kali dilaksanakan.</li>
                        <li>Apabila komandan melakukan kesalahan aba-aba (aba-aba salah atau tidak diucapkan), maka peleton dianggap tidak melakukan materi dan akan mendapatkan NILAI NOL (0) pada gerakan tersebut.</li>
                      </ul>
                    </div>

                    {/* 3. Aspek dan Bobot Penilaian */}
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">
                        3. Aspek dan Bobot Penilaian
                      </h4>
                      <p className="mb-2 italic text-slate-600">
                        Keputusan dewan juri bersifat mutlak dan tidak dapat diganggu gugat. Kriteria penilaian adalah sebagai berikut:
                      </p>
                      
                      <div className="grid sm:grid-cols-2 gap-4 my-3">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <h5 className="font-bold text-slate-900 mb-2">a. Penilaian Peleton (Total Bobot: 100%)</h5>
                          <ul className="list-[lower-roman] pl-5 space-y-1 text-xs">
                            <li><strong className="text-slate-800">Kebenaran Teknik Gerakan PBB:</strong> 70%</li>
                            <li><strong className="text-slate-800">Kekompakan Gerakan Peleton:</strong> 30%</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <h5 className="font-bold text-slate-900 mb-2">b. Penilaian Komandan Peleton (Total Bobot: 100%)</h5>
                          <ul className="list-[lower-roman] pl-5 space-y-1 text-xs">
                            <li><strong className="text-slate-800">Penguasaan Materi Lomba (ketepatan dan urutan aba-aba):</strong> 35%</li>
                            <li><strong className="text-slate-800">Kualitas Suara (intonasi, kejelasan, dan ketegasan):</strong> 25%</li>
                            <li><strong className="text-slate-800">Sikap dan Pelaporan:</strong> 20%</li>
                            <li><strong className="text-slate-800">Penguasaan Medan/Lapangan:</strong> 20%</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 4. Pelaporan dan Waktu */}
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">
                        4. Pelaporan dan Waktu
                      </h4>
                      <ul className="list-[lower-alpha] pl-5 space-y-2">
                        <li>
                          <strong className="text-slate-900">Format Laporan (Contoh untuk nomor dada 007):</strong>
                          <ul className="list-[lower-roman] pl-5 mt-1 space-y-1">
                            <li><strong className="text-slate-800">Laporan Pembuka:</strong> "Lapor, peleton dengan nomor dada nol nol tujuh siap melaksanakan materi gerakan lomba."</li>
                            <li><strong className="text-slate-800">Laporan Penutup:</strong> "Peleton dengan nomor dada nol nol tujuh telah melaksanakan materi gerakan lomba, laporan selesai."</li>
                          </ul>
                        </li>
                        <li>
                          <strong className="text-slate-900">Penghitungan Waktu:</strong>
                          <ul className="list-[lower-roman] pl-5 mt-1 space-y-1">
                            <li>Waktu dimulai saat komandan memberikan aba-aba penghormatan pembuka ("Kepada dewan juri, Hormat = GERAK").</li>
                            <li>Waktu berakhir saat komandan memberikan aba-aba penghormatan penutup ("Kepada dewan juri, Hormat = GERAK").</li>
                          </ul>
                        </li>
                        <li>
                          Durasi waktu maksimal adalah 8 menit (atau 10 menit sesuai pos teknis SD/MI) dan 13 menit untuk tingkat SMP/MTs.
                        </li>
                        <li>
                          Apabila durasi waktu habis, peleton wajib segera meninggalkan pos. Kelebihan waktu akan dikenai sanksi pengurangan nilai.
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Item F: SANKSI DAN PENGURANGAN NILAI (PENALTI) */}
            {shouldShow('penalty') && (
                <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                  <button
                    onClick={() => toggleAccordion('penalty')}
                    className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-lg bg-red-100 text-red-700 font-black flex items-center justify-center text-sm">
                        F
                      </span>
                      <span className="font-bold text-base md:text-lg text-slate-900">F. Sanksi dan Pengurangan Nilai (Penalti)</span>
                    </div>
                    <ChevronDown
                      className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${
                        isAccordionOpen('penalty') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isAccordionOpen('penalty') && (
                    <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                      <ol className="list-decimal pl-5 space-y-3">
                        <li>
                          <strong className="text-slate-900">Upacara Pembukaan:</strong> Peleton yang mendapat kewajiban namun tidak mengikuti upacara pembukaan (kehadiran minimal 1 komandan dan 15 anggota) dikenai pengurangan nilai sebesar <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">150 poin</span>. Pengecekan kehadiran akan dilakukan oleh panitia 15 menit sebelum upacara dimulai pada barisan yang telah ditentukan.
                        </li>
                        <li>
                          <strong className="text-slate-900">Keterlambatan:</strong> Peleton yang tidak hadir di Daerah Persiapan 1 (DP 1) setelah 3 kali pemanggilan akan ditempatkan pada urutan tampil paling akhir dan dikenai pengurangan nilai sebesar <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">100 poin</span>. Apabila tetap tidak hadir tanpa konfirmasi, peleton akan dikenai sanksi <span className="font-bold text-red-700 uppercase">DISKUALIFIKASI</span>.
                        </li>
                        <li>
                          <strong className="text-slate-900">Jumlah Personel Kurang:</strong> Peleton yang memasuki pos dengan jumlah personel kurang dari 22 orang (1 komandan + 21 anggota) dikenai pengurangan nilai sebesar <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">75 poin</span>. Sanksi ini bersifat tetap dan hanya dikenakan satu kali, yaitu pada saat pertama kali peleton terdeteksi memasuki pos dengan jumlah personel tidak lengkap.
                        </li>
                        <li>
                          <strong className="text-slate-900">Kelebihan Waktu:</strong> Apabila peleton melebihi durasi waktu yang telah ditentukan, akan dikenai pengurangan nilai sebesar <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">50 poin</span> untuk setiap rentang 1-30 detik kelebihan waktu dan kelipatannya (contoh: kelebihan 31 detik dikenai sanksi -100 poin).
                        </li>
                        <li>
                          <strong className="text-slate-900">Pelanggaran Garis:</strong> Peleton atau komandan yang menginjak atau keluar dari garis batas pos akan dikenai pengurangan nilai sebesar <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">50 poin</span> per kejadian pada masing-masing kategori penilaian.
                        </li>
                        <li>
                          <strong className="text-slate-900">Gerakan Penyesuaian Berlebih:</strong> Pelaksanaan gerakan penyesuaian yang melebihi batas maksimal (3 kali) akan dikenai pengurangan nilai sebesar <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">25 poin</span> untuk setiap gerakan tambahan.
                        </li>
                        <li>
                          <strong className="text-slate-900">Finalisasi Sanksi:</strong> Seluruh sanksi dan pengurangan nilai diterapkan oleh Dewan Juri berdasarkan pengamatan di lapangan. Keputusan Dewan Juri bersifat final.
                        </li>
                      </ol>
                    </div>
                  )}
                </div>
              )}

              {/* Item G: MEKANISME PENGAJUAN PROTES (SANGGAH) */}
              {shouldShow('protest') && (
                <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                  <button
                    onClick={() => toggleAccordion('protest')}
                    className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                        G
                      </span>
                      <span className="font-bold text-base md:text-lg text-slate-900">G. Mekanisme Pengajuan Protes (Sanggah)</span>
                    </div>
                    <ChevronDown
                      className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${
                        isAccordionOpen('protest') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isAccordionOpen('protest') && (
                    <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-4 animate-fade">
                      <ol className="list-decimal pl-5 space-y-3">
                        <li>
                          <strong className="text-slate-900">Lingkup Protes:</strong>
                          <ul className="list-[lower-alpha] pl-5 mt-1.5 space-y-1">
                            <li>Keputusan Dewan Juri mengenai penilaian yang bersifat kualitatif dan subjektif (contoh: kualitas teknik gerakan, kekompakan, dll.) bersifat mutlak dan tidak dapat diganggu gugat.</li>
                            <li>
                              Protes hanya diterima untuk dugaan kesalahan teknis yang bersifat non-penilaian, yang mencakup:
                              <ul className="list-[lower-roman] pl-5 mt-1 space-y-1">
                                <li>Kesalahan penjumlahan skor.</li>
                                <li>Kesalahan input data dari lembar juri ke dalam sistem rekapitulasi.</li>
                                <li>Kesalahan penerapan poin penalti yang tidak sesuai dengan catatan pelanggaran.</li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <strong className="text-slate-900">Pihak dan Waktu Pengajuan Protes:</strong>
                          <ul className="list-[lower-alpha] pl-5 mt-1.5 space-y-1">
                            <li>Protes hanya sah jika diajukan secara lisan oleh 1 (satu) orang Official resmi dari peleton yang bersangkutan, yang namanya terdaftar pada panitia.</li>
                            <li>Periode pengajuan protes resmi adalah 60 menit (satu jam), yang dimulai sejak Dokumen Rekapitulasi Nilai Rinci (format PDF) secara resmi dipublikasikan oleh panitia melalui kanal komunikasi resmi.</li>
                          </ul>
                        </li>
                        <li>
                          <strong className="text-slate-900">Prosedur Pengajuan Protes Lisan:</strong>
                          <ul className="list-[lower-alpha] pl-5 mt-1.5 space-y-1">
                            <li>Official yang akan mengajukan protes wajib mendatangi Meja Informasi Panitia dan meminta untuk berbicara langsung dengan Panitia Divisi Juri dan Penilaian yang bertugas.</li>
                            <li>Protes harus disampaikan dengan jelas, tenang, dan sopan, dengan menunjukkan bagian spesifik dari rekapitulasi nilai yang diduga keliru.</li>
                            <li>Official disarankan untuk membawa bukti pendukung (contoh: video rekaman, foto, atau salinan catatan skor pribadi) untuk memperkuat argumen dan mempercepat proses verifikasi.</li>
                            <li>Panitia akan mencatat setiap protes lisan yang diajukan secara resmi sebagai arsip.</li>
                          </ul>
                        </li>
                        <li>
                          <strong className="text-slate-900">Proses Adjudikasi dan Keputusan Final:</strong>
                          <ul className="list-[lower-alpha] pl-5 mt-1.5 space-y-1">
                            <li>Setiap protes yang diajukan akan diverifikasi langsung oleh Dewan Juri dan Panitia.</li>
                            <li>Jika tidak terdapat protes atau protes yang diajukan ditolak, maka peringkat kejuaraan yang telah diumumkan secara seremonial dinyatakan sah dan final.</li>
                            <li>Apabila terdapat protes sah yang diterima dan menyebabkan perubahan pada peringkat kejuaraan, maka Panitia akan menerbitkan "Pemberitahuan Koreksi Hasil Resmi" melalui seluruh kanal komunikasi.</li>
                            <li>Dalam kasus terjadinya koreksi, peringkat kejuaraan yang berlaku adalah hasil yang tercantum dalam pemberitahuan koreksi tersebut, bukan yang diumumkan saat seremoni.</li>
                          </ul>
                        </li>
                      </ol>
                    </div>
                  )}
                </div>
              )}

              {/* Item H: KEADAAN KAHAR (FORCE MAJEURE) */}
              {shouldShow('force') && (
                <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                  <button
                    onClick={() => toggleAccordion('force')}
                    className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                        H
                      </span>
                      <span className="font-bold text-base md:text-lg text-slate-900">H. Keadaan Kahar (Force Majeure)</span>
                    </div>
                    <ChevronDown
                      className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${
                        isAccordionOpen('force') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isAccordionOpen('force') && (
                    <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-3 animate-fade">
                      <ol className="list-decimal pl-5 space-y-3">
                        <li>
                          Keadaan kahar mencakup kejadian luar biasa di luar kendali panitia maupun peserta (contoh: hujan deras atau badai, bencana alam, gangguan keamanan masif, pemadaman listrik total).
                        </li>
                        <li>
                          Apabila terjadi keadaan kahar, perlombaan dapat dihentikan sementara atau ditunda. Keputusan mengenai kelanjutan lomba akan diinformasikan oleh panitia setelah mempertimbangkan kondisi dan keamanan.
                        </li>
                      </ol>
                    </div>
                  )}
                </div>
              )}

              {/* Item I: PENUTUP */}
              {shouldShow('closing') && (
                <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                  <button
                    onClick={() => toggleAccordion('closing')}
                    className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm">
                        I
                      </span>
                      <span className="font-bold text-base md:text-lg text-slate-900">I. Penutup</span>
                    </div>
                    <ChevronDown
                      className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${
                        isAccordionOpen('closing') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isAccordionOpen('closing') && (
                    <div className="bg-white border-t border-slate-100 p-6 text-slate-700 text-sm leading-relaxed space-y-3 animate-fade">
                      <p>
                        Petunjuk teknis ini dibuat untuk menjadi acuan bersama. Hal-hal lain yang belum tercantum dalam dokumen ini akan diatur kemudian oleh panitia dan disampaikan pada saat Rapat Teknis (Technical Meeting). Seluruh peserta dan official dianggap telah memahami dan menyetujui seluruh ketentuan ini setelah melakukan pendaftaran.
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
