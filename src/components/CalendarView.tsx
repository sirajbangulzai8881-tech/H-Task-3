import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Flame,
  Award,
  BookOpen,
  MapPin,
  Check
} from 'lucide-react';
import { StudyTask, Subject, Exam } from '../types';
import { 
  formatDateToISO, 
  formatMonthYear, 
  getMonthMatrix, 
  getWeekDays, 
  getTodayDateString,
  formatFriendlyDate
} from '../utils/dateUtils';
import { getPriorityStyles, getSubjectColorClasses } from '../utils/themeUtils';

interface CalendarViewProps {
  tasks: StudyTask[];
  subjects: Subject[];
  exams: Exam[];
  onToggleTask: (taskId: string) => void;
  onOpenTaskModal: (options?: { defaultDate?: string }) => void;
  onEditTask: (task: StudyTask) => void;
}

type CalendarMode = 'month' | 'week';

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  subjects,
  exams,
  onToggleTask,
  onOpenTaskModal,
  onEditTask,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('month');
  const [selectedDateStr, setSelectedDateStr] = useState<string>(getTodayDateString());

  const todayStr = getTodayDateString();
  const subjectMap = useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const handlePrev = () => {
    if (calendarMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    }
  };

  const handleNext = () => {
    if (calendarMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(getTodayDateString());
  };

  // Month and week matrices
  const monthDays = useMemo(() => getMonthMatrix(year, month), [year, month]);
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  // Tasks and exams by date string lookup
  const tasksByDate = useMemo(() => {
    const map = new Map<string, StudyTask[]>();
    tasks.forEach((t) => {
      const list = map.get(t.dueDate) || [];
      list.push(t);
      map.set(t.dueDate, list);
    });
    return map;
  }, [tasks]);

  const examsByDate = useMemo(() => {
    const map = new Map<string, Exam[]>();
    exams.forEach((e) => {
      const list = map.get(e.date) || [];
      list.push(e);
      map.set(e.date, list);
    });
    return map;
  }, [exams]);

  const selectedDateTasks = tasksByDate.get(selectedDateStr) || [];
  const selectedDateExams = examsByDate.get(selectedDateStr) || [];

  const weekDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div id="calendar-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Calendar Header & Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Navigation title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight font-['Space_Grotesk']">
              {calendarMode === 'month'
                ? formatMonthYear(currentDate)
                : `Week of ${formatFriendlyDate(formatDateToISO(weekDays[0]))}`}
            </h2>
            <p className="text-xs text-slate-500">
              {tasks.filter((t) => t.status === 'pending').length} pending deadlines across your calendar
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switch: Month vs Week */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60">
            <button
              onClick={() => setCalendarMode('month')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                calendarMode === 'month'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setCalendarMode('week')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                calendarMode === 'week'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Week
            </button>
          </div>

          {/* Prev, Today, Next */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/80 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200/80 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/80 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Add Task */}
          <button
            onClick={() => onOpenTaskModal({ defaultDate: selectedDateStr })}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Deadline</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar on Left, Selected Date Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid (Col Span 3) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs overflow-hidden">
          {calendarMode === 'month' ? (
            /* Month Matrix */
            <div>
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {weekDayLabels.map((day) => (
                  <div key={day} className="py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {monthDays.map(({ date, isCurrentMonth }, idx) => {
                  const dateStr = formatDateToISO(date);
                  const isToday = dateStr === todayStr;
                  const isSelected = dateStr === selectedDateStr;
                  const dayTasks = tasksByDate.get(dateStr) || [];
                  const dayExams = examsByDate.get(dateStr) || [];

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDateStr(dateStr)}
                      className={`min-h-[85px] sm:min-h-[105px] p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-200 shadow-xs'
                          : isToday
                          ? 'border-blue-300 bg-blue-50/30'
                          : isCurrentMonth
                          ? 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
                          : 'border-transparent bg-slate-50/40 text-slate-300'
                      }`}
                    >
                      {/* Cell Header */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                            isToday
                              ? 'bg-blue-600 text-white font-extrabold shadow-xs'
                              : isSelected
                              ? 'bg-slate-900 text-white'
                              : isCurrentMonth
                              ? 'text-slate-800'
                              : 'text-slate-300'
                          }`}
                        >
                          {date.getDate()}
                        </span>

                        {dayExams.length > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 border border-amber-300 rounded shadow-2xs">
                            EXAM
                          </span>
                        )}
                      </div>

                      {/* Task chips list inside cell */}
                      <div className="space-y-1 my-1 flex-1 overflow-hidden">
                        {dayExams.map((exam) => (
                          <div
                            key={exam.id}
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 truncate"
                            title={exam.title}
                          >
                            📝 {exam.title}
                          </div>
                        ))}

                        {dayTasks.slice(0, 2).map((task) => {
                          const priorityStyles = getPriorityStyles(task.priority);
                          const subject = subjectMap.get(task.subjectId);
                          const isDone = task.status === 'completed';

                          return (
                            <div
                              key={task.id}
                              className={`text-[10px] font-medium px-1.5 py-0.5 rounded truncate flex items-center gap-1 border ${
                                isDone
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                                  : `${priorityStyles.badgeClass}`
                              }`}
                              title={`${task.title} - ${subject?.name || ''}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isDone ? 'bg-slate-300' : priorityStyles.dotClass}`} />
                              <span className="truncate">{task.title}</span>
                            </div>
                          );
                        })}

                        {dayTasks.length > 2 && (
                          <div className="text-[10px] font-semibold text-slate-500 pl-1">
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Week View */
            <div className="space-y-3">
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((date, idx) => {
                  const dateStr = formatDateToISO(date);
                  const isToday = dateStr === todayStr;
                  const isSelected = dateStr === selectedDateStr;
                  const dayTasks = tasksByDate.get(dateStr) || [];
                  const dayExams = examsByDate.get(dateStr) || [];

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDateStr(dateStr)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-200'
                          : isToday
                          ? 'border-blue-300 bg-blue-50/40 text-blue-800'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <span className="text-[11px] uppercase font-bold text-slate-400">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className={`text-base font-extrabold mt-1 w-8 h-8 rounded-full flex items-center justify-center ${
                        isToday ? 'bg-blue-600 text-white' : ''
                      }`}>
                        {date.getDate()}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 mt-1">
                        {dayTasks.length} tasks
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Detailed hour/task breakdown for week view */}
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Schedule on {formatFriendlyDate(selectedDateStr)}
                </h4>
                {selectedDateTasks.length === 0 && selectedDateExams.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3">No tasks or exams scheduled on this day.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedDateExams.map((exam) => (
                      <div key={exam.id} className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-amber-800 uppercase px-1.5 py-0.5 bg-amber-200/60 rounded mr-2">Exam</span>
                          <span className="text-xs font-bold text-slate-900">{exam.title}</span>
                          <p className="text-[11px] text-slate-500 mt-0.5">{exam.time} • {exam.location}</p>
                        </div>
                      </div>
                    ))}
                    {selectedDateTasks.map((task) => (
                      <div key={task.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => onToggleTask(task.id)}
                            className={`w-5 h-5 rounded border flex items-center justify-center ${
                              task.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                            }`}
                          >
                            {task.status === 'completed' && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                          <div>
                            <span className={`text-xs font-bold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {task.title}
                            </span>
                            <p className="text-[11px] text-slate-500">Due {task.dueTime || 'End of day'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Selected Date Detail Panel (Col Span 1) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Day Overview
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {formatFriendlyDate(selectedDateStr)}
                </h3>
              </div>
              <button
                onClick={() => onOpenTaskModal({ defaultDate: selectedDateStr })}
                className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                title="Add task for this date"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Exams on selected date */}
            {selectedDateExams.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  Scheduled Exams
                </div>
                {selectedDateExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs"
                  >
                    <h5 className="font-bold text-slate-900">{exam.title}</h5>
                    <div className="text-[11px] text-amber-800 mt-1 space-y-0.5">
                      <div>🕒 {exam.time}</div>
                      <div>📍 {exam.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tasks on selected date */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Tasks ({selectedDateTasks.length})</span>
                <span>{selectedDateTasks.filter((t) => t.status === 'completed').length} Done</span>
              </div>

              {selectedDateTasks.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No tasks due on this date.
                </div>
              ) : (
                selectedDateTasks.map((task) => {
                  const isDone = task.status === 'completed';
                  const priorityStyles = getPriorityStyles(task.priority);
                  const subject = subjectMap.get(task.subjectId);

                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-xl border transition-all text-xs ${
                        isDone
                          ? 'bg-slate-50/60 border-slate-200 text-slate-400'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => onToggleTask(task.id)}
                          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                            isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p
                            onClick={() => onEditTask(task)}
                            className={`font-bold cursor-pointer truncate ${
                              isDone ? 'line-through text-slate-400' : 'text-slate-800'
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[10px]">
                            {subject && <span className="font-semibold text-slate-500">{subject.code}</span>}
                            <span className={`font-bold ${priorityStyles.textClass}`}>
                              {task.priority.toUpperCase()}
                            </span>
                            {task.dueTime && <span>{task.dueTime}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => onOpenTaskModal({ defaultDate: selectedDateStr })}
              className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 text-xs font-semibold text-slate-600 hover:text-blue-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task for {formatFriendlyDate(selectedDateStr)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
