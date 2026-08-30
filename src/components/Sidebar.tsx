import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BookOpen, 
  CalendarDays, 
  GraduationCap, 
  Sparkles,
  Smartphone,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { ViewTab } from '../types';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  pendingTasksCount: number;
  highPriorityCount: number;
  upcomingExamsCount: number;
  mobilePreviewOpen: boolean;
  onToggleMobilePreview: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingTasksCount,
  highPriorityCount,
  upcomingExamsCount,
  mobilePreviewOpen,
  onToggleMobilePreview,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ViewTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: highPriorityCount > 0 ? `${highPriorityCount} urgent` : undefined,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      id: 'tasks' as ViewTab,
      label: 'Tasks',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined,
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'courses' as ViewTab,
      label: 'Courses / Subjects',
      icon: BookOpen,
    },
    {
      id: 'calendar' as ViewTab,
      label: 'Calendar & Planner',
      icon: CalendarDays,
      badge: upcomingExamsCount > 0 ? `${upcomingExamsCount} exams` : undefined,
      badgeColor: 'bg-amber-100 text-amber-700',
    },
  ];

  return (
    <aside id="main-sidebar" className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 font-bold">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-base font-['Space_Grotesk']">StudyPulse</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-200/60">Pro</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Student Study Planner</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="px-3 py-4 flex-1 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              id={`nav-btn-${item.id}`}
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform duration-150 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Study Quick Card */}
        <div className="pt-6">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Study Routine
          </div>
          <div className="mx-1 p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-blue-100/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Today's Goal
              </span>
              <span className="text-[11px] font-semibold text-blue-600">3 of 4 Done</span>
            </div>
            <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden mb-2.5">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full w-3/4 transition-all duration-500"></div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Keep the momentum going! Finish your Math Assignment to complete today's targets.
            </p>
          </div>
        </div>
      </div>

      {/* Footer & Side-by-side Mobile Preview Switch */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <button
          id="btn-toggle-mobile-preview"
          onClick={onToggleMobilePreview}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
            mobilePreviewOpen
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title="Toggle side-by-side mobile phone preview"
        >
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-600" />
            <span>Mobile Preview</span>
          </div>
          <span
            className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
              mobilePreviewOpen ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {mobilePreviewOpen ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Student Profile snippet */}
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-700 shrink-0">
            AR
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-800 truncate">Alex Rivera</div>
            <div className="text-[11px] text-slate-500 truncate">Fall Semester 2026</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
