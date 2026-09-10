import React from 'react';
import { Shield, ShieldCheck, Ruler } from 'lucide-react';
import { COMPETITION, MATERIALS } from '../config.js';

export default function MateriLomba() {
  return (
    <section id="materi-lomba" className="py-24 lg:py-32 bg-slate-950 relative overflow-hidden font-sans border-t border-slate-900">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <span className="text-yellow-500 font-bold tracking-[0.25em] text-xs uppercase mb-3 block">
            Regulasi Resmi PBB
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4 leading-tight py-1">
            Materi <span className="inline-block pr-3 sm:pr-4 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500">Lomba 2026</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm font-medium">
            Urutan Gerakan Wajib Sesuai Petunjuk Teknis Resmi LBB Mu’allimin 2026
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* SD / MI Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-900 to-slate-900 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>

            <div className="relative bg-slate-900 rounded-2xl border border-slate-800 p-8 h-full">
              <div className="absolute top-0 right-0 p-4 opacity-50">
                <Shield className="text-red-800 w-24 h-24 stroke-[0.5]" />
              </div>

              <div className="relative z-10 border-b border-slate-700 pb-6 mb-6">
                <h3 className="text-2xl font-black text-white leading-tight mb-2">
                  MATERI LOMBA<br />
                  <span className="text-red-500">TINGKAT SD/MI SEDERAJAT</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mb-4">LOMBA BARIS – BERBARIS MU’ALLIMIN TAHUN 2026</p>

                <div className="inline-flex items-center gap-3 bg-red-900/20 border border-red-500/30 px-4 py-2 rounded-lg">
                  <Ruler className="text-red-500 w-4 h-4" />
                  <span className="text-sm font-bold text-red-100 font-mono">
                    {COMPETITION.SD.ARENA_SPEC_LABEL}
                  </span>
                </div>
              </div>

              <div className="relative z-10 font-mono text-sm text-slate-300 leading-relaxed max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                <ol className="list-decimal list-outside pl-8 space-y-3">
                  {MATERIALS.SD.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>

                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <h4 className="text-xs font-bold text-red-500 uppercase mb-3">Keterangan:</h4>
                  <ul className="space-y-2 list-[lower-alpha] list-outside pl-8 text-xs text-slate-400">
                    <li>Gerakan materi dilaksanakan dalam formasi 3 saf, 7 banjar (7 trio);</li>
                    <li>Gerakan materi dilaksanakan secara berurutan sesuai nomor;</li>
                    <li>Materi gerakan berantai bertanda strip ( – ) wajib dilaksanakan satu rangkaian tanpa gerakan tambahan;</li>
                    <li>Materi gerakan lomba sudah dibuat runtut namun tetap diperbolehkan melakukan gerakan penyesuaian maksimal 3 aba-aba.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* SMP / MTs Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-yellow-900 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>

            <div className="relative bg-slate-900 rounded-2xl border border-slate-800 p-8 h-full">
              <div className="absolute top-0 right-0 p-4 opacity-50">
                <ShieldCheck className="text-blue-800 w-24 h-24 stroke-[0.5]" />
              </div>

              <div className="relative z-10 border-b border-slate-700 pb-6 mb-6">
                <h3 className="text-2xl font-black text-white leading-tight mb-2">
                  MATERI LOMBA<br />
                  <span className="text-blue-500">TINGKAT SMP/MTS SEDERAJAT</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mb-4">LOMBA BARIS – BERBARIS MU’ALLIMIN TAHUN 2026</p>

                <div className="inline-flex items-center gap-3 bg-blue-900/20 border border-blue-500/30 px-4 py-2 rounded-lg">
                  <Ruler className="text-blue-500 w-4 h-4" />
                  <span className="text-sm font-bold text-blue-100 font-mono">
                    {COMPETITION.SMP.ARENA_SPEC_LABEL}
                  </span>
                </div>
              </div>

              <div className="relative z-10 font-mono text-sm text-slate-300 leading-relaxed max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                <ol className="list-decimal list-outside pl-8 space-y-3">
                  {MATERIALS.SMP.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>

                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <h4 className="text-xs font-bold text-blue-500 uppercase mb-3">Keterangan:</h4>
                  <ul className="space-y-2 list-[lower-alpha] list-outside pl-8 text-xs text-slate-400">
                    <li>Gerakan materi dilaksanakan dalam formasi 3 saf, 7 banjar (7 trio);</li>
                    <li>Gerakan materi dilaksanakan secara berurutan sesuai nomor;</li>
                    <li>Materi gerakan berantai bertanda strip ( – ) wajib dilaksanakan satu rangkaian tanpa gerakan tambahan;</li>
                    <li>Materi gerakan lomba sudah dibuat runtut namun tetap diperbolehkan melakukan gerakan penyesuaian maksimal 3 aba-aba.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
