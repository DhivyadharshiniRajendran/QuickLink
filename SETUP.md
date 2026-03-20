# QuickLink - Setup & Installation Guide

This guide walks you through setting up and running the complete QuickLink full-stack URL shortener application.

## System Requirements

- **Node.js**: 16.x or higher
- **npm**: 8.x or higher (comes with Node.js)
- **PostgreSQL**: 12.x or higher
- **Git** (optional, for cloning)

Verify your installations:
```bash
node --version
npm --version
```

## Database Setup

### Option 1: Using Provided Railway Database

The backend is pre-configured with Railway's PostgreSQL database. The connection string is already in `.env`:

```
DATABASE_URL=postgresql://postgres:ClCcXToTEycOOGOQmPXBxLmAbChrhWVR@ballast.proxy.rlwy.net:22315/railway
```

Simply proceed to the Backend Setup section below.

### Option 2: Using Local PostgreSQL

If you prefer a local database instead:

1. **Install PostgreSQL** from https://www.postgresql.org/download/
   
2. **Start PostgreSQL service** (varies by OS):
   - **Windows**: PostgreSQL starts automatically
   - **macOS**: `brew services start postgresql`
   - **Linux**: `sudo service postgresql start`

3. **Create a new database**:
   ```bash
   psql -U postgres
   # In the psql prompt:
   CREATE DATABASE quicklink;
   \q
   ```

4. **Update backend `.env`**:
   ```
   DATABASE_URL=postgresql://postgres:YourPassword@localhost:5432/quicklink
   ```

## Installation Steps

### Step 1: Frontend Setup

1. Navigate to the project root:
   ```bash
   cd path/to/URL_kat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify installation:
   ```bash
   npm run dev
   ```

4. Check that the frontend builds without errors on `http://localhost:5173`

### Step 2: Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify `.env` file exists with correct DATABASE_URL:
   ```bash
   cat .env
   # Should show your database connection details
   ```

4. Initialize the database (creates tables):
   ```bash
   npm run migrate
   ```

   You should see output like:
   ```
   Initializing database...
   ✓ Users table created
   ✓ Short URLs table created
   ✓ Visits table created
   ✓ Indexes created
   ✓ Database initialized successfully
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   Server running on http://localhost:3001
   ```

### Step 3: Verify Both Servers Are Running

Open two terminal windows:

**Terminal 1 - Frontend**:
```bash
npm run dev
# http://localhost:5173
```

**Terminal 2 - Backend**:
```bash
cd backend
npm run dev
# http://localhost:3001
```

## Running the Application

1. **Start the frontend** (in VS Code terminal or new terminal window):
   ```bash
   npm run dev
   ```
   - Frontend available at: `http://localhost:5173`
   - Keep this window open

2. **Start the backend** (in a separate terminal):
   ```bash
   cd backend
   npm run dev
   ```
   - Backend API available at: `http://localhost:3001`
   - Keep this window open

3. **Open the application**:
   - Visit `http://localhost:5173` in your browser
   - You should see the QuickLink signup page

## First Time Usage

### Create an Account

1. Click "Create one" link on the login page (or navigate to `/signup`)
2. Enter an email address
3. Enter a password (minimum 6 characters)
4. Confirm your password
5. Click "Sign Up"

### Create a Short URL

1. You'll be redirected to the Dashboard
2. Paste a long URL (e.g., `https://github.com/facebook/react`)
3. Click "Shorten URL"
4. Your short URL will appear in the list with copy button

### View Analytics

1. Click "Analytics" in the header
2. View statistics for all your shortened URLs
3. Click on a URL to see detailed analytics

## Project File Structure

```
URL_kat/
├── src/                          # Frontend React application
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── AnalyticsOverviewPage.jsx
│   │   └── AnalyticsDetail.jsx
│   ├── components/               # Reusable React components
│   ├── context/                  # State management
│   │   ├── AuthContext.jsx       # Authentication state
│   │   └── UrlContext.jsx        # URL management state
│   ├── styles/                   # CSS stylesheets
│   └── App.jsx                   # Main App component
│
├── backend/                      # Node.js/Express backend
│   ├── src/
│   │   ├── server.js             # Express entry point
│   │   ├── config/
│   │   │   └── database.js       # PostgreSQL connection
│   │   ├── controllers/          # Route handlers
│   │   ├── routes/               # API routes
│   │   ├── middleware/           # Authentication middleware
│   │   ├── utils/                # Helper functions
│   │   └── migrations/
│   │       └── init.js           # Database initialization
│   ├── package.json
│   ├── .env                      # Environment variables
│   └── README.md                 # Backend documentation
│
├── package.json                  # Frontend dependencies
├── vite.config.js                # Vite configuration
├── index.html                    # HTML entry point
└── README.md                     # Project documentation
```

## Environment Variables Explained

### Frontend
No `.env` file needed - API URL is hardcoded in context files

### Backend `.env`
```
# Database connection (required)
DATABASE_URL=postgresql://user:password@host:port/database

# JWT secret for token signing (required)
JWT_SECRET=your-secret-key-change-in-production

# Server configuration
PORT=3001                          # Backend server port
NODE_ENV=development               # Environment mode

# Frontend/API URLs
BASE_URL=http://localhost:3001     # Base URL for short URLs
CLIENT_URL=http://localhost:5173   # Frontend origin for CORS
```

## Troubleshooting

### "Cannot find module" errors

**Solution**: Install dependencies again
```bash
npm install
cd backend && npm install
```

### Database connection errors

**Check if database is running**:
```bash
# PostgreSQL is running if no error
psql -c "SELECT NOW()" postgresql://postgres@localhost
```

**Fix CONNECTION_REFUSED**:
- Ensure PostgreSQL service is running
- Check DATABASE_URL in backend/.env
- Verify database exists

### Port 3001 or 5173 already in use

**Find process using port**:
```bash
# Windows
netstat -ano | findstr :3001

# macOS/Linux
lsof -i :3001
```

**Change port in backend/.env**:
```
PORT=3002
CLIENT_URL=http://localhost:5173
```

### Frontend not connecting to backend

**Check backend is running**:
```bash
curl http://localhost:3001/health
# Should respond with: {"status":"OK"}
```

**Check CORS settings**:
- Verify `CLIENT_URL=http://localhost:5173` in backend/.env
- Restart backend server after changing .env

### "Invalid token" errors

**Clear browser storage and login again**:
1. Open DevTools (F12)
2. Go to Application > Local Storage
3. Delete the `token` entry
4. Close and reopen the application
5. Sign up or log in again

## Development Tips

### VS Code Extensions (Recommended)
- **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
- **Thunder Client** or **REST Client** - for testing API endpoints
- **PostgreSQL** - ckolkman.vscode-postgres

### Testing API Endpoints

Using curl:
```bash
# Signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","confirmPassword":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Database Inspection

Using PostgreSQL CLI:
```bash
psql postgresql://postgres@localhost/quicklink

# List tables
\dt

# View users
SELECT * FROM users;

# View short URLs
SELECT * FROM short_urls;

# Exit
\q
```

## Production Deployment

See individual README files in root and backend directories for production deployment instructions.

## Getting Help

If you encounter issues:

1. **Check the logs**: Look at terminal output for error messages
2. **Review this guide**: Search for your error message
3. **Check individual READMEs**:
   - Root [README.md](./README.md) - Project overview
   - [Backend README.md](./backend/README.md) - API documentation
4. **Common issues section above**: Try the troubleshooting steps

## Next Steps

- Explore the code in `src/` directory
- Read through the component files to understand architecture
- Check out the backend API in `backend/src/`
- Customize colors and styling in `src/styles/`
- Deploy to production when ready (see README files)

---

**Congratulations!** 🎉 Your QuickLink application is now running!
