import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Building2,
  Bus,
  Users,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { EVENT, VENUE, VENUE_INDUK } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';

export default function TimeLocation() {
  const { settings, setActiveView } = useCompetition();
  const eventDates = settings?.eventDates || {};

  const regRange = eventDates.registrationRangeText || EVENT.REGISTRATION_RANGE;
  const compDate = eventDates.competitionDate || EVENT.COMPETITION_DATE;
  const compTime = eventDates.competitionTimeRange || EVENT.COMPETITION_TIME_RANGE;
  const tmDate =
    eventDates.technicalMeetingFullDate ||
    eventDates.technicalMeetingDate ||
    EVENT.TECHNICAL_MEETING_FULL_DATE;
  const tmTime = eventDates.technicalMeetingTime || EVENT.TECHNICAL_MEETING_TIME;
  const trialDate =
    eventDates.fieldTrialFullDate ||
    eventDates.fieldTrialDate ||
    EVENT.FIELD_TRIAL_FULL_DATE;
  const trialTime = eventDates.fieldTrialTime || EVENT.FIELD_TRIAL_TIME_RANGE;

  const [activeCampus, setActiveCampus] = useState('sedayu'); // 'sedayu' | 'induk'
  const [copiedAddress, setCopiedAddress] = useState(false);

  const milestones = [
    {
      step: '01',
      eyebrow: 'Tahap Registrasi',
      title: 'Pendaftaran Peleton',
      badge: 'Daring',
      date: regRange,
      time: 'Portal daring resmi 24 jam',
      locationLabel: 'Online • lbb.tontimuallimin.com',
      locationIcon: Globe,
      desc: 'Pengisian formulir digital, unggah berkas persyaratan, dan verifikasi pembayaran (kuota terbatas 36 peleton).',
      campusTarget: null,
      accentNode: 'bg-sky-600 text-white border-sky-200',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
      isHighlight: false,
    },
    {
      step: '02',
      eyebrow: 'Temu Teknis',
      title: 'Technical Meeting (TM)',
      badge: 'Wajib',
      date: tmDate,
      time: tmTime,
      locationLabel: 'Kampus Induk Wirobrajan',
      locationIcon: Building2,
      desc: 'Pengundian nomor urut tampil, verifikasi berkas fisik asli berstempel basah, dan penegasan tata tertib lomba.',
      campusTarget: 'induk',
      accentNode: 'bg-blue-700 text-white border-blue-200',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      isHighlight: false,
    },
    {
      step: '03',
      eyebrow: 'Orientasi Arena',
      title: 'Uji Coba Lapangan',
      badge: 'Orientasi',
      date: trialDate,
      time: trialTime,
      locationLabel: 'Kampus Terpadu Sedayu',
      locationIcon: Compass,
      desc: 'Adaptasi tekstur lantai arena pos SD/MI & SMP/MTs serta simulasi alur masuk/keluar arena (tanpa penilaian juri).',
      campusTarget: 'sedayu',
      accentNode: 'bg-indigo-600 text-white border-indigo-200',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      isHighlight: false,
    },
    {
      step: '04',
      eyebrow: 'Puncak Kompetisi',
      title: 'Hari-H Pelaksanaan',
      badge: 'Hari-H',
      date: compDate,
      time: compTime,
      locationLabel: 'Kampus Terpadu Sedayu',
      locationIcon: MapPin,
      desc: 'Pelaksanaan lomba SD/MI & SMP/MTs paralel di 2 arena, upacara pembukaan & penutupan, serta penganugerahan piala.',
      campusTarget: 'sedayu',
      accentNode: 'bg-red-700 text-white border-red-300',
      badgeClass: 'bg-red-600 text-white border-red-500',
      isHighlight: true,
    },
  ];

  const campuses = {
    sedayu: {
      id: 'sedayu',
      tabLabel: 'Kampus Terpadu Sedayu',
      tabSub: 'Hari-H Lomba & Uji Coba',
      roleBadge: 'Pusat Lomba & Uji Coba Lapangan',
      roleBadgeClass: 'bg-red-50 text-red-700 border-red-200',
      name: VENUE.NAME,
      address: VENUE.ADDRESS,
      district: 'Sedayu, Bantul',
      gps: '-7.8067, 110.2683',
      mapsUrl: VENUE.MAPS_URL,
      embedUrl:
        VENUE.MAPS_EMBED_URL ||
        'https://maps.google.com/maps?q=-7.806784,110.2683762&hl=id&z=15&output=embed',
      iframeTitle: "Peta Lokasi Kampus Terpadu Madrasah Mu'allimin Sedayu",
      btnClass: 'bg-red-700 hover:bg-red-800 text-white',
      dotClass: 'bg-red-600',
      activeTabClass: 'bg-red-700 text-white shadow-md shadow-red-900/20',
      highlights: [
        {
          icon: Compass,
          label: '2 Arena Paralel',
          value: 'Lap. Basket (SD) & Embung (SMP)',
        },
        {
          icon: Bus,
          label: 'Parkir Bus Kontingen',
          value: 'Drop-off kampus, parkir Lap. Hibrida',
        },
        {
          icon: Building2,
          label: 'Fasilitas Lengkap',
          value: 'Basecamp 4 Lt, Masjid & Foodcourt',
        },
      ],
    },
    induk: {
      id: 'induk',
      tabLabel: 'Kampus Induk Wirobrajan',
      tabSub: 'Technical Meeting (TM)',
      roleBadge: 'Pusat Technical Meeting (TM)',
      roleBadgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      name: VENUE_INDUK.NAME,
      address: VENUE_INDUK.ADDRESS,
      district: VENUE_INDUK.DISTRICT || 'Wirobrajan, Kota Yogyakarta',
      gps: VENUE_INDUK.GPS || '-7.8076, 110.3514',
      mapsUrl: VENUE_INDUK.MAPS_URL,
      embedUrl: VENUE_INDUK.MAPS_EMBED_URL,
      iframeTitle: "Peta Lokasi Kampus Induk Madrasah Mu'allimin Yogyakarta",
      btnClass: 'bg-slate-900 hover:bg-blue-700 text-white',
      dotClass: 'bg-blue-600',
      activeTabClass: 'bg-slate-900 text-white shadow-md shadow-slate-900/20',
      highlights: [
        {
          icon: Building2,
          label: 'Ruang Pertemuan',
          value: 'Aula Utama Kampus Induk',
        },
        {
          icon: Users,
          label: 'Kuota Delegasi',
          value: 'Maks. 2 perwakilan per sekolah',
        },
        {
          icon: FileCheck2,
          label: 'Registrasi Berkas',
          value: '12.30–13.00 WIB (berkas fisik asli)',
        },
      ],
    },
  };

  const currentVenue = campuses[activeCampus];

  function handleCopyAddress() {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(currentVenue.address).then(() => {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      });
    }
  }

  return (
    <section
      id="time-location"
      className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden border-t border-slate-200 font-sans text-slate-800"
    >
      {/* Background Architectural Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-45 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600/80 to-transparent" />
      <div className="absolute -left-24 top-1/3 w-96 h-96 bg-red-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -right-24 bottom-0 w-96 h-96 bg-amber-100/45 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* ========================================================
            SECTION HEADER
            ======================================================== */}
        <div className="mb-12 lg:mb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <CalendarDays className="w-3.5 h-3.5 text-red-700" />
            <span>Jadwal &amp; Lokasi Kegiatan</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-tight">
            Waktu &amp; <span className="text-red-700">Tempat</span>
          </h2>
          <div className="w-16 h-1 bg-red-700 mx-auto mt-4 rounded-full" />
          <p className="text-slate-600 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Alur kronologis 4 tahapan resmi kompetisi dan panduan navigasi menuju 2 kampus Madrasah Mu'allimin Muhammadiyah Yogyakarta.
          </p>

          <div className="mt-6 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setActiveView('rundown')}
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Lihat Rundown Lengkap Acara</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================================
            MAIN 12-COL SPLIT: TIMELINE (5 COLS) + INTERACTIVE VENUE HUB (7 COLS)
            ======================================================== */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT COLUMN: CONNECTED VERTICAL TIMELINE */}
          <div className="lg:col-span-5 relative">
            {/* Continuous Timeline Spine */}
            <div
              className="hidden sm:block absolute left-5 top-6 bottom-6 w-px bg-gradient-to-b from-sky-300 via-slate-300 to-red-500 pointer-events-none"
              aria-hidden="true"
            />

            <div className="space-y-4">
              {milestones.map(item => {
                const LocIcon = item.locationIcon;
                const isLinkedToActiveCampus =
                  item.campusTarget && item.campusTarget === activeCampus;
                const isClickable = Boolean(item.campusTarget);

                return (
                  <div
                    key={item.step}
                    onClick={() => {
                      if (item.campusTarget) setActiveCampus(item.campusTarget);
                    }}
                    role={isClickable ? 'button' : undefined}
                    tabIndex={isClickable ? 0 : undefined}
                    onKeyDown={e => {
                      if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        setActiveCampus(item.campusTarget);
                      }
                    }}
                    className={`relative sm:pl-14 group transition-all ${
                      isClickable ? 'cursor-pointer' : ''
                    }`}
                  >
                    {/* Timeline Node Badge (Desktop/Tablet) */}
                    <div
                      className={`hidden sm:flex absolute left-0 top-5 w-10 h-10 rounded-xl border-2 font-black text-xs font-mono items-center justify-center shadow-sm transition-transform ${
                        item.accentNode
                      } ${isLinkedToActiveCampus ? 'scale-105 ring-4 ring-red-100' : ''}`}
                    >
                      {item.step}
                    </div>

                    {/* Milestone Card */}
                    <div
                      className={`rounded-2xl border p-5 transition-all duration-200 overflow-hidden relative ${
                        item.isHighlight
                          ? 'bg-slate-950 text-white border-slate-800 shadow-xl'
                          : isLinkedToActiveCampus
                            ? 'bg-white border-slate-300 shadow-md ring-1 ring-slate-200/80'
                            : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      {item.isHighlight && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-700 via-amber-400 to-red-700" />
                      )}

                      {/* Top Meta Row */}
                      <div className="flex items-start justify-between gap-2.5 mb-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`sm:hidden inline-flex w-7 h-7 rounded-lg font-black text-[11px] font-mono items-center justify-center shrink-0 ${item.accentNode}`}
                          >
                            {item.step}
                          </span>
                          <div className="min-w-0">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider block ${
                                item.isHighlight ? 'text-amber-400' : 'text-slate-400'
                              }`}
                            >
                              {item.eyebrow}
                            </span>
                            <h3
                              className={`text-sm sm:text-base font-extrabold leading-tight ${
                                item.isHighlight ? 'text-white' : 'text-slate-900'
                              }`}
                            >
                              {item.title}
                            </h3>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border shrink-0 ${item.badgeClass}`}
                        >
                          {item.badge}
                        </span>
                      </div>

                      {/* Date & Time */}
                      <div className="space-y-1 mb-3">
                        <p
                          className={`text-base sm:text-lg font-black tracking-tight ${
                            item.isHighlight ? 'text-white' : 'text-slate-950'
                          }`}
                        >
                          {item.date}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                          <span
                            className={`inline-flex items-center gap-1.5 ${
                              item.isHighlight ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            <Clock
                              className={`w-3.5 h-3.5 shrink-0 ${
                                item.isHighlight ? 'text-amber-400' : 'text-slate-400'
                              }`}
                            />
                            <span>{item.time}</span>
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        className={`text-xs leading-relaxed pb-3 border-b ${
                          item.isHighlight
                            ? 'text-slate-300 border-white/10'
                            : 'text-slate-500 border-slate-100'
                        }`}
                      >
                        {item.desc}
                      </p>

                      {/* Location Chip Footer */}
                      <div className="pt-2.5 flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-bold ${
                            item.isHighlight ? 'text-amber-300' : 'text-slate-700'
                          }`}
                        >
                          <LocIcon
                            className={`w-3.5 h-3.5 shrink-0 ${
                              item.isHighlight
                                ? 'text-amber-400'
                                : item.campusTarget === 'induk'
                                  ? 'text-blue-600'
                                  : item.campusTarget === 'sedayu'
                                    ? 'text-red-600'
                                    : 'text-sky-600'
                            }`}
                          />
                          <span>{item.locationLabel}</span>
                        </span>

                        {isClickable && (
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                              item.isHighlight
                                ? 'text-slate-400 group-hover:text-white'
                                : isLinkedToActiveCampus
                                  ? 'text-red-700'
                                  : 'text-slate-400 group-hover:text-slate-700'
                            }`}
                          >
                            {isLinkedToActiveCampus ? 'Ditampilkan di Peta' : 'Lihat Peta →'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: UNIFIED INTERACTIVE VENUE & NAVIGATION HUB */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-5">
            <div className="rounded-3xl bg-white border border-slate-200/90 shadow-lg overflow-hidden">
              {/* Top Interactive 2-Campus Switcher */}
              <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200/80">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-700" />
                    <span>Pilih Lokasi Kampus</span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    2 Lokasi Resmi Berbeda
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.values(campuses).map(campus => {
                    const isActive = activeCampus === campus.id;
                    return (
                      <button
                        key={campus.id}
                        type="button"
                        onClick={() => setActiveCampus(campus.id)}
                        className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex items-center gap-3 ${
                          isActive
                            ? `${campus.activeTabClass} border-transparent`
                            : 'bg-white hover:bg-slate-100/80 text-slate-700 border-slate-200'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isActive
                              ? 'bg-white/15 text-white'
                              : campus.id === 'sedayu'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider block ${
                              isActive ? 'text-white/80' : 'text-slate-400'
                            }`}
                          >
                            {campus.tabSub}
                          </span>
                          <span className="text-xs sm:text-sm font-black block truncate">
                            {campus.tabLabel}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Campus Header & Address */}
              <div className="p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${currentVenue.roleBadgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${currentVenue.dotClass}`} />
                      <span>{currentVenue.roleBadge}</span>
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                      {currentVenue.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Alamat Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Alamat</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <Navigation
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      activeCampus === 'sedayu' ? 'text-red-600' : 'text-blue-600'
                    }`}
                  />
                  <span>{currentVenue.address}</span>
                </p>

                {/* Clean Interactive Google Maps Embed (No Overlapping Controls) */}
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                  <iframe
                    key={activeCampus}
                    title={currentVenue.iframeTitle}
                    src={currentVenue.embedUrl}
                    className="w-full h-60 sm:h-72 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Clean Action Footer Below Map */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span>
                      {currentVenue.district}{' '}
                      <span className="text-slate-400 font-mono text-[11px]">
                        ({currentVenue.gps})
                      </span>
                    </span>
                  </div>

                  <a
                    href={currentVenue.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition-all active:scale-[0.99] ${currentVenue.btnClass}`}
                  >
                    <span>Petunjuk Arah Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Practical Venue Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-slate-100">
                  {currentVenue.highlights.map((h, idx) => {
                    const HIcon = h.icon;
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1"
                      >
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                          <HIcon
                            className={`w-3.5 h-3.5 shrink-0 ${
                              activeCampus === 'sedayu' ? 'text-red-600' : 'text-blue-600'
                            }`}
                          />
                          <span className="truncate">{h.label}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 leading-snug">
                          {h.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
