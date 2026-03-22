# QuickLink - Full Stack URL Shortener

A modern, full-stack URL shortening application with user authentication, real-time analytics, and a beautiful responsive UI. Built with React, Node.js, Express, and PostgreSQL.

---

## 🔗 Live Demo

**Try it now:**
- **Frontend**: [https://quick-link-green.vercel.app](https://quick-link-green.vercel.app)
- **Backend API**: [https://quicklink-2v4z.onrender.com](https://quicklink-2v4z.onrender.com)

**Test Account (Optional):**
- Use any email and password to create an account, or login with existing credentials

---

## ✨ Features

- **User Authentication**: Secure signup and login with JWT tokens
- **URL Shortening**: Convert long URLs to short 6-character codes
- **Dashboard**: View all your shortened URLs in one place
- **Analytics**: Track clicks, visitor devices, browsers, and geographic data
- **Real-time Stats**: Monitor short URL performance with visual charts
- **Responsive UI**: Works seamlessly on desktop and mobile devices
- **301 Redirects**: Permanent redirects for better SEO
- **URL Management**: Edit, delete, and manage your shortened URLs
- **Visitor Tracking**: Automatic analytics collection on every redirect

---

## 📋 Setup Instructions

### Prerequisites
- **Node.js** (v18+)
- **npm** or **yarn**
- **PostgreSQL** (v12+)
- Git

### Local Development Setup

#### Step 1: Clone the Repository
```bash
git clone https://github.com/DhivyadharshiniRajendran/QuickLink.git
cd QuickLink
```

#### Step 2: Backend Setup

```bash
cd backend

# Copy environment template
cp .env.example .env

# Install dependencies
npm install

# Run database migrations (if applicable)
npm run migrate

# Start development server
npm run dev
# Backend runs on http://localhost:3001
```

**Backend .env Configuration:**
```
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/quicklink
JWT_SECRET=your_secret_key_here
BASE_URL=http://localhost:3001
```

#### Step 3: Frontend Setup

```bash
cd frontend

# Copy environment template (if exists)
cp .env.example .env.local

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

**Frontend .env.local Configuration:**
```
VITE_API_URL=http://localhost:3001/api
```

#### Step 4: Access Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001/api](http://localhost:3001/api)
- **Database**: Local PostgreSQL instance (quicklink database)

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
# Creates optimized build in dist/
```

**Backend:**
```bash
cd backend
npm start
```

---

## 🏗️ Architecture Diagram

### System Architecture

```
                           ┌─────────────────┐
                           │  Web Browser    │
                           │  (Client-side)  │
                           └────────┬────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
          ┌─────────▼─────────┐    │    ┌─────────▼──────────┐
          │   React Frontend   │    │    │  Short URL Links   │
          │   (Vercel)         │    │    │  (Public /:code)   │
          │  ├─ Auth Pages     │    │    │                    │
          │  ├─ Dashboard      │    │    │  Redirects via 301 │
          │  ├─ Analytics      │    │    │                    │
          │  └─ Context API    │    │    │  to Backend        │
          └────────┬─────────┘    │    └────────┬─────────────┘
                   │              │             │
                   │ HTTPS        │             │ HTTPS
                   │ API Calls    │             │
                   │              │             │
          ┌────────▼──────────────┴─────────────▼──────────────┐
          │                                                      │
          │          Express.js Backend Server                  │
          │          (Render Hosting)                           │
          │          ────────────────────                       │
          │  ┌─────────────────────────────────────────┐       │
          │  │  Routes & Controllers                   │       │
          │  │  ├─ /api/auth/*          (Auth)        │       │
          │  │  ├─ /api/urls/*          (URL Mgmt)    │       │
          │  │  ├─ /api/urls/analytics  (Analytics)   │       │
          │  │  └─ /:shortCode          (Redirect)    │       │
          │  └─────────────────────────────────────────┘       │
          │                    │                                 │
          │  ┌─────────────────┴──────────────────────┐        │
          │  │  Middleware                            │        │
          │  │  ├─ JWT Authentication                 │        │
          │  │  ├─ CORS Handler                       │        │
          │  │  └─ Request Logging                    │        │
          │  └───────────────────────────────────────┘        │
          │                                                      │
          └──────────────┬──────────────────────────────────────┘
                         │
                         │ SQL Queries
                         │
          ┌──────────────▼──────────────┐
          │   PostgreSQL Database       │
          │   (Railway Hosting)         │
          │                             │
          │  Tables:                    │
          │  ├─ users                   │
          │  ├─ short_urls              │
          │  └─ visits (analytics)      │
          │                             │
          └─────────────────────────────┘
```

### Data Flow: Create & Redirect

```
USER FLOW 1: URL Shortening
─────────────────────────────
1. User enters long URL in form
2. Frontend validates URL format
3. Calls POST /api/urls/create with {originalUrl, userId}
4. Backend generates 6-char random code
5. Backend validates code uniqueness in DB
6. Backend stores {original_url, short_code, user_id} in DB
7. Backend returns {shortUrl, shortCode} to frontend
8. Frontend displays copyable short URL
9. User can share the short URL link

USER FLOW 2: Short URL Redirect
────────────────────────────────
1. User/Visitor clicks short URL (quicklink.render.com/abc123)
2. Browser sends GET request to backend
3. Backend /:shortCode handler:
   - Validates 6-char alphanumeric format
   - Looks up original_url in short_urls table
   - Detects visitor device (desktop/mobile)
   - Extracts browser, OS, IP address info
   - Records visit in visits table (for analytics)
   - Issues 301 permanent redirect to original_url
4. Browser follows redirect to original website
5. Original website loads for user
6. Analytics dashboard shows new click in real-time
```

---

## 📊 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19.2.4 | UI framework with hooks |
| **Frontend Build** | Vite 8.0.1 | Fast bundler and dev server |
| **Routing** | React Router 7.13.1 | Client-side navigation |
| **Styling** | CSS3 | Modern styling with custom themes |
| **Backend** | Node.js + Express 4.18.2 | RESTful API server |
| **Authentication** | JWT + bcryptjs | Secure token-based auth with password hashing |
| **Database** | PostgreSQL | Production-grade relational database |
| **Frontend Hosting** | Vercel | Auto-deploy from GitHub on push |
| **Backend Hosting** | Render | Auto-deploy from GitHub on push |
| **Database Hosting** | Railway | Managed PostgreSQL service |

---

## 📋 Assumptions Made

1. **Short Code Format**: Short codes are exactly 6 alphanumeric characters (`[a-zA-Z0-9]{6}`)

2. **Database**: PostgreSQL is installed and running (locally for dev, Railway for production)

3. **Node Environment**: Node.js v18+ with npm installed on developer machines and deployment platforms

4. **Authentication**: JWT tokens used for stateless authentication with 7-day expiration

5. **URL Validation**: User-provided URLs must start with `http://` or `https://`, or backend auto-adds `https://` prefix

6. **CORS Policy**: Backend allows requests from all origins with credentials support (for mobile compatibility)

7. **Session Persistence**: JWT tokens stored in localStorage on frontend for session persistence

8. **Monorepo Structure**: Frontend and backend are separate folders but share a git repository

9. **Database Auto-initialization**: Database schema created on first backend startup (via migrations)

10. **Environment Secrets**: All sensitive data (DATABASE_URL, JWT_SECRET, API_URL) set via .env files or environment variables, never committed

11. **Analytics Automatic**: Every URL redirect auto-tracks visitor metadata (browser, OS, device, IP address, geographic location)

12. **User Isolation**: Users can only view, edit, and delete their own shortened URLs (enforced via user_id verification in backend)

13. **Redirect Type**: HTTP 301 permanent redirects used for better SEO and caching

14. **Mobile Support**: Mobile redirects work with CORS handling and serve short URLs on both http and https protocols

15. **Production SSL**: All production URLs use HTTPS (enforced by Vercel and Render)

---

## 🤖 AI Planning Document

### Project Overview
This QuickLink URL shortener was planned and developed using AI-assisted development workflows. The AI agent helped with:

#### 1. Architecture Design
- Designed the three-tier architecture: Frontend (React/Vercel) → Backend (Express/Render) → Database (PostgreSQL/Railway)
- Planned the database schema with users, short_urls, and visits tables
- Determined the data flow for URL creation and redirect operations

#### 2. Feature Implementation
- Implemented JWT-based authentication with bcryptjs password hashing
- Built URL shortening with 6-character alphanumeric codes
- Created analytics tracking system with visitor metadata collection
- Developed responsive React UI with routing and context API

#### 3. Bug Fixes & Optimization
- **Critical Bug Fix**: Fixed frontend reconstructing short URLs with wrong domain (was using Vercel origin instead of Render backend)
- **Route Ordering Fix**: Ensured /api routes loaded before /:shortCode catch-all handler
- **Mobile Optimization**: Added CORS configuration and protocol prefix handling for mobile redirects
- **Database Connection**: Added missing database pool import to server.js

#### 4. Development Workflow
- Used AI for code review and error diagnosis
- Implemented incremental testing and validation
- Committed changes with clear, descriptive git messages
- Deployed to production platforms with auto-deployment enabled

#### 5. Deployment Strategy
- Frontend auto-deploys to Vercel on push to main branch
- Backend auto-deploys to Render on push to main branch
- Database runs on Railway with connection pooling
- All environment secrets managed outside of version control

### Key Decisions
- **Permanent Redirects (301)**: Better for SEO and browser caching than 302
- **JWT Tokens**: Stateless authentication allows scaling
- **PostgreSQL**: ACID compliance and analytics query complexity
- **React Context API**: Simpler than Redux for this project's complexity level
- **Separate Hosting**: Frontend and backend on different platforms for independent scaling

### Lessons Learned
- Route ordering is critical in Express.js (/:shortCode catch-all must come last)
- Frontend should trust API responses for URLs rather than reconstructing them
- Mobile compatibility requires specific CORS and protocol handling
- Analytics tracking should happen on every redirect for accurate data

---

## 🎥 Video Demonstration

**Project Demo & Explanation Videos:**
- [Google Drive Folder](https://drive.google.com/drive/folders/1ZXB54ZmKvFLpFMHrCzzylsU7vFlChXXz) - Complete explanatory videos and demo recordings

**Demo Content:**
- User signup and login flow with form validation
- Creating and copying short URLs to clipboard
- Testing URL redirects on desktop and mobile browsers
- Viewing analytics dashboard with real-time click tracking
- Viewing device, browser, and geographic breakdowns
- Delete URL functionality with confirmation
- Real-time statistics updates and charts

---

## 📁 Project Structure

```
QuickLink/
├── frontend/                    # React application (Vercel)
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── context/            # Global state (UrlContext)
│   │   ├── styles/             # CSS files
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── vite.config.js         # Vite configuration
│   └── package.json           # Frontend dependencies
│
├── backend/                     # Express application (Render)
│   ├── src/
│   │   ├── routes/            # API route definitions
│   │   ├── controllers/       # Request handlers
│   │   ├── config/            # Configuration files
│   │   ├── middleware/        # Custom middleware
│   │   └── server.js          # Express app setup
│   ├── package.json           # Backend dependencies
│   └── .env.example           # Environment variables template
│
├── README.md                   # This file
└── .gitignore                 # Git ignore rules
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Automatic deployment on push to main
# Frontend URL: https://quick-link-green.vercel.app
# Environment: VITE_API_URL pointing to Render backend
```

### Backend (Render)
```bash
# Automatic deployment on push to main
# Backend URL: https://quicklink-2v4z.onrender.com
# Environment: DATABASE_URL, JWT_SECRET, BASE_URL
```

### Database (Railway)
```
# PostgreSQL managed service
# Connection via DATABASE_URL environment variable
# Auto-backups and monitoring included
```

---

## 🛠️ Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run migrate` - Run database migrations (if applicable)

---

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user and get JWT token

### URL Management Endpoints
- `POST /api/urls/create` - Create a new shortened URL
- `GET /api/urls/my-urls` - Get all shortened URLs for current user
- `GET /api/urls/details/:id` - Get details of a specific URL
- `GET /api/urls/analytics/:id` - Get analytics for a shortened URL
- `DELETE /api/urls/:id` - Delete a shortened URL

### Public Endpoints
- `GET /:shortCode` - Redirect to original URL (public, no auth required)

---

## 🐛 Troubleshooting

**Issue**: Backend cannot connect to database
- **Solution**: Check DATABASE_URL in .env file and PostgreSQL is running

**Issue**: Frontend shows 404 for short URLs
- **Solution**: Verify VITE_API_URL points to correct backend, check CORS settings

**Issue**: Analytics not showing
- **Solution**: Ensure visits table exists in database, check backend /api/urls/analytics endpoint

**Issue**: JWT token expired
- **Solution**: Clear localStorage and login again (tokens expire after 7 days)

---

## 📄 License

MIT

---

## 🙌 Credits

This project is part of a hackathon run by **[Katomaran](https://katomaran.com)**

---

**For more details about the codebase, see the documentation in individual `README.md` files in `/frontend` and `/backend` folders.**


