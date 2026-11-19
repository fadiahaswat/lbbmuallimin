import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { DANTON_CRITERIA, DANTON_SCALE } from '../../../config.js';

export default function DantonScoringTable({
  dantonRubricScores = {},
  setDantonRubricScores,
  isInputDisabled,
  dantonTotal = 0,
  juryLabel = 'Dewan Juri',
}) {
  const ksItems = DANTON_SCALE.filter(t => t.grade === 'KS');
  const kItems = DANTON_SCALE.filter(t => t.grade === 'K');
  const cItems = DANTON_SCALE.filter(t => t.grade === 'C');
  const bItems = DANTON_SCALE.filter(t => t.grade === 'B');
  const bsItems = DANTON_SCALE.filter(t => t.grade === 'BS');

  const filledCount = Object.values(dantonRubricScores).filter(v => v !== null && v !== undefined).length;
  const isComplete = filledCount === DANTON_CRITERIA.length;
  const progressPct = DANTON_CRITERIA.length > 0 ? Math.round((filledCount / DANTON_CRITERIA.length) * 100) : 0;

  const renderGradeButtons = (items, selectedVal, critId, activeClass, hoverClass) => (
    <div className="flex items-center justify-center gap-1">
      {items.map((opt, oIdx) => {
        const isChosen = selectedVal === opt.val;
        return (
          <button
            key={oIdx}
            type="button"
            disabled={isInputDisabled}
            onClick={() => setDantonRubricScores(prev => ({ ...(prev || {}), [critId]: opt.val }))}
            className={`min-w-[38px] sm:min-w-[42px] h-9 px-1.5 rounded-lg text-[13px] font-mono font-bold transition-all ${
              isInputDisabled ? 'cursor-default' : 'cursor-pointer active:scale-95'
            } ${
              isChosen
                ? `${activeClass} shadow-xs scale-[1.04]`
                : `bg-white text-slate-700 border border-slate-200/90 ${hoverClass}`
            }`}
          >
            {opt.val}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Top Bar Ringkas */}
      <div className="bg-slate-50/70 px-4 sm:px-5 py-2.5 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-extrabold text-xs sm:text-[13px] text-slate-900 uppercase tracking-wide">
            Lembar Danton · {juryLabel}
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold border ${
            isComplete
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {isComplete && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
            <span>{filledCount}/{DANTON_CRITERIA.length}</span>
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11px] text-slate-400 hidden lg:inline">
            Bobot: Materi 35% · Suara 25% · Sikap 20% · Lapangan 20%
          </span>
          <div className="inline-flex items-baseline gap-1.5 bg-white border border-slate-200/90 px-2.5 py-1 rounded-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skor</span>
            <span className="font-mono font-black text-xs sm:text-sm text-slate-900">{dantonTotal}</span>
          </div>
        </div>
      </div>

      {/* Slim Progress Strip */}
      <div className="h-1 w-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${isComplete ? 'bg-emerald-500' : 'bg-blue-600'}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Clean Refined Danton Matrix */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="sticky top-0 z-20 shadow-[0_1px_0_rgba(226,232,240,1)]">
            <tr className="text-[10px] font-extrabold uppercase tracking-wider text-center">
              <th className="py-2.5 px-2.5 w-10 text-center text-slate-500 bg-slate-50 border-r border-slate-200/80">No</th>
              <th className="py-2.5 px-3 text-left text-slate-600 bg-slate-50 border-r border-slate-200/80 min-w-[200px]">Aspek Penilaian</th>
              <th className="py-2.5 px-2 text-center text-slate-500 bg-slate-50 border-r border-slate-200/80 w-16">Bobot</th>
              <th className="py-2.5 px-2 bg-slate-100/90 text-slate-700 border-t-2 border-t-slate-500 border-r border-slate-200/80">K. Sekali</th>
              <th className="py-2.5 px-2 bg-red-50/90 text-red-700 border-t-2 border-t-red-500 border-r border-slate-200/80">Kurang</th>
              <th className="py-2.5 px-2 bg-amber-50/90 text-amber-800 border-t-2 border-t-amber-400 border-r border-slate-200/80">Cukup</th>
              <th className="py-2.5 px-2 bg-emerald-50/90 text-emerald-800 border-t-2 border-t-emerald-500 border-r border-slate-200/80">Baik</th>
              <th className="py-2.5 px-2 bg-blue-50/90 text-blue-800 border-t-2 border-t-blue-500 border-r border-slate-200/80">B. Sekali</th>
              <th className="py-2.5 px-3 text-center w-20 bg-slate-50 text-slate-700">Skor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {DANTON_CRITERIA.map((crit, idx) => {
              const selectedVal = dantonRubricScores[crit.id];
              const isRowScored = selectedVal !== null && selectedVal !== undefined;

              return (
                <tr
                  key={crit.id}
                  className={`transition-colors ${
                    isRowScored
                      ? 'bg-emerald-50/20 hover:bg-emerald-50/35'
                      : 'hover:bg-slate-50/70'
                  }`}
                >
                  <td className="py-2.5 px-2.5 text-center font-mono font-bold text-slate-400 border-r border-slate-100 text-xs bg-slate-50/40">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-100">
                    <div className="text-xs sm:text-[13px] font-semibold text-slate-800 leading-snug">
                      {crit.name}
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center border-r border-slate-100">
                    <span className="inline-block px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono font-bold text-[11px]">
                      {crit.weightPercent}
                    </span>
                  </td>

                  {/* KURANG SEKALI */}
                  <td className="py-1.5 px-1.5 text-center border-r border-slate-100">
                    {renderGradeButtons(
                      ksItems,
                      selectedVal,
                      crit.id,
                      'bg-slate-800 text-white border border-slate-800',
                      'hover:bg-slate-100 hover:border-slate-300'
                    )}
                  </td>

                  {/* KURANG */}
                  <td className="py-1.5 px-1.5 text-center border-r border-slate-100">
                    {renderGradeButtons(
                      kItems,
                      selectedVal,
                      crit.id,
                      'bg-red-600 text-white border border-red-600',
                      'hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                    )}
                  </td>

                  {/* CUKUP */}
                  <td className="py-1.5 px-1.5 text-center border-r border-slate-100">
                    {renderGradeButtons(
                      cItems,
                      selectedVal,
                      crit.id,
                      'bg-amber-500 text-slate-950 border border-amber-500',
                      'hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300'
                    )}
                  </td>

                  {/* BAIK */}
                  <td className="py-1.5 px-1.5 text-center border-r border-slate-100">
                    {renderGradeButtons(
                      bItems,
                      selectedVal,
                      crit.id,
                      'bg-emerald-600 text-white border border-emerald-600',
                      'hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300'
                    )}
                  </td>

                  {/* BAIK SEKALI */}
                  <td className="py-1.5 px-1.5 text-center border-r border-slate-100">
                    {renderGradeButtons(
                      bsItems,
                      selectedVal,
                      crit.id,
                      'bg-blue-600 text-white border border-blue-600',
                      'hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300'
                    )}
                  </td>

                  {/* Skor Terpilih */}
                  <td className="py-2 px-3 text-center font-mono font-black text-sm sm:text-base bg-slate-50/40">
                    <span className={isRowScored ? 'text-slate-900' : 'text-slate-300'}>
                      {selectedVal ?? '—'}
                    </span>
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
