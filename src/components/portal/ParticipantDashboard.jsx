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
import PhysicalIntegrityPactModal from './participant/components/PhysicalIntegrityPactModal.jsx';
import { downloadIntegrityPactPDF } from '../../utils/downloadIntegrityPactPDF.js';

export default function ParticipantDashboard() {
  const {
    currentTeam: contextCurrentTeam,
    teams,
    currentUser,
    currentTeamId,
    setCurrentTeamId,
    updateTeamFiles,
    updateTeamRoster,
    updateTeamProfile,
    updateTeamVehicleSurvey,
    scores,
    staging,
    setActiveView,
    openModal,
    logoutTeam,
    settings
  } = useCompetition();

  // Secure currentTeam resolver: ensure participant can ONLY access their own authorized team (IDOR Defense)
  const currentTeam = React.useMemo(() => {
    // 1. Jika pengguna login sebagai peserta, kunci akses secara ketat ke tim miliknya
    if (currentUser?.role === 'peserta') {
      const authorizedTeam = teams?.find(t => 
        (currentUser.teamId && t.id === currentUser.teamId) ||
        (currentUser.email && t.email && t.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) ||
        (currentUser.regCode && String(t.regCode || '').trim().toUpperCase() === String(currentUser.regCode).trim().toUpperCase())
      );
      return authorizedTeam || null;
    }

    // 2. Jika staff/admin/superadmin, izinkan melihat tim yang dipilih secara administratif
    if (['admin', 'superadmin'].includes(currentUser?.role)) {
      if (currentTeamId) {
        const byId = teams?.find(t => t.id === currentTeamId);
        if (byId) return byId;
      }
      if (contextCurrentTeam) return contextCurrentTeam;
    }

    // 3. Fallback jika contextCurrentTeam cocok dengan currentTeamId yang terverifikasi
    if (contextCurrentTeam && contextCurrentTeam.id === currentTeamId) {
      return contextCurrentTeam;
    }

    return null;
  }, [contextCurrentTeam, currentTeamId, teams, currentUser]);

  // Keep currentTeamId synchronized if resolved
  React.useEffect(() => {
    if (currentTeam && currentTeam.id !== currentTeamId && setCurrentTeamId) {
      setCurrentTeamId(currentTeam.id);
    }
  }, [currentTeam, currentTeamId, setCurrentTeamId]);

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

  const [isPactModalOpen, setIsPactModalOpen] = useState(false);
  const [isDownloadingPact, setIsDownloadingPact] = useState(false);

  const handleDownloadPact = async () => {
    if (!currentTeam || isDownloadingPact) return;
    setIsDownloadingPact(true);
    try {
      await downloadIntegrityPactPDF(currentTeam);
    } catch (err) {
      console.error('Gagal generate PDF Pakta:', err);
      // Fallback: buka modal cetak jika html2canvas terhalang
      setIsPactModalOpen(true);
    } finally {
      setIsDownloadingPact(false);
    }
  };

  // Regulasi Penguncian Data Personel (Bab A.9.c): Perubahan data personel diperbolehkan s.d. sebelum Technical Meeting (9 Jan 2027)
  const tmCutoffDate = new Date('2027-01-09T12:00:00+07:00');
  const isPastTMCutoff = new Date() >= tmCutoffDate;
  const isRosterLocked = Boolean(currentTeam?.isRosterLocked || isPastTMCutoff);

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
        <h3 className="text-2xl font-black text-slate-900 uppercase">Belum Ada Peleton Terdaftar</h3>
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
      medicalHistory: existing.danton?.medicalHistory || '',
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
          medicalHistory: '',
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
        medicalHistory: p.medicalHistory || '',
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
          medicalHistory: '',
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
        medicalHistory: c.medicalHistory || '',
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

    // Check if there is an existing unsaved roster draft in localStorage for this team
    try {
      const draftKey = `lbb_roster_draft_${currentTeam.id}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed?.danton && parsed?.pasukan) {
          setRosterDraft(parsed);
          setIsEditingRoster(true);
          setUploadToast('Draft susunan personel Anda sebelumnya berhasil dipulihkan!');
          setTimeout(() => setUploadToast(''), 4000);
          return;
        }
      }
    } catch (e) {}

    setRosterDraft({ danton, pasukan, cadangan, officials });
    setIsEditingRoster(true);
  }

  // Autosave roster draft to localStorage whenever rosterDraft changes during editing
  useEffect(() => {
    if (!isEditingRoster || !rosterDraft || !currentTeam?.id) return;
    try {
      const draftKey = `lbb_roster_draft_${currentTeam.id}`;
      // Clean clone without giant base64 if needed, but standard photos are fine
      localStorage.setItem(draftKey, JSON.stringify(rosterDraft));
    } catch (e) {
      console.warn('Failed saving roster draft:', e);
    }
  }, [rosterDraft, isEditingRoster, currentTeam?.id]);

  function handleSaveRoster() {
    if (!rosterDraft) return;
    updateTeamRoster(currentTeam.id, rosterDraft);
    try {
      localStorage.removeItem(`lbb_roster_draft_${currentTeam.id}`);
    } catch (e) {}
    setIsEditingRoster(false);
    setUploadToast('Susunan 25 personel peleton & foto berhasil disimpan!');
    setTimeout(() => setUploadToast(''), 4000);
  }

  function handleCancelRoster() {
    setIsEditingRoster(false);
    setDraggedMember(null);
    setDragOverTarget(null);
  }

  function handleDiscardRosterDraft() {
    try {
      localStorage.removeItem(`lbb_roster_draft_${currentTeam.id}`);
    } catch (e) {}
    setIsEditingRoster(false);
    setRosterDraft(null);
    setDraggedMember(null);
    setDragOverTarget(null);
    setUploadToast('Draft sementara personel telah dibatalkan & dibersihkan.');
    setTimeout(() => setUploadToast(''), 3000);
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

            // Jika file asli adalah PNG, pertahankan format image/png agar transparansi (alpha channel) TIDAK menjadi hitam!
            const isPng = file.type === 'image/png' || (file.name && file.name.toLowerCase().endsWith('.png'));
            const compressedUrl = isPng
              ? canvas.toDataURL('image/png')
              : canvas.toDataURL('image/jpeg', 0.8);

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
      subtitle={`Portal Resmi Peleton • Tingkat ${currentTeam.jenjang} • Urutan: ${currentTeam.lotNumber ? `#${String(currentTeam.lotNumber).padStart(2, '0')}` : 'Belum TM'}${currentTeam.chestNumber ? ` • No. Dada: ${currentTeam.chestNumber}` : ''}`}
      onSelectMenu={(menuId) => setActiveTab(menuId)}
      hideHeader={true}
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

      <div className="max-w-6xl mx-auto space-y-3.5 sm:space-y-6">
        {/* Toast Notifikasi */}
        {uploadToast && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{uploadToast}</span>
            </div>
          </div>
        )}

        {/* Main Team Profile Banner - Paling Atas */}
        <TeamProfileHeader
          currentTeam={currentTeam}
          hasLogo={hasLogo}
          logoLoadFailed={logoLoadFailed}
          logoFormattedUrl={logoFormattedUrl}
          rawLogoUrl={rawLogoUrl}
          setLogoLoadFailed={setLogoLoadFailed}
          triggerFileUpload={triggerFileUpload}
          updateTeamProfile={updateTeamProfile}
        />



        {/* Peringatan Revisi Dokumen jika status === 'revision' */}
        {currentTeam.status === 'revision' && (
          <div className="bg-amber-50/80 border border-amber-300 p-3.5 sm:p-5 rounded-2xl shadow-xs flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-2.5 bg-amber-500 text-white rounded-xl shrink-0">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                Tindakan Diperlukan
              </span>
              <h4 className="font-black text-slate-900 text-sm sm:text-base mt-1 leading-snug">Perbaikan Berkas Administrasi</h4>
              <p className="text-[11px] sm:text-xs text-slate-700 mt-1 leading-relaxed">
                <strong>Catatan Panitia:</strong> "{currentTeam.revisionNote || 'Mohon unggah ulang berkas yang kurang jelas atau belum lengkap.'}"
              </p>
              <div className="mt-2.5 sm:mt-3 flex">
                <button
                  onClick={() => setActiveTab('documents')}
                  className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 text-center"
                >
                  Unggah Perbaikan Berkas Sekarang
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifikasi Wajib Upacara Pembukaan untuk Peleton Urutan 6 s.d. 10 (Juknis Bab D.3 & Pasal 6) */}
        {((Number(currentTeam.lotNumber) >= 6 && Number(currentTeam.lotNumber) <= 10) ||
          ['SD-131', 'SD-133', 'SD-135', 'SD-137', 'SD-139', 'SMP-242', 'SMP-244', 'SMP-246', 'SMP-248', 'SMP-260'].includes(String(currentTeam.chestNumber || '').trim())) && (
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-lg border-2 border-red-600/80 flex items-start gap-3.5 sm:gap-4 animate-in fade-in duration-300">
            <div className="p-2.5 sm:p-3 bg-red-700 text-white rounded-2xl shrink-0 font-black text-lg flex items-center justify-center shadow-md">
              🚩
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                  Urutan Tampil #{String(currentTeam.lotNumber || '').padStart(2, '0')} {currentTeam.chestNumber ? `(${currentTeam.chestNumber})` : ''}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-xs">
                  WAJIB HADIR UPACARA PEMBUKAAN
                </span>
                <span className="text-[10px] font-bold text-red-300">
                  Pasal 6 & Juknis Lapangan D.3
                </span>
              </div>
              <h4 className="font-black text-white text-base sm:text-lg mt-1.5 leading-snug">
                Peleton Anda Termasuk Dalam 5 Tim Wajib Upacara Pembukaan!
              </h4>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                Peleton dengan <strong>urutan tampil 6 s.d. 10</strong> wajib berbaris di Lapangan Upacara pada <strong>pukul 06.45 WIB</strong> (Upacara mulai tepat 07.00 WIB) dengan komposisi: <strong>1 Komandan Peleton + 15 Anggota</strong> (5 trio lengkap) mengenakan <strong>seragam perlombaan lengkap</strong>.
              </p>
              <div className="mt-2.5 flex items-center gap-2 p-2 bg-black/40 border border-red-500/30 rounded-xl text-[11px] text-amber-300 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Sanksi Ketidakhadiran: Penalti pemotongan <strong>-150 poin</strong> pada nilai Peleton, atau <strong>-50 poin per kelipatan keterlambatan 5 menit</strong>.
                </span>
              </div>
            </div>
          </div>
        )}



        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <OverviewTab
            currentTeam={currentTeam}
            allTeams={teams}
            settings={settings}
            scheduleTab={scheduleTab}
            setScheduleTab={setScheduleTab}
            tmDate={tmDate}
            tmTime={tmTime}
            trialDate={trialDate}
            trialTime={trialTime}
            compDate={compDate}
            compTime={compTime}
            setActiveTab={setActiveTab}
            updateTeamVehicleSurvey={updateTeamVehicleSurvey}
            stagingInfo={staging?.[currentTeam.id] || null}
            onOpenPactModal={handleDownloadPact}
            isDownloadingPact={isDownloadingPact}
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
            handleCancelRoster={handleCancelRoster}
            handleDiscardRosterDraft={handleDiscardRosterDraft}
            openModal={openModal}
            draggedMember={draggedMember}
            setDraggedMember={setDraggedMember}
            dragOverTarget={dragOverTarget}
            setDragOverTarget={setDragOverTarget}
            swapRosterMembers={swapRosterMembers}
            triggerRosterPhotoUpload={triggerRosterPhotoUpload}
            availableClassOptions={availableClassOptions}
            isRosterLocked={isRosterLocked}
            onOpenPactModal={handleDownloadPact}
            isDownloadingPact={isDownloadingPact}
          />
        )}

        {/* TAB 4: DOCUMENTS */}
        {activeTab === 'documents' && (
          <DocumentsTab
            currentTeam={currentTeam}
            triggerFileUpload={triggerFileUpload}
            setActiveTab={setActiveTab}
            onOpenPactModal={handleDownloadPact}
            isDownloadingPact={isDownloadingPact}
          />
        )}

        {/* TAB 5: SCORES */}
        {activeTab === 'scores' && (
          <ScoresTab teamScore={teamScore} />
        )}

        {/* Modal Cetak Fisik Pakta Integritas Bermaterai Rp 10.000 */}
        <PhysicalIntegrityPactModal
          isOpen={isPactModalOpen}
          onClose={() => setIsPactModalOpen(false)}
          team={currentTeam}
        />
      </div>
    </SimpaskorSidebarLayout>
  );
}
