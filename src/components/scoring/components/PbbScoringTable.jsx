import React from 'react';
import { RUBRIC_SCALE_TEMPLATES, getScaleTemplateForMaterial } from '../../../config.js';

export default function PbbScoringTable({
  materialsList = [],
  rubricScores = {},
  setRubricScores,
  isInputDisabled,
  juryLabel = 'Dewan Juri',
}) {
  // Hitung jumlah materi yang sudah dinilai
  const filledCount = Object.values(rubricScores).filter(v => v !== null && v !== undefined).length;
  const isComplete = filledCount === materialsList.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Bar Ringkas: Status Input & Panduan Cepat */}
      <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-black text-xs sm:text-sm text-slate-900 uppercase tracking-wide">
            Lembar Penilaian Peleton • {juryLabel}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
            isComplete
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}>
            {filledCount} / {materialsList.length} Dinilai
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-medium">
          Sentuh angka untuk memilih nilai • <span className="font-bold text-rose-600">0</span> = Terlewat / Tidak Tampil
        </div>
      </div>

      {/* Tabel Checklist Materi Gerakan PBB */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs">
            {/* Baris 1: Header Predikat Resmi */}
            <tr className="border-b border-slate-200 text-xs font-black uppercase text-center">
              <th rowSpan={2} className="py-3 px-3 w-12 text-center text-slate-600 bg-slate-100 border-r border-slate-200">No</th>
              <th rowSpan={2} className="py-3 px-3 text-left text-slate-800 bg-slate-100 border-r border-slate-200 min-w-[220px]">Materi Gerakan Perlombaan</th>
              <th rowSpan={2} className="py-3 px-2 bg-rose-100 text-rose-900 border-r border-slate-200 text-center w-16">0 / TL</th>
              <th className="py-2 px-3 bg-slate-700 text-white border-r border-slate-600 text-center tracking-wider text-xs">KURANG SEKALI</th>
              <th className="py-2 px-3 bg-red-600 text-white border-r border-red-500 text-center tracking-wider text-xs">KURANG</th>
              <th className="py-2 px-3 bg-amber-500 text-slate-950 font-black border-r border-amber-400 text-center tracking-wider text-xs">CUKUP</th>
              <th className="py-2 px-3 bg-emerald-600 text-white border-r border-emerald-500 text-center tracking-wider text-xs">BAIK</th>
              <th className="py-2 px-3 bg-blue-600 text-white border-r border-blue-500 text-center tracking-wider text-xs">BAIK SEKALI</th>
              <th rowSpan={2} className="py-3 px-3 text-center w-24 bg-slate-100 text-slate-900 font-black text-sm">Skor</th>
            </tr>
            {/* Baris 2: Sub-info predikat */}
            <tr className="text-[11px] font-mono border-b border-slate-200 text-center">
              <th className="py-1 px-2 bg-slate-50 text-slate-700 border-r border-slate-200 font-semibold">Taraf KS (50-55-60)</th>
              <th className="py-1 px-2 bg-red-50 text-red-700 border-r border-slate-200 font-semibold">Taraf K</th>
              <th className="py-1 px-2 bg-amber-50 text-amber-800 border-r border-slate-200 font-semibold">Taraf C</th>
              <th className="py-1 px-2 bg-emerald-50 text-emerald-800 border-r border-slate-200 font-semibold">Taraf B</th>
              <th className="py-1 px-2 bg-blue-50 text-blue-800 border-r border-slate-200 font-semibold">Taraf BS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {materialsList.map((materiText, idx) => {
              const templateKey = getScaleTemplateForMaterial(materiText);
              const template = RUBRIC_SCALE_TEMPLATES[templateKey] || RUBRIC_SCALE_TEMPLATES.SEDERHANA;
              const selectedVal = rubricScores[idx];

              const ksItems = template.filter(t => t.grade === 'KS');
              const kItems = template.filter(t => t.grade === 'K');
              const cItems = template.filter(t => t.grade === 'C');
              const bItems = template.filter(t => t.grade === 'B');
              const bsItems = template.filter(t => t.grade === 'BS');

              const isZero = selectedVal === 0;

              return (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-500 border-r border-slate-200 text-xs sm:text-sm">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 border-r border-slate-200">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{materiText}</div>
                  </td>

                  {/* Tombol Cepat 0 (Terlewat / Tidak Dilaksanakan) */}
                  <td className="py-2 px-2 text-center bg-rose-50/30 border-r border-slate-200">
                    <button
                      type="button"
                      disabled={isInputDisabled}
                      title="Gerakan Terlewat / Tidak Dilaksanakan (Nilai 0)"
                      onClick={() => setRubricScores(prev => ({ ...(prev || {}), [idx]: 0 }))}
                      className={`min-w-[42px] sm:min-w-[46px] h-10 sm:h-11 py-1 px-2 rounded-xl text-sm sm:text-base font-mono font-black transition-all ${
                        isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                      } ${
                        isZero
                          ? 'bg-rose-700 text-white shadow-md ring-2 ring-rose-400 scale-105'
                          : 'bg-white text-rose-700 hover:bg-rose-700 hover:text-white border-2 border-rose-300 shadow-2xs'
                      }`}
                    >
                      0
                    </button>
                  </td>

                  {/* KURANG SEKALI (KS: 50, 55, 60) */}
                  <td className="py-2 px-2 text-center bg-slate-50/50 border-r border-slate-200">
                    <div className="flex items-center justify-center gap-1.5">
                      {ksItems.map((opt, oIdx) => {
                        const isChosen = selectedVal === opt.val;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={isInputDisabled}
                            onClick={() => setRubricScores(prev => ({ ...(prev || {}), [idx]: opt.val }))}
                            className={`min-w-[42px] sm:min-w-[46px] h-10 sm:h-11 py-1 px-2 rounded-xl text-sm sm:text-base font-mono font-black transition-all ${
                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                            } ${
                              isChosen
                                ? 'bg-slate-800 text-white shadow-md ring-2 ring-slate-400 scale-105'
                                : 'bg-white text-slate-700 hover:bg-slate-700 hover:text-white border-2 border-slate-300 shadow-2xs'
                            }`}
                          >
                            {opt.val}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Kolom KURANG (Merah) */}
                  <td className="py-2 px-2 text-center bg-red-50/30 border-r border-slate-200">
                    <div className="flex items-center justify-center gap-1.5">
                      {kItems.map((opt, oIdx) => {
                        const isChosen = selectedVal === opt.val;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={isInputDisabled}
                            onClick={() => setRubricScores(prev => ({ ...(prev || {}), [idx]: opt.val }))}
                            className={`min-w-[42px] sm:min-w-[46px] h-10 sm:h-11 py-1 px-2 rounded-xl text-sm sm:text-base font-mono font-black transition-all ${
                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                            } ${
                              isChosen
                                ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400 scale-105'
                                : 'bg-white text-red-700 hover:bg-red-600 hover:text-white border-2 border-red-200 shadow-2xs'
                            }`}
                          >
                            {opt.val}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Kolom CUKUP (Kuning) */}
                  <td className="py-2 px-2 text-center bg-amber-50/30 border-r border-slate-200">
                    <div className="flex items-center justify-center gap-1.5">
                      {cItems.map((opt, oIdx) => {
                        const isChosen = selectedVal === opt.val;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={isInputDisabled}
                            onClick={() => setRubricScores(prev => ({ ...(prev || {}), [idx]: opt.val }))}
                            className={`min-w-[42px] sm:min-w-[46px] h-10 sm:h-11 py-1 px-2 rounded-xl text-sm sm:text-base font-mono font-black transition-all ${
                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                            } ${
                              isChosen
                                ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300 scale-105'
                                : 'bg-white text-amber-900 hover:bg-amber-500 hover:text-slate-950 border-2 border-amber-200 shadow-2xs'
                            }`}
                          >
                            {opt.val}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Kolom BAIK (Hijau) */}
                  <td className="py-2 px-2 text-center bg-emerald-50/30 border-r border-slate-200">
                    <div className="flex items-center justify-center gap-1.5">
                      {bItems.map((opt, oIdx) => {
                        const isChosen = selectedVal === opt.val;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={isInputDisabled}
                            onClick={() => setRubricScores(prev => ({ ...(prev || {}), [idx]: opt.val }))}
                            className={`min-w-[42px] sm:min-w-[46px] h-10 sm:h-11 py-1 px-2 rounded-xl text-sm sm:text-base font-mono font-black transition-all ${
                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                            } ${
                              isChosen
                                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400 scale-105'
                                : 'bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white border-2 border-emerald-200 shadow-2xs'
                            }`}
                          >
                            {opt.val}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Kolom BAIK SEKALI (Biru) */}
                  <td className="py-2 px-2 text-center bg-blue-50/30 border-r border-slate-200">
                    <div className="flex items-center justify-center gap-1.5">
                      {bsItems.map((opt, oIdx) => {
                        const isChosen = selectedVal === opt.val;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={isInputDisabled}
                            onClick={() => setRubricScores(prev => ({ ...(prev || {}), [idx]: opt.val }))}
                            className={`min-w-[42px] sm:min-w-[46px] h-10 sm:h-11 py-1 px-2 rounded-xl text-sm sm:text-base font-mono font-black transition-all ${
                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                            } ${
                              isChosen
                                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400 scale-105'
                                : 'bg-white text-blue-800 hover:bg-blue-600 hover:text-white border-2 border-blue-200 shadow-2xs'
                            }`}
                          >
                            {opt.val}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Nilai Terpilih */}
                  <td className={`py-2.5 px-3 text-center font-mono font-black text-lg sm:text-xl ${
                    isZero ? 'text-rose-700 bg-rose-50/60' : 'text-slate-900 bg-slate-50'
                  }`}>
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
