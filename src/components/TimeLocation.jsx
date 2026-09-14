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
  AlertCircle
} from 'lucide-react';
import { EVENT, VENUE } from '../config.js';

export default function TimeLocation() {
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
          {/* Left Column: Schedule & Times */}
          <div className="lg:col-span-5 space-y-8 relative">
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-yellow-500 via-slate-800 to-slate-900 lg:block hidden"></div>

            <div className="relative pl-0 lg:pl-16 group">
              <div className="absolute left-0 top-0 w-12 h-12 bg-slate-900 border border-yellow-500/50 rounded-xl flex items-center justify-center text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.1)] z-10 hidden lg:flex">
                <CalendarDays className="w-6 h-6" />
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:border-yellow-500/30 transition-colors">
                <h3 className="text-xl font-black text-white mb-2 uppercase flex items-center gap-3">
                  <CalendarDays className="lg:hidden text-yellow-500 w-5 h-5" />
                  Hari, Tanggal
                </h3>
                <p className="text-2xl md:text-3xl font-black text-yellow-500 mb-6 tracking-tight">
                  {EVENT.COMPETITION_DATE}
                </p>

                <div className="bg-black/40 rounded-xl p-4 border-l-2 border-yellow-500/60">
                  <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider block mb-1">
                    Agenda Utama:
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Pelaksanaan lomba untuk kategori SD/MI dan SMP/MTs, rangkaian apel pembukaan & penutupan, hingga pengumuman juara umum dalam 1 hari.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative pl-0 lg:pl-16 group">
              <div className="absolute left-0 top-0 w-12 h-12 bg-slate-900 border border-red-500/50 rounded-xl flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)] z-10 hidden lg:flex">
                <Clock className="w-6 h-6" />
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:border-red-500/30 transition-colors">
                <h3 className="text-xl font-black text-white mb-2 uppercase flex items-center gap-3">
                  <Clock className="lg:hidden text-red-500 w-5 h-5" />
                  Waktu Pelaksanaan
                </h3>
                <p className="text-2xl md:text-3xl font-black text-white mb-6 tracking-tight">
                  {EVENT.COMPETITION_TIME_RANGE}
                </p>

                <div className="bg-black/40 rounded-xl p-4 border-l-2 border-red-500/60">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-1">
                    Ketentuan Kehadiran:
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Daftar ulang peserta & pengambilan nomor dada dibuka pukul 06.00 WIB. Seluruh kontingen wajib hadir tepat waktu sebelum Upacara Pembukaan.
                  </p>
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
                  src="/fotoslide/4.PNG"
                  alt="Arena Paskibra"
                  className="w-full h-full object-contain object-bottom [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
                  loading="lazy"
                />
              </div>

              <div className="bg-slate-950/80 rounded-[1.3rem] p-6 md:p-8 h-full relative z-10">
                <div className="flex flex-col md:flex-row gap-6 items-start border-b border-slate-800 pb-8 mb-8">
                  <div className="w-16 h-16 bg-red-900/20 text-red-500 border border-red-500/30 rounded-2xl flex items-center justify-center shrink-0 animate-pulse-slow">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase mb-2">
                      {VENUE.NAME}
                    </h3>
                    <p className="text-slate-400 font-mono text-sm leading-relaxed">
                      <Navigation className="w-3.5 h-3.5 inline mr-1" />
                      <span>{VENUE.ADDRESS}</span>
                    </p>
                    <a
                      href={VENUE.MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-yellow-500 mt-4 hover:text-white transition-colors border border-yellow-500/30 px-4 py-2 rounded-full hover:bg-yellow-500/10"
                    >
                      Buka Google Maps <ExternalLink className="w-3 h-3" />
                    </a>
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

                  <div className="group p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-600 transition-all col-span-1 sm:col-span-2">
                    <div className="flex items-center gap-3 mb-2">
                      <Store className="w-4 h-4 text-orange-500" />
                      <span className="font-bold text-white text-sm">Halaman Parkir (Area Stan)</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400">
                      Dialokasikan bagi tenant / stan pendukung kegiatan.
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
            <h5 className="text-white font-bold text-sm mb-1 uppercase tracking-wide">Catatan Tambahan</h5>
            <p className="text-sm text-slate-400 leading-relaxed">
              Denah lokasi secara detail, alur pergerakan peserta di dalam area kampus, serta pembagian zona fungsional lainnya akan dijelaskan lebih lanjut dan disosialisasikan kepada seluruh calon peserta saat pelaksanaan <strong>Technical Meeting</strong> serta akan tercantum dalam Petunjuk Pelaksanaan (Juklak) dan Petunjuk Teknis (Juknis) kegiatan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
