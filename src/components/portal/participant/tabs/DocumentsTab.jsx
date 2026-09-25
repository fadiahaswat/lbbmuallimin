import React from 'react';
import { Users, ArrowRight } from 'lucide-react';
import ParticipantDocCard from '../components/ParticipantDocCard.jsx';

export default function DocumentsTab({ currentTeam, triggerFileUpload, setActiveTab }) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      <div>
        <h4 className="font-black text-xl text-slate-900 uppercase italic">
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
          btnColor="bg-yellow-400 hover:bg-yellow-500 text-slate-950"
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
              Pasfoto Komandan, 21 Pasukan Inti, 3 Cadangan, dan 2 Official diunggah langsung per individu di menu <strong>Susunan Personel</strong>.
            </p>
          </div>
          <div className="pt-3 border-t border-blue-100 flex items-center justify-between">
            <span className="text-[11px] text-blue-900 font-semibold">
              Merah (SD) / Biru (SMP)
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('roster')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-xs"
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
          title="Bukti Transfer Pembayaran BRI"
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

        {/* 6. KTP Official / Pelatih */}
        <ParticipantDocCard
          title="KTP Official / Pelatih"
          file={currentTeam.files?.officialKtp}
          uploadKey="officialKtp"
          btnLabel="Unggah KTP"
          btnColor="bg-amber-600 hover:bg-amber-700 text-white"
          onUpload={() => triggerFileUpload('officialKtp')}
        />
      </div>
    </div>
  );
}
