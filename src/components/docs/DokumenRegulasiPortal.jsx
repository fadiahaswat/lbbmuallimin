import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ShieldAlert,
  Clock,
  FileText,
  Calendar,
  ExternalLink,
  Download,
  Share2,
  Printer
} from 'lucide-react';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import TeamProfileHeader from '../portal/participant/components/TeamProfileHeader.jsx';
import JuknisView from './JuknisView.jsx';
import TataTertibView from './TataTertibView.jsx';
import RundownView from './RundownView.jsx';
import ProposalView from './ProposalView.jsx';
import TimelinePanitiaView from './TimelinePanitiaView.jsx';
import { DOWNLOADS } from '../../config.js';

const TABS = [
  {
    id: 'juknis',
    label: 'Juknis & Materi PBB',
    badge: 'Regulasi',
    icon: BookOpen,
    desc: 'Pedoman Penilaian KS/BS, Juknis Lapangan & 26/28 Gerakan Resmi',
  },
  {
    id: 'tatib',
    label: 'Tata Tertib & Sanksi',
    badge: '15 Pasal',
    icon: ShieldAlert,
    desc: '15 Pasal Disiplin, Kewajiban Suporter & Matriks Penalti Poin',
  },
  {
    id: 'rundown',
    label: 'Rundown Acara',
    badge: 'Definitif',
    icon: Clock,
    desc: 'Jadwal Hari-H 24 Jan, Technical Meeting & Uji Coba Lapangan',
  },
  {
    id: 'proposal',
    label: 'Proposal Resmi',
    badge: 'Legalitas',
    icon: FileText,
    desc: 'Landasan Resmi, Tema Ksatria, Hadiah & Piala Kejuaraan',
  },
  {
    id: 'timeline',
    label: 'Timeline Panitia',
    badge: '37 Tahapan',
    icon: Calendar,
    desc: 'Master Roadmap 9 Fase Operasional (Fase A s.d. Fase I)',
  },
];

export default function DokumenRegulasiPortal({ initialTab = 'juknis' }) {
  const { currentUser, role, currentTeam } = useCompetition?.() || {};
  const isPeserta = (currentUser?.role || role) === 'peserta' || Boolean(currentTeam);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync if initialTab changes from parent/nav
  useEffect(() => {
    if (initialTab && TABS.some(t => t.id === initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const currentTabMeta = TABS.find(t => t.id === activeTab) || TABS[0];

  return (
    <SimpaskorSidebarLayout
      activeMenu="dokumen"
      title="Pusat Dokumen & Regulasi"
      subtitle="Portal tunggal petunjuk teknis, tata tertib, jadwal rundown, proposal resmi, dan agenda kerja LBB Mu'allimin 2027"
    >
      {/* Wrapper Utama: Ketika role Peserta, ikat seluruh card ke max-w-6xl mx-auto agar serasi dengan Portal */}
      <div className={isPeserta ? "max-w-6xl mx-auto space-y-4 sm:space-y-6" : "space-y-6"}>
        {/* Banner Profil Peleton Resmi (Di mobile hanya tampil di beranda, desktop tetap tampil) */}
        {isPeserta && currentTeam && (
          <div className="hidden sm:block">
            <TeamProfileHeader currentTeam={currentTeam} />
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[600px]">
          {activeTab === 'juknis' && <JuknisView embedded={true} />}
          {activeTab === 'tatib' && <TataTertibView embedded={true} />}
          {activeTab === 'rundown' && <RundownView embedded={true} />}
          {activeTab === 'proposal' && <ProposalView embedded={true} />}
          {activeTab === 'timeline' && <TimelinePanitiaView embedded={true} />}
        </div>

      </div>
    </SimpaskorSidebarLayout>
  );
}
