import React from 'react';
import {
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  Instagram,
  Youtube,
  Video
} from 'lucide-react';
import { SITE, SOCIAL, CONTACT, VENUE } from '../config.js';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-slate-400 pt-20 pb-10 border-t border-zinc-900 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-900 via-lbb-gold to-red-900"></div>
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Col 1: Brand & Social */}
          <div className="md:col-span-2 space-y-6">
            <a href="#home" className="flex items-center gap-3 group w-fit">
              <img
                src="/LOGO TONTI 400px.png"
                alt="LBB Logo"
                className="h-12 w-auto filter drop-shadow-lg opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <div className="flex flex-col">
                <span className="font-black text-2xl text-white leading-none tracking-tight">
                  LBB <span className="text-lbb-gold">{SITE.YEAR}</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold group-hover:text-red-500 transition-colors">
                  {SITE.TAGLINE}
                </span>
              </div>
            </a>

            <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
              {SITE.FOOTER_DESCRIPTION}
            </p>

            <div className="flex gap-3">
              <a
                href={SOCIAL.INSTAGRAM_URL}
                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-slate-400 hover:bg-lbb-red hover:text-white hover:border-lbb-red transition-all duration-300 shadow-lg"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL.YOUTUBE_URL}
                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 shadow-lg"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL.TIKTOK_URL}
                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white hover:border-white/20 transition-all duration-300 shadow-lg"
                aria-label="TikTok"
              >
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Menu Utama */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-widest text-xs uppercase border-b border-zinc-800 pb-2 inline-block">
              Menu Utama
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#about" className="hover:text-lbb-gold transition-colors flex items-center gap-2 group">
                  <ChevronRight className="w-3.5 h-3.5 text-lbb-red opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />{' '}
                  Tentang
                </a>
              </li>
              <li>
                <a href="#rules" className="hover:text-lbb-gold transition-colors flex items-center gap-2 group">
                  <ChevronRight className="w-3.5 h-3.5 text-lbb-red opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />{' '}
                  Juknis Lomba
                </a>
              </li>
              <li>
                <a href="#downloads" className="hover:text-lbb-gold transition-colors flex items-center gap-2 group">
                  <ChevronRight className="w-3.5 h-3.5 text-lbb-red opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />{' '}
                  Pusat Unduhan
                </a>
              </li>
              <li>
                <a href="#prizes" className="hover:text-lbb-gold transition-colors flex items-center gap-2 group">
                  <ChevronRight className="w-3.5 h-3.5 text-lbb-red opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />{' '}
                  Hadiah
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Sekretariat */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-widest text-xs uppercase border-b border-zinc-800 pb-2 inline-block">
              Sekretariat
            </h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-4 group cursor-pointer">
                <div className="mt-1 text-lbb-red group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="leading-relaxed text-slate-400 group-hover:text-slate-200 transition-colors">
                  <strong>Kampus Terpadu</strong><br />
                  Madrasah Mu'allimin Muhammadiyah<br />
                  <span>{VENUE.SHORT_ADDRESS}</span>
                </span>
              </li>

              <li className="flex items-center gap-4 group">
                <div className="text-lbb-red group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <a
                  href={CONTACT.EMAIL_HREF}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  {CONTACT.EMAIL}
                </a>
              </li>

              <li className="flex items-center gap-4 group">
                <div className="text-lbb-red group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-slate-400 group-hover:text-white transition-colors">
                  {CONTACT.PHONE_DISPLAY} (Panitia)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>{SITE.COPYRIGHT}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-lbb-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-lbb-gold transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-lbb-gold transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
