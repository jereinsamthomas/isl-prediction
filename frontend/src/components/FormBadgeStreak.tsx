import React from 'react';

interface FormBadgeStreakProps {
  streak: string[];
  size?: 'sm' | 'md' | 'lg';
}

export const FormBadgeStreak: React.FC<FormBadgeStreakProps> = ({ streak = [], size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-6 h-6 text-xs',
    lg: 'w-8 h-8 text-sm font-bold'
  };

  const getBadgeStyle = (result: string) => {
    switch (result) {
      case 'W':
        return 'bg-emerald-500 text-white shadow-emerald-500/30';
      case 'D':
        return 'bg-amber-500 text-slate-900 font-bold shadow-amber-500/30';
      case 'L':
        return 'bg-red-500 text-white shadow-red-500/30';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {streak.map((res, i) => (
        <span
          key={i}
          className={`inline-flex items-center justify-center rounded-full font-semibold shadow-sm transition-transform hover:scale-110 select-none ${sizeClasses[size]} ${getBadgeStyle(res)}`}
          title={`Match ${i + 1}: ${res === 'W' ? 'Win' : res === 'D' ? 'Draw' : 'Loss'}`}
        >
          {res}
        </span>
      ))}
    </div>
  );
};
