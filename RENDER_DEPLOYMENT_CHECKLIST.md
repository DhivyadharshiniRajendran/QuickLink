# Render Deployment Checklist & Configuration Summary

## ✅ What Was Already Fixed

### Root package.json
```json
"start": "npm start --workspace=backend"
```
- ✅ Added - Now Render can call `npm start` which routes to backend

### Backend package.json
```json
"start": "node src/server.js"
```
- ✅ Already configured correctly

### Backend server.js
```javascript
const PORT = process.env.PORT || 3001;
```
- ✅ Already listening on `process.env.PORT` (Render assigns port dynamically)
- ✅ CORS configured for production to accept `CLIENT_URL` environment variable
- ✅ All routes properly configured with correct priority

### Monorepo Structure
```json
"workspaces": ["frontend", "backend"]
```
- ✅ Already configured in root package.json

---

## 🚀 Your Action Items on Render Dashboard

### Step 1: Deploy Backend

**Create New Web Service:**
1. Click "New +" → "Web Service"
2. Connect GitHub repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: (leave blank for monorepo)

**Add Environment Variables:**
| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DATABASE_URL` | Your PostgreSQL connection string |
| `JWT_SECRET` | Generate strong secret (32+ chars) |
| `BASE_URL` | `https://[backend-url].onrender.com` |
| `CLIENT_URL` | `https://[frontend-url].onrender.com` |

4. Click "Create Web Service"
5. Wait for deployment - check Logs for "Server running on port 3000"
6. **Note your backend URL** (e.g., https://quicklink-backend.onrender.com)

### Step 2: Deploy Frontend

**Create New Static Site:**
1. Click "New +" → "Static Site"
2. Connect GitHub repository
3. Configure:
   - **Build Command**: `npm install && npm run build --workspace=frontend`
   - **Publish Directory**: `frontend/dist`

**Add Environment Variables:**
| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://[backend-url].onrender.com/api` |

4. Click "Create Static Site"
5. Wait for build and deployment
6. **Note your frontend URL** (e.g., https://quicklink-frontend.onrender.com)

### Step 3: Update Backend Environment Variables

Go back to Backend Web Service → Environment:

Update these to match deployed URLs:
```
BASE_URL=https://quicklink-backend.onrender.com
CLIENT_URL=https://quicklink-frontend.onrender.com
```

Then click **"Manual Deploy"** to redeploy with updated URLs.

---

## 🔍 Verification Tests

### Test 1: Backend Health Check
```bash
curl https://your-backend-url.onrender.com/health
```
Expected response: `{"status":"OK"}`

### Test 2: Frontend Loads
- Visit frontend URL in browser
- Should display login/signup page
- Check browser DevTools Console - no errors

### Test 3: End-to-End Flow
1. **Signup**: Create new account
2. **Login**: Login with credentials
3. **Short URL**: Paste a URL and create short code
4. **Redirect**: Visit short code URL, should redirect to original

### Test 4: API Communication
Open browser DevTools → Network tab:
- Requests should go to your backend URL (e.g., https://quicklink-backend.onrender.com/api/...)
- Status should be 200/201, not CORS errors

---

## 🐛 Common Issues & Fixes

### Issue: "Missing script: start"
**Status**: ✅ FIXED - Root package.json now has `"start"` script

### Issue: PORT is hardcoded
**Status**: ✅ FIXED - Backend uses `process.env.PORT || 3001`

### Issue: Cannot find module / Build fails
**Solution**: 
- Check build command includes `--workspace=frontend`
- Verify `frontend/dist` is published directory

### Issue: Frontend shows blank page / API errors
**Solution**:
1. Check `VITE_API_URL` is set in frontend environment
2. Verify backend URL is correct in frontend env
3. Check browser console for CORS errors
4. Confirm `CLIENT_URL` matches frontend URL in backend env

### Issue: CORS error in production
**Solution**:
- Backend CORS is configured to accept `process.env.CLIENT_URL`
- Make sure `CLIENT_URL` environment variable matches your frontend URL exactly

### Issue: Database connection fails
**Solution**:
- Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/database`
- Check database is running
- Verify firewall allows connections from Render

---

## 📋 Configuration Files Reference

### Root package.json (Updated)
```json
{
  "name": "quicklink",
  "version": "1.0.0",
  "scripts": {
    "start": "npm start --workspace=backend",
    "build": "npm run build --workspace=frontend",
    "dev:frontend": "npm run dev --workspace=frontend",
    "dev:backend": "npm run dev --workspace=backend"
  },
  "workspaces": ["frontend", "backend"]
}
```

### Backend package.json (Verified)
```json
{
  "name": "quicklink-backend",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.10.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  }
}
```

### Backend server.js (Verified)
```javascript
dotenv.config();
const PORT = process.env.PORT || 3001; // ✅ Uses env variable

// ✅ CORS configured for production (accepts CLIENT_URL from env)
const corsOptions = {
  origin: function (origin, callback) {
    if (process.env.NODE_ENV === 'development') {
      if (!origin || origin.includes('localhost')) {
        callback(null, true);
      }
    } else {
      if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
        callback(null, true);
      }
    }
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Always use Render Environment Variables
2. **Use strong JWT_SECRET** - Minimum 32 characters, use random generator
3. **Set NODE_ENV to production** - Enables optimization and security features
4. **Use HTTPS** - Render provides free SSL certificates
5. **Validate all inputs** - Backend already uses express-validator
6. **Hash passwords** - Backend already uses bcryptjs

---

## 📞 Support

If you encounter issues:

1. **Check Render Logs**
   - Backend: Dashboard → Service → "Logs" tab
   - Frontend: Dashboard → Service → "Logs" tab

2. **Common Log Messages**
   - `Server running on port 3000` = Success ✅
   - `Cannot find module` = Missing dependency
   - `ECONNREFUSED` = Database connection failed
   - `CORS policy violation` = Origin not allowed

3. **Debug Mode**
   - Add `DEBUG=*` to environment variables to enable verbose logging
   - Remove after debugging

---

## 🎉 Success Indicators

When deployment is complete, you should see:

✅ Backend shows "Live" status in Render dashboard  
✅ Frontend shows "Live" status in Render dashboard  
✅ Backend `/health` returns `{"status":"OK"}`  
✅ Frontend loads without console errors  
✅ Can signup/login with test account  
✅ Can create short URLs  
✅ Short URLs redirect correctly  
✅ No CORS errors in browser console  

---

## Next Steps After Deployment

1. Test all features thoroughly
2. Monitor logs for any errors
3. Set up regular database backups
4. Consider upgrading from free tier for production
5. Add custom domain if desired
6. Enable auto-redeploy on GitHub push (Render settings)

---

**You're all set! Your application is now ready to deploy to Render.** 🚀
