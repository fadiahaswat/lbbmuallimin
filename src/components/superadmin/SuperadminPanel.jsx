import React, { useState } from 'react';
import {
  Crown,
  Shield,
  Award,
  Users,
  Settings,
  ToggleLeft,
  ToggleRight,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Trash2,
  Database,
  ArrowLeft,
  Calendar,
  Clock,
  Save,
  RefreshCw,
  UserPlus,
  Mail,
  Edit2,
  Check,
  X,
  Lock
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { EVENT } from '../../config.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function SuperadminPanel() {
  const {
    teams,
    scores,
    settings,
    updateSettings,
    resetToSeedData,
    exportTeamsCSV,
    setActiveView,
    isGoogleSheetConfigured,
    pingSheetDatabase,
    syncAllToGoogleSheet,
    pullFromGoogleSheet,
    users,
    addStaffUser,
    updateStaffUser,
    deleteStaffUser
  } = useCompetition();

  const [toastMsg, setToastMsg] = useState('');

  // Form state untuk jadwal dan tanggal pelaksanaan
  const defaultDates = {
    registrationStart: '2026-10-05T00:00:00+07:00',
    registrationDeadline: '2026-11-01T23:59:59+07:00',
    registrationRangeText: '5 Oktober – 1 November 2026',
    verificationRangeText: '2 – 8 November 2026',
    technicalMeetingDate: '10 Januari 2027',
    technicalMeetingTime: '13.00 WIB – Selesai',
    technicalMeetingFullDate: 'Sabtu, 10 Januari 2027',
    technicalMeetingVenue: "Kampus Induk Madrasah Mu'allimin Muhammadiyah Yogyakarta, Jalan Letjen S. Parman No. 68, Wirobrajan, Kota Yogyakarta, Daerah Istimewa Yogyakarta.",
    fieldTrialDate: '17 Januari 2027',
    fieldTrialTime: '08.00 – 13.30 WIB',
    fieldTrialFullDate: 'Minggu, 17 Januari 2027',
    competitionDate: 'Sabtu, 24 Januari 2027',
    competitionTimeRange: '06.00 WIB – 17.00 WIB',
  };

  const [dateForm, setDateForm] = useState(() => ({
    ...defaultDates,
    ...(settings?.eventDates || {}),
  }));

  function handleDateChange(field, value) {
    setDateForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSaveDates(e) {
    e?.preventDefault();
    updateSettings({ eventDates: dateForm });
    showToast('Jadwal & tanggal pelaksanaan berhasil diperbarui!');
  }

  function handleResetDates() {
    if (confirm('Kembalikan jadwal kegiatan ke tanggal standar resmi?')) {
      setDateForm(defaultDates);
      updateSettings({ eventDates: defaultDates });
      showToast('Jadwal kegiatan dikembalikan ke default resmi!');
    }
  }

  function handleExportJSON() {
    const backupData = {
      exportedAt: new Date().toISOString(),
      settings,
      teams,
      scores,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LBB_Muallimin_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database JSON berhasil diunduh!');
  }

  // State Manajemen Pengguna / Email Role oleh Superadmin
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    email: '',
    role: 'penginput',
    roleLabel: 'Operator Input Nilai Kertas',
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '', roleLabel: '' });

  const staffUsers = (users || []).filter(u =>
    ['superadmin', 'admin', 'penginput', 'verifikator', 'finalisator'].includes(u.role)
  );

  function handleAddStaffSubmit(e) {
    e.preventDefault();
    const res = addStaffUser(newStaffForm);
    if (res.success) {
      showToast(res.message);
      setIsAddStaffModalOpen(false);
      setNewStaffForm({
        name: '',
        email: '',
        role: 'penginput',
        roleLabel: 'Operator Input Nilai Kertas',
      });
    } else {
      alert(res.message);
    }
  }

  function handleStartEditStaff(user) {
    setEditingUserId(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      roleLabel: user.roleLabel || '',
    });
  }

  function handleSaveEditStaff(userId) {
    const res = updateStaffUser(userId, editForm);
    if (res.success) {
      showToast(res.message);
      setEditingUserId(null);
    } else {
      alert(res.message);
    }
  }

  function handleDeleteStaff(userId, email) {
    if (confirm(`Yakin ingin mencabut hak akses petugas untuk email "${email}"?`)) {
      const res = deleteStaffUser(userId);
      if (res.success) {
        showToast(res.message);
      } else {
        alert(res.message);
      }
    }
  }

  return (
    <SimpaskorSidebarLayout
      activeMenu="superadmin"
      title="Master Authority Superadmin"
      subtitle="Kontrol Sistem, Pengaturan Lomba, Sinkronisasi Spreadsheet & Hak Akses Panitia"
    >
      <div className="space-y-6">

        {toastMsg && (
          <div className="bg-emerald-600 text-white p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in duration-300">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-600/30 border border-rose-400/40 text-rose-400 flex items-center justify-center shadow-inner">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-400/20">
                  Master Authority
                </span>
                <span className="text-xs text-slate-400">Ketua Panitia & Pengawas Sistem</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white mt-0.5">
                Pengaturan Sistem Kompetisi
              </h1>
            </div>
          </div>
        </div>

        {/* Master Toggles Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h3 className="font-black text-lg text-slate-900 uppercase italic border-b border-slate-200 pb-3">
            Saklar Operasional Lomba
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            {/* Toggle 1: Pendaftaran */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-black uppercase text-slate-800 block mb-1">Pendaftaran Peserta</span>
                <p className="text-xs text-slate-500">Membuka atau menutup formulir pendaftaran daring.</p>
              </div>
              <button
                onClick={() => {
                  updateSettings({ registrationOpen: !settings.registrationOpen });
                  showToast(`Pendaftaran ${!settings.registrationOpen ? 'DIBUKA' : 'DITUTUP'}!`);
                }}
                className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  settings.registrationOpen
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                {settings.registrationOpen ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                <span>{settings.registrationOpen ? 'Status: Terbuka' : 'Status: Ditutup'}</span>
              </button>
            </div>

            {/* Toggle 2: E-Scoring Juri */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-black uppercase text-slate-800 block mb-1">Akses Penilaian Juri</span>
                <p className="text-xs text-slate-500">Mengizinkan dewan juri untuk menginput dan mengubah nilai.</p>
              </div>
              <button
                onClick={() => {
                  updateSettings({ scoringOpen: !settings.scoringOpen });
                  showToast(`Penilaian Juri ${!settings.scoringOpen ? 'DIBUKA' : 'DIKUNCI'}!`);
                }}
                className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  settings.scoringOpen
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                {settings.scoringOpen ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                <span>{settings.scoringOpen ? 'Status: Terbuka' : 'Status: Terkunci'}</span>
              </button>
            </div>

            {/* Toggle 3: Publikasi Hasil Lomba */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-black uppercase text-slate-800 block mb-1">Publikasi Pengumuman Juara</span>
                <p className="text-xs text-slate-500">Menampilkan peringkat dan perolehan juara ke publik.</p>
              </div>
              <button
                onClick={() => {
                  updateSettings({ announcementPublished: !settings.announcementPublished });
                  showToast(`Pengumuman Juara ${!settings.announcementPublished ? 'DITAYANGKAN KE PUBLIK' : 'DISEMBUNYIKAN'}!`);
                }}
                className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  settings.announcementPublished
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                {settings.announcementPublished ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                <span>{settings.announcementPublished ? 'Status: Dipublikasi' : 'Status: Draf / Rahasia'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SEKSI SUPERADMIN: KELOLA AKUN & HAK AKSES EMAIL PETUGAS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Otoritas Pengguna
                </span>
                <span className="text-xs text-slate-500 font-medium">Anti Kebocoran Data</span>
              </div>
              <h3 className="font-black text-lg text-slate-900 uppercase italic mt-1">
                Kelola Email & Role Petugas Resmi
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Superadmin mengatur sendiri daftar email Google yang diizinkan bertindak sebagai Admin, Penginput, Verifikator, dan Finalisator.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setIsAddStaffModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Email Petugas</span>
            </button>
          </div>

          {/* Tabel Daftar Pengguna & Role Terdaftar */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-600">
                  <th className="py-3 px-4">Nama Petugas</th>
                  <th className="py-3 px-4">Alamat Email Google</th>
                  <th className="py-3 px-4">Role / Wewenang</th>
                  <th className="py-3 px-4">Label Tugas</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffUsers.map(user => {
                  const isPrimarySuperadmin = user.email === 'tontimuallimin2026@gmail.com';
                  const isEditingThis = editingUserId === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        {isEditingThis ? (
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 w-full"
                          />
                        ) : (
                          <div className="flex items-center gap-2.5">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">{user.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">ID: {user.id}</span>
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {isEditingThis ? (
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 w-full"
                          />
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-mono font-bold text-slate-700">{user.email}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {isEditingThis ? (
                          <select
                            value={editForm.role}
                            onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                          >
                            <option value="penginput">Penginput Nilai</option>
                            <option value="verifikator">Verifikator Nilai</option>
                            <option value="finalisator">Finalisator (Ketua Juri)</option>
                            <option value="admin">Admin Sekretariat</option>
                            <option value="superadmin">Superadmin</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 border ${
                            user.role === 'superadmin' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                            user.role === 'admin' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            user.role === 'penginput' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            user.role === 'verifikator' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                            user.role === 'finalisator' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                            'bg-slate-100 text-slate-800 border-slate-200'
                          }`}>
                            {user.role}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {isEditingThis ? (
                          <input
                            type="text"
                            value={editForm.roleLabel}
                            onChange={e => setEditForm(prev => ({ ...prev, roleLabel: e.target.value }))}
                            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 w-full"
                          />
                        ) : (
                          <span className="text-slate-600 font-medium">{user.roleLabel || '-'}</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {isEditingThis ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSaveEditStaff(user.id)}
                              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                              title="Simpan Perubahan"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingUserId(null)}
                              className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
                              title="Batal"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEditStaff(user)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                              title="Edit Email / Role"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {!isPrimarySuperadmin && (
                              <button
                                type="button"
                                onClick={() => handleDeleteStaff(user.id, user.email)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Hapus Akses"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah Email Petugas Baru */}
        {isAddStaffModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 uppercase">Tambah Email Petugas</h4>
                    <p className="text-[11px] text-slate-500">Berikan wewenang login Google ke email tertentu</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStaffSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Petugas</label>
                  <input
                    type="text"
                    required
                    value={newStaffForm.name}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alamat Email Google (Akun Gmail)</label>
                  <input
                    type="email"
                    required
                    value={newStaffForm.email}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Contoh: budi.lbb@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Petugas wajib login menggunakan email ini saat menekan tombol Google Sign-In.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role / Peran Wewenang</label>
                  <select
                    value={newStaffForm.role}
                    onChange={e => {
                      const r = e.target.value;
                      const labels = {
                        penginput: 'Operator Input Nilai Kertas',
                        verifikator: 'Verifikator & Checker Nilai',
                        finalisator: 'Finalisator & Pengesah Rekap Nilai',
                        admin: 'Panitia Sekretariat (Admin)',
                        superadmin: 'Superadmin Pelaksana',
                      };
                      setNewStaffForm(prev => ({ ...prev, role: r, roleLabel: labels[r] || '' }));
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
                  >
                    <option value="penginput">1. Penginput Nilai (Input skor kertas + bukti foto)</option>
                    <option value="verifikator">2. Verifikator Nilai (Audit lembar fisik vs sistem)</option>
                    <option value="finalisator">3. Finalisator (Kunci permanen & sahkan Berita Acara)</option>
                    <option value="admin">Admin Sekretariat (Kelola peleton, undian, verifikasi)</option>
                    <option value="superadmin">Superadmin Master</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Label Jabatan / Tugas</label>
                  <input
                    type="text"
                    value={newStaffForm.roleLabel}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, roleLabel: e.target.value }))}
                    placeholder="Contoh: Petugas Scrutineering Pos 1"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddStaffModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-600 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Petugas</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Form Kelola Jadwal & Tanggal Pelaksanaan */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Jadwal & Lini Masa
                </span>
                <span className="text-xs text-slate-500 font-medium">Pengaturan Dinamis Waktu & Agenda</span>
              </div>
              <h3 className="font-black text-lg text-slate-900 uppercase italic mt-1">
                Kelola Tanggal Pelaksanaan Kegiatan
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDates}
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Reset ke Jadwal Default"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>
              <button
                type="button"
                onClick={handleSaveDates}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Tanggal</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Pembaruan tanggal di bawah ini akan <strong>langsung disinkronkan secara real-time</strong> ke Countdown Timer, banner Hero, kartu Lini Masa pendaftaran, jadwal Waktu & Tempat di landing page, serta dashboard peserta.
          </p>

          <form onSubmit={handleSaveDates} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
              
              {/* 1. Pembukaan Pendaftaran */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    1. Pembukaan Pendaftaran
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Tahap 1</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    ISO Waktu Mulai (untuk Countdown Timer):
                  </label>
                  <input
                    type="text"
                    value={dateForm.registrationStart}
                    onChange={e => handleDateChange('registrationStart', e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg focus:border-purple-600 outline-none"
                    placeholder="2026-10-01T00:00:00+07:00"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Teks Tampilan Rentang Pendaftaran:
                  </label>
                  <input
                    type="text"
                    value={dateForm.registrationRangeText}
                    onChange={e => handleDateChange('registrationRangeText', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-purple-600 outline-none"
                    placeholder="1 – 31 Oktober 2026"
                  />
                </div>
              </div>

              {/* 2. Penutupan Pendaftaran */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    2. Penutupan Pendaftaran
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    Auto-Close Saat Kuota Penuh
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    ISO Deadline Akhir (Target Countdown):
                  </label>
                  <input
                    type="text"
                    value={dateForm.registrationDeadline}
                    onChange={e => handleDateChange('registrationDeadline', e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg focus:border-purple-600 outline-none"
                    placeholder="2026-10-31T23:59:59+07:00"
                  />
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  * Sistem otomatis menutup tombol pendaftaran bila kuota SD & SMP telah habis terisi.
                </p>
              </div>

              {/* 3. Verifikasi Berkas */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    3. Verifikasi Berkas Panitia
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Tahap 2</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Teks Rentang Tanggal Verifikasi:
                  </label>
                  <input
                    type="text"
                    value={dateForm.verificationRangeText}
                    onChange={e => handleDateChange('verificationRangeText', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-purple-600 outline-none"
                    placeholder="2 – 8 November 2026"
                  />
                </div>
              </div>

              {/* 4. Technical Meeting (TM) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    4. Technical Meeting (TM)
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Tahap 3</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Tanggal TM:</label>
                    <input
                      type="text"
                      value={dateForm.technicalMeetingDate}
                      onChange={e => handleDateChange('technicalMeetingDate', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-purple-600 outline-none"
                      placeholder="9 Januari 2027"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Waktu TM:</label>
                    <input
                      type="text"
                      value={dateForm.technicalMeetingTime}
                      onChange={e => handleDateChange('technicalMeetingTime', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-purple-600 outline-none"
                      placeholder="13.00 WIB - Selesai"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Hari & Tanggal Lengkap TM:</label>
                  <input
                    type="text"
                    value={dateForm.technicalMeetingFullDate}
                    onChange={e => handleDateChange('technicalMeetingFullDate', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-purple-600 outline-none"
                    placeholder="Jumat, 9 Januari 2027"
                  />
                </div>
              </div>

              {/* 5. Uji Coba Lapangan */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    5. Uji Coba Lapangan
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Tahap 4</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Tanggal Uji Coba:</label>
                    <input
                      type="text"
                      value={dateForm.fieldTrialDate}
                      onChange={e => handleDateChange('fieldTrialDate', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-purple-600 outline-none"
                      placeholder="17 Januari 2027"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Waktu Uji Coba:</label>
                    <input
                      type="text"
                      value={dateForm.fieldTrialTime}
                      onChange={e => handleDateChange('fieldTrialTime', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-purple-600 outline-none"
                      placeholder="07.00 – 14.00 WIB"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Hari & Tanggal Lengkap:</label>
                  <input
                    type="text"
                    value={dateForm.fieldTrialFullDate}
                    onChange={e => handleDateChange('fieldTrialFullDate', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-purple-600 outline-none"
                    placeholder="Sabtu, 17 Januari 2027"
                  />
                </div>
              </div>

              {/* 6. Hari Pelaksanaan Lomba */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                    6. Hari Pelaksanaan Lomba (Hari-H)
                  </span>
                  <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                    Hari H
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Hari & Tanggal Lomba:</label>
                  <input
                    type="text"
                    value={dateForm.competitionDate}
                    onChange={e => handleDateChange('competitionDate', e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg focus:border-purple-600 outline-none"
                    placeholder="Sabtu, 24 Januari 2027"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Rentang Waktu Hari-H:</label>
                  <input
                    type="text"
                    value={dateForm.competitionTimeRange}
                    onChange={e => handleDateChange('competitionTimeRange', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-purple-600 outline-none"
                    placeholder="06.00 WIB – 17.00 WIB"
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Jadwal</span>
              </button>
            </div>
          </form>
        </div>

        {/* Google Spreadsheet Cloud Database Control */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Cloud Spreadsheet
                </span>
                <span className="text-xs text-slate-500 font-medium">Google Apps Script Auto-Schema</span>
              </div>
              <h3 className="font-black text-lg text-slate-900 uppercase italic mt-1">
                Konektivitas Google Sheets
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isGoogleSheetConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-xs font-bold text-slate-700">
                {isGoogleSheetConfigured ? 'Terkoneksi ke Apps Script' : 'URL Belum Dikonfigurasi di .env'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Database ini terhubung langsung ke Google Spreadsheet panitia melalui Google Apps Script universal.
            Setiap data baru (tab baru / kolom baru) akan dibuat secara otomatis di Google Spreadsheet tanpa perlu mengubah file <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-600 font-bold">Code.gs</code> lagi.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <button
              onClick={async () => {
                showToast('Menguji koneksi ke Google Spreadsheet...');
                const res = await pingSheetDatabase();
                if (res.connected) {
                  showToast(`Koneksi Sukses! Terhubung ke Spreadsheet: "${res.spreadsheetName}"`);
                } else {
                  showToast(`Gagal terhubung: ${res.message}`);
                }
              }}
              className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all group"
            >
              <Database className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-black text-xs uppercase text-slate-900 block">Uji Koneksi (Ping)</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block leading-relaxed">
                Periksa apakah URL Web App Apps Script merespons dengan benar.
              </span>
            </button>

            <button
              onClick={async () => {
                showToast('Menyinkronkan seluruh data ke Google Sheet...');
                const res = await syncAllToGoogleSheet();
                showToast('Sinkronisasi selesai! Seluruh tab & kolom diperbarui.');
              }}
              className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all group"
            >
              <Upload className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-black text-xs uppercase text-slate-900 block">Sinkronkan ke Sheet (Push)</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block leading-relaxed">
                Kirim data tim, nilai juri, dan konfigurasi lokal ke spreadsheet.
              </span>
            </button>

            <button
              onClick={async () => {
                showToast('Mengambil data terbaru dari Google Sheet...');
                const res = await pullFromGoogleSheet();
                if (res && res.success) {
                  showToast('Berhasil memuat data terbaru dari Google Spreadsheet!');
                } else {
                  showToast(`Gagal menarik data: ${res?.error || 'Periksa koneksi internet/URL'}`);
                }
              }}
              className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all group"
            >
              <Download className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-black text-xs uppercase text-slate-900 block">Tarik dari Sheet (Pull)</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block leading-relaxed">
                Ambil pembaruan manual langsung dari Google Spreadsheet ke aplikasi.
              </span>
            </button>
          </div>
        </div>

        {/* Database & Backup Actions */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h3 className="font-black text-lg text-slate-900 uppercase italic border-b border-slate-200 pb-3">
            Cadangan & Pemulihan Basis Data (Backup & Reset)
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <button
              onClick={handleExportJSON}
              className="p-5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all group"
            >
              <Download className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-black text-sm text-slate-900 block">Cadangkan Basis Data (JSON)</span>
              <span className="text-xs text-slate-500 mt-1 block leading-relaxed">
                Ekspor seluruh data pendaftar, nilai juri, dan berkas ke file JSON.
              </span>
            </button>

            <button
              onClick={exportTeamsCSV}
              className="p-5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all group"
            >
              <FileSpreadsheet className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-black text-sm text-slate-900 block">Ekspor Excel / CSV</span>
              <span className="text-xs text-slate-500 mt-1 block leading-relaxed">
                Tabel pendaftar lengkap untuk arsip sekretariat lomba.
              </span>
            </button>

            <button
              onClick={() => {
                if (confirm('PERINGATAN: Seluruh data akan dikembalikan ke data awal simulasi (seed data). Lanjutkan?')) {
                  resetToSeedData();
                  showToast('Database berhasil direset ke data awal!');
                }
              }}
              className="p-5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl text-left transition-all group"
            >
              <RotateCcw className="w-6 h-6 text-rose-600 mb-2 group-hover:rotate-180 transition-transform" />
              <span className="font-black text-sm text-rose-900 block">Reset Basis Data Sistem</span>
              <span className="text-xs text-rose-700/80 mt-1 block leading-relaxed">
                Kembalikan master data sekolah ke konfigurasi awal sistem.
              </span>
            </button>
          </div>
        </div>

        {/* Audit Log / Metrics Overview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <h4 className="font-black text-sm uppercase tracking-wider text-slate-800">
            Statistik Real-Time Sistem
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 uppercase font-bold text-[10px] block">Total Tim Terdaftar</span>
              <span className="text-xl font-mono font-black text-slate-900">{teams.length}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 uppercase font-bold text-[10px] block">Terverifikasi</span>
              <span className="text-xl font-mono font-black text-emerald-600">
                {teams.filter(t => t.status === 'verified').length}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 uppercase font-bold text-[10px] block">Nomor Tampil Terundi</span>
              <span className="text-xl font-mono font-black text-blue-600">
                {teams.filter(t => t.lotNumber).length}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 uppercase font-bold text-[10px] block">Sudah Dinilai Juri</span>
              <span className="text-xl font-mono font-black text-purple-600">
                {Object.keys(scores).length}
              </span>
            </div>
          </div>
        </div>

      </div>
    </SimpaskorSidebarLayout>
  );
}
