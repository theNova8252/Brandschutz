import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Certificate = sequelize.define('Certificate', {
  certificateId: {
    type: DataTypes.STRING,
    unique: true,
  },
  issuedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

User.hasOne(Certificate, { foreignKey: 'userId' });
Certificate.belongsTo(User, { foreignKey: 'userId' });

export default Certificate;
