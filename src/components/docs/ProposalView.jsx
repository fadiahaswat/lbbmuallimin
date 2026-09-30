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
  Trophy,
  Scale
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { SITE, EVENT, VENUE, VENUE_INDUK, COMPETITION, ACHIEVEMENTS, PRIZES } from '../../config.js';
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
      subtitle="Dokumen legalitas, tema Semangat Sebagai Ksatria Berjuang Dengan Gembira, landasan Perpang TNI, & skema kejuaraan"
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
                  Kampus Induk: Jl. Letjen S. Parman No. 68 Wirobrajan, Yogyakarta 55262 • Telp: (0274) 373158
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
              LOMBA BARIS BERBARIS (LBB) MU'ALLIMIN TAHUN 2027
            </h1>
            <p className="text-base font-bold text-red-700 tracking-wide font-mono">
              "SEMANGAT SEBAGAI KSATRIA, BERJUANG DENGAN GEMBIRA"
            </p>
            <p className="text-xs font-semibold text-slate-600">
              Tingkat SD/MI & SMP/MTs Sederajat Se-Daerah Istimewa Yogyakarta
            </p>
          </div>

          {/* Bab I: Latar Belakang & Landasan Spiritual */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              BAB I: Latar Belakang & Filosofi Tema
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              Pendidikan karakter adalah fondasi utama dalam mencetak generasi penerus bangsa yang unggul, berdaya saing, dan berakhlak mulia. Di antara berbagai metode pembinaan, kegiatan Peraturan Baris-Berbaris (PBB) terbukti sebagai sarana paling efektif untuk menanamkan nilai esensial seperti kedisiplinan, kepemimpinan, tanggung jawab, dan kebersamaan, yang selaras dengan nilai Profil Pelajar Pancasila.
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              Madrasah Mu'allimin Muhammadiyah Yogyakarta sebagai sekolah kader persyarikatan sejak 1918 berpegang teguh pada firman Allah SWT dalam <strong>QS. As-Saff ayat 4</strong>: <em>"Sesungguhnya Allah menyukai orang-orang yang berperang di jalan-Nya dalam barisan yang teratur seakan-akan mereka seperti suatu bangunan yang tersusun kokoh."</em>
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              Peleton Inti (Tonti) Mu'allimin <em>"Caraka Bhaskara Muda"</em> telah menorehkan deretan prestasi gemilang dalam 2 tahun terakhir: <strong>Juara Umum LBB Manggala Bhakti (2025)</strong>, <strong>Juara Umum LKBB Bela Negara (2025)</strong>, <strong>Juara Umum LBB Pembangunan (2026)</strong>, dan <strong>Juara Umum LBB Kota Yogyakarta (2026)</strong>. Berbekal reputasi dan komitmen inilah, Madrasah Mu'allimin mempersembahkan kompetisi resmi berkualitas tinggi dengan 5 nilai inti Mu'allimin: <strong>CADRE</strong> (<em>Creative, Active, Discipline, Religious, Entrepreneur</em>).
            </p>
          </div>

          {/* Makna Tema Resmi */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white space-y-3">
            <h4 className="text-xs font-black uppercase text-red-400 tracking-wider">
              Filosofi Tema: "Semangat Sebagai Ksatria, Berjuang Dengan Gembira"
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 border-l-2 border-red-500 pl-3">
                <span className="font-bold text-white block">SEMANGAT SEBAGAI KSATRIA (Karakter Internal)</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Menempa kehormatan, integritas, kedisiplinan, ketangguhan mental, kepemimpinan yang melayani, serta sportivitas ksatria yang menerima hasil dengan lapang dada.
                </p>
              </div>
              <div className="space-y-1.5 border-l-2 border-amber-400 pl-3">
                <span className="font-bold text-white block">BERJUANG DENGAN GEMBIRA (Sikap Mental & Energi Positif)</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Ketangguhan daya juang dalam hentakan barisan PBB yang dijalani dengan sukacita, antusiasme, kebersamaan yang hangat, serta optimisme meraih prestasi terbaik.
                </p>
              </div>
            </div>
          </div>

          {/* Bab II: Dasar Hukum & Regulasi */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              BAB II: Dasar Pelaksanaan & Regulasi Resmi
            </h3>
            <ul className="text-xs sm:text-sm text-slate-700 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Pancasila & Undang-Undang Dasar Negara Republik Indonesia Tahun 1945.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Undang-Undang Republik Indonesia Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>AD / ART Persyarikatan Muhammadiyah & Visi Misi Madrasah Mu'allimin Muhammadiyah Yogyakarta.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Al-Qur'an Surah As-Saff ayat 4 mengenai keteguhan dan keteraturan barisan.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Peraturan Panglima TNI Nomor 58 dan 57 Tahun 2018</strong> tentang PBB & PPM TNI, serta <strong>Peraturan Panglima TNI Nomor 45 Tahun 2014</strong> khusus pelaksanaan Hormat Kanan/Kiri.</span>
              </li>
            </ul>
          </div>

          {/* Bab III: Waktu, Lokasi, dan Kuota */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              BAB III: Waktu, Lokasi, dan Sasaran Peserta
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">1. Technical Meeting</span>
                <span className="font-bold text-slate-900 block">{EVENT.TECHNICAL_MEETING_FULL_DATE}</span>
                <span className="text-slate-500">{VENUE_INDUK.NAME} ({EVENT.TECHNICAL_MEETING_TIME})</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">2. Uji Coba Lapangan</span>
                <span className="font-bold text-slate-900 block">{EVENT.FIELD_TRIAL_FULL_DATE}</span>
                <span className="text-slate-500">{VENUE.NAME} ({EVENT.FIELD_TRIAL_TIME})</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">3. Hari Perlombaan</span>
                <span className="font-bold text-slate-900 block">{EVENT.COMPETITION_DATE}</span>
                <span className="text-slate-500">{VENUE.NAME} ({EVENT.COMPETITION_TIME})</span>
              </div>
            </div>
            <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-900">
              <strong>Target Kuota Peserta:</strong> 18 Peleton SD/MI Sederajat dan 18 Peleton SMP/MTs Sederajat se-Daerah Istimewa Yogyakarta (Total 36 Peleton Kontingen).
            </div>
          </div>

          {/* Bab IV: Kategori Kejuaraan & Penghargaan */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              BAB IV: Kategori Kejuaraan & Penghargaan
            </h3>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>2 Piala Bergilir Juara Umum & Total Uang Pembinaan Rp 9.600.000</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                <li>• <strong>Piala Bergilir Juara Umum SD/MI</strong> & <strong>SMP/MTs</strong></li>
                <li>• <strong>Juara I, II, III Peleton</strong> SD/MI & SMP/MTs (Piala Tetap + Uang Pembinaan)</li>
                <li>• <strong>Juara Harapan I, II, III Peleton</strong> SD/MI & SMP/MTs (Piala Tetap)</li>
                <li>• <strong>Juara I Komandan Peleton Terbaik</strong> SD & SMP (Piala Tetap + Uang Pembinaan)</li>
                <li>• <strong>Juara II & III Komandan Peleton</strong> SD & SMP (Piala Tetap)</li>
                <li>• <strong>E-Sertifikat Piagam Penghargaan</strong> untuk seluruh pemenang resmi</li>
              </ul>
            </div>
          </div>

          {/* Bab V: Susunan Panitia */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              BAB V: Panitia & Dewan Juri
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
                <span className="font-bold text-slate-900">6 Juri Independen (TNI, POLRI, PPI)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </SimpaskorSidebarLayout>
  );
}
