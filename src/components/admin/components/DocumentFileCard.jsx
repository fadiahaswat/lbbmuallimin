import React, { useState, useEffect } from 'react';
import { ExternalLink, FileText, AlertTriangle } from 'lucide-react';
import { formatImageUrl, getFallbackImageUrl } from '../../../services/sheetService.js';

export default function DocumentFileCard({ title, file, number, colorClass = 'text-blue-700', isSignature = false }) {
  const [imgFailed, setImgFailed] = useState(false);

  const rawUrl = isSignature ? (file?.signatureUrl || file?.url) : file?.url;
  const fileName = file?.name || title;
  const hasFile = Boolean(rawUrl && rawUrl !== '#');

  useEffect(() => {
    setImgFailed(false);
  }, [rawUrl]);

  const fileExt = typeof fileName === 'string' && fileName.includes('.') 
    ? fileName.slice(fileName.lastIndexOf('.')).toLowerCase() 
    : '';
  const isImageExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(fileExt);

  const isImageCandidate = hasFile && typeof rawUrl === 'string' && (
    rawUrl.startsWith('data:image') ||
    rawUrl.startsWith('blob:') ||
    rawUrl.startsWith('http://') ||
    rawUrl.startsWith('https://') ||
    rawUrl.includes('drive.google.com') ||
    isImageExt
  );

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[11px] font-bold uppercase ${colorClass}`}>
            {number}. {title}
          </span>
          {file?.type === 'online' && (
            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded">
              Online TTD
            </span>
          )}
        </div>

        <div className="h-32 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center overflow-hidden mb-3 p-2 relative group">
          {hasFile ? (
            isImageCandidate && !imgFailed ? (
              <a
                href={rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Klik untuk membuka file asli di tab baru"
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
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-2 text-slate-500">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 border border-blue-100">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 truncate max-w-[170px]" title={fileName}>
                  {fileName}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                  Berkas Terlampir
                </span>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-2 text-slate-400">
              <AlertTriangle className="w-6 h-6 text-slate-300 mb-1" />
              <span className="text-xs italic">Belum ada berkas</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
        <span className="text-slate-600 font-mono truncate max-w-[140px]" title={fileName}>
          {fileName}
        </span>
        {hasFile && (
          <a
            href={rawUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 text-[11px]"
          >
            <ExternalLink className="w-3 h-3" /> Buka
          </a>
        )}
      </div>
    </div>
  );
}
