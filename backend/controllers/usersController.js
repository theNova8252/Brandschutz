import User from '../models/User.js';
import UserProgress from '../models/userProgress.js';

function calcStatus(progress) {
  if (!progress || progress.length === 0) return 'nicht begonnen';

  if (progress.some(p => p.completed)) return 'abgeschlossen';

  if (progress.some(p => p.started || (p.lastSlideIndex ?? 0) > 0)) return 'begonnen';

  return 'nicht begonnen';
}

export async function getUsersOverview(req, res) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
      include: [
        {
          model: UserProgress,
          attributes: ['started', 'lastSlideIndex', 'completed'],
          required: false,
        },
      ],
      order: [['id', 'ASC']],
    });

    const result = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: calcStatus(user.UserProgresses),
    }));

    res.json(result);
  } catch (err) {
    console.error('Users overview error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
