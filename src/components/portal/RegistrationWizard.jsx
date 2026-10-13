import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  FileText,
  X,
  AlertTriangle
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { PAYMENT, CONTACT } from '../../config.js';
import logoImg from '../../assets/logo-tonti.png';
import titleLogoImg from '../../assets/title-logo.png';

// Subcomponents
import Step1SchoolAndAccount from './registration/Step1SchoolAndAccount.jsx';
import Step2DantonAndOfficial from './registration/Step2DantonAndOfficial.jsx';
import Step3PaymentAndPact from './registration/Step3PaymentAndPact.jsx';
import Step4Confirmation from './registration/Step4Confirmation.jsx';
import IntegrityPactModal from './registration/IntegrityPactModal.jsx';

export default function RegistrationWizard({ isOpen, onClose }) {
  const { registerTeam, setActiveView, goBack, openAuthModal, teams, settings } = useCompetition();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      goBack();
    }
  };

  // Quota calculation per jenjang
  const quotaSD = settings?.quotaSD || 18;
  const quotaSMP = settings?.quotaSMP || 18;
  const registeredSD = (teams || []).filter(t => t.jenjang === 'SD').length;
  const registeredSMP = (teams || []).filter(t => t.jenjang === 'SMP').length;
  const isSDFull = registeredSD >= quotaSD;
  const isSMPFull = registeredSMP >= quotaSMP;
  const isRegOpenMaster = settings?.registrationOpen !== false;

  const [step, setStep] = useState(1);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  const DRAFT_STORAGE_KEY = 'lbb_registration_form_draft_v1';

  // 12 Items Form State with Draft Restoration
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('lbb_registration_form_draft_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.formData && typeof parsed.formData === 'object') {
          return {
            email: '',
            jenjang: '',
            schoolName: '',
            teamUnit: 'Tunggal',
            schoolRegion: 'Kota Yogyakarta',
            schoolAddress: '',
            teamType: '',
            homogenGender: '',
            dantonName: '',
            officialName: '',
            waNumber: '',
            agreeJuknis: false,
            ...parsed.formData,
          };
        }
      }
    } catch (e) {
      console.warn('Failed restoring registration form draft:', e);
    }
    return {
      email: '', // 1. Email aktif untuk akun
      jenjang: '', // 2. Jenjang sekolah SD apa SMP
      schoolName: '', // 3. Nama Sekolah
      teamUnit: 'Tunggal', // Pembeda Peleton: 'Tunggal' | 'Tim A' | 'Tim B'
      schoolRegion: 'Kota Yogyakarta', // Daerah di D.I. Yogyakarta
      schoolAddress: '', // Alamat Lengkap Sekolah
      teamType: '', // 5. Homogen apa Heterogen
      homogenGender: '', // Pilihan jika homogen: Putra | Putri
      dantonName: '', // 6. Nama Komandan
      officialName: '', // 8. Nama Official/Pelatih
      waNumber: '',
      agreeJuknis: false,
    };
  });

  // Check if draft exists on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.formData && (parsed.formData.schoolName || parsed.formData.email)) {
          setHasRestoredDraft(true);
        }
      }
    } catch (e) {}
  }, []);

  // Autosave draft to localStorage whenever formData changes
  useEffect(() => {
    try {
      // Hanya simpan jika ada isian yang relevan
      const hasContent = Boolean(
        formData.email || formData.schoolName || formData.dantonName || formData.officialName || formData.waNumber
      );
      if (hasContent) {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
          formData,
          savedAt: new Date().toISOString()
        }));
      }
    } catch (e) {
      console.warn('Failed saving registration form draft:', e);
    }
  }, [formData]);

  const clearFormDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setFormData({
        email: '',
        jenjang: '',
        schoolName: '',
        teamUnit: 'Tunggal',
        schoolRegion: 'Kota Yogyakarta',
        schoolAddress: '',
        teamType: '',
        homogenGender: '',
        dantonName: '',
        officialName: '',
        waNumber: '',
        agreeJuknis: false,
      });
      setHasRestoredDraft(false);
      setStep(1);
    } catch (e) {}
  };

  // Helper untuk mendapatkan nama lengkap sekolah beserta pembeda peleton (A / B)
  const getFullSchoolName = () => {
    const raw = (formData.schoolName || '').trim().toUpperCase();
    if (!raw) return '';
    if (formData.teamUnit && formData.teamUnit !== 'Tunggal') {
      const suffix = formData.teamUnit === 'Tim A' || formData.teamUnit === 'A' ? 'A' : 'B';
      if (raw.endsWith(` ${suffix}`)) {
        return raw;
      }
      return `${raw} ${suffix}`;
    }
    return raw;
  };

  // Files State for the required uploads
  const [files, setFiles] = useState({
    schoolLogo: null,
    dantonCard: null,
    officialKtp: null,
    paymentProof: null,
    integrityPact: null,
  });

  // Online Pakta Integritas Canvas Modal State
  const [showPaktaModal, setShowPaktaModal] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Submission result
  const [createdTeam, setCreatedTeam] = useState(null);

  // File size & format checks
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

      if (!allowedList.includes(ext)) {
        alert(`Format file "${file.name}" tidak diizinkan! Format yang diterima hanya: ${allowedList.join(', ')}`);
        resolve(null);
        return;
      }

      const maxLimit = isDocument ? MAX_DOC_SIZE : MAX_IMAGE_SIZE;
      if (file.size > maxLimit) {
        const limitMb = Math.round(maxLimit / (1024 * 1024));
        alert(`Ukuran file "${file.name}" (${(file.size / (1024 * 1024)).toFixed(2)} MB) melebihi batas maksimal ${limitMb} MB!`);
        resolve(null);
        return;
      }

      const isImgFile = (file.type && file.type.startsWith('image/')) || ALLOWED_IMAGE_EXTS.includes(ext);
      if (isImgFile) {
        // Khusus Logo Sekolah atau file PNG transparan: Pertahankan file asli apa adanya via FileReader readAsDataURL
        // agar tidak terjadi degradasi kualitas, distorsi pixel, atau hilangnya transparansi alpha channel
        const isPng = file.type === 'image/png' || ext === '.png';
        if (isDocument === false && isPng) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const kb = Math.round(file.size / 1024);
            resolve({
              name: file.name,
              size: `${kb} KB (Original PNG)`,
              uploadedAt: new Date().toISOString(),
              url: e.target?.result || '#',
            });
          };
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const MAX_DIM = 960;
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

            const compressedUrl = isPng
              ? canvas.toDataURL('image/png')
              : canvas.toDataURL('image/jpeg', 0.85);

            const estKb = Math.round((compressedUrl.length * 0.75) / 1024);
            resolve({
              name: file.name,
              size: `${estKb} KB`,
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

  // Canvas Drawing Handlers
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
    ctx.strokeStyle = '#0284c7';
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
    const signCode = `PI-ONLINE-2027-${Date.now().toString(36).toUpperCase()}`;
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
  const errorTimerRef = useRef(null);

  function triggerValidationError(msg, targetSelector) {
    setValidationError(msg);
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }
    // Auto-dismiss setelah 6 detik
    errorTimerRef.current = setTimeout(() => {
      setValidationError('');
    }, 6000);

    if (targetSelector) {
      setTimeout(() => {
        const el = document.querySelector(targetSelector);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (el.focus) el.focus();
        }
      }, 50);
    }
  }

  function validateStep1() {
    if (!isRegOpenMaster) {
      triggerValidationError('Pendaftaran saat ini sedang ditutup oleh panitia.');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      triggerValidationError('Silakan pilih dan hubungkan Akun Google terlebih dahulu.');
      return false;
    }
    if (!formData.jenjang) {
      triggerValidationError('Silakan pilih Jenjang Sekolah (SD/MI atau SMP/MTs).', 'button[type="button"]');
      return false;
    }
    if (formData.jenjang === 'SD' && isSDFull) {
      triggerValidationError('Mohon maaf, kuota peleton untuk tingkat SD/MI telah penuh.');
      return false;
    }
    if (formData.jenjang === 'SMP' && isSMPFull) {
      triggerValidationError('Mohon maaf, kuota peleton untuk tingkat SMP/MTs telah penuh.');
      return false;
    }
    if (!formData.schoolName.trim()) {
      triggerValidationError('Nama lengkap sekolah wajib diisi.', 'input[placeholder*="NAMA LENGKAP SEKOLAH"]');
      return false;
    }
    if (!formData.schoolAddress.trim()) {
      triggerValidationError('Alamat lengkap sekolah wajib diisi.', 'textarea');
      return false;
    }
    if (!files.schoolLogo) {
      triggerValidationError('Logo sekolah wajib diunggah.', 'input[type="file"]');
      return false;
    }
    if (!formData.teamType) {
      triggerValidationError('Silakan pilih Tipe Pasukan Peleton (Homogen atau Heterogen).');
      return false;
    }
    if (formData.teamType === 'Homogen' && !formData.homogenGender) {
      triggerValidationError('Silakan pilih komposisi Pasukan Homogen (Pasukan Putra atau Pasukan Putri).');
      return false;
    }
    setValidationError('');
    return true;
  }

  function validateStep2() {
    if (!formData.dantonName.trim()) {
      triggerValidationError('Nama komandan peleton (Danton) wajib diisi.', 'input[placeholder*="NAMA LENGKAP KOMANDAN"]');
      return false;
    }
    if (!files.dantonCard) {
      triggerValidationError('Foto Kartu Pelajar Komandan wajib diunggah.');
      return false;
    }
    if (!formData.officialName.trim()) {
      triggerValidationError('Nama Official / Pelatih wajib diisi.', 'input[placeholder*="NAMA LENGKAP OFFICIAL"]');
      return false;
    }
    if (!formData.waNumber.trim()) {
      triggerValidationError('Nomor WhatsApp Official / Pelatih (Aktif) wajib diisi.', 'input[type="tel"]');
      return false;
    }
    const cleanDigits = formData.waNumber.replace(/\D/g, '');
    if (cleanDigits.length < 9) {
      triggerValidationError('Nomor WhatsApp tidak valid. Masukkan nomor WhatsApp aktif minimal 9 digit.', 'input[type="tel"]');
      return false;
    }
    if (!files.officialKtp) {
      triggerValidationError('Foto KTP Official / Pelatih wajib diunggah.');
      return false;
    }
    setValidationError('');
    return true;
  }

  function validateStep3() {
    if (!files.paymentProof) {
      triggerValidationError('Bukti transfer pembayaran pendaftaran wajib diunggah.');
      return false;
    }
    if (!files.integrityPact) {
      triggerValidationError('Pakta Integritas Online wajib ditandatangani secara digital.');
      return false;
    }
    if (!formData.agreeJuknis) {
      triggerValidationError('Mohon centang persetujuan Petunjuk Teknis Resmi LBB Mu\'allimin 2027.', 'input[type="checkbox"]');
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

    const feeAmount = parseInt(PAYMENT.FEE_DISPLAY.replace(/\D/g, ''), 10) || 350000;

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
      platoonName: `Peleton ${finalSchoolName}`,
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
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (e) {}
    setStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const feeDisplay = `Rp${PAYMENT.FEE_DISPLAY}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative font-sans overflow-x-hidden">
      {/* Background Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(#8B0000 1px, transparent 1px), linear-gradient(to right, #8B0000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Top Header */}
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
          <div className="flex items-center gap-2.5">
            <img
              src={logoImg}
              alt="Logo Tonti Mu'allimin"
              className="h-8 sm:h-9 w-auto filter drop-shadow-xs shrink-0"
            />
            <img
              src={titleLogoImg}
              alt="LBB Mu'allimin"
              className="h-7 sm:h-8 w-auto object-contain hidden xs:block"
            />
          </div>

          {/* Right Action: WhatsApp Panitia Help */}
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${CONTACT?.WHATSAPP || '6281947491505'}?text=Halo%20Panitia%20LBB%20Mu'allimin%202027,%20saya%20membutuhkan%20bantuan%20pengisian%20formulir%20pendaftaran.`}
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] mb-3 shadow-xs cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              Juknis Resmi & Registrasi 2027
            </div>

            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 select-none leading-tight py-1">
              Formulir Pendaftaran
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              Lengkapi data dan berkas persyaratan peleton secara lengkap dan sah melalui formulir pendaftaran resmi LBB Mu'allimin 2027.
            </p>
          </div>
        )}

        {/* Draft Restoration Banner */}
        {step === 1 && hasRestoredDraft && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2.5 text-amber-900">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold">Draft Formulir Terdeteksi & Dipulihkan Otomatis</p>
                <p className="text-[11px] text-amber-700">
                  Data formulir pendaftaran yang sebelumnya Anda ketik telah dimuat kembali.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearFormDraft}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[11px] transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Mulai Baru (Hapus Draft)</span>
            </button>
          </div>
        )}

        {/* STEP 1: IDENTITAS SEKOLAH & AKUN */}
        {step === 1 && (
          <Step1SchoolAndAccount
            formData={formData}
            setFormData={setFormData}
            files={files}
            handleFileChange={handleFileChange}
            quotaSD={quotaSD}
            quotaSMP={quotaSMP}
            registeredSD={registeredSD}
            registeredSMP={registeredSMP}
            isSDFull={isSDFull}
            isSMPFull={isSMPFull}
            getFullSchoolName={getFullSchoolName}
            handleNext={handleNext}
          />
        )}

        {/* STEP 2: KOMANDAN & OFFICIAL */}
        {step === 2 && (
          <Step2DantonAndOfficial
            formData={formData}
            setFormData={setFormData}
            files={files}
            handleFileChange={handleFileChange}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        )}

        {/* STEP 3: BERKAS PEMBAYARAN & PAKTA ONLINE */}
        {step === 3 && (
          <Step3PaymentAndPact
            formData={formData}
            setFormData={setFormData}
            files={files}
            handleFileChange={handleFileChange}
            copiedAccount={copiedAccount}
            handleCopyAccount={handleCopyAccount}
            setShowPaktaModal={setShowPaktaModal}
            setHasSignature={setHasSignature}
            handleBack={handleBack}
            handleSubmit={handleSubmit}
            feeDisplay={feeDisplay}
          />
        )}

        {/* STEP 4: SUBMISSION CONFIRMATION */}
        {step === 4 && createdTeam && (
          <Step4Confirmation
            createdTeam={createdTeam}
            setActiveView={setActiveView}
            openAuthModal={openAuthModal}
          />
        )}
      </main>

      {/* MODAL PAKTA INTEGRITAS ONLINE */}
      <IntegrityPactModal
        isOpen={showPaktaModal}
        onClose={() => setShowPaktaModal(false)}
        formData={formData}
        getFullSchoolName={getFullSchoolName}
        canvasRef={canvasRef}
        startDrawing={startDrawing}
        draw={draw}
        stopDrawing={stopDrawing}
        clearCanvasSignature={clearCanvasSignature}
        saveOnlineSignature={saveOnlineSignature}
      />

      {/* FLOATING TOAST NOTIFICATION (Sangat jelas & mencolok di HP, Tablet & Desktop) */}
      {validationError && (
        <aside
          role="alert"
          aria-live="assertive"
          className="fixed bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 max-w-lg w-auto transition-all animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="bg-slate-950/95 backdrop-blur-md text-white border border-red-500/40 px-4 py-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3.5 ring-1 ring-red-500/20">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0 text-red-400">
                <AlertCircle className="w-4 h-4 text-red-400 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-wider text-red-400 leading-tight">
                  Perhatian Pengisian
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug break-words mt-0.5">
                  {validationError}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setValidationError('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all shrink-0 cursor-pointer"
              title="Tutup Notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Official Mu'allimin Brand Footer */}
      <footer className="border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-500 bg-white">
        © 2027 Panitia Lomba Baris Berbaris (LBB) Madrasah Mu'allimin Muhammadiyah Yogyakarta
      </footer>
    </div>
  );
}
