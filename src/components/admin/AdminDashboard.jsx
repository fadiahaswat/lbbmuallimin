import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  FileSpreadsheet,
  Shuffle,
  Users,
  Eye,
  Trash2,
  Search,
  Filter,
  ArrowUpDown,
  Printer,
  Download,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  DollarSign,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { COMPETITION, EVENT, PAYMENT } from '../../config.js';

export default function AdminDashboard() {
  const {
    teams,
    verifyTeam,
    assignLotNumber,
    randomizeLotNumbers,
    deleteTeam,
    exportTeamsCSV,
    openModal,
    setActiveView
  } = useCompetition();

  const [activeTab, setActiveTab] = useState('verification'); // 'verification' | 'lottery' | 'finance'
  const [selectedJenjang, setSelectedJenjang] = useState('ALL'); // 'ALL' | 'SD' | 'SMP'
  const [selectedStatus, setSelectedStatus] = useState('ALL'); // 'ALL' | 'pending' | 'verified' | 'revision'
  const [searchQuery, setSearchQuery] = useState('');

  // Inspector Modal state
  const [inspectingTeam, setInspectingTeam] = useState(null);
  const [revisionNoteInput, setRevisionNoteInput] = useState('');
  const [showRevisionBox, setShowRevisionBox] = useState(false);

  // Lot assignment state
  const [lotSuccessMsg, setLotSuccessMsg] = useState('');

  // Filtered teams
  const filteredTeams = teams.filter(team => {
    const matchesJenjang = selectedJenjang === 'ALL' || team.jenjang === selectedJenjang;
    const matchesStatus = selectedStatus === 'ALL' || team.status === selectedStatus;
    const matchesSearch =
      team.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.regCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.coachName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesJenjang && matchesStatus && matchesSearch;
  });

  // Statistics
  const countSD = teams.filter(t => t.jenjang === 'SD').length;
  const countSMP = teams.filter(t => t.jenjang === 'SMP').length;
  const verifiedCount = teams.filter(t => t.status === 'verified').length;
  const pendingCount = teams.filter(t => t.status === 'pending').length;
  const revisionCount = teams.filter(t => t.status === 'revision').length;
  const totalRevenue = teams
    .filter(t => t.status === 'verified' || t.paymentStatus === 'paid')
    .reduce((sum, t) => sum + (t.feeAmount || 450000), 0);

  function handleQuickVerify(teamId, status, note = '') {
    verifyTeam(teamId, status, note);
    if (inspectingTeam && inspectingTeam.id === teamId) {
      setInspectingTeam(prev => ({ ...prev, status, revisionNote: note }));
    }
  }

  function handleRandomize(jenjang) {
    const count = randomizeLotNumbers(jenjang);
    setLotSuccessMsg(`Berhasil mengocok ${count} nomor undian untuk jenjang ${jenjang}!`);
    setTimeout(() => setLotSuccessMsg(''), 4000);
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-400 flex items-center justify-center shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-400/20">
                  Panel Sekretariat
                </span>
                <span className="text-xs text-slate-400">Admin Manajemen LBB 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white mt-0.5">
                Dashboard Verifikasi & Undian
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveView('staging')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Staging Lapangan</span>
            </button>
            <button
              onClick={() => setActiveView('juri')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Portal Juri</span>
            </button>
            <button
              onClick={exportTeamsCSV}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-emerald-950/40 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor Data Excel (CSV)</span>
            </button>
            <button
              onClick={() => setActiveView('landing')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Lihat Beranda
            </button>
          </div>
        </div>

        {/* Quota & Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* SD Quota */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Kuota SD / MI</span>
              <span className="text-xs font-black text-red-700 bg-red-50 px-2 py-0.5 rounded">Target 18</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{countSD}</span>
              <span className="text-xs text-slate-400 font-bold">/ 18 Peleton</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-red-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((countSD / 18) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* SMP Quota */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Kuota SMP / MTs</span>
              <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Target 18</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{countSMP}</span>
              <span className="text-xs text-slate-400 font-bold">/ 18 Peleton</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((countSMP / 18) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Pending Verifications */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Perlu Verifikasi</span>
              {pendingCount > 0 && (
                <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded animate-pulse">
                  Baru Masuk
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black font-mono text-amber-600">{pendingCount}</span>
              <span className="text-xs text-slate-400 font-medium">Tim Pending</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {verifiedCount} telah disetujui • {revisionCount} revisi
            </p>
          </div>

          {/* Total Dana Masuk */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Penerimaan Dana</span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">BRI Valid</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">
              Rp{(totalRevenue / 1000).toLocaleString('id-ID')}k
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Akumulasi biaya pendaftaran gelombang 1 & 2
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-white rounded-2xl px-2 py-1.5 shadow-xs overflow-x-auto gap-1">
          {[
            { id: 'verification', label: '1. Verifikasi & Manajemen Peserta', badge: pendingCount > 0 ? pendingCount : null },
            { id: 'lottery', label: '2. Pengundian Nomor Tampil (TM)', badge: 'TM 23 Okt' },
            { id: 'finance', label: '3. Keuangan & Arsip Rekapitulasi' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: VERIFIKASI & PESERTA */}
        {activeTab === 'verification' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {/* Filter Jenjang */}
                <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
                  {['ALL', 'SD', 'SMP'].map(j => (
                    <button
                      key={j}
                      onClick={() => setSelectedJenjang(j)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        selectedJenjang === j ? 'bg-white text-slate-950 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {j === 'ALL' ? 'Semua Jenjang' : j}
                    </button>
                  ))}
                </div>

                {/* Filter Status */}
                <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
                  {[
                    { id: 'ALL', label: 'Semua Status' },
                    { id: 'pending', label: 'Pending' },
                    { id: 'verified', label: 'Terverifikasi' },
                    { id: 'revision', label: 'Revisi' },
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStatus(s.id)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        selectedStatus === s.id ? 'bg-white text-slate-950 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari sekolah / kode / pembina..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Teams Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Kode & Sekolah</th>
                    <th className="p-3.5">Jenjang / Kategori</th>
                    <th className="p-3.5">Danton & Personel</th>
                    <th className="p-3.5">Kelengkapan Berkas</th>
                    <th className="p-3.5">Nomor Undian</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTeams.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400">
                        Tidak ada peserta yang cocok dengan filter yang dipilih.
                      </td>
                    </tr>
                  ) : (
                    filteredTeams.map(team => (
                      <tr key={team.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            {team.files.schoolLogo?.url && team.files.schoolLogo.url !== '#' ? (
                              <img src={team.files.schoolLogo.url} alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-slate-50 border border-slate-200 p-0.5 shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center font-black text-xs shrink-0">
                                {team.jenjang}
                              </div>
                            )}
                            <div>
                              <span className="font-mono font-bold text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                                {team.regCode}
                              </span>
                              <div className="font-black text-slate-900 text-sm mt-0.5">{team.schoolName}</div>
                              <div className="text-slate-500 text-[11px]">{team.platoonName}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="font-bold text-slate-800 block">{team.jenjang}</span>
                          <span className="text-slate-500 text-[11px]">{team.category}</span>
                        </td>

                        <td className="p-3.5">
                          <span className="font-bold text-slate-800 block">{team.roster.danton.name}</span>
                          <span className="text-slate-500 text-[11px]">25 Personel Lengkap</span>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${team.files.recommendationLetter ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Surat Rekomendasi"></span>
                            <span className={`w-2 h-2 rounded-full ${team.files.paymentProof ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Bukti Bayar"></span>
                            <span className={`w-2 h-2 rounded-full ${team.files.personnelPhotos ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Pasfoto"></span>
                            <span className={`w-2 h-2 rounded-full ${team.files.schoolLogo ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Logo Peleton"></span>
                            <span className="text-[10px] text-slate-500 font-medium ml-1">4/4 Dokumen</span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          {team.lotNumber ? (
                            <span className="font-mono font-black text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-lg">
                              #{String(team.lotNumber).padStart(2, '0')}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">Belum diundi</span>
                          )}
                        </td>

                        <td className="p-3.5">
                          {team.status === 'verified' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Sah
                            </span>
                          )}
                          {team.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                              <Clock className="w-3.5 h-3.5" /> Pending
                            </span>
                          )}
                          {team.status === 'revision' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                              <AlertTriangle className="w-3.5 h-3.5" /> Revisi
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setInspectingTeam(team);
                                setRevisionNoteInput(team.revisionNote || '');
                                setShowRevisionBox(false);
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                              title="Periksa Berkas Lengkap"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Periksa</span>
                            </button>

                            {team.status !== 'verified' && (
                              <button
                                onClick={() => handleQuickVerify(team.id, 'verified')}
                                className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition-colors"
                                title="Setujui Cepat (Approve)"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                if (confirm(`Yakin ingin menghapus data ${team.schoolName}?`)) {
                                  deleteTeam(team.id);
                                }
                              }}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors"
                              title="Hapus Peserta"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: PENGUNDIAN NOMOR TAMPIL (TM LOTTERY) */}
        {activeTab === 'lottery' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-black text-xl text-slate-900 uppercase italic">
                  Modul Pengundian Nomor Urut Tampil (Technical Meeting)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sesi pengundian nomor urut tampil peleton terverifikasi untuk Technical Meeting tanggal 23 Oktober 2026.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRandomize('SD')}
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-red-950/20 transition-all"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Kocok Undian SD</span>
                </button>
                <button
                  onClick={() => handleRandomize('SMP')}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-950/20 transition-all"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Kocok Undian SMP</span>
                </button>
              </div>
            </div>

            {lotSuccessMsg && (
              <div className="bg-emerald-600 text-white p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>{lotSuccessMsg}</span>
              </div>
            )}

            {/* 2 Columns: SD & SMP Running Order Tables */}
            <div className="grid lg:grid-cols-2 gap-6">
              {['SD', 'SMP'].map(jenjang => {
                const list = teams
                  .filter(t => t.jenjang === jenjang && t.status === 'verified')
                  .sort((a, b) => (a.lotNumber || 999) - (b.lotNumber || 999));

                return (
                  <div key={jenjang} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                          Urutan Tampil
                        </span>
                        <h4 className="font-black text-lg text-slate-900 uppercase">
                          Jenjang {jenjang === 'SD' ? 'SD / MI' : 'SMP / MTs'}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200">
                        {list.length} Tim Terverifikasi
                      </span>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {list.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-6 text-center">
                          Belum ada tim {jenjang} dengan status terverifikasi.
                        </p>
                      ) : (
                        list.map((t, idx) => (
                          <div
                            key={t.id}
                            className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs hover:border-slate-300 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-900 text-yellow-400 font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                                {t.lotNumber ? String(t.lotNumber).padStart(2, '0') : '-'}
                              </div>
                              <div>
                                <span className="font-black text-slate-900 text-xs block">{t.schoolName}</span>
                                <span className="text-[10px] text-slate-500">
                                  {t.platoonName} • Danton: {t.roster.danton.name}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <input
                                type="number"
                                min={1}
                                max={50}
                                value={t.lotNumber || ''}
                                onChange={e => assignLotNumber(t.id, e.target.value)}
                                placeholder="No"
                                className="w-14 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-center focus:ring-1 focus:ring-blue-600"
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: KEUANGAN */}
        {activeTab === 'finance' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-black text-xl text-slate-900 uppercase italic">
                  Laporan Keuangan & Rekening Pendaftaran
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rekapitulasi penerimaan biaya pendaftaran via Bank BRI Falhan Zuhdi Mubarok.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Laporan</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">Total Dana Masuk</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
                  Rp{totalRevenue.toLocaleString('id-ID')},-
                </span>
                <span className="text-[11px] text-emerald-600 block mt-1">{teams.length} total pendaftar</span>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  {PAYMENT.FEE_TIERS?.[0]?.name || 'Gelombang 1'}
                </span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {teams.filter(t => t.wave === 1).length} Peleton
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  {PAYMENT.FEE_TIERS?.[0]?.label || '21 – 27 September 2026'}
                </span>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  {PAYMENT.FEE_TIERS?.[1]?.name || 'Gelombang 2'}
                </span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {teams.filter(t => t.wave === 2).length} Peleton
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  {PAYMENT.FEE_TIERS?.[1]?.label || '28 September – 5 Oktober 2026'}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* INSPECTION VIEW (PAGE VIEW, NO MODAL OVERLAY) */}
      {inspectingTeam && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col mb-8 animate-in fade-in slide-in-from-top-4 duration-200">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setInspectingTeam(null)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all text-xs font-bold flex items-center gap-2 mr-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Daftar Peleton</span>
              </button>
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                {inspectingTeam.jenjang}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">
                    {inspectingTeam.regCode}
                  </span>
                  <span className="text-xs text-slate-400">Status: <strong className="text-white capitalize">{inspectingTeam.status}</strong></span>
                </div>
                <h3 className="font-black text-lg sm:text-xl text-white mt-0.5">{inspectingTeam.schoolName}</h3>
              </div>
            </div>
            <button
              onClick={() => setInspectingTeam(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
              title="Tutup Pemeriksaan"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Team Data Overview */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Email Akun Portal</span>
                    <span className="font-mono font-bold text-slate-900 truncate block">{inspectingTeam.email || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Tipe Pasukan</span>
                    <span className="font-bold text-slate-900 block">{inspectingTeam.teamType || inspectingTeam.category || 'Homogen'} ({inspectingTeam.jenjang})</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Komandan (Danton)</span>
                    <span className="font-bold text-slate-900 block">{inspectingTeam.dantonName || inspectingTeam.roster?.danton?.name || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Official / Pelatih</span>
                    <span className="font-bold text-slate-900 block">{inspectingTeam.officialName || inspectingTeam.coachName || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Documents Inspection Grid (6 Uploaded Files) */}
              <div>
                <h4 className="font-black text-sm uppercase tracking-wider text-slate-900 mb-3">
                  Kelengkapan 6 Berkas Unggahan Persyaratan
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  
                  {/* 1. Logo Sekolah */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">1. Logo Sekolah</span>
                    <div className="h-28 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden mb-2 p-2">
                      {inspectingTeam.files?.schoolLogo?.url && inspectingTeam.files?.schoolLogo?.url !== '#' ? (
                        <img src={inspectingTeam.files.schoolLogo.url} alt="Logo Sekolah" className="h-full object-contain" />
                      ) : (
                        <span className="text-xs text-slate-400 italic">Belum ada file</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-600 block truncate">{inspectingTeam.files?.schoolLogo?.name || 'Logo_Sekolah'}</span>
                  </div>

                  {/* 2. Kartu Pelajar Komandan */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <span className="text-[10px] font-bold text-blue-700 uppercase block mb-1">2. Kartu Pelajar Danton</span>
                    <div className="h-28 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden mb-2 p-2">
                      {inspectingTeam.files?.dantonCard?.url && inspectingTeam.files?.dantonCard?.url !== '#' ? (
                        <img src={inspectingTeam.files.dantonCard.url} alt="Kartu Pelajar" className="h-full object-contain" />
                      ) : (
                        <span className="text-xs text-slate-400 italic">{inspectingTeam.files?.dantonCard?.name || 'Dokumen Kartu Pelajar'}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-600 block truncate">{inspectingTeam.files?.dantonCard?.name || 'Kartu Pelajar'}</span>
                  </div>

                  {/* 3. KTP Official / Pelatih */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase block mb-1">3. KTP Official / Pelatih</span>
                    <div className="h-28 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden mb-2 p-2">
                      {inspectingTeam.files?.officialKtp?.url && inspectingTeam.files?.officialKtp?.url !== '#' ? (
                        <img src={inspectingTeam.files.officialKtp.url} alt="KTP Official" className="h-full object-contain" />
                      ) : (
                        <span className="text-xs text-slate-400 italic">{inspectingTeam.files?.officialKtp?.name || 'Dokumen KTP'}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-600 block truncate">{inspectingTeam.files?.officialKtp?.name || 'KTP_Official'}</span>
                  </div>

                  {/* 4. Bukti Transfer Pembayaran */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">4. Bukti Pembayaran</span>
                    <div className="h-28 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden mb-2 p-2">
                      {inspectingTeam.files?.paymentProof?.url && inspectingTeam.files?.paymentProof?.url !== '#' ? (
                        <img src={inspectingTeam.files.paymentProof.url} alt="Bukti Transfer" className="h-full object-contain" />
                      ) : (
                        <span className="text-xs text-emerald-700 font-bold">{inspectingTeam.files?.paymentProof?.name || 'Bukti Transfer'}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-600 block truncate">Biaya: Rp{inspectingTeam.feeAmount?.toLocaleString('id-ID')}</span>
                  </div>

                  {/* 5. Foto Selfie Pemohon */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-[10px] font-bold text-slate-700 uppercase">5. Selfie Pemohon</span>
                    </div>
                    <div className="h-28 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden mb-2 p-1">
                      {inspectingTeam.files?.selfie?.url && inspectingTeam.files?.selfie?.url !== '#' ? (
                        <img src={inspectingTeam.files.selfie.url} alt="Foto Selfie Pemohon" className="h-full object-cover rounded" />
                      ) : (
                        <span className="text-xs text-slate-400 italic">{inspectingTeam.files?.selfie?.name || 'Foto Selfie'}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-600 block truncate">{inspectingTeam.files?.selfie?.name || 'Selfie_Pemohon'}</span>
                  </div>

                  {/* 6. Pakta Integritas (Online / Upload) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-[10px] font-bold text-red-700 uppercase">6. Pakta Integritas</span>
                      {inspectingTeam.files?.integrityPact?.type === 'online' && (
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 font-black px-1 rounded">Online TTD</span>
                      )}
                    </div>
                    <div className="h-28 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center overflow-hidden mb-2 p-1">
                      {inspectingTeam.files?.integrityPact?.signatureUrl || (inspectingTeam.files?.integrityPact?.url && inspectingTeam.files?.integrityPact?.url.startsWith('data:image')) ? (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <img src={inspectingTeam.files.integrityPact.signatureUrl || inspectingTeam.files.integrityPact.url} alt="TTD Pakta" className="h-14 object-contain" />
                          <span className="text-[8px] font-mono font-bold text-emerald-700 mt-1">{inspectingTeam.files.integrityPact.signCode || 'TTD Sah'}</span>
                        </div>
                      ) : inspectingTeam.files?.integrityPact?.url && inspectingTeam.files?.integrityPact?.url !== '#' ? (
                        <span className="text-xs text-red-700 font-bold">{inspectingTeam.files.integrityPact.name}</span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Pakta Integritas Sah</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-600 block truncate">{inspectingTeam.files?.integrityPact?.name || 'Pakta Integritas'}</span>
                  </div>

                </div>
              </div>

              {/* Roster Preview */}
              <div>
                <h4 className="font-black text-sm uppercase tracking-wider text-slate-900 mb-2">
                  Komandan Peleton & Susunan Personel
                </h4>
                <div className="p-3 bg-red-50/60 rounded-xl border border-red-200 text-xs flex justify-between items-center mb-3">
                  <div>
                    <span className="font-bold text-red-800">Danton: {inspectingTeam.roster.danton.name}</span>
                    <span className="text-slate-500 text-[10px] ml-2">NISN: {inspectingTeam.roster.danton.nisn} • Kls: {inspectingTeam.roster.danton.class}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-red-700 text-white px-2 py-0.5 rounded">Danton</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[1, 2, 3].map(saf => (
                    <div key={saf} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="font-bold text-[10px] text-slate-500 uppercase block mb-1">Saf {saf} (7 Anggota)</span>
                      <div className="space-y-1">
                        {inspectingTeam.roster.pasukan.filter(p => p.safNumber === saf).map(p => (
                          <div key={p.id} className="text-[11px] truncate text-slate-700">
                            <strong>{p.banjarNumber}.</strong> {p.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revision Box */}
              {showRevisionBox && (
                <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl space-y-2">
                  <label className="block text-xs font-bold text-amber-900 uppercase">
                    Catatan Perbaikan Dokumen untuk Peserta:
                  </label>
                  <textarea
                    rows={2}
                    value={revisionNoteInput}
                    onChange={e => setRevisionNoteInput(e.target.value)}
                    placeholder="Contoh: Bukti transfer buram, mohon unggah ulang screenshot m-Banking yang memuat nomor referensi..."
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowRevisionBox(false)}
                      className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        handleQuickVerify(inspectingTeam.id, 'revision', revisionNoteInput);
                        setShowRevisionBox(false);
                      }}
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-sm"
                    >
                      Kirim Status Revisi
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal('docViewer', { docId: 'form-b', team: inspectingTeam })}
                  className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Form B</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRevisionBox(!showRevisionBox)}
                  className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl transition-colors"
                >
                  Minta Revisi Berkas
                </button>

                <button
                  onClick={() => {
                    handleQuickVerify(inspectingTeam.id, 'verified');
                    setInspectingTeam(null);
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ACC / Setujui Pendaftaran Peleton</span>
                </button>
              </div>
          </div>
        </div>
      )}

    </div>
  );
}
