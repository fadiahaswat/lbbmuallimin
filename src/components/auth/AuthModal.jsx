import React, { useState } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  Clock,
  ExternalLink,
  CheckCircle2,
  Loader2,
  Lock,
  ChevronRight
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

          try {
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

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      setIsSigningIn(false);
      setLoginError('Gagal membuka popup Google: ' + err.message);
    }
  };

  // 2. Alternative Quick Login Flow: Kode Registrasi atau No WhatsApp
  const handleCodeSignIn = (e) => {
    e.preventDefault();
    setLoginError('');
    setErrorType('');

    const cleanInput = identifierInput.trim();
    if (!cleanInput) {
      setLoginError('Silakan masukkan Kode Pendaftaran (contoh: LBB26-SMP-001) atau Nomor WhatsApp yang didaftarkan.');
      return;
    }

    setIsSubmittingCode(true);
    const res = loginAsTeam(cleanInput);
    setIsSubmittingCode(false);

    if (!res.success) {
      setLoginError(res.message || 'Data pendaftaran tidak ditemukan atau belum disetujui.');
      if (res.message?.includes('antrean verifikasi')) {
        setErrorType('pending_approval');
      } else {
        setErrorType('not_registered');
      }
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

      {/* Top Navbar */}
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
              href={`https://wa.me/${CONTACT.WHATSAPP || '6281230093737'}?text=Halo%20Panitia%20LBB%20Mu'allimin%202026,%20saya%20butuh%20bantuan%20login%20portal.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold text-emerald-700 transition-colors shadow-xs"
              title="Bantuan Panitia via WhatsApp"
            >
              <span>Bantuan Login (WA)</span>
              <ExternalLink className="w-3 h-3 text-emerald-600" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex items-center justify-center relative z-10">
        <div className="w-full grid lg:grid-cols-12 rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 bg-white">
          
          {/* SISI KIRI: Branding & Panduan Alur Peserta */}
          <div className="lg:col-span-5 bg-gradient-to-b from-red-50/80 via-slate-50 to-white p-6 sm:p-9 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/80 relative">
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
                    Portal Peserta Kontingen
                  </span>
                  <h2 className="font-black text-lg text-slate-900 tracking-tight leading-none mt-0.5">
                    LBB Mu'allimin <span className="text-amber-600">2026</span>
                  </h2>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase leading-tight">
                  Akses Kelola Peleton Sekolah
                </h1>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Layanan terpadu untuk tim peserta yang sudah mendaftar dan <strong className="text-slate-900">telah disetujui (ACC)</strong> oleh panitia.
                </p>
              </div>

              {/* Langkah Alur Setelah Login */}
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Langkah di Dalam Portal:
                </div>
                
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-3 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block leading-snug">Upload Biodata 23 Personel</span>
                      <span className="text-[11px] text-slate-500">Foto & NISN Danton, 21 Pasukan Inti & Cadangan</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block leading-snug">Upload Surat Rekomendasi</span>
                      <span className="text-[11px] text-slate-500">Surat izin resmi dari Kepala Sekolah / Madrasah</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block leading-snug">Pengambilan Nomor Undian</span>
                      <span className="text-[11px] text-slate-500">Bisa diundi online setelah status tim Terverifikasi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SISI KANAN: Form Login Peserta */}
          <div className="lg:col-span-7 bg-white text-slate-900 p-6 sm:p-10 flex flex-col justify-center">
            
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-wider mb-2 border border-red-100">
                <Lock className="w-3 h-3" />
                <span>Autentikasi Google Peserta</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase italic tracking-tight">
                Masuk ke <span className="text-red-700">Dashboard Tim</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Masuk portal wajib menggunakan Akun Google dengan alamat email yang telah terdaftar saat registrasi lomba.
              </p>
            </div>

            {/* Error Message Banners */}
            {loginError && (
              <div className={`p-4 rounded-2xl border mb-5 text-xs leading-relaxed animate-shake ${
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
                      {errorType === 'pending_approval' ? 'Status: Menunggu Persetujuan Admin' : 'Pemberitahuan Masuk'}
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

            {/* KONTEN UTAMA: GOOGLE SIGN-IN */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Login Otomatis Satu Klik</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Pastikan Anda memilih akun Google dengan <strong>email yang sama</strong> saat mengisi formulir pendaftaran lomba. Hanya email yang telah terdaftar dan disetujui yang dapat mengakses portal.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full py-3.5 px-5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border-2 border-slate-300 hover:border-slate-400 shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-60 cursor-pointer group"
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
            </div>

            {/* SEKSI PENDAFTARAN BARU: Bersih & Terpisah */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Peleton Sekolah Belum Mendaftar?</span>
                <span className="text-slate-500 text-[11px]">Daftarkan sekolah Anda sebelum kuota penuh.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  setActiveView('register');
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
              >
                <span>Daftar Sekarang</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 px-6 text-center text-xs text-slate-500 relative z-10">
        <p>© {SITE.YEAR} Madrasah Mu'allimin Muhammadiyah Yogyakarta • Sistem Portal Resmi Terpadu</p>
      </footer>

    </div>
  );
}

