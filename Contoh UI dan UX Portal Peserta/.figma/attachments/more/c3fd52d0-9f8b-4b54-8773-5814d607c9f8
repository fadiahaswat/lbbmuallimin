import React from 'react';
import { Users, ArrowRight, Shield, Printer, Download, Loader2 } from 'lucide-react';
import ParticipantDocCard from '../components/ParticipantDocCard.jsx';

export default function DocumentsTab({ currentTeam, triggerFileUpload, setActiveTab, onOpenPactModal, isDownloadingPact }) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      <div>
        <h4 className="font-black text-xl text-slate-900 uppercase">
          Pusat Pengunggahan Berkas Digital
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Unggah atau perbarui berkas yang diminta oleh panitia verifikator.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* 1. Logo Sekolah */}
        <ParticipantDocCard
          title="Logo Sekolah / Lambang Peleton"
          file={currentTeam.files?.schoolLogo}
          uploadKey="schoolLogo"
          btnLabel="Unggah Logo"
          btnColor="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold"
          onUpload={() => triggerFileUpload('schoolLogo')}
        />

        {/* 2. Informasi Pasfoto Personel & Official */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-blue-950 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-700" />
                <span>Pasfoto Personel & Official (3x4)</span>
              </span>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                Terintegrasi Roster
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pasfoto Komandan, 21 Pasukan Inti, 3 Cadangan, serta 1 Official dan 2 Pendukung Resmi diunggah langsung per individu di menu <strong>Susunan Personel</strong>.
            </p>
          </div>
          <div className="pt-3 border-t border-blue-100 flex items-center justify-between">
            <span className="text-[11px] text-blue-900 font-semibold">
              Merah (SD) / Biru (SMP)
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('roster')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <span>Buka Roster Personel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Surat Rekomendasi */}
        <ParticipantDocCard
          title="Surat Rekomendasi Kepala Sekolah"
          file={currentTeam.files?.recommendationLetter}
          uploadKey="recommendationLetter"
          btnLabel="Unggah Surat"
          btnColor="bg-red-700 hover:bg-red-800 text-white"
          onUpload={() => triggerFileUpload('recommendationLetter')}
        />

        {/* 4. Bukti Transfer */}
        <ParticipantDocCard
          title="Bukti Transfer Pembayaran BSI"
          file={currentTeam.files?.paymentProof}
          uploadKey="paymentProof"
          btnLabel="Unggah Bukti"
          btnColor="bg-emerald-600 hover:bg-emerald-700 text-white"
          onUpload={() => triggerFileUpload('paymentProof')}
        />

        {/* 5. Kartu Pelajar Komandan */}
        <ParticipantDocCard
          title="Kartu Pelajar Komandan"
          file={currentTeam.files?.dantonCard}
          uploadKey="dantonCard"
          btnLabel="Unggah Kartu"
          btnColor="bg-red-700 hover:bg-red-800 text-white"
          onUpload={() => triggerFileUpload('dantonCard')}
        />

        {/* 6. Pakta Integritas Fisik (Cetak Fisik untuk TM) */}
        <div className="sm:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-start gap-3.5 max-w-xl">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
              <Shield className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-xs sm:text-sm uppercase tracking-tight text-slate-900">
                  Pakta Integritas Fisik (Bab A.7.b / Pasal 2)
                </span>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md">
                  Wajib TM
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Selain tanda tangan digital saat pendaftaran online, Official <strong>wajib mencetak dokumen fisik</strong> ini, menandatangani basah, dan menyerahkannya di meja registrasi TM (9 Jan 2027).
              </p>
            </div>
          </div>
          {onOpenPactModal && (
            <button
              type="button"
              onClick={onOpenPactModal}
              disabled={isDownloadingPact}
              className="px-4 py-2.5 bg-red-700 hover:bg-red-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer active:scale-95 w-full sm:w-auto"
            >
              {isDownloadingPact ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengunduh PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF Pakta Integritas</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
