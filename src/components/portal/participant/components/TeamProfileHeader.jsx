import React from 'react';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  User,
  Shield,
  Phone,
  Sparkles,
  School
} from 'lucide-react';
import { getFallbackImageUrl } from '../../../../services/sheetService.js';

export default function TeamProfileHeader({
  currentTeam,
  hasLogo,
  logoLoadFailed,
  logoFormattedUrl,
  rawLogoUrl,
  setLogoLoadFailed,
  triggerFileUpload
}) {
  const dantonName = currentTeam.roster?.danton?.name || currentTeam.dantonName || '-';
  const officialName = currentTeam.roster?.officials?.[0]?.name || currentTeam.officialName || currentTeam.coachName || '-';
  const waNumber = currentTeam.waNumber || '-';

  // Config status badge
  const statusConfig = {
    pending: {
      label: 'Menunggu Verifikasi',
      icon: Clock,
      theme: 'bg-amber-500/15 text-amber-300 border-amber-500/40'
    },
    registered: {
      label: 'Terdaftar',
      icon: CheckCircle2,
      theme: 'bg-blue-500/15 text-blue-300 border-blue-500/40'
    },
    revision: {
      label: 'Perlu Revisi',
      icon: AlertTriangle,
      theme: 'bg-rose-500/15 text-rose-300 border-rose-500/40'
    },
    verified: {
      label: 'Terverifikasi Sah',
      icon: ShieldCheck,
      theme: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
    },
    drawn: {
      label: 'Siap Tampil',
      icon: Sparkles,
      theme: 'bg-amber-400/20 text-amber-300 border-amber-400/50'
    }
  };

  const status = statusConfig[currentTeam.status] || statusConfig.registered;
  const StatusIcon = status.icon;

  const showSubtitle =
    currentTeam.platoonName &&
    currentTeam.platoonName.trim().toLowerCase() !== currentTeam.schoolName?.trim().toLowerCase() &&
    currentTeam.platoonName.trim().toLowerCase() !== `peleton ${currentTeam.schoolName?.trim().toLowerCase()}` &&
    currentTeam.platoonName.trim().toLowerCase() !== `pleton ${currentTeam.schoolName?.trim().toLowerCase()}`;

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Card Container */}
      <div className="relative z-10 p-4 sm:p-5 lg:p-6 space-y-3.5 sm:space-y-4">
        
        {/* Top Header: Identity & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          
          {/* Sisi Kiri: Logo + Nama Sekolah + Badge Jenjang/Kategori */}
          <div className="flex items-center gap-3.5 sm:gap-4.5 min-w-0 flex-1">
            {/* Logo Sekolah Avatar */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 p-1.5 sm:p-2 flex items-center justify-center overflow-hidden shadow-lg ring-1 ring-white/5">
                {hasLogo && !logoLoadFailed ? (
                  <img
                    src={logoFormattedUrl}
                    alt="Logo Sekolah"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const fallback = getFallbackImageUrl(rawLogoUrl);
                      if (fallback && e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      } else {
                        setLogoLoadFailed(true);
                      }
                    }}
                    className="w-full h-full object-contain filter drop-shadow"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-1">
                    <School className="w-6 h-6 text-amber-400/80 mb-0.5" />
                    <span className="text-[9px] uppercase font-black text-white/70 tracking-wider">
                      {currentTeam.jenjang || 'LBB'}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Upload Button */}
              <button
                onClick={() => triggerFileUpload('schoolLogo')}
                className="absolute -bottom-1 -right-1 p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-amber-400 text-slate-950 shadow-md hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-slate-900"
                title="Ganti Logo Sekolah"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            {/* Nama Sekolah & Metadata */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span className="text-[10px] sm:text-xs font-bold text-slate-300 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                  Tingkat {currentTeam.jenjang}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                  {currentTeam.category}
                </span>
              </div>

              <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-white uppercase tracking-tight leading-snug line-clamp-2 drop-shadow-xs">
                {currentTeam.schoolName}
              </h1>

              {showSubtitle && (
                <p className="text-xs sm:text-sm font-semibold text-amber-300/90 mt-0.5 truncate">
                  {currentTeam.platoonName}
                </p>
              )}
            </div>
          </div>

          {/* Sisi Kanan: Status Badge Mandiri (Rapi di desktop & mobile) */}
          <div className="shrink-0 flex items-center justify-start sm:justify-end">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-xs ${status.theme}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{status.label}</span>
            </span>
          </div>

        </div>

        {/* Bottom Bar: Personel & Kontak (Data Table / Grid Elegan) */}
        <div className="bg-slate-950/60 rounded-xl sm:rounded-2xl border border-white/5 p-2.5 sm:p-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
          {/* Danton */}
          <div className="flex items-center gap-2.5 sm:px-2 pt-1 sm:pt-0">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-medium text-slate-400 block leading-tight">
                Komandan Peleton
              </span>
              <span className="text-xs sm:text-sm font-bold text-white truncate block">
                {dantonName}
              </span>
            </div>
          </div>

          {/* Official */}
          <div className="flex items-center gap-2.5 sm:px-2 pt-2 sm:pt-0">
            <div className="w-8 h-8 rounded-lg bg-blue-400/10 border border-blue-400/20 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-medium text-slate-400 block leading-tight">
                Official / Pendamping
              </span>
              <span className="text-xs sm:text-sm font-bold text-white truncate block">
                {officialName}
              </span>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex items-center gap-2.5 sm:px-2 pt-2 sm:pt-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-medium text-slate-400 block leading-tight">
                No. WhatsApp Tim
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-emerald-300 truncate block">
                {waNumber}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
