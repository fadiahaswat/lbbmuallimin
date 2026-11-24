import React, { useState, useEffect } from 'react';
import {
  FileText,
  Users,
  Shield,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  Check,
  Eye,
  ExternalLink,
  X,
  FileCheck2
} from 'lucide-react';
import { formatImageUrl, getFallbackImageUrl } from '../../../../services/sheetService.js';
import UnduhanTab from './UnduhanTab.jsx';

export default function DocumentsTab({
  currentTeam,
  triggerFileUpload,
  setActiveTab,
  onOpenPactModal,
  isDownloadingPact,
  initialSubTab = 'upload'
}) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab || 'upload');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const isVerifiedOrDrawn = currentTeam?.status === 'verified' || currentTeam?.status === 'drawn';
  const docList = [
    {
      id: 'schoolLogo',
      index: '01',
      title: 'Logo Sekolah / Lambang Peleton',
      file: currentTeam?.files?.schoolLogo,
      accept: 'image/png,image/jpeg,image/webp',
      hint: 'Format PNG transparan beresolusi tinggi (Maks. 3 MB)',
      btnLabel: 'Unggah Logo'
    },
    {
      id: 'recommendationLetter',
      index: '02',
      title: 'Surat Tugas / Rekomendasi Kepala Sekolah',
      file: currentTeam?.files?.recommendationLetter,
      accept: '.pdf,image/jpeg,image/jpg',
      hint: 'Format PDF/JPG bertanda tangan & berstempel basah (Maks. 2 MB)',
      btnLabel: 'Unggah Surat'
    },
    {
      id: 'paymentProof',
      index: '03',
      title: 'Bukti Transfer Pembayaran BSI',
      file: currentTeam?.files?.paymentProof,
      accept: 'image/jpeg,image/png',
      hint: 'Format JPG/PNG struk ATM atau m-banking jelas (Maks. 2 MB)',
      btnLabel: 'Unggah Bukti'
    },
    {
      id: 'dantonCard',
      index: '04',
      title: 'Kartu Pelajar Komandan Peleton',
      file: currentTeam?.files?.dantonCard,
      accept: '.pdf,image/*',
      hint: 'Format Foto/PDF Kartu Pelajar sah (Maks. 3 MB)',
      btnLabel: 'Unggah Kartu'
    },
  ];

  const completedFiles = docList.filter(d => {
    const url = d.file?.url;
    return Boolean(url && url !== '#' && !url.startsWith('#'));
  }).length;

  const totalFiles = docList.length;
  const completion = Math.round((completedFiles / totalFiles) * 100);
  const actionRequired = totalFiles - completedFiles;

  return (
    <section className="rounded-2xl sm:rounded-[26px] border border-slate-200/80 bg-white p-4 sm:p-7 shadow-[0_18px_46px_rgba(15,23,42,0.06)] space-y-6">
      {/* Panel Header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
            {activeSubTab === 'upload' ? (
              <FileText className="w-5 h-5 text-amber-400" />
            ) : (
              <Download className="w-5 h-5 text-blue-400" />
            )}
          </span>
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
              {activeSubTab === 'upload' ? 'Pusat Berkas & Administrasi' : 'Pusat Unduhan Berkas Resmi'}
            </h2>
            <p className="text-xs text-slate-500">
              {activeSubTab === 'upload'
                ? 'Unggah atau perbarui berkas yang diminta oleh panitia verifikator administrasi.'
                : 'Unduh petunjuk teknis, regulasi juri, materi gerakan PBB, dan format resmi lomba.'}
            </p>
          </div>
        </div>

        {/* Sub-tab Switcher: Unggah Berkas vs Unduhan Resmi */}
        <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('upload')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'upload'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Upload className="w-3.5 h-3.5 shrink-0" />
            <span>Unggah<span className="hidden min-[380px]:inline"> Berkas</span></span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('download')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'download'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>Unduhan<span className="hidden min-[380px]:inline"> Resmi</span></span>
          </button>
        </div>
      </div>

      {activeSubTab === 'download' ? (
        <UnduhanTab
          currentTeam={currentTeam}
          onOpenPactModal={onOpenPactModal}
          isEmbedded={true}
        />
      ) : (
        <>
          {/* Verification Progress Hero Card (Figma Make Style) */}
          <div className="overflow-hidden rounded-[22px] bg-slate-950 text-white shadow-[0_16px_34px_rgba(15,23,42,0.16)]">
        <div className="grid sm:grid-cols-[1fr_auto]">
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-amber-400">
                VERIFICATION PROGRESS
              </p>
            </div>
            <h3 className="mt-2 text-base sm:text-lg font-black tracking-tight text-white">
              {completedFiles} dari {totalFiles} berkas telah siap
            </h3>
            <p className="mt-1 text-[10px] sm:text-xs leading-relaxed text-slate-400">
              {completedFiles === totalFiles
                ? 'Seluruh berkas siap untuk diproses dan diverifikasi oleh panitia sekretariat.'
                : 'Lengkapi berkas tersisa agar verifikasi administrasi peleton dapat disahkan.'}
            </p>
            <div className="mt-4 sm:mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-600 to-amber-400 transition-all duration-700 ease-out"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-white/10 sm:w-[260px] sm:border-l sm:border-t-0">
            {[
              { val: `${completion}%`, label: 'Kelengkapan' },
              { val: String(completedFiles).padStart(2, '0'), label: 'Terlampir' },
              { val: String(actionRequired).padStart(2, '0'), label: 'Tindakan' },
            ].map(m => (
              <div
                key={m.label}
                className="flex flex-col items-center justify-center border-r border-white/10 px-3 py-4 text-center last:border-r-0"
              >
                <p className="text-base sm:text-xl font-mono font-black text-white">{m.val}</p>
                <p className="mt-1 text-[7px] font-black uppercase tracking-wider text-slate-400">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Document Items */}
      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
        {docList.map(item => {
          const rawUrl = item.file?.url;
          const isAttached = Boolean(rawUrl && rawUrl !== '#' && !rawUrl.startsWith('#'));
          const fileName = item.file?.name || (isAttached ? 'Berkas Terunggah' : 'Belum Ada Berkas');
          const fileSize = item.file?.size || '';

          const fileExt = typeof fileName === 'string' && fileName.includes('.')
            ? fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
            : '';
          const isPdf = fileExt === '.pdf' || (typeof rawUrl === 'string' && (rawUrl.includes('.pdf') || rawUrl.startsWith('data:application/pdf')));
          const isImageExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(fileExt);
          const isImageCandidate = isAttached && !isPdf && typeof rawUrl === 'string' && (
            rawUrl.startsWith('data:image') ||
            rawUrl.startsWith('blob:') ||
            rawUrl.startsWith('http://') ||
            rawUrl.startsWith('https://') ||
            rawUrl.includes('googleusercontent.com') ||
            rawUrl.includes('drive.google.com') ||
            isImageExt
          );

          return (
            <article
              key={item.id}
              className={`group overflow-hidden rounded-2xl border bg-white transition-all duration-200 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] flex flex-col ${
                isAttached
                  ? 'border-slate-200/90 hover:border-slate-300'
                  : 'border-red-200/90 hover:border-red-300'
              }`}
            >
              {/* Top Status Hairline */}
              <div
                className={`h-1 w-full ${
                  isAttached ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />

              {/* Full-Bleed Preview / Dropzone Stage */}
              <div className="relative h-44 sm:h-48 w-full overflow-hidden border-b border-slate-100">
                {/* Floating Index Badge */}
                <span className="pointer-events-none absolute top-3 left-3 z-10 inline-flex items-center justify-center h-6 min-w-[28px] px-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-slate-200/80 font-mono text-[10.5px] font-black text-slate-700 shadow-2xs">
                  {item.index}
                </span>

                {/* Floating Status Badge */}
                <div className="pointer-events-none absolute top-3 right-3 z-10">
                  {isAttached ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50/95 backdrop-blur-sm border border-emerald-200/90 text-[10px] font-extrabold text-emerald-700 shadow-2xs">
                      <Check className="w-3 h-3 stroke-[2.75]" />
                      <span>{isVerifiedOrDrawn ? 'Terverifikasi' : 'Terlampir'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50/95 backdrop-blur-sm border border-red-200/90 text-[10px] font-extrabold text-red-700 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span>Wajib Diunggah</span>
                    </span>
                  )}
                </div>

                {isAttached ? (
                  <button
                    type="button"
                    onClick={() => setPreviewDoc({ ...item, isPdf, isImageCandidate })}
                    className="w-full h-full relative flex items-center justify-center bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:14px_14px] bg-slate-50/80 p-5 pt-9 cursor-pointer group/preview text-left"
                    title="Klik untuk melihat preview berkas"
                  >
                    {isImageCandidate && !imgErrors[item.id] ? (
                      <img
                        src={formatImageUrl(rawUrl)}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const fallback = getFallbackImageUrl(rawUrl);
                          if (fallback && e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback;
                          } else {
                            setImgErrors(prev => ({ ...prev, [item.id]: true }));
                          }
                        }}
                        className="max-h-full max-w-full object-contain drop-shadow-sm group-hover/preview:scale-[1.04] transition-transform duration-300"
                      />
                    ) : isPdf ? (
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center mb-2 border border-red-100 shadow-sm group-hover/preview:scale-105 transition-transform">
                          <FileText className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200/80">
                          Dokumen PDF
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center mb-2 border border-emerald-100 shadow-sm group-hover/preview:scale-105 transition-transform">
                          <Shield className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                          Berkas Terlampir
                        </span>
                      </div>
                    )}

                    {/* Hover Preview Scrim */}
                    <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[1px] opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3.5 py-1.5 rounded-full bg-slate-950/85 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg border border-white/15">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Perbesar Berkas</span>
                      </span>
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => triggerFileUpload(item.id)}
                    className="w-full h-full flex flex-col items-center justify-center p-5 pt-9 text-center bg-gradient-to-b from-red-50/30 to-slate-50/60 hover:from-red-50/60 hover:to-red-50/30 transition-colors cursor-pointer group/drop"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-white text-red-600 border border-red-200/80 flex items-center justify-center mb-2.5 shadow-xs group-hover/drop:scale-105 group-hover/drop:-translate-y-0.5 transition-all">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-extrabold text-slate-800">
                      Belum ada berkas diunggah
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Klik di sini untuk memilih file dari perangkat
                    </p>
                  </button>
                )}
              </div>

              {/* Card Body: Title, File Meta & Uniform Action Row */}
              <div className="p-4 flex flex-col justify-between gap-3.5 flex-1 bg-white">
                <div className="min-w-0">
                  <h4 className="text-[13.5px] font-black tracking-tight text-slate-900 leading-snug">
                    {item.title}
                  </h4>
                  {isAttached ? (
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 min-w-0">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate font-semibold text-slate-700" title={fileName}>
                        {fileName}
                      </span>
                      {fileSize && (
                        <span className="shrink-0 font-mono text-[10px] text-slate-400">
                          • {fileSize}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                      {item.hint}
                    </p>
                  )}
                </div>

                {/* Uniform Footer Actions */}
                <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100">
                  {isAttached ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setPreviewDoc({ ...item, isPdf, isImageCandidate })}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 transition cursor-pointer active:scale-[0.98]"
                        title="Buka dan periksa berkas ini"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Lihat</span>
                      </button>

                      {!isVerifiedOrDrawn ? (
                        <button
                          type="button"
                          onClick={() => triggerFileUpload(item.id)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950 transition cursor-pointer active:scale-[0.98]"
                          title="Ganti berkas ini dengan file baru"
                        >
                          <Upload className="w-3.5 h-3.5 text-slate-500" />
                          <span>Ganti</span>
                        </button>
                      ) : (
                        <span className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200/80 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                          <Check className="w-3.5 h-3.5 stroke-[2.75]" />
                          <span>Terkunci</span>
                        </span>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => triggerFileUpload(item.id)}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer active:scale-[0.98]"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{item.btnLabel}</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox / Preview Modal */}
      {previewDoc && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setPreviewDoc(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-white/20 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-white font-mono font-black text-xs shrink-0">
                  {previewDoc.index}
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                    {previewDoc.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono truncate">
                    {previewDoc.file?.name} {previewDoc.file?.size ? `• ${previewDoc.file?.size}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {previewDoc.file?.url && (
                  <a
                    href={previewDoc.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Buka Asli</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 flex-1 overflow-auto flex items-center justify-center bg-slate-900/5 min-h-[300px]">
              {previewDoc.isPdf ? (
                <iframe
                  src={previewDoc.file?.url}
                  title={previewDoc.title}
                  className="w-full h-[60vh] rounded-2xl border border-slate-200 bg-white"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-2 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] rounded-2xl">
                  <img
                    src={formatImageUrl(previewDoc.file?.url)}
                    alt={previewDoc.title}
                    className="max-h-[65vh] max-w-full object-contain rounded-xl shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                {previewDoc.hint}
              </span>
              {!isVerifiedOrDrawn && (
                <button
                  type="button"
                  onClick={() => {
                    const targetId = previewDoc.id;
                    setPreviewDoc(null);
                    triggerFileUpload(targetId);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-xs shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Ganti Berkas</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

        </>
      )}
    </section>
  );
}
