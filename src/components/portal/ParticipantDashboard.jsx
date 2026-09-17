import React, { useState, useEffect, useRef } from 'react';
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
  HelpCircle,
  Edit3,
  Save,
  Plus,
  Check,
  GripVertical,
  ArrowUpDown,
  User,
  ArrowRight,
  Home,
  Tag,
  Timer
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { EVENT, VENUE } from '../../config.js';
import { formatImageUrl, getFallbackImageUrl } from '../../services/sheetService.js';

export default function ParticipantDashboard() {
  const {
    currentTeam,
    updateTeamFiles,
    updateTeamRoster,
    scores,
    setActiveView,
    openModal,
    logoutTeam
  } = useCompetition();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'roster' | 'documents' | 'scores'
  const [uploadToast, setUploadToast] = useState('');

  const [isEditingRoster, setIsEditingRoster] = useState(false);
  const [rosterDraft, setRosterDraft] = useState(null);

  const fileInputRef = useRef(null);
  const [currentUploadKey, setCurrentUploadKey] = useState(null);

  const rosterPhotoInputRef = useRef(null);
  const [rosterPhotoTarget, setRosterPhotoTarget] = useState(null); // { type: 'danton' | 'pasukan' | 'cadangan', id?: string, index?: number }

  if (!currentTeam) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-red-50 border border-red-200 flex items-center justify-center p-2 mb-4 shadow-sm overflow-hidden">
          <img
            src="/fotoslide/5.PNG"
            alt="Paskibra Cadet"
            className="w-full h-full object-contain object-top"
            loading="lazy"
          />
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

  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const rawLogoUrl = currentTeam.files?.schoolLogo?.url || '';
  const hasLogo = Boolean(rawLogoUrl && rawLogoUrl !== '#' && !rawLogoUrl.startsWith('#'));
  const logoFormattedUrl = hasLogo ? formatImageUrl(rawLogoUrl) : '';

  useEffect(() => {
    setLogoLoadFailed(false);
  }, [rawLogoUrl]);

  const availableClassOptions = currentTeam.jenjang === 'SD'
    ? ['1', '2', '3', '4', '5', '6']
    : ['7', '8', '9'];

  function initRosterDraft() {
    const existing = currentTeam.roster || {};
    // ensure danton (nama komandan terisi otomatis sesuai pendaftaran tadi)
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
      pasukan = pasukan.map((p, idx) => ({
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
      cadangan = cadangan.map((c, idx) => ({
        ...c,
        name: c.name || '',
        nisn: c.nisn || '',
        birthPlace: c.birthPlace || '',
        birthDate: c.birthDate || '',
        class: c.class || '',
        photo: c.photo || null,
      }));
    }
    // ensure officials (maks 2, jangan isi otomatis kontak/nama)
    let officials = Array.isArray(existing.officials) ? existing.officials.slice(0, 2) : [];
    if (officials.length === 0) {
      officials = [
        { id: 'off-1', name: '', phone: '', role: 'Pembina / Pelatih 1' },
        { id: 'off-2', name: '', phone: '', role: 'Pembina / Pelatih 2' },
      ];
    } else if (officials.length === 1) {
      officials.push({ id: 'off-2', name: '', phone: '', role: 'Pembina / Pelatih 2' });
    }

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
        // PDF or other documents
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

  const [draggedMember, setDraggedMember] = useState(null); // { type: 'pasukan'|'cadangan', id?: string, index?: number }
  const [dragOverTarget, setDragOverTarget] = useState(null);

  function handleRosterPhotoSelected(e) {
    const file = e.target.files?.[0];
    if (file && rosterPhotoTarget && rosterDraft) {
      const reader = new FileReader();
      reader.onload = uploadEvent => {
        const img = new Image();
        img.onload = () => {
          const MAX_DIM = 400; // Pasfoto 3x4 cukup compact
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

  // Swap person data between two slots
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
        // Swap biodata but preserve slot position (safNumber & banjarNumber & slot id)
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
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
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
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* School & Platoon Profile */}
            <div className="flex items-center gap-5">
                {/* Logo / Emblem */}
                <div className="relative group shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 border-2 border-white/20 p-2 flex items-center justify-center overflow-hidden shadow-lg backdrop-blur-md">
                    {hasLogo && !logoLoadFailed ? (
                      <img
                        src={logoFormattedUrl}
                        alt="Logo Sekolah"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const fallback = getFallbackImageUrl(rawLogoUrl);
                          if (fallback && e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback;
                          } else {
                            setLogoLoadFailed(true);
                          }
                        }}
                        className="w-full h-full object-contain drop-shadow-sm"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-1">
                        <span className="font-black text-xl sm:text-2xl text-yellow-300 drop-shadow-xs">
                          {currentTeam.jenjang || 'LBB'}
                        </span>
                        <span className="text-[9px] uppercase font-bold text-white/70 tracking-wider">
                          {(currentTeam.schoolName || '').split(' ')[0] || 'Tonti'}
                        </span>
                      </div>
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
                    <Users className="w-3.5 h-3.5 text-slate-300" /> Danton: <strong className="text-slate-200">{currentTeam.roster?.danton?.name || currentTeam.dantonName || '-'}</strong>
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
                {currentTeam.status === 'pending' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" /> 1. Menunggu Verifikasi
                  </span>
                )}
                {currentTeam.status === 'registered' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-black uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" /> 2. Terdaftar (Lengkapi Peleton)
                  </span>
                )}
                {currentTeam.status === 'revision' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-rose-400" /> Perlu Perbaikan
                  </span>
                )}
                {currentTeam.status === 'verified' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> 3. Terverifikasi Sah
                  </span>
                )}
                {currentTeam.status === 'drawn' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-purple-400" /> 4. Peleton Siap Tampil
                  </span>
                )}
              </div>

              {/* Box Undian: Nomor Tampil (TM) & Nomor Dada */}
              <div className="flex items-center gap-2">
                <div className="bg-white/10 border border-white/15 rounded-2xl p-2.5 px-3 text-center min-w-[90px]">
                  <span className="text-[9px] font-bold text-slate-300 uppercase block tracking-wider">No. Tampil</span>
                  {currentTeam.lotNumber ? (
                    <span className="text-xl font-black text-yellow-400 font-mono block leading-tight mt-0.5">
                      #{String(currentTeam.lotNumber).padStart(2, '0')}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic block mt-1">Belum TM</span>
                  )}
                </div>

                <div className="bg-white/10 border border-white/15 rounded-2xl p-2.5 px-3 text-center min-w-[90px]">
                  <span className="text-[9px] font-bold text-slate-300 uppercase block tracking-wider">No. Dada</span>
                  {currentTeam.chestNumber ? (
                    <span className="text-xl font-black text-emerald-400 font-mono block leading-tight mt-0.5">
                      {currentTeam.chestNumber}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic block mt-1">-</span>
                  )}
                </div>
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
              

              {/* Agenda Pelaksanaan Timeline */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-black text-lg text-slate-900 uppercase italic">
                      Jadwal Wajib Kontingen
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Informasi jadwal resmi, estimasi waktu tampil lapangan, dan fasilitas kontingen.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl self-start sm:self-auto">
                    {currentTeam.jenjang || 'SD/SMP'} • {currentTeam.teamType || 'Homogen'}
                  </span>
                </div>

                {/* 3 Info Box: No. Dada, Jam Estimasi Tampil, Nomor Basecamp */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Card 1: No. Dada */}
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                        No. Dada
                      </span>
                      <span className="text-lg font-black text-slate-900 font-mono block truncate mt-0.5">
                        {currentTeam.chestNumber || '-'}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {currentTeam.chestNumber ? 'Terverifikasi panitia' : 'Diambil saat TM'}
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Jam Estimasi Tampil */}
                  <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Timer className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 block">
                        Jam Estimasi Tampil
                      </span>
                      <span className="text-lg font-black text-slate-900 font-mono block truncate mt-0.5">
                        {currentTeam.estimatedTime ? `${currentTeam.estimatedTime} WIB` : (currentTeam.lotNumber ? `Urutan #${String(currentTeam.lotNumber).padStart(2, '0')}` : '-')}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {currentTeam.estimatedTime ? 'Estimasi tampil lapangan' : (currentTeam.lotNumber ? 'Berdasarkan nomor undian' : 'Belum diundi')}
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Nomor Basecamp */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Home className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                        Nomor Basecamp
                      </span>
                      <span className="text-lg font-black text-slate-900 font-mono block truncate mt-0.5">
                        {currentTeam.basecampNumber ? `Ruang ${currentTeam.basecampNumber}` : '-'}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {currentTeam.basecampNumber ? 'Ruang tunggu kontingen' : 'Diumumkan saat TM'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h4 className="font-black text-xl text-slate-900 uppercase italic">
                  Daftar 25 Personel Resmi Peleton
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  1 Komandan Peleton, 21 Pasukan Inti (3 Saf × 7 Anggota), 3 Cadangan.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {!isEditingRoster ? (
                  <button
                    onClick={initRosterDraft}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit & Atur Posisi (Drag & Drop)</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsEditingRoster(false);
                        setDraggedMember(null);
                        setDragOverTarget(null);
                      }}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveRoster}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan & Perbarui Roster</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => openModal('docViewer', { docId: 'form-b', team: currentTeam })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Biodata Personel</span>
                </button>
              </div>
            </div>

            {isEditingRoster && (
              <div className="bg-gradient-to-r from-blue-50 to-amber-50 border border-blue-200 p-3.5 rounded-2xl flex items-center justify-between text-xs text-blue-900 gap-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-600 text-white rounded-lg shrink-0">
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                  <span>
                    <strong>Fitur Geser / Drag & Drop Aktif:</strong> Tarik (drag) kartu anggota mana saja untuk menukar posisi antar saf, banjar, ataupun dengan <strong>Personel Cadangan</strong>.
                  </span>
                </div>
                {draggedMember && (
                  <span className="text-[11px] font-bold bg-blue-600 text-white px-2.5 py-1 rounded-full animate-pulse shrink-0">
                    Sedang menarik: {draggedMember.type === 'pasukan' ? 'Pasukan Inti' : 'Cadangan'}
                  </span>
                )}
              </div>
            )}

            {/* Danton Spotlight */}
            <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                {/* Danton Photo */}
                <div className="relative group shrink-0">
                  <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-gradient-to-br from-red-700 to-red-800 text-white font-black text-xs flex items-center justify-center shadow-md overflow-hidden border-2 border-red-300 relative">
                    {(() => {
                      const photoUrl = isEditingRoster ? rosterDraft?.danton?.photo : currentTeam.roster?.danton?.photo;
                      const hasValidPhoto = photoUrl && typeof photoUrl === 'string' && photoUrl !== '#' && !photoUrl.startsWith('#') && !photoUrl.includes('drive.google.com/open?id=');
                      return hasValidPhoto ? (
                        <img
                          src={formatImageUrl(photoUrl)}
                          alt={isEditingRoster ? rosterDraft?.danton?.name || 'Danton' : currentTeam.roster?.danton?.name || 'Danton'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null;
                    })()}
                    <div
                      className="w-full h-full flex flex-col items-center justify-center text-center p-1"
                      style={{
                        display: (() => {
                          const photoUrl = isEditingRoster ? rosterDraft?.danton?.photo : currentTeam.roster?.danton?.photo;
                          return photoUrl && typeof photoUrl === 'string' && photoUrl !== '#' && !photoUrl.startsWith('#') && !photoUrl.includes('drive.google.com/open?id=') ? 'none' : 'flex';
                        })()
                      }}
                    >
                      <User className="w-7 h-7 mx-auto mb-0.5 opacity-80" />
                      <span className="text-[9px] font-black uppercase tracking-wider block opacity-90">DANTON</span>
                    </div>
                  </div>
                  {isEditingRoster && (
                    <button
                      type="button"
                      onClick={() => triggerRosterPhotoUpload({ type: 'danton' })}
                      className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-lg bg-yellow-400 text-slate-950 shadow-md hover:bg-yellow-300 transition-all cursor-pointer"
                      title="Unggah Pasfoto Danton"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Danton Info / Form */}
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-red-700 tracking-wider">
                      Komandan Peleton (Danton)
                    </span>
                    <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      Pemimpin Barisan
                    </span>
                  </div>

                  {!isEditingRoster ? (
                    <div className="mt-1">
                      <h5 className="font-black text-lg text-slate-900">
                        {currentTeam.roster?.danton?.name || currentTeam.dantonName || '-'}
                      </h5>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
                        <span>NISN: <strong className="text-slate-800">{currentTeam.roster?.danton?.nisn || '-'}</strong></span>
                        <span>TTL: <strong className="text-slate-800">{currentTeam.roster?.danton?.birthPlace || '-'}{currentTeam.roster?.danton?.birthDate ? `, ${currentTeam.roster.danton.birthDate}` : ''}</strong></span>
                        <span>Kelas: <strong className="text-slate-800">Kelas {currentTeam.roster?.danton?.class || '-'}</strong></span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 mt-2 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Nama Lengkap Danton</label>
                          <input
                            type="text"
                            placeholder="Nama Lengkap Danton"
                            value={rosterDraft?.danton?.name || ''}
                            onChange={e => setRosterDraft({
                              ...rosterDraft,
                              danton: { ...rosterDraft.danton, name: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 bg-white border border-red-300 rounded-lg text-xs font-bold focus:ring-1 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">NISN Siswa</label>
                          <input
                            type="text"
                            placeholder="10 Digit NISN"
                            value={rosterDraft?.danton?.nisn || ''}
                            onChange={e => setRosterDraft({
                              ...rosterDraft,
                              danton: { ...rosterDraft.danton, nisn: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 bg-white border border-red-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-red-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Tempat Lahir</label>
                          <input
                            type="text"
                            placeholder="Kota Kelahiran"
                            value={rosterDraft?.danton?.birthPlace || ''}
                            onChange={e => setRosterDraft({
                              ...rosterDraft,
                              danton: { ...rosterDraft.danton, birthPlace: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 bg-white border border-red-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Tanggal Lahir</label>
                          <input
                            type="date"
                            value={rosterDraft?.danton?.birthDate || ''}
                            onChange={e => setRosterDraft({
                              ...rosterDraft,
                              danton: { ...rosterDraft.danton, birthDate: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 bg-white border border-red-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Kelas ({currentTeam.jenjang})</label>
                          <select
                            value={rosterDraft?.danton?.class || ''}
                            onChange={e => setRosterDraft({
                              ...rosterDraft,
                              danton: { ...rosterDraft.danton, class: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 bg-white border border-red-300 rounded-lg text-xs font-bold text-slate-800"
                          >
                            <option value="">Pilih Kelas</option>
                            {availableClassOptions.map(cls => (
                              <option key={cls} value={cls}>Kelas {cls}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 21 Pasukan Inti Grid */}
            <div>
              <h5 className="font-black text-sm uppercase tracking-wider text-slate-800 mb-3">
                21 Pasukan Inti (Saf 1, 2, 3)
              </h5>
              {!isEditingRoster ? (
                Array.isArray(currentTeam.roster?.pasukan) && currentTeam.roster.pasukan.length > 0 ? (
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[1, 2, 3].map(saf => (
                      <div key={saf} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                        <div className="font-black text-xs uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2 flex items-center justify-between">
                          <span>Saf {saf}</span>
                          <span className="text-[10px] font-bold text-slate-400">7 Personel</span>
                        </div>
                        <div className="space-y-2">
                          {currentTeam.roster.pasukan
                            .filter(p => p.safNumber === saf)
                            .map((person) => (
                              <div key={person.id} className="text-xs bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
                                <div className="w-10 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden relative">
                                  {person.photo && typeof person.photo === 'string' && person.photo !== '#' && !person.photo.startsWith('#') && !person.photo.includes('drive.google.com/open?id=') ? (
                                    <img
                                      src={formatImageUrl(person.photo)}
                                      alt={person.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        if (e.currentTarget.nextElementSibling) {
                                          e.currentTarget.nextElementSibling.style.display = 'flex';
                                        }
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50"
                                    style={{
                                      display: person.photo && typeof person.photo === 'string' && person.photo !== '#' && !person.photo.startsWith('#') && !person.photo.includes('drive.google.com/open?id=') ? 'none' : 'flex'
                                    }}
                                  >
                                    <Camera className="w-4 h-4 text-slate-400" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-extrabold text-red-700">Banjar {person.banjarNumber}</span>
                                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">Kls {person.class || '-'}</span>
                                  </div>
                                  <span className="font-bold text-slate-900 block truncate text-xs">{person.name || '-'}</span>
                                  <div className="text-[10px] text-slate-400 truncate">
                                    NISN: {person.nisn || '-'} {person.birthPlace ? `• ${person.birthPlace}` : ''}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 text-center space-y-2">
                    <p className="italic">Data 21 pasukan inti belum diisi.</p>
                    <button
                      onClick={initRosterDraft}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Isi 21 Personel Sekarang</span>
                    </button>
                  </div>
                )
              ) : (
                /* Editable Mode for 21 Pasukan */
                <div className="grid sm:grid-cols-3 gap-4">
                  {[1, 2, 3].map(saf => (
                    <div key={saf} className="bg-slate-50 border border-blue-200 rounded-2xl p-4 space-y-3">
                      <div className="font-black text-xs uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                        <span>Saf {saf} (7 Anggota)</span>
                      </div>
                      <div className="space-y-3">
                        {rosterDraft?.pasukan
                          ?.filter(p => p.safNumber === saf)
                          .map(person => {
                            const isBeingDragged = draggedMember?.type === 'pasukan' && draggedMember?.id === person.id;
                            const isTargeted = dragOverTarget?.type === 'pasukan' && dragOverTarget?.id === person.id;

                            return (
                              <div
                                key={person.id}
                                draggable={true}
                                onDragStart={(e) => {
                                  e.dataTransfer.effectAllowed = 'move';
                                  setDraggedMember({ type: 'pasukan', id: person.id });
                                }}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.dataTransfer.dropEffect = 'move';
                                  if (dragOverTarget?.type !== 'pasukan' || dragOverTarget?.id !== person.id) {
                                    setDragOverTarget({ type: 'pasukan', id: person.id });
                                  }
                                }}
                                onDragLeave={() => {
                                  if (dragOverTarget?.type === 'pasukan' && dragOverTarget?.id === person.id) {
                                    setDragOverTarget(null);
                                  }
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  if (draggedMember) {
                                    swapRosterMembers(draggedMember, { type: 'pasukan', id: person.id });
                                  }
                                  setDraggedMember(null);
                                  setDragOverTarget(null);
                                }}
                                onDragEnd={() => {
                                  setDraggedMember(null);
                                  setDragOverTarget(null);
                                }}
                                className={`bg-white p-3 rounded-2xl border transition-all duration-150 space-y-2 select-none ${
                                  isTargeted
                                    ? 'border-blue-500 ring-2 ring-blue-400 bg-blue-50/70 scale-[1.02] shadow-md'
                                    : isBeingDragged
                                    ? 'opacity-40 border-dashed border-blue-400 scale-95'
                                    : 'border-slate-200 shadow-xs hover:border-blue-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-700 uppercase tracking-wider">
                                    <GripVertical className="w-3.5 h-3.5 text-slate-400 cursor-grab active:cursor-grabbing shrink-0" />
                                    <span>Saf {saf} - Banjar {person.banjarNumber}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => triggerRosterPhotoUpload({ type: 'pasukan', id: person.id })}
                                    className="text-[10px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1"
                                  >
                                    <Camera className="w-3 h-3" />
                                    <span>{person.photo ? 'Ganti Foto' : 'Unggah Foto'}</span>
                                  </button>
                                </div>

                                <div className="flex gap-2.5 items-start">
                                  {/* Thumbnail */}
                                  <div
                                    onClick={() => triggerRosterPhotoUpload({ type: 'pasukan', id: person.id })}
                                    className="w-12 h-14 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer hover:border-blue-500 relative"
                                    title="Klik untuk unggah foto anggota"
                                  >
                                    {person.photo && typeof person.photo === 'string' && person.photo !== '#' && !person.photo.startsWith('#') && !person.photo.includes('drive.google.com/open?id=') ? (
                                      <img
                                        src={formatImageUrl(person.photo)}
                                        alt={person.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                          if (e.currentTarget.nextElementSibling) {
                                            e.currentTarget.nextElementSibling.style.display = 'flex';
                                          }
                                        }}
                                      />
                                    ) : null}
                                    <div
                                      className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50"
                                      style={{
                                        display: person.photo && typeof person.photo === 'string' && person.photo !== '#' && !person.photo.startsWith('#') && !person.photo.includes('drive.google.com/open?id=') ? 'none' : 'flex'
                                      }}
                                    >
                                      <Camera className="w-5 h-5 text-slate-400" />
                                    </div>
                                  </div>

                                  <div className="flex-1 space-y-1.5 min-w-0">
                                    <input
                                      type="text"
                                      placeholder="Nama Lengkap Anggota"
                                      value={person.name}
                                      onChange={e => {
                                        const updated = rosterDraft.pasukan.map(p =>
                                          p.id === person.id ? { ...p, name: e.target.value } : p
                                        );
                                        setRosterDraft({ ...rosterDraft, pasukan: updated });
                                      }}
                                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />

                                    <div className="grid grid-cols-2 gap-1.5">
                                      <input
                                        type="text"
                                        placeholder="NISN"
                                        value={person.nisn}
                                        onChange={e => {
                                          const updated = rosterDraft.pasukan.map(p =>
                                            p.id === person.id ? { ...p, nisn: e.target.value } : p
                                          );
                                          setRosterDraft({ ...rosterDraft, pasukan: updated });
                                        }}
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                                      />
                                      <select
                                        value={person.class || ''}
                                        onChange={e => {
                                          const updated = rosterDraft.pasukan.map(p =>
                                            p.id === person.id ? { ...p, class: e.target.value } : p
                                          );
                                          setRosterDraft({ ...rosterDraft, pasukan: updated });
                                        }}
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                      >
                                        <option value="">Pilih Kelas</option>
                                        {availableClassOptions.map(cls => (
                                          <option key={cls} value={cls}>Kelas {cls}</option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-1.5">
                                      <input
                                        type="text"
                                        placeholder="Tempat Lahir"
                                        value={person.birthPlace || ''}
                                        onChange={e => {
                                          const updated = rosterDraft.pasukan.map(p =>
                                            p.id === person.id ? { ...p, birthPlace: e.target.value } : p
                                          );
                                          setRosterDraft({ ...rosterDraft, pasukan: updated });
                                        }}
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                                      />
                                      <input
                                        type="date"
                                        placeholder="Tgl Lahir"
                                        value={person.birthDate || ''}
                                        onChange={e => {
                                          const updated = rosterDraft.pasukan.map(p =>
                                            p.id === person.id ? { ...p, birthDate: e.target.value } : p
                                          );
                                          setRosterDraft({ ...rosterDraft, pasukan: updated });
                                        }}
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cadangan & Official */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h5 className="font-black text-xs uppercase tracking-wider text-slate-800 mb-3">
                  3 Personel Cadangan
                </h5>
                <div className="space-y-2.5">
                  {!isEditingRoster ? (
                    Array.isArray(currentTeam.roster?.cadangan) && currentTeam.roster.cadangan.length > 0 ? (
                      currentTeam.roster.cadangan.map((c, i) => (
                        <div key={c.id || i} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-2.5 shadow-2xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-11 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden relative">
                              {c.photo && typeof c.photo === 'string' && c.photo !== '#' && !c.photo.startsWith('#') && !c.photo.includes('drive.google.com/open?id=') ? (
                                <img
                                  src={formatImageUrl(c.photo)}
                                  alt={c.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.nextElementSibling) {
                                      e.currentTarget.nextElementSibling.style.display = 'flex';
                                    }
                                  }}
                                />
                              ) : null}
                              <div
                                className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50"
                                style={{
                                  display: c.photo && typeof c.photo === 'string' && c.photo !== '#' && !c.photo.startsWith('#') && !c.photo.includes('drive.google.com/open?id=') ? 'none' : 'flex'
                                }}
                              >
                                <Camera className="w-3.5 h-3.5 text-slate-400" />
                              </div>
                            </div>
                            <div className="truncate">
                              <span className="font-bold text-slate-900 block truncate">#{i + 1}. {c.name || '-'}</span>
                              <span className="text-[10px] text-slate-400 block truncate">
                                NISN: {c.nisn || '-'} • Kls: {c.class || '-'} {c.birthPlace ? `• ${c.birthPlace}` : ''}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded shrink-0">Cadangan</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400 italic">Belum ada personel cadangan</div>
                    )
                  ) : (
                    rosterDraft?.cadangan?.map((c, i) => {
                      const isBeingDragged = draggedMember?.type === 'cadangan' && draggedMember?.index === i;
                      const isTargeted = dragOverTarget?.type === 'cadangan' && dragOverTarget?.index === i;

                      return (
                        <div
                          key={c.id || i}
                          draggable={true}
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = 'move';
                            setDraggedMember({ type: 'cadangan', index: i });
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                            if (dragOverTarget?.type !== 'cadangan' || dragOverTarget?.index !== i) {
                              setDragOverTarget({ type: 'cadangan', index: i });
                            }
                          }}
                          onDragLeave={() => {
                            if (dragOverTarget?.type === 'cadangan' && dragOverTarget?.index === i) {
                              setDragOverTarget(null);
                            }
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedMember) {
                              swapRosterMembers(draggedMember, { type: 'cadangan', index: i });
                            }
                            setDraggedMember(null);
                            setDragOverTarget(null);
                          }}
                          onDragEnd={() => {
                            setDraggedMember(null);
                            setDragOverTarget(null);
                          }}
                          className={`bg-white p-3 rounded-2xl border transition-all duration-150 space-y-2 select-none ${
                            isTargeted
                              ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-50/70 scale-[1.02] shadow-md'
                              : isBeingDragged
                              ? 'opacity-40 border-dashed border-amber-400 scale-95'
                              : 'border-slate-200 shadow-xs hover:border-amber-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-800">
                              <GripVertical className="w-3.5 h-3.5 text-slate-400 cursor-grab active:cursor-grabbing shrink-0" />
                              <span>Cadangan #{i + 1}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => triggerRosterPhotoUpload({ type: 'cadangan', index: i })}
                              className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1"
                            >
                              <Camera className="w-3 h-3" />
                              <span>{c.photo ? 'Ganti Foto' : 'Unggah Foto'}</span>
                            </button>
                          </div>

                          <div className="flex gap-2.5 items-start">
                            <div
                              onClick={() => triggerRosterPhotoUpload({ type: 'cadangan', index: i })}
                              className="w-12 h-14 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer hover:border-amber-500 relative"
                              title="Klik untuk unggah pasfoto cadangan"
                            >
                              {c.photo && typeof c.photo === 'string' && c.photo !== '#' && !c.photo.startsWith('#') && !c.photo.includes('drive.google.com/open?id=') ? (
                                <img
                                  src={formatImageUrl(c.photo)}
                                  alt={c.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.nextElementSibling) {
                                      e.currentTarget.nextElementSibling.style.display = 'flex';
                                    }
                                  }}
                                />
                              ) : null}
                              <div
                                className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50"
                                style={{
                                  display: c.photo && typeof c.photo === 'string' && c.photo !== '#' && !c.photo.startsWith('#') && !c.photo.includes('drive.google.com/open?id=') ? 'none' : 'flex'
                                }}
                              >
                                <Camera className="w-5 h-5 text-slate-400" />
                              </div>
                            </div>

                            <div className="flex-1 space-y-1.5 min-w-0">
                              <input
                                type="text"
                                placeholder={`Nama Cadangan #${i + 1}`}
                                value={c.name}
                                onChange={e => {
                                  const updated = rosterDraft.cadangan.map((item, idx) =>
                                    idx === i ? { ...item, name: e.target.value } : item
                                  );
                                  setRosterDraft({ ...rosterDraft, cadangan: updated });
                                }}
                                className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                              />
                              <div className="grid grid-cols-2 gap-1.5">
                                <input
                                  type="text"
                                  placeholder="NISN"
                                  value={c.nisn}
                                  onChange={e => {
                                    const updated = rosterDraft.cadangan.map((item, idx) =>
                                      idx === i ? { ...item, nisn: e.target.value } : item
                                    );
                                    setRosterDraft({ ...rosterDraft, cadangan: updated });
                                  }}
                                  className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono"
                                />
                                <select
                                  value={c.class || ''}
                                  onChange={e => {
                                    const updated = rosterDraft.cadangan.map((item, idx) =>
                                      idx === i ? { ...item, class: e.target.value } : item
                                    );
                                    setRosterDraft({ ...rosterDraft, cadangan: updated });
                                  }}
                                  className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold"
                                >
                                  <option value="">Pilih Kelas</option>
                                  {availableClassOptions.map(cls => (
                                    <option key={cls} value={cls}>Kelas {cls}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                <input
                                  type="text"
                                  placeholder="Tempat Lahir"
                                  value={c.birthPlace || ''}
                                  onChange={e => {
                                    const updated = rosterDraft.cadangan.map((item, idx) =>
                                      idx === i ? { ...item, birthPlace: e.target.value } : item
                                    );
                                    setRosterDraft({ ...rosterDraft, cadangan: updated });
                                  }}
                                  className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
                                />
                                <input
                                  type="date"
                                  value={c.birthDate || ''}
                                  onChange={e => {
                                    const updated = rosterDraft.cadangan.map((item, idx) =>
                                      idx === i ? { ...item, birthDate: e.target.value } : item
                                    );
                                    setRosterDraft({ ...rosterDraft, cadangan: updated });
                                  }}
                                  className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-black text-xs uppercase tracking-wider text-slate-800">
                    Tim Official & Pendamping (Maks 2)
                  </h5>
                  <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                    Maks. 2 Orang
                  </span>
                </div>
                <div className="space-y-2">
                  {!isEditingRoster ? (
                    Array.isArray(currentTeam.roster?.officials) && currentTeam.roster.officials.length > 0 ? (
                      currentTeam.roster.officials.map((off, i) => (
                        <div key={off.id || i} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs flex justify-between items-center gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-11 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                              {off.photo ? (
                                <img
                                  src={formatImageUrl(off.photo)}
                                  alt={off.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const fallback = getFallbackImageUrl(off.photo);
                                    if (fallback && e.currentTarget.src !== fallback) {
                                      e.currentTarget.src = fallback;
                                    } else {
                                      e.currentTarget.style.display = 'none';
                                      if (e.currentTarget.nextSibling) {
                                        e.currentTarget.nextSibling.style.display = 'block';
                                      }
                                    }
                                  }}
                                />
                              ) : null}
                              <User
                                className={`w-4 h-4 text-slate-400 ${off.photo ? 'hidden' : ''}`}
                              />
                            </div>
                            <div className="truncate">
                              <span className="font-bold text-slate-900 block truncate">{off.name || 'Belum diisi'}</span>
                              <span className="text-[10px] text-slate-400">Kontak: {off.phone || '-'}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded capitalize shrink-0">{off.role || 'Official'}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400 italic">Belum ada data official</div>
                    )
                  ) : (
                    rosterDraft?.officials?.map((off, i) => (
                      <div key={off.id || i} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-blue-800">Official #{i + 1}</span>
                          <button
                            type="button"
                            onClick={() => triggerRosterPhotoUpload({ type: 'official', index: i })}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded flex items-center gap-1 transition-colors"
                          >
                            <Camera className="w-3 h-3 text-slate-500" />
                            <span>{off.photo ? 'Ganti Foto' : 'Unggah Foto'}</span>
                          </button>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <div
                            onClick={() => triggerRosterPhotoUpload({ type: 'official', index: i })}
                            className="w-10 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden group hover:border-blue-500 relative"
                            title="Klik untuk unggah pasfoto official"
                          >
                            {off.photo ? (
                              <img
                                src={formatImageUrl(off.photo)}
                                alt={off.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const fallback = getFallbackImageUrl(off.photo);
                                  if (fallback && e.currentTarget.src !== fallback) {
                                    e.currentTarget.src = fallback;
                                  } else {
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.nextSibling) {
                                      e.currentTarget.nextSibling.style.display = 'block';
                                    }
                                  }
                                }}
                              />
                            ) : null}
                            <User className={`w-4 h-4 text-slate-400 group-hover:text-blue-500 ${off.photo ? 'hidden' : ''}`} />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Camera className="w-3.5 h-3.5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 space-y-1.5 min-w-0">
                            <input
                              type="text"
                              placeholder="Nama Official / Pembina"
                              value={off.name}
                              onChange={e => {
                                const updated = rosterDraft.officials.map((item, idx) =>
                                  idx === i ? { ...item, name: e.target.value } : item
                                );
                                setRosterDraft({ ...rosterDraft, officials: updated });
                              }}
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold"
                            />
                            <div className="grid grid-cols-2 gap-1">
                              <input
                                type="text"
                                placeholder="Nomor WA/Kontak"
                                value={off.phone}
                                onChange={e => {
                                  const updated = rosterDraft.officials.map((item, idx) =>
                                    idx === i ? { ...item, phone: e.target.value } : item
                                  );
                                  setRosterDraft({ ...rosterDraft, officials: updated });
                                }}
                                className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px]"
                              />
                              <input
                                type="text"
                                placeholder="Peran (misal: Pembina/Pelatih)"
                                value={off.role}
                                onChange={e => {
                                  const updated = rosterDraft.officials.map((item, idx) =>
                                    idx === i ? { ...item, role: e.target.value } : item
                                  );
                                  setRosterDraft({ ...rosterDraft, officials: updated });
                                }}
                                className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
              <ParticipantDocCard
                title="Logo Sekolah / Lambang Peleton"
                file={currentTeam.files?.schoolLogo}
                uploadKey="schoolLogo"
                btnLabel="Unggah Logo"
                btnColor="bg-yellow-400 hover:bg-yellow-500 text-slate-950"
                onUpload={() => triggerFileUpload('schoolLogo')}
              />

              {/* 2. Informasi Pasfoto Personel & Official */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-blue-950 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-700" />
                      <span>Pasfoto Personel & Official (3x4)</span>
                    </span>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                      Terintegrasi Roster
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pasfoto Komandan, 21 Pasukan Inti, 3 Cadangan, dan 2 Official diunggah langsung per individu di menu <strong>Susunan Personel</strong>.
                  </p>
                </div>
                <div className="pt-3 border-t border-blue-100 flex items-center justify-between">
                  <span className="text-[11px] text-blue-900 font-semibold">
                    Merah (SD) / Biru (SMP)
                  </span>
                  <button
                    onClick={() => setActiveTab('roster')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-xs"
                  >
                    <span>Buka Roster Personel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 3. Surat Rekomendasi */}
              <ParticipantDocCard
                title="Surat Rekomendasi Kepala Sekolah"
                file={currentTeam.files?.recommendationLetter}
                uploadKey="recommendationLetter"
                btnLabel="Unggah Surat"
                btnColor="bg-red-700 hover:bg-red-800 text-white"
                onUpload={() => triggerFileUpload('recommendationLetter')}
              />

              {/* 4. Bukti Transfer */}
              <ParticipantDocCard
                title="Bukti Transfer Pembayaran BRI"
                file={currentTeam.files?.paymentProof}
                uploadKey="paymentProof"
                btnLabel="Unggah Bukti"
                btnColor="bg-emerald-600 hover:bg-emerald-700 text-white"
                onUpload={() => triggerFileUpload('paymentProof')}
              />

              {/* 5. Kartu Pelajar Komandan */}
              <ParticipantDocCard
                title="Kartu Pelajar Komandan"
                file={currentTeam.files?.dantonCard}
                uploadKey="dantonCard"
                btnLabel="Unggah Kartu"
                btnColor="bg-red-700 hover:bg-red-800 text-white"
                onUpload={() => triggerFileUpload('dantonCard')}
              />

              {/* 6. KTP Official / Pelatih */}
              <ParticipantDocCard
                title="KTP Official / Pelatih"
                file={currentTeam.files?.officialKtp}
                uploadKey="officialKtp"
                btnLabel="Unggah KTP"
                btnColor="bg-amber-600 hover:bg-amber-700 text-white"
                onUpload={() => triggerFileUpload('officialKtp')}
              />
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

/**
 * Komponen kartu dokumen berkas peserta dengan penanganan otomatis untuk Gambar & PDF
 * serta graceful fallback bila thumbnail gagal/tertahan oleh CORS
 */
function ParticipantDocCard({ title, file, uploadKey, btnLabel, btnColor, onUpload }) {
  const [imgFailed, setImgFailed] = useState(false);

  const rawUrl = file?.url;
  const fileName = file?.name || title;
  const hasFile = Boolean(rawUrl && rawUrl !== '#');

  useEffect(() => {
    setImgFailed(false);
  }, [rawUrl]);

  const fileExt = typeof fileName === 'string' && fileName.includes('.')
    ? fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
    : '';
  const isPdf = fileExt === '.pdf' || (typeof rawUrl === 'string' && rawUrl.includes('.pdf'));
  const isImageExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(fileExt);

  // Kandidat gambar: base64, blob, URL drive non-pdf, atau ekstensi gambar
  const isImageCandidate = hasFile && !isPdf && typeof rawUrl === 'string' && (
    rawUrl.startsWith('data:image') ||
    rawUrl.startsWith('blob:') ||
    rawUrl.startsWith('http://') ||
    rawUrl.startsWith('https://') ||
    rawUrl.includes('googleusercontent.com') ||
    rawUrl.includes('drive.google.com') ||
    isImageExt
  );

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase text-slate-800 line-clamp-1" title={title}>
            {title}
          </span>
          <button
            type="button"
            onClick={onUpload}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 shadow-xs ${btnColor}`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{btnLabel}</span>
          </button>
        </div>

        <div className="h-32 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center overflow-hidden p-2 relative group">
          {hasFile ? (
            isImageCandidate && !imgFailed ? (
              <a
                href={rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka file asli di tab baru"
                className="w-full h-full flex items-center justify-center"
              >
                <img
                  src={formatImageUrl(rawUrl)}
                  alt={title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const fallback = getFallbackImageUrl(rawUrl);
                    if (fallback && e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    } else {
                      setImgFailed(true);
                    }
                  }}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                />
              </a>
            ) : isPdf ? (
              <a
                href={rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka dokumen PDF di tab baru"
                className="w-full h-full flex flex-col items-center justify-center text-center p-2 text-slate-600 hover:text-red-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-1 border border-red-100 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold truncate max-w-[190px]" title={fileName}>
                  {fileName}
                </span>
                <span className="text-[10px] text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded-full mt-1 border border-red-200">
                  Dokumen PDF (Klik Buka)
                </span>
              </a>
            ) : (
              <a
                href={rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka file di tab baru"
                className="w-full h-full flex flex-col items-center justify-center text-center p-2 text-slate-600 hover:text-blue-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1 border border-blue-100 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold truncate max-w-[190px]" title={fileName}>
                  {fileName}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                  Berkas Terlampir (Klik Buka)
                </span>
              </a>
            )
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-2 text-slate-400">
              <span className="text-xs italic">Belum ada berkas terunggah</span>
            </div>
          )}
        </div>
      </div>

      <span className="text-[10px] text-slate-500 block truncate" title={fileName}>
        {fileName}
      </span>
    </div>
  );
}
