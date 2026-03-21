# Production Deployment Configuration - Vercel & Render

## Overview
This document outlines the configuration for deploying QuickLink with:
- **Backend**: Render at `https://quicklink-2v4z.onrender.com`
- **Frontend**: Vercel at `https://quicklink-vert.vercel.app` (will be set after deployment)

---

## Frontend Configuration (Vercel)

### .env.production
```env
VITE_API_URL=https://quicklink-2v4z.onrender.com/api
```
- Points all API calls to the production backend on Render
- Automatically used when building for production

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "/index.html"
    }
  ]
}
```
- Ensures React Router works correctly on Vercel
- All routes redirect to `/index.html` so the React app handles routing
- Prevents 404 errors on page refresh for dynamic routes

### Vercel Dashboard Setup
1. **Environment Variables**:
   - `VITE_API_URL` = `https://quicklink-2v4z.onrender.com/api`

2. **Build Settings**:
   - Framework: `Vite`
   - Build Command: `npm run build --workspace=frontend`
   - Output Directory: `frontend/dist`

3. **Deploy**:
   - Push code to GitHub
   - Vercel auto-deploys from `main` branch
   - Copy the provided Vercel URL (e.g., https://quicklink-vert.vercel.app)

---

## Backend Configuration (Render)

### CORS Configuration (server.js)
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',      // Local development
      'http://localhost:3000',      // Alternative local dev
      'http://127.0.0.1:5173',      // Local development (127.0.0.1)
      'https://quicklink-vert.vercel.app', // Vercel production
      process.env.CLIENT_URL,       // Environment variable override
    ];
    // ... origin validation logic
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
```
- Accepts requests from **localhost:5173** (development)
- Accepts requests from **Vercel production URL** (production)
- Allows Authorization header for JWT authentication
- Includes all necessary HTTP methods

### BASE_URL Configuration (urlController.js)
```javascript
shortUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/${shortUrl.short_code}`
```
- Uses `process.env.BASE_URL` from environment variables
- Falls back to localhost for development
- In production, should be set to `https://quicklink-2v4z.onrender.com`

### Render Dashboard Setup
1. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgresql://user:password@host:port/database
   JWT_SECRET=your-strong-random-secret-32-chars-minimum
   BASE_URL=https://quicklink-2v4z.onrender.com
   CLIENT_URL=https://quicklink-vert.vercel.app
   ```

2. **Build & Start Commands**:
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Deploy**:
   - Push to GitHub
   - Render auto-redeploys on push
   - Service is available at your Render URL

---

## API Call Architecture

### Frontend Context Files (No Changes Needed - Already Configured)

**AuthContext.jsx**:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

**UrlContext.jsx**:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

All API calls automatically use the correct URL:
- **Development**: `http://localhost:3001/api` (from env file or fallback)
- **Production**: `https://quicklink-2v4z.onrender.com/api` (from `.env.production` or deployed env)

---

## Workflow Summary

### Local Development
```bash
# Backend listens on http://localhost:3001
# Frontend dev server on http://localhost:5173
# Frontend uses API_URL from .env or fallback to localhost:3001/api
npm run dev:backend
npm run dev:frontend
```

### Production Deployment
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "fix: configure frontend and backend for production on Vercel and Render"
   git push origin main
   ```

2. **Render auto-redeploys**:
   - Backend redeploys with new CORS configuration
   - Uses environment variables from Render dashboard

3. **Vercel auto-deploys**:
   - Frontend builds with `.env.production`
   - Uses VITE_API_URL from Vercel dashboard or .env.production
   - Deployed at Vercel URL

### Result
- Frontend calls backend at `https://quicklink-2v4z.onrender.com/api`
- Short URLs redirect from `https://quicklink-vert.vercel.app/[shortcode]` → backend at Render
- React Router works without 404s on page refresh
- Full authentication flow works across origins

---

## Environment Variables Reference

### Render Backend (.env or Dashboard)
| Variable | Example | Required |
|----------|---------|----------|
| `NODE_ENV` | `production` | Yes |
| `PORT` | `3000` | Let Render assign |
| `DATABASE_URL` | `postgresql://...` | Yes |
| `JWT_SECRET` | `random-32-char-secret` | Yes |
| `BASE_URL` | `https://quicklink-2v4z.onrender.com` | Yes |
| `CLIENT_URL` | `https://quicklink-vert.vercel.app` | Yes (for CORS) |

### Vercel Frontend (.env or Dashboard)
| Variable | Example | Required |
|----------|---------|----------|
| `VITE_API_URL` | `https://quicklink-2v4z.onrender.com/api` | Yes |

---

## Testing After Deployment

### Test Backend
```bash
curl https://quicklink-2v4z.onrender.com/health
# Response: {"status":"OK"}
```

### Test Frontend
- Visit `https://quicklink-vert.vercel.app`
- Should load without CORS errors
- Check DevTools Console - no errors

### Test Authentication
1. Sign up with new account
2. Logout
3. Log in
4. Should stay authenticated

### Test URL Shortening
1. Create a short URL from dashboard
2. Copy the short URL
3. Visit it directly - should redirect to original URL
4. Check network tab - request goes to `https://quicklink-2v4z.onrender.com`

### Test React Router
- Navigate to different pages on frontend
- Refresh page - should not show 404
- Browser back/forward should work

---

## Troubleshooting

### Issue: Frontend shows CORS errors
**Check**:
- Vercel URL is added to backend `CLIENT_URL` environment variable
- Backend has Vercel URL in `allowedOrigins` array
- CORS methods include GET, POST, PUT, DELETE

### Issue: Frontend can't reach API
**Check**:
- `VITE_API_URL` is set correctly in Vercel environment
- Backend URL is accessible (visit `/health` endpoint)
- Network requests go to correct backend URL

### Issue: Short URLs don't redirect
**Check**:
- `BASE_URL` is set to `https://quicklink-2v4z.onrender.com` in Render
- Vercel rewrites are working (check vercel.json)
- Backend `/health` returns OK

### Issue: Page refresh shows 404
**Check**:
- `vercel.json` is in frontend root directory
- Rewrites rule redirects all routes to `/index.html`
- Build includes `vercel.json` file

---

## Important Notes

1. **Vercel URL Change**: Once you deploy to Vercel, you'll get an auto-generated URL. Update:
   - Backend `CLIENT_URL` environment variable in Render dashboard
   - CORS `allowedOrigins` in backend server.js if needed
   - Redeploy backend after updating

2. **Custom Domains**: You can add custom domains to both Vercel and Render after initial deployment

3. **Monitoring**: 
   - Render: Check logs in dashboard for backend errors
   - Vercel: Check deployment logs for build errors

4. **Database**: Ensure PostgreSQL is accessible from Render
   - If using Neon (Vercel's recommendation), adjust `DATABASE_URL`
   - Test connection from Render dashboard logs
