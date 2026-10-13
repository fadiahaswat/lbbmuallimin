import React, { useState, useEffect } from 'react';
import { Printer, Download, QrCode } from 'lucide-react';
import { EVENT } from '../../../../config.js';
import { generateParticipantQRCode, downloadDataUrl, OFFICIAL_BASE_URL } from '../../../../utils/qrGenerator.js';

export default function IdCardTab({ currentTeam }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isGeneratingQr, setIsGeneratingQr] = useState(true);

  useEffect(() => {
    if (!currentTeam?.regCode) return;
    const targetUrl = `${OFFICIAL_BASE_URL}/?reg=${encodeURIComponent(currentTeam.regCode)}`;
    setIsGeneratingQr(true);
    generateParticipantQRCode(targetUrl, { size: 600 })
      .then(url => {
        setQrDataUrl(url);
      })
      .catch(err => {
        console.error('Error generating IdCard QR:', err);
      })
      .finally(() => {
        setIsGeneratingQr(false);
      });
  }, [currentTeam?.regCode]);

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    downloadDataUrl(
      qrDataUrl,
      `QR-${currentTeam.regCode}-${(currentTeam.schoolName || 'peleton').replace(/\s+/g, '_')}.png`
    );
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/90 shadow-xs space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 sm:pb-4">
        <div>
          <h4 className="font-black text-base sm:text-xl text-slate-900 uppercase">
            ID Card & Tiket Registrasi (QR)
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Tunjukkan barcode QR kepada Panitia saat tiba di Kampus Terpadu untuk Check-in & Basecamp.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleDownloadQR}
            disabled={!qrDataUrl}
            className="flex-1 sm:flex-none justify-center px-3.5 py-2 sm:py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Unduh QR</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 sm:flex-none justify-center px-3.5 py-2 sm:py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Badge</span>
          </button>
        </div>
      </div>

      {/* Kartu Fisik / Badge Tiket Peleton (Printable) */}
      <div className="max-w-xl mx-auto bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-500/30 relative overflow-hidden">
        {/* Header Badge */}
        <div className="relative text-center border-b border-white/15 pb-3">
          <span className="text-[9px] font-black tracking-widest uppercase text-amber-400 block">
            LOMBA BARIS-BERBARIS MU'ALLIMIN 2027
          </span>
          <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-white mt-0.5">
            TIKET IDENTITAS PELETON
          </h3>
          <p className="text-[11px] text-slate-300">
            Kampus Terpadu Sedayu • {EVENT.COMPETITION_DATE}
          </p>
        </div>

        {/* Body Badge: QR Code & Team Meta */}
        <div className="relative py-4 flex flex-col items-center gap-4">
          {/* QR Code Container */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-xl border border-slate-200 shrink-0 text-center w-full max-w-[320px] sm:max-w-[340px]">
            {isGeneratingQr ? (
              <div className="w-56 h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center text-slate-400 font-mono text-xs">
                Menyiapkan QR...
              </div>
            ) : (
              <img
                src={qrDataUrl}
                alt={`QR Code ${currentTeam.regCode}`}
                className="w-56 h-56 sm:w-64 sm:h-64 mx-auto block rounded-xl object-contain"
                loading="eager"
              />
            )}
            <span className="font-mono font-black text-sm sm:text-base text-slate-950 block mt-2.5 tracking-wider">
              {currentTeam.regCode}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase block mt-0.5">Scan saat Check-in</span>
          </div>

          {/* Team Details */}
          <div className="w-full text-center space-y-3">
            <div>
              <span className="text-[9px] uppercase font-bold text-amber-400 tracking-wider">Sekolah / Instansi</span>
              <h4 className="text-lg sm:text-xl font-black text-white leading-tight uppercase mt-0.5">
                {currentTeam.schoolName}
              </h4>
              {currentTeam.platoonName &&
                currentTeam.platoonName.trim().toLowerCase() !== currentTeam.schoolName.trim().toLowerCase() &&
                currentTeam.platoonName.trim().toLowerCase() !== `peleton ${currentTeam.schoolName.trim().toLowerCase()}` &&
                currentTeam.platoonName.trim().toLowerCase() !== `pleton ${currentTeam.schoolName.trim().toLowerCase()}` && (
                  <p className="text-xs text-amber-300/90 font-semibold mt-0.5">
                    {currentTeam.platoonName}
                  </p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center bg-white/10 p-2.5 rounded-2xl border border-white/15 text-xs">
              <div className="p-1">
                <span className="text-[9px] uppercase text-slate-400 block font-bold">Jenjang</span>
                <span className="font-bold text-white text-xs sm:text-sm">{currentTeam.jenjang}</span>
              </div>
              <div className="p-1">
                <span className="text-[9px] uppercase text-slate-400 block font-bold">Urutan</span>
                <span className="font-bold text-amber-400 font-mono text-xs sm:text-sm">
                  {currentTeam.lotNumber ? `#${String(currentTeam.lotNumber).padStart(2, '0')}` : 'Belum TM'}
                </span>
              </div>
              <div className="p-1">
                <span className="text-[9px] uppercase text-slate-400 block font-bold">No. Dada</span>
                <span className="font-bold text-emerald-400 font-mono text-xs sm:text-sm">{currentTeam.chestNumber || '-'}</span>
              </div>
              <div className="p-1">
                <span className="text-[9px] uppercase text-slate-400 block font-bold">Basecamp</span>
                <span className="font-bold text-amber-300 font-mono text-xs sm:text-sm">{currentTeam.basecampNumber ? `Ruang ${currentTeam.basecampNumber}` : '-'}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 flex flex-wrap justify-center gap-x-4 gap-y-1">
              <span>Danton: <strong className="text-white">{currentTeam.roster?.danton?.name || currentTeam.dantonName || '-'}</strong></span>
              <span>Official: <strong className="text-white">{currentTeam.officialName || currentTeam.coachName || '-'}</strong></span>
            </div>
          </div>
        </div>

        {/* SOP Info Footer */}
        <div className="relative border-t border-white/15 pt-3 text-[10px] sm:text-[11px] text-slate-400 space-y-1 text-left">
          <div className="font-bold text-amber-400 uppercase text-[9px] tracking-wider">SOP Ringkas Hari-H:</div>
          <p>• <strong>Check-in:</strong> Tunjukkan QR ini & serahkan KTP official untuk menerima air mineral, nomor dada, cocard, dan karung sampah.</p>
          <p>• <strong>Check-out:</strong> Cek kebersihan basecamp & serahkan sampah terpilah untuk serah-terima kembali KTP.</p>
        </div>
      </div>
    </div>
  );
}
