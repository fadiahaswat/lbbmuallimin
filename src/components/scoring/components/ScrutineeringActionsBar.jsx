import React from 'react';
import { Lock, Printer, Save, CheckCircle2 } from 'lucide-react';

export default function ScrutineeringActionsBar({
  existingScore,
  currentUser,
  juryNotes,
  setJuryNotes,
  handleSaveDraft,
  handleVerifyScoreAction,
  handleFinalizeScoreAction,
  setIsRecapModalOpen
}) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
      {/* Header & Status Stepper Visual */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
            Tahapan Scrutineering Resmi
          </span>
          <h4 className="font-black text-base text-slate-900 uppercase">
            Pengesahan & Penguncian Nilai
          </h4>
        </div>

        {/* Stepper Badge */}
        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200 text-[11px] font-bold">
          <span className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${
            !existingScore || existingScore.status === 'draft' || existingScore.status === 'rejected_to_draft'
              ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
              : 'text-slate-400'
          }`}>
            <span>1. Draft</span>
          </span>
          <span className="text-slate-300">→</span>
          <span className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${
            existingScore?.status === 'verified'
              ? 'bg-blue-600 text-white font-black shadow-xs'
              : (existingScore?.isLocked ? 'text-blue-600' : 'text-slate-400')
          }`}>
            <span>2. Terverifikasi</span>
          </span>
          <span className="text-slate-300">→</span>
          <span className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${
            existingScore?.isLocked
              ? 'bg-emerald-600 text-white font-black shadow-xs'
              : 'text-slate-400'
          }`}>
            <span>3. Final & Terkunci</span>
          </span>
        </div>
      </div>

      {/* Catatan Evaluasi Lapangan */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
          Catatan Evaluasi Lapangan untuk Peleton
        </label>
        <textarea
          rows={2}
          disabled={existingScore?.isLocked}
          value={juryNotes}
          onChange={e => setJuryNotes(e.target.value)}
          placeholder="Tuliskan evaluasi gerakan, kerapian, atau instruksi danton..."
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>

      {/* Action Bar Dinamis Berdasarkan Tahapan Status */}
      <div className="pt-2">
        {/* KONDISI 1: NILAI SUDAH DIKUNCI FINAL */}
        {existingScore?.isLocked ? (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black uppercase text-emerald-800">
                  Nilai Peleton Telah Disahkan & Dikunci Permanen
                </div>
                <p className="text-[11px] text-slate-600">
                  Disahkan oleh {existingScore.finalizedBy || 'Ketua Dewan Juri'}. Nilai masuk ke rekapitulasi resmi.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsRecapModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Lihat Berita Acara</span>
            </button>
          </div>
        ) : (
          /* KONDISI 2: BELUM DIKUNCI - TAMPILKAN LANGKAH SESUAI STATUS */
          <div className="space-y-3">
            {/* JIKA STATUS MASIH DRAFT / BELUM DISIMPAN */}
            {(!existingScore || existingScore.status === 'draft' || existingScore.status === 'rejected_to_draft') && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-amber-200">
                <div>
                  <span className="text-xs font-bold text-amber-800 block">
                    Langkah 1: Simpan Input Nilai Juri
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Pastikan seluruh nilai materi PBB, Danton, dan penalti telah dicocokkan dengan lembar kertas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Hasil Nilai</span>
                </button>
              </div>
            )}

            {/* JIKA STATUS SUDAH TERSIMPAN (SIAP DIVERIFIKASI / DIKUNCI) */}
            {existingScore && existingScore.status === 'draft' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-blue-200">
                <div>
                  <span className="text-xs font-bold text-blue-800 block">
                    Langkah 2: Verifikasi Kesesuaian Fisik (Scrutineering)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Verifikator mencocokkan input sistem dengan foto blangko fisik dewan juri.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleVerifyScoreAction(true)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verifikasi Sah</span>
                  </button>
                </div>
              </div>
            )}

            {/* JIKA STATUS SUDAH TERVERIFIKASI (SIAP DIKUNCI FINALISATOR) */}
            {existingScore?.status === 'verified' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-emerald-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800">
                      Langkah 3: Pengesahan & Penguncian Final
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono">
                      Terverifikasi oleh {existingScore.verifiedBy || 'Verifikator'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Kunci nilai permanen agar tidak dapat diubah kembali dan terbit di Berita Acara Rekap Nilai.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleVerifyScoreAction(false)}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200 transition-all cursor-pointer"
                    title="Kembalikan ke status Draft jika ditemukan ketidaksesuaian"
                  >
                    <span>Batal Verifikasi</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalizeScoreAction}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Kunci & Sahkan Nilai</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
