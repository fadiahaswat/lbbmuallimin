import React, { useState, useEffect } from 'react';
import { SITE, NAVBAR } from './config.js';
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

export default function App() {
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
    <div className="bg-white text-slate-900 selection:bg-red-200">
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
    </div>
  );
}
