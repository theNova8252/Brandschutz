// middleware/auth.js
export default function authMiddleware(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // einheitlich: req.user.id benutzen dürfen
  req.user = { id: req.session.userId };
  next();
}
