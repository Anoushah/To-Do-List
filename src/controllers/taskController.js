const Task = require('../models/task');
const User = require('../models/user');
const Sequelize = require('sequelize');

// Create a new task
exports.createTask = async (req, res) => {
  const { title, description, status, dueDateTime } = req.body;
  const userId = req.user.userId;
  const uploadedFile = req.file;
  const fileAbsolutePath = uploadedFile ? uploadedFile.path : null;
  
  try {
    const taskCount = await Task.count({ where: { userId } });
    
    if (taskCount >= 50) {
      return res.status(401).json({ error: "You can't have more than 50 tasks" });
    }
    
    const newTask = await Task.create({
      title,
      description,
      status,
      userId,
      dueDateTime,
      fileUrl: fileAbsolutePath,
    });
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating task' });
  }
};

// Get all tasks for a user
exports.getAllTasks = async (req, res) => {
  const userId = req.user.userId;

  try {
    const tasks = await Task.findAll({ where: { userId } });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};
// Download a task file
exports.downloadTaskFile = async (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.user.userId; 
    try {
      const task = await Task.findOne({
        where: {
          userId, 
          taskNumber: taskId, 
          fileUrl: { [Sequelize.Op.ne]: null } 
        }
      });
      if (!task) {
        console.error('Task not found or does not belong to the user:', taskId);
        return res.status(404).json({ error: 'Task not found' });
      }
      console.log('Downloading file:', task.fileUrl);
      res.setHeader('Content-Type', 'application/octet-stream');      
      const suggestedFilename = 'downloaded_file.txt';
      res.setHeader('Content-Disposition', `attachment; filename="${suggestedFilename}"`);
      res.download(task.fileUrl, suggestedFilename);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error downloading file' });
    }
  };
// Update a task
exports.updateTask = async (req, res) => {
  const userId = req.user.userId;
  const { title, description, status } = req.body;
  const taskNumber = req.params.taskNumber;
  
  try {
    const updateValues = {
      title: title || Sequelize.literal('title'),
      description: description || Sequelize.literal('description'),
      status: status || Sequelize.literal('status'),
    };

    if (status === 'true') {
      updateValues.completionDateTime = new Date();
    }

    if (req.file) {
      updateValues.fileUrl = req.file.path;
    }

    const [updatedCount] = await Task.update(
      updateValues,
      { where: { userId, taskNumber } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating task' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
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
};
