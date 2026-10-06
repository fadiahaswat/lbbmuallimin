import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Printer,
  ChevronRight,
  Sparkles,
  Users,
  Building2,
  BadgeCheck,
  Timer,
  CalendarCheck2,
  ExternalLink,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { EVENT, VENUE, VENUE_INDUK, OFFICIAL_TIMELINE } from '../../config.js';
import { UJI_COBA_SCHEDULE, HARI_H_SCHEDULE } from '../../data/scheduleMatrices.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function TimelinePanitiaView() {
  const { settings, currentUser } = useCompetition();
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'hari-h' | 'uji-coba'
  const [matrixJenjang, setMatrixJenjang] = useState('SD');
  const [filterPhase, setFilterPhase] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 37 Tahapan Kronologis Resmi dari TIMELINE LBB MU'ALLIMIN 2027.xlsx
  const timelineSchedule = OFFICIAL_TIMELINE.map((item, idx) => {
    let status = 'upcoming';
    let statusLabel = 'Mendatang';

    if (item.phase.startsWith('A.') || item.phase.startsWith('B.') || item.phase.startsWith('C.')) {
      status = 'completed';
      statusLabel = 'Selesai';
    } else if (item.phase.startsWith('H.')) {
      status = 'critical';
      statusLabel = 'Hari-H Utama';
    } else if (item.phase.startsWith('I.')) {
      status = 'upcoming';
      statusLabel = 'Pasca Lomba';
    }

    let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
    if (item.phase.startsWith('A.')) badgeColor = 'bg-purple-100 text-purple-700 border-purple-200';
    else if (item.phase.startsWith('B.')) badgeColor = 'bg-blue-100 text-blue-700 border-blue-200';
    else if (item.phase.startsWith('C.')) badgeColor = 'bg-amber-100 text-amber-700 border-amber-200';
    else if (item.phase.startsWith('D.')) badgeColor = 'bg-teal-100 text-teal-700 border-teal-200';
    else if (item.phase.startsWith('E.')) badgeColor = 'bg-indigo-100 text-indigo-700 border-indigo-200';
    else if (item.phase.startsWith('F.')) badgeColor = 'bg-cyan-100 text-cyan-700 border-cyan-200';
    else if (item.phase.startsWith('G.')) badgeColor = 'bg-emerald-100 text-emerald-700 border-emerald-200';
    else if (item.phase.startsWith('H.')) badgeColor = 'bg-red-100 text-red-700 border-red-200';
    else if (item.phase.startsWith('I.')) badgeColor = 'bg-rose-100 text-rose-700 border-rose-200';

    return {
      ...item,
      status,
      statusLabel,
      badgeColor,
      venue: item.phase.startsWith('H.') || item.phase.startsWith('G.') 
        ? `${VENUE.NAME} (Sedayu)` 
        : item.phase.startsWith('E.') 
        ? `${VENUE_INDUK.NAME} (Wirobrajan)` 
        : 'Sekretariat Panitia & Media Online'
    };
  });

  const filteredTimeline = timelineSchedule.filter(item => {
    const matchPhase = filterPhase === 'all' || item.phase.toLowerCase().includes(filterPhase.toLowerCase());
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPhase && matchSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <SimpaskorSidebarLayout
      activeMenu="timeline"
      title="Timeline & Agenda Kerja Panitia"
      subtitle="Roadmap kronologis 37 tahapan operasional dari Fase A s.d. I (September 2026 – Februari 2027)"
      rightActions={
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Cetak Agenda Kerja Panitia"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak Agenda</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">

        {/* Banner Ringkasan Agenda Panitia */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-red-600/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider">
                <CalendarCheck2 className="w-3.5 h-3.5" />
                <span>Dokumen Resmi: TIMELINE LBB MU'ALLIMIN 2027</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                Master Roadmap 37 Tahapan Panitia
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Jadwal operasional menyeluruh dari Fase A (Perencanaan Awal Sept 2026), TM & Uji Coba Lapangan (Jan 2027), Hari-H Perlombaan di 2 Arena Paralel Sedayu (24 Jan 2027), hingga Penyusunan LPJ Final (Feb 2027).
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-amber-400 font-mono">37</div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Milestone</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-emerald-400 font-mono">9 Fase</div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fase A s.d. I</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigasi Dokumen Utama: Roadmap Panitia vs Matriks Hari-H vs Matriks Uji Coba */}
        <div className="flex border-b border-slate-200 gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-black transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'roadmap'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CalendarCheck2 className="w-4 h-4" />
            <span>Master Roadmap (37 Tahapan)</span>
          </button>
          <button
            onClick={() => setActiveTab('hari-h')}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-black transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'hari-h'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Matriks Hari-H (Sheet 4)</span>
          </button>
          <button
            onClick={() => setActiveTab('uji-coba')}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-black transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'uji-coba'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>Matriks Uji Coba (Sheet 3)</span>
          </button>
        </div>

        {activeTab === 'roadmap' && (
          <>
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400 mr-2">Filter Fase:</span>
                {[
                  { id: 'all', label: 'Semua (37)' },
                  { id: 'fase a', label: 'A. Perencanaan' },
                  { id: 'fase b', label: 'B. Publikasi' },
                  { id: 'fase c', label: 'C. Pendaftaran' },
                  { id: 'fase e', label: 'E. TM Wirobrajan' },
                  { id: 'fase g', label: 'G. Uji Coba Sedayu' },
                  { id: 'fase h', label: 'H. Hari-H Lomba' },
                  { id: 'fase i', label: 'I. LPJ & Pasca' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterPhase(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      filterPhase === tab.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari tahapan / PIC..."
                  className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white w-full sm:w-60"
                />
              </div>
            </div>

            {/* List Timeline Kronologis */}
            <div className="space-y-4 relative">
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200 hidden sm:block" />

              {filteredTimeline.map((item, index) => {
                const isCompleted = item.status === 'completed';
                const isCritical = item.status === 'critical';

                return (
                  <div
                    key={item.id}
                    className="relative pl-0 sm:pl-16 group transition-all"
                  >
                    <div className="absolute left-3.5 top-5 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-slate-300 hidden sm:flex items-center justify-center z-10 group-hover:scale-110 transition-transform shadow-xs">
                      {isCompleted ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      ) : isCritical ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      )}
                    </div>

                    <div
                      className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all hover:shadow-md ${
                        isCritical
                          ? 'border-red-300/80 shadow-xs ring-1 ring-red-500/10'
                          : isCompleted
                          ? 'border-slate-200/80'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                              {item.phase}
                            </span>
                            {isCompleted && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Terlaksana</span>
                              </span>
                            )}
                            {isCritical && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-red-600 text-white shadow-xs uppercase tracking-wider flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>Hari-H Lomba</span>
                              </span>
                            )}
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                            {item.title}
                          </h3>
                        </div>

                        <div className="text-left sm:text-right shrink-0 bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border sm:border-0 border-slate-100">
                          <div className="text-xs sm:text-sm font-black text-slate-900 font-mono">{item.period}</div>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        {item.desc}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium truncate max-w-xs">{item.venue}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-bold text-slate-700">PIC: {item.pic}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Tab Matriks Hari-H (Sheet 4) */}
        {activeTab === 'hari-h' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMatrixJenjang('SD')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    matrixJenjang === 'SD'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Tingkat SD/MI (Arena 1 Basket)
                </button>
                <button
                  onClick={() => setMatrixJenjang('SMP')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    matrixJenjang === 'SMP'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Tingkat SMP/MTs (Arena 2 Embung)
                </button>
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                Ahad, 24 Januari 2027 • 18 Peleton {matrixJenjang}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-3">No Urut</th>
                    <th className="py-3 px-3">Arena</th>
                    <th className="py-3 px-3">Kesiapan Basecamp</th>
                    <th className="py-3 px-3">Panggilan DP 1</th>
                    <th className="py-3 px-3">Cek Fisik DP 1</th>
                    <th className="py-3 px-3">Masuk DP 2</th>
                    <th className="py-3 px-3 text-red-600">Start Lomba</th>
                    <th className="py-3 px-3">Peluit 1x (Warning)</th>
                    <th className="py-3 px-3 text-rose-700">Peluit 2x (Stop)</th>
                    <th className="py-3 px-3">Keluar Arena</th>
                    <th className="py-3 px-3 text-emerald-700">Kembalikan No Dada</th>
                    <th className="py-3 px-3">Sesi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {HARI_H_SCHEDULE[matrixJenjang].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900 font-sans">{row.no}</td>
                      <td className="py-3 px-3 font-sans text-slate-600">{row.arena}</td>
                      <td className="py-3 px-3 text-slate-600">{row.readyBasecamp}</td>
                      <td className="py-3 px-3 text-amber-700 font-bold">{row.callDP1}</td>
                      <td className="py-3 px-3 text-slate-500">{row.checkDP1}</td>
                      <td className="py-3 px-3 text-blue-700 font-bold">{row.enterDP2}</td>
                      <td className="py-3 px-3 bg-red-50 text-red-700 font-black">{row.startTampil}</td>
                      <td className="py-3 px-3 text-amber-600 font-semibold">{row.warningPeluit}</td>
                      <td className="py-3 px-3 bg-rose-50 text-rose-700 font-black">{row.stopPeluit}</td>
                      <td className="py-3 px-3 text-slate-600">{row.exitArena}</td>
                      <td className="py-3 px-3 text-emerald-700 font-bold">{row.returnBadge}</td>
                      <td className="py-3 px-3 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.session.includes('Sesi I') ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {row.session}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Matriks Uji Coba (Sheet 3) */}
        {activeTab === 'uji-coba' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMatrixJenjang('SD')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    matrixJenjang === 'SD'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Tingkat SD/MI (Arena 1 Basket)
                </button>
                <button
                  onClick={() => setMatrixJenjang('SMP')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    matrixJenjang === 'SMP'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Tingkat SMP/MTs (Arena 2 Embung)
                </button>
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                Sabtu, 16 Januari 2027 • 18 Peleton {matrixJenjang}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-3">No Urut</th>
                    <th className="py-3 px-3">Arena</th>
                    <th className="py-3 px-3">Tiba & Masuk Kampus</th>
                    <th className="py-3 px-3">Pos Transit Pemanasan</th>
                    <th className="py-3 px-3 text-amber-700">Panggilan DP 1</th>
                    <th className="py-3 px-3 text-slate-500">Cek Fisik DP 1</th>
                    <th className="py-3 px-3 text-blue-700">Masuk DP 2</th>
                    <th className="py-3 px-3 text-emerald-700 font-black">Masuk Arena (Start)</th>
                    <th className="py-3 px-3 text-slate-700">Selesai Arena</th>
                    <th className="py-3 px-3 text-slate-600">Keluar Arena</th>
                    <th className="py-3 px-3 text-rose-700 font-bold">Maks. Meninggalkan Kampus</th>
                    <th className="py-3 px-3">Sesi Uji Coba</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {UJI_COBA_SCHEDULE[matrixJenjang].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900 font-sans">{row.no}</td>
                      <td className="py-3 px-3 font-sans text-slate-600">{row.arena}</td>
                      <td className="py-3 px-3 text-slate-600">{row.arrival}</td>
                      <td className="py-3 px-3 text-slate-500">{row.transit}</td>
                      <td className="py-3 px-3 text-amber-700 font-bold">{row.callDP}</td>
                      <td className="py-3 px-3 text-slate-500">{row.checkDP1}</td>
                      <td className="py-3 px-3 text-blue-700 font-bold">{row.enterDP2}</td>
                      <td className="py-3 px-3 bg-emerald-50 text-emerald-800 font-black">{row.enterArena}</td>
                      <td className="py-3 px-3 text-slate-700 font-semibold">{row.finishArena}</td>
                      <td className="py-3 px-3 text-slate-600">{row.exitArena}</td>
                      <td className="py-3 px-3 bg-rose-50 text-rose-700 font-black">{row.leaveCampus}</td>
                      <td className="py-3 px-3 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.session.includes('Sesi I') ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {row.session}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SimpaskorSidebarLayout>
  );
}
