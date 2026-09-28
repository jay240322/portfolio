import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Cpu,
  Layers,
  ExternalLink,
  Terminal,
  Activity,
  Sparkles,
  Lock,
  Database,
  Server,
  Key
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import './Kubesense.css';

const overviewLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'screenshots', label: 'Dashboard UI' },
  { id: 'install', label: 'Installation' },
  { id: 'access', label: 'Access & Auth' },
  { id: 'api', label: 'API Endpoints' }
];

const Kubesense = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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

  const installationSteps = [
    {
      title: "1. Create Namespace",
      description: "Initialize an isolated workspace environment namespace inside your Kubernetes cluster to run KubeSense components.",
      output: [
        { type: "prompt", text: "$ kubectl create namespace kubesense" },
        { type: "success", text: "namespace/kubesense created" }
      ]
    },
    {
      title: "2. Deploy KubeSense Manifest",
      description: "Apply the official preconfigured base manifest. This downloads the images, spins up database state, configures backend APIs, and maps frontend services.",
      output: [
        { type: "prompt", text: "$ kubectl apply -f https://raw.githubusercontent.com/jay240322/KubeSense/main/k8s/base/install.yaml" },
        { type: "info", text: "namespace/kubesense unchanged" },
        { type: "success", text: "deployment.apps/kubesense-postgres created" },
        { type: "success", text: "service/kubesense-postgres-service created" },
        { type: "success", text: "deployment.apps/kubesense-backend created" },
        { type: "success", text: "service/kubesense-backend-service created" },
        { type: "success", text: "deployment.apps/kubesense-frontend created" },
        { type: "success", text: "service/kubesense-frontend-service created" }
      ]
    },
    {
      title: "3. Verify Resources Status",
      description: "Verify that backend, frontend, and database services are configured properly and running.",
      output: [
        { type: "prompt", text: "$ kubectl get pods -n kubesense" },
        { type: "info", text: "NAME                                  READY   STATUS    RESTARTS   AGE" },
        { type: "success", text: "kubesense-postgres-89abc123-def45    1/1     Running   0          30s" },
        { type: "success", text: "kubesense-backend-7c89f456-ghij7     1/1     Running   0          25s" },
        { type: "success", text: "kubesense-frontend-6b78d910-klmn1    1/1     Running   0          20s" },
        { type: "prompt", text: "$ kubectl get svc -n kubesense" },
        { type: "info", text: "NAME                         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE" },
        { type: "success", text: "kubesense-postgres-service   ClusterIP   10.96.24.180    <none>        5432/TCP   32s" },
        { type: "success", text: "kubesense-backend-service    ClusterIP   10.96.115.12    <none>        8000/TCP   27s" },
        { type: "success", text: "kubesense-frontend-service   ClusterIP   10.96.220.45    <none>        3000/TCP   22s" }
      ]
    }
  ];

  const apiEndpoints = [
    { method: "POST", path: "/api/v1/auth/login", desc: "User Authentication & JWT Issuance" },
    { method: "GET", path: "/api/v1/pods", desc: "Retrieve active Kubernetes Pods" },
    { method: "GET", path: "/api/v1/pods/{namespace}/{pod}", desc: "Fetch specific Pod specifications & state details" },
    { method: "GET", path: "/api/v1/pods/{namespace}/{pod}/logs", desc: "Stream or retrieve Pod standard logs" },
    { method: "GET", path: "/api/v1/pods/{namespace}/{pod}/events", desc: "Fetch diagnostic events tied to a Pod" },
    { method: "POST", path: "/api/v1/analyze", desc: "Run Gemini AI analysis on a single target Pod" },
    { method: "POST", path: "/api/v1/analyze-cluster", desc: "Trigger cluster-wide diagnostic scan and issue analysis" },
    { method: "GET", path: "/api/v1/settings", desc: "Get active Gemini LLM dashboard settings" },
    { method: "POST", path: "/api/v1/settings/gemini", desc: "Persist encrypted Google Gemini API credentials" }
  ];

  return (
    <div className="kubesense-container">
      {/* Custom Navbar (Breadcrumbs only: home > kubesense) */}
      <nav className={`kubesense-navbar ${isScrolled ? 'scrolled' : ''} animate-fade-in`}>
        <div className="kubesense-nav-container">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">home</Link>
            <ChevronRight size={14} className="breadcrumb-icon" />
            <span className="breadcrumb-current">kubesense</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Floating Left Page Overview Navigation Panel */}
      <aside className="kubesense-sidebar-nav desktop-only">
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

      {/* Header */}
      <header className="kubesense-header animate-fade-in">
        <h1 className="kubesense-title">
          Kube<span className="gradient-text">Sense</span>
        </h1>
        <p className="kubesense-subtitle">
          AI-Powered Kubernetes Troubleshooting Assistant — Diagnose, analyze, and resolve Kubernetes issues in seconds using Google Gemini LLM.
        </p>

      </header>

      {/* 1. Overview Section */}
      <section id="overview" className="kubesense-section overview-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h2 className="section-title-open">Overview</h2>
        <p className="section-lead-text">
          KubeSense is an AI-powered Kubernetes troubleshooting platform that helps developers and DevOps engineers quickly identify and resolve cluster issues. It collects Kubernetes diagnostics, analyzes them using <strong>Google Gemini LLM</strong>, and provides intelligent root cause analysis with actionable recommendations through a modern web dashboard.
        </p>

        <div className="why-choose-wrapper glass-panel">
          <h3 className="sub-section-title">Why KubeSense?</h3>
          <div className="why-choose-grid">
            <div className="why-item">
              <div className="why-icon-box">
                <Activity size={24} />
              </div>
              <h3>Reduce Troubleshooting Time</h3>
              <p>Quickly pinpoint the direct source of cluster anomalies, failing pods, crashing applications, or bad deployment configurations.</p>
            </div>
            <div className="why-item">
              <div className="why-icon-box">
                <Sparkles size={24} />
              </div>
              <h3>AI-Assisted Root Cause Analysis</h3>
              <p>Gemini LLM model integrates directly to scan cluster logs, crash dumps, and live events to produce developer-focused remediation recommendations.</p>
            </div>
            <div className="why-item">
              <div className="why-icon-box">
                <Layers size={24} />
              </div>
              <h3>Modern Dashboard</h3>
              <p>Observe node and pod status, investigate event timelines, check container outputs, and call diagnostics through a sleek frontend console.</p>
            </div>
            <div className="why-item">
              <div className="why-icon-box">
                <Server size={24} />
              </div>
              <h3>Cloud-Native Architecture</h3>
              <p>Built with production-ready patterns, featuring a FastAPI backend, Next.js frontend, PostgreSQL storage, containerized setup, and GitOps delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section id="features" className="kubesense-section features-section animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <h2 className="section-title-open">Features</h2>
        <div className="features-list-grid">
          <div className="feature-card glass-panel">
            <div className="feature-header">
              <Sparkles size={20} className="feature-icon" />
              <h4>AI-Powered Troubleshooting</h4>
            </div>
            <p>Runs Gemini LLM diagnostic checks on Pod failures, CrashLoopBackOff states, and service routing errors.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-header">
              <Terminal size={20} className="feature-icon" />
              <h4>Explorer Module</h4>
            </div>
            <p>Integrated Explorer for inspecting Pods, streaming logs, and reviewing live cluster-wide Events.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-header">
              <Cpu size={20} className="feature-icon" />
              <h4>Google Gemini Integration</h4>
            </div>
            <p>Native API connector hooks directly to Gemini Models, sending exact log slices and JSON specs securely.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-header">
              <Layers size={20} className="feature-icon" />
              <h4>Cluster-Wide Analysis</h4>
            </div>
            <p>Scan cluster resources as a unified canvas to analyze configuration mismatches, ingress issues, and limits.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-header">
              <Lock size={20} className="feature-icon" />
              <h4>Secure Authentication</h4>
            </div>
            <p>Equipped with JSON Web Token (JWT) authorization controls protecting administration views and API access.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-header">
              <Database size={20} className="feature-icon" />
              <h4>PostgreSQL Database</h4>
            </div>
            <p>Robust database storage layers holding user records, workspace configuration metadata, and historical analysis reports.</p>
          </div>
        </div>
      </section>

      {/* 3. Architecture Section */}
      <section id="architecture" className="kubesense-section architecture-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h2 className="section-title-open">🏗️ Architecture</h2>
        <p className="section-subtitle-open">
          KubeSense follows a modern, cloud-native microservices architecture designed to collect, process, and analyze cluster issues efficiently.
        </p>

        <div className="architecture-diagram-wrapper glass-panel">
          <div className="diagram-frame">
            <img
              src="https://github.com/user-attachments/assets/3b3e8367-b4e2-4169-884a-f8b11c8ea0bc"
              alt="KubeSense System Diagram"
              className="architecture-image"
            />
          </div>
          <div className="diagram-caption">
            <span>Figure 1: KubeSense Microservices and AI Diagnosis Pipeline Flow</span>
          </div>
        </div>
      </section>

      {/* Dashboard UI Screenshots Section */}
      <section id="screenshots" className="kubesense-section screenshots-section animate-fade-in" style={{ animationDelay: '0.22s' }}>
        <h2 className="section-title-open">Dashboard UI</h2>
        <p className="section-subtitle-open">
          Explore the visual interface of KubeSense, featuring interactive troubleshooting explorers and Gemini AI workflows.
        </p>

        <div className="screenshots-grid">
          <div className="screenshot-card glass-panel">
            <div className="screenshot-frame">
              <img
                src="/images/kubesense/login.png"
                alt="KubeSense Login Portal"
                className="screenshot-img"
              />
            </div>
            <div className="screenshot-info">
              <h4>Login Portal</h4>
              <p>Secure JWT-based user authentication entry gate to access the KubeSense cluster operations dashboard.</p>
            </div>
          </div>

          <div className="screenshot-card glass-panel">
            <div className="screenshot-frame">
              <img
                src="/images/kubesense/gemini_setup.png"
                alt="Google Gemini API Connection Setup"
                className="screenshot-img"
              />
            </div>
            <div className="screenshot-info">
              <h4>Gemini API Key Configuration</h4>
              <p>Setup panel allowing admins to securely submit Google Gemini LLM API keys for cluster analysis.</p>
            </div>
          </div>

          <div className="screenshot-card glass-panel">
            <div className="screenshot-frame">
              <img
                src="/images/kubesense/pod_list.png"
                alt="Interactive Kubernetes Pod Explorer"
                className="screenshot-img"
              />
            </div>
            <div className="screenshot-info">
              <h4>Pod List Explorer</h4>
              <p>Sleek tabular list tracking names, namespaces, nodes, statuses, and restart counts of active pods.</p>
            </div>
          </div>

          <div className="screenshot-card glass-panel">
            <div className="screenshot-frame">
              <img
                src="/images/kubesense/pod_details.png"
                alt="Pod Metadata and Specifications Panel"
                className="screenshot-img"
              />
            </div>
            <div className="screenshot-info">
              <h4>Pod Details Panel</h4>
              <p>Deep-dive inspector displaying pod metadata, age, node profiles, and matching container image details.</p>
            </div>
          </div>

          <div className="screenshot-card glass-panel">
            <div className="screenshot-frame">
              <img
                src="/images/kubesense/pod_events.png"
                alt="Pod Events Timeline & Diagnostic Warnings"
                className="screenshot-img"
              />
            </div>
            <div className="screenshot-info">
              <h4>Pod Events & AI Diagnosis</h4>
              <p>Timeline monitor compiling pod events, unhealthy probe logs, and triggering Gemini AI diagnostics recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Installation & Prerequisites Section */}
      <section id="install" className="kubesense-section installation-section animate-fade-in" style={{ animationDelay: '0.25s' }}>
        <h2 className="section-title-open">⚙ Prerequisites & Installation</h2>
        <p className="install-desc-open">
          Before setting up, ensure your workspace meets the following environment prerequisites:
        </p>

        <div className="prereq-grid">
          <div className="prereq-item glass-panel">
            <strong>Kubernetes Cluster</strong>
            <p>v1.20+ cluster configured (Minikube, EKS, GKE, or Kind)</p>
          </div>
          <div className="prereq-item glass-panel">
            <strong>kubectl CLI</strong>
            <p>Command line interface configured to access your cluster</p>
          </div>
          <div className="prereq-item glass-panel">
            <strong>Docker Container Engine</strong>
            <p>Engine to verify, build, or deploy local helper containers</p>
          </div>
          <div className="prereq-item glass-panel">
            <strong>Internet Connection</strong>
            <p>Access required to pull manifest files and call Gemini APIs</p>
          </div>
        </div>

        <div className="kubectl-verify glass-panel font-mono">
          <span className="cmd-label">Verify your cluster connection:</span>
          <pre><code>{`$ kubectl cluster-info
$ kubectl get nodes`}</code></pre>
        </div>

        <h3 className="step-guide-title">Deploy KubeSense Stack</h3>
        <p className="install-desc-open">
          Follow the sequential guide below to configure the namespace, deploy dependencies, and verify execution states.
        </p>

        <div className="timeline-steps">
          {installationSteps.map((step, idx) => (
            <div key={idx} className="timeline-step-block">
              <div className="step-meta-col">
                <div className="timeline-badge">
                  <span>{idx + 1}</span>
                </div>
                {idx < installationSteps.length - 1 && <div className="timeline-line"></div>}
              </div>
              <div className="step-content-col">
                <div className="step-header-info">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>

                <div className="step-terminal-box">
                  <div className="terminal-view mini-terminal">
                    <div className="terminal-bar">
                      <div className="term-dots">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                      </div>
                      <span className="term-title">kubectl terminal - step {idx + 1}</span>
                    </div>
                    <div className="terminal-body font-mono">
                      {step.output.map((line, lIdx) => (
                        <p key={lIdx} className={`term-line ${line.type}`}>
                          {line.text}
                        </p>
                      ))}
                      <p className="term-line prompt">
                        $ <span className="term-cursor">|</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Access & Auth Section */}
      <section id="access" className="kubesense-section access-section animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h2 className="section-title-open">🌐 Access the Application</h2>
        <p className="section-subtitle-open">
          Once deployed, expose the frontend UI locally and authenticate with default security credentials.
        </p>

        <div className="access-grid">
          <div className="access-card glass-panel">
            <h3>Expose Frontend Service</h3>
            <p>Forward port 3000 from the cluster service resource mapping directly to your localhost environment:</p>
            <pre className="font-mono"><code>{`$ kubectl port-forward -n kubesense svc/kubesense-frontend-service 3000:3000`}</code></pre>
            <p className="access-info-note">
              Open your browser and navigate to: <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">http://localhost:3000</a>
            </p>
          </div>

          <div className="access-card glass-panel">
            <h3>Default System Credentials</h3>
            <p>Access the dashboard administrative view using these credentials:</p>

            <div className="credentials-table-wrapper">
              <table className="credentials-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Password</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>admin</code></td>
                    <td><code>KubeSense@123</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="gemini-setup-box glass-panel">
          <div className="setup-header">
            <Key size={20} className="setup-icon" />
            <h3>Configure Gemini API Connection</h3>
          </div>
          <div className="setup-steps">
            <div className="setup-step">
              <div className="setup-badge">1</div>
              <p>Log in with the default credentials above.</p>
            </div>
            <div className="setup-step">
              <div className="setup-badge">2</div>
              <p>Go to your Profile/Settings page and enter your <strong>Google Gemini API Key</strong>.</p>
            </div>
            <div className="setup-step">
              <div className="setup-badge">3</div>
              <p>Click <strong>Save & Continue</strong>. KubeSense is now armed to perform AI cluster analysis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. API Endpoints Section */}
      <section id="api" className="kubesense-section api-section animate-fade-in" style={{ animationDelay: '0.35s' }}>
        <h2 className="section-title-open">🔌 API Endpoints Reference</h2>
        <p className="section-subtitle-open">
          Integrate, trigger, or programmatically query the backend diagnostics service using these routes:
        </p>

        <div className="api-table-wrapper glass-panel">
          <table className="api-endpoints-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {apiEndpoints.map((endpoint, index) => (
                <tr key={index}>
                  <td>
                    <span className={`method-badge ${endpoint.method.toLowerCase()}`}>
                      {endpoint.method}
                    </span>
                  </td>
                  <td><code className="endpoint-code">{endpoint.path}</code></td>
                  <td className="endpoint-desc">{endpoint.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Closing Star Banner */}
      <div className="star-banner glass-panel animate-fade-in" style={{ marginTop: '4rem', animationDelay: '0.4s' }}>
        <h3>⭐ Support KubeSense</h3>
        <p>If you find KubeSense useful, consider giving the repository a star on GitHub!</p>
        <a href="https://github.com/jay240322/KubeSense" target="_blank" rel="noopener noreferrer" className="btn-star-repo">
          <ExternalLink size={16} />
          <span>Star jay240322/KubeSense</span>
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

export default Kubesense;
