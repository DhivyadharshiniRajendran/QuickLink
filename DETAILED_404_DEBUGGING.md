# Detailed 404 Route Debugging Guide

## Backend Logging Activated ✓

Your backend now has comprehensive logging that will help identify exactly where the 404 errors are coming from.

---

## What You'll See in Render Logs

### On Server Startup

When the backend redeploys, you should see:

```
========== CORS CONFIGURATION ==========
Allowed origins:
  - http://localhost:5173
  - http://localhost:3000
  - http://127.0.0.1:5173
  - https://quick-link-green.vercel.app
=========================================

========== STARTUP INFORMATION ==========
The frontend MUST construct URLs as follows:
  1. Get VITE_API_URL from environment (e.g., https://quicklink-2v4z.onrender.com/api)
  2. Append endpoint path (e.g., /auth/signup)
  3. Full URL: ${VITE_API_URL}/auth/signup
      → https://quicklink-2v4z.onrender.com/api/auth/signup

IMPORTANT: VITE_API_URL MUST end with /api
  ✓ Correct:  https://quicklink-2v4z.onrender.com/api
  ✗ Wrong:    https://quicklink-2v4z.onrender.com
=========================================

========== ROUTE STRUCTURE ==========
Routes mounted at the following:

  app.use("/api/auth", authRoutes)
    ├─ POST   /signup
    ├─ POST   /login
    └─ GET    /me

  app.use("/api/urls", urlRoutes)
    ├─ POST   /create
    ├─ GET    /my-urls
    ├─ GET    /details/:id
    └─ DELETE /:id

  app.get("/health") - public
  app.get("/:shortCode") - public redirect (6 char codes only)

Full paths accessible at:
  POST   /api/auth/signup
  POST   /api/auth/login
  GET    /api/auth/me
  POST   /api/urls/create
  GET    /api/urls/my-urls
  GET    /api/urls/details/:id
  DELETE /api/urls/:id
  GET    /health
  GET    /:shortCode (public)
====================================

✓ Server is running on port 3000
✓ Ready to accept requests from configured origins
✓ Database initialized and connected
```

### For Each Request

When a request comes in, you'll see detailed logging:

```
--- INCOMING REQUEST ---
Timestamp: 2026-03-21T10:30:45.123Z
Method: POST
Full URL: /api/auth/signup
Path: /api/auth/signup
Base URL: 
Query: {}
Headers: {
  "origin": "https://quick-link-green.vercel.app",
  "content-type": "application/json",
  "authorization": "none"
}
---
✓ Response: POST /api/auth/signup → 201
```

---

## How to Read the Logs

### Step 1: Check the Incoming Request

Look for the `--- INCOMING REQUEST ---` section to see:

**Key Fields**:
- **`Full URL`**: The complete request path. Should be `/api/auth/signup`, NOT `/auth/signup`
- **`Path`**: The Express path. Should match the route mount point + endpoint
- **`origin`**: The frontend domain. Must be in the allowed origins list
- **`authorization`**: Token presence

### Step 2: Check the Response

Look for `✓ Response:` or `✗ 404 Not Found:` to see what status code was returned:

```
✓ Response: POST /api/auth/signup → 201   // SUCCESS
✗ 404 Not Found: POST /auth/signup        // WRONG PATH
✗ 404 Not Found: POST /api/auth/signup    // ROUTE NOT FOUND
```

### Step 3: Match Request Path to Route

Compare the `Full URL` from the request with the documented routes:

| If Frontend Sends | Backend Has Route | Result |
|-------------------|-------------------|--------|
| `/api/auth/signup` | `app.use('/api/auth', router)` → `router.post('/signup')` | ✓ 201 |
| `/auth/signup` | `app.use('/api/auth', router)` → `router.post('/signup')` | ✗ 404 |
| `/api/api/auth/signup` | `app.use('/api/auth', router)` → `router.post('/signup')` | ✗ 404 |

---

## Common Scenarios and What to Look For

### Scenario 1: Frontend Sending Wrong Path (Missing /api)

**Frontend is calling**: `https://quicklink-2v4z.onrender.com/auth/signup`

**Render logs show**:
```
--- INCOMING REQUEST ---
Full URL: /auth/signup
Path: /auth/signup
---
✗ 404 Not Found: POST /auth/signup → 404
```

**Fix**: Update frontend `.env` to include `/api`:
```env
VITE_API_URL=https://quicklink-2v4z.onrender.com/api
```

### Scenario 2: Frontend Sending Double /api (Path Doubling)

**Frontend is calling**: `https://quicklink-2v4z.onrender.com/api/api/auth/signup`

**Render logs show**:
```
--- INCOMING REQUEST ---
Full URL: /api/api/auth/signup
Path: /api/api/auth/signup
---
✗ 404 Not Found: POST /api/api/auth/signup → 404
```

**Fix**: Check frontend code. Ensure you're not adding `/api` twice:
```javascript
// WRONG - double /api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
fetch(`${API_URL}/api/auth/signup`);  // Becomes .../api/api/auth/signup

// CORRECT - only one /api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
fetch(`${API_URL}/auth/signup`);  // Becomes .../api/auth/signup
```

### Scenario 3: Route Really Not Found

**Frontend is sending**: `https://quicklink-2v4z.onrender.com/api/auth/signup` (correct path)

**But Render logs show**: `✗ 404 Not Found: POST /api/auth/signup`

**Possible causes**:
1. Backend route file not properly exporting
2. Router not properly mounted
3. Auth controller method doesn't exist

**To fix**: Check file structure:
```
backend/src/
├── routes/
│   └── authRoutes.js          // Must export router
├── controllers/
│   └── authController.js      // Must have signup function
└── server.js                  // Must have app.use('/api/auth', authRoutes)
```

---

## Exact URL Format Requirements

### Frontend VITE_API_URL Format

Your `.env` or `.env.production` file:

```env
# ✓ CORRECT - Ends with /api
VITE_API_URL=https://quicklink-2v4z.onrender.com/api

# ✗ WRONG - Missing /api
VITE_API_URL=https://quicklink-2v4z.onrender.com

# ✗ WRONG - Has /api twice
VITE_API_URL=https://quicklink-2v4z.onrender.com/api/api
```

### Frontend fetch() Calls

In AuthContext.jsx, UrlContext.jsx, etc.:

```javascript
// ✓ CORRECT
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const signup_url = `${API_URL}/auth/signup`;      // .../api/auth/signup ✓
const login_url = `${API_URL}/auth/login`;        // .../api/auth/login ✓
const my_urls_url = `${API_URL}/urls/my-urls`;    // .../api/urls/my-urls ✓

// ✗ WRONG - Adding /api again
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const signup_url = `${API_URL}/api/auth/signup`;  // .../api/api/auth/signup ✗

// ✗ WRONG - VITE_API_URL doesn't have /api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const signup_url = `${API_URL}/api/auth/signup`;  // .../api/auth/signup but needs /api added correctly
```

### Backend Route Mounting

In server.js (the correct way):

```javascript
// ✓ CORRECT STRUCTURE
app.use('/api/auth', authRoutes);    // Mount auth router at /api/auth
app.use('/api/urls', urlRoutes);     // Mount url router at /api/urls

// Routes in authRoutes.js:
router.post('/signup', ...);         // Full path becomes /api/auth/signup
router.post('/login', ...);          // Full path becomes /api/auth/login
```

---

## Step-by-Step Debugging Process

### 1. Check Your Environment Variables

**Local development** (run in terminal where frontend is):
```bash
echo $VITE_API_URL    # Should show: http://localhost:3001/api
```

**Production** (Vercel):
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Should have: `VITE_API_URL=https://quicklink-2v4z.onrender.com/api`

**Production** (Render):
- Go to Render Dashboard → Your Backend → Environment
- Check: `BASE_URL=https://quicklink-2v4z.onrender.com`

### 2. Monitor Render Logs

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service
3. Click **Logs** tab
4. Look for startup messages (Route structure)
5. Trigger a request from frontend
6. Watch for the incoming request logging

### 3. Make a Test Request

From your Vercel frontend, try signing up:
1. Open DevTools → Network tab
2. Click Sign Up button
3. Watch Network tab for the request
4. Note the exact URL being called
5. Go to Render logs and find matching request

### 4. Compare Paths

Request from Network tab: `https://quicklink-2v4z.onrender.com/api/auth/signup`

Render logs should show:
```
Full URL: /api/auth/signup
```

If they don't match, you found the issue!

---

## Template for Diagnosis

When something is 404, copy this and fill it in:

```
SYMPTOM: 404 error on signup

FRONTEND IS SENDING:
- VITE_API_URL value: _______________
- Fetch URL: POST to: _______________
- From file: _______________

RENDER LOGS SHOW:
- Incoming Full URL: _______________
- Incoming Path: _______________
- Response Status: _______________

BACKEND HAS:
- Route mount: app.use('___', ___Routes)
- Router endpoint: router.post('/___', ...)
- Full path should be: _______________

DOES FRONTEND MATCH BACKEND? YES / NO
  If NO, what's different?
```

---

## Quick Fixes Checklist

- [ ] Frontend `.env` has `VITE_API_URL=...{backend-url}/api` (ends with /api)
- [ ] Frontend fetch calls use `${API_URL}/auth/signup` (not `${API_URL}/api/auth/signup`)
- [ ] Backend has `app.use('/api/auth', authRoutes)`
- [ ] Render logs show correct paths in startup messages
- [ ] Render has no CORS origin errors
- [ ] Recent Render deploy shows "Server is running"

---

## Still Having Issues?

Collect this information:

1. **Frontend `.env` file contents**:
   ```
   VITE_API_URL = ?
   ```

2. **Exact error from browser console**: (copy-paste)
   ```
   ?
   ```

3. **Network tab request URL**: (what's the full path being called)
   ```
   ?
   ```

4. **Render logs output**: (copy-paste startup messages and one request)
   ```
   ?
   ```

5. **Frontend file structure**: (which file makes the signup call)
   ```
   ?
   ```

This information will pinpoint exactly what's wrong! 🔍
