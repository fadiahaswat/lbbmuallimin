import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Search,
  Sparkles,
  ShieldCheck,
  X,
  Building2,
  Clock,
  Layers,
  LayoutList,
  LayoutGrid,
  DoorOpen,
  FileDown,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { getChestNumberByLot } from '../../context/competitionHelpers.js';
import { formatImageUrl } from '../../services/sheetService.js';
import { appToast, appAlert } from '../../utils/appDialog.js';
import { exportDP1InspectionPDF } from '../../utils/exportDP1InspectionPDF.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';
import PersonnelSwipeDeck from './components/PersonnelSwipeDeck.jsx';

function getPersonnelAliasKeys(idStr) {
  const s = String(idStr || '');
  if (s === 'danton' || s === 'p-danton') return ['danton', 'p-danton'];
  const pMatch = s.match(/^(?:p|pasukan)-(\d+)$/);
  if (pMatch) return [`p-${pMatch[1]}`, `pasukan-${pMatch[1]}`];
  const cMatch = s.match(/^(?:c|cadangan)-(\d+)$/);
  if (cMatch) return [`c-${cMatch[1]}`, `cadangan-${cMatch[1]}`];
  return [s];
}

function buildTeamPersonnels(team) {
  if (!team) return [];
  const r = team.roster || {};
  const list = [];

  // 1. Komandan Peleton (Danton)
  const dantonObj = r.danton || {};
  const dantonId = dantonObj.id || 'p-danton';
  list.push({
    id: dantonId,
    aliasKeys: getPersonnelAliasKeys(dantonId),
    code: 'DAN',
    roleType: 'danton',
    roleLabel: 'Komandan Peleton (Danton)',
    name: dantonObj.name || team.dantonName || 'Komandan Peleton',
    nisn: dantonObj.nisn || '-',
    className: dantonObj.class || '-',
    birthPlace: dantonObj.birthPlace || '',
    birthDate: dantonObj.birthDate || '',
    medicalHistory: dantonObj.medicalHistory || '',
    photo: dantonObj.photo || null,
  });

  // 2. 21 Pasukan Inti (3 Saf x 7 Banjar)
  const pasukanArr = Array.isArray(r.pasukan) ? r.pasukan : [];
  const pasukanTotal = Math.max(21, pasukanArr.length);
  for (let i = 0; i < pasukanTotal; i++) {
    const p = pasukanArr[i] || {};
    const num = i + 1;
    const pid = p.id || `p-${num}`;
    const saf = p.safNumber || Math.ceil(num / 7);
    const banjar = p.banjarNumber || ((num - 1) % 7) + 1;
    list.push({
      id: pid,
      aliasKeys: getPersonnelAliasKeys(pid),
      code: `P${num}`,
      roleType: 'pasukan',
      saf,
      banjar,
      roleLabel: `Pasukan Inti • Saf ${saf} Banjar ${banjar}`,
      name: p.name || `Anggota Pasukan ${num}`,
      nisn: p.nisn || '-',
      className: p.class || '-',
      birthPlace: p.birthPlace || '',
      birthDate: p.birthDate || '',
      medicalHistory: p.medicalHistory || '',
      photo: p.photo || null,
    });
  }

  // 3. Cadangan — HANYA tampilkan cadangan yang benar-benar didaftarkan tim (tanpa template kosong)
  const cadanganArr = Array.isArray(r.cadangan) ? r.cadangan : [];
  cadanganArr.forEach((c, i) => {
    if (!c || typeof c !== 'object') return;
    const cleanName = String(c.name || '').trim();
    const hasRealName = Boolean(cleanName && cleanName !== '-' && !/^cadangan\s*\d+$/i.test(cleanName));
    const hasRealNisn = Boolean(c.nisn && String(c.nisn).trim() !== '' && String(c.nisn).trim() !== '-');
    const hasRealPhoto = Boolean(c.photo && typeof c.photo === 'string' && c.photo !== '#' && !c.photo.startsWith('#'));
    if (!hasRealName && !hasRealNisn && !hasRealPhoto) return;

    const num = i + 1;
    const cid = c.id || `c-${num}`;
    list.push({
      id: cid,
      aliasKeys: getPersonnelAliasKeys(cid),
      code: `C${num}`,
      roleType: 'cadangan',
      roleLabel: `Personel Cadangan ${num}`,
      name: cleanName || `Cadangan ${num}`,
      nisn: c.nisn || '-',
      className: c.class || '-',
      birthPlace: c.birthPlace || '',
      birthDate: c.birthDate || '',
      medicalHistory: c.medicalHistory || '',
      photo: c.photo || null,
    });
  });

  return list;
}

function getTeamLogoUrl(team) {
  const raw = team?.files?.schoolLogo?.url || team?.file_logo_sekolah || team?.logoUrl;
  if (!raw || typeof raw !== 'string' || raw === '#' || raw.startsWith('#')) return null;
  return formatImageUrl(raw);
}

export default function DaerahPersiapanView() {
  const {
    teams,
    staging,
    updateDP1PersonnelInspection,
    passToDP2,
    currentUser,
    role,
    isLocalhost
  } = useCompetition();

  const userRole = currentUser?.role || role || 'publik';
  const canOperateDP = ['dp', 'staging', 'admin', 'superadmin'].includes(userRole);

  const isTeamCheckedIn = (teamId) => {
    const st = staging?.[teamId] || staging?.basecamp?.[teamId];
    return Boolean(
      st?.checkedIn ||
      st?.basecampLogistics?.ktpDeposited ||
      st?.basecamp?.ktpDeposited ||
      (st?.stage && st.stage !== 'waiting')
    );
  };

  // Semua peleton yang sudah Check-In Basecamp (khusus localhost: bypass check-in, tampilkan semua non-rejected)
  const checkedInTeams = useMemo(() => {
    return teams
      .filter(t => isLocalhost ? t.status !== 'rejected' : isTeamCheckedIn(t.id))
      .sort((a, b) => {
        const chestA = parseInt(a.chestNumber, 10);
        const chestB = parseInt(b.chestNumber, 10);
        if (!isNaN(chestA) && !isNaN(chestB) && chestA !== chestB) return chestA - chestB;
        const lotA = Number(a.lotNumber) || 9999;
        const lotB = Number(b.lotNumber) || 9999;
        if (lotA !== lotB) return lotA - lotB;
        return String(a.schoolName || '').localeCompare(String(b.schoolName || ''));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams, staging, isLocalhost]);

  const sdCheckedInTeams = useMemo(() => checkedInTeams.filter(t => t.jenjang === 'SD'), [checkedInTeams]);
  const smpCheckedInTeams = useMemo(() => checkedInTeams.filter(t => t.jenjang === 'SMP'), [checkedInTeams]);

  const [activePosJenjang, setActivePosJenjang] = useState(() => {
    if (sdCheckedInTeams.length === 0 && smpCheckedInTeams.length > 0) return 'SMP';
    return 'SD';
  });
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [isPickerOpen, setIsPickerOpen] = useState(true);
  const [deckViewMode, setDeckViewMode] = useState('swipe'); // 'swipe' | 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL'); // 'ALL' | 'WAITING' | 'READY'

  // Ekspor PDF Lembar Inspeksi DP 1
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportProgressText, setExportProgressText] = useState('');
  const exportMenuRef = useRef(null);

  useEffect(() => {
    if (!isExportMenuOpen) return;
    const handleOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setIsExportMenuOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsExportMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isExportMenuOpen]);

  const showNotice = (msg) => {
    appToast(msg, { variant: 'success' });
  };

  const handleExportDP1Pdf = async (targetTeamsList, fileLabel = '') => {
    if (isExportingPdf) return;
    setIsExportMenuOpen(false);
    if (!targetTeamsList || targetTeamsList.length === 0) {
      appAlert('Belum ada peleton yang tersedia untuk diekspor.', { title: 'Data Kosong', variant: 'warning' });
      return;
    }
    setIsExportingPdf(true);
    setExportProgressText('Menyiapkan dokumen...');
    try {
      const result = await exportDP1InspectionPDF({
        teams: targetTeamsList,
        staging,
        fileLabel,
        onProgress: (msg) => setExportProgressText(msg),
      });
      showNotice(`Lembar Inspeksi DP 1 berhasil diunduh (${result.totalPages} halaman A4).`);
    } catch (err) {
      console.error('Gagal ekspor PDF DP 1:', err);
      appAlert(`Gagal membuat file PDF: ${err?.message || 'Terjadi kesalahan teknis.'}`, {
        title: 'Ekspor PDF Gagal',
        variant: 'danger',
      });
    } finally {
      setIsExportingPdf(false);
      setExportProgressText('');
    }
  };

  const posTeams = activePosJenjang === 'SD' ? sdCheckedInTeams : smpCheckedInTeams;

  const getTeamStageMeta = (team) => {
    const st = staging?.[team.id] || {};
    const inspections = st.dp1Inspections || staging?.dp1?.[team.id]?.personnels || {};
    const personnels = buildTeamPersonnels(team);
    const verified = personnels.filter(p =>
      p.aliasKeys.some(k => inspections[k]?.verified === true)
    ).length;
    const flagged = personnels.filter(p =>
      p.aliasKeys.some(k => inspections[k]?.verified === false && inspections[k]?.inspectedAt)
    ).length;
    const hasExplicitInspections = Object.keys(inspections).length > 0;
    const isPassedDP1 = verified >= 22 || (!hasExplicitInspections && Boolean(st.dp1Passed));
    const roomName = st?.basecamp?.roomName || st?.roomName || team.basecampRoom || '';

    let stageLabel = 'Antrean DP 1';
    let badgeTone = 'bg-slate-100 text-slate-700 border-slate-200';
    if (st.stage === 'finished' || st.stage === 'checkout') {
      stageLabel = 'Selesai Tampil';
      badgeTone = 'bg-slate-900 text-white border-slate-900';
    } else if (isPassedDP1) {
      stageLabel = 'DP 2 • Siap Dinilai';
      badgeTone = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (verified > 0) {
      stageLabel = 'Proses DP 1';
      badgeTone = 'bg-blue-50 text-blue-700 border-blue-200';
    }

    return {
      inspections,
      personnels,
      verified,
      flagged,
      total: personnels.length,
      isPassedDP1,
      roomName,
      stageLabel,
      badgeTone
    };
  };

  const filteredPosTeams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return posTeams.filter(t => {
      const meta = getTeamStageMeta(t);
      if (stageFilter === 'WAITING' && meta.isPassedDP1) return false;
      if (stageFilter === 'READY' && !meta.isPassedDP1) return false;
      if (!q) return true;
      const dantonName = t.roster?.danton?.name || t.dantonName || '';
      const lotStr = t.lotNumber ? String(t.lotNumber).padStart(2, '0') : '';
      const chestStr = String(t.chestNumber || '');
      return (
        String(t.schoolName || '').toLowerCase().includes(q) ||
        String(t.regCode || '').toLowerCase().includes(q) ||
        String(dantonName).toLowerCase().includes(q) ||
        lotStr.includes(q) ||
        chestStr.includes(q)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posTeams, searchQuery, stageFilter, staging]);

  const activeTeam = useMemo(() => {
    if (!selectedTeamId) return null;
    return posTeams.find(t => t.id === selectedTeamId) || null;
  }, [posTeams, selectedTeamId]);

  const activeMeta = activeTeam ? getTeamStageMeta(activeTeam) : null;
  const allPersonnels = activeMeta ? activeMeta.personnels : [];
  const dp1TeamInspections = activeMeta ? activeMeta.inspections : {};
  const verifiedCount = activeMeta ? activeMeta.verified : 0;
  const isMinPersonnelMet = verifiedCount >= 22;

  const waitingCount = posTeams.filter(t => !getTeamStageMeta(t).isPassedDP1).length;
  const readyCount = posTeams.filter(t => getTeamStageMeta(t).isPassedDP1).length;

  const handleSwitchPos = (jenjang) => {
    setActivePosJenjang(jenjang);
    setSelectedTeamId(null);
    setIsPickerOpen(true);
    setSearchQuery('');
  };

  const handleSelectTeam = (teamId) => {
    setSelectedTeamId(teamId);
    setIsPickerOpen(false);
  };

  const handleCycleTeam = (delta) => {
    if (posTeams.length === 0) return;
    const curIdx = posTeams.findIndex(t => t.id === activeTeam?.id);
    const nextIdx = curIdx < 0
      ? 0
      : (curIdx + delta + posTeams.length) % posTeams.length;
    setSelectedTeamId(posTeams[nextIdx].id);
    setIsPickerOpen(false);
  };

  const handleInspectPersonnel = (person, isVerified, note = '') => {
    if (!canOperateDP || !activeTeam) return;
    const prevVerified = verifiedCount;
    updateDP1PersonnelInspection(activeTeam.id, person.id, isVerified, note);

    const wasAlreadyChecked = person.aliasKeys.some(k => dp1TeamInspections[k]?.verified === true);
    if (isVerified && !wasAlreadyChecked && prevVerified === 21) {
      if (passToDP2) passToDP2(activeTeam.id);
      showNotice(`${activeTeam.schoolName} mencapai 22 personel — otomatis masuk DP 2 & Siap Dinilai!`);
    }
  };

  const handleVerifyAll = () => {
    if (!canOperateDP || !activeTeam) return;
    updateDP1PersonnelInspection(activeTeam.id, allPersonnels.map(p => p.id), true, '');
    if (passToDP2) passToDP2(activeTeam.id);
    showNotice(`${allPersonnels.length} personel ${activeTeam.schoolName} terverifikasi — otomatis masuk DP 2 & Siap Dinilai!`);
  };

  const isSDPos = activePosJenjang === 'SD';
  const showPickerScreen = !activeTeam || isPickerOpen;

  return (
    <SimpaskorSidebarLayout
      activeMenu="dp"
      title={`Pos DP 1 ${isSDPos ? 'SD / MI' : 'SMP / MTs'}`}
      subtitle="Inspeksi pasfoto & fisik 25 personel — otomatis masuk DP 2 & siap dinilai Dewan Juri"
      hideHeader={true}
    >
      <div className="space-y-4">
        {/* ============================================================== */}
        {/* SCREEN 1: ANTREAN PELETON POS DP 1 (CLEAN & ERGONOMIC)         */}
        {/* ============================================================== */}
        {showPickerScreen ? (
          <section className="rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] overflow-visible">
            {/* Dark Obsidian Inspection Cockpit Header */}
            <div className="bg-slate-950 text-white px-4 py-4 sm:px-6 sm:py-5 rounded-t-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-[15px] sm:text-base font-black uppercase tracking-tight text-white leading-tight">
                    Daerah Persiapan (DP 1 &amp; DP 2)
                  </h1>
                  <p className="text-[11.5px] text-slate-400 mt-1">
                    Inspeksi fisik &amp; pasfoto personel · Minimal <strong className="text-slate-200">22 cocok</strong> → otomatis masuk DP 2 &amp; siap dinilai juri.
                  </p>
                </div>
              </div>

              {/* Pos KPIs */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <div className="px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-amber-300">Antrean</span>
                  <span className="text-xs font-black font-mono text-white">{waitingCount}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-400/10 border border-emerald-400/25 flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-300">Siap DP 2</span>
                  <span className="text-xs font-black font-mono text-white">{readyCount}/{posTeams.length}</span>
                </div>

                {/* Dropdown Ekspor PDF Lembar Inspeksi DP 1 (Massal / Per Jenjang) */}
                {checkedInTeams.length > 0 && (
                  <div className="relative" ref={exportMenuRef}>
                    <button
                      type="button"
                      disabled={isExportingPdf}
                      onClick={() => setIsExportMenuOpen((prev) => !prev)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        isExportingPdf
                          ? 'bg-slate-800 text-slate-300 border-slate-700 cursor-wait'
                          : 'bg-white/10 hover:bg-white/15 text-white border-white/20'
                      }`}
                      title="Ekspor PDF Lembar Inspeksi DP 1 lengkap pasfoto personel"
                    >
                      {isExportingPdf ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          <span>{exportProgressText || 'Memproses PDF...'}</span>
                        </>
                      ) : (
                        <>
                          <FileDown className="w-3.5 h-3.5 text-amber-400" />
                          <span>Ekspor PDF</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
                        </>
                      )}
                    </button>

                    {isExportMenuOpen && !isExportingPdf && (
                      <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white text-slate-900 border border-slate-200/95 shadow-[0_16px_40px_rgba(15,23,42,0.2)] p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Ekspor Lembar Inspeksi DP 1 (A4)
                          </p>
                        </div>

                        {posTeams.length > 0 && (
                          <button
                            type="button"
                            onClick={() => handleExportDP1Pdf(posTeams, isSDPos ? 'Pos_SD_MI' : 'Pos_SMP_MTs')}
                            className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-2.5 cursor-pointer"
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${isSDPos ? 'bg-rose-50 text-rose-700 border-rose-200/80' : 'bg-blue-50 text-blue-700 border-blue-200/80'}`}>
                              <FileDown className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900">
                                Semua {isSDPos ? 'SD / MI' : 'SMP / MTs'} ({posTeams.length} Tim)
                              </div>
                              <div className="text-[10.5px] text-slate-500 leading-snug mt-0.5">
                                1 halaman A4 per peleton lengkap pasfoto 3×4.
                              </div>
                            </div>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleExportDP1Pdf(checkedInTeams, 'Semua_SD_dan_SMP')}
                          className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-2.5 cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center shrink-0 mt-0.5">
                            <FileDown className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900">
                              Semua SD &amp; SMP ({checkedInTeams.length} Tim)
                            </div>
                            <div className="text-[10.5px] text-slate-500 leading-snug mt-0.5">
                              Gabungan seluruh lembar inspeksi DP 1 dalam 1 PDF.
                            </div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTeam && (
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(false)}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                  >
                    <span className="max-w-[150px] truncate">Lanjut {activeTeam.schoolName}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                )}
              </div>
            </div>

            {/* Slim Progress Strip */}
            <div className="h-1 w-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-500"
                style={{ width: `${posTeams.length > 0 ? Math.round((readyCount / posTeams.length) * 100) : 0}%` }}
              />
            </div>

            {/* Flush Underline Tab Bar: Pos DP 1 SD / MI vs SMP / MTs */}
            <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50/70">
              <button
                type="button"
                onClick={() => handleSwitchPos('SD')}
                className={`relative py-3 px-4 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border-r border-slate-200/80 ${
                  isSDPos
                    ? 'bg-white text-red-700 font-black'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/60 font-bold'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSDPos ? 'bg-red-600' : 'bg-slate-300'}`} />
                <span>Pos DP 1 SD / MI</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black leading-none ${
                  isSDPos ? 'bg-red-100 text-red-700' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {sdCheckedInTeams.length}
                </span>
                {isSDPos && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />}
              </button>

              <button
                type="button"
                onClick={() => handleSwitchPos('SMP')}
                className={`relative py-3 px-4 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  !isSDPos
                    ? 'bg-white text-blue-700 font-black'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/60 font-bold'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${!isSDPos ? 'bg-blue-600' : 'bg-slate-300'}`} />
                <span>Pos DP 1 SMP / MTs</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black leading-none ${
                  !isSDPos ? 'bg-blue-100 text-blue-700' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {smpCheckedInTeams.length}
                </span>
                {!isSDPos && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
            </div>

            {/* Body Antrean */}
            <div className="p-4 sm:p-6 space-y-4">
              {posTeams.length === 0 ? (
                <div className="py-14 text-center space-y-3 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto shadow-2xs">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-800">
                      Belum Ada Peleton {isSDPos ? 'SD / MI' : 'SMP / MTs'} yang Check-In
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      Peleton akan otomatis masuk ke antrean Pos DP 1 segera setelah melakukan Check-In di Pos Basecamp.
                    </p>
                  </div>
                  {(isSDPos ? smpCheckedInTeams.length > 0 : sdCheckedInTeams.length > 0) && (
                    <button
                      type="button"
                      onClick={() => handleSwitchPos(isSDPos ? 'SMP' : 'SD')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span>Buka Pos DP 1 {isSDPos ? `SMP / MTs (${smpCheckedInTeams.length} Tim)` : `SD / MI (${sdCheckedInTeams.length} Tim)`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Search + Filter */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Cari sekolah ${isSDPos ? 'SD/MI' : 'SMP/MTs'}, nomor dada, atau danton...`}
                        className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-bold">
                      {[
                        { id: 'ALL', label: `Semua (${posTeams.length})` },
                        { id: 'WAITING', label: `Perlu Dicek (${waitingCount})` },
                        { id: 'READY', label: `Siap DP 2 (${readyCount})` }
                      ].map(st => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setStageFilter(st.id)}
                          className={`px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                            stageFilter === st.id
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clean Balanced Queue Table (Selaras dengan RekapNilaiView) */}
                  <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/90 text-slate-500 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200/90">
                            <th className="py-3 px-3.5 text-center w-24 border-r border-slate-200/70">No. Dada</th>
                            <th className="py-3 px-4 min-w-[240px] border-r border-slate-200/70">Peleton</th>
                            <th className="py-3 px-4 text-center w-44 border-r border-slate-200/70">Personel Cocok</th>
                            <th className="py-3 px-3.5 text-center w-36 border-r border-slate-200/70">Status</th>
                            <th className="py-3 px-4 text-center w-36">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {filteredPosTeams.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-12 text-center text-xs text-slate-400 font-medium">
                                Tidak ada peleton yang cocok dengan filter pencarian.
                              </td>
                            </tr>
                          ) : (
                            filteredPosTeams.map((team) => {
                              const meta = getTeamStageMeta(team);
                              const logoUrl = getTeamLogoUrl(team);
                              const dantonName = team.roster?.danton?.name || team.dantonName || '-';
                              const pct = meta.total ? Math.round((meta.verified / meta.total) * 100) : 0;
                              const chestNum = team.chestNumber || getChestNumberByLot(team.jenjang, team.lotNumber) || '';
                              const isInProgress = !meta.isPassedDP1 && (meta.verified > 0 || meta.flagged > 0);

                              return (
                                <tr
                                  key={team.id}
                                  onClick={() => handleSelectTeam(team.id)}
                                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                                >
                                  {/* No. Dada */}
                                  <td className="py-3 px-3.5 text-center border-r border-slate-100 align-middle">
                                    {chestNum ? (
                                      <span className={`inline-flex items-center justify-center min-w-[46px] h-7 px-2 rounded-lg font-mono font-black text-xs text-white shadow-2xs ${
                                        isSDPos ? 'bg-red-600' : 'bg-blue-600'
                                      }`}>
                                        {chestNum}
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center justify-center min-w-[46px] h-7 px-2 rounded-lg font-mono font-bold text-xs bg-slate-100 text-slate-400 border border-slate-200/80">
                                        —
                                      </span>
                                    )}
                                  </td>

                                  {/* Peleton (Logo Tanpa Wadah + Nama Sekolah + Room Chip + Nama Danton di bawah) */}
                                  <td className="py-3 px-4 border-r border-slate-100 align-middle">
                                    <div className="flex items-center gap-3 min-w-0">
                                      {logoUrl ? (
                                        <img
                                          src={logoUrl}
                                          alt={team.schoolName}
                                          className="w-8 h-8 object-contain shrink-0"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                          }}
                                        />
                                      ) : (
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-[10px] shrink-0 ${
                                          isSDPos ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                                        }`}>
                                          {team.jenjang}
                                        </span>
                                      )}
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="font-bold text-slate-900 truncate">
                                            {team.schoolName}
                                          </span>
                                          {meta.roomName && (
                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80 font-mono text-[9.5px] font-bold shrink-0">
                                              <DoorOpen className="w-2.5 h-2.5 text-slate-400" />
                                              <span>{meta.roomName}</span>
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                          {dantonName}
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Personel Cocok */}
                                  <td className="py-3 px-4 text-center border-r border-slate-100 align-middle">
                                    <div className="inline-flex flex-col items-center gap-1 w-28">
                                      <div className="flex items-baseline justify-between w-full text-[11px] font-mono">
                                        <span className={`font-black ${meta.isPassedDP1 ? 'text-emerald-700' : meta.verified > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                                          {meta.verified}/{meta.total}
                                        </span>
                                        <span className="text-[9.5px] text-slate-400">min. 22</span>
                                      </div>
                                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full rounded-full transition-all ${
                                            meta.isPassedDP1 ? 'bg-emerald-500' : isSDPos ? 'bg-red-500' : 'bg-blue-600'
                                          }`}
                                          style={{ width: `${pct}%` }}
                                        />
                                      </div>
                                    </div>
                                  </td>

                                  {/* Status */}
                                  <td className="py-3 px-3.5 text-center border-r border-slate-100 whitespace-nowrap align-middle">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${meta.badgeTone}`}>
                                      {meta.stageLabel}
                                    </span>
                                  </td>

                                  {/* Aksi */}
                                  <td className="py-3 px-4 text-center whitespace-nowrap align-middle">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectTeam(team.id);
                                      }}
                                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                                        meta.isPassedDP1
                                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                                          : isInProgress
                                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                                          : 'bg-white hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-200 hover:border-slate-900'
                                      }`}
                                    >
                                      <span>{meta.isPassedDP1 ? 'Tinjau' : isInProgress ? 'Lanjutkan' : 'Inspeksi'}</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        ) : (
          /* ============================================================== */
          /* SCREEN 2: INSPECTION COCKPIT (SINGLE UNIFIED COMMAND BAR)      */
          /* ============================================================== */
          <section className="rounded-2xl sm:rounded-[26px] border border-slate-200/80 bg-white shadow-[0_14px_38px_rgba(15,23,42,0.05)] overflow-hidden">
            {/* Dark Obsidian Cockpit Command Bar */}
            <div className="px-4 py-3.5 sm:px-5 bg-slate-950 text-white border-b border-slate-800 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
              {/* Left: Unified Nav + No. Dada + Unframed Logo + Team Identity */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(true)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    title="Kembali ke Daftar Antrean"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Antrean</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-slate-300 text-[10px] font-mono font-black leading-none">
                      {posTeams.length}
                    </span>
                  </button>

                  {posTeams.length > 1 && (
                    <div className="hidden sm:flex items-center pl-0.5">
                      <button
                        type="button"
                        onClick={() => handleCycleTeam(-1)}
                        className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                        title="Peleton Sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCycleTeam(1)}
                        className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                        title="Peleton Berikutnya"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Blok No. Dada Menonjol */}
                <div className={`min-w-[54px] h-11 px-2 rounded-xl flex flex-col items-center justify-center shrink-0 text-white shadow-xs ${
                  isSDPos ? 'bg-red-600' : 'bg-blue-600'
                }`}>
                  <span className="text-[7px] font-bold uppercase tracking-widest opacity-80 leading-none">
                    No. Dada
                  </span>
                  <span className="text-base font-mono font-black leading-none tracking-tight mt-0.5">
                    {activeTeam.chestNumber || getChestNumberByLot(activeTeam.jenjang, activeTeam.lotNumber) || '—'}
                  </span>
                </div>

                {/* Logo Sekolah tanpa wadah */}
                {getTeamLogoUrl(activeTeam) ? (
                  <img
                    src={getTeamLogoUrl(activeTeam)}
                    alt={activeTeam.schoolName}
                    className="w-9 h-9 object-contain shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className={`w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center font-mono font-bold text-xs shrink-0 ${isSDPos ? 'text-rose-300' : 'text-blue-300'}`}>
                    {activeTeam.jenjang}
                  </span>
                )}

                {/* Team Identity (Tanpa kata 'Danton:') */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm sm:text-[15px] font-black text-white uppercase truncate leading-tight">
                      {activeTeam.schoolName}
                    </h2>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase shrink-0 border ${
                      isSDPos ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}>
                      {activeTeam.jenjang}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    <strong className="text-slate-200 font-semibold">{activeTeam.roster?.danton?.name || activeTeam.dantonName || '-'}</strong>
                    {activeMeta?.roomName ? ` · Ruang ${activeMeta.roomName}` : ''}
                  </p>
                </div>
              </div>

              {/* Right: Mode Toggle + DP 2 Status */}
              <div className="flex flex-wrap items-center justify-between xl:justify-end gap-2 pt-2 xl:pt-0 border-t xl:border-t-0 border-slate-800">
                {/* Unified 3-Mode Toggle (Swipe | Baris | Grid) */}
                <div className="inline-flex items-center p-0.5 bg-slate-900 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setDeckViewMode('swipe')}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      deckViewMode === 'swipe'
                        ? 'bg-white text-slate-950 shadow-2xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Swipe</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeckViewMode('list')}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      deckViewMode === 'list'
                        ? 'bg-white text-slate-950 shadow-2xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutList className="w-3.5 h-3.5" />
                    <span>Baris</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeckViewMode('grid')}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      deckViewMode === 'grid'
                        ? 'bg-white text-slate-950 shadow-2xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Grid</span>
                  </button>
                </div>

                {/* Tombol Ekspor PDF Lembar Inspeksi DP 1 untuk Peleton Aktif */}
                <button
                  type="button"
                  disabled={isExportingPdf}
                  onClick={() => handleExportDP1Pdf([activeTeam], activeTeam.schoolName)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap ${
                    isExportingPdf
                      ? 'bg-slate-800 text-slate-300 border-slate-700 cursor-wait'
                      : 'bg-white/10 hover:bg-white/15 text-white border-white/20'
                  }`}
                  title="Ekspor PDF Lembar Inspeksi DP 1 lengkap pasfoto personel peleton ini"
                >
                  {isExportingPdf ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>{exportProgressText || 'Memproses...'}</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ekspor PDF</span>
                    </>
                  )}
                </button>

                {/* Compact DP 2 Status Pill */}
                {isMinPersonnelMet ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-black">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>DP 2 Siap ({verifiedCount}/{allPersonnels.length})</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{verifiedCount}/{allPersonnels.length} · Min. 22</span>
                  </span>
                )}
              </div>
            </div>

            {/* Inspection Workspace Body */}
            <div className="p-4 sm:p-5">
              <PersonnelSwipeDeck
                team={activeTeam}
                personnels={allPersonnels}
                inspections={dp1TeamInspections}
                canOperate={canOperateDP}
                onInspect={handleInspectPersonnel}
                onVerifyAll={handleVerifyAll}
                onNextTeam={() => handleCycleTeam(1)}
                hasNextTeam={posTeams.length > 1}
                isMinPersonnelMet={isMinPersonnelMet}
                viewMode={deckViewMode}
                onViewModeChange={setDeckViewMode}
              />
            </div>
          </section>
        )}
      </div>
    </SimpaskorSidebarLayout>
  );
}
