import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { registerDialogHost, registerToastHost } from '../../utils/appDialog';

const VARIANT_CONFIG = {
  info: {
    defaultTitle: 'Konfirmasi',
    alertTitle: 'Informasi',
    icon: Info,
    iconWrap: 'bg-slate-100 text-slate-700 border-slate-200',
    confirmBtn: 'bg-slate-900 hover:bg-slate-800 text-white',
    toastIconWrap: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  success: {
    defaultTitle: 'Konfirmasi Aksi',
    alertTitle: 'Berhasil',
    icon: CheckCircle2,
    iconWrap: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    confirmBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    toastIconWrap: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  warning: {
    defaultTitle: 'Perhatian',
    alertTitle: 'Perhatian',
    icon: AlertTriangle,
    iconWrap: 'bg-amber-50 text-amber-600 border-amber-200',
    confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
    toastIconWrap: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  danger: {
    defaultTitle: 'Konfirmasi Tindakan',
    alertTitle: 'Peringatan',
    icon: ShieldAlert,
    iconWrap: 'bg-rose-50 text-rose-600 border-rose-200',
    confirmBtn: 'bg-rose-600 hover:bg-rose-700 text-white',
    toastIconWrap: 'bg-rose-50 text-rose-600 border-rose-100',
  },
};

export default function AppDialogHost() {
  const [queue, setQueue] = useState([]);
  const [promptValue, setPromptValue] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const inputRef = useRef(null);

  const active = queue[0] || null;

  useEffect(() => {
    const unregisterDialog = registerDialogHost((item) => {
      setQueue((prev) => [...prev, item]);
    });
    const unregisterToast = registerToastHost((payload) => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToast(payload);
      toastTimerRef.current = setTimeout(() => {
        setToast(null);
        toastTimerRef.current = null;
      }, payload.duration || 3200);
    });

    return () => {
      unregisterDialog();
      unregisterToast();
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    if (active.type === 'prompt') {
      setPromptValue(active.defaultValue || '');
      setCopiedPrompt(false);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 40);
    }
  }, [active]);

  const closeCurrent = (result) => {
    if (!active) return;
    active.resolve(result);
    setQueue((prev) => prev.slice(1));
  };

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (active.type === 'alert') closeCurrent(undefined);
        else if (active.type === 'confirm') closeCurrent(false);
        else closeCurrent(null);
      } else if (e.key === 'Enter' && active.type !== 'prompt') {
        e.preventDefault();
        if (active.type === 'alert') closeCurrent(undefined);
        else if (active.type === 'confirm') closeCurrent(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);

  const handleCopyPromptValue = async () => {
    try {
      await navigator.clipboard.writeText(promptValue);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 1800);
    } catch {
      if (inputRef.current) {
        inputRef.current.select();
        document.execCommand?.('copy');
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 1800);
      }
    }
  };

  const cfg = active ? (VARIANT_CONFIG[active.variant] || VARIANT_CONFIG.info) : VARIANT_CONFIG.info;
  const IconComp = cfg.icon;
  const modalTitle =
    active?.title ||
    (active?.type === 'alert' ? cfg.alertTitle : active?.type === 'prompt' ? 'Input Data' : cfg.defaultTitle);

  const toastCfg = toast ? (VARIANT_CONFIG[toast.variant] || VARIANT_CONFIG.success) : VARIANT_CONFIG.success;
  const ToastIcon = toastCfg.icon;

  return (
    <>
      {/* Custom Global Modal Dialog */}
      {active && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-[2px] animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          onClick={() => {
            if (active.type === 'alert') closeCurrent(undefined);
            else if (active.type === 'confirm') closeCurrent(false);
            else closeCurrent(null);
          }}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-[0_24px_60px_rgba(15,23,42,0.22)] overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${cfg.iconWrap}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="min-w-0 pt-0.5">
                  <h3 className="text-sm font-black text-slate-900 leading-snug">
                    {modalTitle}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (active.type === 'alert') closeCurrent(undefined);
                  else if (active.type === 'confirm') closeCurrent(false);
                  else closeCurrent(null);
                }}
                aria-label="Tutup dialog"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 pb-5">
              <div className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-line pl-[52px]">
                {active.message}
              </div>

              {active.type === 'prompt' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    closeCurrent(promptValue);
                  }}
                  className="mt-3.5 pl-[52px]"
                >
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={promptValue}
                      readOnly={active.readOnly}
                      onChange={(e) => setPromptValue(e.target.value)}
                      placeholder={active.placeholder}
                      className="flex-1 px-3 py-2 text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 outline-none transition-all"
                    />
                    {active.readOnly && (
                      <button
                        type="button"
                        onClick={handleCopyPromptValue}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                      >
                        {copiedPrompt ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Disalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2">
              {active.type !== 'alert' && (
                <button
                  type="button"
                  onClick={() => closeCurrent(active.type === 'confirm' ? false : null)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer active:scale-95"
                >
                  {active.cancelText || 'Batal'}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (active.type === 'alert') closeCurrent(undefined);
                  else if (active.type === 'confirm') closeCurrent(true);
                  else closeCurrent(promptValue);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs ${cfg.confirmBtn}`}
              >
                {active.confirmText || 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Floating Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-[110] max-w-sm w-[calc(100vw-2.5rem)] sm:w-auto bg-white text-slate-800 pl-3 pr-2.5 py-2.5 rounded-xl border border-slate-200/90 shadow-[0_12px_32px_rgba(15,23,42,0.12)] flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${toastCfg.toastIconWrap}`}>
            <ToastIcon className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-700 leading-snug pr-1">
            {toast.message}
          </span>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Tutup notifikasi"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
}
