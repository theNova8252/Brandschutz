// backend/models/ChapterSlide.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Chapter from './chapters.js';

const ChapterSlide = sequelize.define('ChapterSlide', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  chapterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Chapter,
      key: 'id',
    },
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Reihenfolge in diesem Kapitel
  },
  type: {
    type: DataTypes.ENUM('content', 'video', 'summary'),
    allowNull: false,
    defaultValue: 'content',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT, // ganzer Lerntext
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING, // optionales Bild
    allowNull: true,
  },
  videoUrl: {
    type: DataTypes.STRING, // optionales Video (MP4 / YouTube-Embed)
    allowNull: true,
  },
});

// Associations
Chapter.hasMany(ChapterSlide, {
  foreignKey: 'chapterId',
  as: 'slides',
  onDelete: 'CASCADE',
});
ChapterSlide.belongsTo(Chapter, {
  foreignKey: 'chapterId',
  as: 'chapter',
});

export default ChapterSlide;
