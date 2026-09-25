import React, { useState } from 'react';
import {
  LogOut,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Users,
  CreditCard,
  Trash2,
  FileCheck2,
  ShieldCheck,
  DoorOpen,
  Award,
  Sparkles
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function BasecampCheckOutView() {
  const {
    teams,
    staging,
    checkOutBasecamp,
    currentUser,
    role
  } = useCompetition();

  const userRole = currentUser?.role || role || 'publik';
  // Hanya Petugas Khusus Basecamp (checkin@lbbmuallimin.com) dan Superadmin
  const canProcessCheckOut = ['checkin', 'superadmin'].includes(userRole);

  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [checkoutChecklist, setCheckoutChecklist] = useState({
    roomCleanChecked: true,
    sortedTrashReturned: true,
    ktpReturned: true,
  });
  const [searchFilter, setSearchFilter] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Teams that have checked in and are currently in the venue
  const checkedInTeams = teams.filter(t => staging?.basecamp?.[t.id]?.checkedIn);
  const checkedOutTeams = teams.filter(t => staging?.basecamp?.[t.id]?.checkedOut);
  const activeInVenueTeams = checkedInTeams.filter(t => !staging?.basecamp?.[t.id]?.checkedOut);

  const selectedTeamData = teams.find(t => t.id === selectedTeamId);
  const selectedTeamStaging = selectedTeamId ? staging?.basecamp?.[selectedTeamId] : null;

  const handleProcessCheckOut = (e) => {
    e.preventDefault();
    if (!canProcessCheckOut || !selectedTeamId) return;

    if (!checkoutChecklist.roomCleanChecked || !checkoutChecklist.sortedTrashReturned || !checkoutChecklist.ktpReturned) {
      if (!window.confirm('Semua checklist kebersihan dan pengembalian KTP belum dicentang. Tetap lanjutkan Check-Out?')) {
        return;
      }
    }

    checkOutBasecamp(selectedTeamId, {
      ...checkoutChecklist,
      checkedOutAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    });

    setToastMsg(`Peleton ${selectedTeamData?.schoolName || ''} berhasil Check-Out & KTP resmi dikembalikan!`);
    setSelectedTeamId(null);
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <SimpaskorSidebarLayout
      activeMenu="checkout"
      title="Check-Out & Bebas Fasilitas"
      subtitle="Inspeksi kebersihan ruang transit basecamp, pembuangan sampah terpilah, & pengembalian KTP fisik"
    >
      <div className="space-y-6">

        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-red-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-900/40 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-black uppercase tracking-wider">
                <LogOut className="w-3.5 h-3.5" />
                <span>Tahap 9: Pos Kepulangan & Kliring</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Check-Out Basecamp & Pengembalian Jaminan
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Pemeriksaan kebersihan ruang transit peleton, verifikasi pengembalian 2 kantong sampah terpilah, pengembalian KTP Pembina, serta pelepasan resmi kontingen.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center min-w-[110px]">
                <span className="text-[10px] uppercase font-bold text-amber-300 block">Masih di Lokasi</span>
                <span className="text-2xl font-black text-amber-300 font-mono">{activeInVenueTeams.length} Tim</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center min-w-[110px]">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">Sudah Pulang</span>
                <span className="text-2xl font-black text-white font-mono">{checkedOutTeams.length} Tim</span>
              </div>
            </div>
          </div>
        </div>

        {toastMsg && (
          <div className="bg-emerald-600 text-white p-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Form Check-Out & Clearance (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {selectedTeamData ? (
              <form onSubmit={handleProcessCheckOut} className="bg-white rounded-3xl p-6 border-2 border-rose-500 shadow-lg space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-rose-600 text-white font-mono font-black text-base flex items-center justify-center shadow-md shadow-rose-600/30">
                      {selectedTeamData.lotNumber ? String(selectedTeamData.lotNumber).padStart(2, '0') : '#'}
                    </span>
                    <div>
                      <h4 className="text-base font-black text-slate-900">{selectedTeamData.schoolName}</h4>
                      <p className="text-xs text-slate-500 font-mono">
                        {selectedTeamData.regCode} • Check-In: {selectedTeamStaging?.checkedInAt || '-'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTeamId(null)}
                    className="text-xs text-slate-400 hover:text-slate-700 font-bold"
                  >
                    Tutup
                  </button>
                </div>

                {/* KTP Info Yang Ditahan */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Jaminan Identitas Yang Ditahan Saat Check-In:
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">
                        {selectedTeamStaging?.ktpOfficialName || selectedTeamData.coachName || 'Pembina Resmi'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {selectedTeamStaging?.ktpType || 'KTP Asli Fisik'} • Wajib dikembalikan kepada pembina bersangkutan
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checklist Clearance Ruang Transit */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-600" />
                    <span>Verifikasi Kliring & Kebersihan Ruang Transit:</span>
                  </label>
                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={checkoutChecklist.roomCleanChecked}
                        onChange={e => setCheckoutChecklist(prev => ({ ...prev, roomCleanChecked: e.target.checked }))}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">Ruang Transit Bersih & Rapih</span>
                        <span className="text-[11px] text-slate-500">Tidak ada sampah, botol minuman, atau barang tertinggal di area kelas/selasar</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={checkoutChecklist.sortedTrashReturned}
                        onChange={e => setCheckoutChecklist(prev => ({ ...prev, sortedTrashReturned: e.target.checked }))}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">Kantong Sampah Terpilah Dibuang ke Posko Sampah</span>
                        <span className="text-[11px] text-slate-500">2 kantong sampah terpilah telah disetorkan ke petugas kebersihan pusat</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={checkoutChecklist.ktpReturned}
                        onChange={e => setCheckoutChecklist(prev => ({ ...prev, ktpReturned: e.target.checked }))}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">KTP Fisik Telah Diserahkan Kembali ke Pembina</span>
                        <span className="text-[11px] text-slate-500">Jaminan KTP diserahkan langsung kepada nama yang bersangkutan</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Check-Out Button */}
                <button
                  type="submit"
                  disabled={!canProcessCheckOut}
                  className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  Konfirmasi Check-Out & Serahkan KTP
                </button>
              </form>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center space-y-3">
                <DoorOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-black text-slate-700">Pilih Peleton yang Hendak Check-Out</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Pilih peleton dari daftar di sebelah kanan saat pembina mengajukan kepulangan kontingen dan meminta pengembalian KTP.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: List of Teams for Check-Out (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase">Kontingen di Lokasi</h3>
                <p className="text-[11px] text-slate-500">Peleton yang berhak memproses Check-Out</p>
              </div>
              <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg">
                {activeInVenueTeams.length} Peleton
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Cari sekolah di lokasi..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
              />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {checkedInTeams
                .filter(t => t.schoolName.toLowerCase().includes(searchFilter.toLowerCase()))
                .map(t => {
                  const isCheckedOut = staging?.basecamp?.[t.id]?.checkedOut;
                  const isSelected = selectedTeamId === t.id;

                  return (
                    <div
                      key={t.id}
                      onClick={() => !isCheckedOut && setSelectedTeamId(t.id)}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        isCheckedOut
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : isSelected
                          ? 'bg-rose-50 border-rose-500 shadow-sm cursor-pointer'
                          : 'bg-white hover:bg-slate-50 border-slate-200 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 ${
                          isCheckedOut
                            ? 'bg-slate-200 text-slate-500'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {t.lotNumber ? String(t.lotNumber).padStart(2, '0') : '-'}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">{t.schoolName}</div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {t.jenjang} • Jaminan: {staging?.basecamp?.[t.id]?.ktpOfficialName || t.coachName || '-'}
                          </div>
                        </div>
                      </div>

                      <div>
                        {isCheckedOut ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                            Pulang ({staging?.basecamp?.[t.id]?.checkedOutAt || '-'})
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                            Proses Pulang
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

        </div>

      </div>
    </SimpaskorSidebarLayout>
  );
}
