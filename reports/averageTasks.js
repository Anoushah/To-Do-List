const express = require('express');
const router = express.Router();
const Task = require('../models/task'); 
const User = require('../models/user')
const authenticateToken = require('../authMiddleware');

router.get('/average-tasks', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; 
    const user = await User.findByPk(userId);
    if(!user){
        return res.status(404).json({error: 'User not found'});
    }
    const accountCreatedOn = user.createdAt
    const currentDate = new Date();
    const TotalDays =  Math.trunc((currentDate - accountCreatedOn) / (24*60*60*1000)); 

    const completedTasks = await Task.count({ where: { userId, status: 'Done' } });

    const averageTaskPerDay = completedTasks / TotalDays;

    res.status(200).json({
      averageTaskPerDay,
      });
      } catch (err) {
        console.error(err);
        res.sendStatus(500).json({error: 'Tasks not found'});
      }
      });
module.exports= router
