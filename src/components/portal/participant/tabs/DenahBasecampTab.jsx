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
  DoorOpen
} from 'lucide-react';
import InteractiveBasecampMap from '../../../staging/components/InteractiveBasecampMap.jsx';

export default function DenahBasecampTab({ currentTeam, allTeams = [], staging = {} }) {
  const [activeSubTab, setActiveSubTab] = useState('basecamp'); // 'basecamp' | 'outdoor'
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Cek apakah ada alokasi basecamp untuk tim ini
  const teamStaging = staging?.[currentTeam?.id] || null;
  const assignedRoomCode = currentTeam?.basecampRoom || teamStaging?.room || teamStaging?.basecampRoom || null;

  return (
    <section className="rounded-[28px] border border-slate-200/90 bg-white p-5 sm:p-7 shadow-[0_18px_46px_rgba(15,23,42,0.06)] space-y-5">
      {/* 1. Header Tab Terpadu & Ringkas */}
      <div className="flex flex-col gap-3.5 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20">
            <Building2 className="w-5 h-5 text-white" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-950">
                Denah Basecamp & Kawasan
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <DoorOpen className="w-3 h-3 text-emerald-600" />
                {assignedRoomCode ? `Ruang: Kelas ${assignedRoomCode}` : 'Alokasi Ruang: Saat TM (1 Kelas / 2 Peleton)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Peta interaktif alokasi ruang transit kontingen &amp; rute kawasan kampus.
            </p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('basecamp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'basecamp'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Denah Basecamp</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('outdoor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'outdoor'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-blue-600" />
            <span>Peta Kawasan &amp; Arena</span>
          </button>
        </div>
      </div>

      {/* 2. Konten Utama Sesuai Tab Aktif */}
      {activeSubTab === 'basecamp' ? (
        <div className="space-y-4">
          <InteractiveBasecampMap
            teams={allTeams}
            staging={staging}
            selectedTeamId={currentTeam?.id}
            isPublicView={true}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Peta Tata Letak & Zona Lomba Terbuka
              </h3>
              <p className="text-xs text-slate-500">
                Alur transit dari Basecamp menuju DP 1, DP 2, Arena 1 (Basket), Arena 2 (Embung), dan Evakuasi.
              </p>
            </div>
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

      {/* 4. Regulasi & Tata Tertib Resmi Basecamp (Pasal 11) */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
          <span>Tata Tertib & Ketentuan Resmi Ruang Basecamp (Pasal 11 Juknis)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
          <div className="space-y-1.5">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              Jaminan Identitas Saat Check-In
            </p>
            <p className="text-[11px] leading-relaxed text-slate-500 pl-3">
              Official menyerahkan 1 kartu identitas asli (KTP/SIM) ke Pos Registrasi sebagai jaminan ketertiban serta kebersihan ruang kelas basecamp.
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              Kawasan Bebas Rokok & Vape
            </p>
            <p className="text-[11px] leading-relaxed text-slate-500 pl-3">
              Dilarang keras merokok/vape di seluruh kawasan kampus madrasah. Pelanggaran di basecamp dikenai penalti <strong>-75 poin</strong> pada nilai akhir.
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              Pemilahan Sampah Terpadu
            </p>
            <p className="text-[11px] leading-relaxed text-slate-500 pl-3">
              Gunakan 2 kantong sampah resmi (organik & anorganik). Ruang kotor atau sampah berserakan dikenai sanksi denda <strong>-150 poin</strong>.
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              Batas Maksimal Pengosongan (Checkout)
            </p>
            <p className="text-[11px] leading-relaxed text-slate-500 pl-3">
              Basecamp wajib dikosongkan dan diverifikasi oleh Panitia/LO selambat-lambatnya <strong>pukul 15.00 WIB</strong> sebelum Upacara Penutupan.
            </p>
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
