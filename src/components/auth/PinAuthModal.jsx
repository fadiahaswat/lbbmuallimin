import React, { useState, useEffect } from 'react';
import { Lock, X, Shield, Award, Crown, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';

export default function PinAuthModal() {
  const { pinPrompt, closePinPrompt, submitPinPrompt, activeView, goBack } = useCompetition();
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    setPinInput('');
    setShowPin(false);
  }, [pinPrompt.targetRole]);

  if (activeView !== 'pin_auth' && !pinPrompt.isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    submitPinPrompt(pinInput);
  }

  const roleMeta = {
    admin: {
      title: 'Panitia Pelaksana (Sekretariat)',
      desc: 'Akses verifikasi berkas pendaftaran, approval pembayaran, dan pengundian nomor urut tampil.',
      icon: Shield,
      color: 'text-blue-400 bg-blue-500/20 border-blue-400/30',
      hint: 'admin2026',
    },
    juri: {
      title: 'Dewan Juri Perlombaan',
      desc: 'Akses formulir digital E-Scoring penilaian Danton dan Pasukan PBB secara langsung.',
      icon: Award,
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-400/30',
      hint: 'juri2026',
    },
    superadmin: {
      title: 'Superadmin / Master Control',
      desc: 'Akses penuh kontrol sistem, saklar pembukaan pendaftaran, dan konfigurasi master data.',
      icon: Crown,
      color: 'text-rose-400 bg-rose-500/20 border-rose-400/30',
      hint: 'super2026',
    },
  };

  const targetRole = pinPrompt.targetRole || 'admin';
  const meta = roleMeta[targetRole] || roleMeta.admin;
  const Icon = meta.icon;

  const handleBack = () => {
    closePinPrompt();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-red-500 selection:text-white">
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white py-3 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali ke Halaman Sebelumnya</span>
              <span className="sm:hidden">Kembali</span>
            </button>
            <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-950/60 px-2.5 py-0.5 rounded border border-red-500/30">
                Otentikasi Petugas
              </span>
              <span className="text-xs text-slate-400 hidden md:inline">LBB Mu'allimin Muhammadiyah Yogyakarta 2026</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative my-auto">
          
          <div className="flex items-center gap-3.5 mb-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${meta.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-yellow-400" />
                <span>Otoritas Keamanan</span>
              </div>
              <h1 className="font-black text-lg sm:text-xl text-white mt-0.5">{meta.title}</h1>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            {meta.desc} Silakan masukkan PIN keamanan resmi panitia untuk melanjutkan.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                PIN Akses Otoritas
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  autoFocus
                  required
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  placeholder="Ketik PIN..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-base tracking-widest focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors"
                  title={showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {pinPrompt.error && (
                <p className="text-xs text-rose-400 font-bold mt-2 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
                  {pinPrompt.error}
                </p>
              )}

            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-black uppercase tracking-wider bg-red-700 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-950/50 transition-all"
              >
                Verifikasi Otoritas
              </button>
            </div>
          </form>

        </div>
      </main>

      {/* Page Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Madrasah Mu'allimin Muhammadiyah Yogyakarta • Panitia Pelaksana LBB 2026</p>
      </footer>
    </div>
  );
}
