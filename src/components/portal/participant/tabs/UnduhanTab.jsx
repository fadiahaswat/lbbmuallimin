import React, { useState, useMemo } from 'react';
import {
  Download,
  FileText,
  BookOpen,
  Award,
  Shield,
  MapPin,
  FileCheck2,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Printer,
  Sparkles,
  HelpCircle,
  Lock
} from 'lucide-react';
import { DOWNLOADS } from '../../../../config.js';
import { useCompetition } from '../../../../context/CompetitionContext.jsx';

export default function UnduhanTab({ currentTeam, onOpenPactModal, isEmbedded = false }) {
  const { settings } = useCompetition?.() || {};
  const isJuknisPenilaianRatified = Boolean(settings?.juknisPenilaianPublished && settings?.juknisPenilaianRatifiedAt);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Daftar berkas unduhan terpadu
  const filesList = useMemo(() => [
    {
      id: 'juknis',
      title: 'Petunjuk Teknis Lapangan (Juknis)',
      category: 'regulasi',
      categoryLabel: 'Regulasi',
      description: 'Dokumen panduan teknis resmi pelaksanaan LBB Mu\'allimin 2027: alur kronologis arena, materi urutan PBB baku murni sesuai Perpang TNI 58 & 57/2018.',
      type: 'PDF RESMI',
      size: 'Google Drive / PDF',
      url: 'https://drive.google.com/file/d/1owEDyb680TNB3TkFvZGVfjD_OCbagffQ/view?usp=sharing',
      badge: 'Wajib Unduh',
      badgeColor: 'bg-red-100 text-red-700 border-red-200',
      icon: BookOpen
    },
    // Juknis Penilaian & Kejuaraan HANYA muncul setelah disahkan/ACC oleh Admin / Superadmin
    ...(isJuknisPenilaianRatified ? [
      {
        id: 'juknis-penilaian',
        title: 'Petunjuk Teknis Penilaian & Kejuaraan',
        category: 'regulasi',
        categoryLabel: 'Regulasi',
        description: 'Regulasi baku Dewan Juri (Sistem 5 Predikat Baku KS, K, C, B, BS), kriteria Danton (4 aspek), akumulasi Juara Umum & tie-breaker resmi, serta tabel penalti.',
        type: 'PDF RESMI',
        size: 'Google Drive / PDF',
        url: 'https://drive.google.com/file/d/1owEDyb680TNB3TkFvZGVfjD_OCbagffQ/view?usp=sharing',
        badge: 'Penilaian Resmi',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Award
      }
    ] : []),
    // Berkas Materi Gerakan: Sesuai jenjang tim (Jika SD hanya tampilkan SD, jika SMP hanya tampilkan SMP)
    ...((!currentTeam?.jenjang || currentTeam?.jenjang === 'SD') ? [
      {
        id: 'materi-sd',
        title: 'Materi Gerakan Lomba SD / MI 2027',
        category: 'materi',
        categoryLabel: 'Materi PBB',
        description: 'Daftar urutan 26 gerakan wajib PBB tingkat SD/MI sederajat di Arena 1 (Basket) dengan durasi tampil maksimal 8 menit.',
        type: 'PDF RESMI',
        size: 'Google Drive / PDF',
        url: 'https://drive.google.com/file/d/10ok02901aIjpoHAvWdanzMK5aW9cx3Js/view?usp=sharing',
        badge: 'Tingkat SD/MI',
        badgeColor: 'bg-red-100 text-red-800 border-red-200',
        icon: FileText
      }
    ] : []),
    ...((!currentTeam?.jenjang || currentTeam?.jenjang === 'SMP') ? [
      {
        id: 'materi-smp',
        title: 'Materi Gerakan Lomba SMP / MTs 2027',
        category: 'materi',
        categoryLabel: 'Materi PBB',
        description: 'Daftar urutan 28 gerakan wajib PBB tingkat SMP/MTs sederajat di Arena 2 (Embung) dengan durasi tampil maksimal 12 menit.',
        type: 'PDF RESMI',
        size: 'Google Drive / PDF',
        url: 'https://drive.google.com/file/d/1YLVhlAGhLN2L0iwgkq5bM6WqJsgdrbjV/view?usp=sharing',
        badge: 'Tingkat SMP/MTs',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: FileText
      }
    ] : []),
    {
      id: 'pakta-integritas',
      title: 'Pakta Integritas Peleton Bermaterai Rp 10.000',
      category: 'formulir',
      categoryLabel: 'Formulir Resmi',
      description: 'Surat pernyataan komitmen sportivitas resmi bermaterai yang telah terisi otomatis dengan identitas kontingen Anda, siap dicetak dan ditandatangani.',
      type: 'PDF OTOMATIS',
      size: 'Cetak Langsung',
      isAction: true,
      actionType: 'pact',
      badge: 'Wajib Diserahkan TM',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: FileCheck2
    },
    {
      id: 'denah-arena',
      title: 'Denah Resmi Area Perlombaan & Alur Kawasan',
      category: 'media',
      categoryLabel: 'Denah & Media',
      description: 'Gambar peta tata letak arena perlombaan (Basket & Embung), Daerah Persiapan (DP 1 & DP 2), alur evakuasi, gedung basecamp 4 lantai, dan titik parkir.',
      type: 'GAMBAR HD PNG',
      size: 'PNG Resolusi Tinggi',
      url: '/denah-perlombaan.png',
      badge: 'Denah Lokasi',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      icon: MapPin
    }
  ], [isJuknisPenilaianRatified]);

  const categories = [
    { id: 'all', label: 'Semua Berkas' },
    { id: 'regulasi', label: 'Regulasi & Juknis' },
    { id: 'materi', label: 'Materi PBB' },
    { id: 'formulir', label: 'Formulir & Pakta' },
    { id: 'media', label: 'Denah & Lokasi' },
  ];

  const filteredFiles = filesList.filter(file => {
    const matchCategory = selectedCategory === 'all' || file.category === selectedCategory;
    const matchQuery = !searchQuery || 
      file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  const content = (
    <div className="space-y-6">
      {/* 1. Header Tab (hanya tampil jika bukan embedded) */}
      {!isEmbedded && (
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <Download className="w-5 h-5 text-white" />
            </span>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                Pusat Unduhan Kontingen
              </h2>
              <p className="text-xs text-slate-500">
                Unduh petunjuk teknis, regulasi juri, materi PBB, format pakta integritas, dan denah kawasan.
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berkas dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
        </div>
      )}

      {/* Embedded Search and Subheader */}
      {isEmbedded && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-600" />
              <span>Arsip Berkas & Dokumen Resmi Lomba</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dokumen petunjuk teknis, materi gerakan, format pakta integritas, dan panduan resmi.
            </p>
          </div>
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berkas dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
        </div>
      )}

      {/* 2. Grid of Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFiles.map((file) => {
          const Icon = file.icon;
          return (
            <div
              key={file.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-slate-300 hover:shadow-2xs transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {file.title}
                  </h4>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {file.description}
                </p>
              </div>

              {/* Bottom Action Row */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[10px] font-mono text-slate-400">
                  {file.size}
                </span>

                {file.isAction ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenPactModal) onOpenPactModal();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Pakta Tim</span>
                  </button>
                ) : (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={file.category === 'media' ? 'DENAH-ARENA-LBB-2027.png' : undefined}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Berkas</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <section className="rounded-[28px] border border-slate-200/90 bg-white p-5 sm:p-7 shadow-[0_18px_46px_rgba(15,23,42,0.06)] space-y-6">
      {content}
    </section>
  );
}
