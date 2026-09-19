import React, { useState, useEffect } from 'react';

const DISMISS_KEY = 'lbb_mobile_warning_dismissed';

function useIsMobilePhone() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function detect() {
      // Gunakan User-Agent sebagai sumber kebenaran utama,
      // bukan window.innerWidth — supaya tidak flip saat keyboard virtual muncul
      const uaPhone = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      // Fallback ke lebar screen (bukan innerWidth) untuk menghindari flip saat keyboard muncul
      const narrowScreen = window.screen.width < 768;
      setIsMobile(uaPhone || narrowScreen);
    }

    detect();
    // Tidak perlu listener resize — screen.width tidak berubah saat keyboard virtual muncul
  }, []);

  return isMobile;
}

export default function MobileWarningOverlay() {
  const isMobile = useIsMobilePhone();

  // Inisialisasi langsung dari sessionStorage supaya tidak flash saat render ulang
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  function handleDismiss() {
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // sessionStorage tidak tersedia (mode incognito ketat, dll) — abaikan
    }
    setDismissed(true);
  }

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

        <div className="px-5 py-5 flex flex-col items-center gap-3 text-center">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/20"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-amber-400"
            >
              <rect x="2" y="4" width="20" height="13" rx="2" />
              <path d="M1 21h22" />
            </svg>
          </div>

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
            onClick={handleDismiss}
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

