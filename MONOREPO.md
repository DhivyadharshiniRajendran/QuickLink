# QuickLink Monorepo Structure

This project uses a **monorepo** structure with separate folders for frontend and backend, making it easy to manage dependencies and deployment for each application independently.

## 📂 Project Structure

```
quicklink/
├── frontend/                 # React Vite Application
│   ├── src/                 # React source code
│   │   ├── pages/          # Page components (Login, Signup, Dashboard, etc.)
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context API (AuthContext, UrlContext)
│   │   ├── styles/         # CSS stylesheets
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static assets
│   ├── .env                # Frontend environment variables
│   ├── .env.example        # Template for .env
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite build configuration
│   ├── eslint.config.js    # ESLint configuration
│   ├── index.html          # HTML entry point
│   └── README.md           # Frontend documentation
│
├── backend/                # Node.js/Express API Server
│   ├── src/
│   │   ├── server.js       # Express entry point
│   │   ├── config/         # Configuration (database)
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Express middleware (auth)
│   │   ├── models/         # Database models
│   │   ├── utils/          # Helper functions
│   │   └── migrations/     # Database initialization
│   ├── .env                # Backend environment variables (DO NOT COMMIT)
│   ├── .env.example        # Template for .env
│   ├── package.json        # Backend dependencies
│   ├── README.md           # Backend documentation
│   └── .gitignore          # Git ignore rules
│
├── package.json            # Root monorepo configuration
├── .gitignore              # Root gitignore
├── README.md               # Root project documentation
└── MONOREPO.md            # This file - Monorepo guide
```

## 🎯 Why Monorepo?

- **Unified version control** - Frontend and backend in single repository
- **Atomic commits** - Keep frontend/backend changes together
- **Shared workflows** - One CI/CD pipeline for entire project
- **Clear separation** - Each application in dedicated folder
- **Parallel development** - Frontend and backend teams work independently
- **Easier deployment** - Deploy each app separately as needed

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (comes with npm)
- PostgreSQL database

### 1. Install Dependencies

```bash
# Root installation (installs frontend and backend dependencies)
npm install

# Or manually in each folder:
cd frontend && npm install
cd ../backend && npm install
```

### 2. Configure Environment Variables

**Backend Setup:**
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

**Frontend Setup:**
```bash
cd frontend
cp .env.example .env.local
# Usually works as-is, but adjust VITE_API_URL if backend is on different port
```

### 3. Initialize Database

```bash
cd backend
npm run migrate
# Creates users, short_urls, and visits tables
```

### 4. Start Development Servers

**Option A: Terminal 1 for each server**
```bash
# Terminal 1: Frontend
cd frontend
npm run dev
# http://localhost:5173

# Terminal 2: Backend
cd backend
npm run dev
# http://localhost:3001
```

**Option B: From root with workspaces**
```bash
# If your npm version supports workspaces
npm run dev:frontend
npm run dev:backend
```

## 🔐 Environment Variables

### Backend (.env)

Located in `backend/.env` - **NEVER commit this file**

| Variable | Example | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://user:pass@localhost/quicklink` | PostgreSQL connection string |
| `JWT_SECRET` | `random-secret-key` | Secret for signing JWT tokens |
| `PORT` | `3001` | Backend server port |
| `NODE_ENV` | `development` | Environment mode |
| `BASE_URL` | `http://localhost:3001` | Base URL for short links |
| `CLIENT_URL` | `http://localhost:5173` | Frontend URL for CORS |

**Getting started:**
```bash
cp backend/.env.example backend/.env
# Edit with your values
```

### Frontend (.env)

Located in `frontend/.env` - Safe to commit `.env.example`

| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3001/api` | Backend API endpoint |

**Getting started:**
```bash
cp frontend/.env.example frontend/.env
```

## 📝 Available Scripts

### Frontend Scripts (from `frontend/` folder)
```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Scripts (from `backend/` folder)
```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
npm run migrate  # Initialize database schema
```

### Root Scripts (from root directory)
```bash
npm run dev:frontend    # Start frontend only
npm run dev:backend     # Start backend only
npm run build           # Build frontend for production
npm run migrate         # Initialize backend database
npm run lint            # Lint frontend code
```

## 🔄 Development Workflow

### Making Changes

1. **Frontend changes**: Edit files in `frontend/src/`
   - Changes auto-reload via Vite HMR
   - No backend restart needed

2. **Backend changes**: Edit files in `backend/src/`
   - Changes auto-reload via nodemon
   - Frontend will need to retry API calls

3. **Database changes**: Update schema in `backend/src/migrations/init.js`
   - Run `npm run migrate` in backend folder
   - Recreates/updates database tables

### Adding Dependencies

```bash
# Add to frontend
cd frontend
npm install new-package

# Add to backend
cd backend
npm install new-package

# Add dev dependency
npm install --save-dev new-dev-package
```

### Environment Configuration

- **Development**: Use defaults from `.env` files
- **Production**: Set actual environment variables on host
- **Testing**: Override via CI/CD environment variables

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check backend is running on port 3001
- Verify `VITE_API_URL` in `frontend/.env`
- Check browser console for API errors

### Database connection failed
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `backend/.env`
- Test connection: `psql $DATABASE_URL`

### Port already in use
- **Frontend**: Change Vite port in `frontend/vite.config.js`
- **Backend**: Change PORT in `backend/.env`

### Changes not taking effect
- Restart backend: Server auto-reloads with nodemon
- Refresh browser: Frontend auto-reloads with HMR

## 🚢 Deployment

### Frontend Deployment

```bash
cd frontend
npm run build
# Creates production build in frontend/dist/
# Deploy this folder to your static hosting (Vercel, Netlify, AWS S3, etc.)
```

### Backend Deployment

```bash
cd backend
# Set environment variables on host
export DATABASE_URL="production-database-url"
export JWT_SECRET="production-secret-key"
npm start
# Deploy to server (Heroku, Railway, AWS EC2, etc.)
```

## 📚 Documentation

- [Frontend Documentation](./frontend/README.md) - React app details
- [Backend Documentation](./backend/README.md) - API endpoints and architecture
- [Setup Guide](./SETUP.md) - Complete installation guide

## 🔗 API Communication

### How Frontend Calls Backend

1. Frontend makes request to `${VITE_API_URL}/endpoint`
2. Backend at `http://localhost:3001` receives request
3. Backend validates JWT token from `Authorization: Bearer <token>` header
4. Backend returns response or error
5. Frontend handles response and updates UI

### Protected Routes Flow

```
Frontend (AuthContext)
  ↓
User logs in → JWT stored in localStorage
  ↓
Protected <Route> checks token in AuthContext
  ↓
Route renders if valid, redirects to /login if invalid
  ↓
API calls include Authorization header with JWT
  ↓
Backend middleware verifies token
  ↓
Controller processes request
```

## 🔐 Security Checklist

- [ ] `.env` file with real credentials is in `.gitignore`
- [ ] `.env.example` has placeholder values
- [ ] JWT_SECRET is unique and strong
- [ ] Database URL points to secure host
- [ ] CORS is configured for frontend origin only
- [ ] Passwords are hashed with bcryptjs
- [ ] Tokens expire after reasonable time (7 days)
- [ ] No sensitive data in frontend code

## 📦 Git Workflow

### Committing Changes

```bash
# Changes to both frontend and backend
git add frontend/src/...
git add backend/src/...
git commit -m "Add user dashboard feature

- Frontend: Add dashboard component
- Backend: Add /api/dashboard endpoint"
```

### .gitignore Rules

```
# .env files (sensitive)
.env
backend/.env

# Node dependencies
node_modules/
frontend/node_modules/
backend/node_modules/

# Build outputs
dist/
frontend/dist/
backend/build/

# IDE
.vscode/
.idea/
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/awesome-feature`
2. Make changes in appropriate folder (`frontend/` or `backend/`)
3. Test thoroughly before committing
4. Commit with clear messages
5. Push and create pull request

## 📞 Getting Help

- Check relevant README in `frontend/` or `backend/`
- Review API documentation in `backend/README.md`
- Check environment setup in `SETUP.md`
- Look at example `.env.example` files

## 📄 License

MIT

---

**Happy coding!** 🚀

For specific frontend or backend details, see the respective README files.
