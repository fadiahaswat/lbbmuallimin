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
  Award,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { COMPETITION, EVENT, PAYMENT } from '../../config.js';
import { formatImageUrl } from '../../services/sheetService.js';

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

  if (inspectingTeam) {
    return (
      <TeamInspectionPage
        team={inspectingTeam}
        onBack={() => setInspectingTeam(null)}
        onVerify={handleQuickVerify}
        openModal={openModal}
        deleteTeam={deleteTeam}
      />
    );
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
                <div className="inline-flex flex-wrap rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold gap-1">
                  {[
                    { id: 'ALL', label: 'Semua Status' },
                    { id: 'pending', label: '1. Pending' },
                    { id: 'registered', label: '2. Terdaftar' },
                    { id: 'revision', label: 'Revisi' },
                    { id: 'verified', label: '3. Terverifikasi Sah' },
                    { id: 'drawn', label: '4. Terundi' },
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
                          <div className="flex items-center gap-3.5">
                            {team.files?.schoolLogo?.url && team.files.schoolLogo.url !== '#' ? (
                              <img
                                src={formatImageUrl(team.files.schoolLogo.url)}
                                alt="Logo"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.style.display = 'none';
                                  if (e.currentTarget.nextElementSibling) {
                                    e.currentTarget.nextElementSibling.style.display = 'flex';
                                  }
                                }}
                                className="w-14 h-14 rounded-xl object-contain bg-white border border-slate-200 p-1 shrink-0 shadow-xs hover:scale-105 transition-transform"
                              />
                            ) : null}
                            <div
                              className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 text-blue-700 border border-slate-200 flex items-center justify-center font-black text-sm shrink-0 shadow-xs"
                              style={{ display: team.files?.schoolLogo?.url && team.files.schoolLogo.url !== '#' ? 'none' : 'flex' }}
                            >
                              {team.jenjang}
                            </div>
                            <div>
                              <span className="font-mono font-bold text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
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
                          <span className="font-bold text-slate-800 block">
                            {team.roster?.danton?.name || team.dantonName || '-'}
                          </span>
                          <span className="text-slate-500 text-[11px]">
                            {team.roster?.pasukan ? `${team.roster.pasukan.length + 1} Personel` : '25 Personel'}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${team.files?.recommendationLetter || team.files?.integrityPact ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Surat Rekomendasi / Pakta Integritas"></span>
                            <span className={`w-2 h-2 rounded-full ${team.files?.paymentProof ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Bukti Bayar"></span>
                            <span className={`w-2 h-2 rounded-full ${team.files?.personnelPhotos || team.files?.dantonCard ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Pasfoto / Kartu Pelajar"></span>
                            <span className={`w-2 h-2 rounded-full ${team.files?.schoolLogo ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Logo Peleton"></span>
                            <span className="text-[10px] text-slate-500 font-medium ml-1">Dokumen</span>
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
                          {team.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                              <Clock className="w-3.5 h-3.5" /> Pending
                            </span>
                          )}
                          {team.status === 'registered' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Terdaftar
                            </span>
                          )}
                          {team.status === 'revision' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                              <AlertTriangle className="w-3.5 h-3.5" /> Revisi
                            </span>
                          )}
                          {team.status === 'verified' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Sah
                            </span>
                          )}
                          {team.status === 'drawn' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                              <Sparkles className="w-3.5 h-3.5" /> Terundi
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

                            {team.status === 'pending' && (
                              <button
                                onClick={() => handleQuickVerify(team.id, 'registered')}
                                className="px-2 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold rounded-lg transition-colors flex items-center gap-1"
                                title="ACC Tahap 1: Daftarkan Tim"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span className="text-[10px]">ACC Daftar</span>
                              </button>
                            )}

                            {(team.status === 'registered' || team.status === 'revision') && (
                              <button
                                onClick={() => handleQuickVerify(team.id, 'verified')}
                                className="px-2 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-lg transition-colors flex items-center gap-1"
                                title="ACC Tahap 2: Verifikasi Sah Peleton"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span className="text-[10px]">ACC Sah</span>
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
                  .filter(t => t.jenjang === jenjang && (t.status === 'verified' || t.status === 'drawn'))
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
                                  {t.platoonName} • Danton: {t.roster?.danton?.name || t.dantonName || '-'}
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
    </div>
  );
}

/**
 * Komponen kartu dokumen berkas dengan fallback anggun (tidak menampilkan broken image icon browser)
 */
function DocumentFileCard({ title, file, number, colorClass = 'text-blue-700', isSignature = false }) {
  const [imgFailed, setImgFailed] = useState(false);

  const rawUrl = isSignature ? (file?.signatureUrl || file?.url) : file?.url;
  const fileName = file?.name || title;
  const hasFile = Boolean(rawUrl && rawUrl !== '#');

  // Cek apakah URL valid untuk di-render langsung sebagai <img>
  const isImageCandidate = hasFile && typeof rawUrl === 'string' && (
    rawUrl.startsWith('data:image') ||
    rawUrl.startsWith('blob:') ||
    rawUrl.startsWith('http://') ||
    rawUrl.startsWith('https://') ||
    rawUrl.includes('drive.google.com')
  );

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[11px] font-bold uppercase ${colorClass}`}>
            {number}. {title}
          </span>
          {file?.type === 'online' && (
            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded">
              Online TTD
            </span>
          )}
        </div>

        <div className="h-32 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center overflow-hidden mb-3 p-2 relative group">
          {hasFile ? (
            isImageCandidate && !imgFailed ? (
              <a
                href={rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Klik untuk membuka file asli di tab baru"
                className="w-full h-full flex items-center justify-center"
              >
                <img
                  src={formatImageUrl(rawUrl)}
                  alt={title}
                  onError={() => setImgFailed(true)}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                />
              </a>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-2 text-slate-500">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 border border-blue-100">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 truncate max-w-[170px]" title={fileName}>
                  {fileName}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                  Berkas Terlampir
                </span>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-2 text-slate-400">
              <AlertTriangle className="w-6 h-6 text-slate-300 mb-1" />
              <span className="text-xs italic">Belum ada berkas</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
        <span className="text-slate-600 font-mono truncate max-w-[140px]" title={fileName}>
          {fileName}
        </span>
        {hasFile && (
          <a
            href={rawUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 text-[11px]"
          >
            <ExternalLink className="w-3 h-3" /> Buka
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * HALAMAN PENUH (DEDICATED FULL PAGE VIEW): DETAIL & VERIFIKASI PELETON
 */
function TeamInspectionPage({ team, onBack, onVerify, openModal, deleteTeam }) {
  const [showRevisionBox, setShowRevisionBox] = useState(false);
  const [revisionNoteInput, setRevisionNoteInput] = useState(team.revisionNote || '');

  const feeFormatted = (team.feeAmount || 450000).toLocaleString('id-ID');
  const danton = team.roster?.danton;
  const pasukan = Array.isArray(team.roster?.pasukan) ? team.roster.pasukan : [];
  const cadangan = Array.isArray(team.roster?.cadangan) ? team.roster.cadangan : [];
  const officials = Array.isArray(team.roster?.officials) ? team.roster.officials : [];

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Breadcrumb & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-5 py-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 font-bold text-slate-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Daftar Peleton</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-400">Verifikasi Berkas</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-none">
              {team.schoolName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal('docViewer', { docId: 'form-b', team })}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              title="Cetak Form B Susunan Personel"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Form B</span>
            </button>

            <button
              onClick={onBack}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
          </div>
        </div>

        {/* Hero Banner Informasi Peleton */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              {team.files?.schoolLogo?.url && team.files.schoolLogo.url !== '#' ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2 border border-white/20 shadow-lg shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={formatImageUrl(team.files.schoolLogo.url)}
                    alt="Logo Sekolah"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-inner shrink-0 border border-blue-400/30">
                  {team.jenjang}
                </div>
              )}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-lg border border-yellow-400/20">
                    {team.regCode}
                  </span>
                  <span className="text-xs bg-slate-800/80 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                    {team.teamType || team.category || 'Homogen'} ({team.jenjang})
                  </span>
                  {team.lotNumber ? (
                    <span className="text-xs bg-amber-400 text-slate-950 font-black px-2.5 py-1 rounded-lg">
                      No. Undian #{String(team.lotNumber).padStart(2, '0')}
                    </span>
                  ) : (
                    <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-lg italic">
                      Belum Diundi
                    </span>
                  )}
                </div>
                <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">
                  {team.schoolName}
                </h1>
                <p className="text-sm text-slate-400">
                  {team.platoonName}
                </p>
              </div>
            </div>

            {/* Status & Quick Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Status:</span>
                {team.status === 'pending' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 bg-amber-950/80 px-3 py-1.5 rounded-xl border border-amber-500/40">
                    <Clock className="w-4 h-4 text-amber-400" /> 1. MENUNGGU VERIFIKASI AWAL (PENDING)
                  </span>
                )}
                {team.status === 'registered' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-blue-400 bg-blue-950/80 px-3 py-1.5 rounded-xl border border-blue-500/40">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" /> 2. TERDAFTAR (PENGISIAN PELETON)
                  </span>
                )}
                {team.status === 'revision' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-rose-400 bg-rose-950/80 px-3 py-1.5 rounded-xl border border-rose-500/40">
                    <AlertTriangle className="w-4 h-4 text-rose-400" /> PERLU REVISI BERKAS
                  </span>
                )}
                {team.status === 'verified' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3. TERVERIFIKASI SAH
                  </span>
                )}
                {team.status === 'drawn' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-purple-400 bg-purple-950/80 px-3 py-1.5 rounded-xl border border-purple-500/40">
                    <Sparkles className="w-4 h-4 text-purple-400" /> 4. TERUNDI (NOMOR #{team.lotNumber})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => setShowRevisionBox(!showRevisionBox)}
                  className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/40 text-xs font-bold rounded-xl transition-all"
                >
                  Minta Revisi
                </button>
                {team.status === 'pending' && (
                  <button
                    onClick={() => onVerify(team.id, 'registered')}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-950/40 hover:scale-105 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> ACC Tahap 1: Daftarkan Tim
                  </button>
                )}
                {(team.status === 'registered' || team.status === 'revision') && (
                  <button
                    onClick={() => onVerify(team.id, 'verified')}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-950/40 hover:scale-105 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> ACC Tahap 2: Verifikasi Sah
                  </button>
                )}
                {(team.status === 'verified' || team.status === 'drawn') && (
                  <button
                    onClick={() => onVerify(team.id, 'registered')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
                  >
                    Batal ACC Sah (Set Terdaftar)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Workflow Stepper */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className={`flex items-center gap-2.5 p-2.5 rounded-xl flex-1 w-full sm:w-auto ${team.status === 'pending' ? 'bg-amber-50 border border-amber-200 text-amber-900 font-extrabold' : 'bg-slate-50 text-slate-600'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${team.status === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'}`}>1</div>
              <div>
                <div className="font-bold">Pendaftaran Awal</div>
                <div className="text-[10px] text-slate-400">Status: Pending</div>
              </div>
            </div>

            <div className="text-slate-300 hidden sm:block">→</div>

            <div className={`flex items-center gap-2.5 p-2.5 rounded-xl flex-1 w-full sm:w-auto ${team.status === 'registered' || team.status === 'revision' ? 'bg-blue-50 border border-blue-200 text-blue-900 font-extrabold' : (['verified', 'drawn'].includes(team.status) ? 'bg-emerald-50/50 text-emerald-800' : 'bg-slate-50 text-slate-600')}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${team.status === 'registered' || team.status === 'revision' ? 'bg-blue-600 text-white' : (['verified', 'drawn'].includes(team.status) ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700')}`}>2</div>
              <div>
                <div className="font-bold">Data Peleton & Surat</div>
                <div className="text-[10px] text-slate-400">Status: Terdaftar</div>
              </div>
            </div>

            <div className="text-slate-300 hidden sm:block">→</div>

            <div className={`flex items-center gap-2.5 p-2.5 rounded-xl flex-1 w-full sm:w-auto ${team.status === 'verified' ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 font-extrabold' : (team.status === 'drawn' ? 'bg-emerald-50/50 text-emerald-800' : 'bg-slate-50 text-slate-600')}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${['verified', 'drawn'].includes(team.status) ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>3</div>
              <div>
                <div className="font-bold">Verifikasi Sah</div>
                <div className="text-[10px] text-slate-400">Status: Sah (Verified)</div>
              </div>
            </div>

            <div className="text-slate-300 hidden sm:block">→</div>

            <div className={`flex items-center gap-2.5 p-2.5 rounded-xl flex-1 w-full sm:w-auto ${team.status === 'drawn' ? 'bg-purple-50 border border-purple-200 text-purple-900 font-extrabold' : 'bg-slate-50 text-slate-600'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${team.status === 'drawn' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-700'}`}>4</div>
              <div>
                <div className="font-bold">Undian Tampil (TM)</div>
                <div className="text-[10px] text-slate-400">Status: Terundi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Box Form Revisi (jika terbuka atau status revision) */}
        {(showRevisionBox || team.status === 'revision') && (
          <div className="bg-amber-50 border border-amber-300 rounded-3xl p-6 shadow-xs space-y-4 animate-in fade-in duration-150">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-950 text-sm">
                    {team.status === 'revision' ? 'Catatan Perbaikan (Revisi) untuk Peserta' : 'Tulis Catatan Perbaikan Berkas untuk Kontingen'}
                  </h4>
                  <p className="text-xs text-amber-800">
                    Catatan ini akan langsung terbaca oleh peserta di portal mereka.
                  </p>
                </div>
              </div>
              {showRevisionBox && (
                <button
                  onClick={() => setShowRevisionBox(false)}
                  className="text-amber-800 hover:text-amber-950 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <textarea
              rows={3}
              value={revisionNoteInput}
              onChange={e => setRevisionNoteInput(e.target.value)}
              placeholder="Contoh: Bukti transfer terpotong, mohon unggah ulang screenshot m-Banking lengkap dengan nomor referensi transaksi..."
              className="w-full p-3 bg-white border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
            />

            {/* Quick Templates */}
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-amber-900 font-bold">Template Cepat:</span>
              <button
                type="button"
                onClick={() => setRevisionNoteInput('Bukti transfer pembayaran buram/tidak terbaca. Mohon unggah ulang screenshot bukti transfer resmi.')}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg transition-colors"
              >
                Bukti Bayar Buram
              </button>
              <button
                type="button"
                onClick={() => setRevisionNoteInput('Kartu Pelajar / Surat Keterangan Danton belum sesuai jenjang. Mohon diperbarui.')}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg transition-colors"
              >
                Kartu Pelajar Danton
              </button>
              <button
                type="button"
                onClick={() => setRevisionNoteInput('Format pakta integritas belum ditandatangani secara sah. Mohon tandatangani online atau unggah ulang.')}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg transition-colors"
              >
                Pakta Integritas
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200">
              <button
                onClick={() => {
                  onVerify(team.id, 'revision', revisionNoteInput);
                  setShowRevisionBox(false);
                }}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Kirim Status Revisi
              </button>
            </div>
          </div>
        )}

        {/* Section 1: Ringkasan Informasi & Kontak Kontingen */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-black text-base uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Informasi Kontingen & Penanggung Jawab
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> Email Akun Portal
              </span>
              <span className="font-mono font-bold text-slate-900 block truncate" title={team.email}>
                {team.email || '-'}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> WhatsApp Official
              </span>
              <span className="font-bold text-slate-900 block">
                {team.waNumber ? (
                  <a
                    href={`https://wa.me/${team.waNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:underline"
                  >
                    {team.waNumber}
                  </a>
                ) : '-'}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Komandan Peleton (Danton)
              </span>
              <span className="font-bold text-slate-900 block truncate">
                {team.dantonName || danton?.name || '-'}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Official / Pembina
              </span>
              <span className="font-bold text-slate-900 block truncate">
                {team.officialName || team.coachName || '-'}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Waktu Mendaftar
              </span>
              <span className="font-bold text-slate-900 block">
                {team.registeredAt ? new Date(team.registeredAt).toLocaleString('id-ID') : '-'}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" /> Gelombang & Biaya
              </span>
              <span className="font-bold text-slate-900 block">
                Gelombang {team.wave || 1} • Rp{feeFormatted}
              </span>
            </div>

            <div className="col-span-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Alamat Pangkalan Sekolah
              </span>
              <span className="font-medium text-slate-800 block truncate" title={team.address}>
                {team.address || 'Yogyakarta, D.I. Yogyakarta'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Kelengkapan 6 Berkas Unggahan Persyaratan */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-black text-base uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Kelengkapan 7 Berkas Unggahan Persyaratan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Periksa keabsahan dokumen persyaratan administrasi sebelum menyetujui pendaftaran dan berkas peleton.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl self-start sm:self-auto">
              Total 7 Berkas
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <DocumentFileCard
              number="1"
              title="Logo Pangkalan / Peleton"
              file={team.files?.schoolLogo}
              colorClass="text-slate-700"
            />
            <DocumentFileCard
              number="2"
              title="Kartu Pelajar Danton"
              file={team.files?.dantonCard}
              colorClass="text-blue-700"
            />
            <DocumentFileCard
              number="3"
              title="KTP Pembina / Official"
              file={team.files?.officialKtp}
              colorClass="text-indigo-700"
            />
            <DocumentFileCard
              number="4"
              title="Bukti Transfer Pendaftaran"
              file={team.files?.paymentProof}
              colorClass="text-emerald-700"
            />
            <DocumentFileCard
              number="5"
              title="Foto Selfie Pemohon"
              file={team.files?.selfie}
              colorClass="text-purple-700"
            />
            <DocumentFileCard
              number="6"
              title="Pakta Integritas Resmi"
              file={team.files?.integrityPact}
              colorClass="text-red-700"
              isSignature={true}
            />
            <DocumentFileCard
              number="7"
              title="Surat Rekomendasi Kepala Sekolah"
              file={team.files?.recommendationLetter}
              colorClass="text-amber-700"
            />
          </div>
        </div>

        {/* Section 3: Susunan 25 Personel Peleton */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-black text-base uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-red-600" />
                Komandan Peleton & Susunan 25 Personel
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Formasi standar: 1 Danton + 21 Pasukan Inti (3 Saf x 7 Banjar) + 3 Cadangan + Official.
              </p>
            </div>
            <button
              onClick={() => openModal('docViewer', { docId: 'form-b', team })}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Form B</span>
            </button>
          </div>

          {/* Danton Card */}
          <div className="p-4 bg-red-50/70 rounded-2xl border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-16 rounded-xl bg-red-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm overflow-hidden border border-red-300">
                {danton?.photo ? (
                  <img src={danton.photo} alt="Danton" className="w-full h-full object-cover" />
                ) : (
                  <span>DANTON</span>
                )}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-red-700 tracking-wider block">
                  Komandan Peleton (Danton)
                </span>
                <h4 className="font-black text-base text-slate-900">
                  {danton?.name || team.dantonName || '-'}
                </h4>
                <p className="text-xs text-slate-500">
                  NISN: <strong className="text-slate-700">{danton?.nisn || '-'}</strong> • Kelas:{' '}
                  <strong className="text-slate-700">{danton?.class ? `Kelas ${danton.class}` : '-'}</strong>
                  {danton?.birthPlace ? ` • TTL: ${danton.birthPlace}${danton.birthDate ? `, ${danton.birthDate}` : ''}` : ''}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold bg-red-100 text-red-800 px-3 py-1 rounded-xl self-start sm:self-center">
              Komandan Utama
            </span>
          </div>

          {/* 21 Pasukan Inti Grid */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-wider text-slate-700 mb-2">
              21 Anggota Pasukan Inti (Saf 1, 2, 3)
            </h4>
            {pasukan.length > 0 ? (
              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                {[1, 2, 3].map(saf => (
                  <div key={saf} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                    <span className="font-bold text-[11px] text-slate-500 uppercase block border-b border-slate-200 pb-1.5 flex items-center justify-between">
                      <span>Saf {saf}</span>
                      <span className="text-[10px] font-normal text-slate-400">7 Personel</span>
                    </span>
                    <div className="space-y-1.5">
                      {pasukan.filter(p => p.safNumber === saf).map(p => (
                        <div key={p.id} className="text-xs bg-white p-2 rounded-xl border border-slate-200/70 flex items-center gap-2">
                          <div className="w-8 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                            {p.photo ? (
                              <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[9px] font-bold text-slate-400">B{p.banjarNumber}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-800 flex items-center justify-between">
                              <span className="truncate">{p.name || '-'}</span>
                              <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-1">B{p.banjarNumber}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              NISN: {p.nisn || '-'} • Kls {p.class || '-'} {p.birthPlace ? `• ${p.birthPlace}` : ''}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-400 italic text-center">
                Daftar susunan anggota pasukan belum diisi secara detail.
              </div>
            )}
          </div>

          {/* Cadangan & Official Grid */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-xs text-slate-700 uppercase block border-b border-slate-200 pb-1">
                3 Personel Cadangan
              </span>
              {cadangan.length > 0 ? (
                cadangan.map((c, i) => (
                  <div key={c.id || i} className="bg-white p-2 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                        {c.photo ? (
                          <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[9px] font-bold text-slate-400">C{i + 1}</span>
                        )}
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-slate-900 block truncate">#{i + 1}. {c.name || '-'}</span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          NISN: {c.nisn || '-'} • Kls {c.class || '-'} {c.birthPlace ? `• ${c.birthPlace}` : ''}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded shrink-0">Cadangan</span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic block">Belum ada personel cadangan</span>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-xs text-slate-700 uppercase block border-b border-slate-200 pb-1">
                Tim Official & Pelatih
              </span>
              {officials.length > 0 ? (
                officials.map((o, i) => (
                  <div key={o.id || i} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 block">{o.name}</span>
                      <span className="text-[10px] text-slate-400">Kontak: {o.phone || '-'}</span>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded capitalize">{o.role || 'Official'}</span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic block">Belum ada data official</span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Sticky Action Toolbar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar</span>
            </button>
            <button
              onClick={() => openModal('docViewer', { docId: 'form-b', team })}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Cetak Form B</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRevisionBox(!showRevisionBox)}
              className="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl transition-colors"
            >
              Minta Revisi Berkas
            </button>

            {team.status === 'pending' && (
              <button
                onClick={() => {
                  onVerify(team.id, 'registered');
                  onBack();
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-blue-950/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ACC Tahap 1: Daftarkan Tim</span>
              </button>
            )}

            {(team.status === 'registered' || team.status === 'revision') && (
              <button
                onClick={() => {
                  onVerify(team.id, 'verified');
                  onBack();
                }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ACC Tahap 2: Verifikasi Sah Peleton</span>
              </button>
            )}

            {(team.status === 'verified' || team.status === 'drawn') && (
              <button
                onClick={() => {
                  onVerify(team.id, 'registered');
                  onBack();
                }}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
              >
                Batal Sah (Kembalikan ke Terdaftar)
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
