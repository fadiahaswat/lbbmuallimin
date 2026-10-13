import React from 'react';
import {
  RefreshCw,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Check,
  Trash2
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
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Tahap 1
            </span>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              Pemeriksaan Berkas Pendaftaran Awal
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Verifikasi transfer bank, KTP pembina, KTA danton, dan pakta integritas.
          </p>
        </div>

        {/* Counter Badges & Refresh */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{stage1PendingCount} Perlu Dicek</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{stage1AccCount} Terdaftar</span>
          </div>
          <button
            type="button"
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs transition-all shadow-2xs active:scale-95 disabled:opacity-50"
            title="Segarkan data terbaru"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Clean Toolbar: Search & Select Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1">
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama sekolah, kode, atau pembina..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Filter Jenjang Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={selectedJenjang}
            onChange={e => setSelectedJenjang(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer shadow-2xs"
          >
            <option value="ALL">Semua Tingkat (SD & SMP)</option>
            <option value="SD">Khusus SD / MI</option>
            <option value="SMP">Khusus SMP / MTs</option>
          </select>
        </div>

        {/* Filter Status Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer shadow-2xs"
          >
            <option value="ALL">Semua Status Berkas</option>
            <option value="pending">Perlu Dicek (Pending)</option>
            <option value="registered">ACC Terdaftar (Lolos)</option>
            <option value="revision">Perlu Revisi Berkas</option>
          </select>
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
                    <div className="flex flex-col gap-1">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-medium border w-fit ${
                        team.files?.paymentProof 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${team.files?.paymentProof ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span>Transfer Bank BRI</span>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-medium border w-fit ${
                        team.files?.dantonCard 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${team.files?.dantonCard ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span>Kartu Danton</span>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-medium border w-fit ${
                        team.files?.officialKtp 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${team.files?.officialKtp ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span>KTP Pembina</span>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-medium border w-fit ${
                        team.files?.integrityPact 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${team.files?.integrityPact ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span>Pakta Integritas</span>
                      </div>
                    </div>
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
