import api from './axios';
import { Bucket } from '../types';

export const bucketsAPI = {
  getAll: async (): Promise<Bucket[]> => {
    const response = await api.get('/buckets');
    return response.data;
  },

  create: async (data: { name: string; color?: string }): Promise<Bucket> => {
    const response = await api.post('/buckets', data);
    return response.data;
  },

  update: async (id: string, data: { name?: string; color?: string }): Promise<void> => {
    await api.put(`/buckets/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/buckets/${id}`);
  },
};
