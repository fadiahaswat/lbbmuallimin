import React from 'react';
import { Tag, Timer, Home, Calendar, MapPin, ExternalLink, Navigation, FileText, HelpCircle, Phone } from 'lucide-react';
import { EVENT, VENUE } from '../../../../config.js';

export default function OverviewTab({
  currentTeam,
  scheduleTab,
  setScheduleTab,
  tmDate,
  tmTime,
  trialDate,
  trialTime,
  compDate,
  compTime,
  setActiveTab
}) {
  return (
    <div className="space-y-6">
      {/* 3 Box Sorotan Status Tampil Peleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: No. Dada */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-emerald-300 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Tag className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
              Nomor Dada Lapangan
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {currentTeam.chestNumber || '-'}
              </span>
              <span className="text-[11px] text-slate-500 truncate">
                {currentTeam.chestNumber ? 'Terpasang di seragam' : 'Diambil saat TM'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Jam Estimasi Tampil */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-blue-300 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Timer className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 block">
              Jam Estimasi Tampil
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {currentTeam.estimatedTime ? `${currentTeam.estimatedTime} WIB` : (currentTeam.lotNumber ? `Urutan #${String(currentTeam.lotNumber).padStart(2, '0')}` : '-')}
              </span>
              <span className="text-[11px] text-slate-500 truncate">
                {currentTeam.estimatedTime ? 'Arena Utama' : (currentTeam.lotNumber ? 'Sesuai undian TM' : 'Belum TM')}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Nomor Basecamp */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-amber-300 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Home className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
              Ruang Basecamp Kontingen
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {currentTeam.basecampNumber ? `Ruang ${currentTeam.basecampNumber}` : '-'}
              </span>
              <span className="text-[11px] text-slate-500 truncate">
                {currentTeam.basecampNumber ? 'Ruang transit tim' : 'Diumumkan saat TM'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 2 Kolom: Kiri Agenda & Maps Tab, Kanan Status Berkas & Kontak */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri (2 Span): Agenda Pelaksanaan Interaktif */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h4 className="font-black text-lg text-slate-900 uppercase italic flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-700" />
                <span>Agenda Wajib Kontingen & Peta Lokasi</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih agenda untuk melihat jadwal detail, alamat resmi, dan rute navigasi Google Maps.
              </p>
            </div>

            {/* Switcher Tab Agenda: TM vs Hari-H */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setScheduleTab('tm')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  scheduleTab === 'tm'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>1. TM</span>
              </button>
              <button
                type="button"
                onClick={() => setScheduleTab('trial')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  scheduleTab === 'trial'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>2. Uji Coba Lapangan</span>
              </button>
              <button
                type="button"
                onClick={() => setScheduleTab('competition')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  scheduleTab === 'competition'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>3. Hari-H Lomba</span>
              </button>
            </div>
          </div>

          {/* Konten Agenda Tab 1: TECHNICAL MEETING */}
          {scheduleTab === 'tm' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider block">
                    {tmDate} • {tmTime}
                  </span>
                  <h5 className="font-black text-base text-slate-900">
                    Technical Meeting & Validasi Fisik Berkas
                  </h5>
                  <p className="text-xs text-slate-600">
                    Wajib dihadiri 1 Pembina dan 1 Danton. Agenda pengambilan nomor dada & pengundian nomor urut tampil peleton.
                  </p>
                </div>
                <a
                  href={EVENT.TECHNICAL_MEETING_MAPS_URL || "https://www.google.com/maps/dir/?api=1&destination=Madrasah+Mu'allimin+Muhammadiyah+Yogyakarta+Jl.+Letjen+S.+Parman+No.+68+Wirobrajan"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  <Navigation className="w-4 h-4 fill-current" />
                  <span>Buka Rute Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                </a>
              </div>

              {/* Detail Alamat Tempat TM */}
              <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <MapPin className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">
                    {EVENT.TECHNICAL_MEETING_VENUE_NAME || "Kampus Induk Madrasah Mu'allimin Muhammadiyah Yogyakarta"}
                  </span>
                  <span className="text-slate-600 text-[11px] block mt-0.5">
                    Jalan Letjen S. Parman NO. 68, Wirobrajan, Kota Yogyakarta, Daerah Istimewa Yogyakarta
                  </span>
                </div>
              </div>

              {/* Preview Peta Google Maps Interaktif TM */}
              <div className="rounded-2xl overflow-hidden border border-purple-200 bg-slate-100 shadow-inner relative group">
                <iframe
                  title="Peta Lokasi Technical Meeting"
                  src="https://maps.google.com/maps?q=Madrasah+Mu'allimin+Muhammadiyah+Yogyakarta+Jl.+Letjen+S.+Parman+No.+68&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-64 border-0 block"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={EVENT.TECHNICAL_MEETING_MAPS_URL || "https://www.google.com/maps/dir/?api=1&destination=Madrasah+Mu'allimin+Muhammadiyah+Yogyakarta+Jl.+Letjen+S.+Parman+No.+68+Wirobrajan"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg backdrop-blur-xs flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <Navigation className="w-3.5 h-3.5 text-purple-400 fill-current" />
                  <span>Mulai Navigasi Rute</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          )}

          {/* Konten Agenda Tab 2: UJI COBA LAPANGAN */}
          {scheduleTab === 'trial' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">
                    {trialDate} • {trialTime}
                  </span>
                  <h5 className="font-black text-base text-slate-900">
                    Uji Coba Lapangan & Orientasi Arena
                  </h5>
                  <p className="text-xs text-slate-600">
                    Pengenalan pos arena perlombaan, pos DP 1, DP 2, dan area steril demi kesiapan teknis peleton.
                  </p>
                </div>
                <a
                  href={VENUE.MAPS_URL || "https://maps.app.goo.gl/fVMgg5xZcwRQ4kN78"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  <Navigation className="w-4 h-4 fill-current" />
                  <span>Buka Lokasi</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                </a>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">
                    Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta
                  </span>
                  <span className="text-slate-600 text-[11px] block mt-0.5">
                    Dusun Bandut Lor, Argorejo, Kec. Sedayu, Kabupaten Bantul, Daerah Istimewa Yogyakarta
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Konten Agenda Tab 3: HARI-H LOMBA */}
          {scheduleTab === 'competition' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-red-700 uppercase tracking-wider block">
                    {compDate} • {compTime}
                  </span>
                  <h5 className="font-black text-base text-slate-900">
                    Hari-H Pelaksanaan LBB Mu'allimin 2026
                  </h5>
                  <p className="text-xs text-slate-600">
                    Daftar ulang mulai 06.00 WIB, dilanjutkan upacara pembukaan, dan perlombaan di lapangan utama.
                  </p>
                </div>
                <a
                  href={VENUE.MAPS_URL || "https://maps.app.goo.gl/fVMgg5xZcwRQ4kN78"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  <Navigation className="w-4 h-4 fill-current" />
                  <span>Buka Rute Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                </a>
              </div>

              {/* Detail Alamat Tempat Lomba */}
              <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">
                    Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta
                  </span>
                  <span className="text-slate-600 text-[11px] block mt-0.5">
                    Dusun Bandut Lor, Argorejo, Kec. Sedayu, Kabupaten Bantul, Daerah Istimewa Yogyakarta
                  </span>
                </div>
              </div>

              {/* Preview Peta Google Maps Interaktif Hari-H */}
              <div className="rounded-2xl overflow-hidden border border-red-200 bg-slate-100 shadow-inner relative group">
                <iframe
                  title="Peta Lokasi Lomba Hari-H"
                  src="https://maps.google.com/maps?q=Madrasah+Mu'allimin+Muhammadiyah+Yogyakarta+Kampus+Terpadu+Sedayu&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-64 border-0 block"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={VENUE.MAPS_URL || "https://maps.app.goo.gl/fVMgg5xZcwRQ4kN78"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg backdrop-blur-xs flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <Navigation className="w-3.5 h-3.5 text-red-400 fill-current" />
                  <span>Mulai Navigasi Rute</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Kolom Kanan (1 Span): Ringkasan Berkas & Bantuan Panitia */}
        <div className="space-y-6">
          {/* Ringkasan Cepat Persyaratan Peleton */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="font-black text-sm uppercase text-slate-900">Kelengkapan Peleton</h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('roster')}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800"
              >
                Kelola →
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Komandan (Danton):</span>
                <span className="font-bold text-slate-900">
                  {currentTeam.dantonName || currentTeam.roster?.danton?.name || '-'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Pasukan Inti (21):</span>
                <span className={`font-bold font-mono px-2 py-0.5 rounded ${
                  (currentTeam.roster?.pasukan?.length || 0) >= 21 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {currentTeam.roster?.pasukan?.length || 0}/21 Personel
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Cadangan (Opsional):</span>
                <span className="font-bold font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {currentTeam.roster?.cadangan?.length || 0}/3 Personel
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Surat Rekomendasi:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  currentTeam.files?.recommendationLetter?.url && currentTeam.files?.recommendationLetter?.url !== '#'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {currentTeam.files?.recommendationLetter?.url && currentTeam.files?.recommendationLetter?.url !== '#'
                    ? 'Sudah Diunggah'
                    : 'Belum Diunggah'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('roster')}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all text-center"
              >
                Isi 25 Personel
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('documents')}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all text-center"
              >
                Unggah Surat
              </button>
            </div>
          </div>

          {/* Bantuan Panitia */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-yellow-400">
              <HelpCircle className="w-5 h-5" />
              <h4 className="font-black text-sm uppercase tracking-wider">Bantuan Panitia</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Jika terdapat kendala pengunggahan berkas atau revisi nama personel, silakan hubungi narahubung resmi sekretariat:
            </p>
            <a
              href="https://wa.me/6281230093737"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all w-full justify-center uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-98"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp Kak Rusyda</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
