import React from 'react';
import { Camera, Upload, FileText } from 'lucide-react';

export default function EvidenceSection({
  paperEvidenceUrl,
  existingScore,
  currentUser,
  handlePaperEvidenceUpload,
  verificationNoteInput,
  setVerificationNoteInput
}) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-sm text-slate-900 uppercase flex items-center gap-2">
              <span>Foto Bukti Blangko Kertas Juri Fisik</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md uppercase">
                Wajib Scrutineering
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Juri menilai di atas kertas fisik di lapangan. Penginput mengunggah foto blangko untuk diaudit oleh Verifikator & disahkan Finalisator.
            </p>
          </div>
        </div>

        {/* File Upload Input */}
        {(!existingScore?.isLocked && (currentUser?.role === 'penginput' || currentUser?.role === 'admin' || currentUser?.role === 'superadmin')) && (
          <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2 shadow-sm transition-all">
            <Upload className="w-4 h-4" />
            <span>{paperEvidenceUrl ? 'Ganti Foto Blangko' : 'Upload Foto Blangko Kertas'}</span>
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
        <div className="space-y-3">
          <div className="relative max-w-xl mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner group">
            <img
              src={paperEvidenceUrl}
              alt="Bukti Blangko Kertas Fisik Dewan Juri"
              className="w-full max-h-96 object-contain mx-auto"
            />
            <div className="absolute bottom-2 right-2 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-xl text-[10px] text-white font-mono">
              Bukti Fisik Terunggah
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 space-y-2">
          <Camera className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-xs text-slate-600 font-bold">
            Belum ada foto lembar kertas dewan juri yang diunggah.
          </p>
          <p className="text-[11px] text-slate-500 max-w-md mx-auto">
            Penginput nilai dapat memotret lembar kertas fisik juri menggunakan kamera HP / tablet lalu mengunggahnya ke sini sebagai arsip audit trail.
          </p>
        </div>
      )}

      {/* Verification Notes History */}
      {existingScore?.verificationNotes && (
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
          <div className="flex items-center gap-2 text-slate-600 font-bold">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Catatan Verifikator / Finalisator:</span>
          </div>
          <p className="text-slate-700 pl-5 italic">
            "{existingScore.verificationNotes}"
          </p>
        </div>
      )}
    </div>
  );
}
