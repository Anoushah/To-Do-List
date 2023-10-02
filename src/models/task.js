const Sequelize = require('sequelize');
const sequelize = require('../config/config');
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
  fileUrl: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  dueDateTime: {
    type: Sequelize.DATE, 
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: 'false', 
  },
  completionDateTime: {
    type: Sequelize.DATE, 
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

Task.addHook('beforeUpdate', (task, options) => {
  if (task.changed('status') && task.status === 'true') {
    task.completionDateTime = new Date();
  }
});


module.exports = Task;