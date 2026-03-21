# GET /api/urls/my-urls - 500 Error Debugging Guide

## What Was Changed

### 1. **getUserUrls Function** (urlController.js)
Enhanced with:
- ✅ Database connection test using `SELECT NOW()` before querying URLs
- ✅ Detailed logging at each step (user ID verification, query execution, mapping)
- ✅ Comprehensive error logging with:
  - Error message
  - Error code (e.g., "42P01" for column/table not found)
  - Full stack trace
  - JSON stringify of entire error object
- ✅ Removed problematic `LEFT JOIN visits` with `COUNT(v.id)` and `GROUP BY` that could cause issues
- ✅ Simplified query to SELECT from short_urls directly

### 2. **Auth Middleware** (auth.js)
Enhanced with:
- ✅ Logging of token presence and validity
- ✅ Logging of decoded user ID after token verification
- ✅ Clearer error messages showing what failed

### 3. **Global Error Handler** (server.js)
Enhanced with:
- ✅ Captures all unhandled errors across the application
- ✅ Logs error properties: message, code, severity, stack
- ✅ Logs request context: method, path, URL, user ID
- ✅ Full JSON serialization of error object
- ✅ Formatted output for easy reading in Render logs

---

## Expected Logs When Request Succeeds

When you make a request to `GET /api/urls/my-urls`, you should see logs like:

```
--- INCOMING REQUEST ---
Timestamp: 2026-03-21T12:34:56.789Z
Method: GET
Full URL: /api/urls/my-urls
Path: /api/urls/my-urls
Query: {}
---

🔐 authenticateToken middleware:
  Authorization header present: true
  Token present: true
  Token decoded: true
  ✓ Token valid. User ID: 12345

📍 getUserUrls: Starting for user ID: 12345
🔄 Testing database connection...
✓ Database connection OK: 2026-03-21 12:34:56.789+00

🔍 Executing query to fetch user URLs...
✓ Query executed successfully. Found 3 URLs for user 12345
✓ Mapped 3 URLs for response

✓ Response: GET /api/urls/my-urls → 200
```

---

## Expected Logs If There's an Error

### Error Type 1: No Token Provided
```
🔐 authenticateToken middleware:
  Authorization header present: false
  Token present: false
  ❌ No token provided in Authorization header
```
**Fix**: Make sure you're sending the token in the Authorization header as `Bearer <token>`

### Error Type 2: Invalid Token
```
🔐 authenticateToken middleware:
  Authorization header present: true
  Token present: true
  Token decoded: false
  ❌ Token validation failed
```
**Fix**: Verify the token is valid and not expired. Try logging in again.

### Error Type 3: Database Connection Failed
```
🔄 Testing database connection...
❌ getUserUrls error - FULL DETAILS:
Error Message: getaddrinfo ENOTFOUND database-host
Error Code: ENOTFOUND
```
**Fix**: Check DATABASE_URL environment variable in Render. Verify database is running.

### Error Type 4: Column/Table Not Found (PostgreSQL Code 42P01)
```
🔍 Executing query to fetch user URLs...
❌ getUserUrls error - FULL DETAILS:
Error Message: column "click_count" does not exist
Error Code: 42P01
COLUMN/TABLE NOT FOUND ERROR - Check if table/columns exist in database
```
**Fix**: Run migrations to ensure database schema is up to date. Check column names match exactly.

### Error Type 5: Other SQL Errors
```
❌ getUserUrls error - FULL DETAILS:
Error Message: [specific error message]
Error Code: [PostgreSQL error code]
Stack Trace: [full stack trace]
Full Error Object: {...}
```
**Fix**: See PostgreSQL error codes at bottom of this guide.

---

## Troubleshooting Steps

### Step 1: Check Render Logs
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service
3. Click "Logs" tab
4. Search for "getUserUrls error" or "UNHANDLED ERROR"
5. Copy the full error output and analyze using the error codes below

### Step 2: Verify Database Schema
Run this query directly in Railway PostgreSQL console:

```sql
-- Check if short_urls table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'short_urls';

-- Check all columns in short_urls table
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'short_urls';

-- Expected columns:
-- id (integer, primary key)
-- user_id (integer)
-- original_url (text)
-- short_code (character varying)
-- click_count (integer)
-- created_at (timestamp)
```

### Step 3: Verify User Exists in Database
```sql
SELECT id, email FROM users WHERE id = <USER_ID_FROM_TOKEN>;
```

### Step 4: Verify User Has URLs
```sql
SELECT id, short_code, original_url FROM short_urls WHERE user_id = <USER_ID>;
```

### Step 5: Test Database Connection
Check the "Testing database connection..." log output. If it shows an error:

```
❌ Database connection failed
Error: [connection error message]
```

Then DATABASE_URL is invalid. In Render:
1. Go to Database section
2. Get the External Database URL
3. Set it as `DATABASE_URL` environment variable
4. Redeploy backend

---

## Column Names Expected in Database

The query selects these columns from `short_urls` table:

```sql
SELECT 
  su.id, 
  su.original_url,           -- Must exist, used for API response
  su.short_code,             -- Must exist, used for API response
  su.created_at,             -- Must exist, used for API response
  su.click_count,            -- Must exist, used for clicks field
  su.user_id                 -- Used for filtering (WHERE user_id = $1)
FROM short_urls su
WHERE su.user_id = $1
ORDER BY su.created_at DESC
```

**All these columns must exist in the database!**

If any column is missing, you'll get error code **42P01** (undefined column).

---

## PostgreSQL Error Codes Reference

| Code  | Meaning | Common Cause |
|-------|---------|--------------|
| 42P01 | Undefined table/column | Column name mismatch or column doesn't exist |
| 23502 | NOT NULL violation | Trying to insert NULL into non-nullable column |
| 23505 | Unique violation | Duplicate value in unique column |
| 08006 | Connection failure | Database connection lost |
| 28P13 | Invalid authentication | Wrong password or user |
| 3D000 | Database doesn't exist | Wrong database name |

---

## How to Debug Each Potential Issue

### Issue 1: Column Name Mismatch
**Symptom**: Error code 42P01 mentioning a specific column

**What went wrong**: Database schema doesn't match what the code expects

**How to fix**:
1. Check the error message for which column is missing
2. Run the schema check query above
3. If column exists but has different name, update the query
4. If column doesn't exist, add it with migration:
   ```sql
   ALTER TABLE short_urls ADD COLUMN click_count INTEGER DEFAULT 0;
   ```

### Issue 2: Database Connection Failed
**Symptom**: Error message like "ENOTFOUND" or "ECONNREFUSED"

**What went wrong**: DATABASE_URL is invalid or database is not running

**How to fix**:
1. Verify DATABASE_URL environment variable in Render
2. Get correct URL from Railway dashboard
3. Test URL format: `postgresql://user:password@host:port/dbname`
4. Ensure SSL is configured correctly (currently uses `rejectUnauthorized: false`)

### Issue 3: No URLs Found (Not an error, but unexpected)
**Symptom**: Query returns empty array

**What went wrong**: User ID might be wrong, or user has no URLs

**How to fix**:
1. Check the user ID in the logs (should show after ✓ Token valid)
2. Verify that user ID exists in database
3. Check if that user has created any URLs

### Issue 4: 401 or 403 Auth Errors
**Symptom**: Request returns before getUserUrls is even called

**What went wrong**: Token validation failed in middleware

**How to fix**:
1. Check logs show "❌ No token provided" or "❌ Token validation failed"
2. Verify Authorization header is being sent
3. Verify token format is `Bearer <token>`
4. Verify token is not expired
5. Try logging in again to get fresh token

---

## What Changed in the Code

### Before (Old getUserUrls):
```javascript
// Had LEFT JOIN with COUNT which could cause issues
LEFT JOIN visits v ON su.id = v.short_url_id
GROUP BY su.id
COUNT(v.id) as visit_count

// Minimal error logging
catch (error) {
  console.error('Get user URLs error:', error);
}
```

**Problems**:
- LEFT JOIN + GROUP BY could cause performance issues or errors
- Error logging didn't show which specific query failed
- No database connection test
- No user ID validation

### After (New getUserUrls):
```javascript
// Test database connection first
const connectionTest = await pool.query('SELECT NOW()');

// Verify user_id exists
if (!userId) { console.error(...); return res.status(401); }

// Simple, direct query without problematic join
SELECT su.id, su.original_url, su.short_code, 
       su.created_at, su.click_count, su.user_id
FROM short_urls su
WHERE su.user_id = $1

// Comprehensive error logging
catch (error) {
  console.error('Error Message:', error.message);
  console.error('Error Code:', error.code);
  console.error('Error Stack:', error.stack);
  // ... full error details
}
```

**Improvements**:
- Database connection verified before queries
- Cleaner query without problematic JOINs
- User ID validation before query
- Complete error details in logs
- Special handling for PostgreSQL error codes

---

## Next Steps

1. **Deploy**: Changes are now pushed to Render and auto-redeploy
2. **Test**: Make a request to GET `/api/urls/my-urls`
3. **Check Logs**: Go to Render dashboard → Logs and search for "getUserUrls"
4. **Share Output**: If still getting 500 error, share the log output
5. **Verify Schema**: Run the SQL queries above to confirm table structure

---

## Quick Checklist

Before the fix, verify:

- [ ] `Authorization: Bearer <token>` header is being sent
- [ ] Token is valid (not expired)
- [ ] `short_urls` table exists in Railway database
- [ ] All 6 columns exist: id, user_id, original_url, short_code, click_count, created_at
- [ ] User with ID from token exists in database
- [ ] DATABASE_URL environment variable is set correctly in Render

After the fix, you should see:
- [ ] "✓ Database connection OK" in logs
- [ ] "✓ Token valid. User ID: <id>" in logs
- [ ] "✓ Query executed successfully" in logs
- [ ] Response with 200 status code
- [ ] Array of URLs returned

---

## Common Won't-Fix Issues

### Q: "GET /api/urls/my-urls is slow"
**A**: Database query is now optimized. If still slow:
- Ensure short_urls table has index on (user_id, created_at)
- Disable `ssl: { rejectUnauthorized: false }` if not on Railway

### Q: "I want to count visits too"
**A**: Use click_count column instead of counting visits table:
- Reading click_count = O(1)
- Counting visits = O(n) and requires LEFT JOIN
- Click_count is now incremented atomically on each redirect

### Q: "Some users can see other users' URLs"
**A**: WHERE user_id = $1 filter prevents this
- Verify req.userId is set correctly in auth middleware
- Check Authorization header is being parsed correctly

---

## Example Request/Response

### Request:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     https://quicklink-2v4z.onrender.com/api/urls/my-urls
```

### Successful Response (200):
```json
{
  "urls": [
    {
      "id": 1,
      "originalUrl": "https://example.com/very/long/url",
      "shortCode": "abc123",
      "shortUrl": "https://quicklink-2v4z.onrender.com/abc123",
      "createdAt": "2026-03-21T10:00:00.000Z",
      "clicks": 5
    }
  ]
}
```

### Error Response (500):
```json
{
  "error": "An error occurred while fetching URLs",
  "details": "column \"click_count\" does not exist"
}
```
Check Render logs to see full error details with stack trace.

---

## Need More Help?

If you're still seeing 500 errors after these changes:

1. **Check Render Logs**: Look for the exact error message and error code
2. **Verify Schema**: Run the SQL queries to check database structure
3. **Test Database**: Ensure Railway database is running and accessible
4. **Verify Token**: Make sure you're logged in with a valid token
5. **Check Environment**: Verify DATABASE_URL is set correctly in Render

The comprehensive logging will show exactly where the error occurs! 🔍
