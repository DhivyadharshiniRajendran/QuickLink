import express from 'express';
import {
  createShortUrl,
  getUserUrls,
  deleteUrl,
  getUrlDetails,
  getAnalytics,
} from '../controllers/urlController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - must be BEFORE the catch-all /:id route
router.post('/create', authenticateToken, createShortUrl);
router.get('/my-urls', authenticateToken, getUserUrls);
router.get('/details/:id', authenticateToken, getUrlDetails);
router.get('/analytics/:id', authenticateToken, getAnalytics);
router.delete('/:id', authenticateToken, deleteUrl);

// IMPORTANT: DO NOT add a catch-all :shortCode handler here!
// Short code redirects are handled at the ROOT level in server.js
// This prevents /api/urls/ from accidentally intercepting short URL patterns
// urlRoutes.js is ONLY for API endpoints, never for user-facing short URL redirects

export default router;