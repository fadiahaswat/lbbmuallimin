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

        {/* 6. Pakta Integritas Bermaterai Rp 10.000 (Cetak Fisik untuk TM) */}
        <div className="sm:col-span-2 bg-gradient-to-r from-red-50/80 via-white to-amber-50/80 border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-100 text-red-700">
                <Shield className="w-4 h-4" />
              </span>
              <span className="font-black text-xs uppercase tracking-wider text-slate-900">
                Pakta Integritas Fisik Bermaterai Rp 10.000 (Bab A.8 / Pasal 2)
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
              Selain tanda tangan digital saat pendaftaran online, Official <strong>wajib mencetak dokumen fisik</strong> ini, menempelkan materai Rp 10.000, menandatangani basah, dan menyerahkannya di meja registrasi TM (9 Jan 2027).
            </p>
          </div>
          {onOpenPactModal && (
            <button
              type="button"
              onClick={onOpenPactModal}
              disabled={isDownloadingPact}
              className="px-4 py-2.5 bg-red-700 hover:bg-red-800 disabled:bg-slate-400 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
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
