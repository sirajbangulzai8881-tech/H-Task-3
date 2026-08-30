import { Subject, StudyTask, Exam } from '../types';
import { getTodayDateString, getOffsetDateString } from '../utils/dateUtils';

const today = getTodayDateString();
const tomorrow = getOffsetDateString(1);
const in2Days = getOffsetDateString(2);
const in4Days = getOffsetDateString(4);
const in6Days = getOffsetDateString(6);
const in9Days = getOffsetDateString(9);
const in14Days = getOffsetDateString(14);
const yesterday = getOffsetDateString(-1);
const twoDaysAgo = getOffsetDateString(-2);

export const initialSubjects: Subject[] = [
  {
    id: 'subj-math',
    name: 'Advanced Calculus',
    code: 'MATH 201',
    color: 'blue',
    iconName: 'Calculator',
    teacher: 'Dr. Evelyn Martinez',
    room: 'Hall 302',
    schedule: 'Mon, Wed 10:00 AM',
    targetGrade: 'A'
  },
  {
    id: 'subj-history',
    name: 'Modern World History',
    code: 'HIST 110',
    color: 'amber',
    iconName: 'BookOpen',
    teacher: 'Prof. David Hayes',
    room: 'Room 104',
    schedule: 'Tue, Thu 1:30 PM',
    targetGrade: 'A-'
  },
  {
    id: 'subj-physics',
    name: 'Quantum Physics',
    code: 'PHYS 305',
    color: 'indigo',
    iconName: 'Atom',
    teacher: 'Dr. Sarah Jenkins',
    room: 'Science Lab B',
    schedule: 'Mon, Wed, Fri 9:00 AM',
    targetGrade: 'A'
  },
  {
    id: 'subj-chemistry',
    name: 'Organic Chemistry',
    code: 'CHEM 220',
    color: 'emerald',
    iconName: 'FlaskConical',
    teacher: 'Dr. Marcus Vance',
    room: 'Chem Annex 12',
    schedule: 'Tue, Fri 11:00 AM',
    targetGrade: 'B+'
  },
  {
    id: 'subj-cs',
    name: 'Data Structures & Algorithms',
    code: 'CS 250',
    color: 'cyan',
    iconName: 'Code',
    teacher: 'Prof. Lisa Chen',
    room: 'Turing Lab 4',
    schedule: 'Mon, Thu 3:00 PM',
    targetGrade: 'A+'
  },
  {
    id: 'subj-lit',
    name: 'World Literature',
    code: 'LIT 105',
    color: 'purple',
    iconName: 'Feather',
    teacher: 'Prof. Arthur Pendelton',
    room: 'Humanities 210',
    schedule: 'Wed, Fri 2:00 PM',
    targetGrade: 'A'
  }
];

export const initialTasks: StudyTask[] = [
  {
    id: 'task-1',
    title: 'Math Assignment 4: Multivariable Integrals',
    subjectId: 'subj-math',
    dueDate: today,
    dueTime: '5:00 PM',
    priority: 'high',
    status: 'pending',
    estimatedMinutes: 90,
    isTodayFocus: true,
    notes: 'Solve problem set exercises 14 through 28 on Stokes theorem and green functions.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'History Quiz Review: Cold War Timeline',
    subjectId: 'subj-history',
    dueDate: today,
    dueTime: '6:30 PM',
    priority: 'high',
    status: 'pending',
    estimatedMinutes: 45,
    isTodayFocus: true,
    notes: 'Urgent: Flashcards on Yalta conference, Berlin blockade, and Cuban missile crisis.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    title: 'Organic Chemistry Lab Report: Ester Synthesis',
    subjectId: 'subj-chemistry',
    dueDate: tomorrow,
    dueTime: '11:59 PM',
    priority: 'medium',
    status: 'pending',
    estimatedMinutes: 75,
    isTodayFocus: true,
    notes: 'Include spectroscopy graphs and reaction yield calculations.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-4',
    title: 'CS Problem Set: Red-Black Tree Balancing',
    subjectId: 'subj-cs',
    dueDate: in2Days,
    dueTime: '4:00 PM',
    priority: 'high',
    status: 'pending',
    estimatedMinutes: 120,
    isTodayFocus: false,
    notes: 'Implement node rotation algorithm in C++ and test edge cases.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-5',
    title: 'Physics Chapter 8: Wave Optics Review',
    subjectId: 'subj-physics',
    dueDate: in4Days,
    dueTime: '2:00 PM',
    priority: 'medium',
    status: 'pending',
    estimatedMinutes: 60,
    isTodayFocus: false,
    notes: 'Double slit interference equations and diffraction grating formulas.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-6',
    title: 'Literature Essay Outline: 1984 & Modern Surveillance',
    subjectId: 'subj-lit',
    dueDate: in6Days,
    dueTime: '11:59 PM',
    priority: 'low',
    status: 'pending',
    estimatedMinutes: 50,
    isTodayFocus: false,
    notes: 'Formulate thesis statement and compile 4 primary textual citations.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-7',
    title: 'Calculus Chapter 6 Reading & Summary',
    subjectId: 'subj-math',
    dueDate: yesterday,
    dueTime: '3:00 PM',
    priority: 'medium',
    status: 'completed',
    completedAt: yesterday,
    estimatedMinutes: 40,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-8',
    title: 'History Reading: Post-WWII Reconstruction',
    subjectId: 'subj-history',
    dueDate: twoDaysAgo,
    dueTime: '8:00 PM',
    priority: 'low',
    status: 'completed',
    completedAt: twoDaysAgo,
    estimatedMinutes: 30,
    createdAt: new Date().toISOString()
  }
];

export const initialExams: Exam[] = [
  {
    id: 'exam-1',
    title: 'Midterm: Multivariable Calculus',
    subjectId: 'subj-math',
    date: in4Days,
    time: '10:00 AM - 12:00 PM',
    location: 'Main Hall 302',
    syllabus: 'Chapters 12 to 15 (Double/Triple Integrals, Vector Fields & Stokes Theorem)',
    weightPercentage: 30
  },
  {
    id: 'exam-2',
    title: 'Quantum Physics Mechanics Exam',
    subjectId: 'subj-physics',
    date: in9Days,
    time: '9:00 AM - 11:30 AM',
    location: 'Science Auditorium B',
    syllabus: 'Wave-particle duality, Schrödinger equation, and infinite potential wells',
    weightPercentage: 25
  },
  {
    id: 'exam-3',
    title: 'World History Midterm Test',
    subjectId: 'subj-history',
    date: in14Days,
    time: '1:30 PM - 3:00 PM',
    location: 'Humanities Room 104',
    syllabus: 'Industrial Revolution through Post-Cold War Global Shift',
    weightPercentage: 20
  }
];
