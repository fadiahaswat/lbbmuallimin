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
  const { currentUser, role, currentTeam, settings } = useCompetition?.() || {};
  const isPeserta = (currentUser?.role || role) === 'peserta' || Boolean(currentTeam);
  const isRatified = Boolean(settings?.juknisPenilaianPublished && settings?.juknisPenilaianRatifiedAt);
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
      hideHeader={true}
    >
      <section className="rounded-2xl sm:rounded-[26px] border border-slate-200/80 bg-white p-4 sm:p-7 shadow-[0_18px_46px_rgba(15,23,42,0.06)] space-y-5 sm:space-y-6">
        {/* Panel Header + Segmented Tabs (Identik dengan Pusat Unduhan di Portal Peserta) */}
        <div className="flex flex-col gap-3.5 border-b border-slate-100 pb-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
              {React.createElement(currentTabMeta.icon || BookOpen, { className: 'w-5 h-5 text-amber-400' })}
            </span>
            <div className="min-w-0">
              <h1 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl truncate">
                Pusat Dokumen &amp; Regulasi Resmi
              </h1>
              <p className="text-xs text-slate-500 truncate">
                {currentTabMeta.desc}
              </p>
            </div>
          </div>

          {/* Navigation Segmented Pill Bar */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 overflow-x-auto no-scrollbar shrink-0">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-white text-slate-950 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[500px]">
          {activeTab === 'juknis' && <JuknisView embedded={true} />}
          {activeTab === 'tatib' && <TataTertibView embedded={true} />}
          {activeTab === 'rundown' && <RundownView embedded={true} />}
          {activeTab === 'proposal' && <ProposalView embedded={true} />}
          {activeTab === 'timeline' && <TimelinePanitiaView embedded={true} />}
        </div>
      </section>
    </SimpaskorSidebarLayout>
  );
}
