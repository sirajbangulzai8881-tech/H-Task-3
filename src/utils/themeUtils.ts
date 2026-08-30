import { Priority } from '../types';

export function getPriorityStyles(priority: Priority) {
  switch (priority) {
    case 'high':
      return {
        label: 'High Priority',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
        dotClass: 'bg-rose-500',
        textClass: 'text-rose-700',
        borderClass: 'border-rose-200',
        cardBorder: 'border-l-rose-500',
        lightBg: 'bg-rose-50/50',
      };
    case 'medium':
      return {
        label: 'Medium Priority',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
        dotClass: 'bg-amber-500',
        textClass: 'text-amber-700',
        borderClass: 'border-amber-200',
        cardBorder: 'border-l-amber-500',
        lightBg: 'bg-amber-50/50',
      };
    case 'low':
      return {
        label: 'Low Priority',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-700',
        borderClass: 'border-emerald-200',
        cardBorder: 'border-l-emerald-500',
        lightBg: 'bg-emerald-50/50',
      };
  }
}

export function getSubjectColorClasses(color: string) {
  switch (color) {
    case 'blue':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        ring: 'ring-blue-500',
        badge: 'bg-blue-100/70 text-blue-800 border-blue-200',
        accentBar: 'bg-blue-500',
        glow: 'shadow-blue-100',
      };
    case 'emerald':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        ring: 'ring-emerald-500',
        badge: 'bg-emerald-100/70 text-emerald-800 border-emerald-200',
        accentBar: 'bg-emerald-500',
        glow: 'shadow-emerald-100',
      };
    case 'amber':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        ring: 'ring-amber-500',
        badge: 'bg-amber-100/70 text-amber-800 border-amber-200',
        accentBar: 'bg-amber-500',
        glow: 'shadow-amber-100',
      };
    case 'purple':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        ring: 'ring-purple-500',
        badge: 'bg-purple-100/70 text-purple-800 border-purple-200',
        accentBar: 'bg-purple-500',
        glow: 'shadow-purple-100',
      };
    case 'indigo':
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        ring: 'ring-indigo-500',
        badge: 'bg-indigo-100/70 text-indigo-800 border-indigo-200',
        accentBar: 'bg-indigo-500',
        glow: 'shadow-indigo-100',
      };
    case 'cyan':
      return {
        bg: 'bg-cyan-50',
        text: 'text-cyan-700',
        border: 'border-cyan-200',
        ring: 'ring-cyan-500',
        badge: 'bg-cyan-100/70 text-cyan-800 border-cyan-200',
        accentBar: 'bg-cyan-500',
        glow: 'shadow-cyan-100',
      };
    case 'rose':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        ring: 'ring-rose-500',
        badge: 'bg-rose-100/70 text-rose-800 border-rose-200',
        accentBar: 'bg-rose-500',
        glow: 'shadow-rose-100',
      };
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        ring: 'ring-slate-500',
        badge: 'bg-slate-100 text-slate-800 border-slate-200',
        accentBar: 'bg-slate-500',
        glow: 'shadow-slate-100',
      };
  }
}
