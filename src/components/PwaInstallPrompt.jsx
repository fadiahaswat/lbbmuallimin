import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Jangan tampilkan jika sudah dalam mode standalone/aplikasi terpasang
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) return;

    // Cek apakah user sudah menutup banner
    if (localStorage.getItem('pwa_prompt_dismissed') === 'true') {
      return;
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsVisible(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!isVisible || !deferredPrompt) {
    return null;
  }

  // Native-style bottom bar (serupa Chrome/Edge Add to Home Screen infobar)
  return (
    <aside
      aria-label="Instalasi Aplikasi"
      className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] py-2.5 px-4"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Identitas Aplikasi */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/pwa-192x192.png"
            alt=""
            width="36"
            height="36"
            className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 object-contain shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate leading-tight">
              LBB Mu'allimin 2027
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              lbb.tontimuallimin.com
            </p>
          </div>
        </div>

        {/* Tombol Aksi Bersih & Minimalis */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDismiss}
            className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2.5 py-1.5 rounded-md transition-colors"
          >
            Nanti
          </button>
          <button
            type="button"
            onClick={handleInstall}
            className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 px-3 py-1.5 rounded-md shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Pasang</span>
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Tutup"
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
