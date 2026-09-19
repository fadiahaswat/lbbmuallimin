import React, { useState, useEffect } from 'react';
import { SITE, NAVBAR } from './config.js';
import { CompetitionProvider, useCompetition } from './context/CompetitionContext.jsx';
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
import MobileWarningOverlay from './components/MobileWarningOverlay.jsx';

// Dedicated Full Pages & Views (Lazy loaded for optimal initial bundle performance)
const RegistrationWizard = React.lazy(() => import('./components/portal/RegistrationWizard.jsx'));
const RegistrationStatusModal = React.lazy(() => import('./components/portal/RegistrationStatusModal.jsx'));
const DocumentViewerModal = React.lazy(() => import('./components/documents/DocumentViewerModal.jsx'));
const AuthModal = React.lazy(() => import('./components/auth/AuthModal.jsx'));
// Portals & Backoffice Dashboards (Lazy loaded on demand)
const ParticipantDashboard = React.lazy(() => import('./components/portal/ParticipantDashboard.jsx'));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard.jsx'));
const JuryScoringApp = React.lazy(() => import('./components/scoring/JuryScoringApp.jsx'));
const AnnouncementPortal = React.lazy(() => import('./components/announcement/AnnouncementPortal.jsx'));
const SuperadminPanel = React.lazy(() => import('./components/superadmin/SuperadminPanel.jsx'));

// Adapted from Simpaskor (Fase 1 - 3): Lapangan & Klasemen
const StagingDashboard = React.lazy(() => import('./components/staging/StagingDashboard.jsx'));
const LiveLeaderboard = React.lazy(() => import('./components/leaderboard/LiveLeaderboard.jsx'));

function ViewLoader() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-10 h-10 border-3 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mb-4" />
      <p className="text-slate-400 font-mono text-xs tracking-widest uppercase">Memuat Tampilan...</p>
    </div>
  );
}

function MainApp() {
  const { activeView } = useCompetition();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    // Set Document Title & Description
    document.title = SITE.TITLE;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', SITE.DESCRIPTION);
    }

    let ticking = false;
    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowStickyCta(window.scrollY > NAVBAR.STICKY_CTA_THRESHOLD);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    setShowStickyCta(window.scrollY > NAVBAR.STICKY_CTA_THRESHOLD);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-red-200 font-sans">
      {/* Mobile device warning overlay */}
      <MobileWarningOverlay />

      {/* 1. Public Landing Page */}
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

      {/* 2. Secondary Full Pages & Backoffice (Lazy-Loaded in Suspense) */}
      <React.Suspense fallback={<ViewLoader />}>
        {activeView === 'register' && <RegistrationWizard />}
        {activeView === 'status_check' && <RegistrationStatusModal />}
        {activeView === 'document_viewer' && <DocumentViewerModal />}
        {activeView === 'auth' && <AuthModal />}
        {activeView === 'peserta_dashboard' && <ParticipantDashboard />}
        {activeView === 'admin' && <AdminDashboard />}
        {activeView === 'juri' && <JuryScoringApp />}
        {activeView === 'superadmin' && <SuperadminPanel />}
        {activeView === 'announcement' && <AnnouncementPortal />}
        {activeView === 'staging' && <StagingDashboard />}
        {activeView === 'live_leaderboard' && <LiveLeaderboard />}
      </React.Suspense>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto font-black text-xl">
              !
            </div>
            <h2 className="text-xl font-black text-white uppercase italic">Penyegaran Sistem</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sistem telah diperbarui. Silakan klik tombol di bawah untuk memuat ulang halaman secara bersih.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <CompetitionProvider>
        <MainApp />
      </CompetitionProvider>
    </ErrorBoundary>
  );
}
