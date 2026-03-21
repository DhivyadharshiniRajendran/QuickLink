import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

console.log('📡 Database Configuration:');
console.log('  DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('  DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...' || 'NOT SET');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

console.log('✅ Pool created with SSL configuration: rejectUnauthorized=false');

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client:', err.message);
  console.error('   Code:', err.code);
});

pool.on('connect', () => {
  console.log('✓ New connection established to database');
});

export default pool;
