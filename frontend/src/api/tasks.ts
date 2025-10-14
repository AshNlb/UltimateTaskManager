import api from './axios';
import { Task } from '../types';

export interface CreateTaskData {
  title: string;
  description?: string;
  bucketId?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'todo' | 'in-progress' | 'completed';
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  bucketId?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'todo' | 'in-progress' | 'completed';
}

export const tasksAPI = {
  getAll: async (params?: { bucketId?: string; status?: string; priority?: string }): Promise<Task[]> => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  getCalendar: async (startDate?: string, endDate?: string): Promise<Task[]> => {
    const response = await api.get('/tasks/calendar', { params: { startDate, endDate } });
    return response.data;
  },

  create: async (data: CreateTaskData): Promise<Task> => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTaskData): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
