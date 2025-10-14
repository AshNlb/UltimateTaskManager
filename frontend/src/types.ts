export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Bucket {
  id: string;
  userId: string;
  name: string;
  color: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tasks: number;
  };
}

export interface Task {
  id: string;
  userId: string;
  bucketId?: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  bucket?: Bucket;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  createdAt: string;
}
