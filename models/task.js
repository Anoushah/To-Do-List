const Sequelize = require('sequelize');
const sequelize = require('../config');
const User = require('./user');

const Task = sequelize.define('task', {
  taskNumber: {
    type: Sequelize.INTEGER,
    primaryKey: true, 
    autoIncrement: true, 
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: 'To Do',
  },
  fileUrl: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task, { foreignKey: 'userId' });

Task.addHook('beforeCreate', async (task, options) => {
  const user = await User.findByPk(task.userId);
  if (user) {
    const tasksCount = await Task.count({ where: { userId: task.userId } });
    task.taskNumber = tasksCount + 1; 
  }
});
module.exports = Task;
