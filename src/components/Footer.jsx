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
  Award
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
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
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center gap-2 text-slate-300 hover:text-white transition-all text-xs font-semibold group shadow-sm"
                  aria-label="Instagram Resmi LBB"
                >
                  <Instagram className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
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
                <button
                  type="button"
                  onClick={() => setActiveView('rundown')}
                  className="text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5 group cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-yellow-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Rundown Resmi Kegiatan</span>
                </button>
              </li>
              <li>
                <a href="#prizes" className="text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-yellow-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Hadiah & Piala</span>
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
                  onClick={() => setActiveView('rundown')}
                  className="text-left text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5 group cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-yellow-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>Rundown Hari-H & TM 2027</span>
                </button>
              </li>
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
                    <span className="text-[10px] text-slate-500">Layanan WhatsApp Panitia</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Portal Badge, Scroll to Top */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 relative z-10">
          <p>© {SITE.YEAR} Madrasah Mu'allimin Muhammadiyah Yogyakarta • Panitia LBB {SITE.YEAR}</p>
          
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

      {/* Authentic Milad Illustration Motif Emerging from Bottom Center-Right (Tengah Agak ke Kanan, 100% Opacity, Di Depan Garis Border) */}
      <div 
        className="absolute bottom-0 left-[48%] sm:left-[52%] lg:left-[56%] -translate-x-1/2 pointer-events-none z-20 select-none overflow-hidden"
        aria-hidden="true"
      >
        <img
          src="/logo-milad.svg"
          alt=""
          className="w-[280px] sm:w-[360px] lg:w-[440px] h-auto object-contain translate-y-[58%] opacity-100 filter drop-shadow-2xl pointer-events-none select-none"
          loading="lazy"
          decoding="async"
        />
      </div>
    </footer>
  );
}
