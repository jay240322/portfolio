const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';

let dbConnected = false;

// Connect to MongoDB
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      dbConnected = true;
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
} else {
  console.warn('MONGO_URI is not defined in environment variables. Database features will be disabled.');
}

// Mongoose Schema & Model
const PortfolioItemSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
});

const PortfolioItem = mongoose.model('PortfolioItem', PortfolioItemSchema);

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
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
app.use(express.json({ limit: '10mb' })); // support base64 uploads like pdf resumes

// Auth Middleware
const checkAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Invalid admin password' });
  }
  next();
};

// Database Connection check middleware
const ensureDb = (req, res, next) => {
  if (!dbConnected && mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database is not connected. Please configure MONGO_URI.' });
  }
  next();
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Portfolio API Backend!' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'UP', 
    database: dbConnected || mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
    message: 'Backend server is healthy and running' 
  });
});

// GET all portfolio data in a single response
app.get('/api/portfolio-all', ensureDb, async (req, res) => {
  try {
    const items = await PortfolioItem.find({});
    const data = {};
    items.forEach(item => {
      data[item.key] = item.value;
    });
    res.json(data);
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

// SAVE a single portfolio key (e.g. techStack) - Admin only
app.post('/api/portfolio/:key', checkAdmin, ensureDb, async (req, res) => {
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
