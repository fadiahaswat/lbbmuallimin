import React from 'react';
import {
  CreditCard,
  Copy,
  Check,
  UploadCloud,
  FileText,
  PenTool,
  FileCheck,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { PAYMENT } from '../../../config.js';

export default function Step3PaymentAndPact({
  formData,
  setFormData,
  files,
  handleFileChange,
  copiedAccount,
  handleCopyAccount,
  setShowPaktaModal,
  setHasSignature,
  handleBack,
  handleSubmit,
  feeDisplay
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-sm hover:shadow-md transition-shadow space-y-6 animate-fade"
    >
      <div className="border-b border-slate-100 pb-4 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-700 shrink-0">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase italic tracking-wide">
            3. Pembayaran & Pakta Integritas Online
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Unggah bukti transfer pembayaran dan tanda tangani Pakta Integritas secara online.
          </p>
        </div>
      </div>

      {/* Kotak Rekening Resmi Bendahara - Clean Slate-900 Card */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white rounded-2xl shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 block">
              Rekening Resmi Bendahara LBB Mu'allimin 2026
            </span>
            <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
              <span className="text-sm font-bold text-white">{PAYMENT.BANK_NAME}:</span>
              <span className="text-lg font-mono font-black text-yellow-400 tracking-wider">
                {PAYMENT.ACCOUNT_NUMBER}
              </span>
              <button
                type="button"
                onClick={handleCopyAccount}
                className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-black rounded-lg shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
              >
                {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAccount ? 'Tersalin' : 'Salin Rekening'}</span>
              </button>
            </div>
            <span className="text-xs text-slate-300 block mt-1.5">
              a.n. <strong className="text-white font-bold">{PAYMENT.ACCOUNT_NAME || PAYMENT.ACCOUNT_HOLDER}</strong>
            </span>
            <span className="text-[11px] text-amber-300 block mt-1">
              Format Berita Transfer:{' '}
              <code className="bg-black/40 border border-yellow-400/40 px-2 py-0.5 rounded text-yellow-300 font-mono font-bold">
                {PAYMENT.TRANSFER_NOTE_FORMAT}
              </code>
            </span>
          </div>
          <div className="text-left sm:text-right sm:border-l sm:border-slate-800 sm:pl-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
              Biaya Registrasi ({formData.jenjang})
            </span>
            <span className="text-2xl font-mono font-black text-white">{feeDisplay}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 10. Bukti Pembayaran */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-red-600" />
            <span>
              10. Upload Bukti Transfer Pembayaran <span className="text-red-600 font-bold">*</span>
            </span>
          </label>
          <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl transition-all">
            {files.paymentProof ? (
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  {files.paymentProof.url && files.paymentProof.url.startsWith('data:image') ? (
                    <img
                      src={files.paymentProof.url}
                      alt="Preview Bukti Transfer"
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-slate-200 shadow-xs shrink-0 bg-white"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                      <FileText className="w-7 h-7" />
                    </div>
                  )}
                  <div className="min-w-0 text-left">
                    <span className="text-xs font-bold text-slate-900 truncate block">
                      {files.paymentProof.name}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Bukti transfer berhasil diunggah ({files.paymentProof.size})</span>
                    </span>
                  </div>
                </div>
                <label className="cursor-pointer text-xs font-bold text-red-700 hover:text-red-800 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors shrink-0 ml-2">
                  Ganti Bukti
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={e => handleFileChange('paymentProof', e)}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4 text-xs font-bold text-slate-700 hover:text-red-700 transition-colors">
                <UploadCloud className="w-6 h-6 text-red-600" />
                <span>Pilih Foto / Screenshot Struk Bukti Transfer</span>
                <span className="text-[10px] text-slate-500 font-normal">Format JPG, PNG, PDF (Maks. 5 MB)</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={e => handleFileChange('paymentProof', e)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* 11. PAKTA INTEGRITAS ONLINE (DIGITAL SIGNATURE) */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <PenTool className="w-4 h-4 text-red-700" />
              <span>
                11. Pakta Integritas Resmi (Tanda Tangan Online) <span className="text-red-600 font-bold">*</span>
              </span>
            </label>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full">
              Online E-Signature
            </span>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            Tidak perlu mencetak dan memindai kertas. Anda dapat membaca 5 butir pernyataan integritas dan membubuhkan{' '}
            <strong className="text-slate-900">Tanda Tangan Digital Resmi</strong> secara langsung online di bawah ini.
          </p>

          {files.integrityPact ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg p-1 border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                  {files.integrityPact.signatureUrl ? (
                    <img
                      src={files.integrityPact.signatureUrl}
                      alt="TTD Digital"
                      className="max-h-full object-contain"
                    />
                  ) : (
                    <FileCheck className="w-6 h-6 text-emerald-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">Pakta Integritas Ditandatangani Online</span>
                    <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded">
                      SAH
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-600 block mt-0.5">
                    Oleh: <strong className="text-slate-900">{files.integrityPact.signedBy}</strong> • Kode:{' '}
                    <span className="font-mono text-red-700 font-bold">{files.integrityPact.signCode}</span>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPaktaModal(true)}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg transition-colors shrink-0"
              >
                Ubah Tanda Tangan
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setShowPaktaModal(true);
                setHasSignature(false);
              }}
              className="w-full py-3.5 bg-red-700 hover:bg-red-800 text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.99]"
            >
              <PenTool className="w-4 h-4 text-white" />
              <span>Buka & Tanda Tangani Pakta Integritas Online Sekarang</span>
            </button>
          )}
        </div>

        {/* Checklist Persetujuan Juknis */}
        <div className="space-y-3 pt-1">
          <label className="flex items-start gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-slate-100/60 transition-colors">
            <input
              type="checkbox"
              checked={formData.agreeJuknis}
              onChange={e => setFormData({ ...formData, agreeJuknis: e.target.checked })}
              className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-600 w-4 h-4"
            />
            <span className="text-xs text-slate-700 leading-relaxed">
              Saya menyetujui seluruh ketentuan dalam{' '}
              <strong className="text-slate-900">Petunjuk Teknis (Juknis) Resmi LBB Mu'allimin 2026</strong> dan bersedia mematuhi seluruh keputusan dewan juri yang bersifat mutlak serta tidak dapat diganggu gugat.
            </span>
          </label>
        </div>
      </div>

      <div className="pt-4 flex justify-between items-center border-t border-slate-100">
        <button
          type="button"
          onClick={handleBack}
          className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <button
          type="submit"
          className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-md active:scale-95 transition-all"
        >
          <span>Kirim Pendaftaran Peleton</span>
          <CheckCircle2 className="w-4 h-4 text-white stroke-[2.5]" />
        </button>
      </div>
    </form>
  );
}
