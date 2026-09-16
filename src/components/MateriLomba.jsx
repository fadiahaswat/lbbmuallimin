import React, { useState } from 'react';
import { Shield, ShieldCheck, Ruler, Copy, Check, FileDown, Sparkles } from 'lucide-react';
import { COMPETITION, MATERIALS } from '../config.js';

export default function MateriLomba() {
  const [copiedLevel, setCopiedLevel] = useState(null);

  // Helper untuk format teks materi
  function generateTextMateri(level) {
    const isSD = level === 'SD';
    const title = isSD ? 'MATERI LOMBA TINGKAT SD/MI SEDERAJAT' : 'MATERI LOMBA TINGKAT SMP/MTS SEDERAJAT';
    const spec = isSD ? COMPETITION.SD.ARENA_SPEC_LABEL : COMPETITION.SMP.ARENA_SPEC_LABEL;
    const list = isSD ? MATERIALS.SD : MATERIALS.SMP;

    let text = `========================================================\n`;
    text += `${title}\n`;
    text += `LOMBA BARIS - BERBARIS MU'ALLIMIN TAHUN 2026\n`;
    text += `${spec}\n`;
    text += `========================================================\n\n`;
    text += `URUTAN GERAKAN MATERI LOMBA:\n`;
    list.forEach((item, idx) => {
      text += `${idx + 1}. ${item}\n`;
    });
    text += `\nKETERANGAN / KETENTUAN:\n`;
    text += `a. Gerakan materi dilaksanakan dalam formasi 3 saf, 7 banjar (7 trio);\n`;
    text += `b. Gerakan materi dilaksanakan secara berurutan sesuai nomor;\n`;
    text += `c. Materi gerakan berantai bertanda strip ( - ) wajib dilaksanakan satu rangkaian tanpa gerakan tambahan;\n`;
    text += `d. Materi gerakan lomba sudah dibuat runtut namun tetap diperbolehkan melakukan gerakan penyesuaian maksimal 3 aba-aba.\n`;
    text += `========================================================\n`;
    return text;
  }

  // Handler Salin Materi ke Clipboard
  function handleCopy(level) {
    const text = generateTextMateri(level);
    navigator.clipboard?.writeText(text);
    setCopiedLevel(level);
    setTimeout(() => setCopiedLevel(null), 2500);
  }

  // Handler Unduh PDF Materi Lomba
  function handleDownloadPdf(level) {
    const isSD = level === 'SD';
    const title = isSD ? 'MATERI LOMBA TINGKAT SD/MI SEDERAJAT' : 'MATERI LOMBA TINGKAT SMP/MTS SEDERAJAT';
    const spec = isSD ? COMPETITION.SD.ARENA_SPEC_LABEL : COMPETITION.SMP.ARENA_SPEC_LABEL;
    const list = isSD ? MATERIALS.SD : MATERIALS.SMP;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title} - LBB Mu'allimin 2026</title>
        <style>
          @page { size: A4 portrait; margin: 18mm 15mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #0f172a; margin: 0; padding: 10px; }
          .kop { text-align: center; border-bottom: 3px double #991b1b; padding-bottom: 12px; margin-bottom: 20px; }
          .title { font-size: 16pt; font-weight: 900; color: #991b1b; text-transform: uppercase; letter-spacing: 0.5px; }
          .sub { font-size: 11pt; font-weight: bold; color: #334155; margin-top: 4px; }
          .spec { display: inline-block; font-size: 10pt; font-weight: bold; color: #1e293b; background: #f1f5f9; border: 1px solid #cbd5e1; padding: 4px 12px; border-radius: 6px; margin-top: 8px; }
          h4 { margin: 16px 0 8px 0; font-size: 11pt; text-transform: uppercase; color: #1e293b; }
          ol.materi { margin: 0; padding-left: 24px; }
          ol.materi li { margin-bottom: 6px; font-weight: 500; font-size: 10.5pt; }
          .rules { margin-top: 24px; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 9.5pt; color: #475569; page-break-inside: avoid; }
          ol.ket { margin: 6px 0 0 0; padding-left: 20px; }
          ol.ket li { margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <div class="kop">
          <div class="title">${title}</div>
          <div class="sub">LOMBA BARIS – BERBARIS MU'ALLIMIN TAHUN 2026</div>
          <div class="spec">${spec}</div>
        </div>
        <h4>Urutan Gerakan Materi Wajib:</h4>
        <ol class="materi">
          ${list.map(item => `<li>${item}</li>`).join('')}
        </ol>
        <div class="rules">
          <strong>Keterangan & Ketentuan Pelaksanaan:</strong>
          <ol type="a" class="ket">
            <li>Gerakan materi dilaksanakan dalam formasi 3 saf, 7 banjar (7 trio);</li>
            <li>Gerakan materi dilaksanakan secara berurutan sesuai nomor;</li>
            <li>Materi gerakan berantai bertanda strip ( – ) wajib dilaksanakan satu rangkaian tanpa gerakan tambahan;</li>
            <li>Materi gerakan lomba sudah dibuat runtut namun tetap diperbolehkan melakukan gerakan penyesuaian maksimal 3 aba-aba.</li>
          </ol>
        </div>
        <script>
          window.onload = function() {
            window.focus();
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
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

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="inline-flex items-center gap-2.5 bg-red-900/25 border border-red-500/30 px-3.5 py-1.5 rounded-xl">
                    <Ruler className="text-red-500 w-4 h-4 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-red-100 font-mono">
                      {COMPETITION.SD.ARENA_SPEC_LABEL}
                    </span>
                  </div>

                  {/* Tombol Salin Materi & Unduh Word */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy('SD')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                      title="Salin teks materi SD ke papan klip"
                    >
                      {copiedLevel === 'SD' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Salin Materi</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadPdf('SD')}
                      className="px-3.5 py-1.5 rounded-xl bg-red-700/85 hover:bg-red-600 text-white border border-red-600/60 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-950/40 active:scale-95"
                      title="Unduh / Cetak Materi Lomba SD (PDF)"
                    >
                      <FileDown className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Download</span>
                    </button>
                  </div>
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

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="inline-flex items-center gap-2.5 bg-blue-900/25 border border-blue-500/30 px-3.5 py-1.5 rounded-xl">
                    <Ruler className="text-blue-500 w-4 h-4 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-blue-100 font-mono">
                      {COMPETITION.SMP.ARENA_SPEC_LABEL}
                    </span>
                  </div>

                  {/* Tombol Salin Materi & Download */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy('SMP')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                      title="Salin teks materi SMP ke papan klip"
                    >
                      {copiedLevel === 'SMP' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Salin Materi</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadPdf('SMP')}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-700/85 hover:bg-blue-600 text-white border border-blue-600/60 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-950/40 active:scale-95"
                      title="Unduh / Cetak Materi Lomba SMP (PDF)"
                    >
                      <FileDown className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Download</span>
                    </button>
                  </div>
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
