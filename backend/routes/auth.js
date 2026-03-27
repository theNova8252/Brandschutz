// backend/routes/auth.js
import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { googleLogin, googleCallback, me, logout } from '../controllers/authController.js';

const router = express.Router();

function getDevLoginEmail() {
  const envList = (process.env.BOOTSTRAP_ADMIN_EMAILS || '').trim();
  if (envList) {
    return envList
      .split(',')
      .map(email => email.trim().toLowerCase())
      .find(Boolean);
  }

  return (process.env.BOOTSTRAP_ADMIN_EMAIL || '').trim().toLowerCase();
}

// Start Google OAuth
router.get('/google', googleLogin);

// Callback von Google
router.get('/google/callback', googleCallback);

// Session user
router.get('/me', me);

// Logout
router.post('/logout', logout);

// Dev-Login (nur lokal, ohne Google OAuth)
router.get('/dev-login', async (req, res) => {
  const { default: User } = await import('../models/User.js');
  const devLoginEmail = getDevLoginEmail();
  if (!devLoginEmail) return res.status(500).json({ message: 'No bootstrap admin email configured' });

  const user = await User.findOne({ where: { email: devLoginEmail } });
  if (!user) return res.status(404).json({ message: 'Dev user not found' });
  req.session.userId = user.id;
  const host = req.hostname;
  res.redirect(`http://${host}:5173/chapters`);
});

export default router;
