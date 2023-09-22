const express = require('express');
const router = express.Router();
const Task = require('../models/task'); 
const authenticateToken = require('../authMiddleware');

router.get('/count-tasks', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; 
    const totalTasks = await Task.count({ where: { userId } });

    const completedTasks = await Task.count({ where: { userId, status: 'Done' } });

    const remainingTasks = totalTasks - completedTasks;

    res.status(200).json({
      totalTasks,
      completedTasks,
      remainingTasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching task counts' });
  }
});

module.exports = router;
