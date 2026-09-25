import React from 'react';
import { RUBRIC_SCALE_TEMPLATES, getScaleTemplateForMaterial } from '../../../config.js';

export default function PbbScoringTable({
  materialsList,
  rubricScores,
  setRubricScores,
  isInputDisabled,
  juryPost = 'pos1', // 'pos1' (Teknik) | 'pos2' (Kekompakan)
}) {
  const isPos1 = juryPost === 'pos1';
  const themeColor = isPos1 ? 'blue' : 'purple';
  const categoryTitle = isPos1 ? 'PBB TEKNIK' : 'KEKOMPAKAN PASUKAN';
  const tableTitle = isPos1 ? 'LEMBAR PENILAIAN — PBB TEKNIK' : 'LEMBAR PENILAIAN — KEKOMPAKAN PASUKAN';
  const thLabel = isPos1 ? 'Materi Penilaian' : 'Materi Penilaian Kekompakan';

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
      {/* Red Simpaskor Category Header Banner */}
      <div className="bg-red-700 text-white px-5 py-3 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="font-black text-xs sm:text-sm tracking-wide uppercase">
            {tableTitle}
          </span>
          <span className="bg-white/20 text-white text-[11px] font-mono px-2 py-0.5 rounded-full font-bold">
            {materialsList.length} Materi
          </span>
        </div>
        <span className="text-[11px] text-red-100 font-medium hidden sm:inline">
          LBB Mu'allimin 2027
        </span>
      </div>

      {/* Tabel Checklist Materi Gerakan PBB bergaya Simpaskor */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-[560px] overflow-y-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs">
            {/* Baris 1: Header Utama Kategori Predikat Warna */}
            <tr className="border-b border-slate-200 text-[11px] font-black uppercase text-center">
              <th rowSpan={2} className="py-2.5 px-3 w-12 text-center text-slate-600 bg-slate-100 border-r border-slate-200">No</th>
              <th rowSpan={2} className="py-2.5 px-3 text-left text-slate-800 bg-slate-100 border-r border-slate-200 min-w-[220px]">{thLabel}</th>
              <th className="py-1.5 px-2 bg-red-600 text-white border-r border-red-500 text-center tracking-wider">KURANG</th>
              <th className="py-1.5 px-2 bg-amber-500 text-slate-950 font-black border-r border-amber-400 text-center tracking-wider">CUKUP</th>
              <th className="py-1.5 px-2 bg-emerald-600 text-white border-r border-emerald-500 text-center tracking-wider">BAIK</th>
              <th className="py-1.5 px-2 bg-blue-600 text-white border-r border-blue-500 text-center tracking-wider">SANGAT BAIK</th>
              <th rowSpan={2} className="py-2.5 px-3 text-center w-20 bg-slate-100 text-slate-900 font-black">Skor</th>
            </tr>
            {/* Baris 2: Sub-info predikat */}
            <tr className="text-[10px] font-mono border-b border-slate-200 text-center">
              <th className="py-1 px-2 bg-red-50 text-red-700 border-r border-slate-200 font-semibold">Taraf K</th>
              <th className="py-1 px-2 bg-amber-50 text-amber-800 border-r border-slate-200 font-semibold">Taraf C</th>
              <th className="py-1 px-2 bg-emerald-50 text-emerald-800 border-r border-slate-200 font-semibold">Taraf B</th>
              <th className="py-1 px-2 bg-blue-50 text-blue-800 border-r border-slate-200 font-semibold">Taraf BS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {materialsList.map((materiText, idx) => {
              const templateKey = getScaleTemplateForMaterial(materiText);
              const template = RUBRIC_SCALE_TEMPLATES[templateKey] || RUBRIC_SCALE_TEMPLATES.DITEMPAT;
              const selectedVal = rubricScores[idx];

              // Kelompokkan nilai per grade: K, C, B, BS
              const kItems = template.filter(t => t.grade === 'K');
              const cItems = template.filter(t => t.grade === 'C');
              const bItems = template.filter(t => t.grade === 'B');
              const bsItems = template.filter(t => t.grade === 'BS');

              return (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-500 border-r border-slate-200">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 border-r border-slate-200">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{materiText}</div>
                    <div className={`text-[10px] font-mono font-medium mt-0.5 ${isPos1 ? 'text-blue-600' : 'text-purple-700'}`}>
                      Kategori: {templateKey.replace('_', ' ')}
                    </div>
                  </td>

                  {/* Kolom KURANG (Merah) */}
                  <td className="py-2 px-2 text-center bg-red-50/40 border-r border-slate-200">
                    <div className="flex items-center justify-center gap-1">
                      {kItems.map((opt, oIdx) => {
                        const isChosen = selectedVal === opt.val;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={isInputDisabled}
                            onClick={() => setRubricScores(prev => ({ ...prev, [idx]: opt.val }))}
                            className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                            } ${
                              isChosen
                                ? 'bg-red-600 text-white font-black shadow-sm ring-2 ring-red-400 scale-105'
                                : 'bg-white text-red-700 hover:bg-red-600 hover:text-white border border-red-200'
                            }`}
                          >
                            {opt.val}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Kolom CUKUP (Kuning) */}
                  <td className="py-2 px-2 text-center bg-amber-50/40 border-r border-slate-200">
                    <div className="flex items-center justify-center gap-1">
                      {cItems.map((opt, oIdx) => {
                        const isChosen = selectedVal === opt.val;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={isInputDisabled}
                            onClick={() => setRubricScores(prev => ({ ...prev, [idx]: opt.val }))}
                            className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                            } ${
                              isChosen
                                ? 'bg-amber-500 text-slate-950 font-black shadow-sm ring-2 ring-amber-300 scale-105'
                                : 'bg-white text-amber-800 hover:bg-amber-500 hover:text-slate-950 border border-amber-200'
                            }`}
                          >
                            {opt.val}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Kolom BAIK (Hijau) */}
                  <td className="py-2 px-2 text-center bg-emerald-50/40 border-r border-slate-200">
                    <div className="flex items-center justify-center gap-1">
                      {bItems.map((opt, oIdx) => {
                        const isChosen = selectedVal === opt.val;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={isInputDisabled}
                            onClick={() => setRubricScores(prev => ({ ...prev, [idx]: opt.val }))}
                            className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                            } ${
                              isChosen
                                ? 'bg-emerald-600 text-white font-black shadow-sm ring-2 ring-emerald-400 scale-105'
                                : 'bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200'
                            }`}
                          >
                            {opt.val}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Kolom SANGAT BAIK (Biru) */}
                  <td className="py-2 px-2 text-center bg-blue-50/40 border-r border-slate-200">
                    <div className="flex items-center justify-center gap-1">
                      {bsItems.map((opt, oIdx) => {
                        const isChosen = selectedVal === opt.val;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={isInputDisabled}
                            onClick={() => setRubricScores(prev => ({ ...prev, [idx]: opt.val }))}
                            className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                              isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                            } ${
                              isChosen
                                ? 'bg-blue-600 text-white font-black shadow-sm ring-2 ring-blue-400 scale-105'
                                : 'bg-white text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200'
                            }`}
                          >
                            {opt.val}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Nilai Terpilih */}
                  <td className="py-2 px-3 text-center font-mono font-black text-base text-slate-900 bg-slate-50">
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
