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
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function TimelinePanitiaView() {
  const { settings, currentUser } = useCompetition();
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
      </div>
    </SimpaskorSidebarLayout>
  );
}
