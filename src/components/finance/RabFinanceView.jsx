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
  ShieldCheck
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { COMPETITION, PAYMENT } from '../../config.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function RabFinanceView() {
  const {
    teams,
    currentUser,
    role,
    settings
  } = useCompetition();

  const userRole = currentUser?.role || role || 'publik';
  const canManageFinance = ['admin', 'superadmin'].includes(userRole);

  // Initial Budget Plan (RAB Standar LBB Mu'allimin 2027)
  const [budgetExpenses, setBudgetExpenses] = useState([
    { id: 'exp-1', category: 'Kejuaraan & Hadiah', item: 'Uang Pembinaan Juara Umum, Utama 1-3 & Harapan 1-3 (SD & SMP)', budgeted: 16000000, realized: 16000000, status: 'Fixed' },
    { id: 'exp-2', category: 'Kejuaraan & Hadiah', item: 'Piala Bergilir Logam & Trofi Tetap Kejuaraan (36 Set)', budgeted: 6500000, realized: 6200000, status: 'Verified' },
    { id: 'exp-3', category: 'Dewan Juri', item: 'Honorarium & Transport 6 Dewan Juri (TNI, POLRI, & Profesional)', budgeted: 7500000, realized: 7500000, status: 'Fixed' },
    { id: 'exp-4', category: 'Operasional Lapangan', item: 'Sewa Tenda Transit, Rigging Pos Juri, Sound System, & Genset Lapangan', budgeted: 5800000, realized: 5500000, status: 'Verified' },
    { id: 'exp-5', category: 'Perlengkapan Peserta', item: 'Cocard Official, Nomor Dada Peleton, ID Card & Tali Lanyard', budgeted: 2400000, realized: 2250000, status: 'Verified' },
    { id: 'exp-6', category: 'Logistik Basecamp', item: 'Air Mineral Dus (40 Box) & Kantong Sampah Terpilah', budgeted: 1500000, realized: 1400000, status: 'Verified' },
    { id: 'exp-7', category: 'Konsumsi', item: 'Konsumsi Panitia, Dewan Juri, Petugas Keamanan, & Tamu Undangan (2 Hari)', budgeted: 4200000, realized: 3900000, status: 'Estimated' },
    { id: 'exp-8', category: 'Medis & P3K', item: 'Fasilitas Medis, Tim PMI, Tabung Oksigen, Obat-obatan & Ambulans Siaga', budgeted: 1800000, realized: 1650000, status: 'Verified' },
    { id: 'exp-9', category: 'Kesekretariatan & IT', item: 'Cetak Juknis, Sertifikat Hologram, Domain & Cloud Server SaaS LBB', budgeted: 2200000, realized: 2100000, status: 'Verified' },
    { id: 'exp-10', category: 'Publikasi & Dokumentasi', item: 'Spanduk Banner Rentang, Backdrop Panggung, Dokumentasi Video Drone', budgeted: 1600000, realized: 1500000, status: 'Verified' },
  ]);

  // Real Revenue Calculations from Database Teams
  const paidTeamsCount = teams.filter(t => t.paymentStatus === 'paid' || t.status === 'verified' || t.status === 'drawn').length;
  const verifiedRevenue = teams
    .filter(t => t.paymentStatus === 'paid' || t.status === 'verified' || t.status === 'drawn')
    .reduce((sum, t) => sum + (t.feeAmount || 350000), 0);

  // Projected Inflows
  const targetTeamsTotal = (COMPETITION.MAX_TEAMS_SD || 18) + (COMPETITION.MAX_TEAMS_SMP || 18);
  const projectedRegistrationRevenue = (18 * 350000) + (18 * 400000); // Gelombang 1 & 2
  const projectedTicketRevenue = 1200 * 10000; // 1.200 tiket suporter × Rp10.000
  const projectedSponsorRevenue = 15000000; // Sponsor & Bazaar
  const projectedTotalRevenue = projectedRegistrationRevenue + projectedTicketRevenue + projectedSponsorRevenue;

  // Total Outflows
  const totalBudgetedExpense = budgetExpenses.reduce((sum, e) => sum + e.budgeted, 0);
  const totalRealizedExpense = budgetExpenses.reduce((sum, e) => sum + e.realized, 0);

  // Cash Flow Surplus / Balance
  const currentCashIn = verifiedRevenue + 4500000; // Tiket presale / DP sponsor awal
  const netBalance = currentCashIn - totalRealizedExpense;
  const projectedSurplus = projectedTotalRevenue - totalBudgetedExpense;

  const handlePrintRAB = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csv = 'Kategori,Uraian Pos Anggaran,Anggaran Rencana (RAB),Realisasi Aktual,Status\n';
    budgetExpenses.forEach(e => {
      csv += `"${e.category}","${e.item}",${e.budgeted},${e.realized},"${e.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RAB_Keuangan_LBB_Muallimin_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SimpaskorSidebarLayout
      activeMenu="rab"
      title="RAB & Manajemen Keuangan SaaS"
      subtitle="Rencana Anggaran Biaya, Arus Kas (Cash Flow), Realisasi Pemasukan & Alokasi Pengeluaran LBB 2027"
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
            <span className="hidden sm:inline">Cetak Laporan</span>
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
                <span>Financial SaaS Engine & Budgeting</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Rencana Anggaran Biaya (RAB) & Keuangan
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Pemantauan real-time saldo kas masuk dari registrasi peleton BRI, proyeksi tiket suporter, alokasi hadiah uang pembinaan, honorarium dewan juri, dan logistik kejuaraan.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 shrink-0 text-center min-w-[180px]">
              <span className="text-[10px] uppercase font-bold text-emerald-300 block">Proyeksi Surplus Lomba</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                Rp{(projectedSurplus / 1000000).toFixed(1)} Jt
              </span>
              <span className="text-[10px] text-emerald-300 font-bold block mt-1">
                Kondisi Keuangan Sehat (Surplus)
              </span>
            </div>
          </div>
        </div>

        {/* 4 Financial Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Pemasukan Terverifikasi</span>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">BRI Valid</span>
            </div>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              Rp{verifiedRevenue.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {paidTeamsCount} dari {targetTeamsTotal} kuota peleton terbayar
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Target Total Pemasukan</span>
              <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Estimasi RAB</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              Rp{projectedTotalRevenue.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Registrasi + Tiket Suporter + Sponsor
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Rencana Pengeluaran</span>
              <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Alokasi Pos</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              Rp{totalBudgetedExpense.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              10 Pos Operasional & Hadiah Juara
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Realisasi Pengeluaran</span>
              <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Aktual</span>
            </div>
            <div className="text-2xl font-black text-purple-700 font-mono">
              Rp{totalRealizedExpense.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Efisiensi Hemat Rp{(totalBudgetedExpense - totalRealizedExpense).toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Breakdown Tabel Rincian Anggaran (RAB) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase">Rincian Pos Anggaran Pengeluaran (Outflow)</h3>
              <p className="text-xs text-slate-500">Alokasi pos biaya kejuaraan, dewan juri, piala logam, operasional lapangan, dan medis</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                10 Pos Anggaran Terdata
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">No</th>
                  <th className="py-3 px-3">Kategori Pos</th>
                  <th className="py-3 px-3">Uraian Kebutuhan</th>
                  <th className="py-3 px-3 text-right">Anggaran Rencana</th>
                  <th className="py-3 px-3 text-right">Realisasi Aktual</th>
                  <th className="py-3 px-3 text-right">Selisih (Varian)</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {budgetExpenses.map((exp, idx) => {
                  const variance = exp.budgeted - exp.realized;
                  return (
                    <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-400">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        {exp.category}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 max-w-xs">
                        {exp.item}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-800">
                        Rp{exp.budgeted.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-purple-700">
                        Rp{exp.realized.toLocaleString('id-ID')}
                      </td>
                      <td className={`py-3.5 px-3 text-right font-mono font-bold ${
                        variance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {variance >= 0 ? `+Rp${variance.toLocaleString('id-ID')}` : `-Rp${Math.abs(variance).toLocaleString('id-ID')}`}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 font-bold bg-slate-50">
                  <td colSpan="3" className="py-3.5 px-3 uppercase font-black text-slate-900">
                    Total Anggaran Pengeluaran LBB
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-black text-slate-900">
                    Rp{totalBudgetedExpense.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-black text-purple-800">
                    Rp{totalRealizedExpense.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-black text-emerald-700">
                    +Rp{(totalBudgetedExpense - totalRealizedExpense).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-emerald-800">
                    Efisien
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Sumber Pendapatan & Sponsorship Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider block">1. Registrasi Kontingen</span>
            <div className="text-xl font-black text-slate-900 font-mono">
              Rp{projectedRegistrationRevenue.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-slate-500">
              Target 36 Peleton: Gelombang 1 (Rp350.000) & Gelombang 2 (Rp400.000)
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider block">2. Tiket Masuk Suporter</span>
            <div className="text-xl font-black text-slate-900 font-mono">
              Rp{projectedTicketRevenue.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-slate-500">
              Estimasi 1.200 tiket suporter & wali siswa × Rp10.000 / tiket
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider block">3. Sponsor & Bazaar Tenant</span>
            <div className="text-xl font-black text-slate-900 font-mono">
              Rp{projectedSponsorRevenue.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-slate-500">
              Kemitraan sponsor korporat & sewa stand bazaar UMKM pelajar
            </p>
          </div>
        </div>

      </div>
    </SimpaskorSidebarLayout>
  );
}
