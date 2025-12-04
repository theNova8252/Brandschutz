import express from 'express';
import { googleLogin, googleCallback, me, logout } from '../controllers/authController.js';

const router = express.Router();

router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);
router.get('/me', me);
router.post('/logout', logout);

export default router;
