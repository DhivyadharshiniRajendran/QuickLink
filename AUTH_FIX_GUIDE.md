# Authentication Fix: GET /api/urls/my-urls 500 Error

## ✅ What Was Fixed

### 1. **Auth Middleware Updated** (`src/middleware/auth.js`)

**Before:**
```javascript
req.userId = decoded.userId;  // Only set userId
```

**After:**
```javascript
req.user = {
  id: decoded.userId,
  userId: decoded.userId
};
req.userId = decoded.userId;  // For backward compatibility
```

**Why:** Different route handlers were using `req.user` or `req.userId`. Now both work.

---

### 2. **All Controllers Updated** (`src/controllers/urlController.js`)

**Before:**
```javascript
const userId = req.userId;
```

**After:**
```javascript
// Support both req.user and req.userId
const userId = req.user?.id || req.userId;

// Check if user exists
if (!userId) {
  return res.status(401).json({ error: 'Unauthorized - No user found' });
}
```

**Applied to:**
- ✅ `createShortUrl()` - Creating new short URLs
- ✅ `getUserUrls()` - Fetching user's URLs (the main 500 error)
- ✅ `deleteUrl()` - Deleting URLs
- ✅ `getUrlDetails()` - Getting URL analytics

---

## 🔍 How Frontend Token is Sent

Your frontend is **already correctly sending the token!** ✅

```javascript
// In UrlContext.jsx
const response = await fetch(`${API_URL}/urls/my-urls`, {
  headers: {
    'Authorization': `Bearer ${token}`,  // ✅ Correct!
  },
});
```

**Token flow:**
1. User logs in → Backend returns JWT token
2. Frontend stores in `localStorage.setItem('token', data.token)`
3. AuthContext retrieves token on app mount
4. UrlContext uses token for all API calls with `Authorization: Bearer`
5. Backend auth middleware extracts and verifies token
6. Sets `req.user` object with user ID

---

## 🧪 Verification Steps

### Step 1: Test Database Connection
```bash
curl https://quicklink-2v4z.onrender.com/test-db
```

Expected: 
```json
{ "status": "Database connected", "timestamp": "...", "message": "..." }
```

### Step 2: Test Schema
```bash
curl https://quicklink-2v4z.onrender.com/test-schema
```

Expected:
```json
{
  "status": "Schema check passed",
  "tableExists": true,
  "columns": [
    { "column_name": "id", "data_type": "integer" },
    { "column_name": "user_id", "data_type": "integer" },
    ...
  ]
}
```

### Step 3: Test With User ID
```bash
curl https://quicklink-2v4z.onrender.com/test-urls/1
```

Should return URLs for user ID 1, or empty array if none exist.

### Step 4: Test Actual Endpoint With Token

In browser console after logging in:
```javascript
const token = localStorage.getItem('token');
fetch('https://quicklink-2v4z.onrender.com/api/urls/my-urls', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => console.log(data));
```

Should return:
```json
{
  "urls": [
    {
      "id": 1,
      "originalUrl": "https://...",
      "shortCode": "abc123",
      "shortUrl": "...",
      "createdAt": "...",
      "clicks": 5
    }
  ]
}
```

---

## 📊 Expected Logs When Everything Works

Check Render logs and you should see:

```
--- INCOMING REQUEST ---
Timestamp: 2026-03-21T...
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

## ❌ Common Errors & Solutions

### Error 1: "No token provided"
**Symptom:** Logs show `❌ No token provided in Authorization header`

**Cause:** Frontend not sending token

**Solution:**
1. ✅ Verify you're logged in (should see user name in header)
2. ✅ Check localStorage has token: `localStorage.getItem('token')`
3. ✅ If empty, try logging in again

---

### Error 2: "Invalid or expired token"
**Symptom:** Logs show `❌ Token validation failed`

**Cause:** Token is invalid or expired

**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Reload page
3. Log in again
4. Try the endpoint again

---

### Error 3: "No user ID found"
**Symptom:** Logs show `❌ getUserUrls: No user object in request`

**Cause:** Auth middleware didn't properly set req.user

**Solution:**
1. Check if `authenticateToken` middleware is correctly updated
2. Verify JWT_SECRET is set in Render environment
3. Try logging in again

---

### Error 4: Database Errors (42P01)
**Symptom:** Logs show `Error Code: 42P01`

**Cause:** Database table or column doesn't exist

**Solution:** Run this in Railway PostgreSQL:
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

## 🚀 What to Do Now

1. **Wait for Render to redeploy** (~2-3 minutes after commit)
2. **Test the `/test-db` endpoint** → Should work
3. **Test the `/test-schema` endpoint** → Should show table exists
4. **Login to your app** in browser
5. **Go to dashboard** → Should load URLs without 500 error
6. **Check Render logs** → Should see "✓ Response: GET /api/urls/my-urls → 200"

---

## 🔧 If Still Getting 500 Error

1. **Go to Render Dashboard** → Select Backend
2. **Click "Logs"** tab
3. **Look for lines with** `❌` or `ERROR`
4. **Note the exact error message**
5. **Compare with section "Common Errors & Solutions"** above
6. **Check if it matches any error type**

---

## 📝 Code Changes Summary

### Files Modified:
1. **backend/src/middleware/auth.js**
   - Added: `req.user = { id: decoded.userId }`
   - Kept: `req.userId = decoded.userId` for compatibility

2. **backend/src/controllers/urlController.js**
   - Updated: `createShortUrl()` - Added req.user support
   - Updated: `getUserUrls()` - Added req.user check + logging
   - Updated: `deleteUrl()` - Added req.user support
   - Updated: `getUrlDetails()` - Added req.user support

3. **backend/src/server.js** (previous commit)
   - Added: `/test-db` endpoint
   - Added: `/test-schema` endpoint
   - Added: `/test-urls/:userId` endpoint

### Files NOT Modified (Already Correct):
- ✅ `frontend/src/context/AuthContext.jsx` - Token storage and retrieval
- ✅ `frontend/src/context/UrlContext.jsx` - Sending Bearer token
- ✅ `frontend/.env` - API URL configuration

---

## ✨ Full Request Flow Now

```
User Action: Click "Dashboard"
     ↓
Frontend: Loads AuthContext
     ↓
Frontend: Gets token from localStorage
     ↓
Frontend: UrlContext calls fetchUrls()
     ↓
Frontend: Sends GET /api/urls/my-urls with Authorization: Bearer {token}
     ↓
Backend: Receives request
     ↓
Backend: Auth middleware receives token
     ↓
Backend: Verifies JWT
     ↓
Backend: Sets req.user = { id: 12345 }
     ↓
Backend: getUserUrls() function runs
     ↓
Backend: Extracts userId from req.user.id
     ↓
Backend: Queries database for user's URLs
     ↓
Backend: Returns JSON with urls array
     ↓
Frontend: Receives 200 response
     ↓
Frontend: Sets urls state
     ↓
Frontend: Renders dashboard with URLs
```

---

## 🎯 Debugging Tips

**Enable Browser Dev Tools:**
1. Press F12 to open Developer Tools
2. Go to Network tab
3. Try to visit dashboard
4. Look for `/my-urls` request
5. Click on it
6. Check "Headers" section:
   - Should see `Authorization: Bearer eyJh...`
   - Should see "Status: 200" (not 500)

**Check Console:**
1. Open Console tab
2. Should NOT see any red errors
3. Should see logs from UrlContext if data loaded

**Check LocalStorage:**
1. Open Console
2. Type: `localStorage.getItem('token')`
3. Should return a long JWT string starting with `eyJ`
4. If returns `null`, you're not logged in

---

## 🎉 Success Indicators

You'll know it's fixed when:
- ✅ `/test-db` returns 200 with timestamp
- ✅ `/test-schema` returns 200 with table info
- ✅ Dashboard loads without 500 error
- ✅ URLs appear on dashboard
- ✅ Can create new short URLs
- ✅ Can view analytics for URLs
- ✅ Browser Network tab shows `/my-urls → 200`

---

**The backend is now deployed! Give Render 2-3 minutes to redeploy and test.** 🚀
