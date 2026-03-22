# QuickLink - Full Stack URL Shortener

A modern, full-stack URL shortening application with user authentication, real-time analytics, and a beautiful responsive UI.

---

## 📋 Setup Instructions

### Prerequisites
- **Node.js** (v18+)
- **npm** or **yarn**
- **PostgreSQL** (v12+)
- Git

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/DhivyadharshiniRajendran/QuickLink.git
cd QuickLink
```

#### 2. Backend Setup

```bash
cd backend

# Copy environment template
cp .env.example .env

# Install dependencies
npm install

# Run database migrations
npm run migrate

# Start development server
npm run dev
# Backend runs on http://localhost:3001
```

**Backend .env Configuration:**
```
PORT=3001
NODE_ENV=development
# Database credentials (configured via .env.example)
# JWT_SECRET (configured via .env.example)
```

#### 3. Frontend Setup

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

#### 4. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Database**: Local PostgreSQL instance

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

## 📋 Assumptions Made

1. **Database**: PostgreSQL is installed and running locally (or via environment variable for production)

2. **Node Environment**: Node.js v18+ with npm installed on developer machines and deployment platforms

3. **Authentication**: JWT tokens are used for stateless authentication with 7-day expiration

4. **URL Validation**: Short codes are exactly 6 alphanumeric characters, generated randomly and checked for uniqueness

5. **CORS**: Backend allows requests from frontend domain, with credentials support for mobile redirect compatibility

6. **URL Format**: User-provided URLs must start with `http://` or `https://` or the backend adds `https://` prefix automatically

7. **Browser Storage**: Tokens are stored in localStorage (frontend) for session persistence across page refreshes

8. **Monorepo Structure**: Frontend and backend are in separate folders but share git repository

9. **Database Initialization**: Database schema is created automatically on first backend startup via migrations

10. **Environment Secrets**: Sensitive data (DATABASE_URL, JWT_SECRET, API_URL) are never committed and must be set via .env files or environment variables

11. **Analytics Tracking**: Every URL redirect automatically tracks visitor metadata (browser, OS, device type, IP address)

12. **User Isolation**: Users can only view, edit, and delete their own shortened URLs (enforced via user_id verification)

---

## 🏗️ Architecture Diagram

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

### Data Flow

1. **User Authentication**: User enters credentials → Frontend calls `/api/auth/login` → Backend validates & returns JWT token → Token stored in localStorage

2. **Create Short URL**: User pastes long URL → Frontend validates format → Calls `/api/urls/create` → Backend generates 6-char code → Stores in DB → Returns short URL

3. **Short URL Redirect**: User/visitor accesses `quicklink.render.com/abc123` → Backend's `/:shortCode` handler catches request → Looks up original URL in DB → 301 redirects to original → Analytics recorded

4. **View Analytics**: User clicks analytics → Frontend calls `/api/urls/analytics/:id` → Backend queries visits table → Aggregates data (clicks, devices, browsers) → Returns to frontend → Charts display

---

## 🎥 Video Demonstration

**Project Demo Video:**
- [YouTube Link](https://www.youtube.com/watch?v=YOUR_VIDEO_ID) - *Replace with actual YouTube link*
- [Loom Recording](https://www.loom.com/share/YOUR_LOOM_ID) - *Replace with actual Loom link*

**In the video:**
- User signup and login flow
- Creating and copying short URLs
- Testing URL redirects on desktop and mobile
- Viewing analytics dashboard with click tracking
- Delete URL functionality
- Real-time statistics updates

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router 7, Vite, CSS3
- **Backend**: Node.js, Express 4, PostgreSQL, JWT
- **Hosting**: Vercel (Frontend), Render (Backend), Railway (Database)
- **Authentication**: JWT with bcryptjs password hashing

---

## 📄 License

MIT

---

**For more details about the codebase, see the documentation in individual `README.md` files in `/frontend` and `/backend` folders.**


