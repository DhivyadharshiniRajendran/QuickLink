# 404 Auth Routes Fix - Debugging Guide

## ✅ What Was Fixed

### Root Cause
The frontend `.env` was missing `/api` in the URL, causing mismatched paths:
- **Frontend was calling**: `https://quicklink-2v4z.onrender.com/auth/signup` (no `/api`)
- **Backend has routes at**: `/api/auth/signup`
- **Result**: 404 errors

### Changes Made

**1. Backend Logging (committed to GitHub)**
- ✅ Added request logging middleware to log all incoming requests
- ✅ Added route startup logging that lists all registered routes
- ✅ Render will auto-redeploy with new logging

**2. Frontend .env.example (committed to GitHub)**
- ✅ Updated to clarify that `/api` is REQUIRED in `VITE_API_URL`
- ✅ Added examples for both development and production

**3. Frontend .env (local only - not committed)**
- Update to include `/api`: `VITE_API_URL=https://quicklink-2v4z.onrender.com/api`

---

## 🔍 How to Verify the Fix

### Step 1: Check Render Logs
When the backend redeploys, you should see route logging:

```
========== REGISTERED ROUTES ==========
GET  /health
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me (protected)
POST /api/urls/create (protected)
GET  /api/urls/my-urls (protected)
DELETE /api/urls/:id (protected)
GET  /api/urls/details/:id (protected)
GET  /:shortCode (public redirect)
========================================
```

**How to view**:
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service
3. Click **Logs** tab
4. Look for the route listing above
5. Watch for request logs like: `POST /api/auth/signup`

### Step 2: Check Frontend .env

Your local frontend `.env` file should have:
```env
VITE_API_URL=https://quicklink-2v4z.onrender.com/api
```

Note the `/api` suffix - this is critical!

### Step 3: Test the Routes

After backend redeploys, try accessing:
```bash
# Test health check (should work)
curl https://quicklink-2v4z.onrender.com/health

# Test signup (should work now, not 404)
curl -X POST https://quicklink-2v4z.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","confirmPassword":"test123"}'

# Test login (should work now, not 404)
curl -X POST https://quicklink-2v4z.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Step 4: Test in Frontend

1. Visit your frontend at `https://quick-link-green.vercel.app`
2. Open DevTools → Network tab
3. Try signing up or logging in
4. Watch the network requests:
   - Should see request to `https://quicklink-2v4z.onrender.com/api/auth/signup`
   - Should see `POST 201` or `POST 200` response (not `404`)
   - Should NOT see CORS errors

---

## 🐛 Troubleshooting

### Issue: Still getting 404 on /auth/signup

**Check**:
1. Backend has redeployed (check Render logs for route listing)
2. Frontend `.env` has `/api` in URL
3. Network request shows correct full path: `https://quicklink-2v4z.onrender.com/api/auth/signup`

### Issue: Request logging not showing

**Why**: Render caches previous logs. Keep scrolling or refresh after redeploy.

**Fix**:
1. Go to Render service
2. Click "Manual Deploy" to force redeploy
3. Wait 2-3 minutes
4. Check logs again

### Issue: Production (Vercel) still broken

**Check**:
1. Vercel `.env.production` has `/api`: `VITE_API_URL=https://quicklink-2v4z.onrender.com/api`
2. File path: `frontend/.env.production`
3. Trigger rebuild: Go to Vercel → Deployments → Redeploy in Vercel dashboard

### Issue: Local development not working

**Check**:
1. Backend running on `http://localhost:3001`
2. Frontend `.env` file has: `VITE_API_URL=http://localhost:3001/api`
3. Both `/api` and `localhost:3001` are correct (case-sensitive)
4. Restart frontend dev server after changing `.env`

---

## 📋 API URL Reference

### Correct URLs (with /api)

**Development**:
```
VITE_API_URL=http://localhost:3001/api
# Frontend calls: http://localhost:3001/api/auth/signup
```

**Production (Vercel frontend + Render backend)**:
```
VITE_API_URL=https://quicklink-2v4z.onrender.com/api
# Frontend calls: https://quicklink-2v4z.onrender.com/api/auth/signup
```

### Common Mistakes (wrong - will return 404)

❌ `http://localhost:3001` (missing `/api`)
```
Would call: http://localhost:3001/auth/signup (404)
Should call: http://localhost:3001/api/auth/signup (200)
```

❌ `https://quicklink-2v4z.onrender.com` (missing `/api`)
```
Would call: https://quicklink-2v4z.onrender.com/auth/signup (404)
Should call: https://quicklink-2v4z.onrender.com/api/auth/signup (200)
```

---

## 📚 Backend Route Structure

All auth routes are prefixed with `/api/auth`:

| Endpoint | Type | Path |
|----------|------|------|
| Sign up | POST | `/api/auth/signup` |
| Login | POST | `/api/auth/login` |
| Get user | GET | `/api/auth/me` |

All URL routes are prefixed with `/api/urls`:

| Endpoint | Type | Path |
|----------|------|------|
| Create short URL | POST | `/api/urls/create` |
| Get user URLs | GET | `/api/urls/my-urls` |
| Get URL details | GET | `/api/urls/details/:id` |
| Delete URL | DELETE | `/api/urls/:id` |

---

## ✨ What Backend Logging Will Show

When a request comes in, Render logs will show:
```
[2026-03-21T10:30:45.123Z] POST /api/auth/signup
[2026-03-21T10:30:45.456Z] GET /api/auth/me
[2026-03-21T10:30:45.789Z] POST /api/urls/create
```

This helps you verify:
1. Frontend is sending requests to the right path
2. Backend is receiving the requests
3. No route mismatches

---

## 🚀 Next Steps

1. **Update local `.env`**:
   ```bash
   # Your file: frontend/.env
   VITE_API_URL=https://quicklink-2v4z.onrender.com/api
   ```

2. **Monitor Render Logs** for redeploy completion

3. **Test signup/login** in frontend

4. **Check Network tab** for successful API calls

5. If still having issues:
   - Restart frontend dev server
   - Clear browser cache (Cmd+Shift+Delete)
   - Check both Render and Vercel logs

---

## 📞 Quick Support

If you're still seeing 404s after these changes:

1. Share the full error message from browser console
2. Share the Network tab request URL
3. Check Render logs for request logging
4. Verify `.env` file has `/api` suffix

Everything should be working now! 🎉
