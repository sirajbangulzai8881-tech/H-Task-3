export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'completed';

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string; // e.g. 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'indigo' | 'cyan'
  iconName: string;
  teacher?: string;
  room?: string;
  schedule?: string;
  targetGrade?: string;
}

export interface StudyTask {
  id: string;
  title: string;
  subjectId: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // e.g. "17:00" or "5:00 PM"
  priority: Priority;
  status: TaskStatus;
  estimatedMinutes?: number;
  notes?: string;
  isTodayFocus?: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  title: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  syllabus?: string;
  weightPercentage?: number;
}

export type ViewTab = 'dashboard' | 'tasks' | 'courses' | 'calendar';
