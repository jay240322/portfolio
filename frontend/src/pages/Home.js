import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, ExternalLink, Globe } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AOS from 'aos';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const container = useRef();
  const worksSliderRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [techStack, setTechStack] = useState(() => {
    try {
      const stored = localStorage.getItem('portfolio_techStack');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [works, setWorks] = useState(() => {
    try {
      const stored = localStorage.getItem('portfolio_works');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [blogs, setBlogs] = useState(() => {
    try {
      const stored = localStorage.getItem('portfolio_notes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [stories, setStories] = useState(() => {
    try {
      const stored = localStorage.getItem('portfolio_stories');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
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

      // Fade out scroll indicator as we scroll down
      gsap.to('.scroll-indicator', {
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
      const sections = ['#about', '#stack', '#works', '#notes', '#stories', '#social'];
      sections.forEach((id) => {
        const isSocial = id === '#social' || id === '#about';

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

      // Fade out scroll indicator as we scroll down
      gsap.to('.scroll-indicator', {
        opacity: 0,
        scrollTrigger: {
          trigger: '.hero-section-centered',
          start: 'top top',
          end: '30% top',
          scrub: true,
        }
      });

      // Scroll-triggered fade-in animations for all sections
      const sections = ['#about', '#stack', '#works', '#notes', '#stories', '#social'];
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
  }, { dependencies: [techStack, works, blogs, stories], scope: container });

  useEffect(() => {
    const loadFromLocalStorage = () => {
      const storedTech = JSON.parse(localStorage.getItem('portfolio_techStack'));
      const storedWorks = JSON.parse(localStorage.getItem('portfolio_works'));
      const storedNotes = JSON.parse(localStorage.getItem('portfolio_notes'));
      const storedStories = JSON.parse(localStorage.getItem('portfolio_stories'));

      if (storedTech) setTechStack(storedTech);
      if (storedWorks) setWorks(storedWorks);
      if (storedNotes) setBlogs(storedNotes);
      if (storedStories) setStories(storedStories);
    };

    const loadFromBackend = async () => {
      try {
        const res = await fetch(`${API_URL}/api/portfolio-all`);
        if (!res.ok) throw new Error('Failed to fetch from backend');
        const data = await res.json();

        if (data && Object.keys(data).length > 0) {
          if (data.techStack) {
            setTechStack(data.techStack);
            localStorage.setItem('portfolio_techStack', JSON.stringify(data.techStack));
          }
          if (data.works) {
            setWorks(data.works);
            localStorage.setItem('portfolio_works', JSON.stringify(data.works));
          }
          if (data.notes) {
            setBlogs(data.notes);
            localStorage.setItem('portfolio_notes', JSON.stringify(data.notes));
          }
          if (data.stories) {
            setStories(data.stories);
            localStorage.setItem('portfolio_stories', JSON.stringify(data.stories));
          }
        } else {
          loadFromLocalStorage();
        }
      } catch (err) {
        console.warn('Backend API unavailable. Falling back to local storage:', err.message);
        loadFromLocalStorage();
      }
    };

    // Load cached version instantly on mount
    loadFromLocalStorage();
    // Fetch latest in the background
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Refresh AOS offsets and ScrollTrigger after the DOM adjusts to state loads
    const timer = setTimeout(() => {
      AOS.refresh();
      ScrollTrigger.refresh();
    }, 150);
    return () => clearTimeout(timer);
  }, [techStack, works, blogs, stories]);

  // Drag-to-scroll support for selected works slider on desktop
  useEffect(() => {
    const slider = worksSliderRef.current;
    if (!slider) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e) => {
      if (e.target.closest('a, button')) return;
      isDown = true;
      slider.classList.add('active-drag');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove('active-drag');
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove('active-drag');
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mousemove', handleMouseMove);

    return () => {
      slider.removeEventListener('mousedown', handleMouseDown);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      slider.removeEventListener('mouseup', handleMouseUp);
      slider.removeEventListener('mousemove', handleMouseMove);
    };
  }, [works]);

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
    } catch (err) {
      console.error('Error opening local resume:', err);
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
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator" onClick={() => {
          const target = document.getElementById('about');
          if (target) {
            const offset = -Math.max(0, (window.innerHeight - target.offsetHeight) / 2);
            if (window.lenis) {
              window.lenis.scrollTo(target, { duration: 1.2, offset });
            } else {
              const top = target.getBoundingClientRect().top + window.scrollY - Math.max(0, (window.innerHeight - target.offsetHeight) / 2);
              window.scrollTo({ top, behavior: 'smooth' });
            }
          }
        }}>
          <span>Scroll to explore</span>
          <ChevronDown className="scroll-arrow" size={20} />
        </div>
      </div>

      {/* What I Bring Section */}
      <section id="about" className="section-container border-t border-foreground/5 what-i-bring-section">
        <h3 className="section-title text-left">What I Bring</h3>
        <p className="what-i-bring-desc text-left">
          I specialize in architecting secure, scalable cloud ecosystems and resilient infrastructure from the ground up. With deep expertise across systems security, threat modeling, vulnerability remediation, automated DevSecOps pipelines, and container orchestration with Kubernetes, I help organizations harden their attack surface, eliminate vulnerabilities, and implement multi-layered defense-in-depth frameworks without sacrificing engineering velocity.
        </p>
      </section>

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

      {/* Selected Works Section (Horizontal Slider) */}
      <section id="works" className="section-container border-t border-foreground/5 works-slider-section">
        <h3 className="section-title text-left">Selected Works</h3>
        <p className="section-subtitle text-left">Projects I worked on. Each tailored to solve specific business problems.</p>

        <div className="works-slider-container" ref={worksSliderRef}>
          {works.map((work, index) => (
            <div key={index} className="work-slider-card">
              <div className="work-grid-header">
                <span className="work-grid-category">{work.category}</span>
                <h4 className="work-grid-title">{work.title}</h4>
              </div>
              <p className="work-grid-desc text-secondary">{work.description}</p>
              <div className="work-grid-footer">
                <div className="work-grid-actions">
                  {/* Explore Project (GitHub Link) */}
                  {work.link && (
                    <a href={work.link} className="work-grid-link" target="_blank" rel="noopener noreferrer">
                      <span>Explore Project</span>
                      <ExternalLink size={16} />
                    </a>
                  )}

                  {/* See on Web (Live Website Link) */}
                  {work.enableLiveUrl && work.liveUrl && (
                    <a href={work.liveUrl} className="work-grid-link" target="_blank" rel="noopener noreferrer">
                      <span>See on Web</span>
                      <Globe size={16} />
                    </a>
                  )}
                </div>
                <span className="work-grid-year">
                  {work.month && work.year ? `${work.month} ${work.year}` : (work.year || "2025 - 2026")}
                </span>
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
          {blogs.slice(0, 2).map((blog, index) => (
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
                <span className="work-grid-year">
                  {blog.month && blog.year ? `${blog.month} ${blog.year}` : (blog.year || "2026")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View More Notes */}
        <div className="view-more-container">
          <a href="https://jaypatel2403.hashnode.dev/" className="view-more-btn" target="_blank" rel="noopener noreferrer">
            <span>More Notes</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </section>

      {/* Personal Stories */}
      <section id="stories" className="section-container border-t border-foreground/5">
        <h3 className="section-title text-left">Personal Stories</h3>
        <p className="section-subtitle text-left">Achievements and professional updates from my journey.</p>

        <div className="works-grid-layout">
          {stories.slice(0, 2).map((story, index) => (
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
                <span className="work-grid-year">
                  {story.month && story.year ? `${story.month} ${story.year}` : (story.year || "2025 - 2026")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View More Stories */}
        <div className="view-more-container">
          <a href="https://medium.com/@JayPatel_1" className="view-more-btn" target="_blank" rel="noopener noreferrer">
            <span>More Stories</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </section>

      {/* Have a Security Challenge / Let's Talk Section */}
      <section id="social" className="section-container border-t border-foreground/5 let-talk-section">
        <h3 className="section-title text-center">Have a Security Challenge?</h3>
        <p className="let-talk-desc">
          Whether you're looking to audit your cloud infrastructure, harden application security, automate DevSecOps pipelines, or discuss an exciting project, let's talk.
        </p>
        <p className="let-talk-cta">
          Reach out via email or connect with me through my links below.
        </p>
      </section>

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
                <a
                  href="/"
                  className="footer-link"
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.lenis) {
                      window.lenis.scrollTo(0, { duration: 1.2 });
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                >
                  Home
                </a>
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
    </div >
  );
};

export default Home;
