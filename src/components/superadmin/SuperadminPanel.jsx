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
  ArrowLeft
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';

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
    pullFromGoogleSheet
  } = useCompetition();

  const [toastMsg, setToastMsg] = useState('');

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
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

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveView('landing')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
          <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
            Superadmin Master Control
          </span>
        </div>

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
    </div>
  );
}
