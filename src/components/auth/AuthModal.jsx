import React, { useState } from 'react';
import {
  Shield,
  Award,
  School,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Clock,
  ExternalLink,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import logoImg from '../../assets/logo-tonti.png';
import { SITE, CONTACT, GOOGLE_AUTH } from '../../config.js';

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

  const clientId = GOOGLE_AUTH.CLIENT_ID;

  const handleClose = () => {
    if (closeAuthModal) {
      closeAuthModal();
    } else {
      goBack();
    }
  };

  // Fungsi memicu Popup Asli Google OAuth 2.0
  const handleGoogleSignIn = () => {
    setLoginError('');
    setErrorType('');

    if (!window.google?.accounts?.oauth2) {
      setLoginError('Sedang menghubungkan ke server Google, silakan coba beberapa detik lagi...');
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

          try {
            // Ambil profil asli pengguna dari server Google
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });

            const googleProfile = await userInfoResponse.json();

            if (!googleProfile.email) {
              setIsSigningIn(false);
              setLoginError('Tidak dapat membaca alamat email dari akun Google Anda.');
              return;
            }

            const cleanEmail = googleProfile.email.toLowerCase();
            const resLogin = loginUser(cleanEmail, googleProfile.name, googleProfile.picture);
            setIsSigningIn(false);

            if (!resLogin?.success) {
              setLoginError(resLogin?.message || 'Email Google Anda belum terdaftar atau belum di-ACC oleh Admin.');
              setErrorType(resLogin?.error || 'unknown');
            }
          } catch (apiErr) {
            setIsSigningIn(false);
            setLoginError('Gagal mengambil data profil dari server Google.');
          }
        },
      });

      // Buka popup asli Google
      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      setIsSigningIn(false);
      setLoginError('Gagal membuka popup Google: ' + err.message);
    }
  };

  if (activeView !== 'auth' && !authModal?.isOpen) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-red-700 selection:text-white font-sans relative">
      {/* Background Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(#8B0000 1px, transparent 1px), linear-gradient(to right, #8B0000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Top Navbar - Clean White Frosted Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-950 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all group"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-950 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Kembali ke Beranda</span>
              <span className="sm:hidden">Beranda</span>
            </button>
            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Portal Resmi LBB Mu'allimin Muhammadiyah Yogyakarta {SITE.YEAR}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${CONTACT.WHATSAPP || '6281230093737'}?text=Halo%20Panitia%20LBB%20Mu'allimin%202026,%20saya%20membutuhkan%20bantuan%20akses%20akun.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-[11px] font-bold text-red-700 transition-colors shadow-xs"
              title="Bantuan Panitia via WhatsApp"
            >
              <span>Bantuan Panitia</span>
              <ExternalLink className="w-3 h-3 text-red-600" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex items-center justify-center relative z-10">
        <div className="w-full grid lg:grid-cols-12 rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 bg-white">
          
          {/* Left Column: Official Branding & Information */}
          <div className="lg:col-span-5 bg-gradient-to-b from-red-50/80 via-slate-50 to-white p-6 sm:p-9 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/80 relative overflow-hidden">
            {/* Background Cadet Artwork Watermark */}
            <div className="absolute right-0 bottom-0 w-52 h-72 pointer-events-none opacity-15 hidden sm:block z-0">
              <img
                src="/fotoslide/3.PNG"
                alt="Paskibra Danton"
                className="w-full h-full object-contain object-bottom [mask-image:radial-gradient(ellipse_at_bottom_right,black_30%,transparent_75%)]"
                loading="lazy"
              />
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <img
                  src={logoImg}
                  alt="Logo Tonti Mu'allimin"
                  className="h-12 w-auto filter drop-shadow-xs"
                  width="48"
                  height="48"
                  decoding="async"
                />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-700 block">
                    Website Resmi
                  </span>
                  <h2 className="font-black text-lg text-slate-900 tracking-tight leading-none mt-0.5">
                    LBB Mu'allimin <span className="text-amber-600">2026</span>
                  </h2>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase italic leading-tight">
                  Portal Calon Peserta & Panitia
                </h1>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Akses portal peleton sekolah yang pendaftarannya telah <strong className="text-slate-900">disetujui (di-ACC) oleh Panitia</strong>.
                </p>
              </div>

              {/* Event Key Facts */}
              <div className="space-y-3 pt-1 text-xs">
                <div className="flex items-start gap-3 text-slate-700">
                  <div className="w-7 h-7 rounded-xl bg-red-100/70 border border-red-200 flex items-center justify-center shrink-0 mt-0.5 text-red-700">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">Tingkat SD/MI & SMP/MTs</strong>
                    <span className="text-slate-500 text-[11px]">Se-Daerah Istimewa Yogyakarta (DIY)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-700">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">Hanya Akun yang Di-ACC</strong>
                    <span className="text-slate-500 text-[11px]">Email Google yang Anda gunakan harus sesuai data pendaftaran resmi</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 mt-8 text-[11px] text-slate-400">
              <p>© {SITE.YEAR} Madrasah Mu'allimin Muhammadiyah Yogyakarta</p>
            </div>
          </div>

          {/* Right Column: Google Authentication */}
          <div className="lg:col-span-7 bg-white text-slate-900 p-6 sm:p-10 flex flex-col justify-center">
            
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase italic tracking-tight">
                Masuk ke{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-600">
                  Portal
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Gunakan Akun Google Anda yang terdaftar pada pendaftaran lomba untuk masuk.
              </p>
            </div>

            {/* Error Message Banners */}
            {loginError && (
              <div className={`p-4 rounded-2xl border mb-6 text-xs leading-relaxed animate-shake ${
                errorType === 'pending_approval'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <div className="flex items-start gap-3">
                  {errorType === 'pending_approval' ? (
                    <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <span className="font-bold block">
                      {errorType === 'pending_approval' ? 'Pendaftaran Masih Dalam Antrean Verifikasi' : 'Gagal Masuk Portal'}
                    </span>
                    <p>{loginError}</p>
                    {errorType === 'not_registered' && (
                      <button
                        type="button"
                        onClick={() => {
                          handleClose();
                          setActiveView('register');
                        }}
                        className="mt-2 text-xs font-black text-red-800 underline block"
                      >
                        Buka Formulir Pendaftaran Lomba Sekarang →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SINGLE GOOGLE SIGN-IN BUTTON */}
            <div className="my-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full py-4 px-6 bg-white hover:bg-slate-50 text-slate-800 font-black text-sm sm:text-base rounded-2xl border-2 border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-60 cursor-pointer group"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-red-700" />
                    <span>Membuka Akun Google...</span>
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
            </div>

            {/* Registration Banner for Unregistered Users */}
            <div className="mt-8 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Peleton Sekolah Belum Terdaftar?
              </h3>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                Akun resmi dibuat melalui pengisian formulir pendaftaran lomba.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  setActiveView('register');
                }}
                className="mt-1 inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 hover:scale-105"
              >
                <span>Daftar Lomba Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 relative z-10">
        <p>© {SITE.YEAR} Panitia LBB Mu'allimin • Sistem Portal Resmi Terpadu</p>
      </footer>

    </div>
  );
}
