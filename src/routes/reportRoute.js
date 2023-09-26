const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController');
const { sendDailyReminders } = require('../controllers/reportController');

router.get('/average-tasks', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await reportController.calculateAverageTasks(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error calculating average tasks' });
  }
});

router.get('/count-tasks', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await reportController.calculateCountTasks(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error calculating task counts' });
  }
});

router.get('/max-tasks', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await reportController.calculateMaxTasks(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error calculating max tasks' });
  }
});

router.get('/opened-tasks', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await reportController.calculateOpenedTasks(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error calculating opened tasks' });
  }
});

router.get('/overdue-tasks', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await reportController.calculateOverdueTasks(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error calculating overdue tasks' });
  }
});
router.get('/similar-tasks', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
      const result = await reportController.calculateSimilarTasks(userId);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching and comparing tasks' });
    }
  });

  router.get('/send-daily-reminders', async (req, res) => {
    try {
      await sendDailyReminders();
  
      res.status(200).json({ message: 'Daily reminders sent successfully' });
    } catch (error) {
      console.error('Error sending daily reminders:', error);
      res.status(500).json({ error: 'Error sending daily reminders' });
    }
  });
  
  
module.exports = router;
