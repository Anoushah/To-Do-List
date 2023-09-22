const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const sequelize = require('../config'); 
const authenticateToken = require('../authMiddleware');

router.get('/max-tasks', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await Task.findOne({
      attributes: [
        [sequelize.fn('date', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('count', sequelize.col('taskNumber')), 'taskCount'],
      ],
      where: {
        userId,
        status: 'Done',
      },
      group: [sequelize.fn('date', sequelize.col('createdAt'))],
      order: [[sequelize.fn('count', sequelize.col('taskNumber')), 'DESC']],
    });

    if (!result) {
      return res.status(404).json({ error: 'No completed tasks' });
    }

    const maxTasksDate = result.get('date');
    const maxTasksCompleted = result.get('taskCount');

    res.status(200).json({ date: maxTasksDate, maxTasksCompleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error finding data' });
  }
});

module.exports = router;
