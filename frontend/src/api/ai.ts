import api from './axios';
import { ChatMessage } from '../types';

export interface EnhanceTaskResponse {
  enhancedTitle: string;
  enhancedDescription: string;
  suggestedSubtasks: string[];
  estimatedDuration: string;
}

export interface AISettings {
  id: string;
  userId: string;
  assistantName: string;
  tone: 'professional' | 'friendly' | 'casual';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAISettingsData {
  assistantName?: string;
  tone?: 'professional' | 'friendly' | 'casual';
}

export const aiAPI = {
  ask: async (question: string): Promise<{ answer: string; remainingQuestions: number }> => {
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

  getSettings: async (): Promise<AISettings> => {
    const response = await api.get('/ai/settings');
    return response.data;
  },

  updateSettings: async (data: UpdateAISettingsData): Promise<AISettings> => {
    const response = await api.put('/ai/settings', data);
    return response.data;
  },
};
