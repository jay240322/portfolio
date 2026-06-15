import React, { useRef, useState, useEffect } from 'react';
import { Download, ChevronRight, Code as GithubIcon, Mail, Briefcase as LinkedinIcon, ExternalLink, Camera as Instagram, MessageCircle as Twitter, Globe, Link as LinkIcon } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import AOS from 'aos';
import './Home.css';

const Home = () => {
  const GITHUB_USERNAME = 'jay240322';
  const container = useRef();

  const defaultTechStack = [
    { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
    { name: "Express.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
    { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
    { name: "Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
    { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
    { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
    { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
    { name: "Advance SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" }
  ];

  const defaultWorks = [
    {
      title: "E-Commerce Platform",
      category: "Full Stack Development",
      description: "A comprehensive e-commerce platform built with the MERN stack featuring user authentication, payment processing, and an admin dashboard for inventory management.",
      link: "#"
    },
    {
      title: "Real-time Chat Application",
      category: "Web Application",
      description: "A real-time messaging application using Socket.io and React. Supports private messaging, group chats, and read receipts with a clean, responsive UI.",
      link: "#"
    },
    {
      title: "Portfolio Website",
      category: "Frontend Development",
      description: "A modern, highly interactive personal portfolio website featuring glassmorphism design, dark mode, and GitHub API integration.",
      link: "#"
    }
  ];

  const defaultBlogs = [
    {
      title: "Mastering the MERN Stack in 2026",
      description: "A deep dive into building scalable web applications using MongoDB, Express, React, and Node.js. What I learned from my recent projects.",
      link: "#"
    },
    {
      title: "Why PHP Still Matters",
      description: "Exploring the modern PHP ecosystem and why it remains a robust choice for backend development alongside frameworks like Laravel.",
      link: "#"
    }
  ];

  const defaultStories = [
    {
      title: "My First Hackathon Experience",
      description: "A thrilling 24-hour coding sprint where we built a solution for smart cities and won first prize. The intense challenges and lessons learned.",
      link: "#"
    },
    {
      title: "Transitioning to Full Stack Development",
      description: "My personal journey from front-end basics to mastering backend systems, database management, and architecture designs.",
      link: "#"
    }
  ];

  const defaultConnect = [
    { name: "GitHub", link: "https://github.com/jay240322", icon: "github" },
    { name: "LinkedIn", link: "https://linkedin.com", icon: "linkedin" },
    { name: "Instagram", link: "https://instagram.com", icon: "instagram" },
    { name: "Hashnode", link: "https://hashnode.com", icon: "globe" },
    { name: "Twitter", link: "https://twitter.com", icon: "twitter" },
    { name: "Email", link: "mailto:jay240322@gmail.com", icon: "mail" }
  ];

  const [techStack, setTechStack] = useState(defaultTechStack);
  const [works, setWorks] = useState(defaultWorks);
  const [blogs, setBlogs] = useState(defaultBlogs);
  const [stories, setStories] = useState(defaultStories);
  const [connect, setConnect] = useState(defaultConnect);

  useGSAP(() => {
    // Hero section page load entry animations (no ScrollTrigger)
    gsap.fromTo('.hero-content',
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' }
    );
    gsap.fromTo('.hero-image-container',
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 }
    );
  }, { scope: container });

  useEffect(() => {
    const storedTech = JSON.parse(localStorage.getItem('portfolio_techStack'));
    const storedWorks = JSON.parse(localStorage.getItem('portfolio_works'));
    const storedNotes = JSON.parse(localStorage.getItem('portfolio_notes'));
    const storedStories = JSON.parse(localStorage.getItem('portfolio_stories'));
    const storedConnect = JSON.parse(localStorage.getItem('portfolio_connect'));

    if (storedTech) setTechStack(storedTech);
    if (storedWorks) setWorks(storedWorks);
    if (storedNotes) setBlogs(storedNotes);
    if (storedStories) setStories(storedStories);
    if (storedConnect) setConnect(storedConnect);
  }, []);

  useEffect(() => {
    // Refresh AOS offsets after the DOM adjusts to state loads
    const timer = setTimeout(() => {
      AOS.refresh();
    }, 150);
    return () => clearTimeout(timer);
  }, [techStack, works, blogs, stories, connect]);

  const getIconForConnect = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case 'github': return <GithubIcon size={24} />;
      case 'linkedin': return <LinkedinIcon size={24} />;
      case 'instagram': return <Instagram size={24} />;
      case 'twitter': return <Twitter size={24} />;
      case 'mail': return <Mail size={24} />;
      case 'globe': return <Globe size={24} />;
      default: return <LinkIcon size={24} />;
    }
  };

  return (
    <div className="home-container" ref={container}>
      {/* Background glowing effects */}
      <div className="glow-circle top-left"></div>
      <div className="glow-circle bottom-right"></div>
      <div className="floating-shape shape-1"></div>
      <div className="floating-shape shape-2"></div>
      <div className="floating-shape shape-3"></div>
      <div className="floating-shape shape-4"></div>

      <div className="hero-section">
        <div className="hero-content">
          <div className="badge glass-panel">
            <span className="live-dot"></span> Available for work
          </div>

          <h1 className="hero-title" style={{ cursor: 'pointer' }}>
            Hi, I'm <span className="gradient-text">Jay</span> <br />
            Full Stack Developer
          </h1>

          <p className="hero-description" style={{ cursor: 'pointer' }}>
            I craft responsive websites and dynamic web applications.
            Passionate about building excellent software that improves the lives of those around me.
          </p>

          <div className="hero-actions">
            <a
              href="/resume.pdf"
              download="Jay_Resume.pdf"
              className="btn btn-primary"
            >
              <Download size={20} />
              <span>Download Resume</span>
            </a>

            <a href="/github" className="btn btn-secondary glass-panel">
              <span>View My Work</span>
              <ChevronRight size={20} />
            </a>
          </div>

          <div className="social-links">
            <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer" className="social-icon">
              <GithubIcon size={24} />
            </a>
            <a href="mailto:contact@example.com" className="social-icon">
              <Mail size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon">
              <LinkedinIcon size={24} />
            </a>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="image-wrapper glass-panel">
            <img
              src={`https://github.com/${GITHUB_USERNAME}.png`}
              alt="Jay"
              className="profile-image"
            />
            <div className="floating-card glass-panel react-card" style={{ cursor: 'pointer' }}>
              Full Stack Wizard
            </div>
            <div className="floating-card glass-panel mern-card" style={{ cursor: 'pointer' }}>
              MERN Developer
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <section id="stack" className="section-container">
        <div className="section-box relative-box gsap-reveal" data-aos="fade-up">
          <div className="sticker sticker-top-right">💻</div>
          <div className="sticker sticker-bottom-left">⚙️</div>
          <div className="sticker sticker-center-left">🚀</div>
          <div className="sticker sticker-top-center">🧠</div>
          <h2 className="section-title">Tech <span className="gradient-text">Stack</span></h2>
          <p className="section-subtitle">Technologies, frameworks, and languages I use to build applications.</p>

          <div className="stack-grid">
            {techStack.map((tech, index) => (
              <div key={index} className="stack-item glass-panel">
                <div className="stack-item-content">
                  <img src={tech.icon} alt={tech.name} className="stack-icon-img" />
                  <span className="stack-item-name">{tech.name}</span>
                </div>
                <div className="stack-item-tooltip">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Works Section */}
      <section id="works" className="section-container">
        <div className="section-box relative-box gsap-reveal" data-aos="fade-up">
          <div className="sticker sticker-top-left">🎨</div>
          <div className="sticker sticker-bottom-right">📱</div>
          <div className="sticker sticker-center-right">💼</div>
          <div className="sticker sticker-bottom-left">🌟</div>
          <h2 className="section-title">Selected <span className="gradient-text">Works</span></h2>
          <p className="section-subtitle">Projects I worked on. Each tailored to solve specific problems.</p>

          <div className="works-list">
            {works.map((work, index) => (
              <div key={index} className="work-item glass-panel">
                <div className="work-content">
                  <span className="work-category">{work.category}</span>
                  <h3 className="work-title">{work.title}</h3>
                  <p className="work-description">{work.description}</p>
                </div>
                <a href={work.link} className="work-link">
                  <span>View Project</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Notes / Blogs */}
      <section id="notes" className="section-container">
        <div className="section-box relative-box gsap-reveal" data-aos="fade-up">
          <div className="sticker sticker-top-right">📚</div>
          <div className="sticker sticker-bottom-left">💡</div>
          <div className="sticker sticker-top-left">📝</div>
          <div className="sticker sticker-center-right">✍️</div>
          <h2 className="section-title">Exploit <span className="gradient-text">Notes</span></h2>
          <p className="section-subtitle">Articles and thoughts on what I've experienced.</p>

          <div className="works-list">
            {blogs.map((blog, index) => (
              <div key={index} className="work-item glass-panel blog-item">
                <div className="work-content">
                  <h3 className="work-title">{blog.title}</h3>
                  <p className="work-description">{blog.description}</p>
                </div>
                <a href={blog.link} className="work-link">
                  <span>Read Article</span>
                  <ChevronRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Stories */}
      <section id="stories" className="section-container">
        <div className="section-box relative-box gsap-reveal" data-aos="fade-up">
          <div className="sticker sticker-top-right">📖</div>
          <div className="sticker sticker-bottom-left">🚀</div>
          <div className="sticker sticker-top-left">🎭</div>
          <div className="sticker sticker-center-right">✨</div>
          <h2 className="section-title">Personal <span className="gradient-text">Stories</span></h2>
          <p className="section-subtitle">Stories and achievements from my personal and professional journey.</p>

          <div className="works-list">
            {stories.map((story, index) => (
              <div key={index} className="work-item glass-panel story-item">
                <div className="work-content">
                  <h3 className="work-title">{story.title}</h3>
                  <p className="work-description">{story.description}</p>
                </div>
                <a href={story.link} className="work-link">
                  <span>Read Story</span>
                  <ChevronRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-container">
        <div className="section-box relative-box gsap-reveal" data-aos="fade-up">
          <div className="sticker sticker-top-right">💌</div>
          <div className="sticker sticker-bottom-left">📬</div>
          <div className="sticker sticker-center-right">📞</div>
          <div className="sticker sticker-top-left">✨</div>
          <h2 className="section-title">Get In <span className="gradient-text">Touch</span></h2>
          <p className="section-subtitle">Fill out the form below to send an email directly to my inbox.</p>

          <form className="contact-form" onSubmit={(e) => {
            e.preventDefault();
            const name = e.target.name.value;
            const email = e.target.email.value;
            const phone = e.target.phone.value;
            const message = e.target.message.value;
            window.location.href = `mailto:jay240322@gmail.com?subject=Contact from ${name}&body=Name: ${name}%0D%0AEmail: ${email}%0D%0APhone: ${phone}%0D%0A%0D%0AMessage:%0D%0A${message}`;
          }}>
            <div className="form-group">
              <input type="text" name="name" placeholder="Your Name" required className="form-input" />
            </div>
            <div className="form-group">
              <input type="email" name="email" placeholder="Your Email" required className="form-input" />
            </div>
            <div className="form-group">
              <input type="tel" name="phone" placeholder="Your Phone Number" className="form-input" />
            </div>
            <div className="form-group">
              <textarea name="message" placeholder="Your Message" required rows="4" className="form-input"></textarea>
            </div>
            <button type="submit" className="btn btn-primary submit-btn">
              <Mail size={20} />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </section>

      {/* Social Section */}
      <section id="social" className="section-container">
        <div className="section-box relative-box gsap-reveal" data-aos="fade-up">
          <div className="sticker sticker-top-left">🌐</div>
          <div className="sticker sticker-bottom-right">💬</div>
          <div className="sticker sticker-center-left">👋</div>
          <div className="sticker sticker-top-center">🎈</div>
          <h2 className="section-title">Let's <span className="gradient-text">Connect</span></h2>
          <p className="section-subtitle">Find me on these online spaces.</p>

          <div className="social-grid">
            {connect.map((item, index) => (
              <a key={index} href={item.link} className="social-box glass-panel" target="_blank" rel="noreferrer">
                {getIconForConnect(item.icon)}
                <span>{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-container">
        <hr className="footer-line" />
        <p className="footer-text">2026@jay all right reserved</p>
      </footer>
    </div>
  );
};

export default Home;
