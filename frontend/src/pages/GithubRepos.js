import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, GitFork, BookOpen, ExternalLink, Activity, ChevronRight } from 'lucide-react';
import './GithubRepos.css';

const GithubRepos = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const GITHUB_USERNAME = 'jay240322';

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
    </div>
  );
};

export default GithubRepos;
