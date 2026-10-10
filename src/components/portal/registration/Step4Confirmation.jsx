import React, { useState, useEffect } from 'react';
import {
  Clock,
  Check,
  Lock,
  MessageCircle,
  ExternalLink,
  ArrowRight,
  Download,
  QrCode
} from 'lucide-react';
import logoImg from '../../../assets/logo-tonti.png';
import { generateParticipantQRCode, downloadDataUrl, OFFICIAL_BASE_URL } from '../../../utils/qrGenerator.js';

export default function Step4Confirmation({
  createdTeam,
  setActiveView,
  openAuthModal
}) {
  const [qrDataUrl, setQrDataUrl] = React.useState('');
  const [isGeneratingQr, setIsGeneratingQr] = React.useState(true);

  React.useEffect(() => {
    if (!createdTeam?.regCode) return;
    const targetUrl = `${OFFICIAL_BASE_URL}/?reg=${encodeURIComponent(createdTeam.regCode)}`;
    setIsGeneratingQr(true);
    generateParticipantQRCode(targetUrl, { size: 600 })
      .then(url => {
        setQrDataUrl(url);
      })
      .catch(err => {
        console.error('Error generating confirmation QR:', err);
      })
      .finally(() => {
        setIsGeneratingQr(false);
      });
  }, [createdTeam?.regCode]);

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    downloadDataUrl(
      qrDataUrl,
      `QR-${createdTeam.regCode}-${(createdTeam.schoolName || 'peleton').replace(/\s+/g, '_')}.png`
    );
  };
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 text-center max-w-2xl mx-auto shadow-sm space-y-6 animate-in zoom-in-95 duration-200">
      <div className="flex justify-center mb-1">
        <img
          src={logoImg}
          alt="Logo Tonti Mu'allimin"
          className="h-14 w-auto filter drop-shadow-xs"
        />
      </div>

      <div className="w-14 h-14 bg-amber-50 border border-amber-200 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
        <Clock className="w-7 h-7" />
      </div>

      <div>
        <span className="text-xs font-black uppercase tracking-widest text-amber-800 bg-amber-100 border border-amber-200 px-3.5 py-1 rounded-full">
          Status: Menunggu ACC Admin
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase italic tracking-tight mt-3">
          Pendaftaran Berhasil Dikirim!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Data peleton <strong className="text-slate-900">{createdTeam.schoolName}</strong> beserta seluruh berkas dan Pakta Integritas Online telah masuk ke antrean verifikasi Sekretariat LBB Mu'allimin 2027.
        </p>
      </div>

      {/* Registration Code Badge */}
      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 inline-block text-left w-full shadow-inner">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2.5 mb-2.5 text-xs">
          <span className="text-slate-500 font-medium">Kode Pendaftaran:</span>
          <span className="font-mono font-black text-red-700 text-sm">{createdTeam.regCode}</span>
        </div>
        <div className="flex justify-between items-center border-b border-slate-200 pb-2.5 mb-2.5 text-xs">
          <span className="text-slate-500 font-medium">Email Akun Portal:</span>
          <span className="font-mono font-bold text-slate-900">{createdTeam.email}</span>
        </div>
        <div className="flex justify-between items-center border-b border-slate-200 pb-2.5 mb-2.5 text-xs">
          <span className="text-slate-500 font-medium">Pakta Integritas:</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Ditandatangani Digital Online</span>
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Tipe Pasukan:</span>
          <span className="font-bold text-slate-800">
            {createdTeam.teamType} ({createdTeam.jenjang})
          </span>
        </div>
      </div>

      {/* QR Code Khusus Peleton */}
      <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 rounded-3xl p-5 sm:p-6 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-slate-800">
          <QrCode className="w-5 h-5 text-red-700" />
          <h3 className="text-sm font-black uppercase tracking-tight">QR Code Registrasi Peleton Anda</h3>
        </div>
        <p className="text-[11px] text-slate-600 max-w-md mx-auto leading-relaxed">
          Simpan atau unduh QR code ini. Setiap kali di-scan, QR code ini akan menampilkan status verifikasi ACC panitia secara *real-time* dan otomatis membuka portal peserta setelah di-ACC.
        </p>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 inline-block shadow-sm">
          {isGeneratingQr ? (
            <div className="w-44 h-44 flex items-center justify-center text-slate-400 font-mono text-xs">
              Menyiapkan QR...
            </div>
          ) : (
            <img
              src={qrDataUrl}
              alt={`QR Code ${createdTeam.regCode}`}
              className="w-48 h-48 object-contain mx-auto"
            />
          )}
          <span className="block text-[11px] font-mono font-bold text-slate-700 mt-2">
            {createdTeam.regCode}
          </span>
        </div>

        <div>
          <button
            type="button"
            onClick={handleDownloadQR}
            disabled={!qrDataUrl}
            className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-yellow-400" />
            <span>Unduh QR Code (PNG)</span>
          </button>
        </div>
      </div>

      {/* Next Step Info */}
      <div className="p-4 sm:p-5 bg-amber-50/80 border border-amber-200 rounded-2xl text-left text-xs text-slate-700 leading-relaxed space-y-2">
        <p className="font-black flex items-center gap-1.5 text-amber-900 uppercase tracking-wider text-[11px]">
          <Lock className="w-4 h-4 text-amber-700" />
          <span>Petunjuk Akses Masuk Portal Calon Peserta:</span>
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
          <li>Admin panitia akan memeriksa kelengkapan berkas administrasi dan tanda tangan pakta integritas online Anda.</li>
          <li>Setelah Admin memberikan <strong className="text-slate-900">persetujuan (ACC)</strong>, akun Anda resmi aktif sebagai calon peserta.</li>
          <li>Masuk akun dilakukan <strong className="text-red-700">hanya lewat Google</strong> menggunakan email <strong className="text-slate-900">{createdTeam.email}</strong> pada menu <strong className="text-slate-900">Daftar/Masuk</strong>.</li>
        </ul>
      </div>

      {/* WhatsApp Confirmation Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-500/30 rounded-2xl text-left space-y-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <MessageCircle className="w-5 h-5 fill-white/20" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
              Konfirmasi Panitia (Opsional)
            </span>
            <h4 className="text-sm font-black text-slate-900 leading-tight">
              Kirim Konfirmasi Pendaftaran ke Panitia
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Beri tahu panitia via WhatsApp resmi jika ingin konfirmasi langsung agar berkas dan verifikasi dapat dicek lebih awal.
            </p>
          </div>
        </div>
        <a
          href={`https://wa.me/6281947491505?text=${encodeURIComponent(
            `Halo Admin Tonti Mu'allimin (Panitia LBB Mu'allimin 2027),\nSaya *${createdTeam.officialName || 'Official'}* dari *${createdTeam.schoolName}* ingin mengonfirmasi bahwa kami telah menyelesaikan pendaftaran online:\n\n• No. Registrasi: *${createdTeam.regCode}*\n• Asal Sekolah: *${createdTeam.schoolName}*\n• Jenjang / Kategori: *${createdTeam.jenjang} / ${createdTeam.teamType}*\n• Komandan: *${createdTeam.dantonName || '-'}*\n• No. WA Official: *${createdTeam.waNumber || '-'}*\n\nBerkas pendaftaran, bukti transfer, dan pakta integritas online sudah kami unggah di website. Mohon bantuan untuk verifikasi. Terima kasih!`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4 fill-white/20" />
          <span>Kirim WhatsApp Konfirmasi Panitia (0819-4749-1505)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={() => setActiveView('landing')}
          className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
        >
          Kembali ke Beranda
        </button>
        <button
          type="button"
          onClick={() => openAuthModal('login')}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Coba Masuk Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
