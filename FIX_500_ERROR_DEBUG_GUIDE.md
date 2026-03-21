# Fix: GET /api/urls/my-urls 500 Error - Complete Debugging Guide

## 🚀 Quick Start: Follow These Steps in Order

### Step 1: Test Database Connection ✅
Open this URL in your browser:

```
https://quicklink-2v4z.onrender.com/test-db
```

**Expected Response:**
```json
{
  "status": "Database connected",
  "timestamp": "2026-03-21T12:34:56.789Z",
  "message": "PostgreSQL connection is working"
}
```

**If you get an error:**
- ❌ "ENOTFOUND" → DATABASE_URL is wrong or PostgreSQL isn't running
- ❌ "ECONNREFUSED" → Database server not accessible
- ❌ "Invalid password" → Credentials are wrong

👉 **Fix**: Go to Render → Backend Service → Environment Variables
- Verify `DATABASE_URL` is correctly set from Railway PostgreSQL

---

### Step 2: Check Database Schema ✅
Open this URL:

```
https://quicklink-2v4z.onrender.com/test-schema
```

**Expected Response:**
```json
{
  "status": "Schema check passed",
  "tableExists": true,
  "columns": [
    { "column_name": "id", "data_type": "integer" },
    { "column_name": "user_id", "data_type": "integer" },
    { "column_name": "original_url", "data_type": "text" },
    { "column_name": "short_code", "data_type": "character varying" },
    { "column_name": "click_count", "data_type": "integer" },
    { "column_name": "created_at", "data_type": "timestamp without time zone" }
  ],
  "totalRows": 5
}
```

**If table doesn't exist or columns are missing:**

1. Go to Railway Dashboard → PostgreSQL → Query Editor
2. Run this SQL:

```sql
CREATE TABLE IF NOT EXISTS short_urls (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visits (
  id SERIAL PRIMARY KEY,
  short_url_id INTEGER NOT NULL,
  visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (short_url_id) REFERENCES short_urls(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### Step 3: Test Query With Specific User ✅
If you have a user ID (from authentication), test the query:

```
https://quicklink-2v4z.onrender.com/test-urls/1
```
(Replace `1` with your actual user ID)

**Expected Response:**
```json
{
  "status": "Query successful",
  "userId": "1",
  "count": 3,
  "urls": [
    {
      "id": 1,
      "original_url": "https://example.com",
      "short_code": "abc123",
      "created_at": "2026-03-21T10:00:00Z",
      "click_count": 5,
      "user_id": 1
    }
  ]
}
```

**If this works but /api/urls/my-urls doesn't:**
- The problem is in authentication (req.userId is not being set)
- Check your JWT token

**If this also fails:**
- Problem is in the database query
- Check error message for specific issue

---

### Step 4: Verify Frontend Is Sending Token ✅
Open browser Developer Tools (F12) → Network tab → make request to dashboard

Look for request to `/api/urls/my-urls`:

**Check Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

If Authorization header is missing:
- ❌ Frontend is not sending token
- Check frontend code to ensure token is retrieved and sent

---

### Step 5: Check Render Logs ✅
Go to Render Dashboard → Select Backend → Logs

Search for: `getUserUrls error` or `UNHANDLED ERROR`

**Look for:**
1. "Database connection OK:" → ✅ DB is working
2. "No user ID found" → ❌ Token not being passed
3. "Query executed successfully" → ✅ Query worked
4. "COLUMN/TABLE NOT FOUND" → ❌ Schema issue

---

## 🔧 Common Issues & Solutions

### Issue 1: "Error code: 42P01" (Column Not Found)
**Cause:** Database schema doesn't match code

**Fix:**
```sql
-- Check what columns exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'short_urls' ORDER BY ordinal_position;

-- Add missing columns
ALTER TABLE short_urls ADD COLUMN click_count INTEGER DEFAULT 0;
ALTER TABLE short_urls ADD COLUMN user_id INTEGER NOT NULL;
-- etc...
```

---

### Issue 2: "Error code: 42P01" (Table Not Found)
**Cause:** `short_urls` table doesn't exist

**Fix:**
```sql
CREATE TABLE IF NOT EXISTS short_urls (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### Issue 3: "Database connection failed"
**Cause:** DATABASE_URL is invalid or database isn't running

**Fix:**
1. Go to Railway PostgreSQL → Copy External Database URL
2. In Render → Backend Service → Environment → DATABASE_URL
3. Paste the URL
4. Click Manual Deploy → Redeploy

---

### Issue 4: "No token provided" in logs
**Cause:** Frontend not sending Authorization header

**Fix in frontend code:**
```javascript
// Make sure you're sending token like this:
const response = await fetch('/api/urls/my-urls', {
  headers: {
    'Authorization': `Bearer ${token}`  // ← Make sure this is included
  }
});
```

---

### Issue 5: "User ID not found in request"
**Cause:** Token exists but authentication middleware didn't parse it

**Fix:** Verify auth middleware is extracting user ID correctly
```javascript
// In middleware/auth.js, should set req.userId:
const decoded = verifyToken(token);
req.userId = decoded.userId;  // ← This must be set
```

---

## 🧪 Testing Checklist

Before going to production, verify:

- [ ] `https://quicklink-2v4z.onrender.com/test-db` returns 200 with timestamp
- [ ] `https://quicklink-2v4z.onrender.com/test-schema` shows all expected columns
- [ ] `https://quicklink-2v4z.onrender.com/test-urls/1` returns user's URLs (or empty array)
- [ ] Render logs show "Database connection OK" when making requests
- [ ] Render logs show "Token valid. User ID:" when making authenticated requests
- [ ] Frontend Authorization header includes Bearer token
- [ ] Frontend gets 200 response with URLs array

---

## 📊 Database Schema Verification

Run this query to see your complete schema:

```sql
-- Show all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Show short_urls structure
\d short_urls

-- Show column details
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'short_urls'
ORDER BY ordinal_position;

-- Count rows in each table
SELECT 
  'short_urls' as table_name, 
  COUNT(*) as row_count 
FROM short_urls
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'visits', COUNT(*) FROM visits;
```

---

## 🚨 If None of the &quot;Test&quot; Routes Work

If even `/test-db` returns an error, the problem is:
1. Backend is not deployed/running
2. Server port is wrong
3. Service is crashed

**Fix:**
1. Go to Render Dashboard
2. Click Manual Deploy → Redeploy
3. Wait 2-3 minutes for deployment
4. Try test routes again

---

## 📝 Logs to Expect When Everything Works

```
📡 Database Configuration:
  DATABASE_URL exists: true
  DATABASE_URL: postgresql://user:pass@db.railway.internal:5432/...

✅ Pool created with SSL configuration: rejectUnauthorized=false

--- INCOMING REQUEST ---
Timestamp: 2026-03-21T12:34:56.789Z
Method: GET
Full URL: /api/urls/my-urls

🔐 authenticateToken middleware:
  Authorization header present: true
  Token present: true
  Token decoded: true
  ✓ Token valid. User ID: 12345

📍 getUserUrls: Starting for user ID: 12345
🔄 Testing database connection...
✓ Database connection OK: 2026-03-21 12:34:56
🔍 Executing query to fetch user URLs...
✓ Query executed successfully. Found 3 URLs for user 12345
✓ Mapped 3 URLs for response
✓ Response: GET /api/urls/my-urls → 200
```

---

## 🎯 Final Checklist Before Production

- [ ] Remove debug routes (`/test-db`, `/test-schema`, `/test-urls`) before going to production
- [ ] Ensure DATABASE_URL is set in Render environment variables
- [ ] Verify short_urls table has all required columns
- [ ] Verify users table exists with id and email
- [ ] Test query: `SELECT * FROM short_urls WHERE user_id = 1`
- [ ] Frontend sends Authorization header with valid JWT token
- [ ] Render logs show successful database connections
- [ ] GET /api/urls/my-urls returns 200 with urls array

---

## Need More Help?

1. **Share the error from `/test-db`** - that will identify the exact issue
2. **Share the error code** - look for PostgreSQL error codes (42P01, etc.)
3. **Check Render logs** - copy any "❌" ERROR lines
4. **Verify DATABASE_URL** - make sure it's set and matches Railway PostgreSQL

The debug routes will pinpoint exactly where the 500 error is coming from! 🔍
