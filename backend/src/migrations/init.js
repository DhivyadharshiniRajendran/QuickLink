import pool from '../config/database.js';

const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table created');

    // Create short_urls table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS short_urls (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        original_url TEXT NOT NULL,
        short_code VARCHAR(6) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Short URLs table created');

    // Create visits table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        short_url_id INTEGER NOT NULL REFERENCES short_urls(id) ON DELETE CASCADE,
        visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Visits table created');

    // Create indexes for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_short_urls_user_id ON short_urls(user_id)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_short_urls_short_code ON short_urls(short_code)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_visits_short_url_id ON visits(short_url_id)
    `);

    console.log('✓ Indexes created');
    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
};

export default initializeDatabase;
