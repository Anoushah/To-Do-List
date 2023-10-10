const { Op } = require('sequelize');
const Task = require('../models/task');
const User = require('../models/user');
const sequelize = require('../config/config');
const nodemailer = require('nodemailer');

const dbuser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

async function calculateAverageTasks(userId) {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const accountCreatedOn = user.createdAt;
    const currentDate = new Date();
    const totalDays = Math.trunc((currentDate - accountCreatedOn) / (24 * 60 * 60 * 1000));

    const completedTasks = await Task.count({ where: { userId, status: 'true' } });

    const averageTaskPerDay = completedTasks / totalDays;

    return { averageTaskPerDay };
  } catch (error) {
    throw error;
  }
}

async function calculateCountTasks(userId) {
  try {
    const totalTasks = await Task.count({ where: { userId } });
    const completedTasks = await Task.count({ where: { userId, status: 'true' } });
    const remainingTasks = totalTasks - completedTasks;

    return { totalTasks, completedTasks, remainingTasks };
  } catch (error) {
    throw error;
  }
}
async function calculateMaxTasks(userId) {
  try {
    const result = await Task.findOne({
      attributes: [
        [sequelize.fn('date', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('count', sequelize.col('taskNumber')), 'taskCount'],
      ],
      where: {
        userId,
        status: 'true',
      },
      group: [sequelize.fn('date', sequelize.col('createdAt'))],
      order: [[sequelize.fn('count', sequelize.col('taskNumber')), 'DESC']],
    });

    if (!result) {
      throw new Error('No completed tasks');
    }

    const maxTasksDate = result.get('date');
    const maxTasksCompleted = result.get('taskCount');

    return { date: maxTasksDate, maxTasksCompleted };
  } catch (error) {
    throw error;
  }
}

async function calculateOpenedTasks(userId) {
  try {
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

    return { openedTasks };
  } catch (error) {
    throw error;
  }
}

async function calculateOverdueTasks(userId) {
  try {
    const currentDate = new Date();
    const overdueTasks = await Task.count({
      where: {
        userId,
        status: 'False',
        dueDateTime: {
            '$lt': currentDate,
        },
      },
    });

    return { overdueTasks };
  } catch (error) {
    throw error;
  }
}
async function calculateSimilarTasks(userId) {
    try {
      const tasks = await Task.findAll({ where: { userId } });
      const similarTasks = [];
      const presentPair = new Set();
  
      for (let i = 0; i < tasks.length; i++) {
        for (let j = i + 1; j < tasks.length; j++) {
          const A = tasks[i];
          const B = tasks[j];
  
          const pairTasks = `${A.id}-${B.id}`;
          if (!presentPair.has(pairTasks) && taskSimilarity(A, B)) {
            similarTasks.push({ task: A, similarTasktoprevious: B });
            presentPair.add(pairTasks);
          }
        }
      }
      if (similarTasks.length === 0) {
        throw new Error('No similar tasks exist');
      }
      return { similarTasks };
    } catch (error) {
      throw error;
    }
  }
  function taskSimilarity(taskA, taskB) {
    const descriptionA = taskA.description.toLowerCase();
    const descriptionB = taskB.description.toLowerCase();
  
    const wordPattern = /\b\w+\b/g;
  
    const wordsA = descriptionA.match(wordPattern);
    const wordsB = descriptionB.match(wordPattern);
  
    const intersection = wordsA.filter(word => wordsB.includes(word));
    const minSharedWords = 5;
  
    return intersection.length >= minSharedWords;
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: dbuser,
        pass: dbPassword,
    },
  });

  async function sendDailyReminders() {
    try {
      const currentDate = new Date();
      
      const startOfDay = new Date(currentDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(currentDate);
      endOfDay.setUTCHours(23, 59, 59, 999);
  
      const tasks = await Task.findAll({
        where: {
          dueDateTime: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
        include: User, 
      });
  
      for (const task of tasks) {
        const user = task.User;
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${user.resetToken}`;
        const mailOptions = {
          from: dbuser,
          to: user.email,
          subject: 'Task Reminder',
          text: `Hi ${user.username},\n\nYou have a task due today: ${task.title}\n\nClick the following link for more details: ${resetLink}`,
        };
  
        await transporter.sendMail(mailOptions);
      }
  
      console.log('Daily reminders sent successfully');
    } catch (error) {
      console.error('Error sending daily reminders:', error);
    }
  }
module.exports = {
  calculateAverageTasks,
  calculateCountTasks,
  calculateMaxTasks,
  calculateOpenedTasks,
  calculateOverdueTasks,
  calculateSimilarTasks,
  sendDailyReminders,
};
