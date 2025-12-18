import User from '../models/User.js';

export default async function authMiddleware(req, res, next) {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findByPk(req.session.userId, {
      attributes: ['id', 'name', 'email', 'role'],
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user.toJSON();
    next();
  } catch (err) {
    console.error('authMiddleware error:', err);
    res.status(500).json({ message: 'Auth error' });
  }
}
