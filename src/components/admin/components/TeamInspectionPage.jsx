import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Printer,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  X,
  Users,
  Trophy,
  Tag,
  Home,
  Mail,
  Phone,
  Award,
  User,
  Calendar,
  DollarSign,
  MapPin,
  FileText
} from 'lucide-react';
import { checkTeamVerificationEligibility } from '../../../context/CompetitionContext.jsx';
import { formatImageUrl, getFallbackImageUrl } from '../../../services/sheetService.js';
import DocumentFileCard from '../components/DocumentFileCard.jsx';

export default function TeamInspectionPage({ team, inspectionStage = 'registration', onBack, onVerify, openModal, deleteTeam }) {
  const [currentStageTab, setCurrentStageTab] = useState(inspectionStage); // 'registration' | 'verification'
  const [showRevisionBox, setShowRevisionBox] = useState(false);
  const [revisionNoteInput, setRevisionNoteInput] = useState(team.revisionNote || '');

  const feeFormatted = (team.feeAmount || 450000).toLocaleString('id-ID');
  const danton = team.roster?.danton;
  const pasukan = Array.isArray(team.roster?.pasukan) ? team.roster.pasukan : [];
  const cadangan = Array.isArray(team.roster?.cadangan) ? team.roster.cadangan : [];
  const officials = Array.isArray(team.roster?.officials) ? team.roster.officials : [];

  const eligibility = checkTeamVerificationEligibility(team);

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Breadcrumb & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-5 py-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 font-bold text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Daftar Peleton</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-400">
              {currentStageTab === 'registration' ? '1. Cek Berkas Pendaftaran' : '2. Cek Biodata Peleton & Surat'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-none">
              {team.schoolName}
            </span>
          </div>

          {/* Tab Switcher inside inspection */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setCurrentStageTab('registration')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentStageTab === 'registration' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Berkas Pendaftaran
            </button>
            <button
              onClick={() => setCurrentStageTab('verification')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentStageTab === 'verification' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Biodata Peleton (25) & Rekomendasi
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal('docViewer', { docId: 'form-b', team })}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Cetak Form B Susunan Personel"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Form B</span>
            </button>

            <button
              onClick={onBack}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
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
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const fallback = getFallbackImageUrl(team.files.schoolLogo.url);
                      if (fallback && e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      } else {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }
                      }
                    }}
                    className="w-full h-full object-contain"
                  />
                  <div
                    className="w-full h-full bg-blue-600 text-white items-center justify-center font-black text-xl rounded-xl hidden"
                  >
                    {team.jenjang}
                  </div>
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
                    <Sparkles className="w-4 h-4 text-purple-400" /> 4. SIAP TAMPIL (TERUNDI)
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
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-950/40 hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> ACC Tahap 1: Daftarkan Tim
                  </button>
                )}
                {(team.status === 'registered' || team.status === 'revision') && (
                  <button
                    onClick={() => {
                      if (!eligibility.isEligible) {
                        alert(`Peleton belum dapat diverifikasi sah karena:\n\n• ${eligibility.issues.join('\n• ')}`);
                        return;
                      }
                      onVerify(team.id, 'verified');
                    }}
                    className={`px-5 py-2 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 ${
                      eligibility.isEligible
                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/40 hover:scale-105 cursor-pointer'
                        : 'bg-slate-700 text-slate-400 opacity-60 cursor-not-allowed'
                    }`}
                    title={
                      eligibility.isEligible
                        ? 'ACC Tahap 2: Peleton Sah'
                        : `Belum memenuhi syarat verifikasi:\n- ${eligibility.issues.join('\n- ')}`
                    }
                  >
                    <CheckCircle2 className="w-4 h-4" /> ACC Tahap 2: Verifikasi Sah
                  </button>
                )}
                {(team.status === 'verified' || team.status === 'drawn') && (
                  <button
                    onClick={() => onVerify(team.id, 'registered')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
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

        {/* Banner Peringatan Kelayakan Verifikasi Sah (Tahap 2) */}
        {(team.status === 'registered' || team.status === 'revision') && !eligibility.isEligible && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2.5 text-amber-900 font-black text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Belum Memenuhi Syarat Verifikasi Sah (Tahap 2)</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Peleton belum dapat di-ACC Sah karena syarat wajib berikut belum dipenuhi:
            </p>
            <ul className="list-disc list-inside text-xs text-amber-900 font-semibold space-y-1 pl-1">
              {eligibility.issues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
            <p className="text-[11px] text-amber-700 italic pt-1">
              *Catatan: 3 Anggota cadangan bersifat opsional dan tidak menghalangi verifikasi.
            </p>
          </div>
        )}

        {/* Box Form Revisi */}
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
                className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg transition-colors cursor-pointer"
              >
                Bukti Bayar Buram
              </button>
              <button
                type="button"
                onClick={() => setRevisionNoteInput('Kartu Pelajar / Surat Keterangan Danton belum sesuai jenjang. Mohon diperbarui.')}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg transition-colors cursor-pointer"
              >
                Kartu Pelajar Danton
              </button>
              <button
                type="button"
                onClick={() => setRevisionNoteInput('Format pakta integritas belum ditandatangani secara sah. Mohon tandatangani online atau unggah ulang.')}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg transition-colors cursor-pointer"
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
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Kirim Status Revisi
              </button>
            </div>
          </div>
        )}

        {/* Section 1: Ringkasan Informasi & Kontak Kontingen */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg uppercase tracking-tight text-slate-900">
                  Informasi Kontingen & Penanggung Jawab
                </h3>
                <p className="text-xs text-slate-500">
                  Data narahubung resmi, status operasional pangkalan, dan jadwal tampil peleton.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Jenjang {team.jenjang || '-'}
              </span>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                {team.teamType || 'Reguler'}
              </span>
            </div>
          </div>

          {/* 4 Highlight Cards: Operasional Hari-H */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 relative overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider">
                  No. Urut Tampil (TM)
                </span>
                <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
              </div>
              <span className="font-mono font-black text-xl text-amber-950 block">
                {team.lotNumber ? `#${String(team.lotNumber).padStart(2, '0')}` : 'Belum diundi'}
              </span>
              <span className="text-[10px] text-amber-700 font-medium block mt-1">
                {team.lotNumber ? 'Undian Resmi TM' : 'Menunggu hasil kocokan TM'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-300/80 relative overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                  Nomor Dada Lapangan
                </span>
                <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
              <span className="font-mono font-black text-xl text-emerald-950 block">
                {team.chestNumber || '-'}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium block mt-1">
                {team.chestNumber ? 'Terverifikasi aktif' : 'Diserahkan saat registrasi ulang'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-300/80 relative overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider">
                  Jam Estimasi Tampil
                </span>
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              </div>
              <span className="font-mono font-black text-xl text-blue-950 block">
                {team.estimatedTime ? `${team.estimatedTime} WIB` : '-'}
              </span>
              <span className="text-[10px] text-blue-700 font-medium block mt-1">
                {team.estimatedTime ? 'Arena Perlombaan Utama' : 'Ditentukan setelah TM'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-300/80 relative overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black text-purple-800 uppercase tracking-wider">
                  Nomor Basecamp
                </span>
                <Home className="w-4 h-4 text-purple-600 shrink-0" />
              </div>
              <span className="font-mono font-black text-xl text-purple-950 block">
                {team.basecampNumber ? `Ruang ${team.basecampNumber}` : '-'}
              </span>
              <span className="text-[10px] text-purple-700 font-medium block mt-1">
                {team.basecampNumber ? 'Ruang transit kontingen' : 'Alokasi ruang saat hari-H'}
              </span>
            </div>
          </div>

          {/* Grid Informasi Detail Narahubung & Administrasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
            <div className="p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/80 transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" /> Email Akun Portal
              </span>
              <span className="font-mono font-bold text-slate-900 block truncate text-xs" title={team.email}>
                {team.email || '-'}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Akun Google Peserta</span>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/80 transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Official
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-black text-slate-900 text-xs">
                  {team.waNumber || '-'}
                </span>
                {team.waNumber && (
                  <a
                    href={`https://wa.me/${String(team.waNumber).replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-xs transition-colors"
                  >
                    Chat WA
                  </a>
                )}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Narahubung Utama</span>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/80 transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-red-600" /> Komandan Peleton (Danton)
              </span>
              <span className="font-black text-slate-900 block truncate text-xs">
                {team.dantonName || danton?.name || '-'}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Komandan Utama Peleton</span>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/80 transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" /> Official / Pembina
              </span>
              <span className="font-black text-slate-900 block truncate text-xs">
                {team.officialName || team.coachName || '-'}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Penanggung Jawab Kontingen</span>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/80 transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-600" /> Waktu Mendaftar
              </span>
              <span className="font-bold text-slate-900 block text-xs">
                {team.registeredAt ? new Date(team.registeredAt).toLocaleString('id-ID') : '-'}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Timestamp Pendaftaran</span>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/80 transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Gelombang & Biaya
              </span>
              <span className="font-black text-slate-900 block text-xs">
                Gelombang {team.wave || 1} • Rp{feeFormatted}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
                {team.paymentStatus === 'paid' ? 'Lunas Terverifikasi' : 'Tahap Verifikasi'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/80 transition-colors md:col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600" /> Alamat Pangkalan Sekolah
              </span>
              <span className="font-medium text-slate-800 block text-xs leading-relaxed" title={team.address}>
                {team.address || 'Yogyakarta, D.I. Yogyakarta'}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Domisili Resmi Pangkalan</span>
            </div>
          </div>
        </div>

        {/* Tab 1: Section 2: Kelengkapan 6 Berkas Unggahan Persyaratan */}
        {(currentStageTab === 'registration' || currentStageTab === 'all') && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-base uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Kelengkapan 6 Berkas Unggahan Persyaratan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Periksa keabsahan dokumen persyaratan administrasi sebelum menyetujui pendaftaran dan berkas peleton.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl self-start sm:self-auto">
                Total 6 Berkas
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
                title="Pakta Integritas Resmi"
                file={team.files?.integrityPact}
                colorClass="text-red-700"
                isSignature={true}
              />
              <DocumentFileCard
                number="6"
                title="Surat Rekomendasi Kepala Sekolah"
                file={team.files?.recommendationLetter}
                colorClass="text-amber-700"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Section 3: Susunan 25 Personel Peleton */}
        {(currentStageTab === 'verification' || currentStageTab === 'all') && (
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
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Form B</span>
              </button>
            </div>

            {/* Top Grid: Danton (Kiri) & Pendamping Peleton (Kanan) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Danton Hero Card (lg:col-span-5) */}
              <div className="lg:col-span-5 p-5 bg-gradient-to-b from-red-50/80 via-white to-slate-50 rounded-3xl border border-red-200/90 shadow-xs flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="aspect-[3/4] w-32 sm:w-36 rounded-2xl overflow-hidden bg-red-900 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md border-2 border-red-300 relative group">
                    {danton?.photo && typeof danton.photo === 'string' && danton.photo !== '#' && !danton.photo.startsWith('#') && !danton.photo.includes('drive.google.com/open?id=') ? (
                      <img
                        src={formatImageUrl(danton.photo)}
                        alt="Danton"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const fallback = getFallbackImageUrl(danton.photo);
                          if (fallback && e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback;
                          } else {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full flex flex-col items-center justify-center font-black text-xs text-white/90 bg-gradient-to-b from-red-800 to-red-950 p-2 text-center"
                      style={{
                        display: danton?.photo && typeof danton.photo === 'string' && danton.photo !== '#' && !danton.photo.startsWith('#') && !danton.photo.includes('drive.google.com/open?id=') ? 'none' : 'flex'
                      }}
                    >
                      <User className="w-8 h-8 mb-1 text-red-200 opacity-90" />
                      <span className="font-mono text-xs tracking-wider">DANTON</span>
                    </div>
                    <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-red-700 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                      Danton
                    </span>
                  </div>

                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                      <span className="text-[10px] font-black uppercase text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full">
                        Komandan Utama
                      </span>
                    </div>

                    <h4 className="font-black text-lg text-slate-900 tracking-tight break-words" title={danton?.name || team.dantonName}>
                      {danton?.name || team.dantonName || '-'}
                    </h4>

                    <div className="space-y-1 text-xs pt-1">
                      <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">TTL:</span>
                        <span className="font-medium text-slate-800 text-[11px] truncate max-w-[180px]" title={danton?.birthPlace ? `${danton.birthPlace}${danton.birthDate ? `, ${danton.birthDate}` : ''}` : '-'}>
                          {danton?.birthPlace ? `${danton.birthPlace}${danton.birthDate ? `, ${danton.birthDate}` : ''}` : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Kelas:</span>
                        <span className="font-bold text-slate-900">{danton?.class ? `Kelas ${danton.class}` : '-'}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">NISN:</span>
                        <span className="font-mono font-bold text-slate-900">{danton?.nisn || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Pendamping Peleton (lg:col-span-7) */}
              <div className="lg:col-span-7 bg-slate-50 p-5 rounded-3xl border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-slate-800 uppercase tracking-wider">
                      Pendamping Peleton (3 Orang)
                    </span>
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                      1 Official + 2 Pendukung
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                    3 Cocard
                  </span>
                </div>

                {officials.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {officials.map((o, i) => {
                      const hasOPhoto = o.photo && typeof o.photo === 'string' && o.photo !== '#' && !o.photo.startsWith('#') && !o.photo.includes('drive.google.com/open?id=');
                      const isMainOfficial = i === 0 || o.category === 'official';
                      const defaultRoleTitle = isMainOfficial
                        ? 'Official (Pelatih / Pembina)'
                        : `Pendukung ${i} (Medis / Dokum)`;
                      const displayRole = o.role && o.role !== '-' ? o.role : defaultRoleTitle;

                      return (
                        <div key={o.id || i} className={`group/off bg-white rounded-2xl border shadow-2xs overflow-hidden flex flex-col justify-between ${
                          isMainOfficial ? 'border-blue-300 ring-1 ring-blue-200' : 'border-slate-200'
                        }`}>
                          <div className="aspect-[3/4] w-full bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                            {hasOPhoto ? (
                              <img
                                src={formatImageUrl(o.photo)}
                                alt={o.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/off:scale-105"
                                onError={(e) => {
                                  const fallback = getFallbackImageUrl(o.photo);
                                  if (fallback && e.currentTarget.src !== fallback) {
                                    e.currentTarget.src = fallback;
                                  } else {
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.nextElementSibling) {
                                      e.currentTarget.nextElementSibling.style.display = 'flex';
                                    }
                                  }
                                }}
                              />
                            ) : null}
                            <div
                              className="w-full h-full flex flex-col items-center justify-center text-[9px] font-bold text-slate-400 bg-slate-100"
                              style={{ display: hasOPhoto ? 'none' : 'flex' }}
                            >
                              <User className="w-6 h-6 opacity-40 mb-1" />
                              <span>{isMainOfficial ? 'OFFICIAL' : `CREW ${i}`}</span>
                            </div>
                            <span className={`absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold shadow-xs truncate max-w-[90%] ${
                              isMainOfficial ? 'bg-blue-600 text-white' : 'bg-slate-700 text-white'
                            }`} title={displayRole}>
                              {displayRole}
                            </span>
                          </div>

                          <div className="p-2 text-left space-y-0.5">
                            <span className="font-bold text-xs text-slate-900 block truncate" title={o.name}>
                              {o.name || '-'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono block truncate">
                              WA: {o.phone || '-'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic block py-4 text-center">Belum ada data pendamping</span>
                )}
              </div>
            </div>

            {/* 21 Pasukan Inti Grid - Saf 1, 2, 3 */}
            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="font-black text-sm uppercase tracking-wider text-slate-800">
                  21 Anggota Pasukan Inti (Saf 1, 2, 3 &bull; 3 Saf × 7 Banjar)
                </h4>
                <span className="text-xs font-bold text-slate-500">
                  Foto Pasfoto & Identitas Personel
                </span>
              </div>

              {pasukan.length > 0 ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(saf => (
                    <div key={saf} className="bg-slate-50/80 p-4 sm:p-5 rounded-3xl border border-slate-200/90 space-y-3.5">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                          <span className="font-black text-xs uppercase tracking-wider text-slate-900">
                            Saf {saf} ({saf === 1 ? 'Saf Depan' : saf === 2 ? 'Saf Tengah' : 'Saf Belakang'})
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                          7 Personel (Banjar 1 – 7)
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {pasukan.filter(p => p.safNumber === saf).map(p => {
                          const hasPPhoto = p.photo && typeof p.photo === 'string' && p.photo !== '#' && !p.photo.startsWith('#') && !p.photo.includes('drive.google.com/open?id=');
                          return (
                            <div
                              key={p.id}
                              className="group/card bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-red-400/60 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                            >
                              <div className="aspect-[3/4] w-full bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                                {hasPPhoto ? (
                                  <img
                                    src={formatImageUrl(p.photo)}
                                    alt={p.name}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/card:scale-105"
                                    onError={(e) => {
                                      const fallback = getFallbackImageUrl(p.photo);
                                      if (fallback && e.currentTarget.src !== fallback) {
                                        e.currentTarget.src = fallback;
                                      } else {
                                        e.currentTarget.style.display = 'none';
                                        if (e.currentTarget.nextElementSibling) {
                                          e.currentTarget.nextElementSibling.style.display = 'flex';
                                        }
                                      }
                                    }}
                                  />
                                ) : null}
                                <div
                                  className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 p-2"
                                  style={{ display: hasPPhoto ? 'none' : 'flex' }}
                                >
                                  <User className="w-8 h-8 opacity-40 mb-1" />
                                  <span className="text-[10px] font-bold text-slate-400">B{p.banjarNumber}</span>
                                </div>

                                <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-black shadow-xs">
                                  B{p.banjarNumber}
                                </span>
                              </div>

                              <div className="p-2.5 text-left space-y-1">
                                <span className="font-black text-xs text-slate-900 block leading-tight break-words group-hover/card:text-red-700 transition-colors">
                                  {p.name || '-'}
                                </span>
                                <div className="text-[10px] text-slate-600 leading-tight">
                                  {p.birthPlace ? `${p.birthPlace}${p.birthDate ? `, ${p.birthDate}` : ''}` : '-'}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-100 pt-1">
                                  <span>{p.class ? `Kls ${p.class}` : '-'}</span>
                                  <span>NISN: {p.nisn || '-'}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-400 italic text-center">
                  Daftar susunan 21 anggota pasukan belum diisi secara detail oleh kontingen.
                </div>
              )}
            </div>

            {/* 3 Personel Cadangan Section */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs text-slate-800 uppercase tracking-wider">
                    3 Personel Cadangan
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Siaga Pengganti
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                  Cadangan 1, 2, 3
                </span>
              </div>
              {cadangan.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {cadangan.map((c, i) => {
                    const hasCPhoto = c.photo && typeof c.photo === 'string' && c.photo !== '#' && !c.photo.startsWith('#') && !c.photo.includes('drive.google.com/open?id=');
                    return (
                      <div key={c.id || i} className="group/cadangan bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
                        <div className="aspect-[3/4] w-full bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                          {hasCPhoto ? (
                            <img
                              src={formatImageUrl(c.photo)}
                              alt={c.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/cadangan:scale-105"
                              onError={(e) => {
                                const fallback = getFallbackImageUrl(c.photo);
                                if (fallback && e.currentTarget.src !== fallback) {
                                  e.currentTarget.src = fallback;
                                } else {
                                  e.currentTarget.style.display = 'none';
                                  if (e.currentTarget.nextElementSibling) {
                                    e.currentTarget.nextElementSibling.style.display = 'flex';
                                  }
                                }
                              }}
                            />
                          ) : null}
                          <div
                            className="w-full h-full flex flex-col items-center justify-center text-[9px] font-bold text-slate-400 bg-slate-100"
                            style={{ display: hasCPhoto ? 'none' : 'flex' }}
                          >
                            <User className="w-6 h-6 opacity-40 mb-1" />
                            <span>C{i + 1}</span>
                          </div>
                          <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-bold shadow-xs">
                            C{i + 1}
                          </span>
                        </div>

                        <div className="p-2.5 text-left space-y-1">
                          <span className="font-black text-xs text-slate-900 block leading-tight break-words">
                            {c.name || '-'}
                          </span>
                          <div className="text-[10px] text-slate-600 leading-tight">
                            {c.birthPlace ? `${c.birthPlace}${c.birthDate ? `, ${c.birthDate}` : ''}` : '-'}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-100 pt-1">
                            <span>{c.class ? `Kls ${c.class}` : '-'}</span>
                            <span>NISN: {c.nisn || '-'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic block py-4 text-center">Belum ada personel cadangan</span>
              )}
            </div>
          </div>
        )}

        {/* Bottom Sticky Action Toolbar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar</span>
            </button>
            <button
              onClick={() => openModal('docViewer', { docId: 'form-b', team })}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Cetak Form B</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRevisionBox(!showRevisionBox)}
              className="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Minta Revisi Berkas
            </button>

            {team.status === 'pending' && (
              <button
                onClick={() => {
                  onVerify(team.id, 'registered');
                  onBack();
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-blue-950/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ACC Tahap 1: Daftarkan Tim</span>
              </button>
            )}

            {(team.status === 'registered' || team.status === 'revision') && (
              <button
                onClick={() => {
                  if (!eligibility.isEligible) {
                    alert(`Peleton belum dapat diverifikasi sah karena:\n\n• ${eligibility.issues.join('\n• ')}`);
                    return;
                  }
                  onVerify(team.id, 'verified');
                  onBack();
                }}
                className={`px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 ${
                  eligibility.isEligible
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/20 hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
                title={
                  eligibility.isEligible
                    ? 'ACC Tahap 2: Verifikasi Sah Peleton'
                    : `Belum memenuhi syarat verifikasi:\n- ${eligibility.issues.join('\n- ')}`
                }
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
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
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
