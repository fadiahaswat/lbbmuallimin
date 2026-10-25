import React from 'react';
import { DANTON_CRITERIA, DANTON_SCALE } from '../../../config.js';

export default function DantonScoringTable({
  dantonRubricScores = {},
  setDantonRubricScores,
  isInputDisabled,
  dantonTotal = 0,
  juryLabel = 'Dewan Juri',
}) {
  const ksItem = DANTON_SCALE.find(t => t.grade === 'KS');
  const kItems = DANTON_SCALE.filter(t => t.grade === 'K');
  const cItems = DANTON_SCALE.filter(t => t.grade === 'C');
  const bItems = DANTON_SCALE.filter(t => t.grade === 'B');
  const bsItem = DANTON_SCALE.find(t => t.grade === 'BS');

  const filledCount = Object.values(dantonRubricScores).filter(v => v !== null && v !== undefined).length;
  const isComplete = filledCount === DANTON_CRITERIA.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Bar Ringkas */}
      <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-black text-xs sm:text-sm text-slate-900 uppercase tracking-wide">
            Lembar Penilaian Komandan Peleton • {juryLabel}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
            isComplete
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}>
            {filledCount} / {DANTON_CRITERIA.length} Aspek Dinilai
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Formula Bobot: Materi 35% + Suara 25% + Sikap 20% + Lapangan 20%
          </span>
          <div className="bg-red-50 border border-red-200 px-3 py-1 rounded-xl text-right">
            <span className="text-[10px] font-bold text-red-700 uppercase mr-1">Skor Danton:</span>
            <span className="font-mono font-black text-sm text-red-800">{dantonTotal} Poin</span>
          </div>
        </div>
      </div>

      {/* Table Danton Checklist */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs">
            <tr className="border-b border-slate-200 text-xs font-black uppercase text-center">
              <th rowSpan={2} className="py-3 px-3 w-12 text-center text-slate-600 bg-slate-100 border-r border-slate-200">No</th>
              <th rowSpan={2} className="py-3 px-3 text-left text-slate-800 bg-slate-100 border-r border-slate-200 min-w-[200px]">Aspek Penilaian</th>
              <th rowSpan={2} className="py-3 px-2 text-center text-slate-700 bg-slate-100 border-r border-slate-200 w-16">Bobot</th>
              <th className="py-2 px-3 bg-slate-700 text-white border-r border-slate-600 text-center tracking-wider text-xs">KURANG SEKALI</th>
              <th className="py-2 px-3 bg-red-600 text-white border-r border-red-500 text-center tracking-wider text-xs">KURANG</th>
              <th className="py-2 px-3 bg-amber-500 text-slate-950 font-black border-r border-amber-400 text-center tracking-wider text-xs">CUKUP</th>
              <th className="py-2 px-3 bg-emerald-600 text-white border-r border-emerald-500 text-center tracking-wider text-xs">BAIK</th>
              <th className="py-2 px-3 bg-blue-600 text-white border-r border-blue-500 text-center tracking-wider text-xs">BAIK SEKALI</th>
              <th rowSpan={2} className="py-3 px-3 text-center w-24 bg-slate-100 text-slate-900 font-black text-sm">Nilai Mentah</th>
            </tr>
            <tr className="text-[11px] font-mono border-b border-slate-200 text-center">
              <th className="py-1 px-2 bg-slate-50 text-slate-700 border-r border-slate-200 font-semibold">KS (50)</th>
              <th className="py-1 px-2 bg-red-50 text-red-700 border-r border-slate-200 font-semibold">Taraf K</th>
              <th className="py-1 px-2 bg-amber-50 text-amber-800 border-r border-slate-200 font-semibold">Taraf C</th>
              <th className="py-1 px-2 bg-emerald-50 text-emerald-800 border-r border-slate-200 font-semibold">Taraf B</th>
              <th className="py-1 px-2 bg-blue-50 text-blue-800 border-r border-slate-200 font-semibold">BS (90)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {DANTON_CRITERIA.map((crit, idx) => {
              const selectedVal = dantonRubricScores[crit.id];

              return (
                <tr key={crit.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 text-center font-bold text-slate-500 border-r border-slate-200 text-xs sm:text-sm">{idx + 1}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900 border-r border-slate-200">
                    <div className="text-xs sm:text-sm font-bold">{crit.name}</div>
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-bold text-red-700 border-r border-slate-200 bg-red-50/20 text-xs sm:text-sm">
                    {crit.weightPercent}
                  </td>

                  {/* KURANG SEKALI (KS: 50) */}
                  <td className="py-2.5 px-2 text-center bg-slate-50/50 border-r border-slate-200">
                    {ksItem && (
                      <button
                        type="button"
                        disabled={isInputDisabled}
                        onClick={() => setDantonRubricScores(prev => ({ ...(prev || {}), [crit.id]: ksItem.val }))}
                        className={`min-w-[44px] sm:min-w-[48px] h-10 sm:h-11 py-1 px-2.5 rounded-xl text-sm sm:text-base font-mono font-black transition-all ${
                          isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                        } ${
                          selectedVal === ksItem.val
                            ? 'bg-slate-800 text-white shadow-md ring-2 ring-slate-400 scale-105'
                            : 'bg-white text-slate-700 hover:bg-slate-700 hover:text-white border-2 border-slate-300 shadow-2xs'
                        }`}
                      >
                        {ksItem.val}
                      </button>
                    )}
                  </td>

                  {/* KURANG (K: 54, 58, 62) */}
                  <td className="py-2.5 px-2 text-center bg-red-50/30 border-r border-slate-200">
                    <div className="flex items-center justify-center gap-1.5">
                      {kItems.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={isInputDisabled}
                          onClick={() => setDantonRubricScores(prev => ({ ...(prev || {}), [crit.id]: opt.val }))}
                          className={`min-w-[42px] sm:min-w-[46px] h-10 sm:h-11 py-1 px-2 rounded-xl text-sm sm:text-base font-mono font-black transition-all ${
                            isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                          } ${
                            selectedVal === opt.val
                              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400 scale-105'
                              : 'bg-white text-red-700 hover:bg-red-600 hover:text-white border-2 border-red-200 shadow-2xs'
                          }`}
                        >
                          {opt.val}
                        </button>
                      ))}
                    </div>
                  </td>

                  {/* CUKUP (C: 66, 70, 74) */}
                  <td className="py-2.5 px-2 text-center bg-amber-50/30 border-r border-slate-200">
                    <div className="flex items-center justify-center gap-1.5">
                      {cItems.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={isInputDisabled}
                          onClick={() => setDantonRubricScores(prev => ({ ...(prev || {}), [crit.id]: opt.val }))}
                          className={`min-w-[42px] sm:min-w-[46px] h-10 sm:h-11 py-1 px-2 rounded-xl text-sm sm:text-base font-mono font-black transition-all ${
                            isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                          } ${
                            selectedVal === opt.val
                              ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300 scale-105'
                              : 'bg-white text-amber-900 hover:bg-amber-500 hover:text-slate-950 border-2 border-amber-200 shadow-2xs'
                          }`}
                        >
                          {opt.val}
                        </button>
                      ))}
                    </div>
                  </td>

                  {/* BAIK (B: 78, 82, 86) */}
                  <td className="py-2.5 px-2 text-center bg-emerald-50/30 border-r border-slate-200">
                    <div className="flex items-center justify-center gap-1.5">
                      {bItems.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={isInputDisabled}
                          onClick={() => setDantonRubricScores(prev => ({ ...(prev || {}), [crit.id]: opt.val }))}
                          className={`min-w-[42px] sm:min-w-[46px] h-10 sm:h-11 py-1 px-2 rounded-xl text-sm sm:text-base font-mono font-black transition-all ${
                            isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                          } ${
                            selectedVal === opt.val
                              ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400 scale-105'
                              : 'bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white border-2 border-emerald-200 shadow-2xs'
                          }`}
                        >
                          {opt.val}
                        </button>
                      ))}
                    </div>
                  </td>

                  {/* BAIK SEKALI (BS: 90) */}
                  <td className="py-2.5 px-2 text-center bg-blue-50/30 border-r border-slate-200">
                    {bsItem && (
                      <button
                        type="button"
                        disabled={isInputDisabled}
                        onClick={() => setDantonRubricScores(prev => ({ ...(prev || {}), [crit.id]: bsItem.val }))}
                        className={`min-w-[44px] sm:min-w-[48px] h-10 sm:h-11 py-1 px-2.5 rounded-xl text-sm sm:text-base font-mono font-black transition-all ${
                          isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                        } ${
                          selectedVal === bsItem.val
                            ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400 scale-105'
                            : 'bg-white text-blue-800 hover:bg-blue-600 hover:text-white border-2 border-blue-200 shadow-2xs'
                        }`}
                      >
                        {bsItem.val}
                      </button>
                    )}
                  </td>

                  {/* Skor Mentah Terpilih */}
                  <td className="py-2.5 px-3 text-center font-mono font-black text-lg sm:text-xl text-slate-900 bg-slate-50">
                    {selectedVal ?? '-'}
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
