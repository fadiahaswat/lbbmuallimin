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
        <div className="mb-14 md:mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4">
            <CalendarDays className="w-3.5 h-3.5 text-red-700" />
            <span>Jadwal & Lokasi Kegiatan</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-tight py-1">
            Waktu & <span className="text-red-700">Tempat</span>
          </h2>
          <div className="w-16 h-1 bg-red-700 mx-auto mt-4 rounded-full"></div>
          <p className="text-slate-600 text-base mt-4 max-w-2xl mx-auto leading-relaxed font-normal">
            Jadwal kronologis 4 tahapan kompetisi dan panduan navigasi ke 2 kampus resmi Madrasah Mu'allimin Muhammadiyah Yogyakarta.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ========================================================
              LEFT COLUMN: TIMELINE (4 TAHAPAN KRONOLOGIS LOMBA)
              ======================================================== */}
          <div className="lg:col-span-5 space-y-4 relative">

            {/* Tahap 1: Pendaftaran Peleton */}
            <div className="relative rounded-xl bg-white border border-slate-200 p-5 shadow-sm transition-all hover:border-slate-300">
              <div className="flex items-start justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0">
                    01
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block truncate">
                      Tahap Registrasi
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                      Pendaftaran Peleton
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-0.5 rounded shrink-0 whitespace-nowrap">
                  Daring
                </span>
              </div>

              <div className="space-y-1 mb-2.5">
                <p className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {regRange}
                </p>
                <p className="text-xs font-normal text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Portal daring resmi 24 jam</span>
                </p>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed pt-2.5 border-t border-slate-100">
                Pengisian formulir digital, upload berkas persyaratan, dan pembayaran transfer (sistem kuota terbatas 36 peleton).
              </p>
            </div>

            {/* Tahap 2: Technical Meeting */}
            <div className="relative rounded-xl bg-white border border-slate-200 p-5 shadow-sm transition-all hover:border-slate-300">
              <div className="flex items-start justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0">
                    02
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block truncate">
                      Temu Teknis
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                      Technical Meeting (TM)
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded shrink-0 whitespace-nowrap">
                  Wajib
                </span>
              </div>

              <div className="space-y-1 mb-2.5">
                <p className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {tmDate}
                </p>
                <p className="text-xs font-normal text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{tmTime}</span>
                </p>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed pt-2.5 border-t border-slate-100">
                Pengundian nomor urut tampil, verifikasi faktual berkas fisik asli, dan penegasan tata tertib lomba.
              </p>
            </div>

            {/* Tahap 3: Uji Coba Lapangan */}
            <div className="relative rounded-xl bg-white border border-slate-200 p-5 shadow-sm transition-all hover:border-slate-300">
              <div className="flex items-start justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                    03
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block truncate">
                      Orientasi Arena
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                      Uji Coba Lapangan
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded shrink-0 whitespace-nowrap">
                  Orientasi
                </span>
              </div>

              <div className="space-y-1 mb-2.5">
                <p className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {trialDate}
                </p>
                <p className="text-xs font-normal text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{trialTime}</span>
                </p>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed pt-2.5 border-t border-slate-100">
                Orientasi arena pos perlombaan di Kampus Terpadu Sedayu agar danton dan pasukan beradaptasi dengan kontur medan.
              </p>
            </div>

            {/* Tahap 4: Hari-H Pelaksanaan Lomba */}
            <div className="relative rounded-xl bg-slate-900 text-white border border-slate-800 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white/10 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    04
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block truncate">
                      Pelaksanaan Lomba
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                      Hari-H Pelaksanaan
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-red-700 text-white px-2.5 py-0.5 rounded shrink-0 whitespace-nowrap">
                  Hari H
                </span>
              </div>

              <div className="space-y-1 mb-2.5">
                <p className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {compDate}
                </p>
                <p className="text-xs font-normal text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{compTime}</span>
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-2.5 text-xs text-slate-300 leading-relaxed mt-2.5">
                Pelaksanaan lomba kategori SD/MI dan SMP/MTs, upacara pembukaan dan penutupan, serta penganugerahan piala kejuaraan.
              </div>
            </div>

          </div>

          {/* ========================================================
              RIGHT COLUMN: VENUE CARDS (KAMPUS TERPADU & KAMPUS INDUK)
              ======================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* CARD 1: Kampus Terpadu Sedayu - Pelaksanaan & Uji Coba */}
            <div className="group relative rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm p-5 sm:p-7 transition-all duration-300 overflow-hidden">
              <div className="relative z-10 space-y-4">
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-700 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
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
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-800 transition-colors bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-2.5 rounded-xl shrink-0 w-full sm:w-auto shadow-xs active:scale-[0.99]"
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
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: Kampus Induk Wirobrajan - Technical Meeting */}
            <div className="group relative rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm p-5 sm:p-7 transition-all duration-300 overflow-hidden">
              <div className="relative z-10 space-y-4">
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
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
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-2.5 rounded-xl shrink-0 w-full sm:w-auto shadow-xs active:scale-[0.99]"
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
