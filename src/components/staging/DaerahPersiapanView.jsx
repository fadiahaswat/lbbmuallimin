import React, { useState, useMemo } from 'react';
import {
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Search,
  Sparkles,
  ShieldCheck,
  X,
  Building2,
  Clock
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { formatImageUrl } from '../../services/sheetService.js';
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

  // 3. 3 Cadangan
  const cadanganArr = Array.isArray(r.cadangan) ? r.cadangan : [];
  const cadanganTotal = Math.max(3, cadanganArr.length);
  for (let i = 0; i < cadanganTotal; i++) {
    const c = cadanganArr[i] || {};
    const num = i + 1;
    const cid = c.id || `c-${num}`;
    list.push({
      id: cid,
      aliasKeys: getPersonnelAliasKeys(cid),
      code: `C${num}`,
      roleType: 'cadangan',
      roleLabel: `Personel Cadangan ${num}`,
      name: c.name || `Cadangan ${num}`,
      nisn: c.nisn || '-',
      className: c.class || '-',
      birthPlace: c.birthPlace || '',
      birthDate: c.birthDate || '',
      medicalHistory: c.medicalHistory || '',
      photo: c.photo || null,
    });
  }

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
    currentUser,
    role
  } = useCompetition();

  const userRole = currentUser?.role || role || 'publik';
  const canOperateDP = ['dp', 'staging', 'superadmin'].includes(userRole);

  const isTeamCheckedIn = (teamId) => {
    const st = staging?.[teamId] || staging?.basecamp?.[teamId];
    return Boolean(
      st?.checkedIn ||
      st?.basecampLogistics?.ktpDeposited ||
      st?.basecamp?.ktpDeposited ||
      (st?.stage && st.stage !== 'waiting')
    );
  };

  // Semua peleton yang sudah Check-In Basecamp, diurutkan berdasarkan nomor dada / undian
  const checkedInTeams = useMemo(() => {
    return teams
      .filter(t => isTeamCheckedIn(t.id))
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
  }, [teams, staging]);

  const sdCheckedInTeams = useMemo(() => checkedInTeams.filter(t => t.jenjang === 'SD'), [checkedInTeams]);
  const smpCheckedInTeams = useMemo(() => checkedInTeams.filter(t => t.jenjang === 'SMP'), [checkedInTeams]);

  // Pos aktif: 'SD' (DP 1 SD/MI) | 'SMP' (DP 1 SMP/MTs)
  const [activePosJenjang, setActivePosJenjang] = useState(() => {
    if (sdCheckedInTeams.length === 0 && smpCheckedInTeams.length > 0) return 'SMP';
    return 'SD';
  });
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [isPickerOpen, setIsPickerOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL'); // 'ALL' | 'WAITING' | 'READY'
  const [toastMsg, setToastMsg] = useState(null);

  const showNotice = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(prev => (prev === msg ? null : prev));
    }, 3600);
  };

  const posTeams = activePosJenjang === 'SD' ? sdCheckedInTeams : smpCheckedInTeams;

  const getTeamStageMeta = (team) => {
    const st = staging?.[team.id] || {};
    const inspections = st.dp1Inspections || staging?.dp1?.[team.id]?.personnels || {};
    const personnels = buildTeamPersonnels(team);
    const verified = personnels.filter(p =>
      p.aliasKeys.some(k => inspections[k]?.verified === true)
    ).length;
    const hasExplicitInspections = Object.keys(inspections).length > 0;
    const isPassedDP1 = verified >= 22 || (!hasExplicitInspections && Boolean(st.dp1Passed));

    let stageLabel = 'Antrean DP 1';
    let badgeTone = 'bg-slate-100 text-slate-700 border-slate-200';
    if (st.stage === 'finished' || st.stage === 'checkout') {
      stageLabel = 'Selesai Tampil';
      badgeTone = 'bg-slate-900 text-white border-slate-900';
    } else if (isPassedDP1) {
      stageLabel = 'DP 2 • Siap Dinilai';
      badgeTone = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (verified > 0) {
      stageLabel = 'Sedang Dicek DP 1';
      badgeTone = 'bg-blue-50 text-blue-700 border-blue-200';
    }

    return {
      inspections,
      personnels,
      verified,
      total: personnels.length,
      isPassedDP1,
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
    const found = posTeams.find(t => t.id === selectedTeamId);
    return found || null;
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

    // Notifikasi otomatis saat tepat mencapai ambang 22 personel
    const wasAlreadyChecked = person.aliasKeys.some(k => dp1TeamInspections[k]?.verified === true);
    if (isVerified && !wasAlreadyChecked && prevVerified === 21) {
      showNotice(`${activeTeam.schoolName} mencapai 22 personel — otomatis masuk DP 2 & Siap Dinilai!`);
    }
  };

  const handleVerifyAll = () => {
    if (!canOperateDP || !activeTeam) return;
    updateDP1PersonnelInspection(activeTeam.id, allPersonnels.map(p => p.id), true, '');
    showNotice(`25 personel ${activeTeam.schoolName} terverifikasi — otomatis masuk DP 2 & Siap Dinilai!`);
  };

  const isSDPos = activePosJenjang === 'SD';
  const showPickerScreen = !activeTeam || isPickerOpen;

  return (
    <SimpaskorSidebarLayout
      activeMenu="dp"
      title={`Pos DP 1 ${isSDPos ? 'SD / MI' : 'SMP / MTs'}`}
      subtitle="Inspeksi pasfoto & fisik 25 personel — otomatis masuk DP 2 & siap dinilai Dewan Juri"
      rightActions={
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => handleSwitchPos('SD')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              isSDPos
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isSDPos ? 'bg-white' : 'bg-red-500'}`} />
            <span>DP 1 SD / MI</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
              isSDPos ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
            }`}>
              {sdCheckedInTeams.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchPos('SMP')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              !isSDPos
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${!isSDPos ? 'bg-white' : 'bg-blue-500'}`} />
            <span>DP 1 SMP / MTs</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
              !isSDPos ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
            }`}>
              {smpCheckedInTeams.length}
            </span>
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Toast Notification Non-Blocking */}
        {toastMsg && (
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between gap-3 text-xs font-semibold">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMsg(null)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* LANGKAH 1: PEMILIHAN PELETON DI POS DP 1 SD / DP 1 SMP         */}
        {/* ============================================================== */}
        {posTeams.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Building2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-black text-slate-800">
              Belum Ada Peleton {isSDPos ? 'SD / MI' : 'SMP / MTs'} di Antrean DP 1
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Peleton jenjang {isSDPos ? 'SD / MI' : 'SMP / MTs'} akan otomatis masuk ke Pos DP 1 ini segera setelah melakukan Check-In di Pos Basecamp.
            </p>
            {(isSDPos ? smpCheckedInTeams.length > 0 : sdCheckedInTeams.length > 0) && (
              <button
                type="button"
                onClick={() => handleSwitchPos(isSDPos ? 'SMP' : 'SD')}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Buka Pos DP 1 {isSDPos ? `SMP / MTs (${smpCheckedInTeams.length} Tim)` : `SD / MI (${sdCheckedInTeams.length} Tim)`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : showPickerScreen ? (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
            {/* Header Pemilihan Peleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    isSDPos
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    Pos DP 1 {isSDPos ? 'SD / MI' : 'SMP / MTs'}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    Min. 22 personel cocok → otomatis ke DP 2 &amp; siap dinilai
                  </span>
                </div>
                <h2 className="text-lg font-black text-slate-900 mt-1">
                  Pilih Peleton {isSDPos ? 'SD / MI' : 'SMP / MTs'} untuk Inspeksi Fisik
                </h2>
              </div>

              {activeTeam && (
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 self-start sm:self-center cursor-pointer transition-colors"
                >
                  <span>Kembali ke {activeTeam.schoolName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Cari sekolah ${isSDPos ? 'SD/MI' : 'SMP/MTs'}, nomor dada, atau danton...`}
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-colors"
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

              {/* Filter Status Antrean */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/70 self-start sm:self-auto">
                {[
                  { id: 'ALL', label: `Semua (${posTeams.length})` },
                  { id: 'WAITING', label: `Belum Selesai (${waitingCount})` },
                  { id: 'READY', label: `Siap Dinilai (${readyCount})` }
                ].map(st => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStageFilter(st.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      stageFilter === st.id
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Kartu Peleton */}
            {filteredPosTeams.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Tidak ada peleton {isSDPos ? 'SD / MI' : 'SMP / MTs'} yang cocok dengan filter pencarian.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                {filteredPosTeams.map((team) => {
                  const meta = getTeamStageMeta(team);
                  const logoUrl = getTeamLogoUrl(team);
                  const isSelected = activeTeam?.id === team.id;
                  const dantonName = team.roster?.danton?.name || team.dantonName || '-';
                  const pct = meta.total ? Math.round((meta.verified / meta.total) * 100) : 0;
                  const numBadge = team.chestNumber || (team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '#');

                  return (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => handleSelectTeam(team.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer group flex flex-col justify-between gap-3.5 ${
                        isSelected
                          ? isSDPos
                            ? 'bg-red-50/30 border-red-500 ring-2 ring-red-500/15 shadow-sm'
                            : 'bg-blue-50/40 border-blue-500 ring-2 ring-blue-500/15 shadow-sm'
                          : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Nomor Dada / Logo */}
                          <div className="relative w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt={team.schoolName}
                                className="w-full h-full object-contain p-1.5 bg-white"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <span className="font-mono font-black text-sm text-slate-700">
                                {numBadge}
                              </span>
                            )}
                            {numBadge !== '#' && logoUrl && (
                              <span className="absolute -bottom-0.5 -right-0.5 px-1.5 py-0.5 bg-slate-900 text-white text-[9px] font-mono font-black rounded-tl-lg">
                                #{numBadge}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                isSDPos
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}>
                                {team.jenjang}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 truncate">
                                No. Dada {team.chestNumber || (team.lotNumber ? String(team.lotNumber).padStart(2, '0') : '-')}
                              </span>
                            </div>
                            <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-1 group-hover:text-slate-950 transition-colors" title={team.schoolName}>
                              {team.schoolName}
                            </h3>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              Danton: {dantonName}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Progress & Auto-DP2 Status Footer */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta.badgeTone}`}>
                            {meta.stageLabel}
                          </span>
                          <span className="font-mono font-bold text-slate-700">
                            {meta.verified}/{meta.total} Cocok
                          </span>
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
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ============================================================== */
          /* LANGKAH 2: INSPEKSI SWIPE KARTU FOTO 25 PERSONEL (FOKUS DP 1)  */
          /* ============================================================== */
          <div className="space-y-5">
            {/* Compact Active Peleton Command Bar */}
            <div className="bg-white rounded-2xl p-3.5 sm:px-5 sm:py-4 border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
              <div className="flex items-center gap-3 min-w-0">
                {/* Back to Pos Team Picker Button */}
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(true)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  title={`Buka Daftar Peleton DP 1 ${isSDPos ? 'SD/MI' : 'SMP/MTs'}`}
                >
                  <Users className={`w-3.5 h-3.5 ${isSDPos ? 'text-red-600' : 'text-blue-600'}`} />
                  <span>Pilih Peleton {isSDPos ? 'SD' : 'SMP'}</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-white text-slate-600 text-[10px] font-mono">
                    {posTeams.length}
                  </span>
                </button>

                {/* Prev / Next Quick Switcher within same Pos */}
                {posTeams.length > 1 && (
                  <div className="hidden sm:flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCycleTeam(-1)}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer"
                      title="Peleton Sebelumnya"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCycleTeam(1)}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer"
                      title="Peleton Berikutnya"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="h-8 w-px bg-slate-200 hidden sm:block shrink-0" />

                {/* Active Team Identity */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1 shadow-sm">
                    {getTeamLogoUrl(activeTeam) ? (
                      <img
                        src={getTeamLogoUrl(activeTeam)}
                        alt={activeTeam.schoolName}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className={`font-mono font-black text-xs ${isSDPos ? 'text-red-700' : 'text-blue-700'}`}>
                        {activeTeam.chestNumber || (activeTeam.lotNumber ? String(activeTeam.lotNumber).padStart(2, '0') : '#')}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                      {activeTeam.schoolName}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono truncate">
                      DP 1 {activeTeam.jenjang} • Danton: {activeTeam.roster?.danton?.name || activeTeam.dantonName || '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Automatic DP 2 & Scoring Status */}
              <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {isMinPersonnelMet ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Otomatis di DP 2 • Siap Dinilai</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Kurang {Math.max(0, 22 - verifiedCount)} lagi → Otomatis DP 2</span>
                  </span>
                )}

                <span className="text-xs font-mono font-black text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/70">
                  {verifiedCount}/{allPersonnels.length} Personel
                </span>
              </div>
            </div>

            {/* TINDER SWIPE INSPECTION DECK */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm">
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
              />
            </div>
          </div>
        )}
      </div>
    </SimpaskorSidebarLayout>
  );
}
