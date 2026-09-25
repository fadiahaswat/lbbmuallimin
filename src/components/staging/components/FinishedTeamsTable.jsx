import React from 'react';
import { STAGING_CONFIG } from '../../../config.js';

export default function FinishedTeamsTable({
  eligibleTeams,
  staging,
  stageCounts,
  formatTime,
  handleMoveStage
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h3 className="font-black text-base uppercase text-slate-900">Riwayat Peleton yang Selesai Tampil</h3>
          <p className="text-xs text-slate-500">Data durasi tampil dan penalti kelebihan waktu lapangan</p>
        </div>
        <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
          {stageCounts['finished'] || 0} Peleton Selesai
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] bg-slate-50">
              <th className="py-2.5 px-3">No. Undi</th>
              <th className="py-2.5 px-3">Peleton & Sekolah</th>
              <th className="py-2.5 px-3">Jenjang</th>
              <th className="py-2.5 px-3">Durasi Tampil</th>
              <th className="py-2.5 px-3">Status Waktu</th>
              <th className="py-2.5 px-3">Penalti Overtime</th>
              <th className="py-2.5 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {eligibleTeams.filter(t => {
              const currentStage = staging[t.id]?.stage || 'waiting';
              return currentStage === 'finished' || currentStage === 'checkout';
            }).map(team => {
              const s = staging[team.id] || {};
              const duration = s.durationSeconds || 0;
              const otBlocks = s.overtimePenaltyBlocks || 0;
              const penaltyPoints = otBlocks * STAGING_CONFIG.PENALTY_OVERTIME_PER_30_SEC;

              return (
                <tr key={team.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-amber-700">
                    {team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '--'}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{team.schoolName}</div>
                    <div className="text-[10px] text-slate-500">{team.platoonName}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-bold">{team.jenjang}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    {formatTime(duration)}
                  </td>
                  <td className="py-3 px-3">
                    {otBlocks > 0 ? (
                      <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Overtime (+{otBlocks * 30}s)
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Tepat Waktu
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-rose-600">
                    {penaltyPoints > 0 ? `-${penaltyPoints} Poin` : '0 Poin'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleMoveStage(team, 'dp3')}
                      className="text-[10px] text-slate-500 hover:text-indigo-600 font-medium underline cursor-pointer"
                    >
                      Kembalikan ke DP3
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
