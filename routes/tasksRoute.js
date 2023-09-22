const express = require('express');
const router = express.Router();
const authenticateToken = require('../authMiddleware');
const Task = require('../models/task');
const multer = require('multer');
const upload = multer({ dest: 'D:/To-Do List/uploads/' });
const Sequelize = require('sequelize');
//Create Tasks
router.post('/tasks', authenticateToken, upload.single('file'), async (req, res) => {
  const { title, description, status } = req.body;
  const userId = req.user.userId;
  const uploadedFile = req.file;
  const fileAbsolutePath = uploadedFile ? uploadedFile.path : null;
  try {
  const taskCount = await Task.count({where: {userId}});
  if (taskCount >= 50){
    return res.status(401).json({error:"You can't have more than 50 tasks"});
  }
    const newTask = await Task.create({
      title,
      description,
      status,
      userId,
      fileUrl: fileAbsolutePath, 
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating task' });
  }
});
//Read Tasks
router.get('/tasks', authenticateToken, async (req, res) => {
  const userId = req.user.userId; 

  try {
    const tasks = await Task.findAll({ where: { userId } });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});
//Download Tasks
router.get('/tasks/:taskId/download', authenticateToken, async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findByPk(taskId);

    if (!task || !task.fileUrl) {
      console.error('File not found or invalid fileUrl:', task ? task.fileUrl : 'task not found');
      return res.status(404).json({ error: 'File not found' });
    }
    console.log('Downloading file:', task.fileUrl);
    const suggestedFilename = 'downloaded_file.txt'; 
    res.setHeader('Content-Disposition', `attachment; filename="${suggestedFilename}"`);
    res.download(task.fileUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error downloading file' });
  }
});
//Update Tasks - With PUT
router.put('/tasks/:taskNumber', authenticateToken, upload.single('file'), async (req, res) => {
  const userId = req.user.userId;
  const { title, description, status } = req.body;
  const taskNumber = req.params.taskNumber;
  try {
    const updateValues = {
      title: title || Sequelize.literal('title'),
      description: description || Sequelize.literal('description'),
      status: status || Sequelize.literal('status'),
    };
    if (req.file) {
      updateValues.fileUrl = req.file.path;
    }
    const [updatedCount] = await Task.update(
      updateValues,
      {where: { userId, taskNumber },}
    );
    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating task' });
  }
});

//Update Tasks - With PATCH
// router.patch('/tasks/:taskNumber', authenticateToken, upload.single('file'), async (req, res) => {
//   const userId = req.user.userId;
//   const { title, description, status } = req.body;
//   const taskNumber = req.params.taskNumber;
//   try {
//     const task = await Task.findOne({ where: { userId, taskNumber } });
//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }
//     if (typeof title !== 'undefined') {
//       task.title = title;
//     }
//     if (typeof description !== 'undefined') {
//       task.description = description;
//     }
//     if (typeof status !== 'undefined') {
//       task.status = status;
//     }
//     if (req.file) {
//       task.fileUrl = req.file.path;
//     }
//     await task.save(); 
//     res.status(200).json({ message: 'Task updated successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error updating task' });
//   }
// });

//Delete Tasks
router.delete('/tasks/:taskNumber', authenticateToken, async (req, res) => {
  const taskNumber = req.params.taskNumber;
  const userId = req.user.userId;

  try {
    const deletedCount = await Task.destroy({ where: { taskNumber, userId } });

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Task does not exist for this user' });
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});


module.exports = router;