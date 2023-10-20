import { Request, Response } from 'express';
import Task from '../models/task';
import User from '../models/user';
import Sequelize from 'sequelize';
import { Op } from 'sequelize';
import multer from 'multer';

const upload = multer({ dest: 'your_upload_directory' });

export const createTask = async (req: Request, res: Response) => {
  const { taskNumber, title, description, status, dueDateTime } = req.body;
  const userId = (req.user as any).userId;
  const uploadedFile = (req as any).file;
  const fileAbsolutePath = uploadedFile ? uploadedFile.path : null;

  try {
    const taskCount = await Task.count({ where: { userId } });

    if (taskCount >= 50) {
      return res.status(401).json({ error: "You can't have more than 50 tasks" });
    }

    const newTask: Task = await Task.create({
      taskNumber,
      title,
      description,
      status,
      dueDateTime,
      fileUrl: fileAbsolutePath,
      userId,
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating task' });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  const userId = (req.user as any).userId;

  try {
    const tasks = await Task.findAll({ where: { userId } });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};

export const downloadTaskFile = async (req: Request, res: Response) => {
  const taskId = req.params.taskNumber;
  const userId = (req.user as any).userId;

  try {
    const task: Task | null = await Task.findByPk(taskId);

    if (!task || task.userId !== userId || task.fileUrl === null) {
      console.error('Task not found or does not belong to the user:', taskId);
      return res.status(404).json({ error: 'Task not found' });
    }

    console.log('Downloading file:', task.fileUrl);
    res.setHeader('Content-Type', 'application/octet-stream');
    const suggestedFilename = 'downloaded_file.txt';
    res.setHeader('Content-Disposition', `attachment; filename="${suggestedFilename}"`);
    res.download(task.fileUrl as string, suggestedFilename);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error downloading file' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const userId = (req.user as any).userId;
  const { title, description, status } = req.body;
  const taskNumber = req.params.taskNumber;

  try {
    const updateValues: any = {
      title: title || Sequelize.literal('title'),
      description: description || Sequelize.literal('description'),
      status: status || Sequelize.literal('status'),
    };

    if (status === 'true') {
      updateValues.completionDateTime = new Date();
    }

    if (req.file) {
      updateValues.fileUrl = (req.file as Express.Multer.File).path;
    }

    const [updatedCount] = await Task.update(updateValues, { where: { userId, taskNumber } });

    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const taskNumber = req.params.taskNumber;
  const userId = (req.user as any).userId;

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
