# Vercel & Render Dashboard Setup Quick Reference

## ✅ What Was Changed (Committed to GitHub)

### Frontend Changes
- ✅ Created `frontend/.env.production` with Render backend URL
- ✅ Created `frontend/vercel.json` with React Router rewrites
- ✅ API context files already configured to use `import.meta.env.VITE_API_URL`

### Backend Changes  
- ✅ Updated CORS configuration to accept:
  - `http://localhost:5173` (local development)
  - `https://quicklink-vert.vercel.app` (Vercel production)
  - Environment variable `CLIENT_URL` override
- ✅ Added Authorization header support
- ✅ Added GET, POST, PUT, DELETE method support

### Documentation
- ✅ Created `PRODUCTION_DEPLOYMENT_CONFIG.md` (comprehensive guide)
- ✅ Committed all changes to GitHub main branch

---

## 🚀 Render Dashboard - Backend Setup

### Service Details
- **Service Name**: `quicklink-backend` (or your choice)
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Environment Variables (MUST ADD)
| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required for production mode |
| `PORT` | `3000` | Render assigns dynamically, keep this |
| `DATABASE_URL` | `postgresql://user:pass@host:port/db` | Your PostgreSQL connection |
| `JWT_SECRET` | Generate strong 32+ char secret | Use: `openssl rand -hex 32` |
| `BASE_URL` | `https://quicklink-2v4z.onrender.com` | **Use your actual Render URL** |
| `CLIENT_URL` | Leave empty for now, update after Vercel deploy | Your Vercel frontend URL |

### After Initial Deploy
Once Vercel gives you a URL, update Render:
1. Go to Environment → `CLIENT_URL`
2. Set to your Vercel URL (e.g., `https://quicklink-vert.vercel.app`)
3. Click "Manual Deploy" to redeploy with new CORS settings

---

## 🚀 Vercel Dashboard - Frontend Setup

### Project Settings (One-time Setup)
1. Connect GitHub repository
2. Select `frontend` as root directory (or leave blank if using monorepo detection)
3. Build Command: `npm run build --workspace=frontend`
4. Output Directory: `frontend/dist`

### Environment Variables (MUST ADD)
| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://quicklink-2v4z.onrender.com/api` |

**Note**: The `/api` suffix is important - it's appended in context files

### Production Build
- Vercel auto-detects `.env.production` file
- Build uses `VITE_API_URL` from that file automatically
- Don't need to set in dashboard if using `.env.production`

### Get Your Vercel URL
After deployment completes:
1. Go to Deployment → Production
2. Copy the URL (e.g., `https://quicklink-vert.vercel.app`)
3. Update Render's `CLIENT_URL` environment variable with this URL
4. Redeploy Render backend

---

## 📋 Verification Checklist

### Render Backend
- [ ] Service is deployed and shows "Live"
- [ ] Environment variables are all set (especially `BASE_URL`)
- [ ] Logs show "Server running on port 3000"
- [ ] `/health` endpoint returns `{"status":"OK"}`

```bash
curl https://quicklink-2v4z.onrender.com/health
```

### Vercel Frontend
- [ ] Project is deployed and shows successful build
- [ ] Can access `https://quicklink-vert.vercel.app`
- [ ] Page loads without errors
- [ ] DevTools Console shows no CORS errors

### End-to-End
- [ ] Can sign up on Vercel site
- [ ] Can log in with created account
- [ ] Can create short URL → redirects correctly
- [ ] Page refresh doesn't show 404
- [ ] Network requests go to `quicklink-2v4z.onrender.com`

---

## 🔴 Common Issues & Fixes

### Issue: Frontend shows CORS error
**Solution**:
1. Go to Render → Backend Service → Environment
2. Check `CLIENT_URL` is set to your Vercel URL
3. Click "Manual Deploy"
4. Wait 2-3 minutes for redeploy
5. Refresh frontend

### Issue: "Cannot GET /" on page refresh
**Solution**:
1. Check `frontend/vercel.json` exists
2. Verify rewrite rule points to `/index.html`
3. Redeploy on Vercel (Manual Deploy)

### Issue: API requests show 404
**Solution**:
1. Check `VITE_API_URL` in Vercel environment matches Render backend URL
2. Verify Render `/health` endpoint works
3. Check network tab for actual request URL

### Issue: Short URLs don't redirect
**Solution**:
1. Render `BASE_URL` must be set to your Render URL
2. Check short code pattern matches (6 char alphanumeric)
3. Database connection must be working

### Issue: "Invalid token" after login
**Solution**:
1. Check `JWT_SECRET` is same on Render
2. Make sure you're not mixing `CLIENT_URL` between deployments
3. Use DevTools Application tab → Cookies/LocalStorage to check token

---

## 🎯 Next Steps

### Step 1: Deploy Backend on Render
1. Create Web Service on Render
2. Point to your GitHub repo
3. Set all environment variables
4. Deploy and note the URL (should be https://quicklink-2v4z.onrender.com)
5. Test `/health` endpoint

### Step 2: Deploy Frontend on Vercel (updated with new URL)
1. Create project on Vercel
2. Point to your GitHub repo
3. Set Frontend directory (or leave blank)
4. Deploy
5. Copy the provided URL

### Step 3: Update Render Backend
1. Go to Render Backend Service → Environment
2. Update `CLIENT_URL` to your Vercel URL
3. Click "Manual Deploy"
4. Wait for redeploy to complete

### Step 4: Test Everything
- Navigate frontend URLs
- Create accounts and authenticate
- Create short URLs and test redirects

---

## 📚 Additional Resources

- **Frontend Documentation**: See `PRODUCTION_DEPLOYMENT_CONFIG.md`
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **React Router on Vercel**: https://vercel.com/docs/frameworks/nextjs/rewrites

---

## 💡 Pro Tips

1. **Keep .env.production** - Vercel uses it automatically for production builds
2. **Monitor logs** - Both Render and Vercel provide logs for debugging
3. **Environment separation** - Different URLs for dev/staging/prod for better testing
4. **Backup DATABASE_URL** - Store your PostgreSQL connection string securely
5. **Track deployments** - GitHub commits auto-trigger deployments on both platforms

---

**Ready to deploy? Follow the "Next Steps" section above!** 🚀
