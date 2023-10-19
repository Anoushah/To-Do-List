import express, { Request, Response } from 'express';
import authenticateToken from '../middleware/authMiddleware';
import * as reportController from '../controllers/reportController';

const router = express.Router();

router.get('/average-tasks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId;
    const result = await reportController.calculateAverageTasks(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error calculating average tasks' });
  }
});

router.get('/count-tasks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId;
    const result = await reportController.calculateCountTasks(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error calculating task counts' });
  }
});

router.get('/max-tasks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId;
    const result = await reportController.calculateMaxTasks(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error calculating max tasks' });
  }
});

router.get('/opened-tasks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId;
    const result = await reportController.calculateOpenedTasks(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error calculating opened tasks' });
  }
});

router.get('/overdue-tasks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId;
    const result = await reportController.calculateOverdueTasks(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error calculating overdue tasks' });
  }
});

router.get('/similar-tasks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId;
    const result = await reportController.calculateSimilarTasks(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching and comparing tasks' });
  }
});


export default router;
