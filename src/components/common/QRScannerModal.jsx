import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Camera,
  RotateCcw,
  Upload,
  AlertTriangle,
  Zap,
  ZapOff,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

// Audio feedback sederhana menggunakan Web Audio API tanpa aset eksternal
function playSuccessBeep() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch (err) {
    // Ignore audio restrictions
  }
}

export default function QRScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
  title = 'Pindai QR ID Card Peleton'
}) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [scannedResult, setScannedResult] = useState('');
  const [cameras, setCameras] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);

  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const isStoppingRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = orig;
    };
  }, [isOpen]);



  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setIsInitializing(true);
    setErrorMessage('');
    setScannedResult('');
    isStoppingRef.current = false;

    const elementId = 'qr-camera-viewport';
    const scanner = new Html5Qrcode(elementId);
    scannerRef.current = scanner;

    const startCamera = async () => {
      try {
        const availableDevices = await Html5Qrcode.getCameras();
        if (mounted && availableDevices && availableDevices.length > 0) {
          setCameras(availableDevices);
        }

        const cameraConfig = { facingMode: 'environment' };

        await scanner.start(
          cameraConfig,
          {
            fps: 15,
          },
          (decodedText) => {
            if (isStoppingRef.current) return;
            isStoppingRef.current = true;

            playSuccessBeep();
            if (navigator.vibrate) {
              navigator.vibrate(80);
            }

            setScannedResult(decodedText);

            setTimeout(async () => {
              try {
                if (scanner.isScanning) {
                  await scanner.stop();
                  scanner.clear();
                }
              } catch (e) {}
              onScanSuccess(decodedText);
              onClose();
            }, 600);
          },
          () => {}
        );

        if (mounted) {
          setIsInitializing(false);
          try {
            const capabilities = scanner.getRunningTrackCapabilities();
            if (capabilities && 'torch' in capabilities) {
              setHasTorch(true);
            }
          } catch {
            setHasTorch(false);
          }
        }
      } catch (err) {
        if (!mounted) return;
        setIsInitializing(false);
        const msg = String(err?.message || err || '');
        if (msg.includes('NotAllowedError') || msg.includes('Permission')) {
          setErrorMessage('Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser Anda, atau gunakan opsi upload foto QR.');
        } else if (msg.includes('NotFoundError') || msg.includes('DevicesNotFoundError')) {
          setErrorMessage('Kamera tidak ditemukan pada perangkat Anda. Silakan upload gambar QR.');
        } else {
          setErrorMessage('Gagal membuka modul kamera: ' + msg);
        }
      }
    };

    const timer = setTimeout(() => {
      startCamera();
    }, 150);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().then(() => {
              scannerRef.current.clear();
            }).catch(() => {});
          } else {
            scannerRef.current.clear();
          }
        } catch {}
      }
    };
  }, [isOpen]);

  const handleToggleTorch = async () => {
    if (!scannerRef.current || !hasTorch) return;
    try {
      const nextTorch = !torchOn;
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: nextTorch }]
      });
      setTorchOn(nextTorch);
    } catch (err) {
      console.warn('Gagal mengubah senter:', err);
    }
  };

  const handleSwitchCamera = async () => {
    if (!scannerRef.current || cameras.length <= 1) return;
    try {
      setIsInitializing(true);
      const nextIndex = (currentCameraIndex + 1) % cameras.length;
      setCurrentCameraIndex(nextIndex);

      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }

      await scannerRef.current.start(
        cameras[nextIndex].id,
        {
          fps: 15,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const edge = Math.min(viewfinderWidth, viewfinderHeight);
            const size = Math.floor(edge * 0.72);
            return {
              width: Math.min(size, 320),
              height: Math.min(size, 320),
            };
          },
        },
        (decodedText) => {
          if (isStoppingRef.current) return;
          isStoppingRef.current = true;
          playSuccessBeep();
          if (navigator.vibrate) navigator.vibrate(80);
          setScannedResult(decodedText);
          setTimeout(async () => {
            try {
              if (scannerRef.current.isScanning) {
                await scannerRef.current.stop();
                scannerRef.current.clear();
              }
            } catch {}
            onScanSuccess(decodedText);
            onClose();
          }, 600);
        },
        () => {}
      );
      setIsInitializing(false);
    } catch (err) {
      setIsInitializing(false);
      setErrorMessage('Gagal beralih kamera: ' + (err?.message || ''));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !scannerRef.current) return;

    try {
      setIsInitializing(true);
      setErrorMessage('');

      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }

      const decodedText = await scannerRef.current.scanFile(file, false);
      if (decodedText) {
        playSuccessBeep();
        if (navigator.vibrate) navigator.vibrate(80);
        setScannedResult(decodedText);
        setTimeout(() => {
          onScanSuccess(decodedText);
          onClose();
        }, 500);
      }
    } catch (err) {
      setIsInitializing(false);
      setErrorMessage('QR Code tidak terdeteksi pada gambar. Pastikan gambar jelas dan tidak buram.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[999999] bg-black text-white flex flex-col h-[100dvh] w-screen select-none overflow-hidden animate-in fade-in duration-200">

      {/* Hidden File Input untuk Fallback Upload Gambar */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* 1. TOP HEADER OVERLAY (Floating on Camera) */}
      <div className="relative z-30 pt-safe px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent flex items-center justify-between gap-3">
        {/* Tombol Back / Tutup */}
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md border border-white/20 shrink-0"
          title="Kembali / Tutup Pemindai"
        >
          <ChevronLeft className="w-6 h-6 -ml-0.5" />
        </button>

        {/* Info Judul */}
        <div className="text-center min-w-0 flex-1">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-white drop-shadow truncate">
            {title}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-300 font-medium drop-shadow truncate">
            Arahkan kamera ke QR Code ID Card Peleton
          </p>
        </div>

        {/* Tombol Tutup X Alternatif */}
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md border border-white/20 shrink-0"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. MAIN FULLSCREEN CAMERA VIEWPORT */}
      <div className="relative flex-1 w-full bg-black flex items-center justify-center overflow-hidden">
        {/* Container Kamera Fullscreen */}
        <div id="qr-camera-viewport" className="w-full h-full absolute inset-0" />

        {/* VIEWFINDER MASK & TARGET FRAME */}
        {!errorMessage && !scannedResult && !isInitializing && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10 p-4">
            {/* Cutout Scanner Frame dengan Dark Backdrop Mask Vignette */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-[0_0_0_9999px_rgba(0,0,0,0.58)]">
              {/* 4 Sudut Pemindai Glow Cyan / Teal */}
              <span className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-teal-400 rounded-tl-2xl drop-shadow-[0_0_8px_#2dd4bf]" />
              <span className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-teal-400 rounded-tr-2xl drop-shadow-[0_0_8px_#2dd4bf]" />
              <span className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-teal-400 rounded-bl-2xl drop-shadow-[0_0_8px_#2dd4bf]" />
              <span className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-teal-400 rounded-br-2xl drop-shadow-[0_0_8px_#2dd4bf]" />

              {/* Garis Laser Animasi Bergerak */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-300 to-transparent shadow-[0_0_15px_#2dd4bf] animate-[scan_2s_ease-in-out_infinite]" />
            </div>

            {/* Petunjuk Pemindaian */}
            <div className="mt-6 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/15 tracking-wide shadow-lg">
              Posisikan barcode di dalam kotak
            </div>
          </div>
        )}

        {/* LOADING INDICATOR */}
        {isInitializing && !errorMessage && !scannedResult && (
          <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-xs flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="w-12 h-12 border-3 border-teal-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(20,184,166,0.3)]" />
            <p className="text-sm font-bold text-white tracking-wide">Menghubungkan ke kamera...</p>
            <p className="text-xs text-slate-400 max-w-xs">Pastikan Anda telah mengizinkan izin kamera browser.</p>
          </div>
        )}

        {/* SUCCESS OVERLAY */}
        {scannedResult && (
          <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center gap-3 p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_30px_#10b981] animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <p className="text-xs uppercase font-black text-emerald-400 tracking-widest">QR Code Terdeteksi!</p>
              <p className="text-base font-mono font-black text-white mt-1 break-all bg-white/10 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-sm">
                {scannedResult}
              </p>
            </div>
            <p className="text-xs text-slate-300">Membuka data peleton...</p>
          </div>
        )}

        {/* ERROR / PERMISSION BLOCKED */}
        {errorMessage && (
          <div className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Akses Kamera Terkendala</h4>
              <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Foto Barcode</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-all cursor-pointer active:scale-95 border border-white/15"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM FLOATING CONTROLS (Native App Style) */}
      <div className="relative z-30 pb-safe px-6 py-5 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex items-center justify-center gap-8 sm:gap-12">
        {/* Tombol Tutup / Batal */}
        <button
          type="button"
          onClick={onClose}
          className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-white transition-all cursor-pointer group active:scale-95"
        >
          <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 border border-white/15 backdrop-blur-md flex items-center justify-center text-slate-300 group-hover:text-white shadow-md">
            <X className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold tracking-tight">Tutup</span>
        </button>

        {/* Tombol Upload dari Galeri */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-1.5 text-slate-300 hover:text-white transition-all cursor-pointer group active:scale-95"
        >
          <div className="w-14 h-14 rounded-full bg-teal-500/20 group-hover:bg-teal-500/30 border border-teal-400/40 backdrop-blur-md flex items-center justify-center text-teal-300 shadow-lg shadow-teal-500/20">
            <Upload className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold tracking-tight text-teal-300">Galeri Foto</span>
        </button>

        {/* Tombol Senter (Torch) atau Balik Kamera */}
        {hasTorch ? (
          <button
            type="button"
            onClick={handleToggleTorch}
            className="flex flex-col items-center gap-1.5 text-slate-300 hover:text-white transition-all cursor-pointer group active:scale-95"
          >
            <div
              className={`w-12 h-12 rounded-full border backdrop-blur-md flex items-center justify-center shadow-md transition-all ${
                torchOn
                  ? 'bg-amber-400 border-amber-300 text-slate-950 font-black shadow-[0_0_15px_#f59e0b]'
                  : 'bg-white/10 group-hover:bg-white/20 border-white/15 text-white'
              }`}
            >
              {torchOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
            </div>
            <span className="text-[11px] font-bold tracking-tight">
              {torchOn ? 'Senter Aktif' : 'Senter'}
            </span>
          </button>
        ) : cameras.length > 1 ? (
          <button
            type="button"
            onClick={handleSwitchCamera}
            className="flex flex-col items-center gap-1.5 text-slate-300 hover:text-white transition-all cursor-pointer group active:scale-95"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 border border-white/15 backdrop-blur-md flex items-center justify-center text-white shadow-md">
              <RotateCcw className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold tracking-tight">Balik Kamera</span>
          </button>
        ) : null}
      </div>

    </div>,
    document.body
  );
}
