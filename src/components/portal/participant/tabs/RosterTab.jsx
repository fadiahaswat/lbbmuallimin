import React from 'react';
import {
  ShieldAlert,
  Edit3,
  Save,
  Printer,
  ArrowUpDown,
  User,
  Upload,
  Camera,
  GripVertical
} from 'lucide-react';
import { formatImageUrl, getFallbackImageUrl } from '../../../../services/sheetService.js';

export default function RosterTab({
  currentTeam,
  isEditingRoster,
  setIsEditingRoster,
  rosterDraft,
  setRosterDraft,
  initRosterDraft,
  handleSaveRoster,
  openModal,
  draggedMember,
  setDraggedMember,
  dragOverTarget,
  setDragOverTarget,
  swapRosterMembers,
  triggerRosterPhotoUpload,
  availableClassOptions
}) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      {currentTeam.status === 'pending' ? (
        <div className="p-8 bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h4 className="font-black text-lg text-slate-900 uppercase">
              Tahap Pengisian Roster Masih Terkunci
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Peleton Anda saat ini berstatus <strong>Menunggu Verifikasi Pendaftaran Awal (Pending)</strong>. Panitia sedang mengecek kelengkapan bukti transfer dan berkas pendaftaran Anda.
            </p>
            <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs text-amber-900 font-bold mt-3">
              Pengisian biodata 25 personel peleton (Danton, Pasukan, Cadangan) akan otomatis terbuka setelah pendaftaran peleton Anda disetujui (ACC) oleh Panitia Sekretariat.
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h4 className="font-black text-xl text-slate-900 uppercase italic">
                Daftar 25 Personel Resmi Peleton
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                1 Komandan Peleton, 21 Pasukan Inti (3 Saf × 7 Anggota), 3 Cadangan.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {!isEditingRoster ? (
                <button
                  onClick={initRosterDraft}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit & Atur Posisi (Drag & Drop)</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsEditingRoster(false);
                      setDraggedMember(null);
                      setDragOverTarget(null);
                    }}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveRoster}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan & Perbarui Roster</span>
                  </button>
                </>
              )}
              <button
                onClick={() => openModal('docViewer', { docId: 'form-b', team: currentTeam })}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Biodata Personel</span>
              </button>
            </div>
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

          {/* Top Grid: Danton (Kiri) & Pendamping Peleton (Kanan) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Danton Spotlight (lg:col-span-5) */}
            <div className="lg:col-span-5 bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Danton Photo */}
                <div className="relative group shrink-0">
                  <div className="aspect-[3/4] w-24 sm:w-28 rounded-2xl bg-gradient-to-br from-red-700 to-red-800 text-white font-black text-xs flex items-center justify-center shadow-md overflow-hidden border-2 border-red-300 relative">
                    {(() => {
                      const photoUrl = isEditingRoster ? rosterDraft?.danton?.photo : currentTeam.roster?.danton?.photo;
                      const hasValidPhoto = photoUrl && typeof photoUrl === 'string' && photoUrl !== '#' && !photoUrl.startsWith('#') && !photoUrl.includes('drive.google.com/open?id=');
                      return hasValidPhoto ? (
                        <img
                          src={formatImageUrl(photoUrl)}
                          alt={isEditingRoster ? rosterDraft?.danton?.name || 'Danton' : currentTeam.roster?.danton?.name || 'Danton'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null;
                    })()}
                    <div
                      className="w-full h-full flex flex-col items-center justify-center text-center p-1"
                      style={{
                        display: (() => {
                          const photoUrl = isEditingRoster ? rosterDraft?.danton?.photo : currentTeam.roster?.danton?.photo;
                          return photoUrl && typeof photoUrl === 'string' && photoUrl !== '#' && !photoUrl.startsWith('#') && !photoUrl.includes('drive.google.com/open?id=') ? 'none' : 'flex';
                        })()
                      }}
                    >
                      <User className="w-7 h-7 mx-auto mb-0.5 opacity-80" />
                      <span className="text-[9px] font-black uppercase tracking-wider block opacity-90">DANTON</span>
                    </div>
                  </div>
                  {isEditingRoster && (
                    <button
                      type="button"
                      onClick={() => triggerRosterPhotoUpload({ type: 'danton' })}
                      className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-lg bg-yellow-400 text-slate-950 shadow-md hover:bg-yellow-300 transition-all cursor-pointer"
                      title="Unggah Pasfoto Danton"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Danton Info / Form */}
                <div className="flex-1 w-full min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase text-red-700 tracking-wider">
                      Komandan Peleton
                    </span>
                    <span className="text-[9px] font-bold bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                      Danton
                    </span>
                  </div>

                  {!isEditingRoster ? (
                    <div className="mt-1 space-y-1">
                      <h5 className="font-black text-base text-slate-900 break-words" title={currentTeam.roster?.danton?.name || currentTeam.dantonName}>
                        {currentTeam.roster?.danton?.name || currentTeam.dantonName || '-'}
                      </h5>
                      <div className="space-y-0.5 text-xs text-slate-600">
                        <div>TTL: <strong className="text-slate-800">{currentTeam.roster?.danton?.birthPlace || '-'}{currentTeam.roster?.danton?.birthDate ? `, ${currentTeam.roster.danton.birthDate}` : ''}</strong></div>
                        <div>Kelas: <strong className="text-slate-800">{currentTeam.roster?.danton?.class ? `Kelas ${currentTeam.roster.danton.class}` : '-'}</strong></div>
                        <div>NISN: <strong className="text-slate-800 font-mono">{currentTeam.roster?.danton?.nisn || '-'}</strong></div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 mt-2 w-full">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Nama Lengkap Danton</label>
                        <input
                          type="text"
                          placeholder="Nama Lengkap Danton"
                          value={rosterDraft?.danton?.name || ''}
                          onChange={e => setRosterDraft({
                            ...rosterDraft,
                            danton: { ...rosterDraft.danton, name: e.target.value }
                          })}
                          className="w-full px-2.5 py-1.5 bg-white border border-red-300 rounded-lg text-xs font-bold focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">NISN</label>
                          <input
                            type="text"
                            placeholder="NISN"
                            value={rosterDraft?.danton?.nisn || ''}
                            onChange={e => setRosterDraft({
                              ...rosterDraft,
                              danton: { ...rosterDraft.danton, nisn: e.target.value }
                            })}
                            className="w-full px-2 py-1 bg-white border border-red-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Kelas</label>
                          <select
                            value={rosterDraft?.danton?.class || ''}
                            onChange={e => setRosterDraft({
                              ...rosterDraft,
                              danton: { ...rosterDraft.danton, class: e.target.value }
                            })}
                            className="w-full px-2 py-1 bg-white border border-red-300 rounded-lg text-xs font-bold text-slate-800"
                          >
                            <option value="">Kelas</option>
                            {availableClassOptions.map(cls => (
                              <option key={cls} value={cls}>Kelas {cls}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Tempat Lahir</label>
                          <input
                            type="text"
                            placeholder="Kota Kelahiran"
                            value={rosterDraft?.danton?.birthPlace || ''}
                            onChange={e => setRosterDraft({
                              ...rosterDraft,
                              danton: { ...rosterDraft.danton, birthPlace: e.target.value }
                            })}
                            className="w-full px-2 py-1 bg-white border border-red-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Tgl Lahir</label>
                          <input
                            type="date"
                            value={rosterDraft?.danton?.birthDate || ''}
                            onChange={e => setRosterDraft({
                              ...rosterDraft,
                              danton: { ...rosterDraft.danton, birthDate: e.target.value }
                            })}
                            className="w-full px-2 py-1 bg-white border border-red-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3 Pendamping Peleton (lg:col-span-7) */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <h5 className="font-black text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span>Pendamping Peleton (3 Orang)</span>
                  </h5>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    1 Official + 2 Pendukung
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                  3 Cocard
                </span>
              </div>

              {!isEditingRoster ? (
                Array.isArray(currentTeam.roster?.officials) && currentTeam.roster.officials.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentTeam.roster.officials.map((off, i) => {
                      const isMainOfficial = i === 0 || off.category === 'official';
                      const defaultRoleTitle = isMainOfficial
                        ? 'Official (Pelatih / Pembina)'
                        : `Pendukung ${i} (Medis / Dokum)`;
                      const displayRole = off.role && off.role !== '-' ? off.role : defaultRoleTitle;
                      const hasOPhoto = off.photo && typeof off.photo === 'string' && off.photo !== '#' && !off.photo.startsWith('#') && !off.photo.includes('drive.google.com/open?id=');

                      return (
                        <div
                          key={off.id || i}
                          className={`group/off bg-white rounded-2xl border shadow-2xs overflow-hidden flex flex-col justify-between ${
                            isMainOfficial ? 'border-blue-300 ring-1 ring-blue-200' : 'border-slate-200'
                          }`}
                        >
                          <div className="aspect-[3/4] w-full bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                            {hasOPhoto ? (
                              <img
                                src={formatImageUrl(off.photo)}
                                alt={off.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/off:scale-105"
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
                            <span className="font-bold text-xs text-slate-900 block truncate" title={off.name}>
                              {off.name || '-'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono block truncate">
                              WA: {off.phone || '-'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">Belum ada data pendamping</div>
                )
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {rosterDraft?.officials?.map((off, i) => {
                    const isMainOfficial = i === 0 || off.category === 'official';

                    return (
                      <div
                        key={off.id || i}
                        className={`p-2.5 rounded-xl border space-y-1.5 ${
                          isMainOfficial
                            ? 'bg-blue-50/40 border-blue-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                            isMainOfficial ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {isMainOfficial ? '1. Official Utama' : `${i + 1}. Pendukung (${i === 1 ? 'Medis' : 'Dokum/Lainnya'})`}
                          </span>
                          <button
                            type="button"
                            onClick={() => triggerRosterPhotoUpload({ type: 'official', index: i })}
                            className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[9px] font-bold rounded flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                          >
                            <Camera className="w-3 h-3 text-slate-500" />
                            <span>{off.photo ? 'Ganti Foto' : 'Unggah Foto'}</span>
                          </button>
                        </div>
                        <div className="flex items-start gap-2">
                          <div
                            onClick={() => triggerRosterPhotoUpload({ type: 'official', index: i })}
                            className="w-8 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden group hover:border-blue-500 relative"
                            title="Klik untuk unggah pasfoto pendamping"
                          >
                            {off.photo ? (
                              <img
                                src={formatImageUrl(off.photo)}
                                alt={off.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const fallback = getFallbackImageUrl(off.photo);
                                  if (fallback && e.currentTarget.src !== fallback) {
                                    e.currentTarget.src = fallback;
                                  } else {
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.nextSibling) {
                                      e.currentTarget.nextSibling.style.display = 'block';
                                    }
                                  }
                                }}
                              />
                            ) : null}
                            <User className={`w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 ${off.photo ? 'hidden' : ''}`} />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Camera className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 space-y-1 min-w-0">
                            <input
                              type="text"
                              placeholder={isMainOfficial ? "Nama Official Utama / Pelatih" : "Nama Pendukung (Medis/Dokumentasi)"}
                              value={off.name}
                              onChange={e => {
                                const updated = rosterDraft.officials.map((item, idx) =>
                                  idx === i ? { ...item, name: e.target.value } : item
                                );
                                setRosterDraft({ ...rosterDraft, officials: updated });
                              }}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold focus:border-blue-500"
                            />
                            <div className="grid grid-cols-2 gap-1">
                              <input
                                type="text"
                                placeholder="Nomor WA/Kontak"
                                value={off.phone}
                                onChange={e => {
                                  const updated = rosterDraft.officials.map((item, idx) =>
                                    idx === i ? { ...item, phone: e.target.value } : item
                                  );
                                  setRosterDraft({ ...rosterDraft, officials: updated });
                                }}
                                className="w-full px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] focus:border-blue-500"
                              />
                              <input
                                type="text"
                                placeholder={isMainOfficial ? "Official (Pelatih/Pembina)" : "Pendukung (Medis/Dokum)"}
                                value={off.role}
                                onChange={e => {
                                  const updated = rosterDraft.officials.map((item, idx) =>
                                    idx === i ? { ...item, role: e.target.value } : item
                                  );
                                  setRosterDraft({ ...rosterDraft, officials: updated });
                                }}
                                className="w-full px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 21 Pasukan Inti Grid */}
          <div>
            <h5 className="font-black text-sm uppercase tracking-wider text-slate-800 mb-3">
              21 Pasukan Inti (Saf 1, 2, 3)
            </h5>
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
                                    <span>{person.class ? `Kls ${person.class}` : '-'}</span>
                                    <span>NISN: {person.nisn || '-'}</span>
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
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 text-center space-y-2">
                  <p className="italic">Data 21 pasukan inti belum diisi.</p>
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
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <h5 className="font-black text-xs uppercase tracking-wider text-slate-800 mb-3">
                3 Personel Cadangan
              </h5>
              {!isEditingRoster ? (
                Array.isArray(currentTeam.roster?.cadangan) && currentTeam.roster.cadangan.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentTeam.roster.cadangan.map((c, i) => {
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
                              <span>{c.class ? `Kls ${c.class}` : '-'}</span>
                              <span>NISN: {c.nisn || '-'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">Belum ada personel cadangan</div>
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
