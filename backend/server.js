import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';

import './models/User.js';
import './models/chapters.js';
import './models/ChapterSlide.js';
import './models/UserProgress.js';

import { seedChapters } from './seed/seedChapters.js';

import chaptersRoutes from './routes/chapters.js';
import progressRoutes from './routes/progress.js';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/chapters', chaptersRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/users', usersRoutes);

app.get('/', (req, res) => res.send('Brandschutz API läuft'));

const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(async () => {
    console.log('DB synced successfully');
    await seedChapters();
    app.listen(PORT, () => console.log(`Server auf http://localhost:${PORT}`));
  })
  .catch((err) => console.error('DB sync error:', err));
