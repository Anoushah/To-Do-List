const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const authenticateToken = require('../authMiddleware');
const { Op } = require('sequelize');

router.get('/overdue-tasks', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const currentDate = new Date();

    const overdueTasks = await Task.count({
      where: {
        userId,
        status: 'false', 
        dueDateTime: {
          [Op.lt]: currentDate, 
        },
      },
    });

    res.status(200).json({ overdueTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching overdue task count' });
  }
});

module.exports = router;
