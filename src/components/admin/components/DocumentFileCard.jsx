import React, { useState, useEffect, useRef } from 'react';
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

  const handleDelete = () => {
    if (window.confirm(`Hapus berkas "${title}" ini?`)) {
      onDelete?.();
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs">
      {/* Hidden File Input for Panitia */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[11px] font-bold uppercase ${colorClass}`}>
            {number}. {title}
          </span>
          <div className="flex items-center gap-1.5">
            {file?.type === 'online' && (
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded">
                Online TTD
              </span>
            )}
            {onUpload && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                title="Unggah atau ganti berkas ini (bisa PNG transparan)"
              >
                <Upload className="w-3 h-3" />
                <span>{hasFile ? 'Ganti' : 'Unggah'}</span>
              </button>
            )}
            {hasFile && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-[10px] font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 p-1 rounded-lg transition-colors cursor-pointer"
                title="Hapus berkas ini"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
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
              <span className="text-xs italic mb-1.5">Belum ada berkas</span>
              {onUpload && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                >
                  + Unggah Berkas
                </button>
              )}
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
