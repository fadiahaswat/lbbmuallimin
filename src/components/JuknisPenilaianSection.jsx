import React, { useState, useMemo } from 'react';
import {
  Award,
  Search,
  X,
  ChevronDown,
  Scale,
  Shield,
  Clock,
  AlertTriangle,
  FileText,
  Mail,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { JUKNIS_PENILAIAN_CHAPTERS } from '../data/juknisDocsData.js';
import { DOWNLOADS, PENALTIES } from '../config.js';

export default function JuknisPenilaianSection({ embedded = false }) {
  // Hanya tampil di localhost/dev, atau di production setelah H+1 TM Juri (TM Juri: 7 Nov 2026 -> rilis mulai 8 Nov 2026 00:00 WIB)
  const isVisible = useMemo(() => {
    if (typeof window === 'undefined') return true;
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.');
    if (isLocalhost) return true;

    // TM Juri: Sabtu, 7 November 2026. H+1: Minggu, 8 November 2026 00:00:00 WIB (+07:00)
    const releaseDate = new Date('2026-11-08T00:00:00+07:00');
    return new Date() >= releaseDate;
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [openAccordions, setOpenAccordions] = useState({
    'bab-a': false,
    'bab-b': false,
    'bab-c': false,
    'bab-d': false,
  });

  if (!isVisible) {
    return null;
  }

  function toggleAccordion(id) {
    setOpenAccordions(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  const query = searchQuery.trim().toLowerCase();

  const isBabMatch = useMemo(() => {
    if (!query) {
      return {
        'bab-a': true,
        'bab-b': true,
        'bab-c': true,
        'bab-d': true,
      };
    }

    const babAText = `sistem penilaian sanggah penentuan juara dewan juri tni polri ppi rasio 1:1 kebenaran teknik kekompakan formula danton 35 25 20 20 akumulasi juara umum tie breaker rolling release gmail 15.00 wib sanggahan checkout basecamp`.toLowerCase();
    const babBText = `gangguan sistem digital prosedur backup manual cadangan website upload login formulir pemulihan data`.toLowerCase();
    const babCText = `sanksi penalti pengurangan nilai pemotongan kumulatif denda garis bendera atribut kotak danton diskualifikasi upacara`.toLowerCase();
    const babDText = `penutup asas kepastian hukum mengikat evaluasi hasil penetapan peringkat`.toLowerCase();

    return {
      'bab-a': babAText.includes(query),
      'bab-b': babBText.includes(query),
      'bab-c': babCText.includes(query),
      'bab-d': babDText.includes(query),
    };
  }, [query]);

  const docDownloadUrl = DOWNLOADS.find(d => d.id === 'juknis-penilaian')?.url || "https://docs.google.com/document/d/1BN1RuwDcEiuibVvoBG4-5R7Rq8neV5st3nAZoISVQi0/edit?usp=sharing";

  return (
    <section
      id="scoring"
      className={`${
        embedded ? 'py-4' : 'py-20 md:py-28'
      } bg-slate-900 text-white relative overflow-hidden`}
    >
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        {!embedded && (
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Regulasi Penjurian Resmi</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 leading-tight">
              Petunjuk Teknis{' '}
              <span className="text-amber-400">
                Penilaian & Kejuaraan
              </span>
            </h2>
            <div className="w-16 h-1 bg-red-700 mx-auto rounded-full mb-4"></div>
            <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg font-normal leading-relaxed">
              Standar baku evaluasi dewan juri rasio 1:1, rubrik Komandan Peleton, formula akumulasi Juara Umum dan 7 kriteria tie-breaker, transparansi lembar nilai, serta tabel sanksi penalti.
            </p>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search Bar & Action Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari kata kunci penilaian (skor 1:1, danton, juara umum, tie-breaker, sanggah, penalti)..."
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Toggle All Accordions & Unduh */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setOpenAccordions({ 'bab-a': true, 'bab-b': true, 'bab-c': true, 'bab-d': true });
                }}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Buka Semua
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpenAccordions({ 'bab-a': false, 'bab-b': false, 'bab-c': false, 'bab-d': false });
                }}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Tutup Semua
              </button>
            </div>
          </div>

          {/* Accordion Chapters List */}
          <div className="space-y-4">
            {/* BAB A: SISTEM PENILAIAN, SANGGAH, DAN PENENTUAN JUARA */}
            {isBabMatch['bab-a'] && (
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 shadow-lg transition-all duration-200 hover:border-slate-700">
                <button
                  type="button"
                  onClick={() => toggleAccordion('bab-a')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-800/40 hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                      A
                    </span>
                    <div>
                      <span className="font-bold text-base md:text-lg text-white block">
                        A. SISTEM PENILAIAN, SANGGAH, DAN PENENTUAN JUARA
                      </span>
                      <span className="text-xs text-slate-400 font-normal">
                        10 Butir Baku Regulasi Penjurian & Hasil
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`text-slate-400 transition-transform duration-300 w-5 h-5 shrink-0 ${
                      openAccordions['bab-a'] ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>

                {openAccordions['bab-a'] && (
                  <div className="p-5 sm:p-7 space-y-4 border-t border-slate-800 bg-slate-900/40 animate-fade">
                    {JUKNIS_PENILAIAN_CHAPTERS[0].points.map(pt => (
                      <div
                        key={pt.number}
                        className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/70 space-y-2.5"
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {pt.number}
                          </span>
                          <div className="flex-1 space-y-2">
                            <strong className="text-sm font-black text-white block">
                              {pt.title}:
                            </strong>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                              {pt.content}
                            </p>

                            {pt.subItems && (
                              <ul className="space-y-1.5 pl-1 pt-1">
                                {pt.subItems.map((sub, sIdx) => (
                                  <li
                                    key={sIdx}
                                    className="text-xs sm:text-sm text-slate-300 flex items-start gap-2 leading-relaxed"
                                  >
                                    <span className="text-amber-400 font-bold mt-0.5">•</span>
                                    <span className="flex-1">{sub}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {pt.pointCards && (
                              <div className="space-y-2 pt-2">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                                  {pt.pointCards.map((card, cIdx) => (
                                    <div
                                      key={cIdx}
                                      className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                                        card.type === 'danton'
                                          ? 'bg-amber-950/40 text-amber-200 border-amber-800/60'
                                          : 'bg-slate-800/60 text-slate-200 border-slate-700'
                                      }`}
                                    >
                                      <span className="text-[10px] font-sans font-bold text-slate-400 uppercase">{card.label}</span>
                                      <strong className="text-sm font-black font-mono mt-0.5 text-amber-300">{card.score}</strong>
                                    </div>
                                  ))}
                                </div>
                                {pt.extraText && (
                                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                                    {pt.extraText}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* BAB B: GANGGUAN SISTEM DIGITAL DAN PROSEDUR BACKUP */}
            {isBabMatch['bab-b'] && (
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 shadow-lg transition-all duration-200 hover:border-slate-700">
                <button
                  type="button"
                  onClick={() => toggleAccordion('bab-b')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-800/40 hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-blue-500 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                      B
                    </span>
                    <div>
                      <span className="font-bold text-base md:text-lg text-white block">
                        B. GANGGUAN SISTEM DIGITAL DAN PROSEDUR BACKUP
                      </span>
                      <span className="text-xs text-slate-400 font-normal">
                        6 Ketentuan Penanganan Gangguan & Prosedur Manual Cadangan
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`text-slate-400 transition-transform duration-300 w-5 h-5 shrink-0 ${
                      openAccordions['bab-b'] ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>

                {openAccordions['bab-b'] && (
                  <div className="p-5 sm:p-7 space-y-3.5 border-t border-slate-800 bg-slate-900/40 animate-fade">
                    {JUKNIS_PENILAIAN_CHAPTERS[1].points.map(pt => (
                      <div
                        key={pt.number}
                        className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/70 flex items-start gap-3"
                      >
                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {pt.number}
                        </span>
                        <div className="space-y-1">
                          <strong className="text-xs sm:text-sm font-bold text-white block">{pt.title}:</strong>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{pt.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* BAB C: KETENTUAN SANKSI DAN PENALTI PENGURANGAN NILAI */}
            {isBabMatch['bab-c'] && (
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 shadow-lg transition-all duration-200 hover:border-slate-700">
                <button
                  type="button"
                  onClick={() => toggleAccordion('bab-c')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-800/40 hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-red-600 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                      C
                    </span>
                    <div>
                      <span className="font-bold text-base md:text-lg text-white block">
                        C. KETENTUAN SANKSI DAN PENALTI PENGURANGAN NILAI
                      </span>
                      <span className="text-xs text-slate-400 font-normal">
                        Tabel Resmi Pemotongan Nilai Secara Kumulatif
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`text-slate-400 transition-transform duration-300 w-5 h-5 shrink-0 ${
                      openAccordions['bab-c'] ? 'rotate-180 text-red-400' : ''
                    }`}
                  />
                </button>

                {openAccordions['bab-c'] && (
                  <div className="p-5 sm:p-7 space-y-4 border-t border-slate-800 bg-slate-900/40 animate-fade">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Pelanggaran terhadap regulasi teknis lapangan dikenakan sanksi pemotongan nilai secara kumulatif pada lembar rekapitulasi nilai akhir:
                    </p>
                    <div className="overflow-x-auto rounded-2xl border border-slate-700">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-800 text-slate-200 uppercase font-black tracking-wider text-[11px] border-b border-slate-700">
                          <tr>
                            <th className="py-3 px-4">Jenis Pelanggaran</th>
                            <th className="py-3 px-4 text-center">Besaran Penalti</th>
                            <th className="py-3 px-4">Keterangan / Regulasi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-900/80">
                          {PENALTIES.map((p, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                              <td className="py-3 px-4 font-bold text-white text-xs sm:text-sm">{p.label}</td>
                              <td className="py-3 px-4 text-center">
                                <span className={`font-mono font-black px-2.5 py-1 rounded-lg text-xs inline-block shadow-xs ${
                                  p.value.includes('0 Poin') ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60' : 'bg-red-950/60 text-red-300 border border-red-800/60'
                                }`}>
                                  {p.value}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-300 text-xs leading-relaxed">
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
                    <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700 flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        <strong className="text-white font-bold">Pencatatan Penalti:</strong> Seluruh sanksi pengurangan nilai dicatat secara langsung dan transparan oleh Hakim Garis, Timekeeper, dan Koordinator Lapangan ke dalam Berita Acara Pelanggaran Resmi serta disahkan oleh Perwakilan Dewan Juri.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* BAB D: PENUTUP */}
            {isBabMatch['bab-d'] && (
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 shadow-lg transition-all duration-200 hover:border-slate-700">
                <button
                  type="button"
                  onClick={() => toggleAccordion('bab-d')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-800/40 hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-700 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                      D
                    </span>
                    <div>
                      <span className="font-bold text-base md:text-lg text-white block">
                        D. PENUTUP
                      </span>
                      <span className="text-xs text-slate-400 font-normal">
                        Asas Kepastian Hukum & Mengikat
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`text-slate-400 transition-transform duration-300 w-5 h-5 shrink-0 ${
                      openAccordions['bab-d'] ? 'rotate-180 text-slate-400' : ''
                    }`}
                  />
                </button>

                {openAccordions['bab-d'] && (
                  <div className="p-5 sm:p-7 space-y-4 border-t border-slate-800 bg-slate-900/40 animate-fade">
                    <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/80 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {JUKNIS_PENILAIAN_CHAPTERS[3]?.content || "Petunjuk Teknis Penilaian dan Kejuaraan ini menjadi acuan baku dan mengikat dalam proses evaluasi hasil, penetapan peringkat, dan penegakan keadilan kompetisi LBB Mu'allimin Tahun 2027. Seluruh ketentuan yang telah ditetapkan berlaku mutlak bagi seluruh kontingen peserta dan perangkat perlombaan."}
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
