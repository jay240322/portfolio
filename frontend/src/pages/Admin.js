import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, FileText, Upload } from 'lucide-react';
import './Admin.css';

const Admin = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // States
  const [techStack, setTechStack] = useState([]);
  const [works, setWorks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [stories, setStories] = useState([]);
  const [connect, setConnect] = useState([]);
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [resumeSuccess, setResumeSuccess] = useState('');

  // Devspace Executable states
  const [devspaceExists, setDevspaceExists] = useState(false);
  const [devspaceError, setDevspaceError] = useState('');
  const [devspaceSuccess, setDevspaceSuccess] = useState('');

  // Password & Sync status states
  const [syncStatus, setSyncStatus] = useState({ type: '', message: '' });
  const [dbConnected, setDbConnected] = useState(true);

  // Form visibility states
  const [showTechForm, setShowTechForm] = useState(false);
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [showConnectForm, setShowConnectForm] = useState(false);

  // Form states
  const [newTech, setNewTech] = useState({ name: '', icon: '' });
  const [newWork, setNewWork] = useState({ title: '', category: '', description: '', link: '', downloadUrl: '', enableDownload: false });
  const [newNote, setNewNote] = useState({ title: '', description: '', link: '' });
  const [newStory, setNewStory] = useState({ title: '', description: '', link: '' });
  const [newConnect, setNewConnect] = useState({ name: '', link: '', icon: 'link' });

  // Edit states
  const [editingTechIndex, setEditingTechIndex] = useState(null);
  const [editingWorkIndex, setEditingWorkIndex] = useState(null);
  const [editingNoteIndex, setEditingNoteIndex] = useState(null);
  const [editingStoryIndex, setEditingStoryIndex] = useState(null);
  const [editingConnectIndex, setEditingConnectIndex] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/portfolio-all`);
        if (!res.ok) throw new Error('Failed to fetch from backend');
        const data = await res.json();
        
        if (data && Object.keys(data).length > 0) {
          if (data.techStack) setTechStack(data.techStack);
          if (data.works) setWorks(data.works);
          if (data.notes) setNotes(data.notes);
          if (data.stories) setStories(data.stories);
          if (data.connect) setConnect(data.connect);
          if (data.resume) {
            setResume(data.resume);
          } else {
            const storedResume = localStorage.getItem('portfolio_resume');
            setResume(storedResume || null);
          }
          setDbConnected(true);
          return;
        }
      } catch (err) {
        console.warn('Backend API unavailable. Falling back to local storage:', err.message);
        if (err.message.includes('configure MONGO_URI') || err.message.includes('Database is not connected') || err.message.includes('Failed to fetch')) {
          setDbConnected(false);
        }
      }
      
      // Fallback to local storage
      const storedTech = JSON.parse(localStorage.getItem('portfolio_techStack'));
      const storedWorks = JSON.parse(localStorage.getItem('portfolio_works'));
      const storedNotes = JSON.parse(localStorage.getItem('portfolio_notes'));
      const storedStories = JSON.parse(localStorage.getItem('portfolio_stories'));
      const storedConnect = JSON.parse(localStorage.getItem('portfolio_connect'));
      const storedResume = localStorage.getItem('portfolio_resume');

      setTechStack(storedTech || []);
      setWorks(storedWorks || []);
      setNotes(storedNotes || []);
      setStories(storedStories || []);
      setConnect(storedConnect || []);
      setResume(storedResume || null);

      // Check Devspace status
      try {
        const devspaceRes = await fetch(`${API_URL}/api/devspace/status`);
        if (devspaceRes.ok) {
          const devspaceData = await devspaceRes.json();
          setDevspaceExists(devspaceData.exists);
        }
      } catch (err) {
        console.warn('Failed to fetch devspace status:', err);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save backend helper
  const saveToBackend = async (key, value) => {
    setSyncStatus({ type: '', message: '' });
    try {
      const res = await fetch(`${API_URL}/api/portfolio/${key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save to database');
      }
      setSyncStatus({ type: 'success', message: `${key.replace(/([A-Z])/g, ' $1')} saved to database successfully!` });
      setTimeout(() => setSyncStatus({ type: '', message: '' }), 4000);
      return true;
    } catch (err) {
      console.error(err);
      setSyncStatus({ type: 'error', message: err.message || 'Error saving to database' });
      return false;
    }
  };

  // Save helpers
  const saveTechStack = (data) => { 
    setTechStack(data); 
    localStorage.setItem('portfolio_techStack', JSON.stringify(data)); 
    saveToBackend('techStack', data);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...techStack];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setTechStack(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    localStorage.setItem('portfolio_techStack', JSON.stringify(techStack));
    saveToBackend('techStack', techStack);
  };

  const saveWorks = (data) => { setWorks(data); localStorage.setItem('portfolio_works', JSON.stringify(data)); saveToBackend('works', data); };
  const saveNotes = (data) => { setNotes(data); localStorage.setItem('portfolio_notes', JSON.stringify(data)); saveToBackend('notes', data); };
  const saveStories = (data) => { setStories(data); localStorage.setItem('portfolio_stories', JSON.stringify(data)); saveToBackend('stories', data); };
  const saveConnect = (data) => { setConnect(data); localStorage.setItem('portfolio_connect', JSON.stringify(data)); saveToBackend('connect', data); };

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
      setNewWork({ title: '', category: '', description: '', link: '', downloadUrl: '', enableDownload: false });
      setShowWorkForm(false);
    }
  };

  const handleEditWork = (index) => {
    const item = works[index];
    setNewWork({
      title: item.title || '',
      category: item.category || '',
      description: item.description || '',
      link: item.link || '',
      downloadUrl: item.downloadUrl || '',
      enableDownload: !!item.enableDownload
    });
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

  const handleResumeUpload = (e) => {
    setResumeError('');
    setResumeSuccess('');
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type is PDF
    if (file.type !== 'application/pdf') {
      setResumeError('Please select a valid PDF file.');
      return;
    }

    // Validate size (limit to 4.5MB to fit in 5MB localStorage)
    if (file.size > 4.5 * 1024 * 1024) {
      setResumeError('File is too large. Please select a PDF file smaller than 4.5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const base64String = event.target.result;
        setResume(base64String);
        localStorage.setItem('portfolio_resume', base64String);
        setResumeSuccess('Resume updated successfully!');
        saveToBackend('resume', base64String);
      } catch (err) {
        setResumeError('Failed to read file. Please try again.');
      }
    };
    reader.onerror = () => {
      setResumeError('An error occurred while reading the file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveResume = () => {
    setResume(null);
    localStorage.removeItem('portfolio_resume');
    setResumeSuccess('Custom resume removed. Default resume will be used.');
    setResumeError('');
    saveToBackend('resume', null);
  };

  const handleDevspaceUpload = (e) => {
    setDevspaceError('');
    setDevspaceSuccess('');
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.exe')) {
      setDevspaceError('Please select a valid standalone executable (.exe) file.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setDevspaceError('File is too large. Please select a file smaller than 15MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64String = event.target.result;
        setDevspaceSuccess('Uploading executable to database...');
        const success = await saveToBackend('devspace_exe', base64String);
        if (success) {
          setDevspaceSuccess('Devspace executable updated successfully!');
          setDevspaceExists(true);
        } else {
          setDevspaceError('Failed to upload. See sync status.');
          setDevspaceSuccess('');
        }
      } catch (err) {
        setDevspaceError('Failed to read file. Please try again.');
        setDevspaceSuccess('');
      }
    };
    reader.onerror = () => {
      setDevspaceError('An error occurred while reading the file.');
      setDevspaceSuccess('');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDevspace = async () => {
    setDevspaceError('');
    setDevspaceSuccess('');
    setDevspaceSuccess('Removing executable...');
    const success = await saveToBackend('devspace_exe', null);
    if (success) {
      setDevspaceSuccess('Devspace executable removed successfully!');
      setDevspaceExists(false);
    } else {
      setDevspaceError('Failed to remove executable.');
      setDevspaceSuccess('');
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
      </div>

      {/* DB Connection Warning */}
      {!dbConnected && (
        <div className="db-warning-banner" style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid #ef4444',
          color: '#ef4444',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          textAlign: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <strong>⚠️ Database Disconnected:</strong> Please set the <code>MONGO_URI</code> environment variable on your Vercel/local backend to save your portfolio content permanently.
        </div>
      )}

      {/* Sync Status Toast/Notification */}
      {syncStatus.message && (
        <div className="sync-status-banner" style={{
          background: syncStatus.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: syncStatus.type === 'success' ? '1px solid #22c55e' : '1px solid #ef4444',
          color: syncStatus.type === 'success' ? '#22c55e' : '#ef4444',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          textAlign: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          {syncStatus.message}
        </div>
      )}


      {/* Tech Stack Admin */}
      <section className="section-container admin-section">
        <div className="section-box relative-box">
          <div className="sticker sticker-top-right">💻</div>
          <div className="sticker sticker-bottom-left">⚙️</div>
          <h2 className="section-title">Manage <span className="gradient-text">Tech Stack</span></h2>
          
          <div className="admin-items-list">
            {techStack.map((tech, i) => (
              <div 
                key={i} 
                className={`admin-item ${draggedIndex === i ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragEnd={handleDragEnd}
                style={{ cursor: 'grab' }}
              >
                <div className="drag-handle" style={{ cursor: 'grab', marginRight: '1rem', color: 'var(--text-secondary)', userSelect: 'none' }}>
                  ☰
                </div>
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
              <input type="text" placeholder="Download Link (Optional)" className="admin-input" value={newWork.downloadUrl || ''} onChange={e => setNewWork({...newWork, downloadUrl: e.target.value})} />
              <div className="admin-checkbox-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0' }}>
                <input type="checkbox" id="enableDownload" checked={!!newWork.enableDownload} onChange={e => setNewWork({...newWork, enableDownload: e.target.checked})} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                <label htmlFor="enableDownload" style={{ color: 'var(--text-light)', cursor: 'pointer', fontSize: '0.95rem', userSelect: 'none' }}>Enable Download Button</label>
              </div>
              <div className="form-actions">
                <button className="admin-save-btn" onClick={handleAddWork}>{editingWorkIndex !== null ? 'Update Project' : 'Save Project'}</button>
                <button className="admin-cancel-btn" onClick={() => {setShowWorkForm(false); setEditingWorkIndex(null); setNewWork({title: '', category: '', description: '', link: '', downloadUrl: '', enableDownload: false})}}>Cancel</button>
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
              <input type="text" placeholder="Icon Name (e.g. github, or FontAwesome React/HTML code like <FontAwesomeIcon icon={faDev} />)" className="admin-input" value={newConnect.icon} onChange={e => setNewConnect({...newConnect, icon: e.target.value})} />
              <div className="form-actions">
                <button className="admin-save-btn" onClick={handleAddConnect}>{editingConnectIndex !== null ? 'Update Connect Link' : 'Save Connect Link'}</button>
                <button className="admin-cancel-btn" onClick={() => {setShowConnectForm(false); setEditingConnectIndex(null); setNewConnect({name: '', link: '', icon: 'link'})}}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Resume Admin Section */}
      <section className="section-container admin-section">
        <div className="section-box relative-box">
          <div className="sticker sticker-top-right">📄</div>
          <div className="sticker sticker-bottom-left">📎</div>
          <h2 className="section-title">Manage <span className="gradient-text">Resume</span></h2>
          
          <div className="resume-manage-box">
            <div className="resume-status">
              <span className="status-label">Current Resume: </span>
              {resume ? (
                <span className="status-value custom-uploaded">Custom PDF Uploaded</span>
              ) : (
                <span className="status-value default-used">Default (/resume.pdf)</span>
              )}
            </div>

            {resume && (
              <div className="resume-actions-row">
                <a href={`${API_URL}/api/resume/download`} download="resume.pdf" className="btn-preview" target="_blank" rel="noopener noreferrer">
                  <FileText size={16} /> Preview Current Resume
                </a>
                <button className="btn-remove-resume" onClick={handleRemoveResume}>
                  <Trash2 size={16} /> Remove Custom Resume
                </button>
              </div>
            )}

            <div className="resume-upload-zone">
              <label htmlFor="resume-file-input" className="resume-upload-label">
                <Upload size={24} />
                <span>Choose a PDF file to update resume</span>
                <span className="file-limit">Max size 4.5MB</span>
              </label>
              <input 
                id="resume-file-input" 
                type="file" 
                accept=".pdf" 
                onChange={handleResumeUpload} 
                className="resume-file-input-hidden" 
              />
            </div>

            {resumeError && <div className="resume-message error">{resumeError}</div>}
            {resumeSuccess && <div className="resume-message success">{resumeSuccess}</div>}
          </div>
        </div>
      </section>

      {/* Devspace Executable Admin Section */}
      <section className="admin-section">
        <div className="admin-card glass-panel">
          <div className="card-header">
            <h2 className="section-title">Manage <span className="gradient-text">Devspace Executable</span></h2>
          </div>
          <div className="resume-manage-box">
            <div className="resume-status">
              <span className="status-label">Current Standalone Executable: </span>
              {devspaceExists ? (
                <span className="status-value custom-uploaded">Uploaded (Stored in MongoDB)</span>
              ) : (
                <span className="status-value default-used">None (GitHub Releases fallback will be used)</span>
              )}
            </div>

            {devspaceExists && (
              <div className="resume-actions-row">
                <a href={`${API_URL}/api/devspace/download`} download="devspace.exe" className="btn-preview">
                  <FileText size={16} /> Download Executable
                </a>
                <button className="btn-remove-resume" onClick={handleRemoveDevspace}>
                  <Trash2 size={16} /> Remove Executable
                </button>
              </div>
            )}

            <div className="resume-upload-zone">
              <label htmlFor="devspace-file-input" className="resume-upload-label">
                <Upload size={24} />
                <span>Choose a standalone devspace.exe to update</span>
                <span className="file-limit">Max size 15MB</span>
              </label>
              <input 
                id="devspace-file-input" 
                type="file" 
                accept=".exe" 
                onChange={handleDevspaceUpload} 
                className="resume-file-input-hidden" 
              />
            </div>

            {devspaceError && <div className="resume-message error">{devspaceError}</div>}
            {devspaceSuccess && <div className="resume-message success">{devspaceSuccess}</div>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admin;
