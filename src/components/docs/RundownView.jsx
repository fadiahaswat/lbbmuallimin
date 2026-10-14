import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Printer,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Users,
  Building2,
  FileText,
  ExternalLink,
  ChevronRight,
  Download,
  Info,
  Timer,
  CalendarCheck,
  Compass,
  Swords,
  Trophy,
  Coffee,
  Mic,
  Flag,
  Share2,
  Table as TableIcon,
  LayoutList
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { SITE, EVENT, VENUE, VENUE_INDUK, DOWNLOADS } from '../../config.js';
import { RUNDOWN_DATA } from '../../data/juknisDocsData.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function RundownView() {
  const { setActiveView, goBack, currentUser } = useCompetition();
  
  // Tab: 'competition' (Hari-H) | 'tm' (Technical Meeting) | 'trial' (Uji Coba Lapangan)
  const [activeTab, setActiveTab] = useState('competition');
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSession, setFilterSession] = useState('all'); // for Hari-H: 'all' | 'pagi' | 'siang' | 'upacara'

  const handlePrint = () => {
    window.print();
  };

  const currentRundown = RUNDOWN_DATA[activeTab];

  // Filtered competition items
  const filteredCompetitionItems = useMemo(() => {
    if (!RUNDOWN_DATA.competition?.items) return [];
    return RUNDOWN_DATA.competition.items.filter(item => {
      const matchSearch =
        item.agenda.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.time.includes(searchQuery);

      if (!matchSearch) return false;

      if (filterSession === 'pagi') {
        return item.time.startsWith('08.00') || item.agenda.includes('Sesi I');
      }
      if (filterSession === 'siang') {
        return item.time.startsWith('12.30') || item.agenda.includes('Sesi II');
      }
      if (filterSession === 'upacara') {
        return item.agenda.includes('Upacara') || item.agenda.includes('Apel') || item.agenda.includes('Pengumuman');
      }
      return true;
    });
  }, [searchQuery, filterSession]);

  // Filtered TM items
  const filteredTmItems = useMemo(() => {
    if (!RUNDOWN_DATA.tm?.items) return [];
    return RUNDOWN_DATA.tm.items.filter(item => {
      return (
        item.agenda.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.time.includes(searchQuery)
      );
    });
  }, [searchQuery]);

  // Filtered Trial items
  const filteredTrialItems = useMemo(() => {
    if (!RUNDOWN_DATA.trial?.slots) return [];
    return RUNDOWN_DATA.trial.slots.filter(item => {
      return (
        item.time.includes(searchQuery) ||
        item.arena1.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.arena2.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 selection:bg-red-200">
      
      {/* ========================================================
          STICKY TOP HEADER (Web Only - Hidden on Print)
          ======================================================== */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white py-3 px-4 sm:px-8 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveView('landing')}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Beranda</span>
            </button>
            <div className="h-5 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block leading-none">
                  Dokumen Resmi
                </span>
                <span className="text-xs font-bold text-white">Rundown Kegiatan LBB Mu'allimin 2027</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-red-950/30 cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF</span>
            </button>
            <a
              href={DOWNLOADS[0]?.url || "https://docs.google.com/document/d/1BN1RuwDcEiuibVvoBG4-5R7Rq8neV5st3nAZoISVQi0/edit?usp=sharing"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-xs font-bold rounded-xl border border-white/15 transition-all flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Google Docs</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================
          MAIN CONTENT CONTAINER
          ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* PRINT ONLY: KOP SURAT RESMI */}
        <div className="hidden print:block border-b-4 border-double border-slate-900 pb-4 mb-6 text-center">
          <img
            src="/kop-lbb.png"
            alt="KOP Resmi LBB Mu'allimin 2027"
            className="w-full max-h-24 object-contain mx-auto mb-2"
          />
          <p className="text-[11px] font-sans text-slate-500">
            Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta • Website: lbb.tontimuallimin.com • WhatsApp: 0819-4749-1505
          </p>
          <div className="mt-4 pt-2 border-t border-slate-300">
            <h2 className="text-base font-black uppercase tracking-wider text-slate-900">
              RUNDOWN RESMI KEGIATAN LBB MU'ALLIMIN TAHUN 2027
            </h2>
          </div>
        </div>

        {/* HERO BANNER (Web Only) */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden print:hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-red-600/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Petunjuk Teknis & Lini Masa Resmi 2027</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                Rundown Resmi Kegiatan LBB Mu'allimin
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Jadwal kronologis menyeluruh untuk seluruh rangkaian acara: <strong>Technical Meeting</strong> (Wirobrajan), <strong>Uji Coba Lapangan 2 Arena Paralel</strong> (Sedayu), hingga <strong>Hari-H Perlombaan & Penganugerahan Juara</strong> (24 Januari 2027).
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Fase 1</span>
                <span className="text-base sm:text-lg font-black text-amber-400 font-mono">9 Jan</span>
                <span className="text-[9px] text-slate-400 block">TM & Undian</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Fase 2</span>
                <span className="text-base sm:text-lg font-black text-cyan-400 font-mono">16 Jan</span>
                <span className="text-[9px] text-slate-400 block">Gladi 2 Arena</span>
              </div>
              <div className="bg-red-950/60 border border-red-500/30 rounded-2xl p-3 sm:p-4 text-center shadow-lg">
                <span className="text-[10px] font-bold uppercase text-red-300 block">Fase 3</span>
                <span className="text-base sm:text-lg font-black text-red-400 font-mono">24 Jan</span>
                <span className="text-[9px] text-red-300 block font-bold">Hari-H Utama</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            3 PRIMARY TABS SWITCHER (Web Only)
            ======================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs print:hidden">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
            {/* Tab 1: Hari-H */}
            <button
              type="button"
              onClick={() => setActiveTab('competition')}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeTab === 'competition'
                  ? 'bg-red-700 text-white shadow-md shadow-red-700/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Swords className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <span className="block leading-none">Hari-H Perlombaan</span>
                <span className={`text-[10px] font-normal block mt-0.5 ${activeTab === 'competition' ? 'text-red-200' : 'text-slate-400'}`}>
                  Ahad, 24 Jan 2027 (13 Sesi)
                </span>
              </div>
            </button>

            {/* Tab 2: Technical Meeting */}
            <button
              type="button"
              onClick={() => setActiveTab('tm')}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeTab === 'tm'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <CalendarCheck className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <span className="block leading-none">Technical Meeting</span>
                <span className={`text-[10px] font-normal block mt-0.5 ${activeTab === 'tm' ? 'text-amber-100' : 'text-slate-400'}`}>
                  Sabtu, 9 Jan 2027 (Wirobrajan)
                </span>
              </div>
            </button>

            {/* Tab 3: Uji Coba Lapangan */}
            <button
              type="button"
              onClick={() => setActiveTab('trial')}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeTab === 'trial'
                  ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <span className="block leading-none">Uji Coba Lapangan</span>
                <span className={`text-[10px] font-normal block mt-0.5 ${activeTab === 'trial' ? 'text-teal-200' : 'text-slate-400'}`}>
                  Sabtu, 16 Jan 2027 (2 Arena)
                </span>
              </div>
            </button>
          </div>

          {/* Right Action: Search & View Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari agenda / waktu..."
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-red-500 w-full sm:w-48 transition-all"
              />
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'timeline' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tampilan Garis Waktu"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tampilan Matriks Tabel"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            TAB 1: RUNDOWN HARI-H PERLOMBAAN (Ahad, 24 Jan 2027)
            ======================================================== */}
        {(activeTab === 'competition' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
          <div className="space-y-6">

            {/* Venue & Meta Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 text-[10px] font-black uppercase tracking-wider">
                    Bagian C
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase">
                    Rundown Hari-H Perlombaan LBB Mu'allimin 2027
                  </h3>
                </div>
                <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    <strong>Ahad, 24 Januari 2027</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <strong>06.00 WIB s.d. Selesai</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{VENUE.NAME} (Kampus Terpadu Sedayu)</span>
                  </span>
                </p>
              </div>

              {/* Quick Filter Pill Hari-H */}
              <div className="flex flex-wrap items-center gap-1.5 print:hidden">
                <span className="text-[11px] font-bold text-slate-400 mr-1">Sesi:</span>
                {[
                  { id: 'all', label: 'Semua (13)' },
                  { id: 'pagi', label: 'Sesi I (Pagi)' },
                  { id: 'siang', label: 'Sesi II (Siang)' },
                  { id: 'upacara', label: 'Protokoler' },
                ].map(filter => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setFilterSession(filter.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      filterSession === filter.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Critical Operational Alerts for Hari-H */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print:hidden">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-amber-950 font-bold block">Peleton Wajib Upacara Pembukaan</strong>
                  <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                    Urutan tampil 6 s.d. 10 (SD-131 s.d. SD-139 dan SMP-242 s.d. SMP-260) wajib berada di Lapangan Mini Soccer pukul 06.45 WIB.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-start gap-3">
                <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-blue-950 font-bold block">Simultan 2 Arena Paralel</strong>
                  <p className="text-blue-800 text-[11px] mt-0.5 leading-relaxed">
                    Arena 1 Lap. Basket (SD-111 s.d. SD-175) & Arena 2 Pelataran Embung (SMP-222 s.d. SMP-286) bergulir serentak mulai 08.00 WIB.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-emerald-950 font-bold block">Sidang Pleno & Masa Sanggah</strong>
                  <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
                    Rekapitulasi dewan juri & sanggah administrasi berlangsung 13.30–15.00 WIB bersamaan dengan prosedur check-out basecamp.
                  </p>
                </div>
              </div>
            </div>

            {/* TABULAR VIEW (Default for Print, or when viewMode === 'table') */}
            <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs ${viewMode === 'timeline' ? 'hidden print:block' : 'block'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-3.5 text-center w-12">No</th>
                      <th className="py-3 px-3.5 w-32">Waktu (WIB)</th>
                      <th className="py-3 px-3 w-16 text-center">Durasi</th>
                      <th className="py-3 px-4 w-64">Agenda Kegiatan</th>
                      <th className="py-3 px-4">Deskripsi Operasional / Penanggung Jawab</th>
                      <th className="py-3 px-4 w-52">Lokasi / Venue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredCompetitionItems.map((item, idx) => {
                      const isIshoma = item.agenda.includes('ISHOMA');
                      const isUpacara = item.agenda.includes('Upacara') || item.agenda.includes('Apel');
                      const isLomba = item.agenda.includes('Pelaksanaan Lomba');
                      const isPleno = item.agenda.includes('Pleno');

                      let rowBg = 'hover:bg-slate-50/80';
                      if (isIshoma) rowBg = 'bg-amber-50/50 hover:bg-amber-50';
                      if (isLomba) rowBg = 'bg-red-50/30 hover:bg-red-50/60';
                      if (isPleno) rowBg = 'bg-indigo-50/30 hover:bg-indigo-50/60';

                      return (
                        <tr key={idx} className={`${rowBg} transition-colors`}>
                          <td className="py-3 px-3.5 text-center font-bold text-slate-400 font-mono">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3.5 font-bold font-mono text-slate-900 whitespace-nowrap">
                            {item.time}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-semibold text-slate-500">
                            {item.duration}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            <span className="flex items-center gap-1.5">
                              {isLomba && <Swords className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                              {isIshoma && <Coffee className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                              {isUpacara && <Flag className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                              {item.agenda}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 leading-relaxed text-[11px]">
                            {item.desc}
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-medium text-[11px]">
                            <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{item.location}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TIMELINE CARDS VIEW (Web Only) */}
            <div className={`space-y-3.5 print:hidden ${viewMode === 'table' ? 'hidden' : 'block'}`}>
              {filteredCompetitionItems.map((item, idx) => {
                const isIshoma = item.agenda.includes('ISHOMA');
                const isUpacara = item.agenda.includes('Upacara') || item.agenda.includes('Apel');
                const isLomba = item.agenda.includes('Pelaksanaan Lomba');
                const isPleno = item.agenda.includes('Pleno');
                const isAward = item.agenda.includes('Penganugerahan');

                let accentBorder = 'border-slate-200';
                let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
                let iconComponent = <Clock className="w-4 h-4 text-slate-500" />;

                if (isLomba) {
                  accentBorder = 'border-red-300 ring-1 ring-red-500/10';
                  badgeColor = 'bg-red-50 text-red-700 border-red-200';
                  iconComponent = <Swords className="w-4 h-4 text-red-600" />;
                } else if (isIshoma) {
                  accentBorder = 'border-amber-300';
                  badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
                  iconComponent = <Coffee className="w-4 h-4 text-amber-600" />;
                } else if (isUpacara) {
                  accentBorder = 'border-blue-300';
                  badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
                  iconComponent = <Flag className="w-4 h-4 text-blue-600" />;
                } else if (isPleno) {
                  accentBorder = 'border-indigo-300';
                  badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                  iconComponent = <Users className="w-4 h-4 text-indigo-600" />;
                } else if (isAward) {
                  accentBorder = 'border-emerald-300 ring-1 ring-emerald-500/10';
                  badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                  iconComponent = <Trophy className="w-4 h-4 text-emerald-600" />;
                }

                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl border ${accentBorder} p-5 sm:p-6 transition-all hover:shadow-md group`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          {iconComponent}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                              Tahap #{idx + 1}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeColor}`}>
                              Durasi: {item.duration}
                            </span>
                          </div>
                          <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                            {item.agenda}
                          </h4>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0 bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border sm:border-0 border-slate-100">
                        <div className="text-sm sm:text-base font-black text-slate-900 font-mono">
                          {item.time} WIB
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-0 sm:pl-12 mb-3">
                      {item.desc}
                    </p>

                    <div className="flex items-center gap-2 pl-0 sm:pl-12 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <strong className="text-slate-700">Lokasi:</strong>
                      <span className="font-medium text-slate-600">{item.location}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: RUNDOWN TECHNICAL MEETING (Sabtu, 9 Jan 2027)
            ======================================================== */}
        {(activeTab === 'tm' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
          <div className="space-y-6">

            {/* Venue & Meta Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black uppercase tracking-wider">
                    Bagian A
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase">
                    Rundown Technical Meeting (TM) Peserta
                  </h3>
                </div>
                <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    <strong>Sabtu, 9 Januari 2027</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <strong>12.30 – 16.30 WIB</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Aula Kampus Induk Mu’allimin Wirobrajan (Jl. Letjen S. Parman No. 68)</span>
                  </span>
                </p>
              </div>

              <div className="print:hidden">
                <a
                  href={VENUE_INDUK.MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-200 transition-all flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Rute Google Maps Wirobrajan</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>

            {/* Protocol Card for TM */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 print:hidden">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong className="block font-bold mb-0.5">Ketentuan Delegasi TM:</strong>
                Setiap sekolah wajib mengirimkan perwakilan resmi (maksimal 2 orang: Pelatih/Official/Danton). Wajib membawa berkas fisik asli berstempel basah: Surat Rekomendasi/Tugas Kepala Sekolah asli & Pakta Integritas bermaterai Rp 10.000 untuk diverifikasi oleh Divisi Kesekretariatan.
              </div>
            </div>

            {/* TM TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-3.5 text-center w-12">No</th>
                      <th className="py-3 px-3.5 w-36">Waktu (WIB)</th>
                      <th className="py-3 px-3 w-16 text-center">Durasi</th>
                      <th className="py-3 px-4 w-72">Agenda Kegiatan</th>
                      <th className="py-3 px-4">Deskripsi Operasional / Penanggung Jawab</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredTmItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3.5 text-center font-bold text-slate-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-3.5 font-bold font-mono text-slate-900 whitespace-nowrap">
                          {item.time} WIB
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono font-semibold text-amber-800">
                          {item.duration}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {item.agenda}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 leading-relaxed text-[11px]">
                          {item.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: RUNDOWN UJI COBA LAPANGAN (Sabtu, 16 Jan 2027)
            ======================================================== */}
        {(activeTab === 'trial' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
          <div className="space-y-6">

            {/* Venue & Meta Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-black uppercase tracking-wider">
                    Bagian B
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase">
                    Rundown Uji Coba Lapangan (Orientasi Medan)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    <strong>Sabtu, 16 Januari 2027</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <strong>06.30 – 12.00 WIB</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Kampus Terpadu Mu’allimin Sedayu, Bantul</span>
                  </span>
                </p>
              </div>

              <div className="print:hidden">
                <a
                  href={VENUE.MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold rounded-xl border border-teal-200 transition-all flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>Rute Google Maps Sedayu</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>

            {/* Explanatory Banner for 2 Parallel Arenas */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900 leading-relaxed space-y-1">
              <div className="font-bold flex items-center gap-2 text-teal-950">
                <Compass className="w-4 h-4 text-teal-700" />
                <span>Simulasi Berjalan Paralel di 2 Arena:</span>
              </div>
              <p>
                <strong>Catatan Resmi:</strong> Berjalan paralel di 2 arena (<strong>Arena 1 Lapangan Basket</strong> untuk SD/MI; <strong>Arena 2 Pelataran Embung</strong> untuk SMP/MTs). Setiap peleton dialokasikan waktu total <strong>15 menit</strong> (orientasi bersih sesuai durasi lomba: 8 menit SD, 12 menit SMP + 5 menit transisi peleton).
              </p>
            </div>

            {/* TRIAL PARALLEL TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-3.5 text-center w-12">No</th>
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
                    {filteredTrialItems.map((slot, idx) => {
                      const isSpecial = idx === 0 || idx === filteredTrialItems.length - 1;
                      const rowBg = isSpecial ? 'bg-slate-50 font-bold' : 'hover:bg-slate-50/80';

                      return (
                        <tr key={idx} className={`${rowBg} transition-colors`}>
                          <td className="py-3 px-3.5 text-center font-mono text-slate-400">
                            {idx === 0 ? '-' : idx === filteredTrialItems.length - 1 ? '-' : idx}
                          </td>
                          <td className="py-3 px-4 font-bold font-mono text-slate-900 whitespace-nowrap">
                            {slot.time} WIB
                          </td>
                          <td className="py-3 px-4 border-r border-slate-100">
                            <span className={`inline-flex items-center gap-1.5 ${isSpecial ? 'text-slate-800' : 'text-red-700 font-semibold'}`}>
                              {!isSpecial && <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />}
                              <span>{slot.arena1}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1.5 ${isSpecial ? 'text-slate-800' : 'text-blue-700 font-semibold'}`}>
                              {!isSpecial && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                              <span>{slot.arena2}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PRINT ONLY: TANDA TANGAN PENGESAHAN */}
        <div className="hidden print:block pt-8 text-xs text-slate-800 font-sans">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[11px] text-slate-500">
                Dokumen sah panitia LBB Mu'allimin 2027.<br />
                Dicetak pada: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="text-center w-60">
              <p>Yogyakarta, 1 September 2026</p>
              <p className="font-bold mt-1">Ketua Panitia Pelaksana LBB 2027,</p>
              <div className="h-20 flex items-center justify-center text-slate-400 text-[10px]">
                (Cap Stempel & Tanda Tangan)
              </div>
              <p className="font-black underline text-slate-900">Falhan Zuhdi Mubarok</p>
              <p className="text-[10px] text-slate-500">NIM/NBM. Panitia LBB Mu'allimin 2027</p>
            </div>
          </div>
        </div>

      </main>

      {/* FOOTER (Web Only) */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 print:hidden mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2027 Madrasah Mu'allimin Muhammadiyah Yogyakarta • Panitia Pelaksana LBB 2027</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveView('juknis')}
              className="text-slate-600 hover:text-red-700 font-semibold underline cursor-pointer"
            >
              Lihat Juknis Lengkap
            </button>
            <button
              type="button"
              onClick={() => setActiveView('landing')}
              className="text-slate-600 hover:text-red-700 font-semibold underline cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
