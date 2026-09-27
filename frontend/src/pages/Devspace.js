import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Download, Cpu, ShieldCheck, Box, Layers, ExternalLink } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import './Devspace.css';

const overviewLinks = [
  { id: 'offers', label: 'Overview' },
  { id: 'install', label: 'Installation' },
  { id: 'guide', label: 'Quick Guide' },
  { id: 'structure', label: 'Structure' },
  { id: 'develop', label: 'Development' },
  { id: 'build', label: 'Docker Build' },
  { id: 'deploy', label: 'K8s Deploy' }
];

const Devspace = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [devspaceExists, setDevspaceExists] = useState(false);
  const [activeSection, setActiveSection] = useState('offers');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkDevspaceStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/devspace/status`);
        if (res.ok) {
          const data = await res.json();
          setDevspaceExists(data.exists);
        }
      } catch (err) {
        console.warn('Failed to fetch devspace status:', err);
      }
    };
    checkDevspaceStatus();
  }, [API_URL]);

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

  const downloadUrl = devspaceExists
    ? `${API_URL}/api/devspace/download`
    : 'https://github.com/jay240322/Devspace/releases/latest';

  const steps = [
    {
      title: "1. Initialize Devspace",
      description: "Initialize your new workspace environment by running the creation command. This sets up the directory layout and templates, validating your configuration file.",
      output: [
        { type: "prompt", text: "$ .\\devspace.exe create" },
        { type: "info", text: "Initializing Devspace workspace..." },
        { type: "error", text: "Error: GITHUB_TOKEN environment variable is not set." },
        { type: "error", text: "GitHub authentication is required to download templates." },
        { type: "info", text: "Please set GITHUB_TOKEN and try again." }
      ]
    },
    {
      title: "2. GitHub Authentication",
      description: "Ensure the tool can fetch scaffolding boilerplates by authenticating with GitHub. Set your Personal Access Token (PAT) environment variable and execute the command again.",
      output: [
        { type: "prompt", text: "$ set GITHUB_TOKEN=ghp_k97SjG84H2la0Kx9..." },
        { type: "prompt", text: "$ .\\devspace.exe create" },
        { type: "success", text: "GITHUB_TOKEN detected successfully." },
        { type: "info", text: "Connecting to GitHub API..." },
        { type: "success", text: "Authenticated successfully as user: jay240322" },
        { type: "info", text: "Loading interactive configuration wizard..." }
      ]
    },
    {
      title: "3. Configure Your Project",
      description: "Configure your service parameters through the interactive CLI configuration wizard. Specify directory path, frameworks, resources, replicas, and service type.",
      output: [
        { type: "prompt", text: "$ .\\devspace.exe create" },
        { type: "info", text: "Starting project configuration wizard:" },
        { type: "yellow", text: "? Project Directory: C:\\Users\\YourName\\Desktop" },
        { type: "yellow", text: "? Microservice Name: my-service" },
        { type: "yellow", text: "? Backend Framework: Go (Golang)" },
        { type: "yellow", text: "? Frontend Framework: React (Vite)" },
        { type: "yellow", text: "? Kubernetes Replicas: 3" },
        { type: "yellow", text: "? CPU Resource Profile: 250m (Medium)" },
        { type: "yellow", text: "? Memory Resource Profile: 512Mi" },
        { type: "yellow", text: "? Kubernetes Service Type: LoadBalancer" },
        { type: "info", text: "Configuration saved to devspace.yaml!" }
      ]
    }
  ];

  return (
    <div className="devspace-container">
      {/* Custom Navbar (Breadcrumbs only: home > devspace) */}
      <nav className={`devspace-navbar ${isScrolled ? 'scrolled' : ''} animate-fade-in`}>
        <div className="devspace-nav-container">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">home</Link>
            <ChevronRight size={14} className="breadcrumb-icon" />
            <span className="breadcrumb-current">devspace</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Floating Left Page Overview Navigation Panel */}
      <aside className="devspace-sidebar-nav desktop-only">
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
      <header className="devspace-header animate-fade-in">
        <h1 className="devspace-title">
          Dev<span className="gradient-text">space</span>
        </h1>
        <p className="devspace-subtitle">
          Interactive Go CLI tool that spins up complete microservice configurations, framework boilerplates, multi-stage Dockerfiles, and K8s manifests.
        </p>
      </header>

      {/* 1. What Devspace Offers & Why Choose Devspace */}
      <section id="offers" className="devspace-section offers-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h2 className="section-title-open">What Devspace Offers</h2>
        <p className="section-lead-text">
          Devspace is an interactive scaffolding engine built in Go. It speeds up full-stack development by automatically containerizing services, generating secure Docker environments, and configuring production Kubernetes manifests.
        </p>

        <div className="why-choose-wrapper glass-panel">
          <div className="why-choose-grid">
            <div className="why-item">
              <div className="why-icon-box">
                <Cpu size={24} />
              </div>
              <h3>Instant Boilerplates</h3>
              <p>Generate container-ready setups for Go, Node.js, Python, or Rust microservices with intuitive framework configuration wizard.</p>
            </div>
            <div className="why-item">
              <div className="why-icon-box">
                <Box size={24} />
              </div>
              <h3>Automated Containers</h3>
              <p>No manual Dockerfiles needed. Generates production-ready, multi-stage Docker builds automatically optimized for resource profiles.</p>
            </div>
            <div className="why-item">
              <div className="why-icon-box">
                <Layers size={24} />
              </div>
              <h3>Kubernetes Manifests</h3>
              <p>Automatically configures Deployment specifications, resource limits, and service settings (ClusterIP/NodePort/LoadBalancer) out of the box.</p>
            </div>
            <div className="why-item">
              <div className="why-icon-box">
                <ShieldCheck size={24} />
              </div>
              <h3>Rootless & Minimal</h3>
              <p>Applies strict security profiles by deploying microservices inside rootless containers and using minimal scratch base images.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Fast Installation */}
      <section id="install" className="devspace-section installation-section animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <h2 className="section-title-open">📦 Fast Installation</h2>
        <p className="install-desc-open">
          Instead of cloning the source code and compiling dependencies manually, you can download the standalone precompiled executable immediately:
        </p>

        <div className="download-cta-open">
          <div className="download-cta-left">
            <h3>Devspace Standalone Binary</h3>
            <p className="platform-tag">Windows x64 Executable</p>
          </div>
          <a
            href={downloadUrl}
            className="btn-download-open"
            target="_blank"
            rel="noopener noreferrer"
            download="devspace.exe"
          >
            <Download size={20} />
            <span>Download devspace.exe</span>
          </a>
        </div>

        <div className="install-steps-list-open">
          <div className="install-step-item">
            <div className="step-badge">1</div>
            <p>Download the precompiled standalone <code>devspace.exe</code> binary using the button above.</p>
          </div>
          <div className="install-step-item">
            <div className="step-badge">2</div>
            <p>Drop the executable file directly into your target workspace directory.</p>
          </div>
          <div className="install-step-item">
            <div className="step-badge">3</div>
            <p>Open your command prompt or terminal in the workspace directory and execute <code>.\devspace.exe create</code> to begin.</p>
          </div>
        </div>

        <p className="releases-link-muted">
          Looking for Linux or macOS builds? Visit the <a href="https://github.com/jay240322/Devspace/releases/latest" target="_blank" rel="noopener noreferrer">GitHub Releases Page <ExternalLink size={12} /></a>.
        </p>
      </section>

      {/* 3. Sequential Walkthrough timeline */}
      <section id="guide" className="devspace-section timeline-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h2 className="section-title-open">Step-by-Step Guide: Creating Your First Service</h2>
        <p className="section-subtitle-open">
          Follow this walkthrough to initialize your workspace, configure your app parameters, and launch your microservice stack.
        </p>

        <div className="timeline-steps">
          {steps.map((step, idx) => (
            <div key={idx} className="timeline-step-block">
              <div className="step-meta-col">
                <div className="timeline-badge">
                  <span>{idx + 1}</span>
                </div>
                {idx < steps.length - 1 && <div className="timeline-line"></div>}
              </div>
              <div className="step-content-col">
                <div className="step-header-info">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>

                {/* Configuration Options Grid mixed inside Step 3 */}
                {idx === 2 && (
                  <div className="step-config-options">
                    <div className="step-config-item">
                      <strong>Project Directory</strong>
                      <p>Specify where the project should be generated.</p>
                      <pre><code>C:\Users\YourName\Desktop</code></pre>
                    </div>
                    <div className="step-config-item">
                      <strong>Microservice Name</strong>
                      <p>Provide a name for your service.</p>
                      <pre><code>my-service</code></pre>
                    </div>
                    <div className="step-config-item">
                      <strong>Backend Framework</strong>
                      <p>Choose one of the available backend frameworks.</p>
                      <pre><code>Go (Golang)
                        Python (Django)
                        Node.js (Express)
                        Rust (Actix-web)</code></pre>
                    </div>
                    <div className="step-config-item">
                      <strong>Frontend Framework</strong>
                      <p>Choose your preferred frontend framework.</p>
                      <pre><code>React (Vite)
                        Next.js
                        Vue.js
                        Svelte
                        None (Backend API Only)</code></pre>
                    </div>
                    <div className="step-config-item">
                      <strong>Kubernetes Replicas</strong>
                      <p>Enter the number of replicas to deploy.</p>
                      <pre><code>3</code></pre>
                    </div>
                    <div className="step-config-item">
                      <strong>CPU Resource Profile</strong>
                      <p>Select the CPU request profile.</p>
                      <pre><code>100m  (Lightweight)
                        250m  (Medium)
                        500m  (High Performance)</code></pre>
                    </div>
                    <div className="step-config-item">
                      <strong>Memory Resource Profile</strong>
                      <p>Select the memory request profile.</p>
                      <pre><code>128Mi
                        256Mi
                        512Mi
                        1024Mi (1Gi)</code></pre>
                    </div>
                    <div className="step-config-item">
                      <strong>Kubernetes Service Type</strong>
                      <p>Choose how your application will be exposed.</p>
                      <pre><code>ClusterIP
                        NodePort
                        LoadBalancer</code></pre>
                    </div>
                  </div>
                )}

                <div className="step-terminal-box">
                  <div className="terminal-view mini-terminal">
                    <div className="terminal-bar">
                      <div className="term-dots">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                      </div>
                      <span className="term-title">devspace cli - step {idx + 1}</span>
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

      {/* 5. Generated Project Structure Section */}
      <section id="structure" className="devspace-section structure-section animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h2 className="section-title-open">📂 Generated Project Structure</h2>
        <p className="section-subtitle-open">
          Your workspace will contain a production-ready project similar to the following layout:
        </p>

        <div className="structure-box glass-panel font-mono">
          <pre><code>{`my-service/
├── backend/
├── frontend/
├── k8s/
│   ├── myservice-backend-deployment.yaml
│   ├── myservice-backend-service.yaml
│   ├── myservice-frontend-deployment.yaml
│   └── myservice-frontend-service.yaml
├── Dockerfile
└── .dockerignore`}</code></pre>
        </div>

        <div className="note-box font-sans">
          <p><strong>Note:</strong> The generated files may vary depending on the frameworks you selected.</p>
        </div>
      </section>

      {/* 6. Develop Your Application Section */}
      <section id="develop" className="devspace-section develop-section animate-fade-in" style={{ animationDelay: '0.35s' }}>
        <h2 className="section-title-open">Develop Your Application</h2>
        <p className="section-subtitle-open">
          After project generation, implement your business logic by modifying the generated files.
        </p>

        <p className="develop-desc">
          Typical files you'll edit include:
        </p>

        <div className="develop-checklist-grid">
          <div className="checklist-item"><div className="bullet-dot"></div><span>Backend source code & endpoints</span></div>
          <div className="checklist-item"><div className="bullet-dot"></div><span>Frontend application layers</span></div>
          <div className="checklist-item"><div className="bullet-dot"></div><span>Dockerfile compilation stages</span></div>
          <div className="checklist-item"><div className="bullet-dot"></div><span>Kubernetes deployment manifest files</span></div>
          <div className="checklist-item"><div className="bullet-dot"></div><span>Environment configuration variables</span></div>
        </div>
      </section>

      {/* 7. Build Docker Images Section */}
      <section id="build" className="devspace-section docker-section animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <h2 className="section-title-open">🐳 Build Docker Images</h2>
        <p className="section-subtitle-open">
          Devspace uses a multi-stage Dockerfile, allowing frontend and backend images to be built independently.
        </p>

        <div className="docker-commands-box">
          <div className="cmd-group">
            <span className="cmd-label">Build the frontend image:</span>
            <pre className="font-mono"><code>docker build --target frontend -t my-frontend .</code></pre>
          </div>
          <div className="cmd-group">
            <span className="cmd-label">Build the backend image:</span>
            <pre className="font-mono"><code>docker build --target backend -t my-backend .</code></pre>
          </div>
        </div>
      </section>

      {/* 8. Deploy to Kubernetes Section */}
      <section id="deploy" className="devspace-section deploy-section animate-fade-in" style={{ animationDelay: '0.45s' }}>
        <h2 className="section-title-open">☸ Deploy to Kubernetes</h2>
        <p className="section-subtitle-open">
          Deploy the generated Kubernetes manifests and inspect execution states.
        </p>

        <div className="deploy-commands-box">
          <div className="cmd-group">
            <span className="cmd-label">Deploy the generated Kubernetes manifests:</span>
            <pre className="font-mono"><code>kubectl apply -f kubernetes/</code></pre>
          </div>

          <div className="cmd-group">
            <span className="cmd-label">Verify that the deployment was successful:</span>
            <div className="kubectl-grid">
              <div className="kubectl-col">
                <span>Check Pods:</span>
                <pre className="font-mono"><code>kubectl get pods</code></pre>
              </div>
              <div className="kubectl-col">
                <span>Check Services:</span>
                <pre className="font-mono"><code>kubectl get svc</code></pre>
              </div>
              <div className="kubectl-col">
                <span>Check Deployments:</span>
                <pre className="font-mono"><code>kubectl get deployments</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="note-box success-note font-sans">
          <p>If all resources are running successfully, your application is now deployed on Kubernetes.</p>
        </div>
      </section>


    </div>
  );
};

export default Devspace;
