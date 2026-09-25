import React from 'react';
import { ClipboardCheck, Clock, DoorOpen, ArrowRight, Tablet, Play } from 'lucide-react';

export default function PipelineKanbanView({
  eligibleTeams,
  staging,
  stageCounts,
  handleMoveStage,
  setSelectedDP1TeamId,
  setActiveViewMode
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {/* COLUMN 1: DP 1 (Inspeksi Personel & Absensi) */}
      <div className="bg-slate-100 border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase text-slate-900">DP 1: Inspeksi Foto</h3>
              <span className="text-[10px] text-slate-500">Verifikasi 25 personel via Tab</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
            {stageCounts['dp1'] || 0}
          </span>
        </div>

        <div className="space-y-3 min-h-[160px]">
          {eligibleTeams.filter(t => {
            const currentStage = staging[t.id]?.stage || 'waiting';
            return currentStage === 'dp1' || currentStage === 'waiting' || currentStage === 'basecamp';
          }).map(team => {
            const currentStage = staging[team.id]?.stage || 'waiting';
            return (
              <div
                key={team.id}
                className="bg-white border border-slate-200 hover:border-slate-300 p-4 rounded-2xl space-y-3 shadow-xs transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      No. {team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '--'} • {team.jenjang}
                    </span>
                    <h4 className="font-black text-sm text-slate-900 mt-1.5">{team.schoolName}</h4>
                    <p className="text-xs text-slate-500">{team.platoonName}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    currentStage === 'dp1' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {currentStage === 'dp1' ? 'Di DP 1' : (currentStage === 'basecamp' ? 'Basecamp' : 'Standby')}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  {currentStage !== 'dp1' ? (
                    <button
                      onClick={() => handleMoveStage(team, 'dp1')}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Panggil ke DP 1</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedDP1TeamId(team.id);
                        setActiveViewMode('dp1');
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Tablet className="w-3.5 h-3.5" />
                      <span>Buka Inspeksi Tab</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* COLUMN 2: DP 2 (Ruang Tunggu Steril) */}
      <div className="bg-slate-100 border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase text-slate-900">DP 2: Ruang Tunggu Steril</h3>
              <span className="text-[10px] text-slate-500">Peleton steril menunggu giliran tampil</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
            {stageCounts['dp2'] || 0}
          </span>
        </div>

        <div className="space-y-3 min-h-[160px]">
          {eligibleTeams.filter(t => (staging[t.id]?.stage || 'waiting') === 'dp2').map(team => {
            return (
              <div
                key={team.id}
                className="bg-white border border-amber-200 p-4 rounded-2xl space-y-3 shadow-xs transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      No. {team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '--'} • {team.jenjang}
                    </span>
                    <h4 className="font-black text-sm text-slate-900 mt-1.5">{team.schoolName}</h4>
                    <p className="text-xs text-slate-500">{team.platoonName}</p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Tunggu Steril
                  </span>
                </div>

                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                  Personel lengkap & terverifikasi di DP 1. Menunggu dipanggil ke DP 3.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleMoveStage(team, 'dp3')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Kirim ke DP 3</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* COLUMN 3: DP 3 (Pintu Masuk Lapangan) */}
      <div className="bg-slate-100 border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <DoorOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase text-slate-900">DP 3: Pintu Masuk</h3>
              <span className="text-[10px] text-slate-500">Siap melangkah ke kotak arena</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
            {stageCounts['dp3'] || 0}
          </span>
        </div>

        <div className="space-y-3 min-h-[160px]">
          {eligibleTeams.filter(t => (staging[t.id]?.stage || 'waiting') === 'dp3').map(team => {
            return (
              <div
                key={team.id}
                className="bg-white border border-indigo-200 p-4 rounded-2xl space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      No. {team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '--'} • {team.jenjang}
                    </span>
                    <h4 className="font-black text-sm text-slate-900 mt-1.5">{team.schoolName}</h4>
                    <p className="text-xs text-slate-500">{team.platoonName}</p>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Siap Tampil
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleMoveStage(team, 'arena')}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Mulai Tampil (Masuk Arena)</span>
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
