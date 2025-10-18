import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { generateAIResponse, enhanceTaskWithAI } from '../services/aiService';
import { z } from 'zod';
import { cleanupExpiredTokens, cleanupOldChatHistory } from '../utils/cleanup';

const router = express.Router();
const prisma = new PrismaClient();

// Run cleanup on server startup
cleanupExpiredTokens();
cleanupOldChatHistory();

// Schedule cleanup every 24 hours
setInterval(() => {
  cleanupExpiredTokens();
  cleanupOldChatHistory();
}, 24 * 60 * 60 * 1000);

// Rate limiting: 10 questions per user per day
async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayQuestions = await prisma.chatHistory.count({
    where: {
      userId,
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  const DAILY_LIMIT = 10;
  const remaining = Math.max(0, DAILY_LIMIT - todayQuestions);
  const allowed = todayQuestions < DAILY_LIMIT;

  return { allowed, remaining };
}

// AI-powered Q&A assistant with task context and web search
router.post('/ask', authenticate, async (req: AuthRequest, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Check rate limit
    const { allowed, remaining } = await checkRateLimit(req.userId!);

    if (!allowed) {
      return res.status(429).json({
        error: 'Daily limit reached. You can ask up to 10 questions per day. Try again tomorrow!',
        remaining: 0,
      });
    }

    // Get user's tasks
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId! },
      include: { bucket: true },
      orderBy: { dueDate: 'asc' },
    });

    // Get AI settings or use defaults
    let aiSettings = await prisma.aISettings.findUnique({
      where: { userId: req.userId! },
    });

    if (!aiSettings) {
      // Create default settings if they don't exist
      aiSettings = await prisma.aISettings.create({
        data: {
          userId: req.userId!,
          assistantName: 'AI Assistant',
          tone: 'professional',
        },
      });
    }

    // Generate AI response using the new service
    const answer = await generateAIResponse(question, tasks, {
      assistantName: aiSettings.assistantName,
      tone: aiSettings.tone,
    });

    // Auto-cleanup: Keep only last 50 messages per user to save storage
    const messageCount = await prisma.chatHistory.count({
      where: { userId: req.userId! },
    });

    if (messageCount >= 50) {
      // Delete oldest messages keeping only the 49 most recent
      const oldMessages = await prisma.chatHistory.findMany({
        where: { userId: req.userId! },
        orderBy: { createdAt: 'asc' },
        take: messageCount - 49,
        select: { id: true },
      });

      if (oldMessages.length > 0) {
        await prisma.chatHistory.deleteMany({
          where: {
            id: { in: oldMessages.map(m => m.id) },
          },
        });
      }
    }

    // Save chat history (truncate long messages to save space)
    await prisma.chatHistory.create({
      data: {
        userId: req.userId!,
        message: question.substring(0, 1000), // Limit to 1000 chars
        response: answer.substring(0, 2000), // Limit to 2000 chars
      },
    });

    res.json({
      answer,
      remainingQuestions: remaining - 1,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// AI-powered task enhancement
router.post('/enhance-task', authenticate, async (req: AuthRequest, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    const task = await prisma.task.findFirst({
      where: { id: taskId, userId: req.userId! },
      include: { bucket: true },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Get AI settings or use defaults
    let aiSettings = await prisma.aISettings.findUnique({
      where: { userId: req.userId! },
    });

    if (!aiSettings) {
      aiSettings = await prisma.aISettings.create({
        data: {
          userId: req.userId!,
          assistantName: 'AI Assistant',
          tone: 'professional',
        },
      });
    }

    // Use AI service to enhance the task
    const suggestions = await enhanceTaskWithAI(task, {
      assistantName: aiSettings.assistantName,
      tone: aiSettings.tone,
    });

    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get chat history (limited to last 20 for display to save bandwidth)
router.get('/chat-history', authenticate, async (req: AuthRequest, res) => {
  try {
    const history = await prisma.chatHistory.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
      take: 20, // Only load last 20 messages for display
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get remaining questions for today
router.get('/remaining-questions', authenticate, async (req: AuthRequest, res) => {
  try {
    const { remaining } = await checkRateLimit(req.userId!);
    res.json({ remaining, dailyLimit: 10 });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get AI settings
router.get('/settings', authenticate, async (req: AuthRequest, res) => {
  try {
    let settings = await prisma.aISettings.findUnique({
      where: { userId: req.userId! },
    });

    if (!settings) {
      // Create default settings if they don't exist
      settings = await prisma.aISettings.create({
        data: {
          userId: req.userId!,
          assistantName: 'AI Assistant',
          tone: 'professional',
        },
      });
    }

    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update AI settings
const updateSettingsSchema = z.object({
  assistantName: z.string().min(1).max(50).optional(),
  tone: z.enum(['professional', 'friendly', 'casual']).optional(),
});

router.put('/settings', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = updateSettingsSchema.parse(req.body);

    // Get or create settings
    let settings = await prisma.aISettings.findUnique({
      where: { userId: req.userId! },
    });

    if (!settings) {
      settings = await prisma.aISettings.create({
        data: {
          userId: req.userId!,
          assistantName: data.assistantName || 'AI Assistant',
          tone: data.tone || 'professional',
        },
      });
    } else {
      settings = await prisma.aISettings.update({
        where: { userId: req.userId! },
        data,
      });
    }

    res.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
