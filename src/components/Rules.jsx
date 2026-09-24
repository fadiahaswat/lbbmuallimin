import React, { useState } from 'react';
import {
  AlertOctagon,
  ChevronDown,
  Map,
  Timer,
  Info,
  Download
} from 'lucide-react';
import { COMPETITION, SCORING, PENALTIES } from '../config.js';

export default function Rules() {
  const [activeTab, setActiveTab] = useState('sd'); // 'sd' | 'smp'
  const [openAccordions, setOpenAccordions] = useState({
    def: true,
    proc: false,
    sub: false,
    score: false,
    penalty: false,
    protest: false,
  });

  function toggleAccordion(key) {
    setOpenAccordions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  return (
    <section id="rules" className="py-24 lg:py-32 bg-white relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            Official Technical Guide 2027
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 leading-tight py-1">
            Petunjuk Teknis{' '}
            <span className="inline-block pr-3 sm:pr-4 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Lapangan
            </span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-3xl mx-auto text-lg font-medium">
            Pedoman resmi pelaksanaan, penilaian, dan regulasi sanksi LBB Mu'allimin 2027.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Accordion Regulations */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl shadow-sm mb-4">
              <h3 className="font-black text-red-900 uppercase mb-2 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5" /> Wajib Dipatuhi
              </h3>
              <p className="text-sm text-red-800/80 leading-relaxed">
                Dokumen ini mengatur seluruh pelaksanaan lapangan. Seluruh peserta, official, dan pihak terkait diwajibkan memahami setiap ketentuan demi kelancaran dan sportivitas.
              </p>
            </div>

            <div className="space-y-4" id="rules-accordion">
              {/* Item A */}
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('def')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 font-black flex items-center justify-center text-sm">
                      A
                    </span>
                    <span className="font-bold text-lg text-slate-900">Definisi Istilah</span>
                  </div>
                  <ChevronDown
                    className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${
                      openAccordions.def ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.def && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-600 text-sm leading-relaxed space-y-3 animate-fade">
                    <p><strong className="text-slate-900">1. Clear Area:</strong> Area steril (hanya peleton tampil, max 2 official, 1 dokum, & panitia).</p>
                    <p><strong className="text-slate-900">2. Daerah Persiapan (DP):</strong> DP 1 (Tunggu & Verifikasi), DP 2 (Persiapan Akhir).</p>
                    <p><strong className="text-slate-900">3. Gerakan Penyesuaian:</strong> Gerakan tambahan di tempat untuk perbaiki formasi (max 3 kali).</p>
                    <p><strong className="text-slate-900">4. Prinsip Garis:</strong> Dinding vertikal imajiner. Anggota/atribut menyentuh garis = Pelanggaran.</p>
                  </div>
                )}
              </div>

              {/* Item B-C */}
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('proc')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 font-black flex items-center justify-center text-sm">
                      B-C
                    </span>
                    <span className="font-bold text-lg text-slate-900">Prosedur Pelaksanaan</span>
                  </div>
                  <ChevronDown
                    className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${
                      openAccordions.proc ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.proc && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-600 text-sm leading-relaxed space-y-4 animate-fade">
                    <div>
                      <h5 className="font-bold text-slate-900 mb-1">Ketentuan Umum</h5>
                      <ul className="list-disc pl-4 space-y-1">
                        <li><strong>Pendamping:</strong> Max 2 Official + 1 Dokum. Tidak boleh ganti personel di Clear Area.</li>
                        <li><strong>Dokumentasi:</strong> Hanya di area khusus, dilarang ganggu lomba.</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 mb-1">Alur Lapangan</h5>
                      <ul className="list-disc pl-4 space-y-1">
                        <li><strong>DP 1:</strong> Hadir min. 15 menit sebelum panggil. Verifikasi personel.</li>
                        <li><strong>DP 2:</strong> Persiapan akhir sebelum masuk pos.</li>
                        <li><strong>Insiden:</strong> Waktu TIDAK berhenti jika ada yang pingsan/sakit. Penanganan oleh medis/official. Insiden berat = Panitia berhak hentikan penampilan.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Item D */}
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('sub')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 font-black flex items-center justify-center text-sm">
                      D
                    </span>
                    <span className="font-bold text-lg text-slate-900">Pergantian Pemain</span>
                  </div>
                  <ChevronDown
                    className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${
                      openAccordions.sub ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.sub && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-600 text-sm leading-relaxed space-y-3 animate-fade">
                    <div className="bg-yellow-50 p-3 rounded border border-yellow-100 text-yellow-800 space-y-1">
                      <strong className="block mb-1">Waktu Pergantian di Dalam Pos:</strong>
                      <span className="block">• SD/MI: Antara Materi No. 20 & 21</span>
                      <span className="block">• SMP/MTs: Antara Materi No. 17 & 18</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Hanya digantikan oleh cadangan terdaftar.</li>
                      <li><strong>Terencana:</strong> Lapor petugas DP 2 sebelum masuk.</li>
                      <li><strong>Insidental (Darurat):</strong> Official angkat tangan izin ke Panitia Lapangan.</li>
                      <li><strong>Danton:</strong> TIDAK BISA diganti kecuali darurat medis. Jika ganti = Gugur Juara Danton.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Item E */}
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('score')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 font-black flex items-center justify-center text-sm">
                      E
                    </span>
                    <span className="font-bold text-lg text-slate-900">Sistem Penilaian</span>
                  </div>
                  <ChevronDown
                    className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${
                      openAccordions.score ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.score && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-600 text-sm leading-relaxed animate-fade">
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-slate-50 rounded border border-slate-100">
                        <h6 className="font-bold text-slate-900 mb-2">Bobot Peleton (100%)</h6>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Teknik PBB</span> <strong>{SCORING.PLATOON_TECHNIQUE_PCT}%</strong>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mb-2">
                          <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${SCORING.PLATOON_TECHNIQUE_PCT}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Kekompakan</span> <strong>{SCORING.PLATOON_COHESION_PCT}%</strong>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${SCORING.PLATOON_COHESION_PCT}%` }}></div>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded border border-slate-100">
                        <h6 className="font-bold text-slate-900 mb-2">Bobot Danton (100%)</h6>
                        <ul className="text-xs space-y-1">
                          <li className="flex justify-between"><span>Penguasaan Materi</span> <strong>{SCORING.DANTON_MASTERY_PCT}%</strong></li>
                          <li className="flex justify-between"><span>Kualitas Suara</span> <strong>{SCORING.DANTON_VOICE_PCT}%</strong></li>
                          <li className="flex justify-between"><span>Sikap & Laporan</span> <strong>{SCORING.DANTON_ATTITUDE_PCT}%</strong></li>
                          <li className="flex justify-between"><span>Penguasaan Medan</span> <strong>{SCORING.DANTON_FIELD_PCT}%</strong></li>
                        </ul>
                      </div>
                    </div>
                    <p><strong>Range Nilai:</strong> {SCORING.SCORE_RANGE_LABEL}.</p>
                    <p><strong>Ketentuan Gerakan:</strong> Wajib BERURUTAN. Salah urutan = Nilai Minimal. Tidak laksanakan = 0. Salah Aba-aba = 0.</p>
                  </div>
                )}
              </div>

              {/* Item F */}
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('penalty')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 font-black flex items-center justify-center text-sm">
                      F
                    </span>
                    <span className="font-bold text-lg text-slate-900">Sanksi & Pengurangan Nilai</span>
                  </div>
                  <ChevronDown
                    className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${
                      openAccordions.penalty ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.penalty && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-600 text-sm leading-relaxed animate-fade">
                    <ul className="space-y-2">
                      {PENALTIES.map((p, idx) => (
                        <li key={idx} className="flex items-center justify-between bg-slate-50 p-2 px-3 rounded border border-slate-100">
                          <span>{p.label}</span>
                          <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                            {p.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Item G-H */}
              <div className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-red-500/30 hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleAccordion('protest')}
                  className="w-full flex justify-between items-center p-5 text-left bg-slate-50/50 hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 font-black flex items-center justify-center text-sm">
                      G-H
                    </span>
                    <span className="font-bold text-lg text-slate-900">Protes & Force Majeure</span>
                  </div>
                  <ChevronDown
                    className={`text-slate-400 transition-transform duration-300 w-5 h-5 ${
                      openAccordions.protest ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.protest && (
                  <div className="bg-white border-t border-slate-100 p-6 text-slate-600 text-sm leading-relaxed space-y-4 animate-fade">
                    <div>
                      <h5 className="font-bold text-slate-900 mb-1">Mekanisme Protes (Sanggah)</h5>
                      <p className="mb-2">Hanya untuk kesalahan teknis (Hitung skor, Input data, Penalti salah). Keputusan Juri (Subjektif) mutlak.</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Diajukan LISAN oleh 1 Official Resmi.</li>
                        <li>Batas waktu: <strong>60 Menit</strong> setelah rekap nilai rilis.</li>
                        <li>Wajib sopan & bawa bukti (Video/Foto).</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 mb-1">Force Majeure</h5>
                      <p>Hujan deras/Bencana Alam: Lomba dapat dihentikan sementara/ditunda. Keputusan di tangan Panitia.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Arena & Tabs Card */}
          <div className="lg:col-span-5 relative sticky top-24">
            <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-800 bg-slate-950">
                <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase italic mb-4">
                  <span className="text-red-600">
                    <Map className="w-6 h-6" />
                  </span>{' '}
                  Arena & Materi
                </h3>

                <div className="p-1 bg-slate-800 rounded-lg flex gap-1">
                  <button
                    onClick={() => setActiveTab('sd')}
                    className={`flex-1 py-2 text-center text-xs uppercase tracking-wider rounded-md transition-all ${
                      activeTab === 'sd'
                        ? 'bg-white text-slate-900 font-black shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700 font-bold'
                    }`}
                  >
                    SD / MI
                  </button>
                  <button
                    onClick={() => setActiveTab('smp')}
                    className={`flex-1 py-2 text-center text-xs uppercase tracking-wider rounded-md transition-all ${
                      activeTab === 'smp'
                        ? 'bg-white text-slate-900 font-black shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700 font-bold'
                    }`}
                  >
                    SMP / MTs
                  </button>
                </div>
              </div>

              <div className="p-6 relative min-h-[350px]">
                {activeTab === 'sd' ? (
                  <div className="block animate-fade">
                    <div className="bg-slate-800/50 rounded-xl p-6 text-center border border-slate-700 relative overflow-hidden group mb-6">
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                          backgroundSize: '20px 20px',
                        }}
                      ></div>

                      <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-2 relative z-10">
                        <span>START</span>
                        <span className="text-red-500 font-bold">{COMPETITION.SD.ARENA_WIDTH_LABEL}</span>
                        <span>FINISH</span>
                      </div>

                      <div className="w-full h-32 border-2 border-slate-600 bg-slate-900/50 flex flex-col items-center justify-center font-mono relative z-10 backdrop-blur-sm group-hover:border-red-500/50 transition-colors">
                        <span className="text-2xl font-black text-white">{COMPETITION.SD.ARENA_SIZE}</span>
                        <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Ukuran Lapangan</span>

                        <div className="absolute -right-4 h-full flex items-center">
                          <div className="h-full w-px bg-slate-600 relative">
                            <span className="absolute top-1/2 -right-3 -translate-y-1/2 text-[10px] rotate-90 text-slate-500 font-bold whitespace-nowrap">
                              {COMPETITION.SD.ARENA_HEIGHT_LABEL}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/30 border border-red-500/30 text-red-400 text-xs font-bold relative z-10">
                        <Timer className="w-3.5 h-3.5" />
                        <span>{COMPETITION.SD.DURATION_LABEL}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-900/10 border border-yellow-700/20">
                      <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div className="text-xs text-slate-400">
                        <p className="font-bold text-amber-400 mb-1">Materi Gerakan:</p>
                        <p>
                          Mengacu pada daftar gerakan resmi (Urutan Wajib). Pergantian pemain dilakukan di antara{' '}
                          <strong className="text-slate-200">{COMPETITION.SD.SUBSTITUTION_LABEL}</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="block animate-fade">
                    <div className="bg-slate-800/50 rounded-xl p-6 text-center border border-slate-700 relative overflow-hidden group mb-6">
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                          backgroundSize: '20px 20px',
                        }}
                      ></div>

                      <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-2 relative z-10">
                        <span>START</span>
                        <span className="text-blue-500 font-bold">{COMPETITION.SMP.ARENA_WIDTH_LABEL}</span>
                        <span>FINISH</span>
                      </div>

                      <div className="w-full h-32 border-2 border-slate-600 bg-slate-900/50 flex flex-col items-center justify-center font-mono relative z-10 backdrop-blur-sm group-hover:border-blue-500/50 transition-colors">
                        <span className="text-2xl font-black text-white">{COMPETITION.SMP.ARENA_SIZE}</span>
                        <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Ukuran Lapangan</span>

                        <div className="absolute -right-4 h-full flex items-center">
                          <div className="h-full w-px bg-slate-600 relative">
                            <span className="absolute top-1/2 -right-3 -translate-y-1/2 text-[10px] rotate-90 text-slate-500 font-bold whitespace-nowrap">
                              {COMPETITION.SMP.ARENA_HEIGHT_LABEL}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold relative z-10">
                        <Timer className="w-3.5 h-3.5" />
                        <span>{COMPETITION.SMP.DURATION_LABEL}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-900/10 border border-yellow-700/20">
                      <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div className="text-xs text-slate-400">
                        <p className="font-bold text-amber-400 mb-1">Materi Gerakan:</p>
                        <p>
                          Mengacu pada daftar gerakan resmi (Urutan Wajib). Pergantian pemain dilakukan di antara{' '}
                          <strong className="text-slate-200">{COMPETITION.SMP.SUBSTITUTION_LABEL}</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
                <a
                  href="https://docs.google.com/document/d/1BN1RuwDcEiuibVvoBG4-5R7Rq8neV5st3nAZoISVQi0/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" /> Buka / Unduh Juknis Resmi 2027 (Google Docs)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
