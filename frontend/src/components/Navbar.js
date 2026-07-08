import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Code, Menu, X, Briefcase, BookOpen, Book, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      const sectionId = location.state?.scrollToSection;
      const alreadyScrolled = location.state?.scrolled;

      if (sectionId && !alreadyScrolled) {
        const element = document.getElementById(sectionId);
        if (element) {
          setTimeout(() => {
            if (window.lenis) {
              window.lenis.scrollTo(element, { duration: 1.2 });
            } else {
              element.scrollIntoView({ behavior: 'smooth' });
            }
            // Mark as scrolled in the history state to prevent scrolling back on navigation POP or refresh
            navigate('/', { replace: true, state: { scrollToSection: sectionId, scrolled: true } });
          }, 150);
        }
      } else if (!sectionId) {
        setTimeout(() => {
          if (window.lenis) {
            window.lenis.scrollTo(0, { duration: 1.2 });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 150);
      }
    }
  }, [location, navigate]);

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
    { path: '/', label: 'Stack', icon: <Code size={18} />, state: { scrollToSection: 'stack' } },
    { path: '/', label: 'Works', icon: <Briefcase size={18} />, state: { scrollToSection: 'works' } },
    { path: '/', label: 'Notes', icon: <BookOpen size={18} />, state: { scrollToSection: 'notes' } },
    { path: '/', label: 'Stories', icon: <Book size={18} />, state: { scrollToSection: 'stories' } },
    { path: '/', label: 'Social', icon: <User size={18} />, state: { scrollToSection: 'social' } },
    { path: '/github', label: 'GitHub', icon: <Code size={18} /> },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="gradient-text">Jay</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-only">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path && !link.state;
            return (
              <Link
                key={link.label}
                to={link.path}
                state={link.state}
                className={`nav-link ${isActive ? 'active' : ''}`}
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
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu glass-panel mobile-only animate-fade-in">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path && !link.state;
            return (
              <Link
                key={link.label}
                to={link.path}
                state={link.state}
                className={`mobile-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
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
