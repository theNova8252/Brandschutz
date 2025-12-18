export default function requireSpecial(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.user.role !== 'SPECIAL') {
    return res.status(403).json({ message: 'Kein Zugriff (SPECIAL erforderlich)' });
  }

  next();
}
