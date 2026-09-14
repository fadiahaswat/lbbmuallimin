import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Building2,
  Users,
  FileUp,
  FileCheck,
  Printer,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  UploadCloud,
  FileText,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { PAYMENT, COMPETITION } from '../../config.js';
import { generatePersonnels } from '../../data/seedData.js';

export default function RegistrationWizard({ isOpen, onClose }) {
  const { registerTeam, setActiveView, openModal } = useCompetition();

  const [step, setStep] = useState(1);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    schoolName: '',
    jenjang: 'SMP',
    category: 'Putra', // 'Putra' | 'Putri' | 'Campuran'
    platoonName: '',
    coachName: '',
    waNumber: '',
    email: '',
    address: '',
    wave: 1,
    feeAmount: 450000,
    agreeJuknis: false,
    agreeFormC: false,
  });

  // 25 Personnels + Officials State
  const [roster, setRoster] = useState(() => generatePersonnels('Sekolah Baru', 'SMP', 'Peserta'));

  // Uploaded files mock
  const [files, setFiles] = useState({
    recommendationLetter: null,
    paymentProof: null,
    personnelPhotos: null,
    schoolLogo: null,
  });

  // Result state after success
  const [createdTeam, setCreatedTeam] = useState(null);

  if (!isOpen) return null;

  // Auto fill sample helper
  function handleQuickFill() {
    const isSD = formData.jenjang === 'SD';
    const school = isSD ? 'SD Negeri Percobaan 1 Yogyakarta' : 'SMP Negeri 8 Yogyakarta';
    const platoon = isSD ? 'Pleton Cakra Cilik' : 'Pleton Bhayangkara Delapan';
    const dummyRoster = generatePersonnels(school, formData.jenjang, isSD ? 'Cakra' : 'Bhayangkara');

    setFormData({
      schoolName: school,
      jenjang: isSD ? 'SD' : 'SMP',
      category: 'Putra',
      platoonName: platoon,
      coachName: 'Drs. Subagyo, M.Pd.',
      waNumber: '081234567890',
      email: 'official.tonti@sekolah.sch.id',
      address: 'Jl. Prof. Dr. Kahar Muzakir No. 2, Kotabaru, Gondokusuman, Yogyakarta',
      wave: 1,
      feeAmount: 450000,
      agreeJuknis: true,
      agreeFormC: true,
    });

    setRoster(dummyRoster);

    setFiles({
      recommendationLetter: { name: `Surat_Rekom_${isSD ? 'SDN_Percobaan1' : 'SMPN_8'}.pdf`, uploadedAt: new Date().toISOString(), url: '#' },
      paymentProof: { name: 'Bukti_Transfer_BRI_450k.jpg', uploadedAt: new Date().toISOString(), url: '#' },
      personnelPhotos: { name: 'Pasfoto_25_Personel.zip', uploadedAt: new Date().toISOString(), url: '#' },
      schoolLogo: { name: 'Logo_Sekolah.png', uploadedAt: new Date().toISOString(), url: '#' },
    });
  }

  function handleFileChange(key, e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFiles(prev => ({
          ...prev,
          [key]: {
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            uploadedAt: new Date().toISOString(),
            url: uploadEvent.target?.result || '#',
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  }

  function handleCopyAccount() {
    navigator.clipboard?.writeText(PAYMENT.ACCOUNT_NUMBER);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.agreeJuknis || !formData.agreeFormC) {
      alert('Mohon centang persetujuan juknis dan surat pernyataan Formulir C terlebih dahulu.');
      return;
    }

    const newTeam = registerTeam({
      ...formData,
      roster,
      files: {
        recommendationLetter: files.recommendationLetter || { name: 'Surat_Rekomendasi_Sekolah.pdf', uploadedAt: new Date().toISOString(), url: '#' },
        paymentProof: files.paymentProof || { name: 'Bukti_Transfer_BRI.jpg', uploadedAt: new Date().toISOString(), url: '#' },
        personnelPhotos: files.personnelPhotos || { name: 'Pasfoto_25_Personil.zip', uploadedAt: new Date().toISOString(), url: '#' },
        schoolLogo: files.schoolLogo || { name: 'Logo_Peleton.png', uploadedAt: new Date().toISOString(), url: '#' },
      },
    });

    setCreatedTeam(newTeam);
    setStep(5); // Go to success step
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200 text-slate-900">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white p-5 sm:p-6 flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-red-700/80 border border-red-500/40 flex items-center justify-center text-white shadow-md">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  Portal Resmi
                </span>
                <span className="text-xs text-slate-400">Tingkat SD/MI & SMP/MTs Se-DIY</span>
              </div>
              <h3 className="font-black text-lg sm:text-xl text-white uppercase italic tracking-tight">
                Pendaftaran Peleton LBB Mu'allimin 2026
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step < 5 && (
              <button
                type="button"
                onClick={handleQuickFill}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 text-xs font-bold transition-all"
                title="Isi otomatis form dengan data contoh untuk kemudahan pengujian sistem"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Isi Contoh Otomatis</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
              aria-label="Tutup Formulir"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 shrink-0">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: 'Sekolah & Tim' },
              { num: 2, label: 'Susunan Personel' },
              { num: 3, label: 'Unggah Berkas' },
              { num: 4, label: 'Persetujuan' },
              { num: 5, label: 'Bukti Registrasi' },
            ].map((item, idx) => {
              const isCurrent = step === item.num;
              const isDone = step > item.num;
              return (
                <div key={item.num} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-red-700 text-white ring-4 ring-red-100'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : item.num}
                  </div>
                  <span
                    className={`hidden md:inline text-xs font-bold ${
                      isCurrent ? 'text-slate-900' : isDone ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                  {idx < 4 && <div className="hidden sm:block w-6 lg:w-12 h-0.5 bg-slate-200 ml-1"></div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Data Lembaga & Sekolah */}
          {step === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">
                  Identitas Sekolah & Peleton
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Pastikan data nama sekolah dan kontak official diisi dengan benar untuk pengiriman info teknis lomba.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nama Asal Sekolah / Madrasah *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.schoolName}
                    onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                    placeholder="Contoh: SMP Negeri 1 Yogyakarta"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Jenjang Kompetisi *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['SD', 'SMP'].map(j => (
                      <button
                        key={j}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, jenjang: j });
                          setRoster(generatePersonnels(formData.schoolName || 'Sekolah', j, 'Peserta'));
                        }}
                        className={`py-2.5 rounded-xl font-black text-xs uppercase border transition-all ${
                          formData.jenjang === j
                            ? 'bg-red-700 text-white border-red-700 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {j === 'SD' ? 'SD / MI' : 'SMP / MTs'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Kategori Peleton *
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                  >
                    <option value="Putra">Putra</option>
                    <option value="Putri">Putri</option>
                    <option value="Campuran">Campuran</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nama Pasukan / Peleton
                  </label>
                  <input
                    type="text"
                    value={formData.platoonName}
                    onChange={e => setFormData({ ...formData, platoonName: e.target.value })}
                    placeholder="Contoh: Pleton Satria Wiratama"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nama Pembina / Pelatih Resmi *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.coachName}
                    onChange={e => setFormData({ ...formData, coachName: e.target.value })}
                    placeholder="Nama lengkap & gelar"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nomor WhatsApp Aktif Official *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.waNumber}
                    onChange={e => setFormData({ ...formData, waNumber: e.target.value })}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Official Sekolah *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Contoh: official@smpn1yk.sch.id"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Alamat Lengkap Sekolah
                  </label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Jalan, kelurahan, kecamatan, kabupaten/kota di DIY"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Susunan Personel (25 Orang Lengkap) */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">
                    Susunan Personel Peleton (Maks. 25 Orang)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sesuai Juknis: 1 Komandan Peleton (Danton), 21 Pasukan Inti (3 Saf × 7 Banjar), dan 3 Cadangan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Isi Otomatis Personel</span>
                </button>
              </div>

              {/* 1. Danton Card */}
              <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3 text-red-800">
                  <span className="px-2 py-0.5 rounded bg-red-700 text-white font-extrabold text-[10px] uppercase">
                    Komandan Peleton (Danton)
                  </span>
                  <span className="text-xs font-bold">Wajib 1 Orang</span>
                </div>
                <div className="grid sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Nama Lengkap Danton *</label>
                    <input
                      type="text"
                      value={roster.danton.name}
                      onChange={e => setRoster({ ...roster, danton: { ...roster.danton, name: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:ring-1 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">NISN / NIS</label>
                    <input
                      type="text"
                      value={roster.danton.nisn}
                      onChange={e => setRoster({ ...roster, danton: { ...roster.danton, nisn: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Kelas</label>
                    <input
                      type="text"
                      value={roster.danton.class}
                      onChange={e => setRoster({ ...roster, danton: { ...roster.danton, class: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Pasukan Inti (Saf 1, Saf 2, Saf 3) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-extrabold text-sm uppercase text-slate-800">
                    21 Pasukan Inti (3 Saf × 7 Anggota)
                  </h5>
                  <span className="text-[11px] text-slate-500 font-medium">Minimal Tampil: 21 Orang</span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  {[1, 2, 3].map(saf => (
                    <div key={saf} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="font-black text-xs uppercase tracking-wider text-slate-700 mb-2.5 pb-1 border-b border-slate-200 flex items-center justify-between">
                        <span>Saf {saf}</span>
                        <span className="text-[10px] font-bold text-slate-400">Banjar 1–7</span>
                      </div>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {roster.pasukan
                          .filter(p => p.safNumber === saf)
                          .map((person, idx) => (
                            <div key={person.id} className="text-xs">
                              <span className="text-[10px] font-bold text-slate-500">#{idx + 1} (Banjar {person.banjarNumber})</span>
                              <input
                                type="text"
                                value={person.name}
                                onChange={e => {
                                  const updated = roster.pasukan.map(p =>
                                    p.id === person.id ? { ...p, name: e.target.value } : p
                                  );
                                  setRoster({ ...roster, pasukan: updated });
                                }}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-red-600"
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Cadangan & Official */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3">
                  <div className="font-black text-xs uppercase tracking-wider text-amber-900 mb-2">
                    3 Anggota Cadangan
                  </div>
                  <div className="space-y-2">
                    {roster.cadangan.map((c, i) => (
                      <div key={c.id} className="flex gap-2 items-center">
                        <span className="text-[10px] font-bold text-amber-800 w-5">C{i + 1}</span>
                        <input
                          type="text"
                          value={c.name}
                          onChange={e => {
                            const updated = roster.cadangan.map(item =>
                              item.id === c.id ? { ...item, name: e.target.value } : item
                            );
                            setRoster({ ...roster, cadangan: updated });
                          }}
                          className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="font-black text-xs uppercase tracking-wider text-slate-800 mb-2">
                    Tim Official (2 Pelatih + 1 Dokumentasi)
                  </div>
                  <div className="space-y-2">
                    {roster.officials.map(off => (
                      <div key={off.id} className="flex gap-2 items-center">
                        <span className="text-[10px] font-bold text-slate-500 w-16 capitalize truncate">
                          {off.role}
                        </span>
                        <input
                          type="text"
                          value={off.name}
                          onChange={e => {
                            const updated = roster.officials.map(item =>
                              item.id === off.id ? { ...item, name: e.target.value } : item
                            );
                            setRoster({ ...roster, officials: updated });
                          }}
                          className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Unggah Berkas & Biaya Pembayaran */}
          {step === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">
                  Unggah Berkas Persyaratan & Pembayaran
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Format berkas: PDF atau Gambar (JPG/PNG). Berkas fisik asli berstempel dinas wajib dibawa saat TM.
                </p>
              </div>

              {/* Rincian Rekening Pembayaran */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-400 block mb-1">
                      Rekening Resmi Pendaftaran BRI
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-xl font-mono font-black tracking-wider text-white">
                        {PAYMENT.ACCOUNT_NUMBER}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-yellow-400 flex items-center gap-1 transition-all"
                      >
                        {copiedAccount ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAccount ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      a.n. <strong className="text-white">{PAYMENT.ACCOUNT_NAME}</strong> (Bank {PAYMENT.BANK_NAME})
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-3 text-right">
                    <span className="text-[10px] font-bold text-slate-300 uppercase block">Biaya Registrasi</span>
                    <span className="text-xl font-black text-yellow-400">Rp450.000,-</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Gelombang 1</span>
                  </div>
                </div>
              </div>

              {/* Upload Dropzones */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* 1. Surat Rekomendasi */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-red-400 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-800 uppercase">Surat Rekomendasi Kepsek *</span>
                    <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">Wajib</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Surat izin resmi bertanda tangan dan stempel basah.</p>
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e => handleFileChange('recommendationLetter', e)}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-slate-300 hover:border-red-600 rounded-xl p-3 text-center transition-colors">
                      {files.recommendationLetter?.url && files.recommendationLetter.url.startsWith('data:image') ? (
                        <div className="mb-2">
                          <img src={files.recommendationLetter.url} alt="Preview Rekomendasi" className="h-16 mx-auto rounded object-contain shadow-xs" />
                        </div>
                      ) : (
                        <UploadCloud className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                      )}
                      <span className="text-xs font-bold text-red-700 block truncate">
                        {files.recommendationLetter ? files.recommendationLetter.name : 'Pilih File (PDF/Gambar)'}
                      </span>
                    </div>
                  </label>
                </div>

                {/* 2. Bukti Transfer */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-red-400 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-800 uppercase">Bukti Transfer Pembayaran *</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Wajib</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Screenshot m-Banking / Foto struk transfer jelas.</p>
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={e => handleFileChange('paymentProof', e)}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-xl p-3 text-center transition-colors">
                      {files.paymentProof?.url && files.paymentProof.url.startsWith('data:image') ? (
                        <div className="mb-2">
                          <img src={files.paymentProof.url} alt="Preview Transfer" className="h-16 mx-auto rounded object-contain shadow-xs" />
                        </div>
                      ) : (
                        <UploadCloud className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                      )}
                      <span className="text-xs font-bold text-emerald-700 block truncate">
                        {files.paymentProof ? files.paymentProof.name : 'Pilih Bukti Transfer'}
                      </span>
                    </div>
                  </label>
                </div>

                {/* 3. Pasfoto Personel */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-red-400 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-800 uppercase">Pasfoto 25 Personel *</span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">ZIP / Foto</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Background Merah (SD) atau Biru (SMP).</p>
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept=".zip,.rar,.pdf,.jpg,.jpeg,.png"
                      onChange={e => handleFileChange('personnelPhotos', e)}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-slate-300 hover:border-blue-600 rounded-xl p-3 text-center transition-colors">
                      {files.personnelPhotos?.url && files.personnelPhotos.url.startsWith('data:image') ? (
                        <div className="mb-2">
                          <img src={files.personnelPhotos.url} alt="Preview Pasfoto" className="h-16 mx-auto rounded object-contain shadow-xs" />
                        </div>
                      ) : (
                        <UploadCloud className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                      )}
                      <span className="text-xs font-bold text-blue-700 block truncate">
                        {files.personnelPhotos ? files.personnelPhotos.name : 'Unggah File Pasfoto'}
                      </span>
                    </div>
                  </label>
                </div>

                {/* 4. Logo Sekolah */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-red-400 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-800 uppercase">Logo Sekolah / Peleton</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">PNG / JPG</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Untuk tayangan layar dan sertifikat kejuaraan.</p>
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      onChange={e => handleFileChange('schoolLogo', e)}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-slate-300 hover:border-purple-600 rounded-xl p-3 text-center transition-colors">
                      {files.schoolLogo?.url && files.schoolLogo.url.startsWith('data:image') ? (
                        <div className="mb-2">
                          <img src={files.schoolLogo.url} alt="Preview Logo" className="h-16 mx-auto rounded object-contain shadow-xs" />
                        </div>
                      ) : (
                        <UploadCloud className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                      )}
                      <span className="text-xs font-bold text-purple-700 block truncate">
                        {files.schoolLogo ? files.schoolLogo.name : 'Unggah Logo Peleton'}
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Persetujuan Regulasi (Formulir C) */}
          {step === 4 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">
                  Pernyataan Integritas & Kesanggupan (Formulir C)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Seluruh kontingen wajib tunduk dan patuh pada seluruh aturan lomba, juknis, dan tata tertib LBB Mu'allimin 2026.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-xs text-slate-700 leading-relaxed max-h-72 overflow-y-auto">
                <p className="font-bold text-slate-900 text-sm">SURAT PERNYATAAN DAN KESANGGUPAN KONTINGEN</p>
                <p>
                  Kami yang bertanda tangan di bawah ini selaku penanggung jawab / pembina peleton dari <strong>{formData.schoolName || 'Sekolah'}</strong>, dengan ini menyatakan:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Seluruh personil yang didaftarkan (1 Danton, 21 Pasukan, 3 Cadangan) adalah benar-benar siswa/siswi aktif dari sekolah bersangkutan.</li>
                  <li>Sanggup dan bersedia mematuhi seluruh Petunjuk Teknis (Juknis), Tata Tertib, serta Keputusan Dewan Juri yang bersifat mutlak dan tidak dapat diganggu gugat.</li>
                  <li>Bersedia hadir dan membawa dokumen fisik asli (Formulir A, Formulir B, Formulir C cap basah) pada saat Technical Meeting (23 Oktober 2026).</li>
                  <li>Menjaga ketertiban, kebersihan, dan sportivitas selama seluruh rangkaian kegiatan LBB Mu'allimin 2026 di Kampus Terpadu Madrasah Mu'allimin.</li>
                </ol>
              </div>

              <div className="space-y-3 bg-red-50/60 border border-red-200 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.agreeJuknis}
                    onChange={e => setFormData({ ...formData, agreeJuknis: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-red-700 rounded border-slate-300 focus:ring-red-600"
                  />
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    Saya menyatakan data yang diisikan benar dan telah memahami serta menyetujui seluruh isi Petunjuk Teknis LBB Mu'allimin 2026. *
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.agreeFormC}
                    onChange={e => setFormData({ ...formData, agreeFormC: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-red-700 rounded border-slate-300 focus:ring-red-600"
                  />
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    Saya menyetujui Surat Pernyataan Kesanggupan & Integritas Peserta (Formulir C). *
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 5: Sukses & Bukti Pendaftaran */}
          {step === 5 && createdTeam && (
            <div className="space-y-6 max-w-2xl mx-auto text-center py-2 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Pendaftaran Berhasil Dikirim
                </span>
                <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight mt-3">
                  Selamat Datang di LBB Mu'allimin 2026!
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  Data peleton Anda telah tersimpan di sistem. Simpan Kode Registrasi di bawah ini untuk memantau proses verifikasi berkas oleh sekretariat.
                </p>
              </div>

              {/* Digital Registration Badge / Card */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-6 border border-slate-800 text-left relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400">
                      Kartu Tanda Pendaftaran Peleton
                    </span>
                    <h5 className="font-black text-lg text-white mt-0.5">{createdTeam.schoolName}</h5>
                    <p className="text-xs text-slate-400">
                      Jenjang: <strong className="text-white">{createdTeam.jenjang}</strong> • Kategori: <strong className="text-white">{createdTeam.category}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Status</span>
                    <span className="text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded inline-block mt-0.5">
                      Menunggu Verifikasi
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Kode Registrasi</span>
                    <span className="font-mono font-black text-yellow-400 text-sm">{createdTeam.regCode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Komandan Peleton</span>
                    <span className="font-bold text-white truncate block">{createdTeam.roster.danton.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">No. WhatsApp</span>
                    <span className="font-bold text-white block">{createdTeam.waNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Waktu Daftar</span>
                    <span className="font-bold text-white block">{new Date(createdTeam.registeredAt).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between text-xs text-slate-300">
                  <span>Nomor Urut Undian Tampil:</span>
                  <span className="font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                    Diundi saat Technical Meeting (23 Okt 2026)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Kartu Tanda Peleton</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openModal('docViewer', {
                      docId: 'form-b',
                      team: createdTeam,
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-2 border border-blue-200 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>Cetak Formulir Biodata (Form B)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setActiveView('peserta_dashboard');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/30 transition-all"
                >
                  <span>Buka Dashboard Tim Saya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation (Step Buttons) */}
        {step < 5 && (
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium mr-2">
                Langkah {step} dari 4
              </span>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1 && !formData.schoolName) {
                      alert('Silakan masukkan nama sekolah terlebih dahulu.');
                      return;
                    }
                    setStep(step + 1);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-md shadow-red-950/20"
                >
                  <span>Lanjut</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-red-950/30"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Kirim Pendaftaran</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
