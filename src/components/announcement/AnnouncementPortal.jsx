import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Crown,
  Calendar,
  Clock,
  Printer,
  FileText,
  ArrowLeft,
  Sparkles,
  Medal,
  Users,
  Search,
  ExternalLink,
  Shield
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { PRIZES, VENUE, EVENT } from '../../config.js';

export default function AnnouncementPortal() {
  const { teams, scores, settings, setActiveView, openModal } = useCompetition();

  const [activeJenjang, setActiveJenjang] = useState('SMP'); // 'SD' | 'SMP'

  // Jika pengumuman belum dibuka resmi oleh superadmin
  if (!settings.announcementPublished) {
    return (
      <div className="min-h-screen bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 font-sans text-white flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20">
              Kerahasiaan Penjurian
            </span>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">
              Hasil Lomba Belum Diumumkan
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dewan Juri sedang melakukan rekapitulasi dan verifikasi nilai. Pengumuman resmi juara dan perolehan trofi akan dipublikasikan sesuai jadwal acara LBB Mu'allimin 2026.
            </p>
          </div>
          <button
            onClick={() => setActiveView('landing')}
            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // Calculate ranks
  const calculateRanking = jenjang => {
    return teams
      .filter(t => t.jenjang === jenjang && scores[t.id])
      .map(t => ({
        ...t,
        scoreData: scores[t.id],
        finalScore: scores[t.id].finalScore,
        dantonScore: scores[t.id].danton.total,
        pbbScore: scores[t.id].pbb.total,
      }))
      .sort((a, b) => b.finalScore - a.finalScore);
  };

  const rankedSD = calculateRanking('SD');
  const rankedSMP = calculateRanking('SMP');
  const currentRanked = activeJenjang === 'SD' ? rankedSD : rankedSMP;

  // Best Danton
  const bestDanton = [...currentRanked].sort((a, b) => b.dantonScore - a.dantonScore)[0] || null;
  // Best Pasukan
  const bestPasukan = [...currentRanked].sort((a, b) => b.pbbScore - a.pbbScore)[0] || null;

  // Juara Umum: Peleton dengan skor tertinggi dari semua jenjang
  const allRanked = [...rankedSD, ...rankedSMP].sort((a, b) => b.finalScore - a.finalScore);
  const grandChampion = allRanked[0] || null;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveView('landing')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda LBB</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Papan Pengumuman Resmi
            </span>
          </div>
        </div>

        {/* Hero Banner Pengumuman */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800 text-center relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-300 text-xs font-black uppercase tracking-widest">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Hasil Resmi LBB Mu'allimin 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tight text-white leading-tight">
              PENGUMUMAN JUARA & REKAP NILAI DEWAN JURI
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto font-medium">
              Keputusan Dewan Juri LBB Mu'allimin 2026 bersifat mutlak, sah, dan mengikat berdasarkan akumulasi penilaian teknis dan kekompakan di arena.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => openModal('docViewer', { docId: 'berita-acara' })}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-yellow-500/25 flex items-center gap-2 hover:from-yellow-300 hover:to-amber-400 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Unduh Berita Acara Rekapitulasi (PDF)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Juara Umum Spotlight Card */}
        {grandChampion && (
          <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-3xl p-1 shadow-xl">
            <div className="bg-slate-950 text-white rounded-[22px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="flex items-center gap-5 text-left">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shrink-0">
                  <Crown className="w-12 h-12" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-yellow-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    {PRIZES.ROLLING_TROPHY_TITLE} • PIALA GUBERNUR DIY
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight mt-1">
                    {grandChampion.schoolName}
                  </h3>
                  <p className="text-sm text-yellow-200/90 font-semibold mt-0.5">
                    {grandChampion.platoonName} • Jenjang {grandChampion.jenjang}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Danton: <strong className="text-white">{grandChampion.roster?.danton?.name || grandChampion.dantonName || '-'}</strong> • Nilai Akhir: <strong className="text-yellow-400 font-mono text-sm">{grandChampion.finalScore} Poin</strong>
                  </p>
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 text-center shrink-0 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-yellow-300 block">Piala Bergilir 2026</span>
                <span className="text-2xl font-black text-white font-mono">{grandChampion.finalScore}</span>
                <span className="text-[10px] text-slate-300 block">Poin Sempurna</span>
              </div>
            </div>
          </div>
        )}

        {/* Jenjang Switcher */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setActiveJenjang('SMP')}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeJenjang === 'SMP'
                ? 'bg-red-700 text-white shadow-lg shadow-red-950/30 ring-2 ring-red-300'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Tingkat SMP / MTs Se-DIY</span>
          </button>
          <button
            onClick={() => setActiveJenjang('SD')}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeJenjang === 'SD'
                ? 'bg-red-700 text-white shadow-lg shadow-red-950/30 ring-2 ring-red-300'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Tingkat SD / MI Se-DIY</span>
          </button>
        </div>

        {/* Podium Juara 1, 2, 3 */}
        <div className="grid md:grid-cols-3 gap-6 items-end">
          {/* Juara 2 */}
          <div className="order-2 md:order-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-700 font-black text-lg flex items-center justify-center mx-auto shadow-xs">
              2
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full inline-block">
              Juara 2 {activeJenjang}
            </span>
            <h4 className="font-black text-lg text-slate-900 leading-tight">
              {currentRanked[1] ? currentRanked[1].schoolName : 'Menunggu Rekap'}
            </h4>
            <p className="text-xs text-slate-500">{currentRanked[1]?.platoonName || '-'}</p>
            <div className="pt-2 border-t border-slate-100">
              <span className="text-2xl font-black font-mono text-slate-800">
                {currentRanked[1]?.finalScore || '-'}
              </span>
              <span className="text-xs text-slate-400 ml-1">Poin</span>
            </div>
          </div>

          {/* Juara 1 (Pusat / Lebih Tinggi) */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-yellow-50/50 rounded-3xl p-7 border-2 border-yellow-400 shadow-xl text-center space-y-4 relative overflow-hidden transform md:-translate-y-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto shadow-md">
              <Crown className="w-8 h-8" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-950 bg-yellow-400 px-3 py-1 rounded-full inline-block shadow-sm">
              JUARA 1 UTAMA {activeJenjang}
            </span>
            <h4 className="font-black text-xl text-slate-900 leading-tight">
              {currentRanked[0] ? currentRanked[0].schoolName : 'Menunggu Rekap'}
            </h4>
            <p className="text-xs font-bold text-amber-800">{currentRanked[0]?.platoonName || '-'}</p>
            <div className="pt-2 border-t border-yellow-200">
              <span className="text-3xl font-black font-mono text-slate-900">
                {currentRanked[0]?.finalScore || '-'}
              </span>
              <span className="text-xs text-slate-500 ml-1">Poin Akhir</span>
            </div>
          </div>

          {/* Juara 3 */}
          <div className="order-3 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-black text-lg flex items-center justify-center mx-auto shadow-xs">
              3
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full inline-block">
              Juara 3 {activeJenjang}
            </span>
            <h4 className="font-black text-lg text-slate-900 leading-tight">
              {currentRanked[2] ? currentRanked[2].schoolName : 'Menunggu Rekap'}
            </h4>
            <p className="text-xs text-slate-500">{currentRanked[2]?.platoonName || '-'}</p>
            <div className="pt-2 border-t border-slate-100">
              <span className="text-2xl font-black font-mono text-slate-800">
                {currentRanked[2]?.finalScore || '-'}
              </span>
              <span className="text-xs text-slate-400 ml-1">Poin</span>
            </div>
          </div>
        </div>

        {/* Kategori Khusus: Danton Terbaik & Pasukan Terbaik */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Best Danton */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 shadow-sm">
              <Medal className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">
                Danton Terbaik {activeJenjang}
              </span>
              <h5 className="font-black text-base text-slate-900 mt-1">
                {bestDanton ? (bestDanton.roster?.danton?.name || bestDanton.dantonName || '-') : '-'}
              </h5>
              <p className="text-xs text-slate-500">
                {bestDanton ? `${bestDanton.schoolName} (${bestDanton.dantonScore} pt)` : '-'}
              </p>
            </div>
          </div>

          {/* Best Pasukan */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-sm">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Pasukan Terbaik {activeJenjang}
              </span>
              <h5 className="font-black text-base text-slate-900 mt-1">
                {bestPasukan ? bestPasukan.schoolName : '-'}
              </h5>
              <p className="text-xs text-slate-500">
                {bestPasukan ? `${bestPasukan.platoonName} (${bestPasukan.pbbScore} pt)` : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabel Lengkap Rekap Nilai Juri */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h4 className="font-black text-lg text-slate-900 uppercase italic">
                Peringkat & Nilai Rinci Dewan Juri ({activeJenjang})
              </h4>
              <p className="text-xs text-slate-500">
                Daftar lengkap akumulasi nilai seluruh kontingen peserta yang telah tampil.
              </p>
            </div>
            <button
              onClick={() => openModal('docViewer', { docId: 'berita-acara' })}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekap</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Asal Sekolah & Peleton</th>
                  <th className="p-3">Danton</th>
                  <th className="p-3 text-center">Nilai Danton</th>
                  <th className="p-3 text-center">Nilai PBB</th>
                  <th className="p-3 text-center">Penalti</th>
                  <th className="p-3 text-right">Total Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentRanked.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      Belum ada data nilai juri untuk jenjang {activeJenjang}.
                    </td>
                  </tr>
                ) : (
                  currentRanked.map((team, idx) => (
                    <tr key={team.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold font-mono">
                        <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center ${
                          idx === 0 ? 'bg-yellow-400 text-slate-950 font-black' : idx === 1 ? 'bg-slate-200 text-slate-700' : idx === 2 ? 'bg-amber-700 text-white' : 'text-slate-600'
                        }`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 text-sm block">{team.schoolName}</span>
                        <span className="text-[10px] text-slate-500">{team.platoonName} • #{team.lotNumber || '-'}</span>
                      </td>
                      <td className="p-3 font-semibold text-slate-700">{team.roster?.danton?.name || team.dantonName || '-'}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-800">{team.dantonScore}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-800">{team.pbbScore}</td>
                      <td className="p-3 text-center font-mono font-bold text-rose-700">-{team.scoreData.penalties.totalPenalty}</td>
                      <td className="p-3 text-right font-mono font-black text-sm text-slate-900">{team.finalScore}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
