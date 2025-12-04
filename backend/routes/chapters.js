import express from 'express';
import Chapter from '../models/chapters.js';
import ChapterSlide from '../models/ChapterSlide.js';

const router = express.Router();

// GET /api/chapters  -> Liste für Übersicht
router.get('/', async (req, res) => {
  try {
    const chapters = await Chapter.findAll({
      order: [['order', 'ASC']],
      attributes: ['id', 'slug', 'title', 'order', 'heroImage', 'introVideo'],
    });

    res.json(chapters);
  } catch (err) {
    console.error('Error fetching chapters:', err);
    res.status(500).json({ message: 'Failed to fetch chapters.' });
  }
});

// GET /api/chapters/:slug  -> einzelnes Kapitel mit Slides
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

export default router;
