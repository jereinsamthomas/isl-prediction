import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  color?: 'emerald' | 'amber' | 'cyan' | 'purple' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'emerald',
}) => {
  const colorStyles = {
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      glow: 'from-emerald-500/10 to-transparent',
      text: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      glow: 'from-amber-500/10 to-transparent',
      text: 'text-amber-400',
      iconBg: 'bg-amber-500/10 text-amber-400',
    },
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      glow: 'from-cyan-500/10 to-transparent',
      text: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10 text-cyan-400',
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      glow: 'from-purple-500/10 to-transparent',
      text: 'text-purple-400',
      iconBg: 'bg-purple-500/10 text-purple-400',
    },
    slate: {
      border: 'border-slate-700/60 hover:border-slate-600',
      glow: 'from-slate-700/10 to-transparent',
      text: 'text-slate-300',
      iconBg: 'bg-slate-800 text-slate-300',
    },
  };

  const style = colorStyles[color];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl glass-panel p-5 border transition-all duration-300 hover:shadow-lg ${style.border}`}
    >
      {/* Subtle Background Glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${style.glow} rounded-bl-full pointer-events-none`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-2 text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`p-2.5 rounded-xl border border-white/5 ${style.iconBg}`}>
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center text-xs text-slate-400">
          <span className="font-medium text-emerald-400">{trend}</span>
        </div>
      )}
    </div>
  );
};
