// backend/controllers/usersController.js
import User from '../models/User.js';
import Role from '../models/Role.js';
import UserProgress from '../models/userProgress.js';
import Chapter from '../models/chapters.js';

async function ensureRole(name) {
  const [role] = await Role.findOrCreate({ where: { name } });
  return role;
}

// ==============================
// GET /api/users  (ADMIN)
// ==============================
export const listUsers = async (req, res) => {
  try {
    const totalChapters = await Chapter.count();

    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'createdAt'],
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['name'],
          through: { attributes: [] },
        },
        {
          model: UserProgress,
          attributes: ['started', 'completed'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const result = users.map((u) => {
      const progresses = u.UserProgresses || [];
      const completedCount = progresses.filter(p => p.completed).length;
      const startedCount = progresses.filter(p => p.started).length;

      let status = 'Nicht begonnen';
      if (completedCount === totalChapters && totalChapters > 0) {
        status = 'Abgeschlossen';
      } else if (startedCount > 0) {
        status = 'In Bearbeitung';
      }

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
        roles: (u.roles || []).map(r => r.name),
        status,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fehler beim Laden der Benutzer' });
  }
};

// ==============================
// POST /api/users/roles (ADMIN)
// ==============================
export const updateRoleByEmails = async (req, res) => {
  try {
    const { emails, role, action } = req.body;

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: 'emails[] required' });
    }
    if (!role) {
      return res.status(400).json({ message: 'role required' });
    }

    const roleObj = await ensureRole(role);
    const users = await User.findAll({ where: { email: emails } });

    for (const user of users) {
      if (action === 'remove') {
        await user.removeRole(roleObj);
      } else {
        await user.addRole(roleObj);
      }
    }

    res.json({
      message: 'Roles updated',
      updated: users.map(u => u.email),
      role,
      action: action || 'add',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fehler beim Aktualisieren der Rollen' });
  }
};
