import React from 'react';
import { 
  BookOpen, 
  Plus, 
  User, 
  MapPin, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2,
  ArrowRight,
  ListTodo
} from 'lucide-react';
import { Subject, StudyTask, Exam } from '../types';
import { getSubjectColorClasses } from '../utils/themeUtils';
import { getDaysRemaining } from '../utils/dateUtils';

interface CoursesViewProps {
  subjects: Subject[];
  tasks: StudyTask[];
  exams: Exam[];
  onOpenCourseModal: (subject?: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
  onOpenTaskModalForSubject: (subjectId: string) => void;
  onNavigateTab: (tab: 'dashboard' | 'tasks' | 'courses' | 'calendar') => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  subjects,
  tasks,
  exams,
  onOpenCourseModal,
  onDeleteSubject,
  onOpenTaskModalForSubject,
  onNavigateTab,
}) => {
  return (
    <div id="courses-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Enrolled Courses & Subjects
          </h2>
          <p className="text-xs text-slate-500">
            Keep track of class schedules, instructors, targets, and assignments per course
          </p>
        </div>

        <button
          onClick={() => onOpenCourseModal()}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/25 flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((subject) => {
          const subjectTasks = tasks.filter((t) => t.subjectId === subject.id);
          const pendingCount = subjectTasks.filter((t) => t.status === 'pending').length;
          const completedCount = subjectTasks.filter((t) => t.status === 'completed').length;
          const totalTasks = subjectTasks.length;
          const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 100;
          const subjectExams = exams.filter((e) => e.subjectId === subject.id);
          const colorStyles = getSubjectColorClasses(subject.color);

          return (
            <div
              key={subject.id}
              id={`course-card-${subject.id}`}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative group"
            >
              {/* Colored top bar */}
              <div className={`h-2.5 w-full ${colorStyles.accentBar}`} />

              <div className="p-5 flex-1 space-y-4">
                {/* Course Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${colorStyles.badge}`}>
                        {subject.code}
                      </span>
                      {subject.targetGrade && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-600" />
                          Target {subject.targetGrade}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-2 tracking-tight group-hover:text-blue-600 transition-colors">
                      {subject.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => onOpenCourseModal(subject)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Course"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {subjects.length > 1 && (
                      <button
                        onClick={() => onDeleteSubject(subject.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Info List */}
                <div className="space-y-2 text-xs text-slate-600">
                  {subject.teacher && (
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{subject.teacher}</span>
                    </div>
                  )}
                  {subject.room && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{subject.room}</span>
                    </div>
                  )}
                  {subject.schedule && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{subject.schedule}</span>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Course Work</span>
                    <span className="font-bold text-slate-900">{completionRate}% Done</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colorStyles.accentBar}`}
                      style={{ width: `${Math.max(completionRate, 4)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{pendingCount} tasks active</span>
                    <span>{completedCount} completed</span>
                  </div>
                </div>

                {/* Exam Notice if any */}
                {subjectExams.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs">
                    <div className="flex items-center justify-between text-amber-900 font-bold mb-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Next Exam:
                      </span>
                      <span>{getDaysRemaining(subjectExams[0].date)}d left</span>
                    </div>
                    <p className="text-[11px] text-amber-800 font-medium truncate">
                      {subjectExams[0].title}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenTaskModalForSubject(subject.id)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Task</span>
                </button>
                <button
                  onClick={() => onNavigateTab('tasks')}
                  className="py-1.5 px-3 rounded-lg text-slate-600 hover:text-blue-600 text-xs font-semibold flex items-center gap-1 hover:bg-slate-100 transition-colors"
                >
                  <span>Tasks</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
