// backend/models/User.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

import Role from './Role.js';
import UserRole from './UserRole.js';

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    googleId: DataTypes.STRING,
    googleToken: DataTypes.TEXT,
    profileImage: DataTypes.STRING,
    isNewUser: { type: DataTypes.BOOLEAN, defaultValue: true },

    // falls das in deiner DB existiert: lass es als legacy drin (optional)
    role: DataTypes.STRING,
  },
  {
    tableName: 'Users',
  }
);

// Many-to-Many Rollen
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: 'user_id',
  otherKey: 'role_id',
  as: 'roles',
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: 'role_id',
  otherKey: 'user_id',
  as: 'users',
});

export default User;
