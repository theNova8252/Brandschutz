import express from 'express';
import Chapter from '../models/chapters.js';
import ChapterSlide from '../models/ChapterSlide.js';
import authMiddleware from '../middleware/auth.js';
import UserProgress from '../models/userProgress.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const chapters = await Chapter.findAll({
      order: [['order', 'ASC']],
      attributes: ['id', 'slug', 'title', 'order', 'heroImage', 'introVideo'],
    });

    // Fortschritt vom User holen
    const progress = await UserProgress.findAll({
      where: { userId: req.user.id },
      attributes: ['chapterId', 'completed'],
    });

    const completedMap = new Map(progress.map(p => [p.chapterId, !!p.completed]));
    // - erstes Kapitel immer unlocked
    // - jedes weitere: unlocked nur wenn vorheriges completed ist
    const result = chapters.map((chap, idx) => {
      const prevChapter = idx > 0 ? chapters[idx - 1] : null;
      const unlocked = !prevChapter || completedMap.get(prevChapter.id) === true;

      return {
        ...chap.toJSON(),
        locked: !unlocked,
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching chapters:', err);
    res.status(500).json({ message: 'Failed to fetch chapters.' });
  }
});


router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const chapter = await Chapter.findOne({
      where: { slug },
      include: [
        {
          model: ChapterSlide,
          as: 'slides',
        },
      ],
      order: [
        ['order', 'ASC'],
        [{ model: ChapterSlide, as: 'slides' }, 'order', 'ASC'],
      ],
    });

    if (!chapter) {
      return res.status(404).json({ message: 'Kapitel nicht gefunden.' });
    }

    res.json(chapter);
  } catch (err) {
    console.error('Error fetching chapter:', err);
    res.status(500).json({ message: 'Failed to fetch chapter.' });
  }
});
router.get('/:id/summary', async (req, res) => {
  try {
    const chapter = await Chapter.findOne({
      where: { id: req.params.id },
      include: [{ model: ChapterSlide }],
    });

    if (!chapter) return res.status(404).json({ message: 'Not found' });

    const summary = chapter.ChapterSlides.find((s) => s.type === 'summary');

    res.json(summary || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error loading summary' });
  }
});


export default router;
