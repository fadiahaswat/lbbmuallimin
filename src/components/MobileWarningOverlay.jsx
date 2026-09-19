import React, { useState, useEffect } from 'react';

function useIsMobilePhone() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function detect() {
      const uaPhone = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const narrowScreen = window.innerWidth < 768;
      setIsMobile(uaPhone || narrowScreen);
    }

    detect();
    window.addEventListener('resize', detect);
    return () => window.removeEventListener('resize', detect);
  }, []);

  return isMobile;
}

export default function MobileWarningOverlay() {
  const isMobile = useIsMobilePhone();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isMobile) setDismissed(false);
  }, [isMobile]);

  if (!isMobile || dismissed) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      aria-modal="true"
      role="dialog"
      aria-labelledby="mobile-warning-title"
    >
      {/* Deep blur backdrop */}
      <div className="absolute inset-0 backdrop-blur-xl bg-slate-900/50" />

      {/* Subtle radial glow behind card */}
      <div className="absolute w-72 h-72 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-xs rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
        style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />

        <div className="px-5 py-5 flex flex-col gap-3">
          {/* Title */}
          <div>
            <h2
              id="mobile-warning-title"
              className="text-sm font-black text-white uppercase tracking-wide"
            >
              Gunakan Laptop atau Desktop
            </h2>
            <p className="mt-1.5 text-xs text-white/60 leading-relaxed">
              Aplikasi ini tidak dioptimalkan untuk layar HP. Buka melalui laptop, desktop, atau tablet untuk pengalaman terbaik.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Button */}
          <button
            onClick={() => setDismissed(true)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-lg shadow-amber-500/30 active:scale-95 transition-transform"
          >
            Lanjutkan di HP
          </button>

          <p className="text-center text-[10px] text-white/30">
            Tampilan mungkin tidak optimal di layar kecil.
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
}
