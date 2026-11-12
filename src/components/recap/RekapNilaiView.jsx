import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Download,
  Search,
  ShieldCheck,
  Eye,
  Lock,
  Unlock,
  Award,
  Trophy,
  Filter,
  Check,
  X,
  FileCheck2,
  CalendarCheck,
  Sparkles
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { SITE, EVENT } from '../../config.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function RekapNilaiView() {
  const {
    teams,
    scores,
    verifyScore,
    finalizeScore,
    unlockScore,
    currentUser,
    role,
    settings,
    updateSettings,
    exportTeamsCSV,
    setActiveView,
    openAuthModal
  } = useCompetition();

  const userRole = currentUser?.role || role || 'publik';

  // Jika akun Peserta masuk ke view rekap_nilai, arahkan otomatis ke Dasbor Peserta tab Rekap Nilai resmi
  React.useEffect(() => {
    if (userRole === 'peserta') {
      try {
        localStorage.setItem('lbb_participant_active_tab', 'scores');
      } catch {}
      setActiveView('peserta_dashboard');
    }
  }, [userRole, setActiveView]);

  // Petugas Check-In dan Petugas DP TIDAK MEMILIKI AKSES ke Rekap Nilai!
  const isPenginput = userRole === 'penginput' || userRole === 'superadmin';
  const isVerifikator = userRole === 'verifikator' || userRole === 'superadmin';
  const isFinalisator = userRole === 'finalisator' || userRole === 'superadmin';

  const [selectedJenjang, setSelectedJenjang] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamScore, setSelectedTeamScore] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoModalUrl, setPhotoModalUrl] = useState('');

  // Eligible teams (drawn or verified)
  const competitionTeams = teams.filter(t => ['verified', 'drawn'].includes(t.status) || t.lotNumber);

  const filteredTeams = competitionTeams.filter(team => {
    const matchesJenjang = selectedJenjang === 'ALL' || team.jenjang === selectedJenjang;
    const matchesSearch =
      team.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.regCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.dantonName && team.dantonName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesJenjang && matchesSearch;
  });

  const hasAccess = ['superadmin', 'finalisator', 'verifikator', 'penginput'].includes(userRole);

  // Helper nilai resmi sesuai Juknis Bab A.3.c & Bab A.5
  const getScoreMetrics = (teamId) => {
    const sc = scores[teamId];
    if (!sc) {
      return {
        hasScore: false,
        nilaiMurniPeleton: 0,
        peletonPenalty: 0,
        nilaiAkhirPeleton: 0,
        nilaiMurniDanton: 0,
        dantonPenalty: 0,
        nilaiAkhirDanton: 0,
        totalPenalty: 0,
        finalScore: 0,
      };
    }
    const nilaiMurniPeleton = Number(sc.nilaiMurniPeleton ?? sc.pbbTotal ?? sc.pbb?.total ?? 0);
    const peletonPenalty = Number(sc.penalties?.peletonPenalty ?? sc.penaltiesTotal ?? sc.penalties?.totalPenalty ?? 0);
    const nilaiAkhirPeleton = Number(sc.nilaiAkhirPeleton ?? Math.max(0, parseFloat((nilaiMurniPeleton - peletonPenalty).toFixed(2))));

    const nilaiMurniDanton = Number(sc.nilaiMurniDanton ?? sc.dantonTotal ?? sc.danton?.total ?? 0);
    const dantonPenalty = Number(sc.penalties?.dantonPenalty ?? 0);
    const nilaiAkhirDanton = Number(sc.nilaiAkhirDanton ?? Math.max(0, parseFloat((nilaiMurniDanton - dantonPenalty).toFixed(2))));

    const totalPenalty = Number(sc.penalties?.totalPenalty ?? (peletonPenalty + dantonPenalty));
    const finalScore = Number(sc.finalScore ?? parseFloat((nilaiAkhirPeleton + nilaiAkhirDanton).toFixed(2)));

    return {
      hasScore: true,
      nilaiMurniPeleton,
      peletonPenalty,
      nilaiAkhirPeleton,
      nilaiMurniDanton,
      dantonPenalty,
      nilaiAkhirDanton,
      totalPenalty,
      finalScore,
    };
  };

  // Urutan sesuai Juknis Bab A.5 (Nilai Akhir Peleton -> Nilai Murni Peleton -> Penalti Peleton Terkecil -> Nilai Murni Danton)
  const comparePeletonJuknis = (a, b) => {
    const mA = getScoreMetrics(a.id);
    const mB = getScoreMetrics(b.id);
    if (mB.hasScore !== mA.hasScore) return mB.hasScore ? 1 : -1;
    if (mB.nilaiAkhirPeleton !== mA.nilaiAkhirPeleton) return mB.nilaiAkhirPeleton - mA.nilaiAkhirPeleton;
    if (mB.nilaiMurniPeleton !== mA.nilaiMurniPeleton) return mB.nilaiMurniPeleton - mA.nilaiMurniPeleton;
    if (mA.peletonPenalty !== mB.peletonPenalty) return mA.peletonPenalty - mB.peletonPenalty;
    return mB.nilaiMurniDanton - mA.nilaiMurniDanton;
  };

  // Hitung peringkat resmi per jenjang (SD dan SMP terpisah)
  const jenjangRankMap = {};
  ['SD', 'SMP'].forEach(jKey => {
    const jTeams = competitionTeams.filter(t => t.jenjang === jKey && scores[t.id]).sort(comparePeletonJuknis);
    jTeams.forEach((t, i) => {
      jenjangRankMap[t.id] = i + 1;
    });
  });

  const rankedTeams = [...filteredTeams].sort((a, b) => {
    if (selectedJenjang === 'ALL' && a.jenjang !== b.jenjang) {
      return a.jenjang === 'SD' ? -1 : 1;
    }
    return comparePeletonJuknis(a, b);
  });

  if (!hasAccess) {
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
              Rekapitulasi Nilai Terkunci
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Halaman ini bersifat rahasia dan hanya dapat diakses oleh Panitia Terotorisasi: Operator Penginput, Verifikator, Finalisator Dewan Juri, atau Superadmin.
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
              onClick={() => {
                if (openAuthModal) openAuthModal();
              }}
              className="w-full py-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-red-950/40"
            >
              Masuk Akun Panitia
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Stats
  const scoredCount = competitionTeams.filter(t => scores[t.id]).length;
  const verifiedCount = competitionTeams.filter(t => {
    const sc = scores[t.id];
    return Boolean(sc?.isVerified || sc?.status === 'verified' || sc?.status === 'finalized' || sc?.isLocked);
  }).length;
  const finalizedCount = competitionTeams.filter(t => Boolean(scores[t.id]?.isLocked || scores[t.id]?.status === 'finalized')).length;

  const handleVerify = (teamId) => {
    if (!isVerifikator) return;
    verifyScore(teamId, true, `Diverifikasi oleh ${currentUser?.name || 'Verifikator'}`);
    alert(`Nilai peleton berhasil diverifikasi & disetujui!`);
  };

  const handleRejectScore = (teamId) => {
    if (!isVerifikator) return;
    const reason = window.prompt('Masukkan alasan penolakan / catatan koreksi untuk Operator Penginput:', 'Terdapat selisih angka dengan blangko fisik juri');
    if (reason === null) return;
    verifyScore(teamId, false, reason || 'Dikembalikan ke draft oleh Verifikator');
    alert('Nilai dikembalikan ke status Draft untuk diperbaiki oleh Penginput.');
  };

  const handleFinalize = (teamId) => {
    if (!isFinalisator) return;
    finalizeScore(teamId, currentUser?.name || 'Finalisator');
    alert(`Nilai peleton berhasil dikunci (Finalized)!`);
  };

  const handleUnlock = (teamId) => {
    if (userRole !== 'superadmin') return;
    unlockScore(teamId);
    alert('Kunci nilai peleton berhasil dibuka kembali oleh Superadmin.');
  };

  const handlePrintBeritaAcara = () => {
    window.print();
  };

  const handleTogglePublishLeaderboard = () => {
    if (!isFinalisator) return;
    const current = settings?.announcementPublished;
    updateSettings({ announcementPublished: !current });
    alert(current ? 'Klasemen publik resmi ditutup kembali.' : 'Klasemen resmi berhasil DIPUBLIKASIKAN untuk publik!');
  };

  return (
    <SimpaskorSidebarLayout
      activeMenu="rekap_nilai"
      title="Rekapitulasi Nilai & Scrutineering"
      subtitle="Verifikasi silang bukti fisik blangko juri, kalkulasi penalti, penguncian skor, & berita acara resmi"
      rightActions={
        <div className="flex items-center gap-2">
          {isFinalisator && (
            <button
              onClick={handleTogglePublishLeaderboard}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                settings?.announcementPublished
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{settings?.announcementPublished ? 'Tutup Publikasi' : 'Buka Publikasi Klasemen'}</span>
            </button>
          )}

          <button
            onClick={handlePrintBeritaAcara}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Cetak Berita Acara Rekapitulasi Dewan Juri"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak Berita Acara</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">

        {/* Scrutineering Progress & Telemetry */}
        <div className="bg-white text-slate-800 rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-slate-200/90 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-5">
            <div className="space-y-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-black uppercase tracking-wider">
                <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
                <span>Tahap 7: Scrutineering &amp; Berita Acara</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xl line-clamp-2 leading-relaxed">
                Alur pengesahan nilai 3 pintu: Penginputan skor blangko fisik kertas, verifikasi silang foto autentik oleh Verifikator, serta penguncian nilai mutlak oleh Finalisator Dewan Juri.
              </p>
            </div>

            {/* Scrutineer Progress Counters */}
            <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-2.5 shrink-0 w-full sm:w-auto mt-1 sm:mt-0">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl px-2.5 sm:px-3.5 py-2 text-center min-w-0 sm:min-w-[95px] flex-1 sm:flex-initial">
                <span className="text-[10px] uppercase font-bold text-amber-800 block truncate">1. Input</span>
                <span className="text-base sm:text-lg font-black text-amber-950 font-mono block mt-0.5">{scoredCount}</span>
              </div>
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl px-2.5 sm:px-3.5 py-2 text-center min-w-0 sm:min-w-[95px] flex-1 sm:flex-initial">
                <span className="text-[10px] uppercase font-bold text-blue-800 block truncate">2. Verif</span>
                <span className="text-base sm:text-lg font-black text-blue-950 font-mono block mt-0.5">{verifiedCount}</span>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl px-2.5 sm:px-3.5 py-2 text-center min-w-0 sm:min-w-[95px] flex-1 sm:flex-initial">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block truncate">3. Kunci</span>
                <span className="text-base sm:text-lg font-black text-emerald-950 font-mono block mt-0.5">{finalizedCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {[
                { id: 'ALL', label: 'Semua Jenjang' },
                { id: 'SD', label: 'SD / MI' },
                { id: 'SMP', label: 'SMP / MTs' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedJenjang(f.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedJenjang === f.id ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari sekolah atau danton..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
              />
            </div>
          </div>

          {/* Table of Scored Teams */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Nomor Tampil</th>
                  <th className="py-3 px-3">Nama Sekolah</th>
                  <th className="py-3 px-3 text-right">Murni Peleton</th>
                  <th className="py-3 px-3 text-right">Penalti</th>
                  <th className="py-3 px-3 text-right font-black text-slate-900">Akhir Peleton</th>
                  <th className="py-3 px-3 text-right">Akhir Danton</th>
                  <th className="py-3 px-3 text-center">Status Scrutineer</th>
                  <th className="py-3 px-3 text-right">Aksi Validasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rankedTeams.map((team, idx) => {
                  const sc = scores[team.id];
                  const metrics = getScoreMetrics(team.id);
                  const hasScore = metrics.hasScore;
                  const jenjangRank = jenjangRankMap[team.id];

                  const isVerified = Boolean(sc?.isVerified || sc?.status === 'verified' || sc?.status === 'finalized');
                  const isLocked = Boolean(sc?.isLocked || sc?.status === 'finalized');
                  const evidenceUrl = sc?.paperEvidenceUrl || sc?.photoUrl;

                  return (
                    <tr key={team.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-600">
                        {jenjangRank ? `#${String(jenjangRank).padStart(2, '0')} ${team.jenjang}` : String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-mono font-black text-xs flex items-center justify-center">
                          {team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '-'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{team.schoolName}</div>
                        <div className="text-[10px] text-slate-400">{team.jenjang} • Danton: {team.dantonName || '-'}</div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-700">
                        {hasScore ? metrics.nilaiMurniPeleton : '-'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-rose-600">
                        {metrics.totalPenalty > 0 ? `-${metrics.totalPenalty}` : '0'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-black text-sm text-slate-900">
                        {hasScore ? metrics.nilaiAkhirPeleton : '-'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-red-700">
                        {hasScore ? metrics.nilaiAkhirDanton : '-'}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <Lock className="w-3 h-3" />
                            Final (Terkunci)
                          </span>
                        ) : isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Terverifikasi
                          </span>
                        ) : sc?.status === 'rejected_to_draft' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            Revisi Input
                          </span>
                        ) : hasScore ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            Draft Input
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            Belum Dinilai
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* Bukti Foto Blangko */}
                          {evidenceUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setPhotoModalUrl(evidenceUrl);
                                setIsPhotoModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              title="Lihat Foto Blangko Fisik Juri"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Tombol Verifikasi & Tolak (Verifikator / Superadmin) */}
                          {isVerifikator && hasScore && !isVerified && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleVerify(team.id)}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                              >
                                ACC Verifikasi
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectScore(team.id)}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                                title="Kembalikan ke Penginput untuk diperbaiki"
                              >
                                Tolak
                              </button>
                            </>
                          )}

                          {/* Tombol Batal Verifikasi & Finalisasi */}
                          {isVerifikator && isVerified && !isLocked && (
                            <button
                              type="button"
                              onClick={() => handleRejectScore(team.id)}
                              className="px-2 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                              title="Batalkan verifikasi dan kembalikan ke Draft"
                            >
                              Batal Verif
                            </button>
                          )}

                          {isFinalisator && isVerified && !isLocked && (
                            <button
                              type="button"
                              onClick={() => handleFinalize(team.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                            >
                              Kunci Skor
                            </button>
                          )}

                          {/* Tombol Buka Kunci (Khusus Superadmin) */}
                          {userRole === 'superadmin' && isLocked && (
                            <button
                              type="button"
                              onClick={() => handleUnlock(team.id)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                              title="Buka kunci skor (Otoritas Superadmin)"
                            >
                              <Unlock className="w-3 h-3" />
                              <span>Buka Kunci</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Preview Foto Blangko Fisik */}
        {isPhotoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-sm font-black text-slate-900 uppercase">Bukti Fisik Blangko Dewan Juri</h4>
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-auto rounded-2xl bg-slate-100 flex items-center justify-center">
                <img src={photoModalUrl} alt="Blangko Juri" className="w-full h-auto object-contain" />
              </div>
            </div>
          </div>
        )}

      </div>
    </SimpaskorSidebarLayout>
  );
}
