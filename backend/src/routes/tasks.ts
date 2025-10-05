import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  bucketId: z.string(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['todo', 'in-progress', 'completed']).optional(),
});

// Get all tasks for user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { bucketId, status, priority } = req.query;

    const where: any = { userId: req.userId! };
    if (bucketId) where.bucketId = bucketId;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        bucket: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get tasks by date range (for calendar)
router.get('/calendar', authenticate, async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate } = req.query;

    const tasks = await prisma.task.findMany({
      where: {
        userId: req.userId!,
        dueDate: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined,
        },
      },
      include: {
        bucket: true,
      },
      orderBy: { dueDate: 'asc' },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create task
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = createTaskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        userId: req.userId!,
        title: data.title,
        description: data.description,
        bucketId: data.bucketId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        priority: data.priority || 'medium',
        status: data.status || 'todo',
      },
      include: {
        bucket: true,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, description, bucketId, dueDate, priority, status } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (bucketId !== undefined) updateData.bucketId = bucketId;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'completed') {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }
    }

    const task = await prisma.task.updateMany({
      where: { id, userId: req.userId! },
      data: updateData,
    });

    if (task.count === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await prisma.task.findUnique({
      where: { id },
      include: { bucket: true },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete task
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.deleteMany({
      where: { id, userId: req.userId! },
    });

    if (task.count === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
