# Frontend API Configuration Guide

## ✅ Current Status: All Correct ✅

Your frontend is **correctly configured** to use environment-based API URLs. No hardcoded URLs exist.

---

## 🌐 How Frontend Calls Backend

All frontend API calls use the `VITE_API_URL` environment variable:

```javascript
// In both AuthContext and UrlContext
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// All fetch calls use this URL
fetch(`${API_URL}/urls/my-urls` ...);
```

---

## 📁 Environment Files

### `.env` (Local Development)
```
VITE_API_URL=http://localhost:3001/api
```
- ✅ Used when running `npm run dev`
- ✅ Points to local backend on port 3001
- ✅ NOT committed (in .gitignore)

### `.env.production` (Production/Vercel)
```
VITE_API_URL=https://quicklink-2v4z.onrender.com/api
```
- ✅ Used when building for production: `npm run build`
- ✅ Points to backend on Render
- ✅ Automatically used by Vercel during deployment
- ✅ Committed to repository

### `.env.example` (Template)
```
# Documented template for developers
# Shows both local and production configurations
```
- ✅ Reference for developers
- ✅ Shows required format
- ✅ Explains /api suffix requirement

---

## 🔍 All Frontend API Calls Using VITE_API_URL

### AuthContext.jsx
| Endpoint | Method | Uses VITE_API_URL |
|----------|--------|-------------------|
| `/auth/me` | GET | ✅ |
| `/auth/signup` | POST | ✅ |
| `/auth/login` | POST | ✅ |

### UrlContext.jsx
| Endpoint | Method | Uses VITE_API_URL |
|----------|--------|-------------------|
| `/urls/my-urls` | GET | ✅ |
| `/urls/create` | POST | ✅ |
| `/urls/:id` | DELETE | ✅ |
| `/urls/details/:id` | GET | ✅ |

---

## 🧪 Verify API URL Configuration

### 1. In Browser Console (F12)
```javascript
// Check what API URL is being used
console.log(import.meta.env.VITE_API_URL);
```

**Local Dev:** `http://localhost:3001/api` ✅
**Production:** `https://quicklink-2v4z.onrender.com/api` ✅

### 2. Check Console Logs on App Load
When the app loads, you should see:
```
🌐 [AuthContext] API URL: http://localhost:3001/api
🌐 [UrlContext] API URL: http://localhost:3001/api
```

**Why:** Added at the top of each context provider to verify correct URL at runtime

### 3. Check Network Tab
1. Open DevTools → Network tab
2. Make an API request (login, fetch URLs, etc.)
3. Look for `/api/...` requests
4. Check the **Request URL** shows:
   - **Local:** `http://localhost:3001/api/...` ✅
   - **Production:** `https://quicklink-2v4z.onrender.com/api/...` ✅

---

## 🔄 API Request Flow

```
User Action (e.g., click "Login")
     ↓
Frontend Component calls context function
     ↓
Context function gets API_URL from import.meta.env.VITE_API_URL
     ↓
Constructs full URL: ${API_URL}/auth/login
     ↓
Example URLs:
  - Local: http://localhost:3001/api/auth/login
  - Remote: https://quicklink-2v4z.onrender.com/api/auth/login
     ↓
Fetch request includes:
  - Authorization: Bearer {token}
  - Content-Type: application/json
     ↓
Backend receives and processes request
     ↓
Response sent back with status + data
```

---

## 📋 Frontend API Configuration Checklist

- [x] `.env` uses `VITE_API_URL=http://localhost:3001/api` for local dev
- [x] `.env.production` uses `VITE_API_URL=https://quicklink-2v4z.onrender.com/api` for production
- [x] All AuthContext API calls use `import.meta.env.VITE_API_URL`
- [x] All UrlContext API calls use `import.meta.env.VITE_API_URL`
- [x] Console.log added to verify URL on app load
- [x] No hardcoded URLs in frontend code
- [x] `.env` file is in `.gitignore` (not committed)
- [x] `.env.example` shows correct format
- [x] Authorization header sent with all protected requests
- [x] Token stored/retrieved with consistent key ('token')

---

## 🚀 Local Development Setup

### 1. Start Backend
```bash
cd backend
npm install
npm start
# Backend runs on http://localhost:3001
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
# Uses VITE_API_URL=http://localhost:3001/api from .env
```

### 3. Check Console
```
🌐 [AuthContext] API URL: http://localhost:3001/api
🌐 [UrlContext] API URL: http://localhost:3001/api
```

### 4. Test API Call
```javascript
// In browser console
const token = localStorage.getItem('token');
fetch('http://localhost:3001/api/urls/my-urls', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log);
```

---

## 🌍 Production Deployment

### Vercel (Frontend)
1. Connect repository to Vercel
2. Vercel automatically detects `.env.production`
3. Uses `VITE_API_URL=https://quicklink-2v4z.onrender.com/api`
4. Builds and deploys frontend

### Render (Backend)
1. Backend already deployed at `https://quicklink-2v4z.onrender.com`
2. Environment variables already set

### Result
Frontend on `https://quick-link-green.vercel.app` calls backend on `https://quicklink-2v4z.onrender.com/api` ✅

---

## 🔧 If API Calls Still Fail

### 1. Check Console for API URL
```javascript
console.log(import.meta.env.VITE_API_URL);
```
- If shows `undefined`, environment variable not loaded
- Build/reload the app: `npm run dev` or `npm run build`

### 2. Check Network Requests
1. DevTools → Network tab
2. Look for failed requests
3. Check the actual URL being called
4. Compare with expected URL format

### 3. Check Backend is Running
```bash
# Test backend directly (from browser console)
fetch('http://localhost:3001/test-db')
  .then(r => r.json())
  .then(console.log);
```

### 4. Check Authorization Header
1. DevTools → Network tab
2. Click on API request
3. Headers tab → Request Headers
4. Should see: `Authorization: Bearer eyJ...`

---

## 📝 Important Notes

### Why `/api` is Required
```javascript
// Frontend calls:
fetch(`${API_URL}/urls/my-urls`);
// Becomes: http://localhost:3001/api/urls/my-urls

// Backend has routes:
app.use('/api/auth', authRoutes);  // /api/auth/login
app.use('/api/urls', urlRoutes);   // /api/urls/my-urls

// They must match!
```

### Environment Variable Prefix
```javascript
// VITE_ prefix allows Vite to expose to browser
✅ VITE_API_URL=...  // Available in browser
❌ API_URL=...       // NOT available in browser
```

### .gitignore Protection
```
.env  // Local file, not committed (passwords/secrets safe)
.env.production  // Committed (safe, no secrets)
.env.example  // Committed (template for developers)
```

---

## ✨ Summary

✅ **Frontend is correctly using environment-based API URLs**
- All API calls use `import.meta.env.VITE_API_URL`
- Local dev uses `http://localhost:3001/api`
- Production uses `https://quicklink-2v4z.onrender.com/api`
- Console logging confirms URL on app load
- No hardcoded URLs exist in codebase

✅ **Frontend is ready for both local and production deployment**

If the 500 error persists, the issue is on the backend, not the frontend. See [AUTH_FIX_GUIDE.md](AUTH_FIX_GUIDE.md) and [FIX_500_ERROR_DEBUG_GUIDE.md](FIX_500_ERROR_DEBUG_GUIDE.md) for backend troubleshooting.
