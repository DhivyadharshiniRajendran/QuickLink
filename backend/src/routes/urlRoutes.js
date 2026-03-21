import express from 'express';
import {
  createShortUrl,
  getUserUrls,
  deleteUrl,
  redirectToUrl,
  getUrlDetails,
  getAnalytics,
} from '../controllers/urlController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - must be BEFORE /:shortCode
router.post('/create', authenticateToken, createShortUrl);
router.get('/my-urls', authenticateToken, getUserUrls);
router.get('/details/:id', authenticateToken, getUrlDetails);
router.get('/analytics/:id', authenticateToken, getAnalytics);
router.delete('/:id', authenticateToken, deleteUrl);

// Public redirect - must be LAST
router.get('/:shortCode', redirectToUrl);

export default router;