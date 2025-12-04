// backend/models/Chapter.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Chapter = sequelize.define('Chapter', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // z.B. "brandfall", "flucht-und-rettungswege"
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false, // z.B. "Verhalten im Brandfall"
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Reihenfolge im Kurs
  },
  heroImage: {
    type: DataTypes.STRING, // z.B. "/media/images/brandfall_header.png"
    allowNull: true,
  },
  introVideo: {
    type: DataTypes.STRING, // z.B. "/media/videos/htl_brandfall_intro.mp4"
    allowNull: true,
  },
});

export default Chapter;
