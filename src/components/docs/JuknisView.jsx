import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Download,
  Printer,
  ChevronDown,
  CheckCircle2,
  Clock,
  Swords,
  Trophy,
  Users,
  Shield,
  Layers,
  ExternalLink,
  Sparkles,
  FileText,
  Scale,
  Award,
  AlertTriangle,
  ClipboardList,
  Check,
  Building,
  CalendarCheck,
  Compass,
  Coffee,
  Flag,
  MapPin,
  CalendarDays
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { COMPETITION, DOWNLOADS, MATERIALS, PENALTIES, VENUE, VENUE_INDUK } from '../../config.js';
import { JUKNIS_PENILAIAN_CHAPTERS, JUKNIS_PENDAFTARAN_CHAPTERS, RUNDOWN_DATA } from '../../data/juknisDocsData.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';
import Rules from '../Rules.jsx';
import SebaranNilaiTable from './SebaranNilaiTable.jsx';

export default function JuknisView() {
  const { currentTeam } = useCompetition();

  // Tab switch: 'penilaian' | 'lapangan' | 'pendaftaran' | 'materials' | 'rundown'
  const [activeTab, setActiveTab] = useState('penilaian');
  const [rundownSubTab, setRundownSubTab] = useState('competition'); // 'competition' | 'tm' | 'trial'
  const [openPenilaianSections, setOpenPenilaianSections] = useState({
    'bab-a': false,
    'bab-b': false,
    'bab-c': false,
    'bab-d': false,
  });

  const [openPendaftaranSections, setOpenPendaftaranSections] = useState({
    'reg-a': false,
    'reg-b': false,
  });

  const togglePenilaianSection = (id) => {
    setOpenPenilaianSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePendaftaranSection = (id) => {
    setOpenPendaftaranSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Jika akun peleton peserta SMP, otomatis default ke 'SMP'. Jika SD, default ke 'SD'.
  const initialJenjang = currentTeam?.jenjang?.toUpperCase() === 'SMP' ? 'SMP' : 'SD';
  const [selectedJenjang, setSelectedJenjang] = useState(initialJenjang);
  const [searchQuery, setSearchQuery] = useState('');

  // 26 Gerakan Resmi SD/MI LBB Mu'allimin 2027
  const pbbMateriSD = MATERIALS.SD.map((name, idx) => {
    let category = 'Di Tempat';
    const lower = name.toLowerCase();
    if (lower.includes('penghormatan') || lower.includes('laporan')) {
      category = 'Protokoler Lapangan';
    } else if (lower.includes('langkah ke') || lower.includes('buka barisan') || lower.includes('tutup barisan')) {
      category = 'Berpindah Tempat';
    } else if (lower.includes('hadap') || lower.includes('balik')) {
      category = 'Perubahan Arah';
    } else if (lower.includes('maju jalan') || lower.includes('langkah tegap') || lower.includes('hormat kanan') || lower.includes('belok') || lower.includes('melintang') || lower.includes('haluan')) {
      category = 'Berjalan & Manuver';
    } else if (lower.includes('istirahat') || lower.includes('periksa') || lower.includes('lencang') || lower.includes('hitung') || lower.includes('jalan di tempat') || lower.includes('bubar') || lower.includes('berkumpul') || lower.includes('berbanjar kumpul')) {
      category = 'Di Tempat';
    }

    return {
      no: idx + 1,
      name,
      category,
      isSubstitutionPoint: idx === 15 // Di antara Materi No. 16 (Bubar) dan 17 (Berkumpul(Berbanjar))
    };
  });

  // 28 Gerakan Resmi SMP/MTs LBB Mu'allimin 2027
  const pbbMateriSMP = MATERIALS.SMP.map((name, idx) => {
    let category = 'Di Tempat';
    const lower = name.toLowerCase();
    if (lower.includes('penghormatan') || lower.includes('laporan')) {
      category = 'Protokoler Lapangan';
    } else if (lower.includes('lari') || lower.includes('melintang') || lower.includes('haluan') || lower.includes('belok') || lower.includes('langkah tegap') || lower.includes('langkah perlahan') || lower.includes('ganti langkah')) {
      category = 'Berjalan & Manuver Dinamis';
    } else if (lower.includes('langkah ke') || lower.includes('buka barisan') || lower.includes('bubar') || lower.includes('berhimpun') || lower.includes('berkumpul')) {
      category = 'Berpindah & Formasi';
    } else if (lower.includes('hadap') || lower.includes('balik')) {
      category = 'Perubahan Arah';
    } else if (lower.includes('istirahat') || lower.includes('periksa') || lower.includes('lencang') || lower.includes('hitung') || lower.includes('jalan di tempat')) {
      category = 'Di Tempat';
    }

    return {
      no: idx + 1,
      name,
      category,
      isSubstitutionPoint: idx === 18 // Di antara Materi No. 19 (Hadap Kiri - Bubar) dan 20 (Berhimpun)
    };
  });

  const currentList = selectedJenjang === 'SD' ? pbbMateriSD : pbbMateriSMP;

  const filteredMateri = currentList.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SimpaskorSidebarLayout
      activeMenu="juknis"
      title="Petunjuk Teknis (Juknis) & Regulasi LBB"
      subtitle="Pedoman baku resmi: Juknis Penilaian & Kejuaraan, Juknis Lapangan, Juknis Pendaftaran, dan Materi PBB 2027"
      hideHeader={true}
    >
      <div className="space-y-6">

        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 relative overflow-hidden">
          {/* Ornamental Milad Graphic Illustration Watermark (Matching Juknis Cover) */}
          <div className="absolute -right-12 -bottom-16 w-72 sm:w-88 pointer-events-none opacity-20 select-none z-0">
            <img
              src="/logo-milad.svg"
              alt=""
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
          <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Dokumen Resmi Terpadu LBB Mu'allimin 2027</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Petunjuk Teknis & Regulasi Kejuaraan
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Dokumen regulasi resmi terbagi dalam 3 naskah baku mandiri: <strong>Petunjuk Teknis Penilaian & Kejuaraan</strong> (sistem 1:1, Danton, Juara Umum, sanggah), <strong>Petunjuk Teknis Lapangan</strong> (kronologis pra s.d. pasca lomba & penalti), serta <strong>Petunjuk Teknis Pendaftaran</strong>.
              </p>
              <div className="pt-1 flex flex-wrap gap-2.5">
                <a
                  href={DOWNLOADS[0]?.url || "https://drive.google.com/file/d/1wxLlEIRVEzeMi2Qr0OAJCpqoKZXz-4vh/view?usp=sharing"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Juknis Lengkap</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center min-w-[170px] shrink-0 self-start md:self-center">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Juri 1:1 • 6 Dewan Juri</span>
              <span className="text-2xl font-black text-white font-mono">1 : 1</span>
              <span className="text-[10px] text-slate-300 block mt-0.5">Teknik 50% • Kompak 50%</span>
            </div>
          </div>
        </div>

        {/* Document Tab Switcher (5 Tab Khusus & Terpisah) */}
        <div className="flex flex-col gap-2 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-xl">
            {/* Tab 1: Juknis Penilaian & Kejuaraan */}
            <button
              type="button"
              onClick={() => setActiveTab('penilaian')}
              className={`flex items-center justify-center gap-2 px-2.5 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer text-center ${
                activeTab === 'penilaian'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Juknis Penilaian</span>
            </button>

            {/* Tab 2: Juknis Lapangan */}
            <button
              type="button"
              onClick={() => setActiveTab('lapangan')}
              className={`flex items-center justify-center gap-2 px-2.5 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer text-center ${
                activeTab === 'lapangan'
                  ? 'bg-red-700 text-white shadow-md shadow-red-700/30'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Juknis Lapangan</span>
            </button>

            {/* Tab 3: Juknis Pendaftaran */}
            <button
              type="button"
              onClick={() => setActiveTab('pendaftaran')}
              className={`flex items-center justify-center gap-2 px-2.5 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer text-center ${
                activeTab === 'pendaftaran'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span>Juknis Pendaftaran</span>
            </button>

            {/* Tab 4: Materi PBB & Denah */}
            <button
              type="button"
              onClick={() => setActiveTab('materials')}
              className={`flex items-center justify-center gap-2 px-2.5 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer text-center ${
                activeTab === 'materials'
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/30'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Swords className="w-4 h-4 shrink-0" />
              <span>Materi & Arena</span>
            </button>

            {/* Tab 5: Rundown Resmi Kegiatan */}
            <button
              type="button"
              onClick={() => setActiveTab('rundown')}
              className={`flex items-center justify-center gap-2 px-2.5 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer text-center col-span-2 sm:col-span-1 ${
                activeTab === 'rundown'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-400'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Rundown Acara</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-semibold px-2 flex items-center justify-between">
            <span>
              {activeTab === 'penilaian' && 'Menampilkan naskah utuh: Sistem Penilaian 1:1, Danton, Penentuan Juara Umum & Tie-Breaker, Sanggah, Backup Digital & Sanksi Penalti.'}
              {activeTab === 'lapangan' && 'Menampilkan Petunjuk Teknis Lapangan runtut dari alur pra-lomba (TM & Uji Coba), hari-H, hingga force majeure.'}
              {activeTab === 'pendaftaran' && 'Menampilkan Petunjuk Teknis Pendaftaran: Kuota 36 Peleton, Timeline, Rekening BSI, Alur Digital & Berkas Fisik TM.'}
              {activeTab === 'materials' && 'Menampilkan daftar 26 gerakan SD / 28 gerakan SMP, slot pergantian pemain, dan denah pos visual.'}
              {activeTab === 'rundown' && 'Menampilkan matriks jadwal lengkap 3 sesi: Hari-H Perlombaan (24 Jan), Technical Meeting (9 Jan), & Gladi Uji Coba (16 Jan).'}
            </span>
            <span className="hidden sm:inline-block font-mono text-slate-400">Verbatim 2027</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: PETUNJUK TEKNIS PENILAIAN & KEJUARAAN                   */}
        {/* ============================================================== */}
        {activeTab === 'penilaian' && (
          <div className="space-y-6 animate-fade">
            {/* Header Pengenal Dokumen */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-black text-xs uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Dokumen Regulasi Mandiri Resmi</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
                PETUNJUK TEKNIS PENILAIAN DAN KEJUARAAN
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
                Regulasi baku proses penjurian, rasio penilaian 1:1, rubrik Komandan Peleton (4 aspek), rumus akumulasi Juara Umum dan 7 kriteria tie-breaker, transparansi rolling release melalui akun Gmail terdaftar, prosedur pengajuan sanggah resmi, SOP penanganan gangguan digital, serta tabel sanksi penalti pengurangan nilai.
              </p>
            </div>

            {/* Bab A: Sistem Penilaian, Sanggah, dan Penentuan Juara */}
            <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-xs">
              <button
                type="button"
                onClick={() => togglePenilaianSection('bab-a')}
                className="w-full flex items-center justify-between p-5 sm:p-6 bg-slate-50/80 hover:bg-slate-100/80 transition-colors text-left cursor-pointer border-b border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                    A
                  </span>
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-slate-900 uppercase">
                      A. Sistem Penilaian, Sanggah, dan Penentuan Juara
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">10 Butir Baku Regulasi Penjurian & Hasil</span>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openPenilaianSections['bab-a'] ? 'rotate-180 text-amber-600' : ''}`} />
              </button>

              {openPenilaianSections['bab-a'] && (
                <div className="p-5 sm:p-7 space-y-4">
                  {JUKNIS_PENILAIAN_CHAPTERS[0].points.map(pt => (
                    <div key={pt.number} className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-2">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {pt.number}
                        </span>
                        <div className="flex-1 space-y-2">
                          <strong className="text-sm font-black text-slate-900 block">
                            {pt.title}:
                          </strong>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {pt.content}
                          </p>

                          {pt.hasSebaranTable ? (
                            <div className="space-y-4 pt-2">
                              <SebaranNilaiTable showSectionHeader={false} />
                              {pt.formulaItems && (
                                <div className="pt-2 space-y-1.5">
                                  <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                                    c. Formula Nilai Murni &amp; Nilai Akhir (Akumulasi 3 Dewan Juri):
                                  </strong>
                                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                                    {pt.formulaItems.map((form, fIdx) => (
                                      <li key={fIdx}>{form}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ) : (
                            pt.subItems && (
                              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 pt-1">
                                {pt.subItems.map((sub, sIdx) => (
                                  <li key={sIdx} className="leading-relaxed">{sub}</li>
                                ))}
                              </ul>
                            )
                          )}

                          {pt.pointCards && (
                            <div className="space-y-2 pt-2">
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                                {pt.pointCards.map((card, cIdx) => (
                                  <div
                                    key={cIdx}
                                    className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                                      card.type === 'danton'
                                        ? 'bg-amber-50 text-amber-950 border-amber-300'
                                        : 'bg-white text-slate-900 border-slate-200'
                                    }`}
                                  >
                                    <span className="text-[10px] font-sans font-bold text-slate-500 uppercase">{card.label}</span>
                                    <strong className="text-sm font-black font-mono mt-0.5">{card.score}</strong>
                                  </div>
                                ))}
                              </div>
                              {pt.extraText && (
                                <p className="text-xs text-slate-600 leading-relaxed pt-1">
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

            {/* Bab B: Gangguan Sistem Digital dan Prosedur Backup */}
            <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-xs">
              <button
                type="button"
                onClick={() => togglePenilaianSection('bab-b')}
                className="w-full flex items-center justify-between p-5 sm:p-6 bg-slate-50/80 hover:bg-slate-100/80 transition-colors text-left cursor-pointer border-b border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                    B
                  </span>
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-slate-900 uppercase">
                      B. Prosedur Backup dan Mitigasi Gangguan Sistem E-Penilaian
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">3 Ketentuan Penanganan Gangguan & Prosedur Manual Cadangan</span>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openPenilaianSections['bab-b'] ? 'rotate-180 text-blue-600' : ''}`} />
              </button>

              {openPenilaianSections['bab-b'] && (
                <div className="p-5 sm:p-7 space-y-3.5">
                  {JUKNIS_PENILAIAN_CHAPTERS[1].points.map(pt => (
                    <div key={pt.number} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-blue-700 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {pt.number}
                      </span>
                      <div className="space-y-1">
                        <strong className="text-xs sm:text-sm font-bold text-slate-900 block">{pt.title}:</strong>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{pt.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bab C: Ketentuan Sanksi dan Penalti Pengurangan Nilai */}
            <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-xs">
              <button
                type="button"
                onClick={() => togglePenilaianSection('bab-c')}
                className="w-full flex items-center justify-between p-5 sm:p-6 bg-slate-50/80 hover:bg-slate-100/80 transition-colors text-left cursor-pointer border-b border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                    C
                  </span>
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-slate-900 uppercase">
                      C. Ketentuan Sanksi dan Penalti Pengurangan Nilai
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">Tabel Resmi Pemotongan Nilai Secara Kumulatif</span>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openPenilaianSections['bab-c'] ? 'rotate-180 text-red-600' : ''}`} />
              </button>

              {openPenilaianSections['bab-c'] && (
                <div className="p-5 sm:p-7 space-y-4">
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
                              {p.desc}
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

            {/* Bab D: Penutup */}
            <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-xs">
              <button
                type="button"
                onClick={() => togglePenilaianSection('bab-d')}
                className="w-full flex items-center justify-between p-5 sm:p-6 bg-slate-50/80 hover:bg-slate-100/80 transition-colors text-left cursor-pointer border-b border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-800 text-white font-black text-sm flex items-center justify-center shrink-0">
                    D
                  </span>
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-slate-900 uppercase">
                      D. Penutup
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">Asas Kepastian Hukum & Mengikat</span>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openPenilaianSections['bab-d'] ? 'rotate-180 text-slate-800' : ''}`} />
              </button>

              {openPenilaianSections['bab-d'] && (
                <div className="p-5 sm:p-7 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Petunjuk Teknis Penilaian dan Kejuaraan ini menjadi acuan baku dan mengikat dalam proses evaluasi hasil, penetapan peringkat, dan penegakan keadilan kompetisi LBB Mu'allimin Tahun 2027. Seluruh ketentuan yang telah ditetapkan berlaku mutlak bagi seluruh kontingen peserta dan perangkat perlombaan.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PETUNJUK TEKNIS LAPANGAN (BAB A – J VERBATIM)           */}
        {/* ============================================================== */}
        {activeTab === 'lapangan' && (
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs">
            <Rules embedded={true} />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: PETUNJUK TEKNIS PENDAFTARAN                             */}
        {/* ============================================================== */}
        {activeTab === 'pendaftaran' && (
          <div className="space-y-6 animate-fade">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-blue-800 font-black text-xs uppercase tracking-wider">
                <ClipboardList className="w-4 h-4 text-blue-600" />
                <span>Dokumen Regulasi Mandiri Resmi</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
                PETUNJUK TEKNIS PENDAFTARAN
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
                Ketentuan umum dan alur teknis pendaftaran resmi LBB Mu'allimin 2027: Alokasi kuota 36 peleton, periode gelombang (26 Okt – 22 Nov 2026), rekening BSI & kode unik 108, alur digital 5 langkah, komposisi personel 25+3, penyerahan berkas fisik asli saat Technical Meeting (TM), serta sanksi administratif diskualifikasi.
              </p>
            </div>

            {/* Bagian A: Ketentuan Umum dan Alur Teknis Pendaftaran */}
            <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-xs">
              <button
                type="button"
                onClick={() => togglePendaftaranSection('reg-a')}
                className="w-full flex items-center justify-between p-5 sm:p-6 bg-slate-50/80 hover:bg-slate-100/80 transition-colors text-left cursor-pointer border-b border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                    A
                  </span>
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-slate-900 uppercase">
                      A. Ketentuan Umum dan Alur Teknis Pendaftaran
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">10 Butir Baku Regulasi Administratif & Verifikasi</span>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openPendaftaranSections['reg-a'] ? 'rotate-180 text-blue-600' : ''}`} />
              </button>

              {openPendaftaranSections['reg-a'] && (
                <div className="p-5 sm:p-7 space-y-4">
                  {JUKNIS_PENDAFTARAN_CHAPTERS[0].items.map(item => (
                    <div key={item.number} className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-2">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-lg bg-blue-700 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {item.number}
                        </span>
                        <div className="flex-1 space-y-1.5">
                          <strong className="text-sm font-black text-slate-900 block">{item.title}:</strong>
                          <ul className="list-[lower-alpha] pl-5 space-y-1.5 text-xs text-slate-700 leading-relaxed">
                            {item.sub.map((s, sIdx) => (
                              <li key={sIdx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bagian B: Penutup Pendaftaran */}
            <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-xs">
              <button
                type="button"
                onClick={() => togglePendaftaranSection('reg-b')}
                className="w-full flex items-center justify-between p-5 sm:p-6 bg-slate-50/80 hover:bg-slate-100/80 transition-colors text-left cursor-pointer border-b border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-800 text-white font-black text-sm flex items-center justify-center shrink-0">
                    B
                  </span>
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-slate-900 uppercase">
                      B. Penutup
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">Asas Kepastian Hukum & Mengikat</span>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openPendaftaranSections['reg-b'] ? 'rotate-180 text-slate-800' : ''}`} />
              </button>

              {openPendaftaranSections['reg-b'] && (
                <div className="p-5 sm:p-7 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Petunjuk Teknis Pendaftaran ini disusun sebagai pedoman baku dan mengikat dalam rangka menjamin tertib administrasi, kepastian hukum, transparansi, serta kelancaran operasional pendaftaran Lomba Baris-Berbaris Mu’allimin Tahun 2027.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: MATERI GERAKAN & DENAH ARENA                            */}
        {/* ============================================================== */}
        {activeTab === 'materials' && (
          <div className="space-y-6 animate-fade">

        {/* Arena & Duration Spec Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Ukuran Arena Pertandingan</span>
            <span className="text-lg font-black text-slate-900 block font-mono">
              {selectedJenjang === 'SD' ? '25 Meter × 14 Meter' : '26 Meter × 15 Meter'}
            </span>
            <p className="text-[11px] text-slate-500">
              {selectedJenjang === 'SD' ? 'Arena 1: Lapangan Basket Kampus Terpadu' : 'Arena 2: Pelataran Embung Kampus Terpadu'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Batas Durasi Tampil</span>
            <span className="text-lg font-black text-slate-900 block font-mono">
              {selectedJenjang === 'SD' ? 'Maksimal 8 Menit' : 'Maksimal 12 Menit'}
            </span>
            <p className="text-[11px] text-slate-500">
              {selectedJenjang === 'SD' ? 'Peluit 1x panjang menit ke-7 (sisa 1 menit), 2x panjang menit ke-8 (habis).' : 'Peluit 1x panjang menit ke-11 (sisa 1 menit), 2x panjang menit ke-12 (habis).'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Slot Pergantian Pemain</span>
            <span className="text-lg font-black text-emerald-700 block font-mono">
              {selectedJenjang === 'SD' ? 'Antara Gerakan No. 16 & 17' : 'Antara Gerakan No. 19 & 20'}
            </span>
            <p className="text-[11px] text-slate-500">
              {selectedJenjang === 'SD' ? 'Dilakukan saat materi "Bubar" (antara No. 16 & 17).' : 'Dilakukan saat materi "Bubar" (antara No. 19 & 20).'}
            </p>
          </div>
        </div>

        {/* Visual Denah Pos Arena Pertandingan */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                Layout Lapangan & Pos Arena {selectedJenjang === 'SD' ? 'SD / MI (Arena 1)' : 'SMP / MTs (Arena 2)'}
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
              Skema Resmi Juri, Start, Finish & Kotak Danton
            </span>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 sm:p-6 border border-slate-200 flex items-center justify-center">
            <img
              src={selectedJenjang === 'SD' ? '/pos-sd.png' : '/pos-smp.png'}
              alt={selectedJenjang === 'SD' ? 'Layout Pos SD/MI 25x14M' : 'Layout Pos SMP/MTs 26x15M'}
              className="max-h-[320px] w-auto object-contain mx-auto drop-shadow-sm rounded-lg"
              loading="lazy"
            />
          </div>
        </div>

        {/* Jenjang Switcher & Search Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setSelectedJenjang('SD')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedJenjang === 'SD'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tingkat SD / MI (26 Gerakan Resmi)
              </button>
              <button
                type="button"
                onClick={() => setSelectedJenjang('SMP')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedJenjang === 'SMP'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tingkat SMP / MTs (28 Gerakan Resmi)
              </button>
            </div>

            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari butir gerakan PBB..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
              />
            </div>
          </div>

          {/* List of Movements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredMateri.map(m => (
              <div
                key={m.no}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 group ${
                  m.isSubstitutionPoint
                    ? 'bg-emerald-50/60 border-emerald-300 hover:border-emerald-500'
                    : 'bg-slate-50/70 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
                }`}
              >
                <span className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                  m.isSubstitutionPoint ? 'bg-emerald-700 text-white' : 'bg-slate-900 text-white'
                }`}>
                  {String(m.no).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                      {m.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-[9px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full shrink-0">
                      {m.category}
                    </span>
                    {m.isSubstitutionPoint && (
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Titik Pergantian Pemain
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rubrik Penilaian Khusus: Juri 1:1 & Danton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Kriteria Penilaian Komandan Peleton (4 Aspek Baku)</span>
            </h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Penguasaan Materi Aba-Aba (35%):</strong> Kebenaran urutan aba-aba petunjuk, peringatan, dan pelaksanaan sesuai juknis.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Kualitas Suara (25%):</strong> Kejelasan artikulasi, intonasi, tempo, ritme, dan kekuatan vokal (IKIT).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Sikap Tampang & Keberanian (20%):</strong> Ketenangan, ketegasan pandangan mata, wibawa kepemimpinan, dan kerapian.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Penguasaan Lapangan (20%):</strong> Penempatan posisi relatif terhadap pasukan dan dewan juri serta efektivitas kotak Danton (1,5 × 1,5 m).</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Sistem Penilaian Peleton 1:1 (Rentang 50 s.d. 90 Genap)</span>
            </h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Kebenaran Gerak (Bobot 50%):</strong> Kesesuaian teknik gerak dengan Perpang TNI 58 & 57 Tahun 2018 (serta No. 45 Tahun 2014).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Kekompakan (Bobot 50%):</strong> Keselarasan tempo, irama hentakan kaki, kesamaan sudut ayunan tangan, dan kelurusan saf/banjar.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Skala Nilai:</strong> Diberikan dalam rentang 50 s.d. 90 poin (bilangan genap) oleh 6 Dewan Juri Independen (TNI, POLRI, Profesional/Sipil).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Atribut Terjatuh:</strong> Diberlakukan penalti 0 poin (tidak ada pengurangan nilai) agar konsentrasi peleton terjaga.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bab H & Prosedur Khusus: Force Majeure, Sanggah & Checkout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-6 space-y-3">
            <h3 className="text-sm font-black text-amber-950 uppercase flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-700" />
              <span>Bab I: Protokol Keadaan Kahar (Force Majeure)</span>
            </h3>
            <ul className="text-xs text-amber-900/80 space-y-2 leading-relaxed">
              <li>
                <strong>Hujan Ringan (Gerimis):</strong> Perlombaan tetap berlangsung secara normal dan waktu lomba tetap berjalan.
              </li>
              <li>
                <strong>Hujan Deras / Badai Ekstrem:</strong> Panitia bersama Dewan Juri berhak menghentikan lomba sementara demi keselamatan.
              </li>
              <li>
                <strong>Mekanisme Reset Waktu:</strong> Peleton yang penampilannya terhenti di tengah materi akibat badai akan diulang dari awal masuk arena dengan stopwatch di-reset ke 00:00 setelah cuaca kondusif.
              </li>
              <li>
                <strong>Wewenang Mutlak:</strong> Keputusan penghentian dan kelanjutan perlombaan merupakan wewenang mutlak Panitia Pelaksana dan Dewan Juri.
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-3 border border-slate-800">
            <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-400" />
              <span>Pasca Lomba: Transparansi, Sanggah & Checkout</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li>
                <strong>Transparansi Nilai (Rolling Release):</strong> Official dapat mengakses lembar rekap nilai mandiri di portal <span className="text-red-400 font-mono">lbb.tontimuallimin.com</span> via login Gmail resmi terdaftar ±1 jam setelah tampil.
              </li>
              <li>
                <strong>Masa Sanggah Ditutup Pukul 15.00 WIB:</strong> Protes hanya diterima untuk kekeliruan administratif non-penilaian, diajukan tertulis via Formulir Sanggahan Resmi oleh Official di Ruang Informasi Panitia.
              </li>
              <li>
                <strong>Batas Checkout Pukul 15.00 WIB:</strong> Pengosongan basecamp wajib tuntas pukul 15.00 WIB (1 jam sebelum Upacara Penutupan) melalui 4 langkah verifikasi kebersihan untuk pengembalian KTP/SIM jaminan.
              </li>
            </ul>
          </div>
        </div>

        {/* Bab V: Penutup, Pusat Layanan & Narahubung Resmi */}
        <div className="bg-gradient-to-r from-red-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-red-800/50 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              BAB V: Penutup (Pusat Layanan dan Narahubung Resmi)
            </h3>
            <span className="text-[10px] font-bold text-red-300 uppercase tracking-widest bg-red-950/60 border border-red-500/30 px-3 py-1 rounded-full w-fit">
              Official Helpdesk
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Petunjuk Teknis ini merupakan pedoman operasional resmi yang mengikat bagi seluruh panitia, dewan juri, dan kontingen peserta LBB Mu'allimin Tahun 2027. Seluruh komunikasi dan koordinasi resmi dilayani melalui saluran helpdesk:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">WhatsApp Helpdesk Resmi</span>
              <span className="font-black text-emerald-400 text-sm">0819-4749-1505</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">(Admin Tonti Mu'allimin)</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">Website Portal Pendaftaran</span>
              <span className="font-bold text-white text-xs block truncate">https://lbb.tontimuallimin.com</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Sistem Pendaftaran & Live Score</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">Email & Media Sosial</span>
              <span className="font-bold text-white text-xs block">lbb@tontimuallimin.com</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Instagram: @lbbmuin | @mualliminjogja</span>
            </div>
          </div>
        </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: RUNDOWN RESMI KEGIATAN LBB MU'ALLIMIN 2027               */}
        {/* ============================================================== */}
        {activeTab === 'rundown' && (
          <div className="space-y-6 animate-fade">
            
            {/* Sub-tab Navigation */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRundownSubTab('competition')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                    rundownSubTab === 'competition'
                      ? 'bg-red-700 text-white shadow-md shadow-red-700/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Hari-H Perlombaan (24 Jan 2027)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRundownSubTab('tm')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                    rundownSubTab === 'tm'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Technical Meeting (9 Jan 2027)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRundownSubTab('trial')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                    rundownSubTab === 'trial'
                      ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Uji Coba Lapangan (16 Jan 2027)</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Dokumen Resmi Sesuai Juknis 2027</span>
              </div>
            </div>

            {/* Sub-tab 1: Hari-H Perlombaan */}
            {rundownSubTab === 'competition' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 text-white p-5 rounded-2xl border border-red-900/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-300 tracking-wider">Bagian C</span>
                    <h3 className="text-base font-black uppercase text-white">Rundown Hari-H Perlombaan (Ahad, 24 Januari 2027)</h3>
                    <p className="text-xs text-slate-300 mt-0.5">{VENUE.NAME} • 13 Blok Tahapan Lengkap (06.00 s.d. 17.15+ WIB)</p>
                  </div>
                  <div className="text-xs bg-white/10 px-3 py-1.5 rounded-xl text-amber-300 font-mono font-bold w-fit">
                    18 SD + 18 SMP (2 Arena Paralel)
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-3 text-center w-12">No</th>
                          <th className="py-3 px-3.5 w-32">Waktu (WIB)</th>
                          <th className="py-3 px-3 w-16 text-center">Durasi</th>
                          <th className="py-3 px-4 w-60">Agenda Kegiatan</th>
                          <th className="py-3 px-4">Deskripsi Operasional / Penanggung Jawab</th>
                          <th className="py-3 px-4 w-48">Lokasi / Venue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {RUNDOWN_DATA.competition.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-3 text-center font-bold text-slate-400 font-mono">{idx + 1}</td>
                            <td className="py-3 px-3.5 font-bold font-mono text-slate-900 whitespace-nowrap">{item.time}</td>
                            <td className="py-3 px-3 text-center font-mono font-semibold text-slate-500">{item.duration}</td>
                            <td className="py-3 px-4 font-bold text-slate-900">{item.agenda}</td>
                            <td className="py-3 px-4 text-slate-600 leading-relaxed text-[11px]">{item.desc}</td>
                            <td className="py-3 px-4 text-slate-700 font-medium text-[11px]">
                              <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{item.location}</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Technical Meeting */}
            {rundownSubTab === 'tm' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 text-white p-5 rounded-2xl border border-amber-900/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Bagian A</span>
                    <h3 className="text-base font-black uppercase text-white">Rundown Technical Meeting (Sabtu, 9 Januari 2027)</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Aula Kampus Induk Madrasah Mu’allimin Wirobrajan (12.30 – 16.30 WIB)</p>
                  </div>
                  <div className="text-xs bg-white/10 px-3 py-1.5 rounded-xl text-amber-300 font-mono font-bold w-fit">
                    Presensi & Lotting Undian Tampil
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-3 text-center w-12">No</th>
                          <th className="py-3 px-3.5 w-36">Waktu (WIB)</th>
                          <th className="py-3 px-3 w-16 text-center">Durasi</th>
                          <th className="py-3 px-4 w-64">Agenda Kegiatan</th>
                          <th className="py-3 px-4">Deskripsi Operasional / Penanggung Jawab</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {RUNDOWN_DATA.tm.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3.5 px-3 text-center font-bold text-slate-400 font-mono">{idx + 1}</td>
                            <td className="py-3.5 px-3.5 font-bold font-mono text-slate-900 whitespace-nowrap">{item.time} WIB</td>
                            <td className="py-3.5 px-3 text-center font-mono font-semibold text-amber-800">{item.duration}</td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">{item.agenda}</td>
                            <td className="py-3.5 px-4 text-slate-600 leading-relaxed text-[11px]">{item.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 3: Uji Coba Lapangan */}
            {rundownSubTab === 'trial' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 text-white p-5 rounded-2xl border border-teal-900/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">Bagian B</span>
                    <h3 className="text-base font-black uppercase text-white">Rundown Uji Coba Lapangan (Sabtu, 16 Januari 2027)</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Kampus Terpadu Sedayu • 2 Arena Paralel • 15 Menit/Peleton (06.30 – 12.00 WIB)</p>
                  </div>
                  <div className="text-xs bg-white/10 px-3 py-1.5 rounded-xl text-teal-300 font-mono font-bold w-fit">
                    18 Slot Paralel (SD Arena 1 & SMP Arena 2)
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-3 text-center w-12">No</th>
                          <th className="py-3 px-4 w-36">Waktu (WIB)</th>
                          <th className="py-3 px-4 w-1/2 bg-red-950/80 text-red-100 border-r border-slate-800">
                            Arena 1 (SD/MI - Lapangan Basket)
                          </th>
                          <th className="py-3 px-4 w-1/2 bg-blue-950/80 text-blue-100">
                            Arena 2 (SMP/MTs - Pelataran Embung)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {RUNDOWN_DATA.trial.slots.map((slot, idx) => {
                          const isSpecial = idx === 0 || idx === RUNDOWN_DATA.trial.slots.length - 1;
                          return (
                            <tr key={idx} className={`${isSpecial ? 'bg-slate-50 font-bold' : 'hover:bg-slate-50'} transition-colors`}>
                              <td className="py-3 px-3 text-center font-mono text-slate-400">
                                {idx === 0 ? '-' : idx === RUNDOWN_DATA.trial.slots.length - 1 ? '-' : idx}
                              </td>
                              <td className="py-3 px-4 font-bold font-mono text-slate-900 whitespace-nowrap">{slot.time} WIB</td>
                              <td className="py-3 px-4 border-r border-slate-100 text-red-700 font-semibold">{slot.arena1}</td>
                              <td className="py-3 px-4 text-blue-700 font-semibold">{slot.arena2}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </SimpaskorSidebarLayout>
  );
}
