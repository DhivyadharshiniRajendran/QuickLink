# QuickLink Backend API

REST API for the QuickLink URL shortener application built with Node.js, Express, and PostgreSQL.

## Features

- **User Authentication**: Signup and login with JWT tokens
- **URL Shortening**: Convert long URLs to short, memorable codes
- **Analytics Tracking**: Track clicks and visits for shortened URLs
- **User Isolation**: Each user can only manage their own URLs
- **Secure API**: Protected endpoints with JWT authentication

## Tech Stack

- **Node.js** & **Express.js** - Web server and routing
- **PostgreSQL** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **pg** - PostgreSQL client
- **CORS** - Cross-origin requests

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the `DATABASE_URL` with your PostgreSQL connection string
   - Update `JWT_SECRET` for production

4. Initialize the database:
   ```bash
   npm run migrate
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3001` (or the `PORT` specified in `.env`)

## API Endpoints

### Authentication

- **POST** `/api/auth/signup` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```

- **POST** `/api/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **GET** `/api/auth/me` - Get current user (requires auth token)

### URLs

- **POST** `/api/urls/create` - Create a short URL (requires auth)
  ```json
  {
    "originalUrl": "https://example.com/very/long/url"
  }
  ```

- **GET** `/api/urls/my-urls` - Get user's shortened URLs (requires auth)

- **DELETE** `/api/urls/:id` - Delete a shortened URL (requires auth)

- **GET** `/api/urls/details/:id` - Get detailed analytics for a URL (requires auth)

- **GET** `/api/urls/:shortCode` - Redirect to original URL (public route)
  - Records a visit automatically

## Database Schema

### users
- `id` - Primary key
- `email` - User email (unique)
- `password_hash` - Hashed password
- `created_at` - Timestamp

### short_urls
- `id` - Primary key
- `user_id` - Foreign key to users
- `original_url` - The full URL
- `short_code` - Unique 6-character code
- `created_at` - Timestamp

### visits
- `id` - Primary key
- `short_url_id` - Foreign key to short_urls
- `visited_at` - Timestamp

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the `Authorization` header for protected routes:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:3001/api/auth/me
```

## Error Handling

All API responses follow this format:

**Success Response:**
```json
{
  "message": "Success message",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `PORT` | Server port | No (default: 3001) |
| `BASE_URL` | Base URL for short URLs | No |
| `CLIENT_URL` | Frontend URL for CORS | No |
| `NODE_ENV` | Environment (development/production) | No |

## Development

### Create a short URL
```bash
curl -X POST http://localhost:3001/api/urls/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"originalUrl": "https://example.com"}'
```

### Redirect to original URL
```bash
curl -L http://localhost:3001/api/urls/ABC123
```

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check network connectivity to the database server

### JWT Errors
- Token may be expired (valid for 7 days)
- Ensure token is passed correctly in Authorization header
- Check `JWT_SECRET` matches between frontend and backend

### CORS Errors
- Verify `CLIENT_URL` in backend matches frontend origin
- Frontend should be at `http://localhost:5173` by default

## Production Deployment

For production deployment:

1. Update environment variables:
   - Set `NODE_ENV=production`
   - Use a strong `JWT_SECRET`
   - Update `DATABASE_URL` to production database
   - Set `BASE_URL` to your production domain

2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name quicklink
   ```

3. Set up a reverse proxy (nginx) for HTTPS

4. Configure proper CORS settings

## License

MIT
