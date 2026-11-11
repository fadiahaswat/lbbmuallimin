import React from 'react';
import {
  ShieldAlert,
  Edit3,
  Save,
  Printer,
  ArrowUpDown,
  User,
  Users,
  Shield,
  Award,
  Upload,
  Camera,
  GripVertical,
  Phone,
  HeartPulse,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { formatImageUrl, getFallbackImageUrl } from '../../../../services/sheetService.js';

// Format helper untuk label kelas agar tidak dobel "Kelas Kelas"
const formatGradeDisplay = (cls, prefix = 'Kelas') => {
  if (!cls) return '-';
  const clean = String(cls).replace(/^(kelas|kls)\s*/i, '').trim();
  return clean ? `${prefix} ${clean}` : '-';
};

// Helper untuk ekstrak inisial nama yang rapi (mengabaikan gelar seperti Drs., Ust., dsb)
const getPersonInitials = (name) => {
  if (!name || typeof name !== 'string') return '?';
  const clean = name.replace(/^(Drs\.|Dr\.|Ir\.|H\.|Hj\.|Ust\.|Ustz\.|M\.)\s*/gi, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

// Deteksi apakah foto masih berupa URL placeholder / ui-avatars default
const isPlaceholderAvatar = (url) => {
  if (!url || typeof url !== 'string') return true;
  if (url === '#' || url.startsWith('#')) return true;
  if (url.includes('ui-avatars.com')) return true;
  return false;
};

export default function RosterTab({
  currentTeam,
  isEditingRoster,
  setIsEditingRoster,
  rosterDraft,
  setRosterDraft,
  initRosterDraft,
  handleSaveRoster,
  handleCancelRoster,
  handleDiscardRosterDraft,
  openModal,
  draggedMember,
  setDraggedMember,
  dragOverTarget,
  setDragOverTarget,
  swapRosterMembers,
  triggerRosterPhotoUpload,
  availableClassOptions,
  isRosterLocked,
  onOpenPactModal
}) {
  const hasSavedLocalDraft = Boolean(
    typeof window !== 'undefined' &&
    currentTeam?.id &&
    localStorage.getItem(`lbb_roster_draft_${currentTeam.id}`)
  );

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/90 shadow-xs space-y-4 sm:space-y-6">
      {/* Banner Penguncian Data Personel H-TM (Bab A.9.c) */}
      {isRosterLocked && (
        <div className="p-3.5 sm:p-4 bg-slate-900 text-white rounded-2xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                  Data Terkunci (Read-Only)
                </span>
                <span className="text-[10px] text-slate-400">Juknis Bab A.9.c</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                Batas pengubahan data personel berakhir sebelum Technical Meeting (9 Jan 2027). Perubahan hanya dapat diproses melalui surat resmi Kepala Sekolah kepada Panitia.
              </p>
            </div>
          </div>
          {onOpenPactModal && (
            <button
              type="button"
              onClick={onOpenPactModal}
              className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Pakta TM</span>
            </button>
          )}
        </div>
      )}

      {currentTeam.status === 'pending' ? (
        <div className="p-6 sm:p-8 bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-2xl sm:rounded-3xl text-center space-y-3 sm:space-y-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 text-amber-700 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-xs">
            <ShieldAlert className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h4 className="font-black text-base sm:text-lg text-slate-900 uppercase">
              Tahap Pengisian Roster Masih Terkunci
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
              Peleton Anda masih <strong>Menunggu Verifikasi Pendaftaran Awal</strong>. Panitia sedang memvalidasi berkas pendaftaran Anda.
            </p>
            <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-amber-200 text-[11px] sm:text-xs text-amber-900 font-bold mt-2">
              Pengisian biodata 25 personel peleton akan otomatis terbuka setelah pendaftaran disetujui (ACC).
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 sm:pb-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0">
              <span className="relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-md mt-0.5 sm:mt-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-600" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap">
                  <p className="section-kicker">PORTAL KONTINGEN</p>
                  {isRosterLocked ? (
                    <span className="text-[9px] sm:text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded-md shrink-0">
                      Terkunci H-TM
                    </span>
                  ) : hasSavedLocalDraft && !isEditingRoster ? (
                    <span className="text-[9px] sm:text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md shrink-0">
                      Ada Draft
                    </span>
                  ) : null}
                </div>
                <h4 className="font-black text-sm sm:text-lg md:text-xl text-slate-900 uppercase tracking-tight leading-snug mt-0.5">
                  Susunan Personel Peleton
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">
                  1 komandan, 21 pasukan inti (3 saf × 7 banjar), 3 cadangan, dan official pendamping.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {!isEditingRoster ? (
                <button
                  onClick={isRosterLocked ? undefined : initRosterDraft}
                  disabled={isRosterLocked}
                  className={`flex-1 sm:flex-none justify-center px-3.5 py-2 sm:py-2.5 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs ${
                    isRosterLocked
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-red-700 hover:bg-red-800 text-white active:scale-95 cursor-pointer shadow-md'
                  }`}
                  title={isRosterLocked ? 'Data personel telah dikunci menjelang Technical Meeting (Bab A.9.c)' : 'Edit Susunan Personel'}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isRosterLocked ? 'Data Terkunci' : hasSavedLocalDraft ? 'Lanjutkan Edit' : 'Edit Personel'}</span>
                </button>
              ) : (
                <>
                  {hasSavedLocalDraft && (
                    <button
                      type="button"
                      onClick={handleDiscardRosterDraft}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs rounded-xl transition-all active:scale-95 cursor-pointer"
                      title="Hapus draft yang belum disimpan"
                    >
                      Batal Draft
                    </button>
                  )}
                  <button
                    onClick={handleCancelRoster ? handleCancelRoster : () => {
                      setIsEditingRoster(false);
                      setDraggedMember(null);
                      setDragOverTarget(null);
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all active:scale-95 cursor-pointer"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={handleSaveRoster}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan</span>
                  </button>
                </>
              )}
              <button
                onClick={() => openModal('docViewer', { docId: 'form-b', team: currentTeam })}
                className="flex-1 sm:flex-none justify-center px-3.5 py-2 sm:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Biodata</span>
              </button>
            </div>
          </div>

          {/* 4-Item Summary Metric Strip (Figma Make Style) */}
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] bg-slate-800 p-px shadow-[0_14px_32px_rgba(15,23,42,0.12)] sm:grid-cols-4">
            {[
              { val: '25', label: 'Personel Aktif', note: 'Lengkap' },
              { val: '21', label: 'Pasukan Inti', note: '3 Saf' },
              { val: '03', label: 'Cadangan', note: 'Siap Tugas' },
              { val: '03', label: 'Official', note: 'Terverifikasi' },
            ].map(m => (
              <div key={m.label} className="bg-slate-950 px-4 py-3.5 text-white">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xl font-black tracking-tight font-mono">{m.val}</p>
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="mt-1 text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">
                  {m.label}
                </p>
                <p className="mt-0.5 text-[8px] font-semibold text-emerald-400">{m.note}</p>
              </div>
            ))}
          </div>

          {isEditingRoster && (
            <div className="bg-gradient-to-r from-blue-50 to-amber-50 border border-blue-200 p-3.5 rounded-2xl flex items-center justify-between text-xs text-blue-900 gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600 text-white rounded-lg shrink-0">
                  <ArrowUpDown className="w-4 h-4" />
                </div>
                <span>
                  <strong>Fitur Geser / Drag & Drop Aktif:</strong> Tarik (drag) kartu anggota mana saja untuk menukar posisi antar saf, banjar, ataupun dengan <strong>Personel Cadangan</strong>.
                </span>
              </div>
              {draggedMember && (
                <span className="text-[11px] font-bold bg-blue-600 text-white px-2.5 py-1 rounded-full animate-pulse shrink-0">
                  Sedang menarik: {draggedMember.type === 'pasukan' ? 'Pasukan Inti' : 'Cadangan'}
                </span>
              )}
            </div>
          )}

          {/* Pimpinan & Pendamping Peleton (4 Personel) - Harmonized & Perfectly Balanced in 1 Clean Container */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-4 sm:p-5 space-y-3.5">
            <div className="font-black text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <span>Pimpinan & Pendamping Peleton</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                4 Personel (1 Komandan + 3 Official)
              </span>
            </div>

            {(() => {
              const dantonPhotoUrl = isEditingRoster ? rosterDraft?.danton?.photo : currentTeam.roster?.danton?.photo;
              const hasDantonPhoto = dantonPhotoUrl && typeof dantonPhotoUrl === 'string' && dantonPhotoUrl !== '#' && !dantonPhotoUrl.startsWith('#') && !dantonPhotoUrl.includes('drive.google.com/open?id=');
              const dantonName = isEditingRoster ? rosterDraft?.danton?.name : currentTeam.roster?.danton?.name || currentTeam.dantonName;
              const dantonBirthPlace = isEditingRoster ? rosterDraft?.danton?.birthPlace : currentTeam.roster?.danton?.birthPlace;
              const dantonBirthDate = isEditingRoster ? rosterDraft?.danton?.birthDate : currentTeam.roster?.danton?.birthDate;
              const dantonClass = isEditingRoster ? rosterDraft?.danton?.class : currentTeam.roster?.danton?.class;
              const dantonNisn = isEditingRoster ? rosterDraft?.danton?.nisn : currentTeam.roster?.danton?.nisn;
              const dantonMedical = isEditingRoster ? rosterDraft?.danton?.medicalHistory : currentTeam.roster?.danton?.medicalHistory;

              const officialsList = isEditingRoster ? (rosterDraft?.officials || []) : (currentTeam.roster?.officials || []);

              return !isEditingRoster ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-stretch">
                  {/* Card 1: Komandan Peleton (Danton) */}
                  <div className="group/dcard bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-red-400/60 transition-all duration-300 overflow-hidden flex flex-col justify-between">
                    {/* Pasfoto 3:4 Full Width */}
                    <div className="aspect-[3/4] w-full bg-slate-800 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                      {hasDantonPhoto ? (
                        <img
                          src={formatImageUrl(dantonPhotoUrl)}
                          alt={dantonName || 'Danton'}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/dcard:scale-105"
                          onError={(e) => {
                            const fallback = getFallbackImageUrl(dantonPhotoUrl);
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
                        className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-800 p-2"
                        style={{ display: hasDantonPhoto ? 'none' : 'flex' }}
                      >
                        <span className="text-3xl sm:text-4xl font-black tracking-wider text-slate-300 select-none">
                          {getPersonInitials(dantonName)}
                        </span>
                      </div>

                      <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold shadow-xs uppercase tracking-wider">
                        Danton
                      </span>
                    </div>

                    {/* Identitas Danton */}
                    <div className="p-3 text-left space-y-1">
                      <span className="font-black text-xs text-slate-900 block leading-tight break-words uppercase min-h-[1.8rem] flex items-center group-hover/dcard:text-red-700 transition-colors">
                        {dantonName || '-'}
                      </span>
                      <div className="text-[10px] text-slate-600 leading-tight truncate">
                        {dantonBirthPlace ? `${dantonBirthPlace}${dantonBirthDate ? `, ${dantonBirthDate}` : ''}` : 'Pemimpin Barisan'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-100 pt-1">
                        <span>{formatGradeDisplay(dantonClass, 'Kls')}</span>
                        <span>NISN: {dantonNisn || '-'}</span>
                      </div>
                      {dantonMedical && (
                        <div className="text-[9px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 truncate mt-0.5" title={`Catatan Medis: ${dantonMedical}`}>
                          🩺 {dantonMedical}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cards 2, 3, 4: 3 Pendamping Peleton */}
                  {Array.isArray(officialsList) && officialsList.map((off, i) => {
                    const isMainOfficial = i === 0 || off.category === 'official';
                    const badgeLabel = isMainOfficial ? 'Official' : i === 1 ? 'Medis' : 'Logistik';
                    const roleSubTitle = isMainOfficial
                      ? 'Pelatih / Pembina'
                      : i === 1
                      ? 'Medis & Dokumentasi'
                      : 'Logistik & Lapangan';
                    const hasPhoto = off.photo && typeof off.photo === 'string' && off.photo !== '#' && !off.photo.startsWith('#') && !off.photo.includes('drive.google.com/open?id=');
                    const badgeBg = isMainOfficial ? 'bg-blue-600' : i === 1 ? 'bg-emerald-600' : 'bg-slate-700';

                    return (
                      <div
                        key={off.id || i}
                        className="group/offcard bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-400/60 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                      >
                        {/* Pasfoto 3:4 Full Width */}
                        <div className="aspect-[3/4] w-full bg-slate-800 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                          {hasPhoto ? (
                            <img
                              src={formatImageUrl(off.photo)}
                              alt={off.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/offcard:scale-105"
                              onError={(e) => {
                                const fallback = getFallbackImageUrl(off.photo);
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
                            className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-800 p-2"
                            style={{ display: hasPhoto ? 'none' : 'flex' }}
                          >
                            <span className="text-3xl sm:text-4xl font-black tracking-wider text-slate-300 select-none">
                              {getPersonInitials(off.name)}
                            </span>
                          </div>

                          <span className={`absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md ${badgeBg} text-white text-[10px] font-bold shadow-xs uppercase tracking-wider`}>
                            {badgeLabel}
                          </span>
                        </div>

                        {/* Identitas Pendamping */}
                        <div className="p-3 text-left space-y-1">
                          <span
                            className="font-black text-xs text-slate-900 block leading-tight break-words uppercase min-h-[1.8rem] flex items-center group-hover/offcard:text-blue-700 transition-colors"
                            title={off.name}
                          >
                            {off.name || '-'}
                          </span>
                          <div className="text-[10px] text-slate-600 leading-tight truncate">
                            {off.role || roleSubTitle}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-100 pt-1">
                            <span>No. WA</span>
                            <span className="text-emerald-700 font-bold truncate">{off.phone || '-'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Mode Edit Roster: 4 Cards dalam Grid yang Sama */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-stretch">
                  {/* Edit Card 1: Danton */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-3 space-y-2.5 flex flex-col justify-between">
                    <div className="relative group shrink-0">
                      <div
                        onClick={() => triggerRosterPhotoUpload({ type: 'danton' })}
                        className="aspect-[3/4] w-full rounded-xl bg-slate-800 border border-slate-200 shadow-inner relative overflow-hidden flex items-center justify-center cursor-pointer group hover:border-red-500 transition-colors"
                        title="Klik untuk unggah pasfoto Danton"
                      >
                        {hasDantonPhoto ? (
                          <img
                            src={formatImageUrl(dantonPhotoUrl)}
                            alt={dantonName || 'Danton'}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-800 p-2">
                            <span className="text-3xl font-black text-slate-300">
                              {getPersonInitials(dantonName)}
                            </span>
                          </div>
                        )}
                        <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold shadow-xs uppercase tracking-wider">
                          Danton
                        </span>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-[10px] font-bold">
                          <Camera className="w-3.5 h-3.5" />
                          <span>Ganti Foto</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => triggerRosterPhotoUpload({ type: 'danton' })}
                        className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-amber-400 text-slate-950 shadow-xs hover:bg-amber-300 transition-all cursor-pointer"
                        title="Unggah Pasfoto Danton"
                      >
                        <Upload className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-1.5 text-left pt-1">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Nama Danton</label>
                        <input
                          type="text"
                          placeholder="Nama Lengkap Danton"
                          value={rosterDraft?.danton?.name || ''}
                          onChange={e => setRosterDraft({
                            ...rosterDraft,
                            danton: { ...rosterDraft.danton, name: e.target.value }
                          })}
                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          placeholder="NISN"
                          value={rosterDraft?.danton?.nisn || ''}
                          onChange={e => setRosterDraft({
                            ...rosterDraft,
                            danton: { ...rosterDraft.danton, nisn: e.target.value }
                          })}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                        <select
                          value={rosterDraft?.danton?.class || ''}
                          onChange={e => setRosterDraft({
                            ...rosterDraft,
                            danton: { ...rosterDraft.danton, class: e.target.value }
                          })}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-red-500"
                        >
                          <option value="">Kelas</option>
                          {availableClassOptions.map(cls => (
                            <option key={cls} value={cls}>Kelas {cls}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          placeholder="Kota Lahir"
                          value={rosterDraft?.danton?.birthPlace || ''}
                          onChange={e => setRosterDraft({
                            ...rosterDraft,
                            danton: { ...rosterDraft.danton, birthPlace: e.target.value }
                          })}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                        <input
                          type="date"
                          value={rosterDraft?.danton?.birthDate || ''}
                          onChange={e => setRosterDraft({
                            ...rosterDraft,
                            danton: { ...rosterDraft.danton, birthDate: e.target.value }
                          })}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Catatan Medis (Opsional)"
                        value={rosterDraft?.danton?.medicalHistory || ''}
                        onChange={e => setRosterDraft({
                          ...rosterDraft,
                          danton: { ...rosterDraft.danton, medicalHistory: e.target.value }
                        })}
                        className="w-full px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] focus:outline-none focus:ring-1 focus:ring-red-500 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Edit Cards 2, 3, 4: Officials */}
                  {rosterDraft?.officials?.map((off, i) => {
                    const isMainOfficial = i === 0 || off.category === 'official';
                    const hasPhoto = off.photo && typeof off.photo === 'string' && off.photo !== '#' && !off.photo.startsWith('#') && !off.photo.includes('drive.google.com/open?id=');
                    const badgeLabel = isMainOfficial ? 'Official' : i === 1 ? 'Medis' : 'Logistik';
                    const badgeBg = isMainOfficial ? 'bg-blue-600' : i === 1 ? 'bg-emerald-600' : 'bg-slate-700';

                    return (
                      <div
                        key={off.id || i}
                        className="p-3 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-2.5 shadow-2xs"
                      >
                        <div className="relative group shrink-0">
                          <div
                            onClick={() => triggerRosterPhotoUpload({ type: 'official', index: i })}
                            className="aspect-[3/4] w-full rounded-xl bg-slate-800 border border-slate-200 shadow-inner relative overflow-hidden flex items-center justify-center cursor-pointer group hover:border-blue-500 transition-colors"
                            title="Klik untuk unggah pasfoto pendamping"
                          >
                            {hasPhoto ? (
                              <img
                                src={formatImageUrl(off.photo)}
                                alt={off.name || 'Pendamping'}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-top"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-800 p-2">
                                <span className="text-3xl font-black text-slate-300">
                                  {getPersonInitials(off.name)}
                                </span>
                              </div>
                            )}
                            <span className={`absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md ${badgeBg} text-white text-[10px] font-bold shadow-xs uppercase tracking-wider`}>
                              {badgeLabel}
                            </span>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-[10px] font-bold">
                              <Camera className="w-3.5 h-3.5" />
                              <span>Ganti Foto</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => triggerRosterPhotoUpload({ type: 'official', index: i })}
                            className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-yellow-400 text-slate-950 shadow-xs hover:bg-yellow-300 transition-all cursor-pointer"
                            title="Unggah Pasfoto"
                          >
                            <Upload className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="w-full space-y-1.5 pt-1 text-left">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Nama</label>
                            <input
                              type="text"
                              placeholder={isMainOfficial ? "Nama Official" : "Nama Pendukung"}
                              value={off.name || ''}
                              onChange={e => {
                                const updated = rosterDraft.officials.map((item, idx) =>
                                  idx === i ? { ...item, name: e.target.value } : item
                                );
                                setRosterDraft({ ...rosterDraft, officials: updated });
                              }}
                              className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Peran</label>
                            <input
                              type="text"
                              placeholder="Peran / Jabatan"
                              value={off.role || ''}
                              onChange={e => {
                                const updated = rosterDraft.officials.map((item, idx) =>
                                  idx === i ? { ...item, role: e.target.value } : item
                                );
                                setRosterDraft({ ...rosterDraft, officials: updated });
                              }}
                              className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">No. WhatsApp</label>
                            <input
                              type="text"
                              placeholder="08xxxxxxxxxx"
                              value={off.phone || ''}
                              onChange={e => {
                                const updated = rosterDraft.officials.map((item, idx) =>
                                  idx === i ? { ...item, phone: e.target.value } : item
                                );
                                setRosterDraft({ ...rosterDraft, officials: updated });
                              }}
                              className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* 21 Pasukan Inti Grid */}
          <div className="space-y-4">
            <div className="font-black text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <span>21 Pasukan Inti (3 Saf × 7 Banjar)</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                21 Personel (Saf 1 – 3)
              </span>
            </div>
            {!isEditingRoster ? (
              Array.isArray(currentTeam.roster?.pasukan) && currentTeam.roster.pasukan.length > 0 ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(saf => (
                    <div key={saf} className="bg-slate-50/80 border border-slate-200 rounded-3xl p-4 sm:p-5 space-y-3.5">
                      <div className="font-black text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                          <span>Saf {saf} ({saf === 1 ? 'Saf Depan' : saf === 2 ? 'Saf Tengah' : 'Saf Belakang'})</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                          7 Personel (Banjar 1 – 7)
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {currentTeam.roster.pasukan
                          .filter(p => p.safNumber === saf)
                          .map((person) => {
                            const hasPhoto = person.photo && typeof person.photo === 'string' && person.photo !== '#' && !person.photo.startsWith('#') && !person.photo.includes('drive.google.com/open?id=');
                            return (
                              <div key={person.id} className="group/pcard bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-red-400/60 transition-all duration-300 overflow-hidden flex flex-col justify-between">
                                <div className="aspect-[3/4] w-full bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                                  {hasPhoto ? (
                                    <img
                                      src={formatImageUrl(person.photo)}
                                      alt={person.name}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/pcard:scale-105"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        if (e.currentTarget.nextElementSibling) {
                                          e.currentTarget.nextElementSibling.style.display = 'flex';
                                        }
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 p-2"
                                    style={{ display: hasPhoto ? 'none' : 'flex' }}
                                  >
                                    <Camera className="w-8 h-8 text-slate-300 mb-1" />
                                    <span className="text-[10px] font-bold text-slate-400">B{person.banjarNumber}</span>
                                  </div>

                                  <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-black shadow-xs">
                                    B{person.banjarNumber}
                                  </span>
                                </div>

                                <div className="p-2.5 text-left space-y-1">
                                  <span className="font-black text-xs text-slate-900 block leading-tight break-words group-hover/pcard:text-red-700 transition-colors">
                                    {person.name || '-'}
                                  </span>
                                  <div className="text-[10px] text-slate-600 leading-tight">
                                    {person.birthPlace ? `${person.birthPlace}${person.birthDate ? `, ${person.birthDate}` : ''}` : '-'}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-100 pt-1">
                                    <span>{formatGradeDisplay(person.class, 'Kls')}</span>
                                    <span>NISN: {person.nisn || '-'}</span>
                                  </div>
                                  {person.medicalHistory && (
                                    <div className="text-[9px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 truncate mt-0.5" title={`Riwayat Medis: ${person.medicalHistory}`}>
                                      🩺 {person.medicalHistory}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 text-center space-y-2">
                  <p>Data 21 pasukan inti belum diisi.</p>
                  <button
                    onClick={initRosterDraft}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Isi 21 Personel Sekarang</span>
                  </button>
                </div>
              )
            ) : (
              <div className="grid sm:grid-cols-3 gap-4">
                {[1, 2, 3].map(saf => (
                  <div key={saf} className="bg-slate-50 border border-blue-200 rounded-2xl p-4 space-y-3">
                    <div className="font-black text-xs uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                      <span>Saf {saf} (7 Anggota)</span>
                    </div>
                    <div className="space-y-3">
                      {rosterDraft?.pasukan
                        ?.filter(p => p.safNumber === saf)
                        .map(person => {
                          const isBeingDragged = draggedMember?.type === 'pasukan' && draggedMember?.id === person.id;
                          const isTargeted = dragOverTarget?.type === 'pasukan' && dragOverTarget?.id === person.id;

                          return (
                            <div
                              key={person.id}
                              draggable={true}
                              onDragStart={(e) => {
                                e.dataTransfer.effectAllowed = 'move';
                                setDraggedMember({ type: 'pasukan', id: person.id });
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'move';
                                if (dragOverTarget?.type !== 'pasukan' || dragOverTarget?.id !== person.id) {
                                  setDragOverTarget({ type: 'pasukan', id: person.id });
                                }
                              }}
                              onDragLeave={() => {
                                if (dragOverTarget?.type === 'pasukan' && dragOverTarget?.id === person.id) {
                                  setDragOverTarget(null);
                                }
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (draggedMember) {
                                  swapRosterMembers(draggedMember, { type: 'pasukan', id: person.id });
                                }
                                setDraggedMember(null);
                                setDragOverTarget(null);
                              }}
                              onDragEnd={() => {
                                setDraggedMember(null);
                                setDragOverTarget(null);
                              }}
                              className={`bg-white p-3 rounded-2xl border transition-all duration-150 space-y-2 select-none ${
                                isTargeted
                                  ? 'border-blue-500 ring-2 ring-blue-400 bg-blue-50/70 scale-[1.02] shadow-md'
                                  : isBeingDragged
                                  ? 'opacity-40 border-dashed border-blue-400 scale-95'
                                  : 'border-slate-200 shadow-xs hover:border-blue-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-700 uppercase tracking-wider">
                                  <GripVertical className="w-3.5 h-3.5 text-slate-400 cursor-grab active:cursor-grabbing shrink-0" />
                                  <span>Saf {saf} - Banjar {person.banjarNumber}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => triggerRosterPhotoUpload({ type: 'pasukan', id: person.id })}
                                  className="text-[10px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1"
                                >
                                  <Camera className="w-3 h-3" />
                                  <span>{person.photo ? 'Ganti Foto' : 'Unggah Foto'}</span>
                                </button>
                              </div>

                              <div className="flex gap-2.5 items-start">
                                <div
                                  onClick={() => triggerRosterPhotoUpload({ type: 'pasukan', id: person.id })}
                                  className="w-12 h-14 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer hover:border-blue-500 relative"
                                  title="Klik untuk unggah foto anggota"
                                >
                                  {person.photo && typeof person.photo === 'string' && person.photo !== '#' && !person.photo.startsWith('#') && !person.photo.includes('drive.google.com/open?id=') ? (
                                    <img
                                      src={formatImageUrl(person.photo)}
                                      alt={person.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        if (e.currentTarget.nextElementSibling) {
                                          e.currentTarget.nextElementSibling.style.display = 'flex';
                                        }
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50"
                                    style={{
                                      display: person.photo && typeof person.photo === 'string' && person.photo !== '#' && !person.photo.startsWith('#') && !person.photo.includes('drive.google.com/open?id=') ? 'none' : 'flex'
                                    }}
                                  >
                                    <Camera className="w-5 h-5 text-slate-400" />
                                  </div>
                                </div>

                                <div className="flex-1 space-y-1.5 min-w-0">
                                  <input
                                    type="text"
                                    placeholder="Nama Lengkap Anggota"
                                    value={person.name}
                                    onChange={e => {
                                      const updated = rosterDraft.pasukan.map(p =>
                                        p.id === person.id ? { ...p, name: e.target.value } : p
                                      );
                                      setRosterDraft({ ...rosterDraft, pasukan: updated });
                                    }}
                                    className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />

                                  <div className="grid grid-cols-2 gap-1.5">
                                    <input
                                      type="text"
                                      placeholder="NISN"
                                      value={person.nisn}
                                      onChange={e => {
                                        const updated = rosterDraft.pasukan.map(p =>
                                          p.id === person.id ? { ...p, nisn: e.target.value } : p
                                        );
                                        setRosterDraft({ ...rosterDraft, pasukan: updated });
                                      }}
                                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <select
                                      value={person.class || ''}
                                      onChange={e => {
                                        const updated = rosterDraft.pasukan.map(p =>
                                          p.id === person.id ? { ...p, class: e.target.value } : p
                                        );
                                        setRosterDraft({ ...rosterDraft, pasukan: updated });
                                      }}
                                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                      <option value="">Pilih Kelas</option>
                                      {availableClassOptions.map(cls => (
                                        <option key={cls} value={cls}>Kelas {cls}</option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="grid grid-cols-2 gap-1.5">
                                    <input
                                      type="text"
                                      placeholder="Tempat Lahir"
                                      value={person.birthPlace || ''}
                                      onChange={e => {
                                        const updated = rosterDraft.pasukan.map(p =>
                                          p.id === person.id ? { ...p, birthPlace: e.target.value } : p
                                        );
                                        setRosterDraft({ ...rosterDraft, pasukan: updated });
                                      }}
                                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <input
                                      type="date"
                                      placeholder="Tgl Lahir"
                                      value={person.birthDate || ''}
                                      onChange={e => {
                                        const updated = rosterDraft.pasukan.map(p =>
                                          p.id === person.id ? { ...p, birthDate: e.target.value } : p
                                        );
                                        setRosterDraft({ ...rosterDraft, pasukan: updated });
                                      }}
                                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                  </div>

                                  <input
                                    type="text"
                                    placeholder="Riwayat Sakit / Alergi (Opsional)"
                                    value={person.medicalHistory || ''}
                                    onChange={e => {
                                      const updated = rosterDraft.pasukan.map(p =>
                                        p.id === person.id ? { ...p, medicalHistory: e.target.value } : p
                                      );
                                      setRosterDraft({ ...rosterDraft, pasukan: updated });
                                    }}
                                    className="w-full px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] focus:outline-none focus:ring-1 focus:ring-rose-400 placeholder:text-slate-400"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cadangan Section */}
          <div className="pt-2">
            <div className="bg-amber-50/50 border border-amber-200/80 rounded-3xl p-4 sm:p-5 space-y-3.5">
              <div className="font-black text-xs uppercase tracking-wider text-slate-900 border-b border-amber-200/70 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>3 Personel Cadangan Peleton</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-white border border-amber-200 px-2.5 py-0.5 rounded-full">
                  3 Personel (Cadangan 1 – 3)
                </span>
              </div>
              {!isEditingRoster ? (
                Array.isArray(currentTeam.roster?.cadangan) && currentTeam.roster.cadangan.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {currentTeam.roster.cadangan.map((c, i) => {
                      const hasCPhoto = c.photo && typeof c.photo === 'string' && c.photo !== '#' && !c.photo.startsWith('#') && !c.photo.includes('drive.google.com/open?id=');
                      return (
                        <div key={c.id || i} className="group/cadangan bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all duration-300 overflow-hidden flex flex-col justify-between">
                          <div className="aspect-[3/4] w-full bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                            {hasCPhoto ? (
                              <img
                                src={formatImageUrl(c.photo)}
                                alt={c.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/cadangan:scale-105"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  if (e.currentTarget.nextElementSibling) {
                                    e.currentTarget.nextElementSibling.style.display = 'flex';
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
                              <span>{formatGradeDisplay(c.class, 'Kls')}</span>
                              <span>NISN: {c.nisn || '-'}</span>
                            </div>
                            {c.medicalHistory && (
                              <div className="text-[9px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 truncate mt-0.5" title={`Riwayat Medis: ${c.medicalHistory}`}>
                                🩺 {c.medicalHistory}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">Belum ada personel cadangan</div>
                )
              ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {rosterDraft?.cadangan?.map((c, i) => {
                  const isBeingDragged = draggedMember?.type === 'cadangan' && draggedMember?.index === i;
                  const isTargeted = dragOverTarget?.type === 'cadangan' && dragOverTarget?.index === i;

                  return (
                    <div
                      key={c.id || i}
                      draggable={true}
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'move';
                        setDraggedMember({ type: 'cadangan', index: i });
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        if (dragOverTarget?.type !== 'cadangan' || dragOverTarget?.index !== i) {
                          setDragOverTarget({ type: 'cadangan', index: i });
                        }
                      }}
                      onDragLeave={() => {
                        if (dragOverTarget?.type === 'cadangan' && dragOverTarget?.index === i) {
                          setDragOverTarget(null);
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedMember) {
                          swapRosterMembers(draggedMember, { type: 'cadangan', index: i });
                        }
                        setDraggedMember(null);
                        setDragOverTarget(null);
                      }}
                      onDragEnd={() => {
                        setDraggedMember(null);
                        setDragOverTarget(null);
                      }}
                      className={`bg-white p-3 rounded-2xl border transition-all duration-150 space-y-2 select-none ${
                        isTargeted
                          ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-50/70 scale-[1.02] shadow-md'
                          : isBeingDragged
                          ? 'opacity-40 border-dashed border-amber-400 scale-95'
                          : 'border-slate-200 shadow-xs hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-800">
                          <GripVertical className="w-3.5 h-3.5 text-slate-400 cursor-grab active:cursor-grabbing shrink-0" />
                          <span>Cadangan #{i + 1}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => triggerRosterPhotoUpload({ type: 'cadangan', index: i })}
                          className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1"
                        >
                          <Camera className="w-3 h-3" />
                          <span>{c.photo ? 'Ganti Foto' : 'Unggah Foto'}</span>
                        </button>
                      </div>

                      <div className="flex gap-2.5 items-start">
                        <div
                          onClick={() => triggerRosterPhotoUpload({ type: 'cadangan', index: i })}
                          className="w-12 h-14 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer hover:border-amber-500 relative"
                          title="Klik untuk unggah pasfoto cadangan"
                        >
                          {c.photo && typeof c.photo === 'string' && c.photo !== '#' && !c.photo.startsWith('#') && !c.photo.includes('drive.google.com/open?id=') ? (
                            <img
                              src={formatImageUrl(c.photo)}
                              alt={c.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.nextElementSibling) {
                                  e.currentTarget.nextElementSibling.style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div
                            className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50"
                            style={{
                              display: c.photo && typeof c.photo === 'string' && c.photo !== '#' && !c.photo.startsWith('#') && !c.photo.includes('drive.google.com/open?id=') ? 'none' : 'flex'
                            }}
                          >
                            <Camera className="w-5 h-5 text-slate-400" />
                          </div>
                        </div>

                        <div className="flex-1 space-y-1.5 min-w-0">
                          <input
                            type="text"
                            placeholder={`Nama Cadangan #${i + 1}`}
                            value={c.name}
                            onChange={e => {
                              const updated = rosterDraft.cadangan.map((item, idx) =>
                                idx === i ? { ...item, name: e.target.value } : item
                              );
                              setRosterDraft({ ...rosterDraft, cadangan: updated });
                            }}
                            className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                          />
                          <div className="grid grid-cols-2 gap-1.5">
                            <input
                              type="text"
                              placeholder="NISN"
                              value={c.nisn}
                              onChange={e => {
                                const updated = rosterDraft.cadangan.map((item, idx) =>
                                  idx === i ? { ...item, nisn: e.target.value } : item
                                );
                                setRosterDraft({ ...rosterDraft, cadangan: updated });
                              }}
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono"
                            />
                            <select
                              value={c.class || ''}
                              onChange={e => {
                                const updated = rosterDraft.cadangan.map((item, idx) =>
                                  idx === i ? { ...item, class: e.target.value } : item
                                );
                                setRosterDraft({ ...rosterDraft, cadangan: updated });
                              }}
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold"
                            >
                              <option value="">Pilih Kelas</option>
                              {availableClassOptions.map(cls => (
                                <option key={cls} value={cls}>Kelas {cls}</option>
                              ))}
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <input
                              type="text"
                              placeholder="Tempat Lahir"
                              value={c.birthPlace || ''}
                              onChange={e => {
                                const updated = rosterDraft.cadangan.map((item, idx) =>
                                  idx === i ? { ...item, birthPlace: e.target.value } : item
                                );
                                setRosterDraft({ ...rosterDraft, cadangan: updated });
                              }}
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
                            />
                            <input
                              type="date"
                              value={c.birthDate || ''}
                              onChange={e => {
                                const updated = rosterDraft.cadangan.map((item, idx) =>
                                  idx === i ? { ...item, birthDate: e.target.value } : item
                                );
                                setRosterDraft({ ...rosterDraft, cadangan: updated });
                              }}
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
                            />
                          </div>

                          <input
                            type="text"
                            placeholder="Riwayat Sakit / Alergi (Opsional)"
                            value={c.medicalHistory || ''}
                            onChange={e => {
                              const updated = rosterDraft.cadangan.map((item, idx) =>
                                idx === i ? { ...item, medicalHistory: e.target.value } : item
                              );
                              setRosterDraft({ ...rosterDraft, cadangan: updated });
                            }}
                            className="w-full px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] focus:outline-none focus:ring-1 focus:ring-rose-400 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
}
