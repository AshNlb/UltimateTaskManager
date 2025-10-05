import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

const createBucketSchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
});

// Get all buckets for user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const buckets = await prisma.bucket.findMany({
      where: { userId: req.userId! },
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    res.json(buckets);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create bucket
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, color } = createBucketSchema.parse(req.body);

    // Get max order index
    const maxOrder = await prisma.bucket.findFirst({
      where: { userId: req.userId! },
      orderBy: { orderIndex: 'desc' },
    });

    const bucket = await prisma.bucket.create({
      data: {
        userId: req.userId!,
        name,
        color: color || '#3B82F6',
        orderIndex: (maxOrder?.orderIndex || 0) + 1,
      },
    });

    res.status(201).json(bucket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Update bucket
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const bucket = await prisma.bucket.updateMany({
      where: { id, userId: req.userId! },
      data: { name, color },
    });

    if (bucket.count === 0) {
      return res.status(404).json({ error: 'Bucket not found' });
    }

    res.json({ message: 'Bucket updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete bucket
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Delete bucket (cascade will delete tasks)
    const bucket = await prisma.bucket.deleteMany({
      where: { id, userId: req.userId! },
    });

    if (bucket.count === 0) {
      return res.status(404).json({ error: 'Bucket not found' });
    }

    res.json({ message: 'Bucket deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
