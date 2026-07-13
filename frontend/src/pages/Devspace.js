import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ChevronRight, Activity } from 'lucide-react';
import './Devspace.css';

const Devspace = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="devspace-container">
      {/* Glow effects */}
      <div className="glow-circle top-left"></div>
      <div className="glow-circle bottom-right"></div>

      {/* Custom Navbar (Breadcrumbs only: home > devspace) */}
      <nav className={`devspace-navbar ${isScrolled ? 'scrolled' : ''} animate-fade-in`}>
        <div className="devspace-nav-container">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">home</Link>
            <ChevronRight size={14} className="breadcrumb-icon" />
            <span className="breadcrumb-current">devspace</span>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="devspace-header animate-fade-in">
        <h1 className="devspace-title">
          Dev<span className="gradient-text">space</span>
        </h1>
        <p className="devspace-subtitle">
          My central hub for experimental projects, microservices status, and security telemetry.
        </p>
      </header>

      {/* Console logs main panel */}
      <main className="devspace-content glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="dashboard-header">
          <div className="dashboard-title-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={18} style={{ color: 'var(--accent-color)' }} />
            <span className="dashboard-title" style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>System Console Logs</span>
          </div>
          <div className="live-badge">
            <Activity size={12} className="pulse" />
            <span>LIVE MONITORS</span>
          </div>
        </div>

        <div className="dashboard-body">
          <div className="terminal-view">
            <div className="terminal-bar">
              <div className="term-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="term-title">bash - devspace@jay-server</span>
            </div>
            <div className="terminal-body font-mono">
              <p className="term-line prompt">$ systemctl status devspace-agent.service</p>
              <p className="term-line success">● devspace-agent.service - Jay's Devspace Monitoring Agent</p>
              <p className="term-line text-secondary">   Loaded: loaded (/etc/systemd/system/devspace-agent.service; enabled; vendor preset: enabled)</p>
              <p className="term-line text-secondary">   Active: active (running) since Mon 2026-07-13 14:02:11 UTC; 7h ago</p>
              <p className="term-line success">   Main PID: 24892 (devspace-agent)</p>
              <p className="term-line text-secondary">   Tasks: 12 (limit: 4915)</p>
              <p className="term-line text-secondary">   Memory: 48.2M</p>
              <p className="term-line prompt">$ tail -n 5 /var/log/devspace.log</p>
              <p className="term-line text-muted">[14:22:10] INFO  [proxy] TLS handshake successful with backend-01</p>
              <p className="term-line text-muted">[15:02:54] INFO  [k8s-mon] Syncing deployment replica sets...</p>
              <p className="term-line text-muted">[16:11:42] INFO  [security] Threat model analyzer updated definitions</p>
              <p className="term-line text-muted">[17:34:02] INFO  [proxy] Connection closed safely by remote server</p>
              <p className="term-line prompt">$ <span className="term-cursor">|</span></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Devspace;
