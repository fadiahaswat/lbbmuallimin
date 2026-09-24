import React from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Navigation,
  ExternalLink,
  Flag,
  Swords,
  ClipboardList,
  Tent,
  Moon,
  Car,
  Store,
  AlertCircle,
  Ban,
  UserPlus
} from 'lucide-react';
import { EVENT, VENUE, VENUE_INDUK } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';

export default function TimeLocation() {
  const { settings } = useCompetition();
  const eventDates = settings?.eventDates || {};

  const regRange = eventDates.registrationRangeText || EVENT.REGISTRATION_RANGE;
  const compDate = eventDates.competitionDate || EVENT.COMPETITION_DATE;
  const compTime = eventDates.competitionTimeRange || EVENT.COMPETITION_TIME_RANGE;
  const tmDate = eventDates.technicalMeetingFullDate || eventDates.technicalMeetingDate || EVENT.TECHNICAL_MEETING_FULL_DATE;
  const tmTime = eventDates.technicalMeetingTime || EVENT.TECHNICAL_MEETING_TIME;
  const trialDate = eventDates.fieldTrialFullDate || eventDates.fieldTrialDate || EVENT.FIELD_TRIAL_FULL_DATE;
  const trialTime = eventDates.fieldTrialTime || EVENT.FIELD_TRIAL_TIME_RANGE;

  return (
    <section id="time-location" className="py-24 lg:py-32 bg-slate-950 relative overflow-hidden border-t border-slate-900 font-sans">
      <div className="absolute inset-0 bg-carbon-pattern opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-900 to-transparent"></div>
      <div className="absolute -left-20 top-1/2 w-96 h-96 bg-red-900/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute -right-20 bottom-0 w-96 h-96 bg-yellow-600/10 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 md:mb-24 text-center">
          <span className="text-yellow-500 font-bold tracking-[0.25em] text-xs uppercase mb-3 block">
            Informasi Pelaksanaan
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight py-1">
            Waktu & <span className="inline-block pr-3 sm:pr-4 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">Tempat</span>
          </h2>
          <div className="w-20 h-1.5 bg-red-700 mx-auto mt-6 rounded-full skew-x-12 shadow-[0_0_15px_rgba(185,28,28,0.5)]"></div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Schedule & Times (Urutan Kronologis: Pendaftaran -> TM -> Uji Coba -> Hari H) */}
          <div className="lg:col-span-5 space-y-6 relative">
            {/* Dynamic Multi-Color Stage Connector Line with explicit color stops matching each card */}
            <div
              className="absolute left-6 top-6 bottom-10 w-0.5 lg:block hidden"
              style={{
                background: 'linear-gradient(to bottom, #3b82f6 0%, #3b82f6 20%, #a855f7 35%, #a855f7 50%, #10b981 65%, #10b981 80%, #eab308 95%, #eab308 100%)',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
              }}
            ></div>

            {/* Card 1: Pendaftaran Peleton (Biru / Blue) */}
            <div className="relative pl-0 lg:pl-16 group">
              <div className="absolute left-0 top-0 w-12 h-12 bg-slate-900 border-2 border-blue-500/60 rounded-xl flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.25)] z-10 hidden lg:flex group-hover:border-blue-400 transition-colors">
                <UserPlus className="w-6 h-6" />
              </div>

              <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 p-5 rounded-2xl hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.1)] transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-base font-black text-white uppercase flex items-center gap-2">
                    <UserPlus className="lg:hidden text-blue-400 w-4 h-4" />
                    Pendaftaran Peleton
                  </h3>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/40 px-2 py-0.5 rounded">
                    Registrasi
                  </span>
                </div>
                <p className="text-lg font-black text-blue-400 mb-0.5 tracking-tight">
                  {regRange}
                </p>
                <p className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Portal Online Resmi 24 Jam</span>
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pengisian formulir digital, upload berkas persyaratan, dan pembayaran transfer (sistem kuota terbatas).
                </p>
              </div>
            </div>

            {/* Card 2: Technical Meeting (Ungu / Purple) */}
            <div className="relative pl-0 lg:pl-16 group">
              <div className="absolute left-0 top-0 w-12 h-12 bg-slate-900 border-2 border-purple-500/60 rounded-xl flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)] z-10 hidden lg:flex group-hover:border-purple-400 transition-colors">
                <ClipboardList className="w-6 h-6" />
              </div>

              <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 p-5 rounded-2xl hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.1)] transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-base font-black text-white uppercase flex items-center gap-2">
                    <ClipboardList className="lg:hidden text-purple-400 w-4 h-4" />
                    Technical Meeting (TM)
                  </h3>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded">
                    Wajib
                  </span>
                </div>
                <p className="text-lg font-black text-purple-400 mb-0.5 tracking-tight">
                  {tmDate}
                </p>
                <p className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>{tmTime}</span>
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pengundian nomor urut tampil, verifikasi faktual berkas fisik asli, dan penegasan tata tertib lomba.
                </p>
              </div>
            </div>

            {/* Card 3: Uji Coba Lapangan (Hijau Zamrud / Emerald) */}
            <div className="relative pl-0 lg:pl-16 group">
              <div className="absolute left-0 top-0 w-12 h-12 bg-slate-900 border-2 border-emerald-500/60 rounded-xl flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] z-10 hidden lg:flex group-hover:border-emerald-400 transition-colors">
                <Flag className="w-6 h-6" />
              </div>

              <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 p-5 rounded-2xl hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-base font-black text-white uppercase flex items-center gap-2">
                    <Flag className="lg:hidden text-emerald-400 w-4 h-4" />
                    Uji Coba Lapangan
                  </h3>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                    Orientasi
                  </span>
                </div>
                <p className="text-lg font-black text-emerald-400 mb-0.5 tracking-tight">
                  {trialDate}
                </p>
                <p className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{trialTime}</span>
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Orientasi arena pos perlombaan di Kampus Terpadu Mu'allimin Sedayu agar tim peserta beradaptasi dengan kontur lapangan.
                </p>
              </div>
            </div>

            {/* Card 4: Hari H Pelaksanaan (Emas Juara / Gold & Crimson) */}
            <div className="relative pl-0 lg:pl-16 group">
              <div className="absolute left-0 top-0 w-12 h-12 bg-slate-900 border-2 border-yellow-500/70 rounded-xl flex items-center justify-center text-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.3)] z-10 hidden lg:flex group-hover:border-yellow-400 transition-colors">
                <CalendarDays className="w-6 h-6" />
              </div>

              <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-black text-white uppercase flex items-center gap-2.5">
                    <CalendarDays className="lg:hidden text-yellow-400 w-5 h-5" />
                    Hari-H Pelaksanaan
                  </h3>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-yellow-500/15 text-yellow-300 border border-yellow-500/40 px-2.5 py-0.5 rounded font-bold">
                    Puncak Acara
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-black text-yellow-400 mb-1 tracking-tight">
                  {compDate}
                </p>
                <p className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{compTime}</span>
                </p>

                <div className="bg-black/50 rounded-xl p-3 border-l-2 border-yellow-500 text-xs text-slate-300 leading-relaxed">
                  Pelaksanaan lomba kategori SD/MI dan SMP/MTs, rangkaian apel pembukaan & penutupan, hingga penganugerahan piala juara umum.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Venue Cards (Kampus Terpadu & Kampus Induk) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* CARD 1 (TOP): Kampus Terpadu Sedayu - Pelaksanaan & Uji Coba */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none z-0"></div>

              {/* Watermark Cadet Illustration */}
              <div className="absolute -right-8 -bottom-10 h-72 w-72 pointer-events-none opacity-15 hidden sm:block z-0">
                <picture>
                  <source srcSet="/fotoslide/4.webp" type="image/webp" />
                  <img
                    src="/fotoslide/4.png"
                    alt="Arena Paskibra"
                    className="w-full h-full object-contain object-bottom [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>

              <div className="bg-slate-950/80 rounded-[1.3rem] p-5 sm:p-6 relative z-10 space-y-5">
                <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
                  <div className="flex gap-3.5 items-start">
                    <div className="w-12 h-12 bg-red-900/20 text-red-500 border border-red-500/30 rounded-2xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white uppercase">
                          {VENUE.NAME}
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded">
                          Pelaksanaan Lomba & Uji Coba
                        </span>
                      </div>
                      <p className="text-slate-400 font-mono text-xs leading-relaxed max-w-lg">
                        <Navigation className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
                        <span>{VENUE.ADDRESS}</span>
                      </p>
                    </div>
                  </div>

                  <a
                    href={VENUE.MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-500 hover:text-white transition-colors border border-yellow-500/30 px-3.5 py-1.5 rounded-full hover:bg-yellow-500/10 shrink-0 self-start sm:self-auto"
                  >
                    Buka Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Interactive Google Maps Preview */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner group">
                  <iframe
                    title="Peta Lokasi Kampus Terpadu Madrasah Mu'allimin Sedayu"
                    src={VENUE.MAPS_EMBED_URL || "https://maps.google.com/maps?q=-7.806784,110.2683762&hl=id&z=15&output=embed"}
                    className="w-full h-44 sm:h-52 border-0 opacity-90 hover:opacity-100 transition-all duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>

                  {/* Overlay info & direction button */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none gap-2">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[10px] sm:text-[11px] font-semibold text-slate-300 shadow-lg truncate">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                      <span className="truncate">Sedayu, Bantul &bull; GPS: -7.8067, 110.2683</span>
                    </div>
                    <a
                      href={VENUE.MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-700/90 hover:bg-red-600 text-white text-[10px] sm:text-[11px] font-bold shadow-lg transition-colors shrink-0"
                    >
                      <span>Petunjuk Arah</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2 (BOTTOM): Kampus Induk (Letjend. S. Parman 68) - Technical Meeting */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none z-0"></div>

              <div className="bg-slate-950/80 rounded-[1.3rem] p-5 sm:p-6 relative z-10 space-y-5">
                <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
                  <div className="flex gap-3.5 items-start">
                    <div className="w-12 h-12 bg-blue-900/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white uppercase">
                          {VENUE_INDUK.NAME}
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded">
                          Technical Meeting (TM)
                        </span>
                      </div>
                      <p className="text-slate-400 font-mono text-xs leading-relaxed max-w-lg">
                        <Navigation className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
                        <span>{VENUE_INDUK.ADDRESS}</span>
                      </p>
                    </div>
                  </div>

                  <a
                    href={VENUE_INDUK.MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-500 hover:text-white transition-colors border border-yellow-500/30 px-3.5 py-1.5 rounded-full hover:bg-yellow-500/10 shrink-0 self-start sm:self-auto"
                  >
                    Buka Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Interactive Google Maps Preview */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner group">
                  <iframe
                    title="Peta Lokasi Kampus Induk Madrasah Mu'allimin Yogyakarta"
                    src={VENUE_INDUK.MAPS_EMBED_URL}
                    className="w-full h-44 sm:h-52 border-0 opacity-90 hover:opacity-100 transition-all duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>

                  {/* Overlay info & direction button */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none gap-2">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[10px] sm:text-[11px] font-semibold text-slate-300 shadow-lg truncate">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0"></span>
                      <span className="truncate">{VENUE_INDUK.DISTRICT} &bull; GPS: {VENUE_INDUK.GPS}</span>
                    </div>
                    <a
                      href={VENUE_INDUK.MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-700/90 hover:bg-blue-600 text-white text-[10px] sm:text-[11px] font-bold shadow-lg transition-colors shrink-0"
                    >
                      <span>Petunjuk Arah</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
