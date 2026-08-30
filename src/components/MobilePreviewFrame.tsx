import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Flame, 
  Plus, 
  Check, 
  BookOpen, 
  LayoutDashboard, 
  CheckSquare,
  Sparkles,
  Zap
} from 'lucide-react';
import { StudyTask, Subject, Exam, ViewTab } from '../types';
import { getPriorityStyles, getSubjectColorClasses } from '../utils/themeUtils';
import { formatFriendlyDate, getDaysRemaining, getTodayDateString } from '../utils/dateUtils';

interface MobilePreviewFrameProps {
  tasks: StudyTask[];
  subjects: Subject[];
  exams: Exam[];
  onToggleTask: (taskId: string) => void;
  onOpenTaskModal: () => void;
  onClose: () => void;
}

export const MobilePreviewFrame: React.FC<MobilePreviewFrameProps> = ({
  tasks,
  subjects,
  exams,
  onToggleTask,
  onOpenTaskModal,
  onClose,
}) => {
  const [activeMobileTab, setActiveMobileTab] = useState<'home' | 'tasks' | 'courses' | 'calendar'>('home');
  const todayStr = getTodayDateString();
  const subjectMap = new Map(subjects.map((s) => [s.id, s]));

  const todayTasks = tasks.filter((t) => t.isTodayFocus || t.dueDate === todayStr);
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  
  const sortedExams = [...exams].sort((a, b) => a.date.localeCompare(b.date));
  const nextExam = sortedExams[0];

  return (
    <div className="w-full lg:w-[380px] shrink-0 sticky top-20 h-[calc(100vh-100px)] hidden xl:flex flex-col bg-slate-900/90 p-4 rounded-3xl shadow-2xl border border-slate-700/50 backdrop-blur-md">
      {/* Header with Close */}
      <div className="flex items-center justify-between pb-3 px-2 text-slate-300">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
          <Smartphone className="w-4 h-4 text-blue-400" />
          <span>Live Mobile Preview</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Close Mobile Preview"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Phone Mockup Screen */}
      <div className="flex-1 bg-slate-50 rounded-[28px] border-4 border-slate-800 overflow-hidden flex flex-col shadow-inner relative">
        {/* Dynamic Island / Notch */}
        <div className="bg-slate-900 h-5 flex items-center justify-center relative">
          <div className="w-20 h-3.5 bg-black rounded-full mb-1"></div>
        </div>

        {/* Mobile Top Bar */}
        <div className="bg-white px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">StudyPulse</div>
            <div className="text-xs font-extrabold text-slate-900">Today's Study Plan</div>
          </div>
          <button
            onClick={onOpenTaskModal}
            className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Mobile Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {activeMobileTab === 'home' && (
            <>
              {/* Mobile Progress Bar */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <span>Weekly Goal</span>
                  <span className="text-blue-600">{progressPct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${progressPct}%` }}></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span>{completedCount} completed</span>
                  <span>{pendingCount} remaining</span>
                </div>
              </div>

              {/* Mobile Exam Banner */}
              {nextExam && (
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs">
                  <div className="flex items-center justify-between font-bold text-amber-900">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Exam in {getDaysRemaining(nextExam.date)}d
                    </span>
                    <span className="text-[10px] bg-amber-200/60 px-1.5 py-0.5 rounded">High Priority</span>
                  </div>
                  <div className="font-bold text-slate-800 text-[11px] mt-1 truncate">{nextExam.title}</div>
                </div>
              )}

              {/* Mobile Today's Focus */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Today's Focus ({todayTasks.length})</span>
                  <span className="text-blue-600 text-[10px]">Auto-sorted</span>
                </div>

                <div className="space-y-2">
                  {todayTasks.map((task) => {
                    const priorityStyles = getPriorityStyles(task.priority);
                    const isDone = task.status === 'completed';

                    return (
                      <div
                        key={task.id}
                        className={`p-2.5 rounded-xl border bg-white flex items-start gap-2 shadow-2xs ${
                          isDone ? 'opacity-60 bg-slate-100' : ''
                        }`}
                      >
                        <button
                          onClick={() => onToggleTask(task.id)}
                          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                            <span className={`px-1.5 py-0.2 rounded font-bold ${priorityStyles.badgeClass}`}>
                              {task.priority}
                            </span>
                            {task.dueTime && <span className="text-slate-400">{task.dueTime}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {activeMobileTab === 'tasks' && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase text-slate-400">All Tasks ({tasks.length})</div>
              {tasks.map((t) => (
                <div key={t.id} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      onClick={() => onToggleTask(t.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        t.status === 'completed' ? 'bg-emerald-500 text-white border-emerald-500' : 'border-slate-300'
                      }`}
                    >
                      {t.status === 'completed' && <Check className="w-2.5 h-2.5" />}
                    </button>
                    <span className={`truncate font-medium ${t.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {t.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeMobileTab === 'courses' && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase text-slate-400">Your Courses ({subjects.length})</div>
              {subjects.map((s) => (
                <div key={s.id} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                  <div className="font-bold text-slate-900">{s.name}</div>
                  <div className="text-[11px] text-slate-500">{s.code} • {s.teacher || 'Active'}</div>
                </div>
              ))}
            </div>
          )}

          {activeMobileTab === 'calendar' && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase text-slate-400">Upcoming Exams</div>
              {exams.map((e) => (
                <div key={e.id} className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                  <div className="font-bold text-slate-900">{e.title}</div>
                  <div className="text-[11px] text-amber-800">{e.date} • {e.location}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="bg-white border-t border-slate-100 grid grid-cols-4 p-1">
          <button
            onClick={() => setActiveMobileTab('home')}
            className={`py-1.5 flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              activeMobileTab === 'home' ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setActiveMobileTab('tasks')}
            className={`py-1.5 flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              activeMobileTab === 'tasks' ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Tasks</span>
          </button>
          <button
            onClick={() => setActiveMobileTab('courses')}
            className={`py-1.5 flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              activeMobileTab === 'courses' ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Courses</span>
          </button>
          <button
            onClick={() => setActiveMobileTab('calendar')}
            className={`py-1.5 flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              activeMobileTab === 'calendar' ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Planner</span>
          </button>
        </div>
      </div>
    </div>
  );
};
