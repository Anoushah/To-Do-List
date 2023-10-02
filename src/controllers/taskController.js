const Task = require('../models/task');
const User = require('../models/user');
const Sequelize = require('sequelize');

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Endpoints for managing tasks
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task.
 *     description: Creates a new task for the authenticated user.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: title
 *         type: string
 *         description: The title of the task.
 *       - in: formData
 *         name: description
 *         type: string
 *         description: The description of the task.
 *       - in: formData
 *         name: status
 *         type: string
 *         enum: [true, false]
 *         description: The status of the task (true for completed, false for incomplete).
 *       - in: formData
 *         name: dueDateTime
 *         type: string
 *         format: date-time
 *         description: The due date and time of the task.
 *       - in: formData
 *         name: file
 *         type: file
 *         description: An optional file attachment for the task.
 *     responses:
 *       201:
 *         description: Task created successfully.
 *       401:
 *         description: Maximum task limit reached.
 *       500:
 *         description: Error creating task.
 *
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 */
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
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks for the authenticated user.
 *     description: Retrieves all tasks for the authenticated user.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully.
 *       500:
 *         description: Error fetching tasks.
 *
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 */
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
/**
 * @swagger
 * /tasks/{taskId}/download:
 *   get:
 *     summary: Download a task file.
 *     description: Downloads the file attachment of a specific task.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         type: integer
 *         description: The ID of the task to download the file from.
 *     responses:
 *       200:
 *         description: File download successful.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Error downloading file.
 *
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 */
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

/**
 * @swagger
 * /tasks/{taskNumber}:
 *   put:
 *     summary: Update a task.
 *     description: Updates a specific task for the authenticated user.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskNumber
 *         required: true
 *         type: integer
 *         description: The task number of the task to update.
 *       - in: formData
 *         name: title
 *         type: string
 *         description: The updated title of the task.
 *       - in: formData
 *         name: description
 *         type: string
 *         description: The updated description of the task.
 *       - in: formData
 *         name: status
 *         type: string
 *         enum: [true, false]
 *         description: The updated status of the task (true for completed, false for incomplete).
 *       - in: formData
 *         name: file
 *         type: file
 *         description: An optional file attachment for the task.
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Error updating task.
 *
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 */
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
/**
 * @swagger
 * /tasks/{taskNumber}:
 *   delete:
 *     summary: Delete a task.
 *     description: Deletes a specific task for the authenticated user.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskNumber
 *         required: true
 *         type: integer
 *         description: The task number of the task to delete.
 *     responses:
 *       204:
 *         description: Task deleted successfully.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Error deleting task.
 *
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 */
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