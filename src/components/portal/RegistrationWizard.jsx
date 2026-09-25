import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { PAYMENT, CONTACT } from '../../config.js';
import logoImg from '../../assets/logo-tonti.png';

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

  // 12 Items Form State
  const [formData, setFormData] = useState({
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
  });

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
    if (!isRegOpenMaster) {
      setValidationError('Pendaftaran saat ini sedang ditutup oleh panitia.');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setValidationError('Alamat email aktif untuk akun wajib diisi dengan benar.');
      return false;
    }
    if (!formData.jenjang) {
      setValidationError('Silakan pilih Jenjang Sekolah (SD/MI atau SMP/MTs).');
      return false;
    }
    if (formData.jenjang === 'SD' && isSDFull) {
      setValidationError('Mohon maaf, kuota peleton untuk tingkat SD/MI telah penuh.');
      return false;
    }
    if (formData.jenjang === 'SMP' && isSMPFull) {
      setValidationError('Mohon maaf, kuota peleton untuk tingkat SMP/MTs telah penuh.');
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
      <div className="hidden sm:block absolute left-0 top-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none z-0 transform-gpu" />
      <div className="hidden sm:block absolute right-0 bottom-1/4 w-96 h-96 bg-red-900/5 rounded-full blur-3xl pointer-events-none z-0 transform-gpu" />

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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] mb-3 shadow-xs cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              Juknis Resmi & Registrasi 2026
            </div>

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

      {/* Official Mu'allimin Brand Footer */}
      <footer className="border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-500 bg-white">
        © 2026 Panitia Lomba Baris Berbaris (LBB) Madrasah Mu'allimin Muhammadiyah Yogyakarta
      </footer>
    </div>
  );
}
