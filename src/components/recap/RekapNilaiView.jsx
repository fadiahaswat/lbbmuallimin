import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Download,
  Search,
  ShieldCheck,
  Eye,
  Lock,
  Unlock,
  Award,
  Trophy,
  Filter,
  Check,
  X,
  FileCheck2,
  CalendarCheck,
  Sparkles
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { SITE, EVENT } from '../../config.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function RekapNilaiView() {
  const {
    teams,
    scores,
    verifyScore,
    finalizeScore,
    currentUser,
    role,
    settings,
    updateSettings,
    exportTeamsCSV
  } = useCompetition();

  const userRole = currentUser?.role || role || 'publik';

  // Petugas Check-In dan Petugas DP TIDAK MEMILIKI AKSES ke Rekap Nilai!
  const isPenginput = userRole === 'penginput' || userRole === 'superadmin';
  const isVerifikator = userRole === 'verifikator' || userRole === 'superadmin';
  const isFinalisator = userRole === 'finalisator' || userRole === 'superadmin';

  const [selectedJenjang, setSelectedJenjang] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamScore, setSelectedTeamScore] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoModalUrl, setPhotoModalUrl] = useState('');

  // Eligible teams (drawn or verified)
  const competitionTeams = teams.filter(t => ['verified', 'drawn'].includes(t.status) || t.lotNumber);

  const filteredTeams = competitionTeams.filter(team => {
    const matchesJenjang = selectedJenjang === 'ALL' || team.jenjang === selectedJenjang;
    const matchesSearch =
      team.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.regCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.dantonName && team.dantonName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesJenjang && matchesSearch;
  });

  // Calculate ranks
  const calculateFinalTotal = (teamId) => {
    const sc = scores[teamId];
    if (!sc) return 0;
    const pbb = Number(sc.pbbTotal || sc.categories?.pbb || sc.pbb?.total || 0);
    const danton = Number(sc.dantonTotal || sc.categories?.danton || sc.danton?.total || 0);
    const penalty = Number(sc.penaltiesTotal || sc.penalty || sc.penalties?.totalPenalty || 0);
    return Math.max(0, pbb + danton - penalty);
  };

  const rankedTeams = [...filteredTeams].sort((a, b) => {
    const totalA = calculateFinalTotal(a.id);
    const totalB = calculateFinalTotal(b.id);
    return totalB - totalA;
  });

  // Stats
  const scoredCount = competitionTeams.filter(t => scores[t.id]).length;
  const verifiedCount = competitionTeams.filter(t => scores[t.id]?.isVerified).length;
  const finalizedCount = competitionTeams.filter(t => scores[t.id]?.isLocked).length;

  const handleVerify = (teamId) => {
    if (!isVerifikator) return;
    verifyScore(teamId, currentUser?.name || 'Verifikator');
    alert(`Nilai peleton berhasil diverifikasi & disetujui!`);
  };

  const handleFinalize = (teamId) => {
    if (!isFinalisator) return;
    finalizeScore(teamId, currentUser?.name || 'Finalisator');
    alert(`Nilai peleton berhasil dikunci (Finalized)!`);
  };

  const handlePrintBeritaAcara = () => {
    window.print();
  };

  const handleTogglePublishLeaderboard = () => {
    if (!isFinalisator) return;
    const current = settings?.announcementPublished;
    updateSettings({ announcementPublished: !current });
    alert(current ? 'Klasemen publik resmi ditutup kembali.' : 'Klasemen resmi berhasil DIPUBLIKASIKAN untuk publik!');
  };

  return (
    <SimpaskorSidebarLayout
      activeMenu="rekap_nilai"
      title="Rekapitulasi Nilai & Scrutineering"
      subtitle="Verifikasi silang bukti fisik blangko juri, kalkulasi penalti, penguncian skor, & berita acara resmi"
      rightActions={
        <div className="flex items-center gap-2">
          {isFinalisator && (
            <button
              onClick={handleTogglePublishLeaderboard}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                settings?.announcementPublished
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{settings?.announcementPublished ? 'Tutup Publikasi' : 'Buka Publikasi Klasemen'}</span>
            </button>
          )}

          <button
            onClick={handlePrintBeritaAcara}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Cetak Berita Acara Rekapitulasi Dewan Juri"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak Berita Acara</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">

        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/40 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Tahap 7: Scrutineering & Berita Acara</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Rekapitulasi Nilai & Penetapan Juara
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Alur pengesahan nilai 3 pintu: Penginputan skor blangko fisik kertas, verifikasi silang foto autentik oleh Verifikator, serta penguncian nilai mutlak oleh Finalisator Dewan Juri.
              </p>
            </div>

            {/* Scrutineer Progress Counters */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center min-w-[95px]">
                <span className="text-[10px] uppercase font-bold text-amber-300 block">1. Terinput</span>
                <span className="text-2xl font-black text-white font-mono">{scoredCount}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center min-w-[95px]">
                <span className="text-[10px] uppercase font-bold text-blue-300 block">2. Terverifikasi</span>
                <span className="text-2xl font-black text-blue-300 font-mono">{verifiedCount}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center min-w-[95px]">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">3. Terkunci</span>
                <span className="text-2xl font-black text-emerald-300 font-mono">{finalizedCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {[
                { id: 'ALL', label: 'Semua Jenjang' },
                { id: 'SD', label: 'SD / MI' },
                { id: 'SMP', label: 'SMP / MTs' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedJenjang(f.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedJenjang === f.id ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari sekolah atau danton..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
              />
            </div>
          </div>

          {/* Table of Scored Teams */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">No</th>
                  <th className="py-3 px-3">Nomor Tampil</th>
                  <th className="py-3 px-3">Nama Sekolah</th>
                  <th className="py-3 px-3 text-right">PBB Peleton</th>
                  <th className="py-3 px-3 text-right">Danton</th>
                  <th className="py-3 px-3 text-right">Penalti</th>
                  <th className="py-3 px-3 text-right font-black text-slate-900">Total Bersih</th>
                  <th className="py-3 px-3 text-center">Status Scrutineer</th>
                  <th className="py-3 px-3 text-right">Aksi Validasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rankedTeams.map((team, idx) => {
                  const sc = scores[team.id];
                  const hasScore = Boolean(sc);
                  const pbb = sc?.pbbTotal || sc?.categories?.pbb || sc?.pbb?.total || 0;
                  const danton = sc?.dantonTotal || sc?.categories?.danton || sc?.danton?.total || 0;
                  const penalty = sc?.penaltiesTotal || sc?.penalty || sc?.penalties?.totalPenalty || 0;
                  const totalFinal = calculateFinalTotal(team.id);

                  const isVerified = Boolean(sc?.isVerified);
                  const isLocked = Boolean(sc?.isLocked);

                  return (
                    <tr key={team.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-400">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-mono font-black text-xs flex items-center justify-center">
                          {team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '-'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{team.schoolName}</div>
                        <div className="text-[10px] text-slate-400">{team.jenjang} • Danton: {team.dantonName || '-'}</div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-700">
                        {hasScore ? pbb : '-'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-700">
                        {hasScore ? danton : '-'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-rose-600">
                        {penalty > 0 ? `-${penalty}` : '0'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-black text-sm text-slate-900">
                        {hasScore ? totalFinal : '-'}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <Lock className="w-3 h-3" />
                            Final (Terkunci)
                          </span>
                        ) : isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Terverifikasi
                          </span>
                        ) : hasScore ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            Draft Input
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            Belum Dinilai
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* Bukti Foto Blangko */}
                          {sc?.photoUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setPhotoModalUrl(sc.photoUrl);
                                setIsPhotoModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                              title="Lihat Foto Blangko Fisik Juri"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Tombol Verifikasi (Hanya Verifikator) */}
                          {isVerifikator && hasScore && !isVerified && (
                            <button
                              type="button"
                              onClick={() => handleVerify(team.id)}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded-lg transition-all"
                            >
                              ACC Verifikasi
                            </button>
                          )}

                          {/* Tombol Finalisasi (Hanya Finalisator) */}
                          {isFinalisator && isVerified && !isLocked && (
                            <button
                              type="button"
                              onClick={() => handleFinalize(team.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg transition-all"
                            >
                              Kunci Skor
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Preview Foto Blangko Fisik */}
        {isPhotoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-sm font-black text-slate-900 uppercase">Bukti Fisik Blangko Dewan Juri</h4>
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-auto rounded-2xl bg-slate-100 flex items-center justify-center">
                <img src={photoModalUrl} alt="Blangko Juri" className="w-full h-auto object-contain" />
              </div>
            </div>
          </div>
        )}

      </div>
    </SimpaskorSidebarLayout>
  );
}
