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

// CORS middleware - must be at the top, before any routes
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://quick-link-green.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight OPTIONS requests for all routes
app.options('*', cors());

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
