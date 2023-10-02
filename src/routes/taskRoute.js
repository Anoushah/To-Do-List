const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const multer = require('multer');
const taskController = require('../controllers/taskController');
const upload = multer({ dest: 'D:/To-Do List/uploads/' });

// Create a new task
router.post('/tasks', authenticateToken, upload.single('file'), taskController.createTask);

// Get all tasks for a user
router.get('/tasks', authenticateToken, taskController.getAllTasks);

// Download a task file
router.get('/tasks/:taskId/download', authenticateToken, taskController.downloadTaskFile);

// Update a task
router.put('/tasks/:taskNumber', authenticateToken, upload.single('file'), taskController.updateTask);

// Delete a task
router.delete('/tasks/:taskNumber', authenticateToken, taskController.deleteTask);

module.exports = router;