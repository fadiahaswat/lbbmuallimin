import React from 'react';
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
  filteredTeams,
  stage1PendingCount,
  stage1AccCount,
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
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-5">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <span className="shrink-0 whitespace-nowrap text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Tahap 1
            </span>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight leading-snug">
              Pemeriksaan Berkas Pendaftaran Awal
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
            Verifikasi transfer bank BSI, kartu pelajar danton, logo sekolah, dan pakta integritas.
          </p>
        </div>

        {/* Counter Badges & Refresh */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap pt-0.5 sm:pt-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] sm:text-xs font-bold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span>{stage1PendingCount} Perlu Dicek</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-[11px] sm:text-xs font-bold whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{stage1AccCount} Terdaftar</span>
          </div>
          <button
            type="button"
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs transition-all shadow-2xs active:scale-95 disabled:opacity-50 shrink-0 ml-auto sm:ml-0"
            title="Segarkan data terbaru"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Clean Toolbar: Search & Interactive Filter Pills */}
      <div className="space-y-3 pt-1">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama sekolah, kode, atau pembina..."
            className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
        </div>

        {/* Filter Badges / Pills Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Jenjang Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mr-1 shrink-0">
              Jenjang:
            </span>
            {[
              { id: 'ALL', label: 'Semua' },
              { id: 'SD', label: 'SD / MI', activeClass: 'bg-rose-600 text-white shadow-rose-500/25 border-rose-600' },
              { id: 'SMP', label: 'SMP / MTs', activeClass: 'bg-blue-600 text-white shadow-blue-500/25 border-blue-600' },
            ].map(j => {
              const isActive = selectedJenjang === j.id;
              return (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => setSelectedJenjang(j.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                    isActive
                      ? (j.activeClass || 'bg-slate-900 text-white border-slate-900 shadow-sm')
                      : 'bg-slate-50 hover:bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {j.label}
                </button>
              );
            })}
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mr-1 shrink-0">
              Status:
            </span>
            {[
              { id: 'ALL', label: 'Semua Status' },
              { id: 'pending', label: 'Perlu Dicek', dot: 'bg-amber-500', activeClass: 'bg-amber-500 text-white border-amber-500 shadow-amber-500/20' },
              { id: 'registered', label: 'ACC Terdaftar', activeClass: 'bg-blue-600 text-white border-blue-600 shadow-blue-500/20' },
              { id: 'revision', label: 'Perlu Revisi', activeClass: 'bg-rose-600 text-white border-rose-600 shadow-rose-500/20' },
            ].map(st => {
              const isActive = selectedStatus === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedStatus(st.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                    isActive
                      ? (st.activeClass || 'bg-slate-900 text-white border-slate-900 shadow-sm')
                      : 'bg-slate-50 hover:bg-white text-slate-600 border-slate-200 hover:border-slate-300'
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
      </div>

      {/* Teams Table: Pendaftaran */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3.5">Kode & Sekolah</th>
              <th className="p-3.5">Jenjang / Gelombang</th>
              <th className="p-3.5">Danton & Pembina</th>
              <th className="p-3.5">Berkas Pendaftaran Awal</th>
              <th className="p-3.5">Status Pendaftaran</th>
              <th className="p-3.5 text-right">Aksi Verifikasi</th>
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
                  <td className="p-3.5 align-middle">
                    <div className="flex items-center gap-3">
                      {team.files?.schoolLogo?.url && team.files.schoolLogo.url !== '#' ? (
                        <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 p-1 shrink-0 shadow-xs flex items-center justify-center hover:scale-105 transition-transform">
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
                            className="max-w-full max-h-full object-contain filter drop-shadow-xs"
                          />
                        </div>
                      ) : null}
                      <div
                        className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 text-blue-700 border border-slate-200 flex items-center justify-center font-black text-xs shrink-0 shadow-xs"
                        style={{ display: team.files?.schoolLogo?.url && team.files.schoolLogo.url !== '#' ? 'none' : 'flex' }}
                      >
                        {team.jenjang}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-mono font-bold text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/80">
                            {team.regCode}
                          </span>
                        </div>
                        <div className="font-extrabold text-slate-900 text-sm leading-snug">
                          {team.schoolName}
                        </div>
                        {team.platoonName && 
                         team.platoonName.trim().toLowerCase() !== team.schoolName.trim().toLowerCase() && 
                         team.platoonName.trim().toLowerCase() !== `pleton ${team.schoolName.trim().toLowerCase()}` && (
                          <div className="text-slate-500 text-[11px] font-medium leading-tight">
                            Peleton: {team.platoonName}
                          </div>
                        )}
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

                  <td className="p-3.5 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setInspectingTeam(team);
                          setInspectingStage('registration');
                          setRevisionNoteInput(team.revisionNote || '');
                          setShowRevisionBox(false);
                        }}
                        className="px-3 py-2 bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 hover:border-blue-300 transition-all flex items-center gap-1.5 shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                        title="Cek Berkas Pendaftaran Awal"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Cek Berkas</span>
                      </button>

                      {team.status === 'pending' && (
                        <button
                          onClick={() => handleQuickVerify(team.id, 'registered')}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs hover:shadow-md active:scale-95 cursor-pointer"
                          title="ACC Pendaftaran (Status Terdaftar)"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>ACC Daftar</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus data ${team.schoolName}?`)) {
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
  );
}
