const taskRoutes = require('./taskRoute');
const reportRoutes = require('./reportRoute');
const resetPass = require('../../passwordReset');
const authRoutes = require('./authRoute');

module.exports = {
  taskRoutes,
  reportRoutes,
  resetPass,
  authRoutes,
};
