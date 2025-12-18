import axios from 'axios';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const specialEmails = (process.env.SPECIAL_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

const getRoleForEmail = (email) =>
  specialEmails.includes(email.toLowerCase()) ? 'SPECIAL' : 'USER';

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

    // login nur mit @htlwienwest.at erlaubn
    const allowedDomain = (process.env.ALLOWED_EMAIL_DOMAIN || '').toLowerCase();
const emailDomain = (userData.email.split('@')[1] || '').toLowerCase();

if (allowedDomain && emailDomain !== allowedDomain) {
  const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
  return res.redirect(`${frontendBase}/login?error=domain`);
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
        role: getRoleForEmail(userData.email),
      });
    } else {
      user.googleToken = accessToken;
      user.role = getRoleForEmail(userData.email);
      if (!user.profileImage && userData.picture) {
        user.profileImage = userData.picture;
      }
      await user.save();
    }

    req.session.userId = user.id;

    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendBase}/chapters`);
  } catch (err) {
    console.error('Google Callback Error:', err);
    res.status(500).send('Failed to authenticate with Google.');
  }
};

export const me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const user = await User.findByPk(req.session.userId, {
    attributes: ['id', 'name', 'email', 'profileImage', 'role'],
  });

  res.json(user);
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
};
