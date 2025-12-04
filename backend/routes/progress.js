import express from 'express';
import UserProgress from '../models/UserProgress.js';
import Chapter from '../models/chapters.js';

const router = express.Router();

// 1) Fortschritt abrufen für aktuellen User
router.get('/', async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });

    const progress = await UserProgress.findAll({
      where: { userId: req.session.userId },
      include: [{ model: Chapter }],
    });

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching progress' });
  }
});

// 2) Kapitel als abgeschlossen markieren
router.post('/complete/:chapterId', async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });

    const { chapterId } = req.params;

    let record = await UserProgress.findOne({
      where: { userId: req.session.userId, chapterId },
    });

    if (!record) {
      record = await UserProgress.create({
        userId: req.session.userId,
        chapterId,
        completed: true,
        completedAt: new Date(),
      });
    } else {
      record.completed = true;
      record.completedAt = new Date();
      await record.save();
    }

    res.json({ success: true, progress: record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating progress' });
  }
});

export default router;
