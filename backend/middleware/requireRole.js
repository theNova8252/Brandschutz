export const requireRole = (roleName) => (req, res, next) => {
  const roles = req.userRoleNames || [];
  if (!roles.includes(roleName)) return res.status(403).json({ message: 'Forbidden' });
  next();
};
