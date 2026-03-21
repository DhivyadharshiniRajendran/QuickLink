import pool from '../config/database.js';
import { generateShortCode, isValidUrl } from '../utils/helpers.js';

// Helper function to extract browser info from User-Agent
const parseBrowserInfo = (userAgent) => {
  if (!userAgent) {
    return { browser: 'Unknown', deviceType: 'Unknown', os: 'Unknown' };
  }

  let browser = 'Unknown';
  let os = 'Unknown';
  let deviceType = 'Desktop';

  // Detect browser
  if (userAgent.includes('Chrome') && !userAgent.includes('Edge') && !userAgent.includes('Chromium')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge';
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    browser = 'Opera';
  }

  // Detect OS
  if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (userAgent.includes('Mac')) {
    os = 'MacOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  }

  // Detect device type
  if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
    deviceType = 'Mobile';
  } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
    deviceType = 'Tablet';
  }

  return { browser, os, deviceType };
};

// Helper function to extract IP address from request
const getIpAddress = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-original-forwarded-for'] ||
    req.headers['CF-Connecting-IP'] ||
    req.headers['Fastly-Client-IP'] ||
    req.headers['True-Client-IP'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'Unknown'
  );
};

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
    console.log(`\n📱 Redirect request for short code: ${shortCode}`);
    console.log(`   User Agent: ${req.get('user-agent')}`);

    const result = await pool.query(
      'SELECT id, original_url FROM short_urls WHERE short_code = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      console.log(`❌ Short code not found: ${shortCode}`);
      return res.status(404).json({ error: 'Short URL not found' });
    }

    let originalUrl = result.rows[0].original_url;
    const shortUrlId = result.rows[0].id;

    // Ensure URL has protocol prefix for proper mobile redirect
    if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
      console.log(`⚠️  Adding https:// prefix to URL: ${originalUrl}`);
      originalUrl = `https://${originalUrl}`;
    }

    console.log(`✓ Original URL: ${originalUrl}`);

    // Extract analytics data
    const userAgent = req.get('user-agent') || '';
    const { browser, os, deviceType } = parseBrowserInfo(userAgent);
    const ipAddress = getIpAddress(req);

    console.log(`📊 Analytics - Browser: ${browser}, Device: ${deviceType}, OS: ${os}, IP: ${ipAddress}`);

    // Record visit in the visits table with detailed analytics
    await pool.query(
      `INSERT INTO visits (short_url_id, visited_at, browser, device_type, os, ip_address) 
       VALUES ($1, NOW(), $2, $3, $4, $5)`,
      [shortUrlId, browser, deviceType, os, ipAddress]
    );

    // Increment click count and update last_visited_at in the short_urls table
    await pool.query(
      `UPDATE short_urls SET click_count = click_count + 1, last_visited_at = NOW() 
       WHERE id = $1`,
      [shortUrlId]
    );

    console.log(`✓ Click tracked: ${shortCode} (ID: ${shortUrlId}) | Visit recorded with analytics and click count incremented`);

    // Use 301 permanent redirect for better mobile compatibility
    // 301 = Moved Permanently (better for SEO and mobile browsers)
    // vs 302 = Found (temporary redirect)
    console.log(`✓ Sending 301 permanent redirect to: ${originalUrl}\n`);
    res.redirect(301, originalUrl);
  } catch (error) {
    console.error('❌ Redirect error:', error);
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
      'SELECT id, user_id, original_url, short_code, created_at, click_count FROM short_urls WHERE id = $1',
      [id]
    );

    if (urlResult.rows.length === 0) {
      return res.status(404).json({ error: 'URL not found' });
    }

    const url = urlResult.rows[0];

    if (url.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({
      id,
      originalUrl: url.original_url,
      shortCode: url.short_code,
      shortUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/${url.short_code}`,
      createdAt: url.created_at,
      clicks: parseInt(url.click_count) || 0,
    });
  } catch (error) {
    console.error('Get URL details error:', error);
    res.status(500).json({ error: 'An error occurred while fetching URL details' });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    // Support both req.user and req.userId
    const userId = req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized - No user found' });
    }

    // Verify ownership
    const urlCheck = await pool.query(
      'SELECT user_id, short_code, click_count, last_visited_at FROM short_urls WHERE id = $1',
      [id]
    );

    if (urlCheck.rows.length === 0) {
      return res.status(404).json({ error: 'URL not found' });
    }

    if (urlCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const shortUrl = urlCheck.rows[0];

    // Get total click count and last visited time
    const totalClicks = shortUrl.click_count || 0;
    const lastVisitedAt = shortUrl.last_visited_at;

    // Get recent visits (last 20)
    const recentVisitsResult = await pool.query(
      `SELECT 
        id,
        visited_at,
        browser,
        device_type,
        os,
        ip_address,
        country
      FROM visits 
      WHERE short_url_id = $1 
      ORDER BY visited_at DESC 
      LIMIT 20`,
      [id]
    );

    const recentVisits = recentVisitsResult.rows.map((visit) => ({
      id: visit.id,
      timestamp: visit.visited_at,
      browser: visit.browser || 'Unknown',
      deviceType: visit.device_type || 'Unknown',
      os: visit.os || 'Unknown',
      ipAddress: visit.ip_address || 'Unknown',
      country: visit.country || 'Unknown',
    }));

    // Get clicks per day for last 7 days
    const clicksPerDayResult = await pool.query(
      `SELECT 
        DATE(visited_at) as date,
        COUNT(*) as clicks
      FROM visits 
      WHERE short_url_id = $1 
        AND visited_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(visited_at)
      ORDER BY DATE(visited_at)`,
      [id]
    );

    const clicksPerDay = clicksPerDayResult.rows.map((row) => ({
      date: new Date(row.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      clicks: parseInt(row.clicks),
    }));

    // Fill in missing days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const found = clicksPerDay.find((d) => d.date === dateStr);
      last7Days.push(found || { date: dateStr, clicks: 0 });
    }

    // Get most active hour
    const mostActiveHourResult = await pool.query(
      `SELECT 
        EXTRACT(HOUR FROM visited_at) as hour,
        COUNT(*) as clicks
      FROM visits 
      WHERE short_url_id = $1 
      GROUP BY EXTRACT(HOUR FROM visited_at)
      ORDER BY clicks DESC 
      LIMIT 1`,
      [id]
    );

    const mostActiveHour = mostActiveHourResult.rows.length > 0 
      ? parseInt(mostActiveHourResult.rows[0].hour)
      : null;

    // Get device type breakdown
    const deviceBreakdownResult = await pool.query(
      `SELECT 
        device_type,
        COUNT(*) as count
      FROM visits 
      WHERE short_url_id = $1 
      GROUP BY device_type`,
      [id]
    );

    const deviceBreakdown = deviceBreakdownResult.rows.reduce((acc, row) => {
      const deviceType = row.device_type || 'Unknown';
      acc[deviceType] = parseInt(row.count);
      return acc;
    }, {});

    // Get browser breakdown
    const browserBreakdownResult = await pool.query(
      `SELECT 
        browser,
        COUNT(*) as count
      FROM visits 
      WHERE short_url_id = $1 
      GROUP BY browser
      ORDER BY count DESC`,
      [id]
    );

    const browserBreakdown = browserBreakdownResult.rows.map((row) => ({
      name: row.browser || 'Unknown',
      count: parseInt(row.count),
    }));

    res.json({
      totalClicks,
      lastVisitedAt,
      recentVisits,
      clicksPerDay: last7Days,
      mostActiveHour,
      deviceBreakdown: {
        desktop: deviceBreakdown['Desktop'] || 0,
        mobile: deviceBreakdown['Mobile'] || 0,
        tablet: deviceBreakdown['Tablet'] || 0,
        other: deviceBreakdown['Unknown'] || 0,
      },
      browserBreakdown,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'An error occurred while fetching analytics' });
  }
};
