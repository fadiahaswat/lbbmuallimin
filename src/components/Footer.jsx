import React from 'react';
import {
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  Instagram,
  Video,
  ExternalLink,
  ArrowUp,
  ShieldCheck,
  Award,
  FileText,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { SITE, SOCIAL, CONTACT, VENUE, REGISTRATION } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';
import logoLbb from '../assets/logo-tonti.png';
import logoTonti from '../assets/logo-tonti-muallimin.png';
import logoMuallimin from '../assets/logo-muallimin.png';

export default function Footer() {
  const { setActiveView, openAuthModal } = useCompetition();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-28 lg:pb-12 border-t border-slate-900 relative overflow-hidden font-sans">
      {/* Top Gradient Accent Line matching Madrasah Brand Identity */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-800 via-amber-400 to-red-800"></div>

      {/* Subtle Ambient Red Glow */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-red-900/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Pre-Footer Action Banner / Callout Strip */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
          {/* Subtle Monochrome Cadet Watermark in the Right Background */}
          <div className="absolute right-0 top-0 bottom-0 w-96 pointer-events-none opacity-15 hidden lg:block z-0">
            <img
              src="/fotoslide/1.PNG"
              alt="Paskibra Pasukan"
              className="w-full h-full object-cover object-center grayscale contrast-125 filter [mask-image:linear-gradient(to_left,black_20%,transparent_90%)]"
              loading="lazy"
            />
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Pendaftaran Masih Dibuka • Kuota Terbatas</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight">
                Siap Tampil di Panggung Kehormatan LBB {SITE.YEAR}?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Segera daftarkan peleton terbaik sekolah Anda. Perebutkan Piala Bergilir bergengsi dan total pembinaan puluhan juta rupiah.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveView('register')}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black rounded-xl shadow-lg shadow-yellow-500/20 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Daftar Peleton Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#rules"
                className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl border border-white/15 text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-yellow-400" />
                <span>Petunjuk Teknis</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          
          {/* Col 1: Brand & Organization Info (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            <a href="#home" className="flex items-center gap-4 group w-fit" aria-label="Kembali ke Beranda">
              {/* Trio Logo Tanpa Wadah: Logo LBB (Lebih Besar) - Logo Tonti Mu'allimin - Logo Mu'allimin */}
              <div className="flex items-center gap-3.5 sm:gap-4.5">
                <img
                  src={logoLbb}
                  alt="Logo LBB Mu'allimin"
                  className="h-16 sm:h-20 w-auto object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform"
                  loading="lazy"
                  decoding="async"
                />
                <div className="h-10 sm:h-12 w-px bg-slate-800" />
                <img
                  src={logoTonti}
                  alt="Logo Korps Tonti Mu'allimin"
                  className="h-12 sm:h-14 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src={logoMuallimin}
                  alt="Logo Madrasah Mu'allimin"
                  className="h-10 sm:h-12 w-auto object-contain filter brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </a>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-sm">
              {SITE.FOOTER_DESCRIPTION}
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Kanal Resmi Media Sosial:
              </span>
              <div className="flex gap-2.5">
                <a
                  href={SOCIAL.INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 border border-slate-800 hover:border-transparent flex items-center gap-2 text-slate-300 hover:text-white transition-all text-xs font-bold group shadow-sm"
                  aria-label="Instagram Resmi LBB"
                >
                  <Instagram className="w-4 h-4 text-pink-400 group-hover:text-white transition-colors" />
                  <span>Instagram</span>
                </a>
                <a
                  href={SOCIAL.TIKTOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black border border-slate-800 hover:border-slate-700 flex items-center gap-2 text-slate-300 hover:text-white transition-all text-xs font-bold group shadow-sm"
                  aria-label="TikTok Resmi Tonti"
                >
                  <Video className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors" />
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Menu Navigasi (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-extrabold mb-5 tracking-wider text-xs uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>Navigasi Acara</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#about" className="text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-yellow-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Tentang LBB</span>
                </a>
              </li>
              <li>
                <a href="#rules" className="text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-yellow-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Petunjuk Teknis</span>
                </a>
              </li>
              <li>
                <a href="#materi" className="text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-yellow-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Materi Gerakan</span>
                </a>
              </li>
              <li>
                <a href="#prizes" className="text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-yellow-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Hadiah & Piala</span>
                </a>
              </li>
              <li>
                <a href="#downloads" className="text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-yellow-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Pusat Unduhan</span>
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-yellow-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Tanya Jawab (FAQ)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Layanan Portal (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-extrabold mb-5 tracking-wider text-xs uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              <span>Layanan Portal</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('register')}
                  className="text-left text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5 group cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-yellow-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Formulir Pendaftaran Online</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('status_check')}
                  className="text-left text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5 group cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-yellow-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Cek Status Verifikasi Peleton</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-left text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5 group cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-yellow-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Masuk Akun Google Resmi</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('announcement')}
                  className="text-left text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5 group cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-yellow-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Pengumuman Rekap Juara</span>
                </button>
              </li>
            </ul>

            <div className="mt-5 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Layanan Informasi:
              </span>
              <p className="text-[11px] text-slate-400 leading-snug">
                Pastikan data sekolah dan berkas yang didaftarkan telah sesuai dengan ketentuan juknis resmi.
              </p>
            </div>
          </div>

          {/* Col 4: Sekretariat & Kontak (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-extrabold mb-5 tracking-wider text-xs uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Sekretariat Panitia</span>
            </h4>
            
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold text-xs">Kampus Terpadu Mu'allimin</strong>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      Madrasah Mu'allimin Muhammadiyah Yogyakarta<br />
                      {VENUE.SHORT_ADDRESS}
                    </p>
                  </div>
                </div>
                <a
                  href={VENUE.MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-400 hover:text-yellow-300 transition-colors pt-1"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-2 pt-1">
                <a
                  href={CONTACT.EMAIL_HREF}
                  className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span>{CONTACT.EMAIL}</span>
                </a>

                <a
                  href={CONTACT.WA_FAB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-200">{CONTACT.PHONE_DISPLAY}</span>
                    <span className="text-[10px] text-slate-500">Layanan WhatsApp (Kak Rusyda)</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Portal Badge, Scroll to Top */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {SITE.YEAR} Madrasah Mu'allimin Muhammadiyah Yogyakarta • Panitia LBB 2026</p>
          
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <button
              type="button"
              onClick={scrollToTop}
              className="hover:text-yellow-400 transition-colors flex items-center gap-1.5 font-bold group cursor-pointer"
            >
              <span>Kembali ke Atas</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
