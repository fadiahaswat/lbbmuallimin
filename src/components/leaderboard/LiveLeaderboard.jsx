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
  Share2
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { SITE, TIMELINE, VENUE } from '../../config.js';
import logoImg from '../../assets/logo-tonti.png';

export default function LiveLeaderboard() {
  const { teams, scores, votes, role, settings, setActiveView } = useCompetition();
  const [selectedJenjang, setSelectedJenjang] = useState('ALL'); // 'ALL' | 'SD' | 'SMP'
  const isStaffOrJury = ['admin', 'juri', 'superadmin'].includes(role);
  const isOfficialScoreVisible = isStaffOrJury || Boolean(settings?.announcementPublished);
  const [activeTab, setActiveTab] = useState(isOfficialScoreVisible ? 'official' : 'voting'); // 'official' | 'voting'
  const [isStageMode, setIsStageMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Verified & drawn teams
  const verifiedTeams = teams.filter(t => t.status === 'verified' || t.status === 'drawn');

  // Filter by jenjang and search
  const filteredTeams = verifiedTeams.filter(t => {
    const matchJenjang = selectedJenjang === 'ALL' || t.jenjang === selectedJenjang;
    const matchSearch =
      t.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.platoonName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchJenjang && matchSearch;
  });

  // Calculate official ranked teams
  const rankedOfficialTeams = [...filteredTeams].map(team => {
    const s = scores[team.id];
    const finalScore = s?.finalScore || 0;
    return {
      team,
      scoreData: s,
      finalScore,
      hasScore: Boolean(s),
    };
  }).sort((a, b) => b.finalScore - a.finalScore);

  // Calculate voting ranked teams
  const rankedVotingTeams = [...filteredTeams].map(team => {
    const v = votes[team.id] || { peleton: 0, danton: 0 };
    const totalVotes = (v.peleton || 0) + (v.danton || 0);
    return {
      team,
      votesData: v,
      totalVotes,
    };
  }).sort((a, b) => b.totalVotes - a.totalVotes);

  const totalAllVotes = Object.values(votes).reduce((acc, curr) => acc + (curr.peleton || 0) + (curr.danton || 0), 0);

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

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${
      isStageMode ? 'bg-slate-950 text-white p-6 sm:p-12' : 'bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">

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
              <>
                <button
                  onClick={() => setActiveView('voting_arena')}
                  className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Buka Voting Arena</span>
                </button>
                <button
                  onClick={() => setActiveView('landing')}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Beranda
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab & Filter Toolbar */}
        <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isStageMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          {/* Main Category Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
            {isOfficialScoreVisible && (
              <button
                onClick={() => setActiveTab('official')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'official'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Nilai Resmi Lomba</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('voting')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'voting'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Suara Suporter Online</span>
            </button>
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

        {/* Podium Display for Top 3 (Mode Panggung / Videotron Aesthetic) */}
        {activeTab === 'official' && rankedOfficialTeams.length >= 3 && (
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

        {/* Tab 1: Official Scores Table */}
        {activeTab === 'official' && (
          <div className={`rounded-3xl border overflow-hidden shadow-lg ${
            isStageMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`uppercase text-[11px] font-black border-b ${
                  isStageMode ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-900 text-white border-slate-800'
                }`}>
                  <th className="py-4 px-4 text-center w-16">Peringkat</th>
                  <th className="py-4 px-3 text-center w-16">No. Undi</th>
                  <th className="py-4 px-4">Peleton & Sekolah</th>
                  <th className="py-4 px-3 text-center w-20">Jenjang</th>
                  <th className="py-4 px-3 text-center w-24">Juri 1 (PBB)</th>
                  <th className="py-4 px-3 text-center w-24">Juri 2 (PBB)</th>
                  <th className="py-4 px-3 text-center w-24 bg-blue-500/10 text-blue-400">Rerata PBB</th>
                  <th className="py-4 px-3 text-center w-24">Juri 3 (Danton)</th>
                  <th className="py-4 px-3 text-center w-20 text-red-400">Penalti</th>
                  <th className="py-4 px-4 text-right w-28 bg-amber-500/20 text-amber-400">Skor Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                {rankedOfficialTeams.map((item, idx) => {
                  const rank = idx + 1;
                  const isTop3 = rank <= 3;
                  const s = item.scoreData;
                  const juries = s?.juries || {};

                  const juri1 = juries.pos1?.total !== undefined
                    ? Number(juries.pos1.total)
                    : (s?.pbb?.j1 !== undefined && s?.pbb?.j1 !== null ? Number(s.pbb.j1) : (s?.pbb?.total !== undefined ? Number(s.pbb.total) : '-'));

                  const juri2 = juries.pos2?.total !== undefined
                    ? Number(juries.pos2.total)
                    : (s?.pbb?.j2 !== undefined && s?.pbb?.j2 !== null ? Number(s.pbb.j2) : '-');

                  const pbbAvg = s?.pbb?.total !== undefined ? Number(s.pbb.total) : '-';
                  const juri3 = juries.pos3?.total || s?.danton?.total || '-';
                  const penalty = s?.penalties?.totalPenalty || 0;

                  return (
                    <tr
                      key={item.team.id}
                      className={`transition-colors ${
                        isTop3
                          ? (isStageMode ? 'bg-amber-950/20 hover:bg-amber-950/30' : 'bg-amber-50/40 hover:bg-amber-50/80 font-semibold')
                          : (isStageMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50')
                      }`}
                    >
                      <td className="py-4 px-4 text-center">
                        {rank === 1 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400 text-slate-950 font-black text-xs shadow-xs">1</span>}
                        {rank === 2 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-black text-xs shadow-xs">2</span>}
                        {rank === 3 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white font-black text-xs shadow-xs">3</span>}
                        {rank > 3 && <span className="text-slate-500 font-bold">{rank}</span>}
                      </td>
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
                      <td className="py-4 px-3 text-center font-mono text-slate-700 dark:text-slate-300">{juri1}</td>
                      <td className="py-4 px-3 text-center font-mono text-slate-700 dark:text-slate-300">{juri2}</td>
                      <td className="py-4 px-3 text-center font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20">{pbbAvg}</td>
                      <td className="py-4 px-3 text-center font-mono text-slate-700 dark:text-slate-300">{juri3}</td>
                      <td className="py-4 px-3 text-center font-mono text-rose-600 font-bold">
                        {penalty > 0 ? `-${penalty}` : '0'}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-black text-base text-amber-500">
                        {item.finalScore.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Voting Standings Table */}
        {activeTab === 'voting' && (
          <div className="space-y-4">
            <div className={`p-5 rounded-2xl border flex items-center justify-between ${
              isStageMode ? 'bg-rose-950/20 border-rose-800/40 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-rose-500 fill-current" />
                <div>
                  <h4 className="font-bold text-sm">Klasemen Perolehan Suara Peleton Terfavorit</h4>
                  <p className="text-xs text-rose-700 dark:text-rose-400">Total Suara Masuk: {totalAllVotes} Dukungan</p>
                </div>
              </div>
              <button
                onClick={() => setActiveView('voting_arena')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Kirim Suara Sekarang
              </button>
            </div>

            <div className={`rounded-3xl border overflow-hidden shadow-lg ${
              isStageMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`uppercase text-[11px] font-black border-b ${
                    isStageMode ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-900 text-white border-slate-800'
                  }`}>
                    <th className="py-4 px-4 text-center w-16">Peringkat</th>
                    <th className="py-4 px-4">Peleton & Sekolah</th>
                    <th className="py-4 px-3 text-center w-20">Jenjang</th>
                    <th className="py-4 px-4 w-48">Dukungan Suporter</th>
                    <th className="py-4 px-3 text-center w-24">Vote Peleton</th>
                    <th className="py-4 px-3 text-center w-24">Vote Danton</th>
                    <th className="py-4 px-4 text-right w-32 bg-rose-500/20 text-rose-400">Total Suara</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                  {rankedVotingTeams.map((item, idx) => {
                    const rank = idx + 1;
                    const vPct = totalAllVotes > 0 ? Math.round((item.totalVotes / totalAllVotes) * 100) : 0;
                    return (
                      <tr key={item.team.id} className="hover:bg-slate-800/40">
                        <td className="py-4 px-4 text-center font-bold text-slate-500">
                          #{rank}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{item.team.schoolName}</div>
                          <div className="text-[11px] text-slate-500">{item.team.platoonName}</div>
                        </td>
                        <td className="py-4 px-3 text-center font-bold">{item.team.jenjang}</td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-500">
                              <span>{vPct}% suara</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                              <div className="bg-rose-500 h-full rounded-full transition-all duration-300" style={{ width: `${vPct}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-center font-mono font-bold">{item.votesData.peleton || 0}</td>
                        <td className="py-4 px-3 text-center font-mono font-bold">{item.votesData.danton || 0}</td>
                        <td className="py-4 px-4 text-right font-mono font-black text-base text-rose-500">
                          {item.totalVotes}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
