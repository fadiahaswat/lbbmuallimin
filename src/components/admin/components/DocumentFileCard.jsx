import React, { useState, useEffect, useRef } from 'react';
import { appConfirm } from '../../../utils/appDialog.js';
import { ExternalLink, FileText, AlertTriangle, Upload, Trash2 } from 'lucide-react';
import { formatImageUrl, getFallbackImageUrl } from '../../../services/sheetService.js';

export default function DocumentFileCard({
  title,
  file,
  number,
  colorClass = 'text-blue-700',
  isSignature = false,
  onUpload,
  onDelete
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (uploadedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const img = new Image();
        img.onload = () => {
          const MAX_DIM = 1200;
          let width = img.width;
          let height = img.height;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // PENTING: Jika file asli adalah PNG, pertahankan format image/png agar transparansi (alpha channel) TIDAK menjadi hitam!
          const isPng = uploadedFile.type === 'image/png' || (uploadedFile.name && uploadedFile.name.toLowerCase().endsWith('.png'));
          const finalUrl = isPng
            ? canvas.toDataURL('image/png')
            : canvas.toDataURL('image/jpeg', 0.85);

          const estKb = Math.round((finalUrl.length * 0.75) / 1024);
          onUpload?.({
            name: uploadedFile.name,
            size: `${estKb} KB${isPng ? ' (PNG)' : ''}`,
            uploadedAt: new Date().toISOString(),
            url: finalUrl
          });
        };
        img.src = loadEvt.target?.result;
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        onUpload?.({
          name: uploadedFile.name,
          size: `${(uploadedFile.size / 1024).toFixed(1)} KB`,
          uploadedAt: new Date().toISOString(),
          url: loadEvt.target?.result || '#'
        });
      };
      reader.readAsDataURL(uploadedFile);
    }

    e.target.value = '';
  };

  const handleDelete = async () => {
    const ok = await appConfirm(`Hapus berkas "${title}" ini?`, {
      title: 'Hapus Berkas',
      confirmText: 'Hapus',
      variant: 'danger',
    });
    if (ok) {
      onDelete?.();
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs group/doc">
      {/* Hidden File Input for Panitia */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Clean Card Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-5 h-5 rounded-md font-mono text-[10px] font-black flex items-center justify-center shrink-0 ${
            hasFile ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}>
            {String(number || '').padStart(2, '0')}
          </span>
          <span className={`text-xs font-bold truncate ${colorClass}`} title={title}>
            {title}
          </span>
          {file?.type === 'online' && (
            <span className="text-[9.5px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded shrink-0">
              TTD Online
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onUpload && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1 rounded-lg text-[10.5px] font-bold text-slate-600 hover:text-slate-950 hover:bg-slate-100 inline-flex items-center gap-1 transition-colors cursor-pointer"
              title="Unggah atau ganti berkas ini"
            >
              <Upload className="w-3 h-3" />
              <span>{hasFile ? 'Ganti' : 'Unggah'}</span>
            </button>
          )}
          {hasFile && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Hapus berkas ini"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Preview Stage */}
      <div className="h-40 bg-slate-50/80 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:14px_14px] flex flex-col items-center justify-center overflow-hidden p-3 relative">
        {hasFile ? (
          isImageCandidate && !imgFailed ? (
            <a
              href={rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-full flex items-center justify-center relative"
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
                className="max-h-full max-w-full object-contain group-hover/doc:scale-[1.03] transition-transform duration-300 drop-shadow-2xs"
              />
              <span className="pointer-events-none absolute bottom-1 right-1 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[10px] font-bold opacity-0 group-hover/doc:opacity-100 transition-opacity inline-flex items-center gap-1 backdrop-blur-xs">
                <span>Lihat</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </a>
          ) : (
            <a
              href={rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center text-center p-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center mb-1.5 border border-slate-200 shadow-2xs">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Dokumen Terlampir</span>
            </a>
          )
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-2 text-slate-400">
            <AlertTriangle className="w-5 h-5 text-amber-400/80 mb-1" />
            <span className="text-[11px] font-medium text-slate-400 mb-1.5">Belum diunggah</span>
            {onUpload && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-slate-400 text-[11px] font-bold text-slate-700 transition-colors cursor-pointer shadow-2xs"
              >
                + Pilih File
              </button>
            )}
          </div>
        )}
      </div>

      {/* Slim Footer */}
      <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span className={`inline-flex items-center gap-1.5 font-semibold ${hasFile ? 'text-emerald-700' : 'text-amber-600'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${hasFile ? 'bg-emerald-500' : 'bg-amber-400'}`} />
          {hasFile ? 'Tersedia' : 'Wajib dilengkapi'}
        </span>
        {hasFile && (
          <a
            href={rawUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-slate-950 font-bold inline-flex items-center gap-1 transition-colors"
          >
            <span>Buka</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
