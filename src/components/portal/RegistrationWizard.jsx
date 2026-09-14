import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  Building2,
  Users,
  FileUp,
  AlertCircle,
  Copy,
  Check,
  UploadCloud,
  FileText,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Camera,
  CreditCard,
  Image as ImageIcon,
  UserCheck,
  Mail,
  School,
  Lock,
  Clock,
  PenTool,
  RotateCcw,
  X,
  MapPin
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { PAYMENT } from '../../config.js';

export default function RegistrationWizard({ isOpen, onClose }) {
  const { registerTeam, setActiveView, goBack, openAuthModal } = useCompetition();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      goBack();
    }
  };

  const [step, setStep] = useState(1);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [validationError, setValidationError] = useState('');

  // 12 Items Form State
  const [formData, setFormData] = useState({
    email: '', // 1. Email aktif untuk akun
    jenjang: 'SMP', // 2. Jenjang sekolah SD apa SMP
    schoolName: '', // 3. Nama Sekolah
    teamType: 'Homogen', // 5. Homogen apa Heterogen
    dantonName: '', // 6. Nama Komandan
    officialName: '', // 8. Nama Official/Pelatih
    waNumber: '',
    confirmWatchfinder: false, // Konfirmasi foto selfie watchfinder
    agreeJuknis: false,
  });

  // Files State for the required uploads
  const [files, setFiles] = useState({
    schoolLogo: null, // 4. Upload Logo Sekolah
    dantonCard: null, // 7. Upload Kartu Pelajar Komandan
    officialKtp: null, // 9. Upload KTP Official/Pelatih
    paymentProof: null, // 10. Bukti Pembayaran
    selfie: null, // 11. Foto Selfie untuk verifikasi (Watchfinder)
    integrityPact: null, // 12. Pakta Integritas (Online / Digital Signed)
  });

  // Online Pakta Integritas Canvas Modal State
  const [showPaktaModal, setShowPaktaModal] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Submission result
  const [createdTeam, setCreatedTeam] = useState(null);

  // Helper to validate and compress uploaded files (Security Checklist #19)
  const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3 MB
  const MAX_DOC_SIZE = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png'];
  const ALLOWED_DOC_EXTS = ['.pdf', '.jpg', '.jpeg', '.png'];

  function processUploadedFile(file, isDocument = false) {
    return new Promise((resolve) => {
      if (!file) {
        resolve(null);
        return;
      }

      const fileName = (file.name || '').toLowerCase();
      const ext = fileName.slice(fileName.lastIndexOf('.'));
      const allowedList = isDocument ? ALLOWED_DOC_EXTS : ALLOWED_IMAGE_EXTS;

      // 1. Whitelist extension check (Anti-XSS & Anti-Malware check)
      if (!allowedList.includes(ext)) {
        alert(`Format file "${file.name}" tidak diizinkan! Format yang diterima hanya: ${allowedList.join(', ')}`);
        resolve(null);
        return;
      }

      // 2. Hard File Size Limit check
      const maxLimit = isDocument ? MAX_DOC_SIZE : MAX_IMAGE_SIZE;
      if (file.size > maxLimit) {
        const limitMb = Math.round(maxLimit / (1024 * 1024));
        alert(`Ukuran file "${file.name}" (${(file.size / (1024 * 1024)).toFixed(2)} MB) melebihi batas maksimal ${limitMb} MB!`);
        resolve(null);
        return;
      }

      // If it's an image, scale down to max 800px and compress to JPEG 0.75
      if (file.type && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const MAX_DIM = 800;
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

            const compressedUrl = canvas.toDataURL('image/jpeg', 0.75);
            const estKb = Math.round((compressedUrl.length * 0.75) / 1024);
            resolve({
              name: file.name,
              size: `${estKb} KB (Compressed)`,
              uploadedAt: new Date().toISOString(),
              url: compressedUrl,
            });
          };
          img.onerror = () => {
            resolve({
              name: file.name,
              size: `${(file.size / 1024).toFixed(1)} KB`,
              uploadedAt: new Date().toISOString(),
              url: e.target?.result || '#',
            });
          };
          img.src = e.target?.result;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
        return;
      }

      // For PDF documents
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        resolve({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          uploadedAt: new Date().toISOString(),
          url: uploadEvent.target?.result || '#',
        });
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  async function handleFileChange(key, e) {
    const file = e.target.files?.[0];
    if (file) {
      const isDocument = ['dantonCard', 'officialKtp', 'paymentProof'].includes(key);
      const processed = await processUploadedFile(file, isDocument);
      if (processed) {
        setFiles(prev => ({
          ...prev,
          [key]: processed,
        }));
      }
    }
  }

  function handleCopyAccount() {
    navigator.clipboard?.writeText(PAYMENT.ACCOUNT_NUMBER);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  }

  // Canvas Drawing Handlers for Online Signature
  function getCanvasCoords(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function startDrawing(e) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoords(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  }

  function draw(e) {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoords(e, canvas);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#0284c7'; // Deep sky blue digital ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    setHasSignature(true);
  }

  function stopDrawing() {
    setIsDrawing(false);
  }

  function clearCanvasSignature() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  }

  function saveOnlineSignature() {
    if (!hasSignature) {
      alert('Silakan bubuhkan tanda tangan digital Anda pada area kanvas terlebih dahulu.');
      return;
    }
    const canvas = canvasRef.current;
    const signatureDataUrl = canvas.toDataURL('image/png');
    const signCode = `PI-ONLINE-2026-${Date.now().toString(36).toUpperCase()}`;
    const signTime = new Date().toISOString();

    setFiles(prev => ({
      ...prev,
      integrityPact: {
        type: 'online',
        name: `Pakta_Integritas_${formData.schoolName.replace(/\s+/g, '_') || 'Resmi'}.pdf`,
        signedBy: formData.officialName || 'Official Tim',
        signedAt: signTime,
        signCode: signCode,
        signatureUrl: signatureDataUrl,
        url: signatureDataUrl,
        size: 'Digital Signed (Online)',
      },
    }));
    setShowPaktaModal(false);
  }

  // Step Validations
  function validateStep1() {
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setValidationError('Alamat email aktif untuk akun wajib diisi dengan benar.');
      return false;
    }
    if (!formData.schoolName.trim()) {
      setValidationError('Nama lengkap sekolah wajib diisi.');
      return false;
    }
    if (!files.schoolLogo) {
      setValidationError('Logo sekolah wajib diunggah.');
      return false;
    }
    setValidationError('');
    return true;
  }

  function validateStep2() {
    if (!formData.dantonName.trim()) {
      setValidationError('Nama komandan peleton (Danton) wajib diisi.');
      return false;
    }
    if (!files.dantonCard) {
      setValidationError('Foto Kartu Pelajar Komandan wajib diunggah.');
      return false;
    }
    if (!formData.officialName.trim()) {
      setValidationError('Nama Official / Pelatih wajib diisi.');
      return false;
    }
    if (!files.officialKtp) {
      setValidationError('Foto KTP Official / Pelatih wajib diunggah.');
      return false;
    }
    setValidationError('');
    return true;
  }

  function validateStep3() {
    if (!files.paymentProof) {
      setValidationError('Bukti transfer pembayaran pendaftaran wajib diunggah.');
      return false;
    }
    if (!files.selfie) {
      setValidationError('Foto selfie pemohon wajib diunggah (wajib aplikasi Watchfinder).');
      return false;
    }
    if (!formData.confirmWatchfinder) {
      setValidationError('Centang konfirmasi bahwa foto selfie diambil menggunakan aplikasi Watchfinder.');
      return false;
    }
    if (!files.integrityPact) {
      setValidationError('Pakta Integritas Online wajib ditandatangani secara digital.');
      return false;
    }
    if (!formData.agreeJuknis) {
      setValidationError('Mohon centang persetujuan Petunjuk Teknis Resmi LBB Mu\'allimin 2026.');
      return false;
    }
    setValidationError('');
    return true;
  }

  function handleNext() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setValidationError('');
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBack() {
    setValidationError('');
    setStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep3()) return;

    const feeAmount = parseInt(PAYMENT.FEE_DISPLAY.replace(/\D/g, ''), 10) || 450000;

    const newTeam = registerTeam({
      email: formData.email,
      jenjang: formData.jenjang,
      schoolName: formData.schoolName,
      teamType: formData.teamType,
      dantonName: formData.dantonName,
      officialName: formData.officialName,
      waNumber: formData.waNumber,
      feeAmount,
      files,
    });

    setCreatedTeam(newTeam);
    setStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const feeDisplay = `Rp${PAYMENT.FEE_DISPLAY}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-yellow-400" />
            <span>Kembali ke Beranda</span>
          </button>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 block">
              Pendaftaran Lomba
            </span>
            <span className="text-xs font-bold text-slate-300">
              LBB Mu'allimin 2026
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        {step < 4 && (
          <div className="mb-8">
            <div className="text-center max-w-xl mx-auto mb-6">
              <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white">
                Formulir Pendaftaran Lomba
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                Lengkapi 12 data dan berkas persyaratan peleton. Foto selfie wajib menggunakan aplikasi Watchfinder dan Pakta Integritas ditandatangani secara online.
              </p>
            </div>

            {/* Stepper Progress */}
            <div className="flex items-center justify-between relative max-w-lg mx-auto px-4">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 -translate-y-1/2 z-0 transition-all duration-300"
                style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
              ></div>

              {/* Step 1 indicator */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                    step >= 1
                      ? 'bg-yellow-400 text-slate-950 ring-4 ring-yellow-400/20 shadow-lg'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  1
                </div>
                <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  Sekolah & Akun
                </span>
              </div>

              {/* Step 2 indicator */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                    step >= 2
                      ? 'bg-yellow-400 text-slate-950 ring-4 ring-yellow-400/20 shadow-lg'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  2
                </div>
                <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  Danton & Official
                </span>
              </div>

              {/* Step 3 indicator */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                    step >= 3
                      ? 'bg-yellow-400 text-slate-950 ring-4 ring-yellow-400/20 shadow-lg'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  3
                </div>
                <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  Watchfinder & Pakta
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Validation error banner */}
        {validationError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-xs animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{validationError}</span>
          </div>
        )}

        {/* ================= STEP 1: SEKOLAH & AKUN ================= */}
        {step === 1 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
                <School className="w-5 h-5 text-yellow-400" />
                <span>1. Identitas Sekolah, Akun & Tipe Pasukan</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Lengkapi data dasar sekolah, email aktif untuk akses login calon peserta, dan tipe peleton.
              </p>
            </div>

            <div className="space-y-5">
              {/* 1. Email aktif untuk akun */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-yellow-400" />
                  <span>1. Email Aktif untuk Akun Portal <span className="text-red-400">*</span></span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="contoh: tonti.smpn1yk@gmail.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />
                <p className="text-[11px] text-amber-400/90 mt-1.5 flex items-center gap-1">
                  <Lock className="w-3 h-3 shrink-0" />
                  <span>Email ini akan digunakan untuk masuk ke portal setelah pendaftaran Anda di-ACC oleh Admin.</span>
                </p>
              </div>

              {/* 2. Jenjang Sekolah */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  2. Jenjang Sekolah <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['SD', 'SMP'].map(j => (
                    <button
                      key={j}
                      type="button"
                      onClick={() => setFormData({ ...formData, jenjang: j })}
                      className={`py-3 px-4 rounded-xl border text-center transition-all font-black text-sm flex items-center justify-center gap-2 ${
                        formData.jenjang === j
                          ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400 shadow-md ring-1 ring-yellow-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Tingkat {j === 'SD' ? 'SD / MI' : 'SMP / MTs'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Nama Sekolah */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  3. Nama Resmi Sekolah <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SMP Negeri 1 Yogyakarta"
                  value={formData.schoolName}
                  onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />
              </div>

              {/* 4. Upload Logo Sekolah */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-yellow-400" />
                  <span>4. Upload Logo Sekolah (Format Gambar) <span className="text-red-400">*</span></span>
                </label>
                <div className="p-4 bg-slate-950 border border-dashed border-slate-800 hover:border-yellow-400/60 rounded-2xl transition-colors text-center">
                  {files.schoolLogo ? (
                    <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <img
                          src={files.schoolLogo.url}
                          alt="Logo Preview"
                          className="w-12 h-12 object-contain bg-white rounded-lg p-1"
                        />
                        <div className="text-left">
                          <p className="text-xs font-bold text-white truncate max-w-xs">{files.schoolLogo.name}</p>
                          <span className="text-[10px] text-emerald-400 font-semibold">✓ Siap diunggah ({files.schoolLogo.size})</span>
                        </div>
                      </div>
                      <label className="cursor-pointer text-xs font-bold text-yellow-400 hover:underline px-3 py-1 bg-yellow-400/10 rounded-lg">
                        Ganti
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileChange('schoolLogo', e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center py-4">
                      <UploadCloud className="w-8 h-8 text-yellow-400 mb-2" />
                      <span className="text-xs font-bold text-slate-200">Klik untuk memilih file Logo Sekolah</span>
                      <span className="text-[11px] text-slate-500 mt-1">PNG, JPG, JPEG (Maks. 3 MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileChange('schoolLogo', e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* 5. Homogen apa Heterogen */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  5. Tipe Pasukan Peleton <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Homogen', title: 'Homogen', desc: 'Seluruh personil sejenis (Putra semua / Putri semua)' },
                    { id: 'Heterogen', title: 'Heterogen', desc: 'Personil campuran (Kombinasi Putra & Putri)' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, teamType: t.id })}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.teamType === t.id
                          ? 'bg-yellow-400/10 border-yellow-400 text-white ring-1 ring-yellow-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-black uppercase block text-yellow-400">{t.title}</span>
                      <span className="text-[11px] text-slate-400 mt-1 block leading-relaxed">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95 transition-all"
              >
                <span>Lanjut ke Danton & Official</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: KOMANDAN & OFFICIAL ================= */}
        {step === 2 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
                <Users className="w-5 h-5 text-yellow-400" />
                <span>2. Komandan Peleton & Official Pelatih</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Lengkapi identitas komandan peleton beserta kartu pelajar, serta data pelatih/official dengan KTP.
              </p>
            </div>

            <div className="space-y-6">
              {/* Box Komandan (Danton) */}
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-yellow-400 font-black text-xs uppercase tracking-wider">
                  <UserCheck className="w-4 h-4" />
                  <span>Data Komandan Peleton (Danton)</span>
                </div>

                {/* 6. Nama Komandan */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    6. Nama Komandan Peleton (Danton) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap komandan siswa"
                    value={formData.dantonName}
                    onChange={e => setFormData({ ...formData, dantonName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                {/* 7. Upload Kartu Pelajar Komandan */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <FileUp className="w-3.5 h-3.5 text-yellow-400" />
                    <span>7. Upload Kartu Pelajar Komandan (Foto / PDF) <span className="text-red-400">*</span></span>
                  </label>
                  <div className="p-3 bg-slate-900 border border-dashed border-slate-800 hover:border-yellow-400/60 rounded-xl transition-colors">
                    {files.dantonCard ? (
                      <div className="flex items-center justify-between p-2">
                        <span className="text-xs font-bold text-white truncate max-w-sm">✓ {files.dantonCard.name} ({files.dantonCard.size})</span>
                        <label className="cursor-pointer text-xs font-bold text-yellow-400 hover:underline px-3 py-1 bg-yellow-400/10 rounded-lg">
                          Ganti File
                          <input type="file" accept="image/*,.pdf" onChange={e => handleFileChange('dantonCard', e)} className="hidden" />
                        </label>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex items-center justify-center gap-2 py-3 text-xs font-bold text-slate-300">
                        <UploadCloud className="w-4 h-4 text-yellow-400" />
                        <span>Pilih Foto Kartu Pelajar Danton</span>
                        <input type="file" accept="image/*,.pdf" onChange={e => handleFileChange('dantonCard', e)} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Box Official / Pelatih */}
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-yellow-400 font-black text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Data Official / Pelatih Pendamping</span>
                </div>

                {/* 8. Nama Official/Pelatih */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    8. Nama Lengkap Official / Pelatih <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap official / guru pendamping"
                    value={formData.officialName}
                    onChange={e => setFormData({ ...formData, officialName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                {/* No WhatsApp Official */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Nomor WhatsApp Official / Pelatih (Aktif)
                  </label>
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={formData.waNumber}
                    onChange={e => setFormData({ ...formData, waNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                {/* 9. Upload KTP Official/Pelatih */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <FileUp className="w-3.5 h-3.5 text-yellow-400" />
                    <span>9. Upload KTP Official / Pelatih (Foto / PDF) <span className="text-red-400">*</span></span>
                  </label>
                  <div className="p-3 bg-slate-900 border border-dashed border-slate-800 hover:border-yellow-400/60 rounded-xl transition-colors">
                    {files.officialKtp ? (
                      <div className="flex items-center justify-between p-2">
                        <span className="text-xs font-bold text-white truncate max-w-sm">✓ {files.officialKtp.name} ({files.officialKtp.size})</span>
                        <label className="cursor-pointer text-xs font-bold text-yellow-400 hover:underline px-3 py-1 bg-yellow-400/10 rounded-lg">
                          Ganti File
                          <input type="file" accept="image/*,.pdf" onChange={e => handleFileChange('officialKtp', e)} className="hidden" />
                        </label>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex items-center justify-center gap-2 py-3 text-xs font-bold text-slate-300">
                        <UploadCloud className="w-4 h-4 text-yellow-400" />
                        <span>Pilih Foto KTP Official / Pelatih</span>
                        <input type="file" accept="image/*,.pdf" onChange={e => handleFileChange('officialKtp', e)} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-white/5 text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95 transition-all"
              >
                <span>Lanjut ke Berkas & Pakta Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: BERKAS, WATCHFINDER & PAKTA ONLINE ================= */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-yellow-400" />
                <span>3. Pembayaran, Selfie Watchfinder & Pakta Integritas Online</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Unggah bukti transfer pembayaran, foto selfie wajib aplikasi Watchfinder, dan tanda tangani Pakta Integritas secara online.
              </p>
            </div>

            {/* Kotak Rekening Resmi */}
            <div className="p-4 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl border border-yellow-400/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 block">
                    Rekening Resmi Bendahara LBB Mu'allimin 2026
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-white">{PAYMENT.BANK_NAME}:</span>
                    <span className="text-base font-mono font-black text-yellow-400">{PAYMENT.ACCOUNT_NUMBER}</span>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="px-2 py-0.5 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 text-[10px] font-bold rounded flex items-center gap-1"
                    >
                      {copiedAccount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAccount ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-300 block mt-1">
                    a.n. <strong className="text-white font-bold">{PAYMENT.ACCOUNT_NAME || PAYMENT.ACCOUNT_HOLDER}</strong>
                  </span>
                  <span className="text-[10px] text-amber-300/90 block mt-0.5">
                    Format Berita: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-yellow-400 font-mono font-bold">{PAYMENT.TRANSFER_NOTE_FORMAT}</code>
                  </span>
                </div>
                <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Biaya Registrasi ({formData.jenjang})</span>
                  <span className="text-xl font-mono font-black text-white">{feeDisplay}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* 10. Bukti Pembayaran */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-yellow-400" />
                  <span>10. Upload Bukti Transfer Pembayaran <span className="text-red-400">*</span></span>
                </label>
                <div className="p-4 bg-slate-950 border border-dashed border-slate-800 hover:border-yellow-400/60 rounded-xl transition-colors">
                  {files.paymentProof ? (
                    <div className="flex items-center justify-between p-2">
                      <span className="text-xs font-bold text-white truncate max-w-sm">✓ {files.paymentProof.name} ({files.paymentProof.size})</span>
                      <label className="cursor-pointer text-xs font-bold text-yellow-400 hover:underline px-3 py-1 bg-yellow-400/10 rounded-lg">
                        Ganti Bukti
                        <input type="file" accept="image/*,.pdf" onChange={e => handleFileChange('paymentProof', e)} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex items-center justify-center gap-2 py-3 text-xs font-bold text-slate-300">
                      <UploadCloud className="w-4 h-4 text-yellow-400" />
                      <span>Pilih Foto / Screenshot Struk Bukti Transfer</span>
                      <input type="file" accept="image/*,.pdf" onChange={e => handleFileChange('paymentProof', e)} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* 11. Foto Selfie WAJIB WATCHFINDER */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-yellow-400/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-yellow-400" />
                    <span>11. Foto Selfie Verifikasi Pemohon (Wajib Aplikasi Watchfinder) <span className="text-red-400">*</span></span>
                  </label>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-yellow-400/10 text-yellow-300 border border-yellow-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Watchfinder Verified</span>
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Foto selfie pemohon/official wajib menggunakan aplikasi <strong>Watchfinder</strong> (atau GPS Map / Timestamp Camera) yang memuat watermark waktu (tanggal & jam) serta lokasi secara otomatis tercetak pada foto.
                </p>

                <div className="p-4 bg-slate-900 border border-dashed border-slate-800 hover:border-yellow-400/60 rounded-xl transition-colors">
                  {files.selfie ? (
                    <div className="flex items-center justify-between p-2">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={files.selfie.url} alt="Selfie Watchfinder" className="w-16 h-16 object-cover rounded-lg border border-yellow-400/40" />
                          <span className="absolute bottom-0 right-0 bg-black/80 text-[8px] font-mono text-yellow-400 px-1 rounded-br-lg">GPS</span>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white truncate max-w-xs block">✓ {files.selfie.name}</span>
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span>Foto Watchfinder siap diverifikasi</span>
                          </span>
                        </div>
                      </div>
                      <label className="cursor-pointer text-xs font-bold text-yellow-400 hover:underline px-3 py-1.5 bg-yellow-400/10 rounded-lg">
                        Ganti Foto
                        <input type="file" accept="image/*" onChange={e => handleFileChange('selfie', e)} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center gap-2 py-3 text-xs font-bold text-slate-300">
                      <Camera className="w-7 h-7 text-yellow-400" />
                      <span>Upload Foto Selfie Hasil Aplikasi Watchfinder</span>
                      <span className="text-[10px] text-slate-500 font-normal">Format JPG/PNG • Pastikan stempel tanggal & koordinat terbaca jelas</span>
                      <input type="file" accept="image/*" onChange={e => handleFileChange('selfie', e)} className="hidden" />
                    </label>
                  )}
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.confirmWatchfinder}
                    onChange={e => setFormData({ ...formData, confirmWatchfinder: e.target.checked })}
                    className="mt-0.5 rounded border-slate-700 text-yellow-500 focus:ring-yellow-400 w-4 h-4"
                  />
                  <span className="text-xs text-slate-300 leading-tight">
                    Saya menyatakan dengan sesungguhnya bahwa foto selfie ini diambil secara langsung menggunakan aplikasi <strong>Watchfinder / Timestamp Camera</strong> asli tanpa suntingan buatan.
                  </span>
                </label>
              </div>

              {/* 12. PAKTA INTEGRITAS ONLINE (DIGITAL SIGNATURE) */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-yellow-400" />
                    <span>12. Pakta Integritas Resmi (Tanda Tangan Online) <span className="text-red-400">*</span></span>
                  </label>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Online E-Signature
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Tidak perlu mencetak dan memindai kertas. Anda dapat membaca 5 butir pernyataan integritas dan membubuhkan <strong>Tanda Tangan Digital Resmi</strong> secara langsung online di bawah ini.
                </p>

                {files.integrityPact ? (
                  <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg p-1 border border-slate-200 flex items-center justify-center shrink-0">
                        {files.integrityPact.signatureUrl ? (
                          <img src={files.integrityPact.signatureUrl} alt="TTD Digital" className="max-h-full object-contain" />
                        ) : (
                          <FileCheck className="w-6 h-6 text-emerald-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">Pakta Integritas Ditandatangani Online</span>
                          <span className="text-[9px] bg-emerald-400 text-slate-950 font-black px-1.5 py-0.2 rounded">SAH</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Oleh: <strong className="text-slate-200">{files.integrityPact.signedBy}</strong> • Kode: <span className="font-mono text-yellow-400">{files.integrityPact.signCode}</span>
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPaktaModal(true)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-bold text-white rounded-lg transition-colors shrink-0"
                    >
                      Ubah Tanda Tangan
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaktaModal(true);
                      setHasSignature(false);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-blue-600/20 via-sky-600/20 to-blue-600/20 hover:from-blue-600/30 hover:to-sky-600/30 border border-sky-400/40 text-sky-300 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all group"
                  >
                    <PenTool className="w-4 h-4 text-sky-400 group-hover:rotate-12 transition-transform" />
                    <span>Buka & Tanda Tangani Pakta Integritas Online Sekarang</span>
                  </button>
                )}
              </div>

              {/* Checklist Persetujuan Juknis */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.agreeJuknis}
                    onChange={e => setFormData({ ...formData, agreeJuknis: e.target.checked })}
                    className="mt-0.5 rounded border-slate-700 text-yellow-500 focus:ring-yellow-400 w-4 h-4"
                  />
                  <span className="text-xs text-slate-300 leading-relaxed">
                    Saya menyetujui seluruh ketentuan dalam <strong>Petunjuk Teknis (Juknis) Resmi LBB Mu'allimin 2026</strong> dan bersedia mematuhi seluruh keputusan dewan juri yang bersifat mutlak serta tidak dapat diganggu gugat.
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-white/5 text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>

              <button
                type="submit"
                className="px-7 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <span>Kirim Pendaftaran Peleton</span>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 4: SUBMISSION CONFIRMATION (MENUNGGU ACC) ================= */}
        {step === 4 && createdTeam && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-center max-w-2xl mx-auto shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-400/20 border border-amber-400/40 text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-amber-400/10 animate-bounce">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full">
                Status: Menunggu ACC Admin
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight mt-3">
                Pendaftaran Berhasil Dikirim!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Data peleton <strong className="text-white">{createdTeam.schoolName}</strong> beserta selfie Watchfinder dan Pakta Integritas Online telah masuk ke antrean verifikasi Sekretariat LBB Mu'allimin 2026.
              </p>
            </div>

            {/* Registration Code Badge */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 inline-block text-left w-full">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2 mb-2 text-xs">
                <span className="text-slate-400 font-medium">Kode Pendaftaran:</span>
                <span className="font-mono font-black text-yellow-400 text-sm">{createdTeam.regCode}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2 mb-2 text-xs">
                <span className="text-slate-400 font-medium">Email Akun Portal:</span>
                <span className="font-mono font-bold text-white">{createdTeam.email}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2 mb-2 text-xs">
                <span className="text-slate-400 font-medium">Pakta Integritas:</span>
                <span className="text-emerald-400 font-bold">✓ Ditandatangani Digital Online</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Tipe Pasukan:</span>
                <span className="font-bold text-slate-300">{createdTeam.teamType} ({createdTeam.jenjang})</span>
              </div>
            </div>

            {/* Next Step Info */}
            <div className="p-4 bg-blue-950/40 border border-blue-800/50 rounded-2xl text-left text-xs text-blue-200 leading-relaxed space-y-2">
              <p className="font-bold flex items-center gap-1.5 text-blue-300">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>Petunjuk Akses Login Portal Calon Peserta:</span>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300 text-[11px]">
                <li>Admin panitia akan memeriksa kelengkapan berkas, foto selfie Watchfinder, dan tanda tangan pakta integritas online Anda.</li>
                <li>Setelah Admin memberikan <strong>persetujuan (ACC)</strong>, akun Anda resmi aktif sebagai calon peserta.</li>
                <li>Gunakan email <strong className="text-white">{createdTeam.email}</strong> pada menu <strong>Masuk Portal</strong> untuk mengakses dashboard resmi.</li>
              </ul>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveView('landing')}
                className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
              >
                Kembali ke Beranda
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Coba Masuk Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL PAKTA INTEGRITAS ONLINE ================= */}
      {showPaktaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 block">
                  Dokumen Resmi Digital
                </span>
                <h3 className="text-lg font-black text-white uppercase italic">
                  Pakta Integritas & Pernyataan Keabsahan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPaktaModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Konten Surat Pakta Integritas */}
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <p className="font-semibold text-white">
                Yang bertanda tangan di bawah ini secara sah dan sadar:
              </p>
              <div className="grid grid-cols-3 gap-1 text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">Nama Official:</span>
                <span className="col-span-2 font-bold text-white">{formData.officialName || '(Nama Official di Step 2)'}</span>
                <span className="text-slate-400">Pangkalan:</span>
                <span className="col-span-2 font-bold text-white">{formData.schoolName || '(Nama Sekolah di Step 1)'}</span>
                <span className="text-slate-400">Kategori:</span>
                <span className="col-span-2 font-bold text-white">{formData.teamType} Tingkat {formData.jenjang}</span>
              </div>

              <p className="font-bold text-yellow-400 text-[11px] pt-1 uppercase tracking-wider">
                Menyatakan dengan sesungguhnya bahwa:
              </p>
              <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-slate-300">
                <li>Seluruh anggota peleton yang didaftarkan adalah siswa/siswi aktif dari sekolah bersangkutan yang dibuktikan dengan Kartu Pelajar sah.</li>
                <li>Tidak memanipulasi identitas, usia, jenjang sekolah, maupun data personel peleton.</li>
                <li>Menjunjung tinggi kehormatan korps, sportivitas luhur, dan integritas perlombaan baris berbaris.</li>
                <li>Mentaati seluruh Petunjuk Teknis LBB Mu'allimin 2026 dan menerima keputusan Dewan Juri secara mutlak.</li>
                <li>Bersedia menerima sanksi diskualifikasi apabila ditemukan pelanggaran terhadap butir-butir pakta ini.</li>
              </ol>
            </div>

            {/* Canvas Tanda Tangan Digital */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Bubuhkan Tanda Tangan Digital di Bawah Ini:</span>
                </label>
                <button
                  type="button"
                  onClick={clearCanvasSignature}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Bersihkan / Ulangi</span>
                </button>
              </div>

              <div className="border-2 border-dashed border-slate-700 bg-white rounded-2xl overflow-hidden cursor-crosshair touch-none">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-36 block"
                />
              </div>
              <p className="text-[10px] text-slate-400 text-center italic">
                *Gunakan jari pada layar sentuh ponsel atau kursor mouse pada laptop untuk membubuhkan tanda tangan.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowPaktaModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={saveOnlineSignature}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-slate-950" />
                <span>Simpan & Sahkan Pakta Integritas Online</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 px-6 text-center text-[11px] text-slate-500">
        © 2026 Panitia Lomba Baris Berbaris (LBB) Madrasah Mu'allimin Muhammadiyah Yogyakarta
      </footer>
    </div>
  );
}
