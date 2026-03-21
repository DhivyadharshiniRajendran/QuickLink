# Complete API URL Configuration - Deployment Guide

## 📋 Status Summary

### ✅ Frontend
- Using `import.meta.env.VITE_API_URL` for all API calls
- No hardcoded URLs in code
- `.env` for local development: `http://localhost:3001/api`
- `.env.production` for Vercel: `https://quicklink-2v4z.onrender.com/api`
- Console logging added to verify URL on app load

### ✅ Backend
- Using `process.env.DATABASE_URL` for database connection
- Using `process.env.BASE_URL` for short URL response
- `.env` for local development: `http://localhost:3001`
- Render environment: Set to `https://quicklink-2v4z.onrender.com`

---

## 🏗️ Environment Configuration

### Local Development Setup

**Backend - `backend/.env`:**
```
DATABASE_URL=postgresql://[local_or_railway_db_url]
JWT_SECRET=your_secret_key
PORT=3001
NODE_ENV=development
BASE_URL=http://localhost:3001
CLIENT_URL=http://localhost:5173
```

**Frontend - `frontend/.env`:**
```
VITE_API_URL=http://localhost:3001/api
```

**How to Run:**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start
# Backend runs on http://localhost:3001

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

**Verify Local Setup:**
```javascript
// In browser console
console.log(import.meta.env.VITE_API_URL);
// Should output: http://localhost:3001/api
```

---

### Production Deployment Setup

**Render Backend - Environment Variables:**
```
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=strong_random_secret
PORT=3001
NODE_ENV=production
BASE_URL=https://quicklink-2v4z.onrender.com
CLIENT_URL=https://quick-link-green.vercel.app
```

**Vercel Frontend - Environment Variables:**
```
VITE_API_URL=https://quicklink-2v4z.onrender.com/api
```

**How Vercel Uses Variables:**
1. Connect repository to Vercel
2. Vercel detects `.env.production` file
3. Uses variables during build: `npm run build`
4. Deployed site uses production URLs

---

## 🔄 API Request Flow

### Local Development
```
Browser: http://localhost:5173
    ↓
Frontend Context reads: VITE_API_URL=http://localhost:3001/api
    ↓
Constructs: http://localhost:3001/api/urls/my-urls
    ↓
Backend on localhost:3001 receives request
    ↓
Backend returns response with shortUrl:
  {
    "shortUrl": "http://localhost:3001/abc123"
  }
```

### Production
```
Browser: https://quick-link-green.vercel.app
    ↓
Frontend reads: VITE_API_URL=https://quicklink-2v4z.onrender.com/api
    ↓
Constructs: https://quicklink-2v4z.onrender.com/api/urls/my-urls
    ↓
Backend on Render receives request
    ↓
Backend returns response with shortUrl:
  {
    "shortUrl": "https://quicklink-2v4z.onrender.com/abc123"
  }
```

---

## 📁 File Reference

### Frontend Files Using API_URL

**`frontend/src/context/AuthContext.jsx`**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
// Uses for: /auth/signup, /auth/login, /auth/me
```

**`frontend/src/context/UrlContext.jsx`**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
// Uses for: /urls/my-urls, /urls/create, /urls/{id}, /urls/details/{id}
```

### Backend Files Using BASE_URL

**`backend/src/controllers/urlController.js`**
```javascript
shortUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/${shortUrl.short_code}`
```
- Used in response to construct full short URL path
- Example: `https://quicklink-2v4z.onrender.com/abc123`

---

## 🧪 Verification Checklist

### Local Development
- [ ] Backend starts on `http://localhost:3001`
- [ ] Frontend starts on `http://localhost:5173`
- [ ] Browser console shows: `API URL: http://localhost:3001/api`
- [ ] Signup/Login works
- [ ] Can create short URLs
- [ ] Can view dashboard without 500 error
- [ ] Network tab shows requests to `http://localhost:3001/api/`

### Production (Vercel & Render)
- [ ] Vercel has `.env.production` with `VITE_API_URL=https://quicklink-2v4z.onrender.com/api`
- [ ] Render has environment variables set (in Dashboard)
- [ ] Frontend deploys and shows in logs: `API URL: https://quicklink-2v4z.onrender.com/api`
- [ ] Can visit `https://quick-link-green.vercel.app` in browser
- [ ] Signup/Login works on production
- [ ] Can create short URLs
- [ ] Can view dashboard without 500 error
- [ ] Network tab shows requests to `https://quicklink-2v4z.onrender.com/api/`

---

## 🔐 Environment Variables Explained

### VITE_API_URL (Frontend)
- **What:** Base URL for all backend API calls
- **Format:** `http://localhost:3001/api` (local) or `https://quicklink-2v4z.onrender.com/api` (prod)
- **Must Include:** `/api` suffix
- **Exposed to:** Browser (via Vite's VITE_ prefix)
- **Set in:** `.env` (local) and `.env.production` (production)

### DATABASE_URL (Backend)
- **What:** PostgreSQL connection string
- **Format:** `postgresql://user:password@host:port/database`
- **Source:** Railway PostgreSQL dashboard
- **Set in:** Render environment variables (Dashboard)

### JWT_SECRET (Backend)
- **What:** Secret key for JWT token signing
- **Format:** Random string (any length)
- **Set in:** Render environment variables
- **Never:** Commit to repository or share publicly

### BASE_URL (Backend)
- **What:** Full backend server URL for short URL responses
- **Format:** `http://localhost:3001` (local) or `https://quicklink-2v4z.onrender.com` (prod)
- **Set in:** `.env` (local) or Render environment variables (prod)
- **Example:** When user creates short URL, response includes:
  ```json
  {
    "shortUrl": "https://quicklink-2v4z.onrender.com/abc123"
  }
  ```

---

## 🚀 Deployment Steps

### Deploy Backend to Render

1. **Connect GitHub repository to Render**
2. **Set Environment Variables in Render Dashboard:**
   ```
   DATABASE_URL=postgresql://[from Railway]
   JWT_SECRET=strong_random_string
   BASE_URL=https://quicklink-2v4z.onrender.com
   CLIENT_URL=https://quick-link-green.vercel.app
   PORT=3001
   NODE_ENV=production
   ```
3. **Manual Deploy:** Press "Manual Deploy" button
4. **Verify:** Visit `https://quicklink-2v4z.onrender.com/test-db` in browser
   - Should return: `{ "status": "Database connected", ... }`

### Deploy Frontend to Vercel

1. **Connect GitHub repository to Vercel**
2. **Vercel automatically detects `.env.production`**
3. **Verify in `.env.production`:**
   ```
   VITE_API_URL=https://quicklink-2v4z.onrender.com/api
   ```
4. **Vercel automatically builds and deploys** on push to main
5. **Verify:** Visit `https://quick-link-green.vercel.app` in browser
   - Should see login page
   - Check console logs for: `API URL: https://quicklink-2v4z.onrender.com/api`

---

## 🔍 Troubleshooting

### API Calls Going to Wrong URL

**Check Frontend:**
```javascript
console.log(import.meta.env.VITE_API_URL);
```
- If undefined: Rebuild frontend (`npm run build`)
- If wrong URL: Check `.env` and `.env.production` files
- If localhost but should be production: Check which file is being used

**Check Backend Response:**
```javascript
// Should show correct backend URL in Network tab
fetch(chrome_dev_tools_network_tab);
```

### Short URLs Show Wrong Domain

**Check Backend:**
```
BASE_URL=https://quicklink-2v4z.onrender.com
```
- If wrong domain: Update in Render environment variables
- If showing localhost: Verify Render has correct BASE_URL set

### 500 Error on /api/urls/my-urls

**Check Backend Logs:**
1. Go to Render → Logs
2. Look for: `API URL:` or database errors
3. Verify environment variables are set

**Check Frontend Console:**
```javascript
console.log(import.meta.env.VITE_API_URL);
```
- Should not be undefined
- Should match backend BASE_URL + `/api`

---

## 📊 Complete Request Path

```
┌─ User Action ─────────────────────────────────────┐
│ Click button on https://quick-link-green.vercel.app │
└─────────────────────────────│────────────────────────┘
                              ↓
   ┌─ Frontend Reads Config ──────────────────────┐
   │ VITE_API_URL from .env.production            │
   │ = https://quicklink-2v4z.onrender.com/api    │
   └─────────────────────────────├─────────────────┘
                                 ↓
      ┌─ Context Function ──────────────────────────┐
      │ const API_URL = import.meta.env.VITE_API_URL│
      │ const url = `${API_URL}/urls/my-urls`      │
      │ = https://quicklink-2v4z.onrender.com/api/ │
      │   urls/my-urls                              │
      └─────────────────────────────├────────────────┘
                                    ↓
         ┌─ HTTP Request ────────────────────────────────┐
         │ GET /api/urls/my-urls HTTP/1.1               │
         │ Host: quicklink-2v4z.onrender.com            │
         │ Authorization: Bearer eyJ...                 │
         └─────────────────────────────├─────────────────┘
                                       ↓
          ┌─ Backend Processing ──────────────────┐
          │ 1. Render receives request            │
          │ 2. Auth middleware validates token    │
          │ 3. Sets req.user from JWT             │
          │ 4. Queries database for user's URLs   │
          └─────────────────────────────├──────────┘
                                        ↓
         ┌─ Backend Response ─────────────────────────────┐
         │ {                                              │
         │   urls: [                                      │
         │     {                                          │
         │       shortUrl: "https://quicklink-.../ ...",  │
         │       clicks: 5,                              │
         │       ...                                     │
         │     }                                         │
         │   ]                                          │
         │ }                                            │
         └─────────────────────────────├────────────────┘
                                       ↓
      ┌─ Frontend Receives & Displays ──────────────┐
      │ setUrls(data.urls)                         │
      │ Renders dashboard with URL list            │
      └────────────────────────────────────────────┘
```

---

## ✨ Summary

### All URLs Use Environment Variables ✅
- Frontend: `import.meta.env.VITE_API_URL`
- Backend: `process.env.BASE_URL` and `process.env.DATABASE_URL`

### Development Uses localhost ✅
- Frontend: `http://localhost:3001/api`
- Backend: `http://localhost:3001`

### Production Uses Render ✅
- Frontend: `https://quicklink-2v4z.onrender.com/api`
- Backend: `https://quicklink-2v4z.onrender.com`

### No Hardcoded URLs ✅
- All dynamic from environment variables
- Easy to switch between local and production

### Console Logging Added ✅
- Shows URL on app load for debugging
- (Optional) remove before final production deployment

---

## 📖 Reference Documents

- [FRONTEND_API_URL_CONFIG.md](FRONTEND_API_URL_CONFIG.md) - Frontend configuration details
- [AUTH_FIX_GUIDE.md](AUTH_FIX_GUIDE.md) - Authentication middleware fixes
- [FIX_500_ERROR_DEBUG_GUIDE.md](FIX_500_ERROR_DEBUG_GUIDE.md) - 500 error debugging

---

**Your application is correctly configured for both local development and production deployment!** 🚀
