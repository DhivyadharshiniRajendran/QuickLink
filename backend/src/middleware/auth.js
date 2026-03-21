import { verifyToken } from '../utils/helpers.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('🔐 authenticateToken middleware:');
  console.log('  Authorization header present:', !!authHeader);
  console.log('  Token present:', !!token);

  if (!token) {
    console.error('  ❌ No token provided in Authorization header');
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = verifyToken(token);
  console.log('  Token decoded:', !!decoded);
  
  if (!decoded) {
    console.error('  ❌ Token validation failed');
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  console.log('  ✓ Token valid. User ID:', decoded.userId);
  
  // Set user object for standard req.user.id access
  req.user = {
    id: decoded.userId,
    userId: decoded.userId // For backward compatibility
  };
  
  // Also set req.userId for backward compatibility with existing code
  req.userId = decoded.userId;
  
  next();
};
