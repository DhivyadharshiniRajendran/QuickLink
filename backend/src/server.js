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
const BASE_URL = process.env.BASE_URL;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ========== CRITICAL: VALIDATE PRODUCTION CONFIGURATION ==========
console.log('\n========== DEPLOYMENT VALIDATION ==========');
console.log(`Environment: ${NODE_ENV}`);
console.log(`Port: ${PORT}`);
console.log(`BASE_URL: ${BASE_URL || 'NOT SET (will default to http://localhost:3001)'}`);

if (NODE_ENV === 'production') {
  if (!BASE_URL || BASE_URL.includes('localhost') || BASE_URL.includes('127.0.0.1')) {
    console.error('\n❌ CRITICAL ERROR: BASE_URL is not set correctly for production!');
    console.error('   This will break short URL generation and redirects!\n');
    console.error('   REQUIRED: Set BASE_URL in Render environment variables');
    console.error('   Format: https://your-render-url.onrender.com');
    console.error('   Example: https://quicklink-2v4z.onrender.com\n');
    console.error('   Short URLs will be generated using this BASE_URL');
    console.error('   If wrong, users will be redirected to wrong domain!\n');
  } else {
    console.log('✓ Production BASE_URL is properly configured');
  }
}
console.log('=========================================\n');

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

console.log('\n========== FRONTEND API CONFIGURATION ==========');
console.log('The frontend MUST use the correct API URL:\n');

const FRONTEND_API_BASE = BASE_URL ? `${BASE_URL}/api` : 'http://localhost:3001/api';
console.log(`Frontend VITE_API_URL should be: ${FRONTEND_API_BASE}`);
console.log('\nFrontend environment variable (.env):');
console.log(`  VITE_API_URL=${FRONTEND_API_BASE}`);
console.log('\nFrontend API calls will be:\n');
console.log(`  POST   ${FRONTEND_API_BASE}/auth/signup`);
console.log(`  POST   ${FRONTEND_API_BASE}/auth/login`);
console.log(`  GET    ${FRONTEND_API_BASE}/auth/me`);
console.log(`  POST   ${FRONTEND_API_BASE}/urls/create`);
console.log(`  GET    ${FRONTEND_API_BASE}/urls/my-urls`);
console.log(`  GET    ${FRONTEND_API_BASE}/urls/details/:id`);
console.log(`  GET    ${FRONTEND_API_BASE}/urls/analytics/:id`);
console.log(`  DELETE ${FRONTEND_API_BASE}/urls/:id`);
console.log('\nShort URL redirects (PUBLIC, no API prefix):');
console.log(`  GET    ${BASE_URL || 'http://localhost:3001'}/abc123 → original URL`);
console.log('===============================================\n');

// Log all registered routes for debugging
console.log('\n========== ROUTE REGISTRATION ORDER (CRITICAL) ==========');
console.log('Routes registered in this EXACT order:\n');
console.log('1. CORS middleware - global');
console.log('2. body-parser (JSON, URL encoded) - global');
console.log('3. Request logging middleware - global');
console.log('4. Database initialization');
console.log('5. app.use("/api/auth", authRoutes) - Auth endpoints');
console.log('6. app.use("/api/urls", urlRoutes) - URL API endpoints (NO short code handler here!)');
console.log('7. app.get("/health") - Health check');
console.log('8. Debug routes (/test-db, /test-schema, /test-urls/:userId)');
console.log('9. ⭐ app.get("/:shortCode") - SHORT URL REDIRECT (CRITICAL POSITION!)');
console.log('   → Only matches exactly 6 alphanumeric characters');
console.log('   → Must be BEFORE error/404 handlers');
console.log('   → Examples: /abc123, /xY9mK2, /QwErty');
console.log('10. Error handling middleware (500 errors)');
console.log('11. 404 Not Found handler (must be LAST)\n');

console.log('IMPORTANT: If short URLs don\'t redirect:');
console.log('  1. Check BASE_URL environment variable');
console.log('  2. Verify short code in database uses correct domain');
console.log('  3. Check that /:shortCode handler is NOT moved after 404\n');

console.log('Accessible endpoints:');
console.log('  POST   /api/auth/signup');
console.log('  POST   /api/auth/login');
console.log('  GET    /api/auth/me');
console.log('  POST   /api/urls/create');
console.log('  GET    /api/urls/my-urls');
console.log('  GET    /api/urls/details/:id');
console.log('  GET    /api/urls/analytics/:id');
console.log('  DELETE /api/urls/:id');
console.log('  GET    /{6-char-code} - SHORT URL REDIRECT');
console.log('========================================================\n');

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

// ========== CRITICAL: Short code redirect handler ==========
// MUST remain AFTER /api routes but BEFORE static middleware and 404
// This is the PRIMARY handler for public short URL redirects
// DO NOT move this handler - routing order is critical!
app.get('/:shortCode', (req, res, next) => {
  const { shortCode } = req.params;
  
  // STRICT VALIDATION: Only handle 6-character alphanumeric codes
  // This prevents accidentally catching other routes like /favicon.ico, /health, etc.
  const isValidShortCode = /^[a-zA-Z0-9]{6}$/.test(shortCode);
  
  if (isValidShortCode) {
    console.log(`\n✅ SHORT URL REDIRECT HANDLER MATCHED`);
    console.log(`   Pattern matched: /${shortCode} (6 alphanumeric characters)`);
    console.log(`   Request URL: ${req.originalUrl}`);
    console.log(`   User Agent: ${req.get('user-agent')?.substring(0, 100) || 'unknown'}`);
    console.log(`   Client IP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);
    console.log(`   Calling redirectToUrl controller...\n`);
    redirectToUrl(req, res, next);
  } else {
    // This is NOT a short code, pass to next handler (error/404)
    console.log(`   Route /${shortCode} does NOT match pattern (not 6 alphanumeric) - passing to error handler`);
    next();
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
  console.log(`✓ Database initialized and connected`);
  console.log(`✓ Short URL handler registered (/:shortCode route)`);
  
  console.log(`\n========== CRITICAL: SHORT URL CONFIGURATION ==========`);
  console.log(`Current BASE_URL: ${BASE_URL || 'NOT SET'}`);
  console.log(`Environment: ${NODE_ENV}`);
  
  if (!BASE_URL) {
    console.log(`\n⚠️  WARNING: BASE_URL is not set!`);
    console.log(`   Defaulting to: http://localhost:3001`);
    console.log(`   This is fine for development.`);
    console.log(`   For production on Render, set BASE_URL environment variable!`);
  } else if (BASE_URL.includes('localhost') || BASE_URL.includes('127.0.0.1')) {
    console.log(`\n⚠️  Development mode detected`);
    console.log(`   Using local base URL for short links`);
  } else {
    console.log(`\n✓ Production BASE_URL configured: ${BASE_URL}`);
    console.log(`   Short URLs will be: ${BASE_URL}/{shortCode}`);
  }
  
  console.log(`\nTroubleshooting short URLs not redirecting:`);
  console.log(`  1. Check BASE_URL environment variable in Render`);
  console.log(`  2. Verify database has correct short URLs (check BASE_URL there)`);
  console.log(`  3. Test redirect: curl -I ${BASE_URL || 'http://localhost:3001'}/abc123`);
  console.log(`  4. Check logs for "SHORT URL REDIRECT HANDLER MATCHED" message`);
  console.log(`======================================================\n`);
});
