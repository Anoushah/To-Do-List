const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const sequelize = require('../config');
const authenticateToken = require('../authMiddleware');

router.get('/open-tasks', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const openedTasks = await Task.findAll({
      attributes: [
        [sequelize.fn('to_char', sequelize.col('createdAt'), 'Day'), 'dayOfWeek'],
        [sequelize.fn('count', sequelize.col('taskNumber')), 'taskCount'],
      ],
      where: {
        userId,
      },
      group: [sequelize.fn('to_char', sequelize.col('createdAt'), 'Day')],
      order: [sequelize.fn('to_char', sequelize.col('createdAt'), 'Day')],
    });

    res.status(200).json({ openedTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching task counts by day of the week' });
  }
});

module.exports = router;
