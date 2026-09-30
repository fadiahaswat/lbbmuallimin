import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  FileSpreadsheet,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Coins,
  Receipt,
  Wallet,
  Building2,
  Printer,
  Sparkles,
  Users,
  Trophy,
  ShieldCheck,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { COMPETITION, PAYMENT, OFFICIAL_RAB } from '../../config.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function RabFinanceView() {
  const {
    teams,
    currentUser,
    role,
    settings
  } = useCompetition();

  const [activeTab, setActiveTab] = useState('pengeluaran'); // 'pengeluaran' | 'pemasukan'
  const [expandedDiv, setExpandedDiv] = useState(null);

  const toggleDivision = (id) => {
    setExpandedDiv(expandedDiv === id ? null : id);
  };

  const handlePrintRAB = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csv = 'No,Divisi / Pos Anggaran,Uraian Kebutuhan,Volume,Satuan,Harga Satuan,Total Anggaran\n';
    OFFICIAL_RAB.DIVISIONS.forEach((div, dIdx) => {
      div.items.forEach((it, iIdx) => {
        csv += `${dIdx + 1}.${iIdx + 1},"${div.name}","${it.item}",${it.volume},"${it.unit}",${it.price},${it.total}\n`;
      });
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RAB_Resmi_LBB_Muallimin_2027_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SimpaskorSidebarLayout
      activeMenu="rab"
      title="RAB & Manajemen Keuangan SaaS"
      subtitle="Rencana Anggaran Biaya Resmi LBB Mu'allimin 2027 (12 Divisi, Total Rp 63.711.450, Saldo Rp 0)"
      rightActions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Ekspor Laporan RAB ke CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Ekspor CSV</span>
          </button>
          <button
            onClick={handlePrintRAB}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Cetak Rencana Anggaran Biaya"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak Dokumen RAB</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">

        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-900/40 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
                <Coins className="w-3.5 h-3.5" />
                <span>Dokumen Resmi: RAB LBB MU'ALLIMIN 2027.xlsx</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Rencana Anggaran Biaya (RAB) 12 Divisi
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Struktur neraca anggaran berimbang: Total Pemasukan <strong>Rp 63.711.450</strong> dan Total Alokasi Pengeluaran <strong>Rp 63.711.450</strong> mencakup hadiah piala & uang pembinaan Rp 9.600.000, 6 dewan juri, dan 12 divisi operasional.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 shrink-0 text-center min-w-[180px]">
              <span className="text-[10px] uppercase font-bold text-emerald-300 block">Total Neraca Anggaran</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                Rp {OFFICIAL_RAB.TOTAL_EXPENSE.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-emerald-300 font-bold block mt-1">
                Saldo Neraca: Rp 0 (Berimbang)
              </span>
            </div>
          </div>
        </div>

        {/* 4 Financial Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Rencana Pemasukan</span>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">RAB Resmi</span>
            </div>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              Rp {OFFICIAL_RAB.TOTAL_INCOME.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Subsidi, Sponsor, 36 Peleton & Bazar
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Alokasi Belanja</span>
              <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded">12 Divisi</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              Rp {OFFICIAL_RAB.TOTAL_EXPENSE.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Seluruh Kebutuhan Operasional & Logistik
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Uang Pembinaan Kejuaraan</span>
              <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Tunai</span>
            </div>
            <div className="text-2xl font-black text-amber-700 font-mono">
              Rp 9.600.000
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Juara 1-3 Peleton & Danton SD/SMP
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Saldo Akhir Proyeksi</span>
              <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Balance</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              Rp 0
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Anggaran Dirancang Tepat Sasaran
            </p>
          </div>
        </div>

        {/* Tab Switcher: Pengeluaran vs Pemasukan */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab('pengeluaran')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'pengeluaran'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alokasi Pengeluaran (12 Divisi)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pemasukan')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'pemasukan'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sumber Pemasukan (5 Pos)
          </button>
        </div>

        {/* Tab 1: Alokasi Pengeluaran 12 Divisi */}
        {activeTab === 'pengeluaran' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase">
                  Rincian Anggaran 12 Divisi Operasional Panitia
                </h3>
                <p className="text-xs text-slate-500">
                  Klik pada baris divisi untuk melihat rincian item barang, volume, dan harga satuan
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                  {OFFICIAL_RAB.DIVISIONS.length} Divisi Terdaftar
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {OFFICIAL_RAB.DIVISIONS.map((div, dIdx) => {
                const isExpanded = expandedDiv === div.id;
                return (
                  <div
                    key={div.id}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-slate-300"
                  >
                    <div
                      onClick={() => toggleDivision(div.id)}
                      className="p-4 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer flex items-center justify-between gap-4 select-none"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono text-xs font-black flex items-center justify-center shrink-0">
                          {dIdx + 1}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900">
                            {div.name}
                          </h4>
                          <span className="text-[10px] text-slate-500">
                            {div.items.length} item rincian anggaran
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-xs sm:text-sm text-slate-900">
                          Rp {div.subtotal.toLocaleString('id-ID')}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 bg-white border-t border-slate-100 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              <th className="py-2 px-3">Uraian Item Barang</th>
                              <th className="py-2 px-3 text-center">Volume</th>
                              <th className="py-2 px-3 text-center">Satuan</th>
                              <th className="py-2 px-3 text-right">Harga Satuan</th>
                              <th className="py-2 px-3 text-right">Total Biaya</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {div.items.map((it, iIdx) => (
                              <tr key={iIdx} className="hover:bg-slate-50/60">
                                <td className="py-2.5 px-3 font-sans text-slate-800 font-medium">
                                  {it.item}
                                </td>
                                <td className="py-2.5 px-3 text-center text-slate-600">
                                  {it.volume}
                                </td>
                                <td className="py-2.5 px-3 text-center font-sans text-slate-500">
                                  {it.unit}
                                </td>
                                <td className="py-2.5 px-3 text-right text-slate-600">
                                  Rp {it.price.toLocaleString('id-ID')}
                                </td>
                                <td className="py-2.5 px-3 text-right font-black text-slate-900">
                                  Rp {it.total.toLocaleString('id-ID')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider">
                Total Alokasi Seluruh 12 Divisi
              </span>
              <span className="font-mono font-black text-lg text-emerald-400">
                Rp {OFFICIAL_RAB.TOTAL_EXPENSE.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Sumber Pemasukan 5 Pos */}
        {activeTab === 'pemasukan' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase">
                  Rencana Sumber Pemasukan Dana (Inflow)
                </h3>
                <p className="text-xs text-slate-500">
                  Target penerimaan dari subsidi institusi, kemitraan sponsorship, pendaftaran 36 peleton, dan stan bazar
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">No</th>
                    <th className="py-3 px-3">Sumber Pendapatan</th>
                    <th className="py-3 px-3 text-center">Volume</th>
                    <th className="py-3 px-3 text-center">Satuan</th>
                    <th className="py-3 px-3 text-right">Nominal / Tarif</th>
                    <th className="py-3 px-3 text-right">Total Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {OFFICIAL_RAB.INCOME_ITEMS.map((inc) => (
                    <tr key={inc.no} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-400">
                        {inc.no}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        {inc.source}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono">
                        {inc.volume}
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-600">
                        {inc.unit}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-800">
                        Rp {inc.price.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-black text-emerald-700">
                        Rp {inc.total.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-300 font-bold bg-slate-50">
                    <td colSpan="5" className="py-3.5 px-3 uppercase font-black text-slate-900">
                      Total Rencana Pemasukan Resmi
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-black text-emerald-700 text-base">
                      Rp {OFFICIAL_RAB.TOTAL_INCOME.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

      </div>
    </SimpaskorSidebarLayout>
  );
}
