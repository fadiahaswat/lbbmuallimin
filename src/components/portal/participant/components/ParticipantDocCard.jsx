import React, { useState, useEffect } from 'react';
import { Upload, FileText } from 'lucide-react';
import { formatImageUrl, getFallbackImageUrl } from '../../../../services/sheetService.js';

export default function ParticipantDocCard({ title, file, uploadKey, btnLabel, btnColor, onUpload }) {
  const [imgFailed, setImgFailed] = useState(false);

  const rawUrl = file?.url;
  const fileName = file?.name || title;
  const hasFile = Boolean(rawUrl && rawUrl !== '#');

  useEffect(() => {
    setImgFailed(false);
  }, [rawUrl]);

  const fileExt = typeof fileName === 'string' && fileName.includes('.')
    ? fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
    : '';
  const isPdf = fileExt === '.pdf' || (typeof rawUrl === 'string' && rawUrl.includes('.pdf'));
  const isImageExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(fileExt);

  // Kandidat gambar: base64, blob, URL drive non-pdf, atau ekstensi gambar
  const isImageCandidate = hasFile && !isPdf && typeof rawUrl === 'string' && (
    rawUrl.startsWith('data:image') ||
    rawUrl.startsWith('blob:') ||
    rawUrl.startsWith('http://') ||
    rawUrl.startsWith('https://') ||
    rawUrl.includes('googleusercontent.com') ||
    rawUrl.includes('drive.google.com') ||
    isImageExt
  );

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase text-slate-800 line-clamp-1" title={title}>
            {title}
          </span>
          <button
            type="button"
            onClick={onUpload}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 shadow-xs ${btnColor}`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{btnLabel}</span>
          </button>
        </div>

        <div className="h-32 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center overflow-hidden p-2 relative group">
          {hasFile ? (
            isImageCandidate && !imgFailed ? (
              <a
                href={rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka file asli di tab baru"
                className="w-full h-full flex items-center justify-center"
              >
                <img
                  src={formatImageUrl(rawUrl)}
                  alt={title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const fallback = getFallbackImageUrl(rawUrl);
                    if (fallback && e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    } else {
                      setImgFailed(true);
                    }
                  }}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                />
              </a>
            ) : isPdf ? (
              <a
                href={rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka dokumen PDF di tab baru"
                className="w-full h-full flex flex-col items-center justify-center text-center p-2 text-slate-600 hover:text-red-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-1 border border-red-100 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold truncate max-w-[190px]" title={fileName}>
                  {fileName}
                </span>
                <span className="text-[10px] text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded-full mt-1 border border-red-200">
                  Dokumen PDF (Klik Buka)
                </span>
              </a>
            ) : (
              <a
                href={rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka file di tab baru"
                className="w-full h-full flex flex-col items-center justify-center text-center p-2 text-slate-600 hover:text-blue-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1 border border-blue-100 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold truncate max-w-[190px]" title={fileName}>
                  {fileName}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                  Berkas Terlampir (Klik Buka)
                </span>
              </a>
            )
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-2 text-slate-400">
              <span className="text-xs italic">Belum ada berkas terunggah</span>
            </div>
          )}
        </div>
      </div>

      <span className="text-[10px] text-slate-500 block truncate" title={fileName}>
        {fileName}
      </span>
    </div>
  );
}
