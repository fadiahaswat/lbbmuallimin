import React from 'react';
import {
  Camera,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Users,
  Phone
} from 'lucide-react';
import { formatImageUrl, getFallbackImageUrl } from '../../../../services/sheetService.js';

export default function TeamProfileHeader({
  currentTeam,
  hasLogo,
  logoLoadFailed,
  logoFormattedUrl,
  rawLogoUrl,
  setLogoLoadFailed,
  triggerFileUpload
}) {
  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* School & Platoon Profile */}
        <div className="flex items-center gap-5">
          {/* Logo / Emblem */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 border-2 border-white/20 p-2 flex items-center justify-center overflow-hidden shadow-lg backdrop-blur-md">
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
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-1">
                  <span className="font-black text-xl sm:text-2xl text-yellow-300 drop-shadow-xs">
                    {currentTeam.jenjang || 'LBB'}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-white/70 tracking-wider">
                    {(currentTeam.schoolName || '').split(' ')[0] || 'Tonti'}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => triggerFileUpload('schoolLogo')}
              className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-yellow-400 text-slate-950 shadow-md hover:bg-yellow-300 transition-all cursor-pointer"
              title="Ubah Logo Sekolah"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono font-black text-xs sm:text-sm text-yellow-400 bg-yellow-400/15 px-2.5 py-0.5 rounded-md border border-yellow-400/30">
                {currentTeam.regCode}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white/10 text-slate-200">
                Tingkat {currentTeam.jenjang}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white/10 text-slate-200">
                Kategori {currentTeam.category}
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black uppercase italic tracking-tight text-white">
              {currentTeam.schoolName}
            </h2>
            <p className="text-sm font-semibold text-yellow-300/90 mt-0.5">
              {currentTeam.platoonName}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
              <span className="inline-flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-300" /> Danton: <strong className="text-slate-200">{currentTeam.roster?.danton?.name || currentTeam.dantonName || '-'}</strong>
              </span>
              <span className="inline-flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-300" /> WA: <strong className="text-slate-200">{currentTeam.waNumber}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Status & Lot Number Cards */}
        <div className="flex flex-wrap md:flex-col items-end gap-3 shrink-0">
          {/* Verification Status */}
          <div>
            {currentTeam.status === 'pending' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" /> 1. Menunggu Verifikasi
              </span>
            )}
            {currentTeam.status === 'registered' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-black uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-blue-400" /> 2. Terdaftar (Lengkapi Peleton)
              </span>
            )}
            {currentTeam.status === 'revision' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Perlu Perbaikan
              </span>
            )}
            {currentTeam.status === 'verified' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 3. Terverifikasi Sah
              </span>
            )}
            {currentTeam.status === 'drawn' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-purple-400" /> 4. Peleton Siap Tampil
              </span>
            )}
          </div>

          {/* Box Info Undian & Kontingen: No Tampil, No Dada, Est Tampil, Basecamp */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-white/10 border border-white/15 rounded-2xl p-2 px-3 text-center min-w-[78px]">
              <span className="text-[9px] font-bold text-slate-300 uppercase block tracking-wider">No. Tampil</span>
              {currentTeam.lotNumber ? (
                <span className="text-lg sm:text-xl font-black text-yellow-400 font-mono block leading-tight mt-0.5">
                  #{String(currentTeam.lotNumber).padStart(2, '0')}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 italic block mt-1">Belum TM</span>
              )}
            </div>

            <div className="bg-white/10 border border-white/15 rounded-2xl p-2 px-3 text-center min-w-[78px]">
              <span className="text-[9px] font-bold text-slate-300 uppercase block tracking-wider">No. Dada</span>
              {currentTeam.chestNumber ? (
                <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono block leading-tight mt-0.5">
                  {currentTeam.chestNumber}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 italic block mt-1">-</span>
              )}
            </div>

            <div className="bg-white/10 border border-white/15 rounded-2xl p-2 px-3 text-center min-w-[78px]">
              <span className="text-[9px] font-bold text-slate-300 uppercase block tracking-wider">Est. Tampil</span>
              {currentTeam.estimatedTime ? (
                <span className="text-sm sm:text-base font-black text-cyan-400 font-mono block leading-tight mt-0.5">
                  {currentTeam.estimatedTime}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 italic block mt-1">-</span>
              )}
            </div>

            <div className="bg-white/10 border border-white/15 rounded-2xl p-2 px-3 text-center min-w-[78px]">
              <span className="text-[9px] font-bold text-slate-300 uppercase block tracking-wider">Basecamp</span>
              {currentTeam.basecampNumber ? (
                <span className="text-sm sm:text-base font-black text-amber-400 font-mono block leading-tight mt-0.5">
                  {currentTeam.basecampNumber}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 italic block mt-1">-</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
