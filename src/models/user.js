const Sequelize = require('sequelize');
const sequelize = require('../config/config');

const User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  resetToken: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  },
  isVerified: {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false, 
  },
  verificationToken: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true, 
  }
}, {
  tableName: 'users',
});

module.exports = User;
