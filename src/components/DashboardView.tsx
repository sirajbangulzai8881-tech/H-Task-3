import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle, 
  Calendar, 
  TrendingUp, 
  Flame, 
  Sparkles, 
  Plus, 
  ArrowRight,
  BookOpen,
  MapPin,
  Check,
  Award,
  Zap
} from 'lucide-react';
import { StudyTask, Subject, Exam, Priority } from '../types';
import { formatFriendlyDate, getDaysRemaining, getTodayDateString } from '../utils/dateUtils';
import { getPriorityStyles, getSubjectColorClasses } from '../utils/themeUtils';

interface DashboardViewProps {
  tasks: StudyTask[];
  subjects: Subject[];
  exams: Exam[];
  onToggleTask: (taskId: string) => void;
  onOpenTaskModal: (options?: { defaultDate?: string; defaultSubjectId?: string; isFocus?: boolean }) => void;
  onNavigateTab: (tab: 'dashboard' | 'tasks' | 'courses' | 'calendar') => void;
  onEditTask: (task: StudyTask) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  subjects,
  exams,
  onToggleTask,
  onOpenTaskModal,
  onNavigateTab,
  onEditTask,
}) => {
  const todayStr = getTodayDateString();
  const subjectMap = new Map<string, Subject>(subjects.map((s) => [s.id, s]));

  // Today's focus tasks: either explicitly marked as isTodayFocus or due today
  const todayTasks = tasks.filter((t) => t.isTodayFocus || t.dueDate === todayStr);
  const pendingFocusTasks = todayTasks.filter((t) => t.status === 'pending');
  const completedFocusTasks = todayTasks.filter((t) => t.status === 'completed');

  // Weekly progress calculation
  const totalWeeklyTasks = tasks.length;
  const completedWeeklyTasks = tasks.filter((t) => t.status === 'completed').length;
  const weeklyCompletionPercentage = totalWeeklyTasks > 0
    ? Math.round((completedWeeklyTasks / totalWeeklyTasks) * 100)
    : 0;

  // Urgent / High priority tasks
  const urgentTasks = tasks.filter((t) => t.status === 'pending' && t.priority === 'high');

  // Next upcoming exam
  const sortedExams = [...exams].sort((a, b) => a.date.localeCompare(b.date));
  const nextExam = sortedExams.find((e) => getDaysRemaining(e.date) >= 0) || sortedExams[0];

  return (
    <div id="dashboard-view" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. TOP URGENCY BANNER (If there are high priority tasks due today) */}
      {urgentTasks.length > 0 && (
        <div className="bg-gradient-to-r from-rose-50 via-amber-50/60 to-rose-50/30 border border-rose-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-500/20 font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-rose-900 flex items-center gap-2">
                High Priority Deadlines ({urgentTasks.length} Urgent)
              </h4>
              <p className="text-xs text-rose-700/90 font-medium">
                You have {urgentTasks.length} urgent assignment{urgentTasks.length > 1 ? 's' : ''} requiring attention today!
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('tasks')}
            className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
          >
            <span>Review Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. PROGRESS & METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weekly Progress Widget */}
        <div id="weekly-progress-widget" className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Weekly Progress</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {weeklyCompletionPercentage}% Completed
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk']">
                  {completedWeeklyTasks}
                </span>
                <span className="text-xs text-slate-400 font-medium ml-1">
                  / {totalWeeklyTasks} tasks
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {totalWeeklyTasks - completedWeeklyTasks} pending
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.max(weeklyCompletionPercentage, 5)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Goal: 100% by Sunday</span>
              <span className="font-semibold text-emerald-600">
                {weeklyCompletionPercentage >= 70 ? 'On Track' : 'Needs Focus'}
              </span>
            </div>
          </div>
        </div>

        {/* Today's Study Target */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Today's Focus Goals</span>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {completedFocusTasks.length} of {todayTasks.length} Done
            </span>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk'] mb-1">
              {pendingFocusTasks.length} Key Tasks Left
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Target study load: approx. {pendingFocusTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 45), 0)} mins remaining.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onOpenTaskModal({ isFocus: true })}
              className="w-full py-1.5 px-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-xs font-semibold text-slate-700 hover:text-blue-700 flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>Add Focus Item</span>
            </button>
          </div>
        </div>

        {/* Study Streak & Academic Health */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Subjects</span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {subjects.length} Courses
            </span>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk'] mb-1">
              5 Day Streak 🔥
            </div>
            <p className="text-xs text-slate-500">
              Consistent daily study habit active. Keep up the high retention rate!
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600">
            <span>Next exam in:</span>
            <span className="font-bold text-amber-700">
              {nextExam ? `${getDaysRemaining(nextExam.date)} days` : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT GRID: TODAY'S FOCUS (Left) + UPCOMING EXAM & SIDEBAR (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: "TODAY'S FOCUS" */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Today's Focus
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {todayTasks.length} tasks scheduled
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="btn-add-focus-task"
                onClick={() => onOpenTaskModal({ isFocus: true })}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Focus Task</span>
              </button>
            </div>
          </div>

          {/* Cards for Today's Focus */}
          <div className="space-y-3">
            {todayTasks.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-200 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                <h4 className="text-sm font-bold text-slate-800">No Focus Tasks For Today</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Your daily focus is clear! Add assignments or quiz preparation tasks to focus on today.
                </p>
                <button
                  onClick={() => onOpenTaskModal({ isFocus: true })}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Focus Task</span>
                </button>
              </div>
            ) : (
              todayTasks.map((task) => {
                const subject = subjectMap.get(task.subjectId);
                const priorityStyles = getPriorityStyles(task.priority);
                const subjectStyles = getSubjectColorClasses(subject?.color || 'blue');
                const isDone = task.status === 'completed';

                return (
                  <div
                    key={task.id}
                    id={`focus-task-${task.id}`}
                    className={`group bg-white rounded-2xl p-4 border transition-all duration-200 relative overflow-hidden shadow-xs hover:shadow-md ${
                      isDone
                        ? 'border-slate-200/60 bg-slate-50/40 opacity-75'
                        : `border-slate-200/90 hover:border-slate-300 border-l-4 ${priorityStyles.cardBorder}`
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Checkbox and Details */}
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <button
                          id={`toggle-task-${task.id}`}
                          onClick={() => onToggleTask(task.id)}
                          className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                              : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 text-transparent'
                          }`}
                          aria-label={isDone ? 'Mark task pending' : 'Mark task completed'}
                        >
                          <Check className={`w-3.5 h-3.5 stroke-[3] ${isDone ? 'opacity-100' : 'opacity-0'}`} />
                        </button>

                        <div className="flex-1 min-w-0">
                          {/* Title */}
                          <h4
                            onClick={() => onEditTask(task)}
                            className={`text-sm font-bold tracking-tight cursor-pointer hover:text-blue-600 transition-colors ${
                              isDone ? 'line-through text-slate-400 font-medium' : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </h4>

                          {/* Notes if any */}
                          {task.notes && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                              {task.notes}
                            </p>
                          )}

                          {/* Badges: Subject Pill, Priority Badge, Due Time */}
                          <div className="flex flex-wrap items-center gap-2 mt-2.5">
                            {/* Subject badge */}
                            {subject && (
                              <span
                                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${subjectStyles.badge}`}
                              >
                                {subject.name}
                              </span>
                            )}

                            {/* Priority Badge */}
                            <span
                              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-md border ${priorityStyles.badgeClass}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${priorityStyles.dotClass}`} />
                              <span>{priorityStyles.label}</span>
                            </span>

                            {/* Due Time */}
                            {task.dueTime && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>Due {task.dueTime}</span>
                              </span>
                            )}

                            {/* Estimated Duration */}
                            {task.estimatedMinutes && (
                              <span className="text-[11px] text-slate-400 font-medium">
                                ~{task.estimatedMinutes} mins
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick Edit Action */}
                      <button
                        onClick={() => onEditTask(task)}
                        className="text-xs font-semibold text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded-lg hover:bg-slate-100"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick link to all tasks */}
          <div className="pt-1">
            <button
              onClick={() => onNavigateTab('tasks')}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>View All Tasks & Assignments ({tasks.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Right Column: UPCOMING EXAMS & SUBJECT SCHEDULE */}
        <div className="space-y-5">
          {/* 4. UPCOMING EXAM REMINDER BOX (Highlighted at the side) */}
          <div id="upcoming-exam-box" className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white rounded-2xl p-5 border border-amber-200/90 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                    Upcoming Exam
                  </span>
                  <span className="text-[11px] text-amber-700/80 font-medium">
                    Priority Countdown
                  </span>
                </div>
              </div>

              {nextExam && (
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-amber-500 text-white shadow-xs font-['Space_Grotesk']">
                  {getDaysRemaining(nextExam.date) === 0
                    ? 'TODAY'
                    : getDaysRemaining(nextExam.date) === 1
                    ? 'TOMORROW'
                    : `IN ${getDaysRemaining(nextExam.date)} DAYS`}
                </span>
              )}
            </div>

            {nextExam ? (
              <div className="space-y-3">
                {/* Exam Title & Subject */}
                <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-amber-200/60 shadow-xs">
                  <h4 className="text-sm font-bold text-slate-900">
                    {nextExam.title}
                  </h4>
                  {subjectMap.get(nextExam.subjectId) && (
                    <p className="text-xs font-semibold text-amber-800 mt-0.5">
                      {subjectMap.get(nextExam.subjectId)?.name} ({subjectMap.get(nextExam.subjectId)?.code})
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{nextExam.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{nextExam.location}</span>
                    </div>
                  </div>

                  {nextExam.syllabus && (
                    <div className="mt-2.5 pt-2.5 border-t border-amber-100 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Topics: </span>
                      {nextExam.syllabus}
                    </div>
                  )}

                  {nextExam.weightPercentage && (
                    <div className="mt-2 text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                      Exam Weight: {nextExam.weightPercentage}% of Final Grade
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateTab('calendar')}
                    className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>View Calendar & All Exams</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-500">
                No upcoming exams scheduled. Enjoy your revision!
              </div>
            )}
          </div>

          {/* Quick Subject Overview */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Course Load
                </h4>
              </div>
              <button
                onClick={() => onNavigateTab('courses')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-2">
              {subjects.slice(0, 4).map((subj) => {
                const subTasks = tasks.filter((t) => t.subjectId === subj.id);
                const subPending = subTasks.filter((t) => t.status === 'pending').length;
                const subDone = subTasks.filter((t) => t.status === 'completed').length;
                const subjStyles = getSubjectColorClasses(subj.color);

                return (
                  <div
                    key={subj.id}
                    onClick={() => onNavigateTab('courses')}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-2 h-8 rounded-full ${subjStyles.accentBar}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                          {subj.name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {subj.code} • {subj.schedule || 'Active'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        subPending > 0 ? 'bg-slate-100 text-slate-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {subPending > 0 ? `${subPending} active` : 'All caught up'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
