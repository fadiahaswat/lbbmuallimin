import React, { useState } from 'react';
import {
  CreditCard,
  Copy,
  Check,
  UploadCloud,
  FileText,
  PenTool,
  FileCheck,
  ArrowLeft,
  CheckCircle2,
  Sparkles
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
  const [copiedNote, setCopiedNote] = useState(false);

  // Otomatis hasilkan berita transfer berdasarkan nama sekolah atau fallback ke template
  const rawSchool = (formData?.schoolName || '').trim().toUpperCase();
  const teamSuffix = formData?.teamUnit && formData.teamUnit !== 'Tunggal'
    ? (formData.teamUnit === 'Tim A' || formData.teamUnit === 'A' ? 'A' : 'B')
    : '';
  const schoolFormatted = rawSchool ? (teamSuffix ? `${rawSchool} ${teamSuffix}` : rawSchool) : '';
  const autoTransferNote = schoolFormatted ? `${schoolFormatted}_1` : PAYMENT.TRANSFER_NOTE_FORMAT;

  const handleCopyNote = () => {
    navigator.clipboard?.writeText(autoTransferNote);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };
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

      {/* Kotak Rekening Resmi Bendahara - Modern Luxury Banking Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl">
        {/* Subtle decorative glowing background shapes */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative p-5 sm:p-7">
          {/* Header Row: Logo & Badge + Fee Box */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 pb-5 border-b border-white/10">
            {/* Left: Bank branding & status */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <img 
                  src="/Bank_Syariah_Indonesia_white.svg" 
                  alt="Bank Syariah Indonesia" 
                  className="h-8 sm:h-9 w-auto object-contain drop-shadow-md"
                />
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400/15 border border-amber-400/30 text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Rekening Resmi Bendahara LBB Mu'allimin 2027
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Lakukan transfer perbankan / mobile banking resmi ke rekening di bawah ini:
              </p>
            </div>

            {/* Right: Total Fee Display */}
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 shrink-0 flex flex-col justify-center sm:min-w-[200px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Biaya Registrasi ({formData.jenjang})
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-mono font-black text-amber-300 tracking-tight">
                  {feeDisplay}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5">
                *Termasuk 3 digit kode unik verifikasi otomatis
              </span>
            </div>
          </div>

          {/* Account Details & Action Row */}
          <div className="pt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Account Number Box */}
            <div className="md:col-span-7 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Nomor Rekening ({PAYMENT.BANK_NAME})
              </span>
              <div className="flex items-center gap-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl p-2.5 sm:p-3">
                <span className="text-xl sm:text-2xl font-mono font-black text-white tracking-widest pl-1">
                  {PAYMENT.ACCOUNT_NUMBER}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className={`ml-auto px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm ${
                    copiedAccount
                      ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 hover:shadow-amber-500/20'
                  }`}
                  aria-label="Salin nomor rekening"
                >
                  {copiedAccount ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Rekening</span>
                    </>
                  )}
                </button>
              </div>
              <div className="text-xs text-slate-300 pl-1 pt-0.5">
                a.n. <strong className="text-white font-semibold">{PAYMENT.ACCOUNT_NAME || PAYMENT.ACCOUNT_HOLDER}</strong>
              </div>
            </div>

            {/* Transfer Note Guide - Dynamic & Copyable */}
            <div className="md:col-span-5 bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                  Berita Transfer Anda (Otomatis)
                </span>
                {schoolFormatted && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Sparkles className="w-2.5 h-2.5" /> Siap Salin
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 bg-slate-950/90 border border-amber-400/30 px-3 py-2 rounded-lg">
                <code className="text-xs font-mono font-bold text-amber-300 break-all select-all">
                  {autoTransferNote}
                </code>
                <button
                  type="button"
                  onClick={handleCopyNote}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 shrink-0 transition-all active:scale-95 cursor-pointer shadow-xs ${
                    copiedNote
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-400/20 hover:bg-amber-400 hover:text-slate-950 text-amber-300 border border-amber-400/40'
                  }`}
                  title="Salin berita transfer"
                >
                  {copiedNote ? (
                    <>
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Format: <span className="text-slate-300 font-mono">NAMA SEKOLAH_JUMLAH PELETON</span>
              </p>
            </div>
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
              <strong className="text-slate-900">Petunjuk Teknis (Juknis) Resmi LBB Mu'allimin 2027</strong> dan bersedia mematuhi seluruh keputusan dewan juri yang bersifat mutlak serta tidak dapat diganggu gugat.
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
