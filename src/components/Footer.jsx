import React from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Instagram,
  Video,
  ExternalLink,
  ArrowUp,
  ArrowUpRight,
} from 'lucide-react';
import { SITE, SOCIAL, CONTACT, VENUE } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';
import logoLbb from '../assets/logo-tonti.png';
import logoTonti from '../assets/logo-tonti-muallimin.png';
import logoMuallimin from '../assets/logo-muallimin.png';

const NAV_ITEMS = [
  { href: '#about', label: 'Tentang LBB' },
  { href: '#time-location', label: 'Waktu & Tempat' },
  { href: '#rules', label: 'Petunjuk Teknis' },
  { href: '#materi-lomba', label: 'Materi Gerakan' },
  { href: '#prizes', label: 'Hadiah & Piala' },
  { href: '#contact', label: 'FAQ & Bantuan' },
];

export default function Footer() {
  const { setActiveView, openAuthModal } = useCompetition();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const portalItems = [
    { label: 'Formulir Pendaftaran', action: () => setActiveView('register') },
    { label: 'Cek Status Peleton', action: () => setActiveView('status_check') },
    { label: 'Rundown Kegiatan', action: () => setActiveView('rundown') },
    { label: 'Masuk Akun Google', action: () => openAuthModal('login') },
    { label: 'Pengumuman Juara', action: () => setActiveView('announcement') },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 sm:pt-20 pb-28 lg:pb-12 border-t border-white/[0.06] relative overflow-hidden font-sans">
      {/* Top Crimson-Gold Accent Line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-800 via-amber-400 to-red-800" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        {/* Main Editorial 12-Col Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 sm:pb-14">
          {/* Col 1: Brand Identity (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <a
              href="#home"
              className="flex items-center gap-3.5 sm:gap-4 group w-fit"
              aria-label="Kembali ke Beranda"
            >
              <img
                src={logoLbb}
                alt="Logo LBB Mu'allimin"
                className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform"
                loading="lazy"
                decoding="async"
              />
              <div className="h-9 sm:h-10 w-px bg-white/15" />
              <img
                src={logoTonti}
                alt="Logo Korps Tonti Mu'allimin"
                className="h-11 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
                loading="lazy"
                decoding="async"
              />
              <img
                src={logoMuallimin}
                alt="Logo Madrasah Mu'allimin"
                className="h-9 sm:h-10 w-auto object-contain brightness-0 invert opacity-85 group-hover:opacity-100 transition-opacity"
                loading="lazy"
                decoding="async"
              />
            </a>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-sm">
              {SITE.FOOTER_DESCRIPTION}
            </p>

            {/* Minimal Social Pills */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={SOCIAL.INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-white/20 inline-flex items-center gap-2 text-slate-300 hover:text-white transition-all text-xs font-semibold"
                aria-label="Instagram Resmi LBB"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>{SOCIAL.INSTAGRAM_HANDLE}</span>
              </a>
              <a
                href={SOCIAL.TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-white/20 inline-flex items-center gap-2 text-slate-300 hover:text-white transition-all text-xs font-semibold"
                aria-label="TikTok Resmi Tonti"
              >
                <Video className="w-3.5 h-3.5 text-cyan-400" />
                <span>{SOCIAL.TIKTOK_HANDLE}</span>
              </a>
            </div>
          </div>

          {/* Col 2 & 3 Wrapper on Mobile: Clean 2-Col Side-by-Side! */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2 lg:col-span-4">
            {/* Navigasi */}
            <div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-white mb-4">
                Navigasi
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-[13px]">
                {NAV_ITEMS.map(item => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-slate-400 hover:text-white transition-colors inline-block"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Layanan Portal */}
            <div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-white mb-4">
                Portal Digital
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-[13px]">
                {portalItems.map((item, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={item.action}
                      className="text-left text-slate-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1 group cursor-pointer"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-400" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 4: Sekretariat & Kontak (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-white">
              Sekretariat Panitia
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-slate-200 font-bold block">
                    Kampus Terpadu Mu&apos;allimin
                  </strong>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Madrasah Mu&apos;allimin Muhammadiyah Yogyakarta · {VENUE.SHORT_ADDRESS}
                  </p>
                  <a
                    href={VENUE.MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors pt-0.5"
                  >
                    <span>Buka Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.07] space-y-2">
                <a
                  href={CONTACT.EMAIL_HREF}
                  className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="font-mono text-[11px]">{CONTACT.EMAIL}</span>
                </a>

                <a
                  href={CONTACT.WA_FAB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-slate-300 hover:text-emerald-300 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-mono text-[11px] font-bold">{CONTACT.PHONE_DISPLAY}</span>
                  <span className="text-[10px] text-slate-500">· WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar (Extra right padding on desktop so floating WA mascot never overlaps) */}
        <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] sm:text-xs text-slate-500 sm:pr-20">
          <p className="text-center sm:text-left">
            © {SITE.YEAR} Madrasah Mu&apos;allimin Muhammadiyah Yogyakarta · Panitia LBB {SITE.YEAR}
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-slate-300 hover:text-amber-300 font-bold text-[11px] transition-all group cursor-pointer shrink-0"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Subtle Ghost Milad Watermark */}
      <div
        className="absolute bottom-0 left-[52%] -translate-x-1/2 pointer-events-none z-0 select-none overflow-hidden"
        aria-hidden="true"
      >
        <img
          src="/logo-milad-navy.svg"
          alt=""
          className="w-[260px] sm:w-[340px] lg:w-[400px] h-auto object-contain translate-y-[58%] opacity-[0.12] saturate-[0.25] brightness-110"
          loading="lazy"
          decoding="async"
        />
      </div>
    </footer>
  );
}
