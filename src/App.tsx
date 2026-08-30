import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TasksView } from './components/TasksView';
import { CoursesView } from './components/CoursesView';
import { CalendarView } from './components/CalendarView';
import { TaskModal } from './components/TaskModal';
import { CourseModal } from './components/CourseModal';
import { MobilePreviewFrame } from './components/MobilePreviewFrame';
import { ViewTab, StudyTask, Subject, Exam } from './types';
import { initialTasks, initialSubjects, initialExams } from './data/initialData';
import { fireSuccessConfetti } from './utils/confetti';
import { getTodayDateString } from './utils/dateUtils';
import { X } from 'lucide-react';

const TASKS_KEY = 'study_planner_tasks_v1';
const SUBJECTS_KEY = 'study_planner_subjects_v1';
const EXAMS_KEY = 'study_planner_exams_v1';

export default function App() {
  // Load stored state or fallback to seed data
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    try {
      const saved = localStorage.getItem(TASKS_KEY);
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(SUBJECTS_KEY);
      return saved ? JSON.parse(saved) : initialSubjects;
    } catch {
      return initialSubjects;
    }
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    try {
      const saved = localStorage.getItem(EXAMS_KEY);
      return saved ? JSON.parse(saved) : initialExams;
    } catch {
      return initialExams;
    }
  });

  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState<boolean>(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);
  const [modalDefaultDate, setModalDefaultDate] = useState<string | undefined>(undefined);
  const [modalDefaultSubjectId, setModalDefaultSubjectId] = useState<string | undefined>(undefined);

  const [isCourseModalOpen, setIsCourseModalOpen] = useState<boolean>(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to persist tasks', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
    } catch (e) {
      console.error('Failed to persist subjects', e);
    }
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
    } catch (e) {
      console.error('Failed to persist exams', e);
    }
  }, [exams]);

  // Task actions
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
          if (nextStatus === 'completed') {
            fireSuccessConfetti();
          }
          return {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'completed' ? getTodayDateString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleSaveTask = (taskData: Omit<StudyTask, 'id' | 'createdAt'> & { id?: string }) => {
    if (taskData.id) {
      // Update existing
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                ...taskData,
              }
            : t
        )
      );
    } else {
      // Add new
      const newTask: StudyTask = {
        id: `task-${Date.now()}`,
        title: taskData.title,
        subjectId: taskData.subjectId,
        dueDate: taskData.dueDate,
        dueTime: taskData.dueTime,
        priority: taskData.priority,
        status: taskData.status || 'pending',
        estimatedMinutes: taskData.estimatedMinutes,
        notes: taskData.notes,
        isTodayFocus: taskData.isTodayFocus,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleOpenTaskModal = (options?: { defaultDate?: string; defaultSubjectId?: string; isFocus?: boolean }) => {
    setEditingTask(null);
    setModalDefaultDate(options?.defaultDate);
    setModalDefaultSubjectId(options?.defaultSubjectId);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: StudyTask) => {
    setEditingTask(task);
    setModalDefaultDate(task.dueDate);
    setModalDefaultSubjectId(task.subjectId);
    setIsTaskModalOpen(true);
  };

  // Subject actions
  const handleSaveSubject = (subjectData: Subject) => {
    setSubjects((prev) => {
      const exists = prev.some((s) => s.id === subjectData.id);
      if (exists) {
        return prev.map((s) => (s.id === subjectData.id ? subjectData : s));
      }
      return [...prev, subjectData];
    });
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  const handleOpenCourseModal = (subject?: Subject) => {
    setEditingSubject(subject || null);
    setIsCourseModalOpen(true);
  };

  // Urgent and high priority counters
  const pendingTasksCount = tasks.filter((t) => t.status === 'pending').length;
  const highPriorityCount = tasks.filter((t) => t.status === 'pending' && t.priority === 'high').length;
  const urgentTasks = tasks.filter((t) => t.status === 'pending' && t.priority === 'high');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Mobile Drawer Navigation Backdrop */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            className="w-64 bg-white h-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                setMobileDrawerOpen(false);
              }}
              pendingTasksCount={pendingTasksCount}
              highPriorityCount={highPriorityCount}
              upcomingExamsCount={exams.length}
              mobilePreviewOpen={mobilePreviewOpen}
              onToggleMobilePreview={() => setMobilePreviewOpen(!mobilePreviewOpen)}
            />
          </div>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex flex-1">
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden md:block">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            pendingTasksCount={pendingTasksCount}
            highPriorityCount={highPriorityCount}
            upcomingExamsCount={exams.length}
            mobilePreviewOpen={mobilePreviewOpen}
            onToggleMobilePreview={() => setMobilePreviewOpen(!mobilePreviewOpen)}
          />
        </div>

        {/* Central Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            onOpenTaskModal={() => handleOpenTaskModal()}
            urgentTasks={urgentTasks}
            upcomingExams={exams}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenMobileMenu={() => setMobileDrawerOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <div className="flex items-start gap-8">
              {/* Active Tab View */}
              <div className="flex-1 min-w-0">
                {currentTab === 'dashboard' && (
                  <DashboardView
                    tasks={tasks}
                    subjects={subjects}
                    exams={exams}
                    onToggleTask={handleToggleTask}
                    onOpenTaskModal={handleOpenTaskModal}
                    onNavigateTab={setCurrentTab}
                    onEditTask={handleEditTask}
                  />
                )}

                {currentTab === 'tasks' && (
                  <TasksView
                    tasks={tasks}
                    subjects={subjects}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onEditTask={handleEditTask}
                    onOpenTaskModal={handleOpenTaskModal}
                  />
                )}

                {currentTab === 'courses' && (
                  <CoursesView
                    subjects={subjects}
                    tasks={tasks}
                    exams={exams}
                    onOpenCourseModal={handleOpenCourseModal}
                    onDeleteSubject={handleDeleteSubject}
                    onOpenTaskModalForSubject={(subjectId) =>
                      handleOpenTaskModal({ defaultSubjectId: subjectId })
                    }
                    onNavigateTab={setCurrentTab}
                  />
                )}

                {currentTab === 'calendar' && (
                  <CalendarView
                    tasks={tasks}
                    subjects={subjects}
                    exams={exams}
                    onToggleTask={handleToggleTask}
                    onOpenTaskModal={handleOpenTaskModal}
                    onEditTask={handleEditTask}
                  />
                )}
              </div>

              {/* Side-by-Side Mobile Frame (Desktop-first with interactive mobile preview) */}
              {mobilePreviewOpen && (
                <MobilePreviewFrame
                  tasks={tasks}
                  subjects={subjects}
                  exams={exams}
                  onToggleTask={handleToggleTask}
                  onOpenTaskModal={() => handleOpenTaskModal()}
                  onClose={() => setMobilePreviewOpen(false)}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaveTask={handleSaveTask}
        subjects={subjects}
        initialTask={editingTask}
        defaultDate={modalDefaultDate}
        defaultSubjectId={modalDefaultSubjectId}
      />

      {/* Course Creation & Edit Modal */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSaveSubject={handleSaveSubject}
        initialSubject={editingSubject}
      />
    </div>
  );
}
