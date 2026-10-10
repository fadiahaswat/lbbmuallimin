import React, { useEffect, useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Building,
  Users,
  FileText,
  MessageCircle,
  Download,
  AlertCircle
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import logoTonti from '../../assets/logo-tonti.png';
import titleLogoImg from '../../assets/title-logo.png';
import { generateParticipantQRCode, downloadDataUrl } from '../../utils/qrGenerator.js';

export default function ParticipantQRStatusView({ regCode, onBack }) {
  const { teams, currentUser, openAuthModal, navigateTo, setCurrentUser, setRole, setCurrentTeamId } = useCompetition();

  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isGeneratingQr, setIsGeneratingQr] = useState(true);

  // Find the team by regCode
  const team = teams.find(
    t => String(t.regCode || '').toUpperCase() === String(regCode || '').toUpperCase()
  );

  useEffect(() => {
    if (!regCode) return;
    const targetUrl = `${window.location.origin}/?reg=${encodeURIComponent(regCode)}`;
    setIsGeneratingQr(true);
    generateParticipantQRCode(targetUrl, { size: 600 })
      .then(url => {
        setQrDataUrl(url);
      })
      .catch(err => {
        console.error('Failed generating QR:', err);
      })
      .finally(() => {
        setIsGeneratingQr(false);
      });
  }, [regCode]);

  if (!team) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto">
            <XCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black uppercase text-white tracking-tight">Data Tidak Ditemukan</h2>
          <p className="text-xs text-slate-400">
            Nomor registrasi <span className="font-mono text-red-400 font-bold">{regCode}</span> tidak terdaftar dalam database pendaftaran.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const isApproved = team.status === 'verified' || team.status === 'approved';
  const isPending = team.status === 'pending' || !team.status;
  const isRejected = team.status === 'rejected';

  const handleEnterPortal = () => {
    // If user is already logged in with this email or we auto-authenticate verified team session
    if (currentUser?.email?.toLowerCase() === team.email?.toLowerCase()) {
      navigateTo('peserta_dashboard');
      return;
    }

    // Auto log in as participant if approved
    if (isApproved) {
      const user = {
        id: `user-${team.id}`,
        name: team.officialName || team.schoolName,
        email: team.email,
        role: 'peserta',
        roleLabel: 'Calon Peserta Resmi',
        teamId: team.id,
        schoolName: team.schoolName,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(team.schoolName)}&background=8B0000&color=fff&bold=true`
      };
      if (setCurrentUser) setCurrentUser(user);
      if (setRole) setRole('peserta');
      if (setCurrentTeamId) setCurrentTeamId(team.id);
      navigateTo('peserta_dashboard');
    } else {
      openAuthModal('login');
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    downloadDataUrl(qrDataUrl, `QR-${team.regCode}-${team.schoolName.replace(/\s+/g, '_')}.png`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-red-500 selection:text-white relative">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-950/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full bg-slate-950/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6 text-center animate-in zoom-in-95 duration-200">
        
        {/* Header logos */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5 text-left">
            <img src={logoTonti} alt="Logo Tonti" className="h-8 w-auto object-contain" />
            <img src={titleLogoImg} alt="LBB Mu'allimin 2027" className="h-7 w-auto object-contain hidden sm:block" />
          </div>
          <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
            QR Scanner Verifier
          </span>
        </div>

        {/* Status Badge & Title */}
        <div className="space-y-2">
          {isApproved && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Pendaftaran Telah Di-ACC Panitia</span>
            </div>
          )}

          {isPending && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-400 animate-pulse">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Menunggu ACC / Verifikasi Panitia</span>
            </div>
          )}

          {isRejected && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400">
              <XCircle className="w-4 h-4 text-red-400" />
              <span>Pendaftaran Ditolak / Butuh Revisi</span>
            </div>
          )}

          <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tight">
            {team.schoolName}
          </h2>
          <p className="text-xs text-slate-400">
            {team.teamType} • Jenjang {team.jenjang} • Kode: <span className="font-mono font-bold text-amber-400">{team.regCode}</span>
          </p>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl max-w-[260px] mx-auto shadow-xl border border-slate-700 flex flex-col items-center justify-center">
          {isGeneratingQr ? (
            <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs font-mono">
              Membuat QR...
            </div>
          ) : (
            <img
              src={qrDataUrl}
              alt={`QR Code ${team.regCode}`}
              className="w-52 h-52 object-contain"
            />
          )}
          <span className="text-[10px] font-mono text-slate-500 mt-2 font-bold uppercase tracking-wider">
            {team.regCode}
          </span>
        </div>

        {/* Status Content Description */}
        {isApproved ? (
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl text-left space-y-2 text-xs">
            <p className="font-bold text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Status: Verifikasi Administrasi Lolos (ACC)</span>
            </p>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Selamat! Seluruh berkas pendaftaran dan Pakta Integritas peleton Anda telah diverifikasi oleh Sekretariat LBB Mu'allimin 2027. Anda dapat langsung mengakses portal peserta untuk mengunduh ID Card, mengecek nomor undian peleton, dan melengkapi data roster.
            </p>
          </div>
        ) : isPending ? (
          <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-2xl text-left space-y-2 text-xs">
            <p className="font-bold text-amber-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Status: Sedang Ditinjau Sekretariat</span>
            </p>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Pendaftaran Anda sudah masuk antrean verifikasi panitia. Portal peserta akan aktif secara otomatis setelah berkas pendaftaran dan bukti administrasi disetujui (ACC) oleh admin.
            </p>
            <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px]">
              <span className="text-amber-200/80">Butuh konfirmasi cepat?</span>
              <a
                href={`https://wa.me/6281947491505?text=${encodeURIComponent(
                  `Halo Admin LBB Mu'allimin, saya mengecek status pendaftaran kode *${team.regCode}* atas nama *${team.schoolName}*. Mohon bantuan verifikasi. Terima kasih!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Hubungi WA Panitia</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-2xl text-left space-y-2 text-xs">
            <p className="font-bold text-red-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>Status: Pendaftaran Memerlukan Perbaikan</span>
            </p>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Pendaftaran ini belum disetujui karena berkas atau data belum lengkap. Silakan hubungi Sekretariat Panitia untuk melakukan verifikasi ulang.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {isApproved ? (
            <button
              type="button"
              onClick={handleEnterPortal}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Masuk ke Portal Peserta</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          ) : (
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center justify-center gap-2 font-mono">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Portal terkunci hingga di-ACC oleh panitia</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDownloadQR}
              disabled={!qrDataUrl}
              className="flex-1 py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Unduh QR Code</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
