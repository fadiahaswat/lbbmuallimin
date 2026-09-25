import React from 'react';
import { Printer } from 'lucide-react';
import { EVENT } from '../../../../config.js';

export default function IdCardTab({ currentTeam }) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded">
            Tiket Resmi Masuk Kampus & Basecamp
          </span>
          <h4 className="font-black text-xl text-slate-900 uppercase italic mt-1">
            ID Card & Tiket Registrasi Peleton (QR Code)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Tunjukkan barcode QR ini kepada Panitia saat tiba di Kampus Terpadu untuk Check-in Basecamp, serah terima logistik, dan pemeriksaan DP 1.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak ID Card / Tiket Peleton</span>
        </button>
      </div>

      {/* Kartu Fisik / Badge Tiket Peleton (Printable) */}
      <div className="max-w-xl mx-auto bg-gradient-to-b from-slate-950 via-slate-900 to-red-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-yellow-400/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="relative text-center border-b border-white/15 pb-4">
          <span className="text-[10px] font-black tracking-widest uppercase text-yellow-400 block">
            LOMBA BARIS BERBARIS MU'ALLIMIN 2026
          </span>
          <h3 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight text-white mt-1">
            TIKET IDENTITAS PELETON
          </h3>
          <p className="text-[11px] text-slate-300">
            Kampus Terpadu Sedayu • {EVENT.COMPETITION_DATE}
          </p>
        </div>

        {/* Body Badge: QR Code & Team Meta */}
        <div className="relative py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* QR Code Container */}
          <div className="bg-white p-3.5 rounded-2xl shadow-lg border-2 border-yellow-400/60 shrink-0 text-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(currentTeam.regCode)}`}
              alt={`QR Code ${currentTeam.regCode}`}
              className="w-36 h-36 mx-auto block rounded-lg"
              loading="eager"
            />
            <span className="font-mono font-black text-xs text-slate-950 block mt-2 tracking-wider">
              {currentTeam.regCode}
            </span>
            <span className="text-[9px] text-slate-500 font-bold uppercase block">Scan saat Check-in</span>
          </div>

          {/* Team Details */}
          <div className="space-y-3 flex-1 text-center sm:text-left">
            <div>
              <span className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider">Sekolah / Instansi:</span>
              <h4 className="text-xl font-black text-white leading-tight uppercase mt-0.5">
                {currentTeam.schoolName}
              </h4>
              <p className="text-xs text-slate-300 font-semibold">{currentTeam.platoonName}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left bg-white/10 p-3 rounded-2xl border border-white/15 text-xs">
              <div>
                <span className="text-[9px] uppercase text-slate-400 block font-bold">Jenjang</span>
                <span className="font-bold text-white text-sm">{currentTeam.jenjang}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-400 block font-bold">No. Tampil</span>
                <span className="font-bold text-yellow-400 font-mono text-sm">
                  {currentTeam.lotNumber ? `#${String(currentTeam.lotNumber).padStart(2, '0')}` : 'Belum TM'}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-400 block font-bold">Nomor Dada</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">{currentTeam.chestNumber || '-'}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-400 block font-bold">Ruang Basecamp</span>
                <span className="font-bold text-amber-300 font-mono text-sm">{currentTeam.basecampNumber ? `Ruang ${currentTeam.basecampNumber}` : '-'}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 space-y-0.5">
              <div>Danton: <strong className="text-white">{currentTeam.roster?.danton?.name || currentTeam.dantonName || '-'}</strong></div>
              <div>Official / KTP: <strong className="text-white">{currentTeam.officialName || currentTeam.coachName || '-'}</strong></div>
            </div>
          </div>
        </div>

        {/* SOP Info Footer */}
        <div className="relative border-t border-white/15 pt-3.5 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-yellow-400 uppercase text-[10px] tracking-wider">SOP Hari-H Perlombaan:</div>
          <p>1. Check-in Basecamp: Tunjukkan QR ini & serahkan 1 KTP/SIM fisik official untuk menerima 1 dus air mineral, no dada, cocard, dan karung sampah.</p>
          <p>2. Check-out Basecamp: Cek kebersihan ruangan, serahkan karung sampah terpilah, scan QR checkout untuk mengambil kembali KTP/SIM.</p>
        </div>
      </div>
    </div>
  );
}
