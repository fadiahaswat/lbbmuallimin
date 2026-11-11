import React, { useState, useMemo } from 'react';
import {
  Scale,
  ExternalLink,
  Download,
  Maximize2,
  X
} from 'lucide-react';

const PERPANG_DOCS = [
  {
    id: 'perpang-58',
    code: 'Perpang TNI No. 58 Th 2018',
    title: 'Peraturan Panglima TNI No. 58 Tahun 2018',
    subtitle: 'Peraturan Baris Berbaris (PBB) Tentara Nasional Indonesia',
    badge: 'INDUK PBB TNI',
    pdfUrl: '/perpang/PERPANG TNI NO. 58 TAHUN 2018.pdf',
    fileSize: '261 KB'
  },
  {
    id: 'perpang-57',
    code: 'Perpang TNI No. 57 Th 2018',
    title: 'Peraturan Panglima TNI No. 57 Tahun 2018',
    subtitle: 'Peraturan Penghormatan Militer (PPM) Tentara Nasional Indonesia',
    badge: 'PPM TNI',
    pdfUrl: '/perpang/PERPANG TNI NO 57 TAHUN 2018 Tentang Penghormatan.pdf',
    fileSize: '285 KB'
  },
  {
    id: 'perpang-45',
    code: 'Perpang TNI No. 45 Th 2014',
    title: 'Peraturan Panglima TNI No. 45 Tahun 2014',
    subtitle: 'Peraturan Baris Berbaris (PBB) TNI (Regulasi Pendukung 2014)',
    badge: 'REFERENSI 2014',
    pdfUrl: '/perpang/PERPANG TNI NO. 45 TAHUN 2014.pdf',
    fileSize: '457 KB'
  }
];

export default function BacaPerpangTab({ embedded = false }) {
  const [selectedDocId, setSelectedDocId] = useState('perpang-58');
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);

  const currentDoc = useMemo(() => {
    return PERPANG_DOCS.find(d => d.id === selectedDocId) || PERPANG_DOCS[0];
  }, [selectedDocId]);

  return (
    <div className={embedded ? "space-y-4 sm:space-y-5" : "rounded-[28px] border border-slate-200/90 bg-white p-4 sm:p-7 shadow-[0_18px_46px_rgba(15,23,42,0.06)] space-y-4 sm:space-y-5"}>
      {/* 1. Header Tab */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/20">
            <Scale className="w-6 h-6 text-white" />
            <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-amber-400" />
          </span>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-red-600">
              PELIHAT DOKUMEN RESMI // OFFICIAL REGULATIONS
            </p>
            <h2 className="mt-0.5 text-lg font-black tracking-tight text-slate-950 sm:text-xl">
              Pusat Dokumen Regulasi Perpang TNI
            </h2>
            <p className="mt-0.5 text-[10px] sm:text-xs text-slate-500">
              Arsip digital resmi Peraturan Panglima TNI yang menjadi rujukan mutlak penilaian Dewan Juri LBB Mu&apos;allimin 2027.
            </p>
          </div>
        </div>

        {/* Action quick links */}
        <div className="flex items-center gap-2">
          <a
            href={encodeURI(currentDoc.pdfUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            title="Buka di Tab Baru"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Tab Baru</span>
          </a>
          <a
            href={encodeURI(currentDoc.pdfUrl)}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            title="Unduh Berkas PDF"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Unduh PDF</span>
          </a>
          <button
            type="button"
            onClick={() => setIsFullscreenModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all border border-red-200 cursor-pointer"
            title="Perbesar Layar Penuh"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Layar Penuh</span>
          </button>
        </div>
      </div>

      {/* 2. Compact Document Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {PERPANG_DOCS.map((doc) => {
          const isActive = doc.id === selectedDocId;
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => setSelectedDocId(doc.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border cursor-pointer ${
                isActive
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{doc.code}</span>
              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                isActive ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {doc.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Document Viewer Frame (Clean PDF Frame) */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 shadow-sm">
        <iframe
          src={encodeURI(currentDoc.pdfUrl)}
          title={currentDoc.title}
          className="w-full h-[700px] sm:h-[850px] border-0 bg-white"
          allow="autoplay"
        />
      </div>

      {/* 4. Fullscreen Modal Viewer */}
      {isFullscreenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-6xl h-[95vh] flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-3 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full shrink-0 animate-ping"></span>
                <div className="min-w-0">
                  <h3 className="font-black text-xs sm:text-base text-white uppercase tracking-tight truncate">
                    {currentDoc.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate">
                    {currentDoc.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={encodeURI(currentDoc.pdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tab Baru</span>
                </a>

                <a
                  href={encodeURI(currentDoc.pdfUrl)}
                  download
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unduh PDF</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsFullscreenModalOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-all ml-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 w-full bg-slate-900 overflow-hidden relative">
              <iframe
                src={encodeURI(currentDoc.pdfUrl)}
                title={currentDoc.title}
                className="w-full h-full border-0 bg-slate-900"
                allow="autoplay"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
