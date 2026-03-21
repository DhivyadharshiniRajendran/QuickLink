# Render Environment Variables - Quick Setup Guide

## Critical Configuration for Short URLs to Work

Short URLs **WILL NOT WORK** unless `BASE_URL` is set correctly in Render!

---

## Step-by-Step: Set Environment Variables in Render

### 1. Go to Render Dashboard
- Navigate to your backend service (e.g., "quicklink-backend")
- Click the service name to open it

### 2. Click "Environment" Tab
- Should be at the top of the service page

### 3. Add These Environment Variables

Copy-paste these and replace with your actual values:

```
BASE_URL=https://quicklink-2v4z.onrender.com
NODE_ENV=production
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your-secret-key-here
PORT=3001
```

### 4. Update These Values:

- **BASE_URL**: Replace `quicklink-2v4z` with your actual Render service subdomain
  - Find it at: yourdomain.onrender.com
  - Example: If your URL is `https://my-quicklink.onrender.com`, use that
  - ⚠️ Must use `https://`, not `http://`
  - ⚠️ Must NOT include `/api` at the end

- **DATABASE_URL**: Your Railway/PostgreSQL connection string (already set)

- **JWT_SECRET**: Your authentication secret (already set)

- **NODE_ENV**: Set to `production`

- **PORT**: Usually 3001 (Render assigns it, but Render will use its own port)

### 5. Click "Save Changes"

### 6. Render will automatically redeploy your backend

---

## Example Configuration

**If your backend URL is:** `https://quicklink-2v4z.onrender.com`

**Then your environment variables should be:**

```
BASE_URL=https://quicklink-2v4z.onrender.com
NODE_ENV=production
DATABASE_URL=postgresql://postgres:ClCcXToTEycOOGOQmPXBxLmAbChrhWVR@ballast.proxy.rlwy.net:22315/railway
JWT_SECRET=b671eb4230468083ccd93202600077a4a7661023ecd449e28720693172c02e73
PORT=3001
```

---

## Verify It Works

### Check Backend Startup Logs

1. In Render, scroll down to "Logs"
2. Look for this message on startup:

```
========== DEPLOYMENT VALIDATION ==========
Environment: production
Port: 3001
BASE_URL: https://quicklink-2v4z.onrender.com

✓ Production BASE_URL configured: https://quicklink-2v4z.onrender.com
   Short URLs will be: https://quicklink-2v4z.onrender.com/{shortCode}
```

### Test Short URL

1. Create a new short URL in your app
2. Click the short URL
3. It should redirect to the original URL
4. In backend logs, you should see:

```
✅ SHORT URL REDIRECT HANDLER MATCHED
   Pattern matched: /abc123 (6 alphanumeric characters)
   Calling redirectToUrl controller...
```

---

## If It Still Doesn't Work

### 1. Check if BASE_URL was updated
- In Render logs, look for startup messages
- Should show your BASE_URL value

### 2. Check if Render redeployed
- After changing env vars, Render auto-redeploys
- Wait ~1-2 minutes for deployment to complete
- Look for deployment completion in logs

### 3. Clear browser cache
- Cmd+Shift+Delete (Windows/Linux)
- Cmd+Shift+Delete (Mac)
- Clear cached images and files

### 4. Check database
```sql
-- Connect to your database and run:
SELECT short_code, original_url FROM short_urls LIMIT 1;

-- The original_url should just be the destination URL, e.g.:
-- https://example.com/some-page

-- The short URL shown to users should be:
-- https://quicklink-2v4z.onrender.com/abc123
```

### 5. Manual test with curl
```bash
# Replace abc123 with an actual short code from your database
curl -I https://quicklink-2v4z.onrender.com/abc123

# You should see:
# HTTP/1.1 301 Moved Permanently
# Location: https://original-destination-url.com/page
```

If you see 404 or 200 with HTML, the redirect handler isn't working.

---

## Frontend Configuration (Vercel or elsewhere)

Your frontend also needs to point to the correct backend.

**Set this environment variable in Vercel:**

```
VITE_API_URL=https://quicklink-2v4z.onrender.com/api
```

NOT:
```
VITE_API_URL=https://your-vercel-frontend.vercel.app/api  ❌ WRONG!
```

The frontend makes API calls to the **backend**, not to itself!

---

## Common Issues & Fixes

### Issue: BASE_URL=http://localhost:3001
**Problem:** This is development mode, won't work in production
**Fix:** Set to your Render URL

### Issue: BASE_URL=https://quicklink-2v4z.onrender.com/api
**Problem:** The `/api` part is wrong, short URLs would be `/api/abc123`
**Fix:** Remove the `/api`, it should just be the domain

### Issue: BASE_URL=https://my-frontend.vercel.app
**Problem:** Points to frontend, which doesn't have redirect handler
**Fix:** Sho point to Render backend URL

### Issue: BASE_URL not set at all
**Problem:** Defaults to localhost, links don't work
**Fix:** Set BASE_URL in Render environment variables

---

## Summary

🎯 **What to do:**
1. Find your Render backend service
2. Go to "Environment" tab
3. Set: `BASE_URL=https://your-render-url.onrender.com`
4. Save and wait for redeploy
5. Test short URL redirects
6. Verify in logs

✅ **Result:**
- Short URLs will redirect correctly
- Uses 301 permanent redirects
- Works on mobile devices
- Tracks analytics on each click

---

## Questions?

If Render environment variables aren't visible:
1. Make sure you're in the right service (backend, not frontend)
2. Make sure you're authenticated
3. Try refreshing the page
4. Try a different browser

If changes aren't taking effect:
1. Check deployment status (should completion message)
2. Wait 2-3 minutes for redeployment
3. Clear browser cache
4. Try a fresh browser window/incognito mode
