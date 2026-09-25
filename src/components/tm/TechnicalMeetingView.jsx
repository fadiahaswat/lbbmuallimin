import React, { useState } from 'react';
import {
  Shuffle,
  CalendarCheck,
  Trophy,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  FileSpreadsheet,
  Download,
  Search,
  ExternalLink,
  Shield,
  Crown,
  FileText,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { EVENT, VENUE_INDUK, DOWNLOADS } from '../../config.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function TechnicalMeetingView() {
  const {
    teams,
    assignLotNumber,
    randomizeLotNumbers,
    currentUser,
    role,
    setActiveView
  } = useCompetition();

  const userRole = currentUser?.role || role || 'publik';
  const canManageLottery = ['admin', 'superadmin'].includes(userRole);

  const [selectedJenjang, setSelectedJenjang] = useState('SD');
  const [searchQuery, setSearchQuery] = useState('');
  const [lotSuccessMsg, setLotSuccessMsg] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spunTeam, setSpunTeam] = useState(null);

  // Teams eligible for TM (terdaftar & terverifikasi)
  const eligibleTeams = teams.filter(t => ['registered', 'verified', 'drawn'].includes(t.status));
  const currentJenjangTeams = eligibleTeams.filter(t => t.jenjang === selectedJenjang);

  const filteredTeams = currentJenjangTeams.filter(t =>
    t.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.regCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.dantonName && t.dantonName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort by lotNumber if available
  const sortedTeams = [...filteredTeams].sort((a, b) => {
    if (a.lotNumber && b.lotNumber) return a.lotNumber - b.lotNumber;
    if (a.lotNumber) return -1;
    if (b.lotNumber) return 1;
    return a.schoolName.localeCompare(b.schoolName);
  });

  const drawnCount = currentJenjangTeams.filter(t => t.lotNumber).length;
  const totalCount = currentJenjangTeams.length;

  const handleRandomize = () => {
    if (!canManageLottery) return;
    if (window.confirm(`Kocok undian nomor tampil untuk seluruh peleton ${selectedJenjang}? Nomor tampil yang sudah ada akan diacak ulang.`)) {
      setIsSpinning(true);
      setTimeout(() => {
        const count = randomizeLotNumbers(selectedJenjang);
        setIsSpinning(false);
        setLotSuccessMsg(`Berhasil mengocok ${count} nomor undian tampil untuk ${selectedJenjang}!`);
        setTimeout(() => setLotSuccessMsg(''), 4000);
      }, 800);
    }
  };

  const handleSingleLotAssign = (teamId, lot) => {
    if (!canManageLottery) return;
    const num = parseInt(lot, 10);
    if (!isNaN(num) && num > 0) {
      assignLotNumber(teamId, num);
    }
  };

  const handlePrintBeritaAcaraTM = () => {
    window.print();
  };

  return (
    <SimpaskorSidebarLayout
      activeMenu="tm"
      title="Technical Meeting & Undian Tampil"
      subtitle="Manajemen pengundian nomor urut tampil peleton & berita acara TM resmi"
      rightActions={
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintBeritaAcaraTM}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Cetak Berita Acara Hasil Pengundian TM"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak Berita Acara</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">

        {/* Top Info Banner TM */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-900/40 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-black uppercase tracking-wider">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Tahap 2: Pertemuan Teknis & Undian</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Technical Meeting & Pengundian Nomor Tampil
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Penetapan nomor dada, urutan tampil arena, validasi fisik berkas, serta pengesahan kesepakatan tata tertib lomba LBB Mu'allimin 2027.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 shrink-0 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Clock className="w-4 h-4" />
                <span>{EVENT.TECHNICAL_MEETING_FULL_DATE} • {EVENT.TECHNICAL_MEETING_TIME_RANGE}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate max-w-[220px]">{VENUE_INDUK.NAME}</span>
              </div>
              <a
                href={EVENT.TECHNICAL_MEETING_MAPS_URL || "https://maps.app.goo.gl/8tSQHpribqPXTSA79"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-300 hover:text-white underline pt-1"
              >
                <span>Buka Petunjuk Rute Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {lotSuccessMsg && (
          <div className="bg-emerald-600 text-white p-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{lotSuccessMsg}</span>
          </div>
        )}

        {/* Jenjang Selector & Lottery Control Panel */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            {/* Tab SD vs SMP */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
              <button
                type="button"
                onClick={() => setSelectedJenjang('SD')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedJenjang === 'SD'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tingkat SD / MI ({eligibleTeams.filter(t => t.jenjang === 'SD').length} Peleton)
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
                Tingkat SMP / MTs ({eligibleTeams.filter(t => t.jenjang === 'SMP').length} Peleton)
              </button>
            </div>

            {/* Lottery Action Button (Only Admin/Superadmin) */}
            {canManageLottery ? (
              <button
                type="button"
                onClick={handleRandomize}
                disabled={isSpinning || totalCount === 0}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md shadow-purple-600/30 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Shuffle className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>Kocok Undian {selectedJenjang} Otomatis</span>
              </button>
            ) : (
              <span className="text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-xl">
                Mode Pantau Undian (Read-Only)
              </span>
            )}
          </div>

          {/* Progress Status Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Peleton Lolos</span>
              <span className="text-2xl font-black text-slate-900 font-mono">{totalCount} Tim</span>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
              <span className="text-[10px] uppercase font-bold text-purple-700 block">Sudah Dapat Nomor</span>
              <span className="text-2xl font-black text-purple-900 font-mono">{drawnCount} Tim</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Status Pengundian</span>
              <span className="text-sm font-black text-emerald-900 block mt-1">
                {drawnCount === totalCount && totalCount > 0 ? 'Lengkap & Sah' : 'Menunggu Pengundian'}
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari sekolah, nama komandan (danton), atau kode pendaftaran..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-purple-600 outline-none transition-all"
            />
          </div>

          {/* Table List of Teams & Lot Numbers */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Nomor Tampil</th>
                  <th className="py-3 px-3">Nama Sekolah</th>
                  <th className="py-3 px-3">Kode Peleton</th>
                  <th className="py-3 px-3">Komandan (Danton)</th>
                  <th className="py-3 px-3">Estimasi Tampil</th>
                  {canManageLottery && <th className="py-3 px-3 text-right">Aksi Undian Manual</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedTeams.map((team, idx) => {
                  const estHour = selectedJenjang === 'SD' ? 8 : 10;
                  const estMin = (team.lotNumber ? team.lotNumber - 1 : idx) * (selectedJenjang === 'SD' ? 12 : 15);
                  const totalM = estHour * 60 + estMin;
                  const timeStr = `${String(Math.floor(totalM / 60)).padStart(2, '0')}.${String(totalM % 60).padStart(2, '0')} WIB`;

                  return (
                    <tr key={team.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="py-3.5 px-3">
                        {team.lotNumber ? (
                          <span className="w-9 h-9 rounded-xl bg-purple-600 text-white font-mono font-black text-sm flex items-center justify-center shadow-md shadow-purple-600/30">
                            {String(team.lotNumber).padStart(2, '0')}
                          </span>
                        ) : (
                          <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 font-mono font-bold text-xs flex items-center justify-center border border-dashed border-slate-300">
                            -
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">{team.schoolName}</div>
                        <div className="text-[10px] text-slate-400">Pembina: {team.coachName || '-'}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-500">
                        {team.regCode}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-800">{team.dantonName || '-'}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg">
                          <Clock className="w-3 h-3 text-indigo-500" />
                          {team.lotNumber ? timeStr : 'Menunggu Undian'}
                        </span>
                      </td>
                      {canManageLottery && (
                        <td className="py-3.5 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <input
                              type="number"
                              min="1"
                              max="36"
                              defaultValue={team.lotNumber || ''}
                              onBlur={e => handleSingleLotAssign(team.id, e.target.value)}
                              placeholder="No"
                              className="w-14 px-2 py-1 text-center font-mono font-bold text-xs border border-slate-200 rounded-lg focus:border-purple-600 outline-none"
                            />
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Berkas & Regulasi Hasil TM */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase">
                Dokumen Hasil Kesepakatan Technical Meeting
              </h3>
              <p className="text-xs text-slate-500">
                Dokumen resmi yang disepakati oleh seluruh perwakilan pembina dan official kontingen
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {DOWNLOADS.map(doc => (
              <a
                key={doc.id}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-purple-700 font-bold shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                      {doc.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{doc.size}</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </SimpaskorSidebarLayout>
  );
}
