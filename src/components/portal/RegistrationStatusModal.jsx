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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-red-500 selection:text-white">
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white py-3 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali ke Beranda</span>
              <span className="sm:hidden">Kembali</span>
            </button>
            <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded border border-yellow-400/20">
                Pencarian Resmi
              </span>
              <span className="text-xs text-slate-400 hidden md:inline">LBB Mu'allimin Muhammadiyah Yogyakarta 2026</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Tutup Pencarian
          </button>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        
        {/* Hero Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-500/30 text-red-300 text-xs font-bold mb-3">
            <Search className="w-3.5 h-3.5 text-red-400" />
            <span>Validasi & Pelacakan Registrasi</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase italic">
            Cek Status Pendaftaran Peleton
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Pantau status verifikasi berkas administrasi, konfirmasi pembayaran, dan unduhan dokumen resmi tim sekolah Anda.
          </p>
        </div>

        {/* Search Console Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden mb-6">
          <div className="space-y-3">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Ketik Kode Registrasi, Nama Sekolah, atau No. WhatsApp Pembina
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
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-2xl text-white font-medium text-sm sm:text-base placeholder:text-slate-500 transition-all"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded-lg"
                >
                  Hapus
                </button>
              )}
            </div>
            {errorMessage && (
              <p className="text-xs text-red-400 font-bold bg-red-950/50 border border-red-800/60 p-3 rounded-xl">
                {errorMessage}
              </p>
            )}
          </div>
        </div>

        {/* Results Container */}
        <div className="space-y-3 mb-8">
          {query.trim() === '' ? (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 sm:p-12 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-500" />
              <h4 className="text-sm font-bold text-slate-300">Pencarian Data Peleton</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Silakan ketikkan kode registrasi, nama sekolah, atau nomor kontak pembina yang didaftarkan pada formulir online.
              </p>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 sm:p-12 text-center text-slate-400">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-40 text-amber-500" />
              <h4 className="text-sm font-bold text-white">Tidak Ditemukan Pendaftar</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Tidak ada tim yang cocok dengan kata kunci <span className="text-yellow-400 font-bold">"{query}"</span>. Pastikan nomor atau penulisan kode sudah sesuai.
              </p>
            </div>
          ) : (
            filteredTeams.map(team => (
              <div
                key={team.id}
                onClick={() => handleSelectTeam(team)}
                className="group bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-red-500/60 p-5 rounded-3xl shadow-xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-black text-xs text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-lg">
                      {team.regCode}
                    </span>
                    <span className="text-[11px] font-extrabold bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-lg border border-slate-700">
                      {team.jenjang} • {team.category}
                    </span>
                    {team.lotNumber && (
                      <span className="text-[11px] font-black text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded-lg border border-yellow-400/30">
                        Undian Tampil #{team.lotNumber}
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-lg text-white group-hover:text-red-400 transition-colors">
                    {team.schoolName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span>Peleton: <strong className="text-slate-200">{team.platoonName}</strong></span>
                    <span>Pembina: <strong className="text-slate-200">{team.coachName}</strong></span>
                    <span>No. WA: <strong className="text-slate-200 font-mono">{team.waNumber}</strong></span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {team.status === 'verified' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                      <ShieldCheck className="w-4 h-4" /> Berkas Terverifikasi
                    </span>
                  )}
                  {team.status === 'pending' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
                      <Clock className="w-4 h-4" /> Menunggu Validasi Panitia
                    </span>
                  )}
                  {team.status === 'revision' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-black text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/30">
                      <AlertTriangle className="w-4 h-4" /> Perlu Perbaikan Berkas
                    </span>
                  )}

                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 group-hover:text-red-300 transition-colors"
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
        <div className="bg-gradient-to-r from-red-950/60 to-slate-900 border border-red-900/40 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-black text-white text-sm">Sekolah Anda Belum Terdaftar?</h4>
            <p className="text-xs text-slate-400 mt-0.5">Segera daftarkan peleton terbaik Anda sebelum kuota peleton terpenuhi.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              navigateTo('register');
            }}
            className="px-6 py-2.5 bg-red-700 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-red-950/40 transition-all shrink-0"
          >
            Daftar Sekarang →
          </button>
        </div>

      </main>

      {/* Page Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Madrasah Mu'allimin Muhammadiyah Yogyakarta • Panitia Pelaksana LBB 2026</p>
      </footer>
    </div>
  );
}
