import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Printer,
  ChevronRight,
  Sparkles,
  Users,
  Building2,
  BadgeCheck,
  Timer,
  CalendarCheck2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { EVENT, VENUE, VENUE_INDUK } from '../../config.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function TimelinePanitiaView() {
  const { settings, currentUser } = useCompetition();
  const [filterDivisi, setFilterDivisi] = useState('all');

  const eventDates = settings?.eventDates || {};

  const timelineSchedule = [
    {
      id: 'sch-1',
      phase: 'Fase Pra-Lomba',
      title: 'Rapat Kerja Perdana & Pembentukan Panitia Pelaksana',
      date: '15 September 2026',
      time: '14.00 – 17.00 WIB',
      venue: VENUE_INDUK.NAME,
      divisi: 'Inti',
      divisiBadge: 'bg-purple-100 text-purple-700 border-purple-200',
      status: 'completed',
      statusLabel: 'Selesai',
      desc: 'Penetapan struktur kepanitiaan, pengesahan RAB, dan finalisasi dokumen juknis & regulasi.',
      pic: 'Ketua Panitia & Sekretaris'
    },
    {
      id: 'sch-2',
      phase: 'Fase Pendaftaran',
      title: 'Pembukaan Pendaftaran Gelombang 1 (Early Bird)',
      date: '5 Oktober 2026',
      time: '00.00 WIB',
      venue: 'Portal Resmi SaaS LBB',
      divisi: 'Sekretariat',
      divisiBadge: 'bg-blue-100 text-blue-700 border-blue-200',
      status: 'completed',
      statusLabel: 'Selesai',
      desc: 'Pembukaan registrasi kontingen SD/MI dan SMP/MTs se-DIY & Jateng dengan kuota 36 peleton.',
      pic: 'Sie Kesekretariatan'
    },
    {
      id: 'sch-3',
      phase: 'Fase Pendaftaran',
      title: 'Batas Akhir Pendaftaran & Penutupan Kuota Peleton',
      date: '1 November 2026',
      time: '23.59 WIB',
      venue: 'Sistem Cloud LBB',
      divisi: 'Sekretariat',
      divisiBadge: 'bg-blue-100 text-blue-700 border-blue-200',
      status: 'completed',
      statusLabel: 'Selesai',
      desc: 'Penguncian registrasi peserta baru, rekapitulasi data pendaftar dan konfirmasi bukti bayar.',
      pic: 'Sie Pendaftaran & IT'
    },
    {
      id: 'sch-4',
      phase: 'Fase Verifikasi',
      title: 'Verifikasi Berkas Dokumen & Kelayakan Personel',
      date: '2 – 8 November 2026',
      time: '08.00 – 16.00 WIB',
      venue: 'Sekretariat Panitia Kampus Induk',
      divisi: 'Verifikasi',
      divisiBadge: 'bg-teal-100 text-teal-700 border-teal-200',
      status: 'completed',
      statusLabel: 'Selesai',
      desc: 'Pengecekan keabsahan NISN, Surat Tugas Kepala Sekolah, Pas Foto, dan Pakta Integritas 25 Personel.',
      pic: 'Tim Verifikator Administrasi'
    },
    {
      id: 'sch-5',
      phase: 'Fase Koordinasi',
      title: 'Technical Meeting (TM) & Pengundian Nomor Dada',
      date: eventDates.technicalMeetingFullDate || EVENT.TECHNICAL_MEETING_FULL_DATE,
      time: eventDates.technicalMeetingTime || EVENT.TECHNICAL_MEETING_TIME,
      venue: VENUE_INDUK.NAME,
      divisi: 'Acara',
      divisiBadge: 'bg-amber-100 text-amber-700 border-amber-200',
      status: 'upcoming',
      statusLabel: 'Mendatang',
      desc: 'Penjelasan detail juknis, tata tertib, denah arena, dan pengocokan nomor undian tampil resmi.',
      pic: 'Sie Acara & Ketua Dewan Juri'
    },
    {
      id: 'sch-6',
      phase: 'Fase Gladi & Uji Coba',
      title: 'Uji Coba Lapangan & Adaptasi Medan Perlombaan',
      date: eventDates.fieldTrialFullDate || EVENT.FIELD_TRIAL_FULL_DATE,
      time: eventDates.fieldTrialTime || EVENT.FIELD_TRIAL_TIME_RANGE,
      venue: VENUE.NAME,
      divisi: 'Lapangan',
      divisiBadge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      status: 'upcoming',
      statusLabel: 'Mendatang',
      desc: 'Uji coba medan lapangan mini soccer, penyesuaian akustik aba-aba danton, dan durasi transisi.',
      pic: 'Sie Operasional & Koordinator Lapangan'
    },
    {
      id: 'sch-7',
      phase: 'Fase Gladi Bersih',
      title: 'Sterilisasi Venue, Pemasangan Rigging & Briefing Panitia',
      date: 'Jumat, 23 Januari 2027',
      time: '13.00 – 21.00 WIB',
      venue: VENUE.NAME,
      divisi: 'Operasional',
      divisiBadge: 'bg-slate-100 text-slate-700 border-slate-200',
      status: 'upcoming',
      statusLabel: 'Mendatang',
      desc: 'Pemasangan tenda transit DP 1-3, batas arena juri, penyiapan barak basecamp, dan gladi pembukaan.',
      pic: 'Seluruh Divisi Panitia Pelaksana'
    },
    {
      id: 'sch-8',
      phase: 'Hari Pelaksanaan (Hari-H)',
      title: 'Hari-H Lomba Baris Berbaris (LBB) Mu’allimin 2027',
      date: eventDates.competitionDate || EVENT.COMPETITION_DATE,
      time: eventDates.competitionTimeRange || EVENT.COMPETITION_TIME_RANGE,
      venue: `${VENUE.NAME} (${VENUE.SHORT_ADDRESS})`,
      divisi: 'Seluruh Panitia',
      divisiBadge: 'bg-red-100 text-red-700 border-red-200',
      status: 'critical',
      statusLabel: 'Hari-H Utama',
      desc: 'Check-in regu, apel pembukaan militer, kompetisi 36 peleton, penilaian 3 juri, rekap skor, hingga awarding.',
      pic: 'Ketua Panitia & Dewan Juri'
    },
    {
      id: 'sch-9',
      phase: 'Fase Pasca-Lomba',
      title: 'Penerbitan E-Sertifikat, Berita Acara & Evaluasi Akhir',
      date: '25 – 31 Januari 2027',
      time: 'Fleksibel',
      venue: 'Sistem Digital & Kampus Induk',
      divisi: 'Evaluasi',
      divisiBadge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      status: 'upcoming',
      statusLabel: 'Pasca Lomba',
      desc: 'Distribusi e-sertifikat peserta & official, pengarsipan berita acara nilai juri, dan laporan pertanggungjawaban (LPJ).',
      pic: 'Ketua, Sekretaris, & Bendahara'
    }
  ];

  const filteredTimeline = filterDivisi === 'all' 
    ? timelineSchedule 
    : timelineSchedule.filter(item => item.divisi.toLowerCase().includes(filterDivisi.toLowerCase()));

  const handlePrint = () => {
    window.print();
  };

  return (
    <SimpaskorSidebarLayout
      activeMenu="timeline"
      title="Timeline & Agenda Kerja Panitia"
      subtitle="Roadmap kronologis persiapan, operasional lapangan, dan pasca-perlombaan LBB Mu'allimin 2027"
      rightActions={
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Cetak Jadwal Panitia"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak Agenda</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Banner Ringkasan Agenda Panitia */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-red-600/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider">
                <CalendarCheck2 className="w-3.5 h-3.5" />
                <span>Roadmap Resmi Kepanitiaan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Master Timeline & Jadwal Panitia
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Jadwal baku kepanitiaan terpadu mencakup 9 tahapan penting sejak pembentukan panitia hingga pelaporan pasca-kegiatan, mengacu pada SK Kepanitiaan Madrasah Mu'allimin Muhammadiyah Yogyakarta.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-yellow-400">9</div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tahap Utama</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-emerald-400">100%</div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Terstruktur</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Divisi & Tab Navigasi */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-2 px-1">Filter Divisi:</span>
            {[
              { id: 'all', label: 'Semua Agenda' },
              { id: 'inti', label: 'Panitia Inti' },
              { id: 'sekretariat', label: 'Kesekretariatan' },
              { id: 'verifikasi', label: 'Verifikasi' },
              { id: 'acara', label: 'Acara & TM' },
              { id: 'lapangan', label: 'Operasional Lapangan' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterDivisi(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterDivisi === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-medium text-slate-400 px-2">
            Menampilkan <span className="font-bold text-slate-800">{filteredTimeline.length}</span> agenda
          </div>
        </div>

        {/* List Timeline Kronologis */}
        <div className="space-y-4 relative">
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200 hidden sm:block" />

          {filteredTimeline.map((item, index) => {
            const isCompleted = item.status === 'completed';
            const isCritical = item.status === 'critical';

            return (
              <div
                key={item.id}
                className="relative pl-0 sm:pl-16 group transition-all"
              >
                <div className="absolute left-3.5 top-5 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-slate-300 hidden sm:flex items-center justify-center z-10 group-hover:scale-110 transition-transform shadow-xs">
                  {isCompleted ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  ) : isCritical ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  )}
                </div>

                <div
                  className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all hover:shadow-md ${
                    isCritical
                      ? 'border-red-300/80 shadow-xs ring-1 ring-red-500/10'
                      : isCompleted
                      ? 'border-slate-200/80'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          {item.phase}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.divisiBadge}`}>
                          {item.divisi}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Terlaksana</span>
                          </span>
                        )}
                        {isCritical && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-red-600 text-white shadow-xs uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Agenda Utama</span>
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    <div className="text-left sm:text-right shrink-0 bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border sm:border-0 border-slate-100">
                      <div className="text-sm font-black text-slate-900">{item.date}</div>
                      <div className="text-xs font-semibold text-slate-500 flex items-center sm:justify-end gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {item.desc}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium truncate max-w-xs">{item.venue}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-bold text-slate-700">PIC: {item.pic}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SimpaskorSidebarLayout>
  );
}
