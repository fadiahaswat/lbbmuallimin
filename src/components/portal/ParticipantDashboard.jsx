import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Upload,
  CheckCircle2,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { EVENT } from '../../config.js';
import { formatImageUrl } from '../../services/sheetService.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

import OverviewTab from './participant/tabs/OverviewTab.jsx';
import IdCardTab from './participant/tabs/IdCardTab.jsx';
import RosterTab from './participant/tabs/RosterTab.jsx';
import DocumentsTab from './participant/tabs/DocumentsTab.jsx';
import ScoresTab from './participant/tabs/ScoresTab.jsx';
import TeamProfileHeader from './participant/components/TeamProfileHeader.jsx';

export default function ParticipantDashboard() {
  const {
    currentTeam,
    updateTeamFiles,
    updateTeamRoster,
    scores,
    setActiveView,
    openModal,
    logoutTeam,
    settings
  } = useCompetition();

  const eventDates = settings?.eventDates || {};
  const tmDate = eventDates.technicalMeetingDate || EVENT.TECHNICAL_MEETING_DATE;
  const tmTime = eventDates.technicalMeetingTime || EVENT.TECHNICAL_MEETING_TIME;
  const trialDate = eventDates.fieldTrialDate || EVENT.FIELD_TRIAL_DATE;
  const trialTime = eventDates.fieldTrialTime || EVENT.FIELD_TRIAL_TIME_RANGE;
  const compDate = eventDates.competitionDate || EVENT.COMPETITION_DATE;
  const compTime = eventDates.competitionTimeRange || EVENT.COMPETITION_TIME_RANGE;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'idcard' | 'roster' | 'documents' | 'scores'
  const [scheduleTab, setScheduleTab] = useState('tm'); // 'tm' | 'trial' | 'competition'
  const [uploadToast, setUploadToast] = useState('');

  const [isEditingRoster, setIsEditingRoster] = useState(false);
  const [rosterDraft, setRosterDraft] = useState(null);

  const fileInputRef = useRef(null);
  const [currentUploadKey, setCurrentUploadKey] = useState(null);

  const rosterPhotoInputRef = useRef(null);
  const [rosterPhotoTarget, setRosterPhotoTarget] = useState(null); // { type: 'danton' | 'pasukan' | 'cadangan' | 'official', id?: string, index?: number }

  const [draggedMember, setDraggedMember] = useState(null);
  const [dragOverTarget, setDragOverTarget] = useState(null);

  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const rawLogoUrl = currentTeam?.files?.schoolLogo?.url || '';
  const hasLogo = Boolean(rawLogoUrl && rawLogoUrl !== '#' && !rawLogoUrl.startsWith('#'));
  const logoFormattedUrl = hasLogo ? formatImageUrl(rawLogoUrl) : '';

  useEffect(() => {
    setLogoLoadFailed(false);
  }, [rawLogoUrl]);

  if (!currentTeam) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-red-50 border border-red-200 flex items-center justify-center p-2 mb-4 shadow-sm overflow-hidden">
          <picture>
            <source srcSet="/fotoslide/5.webp" type="image/webp" />
            <img
              src="/fotoslide/5.png"
              alt="Paskibra Cadet"
              className="w-full h-full object-contain object-top"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
        <h3 className="text-2xl font-black text-slate-900 uppercase italic">Belum Ada Peleton Terdaftar</h3>
        <p className="text-slate-500 text-sm max-w-md mt-1 mb-6">
          Akun Anda belum memiliki peleton yang didaftarkan. Daftarkan peleton sekolah Anda sekarang untuk mengikuti perlombaan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveView('register')}
            className="px-6 py-2.5 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
          >
            Daftar Peleton Sekarang
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

  const availableClassOptions = currentTeam.jenjang === 'SD'
    ? ['1', '2', '3', '4', '5', '6']
    : ['7', '8', '9'];

  function initRosterDraft() {
    const existing = currentTeam.roster || {};
    // ensure danton
    const danton = {
      name: (existing.danton?.name || currentTeam.dantonName || '').trim().toUpperCase(),
      nisn: existing.danton?.nisn || '',
      birthPlace: existing.danton?.birthPlace || '',
      birthDate: existing.danton?.birthDate || '',
      class: existing.danton?.class || '',
      photo: existing.danton?.photo || null,
    };
    // ensure 21 pasukan
    let pasukan = Array.isArray(existing.pasukan) ? [...existing.pasukan] : [];
    if (pasukan.length < 21) {
      const needed = 21 - pasukan.length;
      for (let i = 0; i < needed; i++) {
        const totalIdx = pasukan.length + 1;
        const saf = Math.ceil(totalIdx / 7);
        const banjar = ((totalIdx - 1) % 7) + 1;
        pasukan.push({
          id: `p-${totalIdx}`,
          safNumber: saf,
          banjarNumber: banjar,
          name: '',
          nisn: '',
          birthPlace: '',
          birthDate: '',
          class: '',
          photo: null,
        });
      }
    } else {
      pasukan = pasukan.map((p) => ({
        ...p,
        name: p.name || '',
        nisn: p.nisn || '',
        birthPlace: p.birthPlace || '',
        birthDate: p.birthDate || '',
        class: p.class || '',
        photo: p.photo || null,
      }));
    }
    // ensure 3 cadangan
    let cadangan = Array.isArray(existing.cadangan) ? [...existing.cadangan] : [];
    if (cadangan.length < 3) {
      const needed = 3 - cadangan.length;
      for (let i = 0; i < needed; i++) {
        const idx = cadangan.length + 1;
        cadangan.push({
          id: `c-${idx}`,
          name: '',
          nisn: '',
          birthPlace: '',
          birthDate: '',
          class: '',
          photo: null,
        });
      }
    } else {
      cadangan = cadangan.map((c) => ({
        ...c,
        name: c.name || '',
        nisn: c.nisn || '',
        birthPlace: c.birthPlace || '',
        birthDate: c.birthDate || '',
        class: c.class || '',
        photo: c.photo || null,
      }));
    }
    // ensure officials (3 orang: 1 Official Utama + 2 Tim Pendukung)
    let officials = Array.isArray(existing.officials) ? [...existing.officials] : [];
    const defaultTemplates = [
      { id: 'off-1', name: '', phone: '', role: 'Official (Pelatih / Pembina)', category: 'official' },
      { id: 'off-2', name: '', phone: '', role: 'Pendukung 1 (Medis / Dokum)', category: 'pendukung' },
      { id: 'off-3', name: '', phone: '', role: 'Pendukung 2 (Medis / Dokum)', category: 'pendukung' },
    ];

    for (let i = 0; i < 3; i++) {
      if (!officials[i]) {
        officials[i] = { ...defaultTemplates[i] };
      } else {
        officials[i] = {
          ...defaultTemplates[i],
          ...officials[i],
          role: officials[i].role || defaultTemplates[i].role,
          category: i === 0 ? 'official' : 'pendukung',
        };
      }
    }
    officials = officials.slice(0, 3);

    setRosterDraft({ danton, pasukan, cadangan, officials });
    setIsEditingRoster(true);
  }

  function handleSaveRoster() {
    if (!rosterDraft) return;
    updateTeamRoster(currentTeam.id, rosterDraft);
    setIsEditingRoster(false);
    setUploadToast('Susunan 25 personel peleton & foto berhasil disimpan!');
    setTimeout(() => setUploadToast(''), 4000);
  }

  function triggerFileUpload(key) {
    setCurrentUploadKey(key);
    fileInputRef.current?.click();
  }

  function handleFileSelected(e) {
    const file = e.target.files?.[0];
    if (file && currentUploadKey) {
      const isImg = file.type?.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(file.name);
      if (isImg) {
        const reader = new FileReader();
        reader.onload = uploadEvent => {
          const img = new Image();
          img.onload = () => {
            const MAX_DIM = 640;
            let width = img.width;
            let height = img.height;
            if (width > MAX_DIM || height > MAX_DIM) {
              if (width > height) {
                height = Math.round((height * MAX_DIM) / width);
                width = MAX_DIM;
              } else {
                width = Math.round((width * MAX_DIM) / height);
                height = MAX_DIM;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const compressedUrl = canvas.toDataURL('image/jpeg', 0.65);
            const estKb = Math.round((compressedUrl.length * 0.75) / 1024);

            const fileData = {
              name: file.name,
              size: `${estKb} KB (Compressed)`,
              uploadedAt: new Date().toISOString(),
              url: compressedUrl,
            };
            updateTeamFiles(currentTeam.id, currentUploadKey, fileData);
            setUploadToast(`Berkas "${file.name}" berhasil diunggah!`);
            setTimeout(() => setUploadToast(''), 4000);
          };
          img.onerror = () => {
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
          img.src = uploadEvent.target?.result;
        };
        reader.readAsDataURL(file);
      } else {
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
  }

  function triggerRosterPhotoUpload(target) {
    setRosterPhotoTarget(target);
    rosterPhotoInputRef.current?.click();
  }

  function handleRosterPhotoSelected(e) {
    const file = e.target.files?.[0];
    if (file && rosterPhotoTarget && rosterDraft) {
      const reader = new FileReader();
      reader.onload = uploadEvent => {
        const img = new Image();
        img.onload = () => {
          const MAX_DIM = 400;
          let width = img.width;
          let height = img.height;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const photoUrl = canvas.toDataURL('image/jpeg', 0.65);

          if (rosterPhotoTarget.type === 'danton') {
            setRosterDraft({
              ...rosterDraft,
              danton: { ...rosterDraft.danton, photo: photoUrl }
            });
          } else if (rosterPhotoTarget.type === 'pasukan') {
            const updated = rosterDraft.pasukan.map(p =>
              p.id === rosterPhotoTarget.id ? { ...p, photo: photoUrl } : p
            );
            setRosterDraft({ ...rosterDraft, pasukan: updated });
          } else if (rosterPhotoTarget.type === 'cadangan') {
            const updated = rosterDraft.cadangan.map((c, idx) =>
              idx === rosterPhotoTarget.index ? { ...c, photo: photoUrl } : c
            );
            setRosterDraft({ ...rosterDraft, cadangan: updated });
          } else if (rosterPhotoTarget.type === 'official') {
            const updated = rosterDraft.officials.map((o, idx) =>
              idx === rosterPhotoTarget.index ? { ...o, photo: photoUrl } : o
            );
            setRosterDraft({ ...rosterDraft, officials: updated });
          }
          setUploadToast(`Pasfoto berhasil dipasang! Klik Simpan untuk memperbarui.`);
          setTimeout(() => setUploadToast(''), 4000);
        };
        img.onerror = () => {
          const photoUrl = uploadEvent.target?.result;
          if (rosterPhotoTarget.type === 'danton') {
            setRosterDraft({
              ...rosterDraft,
              danton: { ...rosterDraft.danton, photo: photoUrl }
            });
          } else if (rosterPhotoTarget.type === 'pasukan') {
            const updated = rosterDraft.pasukan.map(p =>
              p.id === rosterPhotoTarget.id ? { ...p, photo: photoUrl } : p
            );
            setRosterDraft({ ...rosterDraft, pasukan: updated });
          } else if (rosterPhotoTarget.type === 'cadangan') {
            const updated = rosterDraft.cadangan.map((c, idx) =>
              idx === rosterPhotoTarget.index ? { ...c, photo: photoUrl } : c
            );
            setRosterDraft({ ...rosterDraft, cadangan: updated });
          } else if (rosterPhotoTarget.type === 'official') {
            const updated = rosterDraft.officials.map((o, idx) =>
              idx === rosterPhotoTarget.index ? { ...o, photo: photoUrl } : o
            );
            setRosterDraft({ ...rosterDraft, officials: updated });
          }
          setUploadToast(`Pasfoto berhasil dipasang! Klik Simpan untuk memperbarui.`);
          setTimeout(() => setUploadToast(''), 4000);
        };
        img.src = uploadEvent.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }

  function swapRosterMembers(source, target) {
    if (!source || !target || !rosterDraft) return;
    if (source.type === target.type && source.id === target.id && source.index === target.index) return;

    let newDraft = { ...rosterDraft };
    let newPasukan = [...(newDraft.pasukan || [])];
    let newCadangan = [...(newDraft.cadangan || [])];

    // Case 1: Pasukan <-> Pasukan
    if (source.type === 'pasukan' && target.type === 'pasukan') {
      const sIdx = newPasukan.findIndex(p => p.id === source.id);
      const tIdx = newPasukan.findIndex(p => p.id === target.id);
      if (sIdx !== -1 && tIdx !== -1) {
        const sData = {
          name: newPasukan[sIdx].name,
          nisn: newPasukan[sIdx].nisn,
          class: newPasukan[sIdx].class,
          birthPlace: newPasukan[sIdx].birthPlace,
          birthDate: newPasukan[sIdx].birthDate,
          photo: newPasukan[sIdx].photo,
        };
        const tData = {
          name: newPasukan[tIdx].name,
          nisn: newPasukan[tIdx].nisn,
          class: newPasukan[tIdx].class,
          birthPlace: newPasukan[tIdx].birthPlace,
          birthDate: newPasukan[tIdx].birthDate,
          photo: newPasukan[tIdx].photo,
        };

        newPasukan[sIdx] = { ...newPasukan[sIdx], ...tData };
        newPasukan[tIdx] = { ...newPasukan[tIdx], ...sData };
        newDraft.pasukan = newPasukan;
      }
    }
    // Case 2: Pasukan <-> Cadangan
    else if (source.type === 'pasukan' && target.type === 'cadangan') {
      const pIdx = newPasukan.findIndex(p => p.id === source.id);
      const cIdx = target.index;
      if (pIdx !== -1 && newCadangan[cIdx] !== undefined) {
        const pData = {
          name: newPasukan[pIdx].name,
          nisn: newPasukan[pIdx].nisn,
          class: newPasukan[pIdx].class,
          birthPlace: newPasukan[pIdx].birthPlace,
          birthDate: newPasukan[pIdx].birthDate,
          photo: newPasukan[pIdx].photo,
        };
        const cData = {
          name: newCadangan[cIdx].name,
          nisn: newCadangan[cIdx].nisn,
          class: newCadangan[cIdx].class,
          birthPlace: newCadangan[cIdx].birthPlace,
          birthDate: newCadangan[cIdx].birthDate,
          photo: newCadangan[cIdx].photo,
        };

        newPasukan[pIdx] = { ...newPasukan[pIdx], ...cData };
        newCadangan[cIdx] = { ...newCadangan[cIdx], ...pData };
        newDraft.pasukan = newPasukan;
        newDraft.cadangan = newCadangan;
      }
    }
    // Case 3: Cadangan <-> Pasukan
    else if (source.type === 'cadangan' && target.type === 'pasukan') {
      const cIdx = source.index;
      const pIdx = newPasukan.findIndex(p => p.id === target.id);
      if (pIdx !== -1 && newCadangan[cIdx] !== undefined) {
        const cData = {
          name: newCadangan[cIdx].name,
          nisn: newCadangan[cIdx].nisn,
          class: newCadangan[cIdx].class,
          birthPlace: newCadangan[cIdx].birthPlace,
          birthDate: newCadangan[cIdx].birthDate,
          photo: newCadangan[cIdx].photo,
        };
        const pData = {
          name: newPasukan[pIdx].name,
          nisn: newPasukan[pIdx].nisn,
          class: newPasukan[pIdx].class,
          birthPlace: newPasukan[pIdx].birthPlace,
          birthDate: newPasukan[pIdx].birthDate,
          photo: newPasukan[pIdx].photo,
        };

        newCadangan[cIdx] = { ...newCadangan[cIdx], ...pData };
        newPasukan[pIdx] = { ...newPasukan[pIdx], ...cData };
        newDraft.pasukan = newPasukan;
        newDraft.cadangan = newCadangan;
      }
    }
    // Case 4: Cadangan <-> Cadangan
    else if (source.type === 'cadangan' && target.type === 'cadangan') {
      const sIdx = source.index;
      const tIdx = target.index;
      if (newCadangan[sIdx] !== undefined && newCadangan[tIdx] !== undefined) {
        const sData = {
          name: newCadangan[sIdx].name,
          nisn: newCadangan[sIdx].nisn,
          class: newCadangan[sIdx].class,
          birthPlace: newCadangan[sIdx].birthPlace,
          birthDate: newCadangan[sIdx].birthDate,
          photo: newCadangan[sIdx].photo,
        };
        const tData = {
          name: newCadangan[tIdx].name,
          nisn: newCadangan[tIdx].nisn,
          class: newCadangan[tIdx].class,
          birthPlace: newCadangan[tIdx].birthPlace,
          birthDate: newCadangan[tIdx].birthDate,
          photo: newCadangan[tIdx].photo,
        };

        newCadangan[sIdx] = { ...newCadangan[sIdx], ...tData };
        newCadangan[tIdx] = { ...newCadangan[tIdx], ...sData };
        newDraft.cadangan = newCadangan;
      }
    }

    setRosterDraft(newDraft);
    setUploadToast('Posisi personel berhasil ditukar!');
    setTimeout(() => setUploadToast(''), 3000);
  }

  return (
    <SimpaskorSidebarLayout
      activeMenu={activeTab}
      title={currentTeam.schoolName}
      subtitle={`Portal Resmi Peleton • Tingkat ${currentTeam.jenjang} • No. Undi: ${currentTeam.lotNumber ? `#${String(currentTeam.lotNumber).padStart(2, '0')}` : 'Belum TM'}`}
      onSelectMenu={(menuId) => setActiveTab(menuId)}
      rightActions={
        <div className="flex items-center gap-2">
          <button
            onClick={logoutTeam}
            className="text-xs font-bold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-colors cursor-pointer"
          >
            Ganti Akun Tim
          </button>
        </div>
      }
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        className="hidden"
        accept="image/*,.pdf,.zip"
      />
      <input
        type="file"
        ref={rosterPhotoInputRef}
        onChange={handleRosterPhotoSelected}
        className="hidden"
        accept="image/*"
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Toast Notifikasi */}
        {uploadToast && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{uploadToast}</span>
            </div>
          </div>
        )}

        {/* Panduan Pengunggahan Berkas jika status === 'registered' */}
        {currentTeam.status === 'registered' && (
          <div className="bg-blue-50 border-2 border-blue-400 p-4 sm:p-5 rounded-2xl shadow-md flex items-start gap-4">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shrink-0 shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 bg-blue-200/80 px-2 py-0.5 rounded">
                  Pendaftaran Awal Disetujui
                </span>
                <span className="text-xs font-bold text-blue-700">Langkah 2 dari 4</span>
              </div>
              <h4 className="font-black text-slate-900 text-base mt-1">Lengkapi Susunan 25 Personel & Unggah Surat Rekomendasi</h4>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                Pendaftaran awal sekolah Anda telah disetujui panitia! Silakan lengkapi biodata 25 personel peleton (nama, NISN, kelas) pada tab <strong>"Susunan 25 Personel"</strong> dan unggah <strong>Surat Rekomendasi Kepala Sekolah</strong> pada tab <strong>"Berkas Persyaratan"</strong> untuk melanjutkan ke verifikasi peleton sah.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('roster')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Isi Data 25 Personel Peleton</span>
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className="px-4 py-2 bg-white hover:bg-blue-100 text-blue-900 font-bold text-xs rounded-xl border border-blue-300 transition-all flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah Surat Rekomendasi Sekolah</span>
                </button>
              </div>
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
        <TeamProfileHeader
          currentTeam={currentTeam}
          hasLogo={hasLogo}
          logoLoadFailed={logoLoadFailed}
          logoFormattedUrl={logoFormattedUrl}
          rawLogoUrl={rawLogoUrl}
          setLogoLoadFailed={setLogoLoadFailed}
          triggerFileUpload={triggerFileUpload}
        />

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white rounded-2xl px-2 py-1.5 shadow-xs overflow-x-auto gap-1">
          {[
            { id: 'overview', label: 'Ringkasan & Jadwal' },
            { id: 'idcard', label: 'ID Card / Tiket QR' },
            { id: 'roster', label: 'Susunan 25 Personel' },
            { id: 'documents', label: 'Unggah Berkas & Logo' },
            { id: 'scores', label: 'Hasil Rekap Nilai' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
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
          <OverviewTab
            currentTeam={currentTeam}
            scheduleTab={scheduleTab}
            setScheduleTab={setScheduleTab}
            tmDate={tmDate}
            tmTime={tmTime}
            trialDate={trialDate}
            trialTime={trialTime}
            compDate={compDate}
            compTime={compTime}
            setActiveTab={setActiveTab}
          />
        )}

        {/* TAB 2: ID CARD */}
        {activeTab === 'idcard' && (
          <IdCardTab currentTeam={currentTeam} />
        )}

        {/* TAB 3: ROSTER */}
        {activeTab === 'roster' && (
          <RosterTab
            currentTeam={currentTeam}
            isEditingRoster={isEditingRoster}
            setIsEditingRoster={setIsEditingRoster}
            rosterDraft={rosterDraft}
            setRosterDraft={setRosterDraft}
            initRosterDraft={initRosterDraft}
            handleSaveRoster={handleSaveRoster}
            openModal={openModal}
            draggedMember={draggedMember}
            setDraggedMember={setDraggedMember}
            dragOverTarget={dragOverTarget}
            setDragOverTarget={setDragOverTarget}
            swapRosterMembers={swapRosterMembers}
            triggerRosterPhotoUpload={triggerRosterPhotoUpload}
            availableClassOptions={availableClassOptions}
          />
        )}

        {/* TAB 4: DOCUMENTS */}
        {activeTab === 'documents' && (
          <DocumentsTab
            currentTeam={currentTeam}
            triggerFileUpload={triggerFileUpload}
            setActiveTab={setActiveTab}
          />
        )}

        {/* TAB 5: SCORES */}
        {activeTab === 'scores' && (
          <ScoresTab teamScore={teamScore} />
        )}
      </div>
    </SimpaskorSidebarLayout>
  );
}
