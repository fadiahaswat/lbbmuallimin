import React, { useState } from 'react';
import { Tag, Timer, Home, Calendar, MapPin, ExternalLink, Navigation, FileText, HelpCircle, Phone, ClipboardCheck, CheckCircle2, ChevronRight, Sparkles, Bus, Car, Bike, Check, Clock, AlertCircle, Shield, Printer, Download, Loader2, BookOpen } from 'lucide-react';
import { EVENT, VENUE, DOWNLOADS } from '../../../../config.js';
import { HARI_H_SCHEDULE, UJI_COBA_SCHEDULE } from '../../../../data/scheduleMatrices.js';
import { calculateDynamicTrialSchedule } from '../../../../context/competitionHelpers.js';
import BasecampCheckoutTracker from '../components/BasecampCheckoutTracker.jsx';

export default function OverviewTab({
  currentTeam,
  allTeams = [],
  scheduleTab,
  setScheduleTab,
  tmDate,
  tmTime,
  trialDate,
  trialTime,
  compDate,
  compTime,
  setActiveTab,
  updateTeamVehicleSurvey,
  stagingInfo,
  onOpenPactModal,
  isDownloadingPact
}) {
  const allPasukan = Array.isArray(currentTeam.roster?.pasukan) ? currentTeam.roster.pasukan : [];
  const allCadangan = Array.isArray(currentTeam.roster?.cadangan) ? currentTeam.roster.cadangan : [];

  const filledPasukan = allPasukan.filter(p => p?.name && p.name !== '-' && p.name.trim() !== '').length;
  const filledCadangan = allCadangan.filter(c => c?.name && c.name !== '-' && c.name.trim() !== '').length;

  // Lookup jadwal hari-H berdasarkan nomor undian (lotNumber)
  const lotIdx = currentTeam.lotNumber ? parseInt(currentTeam.lotNumber, 10) - 1 : -1;
  const jKey = String(currentTeam.jenjang || '').toUpperCase().includes('SD') ? 'SD' : 'SMP';
  const autoSchedule = (lotIdx >= 0 && HARI_H_SCHEDULE[jKey]?.[lotIdx]) ? HARI_H_SCHEDULE[jKey][lotIdx] : null;

  // Kalkulasi jadwal dinamis Uji Coba Lapangan (UCL) dengan perapatan slot jika ada yang berhalangan
  const dynamicTrialMap = React.useMemo(() => {
    const teamsList = (allTeams && allTeams.length > 0) ? allTeams : [currentTeam];
    return calculateDynamicTrialSchedule(teamsList, UJI_COBA_SCHEDULE);
  }, [allTeams, currentTeam]);

  const teamDynamicTrial = dynamicTrialMap[currentTeam.id];
  const autoTrialSchedule = teamDynamicTrial?.schedule || (lotIdx >= 0 ? UJI_COBA_SCHEDULE[jKey]?.[lotIdx] : null);

  const displayEstimatedTime = currentTeam.estimatedTime || autoSchedule?.startTampil || (currentTeam.lotNumber ? `#${String(currentTeam.lotNumber).padStart(2, '0')}` : null);
  const displayBasecamp = currentTeam.basecampNumber || (currentTeam.lotNumber ? `Ruang ${String(currentTeam.lotNumber).padStart(2, '0')}` : null);
  
  // Format jam spesifik Uji Coba Lapangan (UCL) dari matriks resmi (dinamis sesuai slot yang terisi)
  const trialArenaTime = autoTrialSchedule?.enterArena && autoTrialSchedule?.finishArena 
    ? `${autoTrialSchedule.enterArena.replace(' WIB', '')} - ${autoTrialSchedule.finishArena.replace(' WIB', '')}`
    : autoTrialSchedule?.enterArena || null;
  const displayTrialTime = currentTeam.vehicleSurveys?.trialAttendance?.status === 'declined'
    ? 'Berhalangan'
    : (currentTeam.trialSpecificTime || trialArenaTime || (currentTeam.lotNumber ? '16 Jan 2027' : null));

  const [surveySaveToast, setSurveySaveToast] = useState('');

  // Helper untuk menyimpan survei kesediaan hadir UCL
  const handleConfirmTrialAttendance = (isAttending) => {
    if (!updateTeamVehicleSurvey) return;
    updateTeamVehicleSurvey(currentTeam.id, 'trialAttendance', {
      status: isAttending ? 'confirmed' : 'declined',
      confirmedAt: new Date().toISOString()
    });
    setSurveySaveToast(isAttending ? '✓ Kesediaan hadir Uji Coba Lapangan berhasil dikonfirmasi!' : 'Konfirmasi ketidakhadiran Uji Coba Lapangan telah dicatat.');
    setTimeout(() => setSurveySaveToast(''), 3500);
  };

  // Helper untuk update jumlah kendaraan spesifik (motor, mobil, elf, bus)
  const handleUpdateVehicleCount = (agendaKey, vehicleKey, delta) => {
    if (!updateTeamVehicleSurvey) return;
    const currentCounts = currentTeam.vehicleSurveys?.[agendaKey]?.counts || {};
    const curVal = currentCounts[vehicleKey] || 0;
    const nextVal = Math.max(0, curVal + delta);
    
    const updatedCounts = {
      ...currentCounts,
      [vehicleKey]: nextVal
    };

    updateTeamVehicleSurvey(currentTeam.id, agendaKey, {
      counts: updatedCounts
    });
    setSurveySaveToast(`Jumlah armada diperbarui!`);
    setTimeout(() => setSurveySaveToast(''), 2500);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 4 Box Sorotan Status Tampil Peleton: Rapi 2 kolom di mobile dan 4 kolom di desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {/* Card 1: No. Dada */}
        <div className="bg-white p-2.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-4 hover:border-slate-300 transition-colors">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Tag className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 w-full">
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-800 block truncate">
              Nomor Dada
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 mt-0.5">
              <span className="text-base sm:text-2xl font-black text-slate-900 font-mono leading-none sm:leading-normal">
                {currentTeam.chestNumber || '-'}
              </span>
              <span className="text-[9px] sm:text-[11px] text-slate-500 truncate mt-0.5 sm:mt-0">
                {currentTeam.chestNumber ? 'Seragam' : 'Saat TM'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Jadwal Uji Coba Lapangan (UCL) Jam Spesifik (Sabtu, 16 Jan 2027) */}
        <div className="bg-white p-2.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-4 hover:border-slate-300 transition-colors">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 w-full">
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-purple-800 block truncate">
              Uji Coba (UCL)
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 mt-0.5">
              <span className="text-xs sm:text-xl font-black text-slate-900 font-mono leading-tight sm:leading-normal truncate">
                {displayTrialTime || '-'}
              </span>
              <span className="text-[9px] sm:text-[11px] text-slate-500 truncate mt-0.5 sm:mt-0">
                {displayTrialTime ? '16 Jan (Sedayu)' : 'Saat TM'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Jam Estimasi Tampil Hari-H (Ahad, 24 Jan 2027) */}
        <div className="bg-white p-2.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-4 hover:border-slate-300 transition-colors">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Timer className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 w-full">
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-blue-800 block truncate">
              Est. Tampil (Hari-H)
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 mt-0.5">
              <span className="text-xs sm:text-2xl font-black text-slate-900 font-mono leading-tight sm:leading-normal truncate">
                {displayEstimatedTime || '-'}
              </span>
              <span className="text-[9px] sm:text-[11px] text-slate-500 truncate mt-0.5 sm:mt-0">
                {displayEstimatedTime ? (autoSchedule?.arena ? autoSchedule.arena.split(' ')[0] : 'Arena') : 'Belum TM'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Nomor Basecamp */}
        <div className="bg-white p-2.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-4 hover:border-slate-300 transition-colors">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Home className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 w-full">
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-amber-800 block truncate">
              Basecamp
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 mt-0.5">
              <span className="text-xs sm:text-2xl font-black text-slate-900 font-mono leading-tight sm:leading-normal truncate">
                {displayBasecamp || '-'}
              </span>
              <span className="text-[9px] sm:text-[11px] text-slate-500 truncate mt-0.5 sm:mt-0">
                {displayBasecamp ? 'Transit' : 'Saat TM'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 2 Kolom: Kiri Agenda & Maps Tab, Kanan Status Berkas & Kontak */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Kolom Kiri (2 Span): Agenda Pelaksanaan Interaktif */}
        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4 sm:space-y-5">
          <div className="space-y-2.5 sm:space-y-3.5 border-b border-slate-100 pb-3 sm:pb-4">
            <div>
              <h4 className="font-black text-base sm:text-lg text-slate-900 uppercase flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-red-700" />
                <span>Agenda Wajib Kontingen & Peta</span>
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Pilih agenda untuk melihat jadwal detail dan navigasi Google Maps.
              </p>
            </div>

            {/* Switcher Tab Agenda di bawah judul - Full Width Flex */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl sm:rounded-2xl border border-slate-200 w-full">
              <button
                type="button"
                onClick={() => setScheduleTab('tm')}
                className={`flex-1 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center ${
                  scheduleTab === 'tm'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>1. TM</span>
              </button>
              <button
                type="button"
                onClick={() => setScheduleTab('trial')}
                className={`flex-1 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight ${
                  scheduleTab === 'trial'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>2. Uji Coba</span>
              </button>
              <button
                type="button"
                onClick={() => setScheduleTab('competition')}
                className={`flex-1 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-tight ${
                  scheduleTab === 'competition'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>3. Hari-H</span>
              </button>
            </div>
          </div>

          {/* Konten Agenda Tab 1: TECHNICAL MEETING */}
          {scheduleTab === 'tm' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black text-purple-700 bg-purple-200/70 px-2 py-0.5 rounded uppercase tracking-wider">
                      Sabtu, 9 Januari 2027
                    </span>
                    <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                      13.00 WIB s.d. Selesai
                    </span>
                  </div>
                  <h5 className="font-black text-base text-slate-900 mt-1">
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

              {/* Status Hasil Undian TM untuk Tim Ini */}
              <div className="p-3.5 rounded-2xl bg-slate-900 text-white border border-purple-500/30 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center font-black text-purple-300 text-sm">
                    {currentTeam.lotNumber ? `#${String(currentTeam.lotNumber).padStart(2, '0')}` : '?'}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Hasil Undian Nomor Urut Tampil Peleton
                    </span>
                    <strong className="text-xs sm:text-sm text-white">
                      {currentTeam.lotNumber ? `Urutan #${String(currentTeam.lotNumber).padStart(2, '0')} (Tingkat ${currentTeam.jenjang})` : 'Belum Melakukan Undian TM'}
                    </strong>
                  </div>
                </div>
                {currentTeam.chestNumber && (
                  <span className="font-mono text-xs font-black bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg shadow-sm">
                    No. Dada: {currentTeam.chestNumber}
                  </span>
                )}
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

              {/* Box Cetak Pakta Integritas Bermaterai Rp 10.000 untuk TM - Clean & Elegan */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-wider">
                    <Shield className="w-4 h-4 text-red-600" />
                    <span>Pakta Integritas Bermaterai (Wajib TM)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed max-w-lg">
                    Official wajib membawa lembar fisik Pakta Integritas bertanda tangan basah dan bermaterai <strong>Rp 10.000,-</strong> saat registrasi TM di Kampus Induk Mu'allimin Wirobrajan.
                  </p>
                </div>
                {onOpenPactModal && (
                  <button
                    type="button"
                    onClick={onOpenPactModal}
                    disabled={isDownloadingPact}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs shrink-0 cursor-pointer active:scale-95"
                  >
                    {isDownloadingPact ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengunduh...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh PDF Pakta</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Survei Kendaraan TM - Kuantitas Terpisah (Motor, Mobil Pribadi, Elf) */}
              <div className="p-4 rounded-2xl bg-white border border-purple-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-purple-950 flex items-center gap-2">
                    <Car className="w-4 h-4 text-purple-600" />
                    <span>Estimasi Kendaraan Hadir TM (Sabtu, 9 Jan 2027)</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    Bisa lebih dari 1 kendaraan
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Tentukan estimasi jumlah unit kendaraan yang akan dibawa perwakilan kontingen (Pembina, Pelatih, & Danton) untuk alokasi slot parkir Kampus Induk:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { key: 'motor', label: 'Sepeda Motor', icon: Bike, desc: 'Roda Dua (Parkir Motor)' },
                    { key: 'mobil', label: 'Mobil Pribadi', icon: Car, desc: 'Sedan / MPV / SUV (Parkir Mobil)' },
                  ].map(v => {
                    const count = currentTeam.vehicleSurveys?.tm?.counts?.[v.key] || 0;
                    const VIcon = v.icon;
                    return (
                      <div
                        key={v.key}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                          count > 0 ? 'bg-purple-50/80 border-purple-300 ring-1 ring-purple-200' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${count > 0 ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            <VIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 block truncate">{v.label}</span>
                            <span className="text-[10px] text-slate-500 block">{v.desc}</span>
                          </div>
                        </div>

                        {/* Counter Plus-Minus */}
                        <div className="flex items-center gap-1.5 shrink-0 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleUpdateVehicleCount('tm', v.key, -1)}
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer active:scale-90"
                            title="Kurang"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-mono font-bold text-xs text-slate-900">
                            {count}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateVehicleCount('tm', v.key, 1)}
                            className="w-6 h-6 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center justify-center transition-all cursor-pointer active:scale-90"
                            title="Tambah"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Preview Peta Google Maps Interaktif TM */}
              <div className="rounded-2xl overflow-hidden border border-purple-200 bg-slate-100 shadow-inner relative group">
                <iframe
                  title="Peta Lokasi Technical Meeting"
                  src="https://maps.google.com/maps?q=Madrasah+Mu'allimin+Muhammadiyah+Yogyakarta+Jl.+Letjen+S.+Parman+No.+68&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-56 sm:h-64 border-0 block"
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

          {/* Konten Agenda Tab 2: UJI COBA LAPANGAN (UCL) */}
          {scheduleTab === 'trial' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded uppercase tracking-wider">
                      Sabtu, 16 Januari 2027
                    </span>
                    <span className="text-[10px] font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded">
                      08.00 WIB s.d. 13.30 WIB
                    </span>
                  </div>
                  <h5 className="font-black text-base text-slate-900 mt-1">
                    Uji Coba Lapangan (UCL) & Orientasi Arena
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

              {/* KONFIRMASI KESEDIAAN HADIR UCL */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    Konfirmasi Kehadiran Uji Coba Lapangan
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                    currentTeam.vehicleSurveys?.trialAttendance?.status === 'confirmed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : currentTeam.vehicleSurveys?.trialAttendance?.status === 'declined'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {currentTeam.vehicleSurveys?.trialAttendance?.status === 'confirmed'
                      ? 'Hadir'
                      : currentTeam.vehicleSurveys?.trialAttendance?.status === 'declined'
                      ? 'Tidak Hadir'
                      : 'Belum Konfirmasi'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Batas konfirmasi kehadiran paling lambat <strong>Ahad, 10 Januari 2027 pukul 23.59 WIB (H+1 TM)</strong>. Slot peleton yang tidak hadir akan dimajukan untuk efisiensi waktu.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleConfirmTrialAttendance(true)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      currentTeam.vehicleSurveys?.trialAttendance?.status === 'confirmed'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    Hadir
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmTrialAttendance(false)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      currentTeam.vehicleSurveys?.trialAttendance?.status === 'declined'
                        ? 'bg-rose-700 text-white'
                        : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    Tidak Hadir
                  </button>
                </div>
              </div>

              {/* JIKA TIDAK HADIR */}
              {currentTeam.vehicleSurveys?.trialAttendance?.status === 'declined' && (
                <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700">
                  Peleton tercatat tidak hadir pada Uji Coba Lapangan. Slot dialihkan ke peleton berikutnya.
                </div>
              )}

              {/* JADWAL UCL & SURVEI KENDARAAN */}
              {currentTeam.vehicleSurveys?.trialAttendance?.status === 'confirmed' && (
                <div className="space-y-4">
                  {/* Rincian Waktu Uji Coba */}
                  <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">Jadwal Uji Coba Lapangan</span>
                        {teamDynamicTrial?.isAdvanced && (
                          <span className="text-[10px] text-amber-300 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.5 rounded font-mono">
                            Urutan Ke-{teamDynamicTrial.slotIndex + 1}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {autoTrialSchedule?.session || '-'}
                      </span>
                    </div>

                    {autoTrialSchedule ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                          <span className="text-[10px] text-slate-400 block">Tiba Kampus</span>
                          <span className="text-sm text-white font-mono font-bold mt-0.5 block">{autoTrialSchedule.arrival}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                          <span className="text-[10px] text-slate-400 block">Panggilan DP</span>
                          <span className="text-sm text-white font-mono font-bold mt-0.5 block">{autoTrialSchedule.callDP}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                          <span className="text-[10px] text-slate-400 block">Masuk Arena</span>
                          <span className="text-sm text-amber-300 font-mono font-bold mt-0.5 block">{autoTrialSchedule.enterArena}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                          <span className="text-[10px] text-slate-400 block">Durasi Arena</span>
                          <span className="text-sm text-white font-mono font-bold mt-0.5 block">{autoTrialSchedule.allocation}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 text-center text-xs text-slate-400">
                        Jadwal resmi akan tampil setelah nomor undian TM ditetapkan.
                      </div>
                    )}
                  </div>

                  {/* Survei Kuantitas Kendaraan Uji Coba Lapangan (Motor, Mobil, Elf, Bus) */}
                  <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-emerald-950 flex items-center gap-2">
                        <Bus className="w-4 h-4 text-emerald-600" />
                        <span>Langkah 2: Survei Kuantitas Armada UCL (Sabtu, 16 Jan 2027)</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        Bisa kombinasi armada
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Masukkan rincian jumlah kendaraan kontingen menuju Kampus Terpadu Sedayu untuk penataan jalur drop-off personel & kapasitas parkir:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { key: 'motor', label: 'Sepeda Motor', icon: Bike, desc: 'Armada official / suporter' },
                        { key: 'mobil', label: 'Mobil Pribadi', icon: Car, desc: 'Sedan / Avanza / Innova' },
                        { key: 'elf', label: 'Minibus / Elf / HiAce', icon: Bus, desc: 'Kapasitas 12-19 kursi' },
                        { key: 'bus', label: 'Big / Medium Bus', icon: Bus, desc: 'Bus pariwisata kontingen' },
                      ].map(v => {
                        const count = currentTeam.vehicleSurveys?.trial?.counts?.[v.key] || 0;
                        const VIcon = v.icon;
                        return (
                          <div
                            key={v.key}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                              count > 0 ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-200' : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${count > 0 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                <VIcon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-slate-900 block truncate">{v.label}</span>
                                <span className="text-[10px] text-slate-500 block">{v.desc}</span>
                              </div>
                            </div>

                            {/* Counter Plus-Minus */}
                            <div className="flex items-center gap-1.5 shrink-0 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleUpdateVehicleCount('trial', v.key, -1)}
                                className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer active:scale-90"
                              >
                                -
                              </button>
                              <span className="w-6 text-center font-mono font-bold text-xs text-slate-900">
                                {count}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateVehicleCount('trial', v.key, 1)}
                                className="w-6 h-6 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center transition-all cursor-pointer active:scale-90"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Detail Alamat Tempat UCL */}
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black text-red-800 bg-red-200/70 px-2 py-0.5 rounded uppercase tracking-wider">
                      Ahad, 24 Januari 2027
                    </span>
                    <span className="text-[10px] font-bold text-red-950 bg-red-100 px-2 py-0.5 rounded">
                      06.00 WIB s.d. 17.00 WIB
                    </span>
                  </div>
                  <h5 className="font-black text-base text-slate-900 mt-1">
                    Hari-H Pelaksanaan LBB Mu'allimin 2027
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

              {/* Rincian Alur Waktu Tampil Hari-H Peleton Ini - Clean & Modern */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Rundown Alur Tampil Peleton (Hari-H)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentTeam.chestNumber && (
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded">
                        No. Dada: {currentTeam.chestNumber}
                      </span>
                    )}
                    <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                      {autoSchedule?.arena || (currentTeam.jenjang === 'SD' ? 'Arena 1 (Basket)' : 'Arena 2 (Embung)')}
                    </span>
                  </div>
                </div>

                {autoSchedule ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 block font-medium">Standby Basecamp</span>
                      <strong className="text-xs sm:text-sm text-slate-900 font-mono font-bold">{autoSchedule.readyBasecamp}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 block font-medium">Pemeriksaan DP 1</span>
                      <strong className="text-xs sm:text-sm text-blue-700 font-mono font-bold">{autoSchedule.checkDP1}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 block font-medium">Masuk Arena</span>
                      <strong className="text-xs sm:text-sm text-emerald-700 font-mono font-bold">{autoSchedule.enterArena}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 block font-medium">Selesai / Keluar</span>
                      <strong className="text-xs sm:text-sm text-rose-700 font-mono font-bold">{autoSchedule.exitArena}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 text-center text-xs text-slate-500">
                    {currentTeam.lotNumber
                      ? `Urutan Tampil #${String(currentTeam.lotNumber).padStart(2, '0')}. Jadwal alur DP1, DP2, dan arena tampil telah dipetakan.`
                      : 'Jadwal detail menit-ke-menit akan diumumkan otomatis setelah sesi undian nomor tampil pada Technical Meeting.'}
                  </div>
                )}
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

              {/* Survei Kuantitas Kendaraan Hari-H (Motor, Mobil, Elf, Bus) */}
              <div className="p-4 rounded-2xl bg-white border border-red-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-red-950 flex items-center gap-2">
                    <Bus className="w-4 h-4 text-red-600" />
                    <span>Survei Jumlah Kendaraan Kontingen Hari-H (Ahad, 24 Jan 2027)</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    Tentukan jumlah unit
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Konfirmasikan kuantitas unit kendaraan yang dibawa kontingen pada Hari-H untuk penerbitan stiker parkir resmi pos keamanan:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { key: 'motor', label: 'Sepeda Motor', icon: Bike, desc: 'Suporter & Official' },
                    { key: 'mobil', label: 'Mobil Pribadi', icon: Car, desc: 'Kendaraan guru & pendamping' },
                    { key: 'elf', label: 'Minibus / Elf / HiAce', icon: Bus, desc: 'Elf kontingen (12-19 seat)' },
                    { key: 'bus', label: 'Big / Medium Bus', icon: Bus, desc: 'Bus besar rombongan (30-50+ seat)' },
                  ].map(v => {
                    const count = currentTeam.vehicleSurveys?.competition?.counts?.[v.key] || 0;
                    const VIcon = v.icon;
                    return (
                      <div
                        key={v.key}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                          count > 0 ? 'bg-red-50/80 border-red-300 ring-1 ring-red-200' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${count > 0 ? 'bg-red-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            <VIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 block truncate">{v.label}</span>
                            <span className="text-[10px] text-slate-500 block">{v.desc}</span>
                          </div>
                        </div>

                        {/* Counter Plus-Minus */}
                        <div className="flex items-center gap-1.5 shrink-0 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleUpdateVehicleCount('competition', v.key, -1)}
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer active:scale-90"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-mono font-bold text-xs text-slate-900">
                            {count}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateVehicleCount('competition', v.key, 1)}
                            className="w-6 h-6 rounded-md bg-red-700 hover:bg-red-800 text-white font-black text-xs flex items-center justify-center transition-all cursor-pointer active:scale-90"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Preview Peta Google Maps Interaktif Hari-H */}
              <div className="rounded-2xl overflow-hidden border border-red-200 bg-slate-100 shadow-inner relative group">
                <iframe
                  title="Peta Lokasi Lomba Hari-H"
                  src="https://maps.google.com/maps?q=Madrasah+Mu'allimin+Muhammadiyah+Yogyakarta+Kampus+Terpadu+Sedayu&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-56 sm:h-64 border-0 block"
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
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Kolom Kanan (1 Span): Ringkasan Berkas & Bantuan Panitia */}
        <div className="space-y-6">
          {/* Ringkasan Cepat Persyaratan Peleton */}
          {/* Ringkasan Status Administrasi Peleton - Clean & Professional */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
            {/* Header: Judul & Persentase Sederhana */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Kelengkapan Tim
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">25 Personel & Berkas Persyaratan</p>
              </div>

              {(() => {
                const danton = currentTeam.roster?.danton;
                const dantonName = danton?.name || currentTeam.dantonName || '';
                const hasFullDantonBio = Boolean(dantonName && danton?.nisn && danton?.class);
                const isPasukanDone = filledPasukan >= 21;
                const isDocDone = Boolean(currentTeam.files?.recommendationLetter?.url && currentTeam.files?.recommendationLetter?.url !== '#');
                const score = (hasFullDantonBio ? 30 : dantonName ? 10 : 0) + (isPasukanDone ? 45 : (filledPasukan / 21) * 45) + (isDocDone ? 25 : 0);
                const percent = Math.min(100, Math.round(score));

                return (
                  <span className={`text-xs font-black font-mono px-2 py-0.5 rounded-md ${
                    percent >= 100 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200/60'
                  }`}>
                    {percent}% Lengkap
                  </span>
                );
              })()}
            </div>

            {/* Checklist Items Sederhana & Kompak */}
            <div className="divide-y divide-slate-100 text-xs">
              {/* Danton */}
              {(() => {
                const danton = currentTeam.roster?.danton;
                const dantonName = danton?.name || currentTeam.dantonName || '';
                const hasFullBio = Boolean(dantonName && danton?.nisn && danton?.class);

                return (
                  <div className="py-2.5 flex items-center justify-between gap-2">
                    <span className="text-slate-600 font-medium">Komandan (Danton)</span>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-semibold text-slate-900 truncate max-w-[130px]">
                        {dantonName || '-'}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        hasFullBio 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {hasFullBio ? 'Lengkap' : 'Belum Lengkap'}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Pasukan Inti */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-slate-600 font-medium">Pasukan Inti</span>
                <span className={`font-mono text-xs font-bold ${
                  filledPasukan >= 21 ? 'text-emerald-700' : 'text-slate-700'
                }`}>
                  {filledPasukan} / 21
                </span>
              </div>

              {/* Cadangan */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-slate-600 font-medium">Cadangan</span>
                <span className="font-mono text-xs font-bold text-slate-700">
                  {filledCadangan} / 3
                </span>
              </div>

              {/* Surat Rekomendasi */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-slate-600 font-medium">Surat Rekomendasi</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  currentTeam.files?.recommendationLetter?.url && currentTeam.files?.recommendationLetter?.url !== '#'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {currentTeam.files?.recommendationLetter?.url && currentTeam.files?.recommendationLetter?.url !== '#'
                    ? 'Sudah Diunggah'
                    : 'Belum Diunggah'}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons: Rapih & Proporsional */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('roster')}
                className="py-2 px-3 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold rounded-xl transition-all text-center cursor-pointer shadow-2xs"
              >
                Isi 25 Personel
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('documents')}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 border border-slate-200/80 text-xs font-bold rounded-xl transition-all text-center cursor-pointer"
              >
                Unggah Surat
              </button>
              {onOpenPactModal && (
                <button
                  type="button"
                  onClick={onOpenPactModal}
                  className="col-span-2 py-2 px-3 bg-red-50 hover:bg-red-100/80 active:scale-95 text-red-700 border border-red-200/80 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-red-600" />
                  <span>Cetak Pakta Integritas (TM)</span>
                </button>
              )}
            </div>
          </div>

          {/* Kartu Terpisah: Unduh Petunjuk Teknis (Clean & Elegan) */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-700 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  Petunjuk Teknis (Juknis)
                </h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  Regulasi & materi PBB resmi
                </p>
              </div>
            </div>
            <a
              href={DOWNLOADS?.[0]?.url || "https://drive.google.com/file/d/1wxLlEIRVEzeMi2Qr0OAJCpqoKZXz-4vh/view?usp=sharing"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh</span>
            </a>
          </div>

          {/* Bantuan Panitia dengan Maskot Danton */}
          <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <img
                src="/manganperpunk.png"
                alt="Maskot Komandan Peleton"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter drop-shadow-md shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                  <h4 className="font-black text-xs uppercase tracking-wider">Bantuan Panitia</h4>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 truncate">
                  Siap pandu pengunggahan berkas & teknis tim!
                </p>
              </div>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
              Jika terdapat kendala pengunggahan berkas atau revisi nama personel, silakan hubungi narahubung:
            </p>
            <a
              href="https://wa.me/6281947491505"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] sm:text-xs font-black rounded-xl transition-all w-full justify-center tracking-wider shadow-sm active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Admin (0819-4749-1505)</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
