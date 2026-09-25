import React, { useState } from 'react';
import {
  LogIn,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Users,
  CreditCard,
  Droplets,
  PackageCheck,
  Printer,
  ShieldCheck,
  Building2,
  ExternalLink,
  Trash2,
  Tag
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function BasecampCheckInView() {
  const {
    teams,
    staging,
    checkInBasecamp,
    currentUser,
    role
  } = useCompetition();

  const userRole = currentUser?.role || role || 'publik';
  // Hanya Petugas Khusus Check-In (checkin@lbbmuallimin.com) dan Superadmin
  const canProcessCheckIn = ['checkin', 'superadmin'].includes(userRole);

  const [qrInput, setQrInput] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [ktpOfficialName, setKtpOfficialName] = useState('');
  const [ktpType, setKtpType] = useState('KTP Fisik');
  const [logisticsChecklist, setLogisticsChecklist] = useState({
    waterBox: true,
    chestNumber: true,
    cocardOfficial: true,
    trashBag: true,
  });
  const [toastMsg, setToastMsg] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  // Eligible teams (drawn or verified)
  const competitionTeams = teams.filter(t => ['verified', 'drawn'].includes(t.status) || t.lotNumber);

  // Stats
  const checkedInTeams = competitionTeams.filter(t => staging?.basecamp?.[t.id]?.checkedIn);
  const pendingTeams = competitionTeams.filter(t => !staging?.basecamp?.[t.id]?.checkedIn);

  const handleSelectTeam = (team) => {
    setSelectedTeamId(team.id);
    setKtpOfficialName(team.coachName || '');
  };

  const handleProcessCheckIn = (e) => {
    e.preventDefault();
    if (!canProcessCheckIn) return;
    if (!selectedTeamId) {
      alert('Pilih peleton yang akan di-check in terlebih dahulu!');
      return;
    }
    if (!ktpOfficialName.trim()) {
      alert('Nama pemilik identitas (KTP Pembina) wajib diisi!');
      return;
    }

    checkInBasecamp(selectedTeamId, {
      ktpOfficialName: ktpOfficialName.trim(),
      ktpType,
      logistics: logisticsChecklist,
      checkedInAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    });

    const targetTeam = teams.find(t => t.id === selectedTeamId);
    setToastMsg(`Peleton ${targetTeam?.schoolName || ''} berhasil Check-In Basecamp!`);
    setSelectedTeamId(null);
    setKtpOfficialName('');
    setQrInput('');
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleSearchQR = (e) => {
    e.preventDefault();
    const q = qrInput.trim().toLowerCase();
    if (!q) return;

    const matched = competitionTeams.find(t =>
      t.regCode.toLowerCase() === q ||
      t.schoolName.toLowerCase().includes(q) ||
      (t.lotNumber && String(t.lotNumber) === q)
    );

    if (matched) {
      handleSelectTeam(matched);
    } else {
      alert(`Peleton dengan kode / nomor undian "${qrInput}" tidak ditemukan.`);
    }
  };

  const selectedTeamData = teams.find(t => t.id === selectedTeamId);

  return (
    <SimpaskorSidebarLayout
      activeMenu="checkin"
      title="Check-In Kedatangan & Logistik"
      subtitle="Registrasi kedatangan peleton hari-H, serah terima KTP jaminan, & distribusi paket logistik"
    >
      <div className="space-y-6">

        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-900/40 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-black uppercase tracking-wider">
                <LogIn className="w-3.5 h-3.5" />
                <span>Tahap 4: Pos Kedatangan Kontingen</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Check-In Basecamp & Logistik Lomba
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Pencatatan kedatangan resmi peleton, penyerahan identitas KTP Pembina/Pelatih sebagai jaminan fasilitas transit, serta serah terima nomor dada & air mineral.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center min-w-[110px]">
                <span className="text-[10px] uppercase font-bold text-teal-300 block">Tiba di Lokasi</span>
                <span className="text-2xl font-black text-white font-mono">{checkedInTeams.length} Tim</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center min-w-[110px]">
                <span className="text-[10px] uppercase font-bold text-amber-300 block">Belum Tiba</span>
                <span className="text-2xl font-black text-amber-300 font-mono">{pendingTeams.length} Tim</span>
              </div>
            </div>
          </div>
        </div>

        {toastMsg && (
          <div className="bg-teal-600 text-white p-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* 2 Column: Left Scanner & Form, Right Arrival List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Form Check-In (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Quick QR Search Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase">Pindai / Cari Peleton Cepat</h3>
                  <p className="text-[11px] text-slate-500">Scan QR Code ID Card atau ketik kode pendaftaran</p>
                </div>
              </div>

              <form onSubmit={handleSearchQR} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={qrInput}
                    onChange={e => setQrInput(e.target.value)}
                    placeholder="Contoh: LBB-2027-001, atau No Tampil (01)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:border-teal-600 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-black uppercase rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Pindai
                </button>
              </form>
            </div>

            {/* Selected Team Check-In Form */}
            {selectedTeamData ? (
              <form onSubmit={handleProcessCheckIn} className="bg-white rounded-3xl p-6 border-2 border-teal-500 shadow-lg space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-teal-600 text-white font-mono font-black text-base flex items-center justify-center shadow-md shadow-teal-600/30">
                      {selectedTeamData.lotNumber ? String(selectedTeamData.lotNumber).padStart(2, '0') : '#'}
                    </span>
                    <div>
                      <h4 className="text-base font-black text-slate-900">{selectedTeamData.schoolName}</h4>
                      <p className="text-xs text-slate-500 font-mono">{selectedTeamData.regCode} • Jenjang {selectedTeamData.jenjang}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTeamId(null)}
                    className="text-xs text-slate-400 hover:text-rose-600 font-bold"
                  >
                    Batal
                  </button>
                </div>

                {/* KTP Pembina Section */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-teal-600" />
                    <span>Jaminan Identitas Pembina / Official</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Nama Pemilik Identitas:</span>
                      <input
                        type="text"
                        required
                        value={ktpOfficialName}
                        onChange={e => setKtpOfficialName(e.target.value)}
                        placeholder="Nama Pembina / Guru Pendamping"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-teal-600 outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Jenis Kartu Identitas:</span>
                      <select
                        value={ktpType}
                        onChange={e => setKtpType(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-teal-600 outline-none"
                      >
                        <option value="KTP Fisik">KTP Asli Fisik</option>
                        <option value="SIM">SIM Asli</option>
                        <option value="KTA Guru">KTA Pegawai / Guru</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Logistics Checklist */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-teal-600" />
                    <span>Serah Terima Paket Logistik LBB:</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={logisticsChecklist.waterBox}
                        onChange={e => setLogisticsChecklist(prev => ({ ...prev, waterBox: e.target.checked }))}
                        className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span className="font-bold text-slate-800">1 Box Air Mineral (24 Botol)</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={logisticsChecklist.chestNumber}
                        onChange={e => setLogisticsChecklist(prev => ({ ...prev, chestNumber: e.target.checked }))}
                        className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span className="font-bold text-slate-800">Nomor Dada Tampil Peleton</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={logisticsChecklist.cocardOfficial}
                        onChange={e => setLogisticsChecklist(prev => ({ ...prev, cocardOfficial: e.target.checked }))}
                        className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span className="font-bold text-slate-800">Cocard Pendamping Peleton (3 Pcs: 1 Official + 2 Pendukung)</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={logisticsChecklist.trashBag}
                        onChange={e => setLogisticsChecklist(prev => ({ ...prev, trashBag: e.target.checked }))}
                        className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span className="font-bold text-slate-800">Kantong Sampah Terpilah (2 Pcs)</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!canProcessCheckIn}
                  className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-teal-600/30 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  Konfirmasi Check-In & Serahkan Logistik
                </button>
              </form>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center space-y-3">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-black text-slate-700">Pilih Peleton untuk Check-In</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Silakan scan kode QR peleton di atas atau pilih salah satu tim dari daftar di sebelah kanan.
                </p>
              </div>
            )}

          </div>

          {/* Right Column: Status Kedatangan Peleton (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase">Daftar Peleton Hari-H</h3>
                <p className="text-[11px] text-slate-500">Klik peleton untuk melakukan Check-In</p>
              </div>
              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                {checkedInTeams.length}/{competitionTeams.length} Hadir
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Saring nama sekolah..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
              />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {competitionTeams
                .filter(t => t.schoolName.toLowerCase().includes(searchFilter.toLowerCase()))
                .sort((a, b) => (a.lotNumber || 99) - (b.lotNumber || 99))
                .map(t => {
                  const isChecked = staging?.basecamp?.[t.id]?.checkedIn;
                  const isSelected = selectedTeamId === t.id;

                  return (
                    <div
                      key={t.id}
                      onClick={() => !isChecked && handleSelectTeam(t)}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-700'
                          : isSelected
                          ? 'bg-teal-50 border-teal-500 shadow-sm cursor-pointer'
                          : 'bg-white hover:bg-slate-50 border-slate-200 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 ${
                          isChecked
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {t.lotNumber ? String(t.lotNumber).padStart(2, '0') : '-'}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">{t.schoolName}</div>
                          <div className="text-[10px] text-slate-400 truncate">{t.jenjang} • {t.regCode}</div>
                        </div>
                      </div>

                      <div>
                        {isChecked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            {staging?.basecamp?.[t.id]?.checkedInAt || 'Hadir'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            Belum Tiba
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
