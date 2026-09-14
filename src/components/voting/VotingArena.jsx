import React, { useState } from 'react';
import {
  Heart,
  Trophy,
  Share2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Flame,
  Users,
  Search,
  ArrowLeft,
  ChevronRight,
  Award
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { VOTING_CONFIG, SITE, TIMELINE, VENUE } from '../../config.js';

export default function VotingArena() {
  const { teams, votes, castVote, hasVotedToday, setActiveView } = useCompetition();

  const [activeCategory, setActiveCategory] = useState('peleton'); // 'peleton' | 'danton'
  const [selectedJenjang, setSelectedJenjang] = useState('ALL'); // 'ALL' | 'SD' | 'SMP'
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Filter verified teams
  const verifiedTeams = teams.filter(t => t.status === 'verified');

  const filteredTeams = verifiedTeams.filter(t => {
    const matchJenjang = selectedJenjang === 'ALL' || t.jenjang === selectedJenjang;
    const matchSearch =
      t.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.platoonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.dantonName && t.dantonName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchJenjang && matchSearch;
  });

  // Calculate total votes for the active category
  const totalCategoryVotes = Object.values(votes).reduce(
    (acc, curr) => acc + (curr[activeCategory] || 0),
    0
  );

  // Sort teams by vote count in active category descending
  const sortedTeams = [...filteredTeams].map(t => {
    const v = votes[t.id]?.[activeCategory] || 0;
    const pct = totalCategoryVotes > 0 ? Math.round((v / totalCategoryVotes) * 100) : 0;
    const voted = hasVotedToday(t.id, activeCategory);
    return {
      team: t,
      votesCount: v,
      percentage: pct,
      hasVoted: voted,
    };
  }).sort((a, b) => b.votesCount - a.votesCount);

  function handleVote(teamId, schoolName) {
    const res = castVote(teamId, activeCategory);
    if (res.success) {
      setFeedbackMsg({ type: 'success', text: `Dukungan untuk ${schoolName} berhasil disimpan!` });
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
    setTimeout(() => setFeedbackMsg(null), 4000);
  }

  function handleShare(schoolName, platoonName) {
    const text = `Ayo dukung peleton ${platoonName} dari ${schoolName} di LBB Mu'allimin 2026! Buka portal resmi untuk vote: https://lbb.tontimuallimin.com`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 lg:p-8 selection:bg-rose-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-rose-950/50 shrink-0 animate-pulse">
                <Flame className="w-9 h-9 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    VOTING ARENA SUPORTER
                  </span>
                  <span className="text-xs text-slate-400 font-mono">1 Akun/Device = 1 Vote/Hari</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                  Peleton & Danton Terfavorit
                </h1>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  {VOTING_CONFIG.DESCRIPTION}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveView('live_leaderboard')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Papan Klasemen</span>
              </button>
              <button
                onClick={() => setActiveView('landing')}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Kembali ke Web
              </button>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Suara Terhimpun</span>
              <span className="font-mono font-black text-xl text-rose-400">{totalCategoryVotes}</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Kontingen Terdaftar</span>
              <span className="font-mono font-black text-xl text-white">{verifiedTeams.length} Peleton</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pemimpin Klasemen</span>
              <span className="font-bold text-xs text-amber-400 truncate block mt-1">
                {sortedTeams[0]?.team.schoolName || '-'}
              </span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Batas Waktu Voting</span>
              <span className="text-xs text-slate-300 font-semibold mt-1 block">Hari-H Penutupan</span>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-lg animate-in fade-in duration-300 ${
            feedbackMsg.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}>
            {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Category Selector & Filter Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs: Peleton vs Danton */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveCategory('peleton')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeCategory === 'peleton'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Peleton Terfavorit</span>
            </button>
            <button
              onClick={() => setActiveCategory('danton')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeCategory === 'danton'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Danton Terfavorit</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Jenjang */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setSelectedJenjang('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedJenjang('SMP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'SMP' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                SMP/MTs
              </button>
              <button
                onClick={() => setSelectedJenjang('SD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'SD' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
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
                placeholder="Cari sekolah atau pleton..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-white placeholder-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Platoon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTeams.map((item, idx) => {
            const rank = idx + 1;
            const isRank1 = rank === 1;

            return (
              <div
                key={item.team.id}
                className={`rounded-3xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isRank1
                    ? 'bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-900 border-rose-500 shadow-xl shadow-rose-950/20'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md'
                }`}
              >
                {/* Header inside card */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded-md">
                        No. {item.team.lotNumber ? String(item.team.lotNumber).padStart(2, '0') : '--'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {item.team.jenjang}
                      </span>
                    </div>

                    <span className={`text-xs font-black font-mono px-2.5 py-0.5 rounded-full ${
                      isRank1 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{rank}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white leading-snug">
                      {item.team.schoolName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Peleton: <strong className="text-slate-200">{item.team.platoonName}</strong>
                    </p>
                    {activeCategory === 'danton' && (
                      <p className="text-xs text-rose-300 mt-0.5 font-medium">
                        Komandan: {item.team.dantonName || 'Danton Peleton'}
                      </p>
                    )}
                  </div>

                  {/* Vote Count & Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-rose-400 font-bold">{item.votesCount} Suara</span>
                      <span className="text-slate-400">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-rose-600 to-pink-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions Button */}
                <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    disabled={item.hasVoted}
                    onClick={() => handleVote(item.team.id, item.team.schoolName)}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      item.hasVoted
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
                        : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg active:scale-95'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${item.hasVoted ? 'fill-current text-emerald-400' : 'fill-current'}`} />
                    <span>{item.hasVoted ? 'Sudah Didukung' : 'Vote Peleton Ini'}</span>
                  </button>

                  <button
                    onClick={() => handleShare(item.team.schoolName, item.team.platoonName)}
                    title="Bagikan ke WhatsApp"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
