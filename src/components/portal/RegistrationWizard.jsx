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
  MapPin,
  ExternalLink,
  Sparkles,
  Shield,
  FileCheck,
  ChevronDown,
  MessageCircle,
  Phone
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { PAYMENT, CONTACT, SITE } from '../../config.js';
import logoImg from '../../assets/logo-tonti.png';

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
    jenjang: '', // 2. Jenjang sekolah SD apa SMP (default: belum dipilih)
    schoolName: '', // 3. Nama Sekolah
    teamUnit: 'Tunggal', // Pembeda Peleton: 'Tunggal' | 'Tim A' | 'Tim B'
    schoolRegion: 'Kota Yogyakarta', // Daerah di D.I. Yogyakarta
    schoolAddress: '', // Alamat Lengkap Sekolah
    teamType: '', // 5. Homogen apa Heterogen (default: belum dipilih)
    homogenGender: '', // Pilihan jika homogen: Putra | Putri (default: belum dipilih)
    dantonName: '', // 6. Nama Komandan
    officialName: '', // 8. Nama Official/Pelatih
    waNumber: '',
    agreeJuknis: false,
  });

  // Helper untuk mendapatkan nama lengkap sekolah beserta pembeda peleton (A / B)
  const getFullSchoolName = () => {
    const raw = (formData.schoolName || '').trim().toUpperCase();
    if (!raw) return '';
    if (formData.teamUnit && formData.teamUnit !== 'Tunggal') {
      const suffix = formData.teamUnit === 'Tim A' || formData.teamUnit === 'A' ? 'A' : 'B';
      // Cek jika sudah diakhiri spasi A / spasi B atau (Tim A)
      if (raw.endsWith(` ${suffix}`)) {
        return raw;
      }
      return `${raw} ${suffix}`;
    }
    return raw;
  };

  // Files State for the required uploads
  const [files, setFiles] = useState({
    schoolLogo: null, // 4. Upload Logo Sekolah
    dantonCard: null, // 7. Upload Kartu Pelajar Komandan
    officialKtp: null, // 9. Upload KTP Official/Pelatih
    paymentProof: null, // 10. Bukti Pembayaran
    integrityPact: null, // 11. Pakta Integritas (Online / Digital Signed)
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

      // If it's an image (either by MIME type or extension)
      const isImgFile = (file.type && file.type.startsWith('image/')) || ALLOWED_IMAGE_EXTS.includes(ext);
      if (isImgFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
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
        name: `Pakta_Integritas_${(getFullSchoolName() || 'Resmi').replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')}.pdf`,
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
    if (!formData.jenjang) {
      setValidationError('Silakan pilih Jenjang Sekolah (SD/MI atau SMP/MTs).');
      return false;
    }
    if (!formData.schoolName.trim()) {
      setValidationError('Nama lengkap sekolah wajib diisi.');
      return false;
    }
    if (!formData.schoolAddress.trim()) {
      setValidationError('Alamat lengkap sekolah wajib diisi.');
      return false;
    }
    if (!files.schoolLogo) {
      setValidationError('Logo sekolah wajib diunggah.');
      return false;
    }
    if (!formData.teamType) {
      setValidationError('Silakan pilih Tipe Pasukan Peleton (Homogen atau Heterogen).');
      return false;
    }
    if (formData.teamType === 'Homogen' && !formData.homogenGender) {
      setValidationError('Silakan pilih komposisi Pasukan Homogen (Pasukan Putra atau Pasukan Putri).');
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
    if (!formData.waNumber.trim()) {
      setValidationError('Nomor WhatsApp Official / Pelatih (Aktif) wajib diisi.');
      return false;
    }
    const cleanDigits = formData.waNumber.replace(/\D/g, '');
    if (cleanDigits.length < 9) {
      setValidationError('Nomor WhatsApp tidak valid. Masukkan nomor WhatsApp aktif minimal 9 digit.');
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

    const teamTypeLabel = formData.teamType === 'Homogen'
      ? `Homogen (${formData.homogenGender || 'Putra'})`
      : 'Heterogen';
    const categoryLabel = formData.teamType === 'Homogen'
      ? (formData.homogenGender || 'Putra')
      : 'Campuran';

    const finalSchoolName = getFullSchoolName();

    const fullAddress = `${formData.schoolAddress.trim()}, ${formData.schoolRegion}`;

    const newTeam = registerTeam({
      email: formData.email,
      jenjang: formData.jenjang,
      schoolName: finalSchoolName,
      schoolBaseName: formData.schoolName.trim(),
      teamUnit: formData.teamUnit,
      address: fullAddress,
      schoolAddress: formData.schoolAddress.trim(),
      schoolRegion: formData.schoolRegion,
      platoonName: `Pleton ${finalSchoolName}`,
      teamType: teamTypeLabel,
      category: categoryLabel,
      homogenGender: formData.teamType === 'Homogen' ? (formData.homogenGender || 'Putra') : null,
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative font-sans">
      {/* Background Subtle Grid Pattern (Consistent with Home Page Registration Section) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(#8B0000 1px, transparent 1px), linear-gradient(to right, #8B0000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute left-0 top-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-red-900/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Top Header - Clean White Frosted Navbar matching Homepage */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-950 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-950 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
            <span className="sm:hidden">Beranda</span>
          </button>

          {/* Official Brand Logo */}
          <div className="flex items-center">
            <img
              src={logoImg}
              alt="Logo Tonti Mu'allimin"
              className="h-9 sm:h-10 w-auto filter drop-shadow-xs"
            />
          </div>

          {/* Right Action: WhatsApp Panitia Help */}
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${CONTACT?.WHATSAPP || '6281230093737'}?text=Halo%20Panitia%20LBB%20Mu'allimin%202026,%20saya%20membutuhkan%20bantuan%20pengisian%20formulir%20pendaftaran.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-[11px] font-bold text-red-700 transition-colors shadow-xs"
              title="Bantuan Panitia via WhatsApp"
            >
              <span>Bantuan Panitia</span>
              <ExternalLink className="w-3 h-3 text-red-600" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 relative z-10">
        {step < 4 && (
          <div className="text-center max-w-2xl mx-auto mb-8">
            {/* Event Badge with Pulse */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] mb-3 shadow-xs cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              Juknis Resmi & Registrasi 2026
            </div>

            {/* Clean Brand Heading matching Home Page Registration */}
            <h1 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight text-slate-900 select-none leading-tight py-0.5">
              Formulir{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-600">
                Pendaftaran
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              Lengkapi data dan berkas persyaratan peleton secara lengkap dan sah melalui formulir pendaftaran resmi LBB Mu'allimin 2026.
            </p>
          </div>
        )}

        {/* Validation error banner */}
        {validationError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs shadow-xs animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
            <span className="font-bold">{validationError}</span>
          </div>
        )}

        {/* ================= STEP 1: SEKOLAH & AKUN ================= */}
        {step === 1 && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-sm hover:shadow-md transition-shadow space-y-6 animate-fade">
            <div className="border-b border-slate-100 pb-4 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-700 shrink-0">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase italic tracking-wide">
                  1. Identitas Sekolah, Akun & Tipe Pasukan
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Lengkapi data dasar sekolah, email aktif untuk akses login calon peserta, dan tipe peleton.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* 1. Email aktif untuk akun */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-red-600" />
                  <span>
                    1. Email Aktif untuk Akun Portal <span className="text-red-600 font-bold">*</span>
                  </span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="contoh: tonti.mtsmuallimin@gmail.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 hover:bg-white border border-slate-200 focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-600/10 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                />
                <div className="mt-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-amber-800 leading-relaxed">
                    Gunakan akun email Google aktif. Akses masuk ke portal akun resmi hanya dapat dilakukan melalui Akun Google setelah pendaftaran di-ACC oleh Admin.
                  </span>
                </div>
              </div>

              {/* 2. Jenjang Sekolah */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  2. Jenjang Sekolah <span className="text-red-600 font-bold">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3.5">
                  {[
                    {
                      id: 'SD',
                      label: 'Tingkat SD / MI',
                      badge: 'Kategori SD',
                      activeClass: 'bg-red-50 border-2 border-red-700 text-red-900 shadow-xs ring-2 ring-red-600/10',
                      activeIcon: 'text-red-700',
                      activeBadge: 'bg-red-100 text-red-800 border border-red-200',
                      hoverBorder: 'hover:border-red-300',
                    },
                    {
                      id: 'SMP',
                      label: 'Tingkat SMP / MTs',
                      badge: 'Kategori SMP',
                      activeClass: 'bg-blue-50 border-2 border-blue-600 text-blue-950 shadow-xs ring-2 ring-blue-600/10',
                      activeIcon: 'text-blue-600',
                      activeBadge: 'bg-blue-100 text-blue-800 border border-blue-200',
                      hoverBorder: 'hover:border-blue-300',
                    },
                  ].map(item => {
                    const isSelected = formData.jenjang === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, jenjang: item.id })}
                        className={`py-3.5 px-4 rounded-2xl border text-center transition-all duration-200 font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 ${
                          isSelected
                            ? item.activeClass
                            : `bg-white border border-slate-200 text-slate-600 ${item.hoverBorder} hover:text-slate-900`
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className={`w-4 h-4 ${isSelected ? item.activeIcon : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            isSelected
                              ? item.activeBadge
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Nama Sekolah & Pembeda Peleton (Tim A / Tim B) */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      3. Nama Resmi Sekolah <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="CONTOH: MTS MU'ALLIMIN YOGYAKARTA"
                      value={formData.schoolName}
                      onChange={e => setFormData({ ...formData, schoolName: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-3 bg-slate-50 hover:bg-white border border-slate-200 focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-600/10 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none font-medium uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Pembeda Peleton</span>
                      <span className="text-[10px] text-slate-400 font-normal lowercase">Maks. 2 tim</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.teamUnit}
                        onChange={e => setFormData({ ...formData, teamUnit: e.target.value })}
                        className="w-full px-3.5 py-3 bg-slate-50 hover:bg-white border border-slate-200 focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-600/10 rounded-xl text-sm font-bold text-slate-900 transition-all outline-none cursor-pointer appearance-none uppercase"
                      >
                        <option value="Tunggal">Peleton Tunggal</option>
                        <option value="Tim A">Peleton A</option>
                        <option value="Tim B">Peleton B</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Live Preview Label Format Terdaftar */}
                {formData.schoolName.trim() && (
                  <div className="flex items-center gap-2 px-3.5 py-2 bg-red-50/80 border border-red-100 rounded-xl text-xs text-slate-700 animate-fade">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-red-700 text-white rounded-md shrink-0">
                      Format Terdaftar:
                    </span>
                    <span className="font-bold text-red-950 truncate">
                      {getFullSchoolName()}
                    </span>
                  </div>
                )}

                {/* Input Alamat Sekolah & Pilihan Wilayah D.I. Yogyakarta */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>Alamat Lengkap Sekolah <span className="text-red-600 font-bold">*</span></span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Jl. Letjen S. Parman No. 68, Patangpuluhan, Wirobrajan"
                      value={formData.schoolAddress}
                      onChange={e => setFormData({ ...formData, schoolAddress: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 hover:bg-white border border-slate-200 focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-600/10 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Wilayah / Daerah <span className="text-red-600 font-bold">*</span></span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.schoolRegion}
                        onChange={e => setFormData({ ...formData, schoolRegion: e.target.value })}
                        className="w-full px-3.5 py-3 bg-slate-50 hover:bg-white border border-slate-200 focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-600/10 rounded-xl text-sm font-bold text-slate-900 transition-all outline-none cursor-pointer appearance-none"
                      >
                        <option value="Kota Yogyakarta">Kota Yogyakarta</option>
                        <option value="Kab. Bantul">Kab. Bantul</option>
                        <option value="Kab. Sleman">Kab. Sleman</option>
                        <option value="Kab. Kulon Progo">Kab. Kulon Progo</option>
                        <option value="Kab. Gunungkidul">Kab. Gunungkidul</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Upload Logo Sekolah */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-red-600" />
                  <span>
                    4. Upload Logo Sekolah (Format Gambar) <span className="text-red-600 font-bold">*</span>
                  </span>
                </label>
                <div className="p-4 bg-slate-50/70 border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl transition-all text-center group">
                  {files.schoolLogo ? (
                    <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={files.schoolLogo.url}
                          alt="Logo Preview"
                          className="w-12 h-12 object-contain bg-slate-50 rounded-lg p-1 border border-slate-100"
                        />
                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{files.schoolLogo.name}</p>
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                            <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                            <span>Siap diunggah ({files.schoolLogo.size})</span>
                          </span>
                        </div>
                      </div>
                      <label className="cursor-pointer text-xs font-bold text-red-700 hover:text-red-800 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors">
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
                    <label className="cursor-pointer flex flex-col items-center justify-center py-5">
                      <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-700 mb-2 group-hover:scale-105 transition-transform">
                        <UploadCloud className="w-5 h-5 text-red-700" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Klik untuk memilih file Logo Sekolah</span>
                      <span className="text-[11px] text-slate-500 mt-1">Format PNG, JPG, JPEG (Maks. 3 MB)</span>
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  5. Tipe Pasukan Peleton <span className="text-red-600 font-bold">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3.5">
                  {[
                    { id: 'Homogen', title: 'Homogen', desc: 'Seluruh personil sejenis (Putra semua / Putri semua)' },
                    { id: 'Heterogen', title: 'Heterogen', desc: 'Personil campuran (Kombinasi Putra & Putri)' },
                  ].map(t => {
                    const isSelected = formData.teamType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, teamType: t.id })}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                          isSelected
                            ? 'bg-red-50 border-2 border-red-700 shadow-xs ring-2 ring-red-600/10'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className={`text-xs font-black uppercase block ${isSelected ? 'text-red-800' : 'text-slate-800'}`}>
                          {t.title}
                        </span>
                        <span className="text-[11px] text-slate-500 mt-1 block leading-relaxed">{t.desc}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Pilihan Khusus Pasukan Homogen: Putra atau Putri */}
                {formData.teamType === 'Homogen' && (
                  <div className="mt-3.5 p-4 sm:p-5 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200/90 shadow-xs animate-fade">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-red-100/80 flex items-center justify-center text-red-700 shrink-0 shadow-xs">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <label className="text-xs font-black uppercase tracking-wider text-slate-900 block leading-tight">
                            Pilihan Pasukan Homogen <span className="text-red-600 font-bold">*</span>
                          </label>
                          <span className="text-[11px] text-slate-500">
                            Pilih komposisi jenis kelamin seluruh personil peleton
                          </span>
                        </div>
                      </div>
                      {formData.homogenGender ? (
                        <span className={`self-start sm:self-center text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border transition-all ${
                          formData.homogenGender === 'Putri'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-slate-100 text-slate-800 border-slate-200'
                        }`}>
                          {formData.homogenGender === 'Putri' ? '👧 Peleton Putri' : '👦 Peleton Putra'}
                        </span>
                      ) : (
                        <span className="self-start sm:self-center text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                          Belum dipilih
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          id: 'Putra',
                          label: 'Pasukan Putra',
                          tag: 'Putra Semua',
                          desc: 'Seluruh 25 personil peleton adalah siswa putra',
                          avatarBg: 'bg-slate-900 text-yellow-400',
                        },
                        {
                          id: 'Putri',
                          label: 'Pasukan Putri',
                          tag: 'Putri Semua',
                          desc: 'Seluruh 25 personil peleton adalah siswi putri',
                          avatarBg: 'bg-red-700 text-white',
                        },
                      ].map(g => {
                        const isGenderActive = formData.homogenGender === g.id;
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, homogenGender: g.id })}
                            className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group flex items-start gap-3.5 ${
                              isGenderActive
                                ? 'bg-white border-2 border-red-700 shadow-sm ring-2 ring-red-600/10'
                                : 'bg-slate-50/70 hover:bg-white border border-slate-200/90 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            <div
                              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-xs ${
                                isGenderActive
                                  ? g.avatarBg
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              <UserCheck className="w-5 h-5" />
                            </div>

                            <div className="flex-1 min-w-0 pr-6">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs sm:text-sm font-black uppercase tracking-tight block ${
                                    isGenderActive ? 'text-slate-950' : 'text-slate-700'
                                  }`}
                                >
                                  {g.label}
                                </span>
                                <span
                                  className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                                    isGenderActive
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-slate-200/70 text-slate-600'
                                  }`}
                                >
                                  {g.tag}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                                {g.desc}
                              </p>
                            </div>

                            <div className="absolute top-4 right-4">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isGenderActive
                                    ? 'border-red-700 bg-red-700 text-white shadow-xs'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isGenderActive && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-slate-100">
              <button
                type="button"
                onClick={handleNext}
                className="px-7 py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black rounded-xl shadow-md text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 active:scale-95 transition-all"
              >
                <span>Lanjut ke Danton & Official</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: KOMANDAN & OFFICIAL ================= */}
        {step === 2 && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-sm hover:shadow-md transition-shadow space-y-6 animate-fade">
            <div className="border-b border-slate-100 pb-4 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-700 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase italic tracking-wide">
                  2. Komandan Peleton & Official Pelatih
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Lengkapi identitas komandan peleton beserta kartu pelajar, serta data pelatih/official dengan KTP.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Box Komandan (Danton) */}
              <div className="p-5 sm:p-6 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-black text-xs uppercase tracking-wider bg-white border border-slate-200 px-3 py-1.5 rounded-xl w-fit shadow-xs">
                  <UserCheck className="w-4 h-4 text-red-600" />
                  <span>Data Komandan Peleton (Danton)</span>
                </div>

                {/* 6. Nama Komandan */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    6. Nama Komandan Peleton (Danton) <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="NAMA LENGKAP KOMANDAN SISWA"
                    value={formData.dantonName}
                    onChange={e => setFormData({ ...formData, dantonName: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-600/10 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none uppercase font-medium"
                  />
                </div>

                {/* 7. Upload Kartu Pelajar Komandan */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FileUp className="w-3.5 h-3.5 text-red-600" />
                    <span>
                      7. Upload Kartu Pelajar Komandan (Foto / PDF) <span className="text-red-600 font-bold">*</span>
                    </span>
                  </label>
                  <div className="p-3.5 bg-white border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl transition-all">
                    {files.dantonCard ? (
                      <div className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3 min-w-0">
                          {files.dantonCard.url && files.dantonCard.url.startsWith('data:image') ? (
                            <img
                              src={files.dantonCard.url}
                              alt="Preview Kartu Pelajar"
                              className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border border-slate-200 shadow-xs shrink-0 bg-white"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center text-red-700 shrink-0">
                              <FileText className="w-6 h-6" />
                            </div>
                          )}
                          <div className="min-w-0 text-left">
                            <span className="text-xs font-bold text-slate-900 truncate block">
                              {files.dantonCard.name}
                            </span>
                            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Berhasil diunggah ({files.dantonCard.size})</span>
                            </span>
                          </div>
                        </div>
                        <label className="cursor-pointer text-xs font-bold text-red-700 hover:text-red-800 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors shrink-0 ml-2">
                          Ganti File
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={e => handleFileChange('dantonCard', e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex items-center justify-center gap-2 py-3.5 text-xs font-bold text-slate-700 hover:text-red-700 transition-colors">
                        <UploadCloud className="w-4 h-4 text-red-600" />
                        <span>Pilih Foto / PDF Kartu Pelajar Danton</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={e => handleFileChange('dantonCard', e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Box Official / Pelatih */}
              <div className="p-5 sm:p-6 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-black text-xs uppercase tracking-wider bg-white border border-slate-200 px-3 py-1.5 rounded-xl w-fit shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                  <span>Data Official / Pelatih Pendamping</span>
                </div>

                {/* 8. Nama Official/Pelatih */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    8. Nama Lengkap Official / Pelatih <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="NAMA LENGKAP OFFICIAL / GURU PENDAMPING"
                    value={formData.officialName}
                    onChange={e => setFormData({ ...formData, officialName: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-600/10 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none uppercase font-medium"
                  />
                </div>

                {/* No WhatsApp Official */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>
                      Nomor WhatsApp Official / Pelatih (Aktif) <span className="text-red-600 font-bold">*</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal lowercase">wajib untuk koordinasi</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={formData.waNumber}
                    onChange={e => setFormData({ ...formData, waNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-600/10 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                  />
                </div>

                {/* 9. Upload KTP Official/Pelatih */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FileUp className="w-3.5 h-3.5 text-red-600" />
                    <span>
                      9. Upload KTP Official / Pelatih (Foto / PDF) <span className="text-red-600 font-bold">*</span>
                    </span>
                  </label>
                  <div className="p-3.5 bg-white border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl transition-all">
                    {files.officialKtp ? (
                      <div className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3 min-w-0">
                          {files.officialKtp.url && files.officialKtp.url.startsWith('data:image') ? (
                            <img
                              src={files.officialKtp.url}
                              alt="Preview KTP Official"
                              className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border border-slate-200 shadow-xs shrink-0 bg-white"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center text-red-700 shrink-0">
                              <FileText className="w-6 h-6" />
                            </div>
                          )}
                          <div className="min-w-0 text-left">
                            <span className="text-xs font-bold text-slate-900 truncate block">
                              {files.officialKtp.name}
                            </span>
                            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Berhasil diunggah ({files.officialKtp.size})</span>
                            </span>
                          </div>
                        </div>
                        <label className="cursor-pointer text-xs font-bold text-red-700 hover:text-red-800 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors shrink-0 ml-2">
                          Ganti File
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={e => handleFileChange('officialKtp', e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex items-center justify-center gap-2 py-3.5 text-xs font-bold text-slate-700 hover:text-red-700 transition-colors">
                        <UploadCloud className="w-4 h-4 text-red-600" />
                        <span>Pilih Foto / PDF KTP Official / Pelatih</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={e => handleFileChange('officialKtp', e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-100">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-7 py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black rounded-xl shadow-md text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 active:scale-95 transition-all"
              >
                <span>Lanjut ke Berkas & Pakta Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: BERKAS PEMBAYARAN & PAKTA ONLINE ================= */}
        {step === 3 && (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-sm hover:shadow-md transition-shadow space-y-6 animate-fade"
          >
            <div className="border-b border-slate-100 pb-4 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-700 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase italic tracking-wide">
                  3. Pembayaran & Pakta Integritas Online
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Unggah bukti transfer pembayaran dan tanda tangani Pakta Integritas secara online.
                </p>
              </div>
            </div>

            {/* Kotak Rekening Resmi Bendahara - Clean Slate-900 Card */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white rounded-2xl shadow-md relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 block">
                    Rekening Resmi Bendahara LBB Mu'allimin 2026
                  </span>
                  <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                    <span className="text-sm font-bold text-white">{PAYMENT.BANK_NAME}:</span>
                    <span className="text-lg font-mono font-black text-yellow-400 tracking-wider">
                      {PAYMENT.ACCOUNT_NUMBER}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-black rounded-lg shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAccount ? 'Tersalin' : 'Salin Rekening'}</span>
                    </button>
                  </div>
                  <span className="text-xs text-slate-300 block mt-1.5">
                    a.n. <strong className="text-white font-bold">{PAYMENT.ACCOUNT_NAME || PAYMENT.ACCOUNT_HOLDER}</strong>
                  </span>
                  <span className="text-[11px] text-amber-300 block mt-1">
                    Format Berita Transfer:{' '}
                    <code className="bg-black/40 border border-yellow-400/40 px-2 py-0.5 rounded text-yellow-300 font-mono font-bold">
                      {PAYMENT.TRANSFER_NOTE_FORMAT}
                    </code>
                  </span>
                </div>
                <div className="text-left sm:text-right sm:border-l sm:border-slate-800 sm:pl-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                    Biaya Registrasi ({formData.jenjang})
                  </span>
                  <span className="text-2xl font-mono font-black text-white">{feeDisplay}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* 10. Bukti Pembayaran */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-red-600" />
                  <span>
                    10. Upload Bukti Transfer Pembayaran <span className="text-red-600 font-bold">*</span>
                  </span>
                </label>
                <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl transition-all">
                  {files.paymentProof ? (
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        {files.paymentProof.url && files.paymentProof.url.startsWith('data:image') ? (
                          <img
                            src={files.paymentProof.url}
                            alt="Preview Bukti Transfer"
                            className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-slate-200 shadow-xs shrink-0 bg-white"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                            <FileText className="w-7 h-7" />
                          </div>
                        )}
                        <div className="min-w-0 text-left">
                          <span className="text-xs font-bold text-slate-900 truncate block">
                            {files.paymentProof.name}
                          </span>
                          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Bukti transfer berhasil diunggah ({files.paymentProof.size})</span>
                          </span>
                        </div>
                      </div>
                      <label className="cursor-pointer text-xs font-bold text-red-700 hover:text-red-800 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors shrink-0 ml-2">
                        Ganti Bukti
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={e => handleFileChange('paymentProof', e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4 text-xs font-bold text-slate-700 hover:text-red-700 transition-colors">
                      <UploadCloud className="w-6 h-6 text-red-600" />
                      <span>Pilih Foto / Screenshot Struk Bukti Transfer</span>
                      <span className="text-[10px] text-slate-500 font-normal">Format JPG, PNG, PDF (Maks. 5 MB)</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={e => handleFileChange('paymentProof', e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* 11. PAKTA INTEGRITAS ONLINE (DIGITAL SIGNATURE) */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-red-700" />
                    <span>
                      11. Pakta Integritas Resmi (Tanda Tangan Online) <span className="text-red-600 font-bold">*</span>
                    </span>
                  </label>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                    Online E-Signature
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Tidak perlu mencetak dan memindai kertas. Anda dapat membaca 5 butir pernyataan integritas dan membubuhkan{' '}
                  <strong className="text-slate-900">Tanda Tangan Digital Resmi</strong> secara langsung online di bawah ini.
                </p>

                {files.integrityPact ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg p-1 border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                        {files.integrityPact.signatureUrl ? (
                          <img
                            src={files.integrityPact.signatureUrl}
                            alt="TTD Digital"
                            className="max-h-full object-contain"
                          />
                        ) : (
                          <FileCheck className="w-6 h-6 text-emerald-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">Pakta Integritas Ditandatangani Online</span>
                          <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded">
                            SAH
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-600 block mt-0.5">
                          Oleh: <strong className="text-slate-900">{files.integrityPact.signedBy}</strong> • Kode:{' '}
                          <span className="font-mono text-red-700 font-bold">{files.integrityPact.signCode}</span>
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPaktaModal(true)}
                      className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg transition-colors shrink-0"
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
                    className="w-full py-3.5 bg-red-700 hover:bg-red-800 text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.99]"
                  >
                    <PenTool className="w-4 h-4 text-white" />
                    <span>Buka & Tanda Tangani Pakta Integritas Online Sekarang</span>
                  </button>
                )}
              </div>

              {/* Checklist Persetujuan Juknis */}
              <div className="space-y-3 pt-1">
                <label className="flex items-start gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-slate-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.agreeJuknis}
                    onChange={e => setFormData({ ...formData, agreeJuknis: e.target.checked })}
                    className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-600 w-4 h-4"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    Saya menyetujui seluruh ketentuan dalam{' '}
                    <strong className="text-slate-900">Petunjuk Teknis (Juknis) Resmi LBB Mu'allimin 2026</strong> dan bersedia mematuhi seluruh keputusan dewan juri yang bersifat mutlak serta tidak dapat diganggu gugat.
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-100">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>

              <button
                type="submit"
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <span>Kirim Pendaftaran Peleton</span>
                <CheckCircle2 className="w-4 h-4 text-white stroke-[2.5]" />
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 4: SUBMISSION CONFIRMATION (MENUNGGU ACC) ================= */}
        {step === 4 && createdTeam && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 text-center max-w-2xl mx-auto shadow-sm space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-1">
              <img
                src={logoImg}
                alt="Logo Tonti Mu'allimin"
                className="h-14 w-auto filter drop-shadow-xs"
              />
            </div>

            <div className="w-14 h-14 bg-amber-50 border border-amber-200 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <Clock className="w-7 h-7" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-800 bg-amber-100 border border-amber-200 px-3.5 py-1 rounded-full">
                Status: Menunggu ACC Admin
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase italic tracking-tight mt-3">
                Pendaftaran Berhasil Dikirim!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Data peleton <strong className="text-slate-900">{createdTeam.schoolName}</strong> beserta seluruh berkas dan Pakta Integritas Online telah masuk ke antrean verifikasi Sekretariat LBB Mu'allimin 2026.
              </p>
            </div>

            {/* Registration Code Badge */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 inline-block text-left w-full shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2.5 mb-2.5 text-xs">
                <span className="text-slate-500 font-medium">Kode Pendaftaran:</span>
                <span className="font-mono font-black text-red-700 text-sm">{createdTeam.regCode}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2.5 mb-2.5 text-xs">
                <span className="text-slate-500 font-medium">Email Akun Portal:</span>
                <span className="font-mono font-bold text-slate-900">{createdTeam.email}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2.5 mb-2.5 text-xs">
                <span className="text-slate-500 font-medium">Pakta Integritas:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Ditandatangani Digital Online</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Tipe Pasukan:</span>
                <span className="font-bold text-slate-800">
                  {createdTeam.teamType} ({createdTeam.jenjang})
                </span>
              </div>
            </div>

            {/* Next Step Info */}
            <div className="p-4 sm:p-5 bg-amber-50/80 border border-amber-200 rounded-2xl text-left text-xs text-slate-700 leading-relaxed space-y-2">
              <p className="font-black flex items-center gap-1.5 text-amber-900 uppercase tracking-wider text-[11px]">
                <Lock className="w-4 h-4 text-amber-700" />
                <span>Petunjuk Akses Masuk Portal Calon Peserta:</span>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
                <li>Admin panitia akan memeriksa kelengkapan berkas administrasi dan tanda tangan pakta integritas online Anda.</li>
                <li>Setelah Admin memberikan <strong className="text-slate-900">persetujuan (ACC)</strong>, akun Anda resmi aktif sebagai calon peserta.</li>
                <li>Masuk akun dilakukan <strong className="text-red-700">hanya lewat Google</strong> menggunakan email <strong className="text-slate-900">{createdTeam.email}</strong> pada menu <strong className="text-slate-900">Daftar/Masuk</strong>.</li>
              </ul>
            </div>

            {/* WhatsApp Confirmation Banner (Direct Link tanpa modal popup) */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-500/30 rounded-2xl text-left space-y-3 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MessageCircle className="w-5 h-5 fill-white/20" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                    Konfirmasi Panitia (Opsional)
                  </span>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">
                    Kirim Konfirmasi Pendaftaran ke Kak Rusyda
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Beri tahu panitia via WhatsApp resmi jika ingin konfirmasi langsung agar berkas dan verifikasi dapat dicek lebih awal.
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/6281230093737?text=${encodeURIComponent(
                  `Halo Kak Rusyda (Panitia LBB Mu'allimin 2026),\nSaya *${createdTeam.officialName || 'Official'}* dari *${createdTeam.schoolName}* ingin mengonfirmasi bahwa kami telah menyelesaikan pendaftaran online:\n\n• No. Registrasi: *${createdTeam.regCode}*\n• Asal Sekolah: *${createdTeam.schoolName}*\n• Jenjang / Kategori: *${createdTeam.jenjang} / ${createdTeam.teamType}*\n• Komandan: *${createdTeam.dantonName || '-'}*\n• No. WA Official: *${createdTeam.waNumber || '-'}*\n\nBerkas pendaftaran, bukti transfer, dan pakta integritas online sudah kami unggah di website. Mohon bantuan untuk verifikasi. Terima kasih!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Kirim WhatsApp ke Kak Rusyda (0812-3009-3737)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveView('landing')}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
              >
                Kembali ke Beranda
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 text-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-3">
                <img src={logoImg} alt="Logo Tonti" className="h-9 w-auto filter drop-shadow-xs" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-700 block">
                    Dokumen Resmi Digital LBB 2026
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase italic">
                    Pakta Integritas & Keabsahan
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPaktaModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Konten Surat Pakta Integritas */}
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <p className="font-semibold text-slate-900">
                Yang bertanda tangan di bawah ini secara sah dan sadar:
              </p>
              <div className="grid grid-cols-3 gap-1.5 text-[11px] bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500">Nama Official:</span>
                <span className="col-span-2 font-bold text-slate-900">{formData.officialName || '(Nama Official di Step 2)'}</span>
                <span className="text-slate-500">Sekolah:</span>
                <span className="col-span-2 font-bold text-slate-900">{getFullSchoolName() || '(Nama Sekolah di Step 1)'}</span>
                <span className="text-slate-500">Nama Komandan:</span>
                <span className="col-span-2 font-bold text-slate-900">{formData.dantonName || '(Nama Komandan di Step 2)'}</span>
              </div>

              <p className="font-bold text-red-700 text-[11px] pt-1 uppercase tracking-wider">
                Menyatakan dengan sesungguhnya bahwa:
              </p>
              <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-slate-600 leading-relaxed">
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
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-red-700" />
                  <span>Bubuhkan Tanda Tangan Digital di Bawah Ini:</span>
                </label>
                <button
                  type="button"
                  onClick={clearCanvasSignature}
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Bersihkan / Ulangi</span>
                </button>
              </div>

              <div className="border-2 border-dashed border-slate-300 bg-white rounded-2xl overflow-hidden cursor-crosshair touch-none">
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

            <div className="pt-2 flex justify-end gap-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPaktaModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={saveOnlineSignature}
                className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Check className="w-4 h-4 text-white stroke-[3]" />
                <span>Simpan & Sahkan Pakta Integritas</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Mu'allimin Brand Footer */}
      <footer className="border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-500 bg-white">
        © 2026 Panitia Lomba Baris Berbaris (LBB) Madrasah Mu'allimin Muhammadiyah Yogyakarta
      </footer>
    </div>
  );
}
