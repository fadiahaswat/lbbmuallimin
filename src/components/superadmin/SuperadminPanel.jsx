import React, { useState, useEffect } from 'react';
import { appAlert, appConfirm, appToast } from '../../utils/appDialog.js';
import {
  Shield,
  Award,
  Users,
  RotateCcw,
  Download,
  Upload,
  FileSpreadsheet,
  Trash2,
  Database,
  Calendar,
  Save,
  RefreshCw,
  UserPlus,
  Mail,
  Edit2,
  Check,
  X,
  Lock,
  Plus,
  Minus,
  Sparkles,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

const INDO_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function toDatetimeLocal(isoStr, fallback = '') {
  if (!isoStr) return fallback;
  const m = String(isoStr).match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
  return m ? m[1] : fallback;
}

function toDateOnly(str, fallback = '') {
  if (!str) return fallback;
  const m = String(str).match(/(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  const m2 = String(str).match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (m2) {
    const d = m2[1].padStart(2, '0');
    const mi = INDO_MONTHS.findIndex(x => x.toLowerCase() === m2[2].toLowerCase());
    if (mi !== -1) {
      return `${m2[3]}-${String(mi + 1).padStart(2, '0')}-${d}`;
    }
  }
  return fallback;
}

function formatIndoDate(dateStr, withDay = false, preferAhad = false) {
  if (!dateStr) return '';
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return dateStr;
  const [y, m, d] = parts;
  const dateObj = new Date(y, m - 1, d);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  let day = days[dateObj.getDay()];
  if (preferAhad && day === 'Minggu') day = 'Ahad';
  const month = INDO_MONTHS[m - 1] || '';
  return withDay ? `${day}, ${d} ${month} ${y}` : `${d} ${month} ${y}`;
}

function formatIndoRange(date1, date2) {
  if (!date1 && !date2) return '';
  const d1 = date1 ? date1.slice(0, 10) : '';
  const d2 = date2 ? date2.slice(0, 10) : '';
  if (!d1) return formatIndoDate(d2);
  if (!d2) return formatIndoDate(d1);
  const [y1, m1, day1] = d1.split('-').map(Number);
  const [y2, m2, day2] = d2.split('-').map(Number);
  if (y1 === y2 && m1 === m2) {
    return `${day1} – ${day2} ${INDO_MONTHS[m1 - 1]} ${y1}`;
  }
  if (y1 === y2) {
    return `${day1} ${INDO_MONTHS[m1 - 1]} – ${day2} ${INDO_MONTHS[m2 - 1]} ${y1}`;
  }
  return `${day1} ${INDO_MONTHS[m1 - 1]} ${y1} – ${day2} ${INDO_MONTHS[m2 - 1]} ${y2}`;
}

export default function SuperadminPanel() {
  const {
    teams,
    scores,
    staging,
    settings,
    updateSettings,
    randomizeAllLotNumbers,
    clearAllLotNumbers,
    isLocalhost,
    setActiveView,
    isGoogleSheetConfigured,
    pingSheetDatabase,
    syncAllToGoogleSheet,
    pullFromGoogleSheet,
    users,
    addStaffUser,
    updateStaffUser,
    deleteStaffUser,
    currentUser,
    role,
    openAuthModal
  } = useCompetition();

  const [activeSectionTab, setActiveSectionTab] = useState('staff'); // 'staff' | 'quota' | 'dates' | 'links'

  const userRole = currentUser?.role || role;

  const defaultDates = {
    registrationStart: '2026-10-26T00:00:00+07:00',
    registrationDeadline: '2026-11-22T23:59:59+07:00',
    registrationRangeText: '26 Oktober – 22 November 2026',
    verificationRangeText: '26 Oktober – 22 November 2026',
    technicalMeetingDate: '9 Januari 2027',
    technicalMeetingTime: '13.00 - 16.30 WIB',
    technicalMeetingFullDate: 'Sabtu, 9 Januari 2027',
    technicalMeetingVenue: "Aula Kampus Induk Madrasah Mu'allimin Muhammadiyah Yogyakarta, Jalan Letjen S. Parman No. 68, Wirobrajan, Kota Yogyakarta, Daerah Istimewa Yogyakarta.",
    fieldTrialDate: '16 Januari 2027',
    fieldTrialTime: '07.00 – 13.00 WIB',
    fieldTrialFullDate: 'Sabtu, 16 Januari 2027',
    competitionDate: 'Ahad, 24 Januari 2027',
    competitionTimeRange: '06.00 WIB – 17.00 WIB',
  };

  const [dateForm, setDateForm] = useState(() => ({
    ...defaultDates,
    ...(settings?.eventDates || {}),
  }));

  const [driveForm, setDriveForm] = useState({
    sd: settings?.beritaAcaraUrlSD || '',
    smp: settings?.beritaAcaraUrlSMP || ''
  });

  useEffect(() => {
    setDriveForm({
      sd: settings?.beritaAcaraUrlSD || '',
      smp: settings?.beritaAcaraUrlSMP || ''
    });
  }, [settings?.beritaAcaraUrlSD, settings?.beritaAcaraUrlSMP]);

  const currentCountSD = (teams || []).filter(t => t.jenjang === 'SD' && t.status !== 'rejected').length;
  const currentCountSMP = (teams || []).filter(t => t.jenjang === 'SMP' && t.status !== 'rejected').length;

  const [quotaForm, setQuotaForm] = useState(() => ({
    sd: settings?.quotaSD || 18,
    smp: settings?.quotaSMP || 18,
  }));
  const [quotaError, setQuotaError] = useState('');

  useEffect(() => {
    setQuotaForm({
      sd: settings?.quotaSD || 18,
      smp: settings?.quotaSMP || 18,
    });
  }, [settings?.quotaSD, settings?.quotaSMP]);

  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    email: '',
    role: 'penginput',
    roleLabel: 'Operator Input Nilai',
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '', roleLabel: '' });

  if (userRole !== 'superadmin') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              Akses Ditolak
            </span>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">
              Panel Superadmin Terkunci
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Halaman ini memiliki kewenangan tertinggi dan hanya dapat diakses oleh Akun Resmi Ketua Panitia / IT Master (Superadmin).
            </p>
          </div>
          <div className="space-y-2.5 pt-2 w-full">
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem('lbb_muallimin_active_view_v1', 'landing');
                } catch {}
                setActiveView('landing');
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Kembali ke Beranda
            </button>
            <button
              type="button"
              onClick={() => openAuthModal?.()}
              className="w-full py-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-red-950/40"
            >
              Masuk Akun Superadmin
            </button>
          </div>
        </div>
      </div>
    );
  }

  function handleDateChange(field, value) {
    setDateForm(prev => ({ ...prev, [field]: value }));
  }

  function handleRegStartChange(val) {
    const iso = val ? `${val}:00+07:00` : '';
    const endD = dateForm.registrationDeadline ? dateForm.registrationDeadline.slice(0, 10) : '';
    const startD = val ? val.slice(0, 10) : '';
    const rangeText = (startD && endD) ? formatIndoRange(startD, endD) : dateForm.registrationRangeText;
    setDateForm(prev => ({
      ...prev,
      registrationStart: iso,
      registrationRangeText: rangeText || prev.registrationRangeText,
      verificationRangeText: rangeText || prev.verificationRangeText,
    }));
  }

  function handleRegDeadlineChange(val) {
    const iso = val ? `${val}:59+07:00` : '';
    const startD = dateForm.registrationStart ? dateForm.registrationStart.slice(0, 10) : '';
    const endD = val ? val.slice(0, 10) : '';
    const rangeText = (startD && endD) ? formatIndoRange(startD, endD) : dateForm.registrationRangeText;
    setDateForm(prev => ({
      ...prev,
      registrationDeadline: iso,
      registrationRangeText: rangeText || prev.registrationRangeText,
      verificationRangeText: rangeText || prev.verificationRangeText,
    }));
  }

  function handleTmDateChange(val) {
    setDateForm(prev => ({
      ...prev,
      technicalMeetingDate: formatIndoDate(val, false),
      technicalMeetingFullDate: formatIndoDate(val, true),
    }));
  }

  function handleTrialDateChange(val) {
    setDateForm(prev => ({
      ...prev,
      fieldTrialDate: formatIndoDate(val, false),
      fieldTrialFullDate: formatIndoDate(val, true),
    }));
  }

  function handleCompDateChange(val) {
    setDateForm(prev => ({
      ...prev,
      competitionDate: formatIndoDate(val, true, true),
    }));
  }

  function handleSaveDates(e) {
    e?.preventDefault();
    updateSettings({ eventDates: dateForm });
    appToast('Jadwal & tanggal pelaksanaan berhasil diperbarui!', { variant: 'success' });
  }

  async function handleResetDates() {
    const ok = await appConfirm('Kembalikan jadwal kegiatan ke tanggal standar resmi?', {
      title: 'Reset Jadwal Resmi',
      confirmText: 'Kembalikan',
      variant: 'warning',
    });
    if (ok) {
      setDateForm(defaultDates);
      updateSettings({ eventDates: defaultDates });
      appToast('Jadwal kegiatan dikembalikan ke default resmi!', { variant: 'info' });
    }
  }

  function handleSaveDriveLinks(e) {
    e?.preventDefault();
    updateSettings({
      beritaAcaraUrlSD: driveForm.sd.trim(),
      beritaAcaraUrlSMP: driveForm.smp.trim(),
      beritaAcaraUrl: (driveForm.sd.trim() || driveForm.smp.trim())
    });
    appToast('Link Google Drive Berita Acara berhasil disimpan!', { variant: 'success' });
  }

  function handleSaveQuota(e) {
    if (e) e.preventDefault();
    setQuotaError('');
    const newSD = parseInt(quotaForm.sd, 10);
    const newSMP = parseInt(quotaForm.smp, 10);

    if (isNaN(newSD) || newSD < 1 || isNaN(newSMP) || newSMP < 1) {
      setQuotaError('Kuota peleton harus berupa angka positif (minimal 1).');
      return;
    }
    if (newSD < currentCountSD) {
      setQuotaError(`Kuota SD/MI (${newSD}) tidak boleh lebih kecil dari peleton terdaftar (${currentCountSD}).`);
      return;
    }
    if (newSMP < currentCountSMP) {
      setQuotaError(`Kuota SMP/MTs (${newSMP}) tidak boleh lebih kecil dari peleton terdaftar (${currentCountSMP}).`);
      return;
    }

    updateSettings({ quotaSD: newSD, quotaSMP: newSMP });
    appToast(`Kuota diperbarui: ${newSD} SD & ${newSMP} SMP (Total ${newSD + newSMP} Peleton)`, { variant: 'success' });
  }

  function handleApplyQuotaPreset(sdVal, smpVal, label) {
    setQuotaError('');
    if (sdVal < currentCountSD || smpVal < currentCountSMP) {
      setQuotaError(`Gagal menerapkan preset: peleton terdaftar (${currentCountSD} SD, ${currentCountSMP} SMP) melebihi batas.`);
      return;
    }
    setQuotaForm({ sd: sdVal, smp: smpVal });
    updateSettings({ quotaSD: sdVal, quotaSMP: smpVal });
    appToast(`Kuota diatur ke ${label} (${sdVal} SD & ${smpVal} SMP)`, { variant: 'success' });
  }

  function handleExportJSON() {
    const backupData = {
      exportedAt: new Date().toISOString(),
      settings,
      teams,
      scores,
      staging,
      users,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LBB_Muallimin_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    appToast('Cadangan JSON lengkap (semua tabel) berhasil diunduh!', { variant: 'success' });
  }

  const staffUsers = (users || []).filter(u =>
    ['superadmin', 'admin', 'penginput', 'verifikator', 'finalisator', 'checkin', 'dp', 'juri'].includes(u.role)
  );

  function handleAddStaffSubmit(e) {
    e.preventDefault();
    const res = addStaffUser(newStaffForm);
    if (res.success) {
      appToast(res.message, { variant: 'success' });
      setIsAddStaffModalOpen(false);
      setNewStaffForm({
        name: '',
        email: '',
        role: 'penginput',
        roleLabel: 'Operator Input Nilai',
      });
    } else {
      appAlert(res.message, { title: 'Gagal Menambahkan Petugas', variant: 'warning' });
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
      appToast(res.message, { variant: 'success' });
      setEditingUserId(null);
    } else {
      appAlert(res.message, { title: 'Gagal Menyimpan Perubahan', variant: 'warning' });
    }
  }

  async function handleDeleteStaff(userId, email) {
    const ok = await appConfirm(`Yakin ingin mencabut hak akses petugas untuk email "${email}"?`, {
      title: 'Cabut Hak Akses Petugas',
      confirmText: 'Cabut Akses',
      variant: 'danger',
    });
    if (ok) {
      const res = deleteStaffUser(userId);
      if (res.success) {
        appToast(res.message, { variant: 'info' });
      } else {
        appAlert(res.message, { title: 'Gagal Mencabut Akses', variant: 'warning' });
      }
    }
  }

  const isUclPublished = Boolean(settings.trialSchedulePublished && settings.trialScheduleRatifiedAt);
  const isJuknisPublished = Boolean(settings.juknisPenilaianPublished && settings.juknisPenilaianRatifiedAt);
  const isBasecampPublished = Boolean(settings.basecampPublished && settings.basecampRatifiedAt);

  const switches = [
    {
      id: 'reg',
      label: 'Pendaftaran Peserta',
      desc: 'Formulir pendaftaran daring',
      active: Boolean(settings.registrationOpen),
      onText: 'Terbuka',
      offText: 'Ditutup',
      onToggle: () => {
        const next = !settings.registrationOpen;
        updateSettings({ registrationOpen: next });
        appToast(`Pendaftaran peserta ${next ? 'DIBUKA' : 'DITUTUP'}`, { variant: next ? 'success' : 'info' });
      },
    },
    {
      id: 'scoring',
      label: 'Akses E-Scoring Juri',
      desc: 'Input & edit nilai 3 juri',
      active: Boolean(settings.scoringOpen),
      onText: 'Terbuka',
      offText: 'Terkunci',
      onToggle: () => {
        const next = !settings.scoringOpen;
        updateSettings({ scoringOpen: next });
        appToast(`Akses penilaian juri ${next ? 'DIBUKA' : 'DIKUNCI'}`, { variant: next ? 'success' : 'info' });
      },
    },
    {
      id: 'ucl',
      label: 'Jadwal Uji Coba (UCL)',
      desc: 'Tayangkan jadwal ke peserta',
      active: isUclPublished,
      onText: 'Tayang',
      offText: 'Draf',
      onToggle: () => {
        const next = !isUclPublished;
        updateSettings({
          trialSchedulePublished: next,
          trialScheduleRatifiedAt: next ? new Date().toISOString() : null,
        });
        appToast(`Jadwal UCL ${next ? 'DISAHKAN & TAYANG' : 'KEMBALI KE DRAF'}`, { variant: next ? 'success' : 'info' });
      },
    },
    {
      id: 'juknis',
      label: 'Juknis Penilaian',
      desc: 'Tayangkan Bab penilaian & juara',
      active: isJuknisPublished,
      onText: 'Tayang',
      offText: 'Draf',
      onToggle: () => {
        const next = !isJuknisPublished;
        updateSettings({
          juknisPenilaianPublished: next,
          juknisPenilaianRatifiedAt: next ? new Date().toISOString() : null,
        });
        appToast(`Juknis Penilaian ${next ? 'DISAHKAN & TAYANG' : 'KEMBALI KE DRAF'}`, { variant: next ? 'success' : 'info' });
      },
    },
    {
      id: 'basecamp',
      label: 'Alokasi Basecamp',
      desc: 'Tayangkan denah ruang peserta',
      active: isBasecampPublished,
      onText: 'Tayang',
      offText: 'Draf',
      onToggle: () => {
        const next = !isBasecampPublished;
        updateSettings({
          basecampPublished: next,
          basecampRatifiedAt: next ? new Date().toISOString() : null,
        });
        appToast(`Alokasi Basecamp ${next ? 'DISAHKAN & TAYANG' : 'KEMBALI KE DRAF'}`, { variant: next ? 'success' : 'info' });
      },
    },
    {
      id: 'leaderboard',
      label: 'Publikasi Klasemen Juara',
      desc: 'Buka hasil juara ke publik',
      active: Boolean(settings.announcementPublished),
      onText: 'Publik',
      offText: 'Rahasia',
      onToggle: () => {
        const next = !settings.announcementPublished;
        updateSettings({ announcementPublished: next });
        appToast(`Klasemen Juara ${next ? 'DIPUBLIKASIKAN' : 'DISEMBUNYIKAN'}`, { variant: next ? 'success' : 'info' });
      },
    },
  ];

  return (
    <SimpaskorSidebarLayout
      activeMenu="superadmin"
      title="Master Authority Superadmin"
      subtitle="Saklar operasional lomba, manajemen akun petugas, kuota kontingen & sinkronisasi cloud"
      rightActions={
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={async () => {
              const res = await pingSheetDatabase();
              if (res.connected) {
                appToast(`Terhubung ke Sheet: "${res.spreadsheetName}"`, { variant: 'success' });
              } else {
                appToast(`Koneksi gagal: ${res.message}`, { variant: 'error' });
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Uji Koneksi Google Sheets"
          >
            <span className={`w-2 h-2 rounded-full ${isGoogleSheetConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>Ping Sheet</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              const res = await pullFromGoogleSheet();
              if (res?.success) {
                appToast('Data terbaru berhasil ditarik dari Google Sheet!', { variant: 'success' });
              } else {
                appToast(`Gagal menarik data: ${res?.error || 'Cek koneksi'}`, { variant: 'error' });
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Tarik Data Terbaru dari Google Sheet (Pull)"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Pull</span>
          </button>

          {!isLocalhost && (
            <button
              type="button"
              onClick={async () => {
                await syncAllToGoogleSheet();
                appToast('Seluruh data berhasil disinkronkan ke Google Sheet!', { variant: 'success' });
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Kirim Data ke Google Sheet (Push)"
            >
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>Push</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Unduh Backup Database JSON"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Backup JSON</span>
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* 1. Dark Obsidian Master Switchboard Console (Distinct Dark UI Anchor) */}
        <div className="rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-[0_14px_34px_rgba(15,23,42,0.16)] overflow-hidden">
          <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3 bg-slate-900/50">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Saklar Operasional Lomba
              </span>
              <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                {switches.filter(s => s.active).length}/{switches.length} Aktif
              </span>
            </div>

            {/* Sandbox Localhost Quick Tools (Compact Inline Bar, only on Localhost) */}
            {isLocalhost && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-1 rounded-lg">
                  Sandbox Read-Only
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await appConfirm('Acak nomor dada otomatis untuk semua peleton (simulasi TM selesai)?', {
                      title: 'Simulasi Undi Semua No. Dada',
                      confirmText: 'Undi Semua',
                      variant: 'info',
                    });
                    if (ok) {
                      randomizeAllLotNumbers();
                      appToast('Semua peleton berhasil diberi No. Dada simulasi!', { variant: 'success' });
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold cursor-pointer transition-colors"
                >
                  Simulasi Undi TM
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await appConfirm('Kosongkan kembali seluruh nomor undian peleton di sandbox lokal?', {
                      title: 'Reset Nomor Undian',
                      confirmText: 'Kosongkan',
                      variant: 'warning',
                    });
                    if (ok) {
                      clearAllLotNumbers();
                      appToast('Nomor undian direset kosong!', { variant: 'info' });
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[11px] font-bold cursor-pointer transition-colors"
                >
                  Reset Undian
                </button>
              </div>
            )}
          </div>

          {/* 6 Compact Dark Switch Cells */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-800/80">
            {switches.map(sw => (
              <div
                key={sw.id}
                onClick={sw.onToggle}
                className="bg-slate-950 hover:bg-slate-900/90 px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sw.active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    <span className="text-xs font-extrabold text-white truncate">{sw.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5 pl-3.5">{sw.desc}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-mono font-bold uppercase ${
                    sw.active ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {sw.active ? sw.onText : sw.offText}
                  </span>
                  <button
                    type="button"
                    aria-label={sw.label}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
                      sw.active ? 'bg-emerald-500 justify-end' : 'bg-slate-800 border border-slate-700 justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-xs block" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Unified Tabbed Workspace Card (Petugas | Kuota | Jadwal | Tautan Berita Acara) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          {/* Flush Underline Section Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 bg-slate-50/70">
            {[
              { id: 'staff', label: 'Akun & Role Petugas', badge: staffUsers.length, icon: Shield },
              { id: 'quota', label: 'Kuota Kontingen', badge: `${quotaForm.sd}/${quotaForm.smp}`, icon: Users },
              { id: 'dates', label: 'Jadwal & Lini Masa', badge: '6 Tahap', icon: Calendar },
              { id: 'links', label: 'Tautan Berita Acara', badge: 'Drive', icon: ExternalLink },
            ].map((t, idx) => {
              const Icon = t.icon;
              const isActive = activeSectionTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveSectionTab(t.id)}
                  className={`relative py-3 px-3 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    idx < 3 ? 'border-r border-slate-200/80' : ''
                  } ${
                    isActive
                      ? 'bg-white text-slate-950 font-extrabold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/60 font-semibold'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span className="truncate">{t.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold leading-none ${
                    isActive ? 'bg-slate-900 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {t.badge}
                  </span>
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950" />}
                </button>
              );
            })}
          </div>

          {/* TAB 1: AKUN & ROLE PETUGAS */}
          {activeSectionTab === 'staff' && (
            <div>
              <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs sm:text-sm font-black uppercase text-slate-900">
                    Daftar Email &amp; Wewenang Petugas Resmi
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Hanya email Google di bawah ini yang diizinkan mengakses portal panitia &amp; juri.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddStaffModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Tambah Petugas</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4">Petugas</th>
                      <th className="py-3 px-4">Email Google</th>
                      <th className="py-3 px-4 text-center">Role</th>
                      <th className="py-3 px-4">Label Tugas</th>
                      <th className="py-3 px-4 text-center w-24">Aksi</th>
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
                                  className="w-7 h-7 rounded-full border border-slate-200 object-cover shrink-0"
                                />
                                <span className="font-bold text-slate-900">{user.name}</span>
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
                                <span className="font-mono font-semibold text-slate-700">{user.email}</span>
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4 text-center">
                            {isEditingThis ? (
                              <select
                                value={editForm.role}
                                onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                              >
                                <option value="penginput">Penginput Nilai</option>
                                <option value="verifikator">Verifikator Nilai</option>
                                <option value="finalisator">Finalisator (Ketua Juri)</option>
                                <option value="checkin">Petugas Basecamp</option>
                                <option value="dp">Petugas DP 1</option>
                                <option value="juri">Dewan Juri</option>
                                <option value="admin">Admin Sekretariat</option>
                                <option value="superadmin">Superadmin</option>
                              </select>
                            ) : (
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center border ${
                                user.role === 'superadmin' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                user.role === 'admin' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                user.role === 'penginput' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                user.role === 'verifikator' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                user.role === 'finalisator' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                'bg-slate-100 text-slate-700 border-slate-200'
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
                              <span className="text-slate-600">{user.roleLabel || '—'}</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-center">
                            {isEditingThis ? (
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleSaveEditStaff(user.id)}
                                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                  title="Simpan"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingUserId(null)}
                                  className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
                                  title="Batal"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditStaff(user)}
                                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                {!isPrimarySuperadmin && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteStaff(user.id, user.email)}
                                    className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                                    title="Hapus"
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
          )}

          {/* TAB 2: KUOTA KONTINGEN */}
          {activeSectionTab === 'quota' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-xs sm:text-sm font-black uppercase text-slate-900">
                    Batas Kuota Peleton SD/MI &amp; SMP/MTs
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pendaftaran otomatis terkunci saat jumlah peleton mencapai target kuota.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleApplyQuotaPreset(18, 18, 'Standar 18/18')}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Standar (18/18)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyQuotaPreset(21, 21, 'Ekspansi 21/21')}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ekspansi (21/21)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveQuota}
                    className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Kuota</span>
                  </button>
                </div>
              </div>

              {quotaError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                  {quotaError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SD */}
                <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600" />
                      <span className="text-xs font-black uppercase text-slate-900">Tingkat SD / MI</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Terdaftar: <strong className="font-mono text-slate-900">{currentCountSD}</strong> · Sisa:{' '}
                      <strong className="font-mono text-emerald-600">
                        {Math.max(0, (parseInt(quotaForm.sd, 10) || 0) - currentCountSD)}
                      </strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={parseInt(quotaForm.sd, 10) <= currentCountSD}
                      onClick={() => setQuotaForm(prev => ({ ...prev, sd: Math.max(currentCountSD, (parseInt(prev.sd, 10) || 0) - 1) }))}
                      className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center text-slate-700 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min={currentCountSD || 1}
                      max={100}
                      value={quotaForm.sd}
                      onChange={e => setQuotaForm(prev => ({ ...prev, sd: e.target.value }))}
                      className="w-16 h-9 text-center font-mono font-black text-base rounded-xl border border-slate-200 bg-white text-slate-950"
                    />
                    <button
                      type="button"
                      onClick={() => setQuotaForm(prev => ({ ...prev, sd: (parseInt(prev.sd, 10) || 0) + 1 }))}
                      className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* SMP */}
                <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span className="text-xs font-black uppercase text-slate-900">Tingkat SMP / MTs</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Terdaftar: <strong className="font-mono text-slate-900">{currentCountSMP}</strong> · Sisa:{' '}
                      <strong className="font-mono text-emerald-600">
                        {Math.max(0, (parseInt(quotaForm.smp, 10) || 0) - currentCountSMP)}
                      </strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={parseInt(quotaForm.smp, 10) <= currentCountSMP}
                      onClick={() => setQuotaForm(prev => ({ ...prev, smp: Math.max(currentCountSMP, (parseInt(prev.smp, 10) || 0) - 1) }))}
                      className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center text-slate-700 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min={currentCountSMP || 1}
                      max={100}
                      value={quotaForm.smp}
                      onChange={e => setQuotaForm(prev => ({ ...prev, smp: e.target.value }))}
                      className="w-16 h-9 text-center font-mono font-black text-base rounded-xl border border-slate-200 bg-white text-slate-950"
                    />
                    <button
                      type="button"
                      onClick={() => setQuotaForm(prev => ({ ...prev, smp: (parseInt(prev.smp, 10) || 0) + 1 }))}
                      className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JADWAL & LINI MASA (RINGKAS, TANPA INPUT DUPLIKAT) */}
          {activeSectionTab === 'dates' && (
            <form onSubmit={handleSaveDates} className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-xs sm:text-sm font-black uppercase text-slate-900">
                    Jadwal &amp; Tanggal Pelaksanaan Resmi
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Label hari &amp; rentang tanggal diperbarui otomatis mengikuti tanggal yang dipilih.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetDates}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Default</span>
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Jadwal</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* 1. Pembukaan Pendaftaran */}
                <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">1. Pembukaan Pendaftaran</span>
                    <span className="text-[10px] font-mono text-slate-400">{dateForm.registrationRangeText}</span>
                  </div>
                  <input
                    type="datetime-local"
                    value={toDatetimeLocal(dateForm.registrationStart, '2026-10-26T00:00')}
                    onChange={e => handleRegStartChange(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-900"
                  />
                </div>

                {/* 2. Penutupan Pendaftaran */}
                <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">2. Penutupan Pendaftaran</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Auto-Close</span>
                  </div>
                  <input
                    type="datetime-local"
                    value={toDatetimeLocal(dateForm.registrationDeadline, '2026-11-22T23:59')}
                    onChange={e => handleRegDeadlineChange(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-900"
                  />
                </div>

                {/* 3. Rentang Verifikasi */}
                <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">3. Verifikasi Berkas</span>
                    <button
                      type="button"
                      onClick={() => handleDateChange('verificationRangeText', dateForm.registrationRangeText)}
                      className="text-[10px] text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      Samakan
                    </button>
                  </div>
                  <input
                    type="text"
                    value={dateForm.verificationRangeText}
                    onChange={e => handleDateChange('verificationRangeText', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-900"
                  />
                </div>

                {/* 4. Technical Meeting */}
                <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">4. Technical Meeting</span>
                    <span className="text-[10px] font-mono text-slate-500">{dateForm.technicalMeetingFullDate}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={toDateOnly(dateForm.technicalMeetingDate, '2027-01-09')}
                      onChange={e => handleTmDateChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-900"
                    />
                    <input
                      type="text"
                      value={dateForm.technicalMeetingTime}
                      onChange={e => handleDateChange('technicalMeetingTime', e.target.value)}
                      placeholder="13.00 - 16.30 WIB"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                {/* 5. Uji Coba Lapangan */}
                <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">5. Uji Coba Lapangan</span>
                    <span className="text-[10px] font-mono text-slate-500">{dateForm.fieldTrialFullDate}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={toDateOnly(dateForm.fieldTrialDate, '2027-01-16')}
                      onChange={e => handleTrialDateChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-900"
                    />
                    <input
                      type="text"
                      value={dateForm.fieldTrialTime}
                      onChange={e => handleDateChange('fieldTrialTime', e.target.value)}
                      placeholder="07.00 – 13.00 WIB"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                {/* 6. Hari Pelaksanaan Lomba */}
                <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">6. Hari-H Perlombaan</span>
                    <span className="text-[10px] font-mono font-bold text-rose-600">{dateForm.competitionDate}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={toDateOnly(dateForm.competitionDate, '2027-01-24')}
                      onChange={e => handleCompDateChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-900"
                    />
                    <input
                      type="text"
                      value={dateForm.competitionTimeRange}
                      onChange={e => handleDateChange('competitionTimeRange', e.target.value)}
                      placeholder="06.00 – 17.00 WIB"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* TAB 4: TAUTAN BERITA ACARA DRIVE */}
          {activeSectionTab === 'links' && (
            <form onSubmit={handleSaveDriveLinks} className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-xs sm:text-sm font-black uppercase text-slate-900">
                    Link Google Drive Berita Acara Resmi
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tautan unduhan untuk tombol &quot;Berita Acara&quot; di halaman Papan Klasemen publik.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Tautan</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Link Berita Acara SD / MI (Google Drive)
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    value={driveForm.sd}
                    onChange={e => setDriveForm(prev => ({ ...prev, sd: e.target.value }))}
                    className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 focus:border-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Link Berita Acara SMP / MTs (Google Drive)
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    value={driveForm.smp}
                    onChange={e => setDriveForm(prev => ({ ...prev, smp: e.target.value }))}
                    className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 focus:border-slate-900 outline-none"
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Modal Tambah Email Petugas Baru */}
        {isAddStaffModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 uppercase">Tambah Petugas Resmi</h4>
                    <p className="text-[11px] text-slate-500">Daftarkan email Google panitia atau juri</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddStaffSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Petugas</label>
                  <input
                    type="text"
                    required
                    value={newStaffForm.name}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alamat Email Google</label>
                  <input
                    type="email"
                    required
                    value={newStaffForm.email}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="budi.lbb@gmail.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role / Wewenang</label>
                  <select
                    value={newStaffForm.role}
                    onChange={e => {
                      const r = e.target.value;
                      const labels = {
                        penginput: 'Operator Input Nilai',
                        verifikator: 'Verifikator & Audit Nilai',
                        finalisator: 'Finalisator & Pengesah Rekap Nilai',
                        checkin: 'Petugas Basecamp (Check-In & Check-Out)',
                        dp: 'Petugas Daerah Persiapan (DP 1)',
                        juri: 'Dewan Juri Lapangan',
                        admin: 'Admin Sekretariat',
                        superadmin: 'Superadmin Pelaksana',
                      };
                      setNewStaffForm(prev => ({ ...prev, role: r, roleLabel: labels[r] || '' }));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900"
                  >
                    <option value="penginput">Penginput Nilai</option>
                    <option value="verifikator">Verifikator Nilai</option>
                    <option value="finalisator">Finalisator (Ketua Dewan Juri)</option>
                    <option value="checkin">Petugas Basecamp (Check-In/Out)</option>
                    <option value="dp">Petugas Daerah Persiapan (DP 1)</option>
                    <option value="juri">Dewan Juri</option>
                    <option value="admin">Admin Sekretariat</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Label Tugas</label>
                  <input
                    type="text"
                    value={newStaffForm.roleLabel}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, roleLabel: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddStaffModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-600 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SimpaskorSidebarLayout>
  );
}
