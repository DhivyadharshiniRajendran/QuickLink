import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import urlRoutes from './routes/urlRoutes.js';
import initializeDatabase from './migrations/init.js';
import { redirectToUrl } from './controllers/urlController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // In development, allow requests from any localhost origin
    if (process.env.NODE_ENV === 'development') {
      // Allow both no origin (like mobile apps, curl requests) and localhost origins
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy violation'));
      }
    } else {
      // In production, use the specified CLIENT_URL
      if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy violation'));
      }
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database on startup
await initializeDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);

// Health check (must be before short code handler since "health" is 6 chars)
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Short code redirect handler (must be after /api routes and /health but before 404)
// Matches requests like /ta22QV (6 character alphanumeric short codes)
app.get('/:shortCode', (req, res, next) => {
  const { shortCode } = req.params;
  // Only handle 6-character alphanumeric requests that look like short codes
  // This prevents accidentally catching /health or other legit routes
  if (/^[a-zA-Z0-9]{6}$/.test(shortCode)) {
    redirectToUrl(req, res, next);
  } else {
    next(); // Pass to next handler (404, etc.)
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
