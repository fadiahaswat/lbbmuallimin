import React, { useState, useRef } from 'react';
import {
  X,
  Search,
  ShieldCheck,
  Clock,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Users,
  Printer,
  Sparkles,
  School
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import logoImg from '../../assets/logo-tonti.png';
import titleLogoImg from '../../assets/title-logo.png';

export default function RegistrationStatusModal({ isOpen, onClose }) {
  const { teams, currentUser, openAuthModal, navigateTo, goBack } = useCompetition();

  const [jenjang, setJenjang] = useState('SMP');
  const [otpValues, setOtpValues] = useState(Array(8).fill(''));
  const [errorMessage, setErrorMessage] = useState('');
  const inputRefs = useRef([]);

  if (isOpen === false) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      goBack();
    }
  };

  // Privasi: Hasil HANYA dicari & dimunculkan jika seluruh 8 karakter sudah selesai diketik
  const isCompleted = otpValues.every(ch => ch.trim() !== '');
  const part1 = otpValues.slice(0, 4).join('').toUpperCase();
  const part2 = otpValues.slice(4, 8).join('').toUpperCase();
  const enteredCodeFormatted = `${part1}-${part2}`;
  const fullTargetCode = `LBB27-${jenjang}-${enteredCodeFormatted}`;
  const targetClean = `LBB27${jenjang}${part1}${part2}`;
  const targetSuffixClean = `${part1}${part2}`;

  const filteredTeams = isCompleted
    ? teams.filter(t => {
        const reg = String(t.regCode || '').trim().toUpperCase();
        const cleanReg = reg.replace(/[^A-Z0-9]/g, '');
        // Cocokkan secara eksak dengan kode registrasi lengkap
        return (
          reg === fullTargetCode ||
          cleanReg === targetClean ||
          cleanReg.endsWith(targetSuffixClean)
        );
      })
    : [];

  const handleOtpChange = (val, idx) => {
    setErrorMessage('');
    const rawChars = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (!rawChars) {
      const nextOtp = [...otpValues];
      nextOtp[idx] = '';
      setOtpValues(nextOtp);
      return;
    }

    if (rawChars.length > 1) {
      // User pasted or typed multiple characters
      const nextOtp = [...otpValues];
      for (let i = 0; i < rawChars.length && idx + i < 8; i++) {
        nextOtp[idx + i] = rawChars[i];
      }
      setOtpValues(nextOtp);
      const nextFocus = Math.min(7, idx + rawChars.length);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const char = rawChars.slice(-1);
    const nextOtp = [...otpValues];
    nextOtp[idx] = char;
    setOtpValues(nextOtp);

    if (char && idx < 7) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (!otpValues[idx] && idx > 0) {
        const nextOtp = [...otpValues];
        nextOtp[idx - 1] = '';
        setOtpValues(nextOtp);
        inputRefs.current[idx - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < 7) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const parseAndFillCode = (text) => {
    if (!text) return;
    const cleanText = text.trim().toUpperCase();

    if (cleanText.includes('SD')) {
      setJenjang('SD');
    } else if (cleanText.includes('SMP')) {
      setJenjang('SMP');
    }

    let extracted = cleanText
      .replace(/^LBB2[67]-?/i, '')
      .replace(/^(SD|SMP)-?/i, '')
      .replace(/[^A-Z0-9]/g, '');

    if (!extracted) return;
    extracted = extracted.slice(0, 8);

    const nextOtp = Array(8).fill('');
    for (let i = 0; i < extracted.length; i++) {
      nextOtp[i] = extracted[i];
    }
    setOtpValues(nextOtp);
    const focusIdx = Math.min(7, extracted.length);
    inputRefs.current[focusIdx]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData?.getData('text') || '';
    parseAndFillCode(pasted);
  };

  const handleClipboardPaste = async () => {
    try {
      if (navigator?.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        parseAndFillCode(text);
      }
    } catch (err) {
      // Fallback
    }
  };

  const handleResetOtp = () => {
    setOtpValues(Array(8).fill(''));
    setErrorMessage('');
    inputRefs.current[0]?.focus();
  };

  function handleSelectTeam(team) {
    setErrorMessage('');
    if (team.status === 'pending') {
      setErrorMessage(`Status tim ${team.schoolName} masih MENUNGGU ACC/VERIFIKASI dari panitia sekretariat.`);
      return;
    }
    if (team.status === 'rejected') {
      setErrorMessage(`Pendaftaran peleton ${team.schoolName} ditolak. Silakan hubungi narahubung panitia.`);
      return;
    }

    // Jika user sudah login dengan akun Google yang sesuai
    if (currentUser?.email && team.email && currentUser.email.toLowerCase() === team.email.toLowerCase()) {
      if (onClose) onClose();
      navigateTo('peserta_dashboard');
      return;
    }

    // Wajib otentikasi lewat akun Google
    if (onClose) onClose();
    openAuthModal('login');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-red-500 selection:text-white relative font-sans overflow-x-hidden">
      {/* Background Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(#8B0000 1px, transparent 1px), linear-gradient(to right, #8B0000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="hidden sm:block absolute left-0 top-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none z-0 transform-gpu" />
      <div className="hidden sm:block absolute right-0 bottom-1/4 w-96 h-96 bg-red-900/5 rounded-full blur-3xl pointer-events-none z-0 transform-gpu" />

      {/* Top Navbar Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-900 py-3.5 px-4 sm:px-8 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-950 transition-all text-xs font-bold flex items-center gap-2 group"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-950 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Kembali ke Beranda</span>
              <span className="sm:hidden">Beranda</span>
            </button>
            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-2.5">
              <img src={logoImg} alt="Logo Tonti" className="h-8 w-auto filter drop-shadow-xs hidden sm:block shrink-0" />
              <img src={titleLogoImg} alt="LBB Mu'allimin" className="h-7 sm:h-8 w-auto object-contain hidden sm:block" />
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Tutup
          </button>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center relative z-10">
        {/* Hero Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-bold mb-3.5 shadow-xs">
            <Search className="w-3.5 h-3.5 text-red-600" />
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase">
              VALIDASI & STATUS PENDAFTARAN 2027
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 uppercase py-0.5">
            Cek Status Pendaftaran Peleton
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5 max-w-xl mx-auto leading-relaxed">
            Pantau status verifikasi berkas administrasi, pakta integritas online, dan konfirmasi ACC Admin tim sekolah Anda.
          </p>
        </div>

        {/* Search Console Card - Segmented OTP Input (8 Karakter: 2 Kelompok x 4) */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="space-y-4 text-center">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                KODE REGISTRASI PELETON
              </label>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Masukkan 8 karakter kode registrasi peleton yang tercantum pada bukti pendaftaran (contoh: C6T0-RM70).
              </p>
            </div>

            {/* Segmented Controls: Prefix + Jenjang Toggle + 8 OTP Boxes */}
            <div className="flex flex-col items-center gap-4 pt-2">
              {/* Segmented Prefix & Jenjang */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-black text-xs sm:text-sm tracking-wider shadow-xs">
                  LBB27
                </span>
                <span className="text-slate-300 font-bold">-</span>
                <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setJenjang('SD');
                      setErrorMessage('');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      jenjang === 'SD'
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    SD / MI
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setJenjang('SMP');
                      setErrorMessage('');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      jenjang === 'SMP'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    SMP / MTs
                  </button>
                </div>
                <span className="text-slate-300 font-bold">-</span>
              </div>

              {/* 8 OTP Boxes: 2 Blok x 4 Kotak */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap" onPaste={handlePaste}>
                {/* Blok 1 (Karakter 1 - 4) */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {[0, 1, 2, 3].map(idx => (
                    <input
                      key={idx}
                      ref={el => (inputRefs.current[idx] = el)}
                      type="text"
                      maxLength={1}
                      value={otpValues[idx]}
                      onChange={e => handleOtpChange(e.target.value, idx)}
                      onKeyDown={e => handleOtpKeyDown(e, idx)}
                      className={`w-9 h-12 sm:w-12 sm:h-15 text-center font-mono font-black text-base sm:text-xl rounded-xl border-2 border-slate-200 focus:bg-white focus:ring-4 bg-slate-50 text-slate-900 outline-none transition-all uppercase shadow-2xs ${
                        jenjang === 'SMP'
                          ? 'focus:border-blue-600 focus:ring-blue-600/10 selection:bg-blue-200'
                          : 'focus:border-red-600 focus:ring-red-600/10 selection:bg-red-200'
                      }`}
                      placeholder="•"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                <span className="text-slate-400 font-bold text-lg hidden sm:inline">-</span>

                {/* Blok 2 (Karakter 5 - 8) */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {[4, 5, 6, 7].map(idx => (
                    <input
                      key={idx}
                      ref={el => (inputRefs.current[idx] = el)}
                      type="text"
                      maxLength={1}
                      value={otpValues[idx]}
                      onChange={e => handleOtpChange(e.target.value, idx)}
                      onKeyDown={e => handleOtpKeyDown(e, idx)}
                      className={`w-9 h-12 sm:w-12 sm:h-15 text-center font-mono font-black text-base sm:text-xl rounded-xl border-2 border-slate-200 focus:bg-white focus:ring-4 bg-slate-50 text-slate-900 outline-none transition-all uppercase shadow-2xs ${
                        jenjang === 'SMP'
                          ? 'focus:border-blue-600 focus:ring-blue-600/10 selection:bg-blue-200'
                          : 'focus:border-red-600 focus:ring-red-600/10 selection:bg-red-200'
                      }`}
                      placeholder="•"
                    />
                  ))}
                </div>
              </div>

              {/* Action buttons (Paste & Reset) */}
              <div className="flex items-center justify-center gap-3 text-xs pt-1">
                {otpValues.some(v => v !== '') && (
                  <button
                    type="button"
                    onClick={handleResetOtp}
                    className="text-slate-500 hover:text-red-600 font-medium transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-slate-100"
                  >
                    Hapus Kode
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClipboardPaste}
                  className="text-slate-600 hover:text-slate-900 font-semibold transition-colors cursor-pointer py-1 px-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white shadow-2xs"
                >
                  Tempel Kode
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-red-700 font-bold bg-red-50 border border-red-200 p-3 rounded-xl max-w-md mx-auto">
                {errorMessage}
              </p>
            )}
          </div>
        </div>

        {/* Results Container */}
        <div className="space-y-3 mb-8">
          {!isCompleted ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center text-slate-500 relative overflow-hidden">
              <img
                src="/manganperpunk.png"
                alt="Maskot Manganperpunk"
                className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 object-contain"
                loading="lazy"
                decoding="async"
              />
              <h4 className="text-sm font-bold text-slate-900">Pencarian Data Peleton</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Silakan ketikkan 8 karakter kode registrasi secara lengkap pada kotak di atas untuk melihat status pendaftaran peleton Anda.
              </p>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center text-slate-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50 text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900">Tidak Ditemukan Pendaftar</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Tidak ada tim yang cocok dengan kode <span className={`font-bold ${jenjang === 'SMP' ? 'text-blue-700' : 'text-red-700'}`}>LBB27-{jenjang}-{enteredCodeFormatted}</span>. Pastikan penulisan kode sudah sesuai dengan bukti pendaftaran online.
              </p>
            </div>
          ) : (
            filteredTeams.map(team => (
              <div
                key={team.id}
                onClick={() => handleSelectTeam(team)}
                className="group bg-white hover:border-slate-300 border border-slate-200 p-5 rounded-3xl shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-lg">
                      {team.regCode}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${
                      team.jenjang === 'SMP'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {team.jenjang} • {team.category}
                    </span>
                    {team.lotNumber && (
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                        Undian Tampil #{team.lotNumber}
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-lg text-slate-900 group-hover:text-amber-600 transition-colors">
                    {team.schoolName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>Peleton: <strong className="text-slate-800">{team.platoonName}</strong></span>
                    <span>Pembina: <strong className="text-slate-800">{team.coachName}</strong></span>
                    <span>No. WA: <strong className="text-slate-800 font-mono">{team.waNumber}</strong></span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {team.status === 'pending' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                      <Clock className="w-4 h-4 text-amber-600" /> 1. Menunggu Validasi Panitia
                    </span>
                  )}
                  {team.status === 'registered' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                      <ShieldCheck className="w-4 h-4 text-slate-600" /> 2. Terdaftar (Lengkapi Peleton)
                    </span>
                  )}
                  {team.status === 'revision' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                      <AlertTriangle className="w-4 h-4 text-rose-600" /> Perlu Perbaikan Berkas
                    </span>
                  )}
                  {team.status === 'verified' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> 3. Terverifikasi Sah
                    </span>
                  )}
                  {team.status === 'drawn' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                      <CalendarCheck className="w-4 h-4 text-slate-600" /> 4. Siap Tampil (Terundi)
                    </span>
                  )}

                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 group-hover:text-red-800 transition-colors"
                  >
                    <span>Masuk ke Dashboard Tim</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Call To Action */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
          <div>
            <h4 className="font-black text-slate-900 text-sm">Sekolah Anda Belum Terdaftar?</h4>
            <p className="text-xs text-slate-500 mt-0.5">Segera daftarkan peleton terbaik Anda sebelum kuota peleton terpenuhi.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              navigateTo('register');
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition-all shrink-0"
          >
            Daftar Sekarang →
          </button>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 relative z-10">
        <p>© 2027 Panitia Lomba Baris Berbaris (LBB) Madrasah Mu'allimin Muhammadiyah Yogyakarta</p>
      </footer>
    </div>
  );
}
