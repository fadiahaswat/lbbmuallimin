import React from 'react';
import {
  FileText,
  Printer,
  Download,
  Award,
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  Shield,
  Clock,
  Sparkles,
  ExternalLink,
  Crown,
  Trophy
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { SITE, EVENT, VENUE, VENUE_INDUK, COMPETITION } from '../../config.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';
import logoLbb from '../../assets/logo-tonti.png';
import logoMuallimin from '../../assets/logo-muallimin.png';

export default function ProposalView() {
  const { setActiveView } = useCompetition();

  const handlePrintProposal = () => {
    window.print();
  };

  return (
    <SimpaskorSidebarLayout
      activeMenu="proposal"
      title="Proposal Resmi Kegiatan LBB 2027"
      subtitle="Dokumen legalitas, susunan panitia, skema kejuaraan, & rincian pelaksanaan LBB Mu'allimin"
      rightActions={
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintProposal}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Cetak Proposal Resmi"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak Dokumen Proposal</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6 max-w-5xl mx-auto">

        {/* Paper Document Layout */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-lg space-y-8 text-slate-800">

          {/* Letterhead Resmi Madrasah Mu'allimin */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b-2 border-slate-900 gap-4 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <img src={logoMuallimin} alt="Logo Madrasah" className="h-14 w-auto object-contain" />
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">PIMPINAN PUSAT MUHAMMADIYAH</span>
                <h2 className="text-base sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                  MADRASAH MU'ALLIMIN MUHAMMADIYAH YOGYAKARTA
                </h2>
                <p className="text-[11px] text-slate-500">
                  Jl. Letjen S. Parman No. 68 Wirobrajan, Yogyakarta 55262 • Telp: (0274) 373158
                </p>
              </div>
            </div>
            <img src={logoLbb} alt="Logo LBB" className="h-16 w-auto object-contain shrink-0" />
          </div>

          {/* Title Header */}
          <div className="text-center space-y-2 pt-2">
            <span className="inline-block px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-black uppercase tracking-wider">
              PROPOSAL KEGIATAN RESMI
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
              LOMBA BARIS-BERBARIS (LBB) MU'ALLIMIN 2027
            </h1>
            <p className="text-sm font-semibold text-slate-600">
              Tingkat SD/MI & SMP/MTs Se-Daerah Istimewa Yogyakarta dan Jawa Tengah
            </p>
          </div>

          {/* Bab I: Latar Belakang */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              BAB I: Latar Belakang & Filosofi
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              Gerakan Baris-Berbaris (PBB) merupakan salah satu sarana fundamental dalam menanamkan disiplin, loyalitas, kepemimpinan, dan solidaritas regu di kalangan generasi muda pelajar. Seiring dengan perkembangan zaman, pembinaan karakter generasi penerus bangsa memerlukan wadah kompetisi yang sehat, terukur, dan bermartabat.
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              Madrasah Mu'allimin Muhammadiyah Yogyakarta sebagai lembaga kader persyarikatan dan pelopor pendidikan karakter berinisiatif menyelenggarakan <strong>Lomba Baris-Berbaris (LBB) Mu'allimin 2027</strong> dengan mengacu pada standar regulasi Peraturan Panglima Tentara Nasional Indonesia (Perpang TNI) No. 57 & 58 Tahun 2018 serta sistem penjurian berbasis teknologi modern (E-Scoring SaaS).
            </p>
          </div>

          {/* Bab II: Maksud dan Tujuan */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              BAB II: Maksud dan Tujuan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Menumbuhkan sikap disiplin, patriotisme, dan jiwa kepemimpinan pelajar.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Meningkatkan kualitas teknik dasar baris-berbaris sesuai Perpang TNI resmi.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Mempererat ukhuwah dan silaturahmi antar satuan peleton se-DIY & Jateng.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Mewujudkan transparansi penilaian secara digital, akurat, dan real-time.</span>
              </div>
            </div>
          </div>

          {/* Bab III: Waktu, Tempat, dan Sasaran */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              BAB III: Waktu, Lokasi, dan Sasaran Peserta
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">1. Technical Meeting</span>
                <span className="font-bold text-slate-900 block">{EVENT.TECHNICAL_MEETING_FULL_DATE}</span>
                <span className="text-slate-500">{VENUE_INDUK.NAME}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">2. Uji Coba Lapangan</span>
                <span className="font-bold text-slate-900 block">{EVENT.FIELD_TRIAL_FULL_DATE}</span>
                <span className="text-slate-500">{VENUE.NAME}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">3. Pelaksanaan Lomba</span>
                <span className="font-bold text-slate-900 block">{EVENT.COMPETITION_DATE}</span>
                <span className="text-slate-500">{VENUE.NAME}</span>
              </div>
            </div>
          </div>

          {/* Bab IV: Kategori Kejuaraan & Penghargaan */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              BAB IV: Kategori Kejuaraan & Skema Penghargaan
            </h3>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>Piala Bergilir & Uang Pembinaan Total Belasan Juta Rupiah</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                <li>• <strong>Juara Umum LBB 2027</strong> (Trofi Bergilir + Uang Pembinaan)</li>
                <li>• <strong>Juara Utama 1, 2, 3</strong> SD/MI & SMP/MTs (Piala Tetap + Uang)</li>
                <li>• <strong>Juara Harapan 1, 2, 3</strong> SD/MI & SMP/MTs (Piala Tetap + Piagam)</li>
                <li>• <strong>Komandan Peleton (Danton) Terbaik 1, 2, 3</strong> SD & SMP (Trofi)</li>
                <li>• <strong>Peleton PBB Terbaik (Teknik)</strong> SD & SMP (Trofi Khusus)</li>
                <li>• <strong>Peleton Terkompak (Kekompakan)</strong> SD & SMP (Trofi Khusus)</li>
              </ul>
            </div>
          </div>

          {/* Bab V: Susunan Panitia */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              BAB V: Susunan Panitia Penyelenggara
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Pelindung:</span>
                <span className="font-bold text-slate-900">Direktur Madrasah Mu'allimin</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Ketua Panitia:</span>
                <span className="font-bold text-slate-900">Falhan Zuhdi Mubarok</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Sekretaris:</span>
                <span className="font-bold text-slate-900">Andi Aqillah</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Dewan Juri:</span>
                <span className="font-bold text-slate-900">TNI, POLRI, & Profesional</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </SimpaskorSidebarLayout>
  );
}
