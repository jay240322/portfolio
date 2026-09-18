import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Code, Menu, X, Briefcase, BookOpen, Book, User, FileText } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active section when route changes
  useEffect(() => {
    if (location.pathname === '/github') {
      setActiveSection('github');
    } else if (location.pathname === '/') {
      const sectionId = location.state?.scrollToSection;
      if (sectionId) {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
          setTimeout(() => {
            if (window.lenis) {
              window.lenis.scrollTo(element, { duration: 1.2, offset: -40 });
            } else {
              const top = element.getBoundingClientRect().top + window.scrollY - 70;
              window.scrollTo({ top, behavior: 'smooth' });
            }
            navigate('/', { replace: true, state: {} });
          }, 150);
        }
      }
    }
  }, [location.pathname, location.state, navigate]);

  // Scrollspy: update active section as user scrolls through the page
  const handleScrollSpy = useCallback(() => {
    if (location.pathname !== '/') return;

    const scrollY = window.scrollY;

    // If near the very top, activate Home
    if (scrollY < 180) {
      setActiveSection('home');
      return;
    }

    // If near the bottom of the page, activate Social
    if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 70) {
      setActiveSection('social');
      return;
    }

    const sections = ['stack', 'works', 'notes', 'stories', 'social'];
    let current = 'home';
    for (const sectionId of sections) {
      const el = document.getElementById(sectionId);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Section is in view when its top has reached the upper third of screen
        if (rect.top <= 260) {
          current = sectionId;
        }
      }
    }
    setActiveSection(current);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') return;

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollSpy);
    };
  }, [location.pathname, handleScrollSpy]);

  const scrollToContainer = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      if (window.lenis) {
        window.lenis.scrollTo(element, { duration: 1.2, offset: -40 });
      } else {
        const top = element.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  const handleNavClick = (link, e) => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);

    if (link.isResume) {
      // Resume click handling - open in new tab
      try {
        const localResume = localStorage.getItem('portfolio_resume');
        if (localResume && localResume.startsWith('data:application/pdf')) {
          e.preventDefault();
          const base64Data = localResume.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, '_blank');
          return;
        }
      } catch (err) {
        console.error('Error opening local resume:', err);
      }
      return;
    }

    if (link.sectionId) {
      if (location.pathname === '/') {
        e.preventDefault();
        scrollToContainer(link.sectionId);
      } else {
        navigate('/', { state: { scrollToSection: link.sectionId } });
      }
    }
  };

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      scrollToContainer('home');
    }
  };

  const navLinks = [
    { id: 'home', path: '/', label: 'Home', sectionId: 'home', icon: <Home size={14} /> },
    { id: 'stack', path: '/', label: 'Stack', sectionId: 'stack', icon: <Code size={14} /> },
    { id: 'works', path: '/', label: 'Works', sectionId: 'works', icon: <Briefcase size={14} /> },
    { id: 'notes', path: '/', label: 'Notes', sectionId: 'notes', icon: <BookOpen size={14} /> },
    { id: 'stories', path: '/', label: 'Stories', sectionId: 'stories', icon: <Book size={14} /> },
    { id: 'social', path: '/', label: 'Social', sectionId: 'social', icon: <User size={14} /> },
    { id: 'resume', path: `${API_URL}/api/resume/view`, label: 'Resume', isResume: true, icon: <FileText size={14} /> },
    { id: 'github', path: '/github', label: 'GitHub', icon: <Code size={14} /> },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${location.pathname !== '/' ? 'subpage' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={handleLogoClick}>
          <span className="nav-logo-text">Jay</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-only">
          {navLinks.map((link) => {
            const isActive = location.pathname === '/github'
              ? link.id === 'github'
              : location.pathname === '/' && activeSection === link.id;

            if (link.isResume) {
              return (
                <a
                  key={link.id}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link"
                  onClick={(e) => handleNavClick(link, e)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              );
            }

            return (
              <Link
                key={link.id}
                to={link.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => handleNavClick(link, e)}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          className="mobile-menu-toggle mobile-only"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu glass-panel mobile-only animate-fade-in">
          {navLinks.map((link) => {
            const isActive = location.pathname === '/github'
              ? link.id === 'github'
              : location.pathname === '/' && activeSection === link.id;

            if (link.isResume) {
              return (
                <a
                  key={link.id}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-link"
                  onClick={(e) => handleNavClick(link, e)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              );
            }

            return (
              <Link
                key={link.id}
                to={link.path}
                className={`mobile-link ${isActive ? 'active' : ''}`}
                onClick={(e) => handleNavClick(link, e)}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
