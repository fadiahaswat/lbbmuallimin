import React from 'react';
import { X, Search } from 'lucide-react';

export default function TeamSelectorModal({
  isOpen,
  onClose,
  verifiedTeams,
  selectedTeamId,
  handleSelectTeam,
  scores,
  sidebarJenjang,
  setSidebarJenjang,
  sidebarSearch,
  setSidebarSearch,
  allTeamsCount,
  smpTeamsCount,
  sdTeamsCount
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h3 className="font-black text-base text-slate-900 uppercase tracking-tight">
              Pilih Peleton yang Dinilai
            </h3>
            <p className="text-xs text-slate-500">
              {verifiedTeams.length} Peleton Siap Dinilai (Check-in Basecamp)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Jenjang & Input Pencarian */}
        <div className="p-5 border-b border-slate-100 space-y-3 bg-slate-50">
          <div className="flex items-center bg-slate-200/70 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setSidebarJenjang('ALL')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                sidebarJenjang === 'ALL' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({allTeamsCount})
            </button>
            <button
              type="button"
              onClick={() => setSidebarJenjang('SMP')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                sidebarJenjang === 'SMP' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SMP/MTs ({smpTeamsCount})
            </button>
            <button
              type="button"
              onClick={() => setSidebarJenjang('SD')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                sidebarJenjang === 'SD' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SD/MI ({sdTeamsCount})
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={sidebarSearch}
              onChange={e => setSidebarSearch(e.target.value)}
              placeholder="Ketik nama sekolah, no. undi, nomor dada, danton..."
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 transition-colors shadow-2xs"
            />
          </div>
        </div>

        {/* Daftar Peleton Scrollable */}
        <div className="p-5 overflow-y-auto space-y-2.5 flex-1 max-h-[50vh]">
          {verifiedTeams.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm text-slate-700 font-bold">
                Tidak ada peleton yang cocok dengan pencarian / siap dinilai.
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Pastikan peleton sudah melakukan <span className="text-teal-700 font-semibold">check-in Basecamp</span> pada sistem Staging Panitia.
              </p>
            </div>
          ) : (
            verifiedTeams.map(team => {
              const isSelected = selectedTeamId === team.id;
              const teamScore = scores[team.id];
              const juries = teamScore?.juries || {};
              const hasJuri1 = !!juries.pos1 || (teamScore?.pbb?.j1 !== undefined && teamScore?.pbb?.j1 !== null) || (teamScore?.pbb?.total !== undefined);
              const hasJuri2 = !!juries.pos2 || (teamScore?.pbb?.j2 !== undefined && teamScore?.pbb?.j2 !== null);
              const hasJuri3 = !!juries.pos3 || (teamScore?.danton?.total !== undefined);
              const isComplete = hasJuri1 && hasJuri2 && hasJuri3;
              const hasAny = hasJuri1 || hasJuri2 || hasJuri3;

              return (
                <div
                  key={team.id}
                  onClick={() => {
                    handleSelectTeam(team.id);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3.5 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Nomor Dada Badge */}
                    <div className={`w-12 h-12 rounded-xl font-mono font-black text-sm flex flex-col items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-xs'
                        : 'bg-slate-100 text-slate-900 border-slate-200'
                    }`}>
                      <span className="text-[8px] text-slate-500 font-sans font-bold leading-none">DADA</span>
                      <span className="leading-tight text-base">{team.chestNumber ? String(team.chestNumber).padStart(2, '0') : '-'}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm truncate">{team.schoolName}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                          Undi: #{team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '-'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 truncate block mt-0.5">
                        {team.platoonName} • Jenjang: <strong className="text-slate-700">{team.jenjang}</strong> • Danton: <span className="text-slate-800 font-semibold">{team.roster?.danton?.name || team.dantonName || '-'}</span>
                      </span>
                      
                      {/* Live Juri Status Badges */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                            hasJuri1 ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          J1 Teknik {hasJuri1 ? '✓' : '•'}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                            hasJuri2 ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          J2 Kekompakan {hasJuri2 ? '✓' : '•'}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                            hasJuri3 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          J3 Danton {hasJuri3 ? '✓' : '•'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Nilai / Skor Akhir */}
                  <div className="text-right shrink-0">
                    {teamScore?.isLocked ? (
                      <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl block">
                        🔒 FINAL ({teamScore.finalScore} pt)
                      </span>
                    ) : isComplete ? (
                      <span className="text-xs font-mono font-black bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl block">
                        {teamScore?.finalScore ?? 0} <span className="text-[10px] font-normal">pt</span>
                      </span>
                    ) : hasAny ? (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl block">
                        Sebagian
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl block border border-slate-200">
                        Belum Dinilai
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Klik baris peleton untuk langsung membuka lembar formulir penilaian.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
