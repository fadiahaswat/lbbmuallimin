import React, { useState } from 'react';
import { Shield, ShieldCheck, Ruler, Copy, Check, FileDown, Sparkles, Map, Timer, Info, Download } from 'lucide-react';
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
    text += `LOMBA BARIS - BERBARIS MU'ALLIMIN TAHUN 2027\n`;
    text += `${spec}\n`;
    text += `========================================================\n\n`;
    text += `URUTAN GERAKAN MATERI LOMBA:\n`;
    list.forEach((item, idx) => {
      text += `${idx + 1}. ${item}\n`;
    });
    text += `\nKETERANGAN:\n`;
    if (isSD) {
      text += `a. **Materi Istirahat di Tempat (Perhatian) Komandan Peleton memberi arahan dengan tema LBB Mu’allimin 2027\n`;
    } else {
      text += `a. **Materi Berhimpun Komandan Peleton memberi arahan dengan tema LBB Mu’allimin 2027\n`;
    }
    text += `b. Gerakan materi dilaksanakan secara berurutan sesuai nomor;\n`;
    text += `c. Materi gerakan berantai bertanda strip ( – ) wajib dilaksanakan satu rangkaian tanpa gerakan tambahan;\n`;
    text += `d. Materi gerakan lomba sudah dibuat runtut. Komandan Peleton diperbolehkan melakukan gerakan penyesuaian tanpa pembatasan jumlah kuota, namun penggunaannya berpengaruh langsung terhadap penilaian aspek Penguasaan Lapangan Komandan Peleton;\n`;
    text += `e. Kebenaran teknik gerakan berpedoman pada Perpang TNI No. 58 dan 57 Tahun 2018, khusus pelaksanaan Hormat Kanan berpedoman pada Perpang TNI No. 45 Tahun 2014.\n`;
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

    const primaryColor = isSD ? '#991b1b' : '#1d4ed8';

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title} - LBB Mu'allimin 2027</title>
        <style>
          @page { size: A4 portrait; margin: 18mm 15mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #0f172a; margin: 0; padding: 10px; }
          .kop { text-align: center; border-bottom: 3px double ${primaryColor}; padding-bottom: 12px; margin-bottom: 20px; }
          .title { font-size: 16pt; font-weight: 900; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 0.5px; }
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
          <div class="sub">LOMBA BARIS – BERBARIS MU'ALLIMIN TAHUN 2027</div>
          <div class="spec">${spec}</div>
        </div>
        <h4>Urutan Gerakan Materi Wajib:</h4>
        <ol class="materi">
          ${list.map(item => `<li>${item}</li>`).join('')}
        </ol>
        <div class="rules">
          <strong>Keterangan:</strong>
          <ol type="a" class="ket">
            ${isSD ? `<li>**Materi Istirahat di Tempat (Perhatian) Komandan Peleton memberi arahan dengan tema LBB Mu’allimin 2027</li>` : `<li>**Materi Berhimpun Komandan Peleton memberi arahan dengan tema LBB Mu’allimin 2027</li>`}
            <li>Gerakan materi dilaksanakan secara berurutan sesuai nomor;</li>
            <li>Materi gerakan berantai bertanda strip ( – ) wajib dilaksanakan satu rangkaian tanpa gerakan tambahan;</li>
            <li>Materi gerakan lomba sudah dibuat runtut. Komandan Peleton diperbolehkan melakukan gerakan penyesuaian tanpa pembatasan jumlah kuota, namun penggunaannya berpengaruh langsung terhadap penilaian aspek Penguasaan Lapangan Komandan Peleton;</li>
            <li>Kebenaran teknik gerakan berpedoman pada Perpang TNI No. 58 dan 57 Tahun 2018, khusus pelaksanaan Hormat Kanan berpedoman pada Perpang TNI No. 45 Tahun 2014.</li>
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
    <section id="materi-lomba" className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden font-sans border-t border-slate-200">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-14 md:mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            Regulasi Resmi PBB
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4 leading-tight">
            Materi <span className="text-red-700">Lomba 2027</span>
          </h2>
          <div className="w-16 h-1 bg-red-700 mx-auto rounded-full mb-4"></div>
          <p className="text-slate-600 max-w-2xl mx-auto text-base font-normal leading-relaxed">
            Urutan gerakan wajib baris-berbaris sesuai Petunjuk Teknis Resmi LBB Mu’allimin 2027 berpedoman pada Perpang TNI.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* SD / MI Card */}
          <div className="relative group">
            <div className="relative bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 h-full shadow-sm hover:shadow-md transition-all">
              <div className="relative z-10 border-b border-slate-100 pb-5 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider mb-2">
                  Kategori Sekolah Dasar
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mb-1">
                  Materi Lomba Tingkat SD / MI
                </h3>
                <p className="text-xs text-slate-500 mb-4">Lomba Baris-Berbaris Mu’allimin 2027</p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="inline-flex items-center gap-2 bg-slate-100/80 border border-slate-200 px-3 py-1.5 rounded-lg">
                    <Ruler className="text-slate-600 w-4 h-4 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      {COMPETITION.SD.ARENA_SPEC_LABEL}
                    </span>
                  </div>

                  {/* Tombol Salin Materi & Unduh PDF */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy('SD')}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      title="Salin teks materi SD ke papan klip"
                    >
                      {copiedLevel === 'SD' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadPdf('SD')}
                      className="px-3.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                      title="Unduh / Cetak Materi Lomba SD (PDF)"
                    >
                      <FileDown className="w-3.5 h-3.5 text-white" />
                      <span>Unduh PDF</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative z-10 font-sans text-sm text-slate-700 leading-relaxed max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                <ol className="list-decimal list-outside pl-6 space-y-2.5">
                  {MATERIALS.SD.map((item, idx) => (
                    <li key={idx} className="hover:text-red-700 transition-colors">{item}</li>
                  ))}
                </ol>

                <div className="mt-8 pt-5 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 uppercase mb-2">Keterangan:</h4>
                  <ul className="space-y-1.5 list-[lower-alpha] list-outside pl-6 text-xs text-slate-600">
                    <li>**Materi Istirahat di Tempat (Perhatian) Komandan Peleton memberi arahan dengan tema LBB Mu’allimin 2027;</li>
                    <li>Gerakan materi dilaksanakan secara berurutan sesuai nomor;</li>
                    <li>Materi gerakan berantai bertanda strip ( – ) wajib dilaksanakan satu rangkaian tanpa gerakan tambahan;</li>
                    <li>Materi gerakan lomba sudah dibuat runtut. Komandan Peleton diperbolehkan melakukan gerakan penyesuaian tanpa pembatasan jumlah kuota, namun penggunaannya berpengaruh langsung terhadap penilaian aspek Penguasaan Lapangan Komandan Peleton;</li>
                    <li>Kebenaran teknik gerakan berpedoman pada Perpang TNI No. 58 dan 57 Tahun 2018, khusus pelaksanaan Hormat Kanan berpedoman pada Perpang TNI No. 45 Tahun 2014.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* SMP / MTs Card */}
          <div className="relative group">
            <div className="relative bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 h-full shadow-sm hover:shadow-md transition-all">
              <div className="relative z-10 border-b border-slate-100 pb-5 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
                  Kategori Sekolah Menengah
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mb-1">
                  Materi Lomba Tingkat SMP / MTs
                </h3>
                <p className="text-xs text-slate-500 mb-4">Lomba Baris-Berbaris Mu’allimin 2027</p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="inline-flex items-center gap-2 bg-slate-100/80 border border-slate-200 px-3 py-1.5 rounded-lg">
                    <Ruler className="text-slate-600 w-4 h-4 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      {COMPETITION.SMP.ARENA_SPEC_LABEL}
                    </span>
                  </div>

                  {/* Tombol Salin Materi & Unduh PDF */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy('SMP')}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      title="Salin teks materi SMP ke papan klip"
                    >
                      {copiedLevel === 'SMP' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadPdf('SMP')}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                      title="Unduh / Cetak Materi Lomba SMP (PDF)"
                    >
                      <FileDown className="w-3.5 h-3.5 text-white" />
                      <span>Unduh PDF</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative z-10 font-sans text-sm text-slate-700 leading-relaxed max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                <ol className="list-decimal list-outside pl-6 space-y-2.5">
                  {MATERIALS.SMP.map((item, idx) => (
                    <li key={idx} className="hover:text-blue-700 transition-colors">{item}</li>
                  ))}
                </ol>

                <div className="mt-8 pt-5 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 uppercase mb-2">Keterangan:</h4>
                  <ul className="space-y-1.5 list-[lower-alpha] list-outside pl-6 text-xs text-slate-600">
                    <li>**Materi Berhimpun Komandan Peleton memberi arahan dengan tema LBB Mu’allimin 2027;</li>
                    <li>Gerakan materi dilaksanakan secara berurutan sesuai nomor;</li>
                    <li>Materi gerakan berantai bertanda strip ( – ) wajib dilaksanakan satu rangkaian tanpa gerakan tambahan;</li>
                    <li>Materi gerakan lomba sudah dibuat runtut. Komandan Peleton diperbolehkan melakukan gerakan penyesuaian tanpa pembatasan jumlah kuota, namun penggunaannya berpengaruh langsung terhadap penilaian aspek Penguasaan Lapangan Komandan Peleton;</li>
                    <li>Kebenaran teknik gerakan berpedoman pada Perpang TNI No. 58 dan 57 Tahun 2018, khusus pelaksanaan Hormat Kanan berpedoman pada Perpang TNI No. 45 Tahun 2014.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Separate Containers for Denah Arena & Spesifikasi Pos */}
        <div className="mt-10 grid lg:grid-cols-2 gap-10">
          {/* Wadah Denah SD/MI */}
          <div className="relative group">
            <div className="relative bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 h-full flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="p-2 rounded-xl bg-red-50 text-red-700 border border-red-200 shrink-0">
                      <Map className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-lg font-black text-slate-900 uppercase tracking-wider">
                        Denah Arena & Spesifikasi Pos
                      </h4>
                      <p className="text-xs font-bold text-red-700 uppercase tracking-widest mt-0.5">Tingkat SD/MI Sederajat</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-800 text-xs font-bold font-mono shrink-0 whitespace-nowrap self-start sm:self-auto">
                    <Timer className="w-3.5 h-3.5 shrink-0" />
                    <span>{COMPETITION.SD.DURATION_LABEL}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-2 sm:p-4 text-center border border-slate-200 relative overflow-hidden group/arena mb-5 shadow-inner flex items-center justify-center min-h-[300px] sm:min-h-[360px]">
                  <img
                    src="/pos-sd.png"
                    alt="Denah Pos Arena SD/MI 25x14M"
                    className="w-full max-h-[340px] sm:max-h-[400px] object-contain mx-auto transition-transform duration-300 group-hover/arena:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <Info className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-amber-800 mr-1.5">Pergantian Pemain:</span>
                  <span>Dilakukan di dalam pos di antara <strong className="text-slate-900 font-bold">{COMPETITION.SD.SUBSTITUTION_LABEL}</strong>.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wadah Denah SMP/MTs */}
          <div className="relative group">
            <div className="relative bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 h-full flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                      <Map className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-lg font-black text-slate-900 uppercase tracking-wider">
                        Denah Arena & Spesifikasi Pos
                      </h4>
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mt-0.5">Tingkat SMP/MTs Sederajat</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold font-mono shrink-0 whitespace-nowrap self-start sm:self-auto">
                    <Timer className="w-3.5 h-3.5 shrink-0" />
                    <span>{COMPETITION.SMP.DURATION_LABEL}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-2 sm:p-4 text-center border border-slate-200 relative overflow-hidden group/arena mb-5 shadow-inner flex items-center justify-center min-h-[300px] sm:min-h-[360px]">
                  <img
                    src="/pos-smp.png"
                    alt="Denah Pos Arena SMP/MTs 26x15M"
                    className="w-full max-h-[340px] sm:max-h-[400px] object-contain mx-auto transition-transform duration-300 group-hover/arena:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <Info className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-amber-800 mr-1.5">Pergantian Pemain:</span>
                  <span>Dilakukan di dalam pos di antara <strong className="text-slate-900 font-bold">{COMPETITION.SMP.SUBSTITUTION_LABEL}</strong>.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
