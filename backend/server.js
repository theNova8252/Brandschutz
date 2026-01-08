// backend/server.js
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';

import './models/User.js';
import './models/chapters.js';
import './models/ChapterSlide.js';
import './models/userProgress.js';
import './models/certificate.js';

import { seedChapters } from './seed/seedChapters.js';

import chaptersRoutes from './routes/chapters.js';
import progressRoutes from './routes/progress.js';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import certificateRoutes from './routes/certificate.js';
import { seedRoles } from './seed/seedRoles.js';

dotenv.config();

const app = express();

// Falls du später hinter Proxy/Render/Heroku bist:
app.set('trust proxy', 1);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use(
  session({
    name: 'connect.sid',
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // in PROD (https) muss secure=true sein:
      secure: process.env.NODE_ENV === 'production',
      // bei Cross-Site (Frontend/Backend andere Domain) brauchst du sameSite:'none' + secure:true
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/chapters', chaptersRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/certificate', certificateRoutes);

app.get('/', (req, res) => res.send('Brandschutz API läuft'));

const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(async () => {
    console.log('DB synced successfully');
    const Chapter = (await import('./models/chapters.js')).default;

    const chapterCount = await Chapter.count();
    if (chapterCount === 0) {
      console.log('Seeding chapters (first run)...');
      await seedChapters();
    } else {
      console.log(`Skip seedChapters (already ${chapterCount} chapters in DB)`);
    }
    await seedRoles();

    app.listen(PORT, () => console.log(`Server auf http://localhost:${PORT}`));
  })
  .catch((err) => console.error('DB sync error:', err));



  