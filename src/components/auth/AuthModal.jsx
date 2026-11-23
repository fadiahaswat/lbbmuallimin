import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  Clock,
  ExternalLink,
  Loader2,
  ShieldCheck,
  ChevronRight,
  SearchCheck,
  Users,
  Compass,
  Trophy
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import logoImg from '../../assets/logo-tonti.png';
import titleLogoImg from '../../assets/title-logo.png';
import { SITE, GOOGLE_AUTH } from '../../config.js';

// Pilihan foto resolusi tinggi (16:9 HD/4K) untuk latar belakang progresif
const AUTH_BG_SLIDES = [
  { webp: '/section-tentang.webp', fallback: '/section-tentang.jpg' },
  { webp: '/galeri-tonti/IMG_3353.webp', fallback: '/galeri-tonti/IMG_3353.jpg' },
  { webp: '/galeri-tonti/IMG_3357.webp', fallback: '/galeri-tonti/IMG_3357.jpg' },
  { webp: '/galeri-tonti/IMG_3358.webp', fallback: '/galeri-tonti/IMG_3358.jpg' },
  { webp: '/galeri-tonti/IMG_3360.webp', fallback: '/galeri-tonti/IMG_3360.jpg' },
  { webp: '/galeri-tonti/IMG_3362.webp', fallback: '/galeri-tonti/IMG_3362.jpg' },
];

export default function AuthModal() {
  const {
    authModal,
    closeAuthModal,
    loginUser,
    goBack,
    activeView,
    setActiveView,
  } = useCompetition();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [errorType, setErrorType] = useState('');
  const [loadedSlides, setLoadedSlides] = useState([]);
  const [activeSlidePos, setActiveSlidePos] = useState(0);

  const isOpen = activeView === 'auth' || Boolean(authModal?.isOpen);

  // Preload foto HD secara bertahap; hanya tampilkan jika sudah terload sempurna
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const preloadOne = (slide) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (typeof img.decode === 'function') {
            img.decode().catch(() => {}).finally(() => resolve(slide.webp));
          } else {
            resolve(slide.webp);
          }
        };
        img.onerror = () => {
          const fb = new Image();
          fb.onload = () => resolve(slide.fallback);
          fb.onerror = () => resolve(null);
          fb.src = slide.fallback;
        };
        img.src = slide.webp;
      });

    (async () => {
      for (const slide of AUTH_BG_SLIDES) {
        if (cancelled) break;
        const readyUrl = await preloadOne(slide);
        if (!cancelled && readyUrl) {
          setLoadedSlides((prev) => (prev.includes(readyUrl) ? prev : [...prev, readyUrl]));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Rotasi lembut hanya antar foto yang sudah benar-benar siap
  useEffect(() => {
    if (!isOpen || loadedSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlidePos((prev) => (prev + 1) % loadedSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isOpen, loadedSlides.length]);

  const hasPhotoBg = loadedSlides.length > 0;

  const clientId = GOOGLE_AUTH.CLIENT_ID;

  const handleClose = () => {
    if (closeAuthModal) {
      closeAuthModal();
    } else {
      goBack();
    }
  };

  // 1. Google OAuth 2.0 Flow
  const handleGoogleSignIn = () => {
    setLoginError('');
    setErrorType('');

    if (!window.google?.accounts?.oauth2) {
      setLoginError('Sedang menghubungkan ke server Google, silakan tunggu beberapa detik dan coba lagi.');
      return;
    }

    setIsSigningIn(true);

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setIsSigningIn(false);
            if (tokenResponse.error !== 'popup_closed_by_user') {
              setLoginError(`Google Sign-In gagal: ${tokenResponse.error_description || tokenResponse.error}`);
            }
            return;
          }

          let googleProfile;
          try {
            try {
              if (tokenResponse?.access_token) {
                sessionStorage.setItem('lbb_last_google_token', tokenResponse.access_token);
              }
            } catch (e) {}

            const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?_t=${Date.now()}`, {
              cache: 'no-store',
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });

            if (!userInfoResponse.ok) {
              throw new Error(`HTTP ${userInfoResponse.status}`);
            }

            googleProfile = await userInfoResponse.json();
          } catch (apiErr) {
            setIsSigningIn(false);
            console.error('[AuthModal] Gagal mengambil profil Google:', apiErr);
            setLoginError('Gagal mengambil data profil dari server Google. Pastikan koneksi internet stabil atau nonaktifkan ad-blocker.');
            return;
          }

          if (!googleProfile?.email) {
            setIsSigningIn(false);
            setLoginError('Tidak dapat membaca alamat email dari akun Google Anda.');
            return;
          }

          try {
            const cleanEmail = googleProfile.email.toLowerCase();
            const resLogin = await loginUser(cleanEmail, googleProfile.name, googleProfile.picture);
            setIsSigningIn(false);

            if (!resLogin?.success) {
              setLoginError(resLogin?.message || 'Email Google Anda belum terdaftar atau belum di-ACC oleh Admin.');
              setErrorType(resLogin?.error || 'unknown');
            }
          } catch (loginErr) {
            setIsSigningIn(false);
            console.error('[AuthModal] Gagal memproses login user:', loginErr);
            setLoginError('Terjadi kendala saat memproses verifikasi tim: ' + (loginErr?.message || 'Gagal verifikasi data.'));
          }
        },
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      setIsSigningIn(false);
      setLoginError('Gagal membuka popup Google: ' + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`min-h-screen flex flex-col selection:bg-red-700 selection:text-white font-sans relative overflow-hidden transition-colors duration-700 ${
      hasPhotoBg ? 'bg-slate-950 text-slate-900' : 'bg-slate-100/80 text-slate-900'
    }`}>
      {/* Fallback Default Canvas (Tampil Instan Sebelum Foto Siap) */}
      <div
        className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${
          hasPhotoBg ? 'opacity-0' : 'opacity-[0.35]'
        }`}
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Progressive High-Res Photo Slideshow Background (Muncul Halus Setelah Foto Siap) */}
      {hasPhotoBg && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          {loadedSlides.map((url, idx) => (
            <img
              key={url}
              src={url}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-1000 ease-in-out ${
                idx === activeSlidePos % loadedSlides.length ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          {/* Cinematic Dark Frosted Scrim agar kartu & tombol tetap sangat kontras */}
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[3px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-slate-950/60" />
        </div>
      )}

      {/* Main Centered Split Auth Studio (Full-Viewport Clean Focus) */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center gap-4 relative z-10">
        <div className={`w-full grid lg:grid-cols-12 rounded-[28px] overflow-hidden bg-white transition-shadow duration-700 ${
          hasPhotoBg
            ? 'shadow-[0_28px_70px_rgba(0,0,0,0.45)] border border-white/15'
            : 'shadow-[0_24px_60px_rgba(15,23,42,0.12)] border border-slate-200/90'
        }`}>
          
          {/* LEFT PANEL: Dark Obsidian Brand & Onboarding Timeline */}
          <div className="lg:col-span-5 bg-slate-950 text-white p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Lighting & Ghost Milad Watermark */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <img
              src="/logo-milad-red.svg"
              alt=""
              aria-hidden="true"
              className="absolute -bottom-16 -right-14 w-64 h-auto object-contain opacity-[0.07] saturate-[0.3] pointer-events-none select-none"
            />

            <div className="relative z-10 space-y-7">
              {/* Brand Lockup */}
              <div className="flex items-center gap-3">
                <img
                  src={logoImg}
                  alt="Logo Tonti Mu'allimin"
                  className="h-11 w-auto shrink-0 drop-shadow-md"
                  width="44"
                  height="44"
                  decoding="async"
                />
                <img
                  src={titleLogoImg}
                  alt="LBB Mu'allimin 2027"
                  className="h-9 sm:h-10 w-auto object-contain max-w-[200px]"
                  decoding="async"
                />
              </div>

              <div className="space-y-2">
                <span className="inline-block text-[10px] font-black uppercase tracking-[0.16em] text-amber-400">
                  Portal Resmi Kontingen {SITE.YEAR}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  Akses Kelola Peleton Sekolah
                </h1>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Khusus tim peserta yang sudah mendaftar dan <strong className="text-slate-200">disetujui (ACC)</strong> oleh panitia.
                </p>
              </div>

              {/* 3 Pilar Fitur Asli di Dalam Portal Peserta (Ringkas 1 Baris) */}
              <div className="space-y-2.5 pt-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Layanan Portal
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block leading-tight">Personel, Berkas &amp; QR Pass</span>
                      <span className="text-[11px] text-slate-400 block leading-snug truncate">Biodata peleton, rekomendasi &amp; tiket QR</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0">
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block leading-tight">Jadwal UCL, Materi &amp; Basecamp</span>
                      <span className="text-[11px] text-slate-400 block leading-snug truncate">Slot gladi, pedoman PBB &amp; denah ruang</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center shrink-0">
                      <Trophy className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block leading-tight">Rekap Nilai &amp; Klasemen Resmi</span>
                      <span className="text-[11px] text-slate-400 block leading-snug truncate">Lembar nilai 3 juri &amp; papan klasemen</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8 pt-4 border-t border-slate-800/80 text-[10.5px] text-slate-500">
              © {SITE.YEAR} Madrasah Mu'allimin Muhammadiyah Yogyakarta
            </div>
          </div>

          {/* RIGHT PANEL: Clean White Google Auth Workspace */}
          <div className="lg:col-span-7 bg-white text-slate-900 p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto space-y-6">
              {/* Heading */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-200/80">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Login Aman dengan Google</span>
                </div>
                <h2 className="text-2xl sm:text-[28px] font-black text-slate-950 tracking-tight leading-tight">
                  Masuk ke Dashboard Tim
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                  Gunakan akun Google dengan alamat email yang didaftarkan pada formulir registrasi lomba.
                </p>
              </div>

              {/* Error Message Banners */}
              {loginError && (
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  errorType === 'pending_approval'
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  <div className="flex items-start gap-3">
                    {errorType === 'pending_approval' ? (
                      <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <span className="font-bold block">
                        {errorType === 'pending_approval' ? 'Menunggu Persetujuan Admin' : 'Tidak Dapat Masuk'}
                      </span>
                      <p>{loginError}</p>
                      {errorType === 'not_registered' && (
                        <button
                          type="button"
                          onClick={() => {
                            handleClose();
                            setActiveView('register');
                          }}
                          className="mt-1.5 text-xs font-black text-rose-800 underline block cursor-pointer"
                        >
                          Buka Formulir Pendaftaran Lomba →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Primary Google Sign-In CTA */}
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="w-full py-3.5 px-5 bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm rounded-2xl border-2 border-slate-200 hover:border-slate-900 shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-60 cursor-pointer group"
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-red-700" />
                      <span>Menghubungkan Akun Google...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                      <span>Lanjutkan dengan Akun Google</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setActiveView('status_check');
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <SearchCheck className="w-4 h-4 text-slate-500" />
                  <span>Cek Status Verifikasi Pendaftaran</span>
                </button>
              </div>

              {/* Divider + New Registration Strip */}
              <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Belum Mendaftarkan Peleton?</span>
                  <span className="text-[11px] text-slate-500">Segera daftar sebelum kuota peleton terpenuhi.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setActiveView('register');
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors shrink-0 shadow-2xs cursor-pointer"
                >
                  <span>Daftar Sekarang</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Subtle Utility Bar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 px-1">
          <button
            type="button"
            onClick={handleClose}
            className={`inline-flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl border shadow-2xs transition-all group cursor-pointer ${
              hasPhotoBg
                ? 'bg-slate-900/70 hover:bg-slate-900/90 text-slate-200 hover:text-white border-white/15 backdrop-blur-md'
                : 'bg-white/90 hover:bg-white text-slate-600 hover:text-slate-950 border-slate-200/90'
            }`}
          >
            <ArrowLeft className={`w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform ${
              hasPhotoBg ? 'text-slate-300 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-950'
            }`} />
            <span>Kembali ke Beranda</span>
          </button>

          <a
            href={`https://wa.me/6281947491505?text=Halo%20Panitia%20LBB%20Mu'allimin%202027,%20saya%20butuh%20bantuan%20login%20portal.`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold shadow-2xs transition-colors ${
              hasPhotoBg
                ? 'bg-emerald-950/75 hover:bg-emerald-900/85 border-emerald-400/30 text-emerald-200 backdrop-blur-md'
                : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200/90 text-emerald-700'
            }`}
            title="Bantuan Panitia via WhatsApp"
          >
            <span>Bantuan Login (WA)</span>
            <ExternalLink className={`w-3 h-3 ${hasPhotoBg ? 'text-emerald-300' : 'text-emerald-600'}`} />
          </a>
        </div>
      </main>
    </div>
  );
}
