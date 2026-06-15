import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GithubRepos from './pages/GithubRepos';
import Admin from './pages/Admin';
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

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/github" element={<GithubRepos />} />
            <Route path="/admin@jay" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
