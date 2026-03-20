# QuickLink - Full Stack URL Shortener

A modern, full-stack URL shortening application with user authentication, analytics, and a beautiful responsive UI.

**Project Status**: ✅ Complete Authentication system, URL shortening, analytics dashboard, and monorepo structure

## 🚀 Quick Start

```bash
# 1. Install dependencies for both frontend and backend
npm install

# 2. Configure environment (in backend folder)
cd backend
cp .env.example .env
# Edit .env with your database credentials

# 3. Initialize database
npm run migrate

# 4. Start development servers (in separate terminals)
# Terminal 1:
cd frontend && npm run dev          # http://localhost:5173

# Terminal 2:
cd backend && npm run dev           # http://localhost:3001
```

Visit `http://localhost:5173` and create an account to test!

---

## 📁 Project Structure (Monorepo)

This is a **monorepo** with separated frontend and backend:

```
quicklink/
├── frontend/              # React + Vite frontend application
│   ├── src/             # React components, pages, styles
│   ├── .env             # Frontend configuration (VITE_API_URL)
│   └── package.json     # Frontend dependencies
│
├── backend/             # Node.js/Express API server
│   ├── src/             # Controllers, routes, middleware, database
│   ├── .env             # Backend secrets (DATABASE_URL, JWT_SECRET)
│   └── package.json     # Backend dependencies
│
├── MONOREPO.md          # Detailed monorepo guide
└── README.md            # This file
```

**For detailed setup instructions**, see [MONOREPO.md](./MONOREPO.md)

---

## ✨ Features

### 🔐 User Authentication
- Secure signup/login with JWT tokens
- Password hashing with bcryptjs (10 salt rounds)
- Session persistence with localStorage
- Protected routes requiring authentication
- 7-day token expiration

### 🔗 URL Shortening
- Convert long URLs to memorable 6-character codes
- Copy-to-clipboard functionality
- View all shortened URLs in dashboard
- Delete URLs individually

### 📊 Analytics Dashboard
- Total clicks across all shortened URLs
- Per-URL click tracking
- Recent visits timeline
- Real-time statistics
- Export analytics (planned)

### 🎨 Beautiful UI
- Responsive design (mobile-first)
- Gradient backgrounds and modern styling
- Loading spinners and success notifications
- Form validation with inline errors
- Dark mode ready (CSS variables)

---

## 🛠 Tech Stack

### Frontend
- **React 19.2.4** - UI library with hooks
- **React Router 7.13.1** - Client-side routing
- **Vite 8.0.1** - Lightning-fast build tool
- **CSS3** - Responsive styling (no external CSS framework)

### Backend
- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing

---

## 📚 Documentation

### User Documentation
- [Frontend README](./frontend/README.md) - React app features and usage
- [Backend README](./backend/README.md) - API reference and architecture
- [Monorepo Guide](./MONOREPO.md) - Development workflow and deployment
- [Setup Guide](./SETUP.md) - Step-by-step installation

### API Documentation
See [Backend README - API Endpoints](./backend/README.md#api-endpoints) for complete API reference

---

## 🔐 Security

✅ **Implemented**:
- Passwords hashed with bcryptjs (10 rounds salt)
- JWT tokens expire after 7 days
- Protected API endpoints with middleware
- SQL injection prevention (parameterized queries)
- CORS configured for frontend-only access
- User data isolation (users only see their own URLs)
- Environment variables for secrets (not in code)
- `.env` files in `.gitignore` (never committed)

---

## 🚀 Development

### Starting Development Servers

**Frontend Development** (with HMR):
```bash
cd frontend
npm run dev
# http://localhost:5173 - auto-reloads on save
```

**Backend Development** (with nodemon):
```bash
cd backend
npm run dev
# http://localhost:3001 - auto-restarts on save
```

### Environment Configuration

**Backend (.env)** - Sensitive values:
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=3001
```

**Frontend (.env.local)** - API configuration:
```env
VITE_API_URL=http://localhost:3001/api
```

See `.env.example` files for full templates.

---

## 📊 Database Schema

### users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### short_urls
```sql
CREATE TABLE short_urls (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  short_code VARCHAR(6) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### visits
```sql
CREATE TABLE visits (
  id SERIAL PRIMARY KEY,
  short_url_id INTEGER NOT NULL REFERENCES short_urls(id) ON DELETE CASCADE,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);
```

Automatically created on first backend startup with `npm run migrate`.

---

## 🧪 Testing

### Test User Authentication
1. Go to http://localhost:5173
2. Click "Create Account"
3. Sign up with email/password
4. Create a shortened URL
5. Copy and share the link
6. Analytics should show clicks when accessed

### Test API Endpoints

```bash
# Sign up
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","confirmPassword":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user (requires token)
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🚢 Deployment

### Frontend Deployment

```bash
cd frontend
npm run build
# Creates optimized build in frontend/dist/

# Deploy to Vercel, Netlify, GitHub Pages, or any static host
```

### Backend Deployment

```bash
# Deploy to Heroku, Railway, AWS, or any Node.js host
# Set environment variables on host:
export DATABASE_URL="production-postgresql-url"
export JWT_SECRET="strong-production-secret"
export CLIENT_URL="https://yourdomain.com"

npm start
```

**See [MONOREPO.md - Deployment](./MONOREPO.md#-deployment) for detailed instructions**

---

## 📦 Project File Structure

Complete project organization:

```
quicklink/
├── frontend/
│   ├── src/
│   │   ├── pages/           # Login, Signup, Dashboard, Analytics
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # AuthContext, UrlContext
│   │   ├── styles/          # CSS files
│   │   ├── utils/           # Helper functions
│   │   ├── App.jsx          # Main router
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   ├── .env.example         # Template
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/
│   ├── src/
│   │   ├── server.js        # Express app
│   │   ├── config/          # Database config
│   │   ├── controllers/     # Route handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth middleware
│   │   ├── utils/           # Helpers
│   │   └── migrations/      # Database setup
│   ├── .env.example         # Template
│   └── package.json
│
├── MONOREPO.md              # Monorepo guide
├── SETUP.md                 # Installation guide
└── README.md                # This file
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/awesome-feature`
3. Make changes in `frontend/` or `backend/` folder
4. Test thoroughly
5. Commit with clear messages
6. Push and create a pull request

---

## 🐛 Troubleshooting

**Frontend can't connect to backend?**
- Check backend is running on `http://localhost:3001`
- Verify `VITE_API_URL` in `frontend/.env`
- Check browser console for CORS errors

**Database connection failed?**
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `backend/.env`
- Verify database exists and credentials are correct

**Port already in use?**
- Change `PORT` in `backend/.env` to `3002` (or another free port)
- Change Vite port in `frontend/vite.config.js`

**Token/auth issues?**
- Clear localStorage: Open DevTools → Application → Local Storage → Delete `token`
- Log in again with valid credentials
- Check JWT_SECRET hasn't changed

---

## 📄 License

MIT

---

## 🎯 Next Steps

1. **Deploy to production** - Use [MONOREPO.md - Deployment](./MONOREPO.md#-deployment)
2. **Add features** - See [Contributing Section](#-contributing)
3. **Customize styling** - Edit CSS in `frontend/src/styles/`
4. **Extend API** - Add new endpoints in `backend/src/routes/`

**Built with ❤️ using React, Node.js, Express, and PostgreSQL**


