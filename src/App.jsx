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
    this.state = { hasError: false, error: null, errorInfo: null, copied: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleCopyError = () => {
    const errorDetails = `[LBB MU'ALLIMIN - LAPORAN ERROR]\nWaktu: ${new Date().toLocaleString('id-ID')}\nURL: ${window.location.href}\nError: ${this.state.error?.toString() || 'Unknown Error'}\nStack: ${this.state.error?.stack || '-'}\nComponent: ${this.state.errorInfo?.componentStack || '-'}`;
    navigator.clipboard.writeText(errorDetails).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2500);
    });
  };

  handleSendWhatsApp = () => {
    const errorMsg = this.state.error?.message || this.state.error?.toString() || 'Unknown Error';
    const componentTrace = (this.state.errorInfo?.componentStack || '').trim().split('\n')[0] || '-';
    const text = `Halo Tim IT LBB Mu'allimin, aplikasi mengalami error:\n\n*Error:* ${errorMsg}\n*Halaman:* ${window.location.href}\n*Komponen:* ${componentTrace}\n*Waktu:* ${new Date().toLocaleString('id-ID')}\n\nMohon bantuannya, terima kasih.`;
    const waUrl = `https://wa.me/6285339213109?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || this.state.error?.toString() || 'Terjadi kesalahan sistem';

      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 text-center">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center font-black text-xl shrink-0">
                !
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">Terjadi Gangguan Sistem</h2>
                <p className="text-xs text-slate-400">Aplikasi mendeteksi error tak terduga.</p>
              </div>
            </div>

            {/* Kotak Detail Error */}
            <div className="bg-slate-950/80 border border-red-900/40 rounded-2xl p-4 text-xs font-mono text-red-300 overflow-x-auto max-h-40 break-all select-all">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Pesan Error:</div>
              <p className="font-semibold text-red-400">{errorMsg}</p>
              {this.state.error?.stack && (
                <p className="text-[11px] text-slate-500 mt-2 font-mono whitespace-pre-wrap line-clamp-3">
                  {this.state.error.stack}
                </p>
              )}
            </div>

            {/* Tombol Aksi */}
            <div className="space-y-2.5 pt-2">
              <div className="flex flex-row items-center gap-2.5">
                {/* Tombol Salin Error */}
                <button
                  type="button"
                  onClick={this.handleCopyError}
                  className="flex-1 py-3 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center text-center cursor-pointer active:scale-95"
                >
                  <span>{this.state.copied ? 'Berhasil Disalin' : 'Salin Pesan Error'}</span>
                </button>

                {/* Tombol Kirim ke WhatsApp IT */}
                <button
                  type="button"
                  onClick={this.handleSendWhatsApp}
                  className="flex-1 py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center justify-center text-center cursor-pointer active:scale-95"
                >
                  <span>Lapor WA Tim IT</span>
                </button>
              </div>

              {/* Tombol Muat Ulang */}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
              >
                Muat Ulang Halaman
              </button>
            </div>
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
