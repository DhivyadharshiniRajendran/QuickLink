import express from 'express';
import {
  createShortUrl,
  getUserUrls,
  deleteUrl,
  redirectToUrl,
  getUrlDetails,
} from '../controllers/urlController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/create', authenticateToken, createShortUrl);
router.get('/my-urls', authenticateToken, getUserUrls);
router.delete('/:id', authenticateToken, deleteUrl);
router.get('/details/:id', authenticateToken, getUrlDetails);

// Public redirect route
router.get('/:shortCode', redirectToUrl);

export default router;
