import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Code, Menu, X, Briefcase, Layers, BookOpen, Book, User, Mail } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.startsWith('#') ? location.hash.slice(1) : location.hash;
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          if (window.lenis) {
            window.lenis.scrollTo(element, { duration: 1.2 });
          } else {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    } else {
      setTimeout(() => {
        if (window.lenis) {
          window.lenis.scrollTo(0, { duration: 1.2 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 150);
    }
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
    { path: '/#stack', label: 'Stack', icon: <Layers size={18} />, isHash: true },
    { path: '/#works', label: 'Works', icon: <Briefcase size={18} />, isHash: true },
    { path: '/#notes', label: 'Notes', icon: <BookOpen size={18} />, isHash: true },
    { path: '/#stories', label: 'Stories', icon: <Book size={18} />, isHash: true },
    { path: '/#contact', label: 'Contact', icon: <Mail size={18} />, isHash: true },
    { path: '/#social', label: 'Social', icon: <User size={18} />, isHash: true },
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
          {navLinks.map((link) => (
            link.isHash ? (
              <a
                key={link.path}
                href={link.path}
                className="nav-link"
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            )
          ))}
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
          {navLinks.map((link) => (
            link.isHash ? (
              <a
                key={link.path}
                href={link.path}
                className="mobile-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            )
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
