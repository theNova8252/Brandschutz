import express from 'express';
import authMiddleware from '../middleware/auth.js';
import requireSpecial from '../middleware/requireSpecial.js';
import { getUsersOverview } from '../controllers/usersController.js';

const router = express.Router();

router.get('/overview', authMiddleware, requireSpecial, getUsersOverview);

export default router;
