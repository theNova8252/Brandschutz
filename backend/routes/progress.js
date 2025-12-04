import express from 'express';
import UserProgress from '../models/UserProgress.js';
import Chapter from '../models/chapters.js';

const router = express.Router();

// Liste aller Fortschritte des Users
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

// NEU: Fortschritt für EIN Kapitel holen
router.get('/:chapterId', async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });

    const { chapterId } = req.params;

    const record = await UserProgress.findOne({
      where: { userId: req.session.userId, chapterId },
    });

    res.json(record || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching chapter progress' });
  }
});

// NEU: Fortschritt (started + lastSlideIndex) speichern/aktualisieren
router.post('/update/:chapterId', async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });

    const { chapterId } = req.params;
    const { lastSlideIndex } = req.body;

    let record = await UserProgress.findOne({
      where: { userId: req.session.userId, chapterId },
    });

    if (!record) {
      record = await UserProgress.create({
        userId: req.session.userId,
        chapterId,
        started: true,
        completed: false,
        lastSlideIndex: lastSlideIndex ?? 0,
      });
    } else {
      record.started = true;
      if (typeof lastSlideIndex === 'number' && lastSlideIndex > (record.lastSlideIndex ?? 0)) {
        record.lastSlideIndex = lastSlideIndex;
      }
      await record.save();
    }

    res.json({ success: true, progress: record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating progress' });
  }
});

// Kapitel als abgeschlossen markieren (deins leicht erweitert)
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
        started: true,
        completed: true,
        completedAt: new Date(),
        lastSlideIndex: 9999, // "alles durch" – oder chapter.slides.length - 1, wenn du willst
      });
    } else {
      record.started = true;
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
