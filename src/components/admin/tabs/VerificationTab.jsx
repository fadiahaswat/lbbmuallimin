import React from 'react';
import { appAlert } from '../../../utils/appDialog.js';
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
  activeTab = 'verification',
  onSelectStage,
  filteredTeams,
  stage1PendingCount = 0,
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
    <div className="space-y-4">
      {/* 1. Compact Header & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black text-slate-900 tracking-tight">
            Verifikasi Roster &amp; Rekomendasi
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
            placeholder="Cari sekolah, kode, danton..."
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
            { id: 'pending_verification', label: `Perlu ACC (${stage2PendingCount})`, dot: 'bg-amber-500', activeClass: 'bg-amber-500 text-white border-amber-500' },
            { id: 'verified', label: `Sah (${stage2VerifiedCount})`, activeClass: 'bg-emerald-600 text-white border-emerald-600' },
            { id: 'registered', label: 'Belum Lengkap', activeClass: 'bg-slate-950 text-white border-slate-950' },
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

      {/* 3A. MOBILE BALANCED LIST VIEW */}
      <div className="md:hidden divide-y divide-slate-100">
        {filteredTeams.length === 0 ? (
          <div className="text-center py-10 px-4 text-xs text-slate-400">
            Tidak ada peleton yang cocok dengan filter yang dipilih.
          </div>
        ) : (
          filteredTeams.map(team => {
            const allPasukan = Array.isArray(team.roster?.pasukan) ? team.roster.pasukan : [];
            const allCadangan = Array.isArray(team.roster?.cadangan) ? team.roster.cadangan : [];
            const filledPasukan = allPasukan.filter(p => p?.name && p.name !== '-' && p.name.trim() !== '');
            const filledCadangan = allCadangan.filter(c => c?.name && c.name !== '-' && c.name.trim() !== '');
            const hasRecLetter = Boolean(team.files?.recommendationLetter?.url && team.files?.recommendationLetter?.url !== '#');
            const eligibility = checkTeamVerificationEligibility(team);

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
                        {team.lotNumber && (
                          <span className="font-mono font-black text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            #{String(team.lotNumber).padStart(2, '0')}
                          </span>
                        )}
                      </div>
                      <h4 className="font-black text-slate-900 text-sm leading-snug mt-0.5 truncate">
                        {team.schoolName}
                      </h4>
                    </div>
                  </div>

                  {['verified', 'drawn'].includes(team.status) ? (
                    <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                      Sah
                    </span>
                  ) : team.status === 'revision' ? (
                    <span className="shrink-0 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                      Revisi
                    </span>
                  ) : (
                    <span className="shrink-0 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                      Perlu Cek
                    </span>
                  )}
                </div>

                {/* Baris Ringkasan Roster & Surat Rekomendasi */}
                <div className="flex items-center justify-between gap-2 text-[11px] bg-slate-50 rounded-xl px-3 py-2 border border-slate-100 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      filledPasukan.length >= 21 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {filledPasukan.length}/21 Inti
                    </span>
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-200/70 text-slate-700">
                      {filledCadangan.length}/3 Cad
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    hasRecLetter
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {hasRecLetter ? 'Surat Rekom ✓' : 'Belum Ada Surat'}
                  </span>
                </div>

                {/* Tombol Aksi Seimbang */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInspectingTeam(team);
                      setInspectingStage('verification');
                      setRevisionNoteInput(team.revisionNote || '');
                      setShowRevisionBox(false);
                    }}
                    className="flex-1 py-2 px-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Cek Peleton</span>
                  </button>

                  {(team.status === 'registered' || team.status === 'revision') && (
                    <button
                      type="button"
                      onClick={() => {
                        if (!eligibility.isEligible) {
                          appAlert(`Peleton belum dapat diverifikasi sah karena:\n\n• ${eligibility.issues.join('\n• ')}`, { title: 'Berkas Belum Lengkap', variant: 'warning' });
                          return;
                        }
                        handleQuickVerify(team.id, 'verified');
                      }}
                      className={`flex-1 py-2 px-3 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        eligibility.isEligible
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>ACC Sah</span>
                    </button>
                  )}

                  {['verified', 'drawn'].includes(team.status) && (
                    <button
                      type="button"
                      onClick={() => handleQuickVerify(team.id, 'registered')}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      Batal Sah
                    </button>
                  )}
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
              <th className="py-3 px-4">Roster Personel</th>
              <th className="py-3 px-4 text-center">Surat Rekom</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTeams.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400">
                  Tidak ada peleton yang cocok dengan filter yang dipilih.
                </td>
              </tr>
            ) : (
              filteredTeams.map(team => {
                const allPasukan = Array.isArray(team.roster?.pasukan) ? team.roster.pasukan : [];
                const allCadangan = Array.isArray(team.roster?.cadangan) ? team.roster.cadangan : [];
                const filledPasukan = allPasukan.filter(p => p?.name && p.name !== '-' && p.name.trim() !== '');
                const filledCadangan = allCadangan.filter(c => c?.name && c.name !== '-' && c.name.trim() !== '');
                const hasRecLetter = Boolean(team.files?.recommendationLetter?.url && team.files?.recommendationLetter?.url !== '#');
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
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900 text-[13px] leading-snug truncate">
                              {team.schoolName}
                            </span>
                            {team.chestNumber && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white font-mono text-[9.5px] font-bold shrink-0">
                                {team.chestNumber}
                              </span>
                            )}
                          </div>
                          <div className="text-[10.5px] text-slate-400 font-mono truncate mt-0.5">
                            {team.regCode}
                            {team.lotNumber ? ` · Undian #${String(team.lotNumber).padStart(2, '0')}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Roster Personel */}
                    <td className="py-3 px-4 align-middle">
                      <div className="font-bold text-slate-800 text-xs leading-snug truncate max-w-[230px]">
                        {team.roster?.danton?.name || team.dantonName || '-'}
                      </div>
                      <div className="flex items-center gap-2 text-[10.5px] font-mono mt-0.5">
                        <span className={filledPasukan.length >= 21 ? 'text-emerald-700 font-bold' : 'text-amber-700 font-semibold'}>
                          {filledPasukan.length}/21 Inti
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500">
                          {filledCadangan.length}/3 Cad
                        </span>
                      </div>
                    </td>

                    {/* Surat Rekom */}
                    <td className="py-3 px-4 align-middle text-center">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold whitespace-nowrap ${
                        hasRecLetter ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${hasRecLetter ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                        {hasRecLetter ? 'Lengkap' : 'Belum'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 align-middle text-center">
                      {team.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                          Pending
                        </span>
                      )}
                      {team.status === 'registered' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                          Menunggu
                        </span>
                      )}
                      {team.status === 'revision' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                          Revisi
                        </span>
                      )}
                      {team.status === 'verified' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                          Sah
                        </span>
                      )}
                      {team.status === 'drawn' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                          Terundi
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-4 align-middle text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setInspectingTeam(team);
                            setInspectingStage('verification');
                            setRevisionNoteInput(team.revisionNote || '');
                            setShowRevisionBox(false);
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 hover:border-slate-900 font-bold text-[11px] rounded-lg transition-all inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                          title="Periksa Biodata 25 Personel Peleton & Surat Rekomendasi"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Cek</span>
                        </button>

                        {(team.status === 'registered' || team.status === 'revision') && (() => {
                          const eligibility = checkTeamVerificationEligibility(team);
                          return (
                            <button
                              type="button"
                              onClick={() => {
                                if (!eligibility.isEligible) {
                                  appAlert(`Peleton belum dapat diverifikasi sah karena:\n\n• ${eligibility.issues.join('\n• ')}`, { title: 'Berkas Belum Lengkap', variant: 'warning' });
                                  return;
                                }
                                handleQuickVerify(team.id, 'verified');
                              }}
                              className={`px-2.5 py-1.5 font-bold rounded-lg transition-all inline-flex items-center gap-1 text-[11px] whitespace-nowrap ${
                                eligibility.isEligible
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                              title={
                                eligibility.isEligible
                                  ? 'ACC Sah Peleton (Lolos ke Tahap Undian)'
                                  : `Belum memenuhi syarat verifikasi:\n- ${eligibility.issues.join('\n- ')}`
                              }
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Sah</span>
                            </button>
                          );
                        })()}

                        {['verified', 'drawn'].includes(team.status) && (
                          <button
                            type="button"
                            onClick={() => handleQuickVerify(team.id, 'registered')}
                            className="px-2.5 py-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-bold text-[10.5px] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                            title="Batalkan Status Sah"
                          >
                            Batal
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
    </div>
  );
}
