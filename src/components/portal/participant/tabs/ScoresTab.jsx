import React from 'react';
import { Clock } from 'lucide-react';

export default function ScoresTab({ teamScore }) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h4 className="font-black text-xl text-slate-900 uppercase italic">
          Lembar Rekapitulasi Nilai Dewan Juri
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Nilai resmi hasil penampilan peleton di arena LBB Mu'allimin 2026.
        </p>
      </div>

      {teamScore ? (
        <div className="space-y-6">
          {/* Total Score Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-red-950 text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 block mb-0.5">
                Total Nilai Akhir
              </span>
              <h5 className="text-3xl sm:text-4xl font-black text-yellow-400 font-mono">
                {teamScore.finalScore} <span className="text-sm font-sans text-slate-300 font-normal">Poin</span>
              </h5>
              <p className="text-xs text-slate-400 mt-1">
                Dinilai oleh: <strong className="text-white">{teamScore.juryName}</strong> ({teamScore.juryRole})
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-3 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Waktu Penilaian</span>
              <span className="text-xs font-bold text-white">
                {new Date(teamScore.scoredAt).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Score Breakdown Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Nilai Danton
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono">{teamScore.danton.total}</span>
              <div className="text-[11px] text-slate-600 mt-2 space-y-0.5 border-t border-slate-200 pt-2">
                <div className="flex justify-between"><span>Penguasaan:</span><strong>{teamScore.danton.penguasaan}</strong></div>
                <div className="flex justify-between"><span>Vokal:</span><strong>{teamScore.danton.vokal}</strong></div>
                <div className="flex justify-between"><span>Sikap:</span><strong>{teamScore.danton.sikap}</strong></div>
                <div className="flex justify-between"><span>Lapangan:</span><strong>{teamScore.danton.lapangan}</strong></div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Nilai Pasukan PBB
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono">{teamScore.pbb.total}</span>
              <div className="text-[11px] text-slate-600 mt-2 space-y-0.5 border-t border-slate-200 pt-2">
                <div className="flex justify-between"><span>Teknik (70%):</span><strong>{teamScore.pbb.teknik}</strong></div>
                <div className="flex justify-between"><span>Kekompakan (30%):</span><strong>{teamScore.pbb.kekompakan}</strong></div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Pengurangan Nilai (Penalti)
              </span>
              <span className={`text-2xl font-black font-mono ${teamScore.penalties.totalPenalty > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                -{teamScore.penalties.totalPenalty}
              </span>
              <div className="text-[11px] text-slate-600 mt-2 space-y-0.5 border-t border-slate-200 pt-2">
                <div className="flex justify-between"><span>Injak Garis:</span><strong>{teamScore.penalties.injakGarisCount}x</strong></div>
                <div className="flex justify-between"><span>Over Time:</span><strong>{teamScore.penalties.overTimeBlocks} block</strong></div>
              </div>
            </div>
          </div>

          {/* Jury Remarks */}
          {teamScore.notes && (
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 block mb-1">
                Evaluasi & Catatan Dewan Juri
              </span>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{teamScore.notes}"
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
          <Clock className="w-10 h-10 text-slate-400 mx-auto mb-2 animate-pulse" />
          <h5 className="font-bold text-slate-800 text-sm">Penilaian Belum Berlangsung</h5>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Dewan Juri akan melakukan input dan rekapitulasi penilaian pada saat hari pelaksanaan lomba (Ahad, 8 November 2026).
          </p>
        </div>
      )}
    </div>
  );
}
