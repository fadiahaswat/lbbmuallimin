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
      {/* 1. Embedded Subheader & Compact Search (Identik dengan Pusat Unduhan di Portal Peserta) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Daftar Berkas Pendaftaran Awal</span>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80">
              {filteredTeams.length} Peleton
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verifikasi bukti transfer BSI, kartu pelajar danton, logo sekolah, dan pakta integritas.
          </p>
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
            return (
              <div key={team.id} className="p-4 space-y-3 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {team.files?.schoolLogo?.url && team.files.schoolLogo.url !== '#' ? (
                      <img
                        src={formatImageUrl(team.files.schoolLogo.url)}
                        alt="Logo"
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl border border-slate-200 bg-white p-1 object-contain shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-xs shrink-0">
                        {team.jenjang}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono font-bold text-[10px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {team.regCode}
                        </span>
                        <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {team.jenjang} • Gel. {team.wave || 1}
                        </span>
                      </div>
                      <h4 className="font-black text-slate-900 text-sm leading-snug mt-0.5 truncate">
                        {team.schoolName}
                      </h4>
                    </div>
                  </div>

                  {/* Status Badge Compact */}
                  {team.status === 'pending' && (
                    <span className="shrink-0 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                      Pending
                    </span>
                  )}
                  {team.status === 'registered' && (
                    <span className="shrink-0 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                      Terdaftar
                    </span>
                  )}
                  {team.status === 'revision' && (
                    <span className="shrink-0 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                      Revisi
                    </span>
                  )}
                  {['verified', 'drawn'].includes(team.status) && (
                    <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                      Sah
                    </span>
                  )}
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

      {/* 3B. DESKTOP TABLE VIEW */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Kode &amp; Sekolah</th>
              <th className="py-3 px-4">Jenjang / Gelombang</th>
              <th className="py-3 px-4">Danton &amp; Pembina</th>
              <th className="py-3 px-4">Berkas Pendaftaran Awal</th>
              <th className="py-3 px-4">Status Pendaftaran</th>
              <th className="py-3 px-4 text-right">Aksi Verifikasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTeams.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400">
                  Tidak ada pendaftar yang cocok dengan filter yang dipilih.
                </td>
              </tr>
            ) : (
              filteredTeams.map(team => (
                <tr key={team.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 align-middle">
                    <div className="flex items-center gap-3">
                      {team.files?.schoolLogo?.url && team.files.schoolLogo.url !== '#' ? (
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 shrink-0 flex items-center justify-center">
                          <img
                            src={formatImageUrl(team.files.schoolLogo.url)}
                            alt="Logo"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const fallback = getFallbackImageUrl(team.files.schoolLogo.url);
                              if (fallback && e.currentTarget.src !== fallback) {
                                e.currentTarget.src = fallback;
                              } else {
                                e.currentTarget.parentElement.style.display = 'none';
                                if (e.currentTarget.parentElement.nextElementSibling) {
                                  e.currentTarget.parentElement.nextElementSibling.style.display = 'flex';
                                }
                              }
                            }}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : null}
                      <div
                        className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-xs shrink-0"
                        style={{ display: team.files?.schoolLogo?.url && team.files.schoolLogo.url !== '#' ? 'none' : 'flex' }}
                      >
                        {team.jenjang}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-mono font-bold text-[10px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {team.regCode}
                          </span>
                        </div>
                        <div className="font-extrabold text-slate-900 text-sm leading-snug">
                          {team.schoolName}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 align-middle">
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded-md font-extrabold text-xs bg-slate-100 text-slate-800 border border-slate-200">
                        {team.jenjang}
                      </span>
                      <div className="text-slate-500 text-[11px] leading-tight font-medium">
                        Gelombang {team.wave || 1}
                      </div>
                      <div className="text-slate-700 font-bold text-[11px] leading-tight">
                        Rp{(team.feeAmount || 450000).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 align-middle">
                    <div className="space-y-1">
                      <div className="font-extrabold text-slate-900 text-xs">
                        {team.roster?.danton?.name || team.dantonName || '-'}
                      </div>
                      <div className="text-slate-500 text-[11px] leading-tight">
                        <span className="text-slate-400 font-medium">Pembina:</span> {team.officialName || team.coachName || '-'}
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 align-middle">
                    {(() => {
                      const fileItems = [
                        {
                          id: 'paymentProof',
                          label: 'Transfer BSI',
                          icon: CreditCard,
                          hasFile: Boolean(team.files?.paymentProof?.url ? team.files.paymentProof.url !== '#' : team.files?.paymentProof),
                        },
                        {
                          id: 'dantonCard',
                          label: 'Kartu Danton',
                          icon: IdCard,
                          hasFile: Boolean(team.files?.dantonCard?.url ? team.files.dantonCard.url !== '#' : team.files?.dantonCard),
                        },
                        {
                          id: 'schoolLogo',
                          label: 'Logo Sekolah',
                          icon: ImageIcon,
                          hasFile: Boolean(team.files?.schoolLogo?.url ? team.files.schoolLogo.url !== '#' : team.files?.schoolLogo),
                        },
                        {
                          id: 'integrityPact',
                          label: 'Pakta Integritas',
                          icon: FileSignature,
                          hasFile: Boolean(team.files?.integrityPact?.url || team.files?.integrityPact?.signatureUrl ? (team.files.integrityPact.url !== '#' || team.files.integrityPact.signatureUrl !== '#') : team.files?.integrityPact),
                        },
                      ];

                      return (
                        <div className="flex items-center gap-1.5">
                          {fileItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                              <div
                                key={item.id}
                                title={`${item.label}: ${item.hasFile ? 'Sudah Diunggah' : 'Belum Diunggah'}`}
                                className={`group relative inline-flex items-center justify-center w-8 h-8 rounded-full border transition-all cursor-pointer ${
                                  item.hasFile
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 shadow-2xs hover:scale-105'
                                    : 'bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100 hover:border-rose-300 hover:scale-105'
                                }`}
                                onClick={() => {
                                  setInspectingTeam(team);
                                  setInspectingStage('registration');
                                }}
                              >
                                <IconComponent className="w-4 h-4" />

                                {/* Tooltip Hover */}
                                <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                                  {item.label}: {item.hasFile ? 'Lengkap' : 'Belum'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </td>

                  <td className="p-3.5 align-middle">
                    {team.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Menunggu Pengecekan
                      </span>
                    )}
                    {team.status === 'registered' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> ACC Terdaftar
                      </span>
                    )}
                    {team.status === 'revision' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 shadow-2xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Minta Revisi Berkas
                      </span>
                    )}
                    {['verified', 'drawn'].includes(team.status) && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Terverifikasi Sah
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setInspectingTeam(team);
                          setInspectingStage('registration');
                          setRevisionNoteInput(team.revisionNote || '');
                          setShowRevisionBox(false);
                        }}
                        className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                        title="Cek Berkas Pendaftaran Awal"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Cek Berkas</span>
                      </button>

                      {team.status === 'pending' && (
                        <button
                          onClick={() => handleQuickVerify(team.id, 'registered')}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
                          title="ACC Pendaftaran (Status Terdaftar)"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>ACC Daftar</span>
                        </button>
                      )}

                      <button
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
                        className="p-2 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-xl border border-slate-200 hover:border-rose-200 transition-all cursor-pointer shadow-2xs active:scale-95"
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
    </div>
  );
}
