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
// Allow all origins for mobile redirect compatibility
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

console.log('\n========== CORS CONFIGURATION ==========');
console.log('Allowed origins: * (ALL ORIGINS)');
console.log('Reason: Mobile device compatibility for short URL redirects');
console.log('Methods: GET, POST, PUT, DELETE, OPTIONS');
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
console.log('\n  DEBUG ROUTES (remove before production):');
console.log('  GET    /health - health check');
console.log('  GET    /test-db - test database connection');
console.log('  GET    /test-schema - check table schema');
console.log('  GET    /test-urls/:userId - test query for specific user');
console.log('====================================\n');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);

// Health check (must be before short code handler since "health" is 6 chars)
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Database connection test route
app.get('/test-db', async (req, res) => {
  try {
    console.log('🔍 Testing database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful:', result.rows[0]);
    res.json({ 
      status: 'Database connected',
      timestamp: result.rows[0].now,
      message: 'PostgreSQL connection is working'
    });
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    console.error('Error code:', err.code);
    res.status(500).json({ 
      error: 'Database connection failed',
      message: err.message,
      code: err.code
    });
  }
});

// Debug: Test table and schema
app.get('/test-schema', async (req, res) => {
  try {
    console.log('🔍 Testing database schema...');
    
    // Check if short_urls table exists
    const tableCheck = await pool.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'short_urls')`
    );
    console.log('short_urls table exists:', tableCheck.rows[0].exists);
    
    // Check columns
    const columnsCheck = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'short_urls' ORDER BY ordinal_position`
    );
    console.log('Columns in short_urls:', columnsCheck.rows.map(r => `${r.column_name} (${r.data_type})`));
    
    // Try a simple select
    const simpleSelect = await pool.query('SELECT COUNT(*) as count FROM short_urls');
    console.log('Total rows in short_urls:', simpleSelect.rows[0].count);
    
    res.json({
      status: 'Schema check passed',
      tableExists: tableCheck.rows[0].exists,
      columns: columnsCheck.rows,
      totalRows: simpleSelect.rows[0].count
    });
  } catch (err) {
    console.error('❌ Schema check error:', err.message);
    res.status(500).json({
      error: 'Schema check failed',
      message: err.message,
      code: err.code
    });
  }
});

// Debug: Test user URLs query
app.get('/test-urls/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`🔍 Testing URLs query for user ${userId}...`);
    
    const result = await pool.query(
      `SELECT id, original_url, short_code, created_at, click_count, user_id 
       FROM short_urls 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    
    console.log(`Found ${result.rows.length} URLs for user ${userId}`);
    res.json({
      status: 'Query successful',
      userId,
      count: result.rows.length,
      urls: result.rows
    });
  } catch (err) {
    console.error('❌ Query error:', err.message);
    res.status(500).json({
      error: 'Query failed',
      message: err.message,
      code: err.code,
      userId: req.params.userId
    });
  }
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
