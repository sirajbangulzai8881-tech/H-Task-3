import React, { useState, useEffect } from 'react';
import { X, BookOpen, User, MapPin, Calendar, Award } from 'lucide-react';
import { Subject } from '../types';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSubject: (subject: Subject) => void;
  initialSubject?: Subject | null;
}

const colorOptions = [
  { id: 'blue', name: 'Sky Blue', bg: 'bg-blue-500' },
  { id: 'emerald', name: 'Mint Green', bg: 'bg-emerald-500' },
  { id: 'amber', name: 'Warm Amber', bg: 'bg-amber-500' },
  { id: 'purple', name: 'Royal Purple', bg: 'bg-purple-500' },
  { id: 'indigo', name: 'Deep Indigo', bg: 'bg-indigo-500' },
  { id: 'cyan', name: 'Cyan Blue', bg: 'bg-cyan-500' },
  { id: 'rose', name: 'Rose Red', bg: 'bg-rose-500' },
];

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onSaveSubject,
  initialSubject,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState('blue');
  const [teacher, setTeacher] = useState('');
  const [room, setRoom] = useState('');
  const [schedule, setSchedule] = useState('');
  const [targetGrade, setTargetGrade] = useState('A');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialSubject) {
      setName(initialSubject.name);
      setCode(initialSubject.code);
      setColor(initialSubject.color || 'blue');
      setTeacher(initialSubject.teacher || '');
      setRoom(initialSubject.room || '');
      setSchedule(initialSubject.schedule || '');
      setTargetGrade(initialSubject.targetGrade || 'A');
    } else {
      setName('');
      setCode('');
      setColor('blue');
      setTeacher('');
      setRoom('');
      setSchedule('');
      setTargetGrade('A');
    }
    setError('');
  }, [initialSubject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a course name');
      return;
    }

    const subId = initialSubject ? initialSubject.id : `subj-${Date.now()}`;
    const generatedCode = code.trim() || name.slice(0, 4).toUpperCase();

    onSaveSubject({
      id: subId,
      name: name.trim(),
      code: generatedCode,
      color,
      iconName: 'BookOpen',
      teacher: teacher.trim() || undefined,
      room: room.trim() || undefined,
      schedule: schedule.trim() || undefined,
      targetGrade: targetGrade || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialSubject ? 'Edit Course' : 'Add New Course'}
              </h3>
              <p className="text-xs text-slate-500">Track classes, lectures & syllabus</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-left">
          {/* Course Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Course Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Cognitive Psychology"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              autoFocus
            />
            {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
          </div>

          {/* Course Code & Target Grade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Course Code
              </label>
              <input
                type="text"
                placeholder="e.g. PSY 201"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-slate-500" />
                Target Grade
              </label>
              <select
                value={targetGrade}
                onChange={(e) => setTargetGrade(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white"
              >
                <option value="A+">A+ (97-100%)</option>
                <option value="A">A (93-96%)</option>
                <option value="A-">A- (90-92%)</option>
                <option value="B+">B+ (87-89%)</option>
                <option value="B">B (83-86%)</option>
              </select>
            </div>
          </div>

          {/* Color Palette Choice */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Color Tag
            </label>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  title={c.name}
                  className={`w-7 h-7 rounded-full ${c.bg} transition-transform ${
                    color === c.id ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Teacher & Room */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Instructor
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Watson"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Room / Link
              </label>
              <input
                type="text"
                placeholder="e.g. Room 402"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Class Schedule
            </label>
            <input
              type="text"
              placeholder="e.g. Mon, Wed 11:00 AM - 12:30 PM"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20"
            >
              {initialSubject ? 'Save Changes' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
