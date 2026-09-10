import React from 'react';
import {
  Scroll,
  Shield,
  HeartHandshake,
  Activity,
  Award,
  Trophy,
  BrainCircuit,
  Network,
  UserCheck,
  Users,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import { ACHIEVEMENTS, COMPETITION } from '../config.js';

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-zinc-50 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-900/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100/50 border border-red-200 text-red-800 text-xs font-bold uppercase tracking-widest mb-6">
            <Scroll className="w-3.5 h-3.5" /> Dasar Pelaksanaan: QS. As-Saff Ayat 4
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 uppercase italic tracking-tighter mb-6 leading-none">
            Membangun <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-900">Generasi Unggul</span><br />
            Berkarakter{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-yellow-600">Ksatria</span>
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300 -z-0"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.6" />
              </svg>
            </span>
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            <strong className="text-slate-900">LBB Mu'allimin 2026</strong> hadir sebagai manifestasi peran historis Madrasah Mu'allimin sejak 1918. Ini bukan sekadar kompetisi, melainkan kawah candradimuka untuk menanamkan nilai{' '}
            <span className="text-red-700 font-bold">Disiplin</span>,{' '}
            <span className="text-red-700 font-bold">Kepemimpinan</span>, dan{' '}
            <span className="text-red-700 font-bold">Solidaritas</span> demi mencetak Profil Pelajar Pancasila dan Kader Bangsa yang Berkemajuan.
          </p>
        </div>

        {/* Theme & Credibility Card */}
        <div className="mb-24 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-900 to-slate-900 rounded-3xl -rotate-1 scale-[1.02] opacity-80 blur-lg group-hover:rotate-0 transition-all duration-500"></div>

          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden grid lg:grid-cols-2">
            <div className="bg-slate-900 text-white p-10 lg:p-14 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <Shield className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64" />

              <span className="text-yellow-500 font-bold tracking-[0.3em] text-xs uppercase mb-2">Tema Resmi 2026</span>
              <h3 className="text-4xl md:text-5xl font-black uppercase italic leading-tight mb-6">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Jiwa Ksatria</span>
                <span className="block text-yellow-500">Derap Gemilang</span>
              </h3>
              <div className="space-y-4 relative z-10">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center shrink-0 border border-white/10 text-yellow-400">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">Jiwa Ksatria (Internal)</h4>
                    <p className="text-sm text-slate-400">Integritas, Kehormatan, Tanggung Jawab, dan Mental Pantang Menyerah.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center shrink-0 border border-white/10 text-yellow-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">Derap Gemilang (Eksternal)</h4>
                    <p className="text-sm text-slate-400">Keunggulan Teknis, Presisi Gerak, Kekompakan, dan Prestasi Cemerlang.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 lg:p-14 bg-slate-50 flex flex-col justify-center">
              <h4 className="font-black text-slate-800 text-xl uppercase mb-4 flex items-center gap-2">
                <Award className="text-red-700 w-5 h-5" /> Kredibilitas Penyelenggara
              </h4>
              <p className="text-sm text-slate-600 mb-6 text-justify">
                Diinisiasi oleh <strong>Peleton Inti (Tonti) Mu'allimin "Caraka Bhaskara Muda"</strong> yang telah terbukti mencetak prestasi gemilang:
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {ACHIEVEMENTS.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                <p className="text-xs text-yellow-800 font-medium italic">
                  "Berbekal pengalaman juara, kami hadirkan standar kompetisi terbaik untuk Anda."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tujuan & Manfaat */}
        <div className="mb-20">
          <h3 className="text-3xl font-black text-center text-slate-900 uppercase italic mb-10">
            Tujuan & <span className="text-red-700">Manfaat</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-red-100 text-red-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Kompetisi Berkualitas</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Menyediakan wadah kompetisi yang sehat, sportif, dan transparan untuk mengukur kemampuan PBB pelajar se-DIY.
              </p>
            </div>

            <div className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Asah Soft Skills</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mengembangkan komunikasi efektif, problem solving, manajemen waktu, dan ketahanan mental (AQ).
              </p>
            </div>

            <div className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-yellow-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                <Network className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Jaringan & Pendidikan</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Memperkenalkan nilai <strong>CADRE</strong> Mu'allimin dan mempererat silaturahmi antar institusi pendidikan se-DIY.
              </p>
            </div>
          </div>
        </div>

        {/* Target Peserta */}
        <div className="relative">
          <div className="text-center mb-10">
            <span className="text-red-600 font-bold tracking-widest text-xs uppercase">Target Peserta</span>
            <h3 className="text-3xl font-black text-slate-900 uppercase italic">SD/MI & SMP/MTs Se-DIY</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* SD Card */}
            <div className="bg-white rounded-3xl p-2 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <div className="bg-red-50 rounded-[1.2rem] p-6 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-200 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <span className="bg-white text-red-700 font-black px-4 py-2 rounded-lg shadow-sm text-sm border border-red-100">
                    SD / MI
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-red-400">Target</p>
                    <p className="text-2xl font-black text-slate-800">
                      {COMPETITION.SD.TARGET_PLATOONS}{' '}
                      <span className="text-sm font-medium text-slate-500">Peleton</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 relative z-10">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <UserCheck className="w-4 h-4 text-red-600" />
                    <span>1 Danton</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Users className="w-4 h-4 text-red-600" />
                    <span>21 Pasukan Inti</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <PlusCircle className="w-4 h-4 text-red-600" />
                    <span>3 Cadangan</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-red-200/50 flex items-center justify-between relative z-10">
                  <span className="text-xs font-bold text-red-800 bg-red-100 px-2 py-1 rounded">
                    {COMPETITION.SD.TOTAL_PERSONNEL_LABEL}
                  </span>
                  <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* SMP Card */}
            <div className="bg-white rounded-3xl p-2 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <div className="bg-blue-50 rounded-[1.2rem] p-6 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <span className="bg-white text-blue-700 font-black px-4 py-2 rounded-lg shadow-sm text-sm border border-blue-100">
                    SMP / MTs
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-blue-400">Target</p>
                    <p className="text-2xl font-black text-slate-800">
                      {COMPETITION.SMP.TARGET_PLATOONS}{' '}
                      <span className="text-sm font-medium text-slate-500">Peleton</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 relative z-10">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>1 Danton</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>21 Pasukan Inti</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <PlusCircle className="w-4 h-4 text-blue-600" />
                    <span>3 Cadangan</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-blue-200/50 flex items-center justify-between relative z-10">
                  <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-1 rounded">
                    {COMPETITION.SMP.TOTAL_PERSONNEL_LABEL}
                  </span>
                  <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
