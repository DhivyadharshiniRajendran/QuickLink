# QuickLink Monorepo - Quick Reference

## 🎯 Folder Structure at a Glance

```
quicklink/
├── frontend/          ← React + Vite frontend
├── backend/           ← Node.js/Express API
├── MONOREPO.md        ← Read this for detailed guide
├── REFACTORING_SUMMARY.md ← What changed and why
└── README.md          ← Project overview
```

## 🚀 Get Started in 2 Minutes

```bash
# 1. Install both frontend and backend dependencies
npm install

# 2. Setup backend environment
cd backend
cp .env.example .env
# Edit .env with your database URL if using local DB
# (or leave as-is for Railway.app database)

# 3. Initialize database
npm run migrate

# 4. Start servers (in separate terminals)

# Terminal 1: Frontend
cd frontend && npm run dev
# → http://localhost:5173

# Terminal 2: Backend  
cd backend && npm run dev
# → http://localhost:3001

# 5. Create an account and test!
```

## 📂 Common Folder Locations

| Need to... | Go to... | File |
|-----------|---------|------|
| Add React component | `frontend/src/components/` | `.jsx` |
| Add page/route | `frontend/src/pages/` | `.jsx` |
| Add CSS styling | `frontend/src/styles/` | `.css` |
| Edit API endpoint | `backend/src/routes/` | `.js` |
| Add API handler | `backend/src/controllers/` | `.js` |
| Change database | `backend/src/migrations/init.js` | `.js` |
| Configure frontend | `frontend/.env` | `.env` |
| Configure backend | `backend/.env` | `.env` |

## 🔧 Development Commands

### From Frontend Folder
```bash
cd frontend
npm run dev      # Start dev server with HMR (http://localhost:5173)
npm run build    # Build for production (→ dist/)
npm run lint     # Check for code issues
```

### From Backend Folder
```bash
cd backend
npm run dev      # Start with auto-reload (http://localhost:3001)
npm run migrate  # Initialize database
npm start        # Run production server
```

### From Root
```bash
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run build            # Build frontend for production
npm run migrate          # Initialize backend database
```

## 🔐 Environment Variables

### Backend (.env) - Keep Secret! ⚠️
```env
# Copy from .env.example, fill in your values
DATABASE_URL=postgresql://...  # Your database
JWT_SECRET=your-secret-key     # Strong random string
PORT=3001                       # Backend port
CLIENT_URL=http://localhost:5173 # Frontend URL
```

### Frontend (.env) - Safe to Commit
```env
# Points to backend API
VITE_API_URL=http://localhost:3001/api
```

## 🔗 API Endpoints

All requests to backend require `Authorization: Bearer <token>` header (except signup/login)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/urls/create` | Create short URL |
| GET | `/api/urls/my-urls` | List user's URLs |
| DELETE | `/api/urls/:id` | Delete URL |
| GET | `/api/urls/:shortCode` | Redirect to original URL |

## 🧪 Testing Endpoints with Curl

```bash
# Signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","confirmPassword":"password123"}'

# Login (returns JWT token)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create short URL (requires token from login)
curl -X POST http://localhost:3001/api/urls/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"originalUrl":"https://github.com/facebook/react"}'
```

## 📦 Adding New Dependencies

```bash
# Add to frontend
cd frontend && npm install package-name

# Add to backend
cd backend && npm install package-name

# Add dev dependency
npm install --save-dev package-name
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5173 in use | Vite tries 5174, 5175... (auto) |
| Port 3001 in use | Change PORT in `backend/.env` |
| DB connection error | Check DATABASE_URL in `backend/.env` |
| Frontend can't reach API | Check VITE_API_URL in `frontend/.env` |
| Changes not showing | Restart server (nodemon auto-restarts backend) |
| Token errors | Clear localStorage token and login again |

## 📚 Documentation

- **MONOREPO.md** - Complete development guide
- **REFACTORING_SUMMARY.md** - What was refactored and why
- **frontend/README.md** - React app details
- **backend/README.md** - API reference
- **SETUP.md** - Installation from scratch

## 🎯 Typical Workflow

```
1. Start frontend:   cd frontend && npm run dev
2. Start backend:    cd backend && npm run dev
3. Open http://localhost:5173
4. Create account with email/password
5. Create short URLs
6. View analytics
7. Edit code → Auto-reloads
8. Commit changes:   git add frontend/ backend/ && git commit -m "..."
```

## ✅ Quick Checklist

- [ ] Both servers running (frontend + backend)
- [ ] Database initialized (`npm run migrate` in backend/)
- [ ] `.env` file created in backend/ from `.env.example`
- [ ] `.env` file created in frontend/ from `.env.example`
- [ ] Can sign up and login
- [ ] Can create short URLs
- [ ] Can view analytics

## 🚀 Production Deployment

**Frontend:**
```bash
cd frontend && npm run build
# Deploy frontend/dist/ to Vercel, Netlify, etc.
```

**Backend:**
```bash
# Set these environment variables on host:
export DATABASE_URL="production-database-url"
export JWT_SECRET="strong-production-secret"
npm start
# Deploy to Heroku, Railway, AWS, etc.
```

See [MONOREPO.md - Deployment](./MONOREPO.md#-deployment) for detailed instructions.

---

**Questions?** Check the detailed guides: **MONOREPO.md**, **REFACTORING_SUMMARY.md**, or README.md
