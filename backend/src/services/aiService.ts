import OpenAI from 'openai';
import axios from 'axios';

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Tavily API for web search (alternative: SerpAPI)
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

interface Task {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  priority: string;
  status: string;
  bucket?: {
    name: string;
    color: string;
  } | null;
}

interface AISettings {
  assistantName: string;
  tone: string; // professional, friendly, casual
}

/**
 * Search the web using Tavily API for task-related information
 */
async function searchWeb(query: string): Promise<string> {
  if (!TAVILY_API_KEY) {
    return '';
  }

  try {
    const response = await axios.post(
      'https://api.tavily.com/search',
      {
        api_key: TAVILY_API_KEY,
        query,
        search_depth: 'basic',
        include_answer: true,
        max_results: 3,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    if (response.data.answer) {
      return response.data.answer;
    }

    if (response.data.results && response.data.results.length > 0) {
      return response.data.results
        .slice(0, 3)
        .map((r: any) => `${r.title}: ${r.content}`)
        .join('\n\n');
    }

    return '';
  } catch (error) {
    console.error('Web search error:', error);
    return '';
  }
}

/**
 * Get system prompt based on user's AI settings and tone
 */
function getSystemPrompt(settings: AISettings, tasks: Task[]): string {
  const toneInstructions = {
    professional:
      'Respond in a professional, clear, and concise manner. Use formal language and be direct in your responses.',
    friendly:
      'Respond in a warm, friendly, and encouraging manner. Use a conversational tone while staying helpful and supportive.',
    casual:
      'Respond in a casual, relaxed manner. Use simple language, occasional emojis, and be conversational like talking to a friend.',
  };

  const tone = toneInstructions[settings.tone as keyof typeof toneInstructions] || toneInstructions.professional;

  return `You are ${settings.assistantName}, a helpful AI task management assistant. ${tone}

Your role is to help users manage their tasks, provide information, and assist with task-related queries.

The user currently has the following tasks:
${tasks.map((t) => `- ${t.title} (${t.bucket?.name || 'No bucket'}, ${t.status}, priority: ${t.priority}${t.dueDate ? ', due: ' + new Date(t.dueDate).toLocaleDateString() : ''})`).join('\n')}

You can:
1. Answer questions about the user's tasks
2. Provide helpful information related to their tasks (recipes, how-to guides, tips, etc.)
3. Help them plan and organize their tasks
4. Search the web when needed to provide relevant information

Always be context-aware and relate your responses to the user's actual tasks when possible.
`;
}

/**
 * Generate AI response using OpenAI with task context and web search
 */
export async function generateAIResponse(
  question: string,
  tasks: Task[],
  settings: AISettings
): Promise<string> {
  // If OpenAI is not configured, fall back to rule-based responses
  if (!openai) {
    return fallbackResponse(question, tasks);
  }

  try {
    const systemPrompt = getSystemPrompt(settings, tasks);

    // Determine if we need web search based on the question
    const needsWebSearch =
      question.toLowerCase().match(/how to|recipe|ingredients|find|search|look up|what is/) &&
      !question.toLowerCase().match(/my task|my |due|priority|overdue/);

    let webContext = '';
    if (needsWebSearch && TAVILY_API_KEY) {
      console.log('Performing web search for:', question);
      webContext = await searchWeb(question);
      if (webContext) {
        webContext = `\n\nWeb Search Results:\n${webContext}`;
      }
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question + webContext },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || fallbackResponse(question, tasks);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return fallbackResponse(question, tasks);
  }
}

/**
 * Enhance task description using AI
 */
export async function enhanceTaskWithAI(
  task: Task,
  settings: AISettings
): Promise<{
  enhancedTitle: string;
  enhancedDescription: string;
  suggestedSubtasks: string[];
  estimatedDuration: string;
}> {
  if (!openai) {
    return fallbackEnhancement(task);
  }

  try {
    const prompt = `You are helping a user enhance their task. The task is:
Title: ${task.title}
Description: ${task.description || 'No description'}
Priority: ${task.priority}
Due Date: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}

Provide:
1. An enhanced, more detailed description with actionable steps
2. 3-5 suggested subtasks to break down this task
3. An estimated duration for completing this task

If the task involves something like cooking, shopping, research, etc., feel free to search for relevant information or provide helpful suggestions.

Respond in JSON format:
{
  "enhancedDescription": "...",
  "suggestedSubtasks": ["...", "..."],
  "estimatedDuration": "..."
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 600,
      response_format: { type: 'json_object' },
    });

    const response = JSON.parse(completion.choices[0]?.message?.content || '{}');

    return {
      enhancedTitle: task.title,
      enhancedDescription: response.enhancedDescription || task.description || '',
      suggestedSubtasks: response.suggestedSubtasks || [],
      estimatedDuration: response.estimatedDuration || 'Unknown',
    };
  } catch (error) {
    console.error('Task enhancement error:', error);
    return fallbackEnhancement(task);
  }
}

/**
 * Fallback response when AI is not available (rule-based)
 */
function fallbackResponse(question: string, tasks: Task[]): string {
  const lowerQuestion = question.toLowerCase().trim();

  // Check for count/total tasks
  if (lowerQuestion.match(/how many|total|count|all task/)) {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = total - completed;
    return `You have ${total} total tasks: ${completed} completed and ${pending} pending.`;
  }

  // Check for today's tasks
  if (lowerQuestion.match(/today|due today/)) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTasks = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate >= today && dueDate < tomorrow;
    });

    if (todayTasks.length === 0) {
      return 'You have no tasks due today. 🎉';
    }
    return `You have ${todayTasks.length} task(s) due today:\n${todayTasks.map((t) => `• ${t.title} (${t.bucket?.name || 'No bucket'})`).join('\n')}`;
  }

  // Check for this week's tasks
  if (lowerQuestion.match(/week|this week|next 7 days/)) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const weekTasks = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      return dueDate >= today && dueDate <= weekEnd;
    });

    if (weekTasks.length === 0) {
      return 'You have no tasks due this week. 🎉';
    }
    return `You have ${weekTasks.length} task(s) due this week:\n${weekTasks.map((t) => `• ${t.title} (${t.bucket?.name || 'No bucket'}, ${new Date(t.dueDate!).toLocaleDateString()})`).join('\n')}`;
  }

  return `I can help you with questions about your tasks. Try asking:\n\n• "How many tasks do I have?"\n• "What's due today?"\n• "What's due this week?"\n• "Help me with [specific task]"`;
}

/**
 * Fallback task enhancement when AI is not available
 */
function fallbackEnhancement(task: Task) {
  return {
    enhancedTitle: task.title,
    enhancedDescription: task.description
      ? `${task.description}\n\nSuggested steps:\n1. Break down into smaller tasks\n2. Identify required resources\n3. Set milestones\n4. Review progress regularly`
      : 'Consider adding more details about:\n- Specific goals\n- Resources needed\n- Success criteria\n- Potential obstacles',
    suggestedSubtasks: ['Research and planning', 'Implementation', 'Review and testing', 'Finalization'],
    estimatedDuration: 'Based on the task complexity, this might take 2-4 hours.',
  };
}
