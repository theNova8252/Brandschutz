// backend/routes/auth.js
import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { googleLogin, googleCallback, me, logout } from '../controllers/authController.js';

const router = express.Router();

// Start Google OAuth
router.get('/google', googleLogin);

// Callback von Google
router.get('/google/callback', googleCallback);

// Session user
router.get('/me', me); 

// Logout
router.post('/logout', logout);

export default router;
