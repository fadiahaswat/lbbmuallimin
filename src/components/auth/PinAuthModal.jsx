import React, { useState, useEffect } from 'react';
import { Lock, X, Shield, Award, Crown, Eye, EyeOff } from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';

export default function PinAuthModal() {
  const { pinPrompt, closePinPrompt, submitPinPrompt } = useCompetition();
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    if (pinPrompt.isOpen) {
      setPinInput('');
      setShowPin(false);
    }
  }, [pinPrompt.isOpen]);

  if (!pinPrompt.isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    submitPinPrompt(pinInput);
  }

  const roleMeta = {
    admin: {
      title: 'Panitia Sekretariat (Admin)',
      desc: 'Akses verifikasi berkas pendaftaran dan pengundian nomor tampil (TM).',
      icon: Shield,
      color: 'text-blue-400 bg-blue-500/20 border-blue-400/30',
      hint: 'admin2026',
    },
    juri: {
      title: 'Dewan Juri Lomba',
      desc: 'Akses lembar digital E-Scoring penilaian Danton dan Pasukan PBB.',
      icon: Award,
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-400/30',
      hint: 'juri2026',
    },
    superadmin: {
      title: 'Superadmin / Master Control',
      desc: 'Akses penuh kontrol sistem, saklar pendaftaran, dan reset basis data.',
      icon: Crown,
      color: 'text-rose-400 bg-rose-500/20 border-rose-400/30',
      hint: 'super2026',
    },
  };

  const meta = roleMeta[pinPrompt.targetRole] || roleMeta.admin;
  const Icon = meta.icon;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={closePinPrompt}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${meta.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-yellow-400" />
              <span>Otoritas Keamanan</span>
            </div>
            <h3 className="font-black text-lg text-white mt-0.5">{meta.title}</h3>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          {meta.desc} Silakan masukkan PIN resmi panitia untuk melanjutkan.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
              PIN Akses Petugas
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

            <div className="mt-3 text-[11px] text-slate-400 bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span>PIN Akses Resmi Demo:</span>
              <button
                type="button"
                onClick={() => setPinInput(meta.hint)}
                className="font-mono font-bold text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 px-2 py-0.5 rounded border border-yellow-400/30 transition-all"
                title="Klik untuk mengisi otomatis"
              >
                {meta.hint}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={closePinPrompt}
              className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-black uppercase tracking-wider bg-red-700 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-950/50 transition-all"
            >
              Masuk Portal
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
