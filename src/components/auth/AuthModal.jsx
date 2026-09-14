import React, { useState } from 'react';
import {
  Shield,
  Award,
  Mail,
  Lock,
  School,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  LogIn,
  Eye,
  EyeOff,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import logoImg from '../../assets/logo-tonti.png';
import { SITE, CONTACT } from '../../config.js';

export default function AuthModal() {
  const {
    authModal,
    closeAuthModal,
    loginUser,
    goBack,
    activeView,
    setActiveView
  } = useCompetition();

  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [errorType, setErrorType] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleClose = () => {
    if (closeAuthModal) {
      closeAuthModal();
    } else {
      goBack();
    }
  };

  if (activeView !== 'auth' && !authModal?.isOpen) return null;

  // Handle Login
  function handleTraditionalLogin(e) {
    e.preventDefault();
    setLoginError('');
    setErrorType('');

    const cleanEmail = loginEmail.trim();
    if (!cleanEmail) {
      setLoginError('Silakan masukkan alamat email yang terdaftar.');
      return;
    }

    if (!loginPassword) {
      setLoginError('Silakan masukkan kata sandi akun Anda.');
      return;
    }

    const res = loginUser(cleanEmail);
    if (!res?.success) {
      setLoginError(res?.message || 'Email tidak sesuai atau belum di-ACC oleh admin.');
      setErrorType(res?.error || 'unknown');
    }
  }

  // Handle Google Login
  function handleGoogleLogin() {
    setLoginError('');
    setErrorType('');
    const promptEmail = window.prompt(
      'Masukkan alamat email Google Anda untuk masuk:',
      loginEmail || 'official@sekolah.sch.id'
    );
    if (promptEmail && promptEmail.trim()) {
      const email = promptEmail.trim();
      const res = loginUser(email);
      if (!res?.success) {
        setLoginError(res?.message || 'Email tidak sesuai atau belum di-ACC oleh admin.');
        setErrorType(res?.error || 'unknown');
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-500 selection:text-white font-sans">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white py-3 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </button>
            <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
                Portal Akun Resmi
              </span>
              <span className="text-xs text-slate-400 hidden md:inline">LBB Mu'allimin Muhammadiyah Yogyakarta 2026</span>
            </div>
          </div>

          <a
            href={`https://wa.me/${CONTACT.WHATSAPP}?text=Halo%20Panitia%20LBB%20Muallimin%202026,%20saya%20membutuhkan%20bantuan%20akses%20akun.`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-300 hover:text-yellow-400 font-bold transition-colors hidden sm:flex items-center gap-1.5"
          >
            <span>Bantuan Panitia</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full grid lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
          
          {/* Left Column: Official Branding & Information */}
          <div className="lg:col-span-5 bg-gradient-to-br from-red-950 via-slate-950 to-slate-950 p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-red-600/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3.5">
                <img
                  src={logoImg}
                  alt="Logo Tonti Mu'allimin"
                  className="h-14 w-auto filter drop-shadow-md"
                  width="56"
                  height="56"
                  decoding="async"
                />
                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-yellow-400 block">
                    Website Resmi
                  </span>
                  <h2 className="font-black text-xl text-white tracking-tight leading-none mt-0.5">
                    LBB Mu'allimin <span className="text-yellow-400">2026</span>
                  </h2>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase italic leading-tight">
                  Portal Calon Peserta & Panitia
                </h1>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Akses portal resmi bagi kontingen sekolah yang pendaftarannya telah <strong>disetujui (di-ACC) oleh Admin</strong>, serta panitia sekretariat dan dewan juri.
                </p>
              </div>

              {/* Event Key Facts */}
              <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                <div className="flex items-start gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-lg bg-red-900/50 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5 text-yellow-400">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Tingkat SD/MI & SMP/MTs</strong>
                    <span className="text-slate-400 text-[11px]">Se-Daerah Istimewa Yogyakarta (DIY)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-lg bg-red-900/50 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5 text-yellow-400">
                    <School className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Kampus Terpadu Mu'allimin</strong>
                    <span className="text-slate-400 text-[11px]">Sedayu, Bantul, D.I. Yogyakarta</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-lg bg-red-900/50 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5 text-yellow-400">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Verifikasi Berkas Resmi</strong>
                    <span className="text-slate-400 text-[11px]">Hanya pendaftar yang telah di-ACC dapat mengakses dasbor peserta</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 border-t border-white/10 mt-6 text-[11px] text-slate-500">
              <p>© {SITE.YEAR} Madrasah Mu'allimin Muhammadiyah Yogyakarta</p>
            </div>
          </div>

          {/* Right Column: Authentication Form */}
          <div className="lg:col-span-7 bg-white text-slate-900 p-6 sm:p-10 flex flex-col justify-center">
            
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase italic">
                Masuk ke Portal Resmi
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Gunakan email aktif yang Anda daftarkan pada formulir pendaftaran lomba.
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

            {/* Google Sign-In */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl border-2 border-slate-200 hover:border-slate-300 shadow-xs transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              </button>

              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  atau email terdaftar
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
            </div>

            {/* FORM MASUK (LOGIN) */}
            <form onSubmit={handleTraditionalLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Alamat Email Pendaftaran
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="email.pendaftar@gmail.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Kata Sandi Akun
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Silakan hubungi Sekretariat Panitia via WhatsApp jika Anda mengalami kendala sandi akun.')}
                    className="text-xs text-red-700 hover:text-red-800 font-bold hover:underline"
                  >
                    Bantuan Sandi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                    title={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                  />
                  <span>Ingat sesi saya</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-red-700 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-950/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Portal Peserta</span>
              </button>
            </form>

            {/* Registration Banner for Unregistered Users */}
            <div className="mt-8 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Belum Mendaftarkan Peleton Sekolah Anda?
              </h3>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                Akun calon peserta dibuat secara resmi melalui pengisian 12 data dan berkas formulir pendaftaran lomba.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  setActiveView('register');
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <span>Daftar Lomba Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        <p>© {SITE.YEAR} Panitia LBB Mu'allimin • Sistem Portal Resmi Terpadu</p>
      </footer>

    </div>
  );
}
