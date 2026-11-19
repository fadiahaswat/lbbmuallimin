import React from 'react';
import { Camera, Upload, FileText, CheckCircle2 } from 'lucide-react';

export default function EvidenceSection({
  paperEvidenceUrl,
  existingScore,
  currentUser,
  handlePaperEvidenceUpload,
}) {
  const canUpload =
    !existingScore?.isLocked &&
    ['penginput', 'admin', 'superadmin'].includes(currentUser?.role);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-tight">
              Foto Bukti Blangko Kertas Juri
            </h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              paperEvidenceUrl
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {paperEvidenceUrl ? 'Terunggah' : 'Wajib Scrutineering'}
            </span>
          </div>
          <p className="text-[11.5px] text-slate-500 mt-0.5">
            Unggah foto blangko kertas fisik juri sebagai arsip audit Verifikator &amp; Finalisator.
          </p>
        </div>

        {canUpload && paperEvidenceUrl && (
          <label className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5 transition-all">
            <Upload className="w-3.5 h-3.5" />
            <span>Ganti Foto</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePaperEvidenceUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {paperEvidenceUrl ? (
        <div className="relative max-w-xl mx-auto rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <img
            src={paperEvidenceUrl}
            alt="Bukti Blangko Kertas Fisik Dewan Juri"
            className="w-full max-h-[420px] object-contain mx-auto"
          />
          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-slate-900/80 backdrop-blur-sm rounded-lg text-[10px] text-white font-semibold inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Bukti Fisik Terunggah</span>
          </div>
        </div>
      ) : canUpload ? (
        <label className="block py-10 px-4 text-center border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 rounded-xl bg-slate-50/70 transition-all cursor-pointer group">
          <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 group-hover:border-emerald-300 text-slate-400 group-hover:text-emerald-600 flex items-center justify-center mx-auto mb-2.5 shadow-2xs transition-colors">
            <Camera className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-700">
            Klik di sini untuk memotret atau mengunggah foto blangko kertas
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Format JPG / PNG · Bisa langsung ambil dari kamera HP atau tablet
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handlePaperEvidenceUpload}
            className="hidden"
          />
        </label>
      ) : (
        <div className="py-10 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/70 space-y-1.5">
          <Camera className="w-7 h-7 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">
            Belum ada foto blangko kertas juri yang diunggah.
          </p>
        </div>
      )}

      {existingScore?.verificationNotes && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex items-start gap-2">
          <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-700">Catatan Verifikator / Finalisator: </span>
            <span className="text-slate-600">"{existingScore.verificationNotes}"</span>
          </div>
        </div>
      )}
    </div>
  );
}
