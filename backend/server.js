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


dotenv.config();

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:9000'],
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

import authRoutes from './routes/auth.js';
app.use('/api/auth', authRoutes);
app.use('/api/chapters', chaptersRoutes);
app.use('/api/progress', progressRoutes);

app.get('/', (req, res) => res.send('Brandschutz API läuft'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server auf http://localhost:${PORT}`));
sequelize
  .sync()
  .then(async () => {console.log('DB synced successfully'); await seedChapters();})
  .catch((err) => console.error('DB sync error:', err));