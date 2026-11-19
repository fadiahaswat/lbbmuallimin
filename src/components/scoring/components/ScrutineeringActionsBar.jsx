import React from 'react';
import { Lock, Unlock, Printer, Save, CheckCircle2 } from 'lucide-react';

export default function ScrutineeringActionsBar({
  existingScore,
  currentUser,
  juryNotes,
  setJuryNotes,
  handleSaveDraft,
  handleVerifyScoreAction,
  handleFinalizeScoreAction,
  handleUnlockScoreAction,
  setIsRecapModalOpen
}) {
  const isSuperadmin = currentUser?.role === 'superadmin';
  const canVerify = ['verifikator', 'superadmin'].includes(currentUser?.role);
  const canFinalize = ['finalisator', 'superadmin'].includes(currentUser?.role);
  const isLocked = Boolean(existingScore?.isLocked);
  const isVerified = existingScore?.status === 'verified';
  const isDraft = !existingScore || existingScore.status === 'draft' || existingScore.status === 'rejected_to_draft';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
      {/* Header & Compact Stepper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div>
          <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-tight">
            Pengesahan &amp; Penguncian Nilai
          </h4>
          <p className="text-[11px] text-slate-500">
            Tahapan scrutineering resmi sebelum nilai terbit ke klasemen
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/80 text-[10.5px] font-bold self-start sm:self-auto">
          <span className={`px-2 py-0.5 rounded-md ${
            isDraft && !isLocked
              ? 'bg-amber-100 text-amber-900 font-extrabold'
              : 'text-slate-400'
          }`}>
            1. Draft
          </span>
          <span className="text-slate-300">→</span>
          <span className={`px-2 py-0.5 rounded-md ${
            isVerified && !isLocked
              ? 'bg-blue-600 text-white font-extrabold'
              : isLocked
              ? 'text-blue-600'
              : 'text-slate-400'
          }`}>
            2. Terverifikasi
          </span>
          <span className="text-slate-300">→</span>
          <span className={`px-2 py-0.5 rounded-md ${
            isLocked
              ? 'bg-emerald-600 text-white font-extrabold'
              : 'text-slate-400'
          }`}>
            3. Final
          </span>
        </div>
      </div>

      {/* Catatan Evaluasi + Aksi Terpadu */}
      <div className="flex flex-col lg:flex-row lg:items-end gap-3">
        <div className="flex-1 min-w-0">
          <label className="block text-[11px] font-bold text-slate-600 mb-1">
            Catatan Evaluasi Lapangan (Opsional)
          </label>
          <textarea
            rows={2}
            disabled={isLocked && !isSuperadmin}
            value={juryNotes}
            onChange={e => setJuryNotes(e.target.value)}
            placeholder="Tuliskan evaluasi gerakan, kerapian, atau instruksi danton..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-900 rounded-xl text-xs text-slate-800 focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {isLocked ? (
            <>
              {isSuperadmin && (
                <>
                  <button
                    type="button"
                    onClick={handleUnlockScoreAction}
                    className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Buka Kunci</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Perubahan</span>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setIsRecapModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Berita Acara</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-amber-400" />
                <span>Simpan Hasil Nilai</span>
              </button>

              {existingScore && existingScore.status === 'draft' && canVerify && (
                <button
                  type="button"
                  onClick={() => handleVerifyScoreAction(true)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verifikasi Sah</span>
                </button>
              )}

              {isVerified && canVerify && (
                <button
                  type="button"
                  onClick={() => handleVerifyScoreAction(false)}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer"
                >
                  Batal Verifikasi
                </button>
              )}

              {isVerified && canFinalize && (
                <button
                  type="button"
                  onClick={handleFinalizeScoreAction}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Kunci &amp; Sahkan</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Info Status Ringkas bila Terkunci / Terverifikasi */}
      {isLocked && (
        <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[11px] text-emerald-800 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>
            Nilai telah disahkan &amp; dikunci permanen oleh <strong>{existingScore.finalizedBy || 'Ketua Dewan Juri'}</strong>.
          </span>
        </div>
      )}
      {isVerified && !isLocked && (
        <div className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200/80 text-[11px] text-blue-800 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>
            Terverifikasi oleh <strong>{existingScore.verifiedBy || 'Verifikator'}</strong> — siap dikunci permanen oleh Finalisator.
          </span>
        </div>
      )}
    </div>
  );
}
