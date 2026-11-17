import React, { useState, useMemo, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  Award,
  Trophy,
  Crown,
  Search,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Palette,
  Type,
  Layout,
  LayoutDashboard,
  Sliders,
  FileText,
  FileSpreadsheet,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  Clock,
  Calendar,
  Users,
  Building2,
  Lock,
  Unlock,
  Eye,
  Download,
  Upload,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Terminal,
  Grid,
  Menu,
  Moon,
  Sun,
  Flame,
  Radio,
  CheckSquare,
  Square,
  Compass,
  FileCheck,
  Send,
  Printer,
  QrCode,
  Smartphone,
  Laptop,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  MapPin,
  HelpCircle,
  Code2,
  Share2,
  Settings,
  Filter,
  CheckCircle,
  BookOpen,
  Image as ImageIcon,
  SlidersHorizontal,
  Bookmark,
  FileWarning,
  Maximize2
} from 'lucide-react';

import logoLbb from '../assets/logo-tonti.png';
import logoTonti from '../assets/logo-tonti-muallimin.png';
import logoMuallimin from '../assets/logo-muallimin.png';
import titleLogoImg from '../assets/title-logo.png';

// ============================================================================
// DATA PRD: TOKENS WARNA DENGAN NILAI HEX, RGB, DAN CMYK (PRINT)
// ============================================================================
const COLOR_TOKENS = [
  {
    role: 'Primary (Identitas LBB27)',
    name: 'brand-crimson',
    hex: '#8B0000',
    rgb: 'rgb(139, 0, 0)',
    cmyk: 'C:15 M:100 Y:100 K:45',
    usage: 'Warna dominan panji, tombol CTA utama, judul resmi, kop surat, backdrop.',
    badgeClass: 'bg-[#8B0000] text-white',
    textLight: true
  },
  {
    role: 'Secondary (Kehormatan/Prestasi)',
    name: 'brand-gold',
    hex: '#FFD700',
    rgb: 'rgb(255, 215, 0)',
    cmyk: 'C:0 M:15 Y:100 K:0',
    usage: 'Trofi bergilir, aksen medali juara 1 umum, highlight predikat terbaik.',
    badgeClass: 'bg-[#FFD700] text-slate-950 font-bold',
    textLight: false
  },
  {
    role: 'Accent (Penekanan Aksi)',
    name: 'brand-gold-wcag',
    hex: '#a16207',
    rgb: 'rgb(161, 98, 7)',
    cmyk: 'C:20 M:60 Y:100 K:25',
    usage: 'Teks aksen emas di atas latar terang agar memenuhi WCAG 2.2 Level AA (4.6:1).',
    badgeClass: 'bg-[#a16207] text-white',
    textLight: true
  },
  {
    role: 'Background (Latar Utama)',
    name: 'bg-canvas-clean',
    hex: '#fafbfc',
    rgb: 'rgb(250, 251, 252)',
    cmyk: 'C:1 M:0 Y:0 K:1',
    usage: 'Kanvas utama portal, web publik, dokumen administrasi.',
    badgeClass: 'bg-[#fafbfc] text-slate-800 border border-slate-300',
    textLight: false
  },
  {
    role: 'Surface (Latar Komponen)',
    name: 'surface-card',
    hex: '#ffffff',
    rgb: 'rgb(255, 255, 255)',
    cmyk: 'C:0 M:0 Y:0 K:0',
    usage: 'Kartu informasi, modal dialog, formulir input, baris tabel.',
    badgeClass: 'bg-white text-slate-800 border border-slate-300',
    textLight: false
  },
  {
    role: 'Text Primary',
    name: 'text-primary',
    hex: '#0f172a',
    rgb: 'rgb(15, 23, 42)',
    cmyk: 'C:64 M:45 Y:0 K:84',
    usage: 'Teks judul utama, isi paragraf formal, skor data peleton.',
    badgeClass: 'bg-[#0f172a] text-white',
    textLight: true
  },
  {
    role: 'Text Secondary',
    name: 'text-secondary',
    hex: '#64748b',
    rgb: 'rgb(100, 116, 139)',
    cmyk: 'C:28 M:17 Y:0 K:45',
    usage: 'Keterangan meta, label pembantu, instruksi juknis tambahan.',
    badgeClass: 'bg-[#64748b] text-white',
    textLight: true
  },
  {
    role: 'Border & Divider',
    name: 'border-hairline',
    hex: '#e2e8f0',
    rgb: 'rgb(226, 232, 240)',
    cmyk: 'C:6 M:3 Y:0 K:6',
    usage: 'Garis pembatas komponen, stroke kartu ID Card, pemisah tabel.',
    badgeClass: 'bg-[#e2e8f0] text-slate-700 border border-slate-300',
    textLight: false
  },
  {
    role: 'Success / Verified',
    name: 'status-success',
    hex: '#10b981',
    rgb: 'rgb(16, 185, 129)',
    cmyk: 'C:75 M:0 Y:60 K:0',
    usage: 'Status verifikasi sah, berkas lengkap, pembayaran terkonfirmasi.',
    badgeClass: 'bg-[#10b981] text-white',
    textLight: true
  },
  {
    role: 'Warning / Pending',
    name: 'status-warning',
    hex: '#f59e0b',
    rgb: 'rgb(245, 158, 11)',
    cmyk: 'C:0 M:40 Y:100 K:0',
    usage: 'Status menunggu verifikasi, batas tenggat H-7, peluit menit ke-8.',
    badgeClass: 'bg-[#f59e0b] text-slate-950 font-bold',
    textLight: false
  },
  {
    role: 'Danger / Error',
    name: 'status-danger',
    hex: '#f43f5e',
    rgb: 'rgb(244, 63, 94)',
    cmyk: 'C:0 M:90 Y:50 K:0',
    usage: 'Penalti lapangan, berkas ditolak, diskualifikasi waktu habis.',
    badgeClass: 'bg-[#f43f5e] text-white',
    textLight: true
  },
  {
    role: 'Info / Staging',
    name: 'status-info',
    hex: '#0284c7',
    rgb: 'rgb(2, 132, 199)',
    cmyk: 'C:85 M:45 Y:0 K:0',
    usage: 'Pengumuman resmi, tahapan pos DP 1 - DP 3, kategori SMP.',
    badgeClass: 'bg-[#0284c7] text-white',
    textLight: true
  }
];

// ============================================================================
// DATA PRD: TIPOGRAFI INTER SESUAI BAGIAN 6.2
// ============================================================================
const TYPOGRAPHY_SCALE = [
  { style: 'Display', size: '36px / 2.25rem', weight: 'Font-Black 900', line: '1.15', tracking: '-0.03em', usage: 'Headline utama poster, baliho panggung, hero landing page.' },
  { style: 'Heading 1 (H1)', size: '30px / 1.875rem', weight: 'Extrabold 800', line: '1.2', tracking: '-0.025em', usage: 'Judul halaman website, sertifikat juara, kop surat resmi.' },
  { style: 'Heading 2 (H2)', size: '24px / 1.5rem', weight: 'Extrabold 800', line: '1.25', tracking: '-0.02em', usage: 'Judul seksi, nama peleton di portal, papan klasemen.' },
  { style: 'Heading 3 (H3)', size: '18px / 1.125rem', weight: 'Bold 700', line: '1.3', tracking: '-0.01em', usage: 'Subjudul kartu tim, header tabel nilai juri, judul dialog.' },
  { style: 'Body Large', size: '16px / 1.0rem', weight: 'Medium 500 / Semi 600', line: '1.5', tracking: '0em', usage: 'Pernyataan pakta integritas, pengumuman penting, lead paragraf.' },
  { style: 'Body', size: '14px / 0.875rem', weight: 'Regular 400', line: '1.5', tracking: '0em', usage: 'Isi juknis perlombaan, tata tertib, deskripsi materi PBB.' },
  { style: 'Label', size: '12px / 0.75rem', weight: 'Bold 700 / Semi 600', line: '1.3', tracking: '0.01em', usage: 'Label input formulir, status badge, tombol aksi.' },
  { style: 'Caption', size: '11px / 0.6875rem', weight: 'Regular 400', line: '1.4', tracking: '0.01em', usage: 'Keterangan tanggal, footnote panduan, batas upload berkas.' },
  { style: 'Overline / Kicker', size: '10px / 0.625rem', weight: 'Black 900', line: '1.2', tracking: '0.14em', usage: 'Kategori peleton, penanda babak, uppercase kicker.' },
  { style: 'Tabular Numerics', size: 'Variable', weight: 'Bold 700 / Black 900', line: '1.0', tracking: '0em', usage: 'font-mono tabular-nums: Skor juri, stopwatch arena, nomor LOT.' }
];

// ============================================================================
// DATA PRD: SPACING SCALE BERBASIS 4px (BAGIAN 6.3)
// ============================================================================
const SPACING_SCALE = [
  { token: 'space-1', px: '4px', rem: '0.25rem', use: 'Micro gap, border offset, icon margin' },
  { token: 'space-2', px: '8px', rem: '0.50rem', use: 'Compact padding button, badge gap' },
  { token: 'space-3', px: '12px', rem: '0.75rem', use: 'Form input horizontal padding' },
  { token: 'space-4', px: '16px', rem: '1.00rem', use: 'Card inner padding, standard gap' },
  { token: 'space-6', px: '24px', rem: '1.50rem', use: 'Section inner padding, modal padding' },
  { token: 'space-8', px: '32px', rem: '2.00rem', use: 'Grid gap besar, card separation' },
  { token: 'space-10', px: '40px', rem: '2.50rem', use: 'Section margin vertical' },
  { token: 'space-12', px: '48px', rem: '3.00rem', use: 'Container padding desktop' },
  { token: 'space-16', px: '64px', rem: '4.00rem', use: 'Hero vertical separation' },
];

// ============================================================================
// DAFTAR MODUL UTAMA DESIGN SYSTEM (PRD MAP)
// ============================================================================
const PRD_SECTIONS = [
  { id: 'prd-overview', title: '1. PRD & Fondasi', desc: 'Latar Belakang & 6 Prinsip Desain', icon: BookOpen },
  { id: 'brand-identity', title: '2. Brand & Logo System', desc: 'Identitas, Personality & Aturan Logo', icon: ShieldCheck },
  { id: 'design-tokens', title: '3. Design Tokens (HEX/CMYK)', desc: 'Warna, Tipografi, Spacing 4px', icon: Palette },
  { id: 'component-library', title: '4. Component Library', desc: 'Button, Forms, Badges, Modals', icon: Sliders },
  { id: 'lbb-operational', title: '5. Modul Khusus LBB', desc: 'Stopwatch Arena, Rubrik Juri, ID Card', icon: Trophy },
  { id: 'digital-interfaces', title: '6. Digital Interfaces', desc: 'Web Publik, Portal, Dashboard Juri', icon: Laptop },
  { id: 'print-templates', title: '7. Print & Social Media', desc: 'Feed 1:1, Story, Sertifikat, Gate', icon: Printer },
  { id: 'governance', title: '8. Governance & SemVer', desc: 'Aturan Perubahan, Do & Don\'t, QA', icon: FileCheck },
];

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState('prd-overview');
  const [toastMsg, setToastMsg] = useState(null);

  // Interactive Button Props Playground
  const [btnVariant, setBtnVariant] = useState('primary');
  const [btnSize, setBtnSize] = useState('md');
  const [btnState, setBtnState] = useState('default'); // 'default' | 'loading' | 'disabled' | 'success' | 'error'
  const [btnIcon, setBtnIcon] = useState(true);
  const [btnLabel, setBtnLabel] = useState('Verifikasi Berkas Peleton');

  // Interactive Form Inputs
  const [formText, setFormText] = useState('SMP Muhammadiyah 1 Yogyakarta');
  const [formSelect, setFormSelect] = useState('smp');
  const [formCheck, setFormCheck] = useState(true);
  const [formRadio, setFormRadio] = useState('putra');

  // Interactive Arena Timer (Khusus LBB)
  const [timerSec, setTimerSec] = useState(582); // 09:42
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Interactive Scoring Engine (Khusus LBB)
  const [scores, setScores] = useState({
    0: 88, // Baik
    1: 95, // Baik Sekali
    2: 80, // Cukup
    3: 72, // Kurang
    4: 90  // Baik
  });
  const [penalties, setPenalties] = useState({
    garis: false,
    waktu: true,
    atribut: false
  });

  // Demo Modal State
  const [modalOpen, setModalOpen] = useState(false);

  // Timer Tick
  useEffect(() => {
    let t = null;
    if (isTimerActive) {
      t = setInterval(() => {
        setTimerSec((prev) => (prev >= 600 ? 600 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(t);
  }, [isTimerActive]);

  const formatMinSec = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const notify = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const copyToClipboard = (text, label = 'Teks') => {
    navigator.clipboard.writeText(text);
    notify(`${label} disalin ke clipboard!`);
  };

  // Kalkulasi Skor Total Rubrik
  const calculatedScore = useMemo(() => {
    const raw = Object.values(scores).reduce((a, b) => a + (b || 0), 0);
    const pen = (penalties.garis ? 5 : 0) + (penalties.waktu ? 10 : 0) + (penalties.atribut ? 15 : 0);
    return Math.max(0, raw - pen);
  }, [scores, penalties]);

  // Dynamic Button Code Generator
  const generatedBtnCode = useMemo(() => {
    let classes = [];
    if (btnVariant === 'primary') classes.push('bg-[#8B0000] hover:bg-[#6d0a0a] text-white shadow-xs');
    if (btnVariant === 'gold') classes.push('bg-[#FFD700] hover:bg-[#eab308] text-slate-950 font-bold shadow-xs');
    if (btnVariant === 'outline') classes.push('border border-slate-300 hover:bg-slate-100 text-slate-700 bg-white');
    if (btnVariant === 'subtle') classes.push('bg-slate-100 hover:bg-slate-200 text-slate-700');
    if (btnVariant === 'danger') classes.push('bg-rose-600 hover:bg-rose-700 text-white shadow-xs');

    if (btnSize === 'xs') classes.push('px-2.5 py-1 text-xs rounded-lg');
    if (btnSize === 'sm') classes.push('px-3.5 py-1.5 text-xs font-semibold rounded-xl');
    if (btnSize === 'md') classes.push('px-5 py-2.5 text-sm font-bold rounded-xl');
    if (btnSize === 'lg') classes.push('px-7 py-3.5 text-base font-bold rounded-2xl shadow-md');

    classes.push('inline-flex items-center justify-center gap-2 transition-all active:scale-95');

    return `<button\n  className="${classes.join(' ')}"${btnState === 'disabled' ? '\n  disabled' : ''}\n>\n  ${
      btnState === 'loading'
        ? '<RefreshCw className="w-4 h-4 animate-spin" />\n  <span>Memproses...</span>'
        : `${btnIcon ? '<ShieldCheck className="w-4 h-4" />\n  ' : ''}<span>${btnLabel}</span>`
    }\n</button>`;
  }, [btnVariant, btnSize, btnState, btnIcon, btnLabel]);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans antialiased selection:bg-red-100 selection:text-red-900">
      
      {/* Toast Notifikasi */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-950 text-white font-medium text-xs px-4 py-3 rounded-2xl shadow-xl shadow-slate-900/20 border border-slate-800 animate-fade">
          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* --- TOP HEADER (PRD SPECIFIED SINGLE SOURCE OF TRUTH) --- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B0000] p-1.5 flex items-center justify-center shadow-xs">
              <img src={logoLbb} alt="Logo" className="w-full h-full object-contain filter drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 uppercase">
                  LBB MU'ALLIMIN 2027
                </span>
                <span className="px-2 py-0.5 rounded-md bg-red-50 text-[#8B0000] border border-red-200 text-[10px] font-mono font-bold">
                  PRD v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Single Source of Truth (SSOT) • Brand, Tokens, Components & Print Specs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Status PRD: Terverifikasi Draft 1.0</span>
            </div>
            <button
              onClick={() => copyToClipboard('https://lbb.tontimuallimin.com/design-system.html', 'URL Design System')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bagikan URL</span>
            </button>
          </div>

        </div>
      </header>

      {/* --- PRD EXECUTIVE BANNER --- */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B0000] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-md">
                Dokumen Acuan Produk Resmi
              </span>
              <span className="text-xs text-slate-400 font-mono">Penyelenggara: Madrasah Mu'allimin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Design System & Brand Guidelines LBB27
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Panduan implementasi desain lintas media komunikasi (publikasi cetak, signage arena, sertifikat resmi, web portal, hingga antarmuka penjurian lapangan).
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center min-w-[96px]">
              <div className="text-lg font-bold font-mono text-[#8B0000]">P0 & P1</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Deliverables</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center min-w-[96px]">
              <div className="text-lg font-bold font-mono text-emerald-700">WCAG 2.2</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Level AA</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center min-w-[96px]">
              <div className="text-lg font-bold font-mono text-slate-900">4px Base</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Spacing Grid</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN WORKSPACE WITH 8 PRD TABS --- */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* PRD NAVIGATION SIDEBAR */}
          <aside className="lg:col-span-3 sticky top-24 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Navigasi Dokumen PRD
              </div>

              <nav className="space-y-1">
                {PRD_SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeTab === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(sec.id);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-start gap-2.5 ${
                        isActive
                          ? 'bg-red-50 text-[#8B0000] border border-red-200/90 shadow-xs'
                          : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-[#8B0000]' : 'text-slate-400'}`} />
                      <div>
                        <div className="text-xs font-bold leading-tight">{sec.title}</div>
                        <div className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">{sec.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1 px-2">
                <div className="flex justify-between font-mono">
                  <span>Nama Resmi:</span>
                  <span className="font-bold text-slate-800">LBB Mu'allimin 2027</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Nama Pendek:</span>
                  <span className="font-bold text-[#8B0000]">LBB27</span>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-9 space-y-12">

            {/* ============================================================== */}
            {/* PRD 1: LATAR BELAKANG, TUJUAN & 6 PRINSIP DESAIN               */}
            {/* ============================================================== */}
            {activeTab === 'prd-overview' && (
              <div className="space-y-8 animate-fade">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-[11px] font-bold text-[#8B0000] uppercase tracking-wider">
                    PRD Bagian 1 - 4 // Background & Foundations
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Tujuan & 6 Prinsip Desain LBB Mu'allimin 2027
                  </h2>
                </div>

                {/* 6 Core Principles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { num: '4.1', title: 'Consistency', desc: 'Seluruh media memiliki karakter visual yang seragam lintas platform fisik dan sistem digital.' },
                    { num: '4.2', title: 'Clarity', desc: 'Informasi vital (tanggal, lokasi, kuota 36 peleton, biaya Rp 250rb, tenggat pendaftaran) memiliki hierarki visual jelas.' },
                    { num: '4.3', title: 'Professionalism', desc: 'Memberikan impresi kompetisi baris-berbaris yang kredibel, berintegritas, dan terorganisasi rapi.' },
                    { num: '4.4', title: 'Functionality', desc: 'Setiap elemen desain (warna, border, badge, tipografi) memiliki fungsi tegas dan makna operasional.' },
                    { num: '4.5', title: 'Scalability', desc: 'Sistem mudah dikembangkan untuk kebutuhan regenerasi panitia dan perlombaan tahun-tahun mendatang.' },
                    { num: '4.6', title: 'Accessibility', desc: 'Kepatuhan kontras rasio WCAG 2.2 Level AA untuk keterbacaan teks peserta dan juri di bawah terik matahari.' }
                  ].map((p) => (
                    <div key={p.num} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-[#8B0000] bg-red-50 border border-red-100 px-2 py-0.5 rounded">
                          Prinsip {p.num}
                        </span>
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{p.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Scope Coverage Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Matriks 6 Area Ruang Lingkup PRD
                    </span>
                    <span className="text-xs font-mono text-slate-500">Versi 1.0</span>
                  </div>
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="py-3 px-4 w-44">Area Desain</th>
                        <th className="py-3 px-4">Cakupan Implementasi</th>
                        <th className="py-3 px-4 w-28 text-center">Prioritas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Brand Identity</td>
                        <td className="py-3 px-4 text-slate-600">Logo, warna almamater, identitas karakter disiplin & kompetitif</td>
                        <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold font-mono">P0</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Design Tokens</td>
                        <td className="py-3 px-4 text-slate-600">Palet HEX/RGB/CMYK, tipografi Inter, spacing kelipatan 4px, elevation</td>
                        <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold font-mono">P0</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Components</td>
                        <td className="py-3 px-4 text-slate-600">Tombol 8 state, input form, modal dialog, checklist rubrik juri, data table</td>
                        <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold font-mono">P0</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Templates Media</td>
                        <td className="py-3 px-4 text-slate-600">Poster publikasi, IG Feed 1:1, Story 9:16, sertifikat juara, piagam penghargaan</td>
                        <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold font-mono">P0</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Digital Interface</td>
                        <td className="py-3 px-4 text-slate-600">Website publik, portal peserta, dashboard panitia, timer & scoring juri</td>
                        <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold font-mono">P1</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Guidelines & Governance</td>
                        <td className="py-3 px-4 text-slate-600">Aturan do & don't, clear space logo, semantic versioning, audit konsistensi</td>
                        <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold font-mono">P0</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* PRD 2: BRAND IDENTITY & LOGO SYSTEM                            */}
            {/* ============================================================== */}
            {activeTab === 'brand-identity' && (
              <div className="space-y-8 animate-fade">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-[11px] font-bold text-[#8B0000] uppercase tracking-wider">
                    PRD Bagian 5 // Brand Identity & Logo System
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Sistem Logo & Brand Personality (LBB27)
                  </h2>
                </div>

                {/* 5 Brand Personality Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {[
                    { title: 'Disiplin', desc: 'Ketertiban baris-berbaris dan kepatuhan regulasi lomba.' },
                    { title: 'Ketegasan', desc: 'Komposisi visual solid dengan kontras tinggi.' },
                    { title: 'Prestasi', desc: 'Semangat kompetisi sehat memperebutkan trofi bergilir.' },
                    { title: 'Integritas', desc: 'Transparansi rekapitulasi nilai dan kredibilitas juri.' },
                    { title: 'Modernitas', desc: 'Pendekatan Clean SaaS kontemporer dan sistem digital.' }
                  ].map((b, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 text-center space-y-1 shadow-xs">
                      <div className="w-8 h-8 rounded-full bg-red-50 text-[#8B0000] font-black text-xs flex items-center justify-center mx-auto">
                        0{i + 1}
                      </div>
                      <div className="font-bold text-xs text-slate-900 pt-1">{b.title}</div>
                      <div className="text-[10px] text-slate-500 leading-tight">{b.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Logo Variants Showcase (Section 5.3) */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#8B0000]" />
                    6 Varian Logo Terstandarisasi
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Primary */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-3 shadow-xs">
                      <div className="h-20 flex items-center justify-center">
                        <img src={logoLbb} alt="Primary" className="max-h-16 object-contain" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">1. Primary Logo (Full Color)</div>
                        <div className="text-[10px] text-slate-400 font-mono">Digunakan pada kop surat & web</div>
                      </div>
                    </div>

                    {/* Secondary / Peleton Tonti */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-3 shadow-xs">
                      <div className="h-20 flex items-center justify-center">
                        <img src={logoTonti} alt="Secondary" className="max-h-16 object-contain" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">2. Secondary Logo (Tonti)</div>
                        <div className="text-[10px] text-slate-400 font-mono">Digunakan pada atribut lapangan</div>
                      </div>
                    </div>

                    {/* Almamater Mu'allimin */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-3 shadow-xs">
                      <div className="h-20 flex items-center justify-center">
                        <img src={logoMuallimin} alt="Institution" className="max-h-16 object-contain" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">3. Logo Lembaga Penyelenggara</div>
                        <div className="text-[10px] text-slate-400 font-mono">Madrasah Mu'allimin Yk</div>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Banner Variant */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 flex items-center">
                        <img src={titleLogoImg} alt="Horizontal" className="max-h-10 object-contain" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">4. Versi Horizontal Logotype</div>
                        <div className="text-[10px] text-slate-500">Optimal untuk header website, kartu peserta, dan ID Card panitia</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                      Clear Space: Min. 1x Tinggi Simbol
                    </span>
                  </div>
                </div>

                {/* Aturan Do & Don't Logo (Section 5.3) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">Ketentuan Penggunaan Logo (Do & Don't)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                      <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        Ketentuan yang Diizinkan (DO):
                      </div>
                      <ul className="list-disc list-inside text-emerald-800 space-y-1 text-[11px]">
                        <li>Mempertahankan proporsi rasio asli logo (tidak di-stretch vertikal/horizontal).</li>
                        <li>Menjaga clear space minimal 16px di sekeliling logo bebas dari teks lain.</li>
                        <li>Menggunakan versi Reversed putih di atas latar crimson atau gelap.</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5">
                      <div className="font-bold text-rose-900 flex items-center gap-1.5">
                        <X className="w-4 h-4 text-rose-600 stroke-[3]" />
                        Larangan Keras (DON'T):
                      </div>
                      <ul className="list-disc list-inside text-rose-800 space-y-1 text-[11px]">
                        <li>Dilarang mengubah palet warna resmi (#8B0000 dan #FFD700) menjadi warna lain.</li>
                        <li>Dilarang menambahkan efek bayangan 3D berlebihan, emboss, atau gradasi liar.</li>
                        <li>Dilarang menempatkan logo di atas latar belakang foto yang ramai tanpa pelindung kontras.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* PRD 3: DESIGN TOKENS (HEX, RGB, CMYK & SPACING 4px)           */}
            {/* ============================================================== */}
            {activeTab === 'design-tokens' && (
              <div className="space-y-8 animate-fade">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-[11px] font-bold text-[#8B0000] uppercase tracking-wider">
                    PRD Bagian 6 // Design Tokens
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Spesifikasi Token Warna Digital (HEX/RGB) & Cetak (CMYK)
                  </h2>
                </div>

                {/* Color Tokens Master Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Role Token</th>
                        <th className="py-3 px-3">Swatch</th>
                        <th className="py-3 px-3">HEX Digital</th>
                        <th className="py-3 px-3">RGB Screen</th>
                        <th className="py-3 px-3">CMYK Cetak</th>
                        <th className="py-3 px-4">Aturan Penggunaan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {COLOR_TOKENS.map((c, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">{c.role}</td>
                          <td className="py-3 px-3">
                            <div className="w-6 h-6 rounded-lg border border-black/10 shadow-xs" style={{ backgroundColor: c.hex }} />
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-800">
                            <button
                              onClick={() => copyToClipboard(c.hex, c.role)}
                              className="hover:underline flex items-center gap-1 cursor-pointer"
                              title="Salin HEX"
                            >
                              <span>{c.hex}</span>
                              <Copy className="w-3 h-3 text-slate-400" />
                            </button>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-600">{c.rgb}</td>
                          <td className="py-3 px-3 font-mono text-[#8B0000] font-bold">{c.cmyk}</td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">{c.usage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Spacing 4px System Grid */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Spacing System Berbasis Kelipatan 4px (Section 6.3)</h4>
                      <p className="text-xs text-slate-500">Standar jarak komponen antarmuka dan margin cetak resmi.</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      Base Unit: 4px
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-9 gap-3">
                    {SPACING_SCALE.map((s) => (
                      <div key={s.token} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                        <div className="font-mono font-extrabold text-sm text-[#8B0000]">{s.px}</div>
                        <div className="text-[10px] font-mono text-slate-400">{s.rem}</div>
                        <div className="text-[9px] text-slate-600 truncate">{s.token}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography Hierarchy Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs uppercase text-slate-800">
                    Hierarki Tipografi Inter (Heading, Body & Tabular Numerics)
                  </div>
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Style</th>
                        <th className="py-3 px-3">Size / Rem</th>
                        <th className="py-3 px-3">Weight</th>
                        <th className="py-3 px-3">Line Height</th>
                        <th className="py-3 px-4">Contoh Penggunaan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {TYPOGRAPHY_SCALE.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80">
                          <td className="py-3 px-4 font-bold text-slate-900">{t.style}</td>
                          <td className="py-3 px-3 font-mono text-slate-600">{t.size}</td>
                          <td className="py-3 px-3 font-medium text-slate-700">{t.weight}</td>
                          <td className="py-3 px-3 font-mono text-slate-500">{t.line}</td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">{t.usage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* PRD 4: COMPONENT LIBRARY & INTERACTIVE STATE MATRIX            */}
            {/* ============================================================== */}
            {activeTab === 'component-library' && (
              <div className="space-y-8 animate-fade">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-[11px] font-bold text-[#8B0000] uppercase tracking-wider">
                    PRD Bagian 7 // Component Library & States
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Komponen Antarmuka & State Matrix (Default, Loading, Error, Disabled)
                  </h2>
                </div>

                {/* 1. BUTTONS & INTERACTIVE PROPS PLAYGROUND */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Interactive Props Control Panel (Button)</h4>
                      <p className="text-xs text-slate-500">Uji variasi state dan salin sintaksis JSX instan.</p>
                    </div>
                    <span className="text-xs font-mono text-[#8B0000] bg-red-50 px-2 py-0.5 rounded font-bold">
                      Section 7.1 & 7.5
                    </span>
                  </div>

                  {/* Preview Canvas */}
                  <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center min-h-[140px]">
                    <button
                      disabled={btnState === 'disabled' || btnState === 'loading'}
                      className={`inline-flex items-center justify-center gap-2 transition-all active:scale-95 ${
                        btnVariant === 'primary' ? 'bg-[#8B0000] hover:bg-[#6d0a0a] text-white shadow-xs' :
                        btnVariant === 'gold' ? 'bg-[#FFD700] hover:bg-[#eab308] text-slate-950 font-bold shadow-xs' :
                        btnVariant === 'outline' ? 'border border-slate-300 hover:bg-slate-100 text-slate-700 bg-white' :
                        btnVariant === 'subtle' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' :
                        'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                      } ${
                        btnSize === 'xs' ? 'px-2.5 py-1 text-xs rounded-lg' :
                        btnSize === 'sm' ? 'px-3.5 py-1.5 text-xs font-semibold rounded-xl' :
                        btnSize === 'md' ? 'px-5 py-2.5 text-sm font-bold rounded-xl' :
                        'px-7 py-3.5 text-base font-bold rounded-2xl shadow-md'
                      } ${btnState === 'disabled' ? 'opacity-50 cursor-not-allowed active:scale-100' : 'cursor-pointer'}`}
                    >
                      {btnState === 'loading' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-current" />
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <>
                          {btnIcon && <ShieldCheck className="w-4 h-4" />}
                          <span>{btnLabel}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Knobs */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Variant:</label>
                      <select
                        value={btnVariant}
                        onChange={(e) => setBtnVariant(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      >
                        <option value="primary">Primary Crimson</option>
                        <option value="gold">Champion Gold</option>
                        <option value="outline">Outline Neutral</option>
                        <option value="subtle">Subtle Slate</option>
                        <option value="danger">Danger Destructive</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Size Hierarchy:</label>
                      <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl text-center">
                        {['xs', 'sm', 'md', 'lg'].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setBtnSize(sz)}
                            className={`py-1 text-xs font-bold uppercase rounded-lg ${btnSize === sz ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">State Matrix:</label>
                      <select
                        value={btnState}
                        onChange={(e) => setBtnState(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      >
                        <option value="default">Default State</option>
                        <option value="loading">Loading State</option>
                        <option value="disabled">Disabled State</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Tombol Label:</label>
                      <input
                        type="text"
                        value={btnLabel}
                        onChange={(e) => setBtnLabel(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  {/* Generated Code */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-500 font-bold">Dynamic JSX Snippet:</span>
                      <button
                        onClick={() => copyToClipboard(generatedBtnCode, 'Kode JSX')}
                        className="text-[#8B0000] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Kode</span>
                      </button>
                    </div>
                    <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
                      {generatedBtnCode}
                    </pre>
                  </div>
                </div>

                {/* 2. FORM COMPONENTS (SECTION 7.2) */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="font-extrabold text-slate-900 text-sm">Form Components (Section 7.2)</h4>
                    <p className="text-xs text-slate-500">Text Input, Select, Checkbox, Radio Cards, dan Dropzone Berkas.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex justify-between">
                        <span>Nama Pangkalan / Sekolah <span className="text-red-600">*</span></span>
                        <span className="text-[10px] text-slate-400 font-mono">Wajib Diisi</span>
                      </label>
                      <input
                        type="text"
                        value={formText}
                        onChange={(e) => setFormText(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#8B0000] focus:ring-2 focus:ring-red-100 shadow-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Kategori Jenjang Lomba</label>
                      <select
                        value={formSelect}
                        onChange={(e) => setFormSelect(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#8B0000] shadow-xs"
                      >
                        <option value="sd">Tingkat SD / MI Se-DIY (Maks. 8 Menit)</option>
                        <option value="smp">Tingkat SMP / MTs Se-DIY (Maks. 10 Menit)</option>
                      </select>
                    </div>
                  </div>

                  {/* Dropzone File Upload */}
                  <div className="border-2 border-dashed border-slate-300 hover:border-[#8B0000] rounded-2xl p-6 text-center bg-slate-50/50 space-y-1.5 cursor-pointer transition-all">
                    <Upload className="w-7 h-7 text-[#8B0000] mx-auto" />
                    <div className="text-xs font-bold text-slate-800">
                      Tarik Surat Rekomendasi Kepala Sekolah ke sini atau <span className="text-[#8B0000] underline">Pilih File</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Format PDF resmi, maksimal 5 MB</div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* PRD 5: MODUL OPERASIONAL SPESIFIK LBB MU'ALLIMIN              */}
            {/* ============================================================== */}
            {activeTab === 'lbb-operational' && (
              <div className="space-y-8 animate-fade">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-[11px] font-bold text-[#8B0000] uppercase tracking-wider">
                    PRD Bagian 7.4 & 8.4 // Showcase Khusus Lapangan LBB
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Arena Stopwatch Timer, Lembar Rubrik Juri & ID Card Peleton
                  </h2>
                </div>

                {/* ARENA STOPWATCH TIMER BAR */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#8B0000]">PENGUKUR WAKTU ARENA 18M X 22M</span>
                      <h4 className="font-extrabold text-slate-900 text-sm">Peleton #07 • SMP Muhammadiyah 1 Yogyakarta</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Arena Stopwatch
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-2">
                    <div className="text-6xl sm:text-7xl font-mono font-black text-slate-900 tabular-nums">
                      {formatMinSec(timerSec)}
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                      Batas Maksimal: 10:00 Menit • <span className="text-amber-600 font-bold">Peluit Kuning: Menit 08:00</span>
                    </div>

                    <div className="w-full max-w-md mx-auto bg-slate-200 h-2.5 rounded-full overflow-hidden mt-3">
                      <div
                        className={`h-full transition-all duration-300 ${
                          timerSec >= 600 ? 'bg-rose-600' : timerSec >= 480 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, (timerSec / 600) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setIsTimerActive(!isTimerActive)}
                      className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer ${
                        isTimerActive ? 'bg-amber-500 text-slate-900' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {isTimerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isTimerActive ? 'Jeda Timer' : 'Mulai Tampil'}</span>
                    </button>
                    <button
                      onClick={() => { setIsTimerActive(false); setTimerSec(0); }}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* MATRIKS RUBRIK JURI TOUCH & PENALTY ENGINE */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Lembar Penilaian Juri Lapangan</h4>
                      <p className="text-xs text-slate-500">Sentuh predikat (0/TL, KS, K, C, B, BS) untuk kalkulasi skor otomatis.</p>
                    </div>
                    <span className="font-mono text-sm font-extrabold text-[#8B0000] bg-red-50 border border-red-200 px-3 py-1 rounded-xl">
                      Total Skor: {calculatedScore} Poin
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: 0, text: '01. Gerakan di Tempat: Kerapian Barisan & Sikap Sempurna' },
                      { id: 1, text: '02. Gerakan Berjalan: Langkah Biasa & Langkah Tegap' },
                      { id: 2, text: '03. Perubahan Arah: Balik Kanan Maju Jalan' },
                      { id: 3, text: '04. Komandan Peleton: Artikulasi & Kejelasan Aba-aba' },
                      { id: 4, text: '05. Variasi & Formasi: Estetika, Kerapian, & Tingkat Kesulitan' }
                    ].map((m) => (
                      <div key={m.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-xs font-bold text-slate-800 max-w-sm">{m.text}</div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {[
                            { label: '0/TL', val: 0 },
                            { label: 'KS (60)', val: 60 },
                            { label: 'K (72)', val: 72 },
                            { label: 'C (80)', val: 80 },
                            { label: 'B (88)', val: 88 },
                            { label: 'BS (95)', val: 95 }
                          ].map((btn) => (
                            <button
                              key={btn.label}
                              onClick={() => setScores({ ...scores, [m.id]: btn.val })}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                                scores[m.id] === btn.val
                                  ? 'bg-[#8B0000] text-white shadow-xs scale-105'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Penalti Lapangan */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Kalkulator Pemotongan Penalti
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div
                        onClick={() => setPenalties({ ...penalties, garis: !penalties.garis })}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          penalties.garis ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="flex justify-between font-bold text-xs">
                          <span>Pijak Garis Batas</span>
                          <span className="font-mono text-rose-600">-5 Pts</span>
                        </div>
                      </div>
                      <div
                        onClick={() => setPenalties({ ...penalties, waktu: !penalties.waktu })}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          penalties.waktu ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="flex justify-between font-bold text-xs">
                          <span>Kelebihan Waktu</span>
                          <span className="font-mono text-rose-600">-10 Pts</span>
                        </div>
                      </div>
                      <div
                        onClick={() => setPenalties({ ...penalties, atribut: !penalties.atribut })}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          penalties.atribut ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="flex justify-between font-bold text-xs">
                          <span>Atribut Pasukan Jatuh</span>
                          <span className="font-mono text-rose-600">-15 Pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KARTU ID CARD PELETON DENGAN QR CODE */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
                  <div className="max-w-md mx-auto bg-gradient-to-b from-white to-slate-50 border-2 border-slate-300 rounded-3xl p-6 shadow-md space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-2 bg-[#8B0000]" />
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <img src={logoLbb} alt="Logo" className="w-8 h-8 object-contain" />
                        <div>
                          <div className="text-[10px] font-black uppercase text-[#8B0000]">LBB MU'ALLIMIN 2027</div>
                          <div className="text-xs font-bold text-slate-800">KARTU PESERTA RESMI</div>
                        </div>
                      </div>
                      <span className="text-sm font-mono font-black text-white bg-blue-600 px-2.5 py-1 rounded-lg">#07</span>
                    </div>

                    <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                      <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">Pangkalan Sekolah:</div>
                      <div className="text-xs font-extrabold text-slate-900">SMP Muhammadiyah 1 Yogyakarta</div>
                      <div className="text-[11px] text-slate-600">Danton: M. Fatih Al-Ghazali</div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200">
                      <div className="text-xs font-mono font-bold text-slate-800">QR CODE CHECK-IN BASECAMP</div>
                      <QrCode className="w-10 h-10 text-slate-900" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* PRD 6: DIGITAL INTERFACES ARCHITECTURE                         */}
            {/* ============================================================== */}
            {activeTab === 'digital-interfaces' && (
              <div className="space-y-8 animate-fade">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-[11px] font-bold text-[#8B0000] uppercase tracking-wider">
                    PRD Bagian 8 // Digital Design System
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Spesifikasi 4 Antarmuka Digital LBB27
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Website Publik */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center font-bold">
                        8.1
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Website Publik (Landing Page)</h4>
                        <p className="text-[11px] text-slate-500">Kanal utama publikasi & pendaftaran</p>
                      </div>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                      <li>Hero Section dengan countdown timer hari lomba.</li>
                      <li>Petunjuk teknis (Juknis), denah arena 18x22m, materi PBB.</li>
                      <li>Informasi piala bergilir juara umum & FAQ contact panitia.</li>
                    </ul>
                  </div>

                  {/* Portal Peserta */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                        8.2
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Portal Peserta (Peleton)</h4>
                        <p className="text-[11px] text-slate-500">Akses danton & pembina kontingen</p>
                      </div>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                      <li>Status verifikasi berkas & nomor undian dada (LOT).</li>
                      <li>Manajemen roster 16 pasukan inti + 2 cadangan.</li>
                      <li>Generator kartu ID Card peleton siap cetak.</li>
                    </ul>
                  </div>

                  {/* Dashboard Panitia */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        8.3
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Dashboard Panitia (Sekretariat)</h4>
                        <p className="text-[11px] text-slate-500">Pusat kendali administrasi lomba</p>
                      </div>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                      <li>Verifikasi pembayaran BSI & pakta integritas sekolah.</li>
                      <li>Mesin acak undian LOT Technical Meeting transparan.</li>
                      <li>Rekapitulasi RAB keuangan & ekspor berkas CSV.</li>
                    </ul>
                  </div>

                  {/* Dashboard Juri */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                        8.4
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Dashboard & Scoring App Juri</h4>
                        <p className="text-[11px] text-slate-500">Lembar digital dewan juri lapangan</p>
                      </div>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                      <li>Input nilai rubrik gerakan touch-friendly cepat.</li>
                      <li>Kalkulasi penalti otomatis (pijak garis, waktu, atribut).</li>
                      <li>Gembok digital integritas nilai & tanda tangan berita acara.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* PRD 7: PRINT & PUBLICATION TEMPLATES (SECTION 9)               */}
            {/* ============================================================== */}
            {activeTab === 'print-templates' && (
              <div className="space-y-8 animate-fade">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-[11px] font-bold text-[#8B0000] uppercase tracking-wider">
                    PRD Bagian 9 // Print & Publication System
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Spesifikasi Media Sosial, Dokumen Resmi & Media Lapangan
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Media Sosial Specs */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm">9.1 Template Media Sosial Wajib</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
                        <div className="font-bold text-slate-900">Instagram Feed</div>
                        <div className="font-mono text-[10px] text-[#8B0000]">1080 x 1080 (1:1)</div>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
                        <div className="font-bold text-slate-900">Instagram Portrait</div>
                        <div className="font-mono text-[10px] text-[#8B0000]">1080 x 1350 (4:5)</div>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
                        <div className="font-bold text-slate-900">Instagram Story</div>
                        <div className="font-mono text-[10px] text-[#8B0000]">1080 x 1920 (9:16)</div>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
                        <div className="font-bold text-slate-900">TikTok Cover</div>
                        <div className="font-mono text-[10px] text-[#8B0000]">1080 x 1920 (9:16)</div>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
                        <div className="font-bold text-slate-900">WhatsApp Broadcast</div>
                        <div className="font-mono text-[10px] text-[#8B0000]">1200 x 628 (Landscape)</div>
                      </div>
                    </div>
                  </div>

                  {/* Dokumen Resmi & Media Lapangan */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
                      <h4 className="font-bold text-slate-900 text-sm">9.3 Dokumen Administrasi Resmi</h4>
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                        <li>Surat Undangan & Rekomendasi Kepala Sekolah (A4, Bleed 3mm).</li>
                        <li>Sertifikat Peserta & Piagam Juara Umum (A4 Landscape, Gold Guilloche).</li>
                        <li>Kartu Identitas Panitia & ID Card Danton (B4 / B3 Tegak).</li>
                        <li>Berita Acara Keputusan Dewan Juri (A4).</li>
                      </ul>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
                      <h4 className="font-bold text-slate-900 text-sm">9.4 Media Fisik Lapangan</h4>
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                        <li>Backdrop Utama Panggung (6m x 3m, 300 DPI CMYK).</li>
                        <li>Gate Masuk DP 3 & Gapura Selamat Datang.</li>
                        <li>Nomor Urut Dada Peleton (#01 - #36, Bahan Anti Air).</li>
                        <li>Signage Penunjuk Arah Basecamp, DP1, DP2, DP3, Medis.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* PRD 8: GOVERNANCE, SEMVER & CHANGELOG                          */}
            {/* ============================================================== */}
            {activeTab === 'governance' && (
              <div className="space-y-8 animate-fade">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-[11px] font-bold text-[#8B0000] uppercase tracking-wider">
                    PRD Bagian 12 & 13 // Governance & Versioning
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Tata Kelola, SemVer & Standar Perubahan Desain
                  </h2>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">13.3 Semantic Versioning (SemVer) Spesifikasi</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="font-mono font-bold text-[#8B0000]">MAJOR (1.0.0)</div>
                      <p className="text-slate-600">Perubahan besar pada fondasi brand, penggantian warna primer, atau restrukturisasi logo.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="font-mono font-bold text-blue-700">MINOR (1.1.0)</div>
                      <p className="text-slate-600">Penambahan komponen baru, template poster media sosial baru, atau penambahan form juri.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="font-mono font-bold text-emerald-700">PATCH (1.0.1)</div>
                      <p className="text-slate-600">Koreksi kecil kode warna CMYK cetak, perbaikan typo juknis, atau penyesuaian padding 4px.</p>
                    </div>
                  </div>
                </div>

                {/* Acceptance Criteria Status (Section 15) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">Status Kriteria Penerimaan (Acceptance Criteria)</h4>
                  <div className="space-y-2 text-xs">
                    {[
                      'Seluruh warna telah memiliki token resmi (HEX, RGB, CMYK).',
                      'Seluruh tipografi telah memiliki hierarki terukur (Inter Display hingga Tabular).',
                      'Logo memiliki panduan penggunaan do & don\'t terstandar.',
                      'Komponen interaktif memiliki state lengkap (Default, Hover, Disabled, Loading).',
                      'Spesifikasi template media publikasi dan dokumen resmi lengkap.',
                      'Arsitektur digital 4 portal menggunakan token terpadu.'
                    ].map((crit, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{crit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* --- FOOTER PRD --- */}
      <footer className="border-t border-slate-200 bg-white py-10 mt-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <img src={logoLbb} alt="Logo LBB" className="w-8 h-8 object-contain" />
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase">
                Product Requirements Document (PRD) Design System LBB Mu'allimin 2027
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Versi 1.0.0 • Single Source of Truth (SSOT) • Panitia LBB Mu'allimin 2027
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            WCAG 2.2 AA Compliant • Clean Modern SaaS Framework
          </div>
        </div>
      </footer>

    </div>
  );
}
