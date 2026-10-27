import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Sparkles,
  Maximize2,
  Minimize2,
  Filter,
  Search,
  ArrowLeft,
  Heart,
  TrendingUp,
  Share2,
  Lock,
  Shield
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { SITE, TIMELINE, VENUE } from '../../config.js';
import logoImg from '../../assets/logo-tonti.png';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function LiveLeaderboard() {
  const { teams, scores, role, settings, setActiveView } = useCompetition();
  const [selectedJenjang, setSelectedJenjang] = useState('ALL'); // 'ALL' | 'SD' | 'SMP'
  const isStaffOrJury = ['admin', 'juri', 'superadmin', 'penginput', 'verifikator', 'finalisator'].includes(role);
  const isOfficialScoreVisible = isStaffOrJury || Boolean(settings?.announcementPublished);
  const [isStageMode, setIsStageMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Verified & drawn teams
  const verifiedTeams = teams.filter(t => t.status === 'verified' || t.status === 'drawn');

  // Filter by jenjang and search
  const filteredTeams = verifiedTeams.filter(t => {
    const matchJenjang = selectedJenjang === 'ALL' || t.jenjang === selectedJenjang;
    const matchSearch =
      (t.schoolName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.platoonName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchJenjang && matchSearch;
  });

  // Calculate official ranked teams with tie-breaker criteria (Bab A.5: Nilai Akhir Peleton -> Nilai Murni Peleton -> Penalti Peleton -> Nilai Murni Danton)
  const rankedOfficialTeams = [...filteredTeams].map(team => {
    const s = scores[team.id];
    const juries = s?.juries || {};
    const j1Peleton = Number(juries.pos1?.peletonTotal ?? juries.pos1?.total ?? s?.pbb?.j1 ?? 0);
    const j2Peleton = Number(juries.pos2?.peletonTotal ?? juries.pos2?.total ?? s?.pbb?.j2 ?? 0);
    const j3Peleton = Number(juries.pos3?.peletonTotal ?? s?.pbb?.j3 ?? 0);
    const nilaiMurniPeleton = Number(s?.nilaiMurniPeleton ?? ((j1Peleton + j2Peleton + j3Peleton) || Number(s?.pbb?.total || 0)));

    const j1Danton = Number(juries.pos1?.dantonTotal ?? 0);
    const j2Danton = Number(juries.pos2?.dantonTotal ?? 0);
    const j3Danton = Number(juries.pos3?.dantonTotal ?? juries.pos3?.total ?? s?.danton?.total ?? 0);
    const nilaiMurniDanton = Number(s?.nilaiMurniDanton ?? parseFloat((j1Danton + j2Danton + j3Danton).toFixed(2)));

    const peletonPenalty = Number(s?.penalties?.peletonPenalty ?? s?.penalties?.totalPenalty ?? 0);
    const dantonPenalty = Number(s?.penalties?.dantonPenalty ?? 0);
    const penaltyTotal = Number(s?.penalties?.totalPenalty ?? (peletonPenalty + dantonPenalty));

    const nilaiAkhirPeleton = Number(s?.nilaiAkhirPeleton ?? Math.max(0, parseFloat((nilaiMurniPeleton - peletonPenalty).toFixed(2))));
    const nilaiAkhirDanton = Number(s?.nilaiAkhirDanton ?? Math.max(0, parseFloat((nilaiMurniDanton - dantonPenalty).toFixed(2))));
    const finalScore = Number(s?.finalScore ?? parseFloat((nilaiAkhirPeleton + nilaiAkhirDanton).toFixed(2)));

    return {
      team,
      scoreData: s,
      j1Peleton,
      j2Peleton,
      j3Peleton,
      nilaiMurniPeleton,
      nilaiAkhirPeleton,
      nilaiMurniDanton,
      nilaiAkhirDanton,
      peletonPenalty,
      dantonPenalty,
      finalScore,
      pbbScore: nilaiAkhirPeleton,
      dantonScore: nilaiAkhirDanton,
      penaltyTotal,
      hasScore: Boolean(s),
    };
  }).sort((a, b) => {
    if (b.nilaiAkhirPeleton !== a.nilaiAkhirPeleton) return b.nilaiAkhirPeleton - a.nilaiAkhirPeleton;
    if (b.nilaiMurniPeleton !== a.nilaiMurniPeleton) return b.nilaiMurniPeleton - a.nilaiMurniPeleton;
    if (a.peletonPenalty !== b.peletonPenalty) return a.peletonPenalty - b.peletonPenalty;
    return b.nilaiMurniDanton - a.nilaiMurniDanton;
  });

  // Toggle fullscreen mode
  function toggleStageMode() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsStageMode(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsStageMode(false);
    }
  }

  const content = (
    <div className="space-y-6">

        {/* Top Header */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 ${
          isStageMode
            ? 'bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-amber-500/40 text-white'
            : 'bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 border-slate-800 text-white'
        }`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-inner shrink-0">
              <Trophy className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/20">
                  Live Scoreboard
                </span>
                <span className="text-xs text-slate-400">{VENUE.NAME}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-0.5">
                Papan Klasemen & Hasil Lomba
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Pantauan perolehan nilai dewan juri dan dukungan suporter secara real-time.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Stage Mode Toggle Button */}
            <button
              onClick={toggleStageMode}
              className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                isStageMode
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isStageMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span>{isStageMode ? 'Keluar Mode Layar Panggung' : 'Mode Layar Panggung'}</span>
            </button>

            {!isStageMode && (
              <button
                onClick={() => setActiveView('landing')}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Beranda
              </button>
            )}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isStageMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Klasemen Resmi Dewan Juri (PBB Perpang TNI + Danton)</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Jenjang */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setSelectedJenjang('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedJenjang('SMP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'SMP' ? 'bg-slate-900 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                SMP/MTs
              </button>
              <button
                onClick={() => setSelectedJenjang('SD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'SD' ? 'bg-slate-900 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                SD/MI
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari sekolah..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Banner Kerahasiaan Jika Skor Belum Dipublikasikan Resmi */}
        {!isOfficialScoreVisible && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-500 mx-auto flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
            <div className="max-w-xl mx-auto space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Kerahasiaan Penjurian LBB 2027
              </span>
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                Hasil Klasemen & Skor Sementara Terkunci
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Dewan Juri sedang melakukan rekapitulasi, scrutineering, dan verifikasi silang bukti fisik. Skor resmi akan ditampilkan secara transparan setelah pengesahan Berita Acara Dewan Juri.
              </p>
            </div>
          </div>
        )}

        {/* Podium Display for Top 3 (Hanya jika skor resmi sudah dibuka) */}
        {isOfficialScoreVisible && rankedOfficialTeams.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {/* Podium 2 (Perak) */}
            <div className={`p-6 rounded-3xl border flex flex-col items-center justify-between text-center relative order-2 md:order-1 ${
              isStageMode ? 'bg-slate-900/90 border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-slate-300 text-slate-800 font-black text-lg flex items-center justify-center shadow-inner mb-3">
                #2
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Juara Utama 2</span>
              <h3 className="font-black text-lg text-slate-900 dark:text-white mt-1">{rankedOfficialTeams[1].team.schoolName}</h3>
              <p className="text-xs text-slate-500">{rankedOfficialTeams[1].team.platoonName}</p>
              <div className="mt-4 font-mono font-black text-2xl text-slate-700 dark:text-slate-200">
                {rankedOfficialTeams[1].finalScore} <span className="text-xs font-normal">Poin</span>
              </div>
            </div>

            {/* Podium 1 (Emas) */}
            <div className={`p-8 rounded-3xl border-2 flex flex-col items-center justify-between text-center relative order-1 md:order-2 transform md:-translate-y-2 shadow-2xl ${
              isStageMode
                ? 'bg-gradient-to-b from-amber-900/40 to-slate-900 border-amber-400'
                : 'bg-gradient-to-b from-amber-50 to-white border-amber-400'
            }`}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg mb-3 animate-bounce">
                <Crown className="w-8 h-8 fill-current" />
              </div>
              <span className="text-xs uppercase font-black text-amber-500 tracking-widest">🏆 Juara Umum / Utama 1</span>
              <h3 className="font-black text-xl text-slate-950 dark:text-white mt-1">{rankedOfficialTeams[0].team.schoolName}</h3>
              <p className="text-xs text-slate-500">{rankedOfficialTeams[0].team.platoonName}</p>
              <div className="mt-4 font-mono font-black text-3xl text-amber-500">
                {rankedOfficialTeams[0].finalScore} <span className="text-xs font-normal text-slate-400">Poin</span>
              </div>
            </div>

            {/* Podium 3 (Perunggu) */}
            <div className={`p-6 rounded-3xl border flex flex-col items-center justify-between text-center relative order-3 ${
              isStageMode ? 'bg-slate-900/90 border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-amber-700/30 text-amber-600 font-black text-lg flex items-center justify-center shadow-inner mb-3">
                #3
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Juara Utama 3</span>
              <h3 className="font-black text-lg text-slate-900 dark:text-white mt-1">{rankedOfficialTeams[2].team.schoolName}</h3>
              <p className="text-xs text-slate-500">{rankedOfficialTeams[2].team.platoonName}</p>
              <div className="mt-4 font-mono font-black text-2xl text-amber-700 dark:text-amber-400">
                {rankedOfficialTeams[2].finalScore} <span className="text-xs font-normal">Poin</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabel Peleton / Scores Table */}
        <div className={`rounded-3xl border overflow-hidden shadow-lg ${
          isStageMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`uppercase text-[11px] font-black border-b ${
                isStageMode ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-900 text-white border-slate-800'
              }`}>
                {isOfficialScoreVisible && <th className="py-4 px-4 text-center w-16">Peringkat</th>}
                <th className="py-4 px-3 text-center w-16">No. Undi</th>
                <th className="py-4 px-4">Peleton & Sekolah</th>
                <th className="py-4 px-3 text-center w-20">Jenjang</th>
                {isOfficialScoreVisible ? (
                  <>
                    <th className="py-4 px-3 text-center w-20">Juri 1</th>
                    <th className="py-4 px-3 text-center w-20">Juri 2</th>
                    <th className="py-4 px-3 text-center w-20">Juri 3</th>
                    <th className="py-4 px-3 text-center w-24 bg-blue-500/10 text-blue-400">Akhir Peleton</th>
                    <th className="py-4 px-3 text-center w-24">Akhir Danton</th>
                    <th className="py-4 px-3 text-center w-20 text-red-400">Penalti</th>
                  </>
                ) : (
                  <th className="py-4 px-4 text-center w-36">Status Tampil</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {rankedOfficialTeams.length === 0 ? (
                <tr>
                  <td colSpan={isOfficialScoreVisible ? 10 : 4} className="py-8 text-center text-slate-400">
                    Belum ada peleton yang terdaftar pada kategori ini.
                  </td>
                </tr>
              ) : (
                rankedOfficialTeams.map((item, idx) => {
                  const rank = idx + 1;
                  const isTop3 = isOfficialScoreVisible && rank <= 3;
                  const juri1 = item.j1Peleton > 0 ? item.j1Peleton : '-';
                  const juri2 = item.j2Peleton > 0 ? item.j2Peleton : '-';
                  const juri3 = item.j3Peleton > 0 ? item.j3Peleton : '-';
                  const akhirPeleton = item.nilaiAkhirPeleton > 0 ? item.nilaiAkhirPeleton : '-';
                  const akhirDanton = item.nilaiAkhirDanton > 0 ? item.nilaiAkhirDanton : '-';
                  const penalty = item.penaltyTotal || 0;

                  return (
                    <tr
                      key={item.team.id}
                      className={`transition-colors ${
                        isTop3
                          ? (isStageMode ? 'bg-amber-950/20 hover:bg-amber-950/30' : 'bg-amber-50/40 hover:bg-amber-50/80 font-semibold')
                          : (isStageMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50')
                      }`}
                    >
                      {isOfficialScoreVisible && (
                        <td className="py-4 px-4 text-center">
                          {rank === 1 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400 text-slate-950 font-black text-xs shadow-xs">1</span>}
                          {rank === 2 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-black text-xs shadow-xs">2</span>}
                          {rank === 3 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white font-black text-xs shadow-xs">3</span>}
                          {rank > 3 && <span className="text-slate-500 font-bold">{rank}</span>}
                        </td>
                      )}
                      <td className="py-4 px-3 text-center font-mono font-bold text-slate-600 dark:text-slate-300">
                        {item.team.lotNumber ? String(item.team.lotNumber).padStart(2, '0') : '--'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{item.team.schoolName}</div>
                        <div className="text-[11px] text-slate-500">{item.team.platoonName}</div>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className="font-bold text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.team.jenjang}
                        </span>
                      </td>
                      {isOfficialScoreVisible ? (
                        <>
                          <td className="py-4 px-3 text-center font-mono text-slate-700 dark:text-slate-300">{juri1}</td>
                          <td className="py-4 px-3 text-center font-mono text-slate-700 dark:text-slate-300">{juri2}</td>
                          <td className="py-4 px-3 text-center font-mono text-slate-700 dark:text-slate-300">{juri3}</td>
                          <td className="py-4 px-3 text-center font-mono font-black text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20">{akhirPeleton}</td>
                          <td className="py-4 px-3 text-center font-mono font-bold text-amber-600 dark:text-amber-400">{akhirDanton}</td>
                          <td className="py-4 px-3 text-center font-mono text-rose-600 font-bold">
                            {penalty > 0 ? `-${penalty}` : '0'}
                          </td>
                        </>
                      ) : (
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.hasScore
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {item.hasScore ? 'Sudah Tampil (Terekap)' : 'Menunggu Giliran'}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
  );

  if (isStageMode) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-12 font-sans">
        <div className="max-w-7xl mx-auto">
          {content}
        </div>
      </div>
    );
  }

  return (
    <SimpaskorSidebarLayout
      activeMenu="klasemen"
      title="Klasemen & Hasil Live"
      subtitle="Papan Peringkat Resmi Dewan Juri Realtime"
    >
      {content}
    </SimpaskorSidebarLayout>
  );
}
