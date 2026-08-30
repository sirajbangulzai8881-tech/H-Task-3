import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Tag, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  Sparkles,
  Flame,
  FileText
} from 'lucide-react';
import { Subject, StudyTask, Priority } from '../types';
import { getTodayDateString } from '../utils/dateUtils';
import { getPriorityStyles, getSubjectColorClasses } from '../utils/themeUtils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: Omit<StudyTask, 'id' | 'createdAt'> & { id?: string }) => void;
  subjects: Subject[];
  initialTask?: StudyTask | null;
  defaultDate?: string;
  defaultSubjectId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  subjects,
  initialTask,
  defaultDate,
  defaultSubjectId,
}) => {
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('17:00');
  const [priority, setPriority] = useState<Priority>('high');
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [isTodayFocus, setIsTodayFocus] = useState(true);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ title?: string; subjectId?: string; dueDate?: string }>({});

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setSubjectId(initialTask.subjectId);
      setDueDate(initialTask.dueDate);
      setDueTime(initialTask.dueTime || '17:00');
      setPriority(initialTask.priority);
      setEstimatedMinutes(initialTask.estimatedMinutes || 60);
      setIsTodayFocus(initialTask.isTodayFocus || false);
      setNotes(initialTask.notes || '');
    } else {
      setTitle('');
      setSubjectId(defaultSubjectId || (subjects.length > 0 ? subjects[0].id : ''));
      setDueDate(defaultDate || getTodayDateString());
      setDueTime('17:00');
      setPriority('high');
      setEstimatedMinutes(60);
      setIsTodayFocus(true);
      setNotes('');
    }
    setErrors({});
  }, [initialTask, isOpen, defaultDate, defaultSubjectId, subjects]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; subjectId?: string; dueDate?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Please enter a task title';
    }
    if (!subjectId) {
      newErrors.subjectId = 'Please choose a subject';
    }
    if (!dueDate) {
      newErrors.dueDate = 'Please select a due date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSaveTask({
      id: initialTask?.id,
      title: title.trim(),
      subjectId,
      dueDate,
      dueTime: dueTime || undefined,
      priority,
      status: initialTask?.status || 'pending',
      estimatedMinutes: Number(estimatedMinutes) || 30,
      isTodayFocus,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const quickTitles = [
    'Math Problem Set',
    'History Essay Draft',
    'Physics Lab Report',
    'Read Chapter Summary',
    'Quiz Preparation',
    'Group Project Slides'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="task-modal-container"
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <p className="text-xs text-slate-500">
                Schedule study goals, assignments, or quiz preps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-left">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-task-title"
              type="text"
              placeholder="e.g., Math Assignment - Due 5 PM"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 bg-white'
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title}</p>
            )}

            {/* Quick Title Chips */}
            {!initialTask && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {quickTitles.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setTitle(q)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    + {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Subject Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Subject / Course <span className="text-rose-500">*</span>
            </label>
            <select
              id="select-task-subject"
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value);
                if (errors.subjectId) setErrors((prev) => ({ ...prev, subjectId: undefined }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.subjectId
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            >
              <option value="" disabled>Select a subject...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
            {errors.subjectId && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.subjectId}</p>
            )}
          </div>

          {/* Due Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: undefined }));
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
              {errors.dueDate && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Due Time (Optional)
              </label>
              <input
                id="input-task-due-time"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Priority Selector (Red = High, Yellow = Medium, Green = Low) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* High Priority - Red */}
              <button
                type="button"
                id="btn-priority-high"
                onClick={() => setPriority('high')}
                className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  priority === 'high'
                    ? 'bg-rose-50 border-rose-400 text-rose-700 ring-2 ring-rose-200 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>High</span>
                </div>
                <span className="text-[10px] font-normal text-rose-600">Urgent / Exams</span>
              </button>

              {/* Medium Priority - Yellow/Amber */}
              <button
                type="button"
                id="btn-priority-medium"
                onClick={() => setPriority('medium')}
                className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  priority === 'medium'
                    ? 'bg-amber-50 border-amber-400 text-amber-800 ring-2 ring-amber-200 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Medium</span>
                </div>
                <span className="text-[10px] font-normal text-amber-700">Assignments</span>
              </button>

              {/* Low Priority - Green */}
              <button
                type="button"
                id="btn-priority-low"
                onClick={() => setPriority('low')}
                className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  priority === 'low'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-200 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Low</span>
                </div>
                <span className="text-[10px] font-normal text-emerald-700">Readings</span>
              </button>
            </div>
          </div>

          {/* Today's Focus & Estimated Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Estimated Study Time
              </label>
              <select
                id="select-task-time"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              >
                <option value={15}>15 mins (Quick review)</option>
                <option value={30}>30 mins (Standard reading)</option>
                <option value={45}>45 mins</option>
                <option value={60}>1 hour (Problem set)</option>
                <option value={90}>1.5 hours (Deep study)</option>
                <option value={120}>2 hours (Major assignment)</option>
                <option value={180}>3 hours (Project/Exam prep)</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 transition-colors w-full mt-5">
                <input
                  id="checkbox-today-focus"
                  type="checkbox"
                  checked={isTodayFocus}
                  onChange={(e) => setIsTodayFocus(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    Today's Focus
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Feature on dashboard front page
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Notes / Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Notes & Requirements (Optional)
            </label>
            <textarea
              id="textarea-task-notes"
              rows={2}
              placeholder="e.g. Chapter 4 questions 1-15, bring scientific calculator..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-save-task"
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
              {initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
