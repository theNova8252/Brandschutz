// controllers/authController.js
import axios from 'axios';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

export const googleLogin = (req, res) => {
  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI)}` +
    `&scope=${encodeURIComponent('profile email')}`;

  res.redirect(googleAuthUrl);
};

export const googleCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No authorization code provided.');

  try {
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userData = userResponse.data;
    if (!userData.email) {
      return res.status(400).send('Google account has no email.');
    }

    let user = await User.findOne({ where: { email: userData.email } });

    if (!user) {
      user = await User.create({
        name: userData.name,
        email: userData.email,
        googleId: userData.id,
        googleToken: accessToken,
        profileImage: userData.picture,
        isNewUser: true,
      });
    } else {
      user.googleToken = accessToken;
      if (!user.profileImage && userData.picture) {
        user.profileImage = userData.picture;
      }
      await user.save();
    }

    // User in Session speichern
    req.session.userId = user.id;

    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(`${frontendBase}/chapters`);
  } catch (error) {
    console.error('Google Callback Error:', error.response?.data || error.message);
    res.status(500).send('Failed to authenticate with Google.');
  }
};

// ===== NEU: /auth/me =====
export const me = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findByPk(req.session.userId, {
      attributes: ['id', 'name', 'email', 'profileImage'], // nur das Nötigste
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (err) {
    console.error('ME error:', err);
    res.status(500).json({ message: 'Failed to load user' });
  }
};

// ===== NEU: /auth/logout =====
export const logout = (req, res) => {
  // Session zerstören
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout session destroy error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }

    // Session-Cookie löschen (Name muss zu deinem session-cookie passen)
    res.clearCookie('connect.sid'); // oder der Name den du in express-session gesetzt hast

    return res.json({ message: 'Logged out' });
  });
};
