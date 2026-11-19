import React, { useMemo, useState } from 'react';
import { CheckCircle2, Filter } from 'lucide-react';
import { parseMaterialsList } from '../../../config.js';

export default function PbbScoringTable({
  materialsList = [],
  rubricScores = {},
  setRubricScores,
  isInputDisabled,
  juryLabel = 'Dewan Juri',
}) {
  const [showOnlyUnfilled, setShowOnlyUnfilled] = useState(false);
  const parsedItems = useMemo(() => parseMaterialsList(materialsList), [materialsList]);

  const totalMovementsCount = useMemo(() => {
    return parsedItems.reduce((acc, it) => acc + it.movements.length, 0);
  }, [parsedItems]);

  // Hitung jumlah gerakan yang sudah dinilai
  const filledCount = useMemo(() => {
    let count = 0;
    parsedItems.forEach(it => {
      it.movements.forEach(m => {
        const val = rubricScores[m.key] !== undefined && rubricScores[m.key] !== null
          ? rubricScores[m.key]
          : (m.subIndex === 0 && rubricScores[it.originalIndex] !== undefined && rubricScores[it.originalIndex] !== null
              ? rubricScores[it.originalIndex]
              : null);
        if (val !== null && val !== undefined) count++;
      });
    });
    return count;
  }, [parsedItems, rubricScores]);

  const unfilledCount = Math.max(0, totalMovementsCount - filledCount);
  const isComplete = totalMovementsCount > 0 && filledCount === totalMovementsCount;
  const progressPct = totalMovementsCount > 0 ? Math.round((filledCount / totalMovementsCount) * 100) : 0;

  const displayedItems = useMemo(() => {
    if (!showOnlyUnfilled) return parsedItems;
    return parsedItems
      .map(it => {
        const unfilledMovements = it.movements.filter(m => {
          const val = rubricScores[m.key] !== undefined && rubricScores[m.key] !== null
            ? rubricScores[m.key]
            : (m.subIndex === 0 && rubricScores[it.originalIndex] !== undefined && rubricScores[it.originalIndex] !== null
                ? rubricScores[it.originalIndex]
                : null);
          return val === null || val === undefined;
        });
        if (unfilledMovements.length === 0) return null;
        return { ...it, movements: unfilledMovements };
      })
      .filter(Boolean);
  }, [parsedItems, showOnlyUnfilled, rubricScores]);

  const renderGradeButtons = (items, selectedVal, mKey, activeClass, hoverClass) => (
    <div className="flex items-center justify-center gap-1">
      {items.map((opt, oIdx) => {
        const isChosen = selectedVal === opt.val;
        return (
          <button
            key={oIdx}
            type="button"
            disabled={isInputDisabled}
            onClick={() => setRubricScores(prev => ({ ...(prev || {}), [mKey]: opt.val }))}
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
      {/* Top Bar Ringkas: Status Input, Filter Belum Dinilai & Slim Progress */}
      <div className="bg-slate-50/70 px-4 sm:px-5 py-2.5 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-extrabold text-xs sm:text-[13px] text-slate-900 uppercase tracking-wide">
            Lembar PBB · {juryLabel}
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold border ${
            isComplete
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {isComplete && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
            <span>{filledCount}/{totalMovementsCount}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {unfilledCount > 0 && (
            <button
              type="button"
              onClick={() => setShowOnlyUnfilled(prev => !prev)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                showOnlyUnfilled
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
              title="Tampilkan hanya gerakan yang belum diisi nilainya"
            >
              <Filter className="w-3 h-3" />
              <span>{showOnlyUnfilled ? `Semua (${totalMovementsCount})` : `Belum Diisi (${unfilledCount})`}</span>
            </button>
          )}
          <span className="text-[11px] text-slate-400 hidden md:inline">
            Sentuh angka · <strong className="text-rose-600">0</strong> = Terlewat
          </span>
        </div>
      </div>

      {/* Slim Progress Strip */}
      <div className="h-1 w-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${isComplete ? 'bg-emerald-500' : 'bg-blue-600'}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Clean Refined Scoring Matrix */}
      <div className="overflow-x-auto max-h-[560px] overflow-y-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="sticky top-0 z-20 shadow-[0_1px_0_rgba(226,232,240,1)]">
            <tr className="text-[10px] font-extrabold uppercase tracking-wider text-center">
              <th className="py-2.5 px-2.5 w-10 text-center text-slate-500 bg-slate-50 border-r border-slate-200/80">No</th>
              <th className="py-2.5 px-3 text-left text-slate-600 bg-slate-50 border-r border-slate-200/80 min-w-[200px]">Materi Gerakan</th>
              <th className="py-2.5 px-2 bg-rose-50/90 text-rose-700 border-t-2 border-t-rose-400 border-r border-slate-200/80 w-14">0 / TL</th>
              <th className="py-2.5 px-2 bg-slate-100/90 text-slate-700 border-t-2 border-t-slate-500 border-r border-slate-200/80">K. Sekali</th>
              <th className="py-2.5 px-2 bg-red-50/90 text-red-700 border-t-2 border-t-red-500 border-r border-slate-200/80">Kurang</th>
              <th className="py-2.5 px-2 bg-amber-50/90 text-amber-800 border-t-2 border-t-amber-400 border-r border-slate-200/80">Cukup</th>
              <th className="py-2.5 px-2 bg-emerald-50/90 text-emerald-800 border-t-2 border-t-emerald-500 border-r border-slate-200/80">Baik</th>
              <th className="py-2.5 px-2 bg-blue-50/90 text-blue-800 border-t-2 border-t-blue-500 border-r border-slate-200/80">B. Sekali</th>
              <th className="py-2.5 px-3 text-center w-20 bg-slate-50 text-slate-700">Skor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {displayedItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-xs text-emerald-700 font-bold bg-emerald-50/30">
                  Semua {totalMovementsCount} gerakan untuk {juryLabel} telah selesai dinilai!
                </td>
              </tr>
            ) : displayedItems.map((item) => {
              const isMulti = item.movements.length > 1;

              return item.movements.map((m, subIdx) => {
                const template = m.template;
                const selectedVal = rubricScores[m.key] !== undefined && rubricScores[m.key] !== null
                  ? rubricScores[m.key]
                  : (m.subIndex === 0 && rubricScores[item.originalIndex] !== undefined && rubricScores[item.originalIndex] !== null
                      ? rubricScores[item.originalIndex]
                      : null);

                const ksItems = template.filter(t => t.grade === 'KS');
                const kItems = template.filter(t => t.grade === 'K');
                const cItems = template.filter(t => t.grade === 'C');
                const bItems = template.filter(t => t.grade === 'B');
                const bsItems = template.filter(t => t.grade === 'BS');

                const isZero = selectedVal === 0;
                const isRowScored = selectedVal !== null && selectedVal !== undefined;

                return (
                  <tr
                    key={m.key}
                    className={`transition-colors ${
                      isRowScored
                        ? 'bg-emerald-50/20 hover:bg-emerald-50/35'
                        : isMulti && subIdx > 0
                        ? 'bg-slate-50/25 hover:bg-slate-50/70'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {subIdx === 0 && (
                      <td
                        rowSpan={item.movements.length}
                        className="py-2 px-2.5 text-center font-mono font-bold text-slate-400 border-r border-slate-100 text-xs bg-slate-50/40 align-middle"
                      >
                        {item.number}
                      </td>
                    )}
                    <td className="py-2 px-3 border-r border-slate-100">
                      <div className="text-xs sm:text-[13px] font-semibold text-slate-800 leading-snug">
                        {m.name}
                      </div>
                    </td>

                    {/* 0 / TL */}
                    <td className="py-1.5 px-1.5 text-center border-r border-slate-100">
                      <button
                        type="button"
                        disabled={isInputDisabled}
                        title={`Terlewat / Tidak Dilaksanakan (0) - ${m.name}`}
                        onClick={() => setRubricScores(prev => ({ ...(prev || {}), [m.key]: 0 }))}
                        className={`min-w-[36px] h-9 px-1.5 rounded-lg text-[13px] font-mono font-bold transition-all ${
                          isInputDisabled ? 'cursor-default' : 'cursor-pointer active:scale-95'
                        } ${
                          isZero
                            ? 'bg-rose-600 text-white shadow-xs scale-[1.04]'
                            : 'bg-white text-rose-600 border border-rose-200/80 hover:bg-rose-50 hover:border-rose-300'
                        }`}
                      >
                        0
                      </button>
                    </td>

                    {/* KS */}
                    <td className="py-1.5 px-1.5 text-center border-r border-slate-100">
                      {renderGradeButtons(
                        ksItems,
                        selectedVal,
                        m.key,
                        'bg-slate-800 text-white',
                        'hover:bg-slate-100 hover:border-slate-400'
                      )}
                    </td>

                    {/* K */}
                    <td className="py-1.5 px-1.5 text-center border-r border-slate-100">
                      {renderGradeButtons(
                        kItems,
                        selectedVal,
                        m.key,
                        'bg-red-600 text-white',
                        'hover:bg-red-50 hover:border-red-300 hover:text-red-700'
                      )}
                    </td>

                    {/* C */}
                    <td className="py-1.5 px-1.5 text-center border-r border-slate-100">
                      {renderGradeButtons(
                        cItems,
                        selectedVal,
                        m.key,
                        'bg-amber-500 text-slate-950',
                        'hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900'
                      )}
                    </td>

                    {/* B */}
                    <td className="py-1.5 px-1.5 text-center border-r border-slate-100">
                      {renderGradeButtons(
                        bItems,
                        selectedVal,
                        m.key,
                        'bg-emerald-600 text-white',
                        'hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800'
                      )}
                    </td>

                    {/* BS */}
                    <td className="py-1.5 px-1.5 text-center border-r border-slate-100">
                      {renderGradeButtons(
                        bsItems,
                        selectedVal,
                        m.key,
                        'bg-blue-600 text-white',
                        'hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800'
                      )}
                    </td>

                    {/* Skor Terpilih */}
                    <td className={`py-2 px-2.5 text-center font-mono font-black text-base ${
                      isZero
                        ? 'text-rose-600 bg-rose-50/50'
                        : isRowScored
                        ? 'text-emerald-700 bg-emerald-50/40'
                        : 'text-slate-300 bg-slate-50/40'
                    }`}>
                      {selectedVal ?? '—'}
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
