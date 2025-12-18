import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: DataTypes.STRING,

  email: {
    type: DataTypes.STRING,
    unique: true,
  },

  googleId: DataTypes.STRING,
  googleToken: DataTypes.TEXT,
  profileImage: DataTypes.STRING,

  isNewUser: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  role: {
    type: DataTypes.ENUM('USER', 'SPECIAL'),
    defaultValue: 'USER',
  },
});

export default User;
