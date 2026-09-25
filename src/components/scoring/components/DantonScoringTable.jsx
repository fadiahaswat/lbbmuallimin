import React from 'react';
import { DANTON_CRITERIA, RUBRIC_SCALE_TEMPLATES } from '../../../config.js';

export default function DantonScoringTable({
  dantonRubricScores,
  setDantonRubricScores,
  isInputDisabled,
  dantonTotal
}) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-red-700 tracking-wider bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
              Dewan Juri 3 • Komandan Peleton
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              Kriteria Resmi • {DANTON_CRITERIA.length} Aspek Penilaian
            </span>
          </div>
          <h4 className="font-black text-base text-slate-900 uppercase mt-1">
            Penilaian Komandan Peleton (Danton)
          </h4>
        </div>
        <div className="text-right bg-red-50 border border-red-200 px-4 py-2 rounded-2xl shrink-0">
          <span className="text-[10px] text-red-700 font-bold uppercase block">Subtotal Juri 3 (Danton)</span>
          <span className="font-mono font-black text-2xl text-red-700">{dantonTotal} <span className="text-xs font-normal text-slate-500">Poin</span></span>
        </div>
      </div>

      {/* Petunjuk Coret Nilai Danton */}
      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 text-[11px] text-slate-600 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-800">Skala Predikat:</span>
          <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white font-black text-[10px] shadow-xs">KURANG (Merah)</span>
          <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] shadow-xs">CUKUP (Kuning)</span>
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px] shadow-xs">BAIK (Hijau)</span>
          <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-black text-[10px] shadow-xs">SANGAT BAIK (Biru)</span>
        </div>
        <span className="text-slate-500 italic">Tap angka skor pada kolom warna untuk memilih nilai</span>
      </div>

      {/* Red Simpaskor Category Header Banner */}
      <div className="bg-red-700 text-white px-5 py-3 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="font-black text-xs sm:text-sm tracking-wide uppercase">
            LEMBAR PENILAIAN — KOMANDAN PELETON (DANTON)
          </span>
          <span className="bg-white/20 text-white text-[11px] font-mono px-2 py-0.5 rounded-full font-bold">
            {DANTON_CRITERIA.length} Kriteria
          </span>
        </div>
        <span className="text-[11px] text-red-100 font-medium hidden sm:inline">
          LBB Mu'allimin 2027
        </span>
      </div>

      {/* Table Danton Checklist */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-[560px] overflow-y-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs">
            <tr className="border-b border-slate-200 text-[11px] font-black uppercase text-center">
              <th rowSpan={2} className="py-2.5 px-3 w-12 text-center text-slate-600 bg-slate-100 border-r border-slate-200">No</th>
              <th rowSpan={2} className="py-2.5 px-3 text-left text-slate-800 bg-slate-100 border-r border-slate-200 min-w-[220px]">Kriteria Penilaian Danton</th>
              <th className="py-1.5 px-2 bg-red-600 text-white border-r border-red-500 text-center tracking-wider">KURANG</th>
              <th className="py-1.5 px-2 bg-amber-500 text-slate-950 font-black border-r border-amber-400 text-center tracking-wider">CUKUP</th>
              <th className="py-1.5 px-2 bg-emerald-600 text-white border-r border-emerald-500 text-center tracking-wider">BAIK</th>
              <th className="py-1.5 px-2 bg-blue-600 text-white border-r border-blue-500 text-center tracking-wider">SANGAT BAIK</th>
              <th rowSpan={2} className="py-2.5 px-3 text-center w-20 bg-slate-100 text-slate-900 font-black">Skor</th>
            </tr>
            <tr className="text-[10px] font-mono border-b border-slate-200 text-center">
              <th className="py-1 px-2 bg-red-50 text-red-700 border-r border-slate-200 font-semibold">Taraf K</th>
              <th className="py-1 px-2 bg-amber-50 text-amber-800 border-r border-slate-200 font-semibold">Taraf C</th>
              <th className="py-1 px-2 bg-emerald-50 text-emerald-800 border-r border-slate-200 font-semibold">Taraf B</th>
              <th className="py-1 px-2 bg-blue-50 text-blue-800 border-r border-slate-200 font-semibold">Taraf BS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {DANTON_CRITERIA.map((crit, idx) => {
              const template = RUBRIC_SCALE_TEMPLATES[crit.template] || RUBRIC_SCALE_TEMPLATES.DANTON_UMUM;
              const selectedVal = dantonRubricScores[crit.id];

              const kItems = template.filter(t => t.grade === 'K');
              const cItems = template.filter(t => t.grade === 'C');
              const bItems = template.filter(t => t.grade === 'B');
              const bsItems = template.filter(t => t.grade === 'BS');

              return (
                <tr key={crit.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-500 border-r border-slate-200">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 border-r border-slate-200">
                    <div className="text-xs sm:text-sm font-bold">{crit.name}</div>
                  </td>

                  {/* KURANG */}
                  <td className="py-2 px-2 text-center bg-red-50/40 border-r border-slate-200">
                    <div className="flex items-center justify-center gap-1">
                      {kItems.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={isInputDisabled}
                          onClick={() => setDantonRubricScores(prev => ({ ...prev, [crit.id]: opt.val }))}
                          className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                            isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                          } ${
                            selectedVal === opt.val
                              ? 'bg-red-600 text-white font-black shadow-sm ring-2 ring-red-400 scale-105'
                              : 'bg-white text-red-700 hover:bg-red-600 hover:text-white border border-red-200'
                          }`}
                        >
                          {opt.val}
                        </button>
                      ))}
                    </div>
                  </td>

                  {/* CUKUP */}
                  <td className="py-2 px-2 text-center bg-amber-50/40 border-r border-slate-200">
                    <div className="flex items-center justify-center gap-1">
                      {cItems.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={isInputDisabled}
                          onClick={() => setDantonRubricScores(prev => ({ ...prev, [crit.id]: opt.val }))}
                          className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                            isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                          } ${
                            selectedVal === opt.val
                              ? 'bg-amber-500 text-slate-950 font-black shadow-sm ring-2 ring-amber-300 scale-105'
                              : 'bg-white text-amber-800 hover:bg-amber-500 hover:text-slate-950 border border-amber-200'
                          }`}
                        >
                          {opt.val}
                        </button>
                      ))}
                    </div>
                  </td>

                  {/* BAIK */}
                  <td className="py-2 px-2 text-center bg-emerald-50/40 border-r border-slate-200">
                    <div className="flex items-center justify-center gap-1">
                      {bItems.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={isInputDisabled}
                          onClick={() => setDantonRubricScores(prev => ({ ...prev, [crit.id]: opt.val }))}
                          className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                            isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                          } ${
                            selectedVal === opt.val
                              ? 'bg-emerald-600 text-white font-black shadow-sm ring-2 ring-emerald-400 scale-105'
                              : 'bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200'
                          }`}
                        >
                          {opt.val}
                        </button>
                      ))}
                    </div>
                  </td>

                  {/* SANGAT BAIK */}
                  <td className="py-2 px-2 text-center bg-blue-50/40 border-r border-slate-200">
                    <div className="flex items-center justify-center gap-1">
                      {bsItems.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={isInputDisabled}
                          onClick={() => setDantonRubricScores(prev => ({ ...prev, [crit.id]: opt.val }))}
                          className={`min-w-8 py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                            isInputDisabled ? 'cursor-default' : 'cursor-pointer'
                          } ${
                            selectedVal === opt.val
                              ? 'bg-blue-600 text-white font-black shadow-sm ring-2 ring-blue-400 scale-105'
                              : 'bg-white text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200'
                          }`}
                        >
                          {opt.val}
                        </button>
                      ))}
                    </div>
                  </td>

                  {/* Skor Terpilih */}
                  <td className="py-2.5 px-3 text-center font-mono font-black text-base text-slate-900 bg-slate-50">
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
