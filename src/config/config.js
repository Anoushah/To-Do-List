const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', '12345678', {
  host: 'localhost',
  dialect: 'postgres', 
  port: 5432, 
  dialectOptions: {
    ssl: false, 
  },
});
 
module.exports = sequelize;
