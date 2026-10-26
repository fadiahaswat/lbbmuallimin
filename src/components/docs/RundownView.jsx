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
  Building2,
  FileText,
  ExternalLink,
  ChevronRight,
  Download,
  Info,
  CalendarCheck,
  Compass,
  Swords,
  Trophy,
  Coffee,
  Flag,
  Share2
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { SITE, EVENT, VENUE, VENUE_INDUK, DOWNLOADS } from '../../config.js';
import { RUNDOWN_DATA } from '../../data/juknisDocsData.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function RundownView() {
  const { setActiveView } = useCompetition();

  // Tab: 'competition' (Hari-H) | 'tm' (Technical Meeting) | 'trial' (Uji Coba Lapangan)
  const [activeTab, setActiveTab] = useState('competition');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSession, setFilterSession] = useState('all'); // for Hari-H: 'all' | 'pagi' | 'siang' | 'upacara'

  const handlePrint = () => {
    window.print();
  };

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
    <SimpaskorSidebarLayout
      activeMenu="rundown"
      title="Rundown Resmi Kegiatan LBB Mu'allimin 2027"
      subtitle="Jadwal definitif kronologis: Hari-H Perlombaan (24 Jan), Technical Meeting (9 Jan), dan Uji Coba Lapangan 2 Arena (16 Jan)"
      rightActions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            title="Cetak atau Simpan sebagai PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
          <a
            href={DOWNLOADS[0]?.url || "https://docs.google.com/document/d/1BN1RuwDcEiuibVvoBG4-5R7Rq8neV5st3nAZoISVQi0/edit?usp=sharing"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline">Google Docs</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      }
    >
      <div className="space-y-6">

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

        {/* ========================================================
            TAB SELECTOR & SEARCH BAR (Web Only)
            Clean, authoritative segmented control
            ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2.5 shadow-xs print:hidden space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* 3 Main Segmented Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-xl w-full md:w-auto">
              {/* Tab 1: Hari-H */}
              <button
                type="button"
                onClick={() => setActiveTab('competition')}
                className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  activeTab === 'competition'
                    ? 'bg-red-700 text-white shadow-sm font-black'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Swords className="w-3.5 h-3.5 shrink-0" />
                <span>Hari-H Perlombaan (24 Jan)</span>
              </button>

              {/* Tab 2: TM */}
              <button
                type="button"
                onClick={() => setActiveTab('tm')}
                className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  activeTab === 'tm'
                    ? 'bg-amber-600 text-white shadow-sm font-black'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Technical Meeting (9 Jan)</span>
              </button>

              {/* Tab 3: Uji Coba */}
              <button
                type="button"
                onClick={() => setActiveTab('trial')}
                className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  activeTab === 'trial'
                    ? 'bg-teal-700 text-white shadow-sm font-black'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>Uji Coba Lapangan (16 Jan)</span>
              </button>
            </div>

            {/* Live Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari agenda, waktu, atau lokasi..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-red-600 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-[10px] text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================
            TAB 1: RUNDOWN HARI-H PERLOMBAAN (Ahad, 24 Jan 2027)
            ======================================================== */}
        {(activeTab === 'competition' || (typeof window !== 'undefined' && window.matchMedia('print').matches)) && (
          <div className="space-y-4">

            {/* Document Metadata Strip */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px] uppercase tracking-wider">
                    Bagian C Juknis
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase">
                    Rundown Hari-H Perlombaan LBB Mu'allimin 2027
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-slate-900">
                    <CalendarDays className="w-3.5 h-3.5 text-red-700" />
                    <span>Ahad, 24 Januari 2027</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>06.00 WIB s.d. Selesai</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{VENUE.NAME} (Arena 1 & Arena 2)</span>
                  </span>
                </div>
              </div>

              {/* Sesi Filter Pill */}
              <div className="flex flex-wrap items-center gap-1.5 print:hidden">
                {[
                  { id: 'all', label: 'Semua (13 Sesi)' },
                  { id: 'pagi', label: 'Sesi I (Pagi)' },
                  { id: 'siang', label: 'Sesi II (Siang)' },
                  { id: 'upacara', label: 'Protokoler' },
                ].map(filter => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setFilterSession(filter.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      filterSession === filter.id
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* OFFICIAL TABLE HARI-H */}
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
                          <td className="py-3 px-3 text-center font-bold text-slate-400 font-mono">
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
                              <span>{item.agenda}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 leading-relaxed text-[11px]">
                            {item.desc}
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-medium text-[11px]">
                            <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
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

            {/* OFFICIAL FOOTNOTES / CATATAN KHUSUS HARI-H */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Info className="w-4 h-4 text-slate-700" />
                <span>Catatan Operasional Hari-H Perlombaan:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px] leading-relaxed">
                <li>
                  <strong>Peleton Wajib Upacara Pembukaan:</strong> Peleton dengan nomor urut tampil <strong>6 s.d. 10</strong> (SD-131 s.d. SD-139 dan SMP-242 s.d. SMP-260) wajib berada di Lapangan Mini Soccer pukul <strong>06.45 WIB</strong> dengan seragam lomba lengkap. Peleton yang tidak hadir dikenai penalti <strong>-150 poin</strong>.
                </li>
                <li>
                  <strong>Simultan 2 Arena Paralel:</strong> Perlombaan berjalan serentak di <strong>Arena 1</strong> (Lapangan Basket, SD/MI) dan <strong>Arena 2</strong> (Pelataran Embung, SMP/MTs). Sesi I bergulir pukul 08.00–11.30 WIB dan Sesi II pukul 12.30–13.30 WIB.
                </li>
                <li>
                  <strong>Sidang Pleno, Masa Sanggah & Checkout:</strong> Masa sanggah administratif, checkout basecamp, dan sidang pleno dewan juri berlangsung pukul <strong>13.30–15.00 WIB</strong>.
                </li>
                <li>
                  <strong>Standby & Apel Penutupan:</strong> Standby barisan dimulai pukul <strong>15.45 WIB</strong> dan Apel Penutupan pukul <strong>16.00 WIB</strong>, wajib dihadiri oleh <strong>1 Danton + 4 Anggota</strong> per peleton dengan seragam perlombaan lengkap.
                </li>
              </ul>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 2: RUNDOWN TECHNICAL MEETING (Sabtu, 9 Jan 2027)
            ======================================================== */}
        {(activeTab === 'tm' || (typeof window !== 'undefined' && window.matchMedia('print').matches)) && (
          <div className="space-y-4">

            {/* Document Metadata Strip */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px] uppercase tracking-wider">
                    Bagian A Juknis
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase">
                    Rundown Technical Meeting (TM) Peserta
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-slate-900">
                    <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
                    <span>Sabtu, 9 Januari 2027</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>12.30 – 16.30 WIB</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Aula Kampus Induk Madrasah Mu’allimin Wirobrajan (Jl. Letjen S. Parman No. 68)</span>
                  </span>
                </div>
              </div>

              <div className="print:hidden">
                <a
                  href={VENUE_INDUK.MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-200 transition-all flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Google Maps Wirobrajan</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>

            {/* OFFICIAL TABLE TM */}
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
                    {filteredTmItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-3 text-center font-bold text-slate-400 font-mono">
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

            {/* OFFICIAL FOOTNOTES TM */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Info className="w-4 h-4 text-slate-700" />
                <span>Ketentuan Delegasi Technical Meeting:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px] leading-relaxed">
                <li>
                  Setiap sekolah/madrasah wajib mengirimkan perwakilan resmi (maksimal 2 orang: Pelatih/Official/Danton).
                </li>
                <li>
                  Wajib membawa dan menyerahkan berkas fisik asli: <strong>Surat Rekomendasi/Tugas Kepala Sekolah asli</strong> (berstempel basah) dan <strong>Pakta Integritas</strong> kepada Divisi Kesekretariatan.
                </li>
                <li>
                  Agenda mencakup lotting pengundian nomor urut tampil, penjelasan teknis dewan juri, tata tertib basecamp, dan pembagian ID card resmi kontingen.
                </li>
              </ul>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 3: RUNDOWN UJI COBA LAPANGAN (Sabtu, 16 Jan 2027)
            ======================================================== */}
        {(activeTab === 'trial' || (typeof window !== 'undefined' && window.matchMedia('print').matches)) && (
          <div className="space-y-4">

            {/* Document Metadata Strip */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold text-[10px] uppercase tracking-wider">
                    Bagian B Juknis
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase">
                    Rundown Uji Coba Lapangan (Orientasi Medan)
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-slate-900">
                    <CalendarDays className="w-3.5 h-3.5 text-teal-700" />
                    <span>Sabtu, 16 Januari 2027</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>06.30 – 12.00 WIB</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{VENUE.NAME} (2 Arena Simultan)</span>
                  </span>
                </div>
              </div>

              <div className="print:hidden">
                <a
                  href={VENUE.MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold rounded-xl border border-teal-200 transition-all flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>Google Maps Sedayu</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>

            {/* OFFICIAL PARALLEL TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-3 text-center w-12">No</th>
                      <th className="py-3 px-4 w-36">Waktu (WIB)</th>
                      <th className="py-3 px-4 w-1/2 bg-red-900 text-red-100 border-r border-slate-800">
                        Arena 1 (SD/MI - Lapangan Basket)
                      </th>
                      <th className="py-3 px-4 w-1/2 bg-blue-900 text-blue-100">
                        Arena 2 (SMP/MTs - Pelataran Embung)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredTrialItems.map((slot, idx) => {
                      const isSpecial = idx === 0 || idx === filteredTrialItems.length - 1;
                      const rowBg = isSpecial ? 'bg-slate-50 font-bold' : 'hover:bg-slate-50';

                      return (
                        <tr key={idx} className={`${rowBg} transition-colors`}>
                          <td className="py-3 px-3 text-center font-mono text-slate-400">
                            {idx === 0 ? '-' : idx === filteredTrialItems.length - 1 ? '-' : idx}
                          </td>
                          <td className="py-3 px-4 font-bold font-mono text-slate-900 whitespace-nowrap">
                            {slot.time} WIB
                          </td>
                          <td className="py-3 px-4 border-r border-slate-100">
                            <span className={`inline-flex items-center gap-1.5 ${isSpecial ? 'text-slate-800' : 'text-red-700 font-semibold'}`}>
                              {!isSpecial && <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />}
                              <span>{slot.arena1}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1.5 ${isSpecial ? 'text-slate-800' : 'text-blue-700 font-semibold'}`}>
                              {!isSpecial && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />}
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

            {/* OFFICIAL FOOTNOTES UJI COBA */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Info className="w-4 h-4 text-slate-700" />
                <span>Petunjuk Teknis Uji Coba Lapangan:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px] leading-relaxed">
                <li>
                  Uji coba diselenggarakan serentak di 2 arena paralel di Kampus Terpadu Sedayu.
                </li>
                <li>
                  Tiap slot dialokasikan total waktu <strong>15 menit</strong> kotor (orientasi bersih lapangan sesuai durasi perlombaan: <strong>8 menit</strong> untuk SD/MI dan <strong>12 menit</strong> untuk SMP/MTs, ditambah 5 menit transisi peleton).
                </li>
                <li>
                  Peleton wajib hadir di lokasi minimal 30 menit sebelum slot waktu uji coba yang ditentukan.
                </li>
              </ul>
            </div>

          </div>
        )}

        {/* PRINT ONLY: PENGESAHAN DOKUMEN */}
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

      </div>
    </SimpaskorSidebarLayout>
  );
}
