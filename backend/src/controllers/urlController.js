import pool from '../config/database.js';
import { generateShortCode, isValidUrl } from '../utils/helpers.js';

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    
    // Support both req.user and req.userId
    const userId = req.user?.id || req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized - No user found' });
    }

    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    let shortCode;
    let isUnique = false;

    // Generate unique short code
    while (!isUnique) {
      shortCode = generateShortCode();
      const existing = await pool.query(
        'SELECT id FROM short_urls WHERE short_code = $1',
        [shortCode]
      );
      if (existing.rows.length === 0) {
        isUnique = true;
      }
    }

    // Insert short URL with initial click_count of 0
    const result = await pool.query(
      'INSERT INTO short_urls (user_id, original_url, short_code, click_count, created_at) VALUES ($1, $2, $3, 0, NOW()) RETURNING id, original_url, short_code, created_at, click_count',
      [userId, originalUrl, shortCode]
    );

    const shortUrl = result.rows[0];

    res.status(201).json({
      message: 'Short URL created successfully',
      shortUrl: {
        id: shortUrl.id,
        originalUrl: shortUrl.original_url,
        shortCode: shortUrl.short_code,
        shortUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/${shortUrl.short_code}`,
        createdAt: shortUrl.created_at,
        clicks: shortUrl.click_count || 0,
      },
    });
  } catch (error) {
    console.error('Create short URL error:', error);
    res.status(500).json({ error: 'An error occurred while creating short URL' });
  }
};

export const getUserUrls = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      console.error('❌ getUserUrls: No user object in request');
      return res.status(401).json({ error: 'Unauthorized - No user found' });
    }

    const userId = req.user.id || req.userId;
    
    if (!userId) {
      console.error('❌ getUserUrls: No user ID found in request');
      return res.status(401).json({ error: 'Unauthorized - No user ID' });
    }

    console.log(`📍 getUserUrls: Starting for user ID: ${userId}`);

    // Test database connection
    console.log('🔄 Testing database connection...');
    const connectionTest = await pool.query('SELECT NOW() as current_time');
    console.log(`✓ Database connection OK: ${connectionTest.rows[0].current_time}`);

    console.log('🔍 Executing query to fetch user URLs...');
    const result = await pool.query(
      `
      SELECT 
        su.id, 
        su.original_url, 
        su.short_code, 
        su.created_at,
        su.click_count,
        su.user_id
      FROM short_urls su
      WHERE su.user_id = $1
      ORDER BY su.created_at DESC
      `,
      [userId]
    );

    console.log(`✓ Query executed successfully. Found ${result.rows.length} URLs for user ${userId}`);

    const urls = result.rows.map((url) => ({
      id: url.id,
      originalUrl: url.original_url,
      shortCode: url.short_code,
      shortUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/${url.short_code}`,
      createdAt: url.created_at,
      clicks: parseInt(url.click_count) || 0,
    }));

    console.log(`✓ Mapped ${urls.length} URLs for response`);
    res.json({ urls });
  } catch (error) {
    console.error('❌ getUserUrls error - FULL DETAILS:');
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Stack:', error.stack);
    console.error('Full Error Object:', JSON.stringify(error, null, 2));
    
    // More descriptive error response
    if (error.code === '42P01') {
      console.error('COLUMN/TABLE NOT FOUND ERROR - Check if table/columns exist in database');
      return res.status(500).json({ error: 'Database table or column not found. Check schema.' });
    }
    
    res.status(500).json({ error: 'An error occurred while fetching URLs', details: error.message });
  }
};

export const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Support both req.user and req.userId
    const userId = req.user?.id || req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized - No user found' });
    }

    // Verify ownership
    const urlCheck = await pool.query(
      'SELECT user_id FROM short_urls WHERE id = $1',
      [id]
    );

    if (urlCheck.rows.length === 0) {
      return res.status(404).json({ error: 'URL not found' });
    }

    if (urlCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete visits first (foreign key constraint)
    await pool.query('DELETE FROM visits WHERE short_url_id = $1', [id]);

    // Delete URL
    await pool.query('DELETE FROM short_urls WHERE id = $1', [id]);

    res.json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error('Delete URL error:', error);
    res.status(500).json({ error: 'An error occurred while deleting URL' });
  }
};

export const redirectToUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const result = await pool.query(
      'SELECT id, original_url FROM short_urls WHERE short_code = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    const shortUrl = result.rows[0];

    // Record visit in the visits table
    await pool.query(
      'INSERT INTO visits (short_url_id, visited_at) VALUES ($1, NOW())',
      [shortUrl.id]
    );

    // Increment click count in the short_urls table
    await pool.query(
      'UPDATE short_urls SET click_count = click_count + 1 WHERE id = $1',
      [shortUrl.id]
    );

    console.log(`✓ Click tracked: ${shortCode} (ID: ${shortUrl.id}) | Visit recorded and click count incremented`);

    // Redirect to original URL
    res.redirect(shortUrl.original_url);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export const getUrlDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Support both req.user and req.userId
    const userId = req.user?.id || req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized - No user found' });
    }

    const urlResult = await pool.query(
      'SELECT id, user_id, original_url, short_code, created_at FROM short_urls WHERE id = $1',
      [id]
    );

    if (urlResult.rows.length === 0) {
      return res.status(404).json({ error: 'URL not found' });
    }

    const url = urlResult.rows[0];

    if (url.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get analytics
    const analyticsResult = await pool.query(
      `
      SELECT 
        COUNT(*) as total_clicks,
        MAX(visited_at) as last_visited
      FROM visits
      WHERE short_url_id = $1
      `,
      [id]
    );

    const analytics = analyticsResult.rows[0];

    // Get recent visits (last 10)
    const visitsResult = await pool.query(
      `
      SELECT visited_at
      FROM visits
      WHERE short_url_id = $1
      ORDER BY visited_at DESC
      LIMIT 10
      `,
      [id]
    );

    res.json({
      id,
      originalUrl: url.original_url,
      shortCode: url.short_code,
      shortUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/${url.short_code}`,
      createdAt: url.created_at,
      totalClicks: parseInt(analytics.total_clicks) || 0,
      lastVisited: analytics.last_visited,
      recentVisits: visitsResult.rows.map((v) => ({ visitedAt: v.visited_at })),
    });
  } catch (error) {
    console.error('Get URL details error:', error);
    res.status(500).json({ error: 'An error occurred while fetching URL details' });
  }
};
