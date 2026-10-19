const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';

// Initial connection attempt (runs when server container spins up)
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Initial MongoDB connection error:', err));
} else {
  console.warn('MONGO_URI is not defined in environment variables. Database features will be disabled.');
}

// Mongoose Schema & Model
const PortfolioItemSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
});

const PortfolioItem = mongoose.model('PortfolioItem', PortfolioItemSchema);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace('://', '://www.') : null,
  process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace('://www.', '://') : null,
  'https://www.jaypatel.online',
  'https://jaypatel.online',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // support base64 uploads like pdf resumes & binaries

// Database Connection check middleware (ensures connection is ready before processing any DB request)
const ensureDb = async (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  
  try {
    if (!MONGO_URI) {
      return res.status(503).json({ error: 'Database MONGO_URI is not configured.' });
    }
    console.log('Connecting to MongoDB asynchronously...');
    await mongoose.connect(MONGO_URI);
    next();
  } catch (err) {
    console.error('Database connection failed:', err);
    res.status(503).json({ error: 'Database connection failed: ' + err.message });
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Portfolio API Backend!' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'UP', 
    database: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
    message: 'Backend server is healthy and running' 
  });
});

// GET all portfolio data in a single response (excluding heavy binary files)
app.get('/api/portfolio-all', ensureDb, async (req, res) => {
  try {
    const items = await PortfolioItem.find({ key: { $ne: 'devspace_exe' } });
    const data = {};
    items.forEach(item => {
      data[item.key] = item.value;
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET devspace status (whether the executable exists in MongoDB)
app.get('/api/devspace/status', ensureDb, async (req, res) => {
  try {
    const item = await PortfolioItem.findOne({ key: 'devspace_exe' }, { key: 1 });
    res.json({ exists: !!item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET devspace executable download
app.get('/api/devspace/download', ensureDb, async (req, res) => {
  try {
    const item = await PortfolioItem.findOne({ key: 'devspace_exe' });
    if (!item || !item.value) {
      return res.status(404).json({ error: 'Executable not found' });
    }

    const base64Data = item.value;
    const match = base64Data.match(/^data:([^;]+);base64,(.+)$/);
    let buffer;
    if (match) {
      buffer = Buffer.from(match[2], 'base64');
    } else {
      buffer = Buffer.from(base64Data, 'base64');
    }

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="devspace.exe"');
    return res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET resume file directly from database and stream/download it
app.get('/api/resume/download', ensureDb, async (req, res) => {
  try {
    const item = await PortfolioItem.findOne({ key: 'resume' });
    if (!item || !item.value) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/Jay_resume.pdf`);
    }

    const base64Data = item.value;
    const match = base64Data.match(/^data:([^;]+);base64,(.+)$/);
    
    if (match) {
      const contentType = match[1];
      const base64Content = match[2];
      const buffer = Buffer.from(base64Content, 'base64');
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', 'attachment; filename="Jay_resume.pdf"');
      return res.send(buffer);
    } else {
      const buffer = Buffer.from(base64Data, 'base64');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Jay_resume.pdf"');
      return res.send(buffer);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET resume file directly to view inline in browser tab
app.get('/api/resume/view', ensureDb, async (req, res) => {
  try {
    const item = await PortfolioItem.findOne({ key: 'resume' });
    if (!item || !item.value) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/Jay_resume.pdf`);
    }

    const base64Data = item.value;
    const match = base64Data.match(/^data:([^;]+);base64,(.+)$/);
    
    if (match) {
      const contentType = match[1];
      const base64Content = match[2];
      const buffer = Buffer.from(base64Content, 'base64');
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', 'inline; filename="Jay_resume.pdf"');
      return res.send(buffer);
    } else {
      const buffer = Buffer.from(base64Data, 'base64');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="Jay_resume.pdf"');
      return res.send(buffer);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single portfolio key (e.g. techStack)
app.get('/api/portfolio/:key', ensureDb, async (req, res) => {
  try {
    const item = await PortfolioItem.findOne({ key: req.params.key });
    res.json(item ? item.value : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SAVE a single portfolio key (e.g. techStack)
app.post('/api/portfolio/:key', ensureDb, async (req, res) => {
  try {
    const { value } = req.body;
    const item = await PortfolioItem.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: item.value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
