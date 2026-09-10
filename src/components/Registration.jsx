import React, { useState } from 'react';
import {
  AlertCircle,
  MonitorSmartphone,
  CalendarClock,
  Users,
  CheckCircle2,
  Wallet,
  Copy,
  Check,
  ExternalLink,
  FileUp,
  FileSignature,
  Image as ImageIcon,
  Shield,
  AlertOctagon,
  Headset,
  Phone,
  Instagram
} from 'lucide-react';
import { EVENT, COMPETITION, PAYMENT, REGISTRATION, CONTACT, SOCIAL, CLIPBOARD } from '../config.js';

export default function Registration() {
  const [copied, setCopied] = useState(false);

  function handleCopyAccount() {
    navigator.clipboard.writeText(PAYMENT.ACCOUNT_NUMBER).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), CLIPBOARD.RESET_DELAY_MS);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      alert('Gagal menyalin otomatis. Silakan salin manual: ' + PAYMENT.ACCOUNT_NUMBER);
    });
  }

  return (
    <section id="registration" className="py-24 lg:py-32 bg-zinc-50 relative overflow-hidden font-sans">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#8B0000 1px, transparent 1px), linear-gradient(to right, #8B0000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      ></div>
      <div className="absolute left-0 top-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-red-900/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-16 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-[10px] font-bold uppercase tracking-[0.15em] mb-6 shadow-sm cursor-default hover:bg-red-100 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            Juknis Resmi 2026
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 uppercase italic tracking-tighter mb-6 leading-tight">
            Informasi{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900">
                Pendaftaran
              </span>
              <svg
                className="absolute w-[110%] h-3 -bottom-1 -left-[5%] text-yellow-500 z-0 opacity-90"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 12 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Pedoman resmi tata cara pendaftaran LBB Mu’allimin 2026.
            <br className="hidden sm:block" />
            <span className="inline-flex items-center gap-1.5 mt-3 text-red-700 font-bold bg-red-50 px-3 py-1 rounded-md border border-red-100/50 text-sm md:text-base">
              <AlertCircle className="w-4 h-4 stroke-[2.5]" />
              Sistem First Come, First Served.
            </span>
          </p>
        </div>

        {/* Online Only Notice */}
        <div className="max-w-4xl mx-auto bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-xl shadow-sm mb-16 flex items-start gap-4">
          <div className="bg-white p-2 rounded-full text-yellow-600 shrink-0 shadow-sm">
            <MonitorSmartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 uppercase text-sm">Pendaftaran Sepenuhnya Daring (Online)</h4>
            <p className="text-sm text-slate-600 leading-relaxed mt-1">
              Panitia <strong>TIDAK</strong> menerima pendaftaran atau penyerahan berkas secara fisik (hard-copy). Semua proses dilakukan melalui portal resmi.
            </p>
          </div>
        </div>

        {/* 3 Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {/* Timeline Card */}
          <div className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-lg hover:shadow-2xl hover:border-red-600/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-200">
                <CalendarClock className="w-7 h-7" />
              </div>
              <h3 className="font-black text-xl text-slate-900 uppercase italic mb-6">Lini Masa (Timeline)</h3>

              <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-yellow-500 border-2 border-white shadow-sm"></div>
                  <p className="text-[10px] font-bold text-yellow-600 mb-0.5 uppercase tracking-wider">
                    {EVENT.REGISTRATION_RANGE}
                  </p>
                  <p className="text-sm font-bold text-slate-900">Pendaftaran Daring</p>
                  <p className="text-xs text-slate-500">s.d. 23.59 WIB</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                  <p className="text-[10px] font-bold text-blue-600 mb-0.5 uppercase tracking-wider">
                    {EVENT.VERIFICATION_RANGE}
                  </p>
                  <p className="text-sm font-bold text-slate-900">Verifikasi Berkas</p>
                  <p className="text-xs text-slate-500">Oleh Panitia</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-slate-400 border-2 border-white shadow-sm"></div>
                  <p className="text-[10px] font-bold text-slate-500 mb-0.5 uppercase tracking-wider">
                    {EVENT.TECHNICAL_MEETING_DATE}
                  </p>
                  <p className="text-sm font-bold text-slate-900">Technical Meeting</p>
                  <p className="text-xs text-slate-500">{EVENT.TECHNICAL_MEETING_TIME}</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-red-600 border-2 border-white shadow-sm animate-pulse"></div>
                  <p className="text-[10px] font-bold text-red-600 mb-0.5 uppercase tracking-wider">Hari H Pelaksanaan</p>
                  <p className="text-sm font-bold text-slate-900">Daftar Ulang & Lomba</p>
                  <p className="text-xs text-slate-500">{EVENT.COMPETITION_TIME_START_LABEL}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quota & Personnel Card */}
          <div className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-lg hover:shadow-2xl hover:border-red-600/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-red-50 text-red-700 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-red-100">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-black text-xl text-slate-900 uppercase italic mb-6">Kuota & Personel</h3>

              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-slate-800">Kuota Sekolah</span>
                    <span>{COMPETITION.MAX_PLATOONS_PER_SCHOOL_LABEL}</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-slate-800">{COMPETITION.MAX_PERSONNEL_LABEL}</span>
                    <ul className="list-disc list-inside text-xs mt-1 text-slate-500">
                      <li>1 Danton</li>
                      <li>21 Pasukan Inti</li>
                      <li>3 Cadangan</li>
                    </ul>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-slate-800">Sifat Pasukan</span>
                    <span>Homogen atau Heterogen (Campuran).</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-slate-800">Official Team</span>
                    <span>{COMPETITION.OFFICIAL_TEAM_LABEL}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Card */}
          <div className="group bg-white p-8 rounded-2xl border-2 border-yellow-400 shadow-2xl relative hover:-translate-y-2 transition-all duration-300 z-10 md:-mt-4 md:mb-4">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-xl rounded-tr-lg uppercase tracking-wider shadow-md">
              Non-Refundable
            </div>

            <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-yellow-100">
              <Wallet className="w-7 h-7" />
            </div>

            <h3 className="font-black text-xl text-slate-900 uppercase italic mb-2">Biaya Pendaftaran</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-sm text-slate-500 font-bold">Rp</span>
              <span className="text-5xl font-black text-red-700 tracking-tighter">{PAYMENT.FEE_DISPLAY}</span>
            </div>
            <p className="text-xs text-slate-400 font-medium mb-6">/ Peleton (Termasuk Atribut & Sertifikat)</p>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 border-dashed relative">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bank Tujuan</span>
                <span className="text-[10px] font-black text-white bg-blue-700 px-2 py-0.5 rounded">
                  {PAYMENT.BANK_NAME}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 bg-white border border-slate-200 p-3 rounded-lg shadow-sm mb-3">
                <span id="rek-number" className="font-mono text-lg font-bold text-slate-800 tracking-widest truncate">
                  {PAYMENT.ACCOUNT_NUMBER}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className={`p-1.5 rounded-md transition-all ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  aria-label="Salin nomor rekening"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 uppercase font-bold">
                  Atas Nama: <span className="text-slate-900">{PAYMENT.ACCOUNT_NAME}</span>
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-bold">
                  Berita: <span className="text-red-600 bg-red-50 px-1 rounded">{PAYMENT.TRANSFER_NOTE_FORMAT}</span>
                </p>
              </div>
              <div className="absolute -bottom-8 left-0 w-full flex justify-center">
                <span
                  className={`text-[10px] font-bold text-green-700 bg-green-100 border border-green-200 px-3 py-1 rounded-full transition-opacity duration-300 flex items-center gap-1 ${
                    copied ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Check className="w-3 h-3" /> Tersalin!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Steps Registration Procedure */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 p-8 md:p-12 relative overflow-hidden mb-16">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-700 via-yellow-500 to-red-700"></div>

          <h3 className="text-2xl font-black text-center mb-12 text-slate-900 uppercase italic">
            Prosedur <span className="text-red-700">Pendaftaran</span>
          </h3>

          <div className="relative">
            <div className="hidden lg:block absolute top-8 left-[10%] w-[80%] h-1 bg-slate-100 -z-0 rounded-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center text-xl font-black shadow-sm mb-4 group-hover:border-red-600 group-hover:text-red-600 transition-all duration-300">
                  1
                </div>
                <h4 className="font-bold text-slate-900 mb-1 text-sm uppercase">Akses Portal</h4>
                <p className="text-xs text-slate-500 px-1">
                  Kunjungi <strong>{REGISTRATION.PORTAL_NAME}</strong>
                </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center text-xl font-black shadow-sm mb-4 group-hover:border-red-600 group-hover:text-red-600 transition-all duration-300">
                  2
                </div>
                <h4 className="font-bold text-slate-900 mb-1 text-sm uppercase">Registrasi Akun</h4>
                <p className="text-xs text-slate-500 px-1">Official membuat akun (Nama, WA Aktif, Email).</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center text-xl font-black shadow-sm mb-4 group-hover:border-red-600 group-hover:text-red-600 transition-all duration-300">
                  3
                </div>
                <h4 className="font-bold text-slate-900 mb-1 text-sm uppercase">Isi Formulir</h4>
                <p className="text-xs text-slate-500 px-1">Input data Sekolah, Peleton, & Personel secara digital.</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center text-xl font-black shadow-sm mb-4 group-hover:border-red-600 group-hover:text-red-600 transition-all duration-300">
                  4
                </div>
                <h4 className="font-bold text-slate-900 mb-1 text-sm uppercase">Unggah Dokumen</h4>
                <p className="text-xs text-slate-500 px-1">Upload scan berkas wajib, foto, & bukti transfer.</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-red-900/20 mb-4 transform group-hover:scale-110 transition-all duration-300">
                  5
                </div>
                <h4 className="font-bold text-slate-900 mb-1 text-sm uppercase">Validasi</h4>
                <p className="text-xs text-slate-500 px-1">Submit & tunggu status "TERVERIFIKASI".</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href={REGISTRATION.PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-red-700 text-white font-bold rounded-full hover:bg-red-800 hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              Buka Portal Pendaftaran <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Required Documents & Center Info */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <FileUp className="w-5 h-5" />
              </div>
              <h4 className="font-black text-slate-900 uppercase">Dokumen Unggahan (Wajib)</h4>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="bg-slate-100 p-2 rounded text-slate-500">
                  <FileSignature className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Surat Rekomendasi</p>
                  <p className="text-xs text-slate-500">Dari Kepala Sekolah (TTD & Stempel Basah). Format PDF/JPG.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="bg-slate-100 p-2 rounded text-slate-500">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Bukti Transfer</p>
                  <p className="text-xs text-slate-500">Foto/Scan jelas, nominal sesuai. Format JPG/PNG.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="bg-slate-100 p-2 rounded text-slate-500">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Foto Personel</p>
                  <p className="text-xs text-slate-500">
                    <span className="text-red-600 font-bold">SD: Merah</span> |{' '}
                    <span className="text-blue-600 font-bold">SMP: Biru</span>. Format JPG/PNG.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="bg-slate-100 p-2 rounded text-slate-500">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Logo Sekolah & Tonti</p>
                  <p className="text-xs text-slate-500">Resolusi tinggi (tidak pecah). Format PNG Transparan.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl shadow-sm">
              <h4 className="font-bold text-red-800 uppercase text-sm mb-2 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4" /> Sanksi & Pembatalan
              </h4>
              <ul className="list-disc list-inside text-xs text-red-700 space-y-1 leading-relaxed">
                <li><strong>Diskualifikasi:</strong> Jika ditemukan pemalsuan data/dokumen (status siswa aktif).</li>
                <li><strong>Non-Refundable:</strong> Biaya tidak dapat ditarik kembali jika mengundurkan diri.</li>
                <li><strong>Perubahan Data:</strong> Hanya saat Technical Meeting dengan bukti valid.</li>
              </ul>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden flex-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
              <h4 className="font-black uppercase mb-6 flex items-center gap-2">
                <Headset className="w-5 h-5 text-yellow-500" /> Pusat Informasi
              </h4>
              <div className="space-y-4 text-sm">
                {CONTACT.PERSONS.map((person, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>
                      <span>{person.SHORT_NAME}</span>:{' '}
                      <a
                        href={person.WA_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-yellow-500 hover:underline"
                      >
                        {person.PHONE_DISPLAY}
                      </a>
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <Instagram className="w-4 h-4 text-slate-400" />
                  <span>{SOCIAL.HANDLES_DISPLAY}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
