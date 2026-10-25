import React, { useState } from 'react';
import { Trophy, Printer, Award, User, ShieldCheck, Info } from 'lucide-react';

export default function LeaderboardView({
  teams = [],
  scores = {},
  setIsRecapModalOpen,
}) {
  // Mode Klasemen: 'umum' (Juara Umum) | 'peleton' (Juara Peleton) | 'danton' (Komandan Terbaik)
  const [standingType, setStandingType] = useState('umum');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Header Rekapitulasi */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              <span>Klasemen & Rekapitulasi Kejuaraan LBB Mu'allimin 2027</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Penetapan Peringkat Resmi Dewan Juri untuk Tingkat SD/MI dan SMP/MTs Sederajat.
            </p>
          </div>

          <button
            onClick={() => setIsRecapModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Berita Acara Rekap Nilai</span>
          </button>
        </div>

        {/* Kategori Tab Klasemen: Juara Umum, Juara Peleton, Komandan Terbaik */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setStandingType('umum')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              standingType === 'umum'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>1. Juara Umum (Piala Bergilir)</span>
          </button>

          <button
            type="button"
            onClick={() => setStandingType('peleton')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              standingType === 'peleton'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>2. Juara Peleton (PBB Murni)</span>
          </button>

          <button
            type="button"
            onClick={() => setStandingType('danton')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              standingType === 'danton'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>3. Komandan Terbaik (Danton)</span>
          </button>
        </div>

        {/* Box Penjelasan Formula Juknis Resmi */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Dasar Penentuan Juara (Juknis LBB Mu'allimin 2027 Bab A.3):</span>
          </div>
          {standingType === 'umum' && (
            <p className="text-[11px] text-slate-600 leading-relaxed pl-6">
              <strong>Juara Umum (Piala Bergilir)</strong> ditentukan dari <strong>Total Skor Akhir</strong> (Akumulasi Nilai Akhir Peleton + Nilai Akhir Danton dari 3 Dewan Juri setelah dikurangi penalti lapangan).
            </p>
          )}
          {standingType === 'peleton' && (
            <p className="text-[11px] text-slate-600 leading-relaxed pl-6">
              <strong>Juara Peleton (Juara 1, 2, 3 & Harapan 1, 2, 3)</strong> ditentukan murni dari <strong>Nilai Akhir Peleton</strong> (Skor PBB 3 Dewan Juri – Penalti Peleton), tanpa digabung dengan nilai Danton.
            </p>
          )}
          {standingType === 'danton' && (
            <p className="text-[11px] text-slate-600 leading-relaxed pl-6">
              <strong>Komandan Terbaik (Juara 1, 2, 3 Danton)</strong> ditentukan murni dari <strong>Nilai Akhir Danton</strong> (Materi 35% + Suara 25% + Sikap 20% + Lapangan 20% dari 3 Dewan Juri – Penalti Danton).
            </p>
          )}
        </div>

        {/* Grid 2 Jenjang: SD & SMP */}
        <div className="grid lg:grid-cols-2 gap-6">
          {['SD', 'SMP'].map(jenjang => {
            const rawTeams = teams
              .filter(t => t.jenjang === jenjang && scores[t.id])
              .map(t => {
                const s = scores[t.id] || {};
                const peletonScore = Number(s.nilaiAkhirPeleton ?? s.pbb?.total ?? 0);
                const dantonScore = Number(s.nilaiAkhirDanton ?? s.danton?.total ?? 0);
                const totalScore = Number(s.finalScore ?? (peletonScore + dantonScore));
                const dantonName = t.roster?.danton?.name || t.dantonName || '-';

                return {
                  ...t,
                  dantonName,
                  scoreData: s,
                  peletonScore,
                  dantonScore,
                  totalScore,
                };
              });

            // Sorting berdasarkan kategori yang aktif
            const rankedTeams = [...rawTeams].sort((a, b) => {
              if (standingType === 'peleton') return b.peletonScore - a.peletonScore;
              if (standingType === 'danton') return b.dantonScore - a.dantonScore;
              return b.totalScore - a.totalScore;
            });

            return (
              <div key={jenjang} className={`rounded-2xl p-5 border space-y-4 ${
                jenjang === 'SD' ? 'bg-red-50/20 border-red-200' : 'bg-blue-50/20 border-blue-200'
              }`}>
                <div className={`flex items-center justify-between border-b pb-3 ${
                  jenjang === 'SD' ? 'border-red-100' : 'border-blue-100'
                }`}>
                  <h4 className="font-black text-base uppercase flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${jenjang === 'SD' ? 'bg-red-600 ring-2 ring-red-300' : 'bg-blue-600 ring-2 ring-blue-300'}`} />
                    <span className={jenjang === 'SD' ? 'text-red-950' : 'text-blue-950'}>
                      Tingkat {jenjang === 'SD' ? 'SD / MI Sederajat' : 'SMP / MTs Sederajat'}
                    </span>
                  </h4>
                  <span className={`text-xs font-mono font-black px-3 py-1 rounded-xl border shadow-2xs ${
                    jenjang === 'SD' ? 'bg-white text-red-900 border-red-200' : 'bg-white text-blue-900 border-blue-200'
                  }`}>
                    {rankedTeams.length} Peleton Dinilai
                  </span>
                </div>

                <div className="space-y-3">
                  {rankedTeams.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      Belum ada tim {jenjang} yang selesai dinilai dewan juri.
                    </div>
                  ) : (
                    rankedTeams.map((team, idx) => {
                      // Label Penghargaan Resmi
                      let awardBadge = null;
                      if (standingType === 'umum') {
                        if (idx === 0) awardBadge = { label: 'Juara Umum (Piala Bergilir)', bg: 'bg-amber-400 text-slate-950 ring-2 ring-amber-300' };
                        else if (idx === 1) awardBadge = { label: 'Runner-up Umum', bg: 'bg-slate-200 text-slate-800' };
                      } else if (standingType === 'peleton') {
                        if (idx === 0) awardBadge = { label: 'Juara 1 Peleton', bg: 'bg-amber-400 text-slate-950 ring-2 ring-amber-300' };
                        else if (idx === 1) awardBadge = { label: 'Juara 2 Peleton', bg: 'bg-slate-200 text-slate-800' };
                        else if (idx === 2) awardBadge = { label: 'Juara 3 Peleton', bg: 'bg-amber-600 text-white' };
                        else if (idx === 3) awardBadge = { label: 'Harapan 1 Peleton', bg: 'bg-emerald-100 text-emerald-800' };
                        else if (idx === 4) awardBadge = { label: 'Harapan 2 Peleton', bg: 'bg-teal-100 text-teal-800' };
                        else if (idx === 5) awardBadge = { label: 'Harapan 3 Peleton', bg: 'bg-cyan-100 text-cyan-800' };
                      } else if (standingType === 'danton') {
                        if (idx === 0) awardBadge = { label: 'Juara 1 Komandan Terbaik', bg: 'bg-blue-600 text-white ring-2 ring-blue-300' };
                        else if (idx === 1) awardBadge = { label: 'Juara 2 Komandan Terbaik', bg: 'bg-slate-200 text-slate-800' };
                        else if (idx === 2) awardBadge = { label: 'Juara 3 Komandan Terbaik', bg: 'bg-amber-600 text-white' };
                      }

                      const primaryScore =
                        standingType === 'peleton'
                          ? team.peletonScore
                          : standingType === 'danton'
                          ? team.dantonScore
                          : team.totalScore;

                      return (
                        <div
                          key={team.id}
                          className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                            idx === 0
                              ? 'bg-amber-50/70 border-amber-300 shadow-xs ring-1 ring-amber-400/30'
                              : idx === 1
                              ? 'bg-white border-slate-300 shadow-xs'
                              : idx === 2
                              ? 'bg-orange-50/30 border-orange-200'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className={`w-9 h-9 rounded-xl font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-xs ${
                              idx === 0
                                ? 'bg-amber-400 text-slate-950 shadow-amber-400/50'
                                : idx === 1
                                ? 'bg-slate-200 text-slate-800'
                                : idx === 2
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              #{idx + 1}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                {team.chestNumber && (
                                  <span className={`text-white font-mono font-black text-[10px] px-2 py-0.5 rounded-md ${
                                    jenjang === 'SD' ? 'bg-red-600' : 'bg-blue-600'
                                  }`}>
                                    #{team.chestNumber}
                                  </span>
                                )}
                                <span className="font-black text-slate-900 text-sm truncate">{team.schoolName}</span>
                                {awardBadge && (
                                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${awardBadge.bg}`}>
                                    {awardBadge.label}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-1 font-mono truncate">
                                <span>Danton: <strong className="text-slate-800">{team.dantonName}</strong></span>
                                {' • '}
                                <span>Peleton: <strong className="text-slate-800">{team.peletonScore}</strong></span>
                                {' • '}
                                <span>Danton: <strong className="text-slate-800">{team.dantonScore}</strong></span>
                                {team.scoreData.penalties?.totalPenalty > 0 && (
                                  <span className="text-rose-600 font-bold"> • Penalti: -{team.scoreData.penalties.totalPenalty}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono font-black text-xl text-slate-900 block leading-tight">
                              {primaryScore}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">
                              {standingType === 'peleton' ? 'Nilai Peleton' : standingType === 'danton' ? 'Nilai Danton' : 'Total Akhir'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
