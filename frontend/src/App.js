import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GithubRepos from './pages/GithubRepos';
import Admin from './pages/Admin';
import ClickSpark from './components/ClickSpark';
import Lenis from '@studio-freight/lenis';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize AOS scroll animations matching settings from reference website
    AOS.init({
      once: false, // Animate both scrolling down and up
      delay: 0,
      duration: 700,
      easing: 'ease-out-cubic',
      offset: 0, // trigger reveals immediately upon entering screen to avoid blank space
    });

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease
      orientation: 'vertical',
      smoothWheel: true,
    });

    // Expose lenis globally for component-level scrolling
    window.lenis = lenis;

    // requestAnimationFrame loop for Lenis
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Initial refresh to make sure positions are captured
    setTimeout(() => {
      AOS.refresh();
    }, 100);

    return () => {
      lenis.destroy();
      window.lenis = null;
      cancelAnimationFrame(rafId);
    };
  }, []);

function AppContent() {
  const location = useLocation();
  const adminRoute = process.env.REACT_APP_ADMIN_ROUTE || '/admin@jay';
  const isAdminPath = location.pathname === adminRoute;

  return (
    <ClickSpark sparkColor="rgba(59, 130, 246, 0.6)" sparkSize={12} sparkRadius={20} sparkCount={10} duration={400}>
      <div className="app-container">
        {!isAdminPath && <Navbar />}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/github" element={<GithubRepos />} />
            <Route path={adminRoute} element={<Admin />} />
          </Routes>
        </main>
      </div>
    </ClickSpark>
  );
}

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
