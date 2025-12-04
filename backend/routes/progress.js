import express from 'express';
import UserProgress from '../models/UserProgress.js';
import Chapter from '../models/chapters.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// ALLE Progress-Routen nur für eingeloggte User
router.use(authMiddleware);

// Liste aller Fortschritte des Users
router.get('/', async (req, res) => {
  try {
    const progress = await UserProgress.findAll({
      where: { userId: req.user.id },
      include: [{ model: Chapter }],
    });

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching progress' });
  }
});

// Fortschritt für EIN Kapitel holen
router.get('/:chapterId', async (req, res) => {
  try {
    const { chapterId } = req.params;

    const record = await UserProgress.findOne({
      where: { userId: req.user.id, chapterId },
    });

    res.json(record || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching chapter progress' });
  }
});

// Start eines Kapitels registrieren
router.post('/start/:chapterId', async (req, res) => {
  try {
    const { chapterId } = req.params;

    const [progress, created] = await UserProgress.findOrCreate({
      where: { userId: req.user.id, chapterId },
      defaults: {
        started: true,
        completed: false,
        completedAt: null,
        lastSlideIndex: 0,
      },
    });

    // falls es schon existiert, started auf true setzen
    if (!created && !progress.started) {
      progress.started = true;
      await progress.save();
    }

    res.json(progress);
  } catch (err) {
    console.error('Error creating/reading UserProgress:', err);
    res.status(500).json({ message: 'Konnte Fortschritt nicht speichern.' });
  }
});

// Fortschritt (Slide-Index) aktualisieren
router.post('/update/:chapterId', async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { lastSlideIndex } = req.body;

    let record = await UserProgress.findOne({
      where: { userId: req.user.id, chapterId },
    });

    if (!record) {
      record = await UserProgress.create({
        userId: req.user.id,
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

// Kapitel abschließen
router.post('/complete/:chapterId', async (req, res) => {
  try {
    const { chapterId } = req.params;

    let record = await UserProgress.findOne({
      where: { userId: req.user.id, chapterId },
    });

    if (!record) {
      record = await UserProgress.create({
        userId: req.user.id,
        chapterId,
        started: true,
        completed: true,
        completedAt: new Date(),
        lastSlideIndex: 9999,
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
