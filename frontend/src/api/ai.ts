import api from './axios';
import { ChatMessage } from '../types';

export interface EnhanceTaskResponse {
  enhancedTitle: string;
  enhancedDescription: string;
  suggestedSubtasks: string[];
  estimatedDuration: string;
}

export const aiAPI = {
  ask: async (question: string): Promise<{ answer: string }> => {
    const response = await api.post('/ai/ask', { question });
    return response.data;
  },

  enhanceTask: async (taskId: string): Promise<EnhanceTaskResponse> => {
    const response = await api.post('/ai/enhance-task', { taskId });
    return response.data;
  },

  getChatHistory: async (): Promise<ChatMessage[]> => {
    const response = await api.get('/ai/chat-history');
    return response.data;
  },
};
