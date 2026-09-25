import React, { useState } from 'react';
import {
  X,
  Printer,
  FileText,
  Download,
  CheckCircle2,
  Shield,
  Award,
  ArrowLeft,
  BookOpen,
  FileCheck2,
  FileBadge2
} from 'lucide-react';
import { SITE, EVENT, VENUE, COMPETITION, PAYMENT, MATERIALS, PENALTIES } from '../../config.js';
import { useCompetition } from '../../context/CompetitionContext.jsx';

export default function DocumentViewerModal({ isOpen, onClose }) {
  const { goBack } = useCompetition();

  if (isOpen === false) return null;

  function handlePrint() {
    window.print();
  }

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      goBack();
    }
  };

  return (
    <div className="min-h-screen bg-slate-200/70 text-slate-900 flex flex-col selection:bg-red-200">
      {/* Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white py-3 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </button>
            <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-700 text-white flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 block leading-none">
                  Dokumen Resmi
                </span>
                <span className="text-xs font-bold text-white">Petunjuk Teknis (Juknis) LBB Mu'allimin 2027</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-red-950/30"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Document Reading Area (Paper Sheet View) */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex justify-center">
        <div className="bg-white p-8 sm:p-14 rounded-2xl shadow-xl border border-slate-300/80 w-full text-slate-900 font-serif leading-relaxed text-sm my-auto">
          
          {/* Kop Surat Resmi */}
          <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center">
            <h2 className="font-black text-lg sm:text-xl uppercase tracking-wider font-sans text-slate-900">
              PANITIA PELAKSANA LOMBA BARIS-BERBARIS (LBB)
            </h2>
            <h1 className="font-black text-xl sm:text-2xl uppercase tracking-tight font-sans text-red-700 mt-0.5">
              MU'ALLIMIN YOGYAKARTA TAHUN 2027
            </h1>
            <p className="text-xs font-sans text-slate-600 mt-1">
              Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta • Dusun Bandut Lor, Argorejo, Sedayu, Bantul, DIY
            </p>
            <p className="text-[11px] font-sans text-slate-500">
              Website: lbb.tontimuallimin.com • Email: lbb@tontimuallimin.com • WhatsApp: 0812-3009-3737
            </p>
          </div>

          {/* DOKUMEN: JUKNIS RESMI */}
          <div className="space-y-4 font-sans text-xs sm:text-sm text-slate-800">
            <div className="text-center mb-6">
                <h3 className="font-black text-lg uppercase underline">PETUNJUK TEKNIS PELAKSANAAN</h3>
                <span className="font-bold text-xs text-slate-500">Nomor: 001/PAN-LBB/MUALLIMIN/IX/2027</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-black text-sm uppercase text-red-700">BAB I: KETENTUAN UMUM</h4>
                <p>1. Lomba Baris-Berbaris (LBB) Mu'allimin 2027 diselenggarakan untuk tingkat SD/MI dan SMP/MTs se-Daerah Istimewa Yogyakarta.</p>
                <p>2. Pelaksanaan lomba bertempat di {VENUE.NAME}, {VENUE.ADDRESS}.</p>
                <p>3. Tanggal perlombaan: <strong>{EVENT.COMPETITION_DATE}</strong>.</p>
                <p>4. Kuota peserta dibatasi maksimal {COMPETITION.MAX_TEAMS_TOTAL} peleton ({COMPETITION.MAX_TEAMS_SD} Peleton SD/MI dan {COMPETITION.MAX_TEAMS_SMP} Peleton SMP/MTs).</p>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-black text-sm uppercase text-red-700">BAB II: KOMPOSISI PELETON</h4>
                <p>1. Jumlah anggota dalam satu peleton adalah <strong>{COMPETITION.MEMBERS_PER_TEAM} orang</strong> (1 Komandan Peleton + 21 Pasukan Inti format 3 banjar x 7 saf + 3 Cadangan).</p>
                <p>2. Peleton dapat berupa Peleton Putra, Peleton Putri, ataupun Peleton Campuran (khusus SD/MI).</p>
                <p>3. Setiap sekolah berhak mengirimkan maksimal 2 peleton terbaik.</p>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-black text-sm uppercase text-red-700">BAB III: DURASI & ARENA LOMBA</h4>
                <p>1. Waktu tampil: <strong>10 menit</strong> untuk tingkat SD/MI (Arena 1: Lapangan Basket) dan <strong>13 menit</strong> untuk tingkat SMP/MTs (Arena 2: Pelataran Embung).</p>
                <p>2. Perhitungan waktu dimulai saat Komandan Peleton menginjak garis arena lomba dan berakhir saat peleton melintasi garis keluar.</p>
                <p>3. Ukuran arena perlombaan: <strong>25m × 14m</strong> (SD/MI) dan <strong>26m × 15m</strong> (SMP/MTs) berpaving rata di Kampus Terpadu Sedayu.</p>
                <div className="mt-4 border border-slate-200 rounded-xl p-3 bg-white shadow-sm">
                  <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                    <span>Lampiran: Denah Area Perlombaan 2027</span>
                    <a
                      href="/denah-lbb-muallimin-2027.png"
                      download="DENAH-LBB-MUALLIMIN-2027.png"
                      className="text-red-700 hover:text-red-800 text-[11px] font-bold inline-flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Unduh Denah HD
                    </a>
                  </div>
                  <div className="rounded-lg overflow-hidden bg-white border border-slate-100 flex items-center justify-center p-2">
                    <img
                      src="/denah-lbb-muallimin-2027.png"
                      alt="Denah Area Perlombaan LBB Mu'allimin 2027"
                      className="max-h-96 w-auto object-contain mx-auto"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-black text-sm uppercase text-red-700">BAB IV: PENILAIAN & DEWAN JURI</h4>
                <p>1. Penilaian dilakukan oleh 6 Dewan Juri independen dan berkompeten dari unsur <strong>TNI, POLRI, dan PPI DIY</strong> (3 Juri Pos SD/MI & 3 Juri Pos SMP/MTs).</p>
                <p>2. Unsur penilaian murni berpedoman pada Perpang TNI No. 57 & 58 Tahun 2018 meliputi: PBB Peleton (Kebenaran Teknik Gerakan & Kekompakan Peleton) serta Kepemimpinan Komandan Peleton (Danton).</p>
                <p>3. Keputusan Dewan Juri bersifat <strong>mutlak dan tidak dapat diganggu gugat</strong>.</p>
              </div>

              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-xs">
                <span className="text-red-900 font-semibold">Tersedia versi dokumen interaktif lengkap di Google Docs:</span>
                <a
                  href="https://docs.google.com/document/d/1BN1RuwDcEiuibVvoBG4-5R7Rq8neV5st3nAZoISVQi0/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white font-bold rounded shadow transition-colors inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Buka Google Docs
                </a>
              </div>

              <div className="pt-8 flex justify-end text-center text-xs">
                <div>
                  <p>Yogyakarta, 1 September 2026</p>
                  <p className="font-bold mt-1">Ketua Panitia Pelaksana,</p>
                  <div className="h-16 flex items-center justify-center text-slate-300 italic text-[10px]">
                    (Tanda Tangan & Cap Panitia)
                  </div>
                  <p className="font-bold underline">Falhan Zuhdi Mubarok</p>
                  <p className="text-[10px] text-slate-500">NIM/NBM. Panitia LBB 2027</p>
                </div>
              </div>
            </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="border-t border-slate-300/80 bg-white py-6 text-center text-xs text-slate-500">
        <p>© 2027 Madrasah Mu'allimin Muhammadiyah Yogyakarta • Panitia Pelaksana LBB 2027</p>
      </footer>
    </div>
  );
}
