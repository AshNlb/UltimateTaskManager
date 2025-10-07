import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

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

// Simple Q&A assistant (uses task data to answer questions)
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
        remaining: 0
      });
    }

    // Get user's tasks
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId! },
      include: { bucket: true },
      orderBy: { dueDate: 'asc' },
    });

    // Simple rule-based responses (can be enhanced with actual LLM)
    let answer = '';
    const lowerQuestion = question.toLowerCase().trim();

    // Check for count/total tasks
    if (lowerQuestion.match(/how many|total|count|all task/)) {
      const total = tasks.length;
      const completed = tasks.filter(t => t.status === 'completed').length;
      const pending = total - completed;
      answer = `You have ${total} total tasks: ${completed} completed and ${pending} pending.`;
    }
    // Check for today's tasks
    else if (lowerQuestion.match(/today|due today/)) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayTasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate >= today && dueDate < tomorrow;
      });

      if (todayTasks.length === 0) {
        answer = 'You have no tasks due today. 🎉';
      } else {
        answer = `You have ${todayTasks.length} task(s) due today:\n${todayTasks.map(t => `• ${t.title} (${t.bucket.name})`).join('\n')}`;
      }
    }
    // Check for tomorrow's tasks
    else if (lowerQuestion.match(/tomorrow|due tomorrow/)) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const dayAfter = new Date(tomorrow);
      dayAfter.setDate(dayAfter.getDate() + 1);

      const tomorrowTasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate >= tomorrow && dueDate < dayAfter;
      });

      if (tomorrowTasks.length === 0) {
        answer = 'You have no tasks due tomorrow. 🎉';
      } else {
        answer = `You have ${tomorrowTasks.length} task(s) due tomorrow:\n${tomorrowTasks.map(t => `• ${t.title} (${t.bucket.name})`).join('\n')}`;
      }
    }
    // Check for this week's tasks
    else if (lowerQuestion.match(/week|this week|next 7 days/)) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weekTasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        const dueDate = new Date(t.dueDate);
        return dueDate >= today && dueDate <= weekEnd;
      });

      if (weekTasks.length === 0) {
        answer = 'You have no tasks due this week. 🎉';
      } else {
        answer = `You have ${weekTasks.length} task(s) due this week:\n${weekTasks.map(t => `• ${t.title} (${t.bucket.name}, ${new Date(t.dueDate!).toLocaleDateString()})`).join('\n')}`;
      }
    }
    // Check for high priority tasks
    else if (lowerQuestion.match(/high|priority|urgent|important/)) {
      const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'completed');

      if (highPriorityTasks.length === 0) {
        answer = 'You have no high-priority tasks. Great! 🎉';
      } else {
        answer = `You have ${highPriorityTasks.length} high-priority task(s):\n${highPriorityTasks.map(t => `• ${t.title} (${t.bucket.name})`).join('\n')}`;
      }
    }
    // Check for overdue tasks
    else if (lowerQuestion.match(/overdue|late|past due/)) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const overdueTasks = tasks.filter(t => {
        if (!t.dueDate || t.status === 'completed') return false;
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
      });

      if (overdueTasks.length === 0) {
        answer = 'You have no overdue tasks. Great job! 🎉';
      } else {
        answer = `You have ${overdueTasks.length} overdue task(s):\n${overdueTasks.map(t => `• ${t.title} (${t.bucket.name}, was due ${new Date(t.dueDate!).toLocaleDateString()})`).join('\n')}`;
      }
    }
    // Check for completed tasks
    else if (lowerQuestion.match(/completed|done|finished/)) {
      const completedTasks = tasks.filter(t => t.status === 'completed');
      if (completedTasks.length === 0) {
        answer = 'You have no completed tasks yet. Keep going! 💪';
      } else {
        answer = `You have completed ${completedTasks.length} task(s):\n${completedTasks.slice(0, 10).map(t => `• ${t.title} (${t.bucket.name})`).join('\n')}${completedTasks.length > 10 ? '\n...and more!' : ''}`;
      }
    }
    // Check for pending/todo tasks
    else if (lowerQuestion.match(/pending|todo|not done|incomplete/)) {
      const pendingTasks = tasks.filter(t => t.status !== 'completed');
      if (pendingTasks.length === 0) {
        answer = 'You have no pending tasks. All done! 🎉';
      } else {
        answer = `You have ${pendingTasks.length} pending task(s):\n${pendingTasks.slice(0, 10).map(t => `• ${t.title} (${t.bucket.name})`).join('\n')}${pendingTasks.length > 10 ? '\n...and more!' : ''}`;
      }
    }
    // Default help message
    else {
      answer = `I can help you with questions about your tasks. Try asking:\n\n• "How many tasks do I have?"\n• "What's due today?"\n• "What's due this week?"\n• "Show me high-priority tasks"\n• "Do I have overdue tasks?"\n• "Show completed tasks"\n• "What tasks are pending?"`;
    }

    // Save chat history
    await prisma.chatHistory.create({
      data: {
        userId: req.userId!,
        message: question,
        response: answer,
      },
    });

    res.json({
      answer,
      remainingQuestions: remaining - 1
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Enhance task (simple version - can be enhanced with actual LLM)
router.post('/enhance-task', authenticate, async (req: AuthRequest, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    const task = await prisma.task.findFirst({
      where: { id: taskId, userId: req.userId! },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Simple enhancement suggestions (can be replaced with actual LLM)
    const suggestions = {
      enhancedTitle: task.title,
      enhancedDescription: task.description
        ? `${task.description}\n\nSuggested steps:\n1. Break down into smaller tasks\n2. Identify required resources\n3. Set milestones\n4. Review progress regularly`
        : 'Consider adding more details about:\n- Specific goals\n- Resources needed\n- Success criteria\n- Potential obstacles',
      suggestedSubtasks: [
        'Research and planning',
        'Implementation',
        'Review and testing',
        'Finalization',
      ],
      estimatedDuration: 'Based on the task complexity, this might take 2-4 hours.',
    };

    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get chat history
router.get('/chat-history', authenticate, async (req: AuthRequest, res) => {
  try {
    const history = await prisma.chatHistory.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
      take: 50,
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

export default router;
