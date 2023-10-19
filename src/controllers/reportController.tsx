import { Op, Model } from 'sequelize';
import nodemailer from 'nodemailer';
import sequelize from '../config/config';

import Task from '../models/task';
import User from '../models/user';

const dbuser: string | undefined = process.env.DB_USER;
const dbPassword: string | undefined = process.env.DB_PASSWORD;

async function calculateAverageTasks(userId: number) {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const accountCreatedOn = user.createdAt as Date;
    const currentDate = new Date();
    const totalDays = Math.trunc((currentDate.getTime() - accountCreatedOn.getTime()) / (24 * 60 * 60 * 1000));

    const completedTasks = await Task.count({ where: { userId, status: 'true' } });

    const averageTaskPerDay = completedTasks / totalDays;

    return { averageTaskPerDay };
  } catch (error) {
    throw error;
  }
}

async function calculateCountTasks(userId: number) {
  try {
    const totalTasks = await Task.count({ where: { userId } });
    const completedTasks = await Task.count({ where: { userId, status: 'true' } });
    const remainingTasks = totalTasks - completedTasks;

    return { totalTasks, completedTasks, remainingTasks };
  } catch (error) {
    throw error;
  }
}

async function calculateMaxTasks(userId: number) {
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

    const maxTasksDate = result.get('date') as Date;
    const maxTasksCompleted = result.get('taskCount');

    return { date: maxTasksDate, maxTasksCompleted };
  } catch (error) {
    throw error;
  }
}

async function calculateOpenedTasks(userId: number) {
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

async function calculateOverdueTasks(userId: number) {
  try {
    const currentDate = new Date();
    const overdueTasks = await Task.count({
      where: {
        userId,
        status: 'False',
        dueDateTime: {
          [Op.lt]: currentDate,
        },
      },
    });

    return { overdueTasks };
  } catch (error) {
    throw error;
  }
}

async function calculateSimilarTasks(userId: number) {
  try {
    const tasks = await Task.findAll({ where: { userId } });
    const similarTasks = [];
    const presentPair = new Set<string>();

    for (let i = 0; i < tasks.length; i++) {
      for (let j = i + 1; j < tasks.length; j++) {
        const A = tasks[i];
        const B = tasks[j];

        const idA = A.getDataValue('taskNumber');
        const idB = B.getDataValue('taskNumber');
        const descriptionA = A.getDataValue('description');
        const descriptionB = B.getDataValue('description');

        if (idA !== undefined && idB !== undefined && descriptionA !== undefined && descriptionB !== undefined) {
          const pairTasks = `${idA}-${idB}`;
          if (!presentPair.has(pairTasks) && taskSimilarity(descriptionA, descriptionB)) {
            similarTasks.push({ task: A, similarTasktoprevious: B });
            presentPair.add(pairTasks);
          }
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


function taskSimilarity(descriptionA: string, descriptionB: string): boolean {
  const wordsA = descriptionA.toLowerCase().match(/\b\w+\b/g);
  const wordsB = descriptionB.toLowerCase().match(/\b\w+\b/g);

  if (!wordsA || !wordsB) {
    return false;
  }

  const intersection = wordsA.filter(word => wordsB.includes(word));
  const minSharedWords = 5;

  return intersection.length >= minSharedWords;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: dbuser || '',
    pass: dbPassword || '',
  },
});

export {
  calculateAverageTasks,
  calculateCountTasks,
  calculateMaxTasks,
  calculateOpenedTasks,
  calculateOverdueTasks,
  calculateSimilarTasks,
};
