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
import { EVENT, VENUE } from '../config.js';
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
            {/* Dynamic Multi-Color Stage Connector Line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 via-emerald-500 to-amber-500 lg:block hidden shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>

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

          {/* Right Column: Venue & Live Zone Allocation */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-2 relative overflow-hidden h-full">
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none z-0"></div>

              {/* Watermark Cadet Illustration */}
              <div className="absolute -right-8 -bottom-10 h-80 w-80 pointer-events-none opacity-15 hidden sm:block z-0">
                <img
                  src="/fotoslide/4.png"
                  alt="Arena Paskibra"
                  className="w-full h-full object-contain object-bottom [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
                  loading="lazy"
                />
              </div>

              <div className="bg-slate-950/80 rounded-[1.3rem] p-6 md:p-8 h-full relative z-10">
                <div className="border-b border-slate-800 pb-8 mb-8 space-y-6">
                  <div className="flex flex-col sm:flex-row gap-5 items-start justify-between">
                    <div className="flex gap-4 items-start">
                      <div className="w-14 h-14 bg-red-900/20 text-red-500 border border-red-500/30 rounded-2xl flex items-center justify-center shrink-0 animate-pulse-slow">
                        <MapPin className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white uppercase mb-1.5">
                          {VENUE.NAME}
                        </h3>
                        <p className="text-slate-400 font-mono text-xs sm:text-sm leading-relaxed max-w-lg">
                          <Navigation className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
                          <span>{VENUE.ADDRESS}</span>
                        </p>
                      </div>
                    </div>

                    <a
                      href={VENUE.MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-yellow-500 hover:text-white transition-colors border border-yellow-500/30 px-4 py-2 rounded-full hover:bg-yellow-500/10 shrink-0 self-start sm:self-auto"
                    >
                      Buka Google Maps <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Interactive Google Maps Preview */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner group">
                    <iframe
                      title="Peta Lokasi Kampus Terpadu Madrasah Mu'allimin Sedayu"
                      src={VENUE.MAPS_EMBED_URL || "https://maps.google.com/maps?q=-7.806784,110.2683762&hl=id&z=15&output=embed"}
                      className="w-full h-48 sm:h-56 border-0 filter grayscale contrast-125 opacity-80 group-hover:filter-none group-hover:opacity-100 transition-all duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>

                    {/* Overlay info & direction button */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[10px] sm:text-[11px] font-semibold text-slate-300 shadow-lg truncate">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                        <span className="truncate">Sedayu, Bantul &bull; GPS: -7.8067, 110.2683</span>
                      </div>
                      <a
                        href={VENUE.MAPS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-700/90 hover:bg-red-600 text-white text-[10px] sm:text-[11px] font-bold shadow-lg transition-colors shrink-0"
                      >
                        <span>Petunjuk Arah</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Live Zone Allocation
                </h4>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="group p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-600 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <Flag className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-white text-sm">Lapangan Mini Soccer</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400">
                      Arena utama upacara pembukaan, penutupan, & pengumuman kejuaraan.
                    </p>
                  </div>

                  <div className="group p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-600 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <Swords className="w-4 h-4 text-red-500" />
                      <span className="font-bold text-white text-sm">Lap. Basket & Embung</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400">
                      Daerah Persiapan (DP) & Arena Perlombaan Utama.
                    </p>
                  </div>

                  <div className="group p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-600 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <ClipboardList className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold text-white text-sm">Perpustakaan</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400">
                      Ruang Transit Juri, Rekapitulasi Nilai, & Pusat Kesekretariatan.
                    </p>
                  </div>

                  <div className="group p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-600 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <Tent className="w-4 h-4 text-green-500" />
                      <span className="font-bold text-white text-sm">Kelas & Area Pendukung</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400">
                      Basecamp / Ruang Tunggu persiapan masing-masing peleton.
                    </p>
                  </div>

                  <div className="group p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-600 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <span className="font-bold text-white text-sm">Masjid Hj. Yuliana</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400">
                      Fasilitas ibadah sholat (Dhuhur & Ashar) seluruh peserta & tamu.
                    </p>
                  </div>

                  <div className="group p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-600 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <Car className="w-4 h-4 text-slate-400" />
                      <span className="font-bold text-white text-sm">Area Parkir Kampus</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400">
                      Parkir kendaraan peserta & tamu (terkoordinasi keamanan).
                    </p>
                  </div>

                  <div className="group p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-orange-500/40 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <Store className="w-4 h-4 text-orange-400" />
                      <span className="font-bold text-white text-sm">Area Stan & Kuliner</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300">
                      Terpusat di <strong className="text-slate-200">Kompleks Math'am</strong>, <strong className="text-slate-200">1918 Foodcourt</strong>, dan <strong className="text-slate-200">1918 Mart</strong> bagi tenant & stan kegiatan.
                    </p>
                  </div>

                  <div className="group p-4 bg-red-950/25 border border-red-900/50 rounded-xl hover:border-red-500/60 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <Ban className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="font-bold text-red-400 text-sm">Area Asrama (Steril)</span>
                    </div>
                    <p className="text-xs text-red-300/80 leading-relaxed group-hover:text-red-200">
                      <strong className="text-red-300 font-bold">Dilarang masuk ke area Asrama.</strong> Zona khusus santri yang tertutup bagi peserta dan umum.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-start gap-4 p-4 rounded-xl bg-yellow-900/10 border border-yellow-700/30">
          <div className="bg-yellow-600/20 p-2 rounded-lg text-yellow-500 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-1 uppercase tracking-wide">Ketertiban Zona & Catatan Tambahan</h5>
            <p className="text-sm text-slate-400 leading-relaxed">
              Area stan tenant dan kuliner dipusatkan di <strong>Kompleks Math'am, 1918 Foodcourt, dan 1918 Mart</strong>. Seluruh peserta, pembina, suporter, dan pengunjung <strong>DILARANG MASUK ke area Asrama Santri</strong> demi menjaga ketertiban, keamanan, dan privasi santri. Denah lokasi secara detail dan alur pergerakan peserta akan disosialisasikan saat pelaksanaan <strong>Technical Meeting</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
