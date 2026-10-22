import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Layers,
  ExternalLink,
  Lock,
  Database,
  Server,
  Key,
  GitBranch,
  FileText,
  AlertTriangle,
  Play,
  Search,
  Code,
  Eye,
  BarChart2,
  Shield,
  CheckCircle2,
  Network,
  Globe
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import './Deployguard.css';

const overviewLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'problems', label: 'Problems' },
  { id: 'features', label: 'Features' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'guide', label: 'Quick Guide' },
  { id: 'deepdive', label: 'Deep Dive' },
  { id: 'rules', label: 'Secret Rules' },
  { id: 'stack', label: 'Tech Stack' },
  { id: 'schema', label: 'DB Schema' }
];

const Deployguard = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (window.lenis) {
      try {
        window.lenis.scrollTo(0, { immediate: true });
      } catch (e) {}
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.15, rootMargin: '-15% 0px -60% 0px' }
    );

    overviewLinks.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    return () => {
      overviewLinks.forEach((link) => {
        const el = document.getElementById(link.id);
        if (el) observer.unobserve(el);
      });
    };
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

  // Steps focused entirely on how a user interacts with and uses the web platform
  const websiteSteps = [
    {
      title: "1. Access DeployGuard & Authenticate",
      description: "Open DeployGuard in your web browser. Sign in using your credentials or authenticate instantly with one click using Google OAuth 2.0 Single Sign-On (SSO).",
      action: "Web Portal Login",
      icon: Lock,
      highlights: [
        "Google OAuth 2.0 & Cookie Authentication",
        "Encrypted HttpOnly session cookie issuance",
        "Instant redirection to user security dashboard"
      ]
    },
    {
      title: "2. Connect & Register Your Target Git Repository",
      description: "From your dashboard, click 'Add Repository'. Paste your Git repository URL. DeployGuard automatically identifies your provider (GitHub, GitLab, Bitbucket, Azure DevOps) and registers your project workspace.",
      action: "Repository Setup",
      icon: GitBranch,
      highlights: [
        "Auto-detection: GitHub, GitLab, Bitbucket, Azure DevOps",
        "Supports both public and private repository connections",
        "Instant workspace link with zero repository lock-in"
      ]
    },
    {
      title: "3. Trigger Sandboxed Pre-Deployment Scan",
      description: "Select your repository and click 'Trigger Scan'. DeployGuard initiates an instant, sandboxed shallow scan with zero long-term disk retention, analyzing code line-by-line across 16+ secret definitions.",
      action: "1-Click Static Scan",
      icon: Play,
      highlights: [
        "Sub-second shallow ingestion (git clone --depth 1)",
        "Zero data retention — temporary sandbox auto-cleaned",
        "Scans 16+ pattern heuristics while skipping binary files"
      ]
    },
    {
      title: "4. Review Secret Findings & Safe Token Masking",
      description: "Review detected credential leaks on the interactive findings page. Raw secrets are automatically masked at the boundary (e.g., AKIA****************1234) with exact file paths and line numbers so your team can remediate safely.",
      action: "Masked Findings Radar",
      icon: ShieldAlert,
      highlights: [
        "Defense-in-depth token masking (AKIA****************1234)",
        "Exact line numbers and source file path identification",
        "Remediation guidelines to revoke and rotate exposed keys"
      ]
    },
    {
      title: "5. Explore Interactive CI/CD Pipeline DAG Graphs",
      description: "Switch to the 'Pipeline' tab to view parsed workflow files (.github/workflows/*.yml or Jenkinsfiles). The interactive Directed Acyclic Graph (DAG) maps jobs, prerequisites ('needs'), conditions ('if'), and parallel tasks.",
      action: "AST Workflow Visualizer",
      icon: Network,
      highlights: [
        "Abstract Syntax Tree (AST) parsing with YamlDotNet",
        "Visual Directed Acyclic Graph (DAG) of pipeline jobs",
        "Explicit dependency tracking (needs) and parallel stages"
      ]
    },
    {
      title: "6. Generate & Export Executive Vector PDF Audit Reports",
      description: "Click 'Download PDF Report' to generate an executive-ready vector PDF report powered by QuestPDF. The report includes severity distribution radar charts, compliance summaries, and remediation instructions.",
      action: "QuestPDF Vector Export",
      icon: FileText,
      highlights: [
        "In-memory vector PDF generation powered by QuestPDF",
        "Executive severity risk radar charts & finding tables",
        "Ready for compliance auditing and developer handoff"
      ]
    }
  ];

  const secretRules = [
    {
      name: "AWS Access Key ID",
      pattern: "\\bAKIA[0-9A-Z]{16}\\b",
      severity: "critical",
      description: "Detects exposed Amazon Web Services 20-character administrative access keys."
    },
    {
      name: "GitHub Personal Access Token",
      pattern: "\\bgh[pousr]_[A-Za-z0-9_]{36,}\\b",
      severity: "critical",
      description: "Identifies leaked fine-grained or classic GitHub Personal Access Tokens (PAT)."
    },
    {
      name: "Stripe Live Secret Key",
      pattern: "\\bsk_live_[A-Za-z0-9]{20,}\\b",
      severity: "high",
      description: "Catches live production Stripe payment processing credentials."
    },
    {
      name: "Database Connection URI",
      pattern: "(?i)(db|mysql|postgres)[_-]?(password|pwd)[\\s:=]+['\"][^'\"]{6,}['\"]",
      severity: "critical",
      description: "Detects hardcoded PostgreSQL, MySQL, and generic SQL connection passwords."
    },
    {
      name: "Private Cryptographic Key",
      pattern: "-----BEGIN (RSA|EC|DSA|OPENSSH)? PRIVATE KEY-----",
      severity: "critical",
      description: "Catches exposed PEM/OpenSSH private key blocks before deployment."
    },
    {
      name: "JWT Bearer Token",
      pattern: "\\beyJ[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\b",
      severity: "medium",
      description: "Flags hardcoded JSON Web Tokens embedded directly in client configurations."
    }
  ];

  const techStack = [
    { layer: "Framework", tech: "ASP.NET Core 10 (MVC)", desc: "High-throughput asynchronous web application framework" },
    { layer: "Language", tech: "C# 13 / .NET 10", desc: "Modern, type-safe, compiled high-performance backend programming language" },
    { layer: "ORM & Data", tech: "Entity Framework Core 10", desc: "Code-First migrations, automated relational querying, and database seeding" },
    { layer: "Database", tech: "PostgreSQL / SQLite", desc: "ACID compliant relational storage for users, repositories, scans, and pipeline metadata" },
    { layer: "PDF Generation", tech: "QuestPDF", desc: "In-memory fluent vector document layout engine for crisp executive audit reports" },
    { layer: "Workflow Parsing", tech: "YamlDotNet", desc: "Abstract Syntax Tree (AST) parser extracting jobs, dependencies, and conditions" },
    { layer: "Authentication", tech: "Cookie Auth + Firebase SDK", desc: "Secure PBKDF2 password hashing paired with Google OAuth 2.0 Single Sign-On" },
    { layer: "Styling & UI", tech: "Bootstrap 5.3 + Vanilla CSS", desc: "Custom design system with dark/light themes, sticky blurred headers, and micro-animations" }
  ];

  const dbEntities = [
    { entity: "AppUser", purpose: "Manages authenticated users, roles (Admin/User), Google OAuth IDs, and active state" },
    { entity: "Repository", purpose: "Tracks Git repository URLs, provider classification, owner namespaces, and scan triggers" },
    { entity: "SecretScan", purpose: "Logs individual scan operations, timestamp metrics, files analyzed, and total findings" },
    { entity: "SecretFinding", purpose: "Stores specific leaked credentials with line numbers, masked values, and severity levels" },
    { entity: "SecretRule", purpose: "Catalog of regex heuristic patterns (AWS, GitHub, Stripe, DB URIs, Private Keys)" },
    { entity: "PipelineFile", purpose: "Stores raw workflow contents (.github/workflows/*.yml, Jenkinsfile) per repository" },
    { entity: "PipelineStage", purpose: "Represents individual DAG job nodes, prerequisites (needs), parallel flags, and conditional clauses" }
  ];

  return (
    <div className="deployguard-container">
      {/* Custom Navbar (Breadcrumbs only: home > deployguard) */}
      <nav className={`deployguard-navbar ${isScrolled ? 'scrolled' : ''} animate-fade-in`}>
        <div className="deployguard-nav-container">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">home</Link>
            <ChevronRight size={14} className="breadcrumb-icon" />
            <span className="breadcrumb-current">Deploy-guard</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Floating Page Overview Navigation Sidebar */}
      <aside className="deployguard-sidebar-nav desktop-only">
        <div className="sidebar-nav-title">Page Overview</div>
        <div className="sidebar-nav-links">
          {overviewLinks.map((link) => (
            <button
              key={link.id}
              className={`sidebar-nav-btn ${activeSection === link.id ? 'active' : ''}`}
              onClick={() => {
                const el = document.getElementById(link.id);
                if (el) {
                  if (window.lenis) {
                    window.lenis.scrollTo(el, { offset: -120, duration: 1.2 });
                  } else {
                    const offsetPosition = el.getBoundingClientRect().top + window.scrollY - 120;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }
              }}
            >
              <span className="dot-indicator"></span>
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Header - Centered Layout */}
      <header className="deployguard-header animate-fade-in">
        <div className="hero-pill-badge">
          <ShieldCheck size={14} />
          <span>Enterprise DevSecOps Intelligence</span>
        </div>

        <div className="deployguard-title-row">
          <img
            src="/images/deployguard/logo.png"
            alt="DeployGuard Logo"
            className="deployguard-logo-badge"
          />
          <h1 className="deployguard-title">
            Deploy<span className="gradient-text">Guard</span>
          </h1>
        </div>

        <p className="deployguard-subtitle">
          Static Secret Detection, CI/CD Pipeline Visualizer & DevSecOps Intelligence Platform — Continuous pre-deployment security inspection for Git repositories.
        </p>

        {/* Action Buttons - Visit Website & GitHub Repo */}
        <div className="deployguard-hero-ctas">
          <a
            href="https://deploy-guard-i9wb.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hero-action primary-tint"
          >
            <Globe size={16} />
            <span>Visit the Website</span>
          </a>

          <a
            href="https://github.com/jay240322/Deploy-Guard"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hero-action"
          >
            <ExternalLink size={16} />
            <span>View GitHub Repo</span>
          </a>
        </div>

        <div className="hero-stats-row">
          <div className="hero-stat-pill">
            <Shield size={14} color="#60a5fa" />
            <span><strong>16+</strong> Secret Heuristics</span>
          </div>
          <div className="hero-stat-pill">
            <Cpu size={14} color="#60a5fa" />
            <span><strong>&lt; 1s</strong> Shallow Ingestion</span>
          </div>
          <div className="hero-stat-pill">
            <Network size={14} color="#60a5fa" />
            <span><strong>AST</strong> DAG Pipeline Visualizer</span>
          </div>
          <div className="hero-stat-pill">
            <FileText size={14} color="#60a5fa" />
            <span><strong>QuestPDF</strong> Vector Reports</span>
          </div>
        </div>
      </header>

      {/* 1. Overview Section */}
      <section id="overview" className="deployguard-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h2 className="section-title-open">
          <Shield size={24} color="#3b82f6" />
          <span>Platform Overview</span>
        </h2>
        <p className="section-lead-text">
          <strong>DeployGuard</strong> is an automated DevSecOps platform built with <strong>ASP.NET Core (.NET 10)</strong>. It safeguards organizations by proactively detecting hardcoded secrets, leaked API tokens, and cloud credentials in source repositories before code reaches production, while parsing complex CI/CD pipeline workflows into interactive, visual Directed Acyclic Graphs (DAGs).
        </p>

        <div className="why-choose-wrapper glass-panel">
          <h3 className="sub-section-title">Core Value Pillars</h3>
          <div className="why-choose-grid">
            <div className="why-item">
              <div className="why-icon-box">
                <Search size={22} />
              </div>
              <h3>Sub-Second Secret Detection</h3>
              <p>Line-by-line regex heuristic scanner matching across 16+ patterns including AWS, GitHub PATs, Stripe, and Private Keys.</p>
            </div>

            <div className="why-item">
              <div className="why-icon-box">
                <Lock size={22} />
              </div>
              <h3>Defense-in-Depth Masking</h3>
              <p>Raw secrets are masked at the service boundary (e.g. <code>AKIA****************1234</code>) preventing secondary leaks in logs and UI.</p>
            </div>

            <div className="why-item">
              <div className="why-icon-box">
                <GitBranch size={22} />
              </div>
              <h3>CI/CD AST Visualizer</h3>
              <p>Abstract Syntax Tree parsing converts GitHub Actions and Jenkinsfiles into clean visual stage diagrams with dependency mappings.</p>
            </div>

            <div className="why-item">
              <div className="why-icon-box">
                <FileText size={22} />
              </div>
              <h3>Executive Vector PDF Audits</h3>
              <p>Powered by QuestPDF to generate crisp, high-resolution audit reports with severity risk radars and line-by-line remediation guides.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Problems Solved */}
      <section id="problems" className="deployguard-section animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <h2 className="section-title-open">
          <AlertTriangle size={24} color="#3b82f6" />
          <span>Problems Solved</span>
        </h2>
        <p className="section-subtitle-open">
          Software teams deploy faster than ever, often exposing critical infrastructure to accidental leaks and unmonitored CI/CD pipeline configurations.
        </p>

        <div className="features-list-grid">
          <div className="feature-card glass-panel">
            <div className="feature-header">
              <Key size={20} className="feature-icon" />
              <h4>Accidental Credential Leaks</h4>
            </div>
            <p>Prevents developers from committing production database passwords, AWS IAM keys, and payment tokens directly into repositories.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-header">
              <Eye size={20} className="feature-icon" />
              <h4>CI/CD Pipeline Blindspots</h4>
            </div>
            <p>Eliminates confusion in complex workflows by converting multi-file YAML definitions into interactive stage dependency trees.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-header">
              <BarChart2 size={20} className="feature-icon" />
              <h4>Audit & Compliance Readiness</h4>
            </div>
            <p>Generates compliance-ready executive PDF reports with zero third-party software dependencies directly inside memory.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-header">
              <ShieldCheck size={20} className="feature-icon" />
              <h4>Sandboxed Zero Data Retention</h4>
            </div>
            <p>Uses isolated shallow Git clones (<code>--depth 1</code>) and cleans up immediately after scanning, ensuring total source privacy.</p>
          </div>
        </div>
      </section>

      {/* 3. Features */}
      <section id="features" className="deployguard-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h2 className="section-title-open">
          <CheckCircle2 size={24} color="#3b82f6" />
          <span>Key Features</span>
        </h2>
        <p className="section-subtitle-open">
          Engineered with enterprise security architecture, high-throughput C# 13 routines, and modern responsive user interfaces.
        </p>

        <div className="features-list-grid">
          <div className="feature-card glass-panel">
            <div className="feature-header">
              <Search size={20} className="feature-icon" />
              <h4>16+ Secret Pattern Definitions</h4>
            </div>
            <p>Pre-configured regex definitions targeting AWS, GitHub tokens, Stripe live keys, RSA private blocks, and DB URIs.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-header">
              <Network size={20} className="feature-icon" />
              <h4>Directed Acyclic Graph Visualizer</h4>
            </div>
            <p>Renders jobs, prerequisites (<code>needs</code>), parallel flags, and conditional branches (<code>if</code>) in an interactive UI.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-header">
              <Lock size={20} className="feature-icon" />
              <h4>Hybrid Authentication & SSO</h4>
            </div>
            <p>ASP.NET Core Cookie Authentication paired seamlessly with Firebase Google OAuth 2.0 Single Sign-On.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-header">
              <Server size={20} className="feature-icon" />
              <h4>Admin Governance Dashboard</h4>
            </div>
            <p>Global system metrics, risky repository ranking, user authorization management, and instant PDF intelligence exports.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-header">
              <Layers size={20} className="feature-icon" />
              <h4>Multi-Provider Git Ingestion</h4>
            </div>
            <p>Automatic provider discovery supporting GitHub, GitLab, Bitbucket, and Azure DevOps repository structures.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-header">
              <Cpu size={20} className="feature-icon" />
              <h4>Sub-Second Processing Engine</h4>
            </div>
            <p>Optimized file traversal ignores binary formats (.exe, .zip, .dll) and internal .git directories for lightning speed.</p>
          </div>
        </div>
      </section>

      {/* 4. System Architecture */}
      <section id="architecture" className="deployguard-section animate-fade-in" style={{ animationDelay: '0.22s' }}>
        <h2 className="section-title-open">
          <Layers size={24} color="#3b82f6" />
          <span>System Architecture</span>
        </h2>
        <p className="section-subtitle-open">
          DeployGuard adopts a 3-tier enterprise architecture separating UI presentation, sandboxed core services, and relational persistence.
        </p>

        <div className="architecture-diagram-wrapper glass-panel">
          <div className="architecture-layers-grid">
            <div className="arch-layer-card">
              <span className="arch-layer-badge">Presentation Layer</span>
              <h4>User Interface</h4>
              <p>Razor Views, guest landings, auth flows, responsive dark/light theme engine, and interactive DAG pipeline visualizer canvas.</p>
              <ul className="arch-components-list">
                <li>Client Browser & Google Fonts</li>
                <li>Bootstrap 5.3 + Custom CSS</li>
                <li>Theme Engine & Mobile Menu</li>
              </ul>
            </div>

            <div className="arch-layer-card">
              <span className="arch-layer-badge">Application Core</span>
              <h4>ASP.NET Core (.NET 10)</h4>
              <p>Orchestrates shallow ingestion, regex heuristics, YAML AST parsing, boundary token masking, and QuestPDF vector builders.</p>
              <ul className="arch-components-list">
                <li>RepositoryCloneService</li>
                <li>SecretScannerService</li>
                <li>PipelineParserService (YamlDotNet)</li>
                <li>QuestPDF Engine</li>
              </ul>
            </div>

            <div className="arch-layer-card">
              <span className="arch-layer-badge">Persistence Layer</span>
              <h4>Data & Storage</h4>
              <p>Entity Framework Core 10 relational queries backed by PostgreSQL or SQLite with automated schema seeding.</p>
              <ul className="arch-components-list">
                <li>PostgreSQL / SQLite ACID Storage</li>
                <li>EF Core 10 Code-First Migrations</li>
                <li>AppUser & Repository Relations</li>
              </ul>
            </div>
          </div>

          <div className="diagram-frame">
            <div className="diagram-visual-grid">
              <div className="diagram-node client-node">
                <div className="diagram-node-header">
                  <Globe size={18} />
                  <span>Client / User Interface Layer</span>
                </div>
                <p>Web Browser &bull; Razor Views &bull; Google OAuth 2.0 Single Sign-On &bull; DAG Canvas</p>
              </div>

              <div className="diagram-arrow">
                <span className="diagram-arrow-label">HTTPS / Session Cookies</span>
                <span className="diagram-arrow-symbol">&darr;</span>
              </div>

              <div className="diagram-node core-node">
                <div className="diagram-node-header">
                  <Cpu size={18} />
                  <span>ASP.NET Core 10 Application Engine</span>
                </div>
                <div className="diagram-subservices">
                  <div className="subservice-pill">
                    <strong>RepositoryCloneService</strong>
                    <span>git clone --depth 1 (Sandboxed temp dir)</span>
                  </div>
                  <div className="subservice-pill">
                    <strong>SecretScannerService</strong>
                    <span>Line-by-line regex engine (16+ rules)</span>
                  </div>
                  <div className="subservice-pill">
                    <strong>PipelineParserService</strong>
                    <span>YamlDotNet AST parser (DAG graph)</span>
                  </div>
                  <div className="subservice-pill">
                    <strong>QuestPDF Engine</strong>
                    <span>In-memory vector report builder</span>
                  </div>
                </div>
              </div>

              <div className="diagram-arrow">
                <span className="diagram-arrow-label">EF Core 10 Relational Queries</span>
                <span className="diagram-arrow-symbol">&darr;</span>
              </div>

              <div className="diagram-node db-node">
                <div className="diagram-node-header">
                  <Database size={18} />
                  <span>PostgreSQL / SQLite Storage Layer</span>
                </div>
                <p>AppUsers &bull; Repositories &bull; SecretScans &bull; SecretFindings &bull; PipelineStages</p>
              </div>
            </div>
          </div>
          <div className="diagram-caption">
            <span>Figure 1: DeployGuard Sandboxed Execution & Data Pipeline Flow</span>
          </div>
        </div>
      </section>

      {/* 5. How to Use: Website Walkthrough */}
      <section id="guide" className="deployguard-section animate-fade-in" style={{ animationDelay: '0.24s' }}>
        <h2 className="section-title-open">
          <Globe size={24} color="#3b82f6" />
          <span>How to Use the DeployGuard Website</span>
        </h2>
        <p className="section-subtitle-open">
          Step-by-step walkthrough showing how users navigate the website, connect repositories, run automated scans, and review intelligence reports.
        </p>

        <div className="timeline-steps">
          {websiteSteps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <div key={idx} className="timeline-step-block">
                <div className="step-meta-col">
                  <div className="timeline-badge">
                    <span>{idx + 1}</span>
                  </div>
                  {idx < websiteSteps.length - 1 && <div className="timeline-line"></div>}
                </div>

                <div className="step-content-col">
                  <div className="step-header-info">
                    <div className="step-title-row">
                      <h3>{step.title}</h3>
                      <span className="step-action-tag">
                        <StepIcon size={14} />
                        <span>{step.action}</span>
                      </span>
                    </div>
                    <p>{step.description}</p>
                  </div>

                  <div className="website-step-card glass-panel">
                    <div className="step-highlights-list">
                      {step.highlights.map((item, hIdx) => (
                        <div key={hIdx} className="step-highlight-item">
                          <CheckCircle2 size={16} className="step-check-icon" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Deep Dive: Under the Hood */}
      <section id="deepdive" className="deployguard-section animate-fade-in" style={{ animationDelay: '0.26s' }}>
        <h2 className="section-title-open">
          <Code size={24} color="#3b82f6" />
          <span>Deep Dive: Under the Hood</span>
        </h2>
        <p className="section-subtitle-open">
          Learn how DeployGuard achieves sub-second ingestion, defense-in-depth masking, and AST pipeline visual graphs.
        </p>

        <div className="features-list-grid">
          <div className="feature-card glass-panel">
            <div className="feature-header">
              <Cpu size={20} className="feature-icon" />
              <h4>1. Sandboxed Shallow Ingestion</h4>
            </div>
            <p>
              Instead of full clone bloat, DeployGuard runs <code>git clone --depth 1</code> into isolated temporary directories. Files are scanned and deleted immediately, ensuring <strong>zero long-term disk exposure</strong>.
            </p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-header">
              <ShieldAlert size={20} className="feature-icon" />
              <h4>2. Boundary Token Masking</h4>
            </div>
            <p>
              Whenever a match occurs, the <code>MaskSecretValue</code> routine redacts the middle 70% of characters (e.g. <code>AKIA****************1234</code>) before saving to the database, preventing secondary leakage.
            </p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-header">
              <GitBranch size={20} className="feature-icon" />
              <h4>3. YamlDotNet AST CI/CD Parser</h4>
            </div>
            <p>
              Parses workflow YAML documents into an Abstract Syntax Tree (AST), resolving dependencies specified via <code>needs</code> and organizing stages into parallel vs. sequential DAG branches.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Secret Rules & Heuristics */}
      <section id="rules" className="deployguard-section animate-fade-in" style={{ animationDelay: '0.28s' }}>
        <h2 className="section-title-open">
          <Key size={24} color="#3b82f6" />
          <span>Secret Detection Rules & Signatures</span>
        </h2>
        <p className="section-subtitle-open">
          DeployGuard tests repository contents against high-confidence regular expressions designed to avoid false positives.
        </p>

        <div className="rules-table-wrapper glass-panel">
          <table className="rules-table">
            <thead>
              <tr>
                <th>Signature Name</th>
                <th>Regex Heuristic</th>
                <th>Severity</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {secretRules.map((rule, idx) => (
                <tr key={idx}>
                  <td><strong>{rule.name}</strong></td>
                  <td><code className="regex-snippet">{rule.pattern}</code></td>
                  <td>
                    <span className={`severity-pill ${rule.severity}`}>
                      {rule.severity}
                    </span>
                  </td>
                  <td>{rule.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. Technology Stack */}
      <section id="stack" className="deployguard-section animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h2 className="section-title-open">
          <Server size={24} color="#3b82f6" />
          <span>Technology Stack</span>
        </h2>
        <p className="section-subtitle-open">
          DeployGuard is crafted with cutting-edge .NET 10 primitives and modern web design standards.
        </p>

        <div className="rules-table-wrapper glass-panel">
          <table className="tech-stack-table">
            <thead>
              <tr>
                <th>Layer</th>
                <th>Technology</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {techStack.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ color: 'var(--text-muted)' }}>{item.layer}</td>
                  <td><span className="tech-badge">{item.tech}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 9. Database Schema */}
      <section id="schema" className="deployguard-section animate-fade-in" style={{ animationDelay: '0.32s' }}>
        <h2 className="section-title-open">
          <Database size={24} color="#3b82f6" />
          <span>Database Schema & Entities</span>
        </h2>
        <p className="section-subtitle-open">
          Entity Framework Core 10 models that back DeployGuard's security audit persistence.
        </p>

        <div className="rules-table-wrapper glass-panel">
          <table className="tech-stack-table">
            <thead>
              <tr>
                <th>Entity Model</th>
                <th>Purpose & Responsibilities</th>
              </tr>
            </thead>
            <tbody>
              {dbEntities.map((ent, idx) => (
                <tr key={idx}>
                  <td><code>{ent.entity}</code></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{ent.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Closing Star Banner */}
      <div className="star-banner glass-panel animate-fade-in" style={{ marginTop: '4rem', animationDelay: '0.4s' }}>
        <h3>⭐ Support DeployGuard</h3>
        <p>If you find DeployGuard useful, consider giving the repository a star on GitHub!</p>
        <a href="https://github.com/jay240322/Deploy-Guard" target="_blank" rel="noopener noreferrer" className="btn-star-repo">
          <ExternalLink size={16} />
          <span>Star jay240322/Deploy-Guard</span>
        </a>
      </div>

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
                <Link to="/" className="footer-link">Home</Link>
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

export default Deployguard;
