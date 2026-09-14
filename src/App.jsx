import React, { useState, useEffect } from 'react';
import { SITE, NAVBAR } from './config.js';
import { CompetitionProvider, useCompetition } from './context/CompetitionContext.jsx';
import RoleBar from './components/layout/RoleBar.jsx';
import Navbar from './components/Navbar.jsx';
import MobileMenu from './components/MobileMenu.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import TimeLocation from './components/TimeLocation.jsx';
import Registration from './components/Registration.jsx';
import Rules from './components/Rules.jsx';
import MateriLomba from './components/MateriLomba.jsx';
import Prizes from './components/Prizes.jsx';
import TataTertib from './components/TataTertib.jsx';
import Downloads from './components/Downloads.jsx';
import FaqContact from './components/FaqContact.jsx';
import Footer from './components/Footer.jsx';
import FabWhatsApp from './components/FabWhatsApp.jsx';
import StickyCta from './components/StickyCta.jsx';

// Portal & Management Systems
import RegistrationWizard from './components/portal/RegistrationWizard.jsx';
import RegistrationStatusModal from './components/portal/RegistrationStatusModal.jsx';
import ParticipantDashboard from './components/portal/ParticipantDashboard.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import JuryScoringApp from './components/scoring/JuryScoringApp.jsx';
import AnnouncementPortal from './components/announcement/AnnouncementPortal.jsx';
import SuperadminPanel from './components/superadmin/SuperadminPanel.jsx';
import DocumentViewerModal from './components/documents/DocumentViewerModal.jsx';
import AuthModal from './components/auth/AuthModal.jsx';

function MainApp() {
  const { activeView, activeModal, modalData, closeModal } = useCompetition();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    // Set Document Title & Description
    document.title = SITE.TITLE;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', SITE.DESCRIPTION);
    }

    function handleScroll() {
      if (window.scrollY > NAVBAR.STICKY_CTA_THRESHOLD) {
        setShowStickyCta(true);
      } else {
        setShowStickyCta(false);
      }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-red-200 font-sans">
      {/* 1. Global Role Switcher Bar (Only in administrative / dedicated back-office views) */}
      {activeView !== 'landing' && <RoleBar />}

      {/* 2. Active View Routing */}
      {activeView === 'landing' && (
        <>
          <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
          <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

          <main>
            <Hero />
            <About />
            <TimeLocation />
            <Registration />
            <Rules />
            <MateriLomba />
            <Prizes />
            <TataTertib />
            <Downloads />
            <FaqContact />
          </main>

          <Footer />
          <FabWhatsApp isShiftedUp={showStickyCta} />
          <StickyCta isVisible={showStickyCta} />
        </>
      )}

      {activeView === 'peserta_dashboard' && <ParticipantDashboard />}
      {activeView === 'admin' && <AdminDashboard />}
      {activeView === 'juri' && <JuryScoringApp />}
      {activeView === 'superadmin' && <SuperadminPanel />}
      {activeView === 'announcement' && <AnnouncementPortal />}

      {/* 3. Global Modals */}
      <RegistrationWizard
        isOpen={activeModal === 'regWizard'}
        onClose={closeModal}
      />

      <RegistrationStatusModal
        isOpen={activeModal === 'statusCheck'}
        onClose={closeModal}
      />

      <DocumentViewerModal
        isOpen={activeModal === 'docViewer'}
        onClose={closeModal}
        data={modalData}
      />

      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <CompetitionProvider>
      <MainApp />
    </CompetitionProvider>
  );
}
