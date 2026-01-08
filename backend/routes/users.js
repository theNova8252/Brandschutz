// backend/routes/users.js
import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { listUsers, updateRoleByEmails } from '../controllers/usersController.js';

const router = express.Router();

router.get('/', authMiddleware, requireRole('ADMIN'), listUsers);
router.post('/roles', authMiddleware, requireRole('ADMIN'), updateRoleByEmails);

export default router;
