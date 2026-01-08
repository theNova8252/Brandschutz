// backend/models/UserRole.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const UserRole = sequelize.define(
  'UserRole',
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: 'user_roles',
    timestamps: false, 
  }
);

export default UserRole;
