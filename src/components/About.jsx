import React from 'react';
import {
  Compass,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Megaphone,
  ArrowDownRight
} from 'lucide-react';
import logoLbb from '../assets/logo-tonti.png';

const ABOUT_BG_PHOTO = {
  webp: '/section-tentang.webp',
  fallback: '/section-tentang.jpg'
};

export default function About() {
  return (
    <section
      id="about"
      className="pt-24 sm:pt-32 pb-[380px] sm:pb-[500px] md:pb-[620px] lg:pb-[750px] bg-slate-950 relative overflow-hidden font-sans isolate text-white"
    >
      {/* Subtle Ambient Accent Glows */}
      <div className="absolute top-20 -left-24 w-96 h-96 bg-red-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-64 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

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

          <div className="w-16 h-1 bg-red-700 mx-auto rounded-full mb-6" />

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto">
            Lomba Baris-Berbaris (LBB) Mu’allimin 2027 merupakan ajang kompetisi baris-berbaris antarpelajar tingkat{' '}
            <strong className="text-white font-semibold">SD/MI dan SMP/MTs sederajat se-Daerah Istimewa Yogyakarta</strong>{' '}
            yang diselenggarakan oleh Madrasah Mu’allimin Muhammadiyah Yogyakarta.
          </p>
        </div>

        {/* ========================================================
            KONTEN UTAMA
            ======================================================== */}
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Hero Card: Tema Resmi & Makna Ringkas untuk Materi Lomba */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
            {/* Top Accent Line */}
            <div className="h-1 w-full bg-gradient-to-r from-red-700 via-amber-400 to-red-700 opacity-85" />

            <div className="p-6 sm:p-8 lg:p-10 space-y-7">
              {/* Row 1: Theme Headline + Logo */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tema Resmi 2027</span>
                  </span>

                  <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black uppercase tracking-tight text-white leading-[1.15]">
                    “Semangat sebagai Ksatria, <br className="hidden sm:block" />
                    <span className="text-amber-400">Berjuang dengan Gembira”</span>
                  </h3>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                    Wadah pelajar untuk mengasah keterampilan baris-berbaris sekaligus menanamkan kedisiplinan, kepemimpinan, tanggung jawab, kerja sama, dan sportivitas.
                  </p>
                </div>

                {/* Logo Resmi LBB 2027 */}
                <div className="shrink-0 relative flex items-center justify-center self-center md:self-auto">
                  <div className="absolute inset-0 bg-amber-500/12 rounded-full blur-2xl scale-90 pointer-events-none" />
                  <img
                    src={logoLbb}
                    alt="Logo LBB Mu'allimin 2027"
                    className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.6)]"
                  />
                </div>
              </div>

              {/* Row 2: Makna 2 Frasa Tema (Bersih tanpa kotak bertumpuk) */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="pl-4 border-l-2 border-red-500/70 space-y-1.5">
                  <h4 className="text-sm font-extrabold text-white tracking-tight">
                    “Semangat sebagai Ksatria”
                  </h4>
                  <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                    Berani tampil percaya diri, tegas, disiplin, jujur, sportif, bertanggung jawab, dan pantang menyerah menjaga kehormatan peleton serta sekolah.
                  </p>
                </div>

                <div className="pl-4 border-l-2 border-amber-400/70 space-y-1.5">
                  <h4 className="text-sm font-extrabold text-white tracking-tight">
                    “Berjuang dengan Gembira”
                  </h4>
                  <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                    Menjalani latihan hingga lomba dengan tulus, antusias, kompak saling menguatkan, penuh sukacita, dan mempererat persaudaraan antarsekolah.
                  </p>
                </div>
              </div>

              {/* Row 3: Catatan Ringkas Penerapan Materi Arahan Danton */}
              <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <Megaphone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                  <p>
                    <strong className="text-white">Materi Arahan Danton:</strong>{' '}
                    SD/MI pada <span className="text-amber-300 font-medium">Untuk Perhatian, Istirahat di Tempat</span>
                    <span className="text-slate-500 mx-1.5">·</span>
                    SMP/MTs pada <span className="text-amber-300 font-medium">Berhimpun</span>.
                  </p>
                </div>

                <a
                  href="#materi-lomba"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors shrink-0 no-underline"
                >
                  <span>Lihat Materi Lomba</span>
                  <ArrowDownRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* 2 Kartu: Paragraf 3 & Paragraf 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

            {/* Kartu 1 */}
            <div className="group rounded-2xl bg-slate-900/80 border border-white/[0.08] hover:border-amber-400/25 p-6 sm:p-7 shadow-lg backdrop-blur-md flex flex-col justify-start space-y-3.5 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-400 flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Misi 01
                </span>
              </div>
              <h4 className="text-lg font-bold text-white tracking-tight">
                Silaturahmi &amp; Semangat Berprestasi
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Menjadi sarana mempererat silaturahmi antarsekolah, membangun semangat berprestasi, serta memperkenalkan nilai-nilai pendidikan Mu’allimin kepada generasi muda.
              </p>
            </div>

            {/* Kartu 2 */}
            <div className="group rounded-2xl bg-slate-900/80 border border-white/[0.08] hover:border-red-500/25 p-6 sm:p-7 shadow-lg backdrop-blur-md flex flex-col justify-start space-y-3.5 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Misi 02
                </span>
              </div>
              <h4 className="text-lg font-bold text-white tracking-tight">
                Kompetisi Edukatif &amp; Berkarakter
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
