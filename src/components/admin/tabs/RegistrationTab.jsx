import React from 'react';
import { appConfirm } from '../../../utils/appDialog.js';
import {
  RefreshCw,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Check,
  Trash2,
  CreditCard,
  IdCard,
  Image as ImageIcon,
  FileSignature
} from 'lucide-react';
import { formatImageUrl, getFallbackImageUrl } from '../../../services/sheetService.js';

const WAVE_2_START_TS = new Date('2026-11-08T23:59:59+07:00').getTime();

const getTeamWave = (team) => {
  const fee = Number(String(team?.feeAmount || '').replace(/\D/g, '')) || 0;
  if (fee >= 400000) return 2;
  if (fee > 0 && fee < 400000) return 1;
  const regDate = team?.registeredAt || team?.createdAt;
  if (regDate) {
    const ts = new Date(regDate).getTime();
    if (!Number.isNaN(ts)) return ts > WAVE_2_START_TS ? 2 : 1;
  }
  return Number(team?.wave) || 2;
};

export default function RegistrationTab({
  activeTab = 'registration',
  onSelectStage,
  filteredTeams,
  stage1PendingCount,
  stage1AccCount,
  stage2PendingCount = 0,
  isRefreshing,
  handleRefreshData,
  selectedJenjang,
  setSelectedJenjang,
  selectedStatus,
  setSelectedStatus,
  searchQuery,
  setSearchQuery,
  setInspectingTeam,
  setInspectingStage,
  setRevisionNoteInput,
  setShowRevisionBox,
  handleQuickVerify,
  deleteTeam
}) {
  const getFileItems = (team) => [
    {
      id: 'paymentProof',
      label: 'Transfer BSI',
      shortLabel: 'BSI',
      icon: CreditCard,
      hasFile: Boolean(team.files?.paymentProof?.url ? team.files.paymentProof.url !== '#' : team.files?.paymentProof),
    },
    {
      id: 'dantonCard',
      label: 'Kartu Danton',
      shortLabel: 'Danton',
      icon: IdCard,
      hasFile: Boolean(team.files?.dantonCard?.url ? team.files.dantonCard.url !== '#' : team.files?.dantonCard),
    },
    {
      id: 'schoolLogo',
      label: 'Logo Sekolah',
      shortLabel: 'Logo',
      icon: ImageIcon,
      hasFile: Boolean(team.files?.schoolLogo?.url ? team.files.schoolLogo.url !== '#' : team.files?.schoolLogo),
    },
    {
      id: 'integrityPact',
      label: 'Pakta Integritas',
      shortLabel: 'Pakta',
      icon: FileSignature,
      hasFile: Boolean(team.files?.integrityPact?.url || team.files?.integrityPact?.signatureUrl ? (team.files.integrityPact.url !== '#' || team.files.integrityPact.signatureUrl !== '#') : team.files?.integrityPact),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Compact Header & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black text-slate-900 tracking-tight">
            Berkas Pendaftaran Awal
          </h3>
          <span className="text-[10.5px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            {filteredTeams.length}
          </span>
        </div>

        <div className="relative min-w-[220px] sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari sekolah, kode, pembina..."
            className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
          />
        </div>
      </div>

      {/* 2. Compact Filter Pills Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        {/* Jenjang Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mr-0.5 shrink-0">
            Jenjang:
          </span>
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'SD', label: 'SD / MI', activeClass: 'bg-rose-600 text-white border-rose-600' },
            { id: 'SMP', label: 'SMP / MTs', activeClass: 'bg-blue-600 text-white border-blue-600' },
          ].map(j => {
            const isActive = selectedJenjang === j.id;
            return (
              <button
                key={j.id}
                type="button"
                onClick={() => setSelectedJenjang(j.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer border ${
                  isActive
                    ? (j.activeClass || 'bg-slate-950 text-white border-slate-950')
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {j.label}
              </button>
            );
          })}
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mr-0.5 shrink-0">
            Status:
          </span>
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'pending', label: `Perlu Dicek (${stage1PendingCount})`, dot: 'bg-amber-500', activeClass: 'bg-amber-500 text-white border-amber-500' },
            { id: 'registered', label: `Terdaftar (${stage1AccCount})`, activeClass: 'bg-slate-950 text-white border-slate-950' },
            { id: 'revision', label: 'Perlu Revisi', activeClass: 'bg-rose-600 text-white border-rose-600' },
          ].map(st => {
            const isActive = selectedStatus === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStatus(st.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer border ${
                  isActive
                    ? (st.activeClass || 'bg-slate-950 text-white border-slate-950')
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {st.dot && !isActive && (
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot} shrink-0`} />
                )}
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Data Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

      {/* 3A. MOBILE BALANCED LIST VIEW (Rapi & Seimbang di HP tanpa geser tabel) */}
      <div className="md:hidden divide-y divide-slate-100">
        {filteredTeams.length === 0 ? (
          <div className="text-center py-10 px-4 text-xs text-slate-400">
            Tidak ada pendaftar yang cocok dengan filter yang dipilih.
          </div>
        ) : (
          filteredTeams.map(team => {
            const fileItems = getFileItems(team);
            const teamWave = getTeamWave(team);
            return (
              <div key={team.id} className="p-4 space-y-3 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start gap-2.5">
                  {team.files?.schoolLogo?.url && team.files.schoolLogo.url !== '#' ? (
                    <img
                      src={formatImageUrl(team.files.schoolLogo.url)}
                      alt="Logo"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl border border-slate-200 bg-white p-1 object-contain shrink-0 mt-0.5"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      {team.jenjang}
                    </div>
                  )}

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-black text-slate-900 text-sm leading-snug break-words">
                        {team.schoolName}
                      </h4>

                      {/* Status Badge Compact */}
                      {team.status === 'pending' && (
                        <span className="shrink-0 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                          Pending
                        </span>
                      )}
                      {team.status === 'registered' && (
                        <span className="shrink-0 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                          Terdaftar
                        </span>
                      )}
                      {team.status === 'revision' && (
                        <span className="shrink-0 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                          Revisi
                        </span>
                      )}
                      {['verified', 'drawn'].includes(team.status) && (
                        <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          Sah
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono font-semibold text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/80">
                        {team.regCode}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        teamWave === 2
                          ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {team.jenjang} · Gel. {teamWave}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Baris Info Danton & 4 Indikator Berkas */}
                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-600 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                  <div className="truncate">
                    <span className="text-slate-400">Danton:</span>{' '}
                    <strong className="text-slate-800">{team.roster?.danton?.name || team.dantonName || '-'}</strong>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {fileItems.map(item => {
                      const IconComponent = item.icon;
                      return (
                        <span
                          key={item.id}
                          title={`${item.label}: ${item.hasFile ? 'Lengkap' : 'Belum'}`}
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-lg border ${
                            item.hasFile
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-500 border-rose-200'
                          }`}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Tombol Aksi Seimbang */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInspectingTeam(team);
                      setInspectingStage('registration');
                      setRevisionNoteInput(team.revisionNote || '');
                      setShowRevisionBox(false);
                    }}
                    className="flex-1 py-2 px-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Cek Berkas</span>
                  </button>

                  {team.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => handleQuickVerify(team.id, 'registered')}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>ACC Daftar</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={async () => {
                      const ok = await appConfirm(`Yakin ingin menghapus data ${team.schoolName}?`, {
                        title: 'Hapus Peserta',
                        confirmText: 'Hapus',
                        variant: 'danger',
                      });
                      if (ok) {
                        deleteTeam(team.id);
                      }
                    }}
                    className="p-2 bg-white hover:bg-rose-50 text-rose-600 rounded-xl border border-slate-200 transition-all cursor-pointer shrink-0"
                    title="Hapus Peserta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3B. DESKTOP TABLE VIEW (CLEAN & MINIMAL) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Peleton / Sekolah</th>
              <th className="py-3 px-4">Danton &amp; Pembina</th>
              <th className="py-3 px-4 text-center">Berkas</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTeams.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400">
                  Tidak ada pendaftar yang cocok dengan filter yang dipilih.
                </td>
              </tr>
            ) : (
              filteredTeams.map(team => {
                const fileItems = getFileItems(team);
                const uploadedCount = fileItems.filter(f => f.hasFile).length;
                const allFilesComplete = uploadedCount === fileItems.length;
                const filesTooltip = fileItems.map(f => `${f.label}: ${f.hasFile ? '✓' : '✕'}`).join(' · ');
                const isSD = team.jenjang === 'SD';

                return (
                  <tr key={team.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Peleton / Sekolah */}
                    <td className="py-3 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        {team.files?.schoolLogo?.url && team.files.schoolLogo.url !== '#' ? (
                          <img
                            src={formatImageUrl(team.files.schoolLogo.url)}
                            alt={team.schoolName}
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
                            className="w-8 h-8 object-contain shrink-0"
                          />
                        ) : null}
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 ${
                            isSD ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                          }`}
                          style={{ display: team.files?.schoolLogo?.url && team.files.schoolLogo.url !== '#' ? 'none' : 'flex' }}
                        >
                          {team.jenjang}
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-slate-900 text-[13px] leading-snug truncate">
                            {team.schoolName}
                          </div>
                          <div className="text-[10.5px] text-slate-400 font-mono truncate mt-0.5">
                            {team.regCode} · Gel. {getTeamWave(team)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Danton & Pembina */}
                    <td className="py-3 px-4 align-middle">
                      <div className="font-bold text-slate-800 text-xs leading-snug truncate max-w-[240px]">
                        {team.roster?.danton?.name || team.dantonName || '-'}
                      </div>
                      <div className="text-slate-400 text-[10.5px] leading-tight truncate max-w-[240px] mt-0.5">
                        {team.officialName || team.coachName || '-'}
                      </div>
                    </td>

                    {/* Berkas (Compact 1-pill summary instead of 4 circles) */}
                    <td className="py-3 px-4 align-middle text-center">
                      <button
                        type="button"
                        title={filesTooltip}
                        onClick={() => {
                          setInspectingTeam(team);
                          setInspectingStage('registration');
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-colors cursor-pointer whitespace-nowrap ${
                          allFilesComplete
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        {allFilesComplete ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-600" />
                        )}
                        <span>{uploadedCount}/{fileItems.length}</span>
                      </button>
                    </td>

                    {/* Status (Single-line compact pill) */}
                    <td className="py-3 px-4 align-middle text-center">
                      {team.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Menunggu
                        </span>
                      )}
                      {team.status === 'registered' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          Terdaftar
                        </span>
                      )}
                      {team.status === 'revision' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Revisi
                        </span>
                      )}
                      {['verified', 'drawn'].includes(team.status) && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Sah
                        </span>
                      )}
                    </td>

                    {/* Aksi (Lightweight, single-line) */}
                    <td className="py-3 px-4 align-middle text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setInspectingTeam(team);
                            setInspectingStage('registration');
                            setRevisionNoteInput(team.revisionNote || '');
                            setShowRevisionBox(false);
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 hover:border-slate-900 font-bold text-[11px] rounded-lg transition-all inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                          title="Cek Berkas Pendaftaran Awal"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Cek</span>
                        </button>

                        {team.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleQuickVerify(team.id, 'registered')}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-all inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
                            title="ACC Pendaftaran (Status Terdaftar)"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>ACC</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={async () => {
                            const ok = await appConfirm(`Yakin ingin menghapus data ${team.schoolName}?`, {
                              title: 'Hapus Peserta',
                              confirmText: 'Hapus',
                              variant: 'danger',
                            });
                            if (ok) {
                              deleteTeam(team.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Peserta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
