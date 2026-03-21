# Render Deployment Guide

## Overview
This guide covers deploying the QuickLink URL shortener to Render. The application uses a monorepo structure with separate frontend (React/Vite) and backend (Express) folders.

## Prerequisites
- Render account (https://render.com)
- GitHub repository pushed with your code
- PostgreSQL database (Railway.app or Render PostgreSQL)

---

## Step 1: Deploy Backend (Express Server)

### 1.1 Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Fill in the service details:
   - **Name**: `quicklink-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your deployment branch)
   - **Build Command**: `npm install && npm run build` (if needed, or leave as `npm install`)
   - **Start Command**: `npm start`

### 1.2 Configure Root Directory (Important!)

Since you're using a monorepo:
- **Root Directory**: Leave blank (Render will use repository root)
- The `start` script in root `package.json` will automatically route to backend via workspaces

### 1.3 Add Environment Variables

Click **"Environment"** and add these variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `PORT` | `3000` | Render assigns port dynamically; express uses `process.env.PORT` |
| `NODE_ENV` | `production` | Sets production mode |
| `DATABASE_URL` | `postgresql://user:password@host:port/dbname` | Your PostgreSQL connection string |
| `JWT_SECRET` | `your-secure-random-string-here` | Use a strong, random 32+ char string |
| `BASE_URL` | `https://your-backend-domain.onrender.com` | Your deployed backend URL (will be auto-assigned) |
| `CLIENT_URL` | `https://your-frontend-domain.onrender.com` | Your deployed frontend URL (deploy frontend first) |

⚠️ **Security Note**: Never commit `.env` files. Always use Render's Environment section.

### 1.4 Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Wait for deployment to complete (usually 2-5 minutes)
4. Note your backend URL (e.g., `https://quicklink-backend.onrender.com`)

---

## Step 2: Deploy Frontend (React/Vite)

### 2.1 Create a New Static Site on Render

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Fill in the service details:
   - **Name**: `quicklink-frontend` (or your preferred name)
   - **Branch**: `main` (or your deployment branch)
   - **Build Command**: `npm install && npm run build --workspace=frontend`
   - **Publish Directory**: `frontend/dist`

### 2.2 Deploy

1. Click **"Create Static Site"**
2. Wait for build and deployment to complete
3. Note your frontend URL (e.g., `https://quicklink-frontend.onrender.com`)

---

## Step 3: Update Backend Environment Variables

Return to your **Backend Web Service** and update these variables:

| Variable | Update To |
|----------|-----------|
| `BASE_URL` | `https://your-backend-domain.onrender.com` |
| `CLIENT_URL` | `https://your-frontend-domain.onrender.com` |

**Manual Redeploy After Changes:**
1. Go to your backend service
2. Click **"Manual Deploy"** 
3. Choose **"Deploy latest commit"**

---

## Step 4: Update Frontend API Configuration

### 4.1 Add Frontend Environment Variables

For the frontend Static Site, add environment variable:

1. Go to your **Frontend Static Site** settings
2. Click **"Environment"**
3. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-domain.onrender.com/api`

**Note**: Vite requires `VITE_` prefix for frontend env vars to be exposed to the browser.

### 4.2 Redeploy Frontend

After updating the API URL:
1. Click **"Manual Deploy"**
2. Choose **"Deploy latest commit"**

---

## Verification Checklist

- [ ] Backend service is deployed and shows "Live"
- [ ] Frontend service is deployed and shows "Live"
- [ ] Backend `/health` endpoint responds: `GET https://your-backend.onrender.com/health` → `{"status":"OK"}`
- [ ] Frontend loads without "Cannot find module" errors
- [ ] Frontend can reach backend API (no CORS errors in browser console)
- [ ] User signup/login works
- [ ] URL shortening creates new short URLs
- [ ] Short URL redirect works: `GET https://your-frontend.onrender.com/[shortcode]`

---

## Troubleshooting

### Issue: "Missing script: start" Error

**Solution**: 
- ✅ Root `package.json` has `"start": "npm start --workspace=backend"`
- ✅ Backend `package.json` has `"start": "node src/server.js"`
- Redeploy if you just added these scripts

### Issue: Backend 503 Service Unavailable

**Possible causes**:
- Database connection failed - check `DATABASE_URL` is correct
- Start command didn't run - check logs in Render dashboard
- Port binding issue - ensure express listens on `process.env.PORT`

**Debug**: Click service → **"Logs"** tab to see error messages

### Issue: Frontend Shows Blank Page or API Errors

**Possible causes**:
- `VITE_API_URL` not set or incorrect
- Backend `CLIENT_URL` doesn't match frontend domain
- CORS error - check backend logs

**Debug**: 
1. Open browser DevTools → Console
2. Look for CORS errors or fetch failures
3. Check that API requests go to correct backend URL

### Issue: Database Connection Fails

**Check**:
- `DATABASE_URL` format is correct: `postgresql://user:pass@host:port/db`
- Database server is running (if using Railway.app)
- Whitelist Render IPs in database firewall settings

### Issue: Stuck on "Building..."

- Render is installing dependencies - first build takes longer
- Check **"Logs"** tab for progress
- If stuck >15 minutes, redeploy with **"Manual Deploy"**

---

## Package.json Reference

### Root package.json
```json
{
  "scripts": {
    "start": "npm start --workspace=backend",
    "build": "npm run build --workspace=frontend",
    "dev:frontend": "npm run dev --workspace=frontend",
    "dev:backend": "npm run dev --workspace=backend"
  },
  "workspaces": ["frontend", "backend"]
}
```

### Backend package.json
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

### Frontend package.json
```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite"
  }
}
```

---

## Production Considerations

1. **Database Backups**: Set up regular backups for PostgreSQL
2. **SSL/TLS**: Render provides free SSL certificates automatically
3. **Monitoring**: Check Render dashboard logs regularly
4. **Rate Limiting**: Consider adding rate limiting to API endpoints
5. **Analytics**: Monitor short URL creation and redirect traffic

---

## Free Tier Limits on Render

- Static Site: Always free
- Web Service: Free tier spins down after 15 minutes of inactivity (first request takes ~30s to wake up)
- PostgreSQL: Free tier has storage/compute limits

For production, consider upgrading to paid plans.

---

## Need Help?

- [Render Documentation](https://render.com/docs)
- [Render Community](https://render.com/community)
- Check backend logs: Render Dashboard → Service → Logs
