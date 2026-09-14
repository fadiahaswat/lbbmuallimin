import React, { useState, useRef } from 'react';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Printer,
  FileText,
  Upload,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  MapPin,
  ExternalLink,
  Phone,
  Mail,
  Award,
  ArrowLeft,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { EVENT, VENUE } from '../../config.js';

export default function ParticipantDashboard() {
  const {
    currentTeam,
    updateTeamFiles,
    scores,
    setActiveView,
    openModal,
    logoutTeam
  } = useCompetition();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'roster' | 'documents' | 'scores'
  const [uploadToast, setUploadToast] = useState('');

  const fileInputRef = useRef(null);
  const [currentUploadKey, setCurrentUploadKey] = useState(null);

  if (!currentTeam) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-700 rounded-3xl flex items-center justify-center mb-4 shadow-sm">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 uppercase italic">Belum Ada Sesi Tim</h3>
        <p className="text-slate-500 text-sm max-w-md mt-1 mb-6">
          Silakan lakukan pencarian status pendaftaran atau masuk dengan Kode Registrasi Peleton Anda.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => openModal('statusCheck')}
            className="px-6 py-2.5 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
          >
            Cek Status Pendaftaran
          </button>
          <button
            onClick={() => setActiveView('landing')}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const teamScore = scores[currentTeam.id] || null;

  function triggerFileUpload(key) {
    setCurrentUploadKey(key);
    fileInputRef.current?.click();
  }

  function handleFileSelected(e) {
    const file = e.target.files?.[0];
    if (file && currentUploadKey) {
      const reader = new FileReader();
      reader.onload = uploadEvent => {
        const fileData = {
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          uploadedAt: new Date().toISOString(),
          url: uploadEvent.target?.result || '#',
        };
        updateTeamFiles(currentTeam.id, currentUploadKey, fileData);
        setUploadToast(`Berkas "${file.name}" berhasil diunggah!`);
        setTimeout(() => setUploadToast(''), 4000);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        className="hidden"
        accept="image/*,.pdf,.zip"
      />

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => setActiveView('landing')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Beranda LBB</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Portal Resmi Peserta</span>
            <button
              onClick={logoutTeam}
              className="text-xs font-bold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-colors"
            >
              Ganti Akun Tim
            </button>
          </div>
        </div>

        {/* Toast Notifikasi */}
        {uploadToast && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{uploadToast}</span>
            </div>
          </div>
        )}

        {/* Peringatan Revisi Dokumen jika status === 'revision' */}
        {currentTeam.status === 'revision' && (
          <div className="bg-amber-50 border-2 border-amber-400 p-4 sm:p-5 rounded-2xl shadow-md flex items-start gap-4">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shrink-0 shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                Tindakan Diperlukan
              </span>
              <h4 className="font-black text-slate-900 text-base mt-1">Perbaikan Berkas Administrasi</h4>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                <strong>Catatan Panitia:</strong> "{currentTeam.revisionNote || 'Mohon unggah ulang berkas yang kurang jelas atau belum lengkap.'}"
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setActiveTab('documents')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                >
                  Unggah Perbaikan Berkas Sekarang
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Team Profile Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* School & Platoon Profile */}
            <div className="flex items-center gap-5">
              {/* Logo / Emblem */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 border-2 border-white/20 p-2 flex items-center justify-center overflow-hidden shadow-lg backdrop-blur-md">
                  {currentTeam.files.schoolLogo?.url && currentTeam.files.schoolLogo.url !== '#' ? (
                    <img
                      src={currentTeam.files.schoolLogo.url}
                      alt="Logo Sekolah"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                <button
                  onClick={() => triggerFileUpload('schoolLogo')}
                  className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-yellow-400 text-slate-950 shadow-md hover:bg-yellow-300 transition-all"
                  title="Ubah Logo Sekolah"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-mono font-black text-xs sm:text-sm text-yellow-400 bg-yellow-400/15 px-2.5 py-0.5 rounded-md border border-yellow-400/30">
                    {currentTeam.regCode}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white/10 text-slate-200">
                    Tingkat {currentTeam.jenjang}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white/10 text-slate-200">
                    Kategori {currentTeam.category}
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl font-black uppercase italic tracking-tight text-white">
                  {currentTeam.schoolName}
                </h2>
                <p className="text-sm font-semibold text-yellow-300/90 mt-0.5">
                  {currentTeam.platoonName}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-300" /> Danton: <strong className="text-slate-200">{currentTeam.roster.danton.name}</strong>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-300" /> WA: <strong className="text-slate-200">{currentTeam.waNumber}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Status & Lot Number Cards */}
            <div className="flex flex-wrap md:flex-col items-end gap-3 shrink-0">
              {/* Verification Status */}
              <div>
                {currentTeam.status === 'verified' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Terverifikasi Sah
                  </span>
                )}
                {currentTeam.status === 'pending' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" /> Menunggu Verifikasi
                  </span>
                )}
                {currentTeam.status === 'revision' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-rose-400" /> Perlu Perbaikan
                  </span>
                )}
              </div>

              {/* Lot Number (Nomor Undian Tampil) */}
              <div className="bg-white/10 border border-white/15 rounded-2xl p-3 text-right">
                <span className="text-[10px] font-bold text-slate-300 uppercase block">Nomor Tampil (TM)</span>
                {currentTeam.lotNumber ? (
                  <div className="flex items-baseline justify-end gap-1 mt-0.5">
                    <span className="text-2xl font-black text-yellow-400 font-mono">
                      #{String(currentTeam.lotNumber).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-slate-300">Resmi</span>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 italic block mt-0.5">
                    Menunggu TM (23 Okt)
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white rounded-2xl px-2 py-1.5 shadow-xs overflow-x-auto gap-1">
          {[
            { id: 'overview', label: 'Ringkasan & Jadwal' },
            { id: 'roster', label: 'Susunan 25 Personel' },
            { id: 'documents', label: 'Unggah Berkas & Logo' },
            { id: 'scores', label: 'Hasil Rekap Nilai' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Agenda & Quick Print */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Quick Print Documents Action Box */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-lg text-slate-900 uppercase italic">
                      Dokumen Cetak Resmi Kontingen
                    </h4>
                    <p className="text-xs text-slate-500">
                      Bawa cetakan fisik dokumen ini saat Technical Meeting untuk verifikasi akhir.
                    </p>
                  </div>
                  <Printer className="w-5 h-5 text-slate-400" />
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => window.print()}
                    className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-yellow-400/20 text-yellow-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Printer className="w-4 h-4" />
                    </div>
                    <span className="font-black text-xs text-slate-900 block">Kartu Tanda Peleton</span>
                    <span className="text-[10px] text-slate-500">Cetak ID Card & Barcode</span>
                  </button>

                  <button
                    onClick={() => openModal('docViewer', { docId: 'form-b', team: currentTeam })}
                    className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-black text-xs text-slate-900 block">Formulir B (Biodata)</span>
                    <span className="text-[10px] text-slate-500">25 Personel Terisi Otomatis</span>
                  </button>

                  <button
                    onClick={() => openModal('docViewer', { docId: 'form-c', team: currentTeam })}
                    className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-black text-xs text-slate-900 block">Formulir C (Pernyataan)</span>
                    <span className="text-[10px] text-slate-500">Integritas Siap Cap Basah</span>
                  </button>
                </div>
              </div>

              {/* Agenda Pelaksanaan Timeline */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-black text-lg text-slate-900 uppercase italic">
                  Jadwal Wajib Kontingen
                </h4>

                <div className="space-y-3">
                  <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                    <div className="p-2 bg-purple-600 text-white rounded-xl shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider">
                        {EVENT.TECHNICAL_MEETING_DATE} • {EVENT.TECHNICAL_MEETING_TIME}
                      </span>
                      <h5 className="font-black text-sm text-slate-900 mt-0.5">Technical Meeting & Validasi Fisik</h5>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Wajib dihadiri 1 Pembina dan 1 Danton di {VENUE.MAPS_PREVIEW_NAME}. Pengambilan nomor dada & pengundian nomor urut.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-red-50/60 border border-red-100">
                    <div className="p-2 bg-red-600 text-white rounded-xl shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-red-700 uppercase tracking-wider">
                        {EVENT.COMPETITION_DATE} • {EVENT.COMPETITION_TIME_RANGE}
                      </span>
                      <h5 className="font-black text-sm text-slate-900 mt-0.5">Hari-H Pelaksanaan LBB Mu'allimin 2026</h5>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Daftar ulang mulai 06.00 WIB, dilanjutkan upacara pembukaan, dan perlombaan di lapangan kampus terpadu.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right 1 Col: Location & Contacts */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-700" />
                  <h4 className="font-black text-sm uppercase text-slate-900">Lokasi Kegiatan</h4>
                </div>
                <p className="text-xs font-bold text-slate-800">{VENUE.NAME}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{VENUE.ADDRESS}</p>
                <a
                  href={VENUE.MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all w-full justify-center"
                >
                  <span>Buka Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Bantuan Panitia */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-yellow-400">
                  <HelpCircle className="w-5 h-5" />
                  <h4 className="font-black text-sm uppercase tracking-wider">Bantuan Panitia</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Jika terdapat kendala pengunggahan atau perubahan personil, hubungi narahubung resmi sekretariat:
                </p>
                <a
                  href="https://wa.me/6281230093737"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all w-full justify-center uppercase tracking-wider"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Kak Rusyda</span>
                </a>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ROSTER */}
        {activeTab === 'roster' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h4 className="font-black text-xl text-slate-900 uppercase italic">
                  Daftar 25 Personel Resmi Peleton
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  1 Komandan Peleton, 21 Pasukan Inti (3 Saf × 7 Anggota), 3 Cadangan.
                </p>
              </div>
              <button
                onClick={() => openModal('docViewer', { docId: 'form-b', team: currentTeam })}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Biodata Personel</span>
              </button>
            </div>

            {/* Danton Spotlight */}
            <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-700 text-white font-black text-lg flex items-center justify-center shadow-md">
                  DANTON
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-red-700 tracking-wider">
                    Komandan Peleton
                  </span>
                  <h5 className="font-black text-lg text-slate-900">{currentTeam.roster.danton.name}</h5>
                  <p className="text-xs text-slate-600">
                    NISN: <strong className="text-slate-800">{currentTeam.roster.danton.nisn || '-'}</strong> • Kelas: <strong className="text-slate-800">{currentTeam.roster.danton.class || '-'}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* 21 Pasukan Inti Grid */}
            <div>
              <h5 className="font-black text-sm uppercase tracking-wider text-slate-800 mb-3">
                21 Pasukan Inti
              </h5>
              <div className="grid sm:grid-cols-3 gap-3">
                {[1, 2, 3].map(saf => (
                  <div key={saf} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="font-black text-xs uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2 mb-2 flex items-center justify-between">
                      <span>Saf {saf}</span>
                      <span className="text-[10px] font-bold text-slate-400">7 Personel</span>
                    </div>
                    <div className="space-y-2">
                      {currentTeam.roster.pasukan
                        .filter(p => p.safNumber === saf)
                        .map((person, idx) => (
                          <div key={person.id} className="text-xs bg-white p-2 rounded-xl border border-slate-200/80">
                            <span className="text-[10px] font-extrabold text-red-700 block">Banjar {person.banjarNumber}</span>
                            <span className="font-bold text-slate-900 block">{person.name}</span>
                            <span className="text-[10px] text-slate-400">NISN: {person.nisn} • Kls: {person.class}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cadangan & Official */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h5 className="font-black text-xs uppercase tracking-wider text-slate-800 mb-2">
                  3 Personel Cadangan
                </h5>
                <div className="space-y-2">
                  {currentTeam.roster.cadangan.map((c, i) => (
                    <div key={c.id} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900 block">#{i + 1}. {c.name}</span>
                        <span className="text-[10px] text-slate-400">NISN: {c.nisn}</span>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Cadangan</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h5 className="font-black text-xs uppercase tracking-wider text-slate-800 mb-2">
                  Tim Official & Pendamping
                </h5>
                <div className="space-y-2">
                  {currentTeam.roster.officials.map(off => (
                    <div key={off.id} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900 block">{off.name}</span>
                        <span className="text-[10px] text-slate-400">Kontak: {off.phone}</span>
                      </div>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded capitalize">{off.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENTS & UPLOADS */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h4 className="font-black text-xl text-slate-900 uppercase italic">
                Pusat Pengunggahan Berkas Digital
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Unggah atau perbarui berkas yang diminta oleh panitia verifikator.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* 1. Logo Sekolah */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-800">Logo Sekolah / Lambang Peleton</span>
                  <button
                    onClick={() => triggerFileUpload('schoolLogo')}
                    className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Unggah Logo</span>
                  </button>
                </div>
                <div className="h-28 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden p-2">
                  {currentTeam.files.schoolLogo?.url && currentTeam.files.schoolLogo.url !== '#' ? (
                    <img src={currentTeam.files.schoolLogo.url} alt="Logo" className="h-full object-contain" />
                  ) : (
                    <span className="text-xs text-slate-400 italic">Belum ada logo terunggah</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 block truncate">{currentTeam.files.schoolLogo?.name}</span>
              </div>

              {/* 2. Pasfoto 25 Personel */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-800">Pasfoto Personel (Merah/Biru)</span>
                  <button
                    onClick={() => triggerFileUpload('personnelPhotos')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Unggah Pasfoto</span>
                  </button>
                </div>
                <div className="h-28 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden p-2">
                  {currentTeam.files.personnelPhotos?.url && currentTeam.files.personnelPhotos.url.startsWith('data:image') ? (
                    <img src={currentTeam.files.personnelPhotos.url} alt="Pasfoto" className="h-full object-contain" />
                  ) : (
                    <span className="text-xs text-slate-500 font-bold">{currentTeam.files.personnelPhotos?.name || 'File Pasfoto (ZIP/JPG)'}</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 block truncate">{currentTeam.files.personnelPhotos?.name}</span>
              </div>

              {/* 3. Surat Rekomendasi */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-800">Surat Rekomendasi Kepala Sekolah</span>
                  <button
                    onClick={() => triggerFileUpload('recommendationLetter')}
                    className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Unggah Surat</span>
                  </button>
                </div>
                <div className="h-28 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden p-2">
                  {currentTeam.files.recommendationLetter?.url && currentTeam.files.recommendationLetter.url.startsWith('data:image') ? (
                    <img src={currentTeam.files.recommendationLetter.url} alt="Surat Rekom" className="h-full object-contain" />
                  ) : (
                    <span className="text-xs text-slate-600 font-bold">{currentTeam.files.recommendationLetter?.name || 'Surat_Rekomendasi.pdf'}</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 block truncate">{currentTeam.files.recommendationLetter?.name}</span>
              </div>

              {/* 4. Bukti Transfer */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-800">Bukti Transfer Pembayaran BRI</span>
                  <button
                    onClick={() => triggerFileUpload('paymentProof')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Unggah Bukti</span>
                  </button>
                </div>
                <div className="h-28 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden p-2">
                  {currentTeam.files.paymentProof?.url && currentTeam.files.paymentProof.url.startsWith('data:image') ? (
                    <img src={currentTeam.files.paymentProof.url} alt="Bukti Transfer" className="h-full object-contain" />
                  ) : (
                    <span className="text-xs text-emerald-700 font-bold">{currentTeam.files.paymentProof?.name || 'Bukti_Transfer_BRI.jpg'}</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 block truncate">{currentTeam.files.paymentProof?.name}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SCORES & JURY RECAP */}
        {activeTab === 'scores' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h4 className="font-black text-xl text-slate-900 uppercase italic">
                Lembar Rekapitulasi Nilai Dewan Juri
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Nilai resmi hasil penampilan peleton di arena LBB Mu'allimin 2026.
              </p>
            </div>

            {teamScore ? (
              <div className="space-y-6">
                {/* Total Score Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-red-950 text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 block mb-0.5">
                      Total Nilai Akhir
                    </span>
                    <h5 className="text-3xl sm:text-4xl font-black text-yellow-400 font-mono">
                      {teamScore.finalScore} <span className="text-sm font-sans text-slate-300 font-normal">Poin</span>
                    </h5>
                    <p className="text-xs text-slate-400 mt-1">
                      Dinilai oleh: <strong className="text-white">{teamScore.juryName}</strong> ({teamScore.juryRole})
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-3 text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-300 block">Waktu Penilaian</span>
                    <span className="text-xs font-bold text-white">
                      {new Date(teamScore.scoredAt).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Score Breakdown Cards */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Nilai Danton
                    </span>
                    <span className="text-2xl font-black text-slate-900 font-mono">{teamScore.danton.total}</span>
                    <div className="text-[11px] text-slate-600 mt-2 space-y-0.5 border-t border-slate-200 pt-2">
                      <div className="flex justify-between"><span>Penguasaan:</span><strong>{teamScore.danton.penguasaan}</strong></div>
                      <div className="flex justify-between"><span>Vokal:</span><strong>{teamScore.danton.vokal}</strong></div>
                      <div className="flex justify-between"><span>Sikap:</span><strong>{teamScore.danton.sikap}</strong></div>
                      <div className="flex justify-between"><span>Lapangan:</span><strong>{teamScore.danton.lapangan}</strong></div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Nilai Pasukan PBB
                    </span>
                    <span className="text-2xl font-black text-slate-900 font-mono">{teamScore.pbb.total}</span>
                    <div className="text-[11px] text-slate-600 mt-2 space-y-0.5 border-t border-slate-200 pt-2">
                      <div className="flex justify-between"><span>Teknik (70%):</span><strong>{teamScore.pbb.teknik}</strong></div>
                      <div className="flex justify-between"><span>Kekompakan (30%):</span><strong>{teamScore.pbb.kekompakan}</strong></div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Pengurangan Nilai (Penalti)
                    </span>
                    <span className={`text-2xl font-black font-mono ${teamScore.penalties.totalPenalty > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                      -{teamScore.penalties.totalPenalty}
                    </span>
                    <div className="text-[11px] text-slate-600 mt-2 space-y-0.5 border-t border-slate-200 pt-2">
                      <div className="flex justify-between"><span>Injak Garis:</span><strong>{teamScore.penalties.injakGarisCount}x</strong></div>
                      <div className="flex justify-between"><span>Over Time:</span><strong>{teamScore.penalties.overTimeBlocks} block</strong></div>
                    </div>
                  </div>
                </div>

                {/* Jury Remarks */}
                {teamScore.notes && (
                  <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-900 block mb-1">
                      Evaluasi & Catatan Dewan Juri
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{teamScore.notes}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                <Clock className="w-10 h-10 text-slate-400 mx-auto mb-2 animate-pulse" />
                <h5 className="font-bold text-slate-800 text-sm">Penilaian Belum Berlangsung</h5>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Dewan Juri akan melakukan input dan rekapitulasi penilaian pada saat hari pelaksanaan lomba (Ahad, 8 November 2026).
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
