import React from 'react';
import { Trophy, Printer } from 'lucide-react';

export default function LeaderboardView({
  teams,
  scores,
  setIsRecapModalOpen
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Rekapitulasi Nilai & Klasemen Dewan Juri</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Urutan peringkat resmi berdasarkan akumulasi nilai Danton dan Rerata PBB setelah pemotongan penalti.
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

        {/* Grid 2 Jenjang: SD & SMP */}
        <div className="grid lg:grid-cols-2 gap-6">
          {['SD', 'SMP'].map(jenjang => {
            const rankedTeams = teams
              .filter(t => t.jenjang === jenjang && scores[t.id])
              .map(t => ({
                ...t,
                scoreData: scores[t.id],
                finalScore: scores[t.id].finalScore,
              }))
              .sort((a, b) => b.finalScore - a.finalScore);

            return (
              <div key={jenjang} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="font-black text-base text-slate-900 uppercase flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${jenjang === 'SD' ? 'bg-red-500' : 'bg-blue-500'}`} />
                    <span>Klasemen Tingkat {jenjang === 'SD' ? 'SD / MI' : 'SMP / MTs'}</span>
                  </h4>
                  <span className="text-xs font-mono font-bold text-slate-600 bg-white px-3 py-1 rounded-xl border border-slate-200">
                    {rankedTeams.length} Peleton Dinilai
                  </span>
                </div>

                <div className="space-y-3">
                  {rankedTeams.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 text-xs italic">
                      Belum ada tim {jenjang} yang selesai dinilai juri.
                    </div>
                  ) : (
                    rankedTeams.map((team, idx) => {
                      return (
                        <div
                          key={team.id}
                          className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                            idx === 0
                              ? 'bg-amber-50/60 border-amber-300 shadow-xs ring-1 ring-amber-400/40'
                              : idx === 1
                              ? 'bg-white border-slate-300 shadow-xs'
                              : idx === 2
                              ? 'bg-orange-50/40 border-orange-200'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
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
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900 text-sm">{team.schoolName}</span>
                                {idx === 0 && (
                                  <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md">
                                    Juara 1
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                                Rerata PBB: <span className="text-slate-800 font-bold">{team.scoreData.pbb?.total ?? 0}</span>
                                {team.scoreData.pbb?.j1 !== undefined && team.scoreData.pbb?.j2 !== undefined ? (
                                  <span className="text-slate-400 text-[10px]"> (J1:{team.scoreData.pbb.j1} J2:{team.scoreData.pbb.j2})</span>
                                ) : ''}
                                {' • '}Danton: <span className="text-slate-800 font-bold">{team.scoreData.danton?.total ?? 0}</span>
                                {team.scoreData.penalties?.totalPenalty > 0 && (
                                  <span className="text-rose-600 font-bold"> • Penalti: -{team.scoreData.penalties.totalPenalty}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono font-black text-xl text-slate-900 block">
                              {team.finalScore}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">Poin</span>
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
