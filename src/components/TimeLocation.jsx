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
    <section id="time-location" className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden border-t border-slate-200 font-sans text-slate-800">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
      <div className="absolute -left-20 top-1/2 w-96 h-96 bg-red-100/60 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -right-20 bottom-0 w-96 h-96 bg-amber-100/60 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 md:mb-24 text-center">
          <span className="text-red-700 font-bold tracking-[0.25em] text-xs uppercase mb-3 block">
            Informasi Pelaksanaan Resmi
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight py-1">
            Waktu & <span className="inline-block pr-3 sm:pr-4 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">Tempat</span>
          </h2>
          <div className="w-20 h-1.5 bg-red-600 mx-auto mt-4 rounded-full skew-x-12 shadow-sm"></div>
          <p className="text-slate-600 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Jadwal kronologis 4 tahapan kompetisi dan panduan navigasi ke 2 kampus resmi Madrasah Mu'allimin Muhammadiyah Yogyakarta.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ========================================================
              LEFT COLUMN: TIMELINE (4 TAHAPAN KRONOLOGIS LOMBA)
              ======================================================== */}
          <div className="lg:col-span-5 space-y-4 relative">
            
            {/* Header timeline */}
            <div className="flex items-center justify-between pb-2 px-1 gap-2">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shrink-0"></span>
                <span className="truncate">Tahapan & Jadwal Kegiatan</span>
              </h3>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 sm:px-3 py-1 rounded-full shadow-sm shrink-0 whitespace-nowrap">
                4 Tahap Utama
              </span>
            </div>

            {/* Tahap 1: Pendaftaran Peleton (Biru) */}
            <div className="relative group rounded-2xl bg-white border border-blue-200 hover:border-blue-400 p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-black text-xs flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    01
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block truncate">
                      Tahap Registrasi
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                      Pendaftaran Peleton
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                  Daring
                </span>
              </div>

              <div className="space-y-1 mb-2.5">
                <p className="text-base sm:text-lg font-black text-blue-700 tracking-tight">
                  {regRange}
                </p>
                <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Portal Online Resmi 24 Jam Non-Stop</span>
                </p>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed pt-2.5 border-t border-slate-100">
                Pengisian formulir digital, upload berkas persyaratan, dan pembayaran transfer (sistem kuota terbatas 36 peleton).
              </p>
            </div>

            {/* Tahap 2: Technical Meeting (Ungu) */}
            <div className="relative group rounded-2xl bg-white border border-purple-200 hover:border-purple-400 p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 font-black text-xs flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    02
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block truncate">
                      Temu Teknis
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                      Technical Meeting (TM)
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                  Wajib
                </span>
              </div>

              <div className="space-y-1 mb-2.5">
                <p className="text-base sm:text-lg font-black text-purple-700 tracking-tight">
                  {tmDate}
                </p>
                <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>{tmTime}</span>
                </p>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed pt-2.5 border-t border-slate-100">
                Pengundian nomor urut tampil, verifikasi faktual berkas fisik asli, dan penegasan tata tertib lomba.
              </p>
            </div>

            {/* Tahap 3: Uji Coba Lapangan (Hijau Zamrud) */}
            <div className="relative group rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    03
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block truncate">
                      Orientasi Pos
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                      Uji Coba Lapangan
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                  Orientasi
                </span>
              </div>

              <div className="space-y-1 mb-2.5">
                <p className="text-base sm:text-lg font-black text-emerald-700 tracking-tight">
                  {trialDate}
                </p>
                <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{trialTime}</span>
                </p>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed pt-2.5 border-t border-slate-100">
                Orientasi arena pos perlombaan di Kampus Terpadu Sedayu agar danton dan pasukan beradaptasi dengan kontur medan.
              </p>
            </div>

            {/* Tahap 4: Hari-H Pelaksanaan Lomba (Merah & Amber Mewah) */}
            <div className="relative group rounded-2xl bg-gradient-to-br from-amber-50 to-red-50 border-2 border-amber-300 hover:border-amber-400 p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    04
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block truncate">
                      Hari Penentuan
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-slate-950 leading-tight">
                      Hari-H Pelaksanaan Lomba
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full shadow-sm shrink-0 whitespace-nowrap">
                  Puncak Acara
                </span>
              </div>

              <div className="space-y-1 mb-2.5">
                <p className="text-lg sm:text-xl font-black text-red-700 tracking-tight">
                  {compDate}
                </p>
                <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>{compTime}</span>
                </p>
              </div>

              <div className="bg-white/90 rounded-xl p-3 border-l-4 border-amber-500 text-xs text-slate-700 leading-relaxed mt-2.5 shadow-sm">
                Pelaksanaan lomba kategori SD/MI dan SMP/MTs, apel akbar pembukaan & penutupan, serta penganugerahan piala juara umum bergilir.
              </div>
            </div>

          </div>

          {/* ========================================================
              RIGHT COLUMN: VENUE CARDS (KAMPUS TERPADU & KAMPUS INDUK)
              ======================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* CARD 1: Kampus Terpadu Sedayu - Pelaksanaan & Uji Coba */}
            <div className="group relative rounded-3xl bg-white border border-slate-200 hover:border-red-300 shadow-xl p-5 sm:p-7 transition-all duration-300 overflow-hidden">
              <div className="relative z-10 space-y-4">
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center shadow-md shadow-red-200 shrink-0 group-hover:scale-105 transition-transform">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                          Pusat Lomba & Uji Coba
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                        {VENUE.NAME}
                      </h4>
                    </div>
                  </div>

                  <a
                    href={VENUE.MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-800 transition-colors bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-2 rounded-xl shrink-0 self-start sm:self-auto shadow-sm"
                  >
                    <span>Buka Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Alamat */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex items-start gap-2">
                  <Navigation className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{VENUE.ADDRESS}</span>
                </p>

                {/* Interactive Google Maps Preview */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group/map">
                  <iframe
                    title="Peta Lokasi Kampus Terpadu Madrasah Mu'allimin Sedayu"
                    src={VENUE.MAPS_EMBED_URL || "https://maps.google.com/maps?q=-7.806784,110.2683762&hl=id&z=15&output=embed"}
                    className="w-full h-44 sm:h-56 border-0 transition-opacity duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>

                  {/* Overlay Action Bar */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-[10px] sm:text-[11px] font-semibold text-slate-800 shadow-md truncate">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                      <span className="truncate">Sedayu, Bantul &bull; GPS: -7.8067, 110.2683</span>
                    </div>

                    <a
                      href={VENUE.MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-[11px] font-bold shadow-md transition-colors shrink-0"
                    >
                      <span>Petunjuk Arah</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: Kampus Induk Wirobrajan - Technical Meeting */}
            <div className="group relative rounded-3xl bg-white border border-slate-200 hover:border-blue-300 shadow-xl p-5 sm:p-7 transition-all duration-300 overflow-hidden">
              <div className="relative z-10 space-y-4">
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-200 shrink-0 group-hover:scale-105 transition-transform">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          Pusat Technical Meeting (TM)
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                        {VENUE_INDUK.NAME}
                      </h4>
                    </div>
                  </div>

                  <a
                    href={VENUE_INDUK.MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-2 rounded-xl shrink-0 self-start sm:self-auto shadow-sm"
                  >
                    <span>Buka Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Alamat */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex items-start gap-2">
                  <Navigation className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{VENUE_INDUK.ADDRESS}</span>
                </p>

                {/* Interactive Google Maps Preview */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group/map">
                  <iframe
                    title="Peta Lokasi Kampus Induk Madrasah Mu'allimin Yogyakarta"
                    src={VENUE_INDUK.MAPS_EMBED_URL}
                    className="w-full h-44 sm:h-56 border-0 transition-opacity duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>

                  {/* Overlay Action Bar */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-[10px] sm:text-[11px] font-semibold text-slate-800 shadow-md truncate">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0"></span>
                      <span className="truncate">{VENUE_INDUK.DISTRICT} &bull; GPS: {VENUE_INDUK.GPS}</span>
                    </div>

                    <a
                      href={VENUE_INDUK.MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-[11px] font-bold shadow-md transition-colors shrink-0"
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
