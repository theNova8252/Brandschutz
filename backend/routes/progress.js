import express from 'express';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import crypto from 'crypto';
import authMiddleware from '../middleware/auth.js';
import UserProgress from '../models/userProgress.js';
import Chapter from '../models/chapters.js';
import Certificate from '../models/certificate.js';

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


// User abgeschlossen?
router.get('/all-completed', async (req, res) => {
  try {
    const totalChapters = await Chapter.count();

    const completedCount = await UserProgress.count({
      where: {
        userId: req.user.id,
        completed: true,
      },
    });

    res.json({
      allCompleted: completedCount === totalChapters && totalChapters > 0,
      completedCount,
      totalChapters,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fehler beim Prüfen des Abschlusses' });
  }
});

// zertifikat
router.get('/certificate', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const chapters = await Chapter.findAll();
    const completed = await UserProgress.findAll({
      where: { userId, completed: true },
    });
    const certificateId = crypto.randomBytes(6).toString('hex').toUpperCase();
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyUrl = `${FRONTEND_URL}/verify/${certificateId}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl);

    if (completed.length !== chapters.length) {
      return res.status(403).json({ message: 'Nicht alle Kapitel abgeschlossen' });
    }

    await Certificate.create({
  userId,
  certificateId,
});


    // PDF erzeugen
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=brandschutz-zertifikat.pdf'
    );

    doc.pipe(res);

    // Inhalt
    doc
      .fontSize(22)
      .text('ZERTIFIKAT', { align: 'center' })
      .moveDown(2);

    doc
      .fontSize(14)
      .text('Hiermit wird bestätigt, dass', { align: 'center' })
      .moveDown(1);

    doc
      .fontSize(18)
      .text(req.user.name, { align: 'center', underline: true })
      .moveDown(1);

    const date = new Date().toLocaleDateString('de-AT');

    doc
      .fontSize(14)
      .text(
        `am ${date} alle Kapitel der Brandschutz-Schulung erfolgreich abgeschlossen hat.`,
        { align: 'center' }
      )
      .moveDown(4);

    doc.text('Unterschrift:', { align: 'left' });
    doc.moveDown(2);
    doc.text('______________________________');

      doc.moveDown(3);

doc.fontSize(10).text(`Zertifikats-ID: ${certificateId}`, {
  align: 'center',
});

doc.moveDown(1);

// QR-Code mittig anzeigen
console.log('QR:', qrDataUrl?.substring(0, 30));

doc.image(qrDataUrl, {
  fit: [120, 120],
  align: 'center',
});


    doc.end();
  } catch (err) {
    console.error('PDF ERROR', err);
    res.status(500).json({ message: 'PDF konnte nicht erstellt werden' });
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
