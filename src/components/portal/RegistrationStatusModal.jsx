import React, { useState } from 'react';
import {
  X,
  Search,
  ShieldCheck,
  Clock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Users,
  Printer
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';

export default function RegistrationStatusModal({ isOpen, onClose }) {
  const { teams, loginAsTeam, openModal } = useCompetition();

  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

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
      onClose();
    } else {
      setErrorMessage(res.message);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200 text-slate-900">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center shadow-sm">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white uppercase italic">Cek Status Registrasi</h3>
              <p className="text-xs text-slate-400">LBB Mu'allimin Muhammadiyah Yogyakarta 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Cari Berdasarkan Kode Registrasi / Nama Sekolah / No. WA
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
              placeholder="Contoh: LBB26-SMP-001 atau SMPN 1 atau 0812..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          </div>
          {errorMessage && <p className="text-xs text-red-600 font-bold mt-2">{errorMessage}</p>}
        </div>

        {/* Results List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-medium">Ketikkan kode atau nama sekolah untuk melihat status pendaftaran.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-1.5 text-[10px]">
                <span className="text-slate-400">Contoh kode pendaftaran:</span>
                {teams.slice(0, 3).map(t => (
                  <button
                    key={t.id}
                    onClick={() => setQuery(t.regCode)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-0.5 rounded font-mono font-bold"
                  >
                    {t.regCode}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-xs font-bold">Tidak ada pendaftar yang cocok dengan kata kunci "{query}".</p>
              <p className="text-[11px] text-slate-400 mt-1">Pastikan kode atau nomor telepon yang Anda masukkan sudah terdaftar.</p>
            </div>
          ) : (
            filteredTeams.map(team => (
              <div
                key={team.id}
                onClick={() => handleSelectTeam(team)}
                className="group bg-white hover:bg-red-50/50 border border-slate-200 hover:border-red-300 p-4 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-black text-xs text-red-700 bg-red-100/70 px-2 py-0.5 rounded">
                      {team.regCode}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {team.jenjang} • {team.category}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 text-sm group-hover:text-red-700 transition-colors">
                    {team.schoolName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Peleton: <strong className="text-slate-700">{team.platoonName}</strong> • Pembina: {team.coachName}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  {team.status === 'verified' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
                    </span>
                  )}
                  {team.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                  {team.status === 'revision' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                      <AlertTriangle className="w-3.5 h-3.5" /> Perlu Revisi
                    </span>
                  )}

                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-red-600 flex items-center justify-end gap-1 mt-1">
                    Buka Dashboard <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Belum mendaftar?</span>
          <button
            onClick={() => {
              onClose();
              openModal('regWizard');
            }}
            className="font-bold text-red-700 hover:text-red-800 hover:underline"
          >
            Buka Formulir Pendaftaran Baru →
          </button>
        </div>

      </div>
    </div>
  );
}
