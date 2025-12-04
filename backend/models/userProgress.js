import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Chapter from './chapters.js';

const UserProgress = sequelize.define('UserProgress', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' },
  },

  chapterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Chapter, key: 'id' },
  },

  // neu: hat der User das Kapitel überhaupt begonnen?
  started: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  // neu: bei welcher Slide war er zuletzt? (0-basiert)
  lastSlideIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

// RELATIONS
User.hasMany(UserProgress, { foreignKey: 'userId' });
UserProgress.belongsTo(User, { foreignKey: 'userId' });

Chapter.hasMany(UserProgress, { foreignKey: 'chapterId' });
UserProgress.belongsTo(Chapter, { foreignKey: 'chapterId' });

export default UserProgress;
