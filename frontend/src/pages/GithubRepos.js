import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, GitFork, BookOpen, ExternalLink, Activity, ChevronRight } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import './GithubRepos.css';

const GithubRepos = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const GITHUB_USERNAME = 'jay240322';
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`);
        const data = await response.json();
        setRepos(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching repos:', error);
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const handleResumeClick = (e) => {
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
      }
    } catch {
      // Fallback to normal anchor click
    }
  };

  return (
    <div className="repos-container">
      {/* Custom Navbar (Breadcrumbs only: home > github) */}
      <nav className={`github-navbar ${isScrolled ? 'scrolled' : ''} animate-fade-in`}>
        <div className="github-nav-container">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">home</Link>
            <ChevronRight size={14} className="breadcrumb-icon" />
            <span className="breadcrumb-current">github</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="glow-circle top-right"></div>
      
      <div className="repos-header animate-fade-in">
        <h1 className="repos-title">
          My <span className="gradient-text">GitHub</span> Activity
        </h1>
        <p className="repos-subtitle">
          Live feed of my latest projects, updates, and contributions.
        </p>
      </div>

      {loading ? (
        <div className="loading-state">
          <Activity className="spinner" size={40} />
          <p>Fetching latest repositories...</p>
        </div>
      ) : (
        <div className="repos-grid">
          {repos.length > 0 ? (
            repos.map((repo, index) => (
              <a 
                href={repo.html_url} 
                target="_blank" 
                rel="noreferrer" 
                key={repo.id} 
                className="repo-card glass-panel animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="repo-card-header">
                  <BookOpen className="repo-icon" size={20} />
                  <h3 className="repo-name">{repo.name}</h3>
                  <ExternalLink className="link-icon" size={16} />
                </div>
                
                <p className="repo-desc">
                  {repo.description || "No description provided."}
                </p>

                <div className="repo-meta">
                  {repo.language && (
                    <span className="repo-lang">
                      <span className="lang-dot"></span>
                      {repo.language}
                    </span>
                  )}
                  <span className="repo-stat">
                    <Star size={14} /> {repo.stargazers_count}
                  </span>
                  <span className="repo-stat">
                    <GitFork size={14} /> {repo.forks_count}
                  </span>
                </div>
              </a>
            ))
          ) : (
            <div className="no-repos">No repositories found for this user.</div>
          )}
        </div>
      )}

      {/* 3-Column Minimalist Footer (Contact / Connect / Resources) */}
      <footer className="footer-minimal-container">
        <div className="footer-grid">
          {/* Column 1: Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-links-list">
              <li className="footer-location-text">
                Ahmedabad, Gujarat, India
              </li>
              <li>
                <a href="mailto:pateljay0j@gmail.com" className="footer-link">
                  pateljay0j@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919104974534" className="footer-link">
                  +91 9104974534
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Connect */}
          <div className="footer-col">
            <h4 className="footer-col-title">Connect</h4>
            <ul className="footer-links-list">
              <li>
                <a href="https://github.com/jay240322" target="_blank" rel="noopener noreferrer" className="footer-link">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/jaypatel24" target="_blank" rel="noopener noreferrer" className="footer-link">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://dev.to/jaypatel_24" target="_blank" rel="noopener noreferrer" className="footer-link">
                  Dev
                </a>
              </li>
              <li>
                <a href="https://x.com/jaypatel_24" target="_blank" rel="noopener noreferrer" className="footer-link">
                  X
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="footer-col">
            <h4 className="footer-col-title">Resources</h4>
            <ul className="footer-links-list">
              <li>
                <Link
                  to="/"
                  className="footer-link"
                >
                  Home
                </Link>
              </li>
              <li>
                <a href="https://jaypatel2403.hashnode.dev/" target="_blank" rel="noopener noreferrer" className="footer-link">
                  Articles
                </a>
              </li>
              <li>
                <a href="https://medium.com/@JayPatel_1" target="_blank" rel="noopener noreferrer" className="footer-link">
                  Stories
                </a>
              </li>
              <li>
                <a
                  href={`${API_URL}/api/resume/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                  onClick={handleResumeClick}
                >
                  Resume
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider Line & Copyright */}
        <hr className="footer-divider" />
        <div className="footer-bottom-copyright">
          <p>2026 @ Jay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default GithubRepos;
