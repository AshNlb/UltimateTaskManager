import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';
import { bucketsAPI } from '../api/buckets';
import { tasksAPI } from '../api/tasks';
import { Bucket, Task } from '../types';
import TaskModal from '../components/TaskModal';
import BucketModal from '../components/BucketModal';

export default function Dashboard() {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [taskModal, setTaskModal] = useState<{ open: boolean; task?: Task }>({ open: false });
  const [bucketModal, setBucketModal] = useState<{ open: boolean; bucket?: Bucket }>({ open: false });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bucketsData, tasksData] = await Promise.all([
        bucketsAPI.getAll(),
        tasksAPI.getAll(),
      ]);
      setBuckets(bucketsData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const newStatus = task.status === 'completed' ? 'todo' : 'completed';
      await tasksAPI.update(task.id, { status: newStatus });
      loadData();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await tasksAPI.delete(taskId);
      loadData();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleDeleteBucket = async (bucketId: string) => {
    if (!confirm('Are you sure? This will delete all tasks in this bucket.')) return;
    try {
      await bucketsAPI.delete(bucketId);
      loadData();
    } catch (error) {
      console.error('Failed to delete bucket:', error);
    }
  };

  const getTasksByBucket = (bucketId: string) => {
    return tasks.filter((t) => t.bucketId === bucketId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Task Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your tasks across {buckets.length} bucket{buckets.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => setBucketModal({ open: true })}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-700 dark:to-gray-800 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Bucket</span>
            <span className="sm:hidden">Bucket</span>
          </button>
          <button
            onClick={() => setTaskModal({ open: true })}
            className="flex-1 sm:flex-none px-5 py-2.5 gradient-primary text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Task</span>
            <span className="sm:hidden">Task</span>
          </button>
        </div>
      </div>

      {/* Bucket Filter Pills */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setSelectedBucket(null)}
          className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
            !selectedBucket
              ? 'gradient-primary text-white shadow-lg'
              : 'bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All Tasks
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
            !selectedBucket
              ? 'bg-white/20'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}>
            {tasks.length}
          </span>
        </button>
        {buckets.map((bucket) => {
          const taskCount = getTasksByBucket(bucket.id).length;
          return (
            <button
              key={bucket.id}
              onClick={() => setSelectedBucket(bucket.id)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                selectedBucket === bucket.id
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              style={{
                backgroundColor: selectedBucket === bucket.id ? bucket.color : undefined,
              }}
            >
              {bucket.name}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                selectedBucket === bucket.id
                  ? 'bg-white/20'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}>
                {taskCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Buckets with Tasks */}
      <div className="space-y-6">
        {(selectedBucket ? [buckets.find((b) => b.id === selectedBucket)!] : buckets).map((bucket) => {
          const bucketTasks = getTasksByBucket(bucket.id);
          const completedCount = bucketTasks.filter((t) => t.status === 'completed').length;
          const completionPercentage = bucketTasks.length > 0
            ? Math.round((completedCount / bucketTasks.length) * 100)
            : 0;

          return (
            <div
              key={bucket.id}
              className="card-modern group"
            >
              {/* Bucket Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="w-5 h-5 rounded-lg shadow-md flex-shrink-0"
                    style={{ backgroundColor: bucket.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {bucket.name}
                    </h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {completedCount} of {bucketTasks.length} completed
                      </span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                        {completionPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBucketModal({ open: true, bucket })}
                    className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                    title="Edit bucket"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteBucket(bucket.id)}
                    className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    title="Delete bucket"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {bucketTasks.length > 0 && (
                <div className="mb-6">
                  <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 transition-all duration-500 rounded-full"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Tasks List */}
              {bucketTasks.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <div className="text-gray-400 dark:text-gray-600 mb-2">
                    <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No tasks in this bucket</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create your first task to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bucketTasks.map((task) => {
                    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

                    return (
                      <div
                        key={task.id}
                        className={`group/task flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                          task.status === 'completed'
                            ? 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
                            : 'bg-white dark:bg-dark-surface hover:shadow-md hover:scale-[1.01]'
                        }`}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                            task.status === 'completed'
                              ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-500 shadow-md'
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:scale-110'
                          }`}
                        >
                          {task.status === 'completed' && (
                            <Check size={16} className="text-white" strokeWidth={3} />
                          )}
                        </button>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-semibold text-base mb-1 ${
                              task.status === 'completed'
                                ? 'line-through text-gray-500 dark:text-gray-500'
                                : 'text-gray-900 dark:text-gray-100'
                            }`}
                          >
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex gap-2 flex-wrap items-center">
                            {/* Due Date */}
                            {task.dueDate && (
                              <span
                                className={`text-xs px-3 py-1 rounded-full font-medium ${
                                  isOverdue
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                {isOverdue ? 'Overdue: ' : 'Due: '}
                                {new Date(task.dueDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            )}

                            {/* Priority Badge */}
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider ${
                                task.priority === 'high'
                                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm'
                                  : task.priority === 'medium'
                                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-sm'
                                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm'
                              }`}
                            >
                              {task.priority}
                            </span>

                            {/* Status Badge */}
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                task.status === 'completed'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                  : task.status === 'in-progress'
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {task.status === 'in-progress' ? 'In Progress' : task.status}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 opacity-0 group-hover/task:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => setTaskModal({ open: true, task })}
                            className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                            title="Edit task"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                            title="Delete task"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {buckets.length === 0 && (
        <div className="text-center py-16 card-modern">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No buckets yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first bucket to start organizing your tasks
          </p>
          <button
            onClick={() => setBucketModal({ open: true })}
            className="px-6 py-3 gradient-primary text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Create Your First Bucket
          </button>
        </div>
      )}

      {/* Modals */}
      {taskModal.open && (
        <TaskModal
          task={taskModal.task}
          buckets={buckets}
          onClose={() => setTaskModal({ open: false })}
          onSave={() => {
            setTaskModal({ open: false });
            loadData();
          }}
        />
      )}

      {bucketModal.open && (
        <BucketModal
          bucket={bucketModal.bucket}
          onClose={() => setBucketModal({ open: false })}
          onSave={() => {
            setBucketModal({ open: false });
            loadData();
          }}
        />
      )}
    </div>
  );
}
