import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Award,
  Crown,
  Users,
  Mail,
  Lock,
  User,
  School,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';

export default function AuthModal() {
  const {
    authModal,
    closeAuthModal,
    loginUser,
    registerUser,
    users
  } = useCompetition();

  const [activeTab, setActiveTab] = useState('login');
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  // Form State - Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Form State - Register
  const [regName, setRegName] = useState('');
  const [regSchool, setRegSchool] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('peserta');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  useEffect(() => {
    if (authModal.isOpen) {
      setActiveTab(authModal.tab || 'login');
      setShowGoogleChooser(false);
      setLoginError('');
      setRegError('');
      setRegSuccess('');
    }
  }, [authModal]);

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && authModal.isOpen) {
        closeAuthModal();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModal.isOpen, closeAuthModal]);

  if (!authModal.isOpen) return null;

  // Handle Traditional Login
  function handleTraditionalLogin(e) {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Harap masukkan alamat email Anda.');
      return;
    }

    loginUser(loginEmail.trim());
  }

  // Handle Traditional Register
  function handleTraditionalRegister(e) {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regName.trim() || !regEmail.trim()) {
      setRegError('Nama dan email wajib diisi.');
      return;
    }

    const res = registerUser(
      regName.trim(),
      regEmail.trim(),
      regPassword,
      regRole,
      regSchool.trim()
    );

    if (!res.success) {
      setRegError(res.message);
    }
  }

  // Handle Google Login Select
  function handleSelectGoogleAccount(account) {
    loginUser(account.email, account.name);
  }

  // Handle Custom Google Login
  function handleCustomGoogleSubmit(e) {
    e.preventDefault();
    if (!customGoogleEmail.trim()) return;
    loginUser(
      customGoogleEmail.trim(),
      customGoogleName.trim() || customGoogleEmail.split('@')[0]
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Decoration Header */}
        <div className="relative bg-gradient-to-r from-red-800 via-red-700 to-amber-700 text-white p-6 pb-7">
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Sistem Masuk Terpadu</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            {activeTab === 'login' ? 'Masuk ke Portal LBB' : 'Daftar Akun Baru'}
          </h2>
          <p className="text-red-100 text-xs mt-1">
            Lomba Baris-Berbaris Mu'allimin 2026 tingkat SD & SMP se-DIY
          </p>

          {/* Tab Navigation Switch */}
          <div className="flex gap-2 mt-4 bg-black/25 p-1 rounded-2xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setShowGoogleChooser(false);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setShowGoogleChooser(false);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar Akun</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {/* GOOGLE SIGN IN BUTTON */}
          {!showGoogleChooser ? (
            <div>
              <button
                type="button"
                onClick={() => setShowGoogleChooser(true)}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl border-2 border-slate-200 hover:border-slate-300 shadow-sm transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
              >
                {/* Official Google Icon SVG */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.64v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.11z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <span>Lanjutkan dengan Akun Google</span>
                <span className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold ml-auto group-hover:bg-red-200">
                  Role Otomatis
                </span>
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                    atau dengan email & sandi
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Interactive Google Account Chooser Simulation */
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.64v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.11z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                    />
                  </svg>
                  <span className="text-xs font-extrabold text-slate-800">
                    Pilih Akun Google (Demo Role)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGoogleChooser(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Kembali
                </button>
              </div>

              <div className="space-y-2 mb-3">
                {users.slice(0, 5).map(u => {
                  let roleColor = 'bg-blue-100 text-blue-700 border-blue-200';
                  let icon = <Users className="w-3.5 h-3.5" />;
                  if (u.role === 'admin') {
                    roleColor = 'bg-indigo-100 text-indigo-700 border-indigo-200';
                    icon = <Shield className="w-3.5 h-3.5" />;
                  } else if (u.role === 'juri') {
                    roleColor = 'bg-emerald-100 text-emerald-700 border-emerald-200';
                    icon = <Award className="w-3.5 h-3.5" />;
                  } else if (u.role === 'superadmin') {
                    roleColor = 'bg-rose-100 text-rose-700 border-rose-200';
                    icon = <Crown className="w-3.5 h-3.5" />;
                  }

                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleSelectGoogleAccount(u)}
                      className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-slate-100/80 rounded-xl border border-slate-200 text-left transition-all hover:shadow-sm group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {u.name}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {u.email}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ml-2 ${roleColor}`}
                      >
                        {icon}
                        <span>{u.roleLabel || u.role.toUpperCase()}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Google Email Input */}
              <form onSubmit={handleCustomGoogleSubmit} className="pt-2 border-t border-slate-200">
                <p className="text-[11px] text-slate-500 mb-1.5 font-medium">
                  Atau login dengan akun Google kustom:
                </p>
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    required
                    placeholder="nama@gmail.com"
                    value={customGoogleEmail}
                    onChange={e => setCustomGoogleEmail(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl"
                  >
                    Masuk
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 1: FORM MASUK (LOGIN) */}
          {activeTab === 'login' && (
            <form onSubmit={handleTraditionalLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Email Terdaftar
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="misal: admin@lbbmuallimin.com atau sekolah@gmail.com"
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Sistem otomatis menyesuaikan peran berdasarkan email Anda di database.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Kata Sandi
                  </label>
                  <span className="text-[11px] text-slate-400">Demo: bebas isi apa saja</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Quick Demo Fill Buttons */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-[11px] font-bold text-slate-600 mb-2">
                  ⚡ Isi Cepat Akun Demo:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('admin@lbbmuallimin.com');
                      setLoginPassword('admin2026');
                    }}
                    className="px-2 py-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100"
                  >
                    🛡️ Admin Sekretariat
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('juri@lbbmuallimin.com');
                      setLoginPassword('juri2026');
                    }}
                    className="px-2 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100"
                  >
                    ⚖️ Dewan Juri
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('ketua@lbbmuallimin.com');
                      setLoginPassword('super2026');
                    }}
                    className="px-2 py-1 text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100"
                  >
                    👑 Superadmin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('smpn1yk.tonti@gmail.com');
                      setLoginPassword('smpn1yk');
                    }}
                    className="px-2 py-1 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100"
                  >
                    🚩 Official Peserta (SMPN 1)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-red-700/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: FORM DAFTAR (REGISTER) */}
          {activeTab === 'register' && (
            <form onSubmit={handleTraditionalRegister} className="space-y-3.5">
              {regError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap / Nama Pembina *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="misal: Kak Ahmad Fauzi, S.Pd."
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Asal Sekolah / Satuan
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={regSchool}
                    onChange={e => setRegSchool(e.target.value)}
                    placeholder="misal: SMP Negeri 5 Yogyakarta"
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Email Akun *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="misal: pembina.smp5@gmail.com"
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Daftar Sebagai (Peran Akun)
                </label>
                <select
                  value={regRole}
                  onChange={e => setRegRole(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold"
                >
                  <option value="peserta">🚩 Official Tim Peserta (SD / SMP)</option>
                  <option value="admin">🛡️ Panitia Pelaksana (Sekretariat)</option>
                  <option value="juri">⚖️ Dewan Juri Lapangan</option>
                  <option value="superadmin">👑 Pengarah / Superadmin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-yellow-500/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98] mt-2"
              >
                <span>Daftar Akun Baru</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Database Role Info Card */}
          <div className="mt-5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-950">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
              Integrasi Peran Otomatis:
            </p>
            <p className="text-amber-800 leading-relaxed">
              Email yang login akan dicocokkan ke database: jika email admin ➜ masuk sebagai <strong>Admin</strong>, jika juri ➜ masuk sebagai <strong>Dewan Juri</strong>, jika ketua ➜ <strong>Superadmin</strong>, dan jika peserta/sekolah ➜ diarahkan ke <strong>Portal Peserta</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
