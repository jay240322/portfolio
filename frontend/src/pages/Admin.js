import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, RefreshCw } from 'lucide-react';
import './Admin.css';

const Admin = () => {
  // Initial data fallback
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

  const defaultNotes = [
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

  // States
  const [techStack, setTechStack] = useState([]);
  const [works, setWorks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [stories, setStories] = useState([]);
  const [connect, setConnect] = useState([]);

  // Form visibility states
  const [showTechForm, setShowTechForm] = useState(false);
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [showConnectForm, setShowConnectForm] = useState(false);

  // Form states
  const [newTech, setNewTech] = useState({ name: '', icon: '' });
  const [newWork, setNewWork] = useState({ title: '', category: '', description: '', link: '' });
  const [newNote, setNewNote] = useState({ title: '', description: '', link: '' });
  const [newStory, setNewStory] = useState({ title: '', description: '', link: '' });
  const [newConnect, setNewConnect] = useState({ name: '', link: '', icon: 'link' });

  // Edit states
  const [editingTechIndex, setEditingTechIndex] = useState(null);
  const [editingWorkIndex, setEditingWorkIndex] = useState(null);
  const [editingNoteIndex, setEditingNoteIndex] = useState(null);
  const [editingStoryIndex, setEditingStoryIndex] = useState(null);
  const [editingConnectIndex, setEditingConnectIndex] = useState(null);

  useEffect(() => {
    // Load from local storage or use defaults
    const storedTech = JSON.parse(localStorage.getItem('portfolio_techStack'));
    const storedWorks = JSON.parse(localStorage.getItem('portfolio_works'));
    const storedNotes = JSON.parse(localStorage.getItem('portfolio_notes'));
    const storedStories = JSON.parse(localStorage.getItem('portfolio_stories'));
    const storedConnect = JSON.parse(localStorage.getItem('portfolio_connect'));

    setTechStack(storedTech || defaultTechStack);
    setWorks(storedWorks || defaultWorks);
    setNotes(storedNotes || defaultNotes);
    setStories(storedStories || defaultStories);
    setConnect(storedConnect || defaultConnect);
  }, []);

  // Save helpers
  const saveTechStack = (data) => { setTechStack(data); localStorage.setItem('portfolio_techStack', JSON.stringify(data)); };
  const saveWorks = (data) => { setWorks(data); localStorage.setItem('portfolio_works', JSON.stringify(data)); };
  const saveNotes = (data) => { setNotes(data); localStorage.setItem('portfolio_notes', JSON.stringify(data)); };
  const saveStories = (data) => { setStories(data); localStorage.setItem('portfolio_stories', JSON.stringify(data)); };
  const saveConnect = (data) => { setConnect(data); localStorage.setItem('portfolio_connect', JSON.stringify(data)); };

  // Handlers
  const handleAddTech = () => {
    if (newTech.name && newTech.icon) {
      if (editingTechIndex !== null) {
        const updated = [...techStack];
        updated[editingTechIndex] = newTech;
        saveTechStack(updated);
        setEditingTechIndex(null);
      } else {
        saveTechStack([...techStack, newTech]);
      }
      setNewTech({ name: '', icon: '' });
      setShowTechForm(false);
    }
  };

  const handleEditTech = (index) => {
    setNewTech(techStack[index]);
    setEditingTechIndex(index);
    setShowTechForm(true);
  };

  const handleDeleteTech = (index) => {
    const updated = [...techStack];
    updated.splice(index, 1);
    saveTechStack(updated);
  };

  const handleAddWork = () => {
    if (newWork.title && newWork.link) {
      if (editingWorkIndex !== null) {
        const updated = [...works];
        updated[editingWorkIndex] = newWork;
        saveWorks(updated);
        setEditingWorkIndex(null);
      } else {
        saveWorks([...works, newWork]);
      }
      setNewWork({ title: '', category: '', description: '', link: '' });
      setShowWorkForm(false);
    }
  };

  const handleEditWork = (index) => {
    setNewWork(works[index]);
    setEditingWorkIndex(index);
    setShowWorkForm(true);
  };

  const handleDeleteWork = (index) => {
    const updated = [...works];
    updated.splice(index, 1);
    saveWorks(updated);
  };

  const handleAddNote = () => {
    if (newNote.title && newNote.link) {
      if (editingNoteIndex !== null) {
        const updated = [...notes];
        updated[editingNoteIndex] = newNote;
        saveNotes(updated);
        setEditingNoteIndex(null);
      } else {
        saveNotes([...notes, newNote]);
      }
      setNewNote({ title: '', description: '', link: '' });
      setShowNoteForm(false);
    }
  };

  const handleEditNote = (index) => {
    setNewNote(notes[index]);
    setEditingNoteIndex(index);
    setShowNoteForm(true);
  };

  const handleDeleteNote = (index) => {
    const updated = [...notes];
    updated.splice(index, 1);
    saveNotes(updated);
  };

  const handleAddStory = () => {
    if (newStory.title && newStory.link) {
      if (editingStoryIndex !== null) {
        const updated = [...stories];
        updated[editingStoryIndex] = newStory;
        saveStories(updated);
        setEditingStoryIndex(null);
      } else {
        saveStories([...stories, newStory]);
      }
      setNewStory({ title: '', description: '', link: '' });
      setShowStoryForm(false);
    }
  };

  const handleEditStory = (index) => {
    setNewStory(stories[index]);
    setEditingStoryIndex(index);
    setShowStoryForm(true);
  };

  const handleDeleteStory = (index) => {
    const updated = [...stories];
    updated.splice(index, 1);
    saveStories(updated);
  };

  const handleAddConnect = () => {
    if (newConnect.name && newConnect.link) {
      if (editingConnectIndex !== null) {
        const updated = [...connect];
        updated[editingConnectIndex] = newConnect;
        saveConnect(updated);
        setEditingConnectIndex(null);
      } else {
        saveConnect([...connect, newConnect]);
      }
      setNewConnect({ name: '', link: '', icon: 'link' });
      setShowConnectForm(false);
    }
  };

  const handleEditConnect = (index) => {
    setNewConnect(connect[index]);
    setEditingConnectIndex(index);
    setShowConnectForm(true);
  };

  const handleDeleteConnect = (index) => {
    const updated = [...connect];
    updated.splice(index, 1);
    saveConnect(updated);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Are you sure you want to reset all sections to their default values? This will erase any custom additions you have made.")) {
      localStorage.removeItem('portfolio_techStack');
      localStorage.removeItem('portfolio_works');
      localStorage.removeItem('portfolio_notes');
      localStorage.removeItem('portfolio_stories');
      localStorage.removeItem('portfolio_connect');
      setTechStack(defaultTechStack);
      setWorks(defaultWorks);
      setNotes(defaultNotes);
      setStories(defaultStories);
      setConnect(defaultConnect);
    }
  };

  return (
    <div className="admin-container">
      {/* Background glowing effects from Home */}
      <div className="glow-circle top-left"></div>
      <div className="glow-circle bottom-right"></div>
      
      <div className="admin-header">
        <h1 className="hero-title"><span className="gradient-text">Admin</span> Dashboard</h1>
        <p className="hero-description">Manage your portfolio content here.</p>
        <button className="reset-btn" onClick={handleResetDefaults}>
          <RefreshCw size={18} /> Reset All to Defaults
        </button>
      </div>

      {/* Tech Stack Admin */}
      <section className="section-container admin-section">
        <div className="section-box relative-box">
          <div className="sticker sticker-top-right">💻</div>
          <div className="sticker sticker-bottom-left">⚙️</div>
          <h2 className="section-title">Manage <span className="gradient-text">Tech Stack</span></h2>
          
          <div className="admin-items-list">
            {techStack.map((tech, i) => (
              <div key={i} className="admin-item">
                <div className="admin-item-content">
                  <span className="admin-item-title">{tech.name}</span>
                  <span className="admin-item-subtitle">{tech.icon}</span>
                </div>
                <div className="admin-item-actions">
                  <button className="edit-btn" onClick={() => handleEditTech(i)}>
                    <Edit2 size={18} />
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteTech(i)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!showTechForm ? (
            <button className="btn-add" onClick={() => setShowTechForm(true)}>
              <Plus size={20} /> Add New Technology
            </button>
          ) : (
            <div className="add-container relative-box">
              <div className="sticker sticker-top-left">✨</div>
              <input type="text" placeholder="Technology Name" className="admin-input" value={newTech.name} onChange={e => setNewTech({...newTech, name: e.target.value})} />
              <input type="text" placeholder="Icon URL (e.g. from devicons)" className="admin-input" value={newTech.icon} onChange={e => setNewTech({...newTech, icon: e.target.value})} />
              <div className="form-actions">
                <button className="admin-save-btn" onClick={handleAddTech}>{editingTechIndex !== null ? 'Update Technology' : 'Save Technology'}</button>
                <button className="admin-cancel-btn" onClick={() => {setShowTechForm(false); setEditingTechIndex(null); setNewTech({name: '', icon: ''})}}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Works Admin */}
      <section className="section-container admin-section">
        <div className="section-box relative-box">
          <div className="sticker sticker-top-left">🎨</div>
          <div className="sticker sticker-bottom-right">📱</div>
          <h2 className="section-title">Manage <span className="gradient-text">Works</span></h2>
          
          <div className="admin-items-list">
            {works.map((work, i) => (
              <div key={i} className="admin-item">
                <div className="admin-item-content">
                  <span className="admin-item-title">{work.title}</span>
                  <span className="admin-item-subtitle">{work.category}</span>
                </div>
                <div className="admin-item-actions">
                  <button className="edit-btn" onClick={() => handleEditWork(i)}>
                    <Edit2 size={18} />
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteWork(i)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!showWorkForm ? (
            <button className="btn-add" onClick={() => setShowWorkForm(true)}>
              <Plus size={20} /> Add New Project
            </button>
          ) : (
            <div className="add-container relative-box">
              <div className="sticker sticker-top-right">🚀</div>
              <input type="text" placeholder="Project Title" className="admin-input" value={newWork.title} onChange={e => setNewWork({...newWork, title: e.target.value})} />
              <input type="text" placeholder="Sub Heading / Category" className="admin-input" value={newWork.category} onChange={e => setNewWork({...newWork, category: e.target.value})} />
              <textarea placeholder="Project Description" className="admin-input" rows="3" value={newWork.description} onChange={e => setNewWork({...newWork, description: e.target.value})}></textarea>
              <input type="text" placeholder="Project Link" className="admin-input" value={newWork.link} onChange={e => setNewWork({...newWork, link: e.target.value})} />
              <div className="form-actions">
                <button className="admin-save-btn" onClick={handleAddWork}>{editingWorkIndex !== null ? 'Update Project' : 'Save Project'}</button>
                <button className="admin-cancel-btn" onClick={() => {setShowWorkForm(false); setEditingWorkIndex(null); setNewWork({title: '', category: '', description: '', link: ''})}}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Notes Admin */}
      <section className="section-container admin-section">
        <div className="section-box relative-box">
          <div className="sticker sticker-top-right">📚</div>
          <div className="sticker sticker-bottom-left">💡</div>
          <h2 className="section-title">Manage <span className="gradient-text">Notes</span></h2>
          
          <div className="admin-items-list">
            {notes.map((note, i) => (
              <div key={i} className="admin-item">
                <div className="admin-item-content">
                  <span className="admin-item-title">{note.title}</span>
                </div>
                <div className="admin-item-actions">
                  <button className="edit-btn" onClick={() => handleEditNote(i)}>
                    <Edit2 size={18} />
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteNote(i)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!showNoteForm ? (
            <button className="btn-add" onClick={() => setShowNoteForm(true)}>
              <Plus size={20} /> Add New Note
            </button>
          ) : (
            <div className="add-container relative-box">
              <div className="sticker sticker-bottom-right">✍️</div>
              <input type="text" placeholder="Note Title" className="admin-input" value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})} />
              <textarea placeholder="Note Description" className="admin-input" rows="3" value={newNote.description} onChange={e => setNewNote({...newNote, description: e.target.value})}></textarea>
              <input type="text" placeholder="Note Link" className="admin-input" value={newNote.link} onChange={e => setNewNote({...newNote, link: e.target.value})} />
              <div className="form-actions">
                <button className="admin-save-btn" onClick={handleAddNote}>{editingNoteIndex !== null ? 'Update Note' : 'Save Note'}</button>
                <button className="admin-cancel-btn" onClick={() => {setShowNoteForm(false); setEditingNoteIndex(null); setNewNote({title: '', description: '', link: ''})}}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stories Admin */}
      <section className="section-container admin-section">
        <div className="section-box relative-box">
          <div className="sticker sticker-top-right">📖</div>
          <div className="sticker sticker-bottom-left">🚀</div>
          <h2 className="section-title">Manage <span className="gradient-text">Stories</span></h2>
          
          <div className="admin-items-list">
            {stories.map((story, i) => (
              <div key={i} className="admin-item">
                <div className="admin-item-content">
                  <span className="admin-item-title">{story.title}</span>
                </div>
                <div className="admin-item-actions">
                  <button className="edit-btn" onClick={() => handleEditStory(i)}>
                    <Edit2 size={18} />
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteStory(i)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!showStoryForm ? (
            <button className="btn-add" onClick={() => setShowStoryForm(true)}>
              <Plus size={20} /> Add New Story
            </button>
          ) : (
            <div className="add-container relative-box">
              <div className="sticker sticker-bottom-right">✍️</div>
              <input type="text" placeholder="Story Title" className="admin-input" value={newStory.title} onChange={e => setNewStory({...newStory, title: e.target.value})} />
              <textarea placeholder="Story Description" className="admin-input" rows="3" value={newStory.description} onChange={e => setNewStory({...newStory, description: e.target.value})}></textarea>
              <input type="text" placeholder="Story Link" className="admin-input" value={newStory.link} onChange={e => setNewStory({...newStory, link: e.target.value})} />
              <div className="form-actions">
                <button className="admin-save-btn" onClick={handleAddStory}>{editingStoryIndex !== null ? 'Update Story' : 'Save Story'}</button>
                <button className="admin-cancel-btn" onClick={() => {setShowStoryForm(false); setEditingStoryIndex(null); setNewStory({title: '', description: '', link: ''})}}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Connect Admin */}
      <section className="section-container admin-section">
        <div className="section-box relative-box">
          <div className="sticker sticker-top-left">🌐</div>
          <div className="sticker sticker-bottom-right">💬</div>
          <h2 className="section-title">Manage <span className="gradient-text">Connect</span></h2>
          
          <div className="admin-items-list">
            {connect.map((item, i) => (
              <div key={i} className="admin-item">
                <div className="admin-item-content">
                  <span className="admin-item-title">{item.name}</span>
                  <span className="admin-item-subtitle">{item.link}</span>
                </div>
                <div className="admin-item-actions">
                  <button className="edit-btn" onClick={() => handleEditConnect(i)}>
                    <Edit2 size={18} />
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteConnect(i)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!showConnectForm ? (
            <button className="btn-add" onClick={() => setShowConnectForm(true)}>
              <Plus size={20} /> Add New Connect Link
            </button>
          ) : (
            <div className="add-container relative-box">
              <div className="sticker sticker-center-left">🎈</div>
              <input type="text" placeholder="Platform Name (e.g. GitHub)" className="admin-input" value={newConnect.name} onChange={e => setNewConnect({...newConnect, name: e.target.value})} />
              <input type="text" placeholder="Link URL" className="admin-input" value={newConnect.link} onChange={e => setNewConnect({...newConnect, link: e.target.value})} />
              <input type="text" placeholder="Icon Name (github, linkedin, instagram, twitter, mail, globe, link)" className="admin-input" value={newConnect.icon} onChange={e => setNewConnect({...newConnect, icon: e.target.value})} />
              <div className="form-actions">
                <button className="admin-save-btn" onClick={handleAddConnect}>{editingConnectIndex !== null ? 'Update Connect Link' : 'Save Connect Link'}</button>
                <button className="admin-cancel-btn" onClick={() => {setShowConnectForm(false); setEditingConnectIndex(null); setNewConnect({name: '', link: '', icon: 'link'})}}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Admin;
