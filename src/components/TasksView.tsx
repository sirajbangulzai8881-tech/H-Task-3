import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Check, 
  Clock, 
  Calendar, 
  Trash2, 
  Edit3, 
  Filter, 
  Flame, 
  CheckCircle2, 
  ArrowUpDown,
  BookOpen,
  Tag,
  AlertCircle
} from 'lucide-react';
import { StudyTask, Subject, Priority } from '../types';
import { formatFriendlyDate, getDaysRemaining, getTodayDateString } from '../utils/dateUtils';
import { getPriorityStyles, getSubjectColorClasses } from '../utils/themeUtils';

interface TasksViewProps {
  tasks: StudyTask[];
  subjects: Subject[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: StudyTask) => void;
  onOpenTaskModal: (options?: { defaultSubjectId?: string }) => void;
}

type FilterStatus = 'all' | 'pending' | 'completed' | 'high_priority' | 'today';
type SortOption = 'dueDate' | 'priority' | 'title' | 'subject';

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  subjects,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onOpenTaskModal,
}) => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');

  const todayStr = getTodayDateString();
  const subjectMap = useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects]);

  const priorityWeight: Record<Priority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  // Filter & Sort tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        // Status filters
        if (filterStatus === 'pending' && t.status !== 'pending') return false;
        if (filterStatus === 'completed' && t.status !== 'completed') return false;
        if (filterStatus === 'high_priority' && (t.priority !== 'high' || t.status === 'completed')) return false;
        if (filterStatus === 'today' && t.dueDate !== todayStr && !t.isTodayFocus) return false;

        // Subject filter
        if (selectedSubjectId !== 'all' && t.subjectId !== selectedSubjectId) return false;

        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const titleMatch = t.title.toLowerCase().includes(query);
          const notesMatch = t.notes ? t.notes.toLowerCase().includes(query) : false;
          const subject = subjectMap.get(t.subjectId);
          const subjectMatch = subject ? subject.name.toLowerCase().includes(query) || subject.code.toLowerCase().includes(query) : false;
          if (!titleMatch && !notesMatch && !subjectMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Completed items always sort towards bottom if mixed
        if (a.status !== b.status) {
          return a.status === 'completed' ? 1 : -1;
        }

        if (sortBy === 'priority') {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'subject') {
          const subA = subjectMap.get(a.subjectId)?.name || '';
          const subB = subjectMap.get(b.subjectId)?.name || '';
          return subA.localeCompare(subB);
        }
        // Default: due date
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [tasks, filterStatus, selectedSubjectId, searchQuery, sortBy, todayStr, subjectMap]);

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const highPriorityCount = tasks.filter((t) => t.status === 'pending' && t.priority === 'high').length;

  return (
    <div id="tasks-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Tasks & Study Assignments
            </h2>
            <p className="text-xs text-slate-500">
              Manage deadlines, coursework, and prioritize urgent tasks
            </p>
          </div>

          <button
            id="btn-add-task-view"
            onClick={() => onOpenTaskModal({ defaultSubjectId: selectedSubjectId !== 'all' ? selectedSubjectId : undefined })}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/25 flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add New Task</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          {/* Status Tabs */}
          <div className="md:col-span-2 flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === 'pending'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus('high_priority')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterStatus === 'high_priority'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100/80 border border-rose-200/60'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              High Priority ({highPriorityCount})
            </button>
            <button
              onClick={() => setFilterStatus('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === 'today'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Today's Focus
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Subject Dropdown & Sort */}
          <div className="flex items-center gap-2">
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:outline-none focus:bg-white"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:outline-none focus:bg-white shrink-0"
            >
              <option value="dueDate">Sort: Due Date</option>
              <option value="priority">Sort: Priority</option>
              <option value="subject">Sort: Subject</option>
              <option value="title">Sort: Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-dashed border-slate-200 text-center">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No tasks found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No tasks matching "${searchQuery}". Try a different filter or search keyword.`
                : 'No tasks in this category. Click "+ Add New Task" to create one!'}
            </p>
            <button
              onClick={() => onOpenTaskModal({ defaultSubjectId: selectedSubjectId !== 'all' ? selectedSubjectId : undefined })}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const subject = subjectMap.get(task.subjectId);
            const priorityStyles = getPriorityStyles(task.priority);
            const subjectStyles = getSubjectColorClasses(subject?.color || 'blue');
            const isDone = task.status === 'completed';
            const daysLeft = getDaysRemaining(task.dueDate);
            const isUrgent = daysLeft <= 1 && task.priority === 'high' && !isDone;

            return (
              <div
                key={task.id}
                id={`task-item-${task.id}`}
                className={`group bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 shadow-xs hover:shadow-md relative overflow-hidden ${
                  isDone
                    ? 'border-slate-200/60 bg-slate-50/50 opacity-70'
                    : `border-slate-200/90 hover:border-slate-300 border-l-4 ${priorityStyles.cardBorder} ${
                        isUrgent ? 'bg-rose-50/20' : ''
                      }`
                }`}
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  {/* Left: Checkbox */}
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                        : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 text-transparent'
                    }`}
                    aria-label={isDone ? 'Mark as pending' : 'Mark as completed'}
                  >
                    <Check className={`w-3.5 h-3.5 stroke-[3] ${isDone ? 'opacity-100' : 'opacity-0'}`} />
                  </button>

                  {/* Middle: Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      {/* Title */}
                      <h3
                        onClick={() => onEditTask(task)}
                        className={`text-sm sm:text-base font-bold tracking-tight cursor-pointer hover:text-blue-600 transition-colors ${
                          isDone
                            ? 'line-through text-slate-400 font-normal'
                            : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h3>

                      {/* Due Date friendly label */}
                      <div className="flex items-center gap-1.5 text-xs shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span
                          className={`font-semibold ${
                            isDone
                              ? 'text-slate-400'
                              : daysLeft < 0
                              ? 'text-rose-600 font-bold'
                              : daysLeft === 0
                              ? 'text-rose-600 font-bold'
                              : daysLeft === 1
                              ? 'text-amber-700 font-bold'
                              : 'text-slate-600'
                          }`}
                        >
                          {formatFriendlyDate(task.dueDate)}
                          {daysLeft < 0 && !isDone && ' (Overdue)'}
                        </span>
                        {task.dueTime && (
                          <span className="text-slate-400 font-normal">
                            at {task.dueTime}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Notes if any */}
                    {task.notes && (
                      <p className={`text-xs mt-1 leading-relaxed ${
                        isDone ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {task.notes}
                      </p>
                    )}

                    {/* Metadata & Tag Badges */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {/* Subject badge */}
                      {subject && (
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${subjectStyles.badge}`}
                        >
                          {subject.name} ({subject.code})
                        </span>
                      )}

                      {/* Priority Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-md border ${priorityStyles.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${priorityStyles.dotClass}`} />
                        <span>{priorityStyles.label}</span>
                      </span>

                      {/* Today's Focus Marker */}
                      {task.isTodayFocus && !isDone && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          <Flame className="w-3 h-3 text-amber-500" />
                          <span>Today's Focus</span>
                        </span>
                      )}

                      {/* Study duration */}
                      {task.estimatedMinutes && (
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-300" />
                          <span>~{task.estimatedMinutes} mins</span>
                        </span>
                      )}

                      {/* Completion status text */}
                      {isDone && task.completedAt && (
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Actions: Edit & Delete */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => onEditTask(task)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit task"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
