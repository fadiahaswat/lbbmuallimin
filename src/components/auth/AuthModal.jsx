import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  Clock,
  Loader2,
  SearchCheck
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import logoImg from '../../assets/logo-tonti.png';
import titleLogoImg from '../../assets/title-logo.png';
import { SITE, GOOGLE_AUTH } from '../../config.js';

// Foto resolusi tinggi 4K (section-tentang) untuk latar belakang progresif
const AUTH_BG_SLIDES = [
  { webp: '/section-tentang.webp', fallback: '/section-tentang.jpg' },
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
  const currentSlideIdx = hasPhotoBg ? activeSlidePos % loadedSlides.length : 0;

  const clientId = GOOGLE_AUTH.CLIENT_ID;

  const handleClose = () => {
    if (closeAuthModal) {
      closeAuthModal();
    } else {
      goBack();
    }
  };

  // Google OAuth 2.0 Flow
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

  // Shared Brand Photo Backdrop (Dipakai senada di Header Mobile & Panel Kiri Desktop)
  const renderBrandPhotoBackdrop = () => (
    <>
      {/* Fallback Crimson-Obsidian Gradient & Ghost Milad (Tampil Instan Sebelum Foto Siap) */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${hasPhotoBg ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-red-600/30 blur-3xl" />
        <img
          src="/logo-milad-red.svg"
          alt=""
          aria-hidden="true"
          className="absolute -bottom-10 -right-10 w-52 h-auto object-contain opacity-[0.09] saturate-[0.3] select-none"
        />
      </div>

      {/* Progressive HD Photo Slideshow */}
      {hasPhotoBg && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {loadedSlides.map((url, idx) => (
            <img
              key={url}
              src={url}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover scale-[1.03] transition-opacity duration-1000 ease-in-out ${
                idx === currentSlideIdx ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          {/* Lapisan Gelap Frosted + Brand Crimson-Obsidian Scrim agar teks & elemen selalu tajam */}
          <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[4px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-[#450a0a]/55 to-slate-950/60" />
        </div>
      )}
    </>
  );

  // Shared Auth Action Controls (Senada 100% antara Mobile & Desktop — Pill Geometry + Brand Palette)
  const renderAuthActions = () => (
    <div className="space-y-4">
      {/* Error Message Banner */}
      {loginError && (
        <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed text-left ${
          errorType === 'pending_approval'
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-start gap-2.5">
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
            </div>
          </div>
        </div>
      )}

      {/* Primary Pill Button: Sign in with Google */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isSigningIn}
        className="w-full py-3.5 px-5 rounded-full bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm border border-slate-300 hover:border-red-700 shadow-2xs hover:shadow-sm transition-all flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-60 cursor-pointer group"
      >
        {isSigningIn ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-red-700" />
            <span>Menghubungkan Google...</span>
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
            <span>Masuk dengan Google</span>
          </>
        )}
      </button>

      {/* Clean Divider */}
      <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
        <span className="flex-1 h-px bg-slate-200" />
        <span>atau</span>
        <span className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Secondary Pill Actions */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => {
            handleClose();
            setActiveView('status_check');
          }}
          className="w-full py-3 px-5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <SearchCheck className="w-4 h-4 text-slate-500" />
          <span>Cek Status Pendaftaran</span>
        </button>

        <button
          type="button"
          onClick={() => {
            handleClose();
            setActiveView('register');
          }}
          className="w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-[#8B0000] to-[#991b1b] hover:from-[#7f1d1d] hover:to-[#b91c1c] text-white font-bold text-sm transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          Daftar Peleton Baru
        </button>
      </div>

      {/* Minimal Centered Helper & Support Link */}
      <div className="pt-2 text-center space-y-2">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Gunakan akun Google dengan email yang didaftarkan saat registrasi lomba.
        </p>
        <p className="text-xs text-slate-600">
          Butuh bantuan login?{' '}
          <a
            href={`https://wa.me/6281947491505?text=Halo%20Panitia%20LBB%20Mu'allimin%202027,%20saya%20butuh%20bantuan%20login%20portal.`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-red-800 underline underline-offset-2 hover:text-red-950 transition-colors"
          >
            Hubungi Panitia (WA)
          </a>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:items-center lg:justify-center lg:px-4 lg:py-8 selection:bg-red-700 selection:text-white font-sans relative overflow-hidden">
      {/* Subtle Brand Ambient Backdrop (Desktop) */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-red-900/20 blur-[130px]" />
        <div className="absolute -bottom-32 -right-24 w-[420px] h-[420px] rounded-full bg-amber-500/10 blur-[130px]" />
      </div>

      {/* ============================================================== */}
      {/* MOBILE LAYOUT (< lg): Full-Screen Edge-to-Edge Native App Feel */}
      {/* ============================================================== */}
      <main className="lg:hidden w-full min-h-screen relative z-10 flex flex-col bg-white">
        {/* Top Full-Bleed Brand Photo Header */}
        <div className="relative bg-gradient-to-br from-[#7f1d1d] via-[#450a0a] to-slate-950 px-6 pt-5 pb-14 text-center overflow-hidden min-h-[270px] flex flex-col justify-between">
          {renderBrandPhotoBackdrop()}

          {/* Top Bar: Minimal Back Pill + Slide Dots */}
          <div className="relative z-10 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-slate-950/50 hover:bg-slate-950/70 text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </button>

            {loadedSlides.length > 1 && (
              <div className="flex items-center gap-1.5">
                {loadedSlides.map((url, idx) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setActiveSlidePos(idx)}
                    aria-label={`Foto ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentSlideIdx ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/35'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Center Brand Lockup & Title */}
          <div className="relative z-10 flex flex-col items-center gap-2.5 pt-6">
            <div className="flex items-center justify-center gap-2.5">
              <img
                src={logoImg}
                alt="Logo Tonti Mu'allimin"
                className="h-11 w-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
                width="44"
                height="44"
                decoding="async"
              />
              <img
                src={titleLogoImg}
                alt="LBB Mu'allimin 2027"
                className="h-8 w-auto object-contain max-w-[180px] drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
                decoding="async"
              />
            </div>

            <div className="pt-1 space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                Portal Resmi Kontingen {SITE.YEAR}
              </p>
              <h1 className="text-2xl font-extrabold text-white tracking-tight leading-tight drop-shadow-xs">
                Masuk Portal Tim
              </h1>
            </div>
          </div>
        </div>

        {/* Full-Height Overlapping White Sheet Body */}
        <div className="-mt-7 relative z-10 flex-1 rounded-t-[30px] bg-white px-6 sm:px-8 pt-8 pb-8 flex flex-col justify-between shadow-[0_-12px_32px_rgba(0,0,0,0.2)]">
          <div className="max-w-[380px] w-full mx-auto">
            {renderAuthActions()}
          </div>

          <p className="text-center text-[10.5px] text-slate-400 pt-8">
            © {SITE.YEAR} Madrasah Mu'allimin Muhammadiyah Yogyakarta
          </p>
        </div>
      </main>

      {/* ============================================================== */}
      {/* DESKTOP LAYOUT (lg+): White Framed Shell + Inset Photo Panel   */}
      {/* ============================================================== */}
      <main className="hidden lg:flex w-full max-w-[1040px] relative z-10 flex-col items-center gap-5">
        <div className="w-full rounded-[32px] bg-white p-3 shadow-[0_32px_90px_rgba(0,0,0,0.55)] grid grid-cols-12 min-h-[600px]">
          
          {/* LEFT INSET PANEL: Brand Photo Showcase (Senada 100% dengan Header Mobile) */}
          <div className="col-span-6 rounded-[24px] relative overflow-hidden bg-gradient-to-br from-[#7f1d1d] via-[#450a0a] to-slate-950 p-8 flex flex-col justify-between text-white">
            {renderBrandPhotoBackdrop()}

            {/* Top Left Official Logo Lockup + Slide Dots */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2.5">
                <img
                  src={logoImg}
                  alt="Logo Tonti Mu'allimin"
                  className="h-10 w-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
                  width="40"
                  height="40"
                  decoding="async"
                />
                <img
                  src={titleLogoImg}
                  alt="LBB Mu'allimin 2027"
                  className="h-8 w-auto object-contain max-w-[175px] drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
                  decoding="async"
                />
              </div>

              {loadedSlides.length > 1 && (
                <div className="flex items-center gap-1.5">
                  {loadedSlides.map((url, idx) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setActiveSlidePos(idx)}
                      aria-label={`Foto ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === currentSlideIdx ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/35 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Editorial Title + 3 Uniform Frosted Glass Cards */}
            <div className="relative z-10 space-y-5">
              <div className="space-y-1.5">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-white/75">
                  Portal Resmi Kontingen {SITE.YEAR}
                </p>
                <h2 className="text-[30px] font-extrabold tracking-tight text-white leading-tight">
                  Kelola Peleton Anda
                </h2>
                <p className="text-xs text-white/80 leading-relaxed max-w-sm">
                  Layanan terpadu kontingen peserta yang telah disetujui (ACC) oleh panitia.
                </p>
              </div>

              {/* 3 Uniform Airy Frosted Glass Tiles */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="rounded-2xl bg-white/[0.12] border border-white/20 backdrop-blur-md text-white p-3.5 flex flex-col justify-between min-h-[104px]">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-white text-[11px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <p className="text-[11.5px] font-semibold leading-snug text-white/95 mt-3">
                    Personel, Berkas &amp; QR Pass
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[0.12] border border-white/20 backdrop-blur-md text-white p-3.5 flex flex-col justify-between min-h-[104px]">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-white text-[11px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <p className="text-[11.5px] font-semibold leading-snug text-white/95 mt-3">
                    Jadwal UCL, Materi &amp; Basecamp
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[0.12] border border-white/20 backdrop-blur-md text-white p-3.5 flex flex-col justify-between min-h-[104px]">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-white text-[11px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <p className="text-[11.5px] font-semibold leading-snug text-white/95 mt-3">
                    Rekap Nilai &amp; Klasemen Resmi
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CLEAN WHITE AUTH PANEL */}
          <div className="col-span-6 px-10 xl:px-14 py-10 flex flex-col justify-center">
            <div className="max-w-[360px] w-full mx-auto space-y-6">
              <div className="text-center space-y-1.5">
                <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                  Masuk Portal Tim
                </h1>
                <p className="text-xs text-slate-500">
                  Autentikasi resmi kontingen LBB Mu'allimin {SITE.YEAR}
                </p>
              </div>

              {renderAuthActions()}
            </div>
          </div>

        </div>

        {/* Clean Minimal Back Button & Footer Underneath Frame */}
        <div className="w-full flex items-center justify-between px-2">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-white/15 transition-all group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
            <span>Kembali ke Beranda</span>
          </button>

          <span className="text-[11px] text-slate-500">
            © {SITE.YEAR} Madrasah Mu'allimin Muhammadiyah Yogyakarta
          </span>
        </div>
      </main>
    </div>
  );
}
