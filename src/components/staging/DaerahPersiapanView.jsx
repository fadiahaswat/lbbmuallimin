import React, { useState } from 'react';
import {
  Clock,
  ShieldCheck,
  Users,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Timer,
  ChevronRight,
  ArrowRight,
  Tablet,
  UserCheck,
  UserX,
  Eye,
  Check,
  Sparkles,
  DoorOpen,
  Building2
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { COMPETITION } from '../../config.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function DaerahPersiapanView() {
  const {
    teams,
    staging,
    updateDP1PersonnelInspection,
    passToDP2,
    fieldTimer,
    startFieldTimer,
    pauseFieldTimer,
    resumeFieldTimer,
    resetFieldTimer,
    stopAndSaveFieldTimer,
    currentUser,
    role
  } = useCompetition();

  const userRole = currentUser?.role || role || 'publik';
  // Hanya Petugas Khusus Daerah Persiapan (dp@lbbmuallimin.com) dan Superadmin
  const canOperateDP = ['dp', 'staging', 'superadmin'].includes(userRole);

  const [activeSubTab, setActiveSubTab] = useState('dp1'); // 'dp1' | 'dp2' | 'dp3'
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  // Teams that have checked-in and are ready for DP
  const checkedInTeams = teams.filter(t => staging?.basecamp?.[t.id]?.checkedIn);

  // Fallback to first checked in team if not selected
  const activeTeam = teams.find(t => t.id === selectedTeamId) || checkedInTeams[0];

  const dp1TeamInspections = activeTeam ? staging?.dp1?.[activeTeam.id]?.personnels || {} : {};
  const isTeamDP1Passed = activeTeam ? staging?.dp1?.[activeTeam.id]?.passed : false;

  // Personnels list for active team
  const danton = activeTeam?.roster?.danton ? [{ ...activeTeam.roster.danton, role: 'danton', id: 'danton' }] : [];
  const pasukan = Array.isArray(activeTeam?.roster?.pasukan) ? activeTeam.roster.pasukan : [];
  const cadangan = Array.isArray(activeTeam?.roster?.cadangan) ? activeTeam.roster.cadangan : [];
  const allPersonnels = [...danton, ...pasukan, ...cadangan];

  const verifiedCount = allPersonnels.filter(p => dp1TeamInspections[p.id]?.verified).length;
  const isMinPersonnelMet = verifiedCount >= 22; // Min 1 Danton + 21 Pasukan

  const handleTogglePersonnel = (personnelId) => {
    if (!canOperateDP || !activeTeam) return;
    const current = dp1TeamInspections[personnelId]?.verified;
    updateDP1PersonnelInspection(activeTeam.id, personnelId, !current);
  };

  const handleVerifyAll = () => {
    if (!canOperateDP || !activeTeam) return;
    allPersonnels.forEach(p => {
      updateDP1PersonnelInspection(activeTeam.id, p.id, true);
    });
  };

  const handlePassDP1 = () => {
    if (!canOperateDP || !activeTeam) return;
    passToDP2(activeTeam.id);
    alert(`Peleton ${activeTeam.schoolName} resmi lolos DP 1 dan diteruskan ke Pos DP 2 (Warming Up)!`);
    setActiveSubTab('dp2');
  };

  // Timer calculations
  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const maxDurationSec = activeTeam?.jenjang === 'SD' ? 10 * 60 : 13 * 60;
  const isOvertime = fieldTimer.elapsedSeconds > maxDurationSec;

  return (
    <SimpaskorSidebarLayout
      activeMenu="dp"
      title="Daerah Persiapan (DP 1, 2, 3)"
      subtitle="Inspeksi fisik 25 personel (Tablet), area pemanasan DP 2, & gate masuk arena DP 3"
    >
      <div className="space-y-6">

        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Tahap 5: Filter & Antrean Lapangan</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Daerah Persiapan & Verifikasi Lapangan
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Pemeriksaan ketat kesesuaian fisik 25 personel peleton sebelum tampil, pemanasan warming up di DP 2, dan sinkronisasi timer digital lapangan di DP 3.
              </p>
            </div>

            {/* Sub-Pos Stepper Selector */}
            <div className="flex items-center gap-1.5 p-1.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl shrink-0">
              <button
                type="button"
                onClick={() => setActiveSubTab('dp1')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeSubTab === 'dp1' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                1. DP 1 (Inspeksi)
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('dp2')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeSubTab === 'dp2' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                2. DP 2 (Warming Up)
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('dp3')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeSubTab === 'dp3' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                3. DP 3 (Gate & Timer)
              </button>
            </div>
          </div>
        </div>

        {/* Peleton Selector Bar */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-slate-400 pl-2">Peleton di DP:</span>
            {checkedInTeams.length === 0 ? (
              <span className="text-xs text-slate-400 italic">Belum ada tim yang Check-In Basecamp</span>
            ) : (
              checkedInTeams.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTeamId(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeTeam?.id === t.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  No {t.lotNumber ? String(t.lotNumber).padStart(2, '0') : '-'} • {t.schoolName}
                </button>
              ))
            )}
          </div>
        </div>

        {/* SUB-VIEW 1: DP 1 (INSPEKSI PERSONEL TABLET/IPAD) */}
        {activeSubTab === 'dp1' && (
          <div className="space-y-5 animate-in fade-in">
            {activeTeam ? (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-mono font-black text-lg flex items-center justify-center shadow-md shadow-blue-600/30">
                      {activeTeam.lotNumber ? String(activeTeam.lotNumber).padStart(2, '0') : '#'}
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">{activeTeam.schoolName}</h3>
                      <p className="text-xs text-slate-500 font-mono">
                        {activeTeam.regCode} • Jenjang {activeTeam.jenjang} • Danton: {activeTeam.dantonName || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Terverifikasi</span>
                      <span className="text-sm font-black font-mono text-blue-700">
                        {verifiedCount}/{allPersonnels.length} Personel
                      </span>
                    </div>

                    {canOperateDP && (
                      <button
                        type="button"
                        onClick={handleVerifyAll}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Verifikasi Semua
                      </button>
                    )}

                    {canOperateDP && (
                      <button
                        type="button"
                        onClick={handlePassDP1}
                        disabled={!isMinPersonnelMet}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase rounded-xl transition-all shadow-md shadow-emerald-900/20 cursor-pointer disabled:opacity-40"
                      >
                        Loloskan ke DP 2
                      </button>
                    )}
                  </div>
                </div>

                {/* Personnel Grid Inspection Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allPersonnels.map((p, idx) => {
                    const isChecked = dp1TeamInspections[p.id]?.verified;
                    const isDanton = p.role === 'danton';
                    const isCadangan = p.role === 'cadangan';

                    return (
                      <div
                        key={p.id || idx}
                        onClick={() => handleTogglePersonnel(p.id)}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer select-none ${
                          isChecked
                            ? 'bg-blue-50/70 border-blue-300 text-slate-900 shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isDanton
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : isCadangan
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {isDanton ? 'DAN' : isCadangan ? `C${idx - 21}` : `P${idx}`}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-black text-slate-900 truncate">{p.name || 'Nama Personel'}</div>
                            <div className="text-[10px] text-slate-400 font-mono truncate">NISN: {p.nisn || '-'} • Kls {p.class || '-'}</div>
                          </div>
                        </div>

                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                          isChecked ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-300 border border-slate-200'
                        }`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <Users className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-black text-slate-800">Belum Ada Peleton di Daerah Persiapan</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Peleton harus melakukan Check-In di Basecamp terlebih dahulu untuk dapat diinspeksi di DP 1.
                </p>
              </div>
            )}
          </div>
        )}

        {/* SUB-VIEW 2: DP 2 (WARMING UP / PEMANASAN) */}
        {activeSubTab === 'dp2' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase">Pos DP 2: Area Pemanasan & Warming Up</h3>
                <p className="text-xs text-slate-500">Alokasi waktu pemanasan maksimal 10 menit sebelum masuk pintu DP 3</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block">Peleton Saat Ini di DP 2:</span>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-mono font-black text-base flex items-center justify-center">
                    {activeTeam?.lotNumber ? String(activeTeam.lotNumber).padStart(2, '0') : '#'}
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{activeTeam?.schoolName || 'Tidak ada tim'}</h4>
                    <p className="text-xs text-slate-500">{activeTeam?.jenjang} • Danton: {activeTeam?.dantonName || '-'}</p>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                  ⚠️ Peleton diimbau tidak bersorak keras agar tidak mengganggu dewan juri di arena utama.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-black uppercase text-indigo-900 block">Kesiapan Masuk Arena</span>
                  <p className="text-xs text-slate-600 mt-1">
                    Setelah pemanasan selesai, arahkan pasukan bergerak menuju Pos DP 3 (Gate Pintu Masuk Lapangan).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('dp3')}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Lanjutkan ke Gate DP 3</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUB-VIEW 3: DP 3 (GATE PINTU ARENA & TIMER LAPANGAN) */}
        {activeSubTab === 'dp3' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                <DoorOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase">Pos DP 3: Gate Pintu Masuk & Stopwatch Arena</h3>
                <p className="text-xs text-slate-500">Peleton bersiap langkah tegap masuk saat aba-aba pos dimulai</p>
              </div>
            </div>

            {/* Stopwatch Arena Card */}
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl border border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Stopwatch Pertandingan Terpadu
              </span>

              <div className={`text-5xl sm:text-7xl font-mono font-black tracking-tight ${
                isOvertime ? 'text-red-500 animate-pulse' : 'text-emerald-400'
              }`}>
                {formatTimer(fieldTimer.elapsedSeconds)}
              </div>

              <p className="text-xs text-slate-400">
                Batas Waktu: {activeTeam?.jenjang === 'SD' ? '10 Menit (SD/MI)' : '13 Menit (SMP/MTs)'}
                {isOvertime && <span className="text-red-400 font-bold block mt-1">⚠️ Melewati batas waktu resmi! Sanksi penalti berlaku.</span>}
              </p>

              {/* Stopwatch Controls */}
              {canOperateDP && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  {!fieldTimer.isRunning ? (
                    <button
                      type="button"
                      onClick={() => startFieldTimer(activeTeam?.id)}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-950 flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Mulai Timer</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={pauseFieldTimer}
                      className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-950 flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Jeda Timer</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={resetFieldTimer}
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      stopAndSaveFieldTimer(activeTeam?.id);
                      alert(`Waktu tampil ${activeTeam?.schoolName} (${formatTimer(fieldTimer.elapsedSeconds)}) berhasil disimpan ke rekap nilai!`);
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-950 flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Selesai & Simpan</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </SimpaskorSidebarLayout>
  );
}
