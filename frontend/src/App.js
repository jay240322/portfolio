import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GithubRepos from './pages/GithubRepos';
import Admin from './pages/Admin';
import Devspace from './pages/Devspace';
import Kubesense from './pages/Kubesense';
import Deployguard from './pages/Deployguard';
import ClickSpark from './components/ClickSpark';
import Loader from './components/Loader';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './context/ThemeContext';
import Lenis from '@studio-freight/lenis';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';

// External Redirect Component for DeployGuard live website
const ExternalRedirect = ({ url }) => {
  useEffect(() => {
    window.location.replace(url);
  }, [url]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        background: 'var(--bg-color, #130D14)',
        color: 'var(--text-primary, #ffffff)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <p style={{ fontSize: '1.1rem' }}>Redirecting to DeployGuard...</p>
      <a
        href={url}
        style={{
          color: '#3b82f6',
          textDecoration: 'underline',
          fontSize: '0.9rem'
        }}
      >
        Click here if you are not redirected automatically
      </a>
    </div>
  );
};

function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [fadeOutLoader, setFadeOutLoader] = useState(false);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const startTime = Date.now();

    // Disable scrolling initially
    document.body.style.overflow = 'hidden';
    
    // Wait for lenis to be initialized before stopping it
    const stopScrollTimer = setInterval(() => {
      if (window.lenis) {
        window.lenis.stop();
        clearInterval(stopScrollTimer);
      }
    }, 50);

    const initData = async () => {
      // Create a promise that resolves after 4 seconds as a fallback timeout
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 4000));
      
      const fetchPromise = (async () => {
        try {
          const res = await fetch(`${API_URL}/api/portfolio-all`);
          if (res.ok) {
            const data = await res.json();
            if (data && Object.keys(data).length > 0) {
              if (data.techStack) localStorage.setItem('portfolio_techStack', JSON.stringify(data.techStack));
              if (data.works) localStorage.setItem('portfolio_works', JSON.stringify(data.works));
              if (data.notes) localStorage.setItem('portfolio_notes', JSON.stringify(data.notes));
              if (data.stories) localStorage.setItem('portfolio_stories', JSON.stringify(data.stories));
              if (data.connect) localStorage.setItem('portfolio_connect', JSON.stringify(data.connect));
            }
          }
        } catch (err) {
          console.warn("Failed to fetch initial portfolio data:", err);
        }
      })();

      // Wait for either the fetch to complete or the 4-second timeout fallback
      await Promise.race([fetchPromise, timeoutPromise]);

      // Enforce a minimum animation duration of 1.5s
      const timeElapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 1500 - timeElapsed);

      setTimeout(() => {
        setFadeOutLoader(true);
        document.body.style.overflow = '';
        if (window.lenis) {
          window.lenis.start();
        }
        setTimeout(() => {
          setShowLoader(false);
        }, 600);
      }, remainingTime);
    };

    initData();

    return () => {
      clearInterval(stopScrollTimer);
    };
  }, []);

  useEffect(() => {
    // Initialize AOS scroll animations matching settings from reference website
    AOS.init({
      once: false, // Animate both scrolling down and up
      delay: 0,
      duration: 700,
      easing: 'ease-out-cubic',
      offset: 0, // trigger reveals immediately upon entering screen to avoid blank space
    });
    window.AOS = AOS;

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
    const isDevspacePath = location.pathname === '/devspace';
    const isGithubPath = location.pathname === '/github';
    const isKubesensePath = location.pathname === '/kubesense';

    const normalizedPath = location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    const isDeployGuardExternal = normalizedPath === '/deployguard';
    const isDeployGuardDetail = normalizedPath === '/deploy-guard';
    const isDeployGuardPath = isDeployGuardExternal || isDeployGuardDetail;

    return (
      <ClickSpark sparkColor="rgba(59, 130, 246, 0.6)" sparkSize={12} sparkRadius={20} sparkCount={10} duration={400}>
        <div className="app-container">
          {showLoader && !isDeployGuardPath && <Loader fadeOut={fadeOutLoader} />}
          {!isAdminPath && !isDevspacePath && !isGithubPath && !isKubesensePath && !isDeployGuardPath && <Navbar />}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/github" element={<GithubRepos />} />
              <Route path={adminRoute} element={<Admin />} />
              <Route path="/devspace" element={<Devspace />} />
              <Route path="/kubesense" element={<Kubesense />} />

              {/* Internal Project Detail Page: /Deploy-guard */}
              <Route path="/Deploy-guard" element={<Deployguard />} />
              <Route path="/deploy-guard" element={<Deployguard />} />
              <Route path="/Deploy-Guard" element={<Deployguard />} />

              {/* External Live Website Redirect: /deployguard */}
              <Route path="/deployguard" element={<ExternalRedirect url="https://deploy-guard-i9wb.onrender.com/" />} />
              <Route path="/Deployguard" element={<ExternalRedirect url="https://deploy-guard-i9wb.onrender.com/" />} />
              <Route path="/DeployGuard" element={<ExternalRedirect url="https://deploy-guard-i9wb.onrender.com/" />} />
              <Route path="/DEPLOYGUARD" element={<ExternalRedirect url="https://deploy-guard-i9wb.onrender.com/" />} />
            </Routes>
          </main>
        </div>
      </ClickSpark>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
