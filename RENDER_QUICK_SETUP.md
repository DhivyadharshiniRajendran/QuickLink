# Render Dashboard Configuration Quick Reference

## Backend Service (Web Service)

### Service Settings
```
Name: quicklink-backend
Environment: Node
Region: Choose your region
Branch: main
Root Directory: (leave blank)
Build Command: npm install
Start Command: npm start
```

### Environment Variables
```
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secure-random-string-at-least-32-chars
BASE_URL=https://quicklink-backend.onrender.com
CLIENT_URL=https://quicklink-frontend.onrender.com
```

**Actions:**
1. Create Web Service
2. Wait for deployment (Logs will show "Server running on port 3000")
3. Copy your backend URL

---

## Frontend Service (Static Site)

### Service Settings
```
Name: quicklink-frontend
Branch: main
Build Command: npm install && npm run build --workspace=frontend
Publish Directory: frontend/dist
```

### Environment Variables
```
VITE_API_URL=https://quicklink-backend.onrender.com/api
```

**Actions:**
1. Create Static Site
2. Wait for build to complete
3. Copy your frontend URL

---

## After Both Are Deployed

### Update Backend Environment Variables
Return to backend Web Service settings and update:
```
BASE_URL=https://[your-backend-url].onrender.com
CLIENT_URL=https://[your-frontend-url].onrender.com
```

Then click **"Manual Deploy"** to apply changes.

---

## Testing After Deployment

### Test Backend
```bash
curl https://your-backend-url.onrender.com/health
# Expected: {"status":"OK"}
```

### Test Frontend
Visit `https://your-frontend-url.onrender.com` in browser
- Should load without errors
- Check DevTools Console for any errors
- Try signup → login → create short URL

### Test Short URL Redirect
Visit `https://your-frontend-url.onrender.com/[shortcode]`
- Should redirect to original URL
- Check backend logs if it fails

---

## Important Notes

1. **Don't hardcode URLs** - Use environment variables
2. **PostgreSQL Database** - Use Railway.app or Render Postgres service
3. **First Request Delay** - Free tier may take 30s to wake up
4. **API Requests** - Frontend must use `VITE_API_URL` from env variables
5. **CORS** - Backend already configured to accept frontend domain via `CLIENT_URL`

---

## Generate Strong JWT_SECRET

Use any of these methods:

### Method 1: Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Method 2: OpenSSL
```bash
openssl rand -hex 32
```

### Method 3: Online Generator
Use https://node-uuid.com/ or similar random string generator (min 32 chars)

---

## Logs and Debugging

### Backend Logs
- Render Dashboard → Service → Logs
- Look for "Server running on port" message
- Database connection errors will appear here

### Frontend Build Logs
- Render Dashboard → Service → Logs
- Look for "Build finished" message
- Frontend errors are usually in browser DevTools Console
