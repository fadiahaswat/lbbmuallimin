import React from 'react';
import {
  Compass,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Shield,
  Target,
  CheckCircle2,
  Users,
  Award
} from 'lucide-react';
import logoLbb from '../assets/logo-tonti.png';

const ABOUT_BG_PHOTO = {
  webp: '/section-tentang.webp',
  fallback: '/section-tentang.jpg'
};

const VALUES = [
  { label: 'Kedisiplinan', icon: Shield },
  { label: 'Kepemimpinan', icon: Target },
  { label: 'Tanggung Jawab', icon: CheckCircle2 },
  { label: 'Kerja Sama', icon: Users },
  { label: 'Sportivitas', icon: Award },
];

export default function About() {
  return (
    <section 
      id="about" 
      className="pt-24 sm:pt-32 pb-[380px] sm:pb-[500px] md:pb-[620px] lg:pb-[750px] bg-slate-950 relative overflow-hidden font-sans isolate text-white"
    >
      {/* Background Photo Dokumentasi Bawah */}
      <div className="absolute inset-x-0 bottom-0 z-0 pointer-events-none overflow-hidden select-none">
        <picture>
          <source srcSet={ABOUT_BG_PHOTO.webp} type="image/webp" />
          <img
            src={ABOUT_BG_PHOTO.fallback}
            alt="Dokumentasi Peleton LBB Mu'allimin"
            className="w-full h-auto max-w-none block filter brightness-95 contrast-105"
            loading="lazy"
          />
        </picture>

        {/* Gradient Overlay Transparan ke Gelap */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent from-20% via-slate-950/70 via-55% to-slate-950 to-85%" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* ========================================================
            HEADER: JUDUL & PARAGRAF 1
            ======================================================== */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Profil Kegiatan</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-4 leading-tight">
            <span>Tentang </span>
            <span className="text-amber-400">LBB MU’ALLIMIN 2027</span>
          </h2>

          <div className="w-16 h-1 bg-red-700 mx-auto rounded-full mb-6"></div>

          {/* Paragraf 1 Teks Asli User */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto">
            Lomba Baris-Berbaris (LBB) Mu’allimin 2027 merupakan ajang kompetisi baris-berbaris antarpelajar tingkat <strong className="text-white font-semibold">SD/MI dan SMP/MTs sederajat se-Daerah Istimewa Yogyakarta</strong> yang diselenggarakan oleh Madrasah Mu’allimin Muhammadiyah Yogyakarta.
          </p>
        </div>

        {/* ========================================================
            KONTEN UTAMA
            ======================================================== */}
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Banner Tema Resmi: Paragraf 2 */}
          <div className="relative rounded-2xl bg-slate-900/90 border border-white/[0.08] shadow-lg p-6 sm:p-8 lg:p-10 overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.06] border border-white/10 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tema Resmi</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white leading-tight">
                  “Semangat sebagai Ksatria, <br />
                  <span className="text-amber-400">Berjuang dengan Gembira”</span>
                </h3>

                {/* Paragraf 2 Asli */}
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                  Kegiatan ini menjadi wadah bagi pelajar untuk mengembangkan potensi, mengasah keterampilan baris-berbaris, serta menanamkan nilai kedisiplinan, kepemimpinan, tanggung jawab, kerja sama, dan sportivitas.
                </p>

                {/* Tag Nilai dari Paragraf 2 */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {VALUES.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-200"
                      >
                        <Icon className="w-3.5 h-3.5 text-amber-400/90" />
                        <span>{item.label}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Logo Resmi LBB 2027 */}
              <div className="shrink-0 flex items-center justify-center self-center md:self-auto">
                <img
                  src={logoLbb}
                  alt="Logo LBB Mu'allimin 2027"
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 object-contain drop-shadow-md"
                />
              </div>

            </div>
          </div>

          {/* 2 Kartu: Paragraf 3 & Paragraf 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Kartu 1: Paragraf 3 */}
            <div className="rounded-2xl bg-slate-900/75 border border-white/[0.08] p-6 sm:p-7 shadow-md flex flex-col justify-start space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 text-amber-400 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white tracking-tight">
                Silaturahmi & Semangat Berprestasi
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Menjadi sarana mempererat silaturahmi antarsekolah, membangun semangat berprestasi, serta memperkenalkan nilai-nilai pendidikan Mu’allimin kepada generasi muda.
              </p>
            </div>

            {/* Kartu 2: Paragraf 4 */}
            <div className="rounded-2xl bg-slate-900/75 border border-white/[0.08] p-6 sm:p-7 shadow-md flex flex-col justify-start space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 text-red-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white tracking-tight">
                Kompetisi Edukatif & Berkarakter
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Berkomitmen menghadirkan kompetisi yang edukatif, sportif, dan berkarakter sebagai bagian dari upaya membentuk generasi muda yang tangguh, berintegritas, dan siap menjadi pemimpin masa depan.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
