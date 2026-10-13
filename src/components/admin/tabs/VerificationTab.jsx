import React from 'react';
import {
  RefreshCw,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Eye,
  Check
} from 'lucide-react';
import { checkTeamVerificationEligibility } from '../../../context/CompetitionContext.jsx';
import { formatImageUrl, getFallbackImageUrl } from '../../../services/sheetService.js';

export default function VerificationTab({
  filteredTeams,
  stage2PendingCount,
  stage2VerifiedCount,
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
  handleQuickVerify
}) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Tahap 2
            </span>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              Verifikasi Biodata Peleton & Surat Rekomendasi
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Periksa susunan 25 personel peleton dan kelengkapan surat rekomendasi kepala sekolah.
          </p>
        </div>

        {/* Counter Badges & Refresh */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{stage2PendingCount} Perlu Dicek</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{stage2VerifiedCount} Sah Terverifikasi</span>
          </div>
          <button
            type="button"
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs transition-all shadow-2xs active:scale-95 disabled:opacity-50"
            title="Segarkan data terbaru"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
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
            placeholder="Cari nama sekolah, nama peleton, atau danton..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Filter Jenjang Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={selectedJenjang}
            onChange={e => setSelectedJenjang(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all cursor-pointer shadow-2xs"
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
            className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all cursor-pointer shadow-2xs"
          >
            <option value="ALL">Semua Status Peleton</option>
            <option value="registered">Belum Dilengkapi</option>
            <option value="pending_verification">Perlu ACC Peleton</option>
            <option value="verified">Sah Terverifikasi</option>
            <option value="revision">Perlu Revisi</option>
          </select>
        </div>
      </div>

      {/* Teams Table: Verifikasi Peleton */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3.5">Kode & Sekolah</th>
              <th className="p-3.5">Susunan Personel Peleton</th>
              <th className="p-3.5">Surat Rekomendasi Sekolah</th>
              <th className="p-3.5">Status Peleton</th>
              <th className="p-3.5 text-center">No. Tampil (TM)</th>
              <th className="p-3.5 text-center">No. Dada</th>
              <th className="p-3.5 text-right">Aksi Verifikasi Peleton</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTeams.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-400">
                  Tidak ada peleton yang cocok dengan filter yang dipilih.
                </td>
              </tr>
            ) : (
              filteredTeams.map(team => {
                const allPasukan = Array.isArray(team.roster?.pasukan) ? team.roster.pasukan : [];
                const allCadangan = Array.isArray(team.roster?.cadangan) ? team.roster.cadangan : [];
                
                const filledPasukan = allPasukan.filter(p => p?.name && p.name !== '-' && p.name.trim() !== '');
                const photoPasukanCount = filledPasukan.filter(p => p?.photo && p.photo !== '#' && !p.photo.startsWith('#') && !p.photo.includes('drive.google.com/open?id=')).length;
                
                const filledCadangan = allCadangan.filter(c => c?.name && c.name !== '-' && c.name.trim() !== '');
                const photoCadanganCount = filledCadangan.filter(c => c?.photo && c.photo !== '#' && !c.photo.startsWith('#') && !c.photo.includes('drive.google.com/open?id=')).length;

                const hasRecLetter = Boolean(team.files?.recommendationLetter?.url && team.files?.recommendationLetter?.url !== '#');

                return (
                  <tr key={team.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 align-middle">
                      <div className="flex items-center gap-3">
                        {team.files?.schoolLogo?.url && team.files.schoolLogo.url !== '#' ? (
                          <img
                            src={formatImageUrl(team.files.schoolLogo.url)}
                            alt="Logo"
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
                            className="w-10 h-10 object-contain filter drop-shadow-xs shrink-0"
                          />
                        ) : null}
                        <div
                          className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-black text-xs shrink-0"
                          style={{ display: team.files?.schoolLogo?.url && team.files.schoolLogo.url !== '#' ? 'none' : 'flex' }}
                        >
                          {team.jenjang}
                        </div>
                        <div className="min-w-0">
                          <span className="inline-block font-mono font-bold text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mb-0.5">
                            {team.regCode}
                          </span>
                          <div className="font-black text-slate-900 text-sm leading-tight truncate">{team.schoolName}</div>
                          {team.platoonName &&
                           team.platoonName.trim().toLowerCase() !== team.schoolName.trim().toLowerCase() &&
                           team.platoonName.trim().toLowerCase() !== `pleton ${team.schoolName.trim().toLowerCase()}` && (
                            <div className="text-slate-500 text-[11px] mt-0.5">Peleton: {team.platoonName}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 align-middle">
                      <div className="space-y-1.5">
                        <div className="text-xs text-slate-800 font-bold leading-tight">
                          Danton: <span className="font-semibold text-slate-700">{team.roster?.danton?.name || team.dantonName || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span
                            title={`${filledPasukan.length} personel diisi, ${photoPasukanCount} pasfoto terunggah`}
                            className={`px-2 py-0.5 rounded font-mono font-bold inline-flex items-center gap-1 ${
                              filledPasukan.length >= 21
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/60'
                                : filledPasukan.length > 0
                                ? 'bg-amber-100 text-amber-900 border border-amber-300/60'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            {filledPasukan.length}/21 Pasukan
                            {photoPasukanCount > 0 && (
                              <span className="text-[9px] font-normal opacity-80">({photoPasukanCount} foto)</span>
                            )}
                          </span>
                          <span
                            title={`${filledCadangan.length} cadangan diisi, ${photoCadanganCount} pasfoto terunggah`}
                            className={`px-2 py-0.5 rounded font-mono font-bold inline-flex items-center gap-1 ${
                              filledCadangan.length >= 3
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/60'
                                : filledCadangan.length > 0
                                ? 'bg-amber-100 text-amber-900 border border-amber-300/60'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            {filledCadangan.length}/3 Cadangan
                            {photoCadanganCount > 0 && (
                              <span className="text-[9px] font-normal opacity-80">({photoCadanganCount} foto)</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 align-middle">
                      {hasRecLetter ? (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Sudah Diunggah
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                          <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Belum Ada Surat
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="p-3.5 align-middle">
                      {team.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          <Clock className="w-3.5 h-3.5" /> Pendaftaran Pending
                        </span>
                      )}
                      {team.status === 'registered' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                          <Clock className="w-3.5 h-3.5" /> Menunggu Verifikasi Peleton
                        </span>
                      )}
                      {team.status === 'revision' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5" /> Revisi Roster / Dokumen
                        </span>
                      )}
                      {team.status === 'verified' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sah Terverifikasi
                        </span>
                      )}
                      {team.status === 'drawn' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Siap Tampil (Terundi)
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 align-middle text-center">
                      {team.lotNumber ? (
                        <span className="font-mono font-black text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          #{String(team.lotNumber).padStart(2, '0')}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Belum diundi</span>
                      )}
                    </td>

                    <td className="p-3.5 align-middle text-center">
                      {team.lotNumber && team.chestNumber ? (
                        <span className="font-mono font-black text-xs text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {team.chestNumber}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>

                    <td className="p-3.5 align-middle text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setInspectingTeam(team);
                            setInspectingStage('verification');
                            setRevisionNoteInput(team.revisionNote || '');
                            setShowRevisionBox(false);
                          }}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                          title="Periksa Biodata 25 Personel Peleton & Surat Rekomendasi"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Cek Peleton</span>
                        </button>

                        {(team.status === 'registered' || team.status === 'revision') && (() => {
                          const eligibility = checkTeamVerificationEligibility(team);
                          return (
                            <button
                              onClick={() => {
                                if (!eligibility.isEligible) {
                                  alert(`Peleton belum dapat diverifikasi sah karena:\n\n• ${eligibility.issues.join('\n• ')}`);
                                  return;
                                }
                                handleQuickVerify(team.id, 'verified');
                              }}
                              className={`px-3 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1 text-xs shadow-xs ${
                                eligibility.isEligible
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95'
                                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-75'
                              }`}
                              title={
                                eligibility.isEligible
                                  ? 'ACC Sah Peleton (Lolos ke Tahap Undian)'
                                  : `Belum memenuhi syarat verifikasi:\n- ${eligibility.issues.join('\n- ')}`
                              }
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>ACC Sah</span>
                            </button>
                          );
                        })()}

                        {['verified', 'drawn'].includes(team.status) && (
                          <button
                            onClick={() => handleQuickVerify(team.id, 'registered')}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                            title="Batalkan Status Sah (Kembalikan ke status Terdaftar)"
                          >
                            Batal Sah
                          </button>
                        )}
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
  );
}
