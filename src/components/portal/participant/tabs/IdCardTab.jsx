import React, { useState, useEffect } from 'react';
import { Download, QrCode, Shield, CheckCircle2 } from 'lucide-react';
import { EVENT } from '../../../../config.js';
import { generateParticipantQRCode, downloadDataUrl, OFFICIAL_BASE_URL } from '../../../../utils/qrGenerator.js';
import logoLbb from '../../../../assets/logo-tonti.png';
import titleLogoImg from '../../../../assets/title-logo.png';

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
    <section className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_46px_rgba(15,23,42,0.06)] sm:p-7 space-y-6">
      {/* Panel Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
            <QrCode className="w-5 h-5 text-amber-400" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-red-600" />
          </span>
          <div>
            <p className="section-kicker">PORTAL KONTINGEN</p>
            <h2 className="mt-0.5 text-lg font-black tracking-tight text-slate-950 sm:text-xl">
              Credential & Tiket Registrasi
            </h2>
            <p className="mt-0.5 text-[10px] sm:text-xs text-slate-500">
              Tunjukkan barcode QR kepada Panitia saat tiba di Kampus Terpadu untuk Check-in & Basecamp.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadQR}
            disabled={!qrDataUrl}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-700 px-3.5 py-2 text-[11px] font-black text-white shadow-md hover:bg-red-800 transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Unduh QR</span>
          </button>
        </div>
      </div>

      {/* Luxury Stadium Credential Pass Layout in deep Navy / Slate-950 */}
      <div className="mx-auto max-w-4xl" id="print-area-wrapper">
        <div className="relative overflow-hidden rounded-[30px] bg-slate-950 text-white shadow-[0_24px_60px_rgba(15,23,42,0.24)] border border-slate-800">
          {/* Subtle Ambient Glows */}
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-red-700/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

          {/* Top Bar Credential */}
          <div className="relative flex items-center justify-between gap-2.5 border-b border-white/10 px-3.5 py-3 sm:px-7 sm:py-3.5">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <img
                src={logoLbb}
                alt="Logo LBB"
                className="h-7 sm:h-9 w-auto object-contain shrink-0 drop-shadow-md"
              />
              <img
                src={titleLogoImg}
                alt="LBB Mu'allimin 2027"
                className="h-5 sm:h-7 w-auto object-contain max-w-[120px] sm:max-w-[170px]"
              />
            </div>
            <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-emerald-400 whitespace-nowrap shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Credential Aktif</span>
            </span>
          </div>

          {/* Grid: Left Meta, Right White QR Card */}
          <div className="relative grid lg:grid-cols-[minmax(0,1fr)_290px]">
            {/* Sisi Kiri: Identitas Peleton & Specs */}
            <div className="flex flex-col justify-between p-6 sm:p-8">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">
                  Identitas Peleton
                </p>
                <h3 className="mt-2.5 max-w-xl text-2xl sm:text-3xl font-black uppercase leading-[1.08] tracking-[-0.035em] text-white">
                  {currentTeam.schoolName}
                </h3>
                <p className="mt-2.5 flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
                  <span>
                    {currentTeam.platoonName || `Peleton ${currentTeam.schoolName}`} · Jenjang {currentTeam.jenjang}
                  </span>
                </p>
              </div>

              {/* 4-Cell Spec Grid */}
              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
                {[
                  { label: 'Kategori', value: currentTeam.category || 'Homogen Putra' },
                  { label: 'Urutan Tampil', value: currentTeam.lotNumber ? `#${String(currentTeam.lotNumber).padStart(2, '0')}` : 'Belum TM' },
                  { label: 'No. Dada', value: currentTeam.chestNumber || '—' },
                  { label: 'Basecamp', value: currentTeam.basecampNumber || currentTeam.basecampRoom || 'Setelah UCL' },
                ].map(spec => (
                  <div key={spec.label} className="bg-slate-950/80 p-3">
                    <p className="text-[7px] font-black uppercase tracking-wider text-slate-500">
                      {spec.label}
                    </p>
                    <p className="mt-1 truncate font-mono text-[10px] sm:text-[11px] font-black text-white">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Validity Footer */}
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[8px] sm:text-[9px] font-black tracking-wider text-slate-500">
                <span>VALIDITAS: 09–24 JANUARI 2027</span>
                <span>LOKASI: KAMPUS TERPADU SEDAYU</span>
              </div>
            </div>

            {/* Sisi Kanan: White QR Box */}
            <div className="border-t border-white/10 bg-white/[0.035] p-5 sm:p-6 lg:border-l lg:border-t-0 flex items-center justify-center">
              <div className="w-full max-w-[240px] rounded-[22px] bg-white p-4 text-center shadow-2xl">
                {/* QR Code */}
                <div className="aspect-square w-full flex items-center justify-center overflow-hidden rounded-xl bg-white p-1">
                  {isGeneratingQr ? (
                    <div className="h-44 w-44 flex items-center justify-center text-slate-400 font-mono text-[10px]">
                      Menyiapkan QR...
                    </div>
                  ) : (
                    <img
                      src={qrDataUrl}
                      alt={`QR Code ${currentTeam.regCode}`}
                      className="h-full w-full object-contain"
                      loading="eager"
                    />
                  )}
                </div>

                <p className="mt-3 font-mono text-xs font-black tracking-[0.14em] text-slate-950">
                  {currentTeam.regCode || 'LBB27-PENDING'}
                </p>

                <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Scan untuk verifikasi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
