import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Bell, 
  Sparkles, 
  Clock, 
  AlertCircle,
  Menu,
  CheckCircle,
  Calendar,
  X
} from 'lucide-react';
import { StudyTask, Exam } from '../types';
import { getTodayDateString, getDaysRemaining } from '../utils/dateUtils';

interface HeaderProps {
  onOpenTaskModal: () => void;
  urgentTasks: StudyTask[];
  upcomingExams: Exam[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTaskModal,
  urgentTasks,
  upcomingExams,
  searchQuery,
  onSearchChange,
  onOpenMobileMenu,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const today = new Date();
  const dateFormatted = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const totalAlerts = urgentTasks.length + upcomingExams.filter(e => getDaysRemaining(e.date) <= 5).length;

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4 sticky top-0 z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Mobile toggle & Greetings / Date */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Study Planner
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Semester Active
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {dateFormatted}
            </p>
          </div>
        </div>

        {/* Right: Search, Notification Bell, Add Task Button */}
        <div className="flex items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="header-search-input"
              type="text"
              placeholder="Search tasks, subjects..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder:text-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              id="btn-notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {totalAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
                  {totalAlerts}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div
                id="notifications-popover"
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 px-4 z-50 text-left animate-in fade-in slide-in-from-top-2"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-bold text-slate-900">Notifications & Alerts</h4>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-2">
                  {urgentTasks.length === 0 && upcomingExams.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500">
                      <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                      All caught up! No urgent deadlines at the moment.
                    </div>
                  ) : (
                    <>
                      {urgentTasks.map((task) => (
                        <div key={task.id} className="py-2.5 flex items-start gap-2.5 group">
                          <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                              {task.title}
                            </p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-rose-500" />
                              Due {task.dueTime ? `${task.dueTime}` : 'Today'} • High Priority
                            </p>
                          </div>
                        </div>
                      ))}

                      {upcomingExams.map((exam) => {
                        const daysLeft = getDaysRemaining(exam.date);
                        return (
                          <div key={exam.id} className="py-2.5 flex items-start gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                                {exam.title}
                              </p>
                              <p className="text-[11px] text-amber-700 font-medium flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3 text-amber-600" />
                                {daysLeft === 0 ? 'Today!' : daysLeft === 1 ? 'Tomorrow!' : `In ${daysLeft} days`} • {exam.location}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Stay on track</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA: + Add New Task */}
          <button
            id="btn-add-task-header"
            onClick={onOpenTaskModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-600/30 transition-all active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
