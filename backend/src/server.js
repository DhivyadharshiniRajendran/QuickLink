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

console.log('\n========== CORS CONFIGURATION ==========');
console.log('Allowed origins:');
console.log('  - http://localhost:5173');
console.log('  - http://localhost:3000');
console.log('  - http://127.0.0.1:5173');
console.log('  - https://quick-link-green.vercel.app');
console.log('=========================================\n');

// Handle preflight OPTIONS requests for all routes
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Detailed request logging middleware for debugging
app.use((req, res, next) => {
  console.log('\n--- INCOMING REQUEST ---');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`Full URL: ${req.url}`);
  console.log(`Path: ${req.path}`);
  console.log(`Base URL: ${req.baseUrl}`);
  console.log(`Query: ${JSON.stringify(req.query)}`);
  console.log(`Headers: ${JSON.stringify({
    origin: req.get('origin'),
    'content-type': req.get('content-type'),
    authorization: req.get('authorization') ? 'Bearer ***' : 'none'
  })}`);
  console.log('---');
  
  // Capture response status for logging
  const originalSend = res.send;
  res.send = function (data) {
    console.log(`✓ Response: ${req.method} ${req.path} → ${res.statusCode}`);
    return originalSend.call(this, data);
  };
  
  next();
});

// Initialize database on startup
await initializeDatabase();

console.log('\n========== STARTUP INFORMATION ==========');
console.log('The frontend MUST construct URLs as follows:');
console.log('  1. Get VITE_API_URL from environment (e.g., https://quicklink-2v4z.onrender.com/api)');
console.log('  2. Append endpoint path (e.g., /auth/signup)');
console.log('  3. Full URL: ${VITE_API_URL}/auth/signup');
console.log('      → https://quicklink-2v4z.onrender.com/api/auth/signup');
console.log('\nIMPORTANT: VITE_API_URL MUST end with /api');
console.log('  ✓ Correct:  https://quicklink-2v4z.onrender.com/api');
console.log('  ✗ Wrong:    https://quicklink-2v4z.onrender.com');
console.log('=========================================\n');

// Log all registered routes for debugging
console.log('\n========== ROUTE STRUCTURE ==========');
console.log('Routes mounted at the following:');
console.log('\n  app.use("/api/auth", authRoutes)');
console.log('    ├─ POST   /signup');
console.log('    ├─ POST   /login');
console.log('    └─ GET    /me');
console.log('\n  app.use("/api/urls", urlRoutes)');
console.log('    ├─ POST   /create');
console.log('    ├─ GET    /my-urls');
console.log('    ├─ GET    /details/:id');
console.log('    └─ DELETE /:id');
console.log('\n  app.get("/health") - public');
console.log('  app.get("/:shortCode") - public redirect (6 char codes only)');
console.log('\nFull paths accessible at:');
console.log('  POST   /api/auth/signup');
console.log('  POST   /api/auth/login');
console.log('  GET    /api/auth/me');
console.log('  POST   /api/urls/create');
console.log('  GET    /api/urls/my-urls');
console.log('  GET    /api/urls/details/:id');
console.log('  DELETE /api/urls/:id');
console.log('  GET    /health');
console.log('  GET    /:shortCode (public)');
console.log('====================================\n');

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
  console.error('\n❌ ===== UNHANDLED ERROR =====');
  console.error('Error Message:', err.message);
  console.error('Error Code:', err.code);
  console.error('Error Severity:', err.severity);
  console.error('Stack Trace:', err.stack);
  console.error('Request:', {
    method: req.method,
    path: req.path,
    url: req.url,
    userId: req.userId || 'not authenticated'
  });
  console.error('Full Error Object:', JSON.stringify(err, null, 2));
  console.error('=============================\n');
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    code: err.code
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`✗ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Not found', path: req.path, method: req.method });
});

app.listen(PORT, () => {
  console.log(`\n✓ Server is running on port ${PORT}`);
  console.log(`✓ Ready to accept requests from configured origins`);
  console.log(`✓ Database initialized and connected\n`);
});
