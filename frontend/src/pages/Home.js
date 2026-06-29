import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight, Mail, Code as GithubIcon, Briefcase as LinkedinIcon, ExternalLink, Camera as Instagram, MessageCircle as Twitter, Globe, Link as LinkIcon, ChevronDown, Download } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AOS from 'aos';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const container = useRef();

  const [techStack, setTechStack] = useState([]);
  const [works, setWorks] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [stories, setStories] = useState([]);
  const [connect, setConnect] = useState([]);
  const [resumeUrl, setResumeUrl] = useState('/resume.pdf');
  const [activeTechIndex, setActiveTechIndex] = useState(null);

  useEffect(() => {
    const handleDocumentClick = () => {
      setActiveTechIndex(null);
    };
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Desktop/Tablet animations
    mm.add("(min-width: 769px)", () => {
      // Hero section page load entry animations (centered)
      gsap.fromTo('.hero-content-centered',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }
      );

      // Scroll-triggered slide animations for name and subtitle
      gsap.to('.hero-title-centered', {
        xPercent: -50,
        opacity: 0,
        scrollTrigger: {
          trigger: '.hero-section-centered',
          start: 'top top',
          end: 'bottom 20%',
          scrub: true,
        }
      });

      gsap.to('.hero-subtitle-centered', {
        xPercent: 50,
        opacity: 0,
        scrollTrigger: {
          trigger: '.hero-section-centered',
          start: 'top top',
          end: 'bottom 20%',
          scrub: true,
        }
      });

      // Fade out the download button and scroll indicator as we scroll down
      gsap.to('.button', {
        opacity: 0,
        y: 30,
        scrollTrigger: {
          trigger: '.hero-section-centered',
          start: 'top top',
          end: '40% top',
          scrub: true,
        }
      });

      gsap.to('.scroll-indicator', {
        opacity: 0,
        scrollTrigger: {
          trigger: '.hero-section-centered',
          start: 'top top',
          end: '20% top',
          scrub: true,
        }
      });

      // Scroll-triggered animations for all sections
      const sections = ['#stack', '#works', '#notes', '#stories', '#social'];
      sections.forEach((id) => {
        const isSocial = id === '#social';

        // Title and subtitle slide/fade-in
        gsap.fromTo(`${id} .section-title, ${id} .section-subtitle`,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: id,
              start: isSocial ? 'top 98%' : 'top 95%',
              end: isSocial ? 'top 92%' : 'top 75%',
              scrub: true,
            }
          }
        );

        // Grid items slide/fade-in (excluding stack items)
        if (id !== '#stack') {
          const itemsClass = id === '#social' ? '.social-item-static' :
            '.work-grid-item';

          if (document.querySelectorAll(`${id} ${itemsClass}`).length > 0) {
            gsap.fromTo(`${id} ${itemsClass}`,
              { opacity: 0, y: 50 },
              {
                opacity: 1,
                y: 0,
                scrollTrigger: {
                  trigger: id,
                  start: isSocial ? 'top 95%' : 'top 90%',
                  end: isSocial ? 'top 85%' : 'top 70%',
                  scrub: true,
                }
              }
            );
          }
        }
      });

      // Custom animation for Tech Stack (#stack) items:
      // Arrive from right to left when scrolling down, and go from left to right when scrolling up
      if (document.querySelectorAll('#stack .tech-item-static').length > 0) {
        gsap.fromTo('#stack .tech-item-static',
          {
            opacity: 0,
            x: 180,
            scale: 0.8,
            rotation: 8,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            rotation: 0,
            stagger: 0.06,
            scrollTrigger: {
              trigger: '#stack',
              start: 'top 90%',
              end: 'top 50%',
              scrub: 1.2, // Smooth scrubbing effect
            }
          }
        );
      }
    });

    // Mobile specific animations (avoiding horizontal transformations to prevent overflow)
    mm.add("(max-width: 768px)", () => {
      // Hero section page load entry animations (gentler fade on mobile)
      gsap.fromTo('.hero-content-centered',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }
      );

      // Scroll-triggered simple fade animations (no layout-breaking horizontal movements)
      gsap.to('.hero-title-centered, .hero-subtitle-centered', {
        opacity: 0,
        scrollTrigger: {
          trigger: '.hero-section-centered',
          start: 'top top',
          end: 'bottom 40%',
          scrub: true,
        }
      });

      // Fade out the download button and scroll indicator as we scroll down
      gsap.to('.button, .scroll-indicator', {
        opacity: 0,
        scrollTrigger: {
          trigger: '.hero-section-centered',
          start: 'top top',
          end: '30% top',
          scrub: true,
        }
      });

      // Scroll-triggered fade-in animations for all sections
      const sections = ['#stack', '#works', '#notes', '#stories', '#social'];
      sections.forEach((id) => {
        // Gentle vertical fade-in on mobile
        gsap.fromTo(`${id} .section-title, ${id} .section-subtitle`,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: id,
              start: 'top 95%',
              end: 'top 80%',
              scrub: true,
            }
          }
        );

        if (id !== '#stack') {
          const itemsClass = id === '#social' ? '.social-item-static' : '.work-grid-item';

          if (document.querySelectorAll(`${id} ${itemsClass}`).length > 0) {
            gsap.fromTo(`${id} ${itemsClass}`,
              { opacity: 0, y: 35 },
              {
                opacity: 1,
                y: 0,
                scrollTrigger: {
                  trigger: id,
                  start: 'top 95%',
                  end: 'top 75%',
                  scrub: true,
                }
              }
            );
          }
        }
      });

      // Custom animation for Tech Stack (#stack) items (vertical fade-in only)
      if (document.querySelectorAll('#stack .tech-item-static').length > 0) {
        gsap.fromTo('#stack .tech-item-static',
          {
            opacity: 0,
            y: 20,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.04,
            scrollTrigger: {
              trigger: '#stack',
              start: 'top 95%',
              end: 'top 65%',
              scrub: true,
            }
          }
        );
      }
    });

    return () => mm.revert();
  }, { dependencies: [techStack, works, blogs, stories, connect], scope: container });

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const loadFromLocalStorage = () => {
      const storedTech = JSON.parse(localStorage.getItem('portfolio_techStack'));
      const storedWorks = JSON.parse(localStorage.getItem('portfolio_works'));
      const storedNotes = JSON.parse(localStorage.getItem('portfolio_notes'));
      const storedStories = JSON.parse(localStorage.getItem('portfolio_stories'));
      const storedConnect = JSON.parse(localStorage.getItem('portfolio_connect'));
      const storedResume = localStorage.getItem('portfolio_resume');

      if (storedTech) setTechStack(storedTech);
      if (storedWorks) setWorks(storedWorks);
      if (storedNotes) setBlogs(storedNotes);
      if (storedStories) setStories(storedStories);
      if (storedConnect) setConnect(storedConnect);
      if (storedResume) {
        setResumeUrl(storedResume);
      } else {
        setResumeUrl('/resume.pdf');
      }
    };

    const loadFromBackend = async () => {
      try {
        const res = await fetch(`${API_URL}/api/portfolio-all`);
        if (!res.ok) throw new Error('Failed to fetch from backend');
        const data = await res.json();

        if (data && Object.keys(data).length > 0) {
          if (data.techStack) setTechStack(data.techStack);
          if (data.works) setWorks(data.works);
          if (data.notes) setBlogs(data.notes);
          if (data.stories) setStories(data.stories);
          if (data.connect) setConnect(data.connect);
          if (data.resume) {
            setResumeUrl(data.resume);
          } else {
            setResumeUrl('/resume.pdf');
          }
        } else {
          loadFromLocalStorage();
        }
      } catch (err) {
        console.warn('Backend API unavailable. Falling back to local storage:', err.message);
        loadFromLocalStorage();
      }
    };

    loadFromBackend();

    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('portfolio_')) {
        loadFromLocalStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Refresh AOS offsets and ScrollTrigger after the DOM adjusts to state loads
    const timer = setTimeout(() => {
      AOS.refresh();
      ScrollTrigger.refresh();
    }, 150);
    return () => clearTimeout(timer);
  }, [techStack, works, blogs, stories, connect]);

  const getIconForConnect = (iconInput) => {
    if (!iconInput) return <LinkIcon size={32} />;
    const input = iconInput.trim();

    // 0. Check if it's a raw SVG string
    if (input.startsWith('<svg')) {
      return <span className="social-icon-svg-inline" dangerouslySetInnerHTML={{ __html: input }} />;
    }

    // 1. Check if it's a FontAwesome React component string
    if (input.startsWith('<FontAwesomeIcon') || input.includes('icon={fa')) {
      const iconMatch = input.match(/icon\s*=\s*\{\s*(fa[A-Za-z0-9]+)\s*\}/);
      if (iconMatch) {
        const camelName = iconMatch[1];
        // Convert to kebab-case
        const name = camelName.replace(/^fa/, '').replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
        const brands = [
          'dev', 'github', 'linkedin', 'instagram', 'twitter', 'facebook', 'youtube', 'discord', 'slack',
          'medium', 'twitch', 'codepen', 'gitlab', 'stack-overflow', 'hashnode', 'threads', 'tiktok',
          'whatsapp', 'telegram', 'reddit', 'pinterest', 'google', 'apple', 'microsoft', 'aws', 'docker'
        ];
        const faClass = brands.includes(name) ? `fa-brands fa-${name}` : `fa-solid fa-${name}`;

        // Parse style if any
        const styleMatch = input.match(/style\s*=\s*\{\{\s*([^}]+)\s*\}\}/);
        let styleObj = { fontSize: '24px' };
        if (styleMatch) {
          const styleContent = styleMatch[1];
          styleContent.split(',').forEach(pair => {
            const parts = pair.split(':');
            if (parts.length >= 2) {
              const key = parts[0].trim();
              const val = parts.slice(1).join(':').trim().replace(/^['"]|['"]$/g, '');
              styleObj[key] = val;
            }
          });
        }
        return <i className={faClass} style={styleObj}></i>;
      }
    }

    // 2. Check if it's a FontAwesome HTML tag string
    if (input.startsWith('<i ') && input.endsWith('></i>')) {
      const classMatch = input.match(/class(?:Name)?\s*=\s*["']([^"']+)["']/);
      const styleMatch = input.match(/style\s*=\s*\{\{\s*([^}]+)\s*\}\}/) || input.match(/style\s*=\s*["']([^"']+)["']/);
      let classes = '';
      if (classMatch) {
        classes = classMatch[1];
      }
      let styleObj = { fontSize: '24px' };
      if (styleMatch) {
        const styleContent = styleMatch[1];
        if (styleContent.includes(':')) {
          styleContent.split(/[;,]/).forEach(pair => {
            const parts = pair.split(':');
            if (parts.length >= 2) {
              const key = parts[0].trim();
              const val = parts.slice(1).join(':').trim().replace(/^['"]|['"]$/g, '');
              styleObj[key] = val;
            }
          });
        }
      }
      return <i className={classes} style={styleObj}></i>;
    }

    // 3. Check if it's a raw class string (e.g. "fa-brands fa-dev")
    if (input.startsWith('fa-') || input.includes(' fa-')) {
      return <i className={input} style={{ fontSize: '24px' }}></i>;
    }

    // 4. Default to standard Lucide icons
    switch (input.toLowerCase()) {
      case 'github': return <GithubIcon size={24} />;
      case 'linkedin': return <LinkedinIcon size={24} />;
      case 'instagram': return <Instagram size={24} />;
      case 'twitter': return <Twitter size={24} />;
      case 'mail': return <Mail size={24} />;
      case 'globe': return <Globe size={24} />;
      case 'download': return <Download size={24} />;
      case 'dev':
      case 'dev.to':
      case 'devto':
        return <i className="fa-brands fa-dev" style={{ fontSize: '24px' }}></i>;
      default: return <LinkIcon size={24} />;
    }
  };


  return (
    <div className="home-container" ref={container}>
      <div className="hero-section hero-section-centered">
        <div className="hero-content-centered">
          <div className="hero-header-row">
            <h1 className="hero-title hero-title-centered">
              JAY
            </h1>
            <p className="hero-subtitle-centered">
              &bull; A Cloud Architect<br /> &bull; Security<br />&bull; Automation<br />&bull; Dev
            </p>
          </div>
          <button
            className="button"
            onClick={() => {
              const link = document.createElement('a');
              link.href = resumeUrl;
              link.download = "Jay_resume.pdf";
              link.target = "_blank";
              link.rel = "noopener noreferrer";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <span className="button_lg">
              <span className="button_sl"></span>
              <span className="button_text">Download Now</span>
            </span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator" onClick={() => {
          const target = document.getElementById('stack');
          if (target) {
            if (window.lenis) {
              window.lenis.scrollTo(target, { duration: 1.2 });
            } else {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }}>
          <span>Scroll to explore</span>
          <ChevronDown className="scroll-arrow" size={20} />
        </div>
      </div>

      {/* Tech Stack Marquee Section */}
      <section id="stack" className="section-container border-t border-foreground/5">
        <h3 className="section-title text-left">Technical Arsenal</h3>
        <p className="section-subtitle text-left">Technologies, frameworks, and tools I use to build secure applications.</p>

        <div className="tech-grid-static">
          {techStack.map((tech, index) => (
            <div 
              key={index} 
              className={`tech-item-static ${activeTechIndex === index ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTechIndex(activeTechIndex === index ? null : index);
              }}
            >
              {tech.icon && tech.icon.trim().startsWith('<svg') ? (
                <div className="tech-icon-img-static tech-icon-svg-inline" dangerouslySetInnerHTML={{ __html: tech.icon }} />
              ) : (
                <img src={tech.icon} alt={tech.name} className="tech-icon-img-static" />
              )}
              <div className="tech-item-tooltip-static">{tech.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Works Section */}
      <section id="works" className="section-container border-t border-foreground/5">
        <h3 className="section-title text-left">Selected Works</h3>
        <p className="section-subtitle text-left">Projects I worked on. Each tailored to solve specific business problems.</p>

        <div className="works-grid-layout">
          {works.map((work, index) => (
            <div key={index} className="work-grid-item">
              <div className="work-grid-header">
                <span className="work-grid-category">{work.category}</span>
                <h4 className="work-grid-title">{work.title}</h4>
              </div>
              <p className="work-grid-desc text-secondary">{work.description}</p>
              <div className="work-grid-footer">
                <a href={work.link} className="work-grid-link" target="_blank" rel="noopener noreferrer">
                  <span>Explore Project</span>
                  <ExternalLink size={16} />
                </a>
                <span className="work-grid-year">2025 - 2026</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Engineering Notes / Blogs */}
      <section id="notes" className="section-container border-t border-foreground/5">
        <h3 className="section-title text-left">Exploit Notes</h3>
        <p className="section-subtitle text-left">Walkthroughs and insights on cloud architectures and application security.</p>

        <div className="works-grid-layout">
          {blogs.map((blog, index) => (
            <div key={index} className="work-grid-item">
              <div className="work-grid-header">
                <span className="work-grid-category">Security Article</span>
                <h4 className="work-grid-title">{blog.title}</h4>
              </div>
              <p className="work-grid-desc text-secondary">{blog.description}</p>
              <div className="work-grid-footer">
                <a href={blog.link} className="work-grid-link" target="_blank" rel="noopener noreferrer">
                  <span>Read Notes</span>
                  <ChevronRight size={16} />
                </a>
                <span className="work-grid-year">2026</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Personal Stories */}
      <section id="stories" className="section-container border-t border-foreground/5">
        <h3 className="section-title text-left">Personal Stories</h3>
        <p className="section-subtitle text-left">Achievements and professional updates from my journey.</p>

        <div className="works-grid-layout">
          {stories.map((story, index) => (
            <div key={index} className="work-grid-item">
              <div className="work-grid-header">
                <span className="work-grid-category">Journey Log</span>
                <h4 className="work-grid-title">{story.title}</h4>
              </div>
              <p className="work-grid-desc text-secondary">{story.description}</p>
              <div className="work-grid-footer">
                <a href={story.link} className="work-grid-link" target="_blank" rel="noopener noreferrer">
                  <span>Read Story</span>
                  <ChevronRight size={16} />
                </a>
                <span className="work-grid-year">2025 - 2026</span>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* Social Section */}
      <section id="social" className="section-container border-t border-foreground/5">
        <h3 className="section-title text-center">Got a security challenge or a project in mind? Let’s talk</h3>
        <p className="section-subtitle text-center">Find me on these online spaces.</p>

        <div className="social-grid-static">
          {connect.map((item, index) => (
            <a key={index} href={item.link} className="social-item-static" target="_blank" rel="noreferrer">
              <span className="social-icon-wrapper-static">{getIconForConnect(item.icon)}</span>
              <span className="social-name-static">{item.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-container">
        <hr className="footer-line" />
        <p className="footer-text">2026 @ JAY. All rights reserved.</p><br />
        <p className="footer-contact" style={{ marginTop: '0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          &bull; Email: <a href="mailto:pateljay0j@gmail.com" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>pateljay0j@gmail.com</a><br /><br /> &bull; Mo num: <a href="tel:+919104974534" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>+91 9104974534</a>
        </p>
      </footer>
    </div >
  );
};

export default Home;
