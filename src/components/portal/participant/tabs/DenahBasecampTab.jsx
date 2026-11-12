import React, { useState } from 'react';
import {
  Building2,
  Map,
  Compass,
  Download,
  Maximize2,
  X,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Info,
  Clock,
  Layers,
  DoorOpen,
  Lock,
  Calendar,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import InteractiveBasecampMap from '../../../staging/components/InteractiveBasecampMap.jsx';
import { useCompetition } from '../../../../context/CompetitionContext.jsx';

export default function DenahBasecampTab({ currentTeam, allTeams = [], staging = {} }) {
  const [activeSubTab, setActiveSubTab] = useState('basecamp'); // 'basecamp' | 'outdoor'
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const { settings, updateSettings, currentUser, role } = useCompetition?.() || {};
  const userRole = currentUser?.role || role || 'peserta';
  const isStaff = !currentTeam && ['admin', 'superadmin', 'checkin', 'dp', 'staging', 'panitia'].includes(userRole);
  const isSuperadmin = userRole === 'superadmin';
  const isRatified = Boolean(settings?.basecampPublished && settings?.basecampRatifiedAt);

  // Cek apakah ada alokasi basecamp untuk tim ini
  const teamStaging = staging?.[currentTeam?.id] || null;
  const assignedRoomCode = currentTeam?.basecampNumber || currentTeam?.basecampRoom || teamStaging?.room || teamStaging?.basecampRoom || null;

  return (
    <section className="rounded-2xl sm:rounded-[28px] border border-slate-200/90 bg-white p-4 sm:p-7 shadow-[0_18px_46px_rgba(15,23,42,0.06)] space-y-5">
      {/* 1. Header Tab Terpadu & Ringkas */}
      <div className="flex flex-col gap-3.5 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm">
            <Building2 className="w-5 h-5 text-white" />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-950">
                Denah Basecamp &amp; Kawasan
              </h2>
              {isRatified && assignedRoomCode && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Ruang: Kelas {assignedRoomCode}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Peta interaktif alokasi ruang transit kontingen &amp; rute kawasan kampus.
            </p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveSubTab('basecamp')}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeSubTab === 'basecamp'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Denah Basecamp</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('outdoor')}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeSubTab === 'outdoor'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Peta Kawasan<span className="hidden min-[380px]:inline"> &amp; Arena</span></span>
          </button>
        </div>
      </div>

      {/* 2. Konten Utama Sesuai Tab Aktif */}
      {activeSubTab === 'basecamp' ? (
        <div className="space-y-4">
          {!isRatified && !isStaff ? (
            /* TAMPILAN KHUSUS JIKA ALOKASI BASECAMP BELUM DISAHKAN PANITIA */
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 sm:p-6 text-center space-y-3">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Alokasi Ruang Basecamp Belum Disahkan
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pembagian ruang transit kontingen sedang difinalisasi dan akan diumumkan secara resmi setelah pelaksanaan Uji Coba Lapangan (UCL).
                </p>
              </div>

              <div className="pt-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('outdoor')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                >
                  <Map className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lihat Peta Kawasan &amp; Arena</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Alert Mode Draf untuk Staff / Panitia jika belum disahkan */}
              {isStaff && !isRatified && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] font-black uppercase tracking-wider bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full font-bold">
                          STATUS: DRAFT (PANITIA PREVIEW)
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          Alokasi Basecamp Belum Disahkan (Disembunyikan dari Portal Peserta)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Peserta melihat informasi bahwa alokasi basecamp akan disahkan setelah pelaksanaan Uji Coba Lapangan (UCL).
                      </p>
                    </div>
                  </div>

                  {isSuperadmin && (
                    <button
                      type="button"
                      onClick={() => {
                        updateSettings({
                          basecampPublished: true,
                          basecampRatifiedAt: new Date().toISOString()
                        });
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs shrink-0 cursor-pointer"
                    >
                      Sahkan &amp; Terbitkan Sekarang
                    </button>
                  )}
                </div>
              )}

              <InteractiveBasecampMap
                teams={allTeams}
                staging={staging}
                selectedTeamId={currentTeam?.id}
                isPublicView={true}
              />
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-end">
            <a
              href="/denah-perlombaan.png"
              download="DENAH-PERLOMBAAN-LBB-MUALLIMIN-2027.png"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Unduh Gambar HD</span>
            </a>
          </div>

          <div
            onClick={() => setIsZoomOpen(true)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-5 transition hover:border-slate-300"
            title="Klik untuk memperbesar gambar layar penuh"
          >
            <div className="flex min-h-[300px] sm:min-h-[500px] items-center justify-center bg-white rounded-xl py-2">
              <img
                src="/denah-perlombaan.png"
                alt="Denah Kawasan Lomba LBB Mu'allimin 2027"
                className="max-h-[700px] w-full object-contain transition group-hover:scale-[1.01]"
              />
            </div>
            <div className="absolute bottom-6 right-6 flex items-center gap-1.5 rounded-xl bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-white shadow-md backdrop-blur-xs">
              <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Perbesar Denah</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Ketentuan Ringkas Basecamp (Pasal 11) */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span>Tata Tertib Basecamp (Pasal 11 Juknis)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
          <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-2xs">
            <span className="font-bold text-slate-900 block">Jaminan KTP/SIM</span>
            <span className="text-slate-500 text-[10px]">1 identitas saat check-in</span>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-2xs">
            <span className="font-bold text-slate-900 block">Bebas Rokok/Vape</span>
            <span className="text-rose-600 font-medium text-[10px]">Sanksi -75 Poin</span>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-2xs">
            <span className="font-bold text-slate-900 block">2 Trash Bag Sampah</span>
            <span className="text-slate-500 text-[10px]">Organik & anorganik</span>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-2xs">
            <span className="font-bold text-slate-900 block">Maks. Checkout 15.00</span>
            <span className="text-slate-500 text-[10px]">Sebelum Penutupan</span>
          </div>
        </div>
      </div>

      {/* Modal Zoom Denah Gambar */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-3 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative flex max-h-[95vh] w-full max-w-6xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <Map className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Denah Resmi Area Perlombaan 2027
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-100 min-h-[400px]">
              <img
                src="/denah-perlombaan.png"
                alt="Denah Resolusi Penuh"
                className="max-h-[85vh] w-auto max-w-full object-contain rounded-xl shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
