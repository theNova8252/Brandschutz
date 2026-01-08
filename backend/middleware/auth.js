// backend/middleware/auth.js
import User from '../models/User.js';
import Role from '../models/Role.js';

async function ensureRole(name) {
  const [role] = await Role.findOrCreate({ where: { name } });
  return role;
}

export default async function authMiddleware(req, res, next) {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    // User inkl. Rollen laden
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'profileImage'],
      include: [{ model: Role, as: 'roles', attributes: ['name'], through: { attributes: [] } }],
    });

    if (!user) return res.status(401).json({ message: 'User not found' });

    // ✅ Garantie: jeder User hat mindestens USER
    const roleNames = (user.roles || []).map(r => r.name);
    if (!roleNames.includes('USER')) {
      const userRole = await ensureRole('USER');
      await user.addRole(userRole);

      // Reload, damit req.userRoleNames korrekt ist
      const refreshed = await User.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'profileImage'],
        include: [{ model: Role, as: 'roles', attributes: ['name'], through: { attributes: [] } }],
      });

      req.user = refreshed;
      req.userRoleNames = (refreshed.roles || []).map(r => r.name);
      return next();
    }

    req.user = user;
    req.userRoleNames = roleNames;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Auth failed' });
  }
}
