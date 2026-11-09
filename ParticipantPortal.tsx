import React, { useState, useMemo } from 'react';
import {
  Users,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Upload,
  QrCode,
  Trophy,
  Award,
  ShieldCheck,
  Building,
  ChevronRight,
  Printer,
  Sparkles,
  Search,
  ExternalLink,
  MapPin,
  Flame,
  UserCheck,
  CreditCard,
  Eye,
  Info
} from 'lucide-react';

// ==========================================
// TYPES DEFINITIONS
// ==========================================
export type TabKey = 'overview' | 'roster' | 'documents' | 'idcard' | 'scores';

export interface Personel {
  id: string;
  role: 'danton' | 'pasukan' | 'cadangan' | 'official';
  shaf?: number; // 1 to 5
  banjar?: 'kanan' | 'tengah' | 'kiri';
  name: string;
  nisn: string;
  kelas: string;
  photoUrl: string;
  phone?: string;
  jabatan?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  status: 'verified' | 'pending' | 'revision';
  updatedAt: string;
  fileSize: string;
  fileName: string;
}

// ==========================================
// MOCK DATA (READY FOR FIGMA MAKE)
// ==========================================
const MOCK_TEAM = {
  id: 'LBB-2027-SMP-08',
  nomorUndian: '08',
  namaSekolah: 'SMP MUHAMMADIYAH 1 YOGYAKARTA',
  namaPeleton: 'Peleton Satria Muda',
  jenjang: 'SMP/MTs',
  kategori: 'Peleton Putra',
  statusRegistrasi: 'TERVERIFIKASI',
  basecamp: 'Ruang 2.04 Gedung Siti Walidah',
  waktuTampil: 'Sabtu, 16 Jan 2027 • 09:15 WIB',
  waktuUjiCoba: 'Jumat, 15 Jan 2027 • 14:30 WIB',
  lokasiLomba: 'Lapangan Utama Madrasah Mu\'allimin Muhammadiyah Yogyakarta',
  email: 'smpmuh1_paskibra@gmail.com',
  officialUtama: 'Bpk. Ahmad Fauzi, S.Pd',
  kontakOfficial: '0812-3456-7890',
  logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&auto=format&fit=crop&q=80',
};

const MOCK_DANTON: Personel = {
  id: 'danton-01',
  role: 'danton',
  name: 'M. Rizky Ramadhan',
  nisn: '0098765432',
  kelas: 'IX-A',
  phone: '0813-8899-7711',
  photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
};

const MOCK_PASUKAN: Personel[] = Array.from({ length: 15 }, (_, i) => {
  const shaf = Math.floor(i / 3) + 1; // 1 to 5
  const banjarCol = i % 3;
  const banjar: 'kanan' | 'tengah' | 'kiri' = banjarCol === 0 ? 'kanan' : banjarCol === 1 ? 'tengah' : 'kiri';
  const names = [
    'Farhan Al-Ghifari', 'Bima Sakti Pratama', 'Irfan Maulana',
    'Zaki Nur Rohman', 'Naufal Dwi Cahyo', 'Dimas Arya Putra',
    'Rifqi Hidayat', 'Fajar Ramadhan', 'Wildan Aditya',
    'Rendy Pangestu', 'Ilham Kurniawan', 'Daffa Ihsanudin',
    'Gibran Alamsyah', 'Satria Bagaskara', 'Hafidz Nur Syam'
  ];

  return {
    id: `pasukan-${i + 1}`,
    role: 'pasukan',
    shaf,
    banjar,
    name: names[i] || `Anggota Peleton ${i + 1}`,
    nisn: `00912345${(i + 10).toString().padStart(2, '0')}`,
    kelas: i % 2 === 0 ? 'VIII-B' : 'IX-C',
    photoUrl: `https://images.unsplash.com/photo-${1500000000000 + (i * 274819)}?w=300&auto=format&fit=crop&q=80`,
  };
});

const MOCK_CADANGAN: Personel[] = [
  {
    id: 'cadangan-01',
    role: 'cadangan',
    name: 'Kevin Raditya',
    nisn: '0094455661',
    kelas: 'VIII-A',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'cadangan-02',
    role: 'cadangan',
    name: 'Teguh Prasetyo',
    nisn: '0094455662',
    kelas: 'VIII-D',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  }
];

const MOCK_OFFICIAL: Personel[] = [
  {
    id: 'off-01',
    role: 'official',
    name: 'Ahmad Fauzi, S.Pd',
    nisn: '-',
    kelas: '-',
    jabatan: 'Pembina Utama / Guru Pendamping',
    phone: '0812-3456-7890',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'off-02',
    role: 'official',
    name: 'Bayu Wicaksono',
    nisn: '-',
    kelas: '-',
    jabatan: 'Pelatih Teknis Peleton',
    phone: '0819-8765-4321',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
  }
];

const MOCK_DOCS: DocumentItem[] = [
  {
    id: 'doc-01',
    title: 'Surat Rekomendasi & Izin Kepala Sekolah',
    description: 'Surat resmi bermaterai yang disahkan oleh Kepala Sekolah pengutus.',
    status: 'verified',
    updatedAt: '28 Des 2026',
    fileSize: '1.4 MB (PDF)',
    fileName: 'SURAT_REKOMENDASI_SMP_MUH_1.pdf'
  },
  {
    id: 'doc-02',
    title: 'Bukti Pelunasan Registrasi Komitmen',
    description: 'Slip transfer via Bank Syariah Indonesia (BSI) ke rekening panitia.',
    status: 'verified',
    updatedAt: '28 Des 2026',
    fileSize: '820 KB (JPG)',
    fileName: 'BUKTI_TRANSFER_BSI_LBB2027.jpg'
  },
  {
    id: 'doc-03',
    title: 'Pakta Integritas Fisik & Materai',
    description: 'Surat pernyataan kepatuhan tata tertib bertanda tangan pembina.',
    status: 'verified',
    updatedAt: '30 Des 2026',
    fileSize: '2.1 MB (PDF)',
    fileName: 'PAKTA_INTEGRITAS_BERMATERAI.pdf'
  },
  {
    id: 'doc-04',
    title: 'Surat Keterangan Sehat Puskesmas/Dokter',
    description: 'Surat sehat seluruh anggota peleton dan danton.',
    status: 'verified',
    updatedAt: '02 Jan 2027',
    fileSize: '3.6 MB (PDF)',
    fileName: 'SURAT_SEHAT_KOLEKTIF.pdf'
  }
];

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function ParticipantPortal() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [searchRoster, setSearchRoster] = useState('');
  const [selectedMember, setSelectedMember] = useState<Personel | null>(MOCK_DANTON);
  const [previewIdCardRole, setPreviewIdCardRole] = useState<'danton' | 'pasukan' | 'official'>('danton');

  // Filtered Roster
  const filteredPasukan = useMemo(() => {
    if (!searchRoster.trim()) return MOCK_PASUKAN;
    const q = searchRoster.toLowerCase();
    return MOCK_PASUKAN.filter(p => p.name.toLowerCase().includes(q) || p.nisn.includes(q));
  }, [searchRoster]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* TOP NOTIFICATION BAR */}
      <div className="bg-gradient-to-r from-red-700 via-red-800 to-amber-700 text-white text-xs py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PORTAL RESMI PESERTA • LOMBA BARIS-BERBARIS (LBB) MU'ALLIMIN 2027</span>
          </div>
          <div className="flex items-center gap-4 text-red-100 text-[11px]">
            <span>Technical Meeting: <strong>09 Jan 2027</strong></span>
            <span>•</span>
            <span>Hari H Lomba: <strong>16 Jan 2027</strong></span>
          </div>
        </div>
      </div>

      {/* HEADER PROFILE SECTION */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Team Identity */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 p-0.5 shadow-md flex items-center justify-center text-white font-black text-2xl tracking-tighter">
                  {MOCK_TEAM.nomorUndian}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs" title="Terverifikasi">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {MOCK_TEAM.namaSekolah}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> {MOCK_TEAM.statusRegistrasi}
                  </span>
                </div>
                <p className="text-sm font-semibold text-red-700 flex items-center gap-2 mt-0.5">
                  <span>{MOCK_TEAM.namaPeleton}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 font-normal">{MOCK_TEAM.jenjang} ({MOCK_TEAM.kategori})</span>
                </p>
              </div>
            </div>

            {/* Quick Actions & Code */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 text-right">
                <div className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">ID Peleton</div>
                <div className="text-xs font-mono font-bold text-slate-800">{MOCK_TEAM.id}</div>
              </div>
              <button 
                onClick={() => setActiveTab('idcard')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Cetak ID Card</span>
              </button>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto no-scrollbar border-b border-slate-100 -mb-4 pb-2">
            {[
              { key: 'overview', label: 'Ringkasan & Timeline', icon: Calendar },
              { key: 'roster', label: 'Susunan Personel (3×5)', icon: Users, badge: '19 Orang' },
              { key: 'documents', label: 'Berkas Dokumen', icon: FileText, badge: 'Lengkap' },
              { key: 'idcard', label: 'ID Card Digital', icon: QrCode },
              { key: 'scores', label: 'Lembar Skor & Rekap', icon: Trophy },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabKey)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-red-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
                      isActive ? 'bg-red-900/60 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ==================================================== */}
        {/* TAB 1: OVERVIEW */}
        {/* ==================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-600 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">No. Urut Tampil</span>
                  <Award className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">#{MOCK_TEAM.nomorUndian}</div>
                <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{MOCK_TEAM.waktuTampil}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-600 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Basecamp Peleton</span>
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-base font-black text-slate-900 line-clamp-1">{MOCK_TEAM.basecamp}</div>
                <div className="text-xs text-slate-600 mt-1">Check-in dibuka pkl 06:30 WIB</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-600 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Status Berkas</span>
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-xl font-black text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5" /> 4/4 Berkas Sah
                </div>
                <div className="text-xs text-slate-600 mt-1">Semua dokumen terverifikasi panitia</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-600 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Personel Peleton</span>
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">19 <span className="text-sm font-semibold text-slate-600">Org</span></div>
                <div className="text-xs text-slate-600 mt-1">1 Danton + 15 Inti + 2 Cad + 1 Off</div>
              </div>
            </div>

            {/* Schedule & Guidelines Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Timeline Card */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-red-600" />
                      Jadwal Penting & Agenda Peleton
                    </h2>
                    <p className="text-xs text-slate-600">Pastikan pembina dan danton hadir tepat waktu di lokasi.</p>
                  </div>
                  <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-[11px] font-bold">
                    WIB (Waktu Indonesia Barat)
                  </span>
                </div>

                <div className="mt-6 space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
                  
                  {/* Event 1 */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold z-10 ring-4 ring-white">
                      ✓
                    </div>
                    <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-700 uppercase">Tahap 1 • Selesai</span>
                        <span className="text-[11px] text-slate-600">28 Des 2026</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">Pendaftaran & Verifikasi Berkas Online</h3>
                      <p className="text-xs text-slate-600 mt-0.5">Admin LBB telah menyetujui seluruh data dan dokumen peleton.</p>
                    </div>
                  </div>

                  {/* Event 2 */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold z-10 ring-4 ring-white">
                      2
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-xl border-2 border-red-200 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-red-700 uppercase">Tahap 2 • Mendatang</span>
                        <span className="text-[11px] font-semibold text-slate-600">09 Jan 2027 • 08:30 WIB</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">Technical Meeting (TM) & Undian Definitif</h3>
                      <p className="text-xs text-slate-600 mt-0.5">Bertempat di Aula Utama Madrasah Mu'allimin Yogyakarta. Wajib dihadiri Official & Danton.</p>
                    </div>
                  </div>

                  {/* Event 3 */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold z-10 ring-4 ring-white">
                      3
                    </div>
                    <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-700 uppercase">Tahap 3</span>
                        <span className="text-[11px] text-slate-600">15 Jan 2027 • 14:30 WIB</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">Uji Coba Lapangan (Field Trial)</h3>
                      <p className="text-xs text-slate-600 mt-0.5">Orientasi medan lomba, sudut pandang juri, dan penyesuaian akustik danton (15 menit).</p>
                    </div>
                  </div>

                  {/* Event 4 */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold z-10 ring-4 ring-white">
                      4
                    </div>
                    <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 uppercase">Puncak Acara</span>
                        <span className="text-[11px] text-slate-600">16 Jan 2027 • 06:30 WIB</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">Hari-H Perlombaan LBB Mu'allimin 2027</h3>
                      <p className="text-xs text-slate-600 mt-0.5">Apel Pembukaan, Masuk Daerah Persiapan (DP 1, 2, 3), dan Tampil di Lapangan Utama.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Quick Downloads & Assistance */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4" /> Regulasi Resmi
                  </div>
                  <h3 className="text-lg font-black tracking-tight">Buku Petunjuk Teknis (Juknis) 2027</h3>
                  <p className="text-slate-300 text-xs mt-1 mb-4 leading-relaxed">
                    Pelajari batas waktu pergerakan lapangan, materi wajib PBB dasar, variasi formasi, serta pengurangan nilai.
                  </p>
                  <a
                    href="#download"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Unduh Juknis & Tata Tertib (PDF)
                  </a>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider mb-3">Kontak Panitia Lapangan</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <div className="font-bold text-slate-800">Sie Acara & Perlombaan</div>
                        <div className="text-[11px] text-slate-600">Konfirmasi jadwal & undian</div>
                      </div>
                      <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px]">
                        WhatsApp
                      </a>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <div className="font-bold text-slate-800">Sie Basecamp & Logistik</div>
                        <div className="text-[11px] text-slate-600">Fasilitas ruang & barang</div>
                      </div>
                      <a href="https://wa.me/6281234567891" target="_blank" rel="noreferrer" className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px]">
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: ROSTER PELETON (3x5 GRID VISUALIZER) */}
        {/* ==================================================== */}
        {activeTab === 'roster' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Controls */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-600" />
                  Formasi Pasukan 3 Banjar × 5 Shaf
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Posisi pasukan resmi sesuai verifikasi formulir A. Klik salah satu personel untuk melihat detail identitas.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    type="text"
                    value={searchRoster}
                    onChange={(e) => setSearchRoster(e.target.value)}
                    placeholder="Cari nama / NISN..."
                    className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600 w-48 sm:w-60"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Formasi Lapangan (2 Col) */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                
                {/* DANTON SECTION */}
                <div className="mb-8">
                  <div className="text-[11px] font-black uppercase text-red-700 tracking-wider mb-2 text-center">
                    ★ Komandan Peleton (Danton) ★
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => setSelectedMember(MOCK_DANTON)}
                      className={`flex items-center gap-3.5 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                        selectedMember?.id === MOCK_DANTON.id
                          ? 'border-red-600 bg-red-50/50 shadow-md ring-2 ring-red-200'
                          : 'border-slate-200 hover:border-red-300 bg-white'
                      }`}
                    >
                      <img
                        src={MOCK_DANTON.photoUrl}
                        alt={MOCK_DANTON.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                      />
                      <div className="text-left">
                        <div className="text-xs font-black text-slate-900">{MOCK_DANTON.name}</div>
                        <div className="text-[11px] text-slate-600">NISN: {MOCK_DANTON.nisn} • Kelas {MOCK_DANTON.kelas}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 bg-red-700 text-white rounded text-[9px] font-bold uppercase">
                          Danton Utama
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 3x5 PASUKAN MATRIX */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-3 px-2 border-b pb-2">
                    <span className="w-1/3 text-left">Banjar Kiri</span>
                    <span className="w-1/3 text-center">Banjar Tengah</span>
                    <span className="w-1/3 text-right">Banjar Kanan</span>
                  </div>

                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((shafNum) => {
                      const rowMembers = filteredPasukan.filter(p => p.shaf === shafNum);
                      return (
                        <div key={shafNum} className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-600 w-10 text-right pr-2">
                            Shaf {shafNum}
                          </span>
                          
                          <div className="grid grid-cols-3 gap-2 flex-1">
                            {['kiri', 'tengah', 'kanan'].map((col) => {
                              const member = rowMembers.find(p => p.banjar === col);
                              if (!member) {
                                return (
                                  <div key={col} className="p-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-[10px] text-slate-600">
                                    -
                                  </div>
                                );
                              }

                              const isSelected = selectedMember?.id === member.id;
                              return (
                                <button
                                  key={member.id}
                                  onClick={() => setSelectedMember(member)}
                                  className={`p-2 rounded-xl border transition-all text-left flex items-center gap-2 cursor-pointer ${
                                    isSelected
                                      ? 'border-red-600 bg-red-50 ring-2 ring-red-100'
                                      : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100'
                                  }`}
                                >
                                  <img
                                    src={member.photoUrl}
                                    alt={member.name}
                                    className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="text-[11px] font-bold text-slate-900 truncate">{member.name}</div>
                                    <div className="text-[9px] text-slate-600 truncate">{member.kelas}</div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CADANGAN & OFFICIAL LIST */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-900 mb-2">Pasukan Cadangan (2)</h4>
                      <div className="space-y-2">
                        {MOCK_CADANGAN.map((cad) => (
                          <div
                            key={cad.id}
                            onClick={() => setSelectedMember(cad)}
                            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3 cursor-pointer hover:bg-slate-100"
                          >
                            <img src={cad.photoUrl} alt={cad.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <div className="text-xs font-bold text-slate-800">{cad.name}</div>
                              <div className="text-[10px] text-slate-600">Kelas {cad.kelas} • NISN {cad.nisn}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-900 mb-2">Official / Pembina (2)</h4>
                      <div className="space-y-2">
                        {MOCK_OFFICIAL.map((off) => (
                          <div
                            key={off.id}
                            onClick={() => setSelectedMember(off)}
                            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3 cursor-pointer hover:bg-slate-100"
                          >
                            <img src={off.photoUrl} alt={off.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <div className="text-xs font-bold text-slate-800">{off.name}</div>
                              <div className="text-[10px] text-slate-600">{off.jabatan}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Detail Profile Panel (1 Col) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                {selectedMember ? (
                  <div className="text-center">
                    <div className="relative inline-block mx-auto mb-4">
                      <img
                        src={selectedMember.photoUrl}
                        alt={selectedMember.name}
                        className="w-28 h-28 rounded-2xl object-cover border-4 border-slate-100 shadow-md"
                      />
                      <span className="absolute bottom-0 right-0 px-2 py-0.5 bg-red-700 text-white rounded-lg text-[10px] font-bold uppercase shadow-xs">
                        {selectedMember.role}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900">{selectedMember.name}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {selectedMember.role === 'official' ? selectedMember.jabatan : `Kelas ${selectedMember.kelas}`}
                    </p>

                    <div className="mt-6 border-t border-slate-100 pt-4 text-left space-y-3">
                      <div className="flex justify-between text-xs py-1.5 border-b border-slate-50">
                        <span className="text-slate-600">ID Anggota</span>
                        <span className="font-mono font-bold text-slate-800">{selectedMember.id}</span>
                      </div>
                      <div className="flex justify-between text-xs py-1.5 border-b border-slate-50">
                        <span className="text-slate-600">NISN</span>
                        <span className="font-mono font-semibold text-slate-800">{selectedMember.nisn}</span>
                      </div>
                      {selectedMember.shaf && (
                        <div className="flex justify-between text-xs py-1.5 border-b border-slate-50">
                          <span className="text-slate-600">Posisi Shaf</span>
                          <span className="font-bold text-slate-800">Shaf {selectedMember.shaf} (Banjar {selectedMember.banjar})</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs py-1.5">
                        <span className="text-slate-600">Status Validasi</span>
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Lolos Verifikasi
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button 
                        onClick={() => setActiveTab('idcard')}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <Printer className="w-4 h-4 text-amber-400" />
                        <span>Cetak ID Card Anggota Ini</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-600 text-xs">
                    Pilih salah satu anggota peleton di bagan sebelah kiri.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: DOCUMENTS TAB */}
        {/* ==================================================== */}
        {activeTab === 'documents' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  Berkas & Dokumen Administrasi Lomba
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Seluruh dokumen digital telah diverifikasi oleh Tim Kesekretariatan LBB Mu'allimin 2027.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" /> Berkas Lengkap & Sah
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_DOCS.map((doc) => (
                <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-red-200 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-slate-900 truncate">{doc.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{doc.description}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-600 mt-3">
                        <span>{doc.fileSize}</span>
                        <span>•</span>
                        <span>Diperbarui {doc.updatedAt}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> Sah
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-600 truncate max-w-[200px]">
                      {doc.fileName}
                    </span>
                    <button className="text-red-700 hover:text-red-800 font-bold inline-flex items-center gap-1 text-[11px] hover:underline">
                      <Eye className="w-3.5 h-3.5" /> Pratinjau
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: ID CARD DIGITAL PREVIEW */}
        {/* ==================================================== */}
        {activeTab === 'idcard' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-red-600" />
                  Kartu Tanda Peserta (ID Card Digital)
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  ID Card wajib dikalungkan selama berada di area perlombaan dan digunakan untuk scan DP 1, 2, 3.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm">
                  <Download className="w-4 h-4" />
                  <span>Unduh Semua ID Card (PDF)</span>
                </button>
              </div>
            </div>

            {/* Filter Card Role */}
            <div className="flex justify-center gap-2">
              {[
                { key: 'danton', label: 'Komandan Peleton' },
                { key: 'pasukan', label: 'Pasukan Inti' },
                { key: 'official', label: 'Official / Pembina' },
              ].map(r => (
                <button
                  key={r.key}
                  onClick={() => setPreviewIdCardRole(r.key as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    previewIdCardRole === r.key
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* ID Card Visualizer (Standard Lanyard Format) */}
            <div className="flex justify-center py-6">
              <div className="w-[320px] rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-200 relative">
                {/* Lanyard Hole */}
                <div className="bg-slate-100 py-2 flex justify-center border-b border-slate-200">
                  <div className="w-12 h-2.5 rounded-full bg-slate-300" />
                </div>

                {/* ID Card Header */}
                <div className="bg-gradient-to-r from-red-700 via-red-800 to-amber-700 text-white p-5 text-center relative overflow-hidden">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-amber-300">
                    KARTU TANDA PESERTA RESMI
                  </div>
                  <h3 className="text-sm font-black tracking-tight mt-0.5">
                    LBB MU'ALLIMIN 2027
                  </h3>
                  <div className="text-[9px] text-red-100">Madrasah Mu'allimin Muhammadiyah Yogyakarta</div>
                </div>

                {/* ID Card Body */}
                <div className="p-6 text-center">
                  <div className="w-28 h-32 rounded-2xl mx-auto overflow-hidden border-2 border-red-600 shadow-md mb-3 bg-slate-100">
                    <img
                      src={
                        previewIdCardRole === 'danton'
                          ? MOCK_DANTON.photoUrl
                          : previewIdCardRole === 'official'
                          ? MOCK_OFFICIAL[0].photoUrl
                          : MOCK_PASUKAN[0].photoUrl
                      }
                      alt="Peserta"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h4 className="text-base font-black text-slate-900">
                    {previewIdCardRole === 'danton'
                      ? MOCK_DANTON.name
                      : previewIdCardRole === 'official'
                      ? MOCK_OFFICIAL[0].name
                      : MOCK_PASUKAN[0].name}
                  </h4>
                  <p className="text-xs font-bold text-red-700 mt-0.5">
                    {MOCK_TEAM.namaSekolah}
                  </p>

                  <div className="mt-3 inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 text-red-800">
                    {previewIdCardRole === 'danton'
                      ? 'KOMANDAN PELETON'
                      : previewIdCardRole === 'official'
                      ? 'OFFICIAL PEMBINA'
                      : 'ANGGOTA PASUKAN'}
                  </div>

                  {/* QR Code Section */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-left text-[10px] text-slate-600">
                      <div>No. Undian: <strong className="text-slate-900 font-bold text-xs">#{MOCK_TEAM.nomorUndian}</strong></div>
                      <div>ID: {MOCK_TEAM.id}</div>
                      <div className="text-emerald-600 font-bold mt-1">● VERIFIED BADGE</div>
                    </div>
                    <div className="w-16 h-16 bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center justify-center">
                      <QrCode className="w-14 h-14 text-slate-900" />
                    </div>
                  </div>
                </div>

                {/* Bottom Strip */}
                <div className="bg-slate-900 text-white text-[9px] py-1.5 text-center font-bold tracking-wider uppercase">
                  Mu'allimin Marching Competition
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: SCORES & RECAP TAB */}
        {/* ==================================================== */}
        {activeTab === 'scores' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Rekapitulasi Penilaian Dewan Juri
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Lembar transparansi nilai resmi LBB Mu'allimin 2027.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold">
                  Status: Menunggu Hari Perlombaan
                </span>
              </div>
            </div>

            {/* Score Preview / Placeholder */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-xl mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-900">Penilaian Belum Dimulai</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
                Lembar penilaian dan transparansi skor tiap pos (PBB Dasar, Variasi & Formasi, Danton Terbaik, Kostum) akan otomatis muncul secara live setelah peleton menyelesaikan penampilan di Lapangan Utama.
              </p>

              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Komponen Penilaian:</div>
                <div className="flex justify-between text-slate-600">
                  <span>1. PBB Dasar & Gerakan di Tempat</span>
                  <span className="font-bold text-slate-800">40%</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>2. Variasi & Formasi Kreatif</span>
                  <span className="font-bold text-slate-800">30%</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>3. Kualitas & Artikulasi Komandan Peleton (Danton)</span>
                  <span className="font-bold text-slate-800">20%</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>4. Kerapian Kostum, Keseragaman & Make-up</span>
                  <span className="font-bold text-slate-800">10%</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
