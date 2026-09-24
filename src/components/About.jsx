import React, { useState, useEffect } from 'react';
import {
  Scroll,
  Shield,
  HeartHandshake,
  Activity,
  Trophy,
  BrainCircuit,
  Network,
  School,
  GraduationCap,
  UserCheck,
  Users,
  PlusCircle,
  Timer,
  Maximize2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Camera
} from 'lucide-react';
import { COMPETITION } from '../config.js';
import logoLbb from '../assets/logo-tonti.png';

const TONTI_GALLERY_IMAGES = [
  { src: '/galeri-tonti/IMG_3353.webp', fallback: '/galeri-tonti/IMG_3353.jpg', title: 'Kedisiplinan & Kekompakan', caption: 'Pleton Inti Muallimin Yogyakarta' },
  { src: '/galeri-tonti/IMG_3354.webp', fallback: '/galeri-tonti/IMG_3354.jpg', title: 'Presisi Langkah Ksatria', caption: 'Konsentrasi dan keseragaman barisan' },
  { src: '/galeri-tonti/IMG_3355.webp', fallback: '/galeri-tonti/IMG_3355.jpg', title: 'Derap Tangguh Lapangan', caption: 'Formasi kokoh penuh wibawa' },
  { src: '/galeri-tonti/IMG_3356.webp', fallback: '/galeri-tonti/IMG_3356.jpg', title: 'Formasi & Manuver', caption: 'Kombinasi formasi variasi memukau' },
  { src: '/galeri-tonti/IMG_3357.webp', fallback: '/galeri-tonti/IMG_3357.jpg', title: 'Fokus & Dedikasi', caption: 'Semangat juang para kader Muallimin' },
  { src: '/galeri-tonti/IMG_3358.webp', fallback: '/galeri-tonti/IMG_3358.jpg', title: 'Harmoni & Ketegasan', caption: 'Akurasi tempo gerak baris-berbaris' },
  { src: '/galeri-tonti/IMG_3359.webp', fallback: '/galeri-tonti/IMG_3359.jpg', title: 'Sinergi Pasukan', caption: 'Kekuatan solidaritas satu irama' },
  { src: '/galeri-tonti/IMG_3360.webp', fallback: '/galeri-tonti/IMG_3360.jpg', title: 'Wibawa & Karakter', caption: 'Menjunjung kehormatan sang ksatria' },
  { src: '/galeri-tonti/IMG_3361.webp', fallback: '/galeri-tonti/IMG_3361.jpg', title: 'Jiwa Kepemimpinan', caption: 'Komando tegas mengarahkan langkah' },
  { src: '/galeri-tonti/IMG_3362.webp', fallback: '/galeri-tonti/IMG_3362.jpg', title: 'Kebanggaan Korps', caption: 'Tradisi luhur kepanduan dan paskibra' },
  { src: '/galeri-tonti/IMG_3363.webp', fallback: '/galeri-tonti/IMG_3363.jpg', title: 'Ketahanan & Mental', caption: 'Ujian ketangguhan kawah candradimuka' },
  { src: '/galeri-tonti/IMG_3364.webp', fallback: '/galeri-tonti/IMG_3364.jpg', title: 'Puncak Semangat Juang', caption: 'Menampilkan performa terbaik' },
  { src: '/galeri-tonti/IMG_3365.webp', fallback: '/galeri-tonti/IMG_3365.jpg', title: 'Sang Juara Masa Depan', caption: 'Kader bangsa berkarakter ksatria' }
];

export default function About() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto slide timer for background
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % TONTI_GALLERY_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handlePrev = (e) => {
    e?.stopPropagation?.();
    setActiveSlide((prev) => (prev === 0 ? TONTI_GALLERY_IMAGES.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation?.();
    setActiveSlide((prev) => (prev + 1) % TONTI_GALLERY_IMAGES.length);
  };
  return (
    <section id="about" className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-900/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-red-100/60 border border-red-200 text-red-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest mb-6 max-w-full text-center leading-normal">
            <Scroll className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate sm:whitespace-normal">Dasar Pelaksanaan: QS. As-Saff Ayat 4</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-6 leading-tight py-1">
            <span className="block whitespace-nowrap">
              Membangun{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-600">
                Generasi Unggul
              </span>
            </span>
            <span className="block whitespace-nowrap mt-1">
              Berkarakter{' '}
              <span className="relative inline-block pr-2 pb-1">
                <span className="relative z-10 text-amber-700 font-extrabold">Ksatria</span>
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-amber-400 -z-0"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.7" />
                </svg>
              </span>
            </span>
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            <strong className="text-slate-900">LBB Mu'allimin 2027</strong> hadir sebagai manifestasi peran historis Madrasah Mu'allimin sejak 1918. Mengusung tema resmi <em className="text-slate-800 font-bold">"Semangat Sebagai Ksatria, Berjuang Dengan Gembira!"</em>, ini adalah kawah candradimuka untuk menanamkan nilai{' '}
            <span className="text-red-700 font-bold">Disiplin</span>,{' '}
            <span className="text-red-700 font-bold">Kepemimpinan</span>, dan{' '}
            <span className="text-red-700 font-bold">Solidaritas</span> demi mencetak Profil Pelajar Pancasila dan Kader Bangsa yang Berkemajuan.
          </p>
        </div>

        {/* Unified 2-Column Section Layout: Kiri (Tema), Kanan Atas (Galeri), Kanan Bawah (Target) */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* KOLOM KIRI: Tema Resmi & Nilai Filosofis */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="relative">
              <div className="relative bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800/80 overflow-hidden">
                <div className="absolute inset-0 bg-carbon-pattern opacity-20 pointer-events-none"></div>
                <Shield className="absolute -right-8 -bottom-8 text-white/5 w-52 h-52 pointer-events-none" />

                {/* Header Tema dengan Logo LBB di kanan */}
                <div className="relative z-10 pb-6 border-b border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-yellow-500 font-bold tracking-[0.3em] text-xs uppercase mb-2 block">Tema Resmi 2027</span>
                    <h3 className="text-xl sm:text-2xl font-black uppercase italic leading-tight py-1">
                      <span className="block pb-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">Semangat Sebagai Ksatria,</span>
                      <span className="block text-yellow-500">Berjuang Dengan Gembira!</span>
                    </h3>
                  </div>

                  <img
                    src={logoLbb}
                    alt="Logo LBB Mu'allimin"
                    className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md hover:scale-105 transition-transform"
                  />
                </div>

                {/* Nilai-Nilai Tema */}
                <div className="relative z-10 py-6 space-y-3.5 border-b border-slate-800">
                  <div className="flex gap-3.5 items-start p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/20 text-yellow-400 shadow-sm">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Jiwa & Karakter Ksatria</h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Integritas, Kehormatan, Tanggung Jawab, dan Mental Pantang Menyerah.</p>
                    </div>
                  </div>
                  <div className="flex gap-3.5 items-start p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/20 text-yellow-400 shadow-sm">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Kegembiraan Berprestasi</h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Sportivitas, Antusiasme, Kekompakan, dan Kebahagiaan dalam Berjuang.</p>
                    </div>
                  </div>
                </div>

                {/* Tujuan & Manfaat (3 item disusun vertikal/kompak) */}
                <div className="relative z-10 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <h4 className="text-xs font-bold tracking-[0.2em] text-slate-300 uppercase">
                      Tujuan & Manfaat Kegiatan
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl border border-white/5 hover:border-red-500/30 transition-all duration-300 flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-500/15 text-red-400 border border-red-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-xs sm:text-sm">Kompetisi Berkualitas</h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                          Wadah kompetisi sehat, sportif, dan transparan untuk PBB pelajar se-DIY.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all duration-300 flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500/15 text-blue-400 border border-blue-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <BrainCircuit className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-xs sm:text-sm">Asah Soft Skills</h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                          Komunikasi efektif, problem solving, manajemen waktu, dan ketahanan mental.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-all duration-300 flex items-start gap-3">
                      <div className="w-8 h-8 bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <Network className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-xs sm:text-sm">Jaringan & Pendidikan</h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                          Menanamkan nilai <strong className="text-slate-200">CADRE</strong> Mu'allimin dan silaturahmi pendidikan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Atas (Galeri 16:9), Bawah (Target Peserta SD & SMP) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* KANAN ATAS: Galeri Tonti Mu'allimin 16:9 Imersif (Tanpa Outline) */}
            <div className="relative group">
              <div 
                className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-950 shadow-xl border-0 ring-0 outline-none select-none"
                onMouseEnter={() => setIsAutoPlay(false)}
                onMouseLeave={() => setIsAutoPlay(true)}
              >
                {/* Images */}
                {TONTI_GALLERY_IMAGES.map((img, idx) => (
                  <div
                    key={img.src}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      idx === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                    }`}
                    style={{ transitionProperty: 'opacity, transform' }}
                  >
                    <img
                      src={img.src}
                      onError={(e) => {
                        if (img.fallback && e.currentTarget.src !== img.fallback) {
                          e.currentTarget.src = img.fallback;
                        }
                      }}
                      alt="Galeri Tonti Mu'allimin"
                      className="w-full h-full object-cover object-center"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </div>
                ))}

                {/* Prev / Next Arrows */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-900/60 hover:bg-red-700 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-900/60 hover:bg-red-700 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* KANAN BAWAH: Target Peserta Se-DIY (SD & SMP) */}
            <div>
              {/* Header Label Target */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></div>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-800">
                    Target Peserta Se-DIY
                  </h4>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/70 px-2.5 py-1 rounded-full">
                  Kuota Terbatas
                </span>
              </div>

              {/* 2 Kolom Card Target SD & SMP */}
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                {/* SD Card */}
                <a
                  href="#rules"
                  className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-md hover:shadow-xl hover:border-red-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden text-left cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-red-100/60 via-red-50/20 to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
                  <div className="absolute -right-1 bottom-2 text-6xl font-black text-red-950/[0.04] select-none pointer-events-none tracking-tighter">
                    SD
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center shadow-sm shadow-red-700/25 group-hover:scale-105 transition-transform">
                          <School className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="inline-block text-[10px] font-bold text-red-700 uppercase tracking-wider">
                            Tingkat Dasar
                          </span>
                          <h4 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                            SD / MI
                          </h4>
                        </div>
                      </div>

                      <div className="text-right bg-red-50 border border-red-100 px-2.5 py-1 rounded-xl">
                        <span className="text-[9px] font-black uppercase tracking-wider text-red-600 block">
                          Target
                        </span>
                        <p className="text-base font-black text-slate-900 leading-none mt-0.5">
                          {COMPETITION.SD.TARGET_PLATOONS}{' '}
                          <span className="text-[10px] font-semibold text-slate-500">Peleton</span>
                        </p>
                      </div>
                    </div>

                    {/* Squad Composition */}
                    <div className="grid grid-cols-3 gap-1.5 mb-4 text-center">
                      <div className="bg-slate-50 group-hover:bg-red-50/40 p-2 rounded-xl border border-slate-100 transition-colors">
                        <UserCheck className="w-3.5 h-3.5 text-red-700 mx-auto mb-1" />
                        <span className="text-xs font-black text-slate-900 block">1 Danton</span>
                        <span className="text-[9px] text-slate-500">Komandan</span>
                      </div>
                      <div className="bg-slate-50 group-hover:bg-red-50/40 p-2 rounded-xl border border-slate-100 transition-colors">
                        <Users className="w-3.5 h-3.5 text-red-700 mx-auto mb-1" />
                        <span className="text-xs font-black text-slate-900 block">21 Pasukan</span>
                        <span className="text-[9px] text-slate-500">Inti</span>
                      </div>
                      <div className="bg-slate-50 group-hover:bg-red-50/40 p-2 rounded-xl border border-slate-100 transition-colors">
                        <PlusCircle className="w-3.5 h-3.5 text-red-700 mx-auto mb-1" />
                        <span className="text-xs font-black text-slate-900 block">3 Cadangan</span>
                        <span className="text-[9px] text-slate-500">Pengganti</span>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-1.5 pt-2 pb-3 border-t border-slate-100 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1 bg-slate-50/80 px-2 py-1.5 rounded-lg border border-slate-100">
                        <Maximize2 className="w-3 h-3 text-red-600 shrink-0" />
                        <span className="truncate">Arena: <strong>{COMPETITION.SD.ARENA_SIZE}</strong></span>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50/80 px-2 py-1.5 rounded-lg border border-slate-100">
                        <Timer className="w-3 h-3 text-red-600 shrink-0" />
                        <span className="truncate">Durasi: <strong>{COMPETITION.SD.DURATION_LABEL.replace('Durasi Max: ', '')}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 pt-2.5 border-t border-slate-100 flex items-center justify-end">
                    <span className="text-[11px] font-bold text-red-700 flex items-center gap-1 group-hover:text-red-800">
                      Lihat Juknis SD <ArrowRight className="w-3.5 h-3.5 text-red-600 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </a>

                {/* SMP Card */}
                <a
                  href="#rules"
                  className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-md hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden text-left cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-blue-100/60 via-blue-50/20 to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
                  <div className="absolute -right-1 bottom-2 text-6xl font-black text-blue-950/[0.04] select-none pointer-events-none tracking-tighter">
                    SMP
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-sm shadow-blue-700/25 group-hover:scale-105 transition-transform">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="inline-block text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                            Tingkat Menengah
                          </span>
                          <h4 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                            SMP / MTs
                          </h4>
                        </div>
                      </div>

                      <div className="text-right bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl">
                        <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 block">
                          Target
                        </span>
                        <p className="text-base font-black text-slate-900 leading-none mt-0.5">
                          {COMPETITION.SMP.TARGET_PLATOONS}{' '}
                          <span className="text-[10px] font-semibold text-slate-500">Peleton</span>
                        </p>
                      </div>
                    </div>

                    {/* Squad Composition */}
                    <div className="grid grid-cols-3 gap-1.5 mb-4 text-center">
                      <div className="bg-slate-50 group-hover:bg-blue-50/40 p-2 rounded-xl border border-slate-100 transition-colors">
                        <UserCheck className="w-3.5 h-3.5 text-blue-700 mx-auto mb-1" />
                        <span className="text-xs font-black text-slate-900 block">1 Danton</span>
                        <span className="text-[9px] text-slate-500">Komandan</span>
                      </div>
                      <div className="bg-slate-50 group-hover:bg-blue-50/40 p-2 rounded-xl border border-slate-100 transition-colors">
                        <Users className="w-3.5 h-3.5 text-blue-700 mx-auto mb-1" />
                        <span className="text-xs font-black text-slate-900 block">21 Pasukan</span>
                        <span className="text-[9px] text-slate-500">Inti</span>
                      </div>
                      <div className="bg-slate-50 group-hover:bg-blue-50/40 p-2 rounded-xl border border-slate-100 transition-colors">
                        <PlusCircle className="w-3.5 h-3.5 text-blue-700 mx-auto mb-1" />
                        <span className="text-xs font-black text-slate-900 block">3 Cadangan</span>
                        <span className="text-[9px] text-slate-500">Pengganti</span>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-1.5 pt-2 pb-3 border-t border-slate-100 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1 bg-slate-50/80 px-2 py-1.5 rounded-lg border border-slate-100">
                        <Maximize2 className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate">Arena: <strong>{COMPETITION.SMP.ARENA_SIZE}</strong></span>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50/80 px-2 py-1.5 rounded-lg border border-slate-100">
                        <Timer className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate">Durasi: <strong>{COMPETITION.SMP.DURATION_LABEL.replace('Durasi Max: ', '')}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 pt-2.5 border-t border-slate-100 flex items-center justify-end">
                    <span className="text-[11px] font-bold text-blue-700 flex items-center gap-1 group-hover:text-blue-800">
                      Lihat Juknis SMP <ArrowRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
