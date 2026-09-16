import React, { useState } from 'react';
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

export default function RegistrationStatusModal({ isOpen, onClose }) {
  const { teams, loginAsTeam, openModal, navigateTo, goBack } = useCompetition();

  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (isOpen === false) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      goBack();
    }
  };

  const filteredTeams = query.trim()
    ? teams.filter(
        t =>
          t.regCode.toLowerCase().includes(query.toLowerCase()) ||
          t.schoolName.toLowerCase().includes(query.toLowerCase()) ||
          t.waNumber.includes(query)
      )
    : [];

  function handleSelectTeam(team) {
    const res = loginAsTeam(team.regCode);
    if (res.success) {
      if (onClose) onClose();
      navigateTo('peserta_dashboard');
    } else {
      setErrorMessage(res.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-red-500 selection:text-white relative font-sans">
      {/* Background Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(#8B0000 1px, transparent 1px), linear-gradient(to right, #8B0000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute left-0 top-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-red-900/5 rounded-full blur-3xl pointer-events-none z-0" />

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
              <img src={logoImg} alt="Logo Tonti" className="h-8 w-auto filter drop-shadow-xs hidden sm:block" />
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-700 block leading-none">
                  Pelacakan Tim
                </span>
                <span className="text-xs font-bold text-slate-800 hidden md:inline">
                  LBB Mu'allimin 2026
                </span>
              </div>
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
              VALIDASI & STATUS PENDAFTARAN 2026
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 uppercase italic py-0.5">
            Cek Status{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-600">
              Pendaftaran Peleton
            </span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5 max-w-xl mx-auto leading-relaxed">
            Pantau status verifikasi berkas administrasi, pakta integritas online, dan konfirmasi ACC Admin tim sekolah Anda.
          </p>
        </div>

        {/* Search Console Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-sm mb-6">
          <div className="space-y-3">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Ketik Kode Registrasi, Nama Sekolah, atau No. WhatsApp Official
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Masukkan Kode Registrasi (contoh: LBB26-SMP-001) atau Nama Sekolah..."
                className="w-full pl-12 pr-20 py-3.5 bg-slate-50 border border-slate-200 focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-600/10 rounded-2xl text-slate-900 font-medium text-sm sm:text-base placeholder:text-slate-400 transition-all outline-none"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-3 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  Hapus
                </button>
              )}
            </div>
            {errorMessage && (
              <p className="text-xs text-red-700 font-bold bg-red-50 border border-red-200 p-3 rounded-xl">
                {errorMessage}
              </p>
            )}
          </div>
        </div>

        {/* Results Container */}
        <div className="space-y-3 mb-8">
          {query.trim() === '' ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center text-slate-500 relative overflow-hidden">
              <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-red-50 border border-red-100 flex items-center justify-center p-2 overflow-hidden shadow-inner">
                <img
                  src="/fotoslide/3.PNG"
                  alt="Paskibra Danton"
                  className="w-full h-full object-contain object-top"
                  loading="lazy"
                />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Pencarian Data Peleton</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Silakan ketikkan kode registrasi, nama sekolah, atau nomor kontak official yang didaftarkan pada formulir online.
              </p>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center text-slate-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50 text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900">Tidak Ditemukan Pendaftar</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Tidak ada tim yang cocok dengan kata kunci <span className="text-red-700 font-bold">"{query}"</span>. Pastikan nomor atau penulisan kode sudah sesuai.
              </p>
            </div>
          ) : (
            filteredTeams.map(team => (
              <div
                key={team.id}
                onClick={() => handleSelectTeam(team)}
                className="group bg-white hover:border-red-400 border border-slate-200 p-5 rounded-3xl shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs text-red-800 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-lg">
                      {team.regCode}
                    </span>
                    <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {team.jenjang} • {team.category}
                    </span>
                    {team.lotNumber && (
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                        Undian Tampil #{team.lotNumber}
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-lg text-slate-900 group-hover:text-red-700 transition-colors">
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
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                      <ShieldCheck className="w-4 h-4 text-blue-600" /> 2. Terdaftar (Lengkapi Peleton)
                    </span>
                  )}
                  {team.status === 'revision' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                      <AlertTriangle className="w-4 h-4 text-rose-600" /> Perlu Perbaikan Berkas
                    </span>
                  )}
                  {team.status === 'verified' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> 3. Terverifikasi Sah
                    </span>
                  )}
                  {team.status === 'drawn' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                      <Sparkles className="w-4 h-4 text-purple-600" /> 4. Terundi Sah (No. #{team.lotNumber})
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
        <p>© 2026 Panitia Lomba Baris Berbaris (LBB) Madrasah Mu'allimin Muhammadiyah Yogyakarta</p>
      </footer>
    </div>
  );
}
