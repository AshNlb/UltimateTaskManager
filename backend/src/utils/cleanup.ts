import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Cleanup expired password reset tokens
 * Runs automatically to prevent token table bloat
 */
export async function cleanupExpiredTokens() {
  try {
    const result = await prisma.passwordResetToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } }, // Expired
          { used: true, createdAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }, // Used and older than 7 days
        ],
      },
    });

    console.log(`Cleaned up ${result.count} expired password reset tokens`);
    return result.count;
  } catch (error) {
    console.error('Error cleaning up tokens:', error);
    return 0;
  }
}

/**
 * Cleanup old chat history (keep last 50 per user)
 * This is a safety net in case the per-request cleanup misses anything
 */
export async function cleanupOldChatHistory() {
  try {
    // Get all users
    const users = await prisma.user.findMany({ select: { id: true } });
    let totalDeleted = 0;

    for (const user of users) {
      const count = await prisma.chatHistory.count({
        where: { userId: user.id },
      });

      if (count > 50) {
        const oldMessages = await prisma.chatHistory.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: 'asc' },
          take: count - 50,
          select: { id: true },
        });

        if (oldMessages.length > 0) {
          const result = await prisma.chatHistory.deleteMany({
            where: { id: { in: oldMessages.map((m) => m.id) } },
          });
          totalDeleted += result.count;
        }
      }
    }

    console.log(`Cleaned up ${totalDeleted} old chat messages`);
    return totalDeleted;
  } catch (error) {
    console.error('Error cleaning up chat history:', error);
    return 0;
  }
}

/**
 * Cleanup completed tasks older than 90 days
 * OPTIONAL: Only use if you want to archive old completed tasks
 */
export async function cleanupOldCompletedTasks(daysToKeep: number = 90) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await prisma.task.deleteMany({
      where: {
        status: 'completed',
        completedAt: { lt: cutoffDate },
      },
    });

    console.log(`Cleaned up ${result.count} old completed tasks (older than ${daysToKeep} days)`);
    return result.count;
  } catch (error) {
    console.error('Error cleaning up completed tasks:', error);
    return 0;
  }
}

/**
 * Run all cleanup tasks
 */
export async function runAllCleanups(options?: { cleanupOldTasks?: boolean; taskRetentionDays?: number }) {
  console.log('Starting database cleanup...');

  const tokens = await cleanupExpiredTokens();
  const chats = await cleanupOldChatHistory();

  let tasks = 0;
  if (options?.cleanupOldTasks) {
    tasks = await cleanupOldCompletedTasks(options.taskRetentionDays || 90);
  }

  console.log(`Cleanup complete: ${tokens} tokens, ${chats} chats, ${tasks} tasks removed`);

  return { tokens, chats, tasks };
}
