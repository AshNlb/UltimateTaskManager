import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { tasksAPI } from '../api/tasks';
import { Task } from '../types';
import { format, startOfMonth, endOfMonth, addDays, startOfWeek, endOfWeek, startOfQuarter, endOfQuarter, getWeek } from 'date-fns';
import TaskModal from '../components/TaskModal';
import { bucketsAPI } from '../api/buckets';
import { Bucket } from '../types';

type ViewMode = 'day' | '3days' | 'week' | 'month' | 'quarter';

export default function CalendarView() {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [taskModal, setTaskModal] = useState<{ open: boolean; task?: Task; date?: Date }>({ open: false });

  useEffect(() => {
    loadData();
  }, [date]);

  const loadData = async () => {
    try {
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      const [tasksData, bucketsData] = await Promise.all([
        tasksAPI.getCalendar(start.toISOString(), end.toISOString()),
        bucketsAPI.getAll(),
      ]);
      setTasks(tasksData);
      setBuckets(bucketsData);
    } catch (error) {
      console.error('Failed to load calendar data:', error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: 'todo' | 'in-progress' | 'completed') => {
    try {
      await tasksAPI.update(taskId, { status: newStatus });
      // Update local state
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getTileContent = ({ date }: { date: Date }) => {
    const dateTasks = getTasksForDate(date).filter(task => task.status !== 'completed'); // Hide completed tasks
    if (dateTasks.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {dateTasks.slice(0, 3).map((task) => (
          <div
            key={task.id}
            className="w-1.5 h-1.5 rounded-full shadow-sm"
            style={{ backgroundColor: task.bucket?.color || '#3B82F6' }}
            title={task.title}
          />
        ))}
        {dateTasks.length > 3 && (
          <span className="text-[8px] text-gray-500 dark:text-gray-400">+{dateTasks.length - 3}</span>
        )}
      </div>
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setViewMode('day'); // Switch to day view when clicking a date
  };

  const getTasksForDateRange = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let startDate: Date;
    let endDate: Date;

    switch (viewMode) {
      case 'day':
        // Use selected date or today
        const dayToShow = selectedDate || today;
        dayToShow.setHours(0, 0, 0, 0);
        startDate = dayToShow;
        endDate = dayToShow;
        break;
      case '3days':
        startDate = today;
        endDate = addDays(today, 2);
        break;
      case 'week':
        startDate = startOfWeek(today, { weekStartsOn: 1 });
        endDate = endOfWeek(today, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
        break;
      case 'quarter':
        startDate = startOfQuarter(today);
        endDate = endOfQuarter(today);
        break;
    }

    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      if (viewMode !== 'day' && task.status === 'completed') return false; // Show completed tasks in day view
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate >= startDate && taskDate <= endDate;
    });
  };

  const getViewTitle = () => {
    const today = new Date();
    switch (viewMode) {
      case 'day':
        return format(selectedDate || today, 'EEEE, MMMM dd, yyyy');
      case '3days':
        return 'Next 3 Days';
      case 'week':
        return `Week ${getWeek(today)}`;
      case 'month':
        return format(today, 'MMMM yyyy');
      case 'quarter':
        return `Q${Math.floor(today.getMonth() / 3) + 1} ${today.getFullYear()}`;
    }
  };

  const rangeViewTasks = getTasksForDateRange();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar View</h2>
        <button
          onClick={() => setTaskModal({ open: true, date: selectedDate || new Date() })}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
        >
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 card-modern rounded-xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
          <Calendar
            onChange={(value) => setDate(value as Date)}
            value={date}
            tileContent={getTileContent}
            onClickDay={handleDateClick}
            showWeekNumbers={true}
            className="w-full border-none dark-calendar"
          />
        </div>

        {/* Tasks overview with view toggle */}
        <div className="card-modern rounded-xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {getViewTitle()}
            </h3>

            {/* View mode toggle */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'day'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('3days')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === '3days'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                3 Days
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'week'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'month'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('quarter')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all col-span-2 ${
                  viewMode === 'quarter'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Quarter
              </button>
            </div>
          </div>

          {/* Tasks in selected range */}
          <div className="max-h-[600px] overflow-y-auto">
            {rangeViewTasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">No tasks in this period</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rangeViewTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all duration-300"
                    style={{ borderLeftWidth: '4px', borderLeftColor: task.bucket?.color || '#3B82F6' }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4
                        className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        onClick={() => setTaskModal({ open: true, task })}
                      >
                        {task.title}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(task.dueDate!), 'MMM dd')}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {task.bucket && (
                        <span className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium">
                          {task.bucket.name}
                        </span>
                      )}
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          task.status === 'completed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : task.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    {/* Status change buttons */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      {task.status !== 'in-progress' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(task.id, 'in-progress');
                          }}
                          className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          title="Mark as in progress"
                        >
                          In Progress
                        </button>
                      )}
                      {task.status !== 'completed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(task.id, 'completed');
                          }}
                          className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                          title="Mark as completed"
                        >
                          Complete
                        </button>
                      )}
                      {task.status !== 'todo' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(task.id, 'todo');
                          }}
                          className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          title="Mark as to do"
                        >
                          To Do
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {taskModal.open && (
        <TaskModal
          task={taskModal.task}
          buckets={buckets}
          defaultDate={taskModal.date}
          onClose={() => setTaskModal({ open: false })}
          onSave={() => {
            setTaskModal({ open: false });
            loadData();
          }}
        />
      )}
    </div>
  );
}
