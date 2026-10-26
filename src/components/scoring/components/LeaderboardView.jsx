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
            <span>Dasar Penentuan Juara (Juknis LBB Mu'allimin 2027 Bab A.5 – A.8):</span>
          </div>
          {standingType === 'umum' && (
            <p className="text-[11px] text-slate-600 leading-relaxed pl-6">
              <strong>Juara Umum (Piala Bergilir)</strong> ditentukan dari <strong>Akumulasi Poin Prestasi Sekolah</strong> tertinggi pada masing-masing jenjang melalui skema konversi peringkat kejuaraan (Juara 1–3 & Harapan 1–3 Peleton: <strong>6, 5, 4, 3, 2, 1 Poin</strong> + Juara 1–3 Komandan Terbaik: <strong>3, 2, 1 Poin</strong>). Tie-breaker Bab A.8: Nilai Murni Peleton tertinggi salah satu peleton terbaik sekolah → Penalti Peleton terkecil → Nilai Murni Komandan tertinggi.
            </p>
          )}
          {standingType === 'peleton' && (
            <p className="text-[11px] text-slate-600 leading-relaxed pl-6">
              <strong>Juara Peleton (Juara 1, 2, 3 & Harapan 1, 2, 3)</strong> ditentukan murni dari <strong>Nilai Akhir Peleton</strong> (Nilai Murni Peleton 3 Dewan Juri – Penalti Peleton), tanpa digabung dengan nilai Danton. Tie-breaker Bab A.5: Nilai Murni Peleton tertinggi → Penalti Peleton terkecil → Nilai Murni Danton tertinggi.
            </p>
          )}
          {standingType === 'danton' && (
            <p className="text-[11px] text-slate-600 leading-relaxed pl-6">
              <strong>Komandan Terbaik (Juara 1, 2, 3 Danton)</strong> ditentukan murni dari <strong>Nilai Akhir Danton</strong> (Materi 35% + Vokal 25% + Sikap 20% + Lapangan 20% dari 3 Dewan Juri – Penalti Danton). Tie-breaker Bab A.6: Nilai Murni Danton tertinggi → Penalti Danton terkecil → Aspek Materi (35%) → Aspek Vokal (25%).
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
                const juries = s.juries || {};
                const nilaiMurniPeleton = Number(
                  s.nilaiMurniPeleton ??
                  ((Number(juries.pos1?.peletonTotal ?? 0) + Number(juries.pos2?.peletonTotal ?? 0) + Number(juries.pos3?.peletonTotal ?? 0)) || Number(s.pbb?.total ?? 0))
                );
                const nilaiMurniDanton = Number(
                  s.nilaiMurniDanton ??
                  ((Number(juries.pos1?.dantonTotal ?? 0) + Number(juries.pos2?.dantonTotal ?? 0) + Number(juries.pos3?.dantonTotal ?? 0)) || Number(s.danton?.total ?? 0))
                );
                const peletonPenalty = Number(s.penalties?.peletonPenalty ?? s.penalties?.totalPenalty ?? 0);
                const dantonPenalty = Number(s.penalties?.dantonPenalty ?? 0);
                const peletonScore = Number(s.nilaiAkhirPeleton ?? Math.max(0, nilaiMurniPeleton - peletonPenalty));
                const dantonScore = Number(s.nilaiAkhirDanton ?? Math.max(0, nilaiMurniDanton - dantonPenalty));
                const totalScore = Number(s.finalScore ?? (peletonScore + dantonScore));
                const dantonName = t.roster?.danton?.name || t.dantonName || '-';
                const dantonMateri =
                  Number(juries.pos1?.dantonRubricScores?.materi ?? 0) +
                  Number(juries.pos2?.dantonRubricScores?.materi ?? 0) +
                  Number(juries.pos3?.dantonRubricScores?.materi ?? s.danton?.rubricScores?.materi ?? 0);
                const dantonVokal =
                  Number(juries.pos1?.dantonRubricScores?.vokal ?? 0) +
                  Number(juries.pos2?.dantonRubricScores?.vokal ?? 0) +
                  Number(juries.pos3?.dantonRubricScores?.vokal ?? s.danton?.rubricScores?.vokal ?? 0);

                return {
                  ...t,
                  dantonName,
                  scoreData: s,
                  nilaiMurniPeleton,
                  nilaiMurniDanton,
                  peletonPenalty,
                  dantonPenalty,
                  peletonScore,
                  dantonScore,
                  dantonMateri,
                  dantonVokal,
                  totalScore,
                };
              });

            // Hitung Peringkat Peleton (Bab A.5) & Danton (Bab A.6)
            const peletonSorted = [...rawTeams].sort((a, b) => {
              if (b.peletonScore !== a.peletonScore) return b.peletonScore - a.peletonScore;
              if (b.nilaiMurniPeleton !== a.nilaiMurniPeleton) return b.nilaiMurniPeleton - a.nilaiMurniPeleton;
              if (a.peletonPenalty !== b.peletonPenalty) return a.peletonPenalty - b.peletonPenalty;
              return b.nilaiMurniDanton - a.nilaiMurniDanton;
            });

            const dantonSorted = [...rawTeams].sort((a, b) => {
              if (b.dantonScore !== a.dantonScore) return b.dantonScore - a.dantonScore;
              if (b.nilaiMurniDanton !== a.nilaiMurniDanton) return b.nilaiMurniDanton - a.nilaiMurniDanton;
              if (a.dantonPenalty !== b.dantonPenalty) return a.dantonPenalty - b.dantonPenalty;
              if (b.dantonMateri !== a.dantonMateri) return b.dantonMateri - a.dantonMateri;
              return b.dantonVokal - a.dantonVokal;
            });

            // Hitung Poin Prestasi Sekolah (Bab A.7 & A.8) untuk tab 'umum'
            const schoolMap = {};
            rawTeams.forEach(t => {
              if (!schoolMap[t.schoolName]) {
                schoolMap[t.schoolName] = {
                  id: `school-${jenjang}-${t.schoolName}`,
                  schoolName: t.schoolName,
                  jenjang,
                  peletonPoints: 0,
                  dantonPoints: 0,
                  totalPoints: 0,
                  bestMurniPeleton: 0,
                  peletonPenalty: 0,
                  bestMurniDanton: 0,
                  peletonScore: 0,
                  dantonScore: 0,
                  dantonName: t.dantonName,
                  chestNumber: t.chestNumber,
                  scoreData: t.scoreData,
                  achievements: [],
                };
              }
              const sc = schoolMap[t.schoolName];
              if (t.nilaiMurniPeleton > sc.bestMurniPeleton) sc.bestMurniPeleton = t.nilaiMurniPeleton;
              sc.peletonPenalty += t.peletonPenalty;
              if (t.nilaiMurniDanton > sc.bestMurniDanton) sc.bestMurniDanton = t.nilaiMurniDanton;
              if (t.peletonScore > sc.peletonScore) sc.peletonScore = t.peletonScore;
              if (t.dantonScore > sc.dantonScore) sc.dantonScore = t.dantonScore;
            });

            peletonSorted.forEach((t, idx) => {
              const pts = [6, 5, 4, 3, 2, 1][idx] || 0;
              if (pts > 0 && schoolMap[t.schoolName]) {
                schoolMap[t.schoolName].peletonPoints += pts;
                schoolMap[t.schoolName].totalPoints += pts;
              }
            });

            dantonSorted.forEach((t, idx) => {
              const pts = [3, 2, 1][idx] || 0;
              if (pts > 0 && schoolMap[t.schoolName]) {
                schoolMap[t.schoolName].dantonPoints += pts;
                schoolMap[t.schoolName].totalPoints += pts;
              }
            });

            const umumSorted = Object.values(schoolMap).sort((a, b) => {
              if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
              if (b.bestMurniPeleton !== a.bestMurniPeleton) return b.bestMurniPeleton - a.bestMurniPeleton;
              if (a.peletonPenalty !== b.peletonPenalty) return a.peletonPenalty - b.peletonPenalty;
              return b.bestMurniDanton - a.bestMurniDanton;
            });

            const rankedTeams =
              standingType === 'peleton'
                ? peletonSorted
                : standingType === 'danton'
                ? dantonSorted
                : umumSorted;

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
                          : `${team.totalPoints} Poin`;

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
                                {standingType === 'umum' ? (
                                  <>
                                    <span>Poin Peleton: <strong className="text-slate-800">{team.peletonPoints}</strong></span>
                                    {' • '}
                                    <span>Poin Danton: <strong className="text-slate-800">{team.dantonPoints}</strong></span>
                                    {' • '}
                                    <span>Murni Peleton Terbaik: <strong className="text-slate-800">{team.bestMurniPeleton}</strong></span>
                                  </>
                                ) : (
                                  <>
                                    <span>Danton: <strong className="text-slate-800">{team.dantonName}</strong></span>
                                    {' • '}
                                    <span>Peleton: <strong className="text-slate-800">{team.peletonScore}</strong></span>
                                    {' • '}
                                    <span>Danton: <strong className="text-slate-800">{team.dantonScore}</strong></span>
                                    {team.scoreData?.penalties?.totalPenalty > 0 && (
                                      <span className="text-rose-600 font-bold"> • Penalti: -{team.scoreData.penalties.totalPenalty}</span>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono font-black text-xl text-slate-900 block leading-tight">
                              {primaryScore}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">
                              {standingType === 'peleton' ? 'Nilai Peleton' : standingType === 'danton' ? 'Nilai Danton' : 'Poin Prestasi'}
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
