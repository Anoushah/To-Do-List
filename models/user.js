// models/user.js
const Sequelize = require('sequelize');
const sequelize = require('../config');

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
  }
}, {
  tableName: 'users',
});

module.exports = User;
