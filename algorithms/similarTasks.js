const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const authenticateToken = require('../authMiddleware');

router.get('/similar-tasks', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
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
      return res.status(404).json({ error: 'No similar tasks exist' });
    }
    res.status(200).json({ similarTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching and comparing tasks' });
  }
});

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

module.exports = router;
