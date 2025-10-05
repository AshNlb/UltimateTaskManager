import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { tasksAPI } from '../api/tasks';
import { aiAPI } from '../api/ai';
import { Bucket, Task } from '../types';

interface Props {
  task?: Task;
  buckets: Bucket[];
  defaultDate?: Date;
  onClose: () => void;
  onSave: () => void;
}

export default function TaskModal({ task, buckets, defaultDate, onClose, onSave }: Props) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [bucketId, setBucketId] = useState(task?.bucketId || buckets[0]?.id || '');
  const [dueDate, setDueDate] = useState(
    task?.dueDate
      ? new Date(task.dueDate).toISOString().split('T')[0]
      : defaultDate
      ? defaultDate.toISOString().split('T')[0]
      : ''
  );
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [status, setStatus] = useState(task?.status || 'todo');
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        title,
        description: description || undefined,
        bucketId,
        dueDate: dueDate || undefined,
        priority: priority as 'low' | 'medium' | 'high',
        status: status as 'todo' | 'in-progress' | 'completed',
      };

      if (task) {
        await tasksAPI.update(task.id, data);
      } else {
        await tasksAPI.create(data);
      }

      onSave();
    } catch (error) {
      console.error('Failed to save task:', error);
      alert('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleEnhance = async () => {
    if (!task) return;
    setEnhancing(true);

    try {
      const result = await aiAPI.enhanceTask(task.id);
      setDescription(result.enhancedDescription);
    } catch (error) {
      console.error('Failed to enhance task:', error);
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="card-modern max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center p-6 border-b border-gray-700/50">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {task ? 'Edit Task' : 'New Task'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl p-2 transition-all duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Task title"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Description
              </label>
              {task && (
                <button
                  type="button"
                  onClick={handleEnhance}
                  disabled={enhancing}
                  className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles size={14} />
                  {enhancing ? 'Enhancing...' : 'Enhance with AI'}
                </button>
              )}
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Task description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bucket *
              </label>
              <select
                required
                value={bucketId}
                onChange={(e) => setBucketId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {buckets.map((bucket) => (
                  <option key={bucket.id} value={bucket.id} className="bg-gray-800">
                    {bucket.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="low" className="bg-gray-800">Low</option>
                <option value="medium" className="bg-gray-800">Medium</option>
                <option value="high" className="bg-gray-800">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'todo' | 'in-progress' | 'completed')}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="todo" className="bg-gray-800">To Do</option>
                <option value="in-progress" className="bg-gray-800">In Progress</option>
                <option value="completed" className="bg-gray-800">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-blue-500/20"
            >
              {loading ? 'Saving...' : task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
